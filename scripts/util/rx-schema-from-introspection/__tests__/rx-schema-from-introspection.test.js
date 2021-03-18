const jobsIntrospection = require('./fixtures/jobs.schema.graphql.introspection.json')
const contentIntrospection = require('./fixtures/content.schema.graphql.introspection.json')
const { rxSchemaFromIntrospection, _indexByName, _xfFieldToProperty } = require('../rx-schema-from-introspection')

describe('_xfFieldToProperty', () => {
  const _typesByName = _indexByName(jobsIntrospection.__schema.types)

  describe('transforming non-NON_NULL-ables', () => {
    describe('SCALARs', () => {
      it('makes type = [ null, type ]', () => {
        const field = {
          "name": "sortAsUnixtimeDecimal",
          "description": null,
          "type": {
            "kind": "SCALAR",
            "name": "String",
            "ofType": null
          },
          "defaultValue": null
        }
        const expected = {
          "sortAsUnixtimeDecimal": {
            "type": ["string", "null"]
          }
        }

        expect(_xfFieldToProperty({}, field)).toEqual(expected)
      })
    })

    describe('aggregate types', () => {
      it('optional OBJECT type = [ null, type ]', () => {
        const typesByName = {
          "Note": {
            "kind": "OBJECT",
            "name": "Note",
            "description": null,
            "fields": [
              {
                "name": "text",
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
            ],
            "inputFields": null,
            "interfaces": [],
            "enumValues": null,
            "possibleTypes": null
          }
        }
        const field = {
          "name": "note",
          "description": null,
          "args": [],
          "type": {
            "kind": "OBJECT",
            "name": "Note",
            "ofType": null
          },
          "isDeprecated": false,
          "deprecationReason": null
        }
        const expected = {
          "note": {
            "type": ["object", "null"],
            "properties": {
              "text": {
                "type": "string"
              }
            }
          }
        }

        expect(_xfFieldToProperty(typesByName, field)).toEqual(expected)
      })
    })
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

  describe('transforming ENUMs', () => {
    it('maps them to "string"', () => {
      const typesByName = _indexByName(contentIntrospection.__schema.types)

      const field = {
        "name": "status",
        "description": null,
        "args": [],
        "type": {
          "kind": "NON_NULL",
          "name": null,
          "ofType": {
            "kind": "ENUM",
            "name": "VirusScanStatus",
            "ofType": null
          }
        },
        "isDeprecated": false,
        "deprecationReason": null
      }
      const expected = {
        "status": {
          "type": "string"
        }
      }

      expect(_xfFieldToProperty(typesByName, field)).toEqual(expected)
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
  it('converts graphql introspection to correctly formatted rxschema 1', () => {
    const rxSchema = rxSchemaFromIntrospection(jobsIntrospection)

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
          "type": ["object", "null"],
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

  it('converts graphql introspection to correctly formatted rxschema 2', () => {
    const rxSchema = rxSchemaFromIntrospection(jobsIntrospection)
    const expected = {
      "type": "object",
      "properties": {
        "name": {
          "type": "string"
        },
        "documentation": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "contentID": {
                "type": "string"
              },
              "capturedAt": {
                "type": "string"
              },
              "originUri": {
                "type": ["string", "null"]
              },
              "tags": {
                "type": ["array", "null"],
                "items": {
                  "type": "string"
                }
              },
              "sortAsUnixtimeDecimal": {
                "type": ["string", "null"]
              },
              "docPredictionIds": {
                "type": ["array", "null"],
                "items": {
                  "type": "string"
                }
              }
            }
          }
        },
        "note": {
          "type": ["object", "null"],
          "properties": {
            "text": {
              "type": "string"
            }
          }
        },
        "isContentRequired": {
          "type": ["boolean", "null"]
        },
        "isNoteRequired": {
          "type": ["boolean", "null"]
        },
        "isContentSummaryRequired": {
          "type": ["boolean", "null"]
        },
        "isKnowledgebaseContent": {
          "type": ["boolean", "null"]
        },
        "isCustomerFacing": {
          "type": ["boolean", "null"]
        },
        "canAttachVisionLiveRecording": {
          "type": ["boolean", "null"]
        },
        "traits": {
          "type": ["array", "null"],
          "items": {
            "type": "string"
          }
        },
        "choice": {
          "type": ["object", "null"],
          "properties": {
            "options": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "minChoices": {
              "type": ["number", "null"]
            },
            "maxChoices": {
              "type": ["number", "null"]
            },
            "chosen": {
              "type": ["array", "null"],
              "items": {
                "type": "string"
              }
            }
          }
        }
      },
    }

    expect(rxSchema.definitions.JobStep).toEqual(expected)
  })
})
