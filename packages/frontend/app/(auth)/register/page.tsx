'use client';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useActionState } from 'react';

import { FormState, signup } from '@/app/actions/auth';
import { ErrorDisplay } from '@/components/error-display';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const initialState: FormState = {
  success: false,
  errors: {},
  data: {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  },
};

const Register = () => {
  const [state, formAction, isPending] = useActionState(signup, initialState);

  return (
    <div className="flex justify-center items-center min-h-screen relative">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/office.jpg')",
        }}
      />
      <div className="absolute inset-0 bg-black/60" />
      <Card className="w-[90%] max-w-md relative z-10">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold text-center">Utwórz konto</CardTitle>
          <CardDescription className="text-center text-gray-600 font-normal">
            Wprowadź wszystkie swoje dane, aby załozyć nowe konto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} id="register-form">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="grid gap-2 w-full">
                  <Label htmlFor="firstName">Imię</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    defaultValue={state?.data?.firstName ?? ''}
                    placeholder="Jan"
                    required
                  />
                  {state.errors.firstName && <ErrorDisplay messages={state.errors.firstName ?? []} />}
                </div>
                <div className="grid gap-2 w-full">
                  <Label htmlFor="lastName">Nazwisko</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    defaultValue={state?.data?.lastName ?? ''}
                    placeholder="Kowalski"
                    required
                  />
                  {state.errors.lastName && <ErrorDisplay messages={state.errors.lastName ?? []} />}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={state?.data?.email ?? ''}
                  placeholder="m@example.com"
                  required
                />
                {state.errors.email && <ErrorDisplay messages={state.errors.email ?? []} />}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Hasło</Label>
                <Input
                  name="password"
                  id="password"
                  type="password"
                  defaultValue={state?.data?.password ?? ''}
                  required
                  placeholder="Wprowadź hasło"
                />
                {state.errors.password && <ErrorDisplay messages={state.errors.password ?? []} />}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <div className="flex flex-col gap-4 w-full">
            <Button type="submit" variant="default" className="w-full" form="register-form">
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Zarejestruj się'}
            </Button>
            {state.errors.other && <ErrorDisplay messages={state.errors.other ?? []} />}
            <div className="text-center text-sm text-gray-600">
              <span>Masz juz konto?</span>{' '}
              <Link
                className="text-red-400 font-medium hover:text-red-500/90 hover:cursor-pointer hover:underline"
                href="/login"
              >
                Zaloguj się
              </Link>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
