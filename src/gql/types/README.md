# src/gql/types/

- [TypeScript's documentation](https://www.typescriptlang.org/docs/)
- Generated from GraphQL Schema using [the `graphql-code-generator` plugin](https://www.graphql-code-generator.com/docs/plugins/typescript)

All Typescript files in this directory are generated.  If you are finding yourself with nothing here, run `yarn gen:ts`.

## Example Usage

```javascript
import { Content } from '~/src/gql/types/content'

export function getIsReadLinkExpired(content: Content, currentTime: Date): boolean {
  return !content.readLink || currentTime.toISOString() >= content.readLink.expiresAt
}
```
