import { Subject } from 'rxjs'
import { take } from 'rxjs/operators'
import { throttledBuffer } from '~/src/util/rxjs/operators'
import { id as gid } from '~/src/util/testing'

const log = require('~/src/logger').logger('util/batch-get')

type BatchRef = {
  current: Subject<string> | null,
  id: string,
}

function makeThrottledBufferer(func: (ids: string[]) => any, throttleDuration: number, refID: string): Subject<string> {
  const id$ = new Subject<string>()
  id$.pipe(throttledBuffer(throttleDuration), take(1))
    .subscribe((ids: string[]) => {
      log.trace('calling func with ids', { ids, refID })
      func(ids)
      id$.complete()
    })
  return id$
}

export function addToBatch(func: (ids: string[]) => any, throttleDuration: number, ref: BatchRef, id: string) {
  if (!ref.current || ref.current.isStopped) {
    const refID = gid('ref')
    ref.current = makeThrottledBufferer(func, throttleDuration, refID)
    ref.id = refID
  }

  log.trace('adding to batch', { id, refID: ref.id })
  ref.current.next(id)
}
