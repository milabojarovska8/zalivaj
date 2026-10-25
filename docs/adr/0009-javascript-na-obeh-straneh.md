# JavaScript na obeh straneh: Vue.js in Node.js

## Kontekst in opis problema

Izbrati moramo programski jezik in ogrodji za frontend in backend. Projekt razvija majhna ekipa z omejenim časom, ki že pozna Vue.js.

## Obravnavane možnosti

* Vue.js na frontendu in Node.js z Express na backendu
* React na frontendu in Node.js z Express na backendu
* Vue.js na frontendu in Python z Djangom na backendu

## Odločitev

Izbrana možnost: "Vue.js na frontendu in Node.js z Express na backendu", ker oba dela uporabljata isti jezik, isti upravitelj paketov (npm) in isti format podatkov (JSON). Ker ekipa Vue.js že pozna, ostane več časa za domensko logiko.

### Posledice

* Dobro, ker je treba znati le en jezik in en nabor orodij.
* Dobro, ker podatki med frontendom in backendom ne potrebujejo pretvorbe.
* Dobro, ker obstoječe znanje Vue.js pospeši razvoj.
* Slabo, ker JavaScript brez TypeScripta lažje dopusti napake s tipi podatkov.
* Slabo, ker Express ne ponuja vgrajene strukture, zato jo moramo določiti sami (glej ADR-0003).
