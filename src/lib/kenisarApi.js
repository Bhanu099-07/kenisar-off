import { supabase } from './supabaseClient'
import { resolveRoleFromEmail } from '../config/admin'

export const SUPABASE_CONFIG_ERROR =
  'Kenisar is not connected yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable accounts and dashboards.'

const organizationProfileFields =
  'user_id, organization_name, contact_name, email, website, organization_type, city, description'

const opportunityPublicFields = `
  id,
  title,
  description,
  opportunity_type,
  location,
  remote_or_in_person,
  commitment,
  eligibility,
  skills_gained,
  deadline,
  application_link,
  contact_email,
  status,
  organization_id,
  created_at,
  updated_at,
  organization_profiles(${organizationProfileFields})
`

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

function buildStudentProfilePayload(userId, values = {}) {
  return {
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
}

function buildOrganizationProfilePayload(userId, values = {}) {
  return {
    user_id: userId,
    city: values.city?.trim() || null,
    contact_name: values.contact_name?.trim() || null,
    description: values.description?.trim() || null,
    email: values.email?.trim() || null,
    organization_name: values.organization_name?.trim() || null,
    organization_type: values.organization_type?.trim() || null,
    website: values.website?.trim() || null,
  }
}

function getUserRole(user, fallbackRole) {
  return resolveRoleFromEmail(user?.email, user?.user_metadata?.role ?? fallbackRole ?? null)
}

export async function upsertUserProfile(userId, role) {
  ensureSupabase()

  const { data, error } = await supabase
    .from('user_profiles')
    .upsert(
      {
        role,
        user_id: userId,
      },
      { onConflict: 'user_id' },
    )
    .select('*')
    .single()

  handleError(error, 'Unable to save your account role.')
  return data
}

export async function ensureStudentProfileExists(user) {
  ensureSupabase()

  const role = getUserRole(user, 'student')
  await upsertUserProfile(user.id, role)

  if (role === 'admin') {
    return null
  }

  const payload = buildStudentProfilePayload(user.id, {
    email: user.email,
    full_name: user.user_metadata?.full_name,
  })

  const { error } = await supabase.from('student_profiles').upsert(payload, {
    ignoreDuplicates: true,
    onConflict: 'user_id',
  })

  handleError(error, 'Unable to create your student profile automatically.')
  return getStudentProfile(user.id)
}

export async function ensureOrganizationProfileExists(user) {
  ensureSupabase()

  const role = getUserRole(user, 'organization')
  await upsertUserProfile(user.id, role)

  if (role === 'admin') {
    return null
  }

  const payload = buildOrganizationProfilePayload(user.id, {
    contact_name: user.user_metadata?.contact_name,
    email: user.email,
    organization_name: user.user_metadata?.organization_name,
  })

  const { error } = await supabase.from('organization_profiles').upsert(payload, {
    ignoreDuplicates: true,
    onConflict: 'user_id',
  })

  handleError(error, 'Unable to create your organization profile automatically.')
  return getOrganizationProfile(user.id)
}

export async function provisionStudentAccountProfile(user, values = {}) {
  ensureSupabase()

  const role = getUserRole(user, 'student')
  await upsertUserProfile(user.id, role)

  if (role === 'admin') {
    return null
  }

  return upsertStudentProfile(user.id, {
    email: user.email,
    full_name: user.user_metadata?.full_name,
    ...values,
  })
}

export async function provisionOrganizationAccountProfile(user, values = {}) {
  ensureSupabase()

  const role = getUserRole(user, 'organization')
  await upsertUserProfile(user.id, role)

  if (role === 'admin') {
    return null
  }

  return upsertOrganizationProfile(user.id, {
    contact_name: user.user_metadata?.contact_name,
    email: user.email,
    organization_name: user.user_metadata?.organization_name,
    ...values,
  })
}

export async function signUpStudent({ email, fullName, password }) {
  ensureSupabase()

  const assignedRole = resolveRoleFromEmail(email, 'student')

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: assignedRole,
      },
    },
  })

  handleError(error, 'Unable to create your student account.')

  if (data.session?.user) {
    try {
      await provisionStudentAccountProfile(data.session.user, {
        email,
        full_name: fullName,
      })
    } catch (profileError) {
      throw new Error(
        profileError.message ||
          "Your student account was created, but Kenisar couldn't finish creating your student profile.",
      )
    }
  }

  return {
    ...data,
    assignedRole,
  }
}

export async function signUpOrganization({ contactName, email, organizationName, password }) {
  ensureSupabase()

  const assignedRole = resolveRoleFromEmail(email, 'organization')

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        contact_name: contactName,
        organization_name: organizationName,
        role: assignedRole,
      },
    },
  })

  handleError(error, 'Unable to create your organization account.')

  if (data.session?.user) {
    try {
      await provisionOrganizationAccountProfile(data.session.user, {
        contact_name: contactName,
        email,
        organization_name: organizationName,
      })
    } catch (profileError) {
      throw new Error(
        profileError.message ||
          "Your organization account was created, but Kenisar couldn't finish creating your organization profile.",
      )
    }
  }

  return {
    ...data,
    assignedRole,
  }
}

export async function signInWithPassword({ email, password }) {
  ensureSupabase()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  handleError(error, 'Unable to sign in.')
  return {
    ...data,
    resolvedRole: resolveRoleFromEmail(data.user?.email, data.user?.user_metadata?.role ?? null),
  }
}

export async function getStudentProfile(userId) {
  ensureSupabase()

  const { data, error } = await supabase.from('student_profiles').select('*').eq('user_id', userId).maybeSingle()
  handleError(error, 'Unable to load your student profile.')
  return data
}

export async function upsertStudentProfile(userId, values) {
  ensureSupabase()

  const { data, error } = await supabase
    .from('student_profiles')
    .upsert(buildStudentProfilePayload(userId, values), { onConflict: 'user_id' })
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

  const { data, error } = await supabase
    .from('organization_profiles')
    .upsert(buildOrganizationProfilePayload(userId, values), { onConflict: 'user_id' })
    .select('*')
    .single()

  handleError(error, 'Unable to save your organization profile.')
  return data
}

export async function getApprovedOpportunities() {
  ensureSupabase()

  const { data, error } = await supabase
    .from('opportunities')
    .select(opportunityPublicFields)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  handleError(error, 'Unable to load approved opportunities.')
  return data ?? []
}

export async function getApprovedOpportunityById(opportunityId) {
  ensureSupabase()

  const { data, error } = await supabase
    .from('opportunities')
    .select(opportunityPublicFields)
    .eq('id', opportunityId)
    .eq('status', 'approved')
    .maybeSingle()

  handleError(error, 'Unable to load this opportunity.')
  return data
}

export async function getPublicOrganizationProfileById(organizationId) {
  ensureSupabase()

  const [profileResult, opportunitiesResult] = await Promise.all([
    supabase
      .from('organization_profiles')
      .select(organizationProfileFields)
      .eq('user_id', organizationId)
      .maybeSingle(),
    supabase
      .from('opportunities')
      .select(opportunityPublicFields)
      .eq('organization_id', organizationId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false }),
  ])

  handleError(profileResult.error, 'Unable to load this organization.')
  handleError(opportunitiesResult.error, 'Unable to load opportunities for this organization.')

  return {
    opportunities: opportunitiesResult.data ?? [],
    profile: profileResult.data,
  }
}

export async function getAdminReviewOpportunities() {
  ensureSupabase()

  const [opportunitiesResult, organizationProfilesResult] = await Promise.all([
    supabase
      .from('opportunities')
      .select('id, title, description, opportunity_type, location, created_at, deadline, status, organization_id')
      .in('status', ['pending', 'approved', 'rejected'])
      .order('created_at', { ascending: false }),
    supabase.from('organization_profiles').select('user_id, organization_name'),
  ])

  handleError(opportunitiesResult.error, 'Unable to load opportunities for admin review.')
  handleError(organizationProfilesResult.error, 'Unable to load organization names for admin review.')

  const organizationMap = new Map(
    (organizationProfilesResult.data ?? []).map((item) => [item.user_id, item.organization_name || 'Organization']),
  )

  return (opportunitiesResult.data ?? []).map((item) => ({
    ...item,
    organization_name: organizationMap.get(item.organization_id) ?? 'Organization',
  }))
}

export async function reviewOpportunityStatus(opportunityId, status) {
  ensureSupabase()

  if (!['approved', 'rejected'].includes(status)) {
    throw new Error('Invalid review status.')
  }

  const { data, error } = await supabase
    .from('opportunities')
    .update({ status })
    .eq('id', opportunityId)
    .select('id, status')
    .single()

  handleError(error, `Unable to mark this opportunity as ${status}.`)
  return data
}

export async function getStudentSavedOpportunities(userId) {
  ensureSupabase()

  const { data, error } = await supabase
    .from('saved_opportunities')
    .select(
      `
        id,
        opportunity_id,
        created_at,
        opportunities(
          ${opportunityPublicFields}
        )
      `,
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
      `
        id,
        opportunity_id,
        action_type,
        status,
        created_at,
        updated_at,
        opportunities(
          ${opportunityPublicFields}
        )
      `,
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

  const existingResult = await supabase
    .from('opportunity_applications')
    .select('id, opportunity_id, action_type, status, created_at, updated_at')
    .eq('student_user_id', userId)
    .eq('opportunity_id', opportunityId)
    .maybeSingle()

  handleError(existingResult.error, 'Unable to check your opportunity activity.')

  if (existingResult.data) {
    return {
      ...existingResult.data,
      duplicate: true,
    }
  }

  const { data, error } = await supabase
    .from('opportunity_applications')
    .insert({
      action_type: actionType,
      opportunity_id: opportunityId,
      status: 'new',
      student_user_id: userId,
    })
    .select('*')
    .single()

  handleError(error, 'Unable to update your opportunity activity.')
  return data
}

export async function getOrganizationOpportunityApplicants(opportunityId) {
  ensureSupabase()

  const { data, error } = await supabase
    .from('opportunity_applications')
    .select(
      `
        id,
        opportunity_id,
        action_type,
        status,
        created_at,
        updated_at,
        opportunities(
          id,
          title,
          organization_id,
          status
        ),
        student_profiles(
          user_id,
          full_name,
          email,
          school,
          grade_or_year,
          city,
          interests,
          skills,
          experience_goals,
          availability,
          resume_link
        )
      `,
    )
    .eq('opportunity_id', opportunityId)
    .order('created_at', { ascending: false })

  handleError(error, 'Unable to load applicants for this opportunity.')
  return data ?? []
}

export async function updateOpportunityApplicationStatus(applicationId, status) {
  ensureSupabase()

  if (!['new', 'reviewed', 'accepted', 'rejected'].includes(status)) {
    throw new Error('Invalid application status.')
  }

  const { data, error } = await supabase
    .from('opportunity_applications')
    .update({ status })
    .eq('id', applicationId)
    .select('id, status')
    .single()

  handleError(error, 'Unable to update this applicant status.')
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
