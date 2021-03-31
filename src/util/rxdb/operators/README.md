# src/util/rxdb/operators/

The `rxjs` operations exported here transform a RxDocument into its underlying Javascript object.  `data()` does this for a single item; `datas()` does this for an array of items.  This "makes `useState` happy", such that you can re-render a View Component when one or more items it is observing (and transforming to a View) change state.

See [RxDocument source code](https://github.com/pubkey/rxdb/blob/master/src/rx-document.ts#L38-L54).

RxDB queries (and streams of results for queries) return RxDocuments, which are class instances having a plethora of methods on them.  These do not play well with React's `useState` hook, which will not re-render changed data when it is (I am guessing) not in a serializable format?  It may be that `useState` uses referential equality to compare state1 and state2, that the RxDocument, though changed, may be at the same address in memory, so `useState` sees no change and does't re-rerender.  I don't know.

rxdb's recommended method for converting a RxDocument to a serializable format is [the method `toJSON`](https://github.com/pubkey/rxdb/blob/master/src/rx-document.ts#L227-L234). However, in practice, this method seems to mutate the RxDocument. I'm not sure _why_, but when using rxDoc.toJSON() (see below), I was seeing recursive/infinite-loop -type behavior on the Observable. So... use rxDox._data.
