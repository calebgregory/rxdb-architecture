const workflowRefIntrospection = require('./fixtures/workflow-ref.schema.graphql.introspection.json')
const { rxSchemaFromIntrospection, _indexByName, _xfFieldToProperty } = require('../rx-schema-from-introspection')

describe('_xfFieldToProperty', () => {
  const _typesByName = _indexByName(workflowRefIntrospection.__schema.types)

  describe('transforming non-NON_NULL-ables', () => {
    const field = {
      "name": "providerRef",
      "description": null,
      "args": [],
      "type": {
        "kind": "OBJECT",
        "name": "ProviderRef",
        "ofType": null
      },
      "isDeprecated": false,
      "deprecationReason": null
    }
    const expected = {
      "providerRef": {
        "oneOf": [
          {
            "type": "object",
            "properties": {
              "affiliateId": {
                "type": "string"
              },
              "providerPathImmediateToRoot": {
                "type": "array",
                "items": {
                  "type": "string"
                }
              }
            }
          },
          { "type": "null" }
        ]
      }
    }
  })

  describe('transforming SCALARs', () => {
    it('transforms ID', () => {
      const field = {
        "name": "group",
        "description": null,
        "args": [],
        "type": {
          "kind": "NON_NULL",
          "name": null,
          "ofType": {
            "kind": "SCALAR",
            "name": "ID",
            "ofType": null
          }
        },
        "isDeprecated": false,
        "deprecationReason": null
      }
      const expected = { "group": { "type": "string" } }

      expect(_xfFieldToProperty(_typesByName, field)).toEqual(expected)
    })

    it('transforms String', () => {
      const field = {
        "name": "pet_name",
        "description": null,
        "args": [],
        "type": {
          "kind": "NON_NULL",
          "name": null,
          "ofType": {
            "kind": "SCALAR",
            "name": "String",
            "ofType": null
          }
        },
        "isDeprecated": false,
        "deprecationReason": null
      }
      const expected = { "pet_name": { "type": "string" } }

      expect(_xfFieldToProperty(_typesByName, field)).toEqual(expected)
    })
  })

  describe('transforming aggregates', () => {
    it('transforms LISTs', () => {
      const field = {
        "name": "providerPathImmediateToRoot",
        "description": null,
        "args": [],
        "type": {
          "kind": "NON_NULL",
          "name": null,
          "ofType": {
            "kind": "LIST",
            "name": null,
            "ofType": {
              "kind": "NON_NULL",
              "name": null,
              "ofType": {
                "kind": "SCALAR",
                "name": "ID",
                "ofType": null
              }
            }
          }
        },
        "isDeprecated": false,
        "deprecationReason": null
      }
      const expected = {
        "providerPathImmediateToRoot": {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      }

      expect(_xfFieldToProperty(_typesByName, field)).toEqual(expected)
    })

    it('transforms OBJECTs', () => {
      const field = {
        "name": "providerRef",
        "description": null,
        "args": [],
        "type": {
          "kind": "NON_NULL",
          "name": null,
            "ofType": {
            "kind": "OBJECT",
            "name": "ProviderRef",
            "ofType": null
          }
        },
        "isDeprecated": false,
        "deprecationReason": null
      }
      const expected = {
        "providerRef": {
          "type": "object",
          "properties": {
            "affiliateId": {
              "type": "string"
            },
            "providerPathImmediateToRoot": {
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          }
        }
      }

      expect(_xfFieldToProperty(_typesByName, field)).toEqual(expected)
    })
  })
})

describe('rxSchemaFromIntrospection', () => {
  it('converts graphql introspection to correctly formatted rxschema', () => {
    const rxSchema = rxSchemaFromIntrospection(workflowRefIntrospection)

    const expected = {
      "type": "object",
      "properties": {
        "group": {
          "type": "string"
        },
        "id": {
          "type": "string"
        },
        "providerRef": {
          "type": "object",
          "properties": {
            "affiliateId": {
              "type": "string"
            },
            "providerPathImmediateToRoot": {
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          }
        }
      }
    }

    expect(rxSchema.definitions.WorkflowReference).toEqual(expected)
  })
})
