const { of, zip, pipe } = require('rxjs')
const { map, switchMap, switchAll, scan } = require('rxjs/operators')
const rpipe = require('ramda/src/pipe')
const groupBy = require('ramda/src/groupBy')
const toPairs = require('ramda/src/toPairs')

export function batchQueryByKind(query$) {
  return pipe(
    map(rpipe( //                      | input: [{ kind, id }] a.k.a. [item]
      groupBy((item) => item.kind), // | => { kind: [item]}
      toPairs, //                      | => [kind, [item]]
    )), //                             | $> [[kind, [item]]] a.k.a. groups
    switchMap(groups => groups.map(
      ([ kind, items ]) => {
        const ids = [...new Set<string>(items.map(({ id }) => id))]
        return zip(of(kind), query$(kind, ids)) // https://rxjs.dev/api/index/function/zip
        // zip(a$, b$) $> ([a, b]), so | $> [kind$, query$]
      }
    )), // https://rxjs.dev/api/operators/switchMap
    switchAll(), // https://rxjs.dev/api/operators/switchAll
    scan((acc, [kind, items]) => ({ ...acc, [kind]: items }), {}),
  )
}