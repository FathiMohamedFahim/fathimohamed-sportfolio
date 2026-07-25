// Step 1 of the GitHub OAuth handshake for Decap CMS.
// The CMS admin page opens a popup pointed at this endpoint; we redirect the
// popup to GitHub's authorization screen, telling GitHub to send the user
// back to /api/callback once they approve access.

export default function handler(req, res) {
  const clientId = process.env.GITHUB_CLIENT_ID

  if (!clientId) {
    res.status(500).send(
      'Missing GITHUB_CLIENT_ID environment variable. Set it in your Vercel project settings.'
    )
    return
  }

  const host = req.headers['x-forwarded-host'] || req.headers.host
  const protocol = req.headers['x-forwarded-proto'] || 'https'
  const redirectUri = `${protocol}://${host}/api/callback`

  const authorizeUrl =
    `https://github.com/login/oauth/authorize` +
    `?client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=repo`

  res.writeHead(302, { Location: authorizeUrl })
  res.end()
}
