# Event Management API

Ürituste ja piletimüügi backend, kirjutatud TypeScriptis (Node.js + Express). Korraldaja loob üritused ja piletitüübid, ostja tellib ja maksab piletid Stripe'iga ning turvamees skannib uksel pileti QR-koodi. Andmed on PostgreSQL-is, sisselogimine käib Google'i või GitHubi kontoga.

> Projekt on pooleli. Ehitan selle samm-sammult GitHubi issue'de järgi (vt [ALUSTA.md](ALUSTA.md)).
> **Issued tehakse järjekorras:** iga hilisem issue sõltub varasematest.

## Nõuded

- Node.js 22+
- npm

## Käivitamine

```bash
npm install
npm run server
```

Server käivitub aadressil http://localhost:3000. Peatamiseks vajuta `Ctrl+C`.

## Käsud

| Käsk | Mida teeb |
|---|---|
| `npm run server` | Käivitab arendusserveri otse TypeScripti failidest (`tsx`), laeb `.env` faili |
| `npm run typecheck` | Kontrollib TypeScripti tüübivigu, faile ei loo |
| `npm run build` | Kompileerib `src/` kausta `dist/` kausta (`tsc`) |
| `npm start` | Käivitab kompileeritud serveri (`dist/server.js`), tootmiseks |

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
