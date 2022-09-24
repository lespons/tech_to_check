## Running the app in docker

```bash
# development
$ docker-compose up db dev
...
```

## Some tests in
```
currency-api/test/currency.e2e-spec.ts
currency-api/src/currency/currency.controller.spec.ts
exchangerate-currency.service.spec.ts
```

## Running the app on localhost

```bash
$ npm ci
```

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

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
