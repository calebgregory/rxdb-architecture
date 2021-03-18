export function getJobTitle(job: { [key: string]: any }): string {
  return `${job.workOrderNumber} - ${job.customerName} - ${job.jobLocation}`
}
