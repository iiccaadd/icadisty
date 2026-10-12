export const ADMIN_COOKIE = 'icadisty_admin_session'
export const FAMILY_COOKIE = 'icadisty_family_session'

async function sha256(text) {
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return Array.from(new Uint8Array(hash), b => b.toString(16).padStart(2, '0')).join('')
}

// Session token is derived from the password, so it can't be forged without knowing it.
// shortcut: changing ADMIN_SECRET_PASSWORD is the only way to revoke sessions, add a session table if per-device logout is needed
export async function adminToken() {
  const password = process.env.ADMIN_SECRET_PASSWORD
  return password ? sha256('icadisty-admin:' + password) : null
}

// Family (guest-list only) link key and session token, also derived from the admin password.
// shortcut: the family link can only be revoked by changing ADMIN_SECRET_PASSWORD (which also logs out the admin)
export async function familyKey() {
  const password = process.env.ADMIN_SECRET_PASSWORD
  return password ? (await sha256('icadisty-family-link:' + password)).slice(0, 32) : null
}

export async function familyToken() {
  const password = process.env.ADMIN_SECRET_PASSWORD
  return password ? sha256('icadisty-family:' + password) : null
}

export async function isAdmin(request) {
  const token = await adminToken()
  return Boolean(token) && request.cookies.get(ADMIN_COOKIE)?.value === token
}

export async function isFamily(request) {
  const token = await familyToken()
  return Boolean(token) && request.cookies.get(FAMILY_COOKIE)?.value === token
}

// Admin or family: may list and add guests
export async function canManageGuests(request) {
  return (await isAdmin(request)) || (await isFamily(request))
}
