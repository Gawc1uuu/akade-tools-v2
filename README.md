# Instrukcja uruchomienia Akade Tools

Ten dokument opisuje krok po kroku, jak uruchomić aplikację **Akade Tools** na własnym komputerze.

## Krok 1: Instalacja niezbędnych narzędzi

Aby aplikacja zadziałała, musisz zainstalować dwa programy.

### 1. Docker Desktop (Baza danych)

Aplikacja potrzebuje miejsca do przechowywania danych. Używamy do tego programu Docker.

1. Pobierz i zainstaluj **Docker Desktop** ze strony: [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)
2. Uruchom program po instalacji.
3. **Ważne:** Upewnij się, że Docker jest włączony (ikona wieloryba na pasku zadań/menu musi być aktywna).

### 2. Bun (Narzędzie do uruchamiania kodu)

To narzędzie, które pozwala "czytać" i uruchamiać kod aplikacji.

**Dla Windows:**

1. Otwórz menu Start, wpisz **PowerShell**, kliknij prawym przyciskiem myszy i wybierz "Uruchom jako administrator".
2. Wklej poniższą komendę i naciśnij Enter:

```powershell
powershell -c "irm bun.sh/install.ps1 | iex"

```

**Dla macOS / Linux:**

1. Otwórz Terminal.
2. Wklej komendę i naciśnij Enter:

```bash
curl -fsSL https://bun.sh/install | bash

```

---

## Krok 2: Konfiguracja (Pliki z hasłami)

Musisz utworzyć dwa pliki konfiguracyjne, aby aplikacja wiedziała, jak połączyć się z bazą danych.

### Plik 1: Konfiguracja bazy danych

1. Otwórz folder projektu w swoim systemie plików.
2. Wejdź do folderu `packages`, a następnie do `database`.
3. Utwórz nowy plik tekstowy i nazwij go dokładnie `.env` (bez końcówki .txt).
4. Otwórz ten plik w notatniku i wklej poniższą treść:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/akade

```

5. Zapisz plik.

### Plik 2: Konfiguracja aplikacji (Frontend)

1. Cofnij się do folderu `packages` i wejdź do folderu `frontend`.
2. Tutaj również utwórz plik o nazwie `.env`.
3. Otwórz go i wklej poniższą treść (możesz zostawić wartości domyślne do testów):

```env
# Hasło do zabezpieczania sesji (może być dowolne)
JWT_SECRET=tajnehaslo1234567890

# Adres bazy danych (musi być taki sam jak w poprzednim pliku)
DATABASE_URL=postgresql://postgres:password@localhost:5432/akade

# Klucz do wysyłania e-maili (opcjonalne, wpisz cokolwiek, jeśli nie masz konta Resend)
RESEND_API_KEY=re_123456789

# Klucz do zadań automatycznych
CRON_SECRET=sekretnyklucz

```

4. Zapisz plik.

---

## Krok 3: Uruchomienie

Teraz wpiszemy kilka komend, aby wszystko zadziałało.

1. Otwórz terminal (konsolę) w **głównym folderze projektu** (tam, gdzie jest plik `package.json`).

- _Wskazówka:_ W folderze projektu kliknij prawym przyciskiem myszy w puste miejsce (z wciśniętym Shift) i wybierz "Otwórz okno PowerShell tutaj" lub wpisz `cmd` w pasku adresu folderu.

2. **Pobierz biblioteki:**
   Wpisz komendę i naciśnij Enter:

```bash
bun install

```

3. **Uruchom bazę danych:**
   Wpisz komendę:

```bash
bun run docker:up

```

_Poczekaj chwilę, aż zobaczysz komunikat o uruchomieniu kontenera._ 4. **Wgraj strukturę bazy danych:**
Musimy utworzyć tabele w pustej bazie. Wpisz kolejno te trzy komendy:

```bash
cd packages/database
bun x drizzle-kit push
cd ../..

```

_Powinieneś zobaczyć zielony komunikat o sukcesie._ 5. **Uruchom aplikację:**
Wpisz ostatnią komendę:

```bash
bun run --filter frontend dev

```

---

## Krok 4: Korzystanie z aplikacji

1. Otwórz przeglądarkę internetową.
2. Wejdź na adres: [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000)
3. Powinieneś zobaczyć ekran logowania.

**Uwaga:** System wymaga zaproszenia, aby założyć konto. Ponieważ baza jest świeża i pusta, nie będziesz mógł się od razu zalogować bez ręcznego dodania danych do bazy przez administratora technicznego.

## Jak wyłączyć?

1. W konsoli, gdzie działa aplikacja, naciśnij klawisze `Ctrl + C`, aby ją zatrzymać.
2. Aby wyłączyć bazę danych w tle, wpisz komendę:

```bash
bun run docker:down

```
