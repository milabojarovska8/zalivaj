# 02 – Funkcionalnosti in obseg

## Uporabniške vloge

Sistem ima tri vloge. En račun lahko deluje **kot lastnik in kot varuh**: to sta dva načina delovanja navadnega uporabnika. **Administrator** je ločena vloga s posebnimi pravicami.

### 1. Lastnik rastlin (način `OWNER` navadnega uporabnika)

**Lahko:**
- dodaja, ureja in briše **svoje** rastline (ime, vrsta, pogostost zalivanja, količina, opombe, fotografija),
- ustvari prošnjo za varstvo za izbrano obdobje in izbere rastline, ki jih vključuje,
- pregleduje prijave na **svoje** prošnje skupaj z oceno zaupanja prijavitelja,
- sprejme natanko eno prijavo,
- med aktivnim varstvom spremlja napredek opravil zalivanja,
- prekliče svojo prošnjo pred začetkom,
- zaključi končano varstvo in oceni varuha.

**Ne more:**
- videti ali urejati rastlin drugih uporabnikov,
- označevati opravil zalivanja kot opravljenih (to lahko le varuh),
- sprejeti več kot enega varuha za isto prošnjo,
- oceniti varuha pred koncem varstva ali dvakrat oceniti istega varstva,
- blokirati uporabnikov ali brisati ocen.

### 2. Varuh (način `SITTER` navadnega uporabnika)

**Lahko:**
- brska po odprtih prošnjah za varstvo (filtriranje po lokaciji in datumih),
- vidi podrobnosti rastlin in navodila za nego v prošnji,
- se prijavi s kratkim sporočilom in prijavo umakne, dokler še čaka na odgovor,
- po sprejetju vidi svoj urnik zalivanja ("Danes", "Prihajajoče", "Zamujeno"),
- svoja opravila označi kot opravljena, po želji z opombo.

**Ne more:**
- se prijaviti na lastno prošnjo,
- urejati rastlin ali prošenj,
- označevati opravil v varstvu, za katero ni bil sprejet,
- označevati opravil za prihodnje datume,
- spreminjati ali brisati ocen o sebi.

### 3. Administrator (`ADMIN`)

**Lahko:**
- pregleduje seznam vseh uporabnikov ter jih blokira ali odblokira,
- briše neprimerne ocene,
- vidi osnovno statistiko (število uporabnikov, aktivnih in zaključenih varstev).

**Ne more:**
- z administratorskim računom ustvarjati prošenj ali se prijavljati kot navaden uporabnik,
- označevati opravil zalivanja namesto varuhov,
- urejati vsebine rastlin ali prošenj drugih uporabnikov (po potrebi lahko le blokira uporabnika),
- videti gesel uporabnikov (shranjena so le kot zgoščene vrednosti).

---

## Predvidene funkcionalnosti

Legenda: **[MVP]** = del prve delujoče različice; *(domensko)* = domensko specifično, ne le CRUD.

| # | Funkcionalnost | Opis | MVP |
|---|---|---|---|
| F1 | Registracija in prijava | Uporabnik ustvari račun (ime, e-pošta, geslo, lokacija / blok) in se prijavi. Gesla so zgoščena. | **[MVP]** |
| F2 | Profili rastlin | Lastnik upravlja svoje rastline: ime, vrsta, **pogostost zalivanja v dneh**, količina vode, potreba po svetlobi, opombe, fotografija. | **[MVP]** |
| F3 | Ustvarjanje prošnje za varstvo | Lastnik izbere obdobje, lokacijo in eno ali več rastlin. Sistem preveri, da je končni datum za začetnim in da začetni datum ni v preteklosti. Status: `OPEN`. | **[MVP]** |
| F4 | Brskanje in filtriranje odprtih prošenj | Varuh vidi odprte prošnje, ki jih ni ustvaril sam, filtrirane po lokaciji / bloku in datumih. | |
| F5 | Prijava na prošnjo *(domensko)* | Varuh pošlje prijavo s sporočilom. Na isto prošnjo se lahko prijavi le enkrat in lahko umakne prijavo, ki še čaka. | **[MVP]** |
| F6 | Izbira varuha *(domensko)* | Lastnik vidi prijavitelje z njihovo oceno zaupanja in sprejme enega. Prijava postane `ACCEPTED`, vse ostale `REJECTED`, prošnja preide v `ACTIVE`. | **[MVP]** |
| F7 | Samodejni urnik zalivanja *(domensko)* | Ob sprejetju varuha backend ustvari `WateringTask` za vsako rastlino na vsak predviden datum: začetni datum, nato vsakih N dni do končnega datuma. | **[MVP]** |
| F8 | Nadzorna plošča varuha in odkljukanje opravil *(domensko)* | Varuh vidi opravila v skupinah "Danes", "Prihajajoče" in "Zamujeno" in jih označi kot `DONE` z neobvezno opombo. Opravila ni mogoče označiti pred njegovim datumom. | **[MVP]** |
| F9 | Zaznavanje zamujenih opravil *(domensko)* | Opravila, katerih datum je minil in niso opravljena, so prikazana kot zamujena varuhu in lastniku. | |
| F10 | Pregled napredka za lastnika *(domensko)* | Med aktivnim varstvom lastnik vidi časovnico vseh opravil in njihovih statusov, npr. "7 / 9 opravljenih, 1 zamujeno". | |
| F11 | Zaključek varstva in ocena *(domensko)* | Po končnem datumu lastnik prošnjo zaključi (`COMPLETED`) in varuha oceni z 1–5 in komentarjem. Le ena ocena na varstvo. | |
| F12 | Ocena zaupanja *(domensko)* | Vsak varuh ima izračunano oceno: povprečna ocena in število opravljenih varstev. Prikazana je na profilu in pri prijavah. | |
| F13 | Pravila preklica | Lastnik lahko prošnjo prekliče pred začetnim datumom (`CANCELLED`). Čakajoče prijave so zavrnjene, ustvarjena opravila izbrisana. | |
| F14 | Upravljanje uporabnikov | Administrator pregleduje uporabnike ter jih blokira ali odblokira. Blokirani uporabniki se ne morejo prijaviti. | |
| F15 | Moderiranje ocen in statistika | Administrator briše neprimerne ocene in vidi osnovne številke o platformi. | |

**Število MVP funkcionalnosti: 7** (F1, F2, F3, F5, F6, F7, F8). Od tega so **F5, F6, F7 in F8 domensko specifične** (zahtevane so vsaj 3). F1–F3 so osnovni pogoji, brez katerih domenski proces ne more delovati.

### Ključni delovni proces (netrivialen)

Življenjski cikel varstva povezuje več entitet in sprememb statusov:

```
Lastnik ustvari prošnjo ──► OPEN
        │
Varuhi se prijavijo ──► Prijava: PENDING
        │
Lastnik sprejme enega ──► izbrana: ACCEPTED, ostale: REJECTED
        │                  Prošnja: ACTIVE
        │                  Sistem ustvari WateringTask-e
        ▼
Varuh odkljuka opravila ──► Opravilo: PENDING → DONE   (ali prikazano kot ZAMUJENO)
        │
Končni datum mine, lastnik zaključi ──► Prošnja: COMPLETED ──► Ocena ──► posodobljena ocena zaupanja

Kadarkoli pred začetnim datumom: lastnik prekliče ──► Prošnja: CANCELLED
```

**Primer ustvarjanja urnika:** prošnja 1.–10. november, bazilika na 2 dni → opravila 1., 3., 5., 7., 9. nov.; monstera na 7 dni → opravila 1. in 8. nov.

---

## Kasnejše nadgradnje

1. **Opomniki**: e-poštno ali potisno obvestilo varuhu zjutraj na dan opravila in lastniku, ko je opravilo zamujeno.
2. **Fotografski dokaz**: varuh ob odkljukanju naloži fotografijo, lastnik pa jo lahko zahteva.
3. **Knjižnica nege rastlin**: ko lastnik vpiše vrsto (npr. "Monstera deliciosa"), sistem predlaga privzeto pogostost in količino.
4. **Zemljevid bližnjih prošenj**: prikaz odprtih prošenj na zemljevidu in filtriranje po razdalji.
5. **Klepet v aplikaciji** med lastnikom in sprejetim varuhom za predajo ključev in vprašanja.
6. **Ponavljajoče se prošnje**: npr. "vsak vikend", brez ustvarjanja nove prošnje vsakič.
7. **Značke in lestvica**: značke za 10 varstev ali 100 zalivanj ter lestvica po domovih.
8. **Mobilna aplikacija / PWA**: namestljiva aplikacija s seznamom opravil brez povezave.

---

## Izven obsega

Projekt **ne bo** vključeval:

- **plačil** ali kakršnih koli finančnih transakcij med uporabniki,
- **native mobilne aplikacije** (iOS/Android); le odzivno spletno aplikacijo,
- **sledenja varuhov z GPS v realnem času**,
- **IoT integracije** (senzorji vlage v zemlji, pametni sistemi za zalivanje),
- **tržnice rastlin** (nakup, prodaja ali menjava rastlin),
- **diagnosticiranja bolezni** iz fotografij ali druge analize rastlin z umetno inteligenco,
- **upravljanja predaje ključev**; to se lastnik in varuh dogovorita sama,
- varstva **hišnih ljubljenčkov** ali česar koli drugega razen rastlin.
