const express = require('express')
const cors = require('cors')
const helmet = require('helmet')

const app = express()
const port = process.env.PORT || 4000

app.use(helmet())
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || '*',
  }),
)
app.use(express.json())

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

app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.originalUrl,
  })
})

app.listen(port, () => {
  console.log(`SynkLab backend is running on http://localhost:${port}`)
})

