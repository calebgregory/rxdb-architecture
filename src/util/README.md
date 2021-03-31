# src/util/

Whenever code pertaining to a particular library (like `rxdb`) or application resource type (like `jobs`) is written to be used in multiple places, it should be put inside `util/`.

Each `util/*` should be thought of as its own little library.  Do not write application code and put it in `util/` before thinking for several minutes about whether that is really what you want to do.  Instead, consider putting your code in `query`, `mutation`, or creating some other top-level-application architectural grouping that makes sense for your use cases.  (See [the `src/query/` README](../query/README.md).)

In general, if you're creating a new 'grouping' of utilities, you'll be adding a directory to `util/` rather than a file.  This enables you to collocate your unit tests with your implementation:

```txt
src/
  util/
    gql/
      __tests__/
        strip-gql-fields.ts
      strip-gql-fields.ts
      index.ts
```

Always include a barrel file that _only_ exports functions from peer files.  Do not put any other Javascript code in an `index.ts` file.  The barrel file affords consumers of `util/*` to import from the one-child-deep directory, a la `import { stripGqlFields } from '~/src/util/gql'`, while allowing you as a library writer to group code into smaller logical units as you see fit.
