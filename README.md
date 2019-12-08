# naturvern-lastejobb

[![Open Source Love](https://badges.frapsoft.com/os/v2/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md#pull-requests)

Laster [åpne data om Norske naturvernområder](https://github.com/Artsdatabanken/naturvern).

## Komponenter og dataflyt

### Dataflyt

[![Dataflyt](./doc/dataflyt.png)](https://artsdatabanken.github.io/naturvern-lastejobb/)

### Tegnforklaring

| Symbol                                                                                                   | Forklaring               |
| -------------------------------------------------------------------------------------------------------- | ------------------------ |
| ![Dataflyt](https://github.com/Artsdatabanken/nin-arkitektur-dokumentasjon/raw/master/image/api_24.png)  | API (HTTP REST)          |
| ![Dataflyt](https://github.com/Artsdatabanken/nin-arkitektur-dokumentasjon/raw/master/image/data_24.png) | Åpne data                |
| ![Dataflyt](https://github.com/Artsdatabanken/nin-arkitektur-dokumentasjon/raw/master/image/kart_24.png) | Kart                     |
| ![Dataflyt](https://github.com/Artsdatabanken/nin-arkitektur-dokumentasjon/raw/master/image/last_24.png) | Lastejobb / Konvertering |
| ![Dataflyt](https://github.com/Artsdatabanken/nin-arkitektur-dokumentasjon/raw/master/image/lib_24.png)  | Bibliotek                |
| ![Dataflyt](https://github.com/Artsdatabanken/nin-arkitektur-dokumentasjon/raw/master/image/tool_24.png) | Verktøy                  |
| ![Dataflyt](https://github.com/Artsdatabanken/nin-arkitektur-dokumentasjon/raw/master/image/www_24.png)  | Web-side/applikasjon     |

## Utdatasett

Datasettet som er resultatet av lastejobben havner i repo [naturvern](https://github.com/Artsdatabanken/naturvern).

## Baserer seg på åpne data fra (takk til)

- [Miljødirektoratet](https://kartkatalog.geonorge.no/metadata/miljodirektoratet/naturvernomrader/5857ec0a-8d2c-4cd8-baa2-0dc54ae213b4)
- [Wikidata](https://www.wikidata.org)
- [Kartverket](https://kartkatalog.geonorge.no/metadata/kartverket/administrative-enheter-kommuner/041f1e6e-bdbc-4091-b48f-8a5990f3cc5b)

### Leses av

- [nin-data-lastejobb](https://github.com/Artsdatabanken/nin-data-lastejobb)

### Bruk i sluttprodukter

- [Natur i Norge kart](https://github.com/Artsdatabanken/nin-kart-frontend)
- [Artsdatabanken åpne data](https://data.artsdatabanken.no/)

## Kataloger

- `stages/download`: Script for å laste ned eksterne datafiler til `temp/`
- `stages/transform`: Script som produserer resultatet og legger det i `build/`
- `build`: Filene som kommer ut av lastejobben
- `temp`: Temporær lagring av nedlastede data og mellomformater

## Bruk

### Installere

```bash
npm run install
```

Laster ned avhengige biblioteker til `node_modules`.

### Download

```bash
npm run download
```

Laster ned eksterne avhengigheter som lastejobben er avhengig av for å produsere sitt resultat i "transform". Denne kjører stegene som ligger i `stages/download`. Nedlastede data lagres som en konvensjon i katalog `data`.

### Transform

```bash
npm run transform
```

Bruker allerede nedlastede data til å produsere sitt resultat. Denne brukes gjerne mens man utvikler så man slipper å laste ned data hver gang, og kan også brukes uten at man har tilgang til nett sålenge man har gjort `download` først. Denne kjører stegene som ligger i `stages/transform`

Sluttproduktet av transform skrives som en konvensjon til katalogen `build`.

### Build

```bash
npm run build
```

Kjører hele lastejobben, først `download`, så `transform`.

### Deploy

```bash
npm run deploy
```

Tar filene fra `build`-katalogen som er produsert i `build` eller `transform` og publiserer disse offentlig slik at andre lastejobber eller konsumenter kan nå dem uten å kjøre lastejobben.

## Lage en ny lastejobb

Hvis du ønsker å sette opp en ny lastejobb er en enkel måte å gjøre det på å lage en ny katalog for så å be lastejobb-modulen initialisere. Den oppretter et nytt git repo, lager package.json med script for å kjøre lastejobben, README-fil og eksempelsteg.

```bash
$ mkdir minlastejobb && cd minlastejobb
$ npx lastejobb init
npx: installed 35 in 2.808s
  ℹlastejobb Initialiserer lastejobb +0ms
  ℹlastejobb Initialize Git repo +1ms
  ℹlastejobb Initialized empty Git repository in /home/b/minlastejobb/.git/ +7ms
  ℹlastejobb Initialize npm project +1ms
  ℹlastejobb Wrote to /home/b/minlastejobb/package.json: +163ms
  ℹlastejobb Installing library lastejobb +0ms
  ℹlastejobb + lastejobb@2.4.1 +2s
  ℹlastejobb added 35 packages from 37 contributors and audited 47 packages in 1.589s +1ms
  ℹlastejobb found 0 vulnerabilities +0ms
  ℹlastejobb Add scripts to package.json +0ms
  ℹlastejobb Create index.js +1ms
  ℹlastejobb Make directory stages +1ms
  ℹlastejobb Make directory stages/download +0ms
  ℹlastejobb Make directory stages/transform +1ms
  ℹlastejobb Create stages/download/10_sample.js +0ms
  ℹlastejobb Create stages/transform/10_sample.js +0ms
  ℹlastejobb Create README.md +1ms
```

## API

### Lastejobb API

```bash
const lastejobb = require('lastejobb')
```

| Funksjon             | Beskrivelse                                                  |
| -------------------- | ------------------------------------------------------------ |
| kjørLastejobberUnder | Kjører alle javascript i angitt katalog eller underkataloger |
| kjørLastejobb        | Kjører 1 enkelt lastejobb spesifisert med filnavn            |

### io

```bash
const {io} = require('lastejobb')
```

Funksjoner for å lese eller skrive til filer (typisk JSON, tekst eller binære filer)

Katalog for build output kan overstyres ved å sette environment variabel BUILD.

Se https://github.com/Artsdatabanken/lastejobb/blob/master/lib/io.js

### http

```bash
const {http} = require('lastejobb')
```

Funksjoner for å lese JSON eller binære filer fra web.

Se https://github.com/Artsdatabanken/lastejobb/blob/master/lib/http.js

### log

```bash
const {log} = require('lastejobb')
```

Slå på logging ved å sette environment variabel

- `export DEBUG=*` (Linux)
- `set DEBUG=*` (Windows)

Funksjoner for logging fra lastejobben

Se https://github.com/bjornreppen/log-less-fancy#readme
