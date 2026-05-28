/* global React */
const { useEffect, useRef, useState, useMemo } = React;

/* ---------- useInView hook ---------- */
function useInView(opts = {}) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        });
      },
      { rootMargin: opts.rootMargin || '50px', threshold: opts.threshold ?? 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, shown];
}

/* ---------- FadeIn ---------- */
function FadeIn({ as = 'div', children, delay = 0, duration = 0.7, x = 0, y = 30, className = '', style = {} }) {
  const [ref, shown] = useInView();
  const Comp = as;
  return (
    <Comp
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: shown ? 1 : 0,
        transform: shown ? 'translate3d(0, 0, 0)' : `translate3d(${x}px, ${y}px, 0)`,
        transition: `opacity ${duration}s cubic-bezier(0.25,0.1,0.25,1) ${delay}s, transform ${duration}s cubic-bezier(0.25,0.1,0.25,1) ${delay}s`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </Comp>
  );
}

/* ---------- Magnet (mouse-following magnetic effect) ---------- */
/* fullViewport=true → the whole window is the activation area.
   sweep=true → x offset is computed relative to viewport width so the photo traverses the full screen.
   smoothing → fraction of the gap to close per frame (0.05 = very slow & smooth, 0.2 = snappier). */
function Magnet({ children, padding = 150, strength = 3, fullViewport = false, sweep = false, sweepRatio = 0.42, sweepRatioY = null, maxOffset = 60, smoothing = 0.12, className = '', style = {} }) {
  const ref = useRef(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const clamp = (v) => Math.max(-maxOffset, Math.min(maxOffset, v));
    const onMove = (e) => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      let x, y;
      if (sweep) {
        const dx = e.clientX - vw / 2;
        const dy = e.clientY - vh / 2;
        const ry = sweepRatioY == null ? sweepRatio * 0.25 : sweepRatioY;
        x = clamp(dx * sweepRatio * 2);
        y = clamp(dy * ry * 2);
      } else {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        x = clamp(dx / strength);
        y = clamp(dy / strength);
        if (!fullViewport) {
          const within =
            e.clientX > r.left - padding &&
            e.clientX < r.right + padding &&
            e.clientY > r.top - padding &&
            e.clientY < r.bottom + padding;
          if (!within) { x = 0; y = 0; }
        }
      }
      targetRef.current = { x, y };
    };
    const tickFn = () => {
      const t = targetRef.current;
      const c = currentRef.current;
      const nx = c.x + (t.x - c.x) * smoothing;
      const ny = c.y + (t.y - c.y) * smoothing;
      if (Math.abs(nx - c.x) > 0.05 || Math.abs(ny - c.y) > 0.05) {
        currentRef.current = { x: nx, y: ny };
        setTick((v) => (v + 1) % 1e9);
      }
      rafRef.current = requestAnimationFrame(tickFn);
    };
    window.addEventListener('mousemove', onMove);
    rafRef.current = requestAnimationFrame(tickFn);
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [padding, strength, fullViewport, sweep, sweepRatio, maxOffset, smoothing]);
  const c = currentRef.current;
  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        transform: `translate3d(${c.x}px, ${c.y}px, 0)`,
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
}

/* ---------- ContactButton (gradient pill) ---------- */
function ContactButton({ label = 'Contact Me', href = '#contact', className = '' }) {
  return (
    <a
      href={href}
      className={
        'contact-pill inline-block rounded-full text-white font-medium uppercase tracking-widest ' +
        'px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base ' +
        'transition-transform duration-200 hover:scale-[1.02] ' +
        className
      }
    >
      {label}
    </a>
  );
}

/* ---------- LiveProjectButton (ghost pill) ---------- */
function LiveProjectButton({ label = 'Case Study', href = '#' }) {
  return (
    <a
      href={href}
      className="ghost-pill inline-block rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] font-medium uppercase tracking-widest px-6 py-2.5 sm:px-8 sm:py-3 text-xs sm:text-sm whitespace-nowrap"
    >
      {label}
    </a>
  );
}

/* ---------- AnimatedText: per-character scroll opacity ---------- */
function AnimatedText({ text, className = '', style = {} }) {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // offset ['start 0.8', 'end 0.2'] -> top hits 0.8 vh = start; bottom hits 0.2 vh = end
      const startY = 0.8 * vh;
      const endY = 0.2 * vh;
      // progress: how far the element traveled from "top at 0.8vh" to "bottom at 0.2vh"
      const total = (r.height) + (startY - endY);
      const traveled = startY - r.top;
      const p = Math.max(0, Math.min(1, traveled / total));
      setProgress(p);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const chars = useMemo(() => text.split(''), [text]);
  return (
    <p ref={ref} className={className} style={style}>
      {chars.map((c, i) => {
        const start = i / chars.length;
        const end = start + 1 / chars.length;
        const local = Math.max(0, Math.min(1, (progress - start) / (end - start)));
        const opacity = 0.2 + 0.8 * local;
        return (
          <span key={i} style={{ opacity }}>{c}</span>
        );
      })}
    </p>
  );
}

Object.assign(window, { FadeIn, Magnet, ContactButton, LiveProjectButton, AnimatedText, useInView });
