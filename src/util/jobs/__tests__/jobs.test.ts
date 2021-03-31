import { newJob } from '~/src/gql/test-fixtures/jobs'
import { getJobTitle } from '../jobs'

describe('getJobTitle', () => {
  test.each([
    [newJob({ workOrderNumber: 'a', customerName: 'b', jobLocation: 'c' }), 'a - b - c']
  ])('formats job title with workOrderNumber, customerName, and jobLocation', (job, result) => {
    expect(getJobTitle(job)).toEqual(result)
  })
})
