# 05 – Uporabniške zgodbe

Ta dokument 15 funkcionalnosti rešitve Zalivaj (F1–F15 iz `02-funkcionalnosti-in-obseg.md`) pretvori v uporabniške zgodbe. Vsaka zgodba uporablja eno od treh vlog iz 1. naloge: **lastnik**, **varuh** ali **administrator**. Lastnik in varuh sta dva načina uporabe istega navadnega računa.

Vsaka zgodba upošteva kriterije INVEST. Pokriva eno funkcionalnost, zato jo je mogoče razviti samostojno (Independent), podrobnosti pa se lahko še dogovorijo (Negotiable). Eni vlogi prinaša jasno vrednost (Valuable), je dovolj majhna, da jo je mogoče oceniti in razviti v enem koraku (Estimable, Small), njene pogoje sprejemljivosti pa je mogoče preveriti enega za drugim (Testable).

Funkcionalnosti z oznako **[MVP]** so del prve delujoče različice.

---

### US-01 – Registracija in prijava

- **Funkcionalnost:** F1 – Registracija in prijava **[MVP]**
- **Vloga:** Navaden uporabnik (lastnik ali varuh)
- **Uporabniška zgodba:** Kot študent, ki živi v študentskem domu, želim ustvariti račun in se prijaviti, da lahko sosede prosim za zalivanje svojih rastlin ali jim pomagam z njihovimi.
- **Pogoji sprejemljivosti:**
  1. Obrazec za registracijo zahteva ime, e-pošto, geslo in lokacijo (blok). Če je polje prazno, se račun ne ustvari, manjkajoče polje pa je označeno.
  2. Če je e-pošta že registrirana, sistem prikaže "Ta e-pošta je že v uporabi" in ne ustvari drugega računa.
  3. Geslo je shranjeno le kot zgoščena vrednost bcrypt in ni nikoli vrnjeno v odgovoru API.
  4. S pravilno e-pošto in geslom je uporabnik prijavljen in preusmerjen na "Moje rastline". Ob napačni e-pošti ali geslu se prikaže sporočilo "Napačna e-pošta ali geslo".
  5. Blokiran uporabnik se ne more prijaviti in vidi sporočilo "Vaš račun je blokiran".

### US-02 – Profili rastlin

- **Funkcionalnost:** F2 – Profili rastlin **[MVP]**
- **Vloga:** Lastnik
- **Uporabniška zgodba:** Kot lastnik rastlin želim shraniti svoje rastline skupaj s pogostostjo zalivanja, da mi ni treba ob vsakem odhodu znova razlagati, kako zanje skrbeti.
- **Pogoji sprejemljivosti:**
  1. Lastnik lahko doda rastlino z imenom in pogostostjo zalivanja v dneh (oboje obvezno) ter po želji z vrsto, količino vode v ml, svetlobo, opombami in fotografijo.
  2. Če je pogostost zalivanja prazna, 0 ali ni celo število, se rastlina ne shrani, ob polju pa se prikaže napaka.
  3. "Moje rastline" prikazuje le rastline prijavljenega lastnika, vsako z imenom, fotografijo in "na N dni".
  4. Lastnik lahko ureja in briše svoje rastline. Odpiranje ali spreminjanje rastline drugega uporabnika vrne "403 – ni pravic".

### US-03 – Ustvarjanje prošnje za varstvo

- **Funkcionalnost:** F3 – Ustvarjanje prošnje za varstvo **[MVP]**
- **Vloga:** Lastnik
- **Uporabniška zgodba:** Kot lastnik rastlin želim ustvariti prošnjo za varstvo za dneve, ko me ne bo, da sosedje vedo, katere rastline potrebujejo nego in kdaj.
- **Pogoji sprejemljivosti:**
  1. Lastnik vnese začetni datum, končni datum in lokacijo ter izbere vsaj eno svojo rastlino. Brez izbrane rastline prošnje ni mogoče oddati.
  2. Če je začetni datum v preteklosti ali je končni datum pred začetnim, se prošnja ne shrani, sporočilo pa pojasni napako.
  3. Izbrati je mogoče le lastnikove rastline. Rastline drugih uporabnikov niso ponujene.
  4. Shranjena prošnja dobi status `OPEN` in se prikaže v "Moje prošnje".

### US-04 – Brskanje in filtriranje odprtih prošenj

- **Funkcionalnost:** F4 – Brskanje in filtriranje odprtih prošenj
- **Vloga:** Varuh
- **Uporabniška zgodba:** Kot varuh želim brskati po odprtih prošnjah, filtriranih po lokaciji in datumih, da najdem prošnje, ki jih res lahko prevzamem.
- **Pogoji sprejemljivosti:**
  1. Seznam prikazuje le prošnje s statusom `OPEN`, ki so jih ustvarili drugi uporabniki. Varuhove lastne prošnje se nikoli ne prikažejo.
  2. Vsaka prošnja na seznamu prikazuje lokacijo, datume in število rastlin.
  3. Filtriranje po lokaciji prikaže le prošnje s to lokacijo. Filtriranje po datumih prikaže le prošnje, katerih obdobje se prekriva z izbranimi datumi.
  4. Če nobena prošnja ne ustreza filtrom, se prikaže sporočilo "Nobena odprta prošnja ne ustreza filtrom".

### US-05 – Prijava na prošnjo

- **Funkcionalnost:** F5 – Prijava na prošnjo **[MVP]**
- **Vloga:** Varuh
- **Uporabniška zgodba:** Kot varuh se želim prijaviti na odprto prošnjo s kratkim sporočilom, da lastnik ve, da lahko poskrbim za njegove rastline.
- **Pogoji sprejemljivosti:**
  1. Varuh se lahko prijavi le na prošnje s statusom `OPEN`, ki niso njegove.
  2. Po prijavi ima prijava status `PENDING`, gumb "Prijavi se" pa se spremeni v "Prijavljen".
  3. Druga prijava istega varuha na isto prošnjo je zavrnjena s sporočilom "Na to prošnjo ste se že prijavili".
  4. Varuh lahko prijavo umakne, dokler je `PENDING`. Njen status nato postane `WITHDRAWN`.

### US-06 – Izbira varuha

- **Funkcionalnost:** F6 – Izbira varuha **[MVP]**
- **Vloga:** Lastnik
- **Uporabniška zgodba:** Kot lastnik rastlin želim videti vse prijavitelje z njihovo oceno zaupanja in sprejeti enega od njih, da rastline zaupam zanesljivi osebi.
- **Pogoji sprejemljivosti:**
  1. Pri svoji prošnji s statusom `OPEN` lastnik vidi vse prijave `PENDING` z imenom prijavitelja, sporočilom, povprečno oceno in številom opravljenih varstev.
  2. Ko lastnik klikne "Sprejmi", ta prijava postane `ACCEPTED`, vse ostale prijave na prošnjo postanejo `REJECTED`, prošnja pa postane `ACTIVE`.
  3. Ko je en varuh sprejet, ni mogoče sprejeti nobene druge prijave na isto prošnjo.
  4. Prijavo lahko sprejme le lastnik prošnje. Vsak drug dobi "403 – ni pravic".

### US-07 – Samodejni urnik zalivanja

- **Funkcionalnost:** F7 – Samodejni urnik zalivanja **[MVP]**
- **Vloga:** Varuh
- **Uporabniška zgodba:** Kot sprejeti varuh želim, da se moj urnik zalivanja ustvari samodejno, da natančno vem, katero rastlino moram zaliti kateri dan.
- **Pogoji sprejemljivosti:**
  1. Ko je prijava sprejeta, sistem za vsako rastlino v prošnji ustvari opravila zalivanja: na začetni datum in nato vsakih N dni (N = pogostost zalivanja rastline), vse do vključno končnega datuma.
  2. Pri prošnji od 1. do 10. novembra dobi bazilika z zalivanjem na 2 dni opravila 1., 3., 5., 7. in 9. novembra, monstera z zalivanjem na 7 dni pa opravila 1. in 8. novembra.
  3. Vsa ustvarjena opravila imajo status `PENDING`.
  4. Sprejem varuha, zavrnitev ostalih prijav in ustvarjanje opravil se shranijo skupaj. Če en korak ne uspe, se ne shrani nobena sprememba.

### US-08 – Nadzorna plošča varuha in odkljukanje opravil

- **Funkcionalnost:** F8 – Nadzorna plošča varuha in odkljukanje opravil **[MVP]**
- **Vloga:** Varuh
- **Uporabniška zgodba:** Kot varuh želim videti svoja opravila zalivanja in jih označiti kot opravljena, da ne pozabim nobene rastline in da lastnik vidi, da delo poteka.
- **Pogoji sprejemljivosti:**
  1. Nadzorna plošča prikazuje varuhova opravila v treh skupinah: "Danes", "Prihajajoče" in "Zamujeno".
  2. Vsako opravilo prikazuje ime rastline, fotografijo, količino vode, lastnikove opombe in datum.
  3. Klik na "Opravljeno" spremeni opravilo v `DONE` in shrani čas izvedbe skupaj z neobvezno opombo.
  4. Opravila s prihodnjim datumom ni mogoče označiti kot opravljenega: gumb je onemogočen, API pa zahtevo zavrne.
  5. Opravila prošnje lahko kot opravljena označi le sprejeti varuh te prošnje.

### US-09 – Zaznavanje zamujenih opravil

- **Funkcionalnost:** F9 – Zaznavanje zamujenih opravil
- **Vloga:** Lastnik
- **Uporabniška zgodba:** Kot lastnik rastlin želim, da so zamujena zalivanja jasno označena, da lahko hitro ukrepam, preden se rastlina izsuši.
- **Pogoji sprejemljivosti:**
  1. Opravilo je prikazano kot zamujeno, ko je njegov datum pred današnjim in ima še vedno status `PENDING`.
  2. Zamujena opravila so lastniku in varuhu prikazana rdeče z oznako "Zamujeno".
  3. Opravila z današnjim datumom niso prikazana kot zamujena.
  4. Ko je zamujeno opravilo označeno kot opravljeno, ni več prikazano kot zamujeno.

### US-10 – Pregled napredka za lastnika

- **Funkcionalnost:** F10 – Pregled napredka za lastnika
- **Vloga:** Lastnik
- **Uporabniška zgodba:** Kot lastnik rastlin, ki je odsoten, želim videti napredek varstva, da vem, da so moje rastline zalite, ne da bi moral kontaktirati varuha.
- **Pogoji sprejemljivosti:**
  1. Pri prošnji s statusom `ACTIVE` lastnik vidi vsa njena opravila, razvrščena po datumu, vsako s statusom (opravljeno, čaka ali zamujeno).
  2. Povzetek na vrhu prikazuje napredek, npr. "7 / 9 opravljenih, 1 zamujeno".
  3. Pri vsakem opravljenem opravilu lastnik vidi, kdaj je bilo opravljeno, in varuhovo opombo.
  4. Napredek prošnje lahko vidita le lastnik in sprejeti varuh.

### US-11 – Zaključek varstva in ocena

- **Funkcionalnost:** F11 – Zaključek varstva in ocena
- **Vloga:** Lastnik
- **Uporabniška zgodba:** Kot lastnik rastlin želim zaključiti varstvo in oceniti varuha, da drugi lastniki vidijo, kako zanesljiv je varuh.
- **Pogoji sprejemljivosti:**
  1. Gumb "Zaključi" je na voljo le pri prošnji s statusom `ACTIVE`, katere končni datum je minil.
  2. Po zaključku status prošnje postane `COMPLETED`.
  3. Lastnik lahko da oceno od 1 do 5 in neobvezen komentar. Ocena izven 1–5 ni sprejeta.
  4. Na prošnjo je dovoljena le ena ocena. Ob drugem poskusu se prikaže sporočilo "To varstvo je že ocenjeno".

### US-12 – Ocena zaupanja

- **Funkcionalnost:** F12 – Ocena zaupanja
- **Vloga:** Lastnik
- **Uporabniška zgodba:** Kot lastnik rastlin želim videti oceno zaupanja vsakega varuha, da lahko prijavitelje primerjam, preden izberem enega.
- **Pogoji sprejemljivosti:**
  1. Ocena zaupanja prikazuje povprečno oceno varuha (zaokroženo na eno decimalko) in število opravljenih varstev.
  2. Ocena zaupanja je prikazana na profilu varuha in ob vsaki njegovi prijavi.
  3. Varuh brez ocen je prikazan kot "Nov varuh – še brez ocen".
  4. Ko je shranjena nova ocena, se varuhova ocena zaupanja takoj posodobi.

### US-13 – Pravila preklica

- **Funkcionalnost:** F13 – Pravila preklica
- **Vloga:** Lastnik
- **Uporabniška zgodba:** Kot lastnik rastlin želim preklicati svojo prošnjo pred začetkom, da nihče ne pride zalivat mojih rastlin, ko se moji načrti spremenijo.
- **Pogoji sprejemljivosti:**
  1. Gumb "Prekliči prošnjo" je na voljo le pred začetnim datumom prošnje in le pri statusu `OPEN` ali `ACTIVE`.
  2. Po preklicu status prošnje postane `CANCELLED`.
  3. Vse prijave `PENDING` na prošnjo postanejo `REJECTED`, vsa ustvarjena opravila zalivanja pa se izbrišejo.
  4. Preklicana prošnja se ne prikazuje več na seznamu odprtih prošenj za varuhe.

### US-14 – Upravljanje uporabnikov

- **Funkcionalnost:** F14 – Upravljanje uporabnikov
- **Vloga:** Administrator
- **Uporabniška zgodba:** Kot administrator želim blokirati uporabnike, ki zlorabljajo aplikacijo, da skupnost ostane varna.
- **Pogoji sprejemljivosti:**
  1. Administrator vidi seznam vseh uporabnikov z imenom, e-pošto, lokacijo in statusom (aktiven ali blokiran).
  2. Administrator lahko uporabnika blokira ali odblokira z enim klikom.
  3. Blokiran uporabnik se ne more prijaviti, zahteve z njegovim obstoječim žetonom pa so zavrnjene.
  4. Navadni uporabniki ne morejo odpreti strani za administracijo in dobijo "403 – ni pravic".

### US-15 – Moderiranje ocen in statistika

- **Funkcionalnost:** F15 – Moderiranje ocen in statistika
- **Vloga:** Administrator
- **Uporabniška zgodba:** Kot administrator želim brisati neprimerne ocene in videti osnovno statistiko, da ocene ostanejo poštene in da vem, kako se platforma uporablja.
- **Pogoji sprejemljivosti:**
  1. Administrator lahko izbriše katero koli oceno. Izbrisana ocena se ne prikazuje več in se ne upošteva več pri varuhovi oceni zaupanja.
  2. Stran s statistiko prikazuje število uporabnikov, število varstev `ACTIVE` in število varstev `COMPLETED`.
  3. Ocene lahko briše le administrator. Lastniki in varuhi ne morejo izbrisati nobene ocene, tudi ocen o sebi ne.
