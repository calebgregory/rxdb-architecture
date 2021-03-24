import { OperatorFunction } from 'rxjs'
import { RxDocument } from 'rxdb'
import { map } from 'rxjs/operators'

/**
 * @see note in ./data.ts
 * this is for arrays of RxDocuments
 */
export function datas<DT, TT>(): OperatorFunction<ReadonlyArray<RxDocument<DT>>, ReadonlyArray<TT>> {
  return map((rxDocs: ReadonlyArray<RxDocument<DT>>) => {
    return rxDocs.map(rxDoc => {
      const d: unknown = rxDoc._data
      return d as TT
    })
  })
}
