import { Subject } from 'rxjs'
import { throttledBuffer } from '~/src/util/rxjs/operators'

function makeThrottledBufferer(func: (ids: string[]) => any, throttleDuration: number): Subject<string> {
  const id$ = new Subject<string>()
  id$.pipe(throttledBuffer(throttleDuration))
    .subscribe((ids: string[]) => {
      func(ids)
      id$.complete()
    })
  return id$
}

export function addToBatch(func: (ids: string[]) => any, throttleDuration: number, ref: { current: Subject<string> | null }, id: string) {
  if (!ref.current || ref.current.isStopped) {
    ref.current = makeThrottledBufferer(func, throttleDuration)
  }
  ref.current.next(id)
}
