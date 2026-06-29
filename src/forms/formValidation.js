const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(value) {
  return EMAIL_PATTERN.test(value.trim())
}

export function required(value, message) {
  if (!value || !String(value).trim()) {
    return message
  }
  return null
}

export function emailField(value) {
  const requiredError = required(value, 'Please enter your email.')
  if (requiredError) {
    return requiredError
  }
  if (!isValidEmail(value)) {
    return 'Please enter a valid email address.'
  }
  return null
}
