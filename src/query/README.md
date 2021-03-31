# src/query/

`src/query/` and `src/mutation/` house actions a user can take in the application.  Currently, these are limited to querying and mutating data using GraphQL queries/mutations, but I question whether querying and mutating are different enough to merit their own directories.

The functions exported from files in these directories should be thought of as imperative shells:  `getJob` and cache it; `createJob`; `getContent` in batches and cache them - these procedurally perform I/Oful operations according to application logic.

Much of what you'll do in a typical web app is limited to this: querying and mutating items.  You may find yourself working on an application with logic that spans beyond these categories.  Consider creating a new top-level directory.  One kind of logic I've found myself doing in front-end applications is _coordination_.  A `src/coordinators/` directory may be a salient grouping of functions in the future.
