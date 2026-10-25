# Zamujena opravila in ocena zaupanja se izračunajo, ne shranjujejo

## Kontekst in opis problema

Sistem prikazuje zamujena opravila in oceno zaupanja varuha. Ali je opravilo zamujeno, je odvisno od današnjega datuma, ocena zaupanja pa od vseh ocen varuha. Odločiti se moramo, ali te vrednosti shranjujemo v bazo ali jih izračunamo ob zahtevi.

## Obravnavane možnosti

* Shranjevanje vrednosti v bazo in posodabljanje z opravilom v ozadju
* Izračun ob vsaki zahtevi

## Odločitev

Izbrana možnost: "Izračun ob vsaki zahtevi", ker vrednosti se tako ne morejo razhajati s podatki, iz katerih izhajajo, in ne potrebujemo opravila v ozadju, ki bi jih vsako noč posodabljalo.

### Posledice

* Dobro, ker sta zamujenost in ocena zaupanja vedno pravilni.
* Dobro, ker ni potrebe po opravilu v ozadju (cron).
* Dobro, ker se izbris ocene takoj pozna pri oceni zaupanja.
* Slabo, ker se vrednosti računajo pri vsaki zahtevi, kar bi bilo pri zelo veliki količini podatkov počasneje.
* Slabo, ker teh vrednosti ni mogoče neposredno filtrirati kot navadno polje v bazi.
