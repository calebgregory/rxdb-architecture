const { of, zip, pipe } = require('rxjs')
const { map, switchMap, switchAll, scan } = require('rxjs/operators')
const rpipe = require('ramda/src/pipe')
const groupBy = require('ramda/src/groupBy')
const toPairs = require('ramda/src/toPairs')

module.exports.batchQueryByKind = (query$) => pipe(
  map(rpipe( //                      | input: [{ kind, id }] a.k.a. [item]
    groupBy((item) => item.kind), // | => { kind: [item]}
    toPairs, //                      | => [kind, [item]]
  )), //                             | $> [[kind, [item]]] a.k.a. groups
  switchMap(groups => groups.map(
    ([ kind, items ]) => {
      const ids = [...new Set(items.map(({ id }) => id))]
      return zip(of(kind), query$(kind, ids)) // https://rxjs.dev/api/index/function/zip
      // zip(a$, b$) $> ([a, b]), so | $> [kind$, query$]
    }
  )), // https://rxjs.dev/api/operators/switchMap
  switchAll(), // https://rxjs.dev/api/operators/switchAll
  scan((acc, [kind, items]) => ({ ...acc, [kind]: items }), {}),
)

// @todo refactor the above in this way:
const _batchQueryByKind = (query) => {
  return (items$) => {
    return new Observable((observer) => {
      const subscription = items$.subscribe((items) => {
        // do some stuff

        observer.next(/* output */)
      })
      return () => {
        subscription.unsubscribe()
      }
    })
  }
}