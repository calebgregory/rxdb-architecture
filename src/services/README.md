# src/services/

Any external services that are used should be wrapped in an application interface to that service.  This makes discovery of external service usage very easy, and it also allows us to have our usage of the external services fit with the paradigms and patterns of our application.

Many programming languages provide a language-level abstraction, `interface` (Java, Golang), `protocol` (Python), or `behavior` (Elixir).  These all mean the same thing:  a collection of methods that a given `struct`-type or `class` can _implement_.  For more high-level information about interfaces and their use, see [the wikipedia article](https://www.wikiwand.com/en/Interface_(computing)#/In_object-oriented_languages).

## Wrap SDKs in application-defined interfaces

`aws-cognito-auth.ts` is presented here as an example of an application interface to [AWS's Cognito SDK](https://www.npmjs.com/package/amazon-cognito-identity-js).

## Wrap Browser / OS APIs in application-defined interfaces

Another example of a service you might want to wrap could be a stream of Network Statuses coming from a mobile device's operating system.  You could translate that stream of statuses into an app-defined Enum, and put the current `networkStatus` into an RxDB Collection `networkStatus` (or, more generally, `deviceConditions`) that your app could in turn query and subscribe to.  This allows you to develop and test application logic that depends on knowledge about `networkStatus`/`deviceConditions` without having to run your application on an actual device.

This is a very powerful abstraction.  Let me illustrate it with another example:

### Example: writing a file

Suppose your application logic uses a device's file system to write a file.

You're writing a Javascript app in React-Native, so you'll use `react-native-fs`.  Additionally, though, you can afford yourself the ability to develop your application code in Node.js by using Node.js' `fs` library.

You can position yourself to be able to write _application code_ that "writes a file" without knowing exactly how, by defining an interface and two implementations of that interface:  one that that wraps the methods of `react-native-fs`, and one that wraps Node.js' library `fs`.

The architecture looks like this:

![PlantUML Diagram](http://www.plantuml.com/plantuml/proxy?src=https://raw.githubusercontent.com/calebgregory/rxdb-architecture/main/src/services/docs/fs-example.iuml&cache=no)

Why is this valuable?  It enables you to write application code in a less complex environment than React-Native.  This helps you avoid being in a situation where you are blocked from developing your code for a couple days because you can't build the React-Native app on your device.

#### Usage

Let's start by looking at how you'd use `app().fs` in your application code:

__Any application code you write:__

```javascript
// src/any-other-file.ts

import { app } from '~/src/app'

const { fs } = app()
fs.writeFile('/my/file/path', 'my content', 'utf8').then(() => {
  console.log('woohoo!')
})
```

Although this is hidden from you as the caller of this function, this function will write a file to the Device's file system when you are running the app on a in React-Native mobile device, and it will write a file to your computer's file system when you are running the app in Node.js on your computer.

Let's look closer at how this is accomplished.

#### Define an application interface

This is a collection of methods you implement with a package for each environment.

```javascript
// src/services/fs/types.ts

interface FileWriter {
  writeFile(path: string, content: string, encoding: string): Promise<boolean>
}

interface FileReader {
  // ...
}

type FileSystem = FileWriter & FileReader // & ...
```

##### React-Native implementation

Using [react-native-fs' `writeFile`](https://github.com/itinance/react-native-fs/#file-creation),

```javascript
// src/services/fs/react-native.ts

import RNFS from 'react-native-fs'

export function writeFile(path: string, content: string, encoding: string = 'utf8'): Promise<boolean> {
  return RNFS.writeFile(path, content, encoding)
}
```

##### Node.js implementation

Using [Node.js' `fs/promises.writeFile`](https://nodejs.org/api/fs.html#fs_fspromises_writefile_file_data_options),

```javascript
// src/services/fs/node-js.ts

import * as fs from 'fs/promises'

export function writeFile(path: string, content: string, encoding: string = 'utf8'): Promise<boolean> {
  return fs.writeFile(path, content, { encoding })
}
```

##### Bonus: an in-memory mock implementation

For fun, I want to also show that you can implement an interface with an in-memory mock implementation.  This is often useful for writing unit tests while preserving the integration points of components defined within your application.

```javascript
// src/services/fs/mock.ts

import assocPath from 'ramda/src/assocPath'

let fileSystem = {}

type MockOptions = {
  shouldFail?: boolean
}
export function writeFile(path: string, content: string, _encoding: string, { shouldFail = false }: MockOptions): Promise<boolean> {
  if (shouldFail) {
    throw new Error('writeFile failed')
  }

  fileSystem = assocPath(path.split('/'), content, fileSystem)
  return Promise.resolve(true)
}
```

#### Application initialization

Now, we're going to link these packages to an env-specific `app` instance.

Put a struct that implements FileWriter on the `app` singleton.  This is your application's interface to whatever device's file system with which you're engaging.

```javascript
// src/app/types.ts

import { FileSystem } from '~/src/services/fs/types'

interface App {
  // ...
  fs: FileSystem,
  // ...
}
```

You will initialize `app` differently, depending on what environment you're working in:

__React-Native:__

```javascript
// src/app/init.ts

import * as fs from '~/src/services/fs/react-native'

export async function init(config: Config, credentials: Credentials): Promise<App> {
  // ...
  const app = { fs, /* ... */ }
  return app
}


// src/index.tsx

import { init } from '~/src/app/init'
import { globalize } from '~/src/app/app'

function main() {
  const app = await init(config, credentials)
  globalize(app)
  // ...
}
```

__Node.js:__

```javascript
// integration-tests/test-app.ts

import * as fs from '~/src/services/fs/node-js'

export async function init({ credentials = defaultCredentials, config = loadConfig() }: SetupOptions = {}): Promise<App> {
  // ...
  const app = { fs, /* ... */ }
  return app
}


// integration-tests/**/*.ts

import { init, destroy } from '~/integration-tests/test-app'
import { app, globalize } from '~/src/app'

describe('**/*', () => {
  beforeAll((done) => {
    init().then(globalize).then(done)
  })

  afterAll((done) => {
    destroy().then(done)
  })

  // ...
})
```

This would look virtually the same if you were running Javascripts in the command line using Node.js or `ts-node`, rather than running integration-tests using `jest`.  I anticipate running scripts using `ts-node` is a workflow you will likely find yourself following frequently, since running integration tests can be slow.

---

@TODO: demonstrate what it looks like to expose operating system events to app using RxDB Observable Queries
