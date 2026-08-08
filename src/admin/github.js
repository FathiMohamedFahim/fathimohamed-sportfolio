// Thin wrapper around GitHub's Contents API. Used to read and write the
// JSON data files directly, and to upload images, straight from the browser
// using the OAuth token from /api/auth + /api/callback.

const OWNER = 'FathiMohamedFahim'
const REPO = 'fathimohamed-sportfolio'
const BRANCH = 'main'
const API_BASE = `https://api.github.com/repos/${OWNER}/${REPO}`

function authHeaders(token) {
  return {
    Authorization: `token ${token}`,
    Accept: 'application/vnd.github+json',
  }
}

// atob/btoa are byte-based, not UTF-8 aware, so multi-byte characters
// (Arabic text, curly quotes, emoji, etc.) get mangled unless we go through
// TextEncoder/TextDecoder explicitly.
function utf8ToBase64(str) {
  const bytes = new TextEncoder().encode(str)
  let binary = ''
  bytes.forEach(b => {
    binary += String.fromCharCode(b)
  })
  return btoa(binary)
}

function base64ToUtf8(base64) {
  const binary = atob(base64.replace(/\n/g, ''))
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return new TextDecoder('utf-8').decode(bytes)
}

/**
 * Fetch a JSON file's parsed content plus its git sha (needed to update it).
 */
export async function getJsonFile(token, path) {
  const res = await fetch(`${API_BASE}/contents/${path}?ref=${BRANCH}`, {
    headers: authHeaders(token),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(`Failed to load ${path}: ${res.status} ${body.message || ''}`)
  }

  const data = await res.json()
  const text = base64ToUtf8(data.content)
  return { json: JSON.parse(text), sha: data.sha }
}

/**
 * Write a JSON file back to the repo. Requires the sha of the version you
 * loaded, so GitHub can detect if someone/something else changed it since.
 */
export async function updateJsonFile(token, path, jsonValue, sha, message) {
  const content = utf8ToBase64(JSON.stringify(jsonValue, null, 2) + '\n')

  const res = await fetch(`${API_BASE}/contents/${path}`, {
    method: 'PUT',
    headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: message || `Update ${path} via admin panel`,
      content,
      sha,
      branch: BRANCH,
    }),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    if (res.status === 409) {
      throw new Error(
        'This file changed on GitHub since you loaded it (maybe from another tab). Refresh and try again.'
      )
    }
    throw new Error(`Failed to save ${path}: ${res.status} ${body.message || ''}`)
  }

  const data = await res.json()
  return { sha: data.content.sha }
}

/**
 * Upload an image file to public/designs-img/uploads/<filename> and return
 * the public path to use as an image src on the site.
 */
const ALLOWED_IMAGE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'image/svg+xml',
]
const MAX_IMAGE_BYTES = 8 * 1024 * 1024 // 8 MB

/**
 * Checks a file before it's uploaded. Returns null if the file is fine, or
 * a user-facing error string if it isn't. Deliberately checked client-side
 * before any network call — GitHub's Contents API has no size/type limit of
 * its own, and a bad upload becomes a permanent commit in git history.
 */
export function validateImageFile(file) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return `"${file.name}" isn't a supported image type. Use PNG, JPEG, WEBP, GIF, or SVG.`
  }
  if (file.size > MAX_IMAGE_BYTES) {
    const mb = (file.size / (1024 * 1024)).toFixed(1)
    return `"${file.name}" is ${mb} MB, which is over the 8 MB limit. Compress it and try again.`
  }
  return null
}

export async function uploadImage(token, file) {
  const safeName = file.name.replace(/\s+/g, '-').toLowerCase()
  const path = `public/designs-img/uploads/${Date.now()}-${safeName}`

  const arrayBuffer = await file.arrayBuffer()
  const bytes = new Uint8Array(arrayBuffer)
  let binary = ''
  bytes.forEach(b => {
    binary += String.fromCharCode(b)
  })
  const content = btoa(binary)

  const res = await fetch(`${API_BASE}/contents/${path}`, {
    method: 'PUT',
    headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: `Upload image via admin panel: ${safeName}`,
      content,
      branch: BRANCH,
    }),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(`Image upload failed: ${res.status} ${body.message || ''}`)
  }

  return `/designs-img/uploads/${path.split('/').pop()}`
}

/**
 * Confirms the token actually works and returns basic user info, used right
 * after login to validate before showing the dashboard.
 */
export async function getAuthenticatedUser(token) {
  const res = await fetch('https://api.github.com/user', {
    headers: authHeaders(token),
  })
  if (!res.ok) throw new Error('GitHub token is invalid or expired.')
  return res.json()
}

/**
 * Fetch recent commits touching src/data/ (the content files this admin
 * panel edits), for the activity feed on the dashboard.
 */
export async function getRecentActivity(token, limit = 8) {
  const res = await fetch(
    `${API_BASE}/commits?path=src/data&per_page=${limit}`,
    { headers: authHeaders(token) }
  )
  if (!res.ok) return []
  const commits = await res.json()
  return commits.map(c => ({
    sha: c.sha,
    message: c.commit.message,
    author: c.commit.author.name,
    date: c.commit.author.date,
    url: c.html_url,
  }))
}
