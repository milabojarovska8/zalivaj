# Opravila zalivanja se ustvarijo in shranijo ob sprejemu varuha

## Kontekst in opis problema

Varuh mora vedeti, katero rastlino zaliti kateri dan, in vsako zalivanje odkljukati. Odločiti se moramo, ali se urnik vsakič izračuna sproti ali se opravila shranijo v bazo, in kdaj.

## Obravnavane možnosti

* Urnik se izračuna sproti ob vsakem prikazu
* Opravila se ustvarijo in shranijo ob sprejemu varuha, v eni transakciji

## Odločitev

Izbrana možnost: "Opravila se ustvarijo in shranijo ob sprejemu varuha, v eni transakciji", ker vsako opravilo potrebuje svoje stanje (opravljeno ali ne, kdaj, opomba), zato mora biti vrstica v bazi. Sprejem varuha, zavrnitev ostalih prijav in ustvarjanje opravil se zgodijo v eni transakciji, zato podatki nikoli niso napol spremenjeni.

### Posledice

* Dobro, ker ima vsako opravilo svoje stanje, čas izvedbe in opombo.
* Dobro, ker lastnik in varuh vidita isti urnik.
* Dobro, ker se ob napaki ne shrani nobena sprememba, zato ni prošenj brez opravil.
* Slabo, ker se urnik ne posodobi samodejno, če lastnik med varstvom spremeni pogostost zalivanja rastline.
* Slabo, ker baza vsebuje več vrstic, saj je vsako zalivanje svoja vrstica.
