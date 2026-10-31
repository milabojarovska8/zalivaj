# Zalivaj

**Zalivaj** je spletna aplikacija za organizacijo varstva sobnih rastlin med študenti in sosedi. Lastnik pred odhodom objavi prošnjo za varstvo, sosedje se nanjo prijavijo, lastnik izbere varuha, sistem pa samodejno ustvari urnik zalivanja. Varuh opravila sproti odkljuka, lastnik spremlja napredek na daljavo in na koncu varuha oceni.

## Tehnologije

| Področje | Tehnologije |
|---|---|
| Frontend | Vue 3, Vite, Vue Router, Pinia, Axios |
| Backend | Node.js, Express, Prisma, Zod, Multer, date-fns |
| Podatkovna baza | PostgreSQL |
| Avtentikacija | JWT (jsonwebtoken), bcrypt (bcryptjs) |
| Lokalni razvoj | Docker Compose, nodemon, Swagger UI, Git |

## Lokalni zagon

### Zahteve

- [Node.js](https://nodejs.org/) 20 ali novejši
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (za podatkovno bazo)

### 1. Podatkovna baza

V korenu projekta zaženite PostgreSQL:

```bash
docker compose up -d db
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env      # Windows (PowerShell): copy .env.example .env
npx prisma migrate dev    # ustvari tabele
npx prisma db seed        # naloži testne podatke
npm run dev               # API na http://localhost:3000, Swagger na http://localhost:3000/api-docs
```

### 3. Frontend

V novem terminalu:

```bash
cd frontend
npm install
npm run dev               # aplikacija na http://localhost:5173
```

### Testni računi

| Vloga | E-pošta | Geslo |
|---|---|---|
| Administrator | `admin@zalivaj.test` | `admin123` |
| Lastnica | `ana@zalivaj.test` | `test123` |
| Varuh | `luka@zalivaj.test` | `test123` |
| Varuh | `marko@zalivaj.test` | `test123` |

## Stanje razvoja (MVP)

- [x] US-01 – Registracija in prijava
- [ ] US-02 – Profili rastlin
- [ ] US-03 – Ustvarjanje prošnje za varstvo
- [ ] US-05 – Prijava na prošnjo
- [ ] US-06 – Izbira varuha
- [ ] US-07 – Samodejni urnik zalivanja
- [ ] US-08 – Nadzorna plošča varuha in odkljukanje opravil

## Dokumentacija

- [01 – Zasnova rešitve](docs/01-zasnova-resitve.md)
- [02 – Funkcionalnosti in obseg](docs/02-funkcionalnosti-in-obseg.md)
- [03 – Podatkovni model](docs/03-podatkovni-model.md)
- [04 – Arhitektura in tehnološki sklad](docs/04-arhitektura-in-tehnoloski-sklad.md)
- [05 – Uporabniške zgodbe](docs/05-uporabniske-zgodbe.md)
- [06 – Wireframes](docs/06-wireframes.md)
- [Arhitekturne odločitve (ADR)](docs/adr/)

## Struktura repozitorija

```
frontend/   Vue aplikacija
backend/    REST API (Node.js + Express + Prisma)
docs/       dokumentacija, wireframes in ADR
```

## Razvojni proces

Projekt sledi GitHub Flow: vsaka sprememba nastane na svoji veji in se v `main` združi prek pull requesta. Naloge so vodene kot GitHub Issues na tabli GitHub Projects.
