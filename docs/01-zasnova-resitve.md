# 01 – Zasnova rešitve

## Ime rešitve

**Zalivaj**: spletna aplikacija za organizacijo varstva sobnih rastlin med študenti in sosedi.

## Problem

Veliko študentov živi v študentskih domovih ali skupnih stanovanjih in ima sobne rastline. Pogosto odidejo za več dni: za vikend domov, med počitnicami, v izpitnem obdobju ali na izmenjavo. Takrat rastlin nihče ne zaliva, zato se izsušijo ali propadejo.

Sosedje v istem domu ali bloku bi pogosto radi pomagali. Danes se to dogovarja neformalno prek sporočil in ustnih dogovorov, kar povzroča več težav:

- težko je najti nekoga, ki je na voljo ravno v teh dneh,
- varuh pozabi, kako pogosto in koliko zaliva posamezno rastlino,
- lastnik ne ve, ali so bile rastline res zalite,
- ni nobene evidence o tem, kdo je zanesljiv in kdo ne.

## Namen rešitve

Zalivaj ponuja eno mesto, kjer:

1. lastniki enkrat opišejo svoje rastline in njihove potrebe po negi,
2. pred odhodom objavijo **prošnjo za varstvo** za določeno obdobje,
3. sosedje, ki so na voljo, se prijavijo, lastnik pa izbere enega,
4. sistem **samodejno ustvari urnik zalivanja** (katero rastlino, kateri dan),
5. varuh odkljuka vsako zalivanje, tako da lastnik napredek spremlja na daljavo,
6. lastnik po vrnitvi varuha oceni, s čimer se gradi varuhova **ocena zaupanja**.

Cilj je manj propadlih rastlin, jasne odgovornosti in zaupanje med sosedi.

## Ciljni uporabniki

| Uporabnik | Kdo je | Kaj potrebuje |
|---|---|---|
| **Lastnik rastlin** | Študent ali stanovalec, ki odhaja za nekaj dni | Najti zanesljivo osebo in biti prepričan, da bodo rastline pravilno zalite |
| **Varuh** | Sosed ali študent, ki ostaja doma in želi pomagati (ali zbirati točke zaupanja) | Jasen seznam, kaj in kdaj zaliti, brez ugibanja |
| **Administrator** | Predstavnik doma ali vzdrževalec aplikacije | Varnost skupnosti: odstranjevanje zlonamernih uporabnikov in neprimernih ocen |

Ista oseba je lahko hkrati lastnik in varuh. Ta teden zaliva sosedove rastline, naslednji mesec pa nekoga prosi, naj zaliva njene.

## Scenarij uporabe (primer)

> Ana živi v ŠD Rožna dolina, blok 5. V petek gre za 10 dni domov v Maribor, od 1. do 10. novembra. Ima monstero (zalivanje na 7 dni) in baziliko (na 2 dni).
>
> V ponedeljek odpre Zalivaj in ustvari prošnjo za varstvo za 1.–10. november ter izbere obe rastlini. Prijavita se dva soseda iz istega bloka. Ana vidi, da ima Luka 4 opravljena varstva in povprečno oceno 4,8, zato sprejme njega.
>
> Sistem takoj ustvari Lukov urnik: bazilika 1., 3., 5., 7. in 9. novembra, monstera 1. in 8. novembra. Luka vsak dan odpre svojo nadzorno ploščo, vidi današnja opravila, zalije rastline in klikne **Opravljeno**. 6. novembra Ana iz Maribora preveri stanje in vidi, da so vsa dosedanja opravila opravljena. Ko se vrne, prošnjo zaključi in Luki da 5 zvezdic.

## Kratek opis delovanja

- Zalivaj je **spletna aplikacija** (SPA frontend + REST API backend + relacijska podatkovna baza).
- Uporabniki se **registrirajo in prijavijo**. Vsaka zahteva je vezana na prijavljenega uporabnika, dostop pa se preverja glede na vlogo.
- Lastnik upravlja **rastline** (ime, vrsta, pogostost zalivanja v dneh, količina vode, opombe, fotografija).
- Lastnik ustvari **prošnjo za varstvo** (datum od–do, lokacija, izbrane rastline). Prošnja ima začetni status `OPEN`.
- Varuhi brskajo po odprtih prošnjah in pošljejo **prijavo**.
- Ko lastnik prijavo **sprejme**, prošnja preide v `ACTIVE`, vse ostale prijave so samodejno zavrnjene, backend pa **ustvari opravila zalivanja** za vsako rastlino in datum.
- Varuh opravila označi kot `DONE`. Opravila, katerih datum je minil, niso pa bila opravljena, so prikazana kot **zamujena**.
- Na koncu lastnik prošnjo označi kot `COMPLETED` in odda **oceno**. Ocene se upoštevajo pri varuhovi oceni zaupanja.
- Administrator lahko blokira uporabnike in briše neprimerne ocene.
