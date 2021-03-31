import { OperatorFunction } from 'rxjs'
import { RxDocument } from 'rxdb'
import { map } from 'rxjs/operators'

export function data<DT, TT>(): OperatorFunction<RxDocument<DT>, TT | null> {
  return map((rxDoc: RxDocument<DT>) => {
    if (rxDoc) {
      const d: unknown = rxDoc._data
      return d as TT
    }
    return null
  })
}
