# src/db/schema/

- See [RxDB's documentation on RxSchema](https://rxdb.info/rx-schema.html)

## RxSchema

Each of these contains Collections, Documents in which adhere to the Schema for that Collection.  In this project, RxSchema for items gotten using GraphQL queries are generated from GraphQL Schema.  See [the `generate-rx-schema` script](../../scripts/generate-rx-schema.js) as a starting point.

Alternatively, we may simply store items in RxDBs using a schema like `psuedo{ id: [string, primary], item: object }`.  RxDB allows you to nest `additionalProperties` underneath the top-level Document.  If you wanted to enable quick sorting of items based on, e.g., a timestamp, you could pull a copy of that field key-val up to the top-level Document and add an index for that field.  It is pretty nice that we have RxSchema generated from GraphQL Schema, though.  It enables direct setting of items to Documents without a translation layer, and it enables creating indices for any non-null string field.
