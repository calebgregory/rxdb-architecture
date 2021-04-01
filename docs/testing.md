# Testing

## Unit tests

- See [`jest`'s documentation](https://jestjs.io/docs/getting-started)

Directories are laid out so as to place unit tests of packages near their implementation:

```txt
<repo-root>/
  src/
    module-a/
      __tests__/
        module-a.test.ts
      module-a.ts
      index.ts
    module-b/
      submodule-1/
        __tests__/
          submodule-1.test.ts
        submodule-1.ts
        index.ts
      submodule-2/
        __tests__/
          submodule-2.test.ts
        submodule-2.ts
        index.ts
      index.ts
```

You should write unit tests for _pure functions_.

## Integration tests

Integration tests are setup and run using the [`integration-tests/test-app`](../integration-tests/test-app.ts).  See the [`integration-tests README`](../integration-tests/README.md) for more details.

Integration tests are used to test _imperative shells_.

See [Functional Core / Imperative Shell](./functional-core-imperative-shell.md)
