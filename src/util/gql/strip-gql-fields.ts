type dict = { [key: string]: any }

function stripFields(fieldsToDelete: string[], obj: dict): dict {
  const copy = { ...obj }

  const recur = (o: dict): dict => {
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

export function stripGqlFields(obj: dict): dict {
  return stripFields(['__typename', '_id'], obj)
}
