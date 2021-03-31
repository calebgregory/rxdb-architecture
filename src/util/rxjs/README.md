# src/util/rxjs/

- [`rxjs`' documentation](https://rxjs.dev).

Exports custom operators, observable-creators, or utilities for working with `rxjs`.

## Developing in rxjs

I recommend developing rxjs code using Javascript scripts that you're executing in `Node.js`.  Observables are stateful and potentially long-lived.  Cracking them open and inspecting their internal state, in pursuit of making sense of their behavior, can be a puzzle of its own.  What you _need_ is visibility.  Fortunately, it possible to gain that visibility:  `rxjs`' `tap(f)` operator allows you to do something with a value before passing it on to the next operator in a `pipe` of operators.  If you're composing operators using `pipe`, you can use this to log the state of whatever it is you're inspecting at that stage of transformation.

You can also write internal operator code imperatively - a style you may be more familiar with.  Just make sure to clean up after yourself by unsubscribing to any src$ Observables that you subscribe to.

What I like to do is create a script that uses the operator I'm developing and run it in the terminal, with logs that allow me to watch its behavior over time.

```javascript
const src$ = interval(100).pipe(take(20))

src$.pipe(
  tap(val => { console.log('in ', val) }),
  myOperator()
)
  .subscribe(val => { console.log('out', val) })
```

And I'll add logs in my operator to see what's going on in there, too:

```javascript
export function myOperator<T>(): OperatorFunc<T, T> {
  return (src$: Observable<T>): Observable<T> => src$.pipe(
    map(x => x + 1),
    tap(x => { console.log('map', x) })
    filter(x => x % 2)
  )
}

// or a more imperative implementation:
export function myOperator2<T>(): OperatorFunc<T, T> {
  return (src$: Observable<T>): Observable<T> => new Observable(dest$ => {
    src$.subscribe({
      next: (x) => {
        if ((x + 1) % 2) {
          console.log('myOperator2 ->', x + 1)
          dest$.next(x + 1)
        }
      },
      error: dest$.error,
      complete: dest$.complete,
    })

    return () => { src$.unsubscribe() }
  })
}
```

To run these, you'll need to have installed `ts-node`, because this is Typescript code (`ts-node` is a devDependency of this project).  You will also need to make sure that the `tsconfig.json` has `"module": "CommonJS",` set (this is not the default).

```sh
npx ts-node ./src/util/rxjs/scripts/my-operator.ts
```

## Testing rxjs code

You can test rxjs code you've written using marble tests.  See [the tests for `throttledBuffer`](./operators/__tests__/throttledBuffer.test.ts) for examples of these.

You might use marble tests for development in test-driven development fashion, but I strongly recommend running scripts in Node.js (or `ts-node`) as a development workflow.
