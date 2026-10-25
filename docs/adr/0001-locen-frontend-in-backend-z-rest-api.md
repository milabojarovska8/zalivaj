# Ločen frontend in backend z REST API

## Kontekst in opis problema

Zalivaj potrebuje uporabniški vmesnik za lastnike, varuhe in administratorja ter strežniški del s poslovno logiko in dostopom do baze. Odločiti se moramo, ali bosta ta dva dela ena aplikacija ali dve ločeni, in kako bosta komunicirala. V prihodnosti je načrtovana tudi mobilna oziroma namestljiva aplikacija (PWA).

## Obravnavane možnosti

* Strežniško generirane strani (ena aplikacija, npr. Express s predlogami)
* Ločena enostranska aplikacija (SPA) in backend z REST API
* Ločena SPA in backend z GraphQL API

## Odločitev

Izbrana možnost: "Ločena enostranska aplikacija (SPA) in backend z REST API", ker backend ni odvisen od videza vmesnika, isti API pa lahko kasneje brez sprememb uporabi tudi mobilna aplikacija ali PWA. REST je preprostejši od GraphQL in zadošča za naše vire (rastline, prošnje, prijave, opravila).

### Posledice

* Dobro, ker je frontend in backend mogoče razvijati in testirati ločeno.
* Dobro, ker lahko isti API uporabijo različni odjemalci (splet, mobilna aplikacija).
* Dobro, ker so končne točke REST preproste in jih je mogoče pregledati v Swagger UI.
* Slabo, ker je treba vzdrževati dva projekta in dogovor o obliki podatkov (JSON) med njima.
* Slabo, ker je treba urediti CORS in pošiljanje žetona JWT pri vsaki zahtevi.
* Slabo, ker pri nekaterih pogledih frontend potrebuje več zahtev hkrati.
