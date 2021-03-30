# src/screens/

Screens are organized by top-level React Component that is rendered at a given route (whether that is rendered using [react-router](https://reactrouter.com/) or [react-navigation](https://reactnavigation.org/)).

As an organizational strategy, we group sub-Components into the containing screen.  Each of these sub-Components stays within `src/screens/ParentScreen/` until it is needed elsewhere.  At that time, it graduates to [`src/components`](../components/).

For details about state management and React Components, see [State Management](../../docs/state-management.md).
