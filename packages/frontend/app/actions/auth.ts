'use server';
import bcrypt from 'bcryptjs';
import { db, eq, getUserByEmail, invites, users } from 'database';
import { redirect } from 'next/navigation';
import * as z from 'zod';

import { deleteSession } from '@/lib/session';
import { deleteTokens, saveAccessTokenToCookies } from '@/lib/tokens';

const registerFormSchema = z.object({
  firstName: z.string().min(2, { message: 'Imię musi mieć co najmniej 2 znaki' }).trim(),
  lastName: z.string().min(2, { message: 'Nazwisko musi mieć co najmniej 2 znaki' }).trim(),
  email: z.string().email('This is not correct email').trim(),
  password: z
    .string()
    .min(8, { message: 'Password must bee at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Contain at least one special character.',
    }),
});

export type FormState = {
  success: boolean;
  errors: {
    firstName?: string[];
    lastName?: string[];
    email?: string[];
    password?: string[];
    other?: string[];
  };
  data?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
  };
};

export async function signup(currentState: FormState, formData: FormData): Promise<FormState> {
  const rawData = {
    firstName: formData.get('firstName')?.toString() ?? '',
    lastName: formData.get('lastName')?.toString() ?? '',
    email: formData.get('email')?.toString() ?? '',
    password: formData.get('password')?.toString() ?? '',
  };

  const validatedFields = registerFormSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      data: rawData,
    };
  }

  const userCheck = await getUserByEmail(rawData.email, db);

  if (userCheck) {
    return {
      success: false,
      errors: { other: ['Uzytkownik juz istnieje'] },
      data: rawData,
    };
  }

  const invitation = await db.query.invites.findFirst({
    where: eq(invites.email, rawData.email),
  });

  if (!invitation) {
    return {
      success: false,
      errors: { other: ['Nie masz zaproszenia do aplikacji'] },
      data: rawData,
    };
  }

  const { email, password, firstName, lastName } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const { user } = await db.transaction(async (tx) => {
    const [user] = await tx
      .insert(users)
      .values({
        email: email,
        password: hashedPassword,
        role: 'USER',
        firstName: firstName,
        lastName: lastName,
        organizationId: invitation.organizationId,
      })
      .returning();

    if (!user) {
      throw new Error('Failed to create user');
    }

    return { user };
  });

  if (!user.organizationId) {
    throw new Error('Failed to create user: missing organizationId');
  }

  await saveAccessTokenToCookies({
    userId: user.id,
    email: user.email,
    role: user.role,
    organizationId: user.organizationId,
  });
  redirect('/');
}

export async function login(currentState: FormState, formData: FormData): Promise<FormState> {
  const rawData = {
    email: formData.get('email')?.toString() ?? '',
    password: formData.get('password')?.toString() ?? '',
  };

  const loginFormSchema = z.object({
    email: z.string().email('This is not correct email').trim(),
    password: z.string().min(1, { message: 'Password is required' }),
  });

  const validatedFields = loginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      data: rawData,
    };
  }
  const { email, password } = validatedFields.data;

  const user = await getUserByEmail(email, db);

  if (!user || !user.password) {
    return {
      success: false,
      errors: { other: ['Nieprawidłowy email lub hasło'] },
      data: rawData,
    };
  }

  const passwordsMatch = await bcrypt.compare(password, user.password);

  if (!passwordsMatch) {
    return {
      success: false,
      errors: { other: ['Nieprawidłowy email lub hasło'] },
      data: rawData,
    };
  }

  if (!user.organizationId) {
    return {
      success: false,
      errors: { other: ['Nieprawidłowy email lub hasło'] },
      data: rawData,
    };
  }

  await saveAccessTokenToCookies({
    userId: user.id,
    email: user.email,
    role: user.role,
    organizationId: user.organizationId,
  });
  redirect('/');
}

export async function logout() {
  await deleteSession();
  await deleteTokens();
  redirect('/login');
}
