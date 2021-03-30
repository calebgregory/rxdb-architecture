# src/db/

- See [RxDB's documentation](https://rxdb.info/)

`db` is a persisted RxDB database.  Under the hood, it uses a database driver according to the environment in which the application is running (these are configured, env to env).  For more details about database drivers ("adapters") see [the docs](https://rxdb.info/adapters.html).

`eph` is an in-memory store of ephemeral data.  It contains application state that need not be persisted.

There may be overlap in schema for these two databases, but they should be thought of as completely separate entities.

For more details on RxSchema, see [the src/db/schema README](./schema/README.md)