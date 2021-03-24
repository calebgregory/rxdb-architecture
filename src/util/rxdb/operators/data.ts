import { OperatorFunction } from 'rxjs'
import { RxDocument } from 'rxdb'
import { map } from 'rxjs/operators'

/**
 * https://github.com/pubkey/rxdb/blob/master/src/rx-document.ts#L38-L54
 *
 * Converts a RxDocument into a serializable format. This was something needed
 * to do in the first place because React's useState hook will not rerender a
 * resource sometimes when it is a class instance (trust me on this :(.)
 *
 * rxdb's recommended method for converting a RxDocument to a serializable
 * format is [the method
 * `toJSON`](https://github.com/pubkey/rxdb/blob/master/src/rx-document.ts#L227-L234).
 * However, in practice, this method seems to mutate the RxDocument. I'm not
 * sure _why_, but when using rxDoc.toJSON() (see below), I was seeing
 * recursive-type behavior on the Observable. So... use rxDox._data.
 */
export function data<DT, TT>(): OperatorFunction<RxDocument<DT>, TT | null> {
  return map((rxDoc: RxDocument<DT>) => {
    if (rxDoc) {
      const d: unknown = rxDoc._data
      return d as TT
    }
    return null
  })
}
