import { useEffect, useMemo, useState } from 'react'

const services = [
  {
    title: 'Product Strategy & Discovery',
    description:
      'Align stakeholders, surface constraints, and map a roadmap that keeps the team focused on user impact.',
    highlights: ['Vision workshops', 'Technical discovery', 'Foundational KPIs'],
  },
  {
    title: 'Experience & Interface Design',
    description:
      'A minimalist design language with accessibility and clarity at the forefront of every screen we craft.',
    highlights: ['Design systems', 'Interactive prototypes', 'Design QA'],
  },
  {
    title: 'Secure Web Engineering',
    description:
      'Composable React and Node platforms with defense-in-depth baked into every service, deployment, and review.',
    highlights: ['React frontends', 'Node platforms', 'Security by default'],
  },
  {
    title: 'Performance & Lifecycle',
    description:
      'Continuous monitoring and experimentation ensures products stay fast, observable, and user-centered post launch.',
    highlights: ['Performance audits', 'Analytics & DX', 'SLO monitoring'],
  },
]

const process = [
  {
    title: 'Discover & Diagnose',
    description: 'Understand your product vision, customer needs, and existing stack to surface the highest leverage work.',
  },
  {
    title: 'Architect & Prototype',
    description: 'System design and rapid prototyping validate ideas quickly and align cross-functional teams.',
  },
  {
    title: 'Build & Harden',
    description: 'Secure by default engineering, automation, and testing deliver dependable releases at pace.',
  },
  {
    title: 'Launch & Amplify',
    description: 'Launch coordination plus insights and iteration keep experiences healthy and relevant.',
  },
]

const fallbackProjects = [
  {
    name: 'Atlas Banking Portal',
    sector: 'Fintech · Casablanca',
    description:
      'Reimagined onboarding and loan servicing with a modular React architecture, lifting conversion by 42%.',
    tags: ['React', 'Node', 'Design System'],
  },
  {
    name: 'Pulse Health Insights',
    sector: 'Healthtech · Rabat',
    description:
      'Delivered HIPAA-ready analytics dashboards enabling clinicians to surface critical trends in minutes, not days.',
    tags: ['Data Viz', 'Security', 'CI/CD'],
  },
  {
    name: 'Nomad Commerce Platform',
    sector: 'Retail · Remote-first',
    description: 'Scaled a headless commerce experience optimized for global traffic surges during seasonal peaks.',
    tags: ['Headless', 'Performance', 'Observability'],
  },
]

const fallbackTeam = [
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

const testimonials = [
  {
    quote:
      'SynkLab gave us the confidence to relaunch with enterprise standards. Security reviews that took weeks now finish in days.',
    name: 'Maya Idrissi',
    role: 'CTO, Atlas Banking Collective',
  },
  {
    quote:
      'Their designers and engineers operate as one unit. Our product velocity doubled without sacrificing code quality.',
    name: 'Jonas Becker',
    role: 'Head of Product, Nomad Commerce',
  },
]

const insights = [
  {
    title: 'Securing React Apps in Highly Regulated Industries',
    date: 'October 22, 2025',
  },
  {
    title: 'The Performance Toolkit We Bring to Every Launch',
    date: 'September 14, 2025',
  },
  {
    title: 'Designing Composable Design Systems for Fast-moving Teams',
    date: 'August 30, 2025',
  },
]

const navLinks = ['Services', 'Work', 'Process', 'About', 'Insights']
const stats = [
  { label: 'Products launched', value: '30+' },
  { label: 'Average uptime', value: '99.95%' },
  { label: 'Critical incidents', value: '0' },
]

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000'
const THEME_KEY = 'synklab-theme'

const getStoredTheme = () => {
  if (typeof window === 'undefined') return null
  const stored = window.localStorage.getItem(THEME_KEY)
  return stored === 'light' || stored === 'dark' ? stored : null
}

const getInitialTheme = () => {
  const stored = getStoredTheme()
  return stored ?? 'light'
}

function App() {
  const [projects, setProjects] = useState(fallbackProjects)
  const [team, setTeam] = useState(fallbackTeam)
  const [apiError, setApiError] = useState(null)
  const [theme, setTheme] = useState(getInitialTheme)
  const [showThemePrompt, setShowThemePrompt] = useState(() => (getStoredTheme() ? false : true))
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterStatus, setNewsletterStatus] = useState('idle')

  useEffect(() => {
    const controller = new AbortController()

    async function loadContent() {
      try {
        const [teamRes, showcaseRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/team`, { signal: controller.signal }),
          fetch(`${API_BASE_URL}/api/showcase`, { signal: controller.signal }),
        ])

        if (!teamRes.ok || !showcaseRes.ok) {
          throw new Error('Failed to load SynkLab data')
        }

        const [{ team: teamPayload }, { projects: projectsPayload }] = await Promise.all([teamRes.json(), showcaseRes.json()])

        if (Array.isArray(teamPayload) && teamPayload.length) {
          setTeam(teamPayload)
        }

        if (Array.isArray(projectsPayload) && projectsPayload.length) {
          const normalized = projectsPayload.map((project) => ({
            name: project.title ?? project.name ?? 'Untitled project',
            sector: project.sector ?? 'Digital Partnership',
            description: project.summary ?? project.description ?? 'High-impact initiative delivered with SynkLab.',
            tags: Array.isArray(project.tags)
              ? project.tags
              : Object.values(project.metrics ?? {}).map((value) => String(value)),
          }))
          setProjects(normalized.length ? normalized : fallbackProjects)
        }

        setApiError(null)
      } catch (error) {
        if (error.name !== 'AbortError') {
          setApiError('Showing live data is temporarily unavailable. Displaying our representative portfolio instead.')
          setTeam(fallbackTeam)
          setProjects(fallbackProjects)
        }
      }
    }

    loadContent()

    return () => controller.abort()
  }, [])

  useEffect(() => {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    window.localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  const teamSplit = useMemo(() => {
    if (team.length <= 2) return [team, []]
    const midpoint = Math.ceil(team.length / 2)
    return [team.slice(0, midpoint), team.slice(midpoint)]
  }, [team])

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
    setShowThemePrompt(false)
  }

  const dismissThemePrompt = () => setShowThemePrompt(false)

  const themeIsDark = theme === 'dark'
  const newsletterMessage =
    newsletterStatus === 'submitted'
      ? 'Thanks for subscribing. You’ll hear from us soon.'
      : newsletterStatus === 'error'
        ? 'Unable to subscribe right now. Please try again.'
        : newsletterStatus === 'invalid'
          ? 'Please enter a valid email address.'
          : null

  const handleNewsletterSubmit = async (event) => {
    event.preventDefault()
    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) {
      setNewsletterStatus('invalid')
      return
    }

    try {
      setNewsletterStatus('loading')
      const response = await fetch(`${API_BASE_URL}/api/newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail.trim() }),
      })

      if (!response.ok) {
        throw new Error('Request failed')
      }

      setNewsletterStatus('submitted')
      setNewsletterEmail('')
    } catch (error) {
      console.error('Newsletter subscription failed', error)
      setNewsletterStatus('error')
    }
  }

  const newsletterButtonLabel = newsletterStatus === 'loading' ? 'Joining...' : 'Join'
  const newsletterDisabled = newsletterStatus === 'loading'

  return (
    <div className="min-h-screen bg-white text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur transition-colors duration-300 dark:border-slate-900 dark:bg-slate-950/70">
        <div className="mx-auto flex max-w-6xl flex-col gap-14 px-6 pb-16 pt-8 sm:gap-16 sm:pb-20 sm:pt-10">
          <nav className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-3">
              <span className="text-base font-semibold tracking-[0.4em] text-sky-600 dark:text-sky-300">SYNKLAB</span>
              <span className="hidden text-slate-500 dark:text-slate-500 sm:inline">Modern Web Engineering</span>
            </div>
            <div className="hidden gap-6 sm:flex">
              {navLinks.map((link) => (
                <a key={link} href={`#${link.toLowerCase()}`} className="hover:text-slate-900 dark:hover:text-slate-100">
                  {link}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={`Switch to ${themeIsDark ? 'light' : 'dark'} theme`}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:text-slate-100"
              >
                {themeIsDark ? (
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                    <path d="M12 3a1 1 0 0 1 .993.883L13 4v1a1 1 0 0 1-1.993.117L11 5V4a1 1 0 0 1 1-1Zm6.364 2.05a1 1 0 0 1 1.414 1.415l-.707.707a1 1 0 0 1-1.414-1.415Zm-12.728 0a1 1 0 0 1 0 1.415l-.707.707a1 1 0 0 1-1.414-1.415l.707-.707a1 1 0 0 1 1.414 0ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm9 4a1 1 0 0 1 .117 1.993L21 13h-1a1 1 0 0 1-.117-1.993L20 11h1Zm-16 0a1 1 0 0 1 .117 1.993L5 13H4a1 1 0 0 1-.117-1.993L4 11h1Zm14.071 6.536a1 1 0 0 1 0 1.415l-.707.707a1 1 0 1 1-1.414-1.415l.707-.707a1 1 0 0 1 1.414 0ZM6.343 17.95a1 1 0 0 1 0 1.414l-.707.708a1 1 0 1 1-1.414-1.415l.707-.707a1 1 0 0 1 1.414 0ZM12 19a1 1 0 0 1 .993.883L13 20v1a1 1 0 0 1-1.993.117L11 21v-1a1 1 0 0 1 1-1Z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                    <path d="M12 2.75a.75.75 0 0 1 .743.648l.007.102v1a.75.75 0 0 1-1.493.102L11.25 4.5v-1A.75.75 0 0 1 12 2.75Zm7.25 8.5a.75.75 0 0 1 .102 1.493L19.25 12.75h-1a.75.75 0 0 1-.102-1.493L18.25 11.25h1Zm-13.5 0a.75.75 0 0 1 .102 1.493L4.75 12.75h-1a.75.75 0 0 1-.102-1.493L3.75 11.25h1Zm11.157-6.032a.75.75 0 0 1 1.04-.026l.079.072.707.707a.75.75 0 0 1-.97 1.134l-.079-.072-.707-.707a.75.75 0 0 1-.07-.977zm-9.514 0a.75.75 0 0 1 1.04-.026l.079.072.707.707a.75.75 0 0 1-.97 1.134l-.079-.072-.707-.707a.75.75 0 0 1-.07-.977ZM12 6.75a5.25 5.25 0 1 1 0 10.5 5.25 5.25 0 0 1 0-10.5Zm0 1.5a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5Zm7.053 10.197a.75.75 0 0 1 .977-.07l.084.073.707.707a.75.75 0 0 1-.97 1.134l-.079-.073-.707-.707a.75.75 0 0 1-.012-1.064Zm-14.106 0a.75.75 0 0 1 .979-.07l.079.073.707.707a.75.75 0 1 1-1.05 1.07l-.079-.073-.707-.707a.75.75 0 0 1-.012-1.064ZM12 19.5a.75.75 0 0 1 .743.648l.007.102v1a.75.75 0 0 1-1.493.102L11.25 21.25v-1A.75.75 0 0 1 12 19.5Z" />
                  </svg>
                )}
              </button>
              <a
                href="#contact"
                className="hidden text-sky-600 transition-colors hover:text-sky-700 dark:text-sky-300 dark:hover:text-sky-200 md:inline"
              >
                Start project →
              </a>
            </div>
          </nav>

          <div className="grid gap-12 lg:grid-cols-[1fr_0.85fr] lg:items-end">
            <div className="space-y-8">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-400 dark:text-slate-500">Design × Engineering × Security</p>
              <h1 className="text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl lg:text-[3.5rem] dark:text-slate-50">
                Minimalist, resilient digital experiences built to scale with your business.
              </h1>
              <p className="max-w-xl text-base text-slate-600 dark:text-slate-400">
                SynkLab blends product strategy, interface design, and secure engineering into one delivery rhythm. We focus on clarity,
                performance, and trust.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center rounded-full border border-sky-500 px-6 py-2 text-sm font-medium text-sky-600 transition-colors hover:bg-sky-50 dark:border-sky-400 dark:text-sky-300 dark:hover:bg-sky-400/10"
                >
                  Book a strategy call
                </a>
                <a
                  href="#work"
                  className="text-sm text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  View work archive
                </a>
              </div>
            </div>

            <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-colors dark:border-slate-900 dark:bg-slate-900/40 dark:shadow-none">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Active engagements</p>
                <p className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Multidisciplinary pods, concise communication, and dependable shipping cadence.
                </p>
              </div>
              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                {[
                  { name: 'Atlas Banking', focus: 'Design system refresh', status: 'On track' },
                  { name: 'Pulse Health', focus: 'Secure reporting', status: 'Security review' },
                  { name: 'Nomad Commerce', focus: 'Performance uplift', status: 'Testing' },
                ].map(({ name, focus, status }) => (
                  <div key={name} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-200">{name}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">{focus}</p>
                    </div>
                    <span className="text-xs text-sky-600 dark:text-sky-300">{status}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-slate-400 dark:text-slate-500">
                {['React 19', 'Node.js', 'Tailwind', 'TypeScript', 'Playwright', 'OWASP ASVS'].map((item) => (
                  <span key={item} className="rounded-full border border-slate-200 px-3 py-1 dark:border-slate-800">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-6 border-t border-slate-200 pt-10 text-sm text-slate-500 dark:border-slate-900 dark:text-slate-400 sm:grid-cols-3">
            {stats.map(({ label, value }) => (
              <div key={label}>
                <p className="text-2xl font-semibold text-sky-600 dark:text-sky-300">{value}</p>
                <p className="mt-2 uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-24 px-6 py-24">
        <section id="services" className="space-y-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500 dark:text-slate-500">Services</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-950 sm:text-4xl dark:text-slate-50">Minimal flows, reliable systems</h2>
            </div>
            <p className="max-w-2xl text-base text-slate-600 dark:text-slate-400">
              Strategy, design, engineering, and lifecycle all share the same table so craftsmanship stays lean and consistent.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {services.map(({ title, description, highlights }) => (
              <article
                key={title}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-900 dark:bg-slate-900/40 dark:shadow-none"
              >
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  {highlights.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-sky-500 dark:bg-sky-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="work" className="space-y-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500 dark:text-slate-500">Featured Work</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-950 sm:text-4xl dark:text-slate-50">Outcomes with our partners</h2>
            </div>
            <a href="#contact" className="text-sm font-semibold text-sky-600 transition-colors hover:text-sky-700 dark:text-sky-300 dark:hover:text-sky-200">
              Let’s build your next release →
        </a>
      </div>
          <div className="grid gap-4 md:grid-cols-3">
            {projects.map(({ name, sector, description, tags }) => (
              <article
                key={name}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-900 dark:bg-slate-900/40 dark:shadow-none"
              >
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-500">{sector}</p>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{name}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>
                <div className="mt-auto flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-500">
                  {tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-slate-200 px-3 py-1 dark:border-slate-800">
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="process" className="space-y-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500 dark:text-slate-500">Process</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-950 sm:text-4xl dark:text-slate-50">Measured, transparent delivery</h2>
            </div>
            <p className="max-w-xl text-base text-slate-600 dark:text-slate-400">
              Every engagement is anchored by open communication, measurable goals, and frequent feedback loops.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {process.map(({ title, description }, index) => (
              <article
                key={title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-900 dark:bg-slate-900/40 dark:shadow-none"
              >
                <div className="flex items-start gap-4">
                  <span className="text-sm font-semibold text-sky-600 dark:text-sky-300">{String(index + 1).padStart(2, '0')}</span>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="about" className="space-y-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500 dark:text-slate-500">About</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-950 sm:text-4xl dark:text-slate-50">The product pod behind SynkLab</h2>
            </div>
            <p className="max-w-xl text-base text-slate-600 dark:text-slate-400">
              Designers, engineers, and security specialists collaborating shoulder-to-shoulder to ship resilient experiences.
        </p>
      </div>
          {apiError ? (
            <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 px-5 py-4 text-sm text-amber-200">{apiError}</div>
          ) : null}
          <div className="grid gap-4 md:grid-cols-2">
            {teamSplit.map((column, columnIndex) => (
              <div key={columnIndex} className="space-y-4">
                {column.map(({ name, role, focus }) => (
                  <article
                    key={name}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-900 dark:bg-slate-900/40 dark:shadow-none"
                  >
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-500">Team</p>
                    <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-50">{name}</h3>
                    <p className="text-sm font-medium text-sky-600 dark:text-sky-300">{role}</p>
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{focus}</p>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500 dark:text-slate-500">Testimonials</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-950 sm:text-4xl dark:text-slate-50">Partners who scale with SynkLab</h2>
            </div>
            <p className="max-w-xl text-base text-slate-600 dark:text-slate-400">
              Senior leaders trust our team to launch high-impact initiatives without surprises.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {testimonials.map(({ quote, name, role }) => (
              <blockquote
                key={name}
                className="flex h-full flex-col justify-between gap-6 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-colors dark:border-slate-900 dark:bg-slate-900/40 dark:shadow-none"
              >
                <p className="text-base text-slate-700 dark:text-slate-200">“{quote}”</p>
                <footer>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{name}</p>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-500">{role}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </section>

        <section id="insights" className="space-y-6">
          <div className="flex flex-col gap-3">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500 dark:text-slate-500">Insights</p>
            <h2 className="text-3xl font-semibold text-slate-950 sm:text-4xl dark:text-slate-50">How we think about tomorrow’s web</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {insights.map(({ title, date }) => (
              <article
                key={title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-900 dark:bg-slate-900/40 dark:shadow-none"
              >
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-500">{date}</p>
                <h3 className="mt-3 text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
                <a
                  href="#contact"
                  className="mt-5 inline-flex items-center text-sm font-semibold text-sky-600 transition-colors hover:text-sky-700 dark:text-sky-300 dark:hover:text-sky-200"
                >
                  Continue reading →
                </a>
              </article>
            ))}
          </div>
        </section>

        <section id="newsletter" className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm transition-colors dark:border-slate-900 dark:bg-slate-900/40 dark:shadow-none sm:p-12">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500 dark:text-slate-500">Newsletter</p>
              <h2 className="text-3xl font-semibold text-slate-950 sm:text-4xl dark:text-slate-50">Ship Notes in your inbox</h2>
              <p className="text-base text-slate-600 dark:text-slate-400">
                A monthly digest covering performance wins, security tactics, and design systems that keep SynkLab’s products resilient.
              </p>
              {newsletterMessage ? (
                <p
                  className={`text-sm ${
                    newsletterStatus === 'submitted'
                      ? 'text-emerald-600 dark:text-emerald-300'
                      : 'text-amber-600 dark:text-amber-300'
                  }`}
                  role="status"
                  aria-live="polite"
                >
                  {newsletterMessage}
                </p>
              ) : null}
            </div>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-4 sm:flex-row">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={newsletterEmail}
                onChange={(event) => {
                  setNewsletterEmail(event.target.value)
                  if (newsletterStatus !== 'idle') {
                    setNewsletterStatus('idle')
                  }
                }}
                placeholder="you@company.com"
                className="w-full rounded-full border border-slate-300 bg-white px-5 py-3 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-sky-500"
                disabled={newsletterDisabled}
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full border border-sky-500 bg-sky-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-80 dark:border-sky-400 dark:bg-sky-400 dark:text-slate-950 dark:hover:bg-sky-300"
                disabled={newsletterDisabled}
              >
                {newsletterButtonLabel}
              </button>
            </form>
          </div>
        </section>

        <section
          id="contact"
          className="rounded-3xl border border-slate-200 bg-slate-100 p-10 text-slate-900 shadow-sm transition-colors dark:border-slate-900 dark:bg-slate-900/40 dark:text-slate-100 dark:shadow-none sm:p-12"
        >
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500 dark:text-slate-500">Let’s collaborate</p>
              <h2 className="text-3xl font-semibold text-slate-950 sm:text-4xl dark:text-slate-50">
                Ready to ship software that stays simple, fast, and secure?
              </h2>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Share your goals and we’ll assemble a focused team that fits your roadmap, velocity, and budget.
              </p>
            </div>
            <div className="flex flex-col gap-4 text-sm text-slate-800 dark:text-slate-200">
              <a
                href="mailto:hello@synklab.com"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 font-semibold text-slate-900 transition-colors hover:border-slate-400 dark:border-slate-800 dark:text-slate-100 dark:hover:border-slate-600"
              >
                hello@synklab.com
              </a>
              <a
                href="tel:+212763327811"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 font-semibold text-slate-900 transition-colors hover:border-slate-400 dark:border-slate-800 dark:text-slate-100 dark:hover:border-slate-600"
              >
                +212 763327811
              </a>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-500">Response time &lt; 48 hours</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white transition-colors dark:border-slate-900 dark:bg-slate-950">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12 text-sm text-slate-500 dark:text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-base font-semibold text-slate-900 dark:text-slate-200">SynkLab</p>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-600">Rabat · Remote-first</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <a href="https://github.com/s1vrn" className="hover:text-slate-700 dark:hover:text-slate-300" target="_blank" rel="noreferrer">
              s1vrn
            </a>
            <a href="mailto:hello@synklab.com" className="hover:text-slate-700 dark:hover:text-slate-300">
              hello@synklab.com
            </a>
            <a href="#insights" className="hover:text-slate-700 dark:hover:text-slate-300">
              Latest insights
            </a>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-600">© {new Date().getFullYear()} SynkLab. All rights reserved.</p>
        </div>
      </footer>

      {showThemePrompt && (
        <div className="fixed bottom-6 right-6 z-50 max-w-xs rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          <div className="space-y-3">
            <p className="font-medium text-slate-800 dark:text-slate-100">Prefer darker vibes?</p>
            <p>Switch to our Night mode for a low-light experience.</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex flex-1 items-center justify-center rounded-full border border-sky-500 px-3 py-2 text-xs font-semibold text-sky-600 transition-colors hover:bg-sky-50 dark:border-sky-300 dark:text-sky-200 dark:hover:bg-sky-300/20"
              >
                Switch to dark
              </button>
              <button
                type="button"
                onClick={dismissThemePrompt}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-700 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-200"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
