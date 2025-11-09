import { Fragment, useEffect, useMemo, useState } from 'react'

const services = [
  {
    title: 'Product Strategy & Discovery',
    description:
      'Align stakeholders, surface technical constraints, and map the milestones that turn ambition into a deliverable roadmap.',
    highlights: ['Vision workshops', 'Technical due diligence', 'Foundational KPIs'],
  },
  {
    title: 'Experience & Interface Design',
    description:
      'Human-centered systems crafted with usability, accessibility, and brand expression at the core.',
    highlights: ['Design systems', 'Collaborative prototyping', 'Design QA'],
  },
  {
    title: 'Secure Web Engineering',
    description:
      'Robust full-stack delivery built with modern frameworks, hardened infrastructure, and automated quality gates.',
    highlights: ['React frontends', 'Node platforms', 'Security by default'],
  },
  {
    title: 'Performance & Lifecycle',
    description:
      'Continuous insight into real-world usage with observability, experimentation, and iteration baked in.',
    highlights: ['Perf audits', 'Analytics & DX', 'SLO monitoring'],
  },
]

const process = [
  {
    title: 'Discover & Diagnose',
    description: 'We dig into your product vision, existing stack, and customer needs to uncover the opportunities worth shipping.',
  },
  {
    title: 'Architect & Prototype',
    description: 'System design, rapid prototyping, and collaborative feedback loops ensure every experience is validated early.',
  },
  {
    title: 'Build & Harden',
    description: 'Engineering excellence, secure-by-default pipelines, and automated testing produce resilient, maintainable releases.',
  },
  {
    title: 'Launch & Amplify',
    description: 'We orchestrate launch, measure impact, and iterate based on real-time insights to keep your product ahead.',
  },
]

const fallbackProjects = [
  {
    name: 'Atlas Banking Portal',
    sector: 'Fintech · Casablanca',
    description:
      'Reimagined digital onboarding and loan servicing with a modular React architecture, lifting conversion by 42%.',
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
    description:
      'Scalable headless commerce experience optimized for global traffic spikes during seasonal campaigns.',
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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000'

function App() {
  const [projects, setProjects] = useState(fallbackProjects)
  const [team, setTeam] = useState(fallbackTeam)
  const [apiError, setApiError] = useState(null)

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

  const teamSplit = useMemo(() => {
    if (team.length <= 2) return [team, []]
    const midpoint = Math.ceil(team.length / 2)
    return [team.slice(0, midpoint), team.slice(midpoint)]
  }, [team])

  return (
    <div className="bg-slate-950 text-slate-100">
      <header className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.25),_transparent_55%)]" />
        <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 pb-24 pt-10 lg:pt-12">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-sky-400/40 bg-sky-400/10 text-lg font-semibold text-sky-300">
                SL
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-slate-400">SynkLab</p>
                <p className="text-base font-medium text-slate-100">Modern Web Engineering</p>
              </div>
            </div>
            <div className="hidden items-center gap-8 text-sm font-medium text-slate-300 lg:flex">
              {navLinks.map((link) => (
                <a key={link} href={`#${link.toLowerCase()}`} className="hover:text-slate-100">
                  {link}
                </a>
              ))}
            </div>
            <a
              href="#contact"
              className="hidden rounded-full bg-sky-400 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-300 lg:inline-flex"
            >
              Book a Strategy Call
            </a>
            <button className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-700 text-slate-300 lg:hidden">
              <span className="sr-only">Open navigation</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.35em] text-sky-300">
                Built with designers & engineers in sync
              </div>
              <div className="space-y-6">
                <h1 className="text-4xl font-semibold leading-tight text-slate-50 sm:text-5xl lg:text-6xl">
                  Modern, secure, and high-performance digital experiences crafted by SynkLab.
                </h1>
                <p className="max-w-xl text-lg text-slate-300">
                  We pair imaginative design with rigorous engineering to launch products that earn trust, scale globally, and grow
                  your business.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center rounded-full bg-sky-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
                >
                  Start a project
                </a>
                <a
                  href="#work"
                  className="inline-flex items-center justify-center rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-500"
                >
                  Explore our work
                </a>
              </div>
              <div className="grid gap-6 sm:grid-cols-3">
                {[
                  { value: '30+', label: 'Products launched' },
                  { value: '99.95%', label: 'Average uptime' },
                  { value: '0 critical', label: 'Security incidents' },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                    <p className="text-2xl font-semibold text-sky-300">{stat.value}</p>
                    <p className="text-sm text-slate-400">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="pointer-events-none absolute inset-0 -z-10 rounded-[3rem] border border-slate-800/60 bg-slate-900/40 blur-3xl" />
              <div className="relative rounded-[2.5rem] border border-slate-800 bg-slate-900/70 p-8 shadow-[0_20px_90px_rgba(8,47,73,0.45)]">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 p-[1px]">
                      <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-950 text-lg font-semibold text-slate-100">
                        ⚡️
                      </div>
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-[0.3em] text-slate-500">SynkLab Pulse</p>
                      <p className="text-lg font-semibold text-slate-100">Weekly delivery snapshot</p>
                    </div>
                  </div>
                  <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-950/60 p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-widest text-slate-500">Active Sprints</p>
                        <p className="text-2xl font-semibold text-slate-50">4</p>
                      </div>
                      <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300">
                        On track
                      </span>
                    </div>
                    <div className="space-y-3">
                      {[
                        { name: 'Atlas Banking', status: 'Design QA', progress: 76 },
                        { name: 'Pulse Health', status: 'Security review', progress: 58 },
                        { name: 'Nomad Commerce', status: 'Performance tuning', progress: 88 },
                      ].map(({ name, status, progress }) => (
                        <Fragment key={name}>
                          <div className="flex items-center justify-between text-sm text-slate-300">
                            <span>{name}</span>
                            <span className="text-xs text-slate-500">{status}</span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                            <div className="h-full rounded-full bg-gradient-to-r from-sky-400 to-indigo-500" style={{ width: `${progress}%` }} />
                          </div>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6">
                    <p className="text-xs uppercase tracking-widest text-slate-500">Core Stack</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {['React 19', 'Node.js', 'TypeScript', 'Tailwind CSS', 'Playwright', 'OWASP ASVS'].map((item) => (
                        <span key={item} className="rounded-full border border-slate-800 px-3 py-1 text-xs text-slate-300">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-24 px-6 py-24">
        <section id="services" className="space-y-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Services</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-50 sm:text-4xl">A team that ships end-to-end</h2>
            </div>
            <p className="max-w-2xl text-base text-slate-400">
              From the first strategy session to ongoing optimization, our designers and engineers work as one product team to keep
              momentum high and handoffs minimal.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {services.map(({ title, description, highlights }) => (
              <article key={title} className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/50 p-8">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-500/0 via-sky-500/0 to-sky-500/0 transition-opacity duration-500 group-hover:via-sky-500/10 group-hover:to-indigo-500/10" />
                <div className="relative space-y-4">
                  <h3 className="text-xl font-semibold text-slate-50">{title}</h3>
                  <p className="text-sm text-slate-400">{description}</p>
                  <ul className="space-y-2 text-sm text-slate-300">
                    {highlights.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="work" className="space-y-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Featured Work</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-50 sm:text-4xl">Outcomes we deliver with our partners</h2>
            </div>
            <a href="#contact" className="text-sm font-semibold text-sky-300 hover:text-sky-200">
              Let’s build your next release →
            </a>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {projects.map(({ name, sector, description, tags }) => (
              <article key={name} className="flex h-full flex-col justify-between gap-6 rounded-3xl border border-slate-800 bg-slate-900/50 p-7">
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{sector}</p>
                  <h3 className="text-xl font-semibold text-slate-50">{name}</h3>
                  <p className="text-sm text-slate-400">{description}</p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-slate-300">
                  {tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-slate-800 px-3 py-1">
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
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Process</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-50 sm:text-4xl">A proven rhythm for resilient delivery</h2>
            </div>
            <p className="max-w-xl text-base text-slate-400">
              Every engagement is anchored by transparent communication, measurable goals, and a continuous flow of feedback.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {process.map(({ title, description }, index) => (
              <article key={title} className="rounded-3xl border border-slate-800 bg-slate-900/50 p-7">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-950 text-sm font-semibold text-sky-300">
                    {index + 1}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
                    <p className="text-sm text-slate-400">{description}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="about" className="space-y-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">About</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-50 sm:text-4xl">The product pod behind SynkLab</h2>
            </div>
            <p className="max-w-xl text-base text-slate-400">
              Designers, engineers, and security specialists working side-by-side to ship resilient experiences.
            </p>
          </div>
          {apiError ? (
            <div className="rounded-3xl border border-amber-500/40 bg-amber-500/10 px-5 py-4 text-sm text-amber-200">{apiError}</div>
          ) : null}
          <div className="grid gap-6 md:grid-cols-2">
            {teamSplit.map((column, columnIndex) => (
              <div key={columnIndex} className="space-y-6">
                {column.map(({ name, role, focus }) => (
                  <article key={name} className="rounded-3xl border border-slate-800 bg-slate-900/50 p-7">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Team</p>
                    <h3 className="mt-2 text-xl font-semibold text-slate-50">{name}</h3>
                    <p className="text-sm font-medium text-sky-300">{role}</p>
                    <p className="mt-3 text-sm text-slate-400">{focus}</p>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-12">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Testimonials</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-50 sm:text-4xl">Partners who scale with SynkLab</h2>
            </div>
            <p className="max-w-xl text-base text-slate-400">Senior leaders trust our team to launch high-impact initiatives without surprises.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {testimonials.map(({ quote, name, role }) => (
              <blockquote key={name} className="flex h-full flex-col justify-between gap-6 rounded-3xl border border-slate-800 bg-slate-900/50 p-8">
                <p className="text-lg text-slate-200">“{quote}”</p>
                <footer>
                  <p className="text-sm font-semibold text-slate-100">{name}</p>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{role}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </section>

        <section id="insights" className="space-y-8">
          <div className="flex flex-col gap-3">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Insights</p>
            <h2 className="text-3xl font-semibold text-slate-50 sm:text-4xl">How we think about the future of web experiences</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {insights.map(({ title, date }) => (
              <article key={title} className="rounded-3xl border border-slate-800 bg-slate-900/50 p-7">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{date}</p>
                <h3 className="mt-3 text-lg font-semibold text-slate-100">{title}</h3>
                <a href="#contact" className="mt-5 inline-flex items-center text-sm font-semibold text-sky-300 hover:text-sky-200">
                  Continue reading →
                </a>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="overflow-hidden rounded-[3rem] border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 p-10 sm:p-14">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Let’s collaborate</p>
              <h2 className="text-3xl font-semibold text-slate-50 sm:text-4xl">
                Ready to ship software that is as resilient as it is beautiful?
              </h2>
              <p className="text-base text-slate-300">
                Share your goals and we’ll assemble a cross-disciplinary pod tailored to your roadmap and velocity.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <a
                  href="mailto:hello@synklab.com"
                  className="inline-flex items-center justify-center rounded-full bg-sky-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
                >
                  hello@synklab.com
                </a>
                <a
                  href="tel:+212763327811"
                  className="inline-flex items-center justify-center rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-500"
                >
                  +212 763327811
                </a>
              </div>
            </div>
            <div className="space-y-6 rounded-3xl border border-slate-800 bg-slate-950/70 p-8">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Response time</p>
                <p className="mt-2 text-2xl font-semibold text-slate-50">&lt; 48 hours</p>
              </div>
              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
                  <p className="text-sm text-slate-200">
                    “The SynkLab team integrated seamlessly with our internal squads and never missed a delivery milestone.”
                  </p>
                  <p className="mt-3 text-xs uppercase tracking-[0.25em] text-slate-500">Product Director, Pulse Health</p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
                  <p className="text-sm text-slate-200">
                    “Our revamped experience reduced support tickets by 35% in the first month post-launch.”
                  </p>
                  <p className="mt-3 text-xs uppercase tracking-[0.25em] text-slate-500">COO, Nomad Commerce</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-900 bg-slate-950">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-base font-semibold text-slate-200">SynkLab</p>
            <p className="text-xs uppercase tracking-[0.3em]">Rabat · Remote-first</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <a href="https://github.com/s1vrn" className="hover:text-slate-300" target="_blank" rel="noreferrer">
              s1vrn
            </a>
            <a href="mailto:hello@synklab.com" className="hover:text-slate-300">
              hello@synklab.com
            </a>
            <a href="#insights" className="hover:text-slate-300">
              Latest insights
            </a>
          </div>
          <p className="text-xs text-slate-600">© {new Date().getFullYear()} SynkLab. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
