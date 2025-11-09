const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const mailchimp = require('mailchimp-marketing')

const app = express()
const port = process.env.PORT || 4000

app.use(helmet())
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || '*',
  }),
)
app.use(express.json())

const {
  MAILCHIMP_API_KEY: mailchimpApiKey,
  MAILCHIMP_SERVER_PREFIX: mailchimpServerPrefix,
  MAILCHIMP_AUDIENCE_ID: mailchimpAudienceId,
} = process.env

const mailchimpConfigured = Boolean(mailchimpApiKey && mailchimpServerPrefix)

if (mailchimpConfigured) {
  mailchimp.setConfig({
    apiKey: mailchimpApiKey,
    server: mailchimpServerPrefix,
  })
} else {
  console.warn(
    'Mailchimp is not fully configured. Set MAILCHIMP_API_KEY and MAILCHIMP_SERVER_PREFIX to enable newsletter signups.',
  )
}

const team = [
  {
    name: 'Yasmine Oufkir',
    role: 'Design Director',
    focus: 'Product vision, design systems, accessibility',
  },
  {
    name: 'Bassim Belcheikh',
    role: 'Lead Frontend Engineer',
    focus: 'React platforms, performance, DX automation',
  },
  {
    name: 'Sara Khalfi',
    role: 'Security Engineer',
    focus: 'Application security, threat modeling, compliance',
  },
]

const showcase = [
  {
    slug: 'atlas-banking-portal',
    title: 'Atlas Banking Portal',
    summary: 'Replatformed onboarding for Morocco’s fastest-growing digital bank.',
    metrics: {
      conversionLift: 42,
      uptime: 99.98,
      security: 'OWASP ASVS Level 2',
    },
  },
  {
    slug: 'pulse-health-insights',
    title: 'Pulse Health Insights',
    summary: 'Clinician dashboards with secure collaboration features and HIPAA-ready controls.',
    metrics: {
      insightTime: '7x faster',
      ticketReduction: 35,
      compliance: 'HIPAA, GDPR',
    },
  },
]

app.get('/api/status', (_req, res) => {
  res.json({
    name: 'SynkLab API',
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
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

  if (!mailchimpConfigured || !mailchimpAudienceId) {
    return res.status(503).json({
      error: 'Newsletter signup is temporarily unavailable.',
    })
  }

  try {
    await mailchimp.lists.addListMember(mailchimpAudienceId, {
      email_address: email.trim(),
      status: 'subscribed',
    })

    return res.status(200).json({ message: 'Successfully subscribed.' })
  } catch (error) {
    if (error?.response?.body?.title === 'Member Exists') {
      return res.status(200).json({ message: 'You are already on the list.' })
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

