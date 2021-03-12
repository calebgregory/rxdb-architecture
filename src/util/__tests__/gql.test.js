const { stripGqlFields } = require('../gql')

describe('stripGqlFields', () => {
  it('recursively strips __typename and _id on objects and arrays of objects', () => {
    expect(stripGqlFields(require('./fixtures/stripGqlFields.input.json')))
      .toEqual(require('./fixtures/stripGqlFields.output.json'))
  })
})