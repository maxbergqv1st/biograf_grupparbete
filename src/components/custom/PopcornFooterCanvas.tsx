import { useEffect, useRef } from 'react';


type PopcornFooterCanvasProps = {
  className?: string;
};


export default function PopcornFooterCanvas({
  className,
}: PopcornFooterCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;


    const scale = 0.6;
    const base = { w: 120, h: 100 };
    const carton = { x: 140, y: 170, w: base.w * scale, h: base.h * scale, jump: 0 };
    let canvasW = canvas.width;
    let canvasH = canvas.height;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      g: number;
      s: number;
      r: number;
    }> = [];
    const overflowKernels: Array<{ x: number; dy: number; s: number; r: number }> = [];
    const domeKernels: Array<{ x: number; y: number; s: number; r: number }> = [];


    // Deterministic random for fixed layout
    let seed = 1337;
    function rand() {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    }
    function resetSeed() {
      seed = 1337;
    }


    function drawKernel(x: number, y: number, s: number, r: number) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(r);
      ctx.scale(s * scale, s * scale);


      // Base puffs
      ctx.fillStyle = '#fff8e8';
      ctx.strokeStyle = '#2a2a2a';
      ctx.lineWidth = 1.2;


      ctx.beginPath();
      ctx.arc(-2, -1, 5.2, 0, Math.PI * 2);
      ctx.arc(3, -2, 4.6, 0, Math.PI * 2);
      ctx.arc(1, 3, 4.8, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();


      // Warm shadow blob
      ctx.fillStyle = '#f2d8a6';
      ctx.beginPath();
      ctx.arc(2.5, 2.5, 2.6, 0, Math.PI * 2);
      ctx.fill();


      // Small highlight
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-2.5, -2.5, 1.6, 0, Math.PI * 2);
      ctx.fill();


      ctx.restore();
    }


    function initOverflow() {
      overflowKernels.length = 0;
      const topW = carton.w * 1.05;
      const radius = topW * 0.55;
      const count = 26;
      for (let i = 0; i < count; i++) {
        const angle = Math.PI + rand() * Math.PI;
        const dist = Math.sqrt(rand()) * radius;
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist * 0.8;
        overflowKernels.push({
          x: carton.x + dx,
          dy: dy - 6 * scale,
          s: 0.9 + rand() * 0.7,
          r: rand() * Math.PI * 2,
        });
      }
    }


    function initDomeKernels() {
      domeKernels.length = 0;
      const centerX = carton.x;
      const centerY = carton.y - 6 * scale;
      const rx = carton.w * 0.46;
      const ry = 34 * scale;


      // Layered semicircle to read clearly as a dome
      const layers = 5;
      for (let layer = 0; layer < layers; layer++) {
        const t = layer / (layers - 1); // 0..1 (bottom to top)
        const layerRx = rx * (1 - t * 0.55);
        const layerRy = ry * (1 - t * 0.55);
        const yOffset = centerY - t * 18 * scale;
        const count = Math.max(5, Math.round(14 - t * 6));


        for (let i = 0; i < count; i++) {
          const angle = Math.PI + (i / (count - 1)) * Math.PI;
          const jitter = (rand() - 0.5) * 4 * scale;
          const dx = Math.cos(angle) * layerRx + jitter;
          const dy = Math.sin(angle) * layerRy + (rand() - 0.5) * 3 * scale;
          domeKernels.push({
            x: centerX + dx,
            y: yOffset + dy,
            s: 0.85 + rand() * 0.5,
            r: rand() * Math.PI * 2,
          });
        }
      }


      // Fill the middle a bit so the dome feels solid
      const fillCount = 18;
      for (let i = 0; i < fillCount; i++) {
        const angle = Math.PI + rand() * Math.PI;
        const dist = Math.sqrt(rand());
        const dx = Math.cos(angle) * rx * 0.5 * dist;
        const dy = Math.sin(angle) * ry * 0.5 * dist;
        domeKernels.push({
          x: centerX + dx,
          y: centerY + dy - 6 * scale,
          s: 0.85 + rand() * 0.5,
          r: rand() * Math.PI * 2,
        });
      }
    }


    function drawCarton() {
      const y = carton.y - carton.jump;
      const topW = carton.w * 1.05;
      const bottomW = carton.w * 0.85;
      const h = carton.h;
      const leftTop = carton.x - topW / 2;
      const rightTop = carton.x + topW / 2;
      const leftBot = carton.x - bottomW / 2;
      const rightBot = carton.x + bottomW / 2;


      // Front trapezoid path
      ctx.beginPath();
      ctx.moveTo(leftTop, y);
      ctx.lineTo(rightTop, y);
      ctx.lineTo(rightBot, y + h);
      ctx.lineTo(leftBot, y + h);
      ctx.closePath();


      // Stripe fill via clip
      ctx.save();
      ctx.clip();
      const stripeW = 14 * scale;
      for (let x = leftTop - stripeW; x < rightTop + stripeW; x += stripeW) {
        ctx.fillStyle =
          Math.floor((x - leftTop) / stripeW) % 2 === 0 ? '#f8f4ea' : '#d84b3c';
        ctx.fillRect(x, y - 2 * scale, stripeW, h + 4 * scale);
      }
      ctx.restore();


      // Outline
      ctx.strokeStyle = '#2a2a2a';
      ctx.lineWidth = 2 * scale;
      ctx.stroke();


      // Top rim
      ctx.fillStyle = '#f8f4ea';
      ctx.strokeStyle = '#2a2a2a';
      ctx.beginPath();
      ctx.moveTo(leftTop - 4 * scale, y - 8 * scale);
      ctx.lineTo(rightTop + 4 * scale, y - 8 * scale);
      ctx.lineTo(rightTop, y);
      ctx.lineTo(leftTop, y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();


      // Overflow kernels sitting on the rim
      overflowKernels.forEach((k) => {
        drawKernel(k.x, y + k.dy, k.s, k.r);
      });


      // Dome of kernels that appear to hold each other up
      domeKernels.forEach((k) => drawKernel(k.x, k.y - carton.jump * 0.6, k.s, k.r));


      // Text (no label box)
      ctx.save();
      ctx.translate(carton.x, y + 32 * scale);
      ctx.rotate(-0.12);
      ctx.fillStyle = '#2a2a2a';
      ctx.strokeStyle = '#2a2a2a';
      ctx.lineWidth = 2.2 * scale;
      ctx.font = `900 ${13 * scale}px "Trebuchet MS", system-ui, sans-serif`;
      ctx.textAlign = 'left';
      const word = 'POPCORN';
      const spacing = 0.8 * scale;
      const totalWidth = Array.from(word).reduce((sum, ch) => {
        return sum + ctx.measureText(ch).width + spacing;
      }, 0);
      let x = -totalWidth / 2;
      for (const ch of word) {
        ctx.strokeText(ch, x, 0);
        ctx.fillText(ch, x, 0);
        x += ctx.measureText(ch).width + spacing;
      }
      ctx.restore();
    }


    function spawn() {
      carton.jump = 16 * scale;
      for (let i = 0; i < 22; i++) {
        particles.push({
          x: carton.x + (Math.random() * 30 - 15) * scale,
          y: carton.y - 10 * scale,
          vx: Math.random() * 2 - 1,
          vy: -(Math.random() * 3 + 2),
          g: 0.12 + Math.random() * 0.05,
          s: 0.9 + Math.random() * 0.6,
          r: Math.random() * Math.PI * 2,
        });
      }
    }


    const xPercent = 0.8;
    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      canvasW = rect.width;
      canvasH = rect.height;
      carton.w = base.w * scale;
      carton.h = base.h * scale;
      carton.x = canvasW * xPercent;
      carton.y = canvasH - carton.h - 8 * scale;


      resetSeed();
      initOverflow();
      initDomeKernels();
    }


    let rafId = 0;
    function step() {
      ctx.clearRect(0, 0, canvasW, canvasH);
      drawCarton();


      carton.jump *= 0.85;


      particles.forEach((p) => {
        p.vy += p.g;
        p.x += p.vx;
        p.y += p.vy;


        // Floor collision so kernels settle instead of disappearing
        const floor = canvasH - 6;
        if (p.y > floor) {
          p.y = floor;
          p.vy *= -0.25;
          p.vx *= 0.7;
          // If it's basically stopped, let it rest
          if (Math.abs(p.vy) < 0.2) {
            p.vy = 0;
          }
        }
      });


      // Keep resting kernels; drop only if they drift far off-screen
      particles = particles.filter((p) => p.y < canvasH + 100);


      particles.forEach((p) => {
        drawKernel(p.x, p.y, p.s, p.r);
      });


      rafId = requestAnimationFrame(step);
    }


    function onClick() {
      spawn();
    }


    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    canvas.addEventListener('click', onClick);
    step();


    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      canvas.removeEventListener('click', onClick);
    };
  }, []);


  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-label="Popcorn animation"
      role="img"
    />
  );
}
