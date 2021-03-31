# How to write React Components

Let's start by talking about how to _test code_, generally.

## Testing code, generally

Obviously, we test our code one way or another.  We write automated tests to ensure our code behaves how we believe it behaves - both _now_, and in the future.

There's an optimal amount of testing.  The more you test an application, the harder it becomes to change your application.  Testing 'hardens' an implementation - that is, it makes it less malleable.  In some cases, that is what you want - you are confident in what you've created and you're convinced that it _should_ be difficult to change.  In other cases, whether your code 'works' can be tested simply by someone being able to view a screen or press a button.

The core of our application should be hardened with tests.  The superficial tissue of our application - that is, what the user _sees and touches_ - should be malleable, easily changed.

'What software to test' is directly related to 'How to write software'.

Ideally, any business logic _worth testing_ lives in a pure function.  'Pure' here implies that the function executes and behaves deterministically _in any given Context_.  Because the function behaves deterministically, it easy to reason and make assertions about.

## Back to React

A function that must be executed within the Context of a React Component is not pure, because its behavior varies according to its context.  So, React Hooks are impure.

React Hooks are, however, very easy to use.  They provide a nice suite of functions to use to connect data to View Component markup.  It is inevitable that we want to create Views of data.  And Hooks are easy to use, relative to the tedium of parameterizing data and threading it through a Higher-Order Component ("HOC"), which was the common practice before Hooks.  We want to benefit from these tools and the ease they provide.

We use Hooks to subscribe to streams of data.  In particular, we subscribe to queries of our RxDB stores.  Any 'business logic' that may be performed with that data as input _and_ any transformations of data into a given display value should be expressed using pure functions that take the data as input and then output whatever is needed by the view.  See [the `<Job />` screen](../src/screens/Job/Job.ts) for an example of what this looks like.

The exceptions:  `boolean-value ? <Thing /> : null` can be expressed inside the React Component and does not need to be tested, though anything more complex than this should be encapsulated in a pure function external to the React Component and tested.  Iterators, like `listOfThings.map(({ id }: ThingThatHasId) => id)` do not need to be tested; we can rely on Javascript to `Array.prototype.map` properly, and we rely on Typescript to perform static type checking such that we know `listOfThings` is an Array of things that have an `id` property.

## Design your application _outside of React_

Any application logic _beyond (a.) transforming stored application data into display values or (b.) connecting a user action to the execution of a Javascript function defined outside of React_ should NOT be placed within a React component!  You may have to get creative to achieve this result, but it is a worthwhile design constraint to place yourself within.

Doing so enables you to develop and test your Javascript application in Node.js, outside of the browser or the React-Native Javascript runtime, which has been consistently buggy and thwarting.
