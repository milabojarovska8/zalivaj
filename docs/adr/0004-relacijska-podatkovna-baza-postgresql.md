# Relacijska podatkovna baza PostgreSQL

## Kontekst in opis problema

Podatki v Zalivaj so močno povezani: uporabnik ima rastline, prošnja vsebuje rastline, na prošnjo se prijavijo varuhi, prošnja ima opravila in oceno. Hkrati moramo zagotoviti pravila, kot je "varuh se na isto prošnjo prijavi le enkrat". Izbrati moramo vrsto podatkovne baze.

## Obravnavane možnosti

* Dokumentna baza (npr. MongoDB)
* Relacijska baza PostgreSQL
* Relacijska baza SQLite

## Odločitev

Izbrana možnost: "Relacijska baza PostgreSQL", ker povezave med podatki je mogoče naravno zapisati s tujimi ključi, pravila pa z omejitvami unique in check. PostgreSQL za razliko od SQLite dobro podpira hkratne zahteve več uporabnikov in transakcije.

### Posledice

* Dobro, ker tuji ključi in omejitve ščitijo konsistentnost podatkov v sami bazi.
* Dobro, ker so poizvedbe po povezanih podatkih (npr. opravila prošnje z rastlinami) preproste.
* Dobro, ker transakcije omogočajo, da se več sprememb shrani skupaj ali nobena.
* Slabo, ker je spreminjanje sheme potrebno izvajati z migracijami.
* Slabo, ker je za lokalni razvoj potreben Docker ali nameščen PostgreSQL.
