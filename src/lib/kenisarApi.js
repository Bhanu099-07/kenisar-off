import { supabase } from './supabaseClient'

export const SUPABASE_CONFIG_ERROR =
  'Kenisar is not connected yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable accounts and dashboards.'

function ensureSupabase() {
  if (!supabase) {
    throw new Error(SUPABASE_CONFIG_ERROR)
  }
}

function normalizeList(value) {
  if (Array.isArray(value)) return value
  if (!value) return []
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function handleError(error, fallbackMessage) {
  if (error) {
    throw new Error(error.message || fallbackMessage)
  }
}

export async function signUpStudent({ email, fullName, password }) {
  ensureSupabase()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: 'student',
      },
    },
  })

  handleError(error, 'Unable to create your student account.')

  if (data.session?.user) {
    await upsertStudentProfile(data.session.user.id, {
      email,
      full_name: fullName,
    })
  }

  return data
}

export async function signUpOrganization({ contactName, email, organizationName, password }) {
  ensureSupabase()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        contact_name: contactName,
        organization_name: organizationName,
        role: 'organization',
      },
    },
  })

  handleError(error, 'Unable to create your organization account.')

  if (data.session?.user) {
    await upsertOrganizationProfile(data.session.user.id, {
      contact_name: contactName,
      email,
      organization_name: organizationName,
    })
  }

  return data
}

export async function signInWithPassword({ email, password }) {
  ensureSupabase()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  handleError(error, 'Unable to sign in.')
  return data
}

export async function getStudentProfile(userId) {
  ensureSupabase()

  const { data, error } = await supabase.from('student_profiles').select('*').eq('user_id', userId).maybeSingle()
  handleError(error, 'Unable to load your student profile.')
  return data
}

export async function upsertStudentProfile(userId, values) {
  ensureSupabase()

  const payload = {
    user_id: userId,
    availability: values.availability?.trim() || null,
    city: values.city?.trim() || null,
    email: values.email?.trim() || null,
    experience_goals: values.experience_goals?.trim() || null,
    full_name: values.full_name?.trim() || null,
    grade_or_year: values.grade_or_year?.trim() || null,
    interests: normalizeList(values.interests),
    resume_link: values.resume_link?.trim() || null,
    school: values.school?.trim() || null,
    skills: normalizeList(values.skills),
  }

  const { data, error } = await supabase
    .from('student_profiles')
    .upsert(payload, { onConflict: 'user_id' })
    .select('*')
    .single()

  handleError(error, 'Unable to save your student profile.')
  return data
}

export async function getOrganizationProfile(userId) {
  ensureSupabase()

  const { data, error } = await supabase.from('organization_profiles').select('*').eq('user_id', userId).maybeSingle()
  handleError(error, 'Unable to load your organization profile.')
  return data
}

export async function upsertOrganizationProfile(userId, values) {
  ensureSupabase()

  const payload = {
    user_id: userId,
    city: values.city?.trim() || null,
    contact_name: values.contact_name?.trim() || null,
    description: values.description?.trim() || null,
    email: values.email?.trim() || null,
    organization_name: values.organization_name?.trim() || null,
    organization_type: values.organization_type?.trim() || null,
    website: values.website?.trim() || null,
  }

  const { data, error } = await supabase
    .from('organization_profiles')
    .upsert(payload, { onConflict: 'user_id' })
    .select('*')
    .single()

  handleError(error, 'Unable to save your organization profile.')
  return data
}

export async function getApprovedOpportunities() {
  ensureSupabase()

  const { data, error } = await supabase
    .from('opportunities')
    .select(
      'id, title, description, opportunity_type, location, remote_or_in_person, commitment, eligibility, skills_gained, deadline, application_link, contact_email, status, organization_id',
    )
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  handleError(error, 'Unable to load approved opportunities.')
  return data ?? []
}

export async function getStudentSavedOpportunities(userId) {
  ensureSupabase()

  const { data, error } = await supabase
    .from('saved_opportunities')
    .select(
      'id, opportunity_id, created_at, opportunities(id, title, description, opportunity_type, location, remote_or_in_person, commitment, deadline, status)',
    )
    .eq('student_user_id', userId)
    .order('created_at', { ascending: false })

  handleError(error, 'Unable to load saved opportunities.')
  return data ?? []
}

export async function getStudentApplications(userId) {
  ensureSupabase()

  const { data, error } = await supabase
    .from('opportunity_applications')
    .select(
      'id, opportunity_id, action_type, created_at, opportunities(id, title, description, opportunity_type, location, remote_or_in_person, commitment, deadline, status)',
    )
    .eq('student_user_id', userId)
    .order('created_at', { ascending: false })

  handleError(error, 'Unable to load your opportunity activity.')
  return data ?? []
}

export async function saveOpportunity(userId, opportunityId) {
  ensureSupabase()

  const { data, error } = await supabase
    .from('saved_opportunities')
    .upsert(
      {
        opportunity_id: opportunityId,
        student_user_id: userId,
      },
      { onConflict: 'student_user_id,opportunity_id' },
    )
    .select('*')
    .single()

  handleError(error, 'Unable to save this opportunity.')
  return data
}

export async function removeSavedOpportunity(userId, opportunityId) {
  ensureSupabase()

  const { error } = await supabase
    .from('saved_opportunities')
    .delete()
    .eq('student_user_id', userId)
    .eq('opportunity_id', opportunityId)

  handleError(error, 'Unable to remove this saved opportunity.')
}

export async function recordOpportunityAction(userId, opportunityId, actionType) {
  ensureSupabase()

  const { data, error } = await supabase
    .from('opportunity_applications')
    .upsert(
      {
        action_type: actionType,
        opportunity_id: opportunityId,
        student_user_id: userId,
      },
      { onConflict: 'student_user_id,opportunity_id' },
    )
    .select('*')
    .single()

  handleError(error, 'Unable to update your opportunity activity.')
  return data
}

export async function getOrganizationOpportunities(userId) {
  ensureSupabase()

  const { data, error } = await supabase
    .from('opportunities')
    .select('*')
    .eq('organization_id', userId)
    .order('updated_at', { ascending: false })

  handleError(error, 'Unable to load your listings.')
  return data ?? []
}

export async function getOpportunityById(opportunityId) {
  ensureSupabase()

  const { data, error } = await supabase.from('opportunities').select('*').eq('id', opportunityId).maybeSingle()
  handleError(error, 'Unable to load this opportunity.')
  return data
}

export async function upsertOpportunity(userId, values) {
  ensureSupabase()

  const payload = {
    application_link: values.application_link?.trim() || null,
    commitment: values.commitment?.trim() || null,
    contact_email: values.contact_email?.trim() || null,
    deadline: values.deadline || null,
    description: values.description?.trim() || null,
    eligibility: values.eligibility?.trim() || null,
    id: values.id || undefined,
    location: values.location?.trim() || null,
    opportunity_type: values.opportunity_type?.trim() || null,
    organization_id: userId,
    remote_or_in_person: values.remote_or_in_person?.trim() || null,
    skills_gained: values.skills_gained?.trim() || null,
    status: values.status,
    title: values.title?.trim() || null,
  }

  const { data, error } = await supabase.from('opportunities').upsert(payload).select('*').single()
  handleError(error, 'Unable to save this opportunity.')
  return data
}

export function calculateProfileCompletion(profile, fields) {
  if (!profile) return 0

  const completed = fields.filter((field) => {
    const value = profile[field]
    if (Array.isArray(value)) return value.length > 0
    return Boolean(value && `${value}`.trim())
  })

  return Math.round((completed.length / fields.length) * 100)
}
