const { of } = require('rxjs')
const { TestScheduler } = require('rxjs/testing')
const { batchQueryByKind } = require('../batchQueryByKind')

const testScheduler = new TestScheduler((actual, expected) => {
  expect(actual).toEqual(expected)
})

describe('batchQueryByKind', () => {
  it('receives a stream of items (array{ id, kind }) to show, queries and groups them by kind', () => {
    testScheduler.run(helpers => {
      const { cold, expectObservable, expectSubscriptions } = helpers

      const key = {
        a: [{ kind: 'job', id: 'a' }],
        b: [{ kind: 'job', id: 'a' }, { kind: 'job', id: 'b' }],
        c: [{ kind: 'job', id: 'b' }],
        d: [{ kind: 'content', id: 'c' }],
        e: [{ kind: 'job', id: 'd' }],

        w: { 'job': [{ id: 'a!' }] },
        x: { 'job': [{ id: 'a!' }, { id: 'b!' }] },
        y: { 'job': [{ id: 'b!' }] },
        z: { 'job': [{ id: 'b!' }], 'content': [{ id: 'c!' }] },
        p: { 'job': [{ id: 'd!' }], 'content': [{ id: 'c!' }] },
      }

      const e1 =  cold('-a--b--c--d--e--|', key)
      const subs =     '^---------------!'
      const expected = '-w--x--y--z--p--|'

      const query$ = (_kind, ids) => of(ids.map(id => ({ id: `${id}!` })))

      expectObservable(e1.pipe(batchQueryByKind(query$))).toBe(expected, key)
      expectSubscriptions(e1.subscriptions).toBe(subs)
    })
  })
})
