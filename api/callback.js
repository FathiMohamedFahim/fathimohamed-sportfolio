// Step 2 of the GitHub OAuth handshake for Decap CMS.
// GitHub redirects here with a one-time ?code=... after the user approves
// access. We exchange that code for a real access token (this exchange must
// happen server-side because it requires the OAuth app's client secret),
// then hand the token back to the Decap CMS window using the postMessage
// handshake it expects.

export default async function handler(req, res) {
  const { code, error, error_description: errorDescription } = req.query

  if (error) {
    res.status(400).send(`GitHub OAuth error: ${errorDescription || error}`)
    return
  }

  const clientId = process.env.GITHUB_CLIENT_ID
  const clientSecret = process.env.GITHUB_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    res
      .status(500)
      .send(
        'Missing GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET environment variable. Set both in your Vercel project settings.'
      )
    return
  }

  try {
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    })

    const tokenData = await tokenResponse.json()

    if (tokenData.error) {
      res.status(400).send(`GitHub token exchange failed: ${tokenData.error_description || tokenData.error}`)
      return
    }

    const payload = JSON.stringify({ token: tokenData.access_token, provider: 'github' })

    // This is the handshake Decap CMS's GitHub backend expects: the popup
    // waits for a message from the opener, then replies with the token.
    const html = `
      <!doctype html>
      <html>
        <body>
          <script>
            (function() {
              function receiveMessage(message) {
                window.opener.postMessage(
                  'authorization:github:success:${payload.replace(/'/g, "\\'")}',
                  message.origin
                );
                window.removeEventListener('message', receiveMessage, false);
              }
              window.addEventListener('message', receiveMessage, false);
              window.opener.postMessage('authorizing:github', '*');
            })();
          </script>
        </body>
      </html>
    `

    res.setHeader('Content-Type', 'text/html')
    res.status(200).send(html)
  } catch (err) {
    res.status(500).send(`Unexpected error during GitHub OAuth: ${err.message}`)
  }
}
