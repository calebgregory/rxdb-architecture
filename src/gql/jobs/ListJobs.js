const { gql } = require('@urql/core')
const { Job } = require('~/src/gql/jobs/jobs.fragments')

module.exports.ListJobs = gql`
  query ListJobs($input: ListJobsInput) {
    listJobs(input: $input) {
      jobConnection {
        items {
          ...Job
        }
        nextToken
      }
    }
  }
  ${Job}
`
