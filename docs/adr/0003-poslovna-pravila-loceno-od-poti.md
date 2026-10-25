# Poslovna pravila ločeno od poti

## Kontekst in opis problema

Express ne predpisuje strukture projekta. Če pravila pišemo neposredno v funkcije poti (routes), se logika, kot je ustvarjanje urnika zalivanja, pomeša z branjem zahtev in pisanjem odgovorov. Odločiti se moramo, kako razdeliti backend.

## Obravnavane možnosti

* Vsa logika neposredno v poteh
* Razdelitev na poti, storitve (pravila) in dostop do baze (Prisma)

## Odločitev

Izbrana možnost: "Razdelitev na poti, storitve (pravila) in dostop do baze (Prisma)", ker poti tako le preberejo zahtevo in vrnejo odgovor, pravila, npr. `generateSchedule`, pa so v storitvah, ki jih je mogoče preveriti brez zagona strežnika.

### Posledice

* Dobro, ker je pravila mogoče preveriti ločeno, brez zagona strežnika.
* Dobro, ker je ista storitev uporabna v več poteh.
* Dobro, ker nov razvijalec hitro najde, kje je določeno pravilo.
* Slabo, ker je v projektu več datotek in map kot pri preprosti rešitvi.
* Slabo, ker je pri zelo preprostih poteh dodatna plast nekoliko odveč.
