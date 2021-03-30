# Offline-first Architecture

In order to provide an offline-first experience, we treat the client application as the source of truth for a given long-lived item. This is an inversion of what is typical - that is, treating the server as the source of truth.

## The arch

- A persistent data store (rxdb), which houses
  - Copies of the most recent versions of items fetched from the server
  - Any pending mutations on those items
  - These are stored as a tuple, grouped by item_id
  - Once a network connection is established, we send these mutations to the server until they are drained.  Then, we update the persistently-stored item with that gotten from the server after the mutations are applied server-side.
- Additionally, there is an ephemeral data store (rxdb, with an in-memory adapter), which houses "optimistically-updated" items, reduced from the server-item with its pending mutations applied "onto" it.
- On app init and after each pending mutation is written to the persistent store, we hydrate the ephemeral store with an optimistically-updated 'read' of each item formed by applying each pending mutation of an item 'onto' its most-recent-server-item.
  - This ephemeral store is queryable and observable; any views should query and subscribe to _it_ rather than to the persistent store.

```txt
mutation(id, payload) ->
  db.insert ->
    mutation-inserted$ ->
      (mutation) => {
        item = get_item(mutation.id)
        return update(item, with=mutation)
      } ->
        eph.insert ->
          optimistically-updated$ ->
            <View />
```
