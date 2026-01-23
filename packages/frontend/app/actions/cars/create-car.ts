'use server';
import { cars, db } from 'database';
import { parse } from 'date-fns';
import { pl } from 'date-fns/locale';
import * as z from 'zod';

import { getToken, verifyToken } from '@/lib/tokens';

export type CreateCarState = {
  success: boolean;
  errors: {
    make?: string[];
    model?: string[];
    registrationNumber?: string[];
    insuranceEndDate?: string[];
    inspectionEndDate?: string[];
    other?: string[];
  };
  data?: {
    make?: string;
    model?: string;
    registrationNumber?: string;
    insuranceEndDate?: string;
    inspectionEndDate?: string;
  };
};

const createCarSchema = z.object({
  make: z.string().min(1, { message: 'Marka jest wymagana' }),
  model: z.string().min(1, { message: 'Model jest wymagany' }),
  registrationNumber: z.string().min(1, { message: 'Numer rejestracyjny jest wymagany' }),
  insuranceEndDate: z.string().min(1, { message: 'Data końca ubezpieczenia jest wymagana' }),
  inspectionEndDate: z.string().min(1, { message: 'Data końca przeglądu jest wymagana' }),
});

export async function createCar(currentState: CreateCarState, formData: FormData): Promise<CreateCarState> {
  const token = await getToken();
  const decodedToken = await verifyToken(token);

  if (!decodedToken) {
    return {
      success: false,
      errors: {
        other: ['Nieprawidłowy token'],
        make: [],
        model: [],
        registrationNumber: [],
        insuranceEndDate: [],
        inspectionEndDate: [],
      },
      data: currentState.data,
    };
  }

  const parsed = createCarSchema.safeParse({
    make: formData.get('make'),
    model: formData.get('model'),
    registrationNumber: formData.get('registrationNumber'),
    insuranceEndDate: formData.get('insuranceEndDate'),
    inspectionEndDate: formData.get('inspectionEndDate'),
  });

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
      data: currentState.data,
    };
  }

  const insuranceEndDate = parse(parsed.data.insuranceEndDate, 'dd MMMM yyyy', new Date(), {
    locale: pl,
  });

  const inspectionEndDate = parse(parsed.data.inspectionEndDate, 'dd MMMM yyyy', new Date(), {
    locale: pl,
  });

  if (insuranceEndDate < new Date() || inspectionEndDate < new Date()) {
    return {
      success: false,
      errors: {
        insuranceEndDate: insuranceEndDate < new Date() ? ['Data końca ubezpieczenia nie może być z przeszłości'] : [],
        inspectionEndDate: inspectionEndDate < new Date() ? ['Data końca przeglądu nie może być z przeszłości'] : [],
      },
    };
  }

  const newCar: typeof cars.$inferInsert = {
    make: parsed.data.make,
    model: parsed.data.model,
    registrationNumber: parsed.data.registrationNumber,
    insuranceEndDate: insuranceEndDate,
    inspectionEndDate: inspectionEndDate,
    organizationId: decodedToken.organizationId as string,
    createdBy: decodedToken.userId as string,
  };

  await db.insert(cars).values(newCar);

  return {
    success: true,
    errors: {},
    data: {},
  };
}
