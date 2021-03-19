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

function _xfTypeToPropertyType(typesByName, type, isNotNullable = false) {
  const makePropertyType = ({
    'NON_NULL': () => {
      return _xfTypeToPropertyType(typesByName, type.ofType, true) // recur
    },
    'SCALAR': () => {
      return { type: _scalarToType(type.name) }
    },
    'LIST': () => {
      return {
        type: 'array',
        items: _xfTypeToPropertyType(typesByName, type.ofType), // recur
      }
    },
    'OBJECT': () => {
      const { fields } = _objectTypeFromName(typesByName, type.name)
      return {
        type: 'object',
        properties: _xfFieldsToProperties(typesByName, fields), // eventually recur
      }
    },
    'ENUM': () => {
      return { type: 'string' }
    }
  })[type.kind]
  if (!makePropertyType) {
    throw new Error(`no propertyType mapping configured for {${type.kind}} :(`)
  }

  const propertyType = makePropertyType()

  if (type.kind === 'NON_NULL' || isNotNullable) {
    return propertyType
  } else {
    return {
      ...propertyType,
      type: [propertyType.type, 'null']
    }
  }
}

function _xfFieldToProperty(typesByName, field) {
  return { [field.name]: _xfTypeToPropertyType(typesByName, field.type) }
}

function _xfFieldsToProperties(typesByName, fields) {
  return fields.reduce((acc, f) => ({
    ...acc,
    ..._xfFieldToProperty(typesByName, f),
  }), {})
}

// top-level entity
function _xfObjectTypeToDefinition(typesByName, type) {
  return {
    type: "object",
    properties: _xfFieldsToProperties(typesByName, type.fields),
  }
}

function rxSchemaFromIntrospection(introspection) {
  const typesByName = _indexByName(introspection.__schema.types)

  return {
    definitions: introspection.__schema.types
      .filter((t) => t.kind === 'OBJECT' && !t.name.startsWith('__'))
      .reduce((acc, type) => {
        acc[type.name] = _xfObjectTypeToDefinition(typesByName, type)
        return acc
      }, {})
  }
}
