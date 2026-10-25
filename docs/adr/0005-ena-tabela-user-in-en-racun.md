# Ena tabela User in en račun za lastnika in varuha

## Kontekst in opis problema

Sistem ima tri vloge: lastnika, varuha in administratorja. Isti študent je včasih odsoten in potrebuje varuha, drugič je doma in je sam varuh. Odločiti se moramo, kako bodo vloge predstavljene v bazi in pri prijavi.

## Obravnavane možnosti

* Ločene tabele in ločeni računi za lastnike, varuhe in administratorje
* Ena tabela User s poljem za vlogo, kjer ima vsak uporabnik eno fiksno vlogo
* Ena tabela User, en račun za lastnika in varuha, administrator označen z vlogo

## Odločitev

Izbrana možnost: "Ena tabela User, en račun za lastnika in varuha, administrator označen z vlogo", ker to ustreza resnični uporabi, saj ista oseba deluje v obeh vlogah. Kaj lahko uporabnik počne s prošnjo, določa lastništvo: ali jo je ustvaril ali je bil sprejet kot njen varuh.

### Posledice

* Dobro, ker uporabnik potrebuje le en račun in eno prijavo.
* Dobro, ker je avtentikacija enaka za vse uporabnike.
* Dobro, ker nova vloga v prihodnosti ne zahteva nove tabele.
* Slabo, ker je treba pravice preverjati glede na lastništvo posamezne prošnje, ne le glede na vlogo.
* Slabo, ker vloga uporabnika ni vidna iz samega računa, kar je treba jasno razložiti v dokumentaciji.
