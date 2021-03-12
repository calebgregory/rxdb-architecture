# Notes for later

## GraphQL TypeKinds

```javascript
{
  "kind": "ENUM",
  "name": "__TypeKind",
  "description": "An enum describing what kind of type a given `__Type` is.",
  "fields": null,
  "inputFields": null,
  "interfaces": null,
  "enumValues": [
    {
      "name": "SCALAR",
      "description": "Indicates this type is a scalar.",
      "isDeprecated": false,
      "deprecationReason": null
    },
    {
      "name": "OBJECT",
      "description": "Indicates this type is an object. `fields` and `interfaces` are valid fields.",
      "isDeprecated": false,
      "deprecationReason": null
    },
    {
      "name": "INTERFACE",
      "description": "Indicates this type is an interface. `fields`, `interfaces`, and `possibleTypes` are valid fields.",
      "isDeprecated": false,
      "deprecationReason": null
    },
    {
      "name": "UNION",
      "description": "Indicates this type is a union. `possibleTypes` is a valid field.",
      "isDeprecated": false,
      "deprecationReason": null
    },
    {
      "name": "ENUM",
      "description": "Indicates this type is an enum. `enumValues` is a valid field.",
      "isDeprecated": false,
      "deprecationReason": null
    },
    {
      "name": "INPUT_OBJECT",
      "description": "Indicates this type is an input object. `inputFields` is a valid field.",
      "isDeprecated": false,
      "deprecationReason": null
    },
    {
      "name": "LIST",
      "description": "Indicates this type is a list. `ofType` is a valid field.",
      "isDeprecated": false,
      "deprecationReason": null
    },
    {
      "name": "NON_NULL",
      "description": "Indicates this type is a non-null. `ofType` is a valid field.",
      "isDeprecated": false,
      "deprecationReason": null
    }
  ],
  "possibleTypes": null
}
```