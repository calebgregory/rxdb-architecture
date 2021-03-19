import { gql } from '@urql/core'


export const UpdateKnowledgebaseContentError = gql`
fragment UpdateKnowledgebaseContentError on UpdateKnowledgebaseContentError {
  message
}

`

export const MediaFormatUrl = gql`
fragment MediaFormatUrl on MediaFormatUrl {
  url
  mediaType
  codingFormats
}

`

export const HttpCookie = gql`
fragment HttpCookie on HttpCookie {
  name
  value
}

`

export const CloudFrontResource = gql`
fragment CloudFrontResource on CloudFrontResource {
  resource
  cookies {
    ...HttpCookie
  }
  expiresAt
}
${HttpCookie}
`

export const VbrLinks = gql`
fragment VbrLinks on VbrLinks {
  cloudFrontResource {
    ...CloudFrontResource
  }
  dashPlaylistSuffix
  hlsPlaylistSuffix
}
${CloudFrontResource}
`

export const ExpiringLink = gql`
fragment ExpiringLink on ExpiringLink {
  url
  expiresAt
  thumbnailUrl
  mediaFormatUrls {
    ...MediaFormatUrl
  }
  vbr {
    ...VbrLinks
  }
}
${MediaFormatUrl}
${VbrLinks}
`

export const UnavailableInfo = gql`
fragment UnavailableInfo on UnavailableInfo {
  message
  error
  verbose
}

`

export const KnowledgebaseDocument = gql`
fragment KnowledgebaseDocument on KnowledgebaseDocument {
  title
  make
  model
  description_short
  description_long
  product_category
  content_category
  tags
}

`

export const XTurkMetadata = gql`
fragment XTurkMetadata on XTurkMetadata {
  make
  model
  serial
  not_data_plate
  not_legible
  not_audible
  transcript
  transcript_tags
}

`

export const VirusScan = gql`
fragment VirusScan on VirusScan {
  at
  status
}

`

export const Content = gql`
fragment Content on Content {
  id
  sha256hex
  lengthBytes
  orgID
  group
  createdAt
  mediaType
  uploadedAt
  uploader
  readLink {
    ...ExpiringLink
  }
  unavailableInfo {
    ...UnavailableInfo
  }
  knowledgebaseDynamic
  knowledgebaseDocument {
    ...KnowledgebaseDocument
  }
  kb_collection_ids
  xturk_metadata {
    ...XTurkMetadata
  }
  refreshMetadataAfter
  summary
  virusScan {
    ...VirusScan
  }
}
${ExpiringLink}
${UnavailableInfo}
${KnowledgebaseDocument}
${XTurkMetadata}
${VirusScan}
`

export const UpdateKnowledgebaseContentResponse = gql`
fragment UpdateKnowledgebaseContentResponse on UpdateKnowledgebaseContentResponse {
  contentId
  content {
    ...Content
  }
  error {
    ...UpdateKnowledgebaseContentError
  }
}
${Content}
${UpdateKnowledgebaseContentError}
`

export const CreateKnowledgebaseContentError = gql`
fragment CreateKnowledgebaseContentError on CreateKnowledgebaseContentError {
  message
}

`

export const MultipartByteRangeOffer = gql`
fragment MultipartByteRangeOffer on MultipartByteRangeOffer {
  start
  length
  expiresAt
  signature
}

`

export const ContentUploader = gql`
fragment ContentUploader on ContentUploader {
  id
  uploadComplete
  uploadLink {
    ...ExpiringLink
  }
  headers
  sha256hex
  lengthBytes
  nextMultipartRangeOffers {
    ...MultipartByteRangeOffer
  }
}
${ExpiringLink}
${MultipartByteRangeOffer}
`

export const CreateKnowledgebaseContentResponse = gql`
fragment CreateKnowledgebaseContentResponse on CreateKnowledgebaseContentResponse {
  content {
    ...Content
  }
  uploader {
    ...ContentUploader
  }
  error {
    ...CreateKnowledgebaseContentError
  }
}
${Content}
${ContentUploader}
${CreateKnowledgebaseContentError}
`

export const JobStepInfo = gql`
fragment JobStepInfo on JobStepInfo {
  jobId
  stepName
}

`

export const UploadInstruction = gql`
fragment UploadInstruction on UploadInstruction {
  contentId
  jobStepInfo {
    ...JobStepInfo
  }
  lengthBytesMismatch
}
${JobStepInfo}
`

export const FileInstruction = gql`
fragment FileInstruction on FileInstruction {
  path
  lengthBytes
  uploadInstructions {
    ...UploadInstruction
  }
  mayDelete
  reasonToRetain
}
${UploadInstruction}
`

export const UploadVerificationResult = gql`
fragment UploadVerificationResult on UploadVerificationResult {
  fileInstructions {
    ...FileInstruction
  }
  nextVerifyAfter
}
${FileInstruction}
`

export const HeaderKeyValue = gql`
fragment HeaderKeyValue on HeaderKeyValue {
  key
  value
}

`

export const MultipartByteRangeGrant = gql`
fragment MultipartByteRangeGrant on MultipartByteRangeGrant {
  start
  length
  url
  headers {
    ...HeaderKeyValue
  }
}
${HeaderKeyValue}
`

export const MultipartGrant = gql`
fragment MultipartGrant on MultipartGrant {
  id
  rangeGrants {
    ...MultipartByteRangeGrant
  }
}
${MultipartByteRangeGrant}
`

export const SearchConnection = gql`
fragment SearchConnection on SearchConnection {
  items {
    ...Content
  }
  nextToken
  predictedCount
}
${Content}
`

export const ExactMatchFilterSuggestions = gql`
fragment ExactMatchFilterSuggestions on ExactMatchFilterSuggestions {
  make
  contentCategory
  productCategory
  mediaType
}

`

export const CompletionSuggestions = gql`
fragment CompletionSuggestions on CompletionSuggestions {
  model
  title
  make
  contentCategory
  productCategory
  tags
}

`

export const PartialQuery = gql`
fragment PartialQuery on PartialQuery {
  text
}

`

export const QuerySuggestionsResult = gql`
fragment QuerySuggestionsResult on QuerySuggestionsResult {
  input {
    ...PartialQuery
  }
  completions {
    ...CompletionSuggestions
  }
  exactMatchFilters {
    ...ExactMatchFilterSuggestions
  }
}
${PartialQuery}
${CompletionSuggestions}
${ExactMatchFilterSuggestions}
`

export const DocPrediction = gql`
fragment DocPrediction on DocPrediction {
  id
  predictedFromContentId
  predictedContentIds
  predictedAt
}

`

export const GetDocPredictionsResult = gql`
fragment GetDocPredictionsResult on GetDocPredictionsResult {
  docPredictions {
    ...DocPrediction
  }
}
${DocPrediction}
`

export const ExactMatchResults = gql`
fragment ExactMatchResults on ExactMatchResults {
  contentCategories
  productCategories
  makes
  mediaTypes
}

`

