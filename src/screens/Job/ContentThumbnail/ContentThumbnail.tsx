import React, { useEffect } from 'react'
import { useObservableState } from 'observable-hooks'
import { app } from '~/src/app'
import { getContent } from '~/src/actions/content/get'

interface Props {
  id: string
}

export function ContentThumbnail({ id }: Props) {
  useEffect(() => { getContent(id) }, [id])

  const content: any = useObservableState(app().eph().content.findOne().where('id').equals(id).$, null)

  if (!content) {
    return <div>loading...</div>
  }

  return (
    <div id={id}>{content.readLink.thumbnailUrl}</div>
  )
}
