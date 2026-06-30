export function formatDateLabel(value) {
  if (!value) return 'No deadline listed'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export function getOpportunityTitle(opportunity) {
  return opportunity?.title?.trim() || 'Untitled Opportunity'
}

export function getOrganizationName(opportunity) {
  return (
    opportunity?.organization_profiles?.organization_name?.trim() ||
    opportunity?.organization_name?.trim() ||
    'Organization name pending'
  )
}

export function getOpportunityDescription(opportunity) {
  return opportunity?.description?.trim() || 'Details coming soon.'
}

export function getOpportunityLocation(opportunity) {
  return opportunity?.location?.trim() || 'Location not specified'
}

export function getOpportunityMode(opportunity) {
  return opportunity?.remote_or_in_person?.trim() || 'Format not specified'
}

export function getOpportunityCommitment(opportunity) {
  return opportunity?.commitment?.trim() || 'Commitment not specified'
}

export function getOpportunityType(opportunity) {
  return opportunity?.opportunity_type?.trim() || 'Opportunity'
}

export function getOpportunitySkills(opportunity) {
  return opportunity?.skills_gained?.trim() || 'Skills will be shared by the organization.'
}

export function getOpportunityEligibility(opportunity) {
  return opportunity?.eligibility?.trim() || 'Eligibility details coming soon.'
}

export function formatListText(value, fallback = 'Not provided yet') {
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(', ') : fallback
  }

  if (typeof value === 'string' && value.trim()) {
    return value.trim()
  }

  return fallback
}

export function formatOpportunityStatus(status) {
  if (!status) return 'unknown'
  return status.replaceAll('_', ' ')
}
