# src/services/

Any external services that are used should be wrapped in an application interface to that service.  This makes discovery of external service usage very easy, and it also allows us to have our usage of the external services fit with the paradigms and patterns of our application.

`aws-cognito-auth.ts` is presented here as an example of an application interface to [AWS's Cognito SDK](https://www.npmjs.com/package/amazon-cognito-identity-js).

Another example of a service you might want to wrap could be a stream of Network Statuses coming from a mobile device's operating system.  You could translate that stream of statuses into an app-defined Enum, and put them into an RxDB Collection DeviceConditions that your app could in turn query and subscribe to.  This allows you to develop and test application logic that depends on knowledge about DeviceConditions without having to run on an actual device.
