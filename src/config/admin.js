export const ADMIN_EMAIL_ALLOWLIST = [
  'bhanucharan0999@gmail.com',
  // TODO: add Sabiha's email here once it is confirmed.
]

function normalizeEmail(email) {
  return email?.trim().toLowerCase() ?? ''
}

export function isAdminEmail(email) {
  return ADMIN_EMAIL_ALLOWLIST.includes(normalizeEmail(email))
}

export function resolveRoleFromEmail(email, fallbackRole = null) {
  return isAdminEmail(email) ? 'admin' : fallbackRole
}

export function isAdminUser(user) {
  return resolveRoleFromEmail(user?.email, user?.user_metadata?.role) === 'admin'
}

export function getDashboardPathForRole(role) {
  if (role === 'admin') return '/dashboard/admin'
  if (role === 'organization') return '/dashboard/organization'
  return '/dashboard/student'
}
