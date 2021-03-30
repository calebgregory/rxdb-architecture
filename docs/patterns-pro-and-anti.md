# Patterns

## Do

Translate data from the environment (be it browser or operating system) into app-defined values stored in an observable database.

## Do not

Use external services directly.

Use Browser APIs or Operating System events directly.

Modify global state (on an rxdb or otherwise) directly from within a React component.