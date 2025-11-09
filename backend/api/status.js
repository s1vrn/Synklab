const { isConfigured } = require('../shared/mailchimp')

module.exports = (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method Not Allowed' })
    return
  }

  res.status(200).json({
    name: 'SynkLab API',
    environment: process.env.NODE_ENV || 'production',
    version: '1.0.0',
    newsletter: isConfigured() ? 'online' : 'offline',
  })
}

