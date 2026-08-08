// Step 2 of the GitHub OAuth handshake for the admin panel's login flow.
// GitHub redirects here with a one-time ?code=... after the user approves
// access. We exchange that code for a real access token (this exchange must
// happen server-side because it requires the OAuth app's client secret),
// then hand the token back to the admin app's window using a postMessage
// handshake.

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function errorPage(message) {
  const safeMessage = JSON.stringify(message)
  return `
    <!doctype html>
    <html>
      <body>
        <p>${escapeHtml(message)}</p>
        <script>
          if (window.opener) {
            window.opener.postMessage('authorization:github:error:' + ${safeMessage}, '*')
          }
        </script>
      </body>
    </html>
  `
}

export default async function handler(req, res) {
  const { code, error, error_description: errorDescription, state } = req.query

  if (error) {
    res.setHeader('Content-Type', 'text/html')
    res.status(200).send(errorPage(errorDescription || error))
    return
  }

  const clientId = process.env.GITHUB_CLIENT_ID
  const clientSecret = process.env.GITHUB_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    res.setHeader('Content-Type', 'text/html')
    res
      .status(200)
      .send(
        errorPage(
          'Missing GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET environment variable. Set both in your Vercel project settings.'
        )
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
      res.setHeader('Content-Type', 'text/html')
      res.status(200).send(errorPage(tokenData.error_description || tokenData.error))
      return
    }

    const payload = JSON.stringify({ token: tokenData.access_token, provider: 'github', state })

    // Handshake: the popup waits for an ack from the opener, then replies
    // with the token. See AdminApp.jsx for the other half of this.
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
    res.setHeader('Content-Type', 'text/html')
    res.status(200).send(errorPage(`Unexpected error during GitHub OAuth: ${err.message}`))
  }
}
