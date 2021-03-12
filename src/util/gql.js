function stripFields(fieldsToDelete, obj) {
  const copy = { ...obj }

  const recur = (o) => {
    if (Array.isArray(o)) {
      return o.map( recur )
    }

    if (typeof o === 'object' && o !== null) {
      for (const field of fieldsToDelete) {
        delete o[field]
      }

      for (const [key, val] of Object.entries(o)) {
        o[key] = recur(val)
      }
    }

    return o
  }

  return recur(copy)
}

module.exports.stripGqlFields = function stripGqlFields(obj) {
  return stripFields(['__typename', '_id'], obj)
}