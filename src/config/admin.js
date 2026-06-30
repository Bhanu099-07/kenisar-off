export const ADMIN_EMAIL_ALLOWLIST = ['bhanucharan0999@gmail.com']

function normalizeEmail(email) {
  return email?.trim().toLowerCase() ?? ''
}

export function isAdminEmail(email) {
  return ADMIN_EMAIL_ALLOWLIST.includes(normalizeEmail(email))
}

export function isAdminUser(user) {
  return isAdminEmail(user?.email)
}
