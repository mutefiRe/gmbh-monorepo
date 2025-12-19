[![CircleCI](https://circleci.com/gh/gabsi20/gmbh-backend/tree/develop.svg?style=svg)](https://circleci.com/gh/gabsi20/gmbh-backend/tree/develop)

# GmBh Backend
## MMP2b

### Setup
[Setup Documentation](https://gitlab.com/mossss/gmbh-order/wikis/setup-(node,-bower,-mysql))
#### Database
Install MySQL on your platfrom
We need to set up a Production, Development and Test Database
```
create database gmbh
create database gmbh_production
create database gmbh_test
```
Standard Setup is:
```
database: "gmbh" // gmbh_test / gmbh_production
user: "root"
password: ""
hostname: "localhost"
port: 3306
```
#### Install
```
npm install
```

#### Printer API integration
This service proxies printing and discovery to the Go printer API.

Environment:
```
PRINTER_API_URL=http://localhost:8761
```

Optional query params:
- `GET /api/printers?includeQueue=true` includes queue status per printer.

#### API Testing with Postman
Testing our API Funktionality is easy with Postman.

Check it out: [get Postman](http://www.getpostman.com/)

We have prepared the Requests for you: [shared Collection](https://www.getpostman.com/collections/e5f341bd489ee40b27df)

### API Documentation
We use apiDocs for documentation purpose.
You can find the documentation under the docs folder or just type /docs on running server.

#### Generation of documentation on changes
When we change something on the api, we have to update the docs also.

Just run in root folder.

```
npm run docs
```

This creates an folder ```gmbh-api-docs``` on directory above


### Contributors
- [Alexander Gabriel](https://www.github.com/gabsi20)
- [Sebastian Huber](https://www.github.com/godfather27)
- [Konrad Kleeberger](https://www.github.com/Konkrad)
- [Josef Krabath](https://www.github.com/josefkrabath)
- [Daniel Trojer](https://www.github.com/mutefiRe)

### Commit Conventions
- __feat:__     new feature
- __fix:__      a bug fix
- __docs:__     Documentation only changes
- __style:__    Chnages that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- __refactor:__ A code change that neither fixes a bug or adds a feature
- __perf:__     A code change that improves performance
- __test:__     Adding missing tests
- __chore:__    Chnages to the build process or auxiliary tools and libraries such as documentation generation

### Contributing

We love structured branching

[Install GIT-Flow](https://github.com/nvie/gitflow/wiki/Installation)

We love consistent commiting

[Install Commitizen](https://www.npmjs.com/package/commitizen)

### License

===============

Copyright (c) 2015 Alexander Gabriel, Sebastian Huber, Konrad Kleeberger, Josef Krabath, Daniel Trojer

Proprietary software
