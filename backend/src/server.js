const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const { team, showcase } = require('../shared/data')
const { subscribeEmail, isConfigured } = require('../shared/mailchimp')

const app = express()
const port = process.env.PORT || 4000

app.use(helmet())
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || '*',
  }),
)
app.use(express.json())

app.get('/api/status', (_req, res) => {
  res.json({
    name: 'SynkLab API',
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    newsletter: isConfigured() ? 'online' : 'offline',
  })
})

app.get('/api/team', (_req, res) => {
  res.json({ team })
})

app.get('/api/showcase', (_req, res) => {
  res.json({ projects: showcase })
})

app.post('/api/newsletter', async (req, res) => {
  const { email } = req.body || {}

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'A valid email address is required.' })
  }

  try {
    const result = await subscribeEmail(email.trim())
    if (result.status === 'exists') {
      return res.status(200).json({ message: 'You are already on the list.' })
    }
    return res.status(200).json({ message: 'Successfully subscribed.' })
  } catch (error) {
    if (error.code === 'CONFIGURATION_ERROR') {
      return res.status(503).json({
        error: 'Newsletter signup is temporarily unavailable.',
      })
    }

    console.error('Mailchimp error:', error)
    return res.status(502).json({
      error: 'Unable to subscribe right now. Please try again later.',
    })
  }
})

app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.originalUrl,
  })
})

app.listen(port, () => {
  console.log(`SynkLab backend is running on http://localhost:${port}`)
})

