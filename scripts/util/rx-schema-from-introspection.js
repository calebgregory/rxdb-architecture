/**
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
*/

module.exports._indexByName = _indexByName
module.exports._xfFieldToProperty = _xfFieldToProperty
module.exports.rxSchemaFromIntrospection = rxSchemaFromIntrospection

const SCALARS_TO_TYPE = {
  ID: "string",
  String: "string",
  Int: "number",
  Boolean: "boolean",
}

function _indexByName(ds) {
  return ds.reduce((acc, d) => { acc[d.name] = d; return acc }, {})
}

function _scalarToType(typeName) {
  const type = SCALARS_TO_TYPE[typeName]
  if (!type) {
    throw new Error(`scalar type {${typeName}} has no configured mapping :(`)
  }
  return type
}

function _objectTypeFromName(typesByName, typeName) {
  const objectType = typesByName[typeName]
  if (!objectType) {
    throw new Error(`No OBJECT type found with name {${type.name}}`)
  }
  return objectType
}

function _xfTypeToPropertyType(typesByName, type) {
  if (type.kind === 'NON_NULL') {
    return _xfTypeToPropertyType(typesByName, type.ofType)
  }

  if (type.kind === 'SCALAR') {
    return { type: _scalarToType(type.name) }
  }

  if (type.kind === 'LIST') {
    return {
      type: 'array',
      items: _xfTypeToPropertyType(typesByName, type.ofType)
    }
  }

  if (type.kind === 'OBJECT') {
    return {
      type: 'object',
      properties: _xfFieldsToProperties(
        typesByName,
        _objectTypeFromName(typesByName, type.name).fields
      )
    }
  }
}

function _xfFieldToProperty(typesByName, field) {
  return { [field.name]: _xfTypeToPropertyType(typesByName, field.type) }
}

function _xfFieldsToProperties(typesByName, fields) {
  return fields.reduce((acc, f) => ({ ...acc, ..._xfFieldToProperty(typesByName, f) }), {})
}

function rxSchemaFromIntrospection(introspection) {
  const typesByName = _indexByName(introspection.__schema.types)

  return {
    definitions: introspection.__schema.types
      .filter((t) => t.kind === 'OBJECT' && !t.name.startsWith('__'))
      .reduce((acc, type) => {
        acc[type.name] = _xfTypeToPropertyType(typesByName, type)
        return acc
      }, {})
  }
}
