import { gql } from '@urql/core'
import { app } from '~/src/app'
import { addToBatch } from '~/src/util/batch-get'
import { Content as ContentF } from '~/src/gql/fragments/content'
import { stripGqlFields } from '~/src/util/gql'
import { Content } from '~/src/gql/types/content'

const log = require('~/src/logger').logger('query/content/get')

/**
 * @todo:
 *   - [x] readLink expiry
 *   - [x] refreshMetadataAfter
 *   - [x] shouldForceRefresh
 *   - [x] refetching unavailable content
 *   - [ ] setting cookies for VBR videos
 *   - [x] max batch size
 */

const BATCH_THROTTLE_DURATION_MS = 175
const MAX_BATCH_SIZE = 50
const CLEANUP_BUFFER_MS = 10 * 1000

export const ContentJob = gql`
  query GetContent($ids: [ID!]!) {
    getContent(contentIDs: $ids, requestInput: { requestVbr: true }) {
      ...Content
    }
  }
  ${ContentF}
`

type GetShouldForceRefetch = (cachedContent: Content) => boolean

let _batchGetContentRef = { current: null, id: '' }
const addContentIdToBatch = addToBatch.bind(null, batchGetContent, BATCH_THROTTLE_DURATION_MS, MAX_BATCH_SIZE, _batchGetContentRef)
export const getContent = async (
  id: string,
  getShouldForceRefetch: GetShouldForceRefetch = () => false,
) => {
  const { db } = app()
  const cachedContent: Content | null = await db().content.findOne().where('id').equals(id).exec()

  const nowish = new Date(Date.now() + CLEANUP_BUFFER_MS)
  if (getShouldFetchContentId(getShouldForceRefetch, nowish, cachedContent)) {
    addContentIdToBatch(id)
  }
}

export async function batchGetContent(ids: string[]) {
  const { db, gqlClients } = app()

  log.trace('batchGetContent - fetching content with ids', { ids })
  const resp = await gqlClients.content.query(ContentJob, { ids }).toPromise()

  if (resp.error) {
    log.warning('batchGetContent - error on response', { resp })
    return
  }

  const items = resp.data.getContent
  log.debug('batchGetContent - got items; inserting', { 'items.length': items.length })

  await Promise.all(items.map((item: Content) => db().content.atomicUpsert(stripGqlFields(item))))
}

export function getShouldFetchContentId(
  getShouldForceRefetch: GetShouldForceRefetch,
  currentTime: Date,
  cachedContent: Content | null
): boolean {
  return !cachedContent
    || anyPass([
      getShouldForceRefetch,
      getIsContentUnavailable,
      getIsReadLinkExpired,
      getShouldRefreshMetadata,
    ])(cachedContent, currentTime)
}

function anyPass<S, T>(predicates: Array<(x: S, y: T) => boolean>) {
  return (...args: [S, T]) => {
    for (const predicate of predicates) {
      if (predicate(...args)) {
        return true
      }
    }
    return false
  }
}

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
