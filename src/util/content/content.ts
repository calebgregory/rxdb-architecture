import { Content } from '~/src/gql/types/content'

export function getIsContentUnavailable(content: Content): boolean {
  const isContentUnavailable = Boolean((content && !content.readLink) || content.unavailableInfo)
  return isContentUnavailable
}

export function getIsReadLinkExpired(content: Content, currentTime: Date): boolean {
  return !content.readLink || currentTime.toISOString() >= content.readLink.expiresAt
}

export function getShouldRefreshMetadata(content: Content, currentTime: Date): boolean {
  const refreshMetadataAfter = content.refreshMetadataAfter || ''
  return Boolean(refreshMetadataAfter) && currentTime.toISOString() >= refreshMetadataAfter
}
