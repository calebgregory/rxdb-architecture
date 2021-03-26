import { interval, race, Observable, OperatorFunction, Subject } from 'rxjs'
import { buffer, switchMap, skip, share, take } from 'rxjs/operators'

function makeBufferCtrl$<T>(throttleDuration: number, maxBufferSize: number, src$$: Observable<T>) {
  const makeBoundedTimer$ = () => {
    const durationHit$ = interval(throttleDuration).pipe(take(1))
    const maxSizeHit$ = src$$.pipe(skip(maxBufferSize - 2), take(1))
    return race(durationHit$, maxSizeHit$)
  }

  const start$ = new Subject<any>()
  const end$ = new Subject<any>()

  let throttling = false
  function start() {
    throttling = true
    start$.next(1)
  }
  function end() {
    throttling = false
    end$.next(2)
  }

  start$.pipe(switchMap(makeBoundedTimer$)).subscribe(end)

  src$$.subscribe({
    next: () => {
      if (!throttling) {
        start()
      }
    },
    error: () => {
      end()
      start$.complete()
      end$.complete()
    },
    complete: () => {
      end()
      start$.complete()
      end$.complete()
    },
  })

  return end$
}

export function throttledBuffer<T>(throttleDuration: number, maxBufferSize: number): OperatorFunction<T, T[]> {
  return (src$: Observable<T>): Observable<T[]> => {
    const src$$ = src$.pipe(share())
    const ctrl$ = makeBufferCtrl$(throttleDuration, maxBufferSize, src$$)
    return src$$.pipe(buffer(ctrl$))
  }
}
