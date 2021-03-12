const { interval, of } = require('rxjs')
const { map } = require('rxjs/operators')
const { batchQueryByKind } = require('../operators')

const s = (n) => Array.from(new Array(n))
  .map((_, i) => ({ kind: i % 3, id: i }))

const query$ = (_kind, ids) => of(ids.map(id => ({ id: `${id}!` })))

const src$ = interval(2000).pipe(map(s))
src$.pipe(batchQueryByKind(query$))
  .subscribe((val) => {
    console.log('--->', val)
  })

