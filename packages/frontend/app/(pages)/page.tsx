import { and, cars, count, db, eq, gte, lte, or, users } from 'database';
import { AlertTriangle, Car as CarIcon, ChevronRight, FileText, Users } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getSession } from '@/lib/session';

async function getDashboardStats(organizationId: string) {
  const today = new Date();
  const nextMonth = new Date();
  nextMonth.setDate(today.getDate() + 30);

  const [carsCountRes, staffCountRes, expiringDocsRes] = await Promise.all([
    db.select({ value: count() }).from(cars).where(eq(cars.organizationId, organizationId)),

    db.select({ value: count() }).from(users).where(eq(users.organizationId, organizationId)),

    db
      .select({ value: count() })
      .from(cars)
      .where(
        and(
          eq(cars.organizationId, organizationId),
          or(
            and(gte(cars.insuranceEndDate, today), lte(cars.insuranceEndDate, nextMonth)),
            and(gte(cars.inspectionEndDate, today), lte(cars.inspectionEndDate, nextMonth)),
          ),
        ),
      ),
  ]);

  return {
    carsCount: carsCountRes[0]?.value ?? 0,
    staffCount: staffCountRes[0]?.value ?? 0,
    expiringDocsCount: expiringDocsRes[0]?.value ?? 0,
  };
}

const MainPage = async () => {
  const session = await getSession();

  if (!session || !session.organizationId) {
    redirect('/login');
  }

  const stats = await getDashboardStats(session.organizationId);

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      {/* Nagłówek */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Panel Główny</h2>
          <p className="text-muted-foreground">Witaj w systemie zarządzania flotą Akade Tools.</p>
        </div>
      </div>

      {/* Karty Statystyk */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Całkowita flota</CardTitle>
            <CarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.carsCount}</div>
            <p className="text-xs text-muted-foreground">Zarejestrowanych pojazdów</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pracownicy</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.staffCount}</div>
            <p className="text-xs text-muted-foreground">Aktywnych użytkowników</p>
          </CardContent>
        </Card>

        <Card className={stats.expiringDocsCount > 0 ? 'border-amber-500/50 bg-amber-500/10' : ''}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wygasające dokumenty</CardTitle>
            <AlertTriangle
              className={`h-4 w-4 ${stats.expiringDocsCount > 0 ? 'text-amber-600' : 'text-muted-foreground'}`}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.expiringDocsCount}</div>
            <p className="text-xs text-muted-foreground">W ciągu najbliższych 30 dni</p>
          </CardContent>
        </Card>
      </div>

      {/* Sekcja Szybkich Akcji / Nawigacji */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Szybkie akcje</CardTitle>
            <CardDescription>Przejdź do najważniejszych sekcji systemu.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Link href="/cars" className="block group">
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <CarIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Zarządzaj Pojazdami</p>
                    <p className="text-sm text-muted-foreground">Dodaj lub edytuj flotę</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Link>

            <Link href="/invoices" className="block group">
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Generator Faktur</p>
                    <p className="text-sm text-muted-foreground">Wystaw nową fakturę</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Link>

            <Link href="/staff" className="block group">
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Zespół</p>
                    <p className="text-sm text-muted-foreground">Zarządzaj dostępem</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Link>
          </CardContent>
        </Card>

        {/* Placeholder na przyszłe funkcje, np. ostatnie aktywności */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Status systemu</CardTitle>
            <CardDescription>Informacje o Twojej organizacji</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2" />
                <span className="text-sm font-medium">Baza danych połączona</span>
              </div>
              <div className="flex items-center">
                <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2" />
                <span className="text-sm font-medium">System powiadomień aktywny</span>
              </div>
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Zalogowany jako: <span className="font-semibold text-foreground">{session.email}</span>
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Rola: <span className="font-semibold text-foreground">{session.role}</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MainPage;
