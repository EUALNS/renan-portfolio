/* global React, ReactDOM, FadeIn, Magnet, ContactButton, LiveProjectButton, AnimatedText */
const { useEffect, useRef, useState } = React;

/* ============================================================ */
/* DATA                                                          */
/* ============================================================ */
const MARQUEE_IMAGES = [
  'img/structural-1.jpg',
  'img/dynamo-1.jpg',
  'img/plugin-1.jpg',
  'img/plugin-2.jpg',
  'img/vibration-1.jpg',
  'img/vibration-2.jpg',
  'img/dashboard-1.jpg',
  'img/dashboard-2.jpg',
  'img/sustain-1.jpg',
  'img/sustain-2.jpg',
  'img/roof-1.jpg',
  'img/roof-2.jpg',
];
// Tiled placeholders for rows — we'll split visually into two rows
const ROW1 = MARQUEE_IMAGES.slice(0, 6);
const ROW2 = MARQUEE_IMAGES.slice(6);

const SERVICES = [
  { n: '01', name: 'Project Management & CAPEX', desc: 'End-to-end leadership of construction and facilities portfolios — scope, schedule and budget. Over R$10M in CAPEX delivered, dashboards for portfolio control, and direct coordination of stakeholders, suppliers and multidisciplinary teams.' },
  { n: '02', name: 'Innovation & Process Automation', desc: 'Concept-to-delivery of tools that eliminate repetitive engineering work — including a flagship plugin that cut ~4 hours of process per project. Lean Green Belt mindset applied to every workflow.' },
  { n: '03', name: 'AI Applied to Business', desc: 'Autonomous agents, applied AI workflows and data-driven decision support tailored to engineering and operations. Continuous study at FIAP — AI for Business post-graduation.' },
  { n: '04', name: 'Strategic Planning & Leadership', desc: 'Strategic frameworks (OKR, BSC, Business Model Canvas), change management, ESG-aware execution and technical leadership of distributed, multicultural teams.' },
  { n: '05', name: 'International Experience', desc: 'Brazil–Europe trajectory with dual fluency in NBR and Eurocode standards, English C1, and proven delivery in multicultural and remote-first environments — from industrial CAPEX in Brazil to specialty structures in Portugal.' },
];

const PROJECTS = [
  {
    n: '01',
    category: 'Project Management · R$10M CAPEX',
    name: 'Flex Sorocaba — CAPEX & Facilities',
    desc: 'Grew from apprentice to project coordinator, leading a 171-project portfolio with ~R$119k in savings tracked through a custom dashboard. Delivered 20,000 m² of structural reinforcement audited by FM Global and sustainability initiatives (Ecoponto, carport solar) that contributed to the plant\u2019s WEF "Lighthouse" certification — one of the world\u2019s most advanced manufacturing recognitions.',
    href: '#flex',
    img1: 'img/sustain-2.jpg',
    img2: 'img/roof-2.jpg',
    img3: 'img/flex-lighthouse.jpg',
    fit3: 'cover',
    pos3: 'center top',
  },
  {
    n: '02',
    category: 'Innovation · Process Automation',
    name: 'Cetec — Innovation Engineering',
    desc: 'Delivered 5+ Revit / C# plugins and automation routines that eliminated manual work across the technical team. The flagship EstGlobal plugin cut ~4 hours of process per project and reshaped the structural data pipeline. Owned technical analysis and approval (ATP) under NBR and Eurocode using Robot, TQS and Revit.',
    href: '#cetec',
    img1: 'img/vibration-2.jpg',
    img2: 'img/cetec-walls.jpg',
    pos2: 'center top',
    img3: 'img/structural-1.jpg',
  },
  {
    n: '03',
    category: 'International · A400 Portugal',
    name: 'A400 — Brazil to Europe',
    desc: 'Junior BIM Designer (Structural) at A400, supporting the development and coordination of structural BIM models for European and international projects under Eurocode standards. Contributed to the new Basílica de Nossa Senhora da Muxima, a major religious and urban development in Africa designed to accommodate over 200,000 pilgrims, with focus on multidisciplinary coordination, BIM workflows and large-scale project delivery.',
    href: '#a400',
    img1: 'img/muxima-bim.jpg',
    img2: 'img/muxima-aerial.jpg',
    img3: 'img/muxima-bim-iso.jpg',
  },
  {
    n: '04',
    category: 'R&D · Structural Sensing',
    name: 'Vibra — Real-Time Vibration Monitoring',
    desc: 'Academic R&D project: a real-time structural vibration monitoring system using accelerometers and frequency analysis to detect anomalous behaviour vs. the structure\u2019s natural response. Covered hardware, firmware and the analysis pipeline end-to-end.',
    href: '#vibra',
    img1: 'img/vibration-1.jpg',
    img2: 'img/vibration-2.jpg',
    img3: 'img/dashboard-1.jpg',
  },
  {
    n: '05',
    category: 'Awards · Technical Competitions',
    name: 'Competitions & Recognitions',
    desc: 'Two-time champion of the MOLA Structural Kit (2023 and 2024), 1st place in Catapulta (statistical analysis, 2022) and 1st place in CanSat (aerospace simulation, 2019). Selected for the Academic Working Capital (AWC) entrepreneurship program and recognised for direct contribution to Flex Sorocaba\u2019s WEF "Lighthouse" certification.',
    href: '#awards',
    img1: 'img/segments-1.jpg',
    img2: 'img/awards-team.jpg',
    img3: 'img/awards-mola.jpg',
  },
];

/* ============================================================ */
/* NAVBAR                                                        */
/* ============================================================ */
function Navbar() {
  const links = ['About', 'Services', 'Projects', 'Contact'];
  return (
    <FadeIn as="nav" delay={0} y={-20} className="relative z-30 flex items-center justify-between gap-4 px-6 md:px-10 pt-6 md:pt-8 text-[#D7E2EA] font-medium uppercase tracking-wider">
      <a href="#" className="text-sm md:text-base lg:text-[1.15rem] flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-[#D7E2EA]"></span>
        Renan&nbsp;Camargo
      </a>
      <ul className="flex items-center gap-6 sm:gap-10 md:gap-14 text-sm md:text-lg lg:text-[1.4rem]">
        {links.map((l) => (
          <li key={l}>
            <a href={'#' + l.toLowerCase()} className="transition-opacity duration-200 hover:opacity-70">{l}</a>
          </li>
        ))}
      </ul>
    </FadeIn>
  );
}

/* ============================================================ */
/* HERO                                                          */
/* ============================================================ */
function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen flex flex-col overflow-hidden" style={{ background: '#0C0C0C' }}>
      {/* Interactive background */}
      <div className="absolute inset-0 z-0">
        <InteractiveMesh density={2.2} />
      </div>
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(12,12,12,0) 0%, rgba(12,12,12,0.45) 70%, rgba(12,12,12,0.8) 100%)',
        }}
      />
      <div
        className="absolute left-0 right-0 bottom-0 h-[55%] z-[1] pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(12,12,12,0) 0%, rgba(12,12,12,0.55) 55%, rgba(12,12,12,0.92) 100%)',
        }}
      />

      <div className="relative z-10 flex flex-col flex-1">
        <Navbar />

        <div className="flex-1 flex items-end pointer-events-none">
          <div className="w-full max-w-[90%] sm:max-w-xl lg:max-w-3xl px-6 md:px-10 pb-10 md:pb-14 pt-24">
            <FadeIn delay={0.2} y={20}>
              <p className="font-mono-tag uppercase tracking-[0.3em] text-[#D7E2EA]/55 mb-4 text-xs sm:text-sm">
                // project management · innovation · applied ai
              </p>
            </FadeIn>
            <FadeIn delay={0.35} y={30}>
              <h1
                className="hero-heading font-black uppercase tracking-[-0.02em] leading-[0.95] mb-3 md:mb-5"
                style={{ fontSize: 'clamp(2.6rem, 8vw, 6rem)' }}
              >
                renan <br className="hidden sm:block" />camargo
              </h1>
            </FadeIn>
            <FadeIn delay={0.5} y={20}>
              <p
                className="text-[#D7E2EA]/85 font-light leading-tight mb-3 md:mb-5 max-w-2xl"
                style={{ fontSize: 'clamp(1rem, 2.2vw, 1.6rem)' }}
              >
                Engineering, technology and project management across Brazil and Europe.
              </p>
            </FadeIn>
            <FadeIn delay={0.65} y={20}>
              <p
                className="text-[#D7E2EA]/55 font-light leading-relaxed mb-6 md:mb-8 max-w-xl"
                style={{ fontSize: 'clamp(0.9rem, 1.4vw, 1.05rem)' }}
              >
                Civil engineer turned project leader. From R$10M CAPEX portfolios to plugins that
                save hours per project, now applying AI to make engineering faster, more reliable,
                and more humane.
              </p>
            </FadeIn>
            <FadeIn delay={0.8} y={20}>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pointer-events-auto">
                <ContactButton href="#contact" label="Get in touch" />
                <a
                  href="#projects"
                  className="ghost-pill inline-block rounded-full border border-[#D7E2EA]/40 text-[#D7E2EA] font-medium uppercase tracking-widest px-7 py-3 sm:px-8 sm:py-3.5 text-xs sm:text-sm"
                >
                  See projects
                </a>
              </div>
            </FadeIn>
            <FadeIn delay={0.95} y={10}>
              <p className="text-[#D7E2EA]/40 font-mono-tag text-xs uppercase tracking-[0.25em] mt-8 md:mt-10">
                Porto · Sorocaba · 5+ years · Brazil ⇄ Europe
              </p>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================ */
/* MARQUEE                                                       */
/* ============================================================ */
function MarqueeSection() {
  const sectionRef = useRef(null);
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      setOffset((window.scrollY - top + window.innerHeight) * 0.3);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const tripled = (arr) => [...arr, ...arr, ...arr];

  return (
    <section ref={sectionRef} className="pt-24 sm:pt-32 md:pt-40 pb-10 bg-[#0C0C0C] overflow-hidden">
      <div className="flex flex-col gap-3">
        {/* Row 1 — moves right (translateX positive direction adjusted by offset) */}
        <div className="marquee-row flex gap-3" style={{ transform: `translateX(${offset - 600}px)`, willChange: 'transform' }}>
          {tripled(ROW1).map((src, i) => (
            <MarqueeTile key={'r1-' + i} src={src} />
          ))}
        </div>
        {/* Row 2 — moves left */}
        <div className="marquee-row flex gap-3" style={{ transform: `translateX(${-(offset - 600)}px)`, willChange: 'transform' }}>
          {tripled(ROW2).map((src, i) => (
            <MarqueeTile key={'r2-' + i} src={src} />
          ))}
        </div>
      </div>
    </section>
  );
}
function MarqueeTile({ src }) {
  return (
    <div className="shrink-0 w-[300px] sm:w-[360px] md:w-[420px] h-[200px] sm:h-[240px] md:h-[270px] rounded-2xl overflow-hidden bg-[#16161a] border border-white/5">
      <img src={src} alt="" loading="lazy" className="w-full h-full object-cover" />
    </div>
  );
}

/* ============================================================ */
/* ABOUT                                                         */
/* ============================================================ */
function AboutSection() {
  return (
    <section id="about" className="relative min-h-screen px-5 sm:px-8 md:px-10 py-20 flex items-center justify-center overflow-hidden">
      {/* Decorative geometric corners (original, not borrowed) */}
      <FadeIn delay={0.10} x={-80} y={0} duration={0.9} className="absolute top-[6%] left-[2%] sm:left-[3%] md:left-[5%] w-[110px] sm:w-[150px] md:w-[200px]">
        <DecoIsoCube />
      </FadeIn>
      <FadeIn delay={0.25} x={-80} y={0} duration={0.9} className="absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] w-[100px] sm:w-[140px] md:w-[170px]">
        <DecoNodeGraph />
      </FadeIn>
      <FadeIn delay={0.15} x={80} y={0} duration={0.9} className="absolute top-[6%] right-[2%] sm:right-[3%] md:right-[5%] w-[110px] sm:w-[150px] md:w-[200px]">
        <DecoColumn />
      </FadeIn>
      <FadeIn delay={0.30} x={80} y={0} duration={0.9} className="absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] w-[120px] sm:w-[160px] md:w-[210px]">
        <DecoDiamondStack />
      </FadeIn>

      <div className="relative z-10 flex flex-col items-center gap-10 sm:gap-14 md:gap-16 max-w-[680px] mx-auto text-center">
        <FadeIn delay={0} y={40}>
          <h2 className="hero-heading font-black uppercase leading-none tracking-tight" style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}>
            About me
          </h2>
        </FadeIn>

        <div className="flex flex-col gap-16 sm:gap-20 md:gap-24 items-center">
          <AnimatedText
            text={`Civil engineer at the intersection of engineering, technology and project management. I grew from intern to coordinator, managed over R$10M in CAPEX, and built automation tools that gave hours back to my teams. Today I lead with project management, innovation and applied AI — turning complex problems into scalable solutions.`}
            className="text-[#D7E2EA] font-medium leading-relaxed max-w-[600px]"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}
          />
          <FadeIn delay={0.1} y={20}>
            <ContactButton href="#contact" label="Get in touch" />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ============================================================ */
/* SERVICES                                                      */
/* ============================================================ */
function ServicesSection() {
  return (
    <section
      id="services"
      className="relative bg-white text-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32"
    >
      <FadeIn delay={0} y={40}>
        <h2
          className="text-[#0C0C0C] font-black uppercase text-center leading-none tracking-tight mb-16 sm:mb-20 md:mb-28"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          Services
        </h2>
      </FadeIn>

      <div className="max-w-5xl mx-auto">
        {SERVICES.map((s, i) => (
          <FadeIn
            key={s.n}
            delay={i * 0.1}
            y={30}
            className="flex flex-row items-start gap-4 sm:gap-8 md:gap-12 py-8 sm:py-10 md:py-12 border-t"
            style={{ borderColor: 'rgba(12,12,12,0.15)' }}
          >
            <div
              className="font-black text-[#0C0C0C] leading-none shrink-0"
              style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}
            >
              {s.n}
            </div>
            <div className="flex-1 flex flex-col gap-3 sm:gap-4 pt-2">
              <h3
                className="font-medium uppercase tracking-tight leading-tight"
                style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}
              >
                {s.name}
              </h3>
              <p
                className="font-light leading-relaxed max-w-2xl text-[#0C0C0C]"
                style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)', opacity: 0.6 }}
              >
                {s.desc}
              </p>
            </div>
          </FadeIn>
        ))}
        {/* bottom border */}
        <div style={{ borderTop: '1px solid rgba(12,12,12,0.15)' }} />
      </div>
    </section>
  );
}

/* ============================================================ */
/* PROJECTS                                                      */
/* ============================================================ */
function ProjectsSection() {
  return (
    <section
      id="projects"
      className="relative -mt-10 sm:-mt-12 md:-mt-14 z-10 bg-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 pt-24 sm:pt-32 md:pt-40 pb-32"
    >
      <FadeIn delay={0} y={40}>
        <h2
          className="hero-heading font-black uppercase text-center leading-none tracking-tight mb-16 sm:mb-20 md:mb-24"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          Projects
        </h2>
      </FadeIn>

      <div className="max-w-7xl mx-auto">
        {PROJECTS.map((p, i) => (
          <ProjectCard key={p.n} project={p} index={i} total={PROJECTS.length} />
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ project, index, total }) {
  const ref = useRef(null);
  const innerRef = useRef(null);
  const targetScale = 1 - (total - 1 - index) * 0.03;
  useEffect(() => {
    const onScroll = () => {
      const wrap = ref.current;
      const inner = innerRef.current;
      if (!wrap || !inner) return;
      const r = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      // start: top === vh (bottom of viewport), end: top === 0 (top of viewport)
      const total = vh + 0;
      const traveled = vh - r.top;
      const p = Math.max(0, Math.min(1, traveled / total));
      const scale = 1 - (1 - targetScale) * p;
      inner.style.transform = `scale(${scale})`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [targetScale]);

  return (
    <div ref={ref} className="h-screen sticky" style={{ top: `calc(4rem + ${index * 20}px)` }}>
      <div
        ref={innerRef}
        style={{ transformOrigin: 'top center', willChange: 'transform' }}
        className="rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 sm:p-6 md:p-8 h-[calc(100vh-6rem)] flex flex-col"
      >
        {/* Top row */}
        <div className="flex items-start justify-between gap-4 sm:gap-6 md:gap-10 mb-4 sm:mb-6 md:mb-8">
          <div
            className="hero-heading font-black leading-none shrink-0"
            style={{ fontSize: 'clamp(2.5rem, 9vw, 140px)' }}
          >
            {project.n}
          </div>
          <div className="flex-1 flex flex-col gap-1 sm:gap-2 pt-1 sm:pt-3 md:pt-5">
            <span className="font-mono-tag text-[10px] sm:text-xs md:text-sm uppercase tracking-widest text-[#D7E2EA]/60">
              {project.category}
            </span>
            <h3
              className="text-[#D7E2EA] font-medium uppercase tracking-tight leading-tight"
              style={{ fontSize: 'clamp(1.1rem, 2.5vw, 2.4rem)' }}
            >
              {project.name}
            </h3>
            <p
              className="text-[#D7E2EA]/60 font-light leading-relaxed max-w-2xl mt-1 sm:mt-2 hidden sm:block"
              style={{ fontSize: 'clamp(0.7rem, 1.1vw, 1rem)' }}
            >
              {project.desc}
            </p>
          </div>
          <div className="shrink-0 self-start pt-2 sm:pt-4 md:pt-7 hidden sm:block">
            <LiveProjectButton href={project.href} />
          </div>
        </div>

        {/* Two-column image grid */}
        <div className="flex-1 grid grid-cols-12 gap-3 sm:gap-4 md:gap-5 min-h-0">
          <div className="col-span-5 min-h-0">
            <div className="rounded-[24px] sm:rounded-[32px] md:rounded-[40px] overflow-hidden bg-[#16161a] h-full">
              <img
                src={project.img2}
                alt=""
                className={"w-full h-full " + (project.fit2 === 'contain' ? "object-contain p-6 sm:p-8 md:p-10" : "object-cover")}
                style={project.fit2 === 'contain' ? {} : { objectPosition: project.pos2 || 'center' }}
              />
            </div>
          </div>
          <div className="col-span-7 min-h-0">
            <div className="rounded-[24px] sm:rounded-[32px] md:rounded-[40px] overflow-hidden bg-[#16161a] h-full">
              <img
                src={project.img3}
                alt=""
                className={"w-full h-full " + (project.fit3 === 'contain' ? "object-contain p-6 sm:p-8 md:p-10" : "object-cover")}
                style={project.fit3 === 'contain' ? {} : { objectPosition: project.pos3 || 'center' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================ */
/* FOOTER / CONTACT                                              */
/* ============================================================ */
function ContactSection() {
  return (
    <section id="contact" className="relative bg-[#0C0C0C] px-5 sm:px-8 md:px-10 pt-32 pb-16">
      <div className="max-w-6xl mx-auto">
        <FadeIn delay={0} y={40}>
          <p
            className="font-mono-tag uppercase tracking-widest text-[#D7E2EA]/50 mb-6 text-xs sm:text-sm"
          >
            // get in touch
          </p>
          <h2 className="hero-heading font-black uppercase tracking-tight leading-[0.9]" style={{ fontSize: 'clamp(2.5rem, 9vw, 130px)' }}>
            great projects begin<br />with great decisions.
          </h2>
        </FadeIn>

        <FadeIn delay={0.15} y={20} className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
          <ContactLine label="email" value="renanalonsojc4@gmail.com" href="mailto:renanalonsojc4@gmail.com" />
          <ContactLine label="phone (pt)" value="+351 912 434 653" href="https://wa.me/351912434653" />
          <ContactLine label="based in" value="Porto · PT / Sorocaba · BR" />
        </FadeIn>

        <div className="mt-16 sm:mt-20 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-8 pt-8 border-t border-[#D7E2EA]/15">
          <div className="text-[#D7E2EA]/40 font-mono-tag text-xs uppercase tracking-widest">
            © 2026 Renan Camargo · Project Management & Innovation
          </div>
          <div className="flex gap-6 text-[#D7E2EA] uppercase tracking-widest font-medium text-sm">
            <a href="https://www.linkedin.com/in/renan-camargo/" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">LinkedIn</a>
            <a href="https://wa.me/351912434653" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">WhatsApp</a>
            <a href="mailto:renanalonsojc4@gmail.com" className="hover:opacity-70 transition-opacity">Email</a>
          </div>
        </div>
      </div>
    </section>
  );
}
function ContactLine({ label, value, href }) {
  const Cls = "block text-[#D7E2EA] font-medium tracking-tight leading-tight";
  const fs = { fontSize: 'clamp(1.05rem, 2vw, 1.6rem)' };
  return (
    <div>
      <span className="font-mono-tag text-xs uppercase tracking-widest text-[#D7E2EA]/40 block mb-2">— {label}</span>
      {href ? (
        <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined} className={Cls + ' hover:opacity-70 transition-opacity'} style={fs}>{value}</a>
      ) : (
        <span className={Cls} style={fs}>{value}</span>
      )}
    </div>
  );
}

/* ============================================================ */
/* DECORATIVE GEOMETRIC ELEMENTS                                 */
/* ============================================================ */
function DecoIsoCube() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-auto" fill="none" stroke="#D7E2EA" strokeWidth="1.2">
      <polygon points="50,12 86,32 86,72 50,92 14,72 14,32" strokeLinejoin="round" />
      <line x1="50" y1="12" x2="50" y2="52" />
      <line x1="50" y1="52" x2="14" y2="32" />
      <line x1="50" y1="52" x2="86" y2="32" />
      <line x1="50" y1="52" x2="50" y2="92" />
    </svg>
  );
}
function DecoNodeGraph() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-auto" fill="none" stroke="#D7E2EA" strokeWidth="1.2">
      <line x1="20" y1="20" x2="80" y2="50" />
      <line x1="20" y1="20" x2="50" y2="80" />
      <line x1="80" y1="50" x2="50" y2="80" />
      <line x1="80" y1="50" x2="80" y2="22" />
      <circle cx="20" cy="20" r="5" fill="#0C0C0C" />
      <circle cx="80" cy="50" r="5" fill="#0C0C0C" />
      <circle cx="50" cy="80" r="5" fill="#0C0C0C" />
      <circle cx="80" cy="22" r="3" fill="#0C0C0C" />
    </svg>
  );
}
function DecoColumn() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-auto" fill="none" stroke="#D7E2EA" strokeWidth="1.2">
      <rect x="22" y="8" width="56" height="84" />
      <line x1="22" y1="22" x2="78" y2="22" />
      <line x1="22" y1="36" x2="78" y2="36" />
      <line x1="22" y1="50" x2="78" y2="50" />
      <line x1="22" y1="64" x2="78" y2="64" />
      <line x1="22" y1="78" x2="78" y2="78" />
      <line x1="50" y1="8" x2="50" y2="92" />
    </svg>
  );
}
function DecoDiamondStack() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-auto" fill="none" stroke="#D7E2EA" strokeWidth="1.2">
      <polygon points="50,8 90,30 50,52 10,30" />
      <polygon points="50,30 90,52 50,74 10,52" opacity="0.7" />
      <polygon points="50,52 90,74 50,96 10,74" opacity="0.4" />
    </svg>
  );
}

/* ============================================================ */
/* APP                                                           */
/* ============================================================ */
function App() {
  return (
    <main style={{ overflowX: 'clip', background: '#0C0C0C' }}>
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <ContactSection />
    </main>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
