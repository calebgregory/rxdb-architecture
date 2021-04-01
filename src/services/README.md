# src/services/

Any external services that are used should be wrapped in an application interface to that service.  This makes discovery of external service usage very easy, and it also allows us to have our usage of the external services fit with the paradigms and patterns of our application.

Many programming languages provide a language-level abstraction, `interface` (Java, Golang), `protocol` (Python), or `behavior` (Elixir).  These all mean the same thing:  a collection of methods that a given `struct`-type or `class` can _implement_.  For more high-level information about interfaces and their use, see [the wikipedia article](https://www.wikiwand.com/en/Interface_(computing)#/In_object-oriented_languages).

## Wrap SDKs in application-defined interfaces

`aws-cognito-auth.ts` is presented here as an example of an application interface to [AWS's Cognito SDK](https://www.npmjs.com/package/amazon-cognito-identity-js).

## Wrap Browser / OS APIs in application-defined interfaces

Another example of a service you might want to wrap could be a stream of Network Statuses coming from a mobile device's operating system.  You could translate that stream of statuses into an app-defined Enum, and put the current `networkStatus` into an RxDB Collection `networkStatus` (or, more generally, `deviceConditions`) that your app could in turn query and subscribe to.  This allows you to develop and test application logic that depends on knowledge about `networkStatus`/`deviceConditions` without having to run your application on an actual device.

This is a very powerful abstraction.  Let me illustrate it with another example:

### Example: writing a file

Suppose your application logic uses a device's file system.

Developing in React-Native, you'll use `react-native-fs`.  You can afford yourself the ability to develop _your_ application code in Node.js by wrapping `fs` in an interface you define that wraps the methods on Node.js' library `fs`, and inject your dependency into your application code somehow.

#### Application interface

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

#### React-Native implementation

We will use [react-native-fs' `writeFile`](https://github.com/itinance/react-native-fs/#file-creation)

```javascript
// src/services/fs/react-native.ts

import RNFS from 'react-native-fs'

export function writeFile(path: string, content: string, encoding: string = 'utf8'): Promise<boolean> {
  return RNFS.writeFile(path, content, encoding)
}
```

#### Node.js implementation

We will use [Node.js' `fs/promises.writeFile`](https://nodejs.org/api/fs.html#fs_fspromises_writefile_file_data_options)

```javascript
// src/services/fs/node-js.ts

import * as fs from 'fs/promises'

export function writeFile(path: string, content: string, encoding: string = 'utf8'): Promise<boolean> {
  return fs.writeFile(path, content, { encoding })
}
```

#### In-memory mock implementation

```javascript
// src/services/fs/mock.ts

import assocPath from 'ramda/src/assocPath'

let fileSystem = {}

type MockOptions = {
  shouldFail?: boolean
}
export function writeFile(
  path: string,
  content: string,
  _encoding: string = 'utf8',
  { shouldFail = false }: MockOptions
): Promise<boolean> {
  if (shouldFail) {
    throw new Error('writeFile failed')
  }

  fileSystem = assocPath(path.split('/'), content, fileSystem)
  return Promise.resolve(true)
}
```

#### Application usage

Put a struct that implements FileWriter on the `app` singleton; this is your access to whatever device's file system with which you're engaging.

```javascript
// src/app/types.ts

import { FileSystem } from '~/src/services/fs/types'

interface App {
  // ...
  fs: FileSystem,
  // ...
}
```

You'd initialize the app differently, depending on what environment you're working in:

__React-Native:__

```javascript
// src/app/init.ts

import * as fs from '~/src/services/fs/react-native'

export async function init(config: Config, credentials: Credentials) {
  // ...
  const app = {
    fs,
    gqlClients,
    db: () => db,
    eph: () => eph,
  }
  return app
}


// src/index.tsx

function main() {
  const app = await init(config, credentials)
  globalize(app)
  // ...
}
```

__Node.js:__

(this would look virtually the same if you were running scripts in the command line, rather than running integration-tests using `jest`, which is a workflow you will likely find yourself following frequently, since running integration tests can be slow).

```javascript
// integration-tests/test-app.ts

import * as fs from '~/src/services/fs/node-js'

export async function init({ credentials = defaultCredentials, config = loadConfig() }: SetupOptions = {}): Promise<App> {
  // ...
  const app = {
    fs,
    gqlClients,
    db: () => db,
    eph: () => eph
  }
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

__Any application code you write:__

```javascript
// src/any-other-file-henceforth.ts

import { app } from '~/src/app'

const { fs } = app()
fs.writeFile('/my/file/path', 'my content', 'utf8').then(() => {
  console.log('woohoo!')
})
```

---

@TODO: demonstrate what it looks like to expose operating system events to app using RxDB Observable Queries
