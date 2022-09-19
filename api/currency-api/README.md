## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation


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

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
