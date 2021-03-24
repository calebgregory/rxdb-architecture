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

- A persistent data store (rxdb), which houses a model of a graphql server
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

### Distinctions

1. Source of truth

### Constraints

1. Provide an offline-first experience
  - In order to satisfy this constraint, we treat the client application as the source of truth for a given long-lived item. This is an inversion of what is typical - that is, treating the server as the source of truth.
### There are three types of data

1. Administrative views of configurable items that live in a database
  - The server is the source of truth; we want our cache of these items to match what is in the server as closely as possible.
  - These items live in an ephemeral cache - i.e., they are not persisted
  - We send any mutations made to these items directly to the server, and after a successful mutation, we update the cache with the updated item from the server (generally speaking, our GraphQL mutations send back a response with the updated version of the item).
2. Highly-ephemeral read-only items gotten as search results
  - A user has provided some query input in a search.  They either find what they are looking for and view it, or they don't and throw the search result away
  - These live in an ephemeral data store to preserve our reactive architecture, but I actually question whether we want to do even that.
  - An alternative would be to use something like a `useQuery` hook.
3. Long-lived mutable items
  - The client-application is the source of truth; the server is eventually-consistent with the data that lives on the user's device.
  - We store most-recent-version of an item fetched from the server and any pending mutations on that item in a persistent data store on the user's device.
  - Once a network connection is established, we send these mutations to the server until they are drained.  Then, we update the persistently-stored item with that gotten from the server.
  - On app init and after each pending mutation is written to the persistent store, we hydrate an ephemeral store with an optimistically-updated 'read' of each item formed by applying each pending mutation of an item 'onto' its most-recent-server-item.
    - This ephemeral store is queryable and observable; any views should query and subscribe to _it_ rather than to the persistent store.

--

## Testing

```sh
yarn test:unit
yarn test:integrations
```

To run integration tests, you will need to have a credentials file at `<repo-root>/test-credentials.json`.  This is in the same format described above (in __Getting Started__).  Keep in mind that these are hitting whatever environment you've configured in `<repo-root>/config.json`; don't create any data you wouldn't want your mother to see.

### Philosophy

Obviously, we test our code one way or another.  We write automated tests to ensure our code behaves how we believe it behaves - both _now_, and in the future, in the context of some other code or some other developers who are working with or changing our code.

There's an optimal amount of testing.  The more you test an application, the harder it becomes to change your application.  Testing 'hardens' an implementation - that is, it makes it less malleable.  In some cases, that is what you want - you are confident in what you've created and you're convinced that it _should_ be difficult to change.  In other cases, your code 'working' can be tested simply by someone being able to view a screen or press a button.

Ideally, any business logic _worth testing_ lives in a pure function.  'Pure' here implies that the function executes and behaves deterministically _in any given Context_.  That excludes React Components.

So we see, 'What to test' is directly associated with 'How to code'.

The architecture of a 'React application' should be such that the user interface (written using the React library) is a layer of superficial tissue around a robust JavaScript application.  This layer should be as thin as humanly possible.  Keeping this layer thin helps us avoid testing React components.  Instead, we write end-to-end tests and rely on QA to ensure that the UI is working.

TODO: write up a document on how to apply the functional core / imperative shell strategy in a JavaScript application.

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

--

## Anticipated Challenges

- [Front End DB migrations](https://rxdb.info/questions-answers.html)

--

## TODO

1. write a test for each 'imperative shell'
2. generate TypeScript types from GraphQL schema
3. implement knowledgebase search
4. add authentication
5. experiment with model-layer usage
