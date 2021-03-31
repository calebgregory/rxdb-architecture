# Patterns

- __DO NOT:__ Use external services directly, or use Browser APIs or Operating System events directly.  __DO:__ Translate data from the environment (be it the browser or the operating system) into app-defined values stored in an observable database.  See [`src/services/`](../src/services/README.md).
- __DO NOT:__ Modify global state (on an rxdb or otherwise) directly from within a React component.  _This includes making GraphQL queries or mutations using React Hooks provided any of the big GraphQL libraries! Don't do it!_ __DO:__ encapsulate the process that modifies global state in [an _imperative shell_](./functional-core-imperative-shell.md), then import and call this function in your React component.
