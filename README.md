# rxdb-architecture

(>'')>

## Getting Started

You'll need

- a `config.json` pointing to some env (i point to `devl` personally)
- a `credentials.json` containing an object `{username, password}` with valid credentials for that environment.

At that point, you can

```sh
yarn
yarn gen
yarn start
```

## The idea here

We are able to architect a front-end application independently from its
view-layer.

The proposed architecture looks like this:

- A persistent data store (in rxdb), which houses a model of a graphql server
- We persist items (copies of the resource fetched from the server) and
  pending mutations of these items, grouped by `id`.
- Additionally, there is an ephemeral data store (in rxdb, with an
  in-memory adapter), which houses "optimistically-updated" items,
  reduced from the server-item with its pending mutations applied "onto" it.
- The view layer can query and subscribe-to-changes-on-items in the
  ephemeral store
- Any 'action' a user can perform (such as "querying" or "mutating") is
  encoded as a process encapsulated by a function, which can be called in any
  context.

--

Links

- [`urql` graphql client](https://formidable.com/open-source/urql/docs/api/core/)
- [`rxdb`](https://rxdb.info/)
  - [JSON schema](https://json-schema.org/learn/getting-started-step-by-step)
  - [`rxdb-utils`, hooks](https://github.com/rafamel/rxdb-utils#hooks)
  - [`mquery` methods](https://github.com/aheckmann/mquery/blob/master/README.md)
- [`observable-hooks`](https://github.com/crimx/observable-hooks/blob/master/docs/api/README.md#useobservablestate)
- CLI display
  - [`vorpal`](https://github.com/dthree/vorpal/)
  - [`inquirer`](https://github.com/SBoudrias/Inquirer.js/)

--

## Anticipated Challenges

- [Front End DB migrations](https://rxdb.info/questions-answers.html)

--

## TODO

1. ~experiment with Component-level join (more closely resembles what you'd do with React)~
2. add a resource Mutation
3. experiment with model-layer usage
4. add authentication
