const { subscribeEmail, isConfigured } = require('../shared/mailchimp')

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' })
    return
  }

  const { email } = req.body || {}

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    res.status(400).json({ error: 'A valid email address is required.' })
    return
  }

  try {
    const result = await subscribeEmail(email.trim())
    if (result.status === 'exists') {
      res.status(200).json({ message: 'You are already on the list.' })
      return
    }

    res.status(200).json({ message: 'Successfully subscribed.' })
  } catch (error) {
    if (error.code === 'CONFIGURATION_ERROR' || !isConfigured()) {
      res.status(503).json({ error: 'Newsletter signup is temporarily unavailable.' })
      return
    }

    console.error('Mailchimp error:', error)
    res.status(502).json({ error: 'Unable to subscribe right now. Please try again later.' })
  }
}

