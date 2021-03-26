import { id as gid } from '~/src/util/testing'
import { newCloudFrontResource } from '~/src/gql/test-fixtures/content'
import { getCookiesFromCloudfrontResource } from '../cookies'

describe('getCookiesFromCloudfrontResource', () => {
  it('returns array of cookies with name and value matching', () => {
    const cookies = [
      { name: gid(), value: gid() },
    ]
    const cloudFrontResource = newCloudFrontResource({ cookies })

    const result = getCookiesFromCloudfrontResource(cloudFrontResource)

    expect(result.length).toEqual(1)
    const [ cookie ] = result

    expect(cookie.name).toEqual(cookies[0].name)
    expect(cookie.value).toEqual(cookies[0].value)
  })

  it('returns cookies with domain attribute', () => {
    const resource = 'https://la.de.da.com/here/is/my/path/doo/da/do'
    const cookies = [
      { name: gid(), value: gid() },
    ]

    const cloudFrontResource = newCloudFrontResource({ resource, cookies })

    const result = getCookiesFromCloudfrontResource(cloudFrontResource, { isOriginSiblingDomain: false })

    const [ cookie ] = result

    expect(cookie.domain).toEqual('la.de.da.com')
  })

  it('returns cookies with domain that is a parent domain of resource when option isOriginSiblingDomain = true', () => {
    const resource = 'https://la.de.da.com/here/is/my/path/doo/da/do'
    const cookies = [
      { name: gid(), value: gid() },
    ]

    const cloudFrontResource = newCloudFrontResource({ resource, cookies })

    const result = getCookiesFromCloudfrontResource(cloudFrontResource, { isOriginSiblingDomain: true })

    const [ cookie ] = result

    expect(cookie.domain).toEqual('.de.da.com')
  })

  it('returns cookies with path attribute', () => {
    const resource = 'https://la.de.da.com/here/is/my/path/doo/da/do'
    const cookies = [
      { name: gid(), value: gid() },
    ]

    const cloudFrontResource = newCloudFrontResource({ resource, cookies })

    const result = getCookiesFromCloudfrontResource(cloudFrontResource)

    const [ cookie ] = result

    expect(cookie.path).toEqual('/here/is/my/path/doo/da/do')
  })

  it('returns cookies with expires attribute', () => {
    const cookies = [
      { name: gid(), value: gid() },
    ]
    const date = new Date(Date.now() + 1000 * 60)
    const expiresAt = date.toISOString()

    const cloudFrontResource = newCloudFrontResource({ cookies, expiresAt })

    const result = getCookiesFromCloudfrontResource(cloudFrontResource)

    const [ cookie ] = result

    expect(cookie.expires).toEqual(date)
  })

  it('returns cookies with secure attribute by default', () => {
    const cookies = [
      { name: gid(), value: gid() },
    ]

    const cloudFrontResource = newCloudFrontResource({ cookies })

    const result = getCookiesFromCloudfrontResource(cloudFrontResource)

    const [ cookie ] = result

    expect(cookie.secure).toEqual(true)
  })

  it('returns cookies with secure attribute if there is option secure = true', () => {
    const cookies = [
      { name: gid(), value: gid() },
    ]

    const cloudFrontResource = newCloudFrontResource({ cookies })

    const result = getCookiesFromCloudfrontResource(cloudFrontResource, { secure: true })

    const [ cookie ] = result

    expect(cookie.secure).toEqual(true)
  })
})
