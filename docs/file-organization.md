# File organization

## Use barrel files

### Example

Suppose the `<repo-root>` is aliased to `~`.

```txt
<repo-root>/
  src/
    module/
      module.ts
      index.ts
    some-file.ts
```

#### `module/module.ts`

```javascript
export function a(): string {
  return 'a'
}
```

#### `module/index.ts`

```javascript
export * from './module'
```

#### `some-file.ts`

```javascript
import { a } from '~/module'

use(a())

function use(x: string) {
  console.log('i am using', x)
}
```
