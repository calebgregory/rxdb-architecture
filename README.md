# rxdb-experiments

(>'')>

## Getting Started

You'll need

- `.env` file with `export AUTH_TOKEN=<your-xoi-token>` (make sure it's valid)
- `config.json` in repo root, pointing to the appropriate environment
- ,-o-o eventually, you'll need a `.yarnrc` pointing to the npm repo on "the nexus" (you know the one)

You should be able to `yarn main` at that point and use this thing.

### Example commands

```sh
show job job-29cebec6-7a7a-i144-1a9d4ed3a691-u7BD-9b3b53b43b4f
```

--

## The idea here

We are able to architect a front-end application independently from its
view-layer.

The proposed architecture looks like this:

- A persistent data store (in rxdb), which houses a model of a graphql server
  - We persist items and pending mutations on items, grouped by `id`.
- Additionally, there is an ephemeral data store (in rxdb, with an
  in-memory adapter), which houses "optimistically-updated" items,
  reduced from the server-item with its applied pending mutations.
- The view layer can query and subscribe-to-changes-on-items in the
  ephemeral store
- The view is represented as data in an ephemeral store; the UI merely
  maps that data into a view.
- Any 'action' a user can perform is encoded as a process encapsulated
  by a function, which can be called in any context.

--

Links

- [`urql` graphql client](https://formidable.com/open-source/urql/docs/api/core/)
- [`rxdb`](https://rxdb.info/)
  - [JSON schema](https://json-schema.org/learn/getting-started-step-by-step)
  - [`rxdb-utils`, hooks](https://github.com/rafamel/rxdb-utils#hooks)
- CLI display
  - [`vorpal`](https://github.com/dthree/vorpal/)
  - [`inquirer`](https://github.com/SBoudrias/Inquirer.js/)

--

## Anticipated Challenges

- [Front End DB migrations](https://rxdb.info/questions-answers.html)
