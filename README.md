## Description

This is test API task for network froup
Swagger can be accessed at http://localhost:3000/api

## Installation

```bash
$ docker compose up -d
```

```bash
$ nvm use
```

```bash
$ cp .env.example .env
```

```bash
$ npm ci
```

```bash
$ npx typeorm-ts-node-esm migration:run -d src/modules/db/config/data-source.ts
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```
