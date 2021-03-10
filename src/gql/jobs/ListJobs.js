const path = require('path')
const { gql } = require('@urql/core')
const { Job } = require(path.resolve(__dirname, './jobs.fragments'))

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
