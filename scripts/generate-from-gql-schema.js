const fs = require('fs')
const path = require('path')

const debug = require('debug')
debug.enable('*')

const { generateRxSchema } = require('./generate-rx-schema')
const { generateTypescriptTypes, generateTestFixtures } = require('./generate-typescript-types')

const srcDir = path.resolve(__dirname, '../app-sync-schema')

const generators = {
  'ts': [generateTypescriptTypes, '../src/gql/types'],
  'rxschema': [generateRxSchema, '../src/db/schema/__generated__'],
  'test-fixtures': [generateTestFixtures, '../src/gql/test-fixtures'],
}

function init(destDir) {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir)
  }
}

(function main(generatorOption) {
  if (!generators[generatorOption]) {
    throw new Error(`invalid argument passed for generator; must provide one of ${Object.keys(generators).toString()}`)
  }

  const [generator, relPathToDestDir] = generators[generatorOption]

  const destDir = path.resolve(__dirname, relPathToDestDir)
  init(destDir)

  const schemaFiles = fs.readdirSync(srcDir)
  for (const file of schemaFiles) {
    generator(srcDir, destDir, file)
  }
})(process.argv[2])
