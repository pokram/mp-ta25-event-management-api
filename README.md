# Event Management API

Ürituste ja piletimüügi backend, kirjutatud TypeScriptis (Node.js + Express). Korraldaja loob üritused ja piletitüübid, ostja tellib ja maksab piletid Stripe'iga ning turvamees skannib uksel pileti QR-koodi. Andmed on PostgreSQL-is, sisselogimine käib Google'i või GitHubi kontoga.

> Projekt on pooleli. Ehitan selle samm-sammult GitHubi issue'de järgi (vt [ALUSTA.md](ALUSTA.md)).
> **Issued tehakse järjekorras:** iga hilisem issue sõltub varasematest.

## Nõuded

- Node.js 22+
- npm

## Seadistus

Kopeeri `.env.example` failiks `.env` ja täida väärtused:

| Muutuja             | Näide                                         | Tähendus                               |
| ------------------- | --------------------------------------------- | -------------------------------------- |
| `DATABASE_USER`     | `app`                                         | Postgresi kasutaja (Docker)            |
| `DATABASE_PASSWORD` |                                               | Postgresi parool (Docker)              |
| `DATABASE_NAME`     | `events`                                      | Andmebaasi nimi (Docker)               |
| `PORT`              | `3000`                                        | Serveri port (1024-65535)              |
| `NODE_ENV`          | `development`                                 | `development`, `production` või `test` |
| `DATABASE_URL`      | `postgres://app:parool@localhost:5432/events` | Rakenduse ühendus andmebaasiga         |

Rakendus kontrollib muutujad käivitamisel (`src/config/env.ts`) ega käivitu, kui mõni on puudu või vale.

## Käivitamine

```bash
cp .env.example .env      # täida väärtused
docker compose up -d
npm install
npm run server
```

Server käivitub aadressil http://localhost:3000. Peatamiseks vajuta `Ctrl+C`.

## Käsud

| Käsk                   | Mida teeb                                                                     |
| ---------------------- | ----------------------------------------------------------------------------- |
| `npm run server`       | Käivitab arendusserveri otse TypeScripti failidest (`tsx`), laeb `.env` faili |
| `npm run typecheck`    | Kontrollib TypeScripti tüübivigu, faile ei loo                                |
| `npm run build`        | Kompileerib `src/` kausta `dist/` kausta (`tsc`)                              |
| `npm start`            | Käivitab kompileeritud serveri (`dist/server.js`), tootmiseks                 |
| `npm run lint`         | Otsib koodist vigu (oxlint)                                                   |
| `npm run format`       | Vormindab kõik failid ühtsesse stiili (Prettier)                              |
| `npm run format:check` | Kontrollib vormingut, faile ei muuda                                          |
| `docker compose up -d` | Käivitab Postgresi konteineri taustal                                         |
| `docker compose down`  | Peatab konteineri (andmed jäävad alles)                                       |
| `npm run db:generate`  | Loob skeemi muudatustest SQL migratsiooni (`migrations/`)                     |
| `npm run db:migrate`   | Rakendab migratsioonid andmebaasile                                           |
| `npm run db:studio`    | Avab andmebaasi brauseris (https://local.drizzle.studio)                      |

### Andmebaasi muudatused

Tabeleid ei looda käsitsi. Iga muudatus käib migratsiooni kaudu:

1. Muuda skeemi (`src/db/schema/`)
2. `npm run db:generate`: loob SQL migratsiooni kausta `migrations/`
3. Loe genereeritud SQL läbi
4. `npm run db:migrate`: rakendab migratsiooni andmebaasile

Migratsioonid lähevad gitti, et iga arendaja ja server jooksutaks samad.

## Kaustastruktuur

Kood on jaotatud kaustadesse **domeeni kaupa**, mitte kihi kaupa: kõik ühe teema failid on koos. Kaustad tekivad siis, kui neid esimest korda vaja läheb. Allolev puu näitab plaani.

```
src/
├── event/                 ← üks domeen = üks kaust
│   ├── event.routes.ts        aadressid + ühendused (DI)
│   ├── event.controller.ts    HTTP: valideeri, kutsu service'it, tee vastus
│   ├── event.service.ts       äriloogika
│   ├── event.repository.ts    ainus koht, kus on SQL
│   └── dto/                   päringu ja vastuse kujud
├── shared/                ← mitme domeeni ühine (vead, valideerimine)
├── config/                ← keskkonnamuutujad
├── db/                    ← andmebaasi ühendus ja skeemid
├── scripts/               ← käsurea skriptid (seeder, make-admin)
├── app.ts                 ← rakenduse kirjeldus (route'id, middleware)
└── server.ts              ← käivitab rakenduse pordil ja sulgeb selle korralikult
tests/                     ← peegeldab src/ struktuuri
```

## Töövoog

Iga issue tehakse eraldi harus ja jõuab `master`-isse pull requesti kaudu: **üks issue = üks haru = üks PR.**

1. Loo haru: `git switch -c feat/5-docker-postgres` (issue number + lühike nimi)
2. Tee muudatused ja commit'id
3. Enne PR-i: `npm run format`, `npm run lint`, `npm run typecheck`
4. `git push -u origin <haru>` ja `gh pr create --fill`
5. PR-i kirjelduses `Closes #<nr>`: issue sulgub merge'i ajal automaatselt

Commit'i sõnum algab eesliitega ([Conventional Commits](https://www.conventionalcommits.org/)):

| Eesliide    | Millal                                       |
| ----------- | -------------------------------------------- |
| `feat:`     | uus võimalus                                 |
| `fix:`      | vea parandus                                 |
| `refactor:` | koodi ümberkorraldus ilma käitumist muutmata |
| `chore:`    | seadistus, paketid                           |
| `docs:`     | README, dokumentatsioon                      |
| `test:`     | testid                                       |
