/** https://www.graphql-code-generator.com/docs/getting-started/programmatic-usage */
const fs = require('fs')
const path = require('path')
const { buildSchema, printSchema, parse } = require('graphql')
const { codegen } = require('@graphql-codegen/core')

const debug = require('debug')
const log = debug('[xf]')
debug.enable('*')

const srcDir = path.resolve(__dirname, '../app-sync-schema')
const destDir = path.resolve(__dirname, '../src/gql/types')

function init() {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir)
  }
}

const CONFIG = {
  plugins: [
    {
      typescript: {
        immutableTypes: true,
        skipTypename: true,
      }
    }
  ],
  pluginMap: {
    typescript: require('@graphql-codegen/typescript'),
  }
}

function xfToTypescriptTypes(filename, sourceDocument) {
  // graphql-lib does not know how to parse AWSDateTime or AWSJSON :(
  const schema = buildSchema(sourceDocument.replace(/(AWSDateTime|AWSJSON)/g, 'String'))

  const config = {
    ...CONFIG,
    filename,
    schema: parse(printSchema(schema)),
  }

  return codegen(config)
}

async function generateTypescriptTypes(file) {
  const srcPath = path.join(srcDir, file)
  const destPath = path.join(destDir, file.replace(/schema\.graphql/, 'd.ts'))

  log('->', srcPath)
  const sourceDocument = fs.readFileSync(srcPath, 'utf8')

  const generated = await xfToTypescriptTypes(destPath, sourceDocument)

  fs.writeFileSync(destPath, generated)
  log('<-', destPath)
  return
}

(function main() {
  init()

  const schemaFiles = fs.readdirSync(srcDir)
  for (const file of schemaFiles) {
    generateTypescriptTypes(file)
  }

  log('done')
})()
