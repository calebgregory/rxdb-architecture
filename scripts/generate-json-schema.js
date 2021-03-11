// https://github.com/wittydeveloper/graphql-to-json-schema
const fs = require('fs')
const path = require('path')
const { graphqlSync, getIntrospectionQuery } = require('graphql')
const { buildSchema } = require('graphql/utilities/buildASTSchema')
const { rxSchemaFromIntrospection } = require('./util/rx-schema-from-introspection')

const srcDir = path.resolve(__dirname, '../app-sync-schema')
const destDir = path.resolve(__dirname, '../src/db/schema/__generated__')

function init() {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir)
  }
}

function xfToRxSchema(sourceDocument) {
  // graphql-lib does not know how to parse AWSDateTime :(
  const schema = buildSchema(sourceDocument.replace(/AWSDateTime/g, 'String'))
  const introspection = graphqlSync(schema, getIntrospectionQuery()).data
  const rxSchema = rxSchemaFromIntrospection(introspection)
  return rxSchema
}

function generateRxSchema(file) {
  const srcPath = path.join(srcDir, file)
  const destPath = path.join(destDir, (file+'.json').replace(/schema\.graphql/, 'rxschema'))

  console.log('->', srcPath)
  const sourceDocument = fs.readFileSync(srcPath, 'utf8')

  const rxSchema = xfToRxSchema(sourceDocument)

  fs.writeFileSync(destPath, JSON.stringify(rxSchema, null, 2), 'utf8')
  console.log('<-', destPath)
}

(function main() {
  init()

  const schemaFiles = fs.readdirSync(srcDir)
  for (const file of schemaFiles) {
    generateRxSchema(file)
  }

  console.log('done')
})()
