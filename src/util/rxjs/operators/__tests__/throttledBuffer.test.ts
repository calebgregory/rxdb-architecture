import { TestScheduler, RunHelpers } from 'rxjs/internal/testing/TestScheduler'
import { throttledBuffer } from '../throttledBuffer'

const testScheduler = new TestScheduler((actual: any, expected: any) => {
  expect(actual).toEqual(expected)
})

describe('throttledBuffer', () => {
  it('batches any values coming in on src stream for {throttledDuration}ms _after first value_', () => {
    testScheduler.run((helpers: RunHelpers) => {
      const { cold, expectObservable } = helpers

      const key = {
        a: 1, b: 2, c: 3, d: 4, e: 5, f: 6,
        x: [1, 2],
        y: [3, 4, 5],
        z: [6],
      }

      const BATCH_THROTTLE_TIME = 5

      const src$ = cold('-a--b-----cde---f--|', key)
      const expected =  '------x--------y---(z|)'

      expectObservable(src$.pipe(throttledBuffer(BATCH_THROTTLE_TIME, testScheduler))).toBe(expected, key)
    })
  })
})
