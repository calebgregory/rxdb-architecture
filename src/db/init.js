const { createDB, createEphemeralDB } = require('./db')

module.exports.initDB = async function initDB() {
  const db = await createDB()

  await db.addCollections({
    jobs: {
      schema: require('./schema/jobs.json')
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
      schema: require('./schema/jobs.json')
    },
    content: {
      schema: require('./schema/content.json')
    },
    view: {
      schema: require('./schema/view.json')
    },
  })
}
