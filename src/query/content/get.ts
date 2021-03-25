import { gql } from '@urql/core'
import { app } from '~/src/app'
import { addToBatch } from '~/src/util/batch-get'
import { Content } from '~/src/gql/fragments/content'
import { stripGqlFields } from '~/src/util/gql'
import { Content as ContentT } from '~/src/gql/types/content'

const log = require('~/src/logger').logger('actions/content/get')

const BATCH_THROTTLE_DURATION = 175
// const MAX_BATCH_SIZE = 50  <- @todo

export const ContentJob = gql`
  query GetContent($ids: [ID!]!) {
    getContent(contentIDs: $ids, requestInput: { requestVbr: true }) {
      ...Content
    }
  }
  ${Content}
`

/**
 * @todo:
 *   - [ ] readLink expiry
 *   - [ ] refreshMetadataAfter
 *   - [ ] shouldForceRefresh
 *   - [ ] setting cookies for VBR videos
 *   - [ ] refetching unavailable content
 *   - [ ] max batch size
 */

let _batchGetContentRef = { current: null, id: '' }
const addContentIdToBatch = addToBatch.bind(null, batchGetContent, BATCH_THROTTLE_DURATION, _batchGetContentRef)
export const getContent = (id: string) => addContentIdToBatch(id)

export async function batchGetContent(ids: string[]) {
  const { eph, gqlClients } = app()

  const resp = await gqlClients.content.query(ContentJob, { ids }).toPromise()

  if (resp.error) {
    log.warning('batchGetContent - error on response', { resp })
    return
  }

  const items = resp.data.getContent
  log.debug('batchGetContent - got items; inserting', { 'items.length': items.length })

  await Promise.all(items.map((item: ContentT) => eph().content.atomicUpsert(stripGqlFields(item))))
}
