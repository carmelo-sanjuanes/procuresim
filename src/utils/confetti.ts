// Motor Ligero de Confeti & Partículas Triunfales (Zero-Dependencies) - ProcureSim v2.0
// Diseñado para celebrar victorias de contratación pública (ej. Desempate Ley 2069 / BIC, Firma del Contrato)

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  shape: 'rect' | 'circle' | 'star';
  alpha: number;
  decay: number;
}

export function launchConfetti(options?: { count?: number; durationMs?: number }) {
  if (typeof window === 'undefined') return;

  const count = options?.count ?? 90;
  const durationMs = options?.durationMs ?? 3200;

  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.inset = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '99999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    canvas.remove();
    return;
  }

  const dpr = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  // Paleta Awwwards ProcureSim: Verde Sanjuanés, Esmeralda, Cyan, Dorado Adjudicación y Azul SECOP
  const colors = [
    '#a3e635', // Lima Sanjuanés
    '#10b981', // Esmeralda BIC
    '#06b6d4', // Cyan Tech
    '#f59e0b', // Dorado Adjudicación
    '#3b82f6', // Azul SECOP
    '#ec4899', // Magenta
    '#ffffff'  // Blanco brillo
  ];

  const particles: Particle[] = [];

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI / 6) + (Math.random() * ((2 * Math.PI) / 3)); // Hacia arriba en abanico
    const speed = 7 + Math.random() * 14;

    particles.push({
      x: width * 0.5 + (Math.random() - 0.5) * 200,
      y: height * 0.75,
      vx: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
      vy: -Math.sin(angle) * speed,
      size: 5 + Math.random() * 7,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
      shape: Math.random() > 0.4 ? 'rect' : Math.random() > 0.5 ? 'circle' : 'star',
      alpha: 1,
      decay: 0.007 + Math.random() * 0.009
    });
  }

  let animationFrameId: number;
  const startTime = performance.now();

  function draw() {
    if (!ctx) return;
    const elapsed = performance.now() - startTime;
    ctx.clearRect(0, 0, width, height);

    let activeParticles = 0;

    for (const p of particles) {
      if (p.alpha <= 0) continue;
      activeParticles++;

      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.28; // Gravedad
      p.vx *= 0.985; // Fricción del aire
      p.rotation += p.rotationSpeed;
      p.alpha = Math.max(0, p.alpha - p.decay);

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);

      if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      } else if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Estrellita
        ctx.beginPath();
        for (let j = 0; j < 5; j++) {
          ctx.lineTo(Math.cos(((18 + j * 72) * Math.PI) / 180) * p.size, -Math.sin(((18 + j * 72) * Math.PI) / 180) * p.size);
          ctx.lineTo(Math.cos(((54 + j * 72) * Math.PI) / 180) * (p.size / 2), -Math.sin(((54 + j * 72) * Math.PI) / 180) * (p.size / 2));
        }
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();
    }

    if (activeParticles > 0 && elapsed < durationMs) {
      animationFrameId = requestAnimationFrame(draw);
    } else {
      cancelAnimationFrame(animationFrameId);
      canvas.remove();
    }
  }

  animationFrameId = requestAnimationFrame(draw);
}
