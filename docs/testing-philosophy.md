# Testing Philosophy

Obviously, we test our code one way or another.  We write automated tests to ensure our code behaves how we believe it behaves - both _now_, and in the future, in the context of some other code or some other developers who are working with or changing our code.

There's an optimal amount of testing.  The more you test an application, the harder it becomes to change your application.  Testing 'hardens' an implementation - that is, it makes it less malleable.  In some cases, that is what you want - you are confident in what you've created and you're convinced that it _should_ be difficult to change.  In other cases, whether your code 'works' can be tested simply by someone being able to view a screen or press a button.

'What to test software' is directly related to 'How to write software'.

Ideally, any business logic _worth testing_ lives in a pure function.  'Pure' here implies that the function executes and behaves deterministically _in any given Context_.  Because the function behaves deterministically, it easy to make assertions about.  A function that must be executed within the Context of a React Component is not pure, because its behavior varies according to its context.  So, React Hooks are impure.

React Hooks are, however, very easy to use.  They provide a nice suite of functions to use to connect data to View markup.  It is inevitable that we want to create Views of data.  Given the ease of Hooks, it is tedious to parameterize data and thread it through a Higher-Order Component ("HOC"), which was the common practice before Hooks.  We want to benefit from these tools and the ease they provide.

We use Hooks to subscribe to streams of data.  In particular, we subscribe to queries of our RxDB stores.  Any 'business logic' that may be performed with that data as input _and_ any transformations of data into a given display value can be expressed using pure functions, that take the data as input and then output whatever is needed by the view.
