// https://github.com/wittydeveloper/graphql-to-json-schema
const fs = require('fs')
const path = require('path')
const { graphqlSync, getIntrospectionQuery } = require('graphql')
const { buildSchema } = require('graphql/utilities/buildASTSchema')
const { rxSchemaFromIntrospection } = require('./util/rx-schema-from-introspection')

const log = require('debug')('[xf]')

function xfToRxSchema(sourceDocument) {
  // graphql-lib does not know how to parse AWSDateTime or AWSJSON :(
  const schema = buildSchema(sourceDocument.replace(/(AWSDateTime|AWSJSON)/g, 'String'))
  const introspection = graphqlSync(schema, getIntrospectionQuery()).data
  const rxSchema = rxSchemaFromIntrospection(introspection)
  return rxSchema
}

module.exports.generateRxSchema = function generateRxSchema(srcDir, destDir, file) {
  const srcPath = path.join(srcDir, file)
  const destPath = path.join(destDir, (file+'.json').replace(/schema\.graphql/, 'rxschema'))

  log('->', srcPath)
  const sourceDocument = fs.readFileSync(srcPath, 'utf8')

  const rxSchema = xfToRxSchema(sourceDocument)

  fs.writeFileSync(destPath, JSON.stringify(rxSchema, null, 2), 'utf8')
  log('<-', destPath)

  log('done')
}
