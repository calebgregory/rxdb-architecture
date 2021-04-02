import { getOwnerName } from '../Job'
import { newJob, newUser } from '~/src/gql/test-fixtures/jobs'

describe('getOwnerName', () => {
  test.each([
    [newJob({ owner_info: newUser({ family_name: 'a', given_name: 'b' }) }), 'b a'],
    [newJob({ owner_info: null, owner: 'c@d.com' }), 'c@d.com'],
    [newJob({ owner: null }), 'N/A'],
  ])('formats ownerName according to presence of attributes on job', (job, result) => {
    expect(getOwnerName(job)).toEqual(result)
  })
})
