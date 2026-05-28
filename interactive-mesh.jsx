/* global React */
const { useEffect, useRef } = React;

/* ============================================================
   InteractiveMesh — canvas-based interactive hero background.
   - A field of softly drifting particles connected by thin
     lines when they're close. Distant from a generic "particles"
     demo: lines fade with distance, particles have organic Perlin-
     style drift, and a "mouse field" both attracts nearby particles
     AND deforms a glowing radial spotlight that follows the cursor.
   - Two depth layers (parallax) react to mouse position.
   - Color palette matches the site: cool slate #D7E2EA accents on
     the #0C0C0C dark background, plus a subtle steel-blue glow.
   ============================================================ */
function InteractiveMesh({ density = 1 }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -10000, y: -10000, vx: 0, vy: 0, present: false });
  const stateRef = useRef({ particles: [], w: 0, h: 0, dpr: 1, raf: 0, time: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const init = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = Math.max(140, Math.round((w * h) / 8500) * density);
      const particles = [];
      for (let i = 0; i < target; i++) {
        const depth = Math.random() < 0.35 ? 0 : 1; // 0 = far (small/dim), 1 = near (large/bright)
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18,
          r: depth ? 1.4 + Math.random() * 1.6 : 0.7 + Math.random() * 0.8,
          depth,
          // Slight per-particle phase for breathing
          phase: Math.random() * Math.PI * 2,
          // Frequency
          fSpeed: 0.4 + Math.random() * 0.5,
        });
      }
      stateRef.current = { particles, w, h, dpr, raf: 0, time: 0 };
    };

    const onMouseMove = (e) => {
      const r = canvas.getBoundingClientRect();
      const nx = e.clientX - r.left;
      const ny = e.clientY - r.top;
      mouseRef.current.vx = nx - mouseRef.current.x;
      mouseRef.current.vy = ny - mouseRef.current.y;
      mouseRef.current.x = nx;
      mouseRef.current.y = ny;
      mouseRef.current.present = true;
    };
    const onLeave = () => {
      mouseRef.current.present = false;
      mouseRef.current.x = -10000;
      mouseRef.current.y = -10000;
    };

    const draw = () => {
      const s = stateRef.current;
      s.time += 0.016;
      const { particles, w, h } = s;
      const m = mouseRef.current;

      ctx.clearRect(0, 0, w, h);

      // Vignette spotlight that follows the mouse
      if (m.present) {
        const grad = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, 380);
        grad.addColorStop(0, 'rgba(120, 158, 188, 0.18)');
        grad.addColorStop(0.4, 'rgba(80, 110, 140, 0.07)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }

      // Update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Gentle organic drift via sin offsets (cheap Perlin-ish)
        p.vx += Math.sin(s.time * 0.6 * p.fSpeed + p.phase) * 0.002;
        p.vy += Math.cos(s.time * 0.5 * p.fSpeed + p.phase * 1.3) * 0.002;

        // Mouse repulsion (subtle, varies with depth)
        if (m.present) {
          const dx = p.x - m.x;
          const dy = p.y - m.y;
          const d2 = dx * dx + dy * dy;
          const radius = 180;
          if (d2 < radius * radius) {
            const d = Math.sqrt(d2) || 1;
            const force = ((radius - d) / radius) * (p.depth ? 0.7 : 0.35);
            p.vx += (dx / d) * force * 0.4;
            p.vy += (dy / d) * force * 0.4;
          }
        }

        // Damping
        p.vx *= 0.96;
        p.vy *= 0.96;
        // Cap velocity
        const v = Math.hypot(p.vx, p.vy);
        const maxV = 1.2;
        if (v > maxV) { p.vx = (p.vx / v) * maxV; p.vy = (p.vy / v) * maxV; }

        p.x += p.vx;
        p.y += p.vy;

        // Wrap
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;
      }

      // Draw connections — distance-faded
      const maxDist = 150;
      const maxDistSq = maxDist * maxDist;
      ctx.lineWidth = 0.6;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          if (a.depth !== b.depth) continue;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < maxDistSq) {
            const t = 1 - Math.sqrt(d2) / maxDist;
            const alpha = (a.depth ? 0.22 : 0.10) * t;
            ctx.strokeStyle = `rgba(215, 226, 234, ${alpha.toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Draw connections from mouse to nearby particles
      if (m.present) {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const dx = p.x - m.x;
          const dy = p.y - m.y;
          const d2 = dx * dx + dy * dy;
          const md = 220;
          if (d2 < md * md) {
            const t = 1 - Math.sqrt(d2) / md;
            ctx.strokeStyle = `rgba(180, 205, 225, ${(0.30 * t).toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(m.x, m.y);
            ctx.stroke();
          }
        }
      }

      // Draw particles last (on top of lines) with breathing
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const breath = 0.85 + 0.15 * Math.sin(s.time * 1.5 + p.phase);
        const r = p.r * breath;
        const alpha = p.depth ? 0.85 : 0.45;
        // Outer halo
        ctx.fillStyle = p.depth
          ? `rgba(215, 226, 234, ${alpha})`
          : `rgba(160, 180, 200, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
        // Glow for near particles
        if (p.depth) {
          ctx.fillStyle = 'rgba(120, 158, 188, 0.10)';
          ctx.beginPath();
          ctx.arc(p.x, p.y, r * 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      s.raf = requestAnimationFrame(draw);
    };

    const onResize = () => { cancelAnimationFrame(stateRef.current.raf); init(); s_loop(); };
    const s_loop = () => { stateRef.current.raf = requestAnimationFrame(draw); };

    init();
    s_loop();
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onLeave);
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(stateRef.current.raf);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', onResize);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
      }}
    />
  );
}

Object.assign(window, { InteractiveMesh });
