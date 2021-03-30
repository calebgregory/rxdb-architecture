# State management

"How to manage state in a front-end application" is a big conversation spanning years.  You're probably somewhat familiar with this conversation, but here are some highlights:

## Do not store state on React components

You can think of a React Component as an instance of an object.  If you store state on a React Component, you are requiring any consumer of that state to be located inside that Component.  This is 'place-oriented programming'.  You should be able to access or modify state from somewhere other than the React Component in which it is located - from outside the React Component hierarchy in general.

For a great talk on 'place-oriented programming (PLOP)', see [Rich Hickey's talk 'The Value of Values'](https://www.infoq.com/presentations/Value-Values/).

### The exception

Form state is the one exception to this rule.  You can temporarily store a user's input on a Component instance (using the `useState` hook).  But you'll want a better solution the moment you want to persist that input _as input_ in some way (like if the user quits out of the app before submitting their input and you want it to still be there when they come back around).

If that form state is used _anywhere else_ than the Form component, you should raise it to a globally-available store.

There are [ways to convert user-input events into streams of values](https://github.com/crimx/observable-hooks/blob/master/docs/guide/core-concepts.md#normal-to-observable), but I'm not currently of the opinion that purity here is worth the trade of ease of understandability to someone unfamiliar with `rxjs`.

### `React.Context` is not a solution

`React.Context` merely makes doing the wrong thing easier to work with, because it saves you from prop-drilling stateful values and callbacks.  It is still Place-Oriented Programming.  Don't do it.

## Put state in a global store

[`redux`](https://redux.js.org/) was a breakthrough in that it provided a globally-available, observable store, which behaved deterministically given a set of inputs.  Its API required all changes in state to be implemented as reductions of an action (a typed payload) onto a previous-state:  roughly, `next_state = reduce(reducer, prev_state, [action])`.  This pattern has several benefits:  it is easily extensible, because it is easily composable (_gestures to the rich ecosystem of redux middleware_).  It makes your application very easy to debug:  all state changes are tied to an action, which can be used to connect the observed state change to a call-site.  If you are logging your actions as they are dispatched (using `redux-logger`), you have high visibility into the state of your program, and can quickly troubleshoot/debug/discover-what-has-gone-on.

### Globally-available

A globally-available store can be imported from any file and used.  This means you can write a Javascript program that consumes and modifies an application's state without rendering inside of the React hierarchy.  With [the additional architectural strategy of wrapping any external service in an application defined interface](../src/services/README.md), you can develop (and test) a Javascript application in Node.js without having to think about the Browser, or React-Native.  Any Component within the hierarchy can access an application's state directly by importing the `app` singleton (see the examples in the [`app` README](../src/app/README.md) for what this looks like in practice).

### Observable

Changes in an observable store can be reacted-to by re-rendering the view.  But that's only one example of reactivity.  You can coordinate 2 or more services using the same reactive paradigm (for example, you can react to a user adding a device by looking in a persisted store of devices user has used historically, assessing priority, and selecting the added device automatically if they have preferred to use it in the past).

### Behaves deterministically given inputs

In general, any reaction to a change in state should be encoded in a pure function that behaves deterministically given any inputs.  This allows you to reason about the logic of what you've written.  It also allows you to automate testing of that logic.  For more details, see [Functional Core / Imperative Shell](./functional-core-imperative-shell.md).
