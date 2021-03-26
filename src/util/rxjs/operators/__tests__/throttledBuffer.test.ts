import { TestScheduler, RunHelpers } from 'rxjs/internal/testing/TestScheduler'
import { throttledBuffer } from '../throttledBuffer'

describe('throttledBuffer', () => {
  it('batches any values coming in on src stream for {throttledDuration}ms _after first value_', () => {
    const testScheduler = new TestScheduler((actual: any, expected: any) => {
      expect(actual).toEqual(expected)
    })

    testScheduler.run((helpers: RunHelpers) => {
      const { cold, expectObservable } = helpers

      const key = {
        a: 1, b: 2, c: 3, d: 4, e: 5, f: 6,
        x: [1, 2],
        y: [3, 4, 5],
        z: [6],
      }

      const batchThrottleDuration = 5
      const maxBatchSize = 500

      const src$ = cold('-a--b-----cde---f--|', key)
      const expected =  '------x--------y---(z|)'

      expectObservable(src$.pipe(throttledBuffer(batchThrottleDuration, maxBatchSize))).toBe(expected, key)
    })
  })

  it('stops buffering once buffer has reached max size', () => {
    const testScheduler = new TestScheduler((actual: any, expected: any) => {
      expect(actual).toEqual(expected)
    })

    testScheduler.run((helpers: RunHelpers) => {
      const { cold, expectObservable } = helpers

      const key = {
        a: 1, b: 2, c: 3, d: 4, e: 5, f: 6,
        x: [1, 2, 3, 4, 5],
        y: [6],
      }

      const batchThrottleDuration = 10
      const maxBatchSize = 5

      const src$ = cold('-abcdef|', key)
      const expected =  '-----x-(y|)'

      expectObservable(src$.pipe(throttledBuffer(batchThrottleDuration, maxBatchSize))).toBe(expected, key)
    })
  })
})
