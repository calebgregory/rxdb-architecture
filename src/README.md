# src/

The `index.tsx` file contains the `main()` function.  It links configuration and authentication to the `app` singleton by calling `init()` with these.

A login-gated app could render two apps, LoginScreen and TheApp, and the `main()` in that case would be a loop:

```txt
    cachedToken
      |
      v
main(token) ---> valid auth? --yes--> render(TheApp)
      ^                    |
      |                    no
    token                  |
      |                    v
signIn(credentials) <----- render(LoginScreen)
```

Depending on your app's requirements, this may look a bit different.  For example, if you permit unauthenticted use of limited features your app, and expand the feature set of your app after authentication, this will look different.  At that point, you're engaging with `authenticated?` state as if it were a feature flag.  You'll want to check for authentication as part of your `main()` or `init()`, but you wouldn't render a LoginScreen as an early exit, as described above.
