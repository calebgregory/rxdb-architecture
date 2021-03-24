import { parseLogConfig } from '../logger'

describe('parseLogConfig', () => {
  test.each([
    [`
    a
      b,
c
    d   ,
        e,
    `,
      'a,b,c,d,e']
  ])('replaces newline-separated values with comma-separated values', (input, result) => {
    expect(parseLogConfig(input)).toEqual(result)
  })
})
