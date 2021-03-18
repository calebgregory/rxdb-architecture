import React from 'react'
import { useParams } from 'react-router-dom'

type Params = {
  id: string
}

export function Job() {
  const { id } = useParams<Params>()
  return <div>job <code>{id}</code></div>
}
