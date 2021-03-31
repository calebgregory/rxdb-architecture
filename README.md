# front-end architecture

The architecture of a 'React application' should be such that the user interface (written using the React library) is a layer of superficial tissue around a robust Javascript application.  This React-layer should be as thin as humanly possible.  Keeping this layer thin helps us avoid testing React components.  Instead, we write end-to-end tests and rely on QA to ensure that the UI is working.

## Getting Started With This App

You'll need

- a `config.json` pointing to some environment (I point to `devl` personally)
- a `credentials.json` containing an object `{username, password}` with valid credentials for that environment.

At that point, you can

```sh
yarn
yarn gen
yarn start
```

## Testing

```sh
yarn test:unit
yarn test:integrations
```

To run integration tests, you will need to have a credentials file at `<repo-root>/test-credentials.json`.  This is in the same format described above (in __Getting Started__).  You can also use a `<repo-root>/test-config.json` file.  In the absense of either of these, the test suite fallsback to `<repo-root>/{credentials,config}.json`.

For more info on how and what to test, see [Testing Philosophy](./docs/testing-philosophy.md).

## Links

- [`urql` graphql client](https://formidable.com/open-source/urql/docs/api/core/)
- [`rxdb`](https://rxdb.info/)
  - [JSON schema](https://json-schema.org/learn/getting-started-step-by-step)
  - [`rxdb-utils`, hooks](https://github.com/rafamel/rxdb-utils#hooks)
  - [`mquery` methods](https://github.com/aheckmann/mquery/blob/master/README.md)
- [`observable-hooks`](https://github.com/crimx/observable-hooks/blob/master/docs/api/README.md#useobservablestate)
- CLI display
  - [`vorpal`](https://github.com/dthree/vorpal/)
  - [`inquirer`](https://github.com/SBoudrias/Inquirer.js/)

## Anticipated Challenges

- [Front End DB migrations](https://rxdb.info/questions-answers.html)

## Objectives

- ~select and create a network-only GraphQL client~
  - ~use client to query / mutate data~
- ~setup and use an RxDB instance~
  - ~in memory~
  - ~persistent~
- ~organize app as singleton instance, globally importable by app~
- ~enable configuration of environment (APIs) and credentials, for authenticated use of APIs~
- ~query and subscribe to data in RxDB and generate views from these data; use react-router to create Screens~
  - ~JobList~
  - ~Job~
  - ~Content~
- ~demonstrate organization of app components in directory structure~
- ~setup integration test bed for application code~
- ~demonstrate unit tests of RxJs operators~
- ~write an integration test for an 'imperative shell' (e.g., 'query and cache a Job')~
- ~generate RxSchema types from GraphQL schema~
- ~generate TypeScript types from GraphQL schema~
- ~generate test fixture factories from GraphQL schema~
- ~implement throttled batch-get of a given resource~
- document high level components, technologies, with links to resources for further reading
- demonstrate a [data migration](https://rxdb.info/data-migration.html)
- authentication as not a strict gate
- demonstrate a view with multiple queries
- document anti-patterns
- generate graphql fragments
- ~add max-batch-size to batch-bufferer~
- implement knowledgebase search
- add sign-in page, demonstrate app architecture with auth/not auth delineation
- implement model-layer for persistent, offline-first mutations of resources
