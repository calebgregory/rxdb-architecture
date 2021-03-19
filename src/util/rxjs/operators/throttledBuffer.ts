import { asyncScheduler, Observable, OperatorFunction, SchedulerLike } from 'rxjs'
import { buffer, throttleTime } from 'rxjs/operators'

export function throttledBuffer<T>(throttleDuration: number, scheduler: SchedulerLike = asyncScheduler): OperatorFunction<T, T[]> {
  return (src$: Observable<T>): Observable<T[]> => {
    const throttleTimer$ = src$.pipe(
      throttleTime(throttleDuration, scheduler, { leading: false, trailing: true })
    )
    return src$.pipe(buffer(throttleTimer$))
  }
}
