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

module.exports = {
  team,
  showcase,
}

