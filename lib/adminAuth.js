export const ADMIN_COOKIE = 'icadisty_admin_session'

// Session token is derived from the password, so it can't be forged without knowing it.
// shortcut: changing ADMIN_SECRET_PASSWORD is the only way to revoke sessions, add a session table if per-device logout is needed
export async function adminToken() {
  const password = process.env.ADMIN_SECRET_PASSWORD
  if (!password) return null
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('icadisty-admin:' + password))
  return Array.from(new Uint8Array(hash), b => b.toString(16).padStart(2, '0')).join('')
}

export async function isAdmin(request) {
  const token = await adminToken()
  return Boolean(token) && request.cookies.get(ADMIN_COOKIE)?.value === token
}
