const path = require('path')
const { gql } = require('@urql/core')
const { Job } = require(path.join(__dirname, './jobs.fragments'))

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
