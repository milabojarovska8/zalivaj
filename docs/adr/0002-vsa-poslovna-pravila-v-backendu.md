# Vsa poslovna pravila v backendu

## Kontekst in opis problema

Zalivaj ima pomembna pravila, npr. "sprejet je lahko le en varuh", "opravila ni mogoče odkljukati pred njegovim datumom" in "varstvo je mogoče oceniti le enkrat". Odločiti se moramo, kje se ta pravila preverjajo.

## Obravnavane možnosti

* Pravila samo v frontendu
* Pravila v frontendu in backendu (podvojena)
* Pravila samo v backendu, frontend le skrije nedovoljena dejanja

## Odločitev

Izbrana možnost: "Pravila samo v backendu, frontend le skrije nedovoljena dejanja", ker uporabnik lahko frontend spremeni ali API kliče neposredno, zato je varno le preverjanje na strežniku. Če so pravila na enem mestu, se ne morejo razhajati.

### Posledice

* Dobro, ker uporabnik pravil ne more zaobiti s spreminjanjem frontenda ali neposrednim klicem API.
* Dobro, ker je vsako pravilo zapisano le enkrat, zato ga je lažje spremeniti.
* Dobro, ker frontend ostane preprost, saj vsebuje le prikaz in osnovno preverjanje obrazcev.
* Slabo, ker uporabnik izve za napako šele po odgovoru strežnika, ne takoj ob vnosu.
* Slabo, ker mora backend za vsako kršitev vrniti jasno sporočilo in ustrezno HTTP kodo.
