const { gql } = require('@urql/core')

const DeleteJobResult = gql`
fragment DeleteJobResult on DeleteJobResult {
  id
}

`

const Completion = gql`
fragment Completion on Completion {
  completion
  count
}

`

const AutocompleteJobFilterTagsResult = gql`
fragment AutocompleteJobFilterTagsResult on AutocompleteJobFilterTagsResult {
  prefix
  nextCompletions {
    ...Completion
  }
}
${Completion}
`

const User = gql`
fragment User on User {
  id
  family_name
  given_name
}

`

const Note = gql`
fragment Note on Note {
  text
}

`

const DocumentationItem = gql`
fragment DocumentationItem on DocumentationItem {
  contentID
  capturedAt
  originUri
  tags
  sortAsUnixtimeDecimal
  docPredictionIds
}

`

const JobStepChoice = gql`
fragment JobStepChoice on JobStepChoice {
  options
  minChoices
  maxChoices
  chosen
}

`

const JobStep = gql`
fragment JobStep on JobStep {
  name
  documentation {
    ...DocumentationItem
  }
  note {
    ...Note
  }
  isContentRequired
  isNoteRequired
  isContentSummaryRequired
  isKnowledgebaseContent
  isCustomerFacing
  canAttachVisionLiveRecording
  traits
  choice {
    ...JobStepChoice
  }
}
${DocumentationItem}
${Note}
${JobStepChoice}
`

const IntegrationEntityId = gql`
fragment IntegrationEntityId on IntegrationEntityId {
  namespace
  id
}

`

const ProviderRef = gql`
fragment ProviderRef on ProviderRef {
  affiliateId
  providerPathImmediateToRoot
}

`

const WorkflowReference = gql`
fragment WorkflowReference on WorkflowReference {
  group
  id
  providerRef {
    ...ProviderRef
  }
}
${ProviderRef}
`

const ProviderMetadata = gql`
fragment ProviderMetadata on ProviderMetadata {
  id
  providerName
  descriptionOfProviderToAffiliates
}

`

const OrganizationInfo = gql`
fragment OrganizationInfo on OrganizationInfo {
  id
  orgName
}

`

const Job = gql`
fragment Job on Job {
  id
  orgID
  createdAt
  createdBy
  updatedAt
  updatedBy
  completedAt
  owner
  owner_info {
    ...User
  }
  customerName
  jobLocation
  workOrderNumber
  fsmLabel
  tags
  tagSuggestions
  internalNote {
    ...Note
  }
  steps {
    ...JobStep
  }
  workflowName
  integrationEntityId {
    ...IntegrationEntityId
  }
  workflowRef {
    ...WorkflowReference
  }
  workflowProviders {
    ...ProviderMetadata
  }
  orgInfo {
    ...OrganizationInfo
  }
}
${User}
${Note}
${JobStep}
${IntegrationEntityId}
${WorkflowReference}
${ProviderMetadata}
${OrganizationInfo}
`

const JobConnection = gql`
fragment JobConnection on JobConnection {
  items {
    ...Job
  }
  nextToken
}
${Job}
`

const ListJobsResult = gql`
fragment ListJobsResult on ListJobsResult {
  jobConnection {
    ...JobConnection
  }
}
${JobConnection}
`

const JobResult = gql`
fragment JobResult on JobResult {
  job {
    ...Job
  }
}
${Job}
`

export { Job }
