# Avtentikacija brez stanja z JWT

## Kontekst in opis problema

Uporabniki se prijavijo z e-pošto in geslom, backend pa mora pri vsaki zahtevi vedeti, kdo jo pošilja in kakšno vlogo ima. Odločiti se moramo, kako bo backend prepoznal prijavljenega uporabnika.

## Obravnavane možnosti

* Seje, shranjene na strežniku, s piškotkom
* Podpisan žeton JWT v glavi Authorization
* Zunanja storitev za prijavo (npr. Firebase Auth)

## Odločitev

Izbrana možnost: "Podpisan žeton JWT v glavi Authorization", ker strežnik ne hrani sej, kar ohranja backend preprost, žeton pa enako deluje za spletnega in prihodnjega mobilnega odjemalca. Zunanje storitve ne potrebujemo.

### Posledice

* Dobro, ker backend ne potrebuje shrambe sej.
* Dobro, ker isti način prijave deluje za splet in mobilno aplikacijo.
* Dobro, ker ni odvisnosti od zunanje storitve.
* Slabo, ker žetona ni mogoče preklicati pred potekom, zato mora imeti kratek čas veljavnosti.
* Slabo, ker je treba blokirane uporabnike dodatno preverjati pri vsaki zahtevi.
* Slabo, ker je treba žeton na frontendu varno hraniti in ga pošiljati pri vsaki zahtevi.
