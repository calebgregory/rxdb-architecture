import React, { useEffect } from 'react'
import { useObservableState } from 'observable-hooks'
import { app } from '~/src/app'
import { getContent } from '~/src/query/content/get'
import { data } from '~/src/util/rxdb/operators'
import { Content } from '~/src/gql/types/content'

interface Props {
  id: string
}

export function ContentThumbnail({ id }: Props) {
  useEffect(() => { getContent(id) }, [id])

  const content: Content | null = useObservableState(
    app().eph().content.findOne().where('id').equals(id).$.pipe(data()),
    null
  )

  if (!content) {
    return <div>loading...</div>
  }

  return (
    <div id={id} style={{ display: 'inline-block' }}>
      <img src={content!.readLink?.thumbnailUrl} alt="content thumbnail" />
    </div>
  )
}
