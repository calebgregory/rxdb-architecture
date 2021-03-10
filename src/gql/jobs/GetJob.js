const { gql } = require('@urql/core')
const { Job } = require('~/src/gql/jobs/jobs.fragments')

module.exports.GetJob = gql`
  query GetJob($id: ID!) {
    getJob(input: { id: $id }) {
      job {
        ...Job
      }
    }
  }
  ${Job}
`
