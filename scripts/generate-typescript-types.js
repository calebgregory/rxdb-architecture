/**
 * https://www.graphql-code-generator.com/docs/getting-started/programmatic-usage
 *
 * future resources?:
 *   - https://github.com/graphql/graphql-js/blob/a546aca77922beb2fee949ea0ad7c9234f7006fd/docs/APIReference-TypeSystem.md
 *   - https://graphql.org/graphql-js/utilities/#buildschema
 *   - https://www.graphql-tools.com/docs/scalars
 *   - https://github.com/urigo/graphql-scalars
 */
const fs = require('fs')
const path = require('path')
const { buildSchema, printSchema, parse } = require('graphql')
const { codegen } = require('@graphql-codegen/core')

const log = require('debug')('[xf]')

const TYPESCRIPT_TYPES_CONFIG = {
  plugins: [
    {
      typescript: {
        immutableTypes: false, // we'd like this to be true, but they are incompatible with our test fixtures
        skipTypename: true,
      }
    },
  ],
  pluginMap: {
    typescript: require('@graphql-codegen/typescript'),
  }
}

const TEST_FIXTURES_CONFIG = {
  plugins: [
    {
      typescript: {
        immutableTypes: false,
        skipTypename: true,
      }
    },
    {
      '@homebound/graphql-typescript-factories': {}
    }
  ],
  pluginMap: {
    typescript: require('@graphql-codegen/typescript'),
    '@homebound/graphql-typescript-factories': require('@homebound/graphql-typescript-factories'),
  }
}

function xfToTypescriptTypes(baseConfig, filename, sourceDocument) {
  // graphql-lib does not know how to parse AWSDateTime or AWSJSON :(
  const schema = buildSchema(sourceDocument.replace(/(AWSDateTime|AWSJSON)/g, 'String'))

  const config = {
    ...baseConfig,
    filename,
    schema: parse(printSchema(schema)),
  }

  return codegen(config)
}

function makeGenerator(baseConfig, ext) {
  return async (srcDir, destDir, file) => {
    const srcPath = path.join(srcDir, file)
    const destPath = path.join(destDir, file.replace(/schema\.graphql/, ext))

    log('->', srcPath)
    const sourceDocument = fs.readFileSync(srcPath, 'utf8')

    const generated = await xfToTypescriptTypes(baseConfig, destPath, sourceDocument)

    fs.writeFileSync(destPath, generated)
    log('<-', destPath)

    log('done')
  }
}

module.exports.generateTypescriptTypes = makeGenerator(TYPESCRIPT_TYPES_CONFIG, 'd.ts')
module.exports.generateTestFixtures = makeGenerator(TEST_FIXTURES_CONFIG, 'ts')
