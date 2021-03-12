# rxdb-experiments

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
- https://formidable.com/open-source/urql/docs/api/core/
- https://rxdb.info/
  - https://json-schema.org/learn/getting-started-step-by-step
- https://github.com/SBoudrias/Inquirer.js/

--

## Anticipated Challenges

- Front End DB migrations
  - https://rxdb.info/questions-answers.html

## Example commands

```sh
show job job-29cebec6-7a7a-i144-1a9d4ed3a691-u7BD-9b3b53b43b4f
```
