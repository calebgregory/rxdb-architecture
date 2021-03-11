const { createDB, createEphemeralDB } = require('./db')

const jobsSchema = {
  ...require('./schema/jobs.json'),
  ...require('./schema/__generated__/jobs.rxschema.json').definitions.Job
}

module.exports.initDB = async function initDB() {
  const db = await createDB()

  await db.addCollections({
    jobs: {
      schema: jobsSchema,
    },
    content: {
      schema: require('./schema/content.json')
    },
  })
}

module.exports.initEphemeralDB = async function initEphemeralDB() {
  const eph = await createEphemeralDB()

  await eph.addCollections({
    jobs: {
      schema: jobsSchema,
    },
    content: {
      schema: require('./schema/content.json')
    },
    view: {
      schema: require('./schema/view.json')
    },
  })
}
