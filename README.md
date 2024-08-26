<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

1. Clona el repositorio:

```bash

git clone https://github.com/tu_usuario/proyecto-evaluacion.git
cd proyecto-evaluacion
```

## Installation

```bash
$ npm install
```

2. Copia el contenido de `.env.example` y crea un `.env`:

```bash
cp .env.example .env
```

3. Abre el archivo .env y ajusta las variables para las bases de datos. Por ejemplo

```bash
LOG_HTTP_REQUEST=true
MONGO_URI=mongodb://mongo:27017/proyecto_evaluacion

MAIL_HOST=smtp.gmail.com
MAIL_USER=nombreusuario
MAIL_PASSWORD="tu clave de aplicacion"
MAIL_FROM=tucorreo@gmail.com
MAIL_PORT=587

```
## Bases de datos

Las bases de datos se pueden inicializar usando docker.

4. Ejecuta el siguiente comando para levantar las bases de datos con Docker Compose:

```bash
docker-compose up

```

5. Ejecuta el siguiente comando para correr las migraciones:

```bash
 npx migrate-mongo up

```

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

```

## Test

```bash
# unit tests
$ npm run test

```

## Seguridad

Este proyecto implementa varias medidas de seguridad:

Rate Limiting: Limita el número de solicitudes por IP para prevenir abusos.
Hashing de Contraseñas: Las contraseñas se almacenan de forma segura utilizando bcrypt.
Sanitización de Datos: Los datos se sanitizan para prevenir inyecciones NoSQL y otros ataques de seguridad.

## Documentación de la API

La documentación de la API está generada con Swagger. Puedes acceder a ella en http://localhost:3000/api.

