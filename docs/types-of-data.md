# There are three types of data a front-end application deals with

## 1. Views of items that live in a database

- This is what is typical for a web-app:  you have some data in a server you want to show the user.
- The server is the source of truth; we want our cache of these items to match what is in the server as closely as possible.
- These items live in an ephemeral cache - i.e., they are not persisted.
- We send any mutations made to these items directly to the server, and after a successful mutation, we update the cache with the updated item from the server (generally speaking, our GraphQL mutations send back a response with the updated version of the item).

## 2. Highly-ephemeral read-only items gotten as search results

- A user has provided some query input in a search.  They either find what they are looking for and view it, or they don't and throw the search result away.
- Because these search results are so short-lived, our caching strategy should differ from __1.__; there is little benefit to keeping old search results in memory, and we risk having this bulky cache after, say, an hour of usage.
- These can live in an ephemeral data store to preserve our reactive architecture, but we would want to be thoughtful about clearing that cache out once the search results are off the screen.
- An alternative here would be to use something like a `useQuery` hook.
  - A downside to taking this approach is that you're baking your querying of data into the React Component context, which requires you to develop and test your code inside of a UI.

## 3. Long-lived, mutable items

- The client-application is the source of truth; the server is eventually-consistent with the data that lives on the user's device.
- For more details, see [Offline-first Architecture](./offline-first-architecture.md)