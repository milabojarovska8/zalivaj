# Zalivaj

**Zalivaj** je spletna aplikacija za organizacijo varstva sobnih rastlin med študenti in sosedi. Lastnik pred odhodom objavi prošnjo za varstvo, sosedje se nanjo prijavijo, lastnik izbere varuha, sistem pa samodejno ustvari urnik zalivanja. Varuh opravila sproti odkljuka, lastnik spremlja napredek na daljavo in na koncu varuha oceni.

## Tehnologije

| Področje | Tehnologije |
|---|---|
| Frontend | Vue 3, Vite, Vue Router, Pinia, Axios |
| Backend | Node.js, Express, Prisma |
| Podatkovna baza | PostgreSQL |
| Avtentikacija | JWT (jsonwebtoken), bcrypt |
| Lokalni razvoj | Docker Compose, Swagger UI, Git |

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
backend/    REST API (Node.js + Express)
docs/       dokumentacija, wireframes in ADR
```
