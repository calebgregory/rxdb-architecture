# src/logger/

The logger is very simple.  You can 'instantiate' a logger for a given namespace with 5 log levels by

```javascript
const log = require('~/src/logger').logger('my-ns')
log.info('i am', { using: ['my', 'logger'] })
```

The logger itself is an instance of [`debug(ns)`](https://www.npmjs.com/package/debug), which affords enabling and disabling namespace-levels.

[`logger/init.ts`](./logger/init.ts) has instructions for how to configure the log levels you want to enable for your development, and [`integration-tests/jest.setup.js`](../../integration-tests/jest.setup.js) has instructions for how to get integration-test-specific log configuration setup; you may want to have different log verbosity, etc., in each of those two environments.

## Logging errors

Most of the time, we want to log `('some message', { ...some_payload })`, with one exception:  logging exceptions.

When logging an exception, provide the caught error as the first argument, then some metadata for context:  `.catch(error => { log.error(error, { caughtIn: 'myFunctionName' }) })`.

We use Sentry for aggregation of errors coming from our client applications.  It displays the exception's stack trace and aggregates errors by message, so it is actually very important that we send the excepted `error` as the first argument in error logs.

For more considerations on logging, see [the Confluence article on logging](https://xoeye-technologies.atlassian.net/wiki/spaces/PROD/pages/1569030154/Logging+and+Error+discovery).
