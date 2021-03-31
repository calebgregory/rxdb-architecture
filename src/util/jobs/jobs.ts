import { Job } from '~/src/gql/types/jobs'

export function getJobTitle(job: Job): string {
  return `${job.workOrderNumber} - ${job.customerName} - ${job.jobLocation}`
}
