# src/gql/test-fixtures/

All Typescript files in this directory are generated.  If you are finding yourself with nothing here, run `yarn gen:test-fixtures`

Test fixture factories are extremely useful.  Here's an example test that uses a test fixture factory:

```javascript
import { getIsReadLinkExpired } from '../get'
import { newContent, newExpiringLink } from '~/src/gql/test-fixtures/content'

describe('getIsReadLinkExpired', () => {
  it('returns true if currentTime is after readLink.expiresAt', () => {
    const expiresAt =          '2020-01-01T00:00:00.000Z'
    let currentTime = new Date('2021-01-01T00:00:00.000Z')
    const content = newContent({ readLink: newExpiringLink({ expiresAt }) })
    expect(getIsReadLinkExpired(content, currentTime)).toEqual(true)
  })
})
```
