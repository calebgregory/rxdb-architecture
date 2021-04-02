# src/gql/operations/

`src/gql/operations/` house actions a user can take in the application.  Currently, these are limited to querying and mutating data using GraphQL queries/mutations.

The functions exported from files in these directories should be thought of as imperative shells:  `getJob` and cache it; `createJob`; `getContent` in batches and cache them - these procedurally perform I/Oful operations according to application logic.
