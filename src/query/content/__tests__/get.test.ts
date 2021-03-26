import { getIsReadLinkExpired, getShouldRefreshMetadata } from '../get'
import { newContent, newExpiringLink } from '~/src/gql/test-fixtures/content'
import { id as gid } from '~/src/util/testing'

describe('getIsReadLinkExpired', () => {
  it('returns true if no readLink', () => {
    const content = newContent({ readLink: null })
    const isExpired = getIsReadLinkExpired(content, new Date())
    expect(isExpired).toEqual(true)
  })

  it('returns true if currentTime is after, or _is_, readLink.expiresAt', () => {
    const id = `content-${gid()}.jpg`
    const expiresAt =          '2020-01-01T00:00:00.000Z'
    let currentTime = new Date('2021-01-01T00:00:00.000Z')
    const content = newContent({ id, readLink: newExpiringLink({ expiresAt }) })
    expect(getIsReadLinkExpired(content, currentTime)).toEqual(true)

    currentTime = new Date(expiresAt)
    expect(getIsReadLinkExpired(content, currentTime)).toEqual(true)
  })

  it('returns false if readLink.expiresAt is after currentTime', () => {
    const id = `content-${gid()}.jpg`
    const expiresAt =            '2021-01-01T00:00:00.000Z'
    const currentTime = new Date('2020-01-01T00:00:00.000Z')
    const content = newContent({ id, readLink: newExpiringLink({ expiresAt }) })
    const isExpired = getIsReadLinkExpired(content, currentTime)
    expect(isExpired).toEqual(false)
  })
})

describe('getShouldRefreshMetadata', () => {
  it('returns false if no content.refreshMetadataAfter', () => {
    const content = newContent({ refreshMetadataAfter: null })
    expect(getShouldRefreshMetadata(content, new Date())).toEqual(false)
  })

  it('returns false if content.refreshMetadataAfter comes after currentTime', () => {
    const currentTime = new Date('2019-01-01T00:00:00.000Z')
    const refreshMetadataAfter = '2020-01-01T00:00:00.000Z'
    const content = newContent({ refreshMetadataAfter })
    expect(getShouldRefreshMetadata(content, currentTime)).toEqual(false)
  })

  it('returns true if currentTime is after content.refreshMetadataAfter', () => {
    const currentTime = new Date('2020-01-01T00:00:00.000Z')
    const refreshMetadataAfter = '2019-01-01T00:00:00.000Z'
    const content = newContent({ refreshMetadataAfter })
    expect(getShouldRefreshMetadata(content, currentTime)).toEqual(true)
  })
})
