/**
 * =========================================================================
 * BỘ HIỆU ỨNG PHÁO HOA ĂN MỪNG SƯ PHẠM (FIREWORKS ENGINE)
 * Dành riêng cho Giáo Viên AI Toàn Năng - Thầy giáo Đinh Văn Thành
 * Bắn pháo hoa rực rỡ toàn màn hình ăn mừng học sinh chăm chỉ học bài!
 * =========================================================================
 */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  decay: number;
  size: number;
  flicker: boolean;
}

interface FireworkRocket {
  x: number;
  y: number;
  targetY: number;
  vx: number;
  vy: number;
  color: string;
  trail: Array<{ x: number; y: number; alpha: number }>;
}

const FIREWORK_COLORS = [
  '#FF1744', // Đỏ tươi
  '#FF9100', // Cam vàng
  '#FFEA00', // Vàng kim
  '#00E676', // Xanh lục ngọc
  '#00E5FF', // Xanh cyan sáng
  '#2979FF', // Xanh dương rực rỡ
  '#D500F9', // Tím hoa cà
  '#FF4081', // Hồng sen neon
  '#FFFFFF'  // Trắng bạc lấp lánh
];

export function launchFireworks(durationMs: number = 4500): () => void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return () => {};
  }

  // 1. Đồng thời kích hoạt confetti nếu có trong window
  try {
    const conf = (window as unknown as { confetti?: (opts: unknown) => void }).confetti;
    if (typeof conf === 'function') {
      conf({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        try {
          conf({
            particleCount: 80,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
          });
          conf({
            particleCount: 80,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
          });
        } catch {}
      }, 700);
    }
  } catch {}

  // 2. Tạo Canvas HTML5 toàn màn hình chạy mượt mà 60 FPS
  const canvas = document.createElement('canvas');
  canvas.id = 'gvai-fireworks-canvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '999999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    canvas.remove();
    return () => {};
  }

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const handleResize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', handleResize);

  const rockets: FireworkRocket[] = [];
  const particles: Particle[] = [];
  let isRunning = true;
  let startTime = Date.now();
  let lastLaunchTime = 0;

  const createExplosion = (x: number, y: number, color: string) => {
    const particleCount = 70 + Math.floor(Math.random() * 40);
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5;
      const speed = 2 + Math.random() * 7;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: Math.random() > 0.3 ? color : FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)],
        alpha: 1,
        decay: 0.012 + Math.random() * 0.018,
        size: 2 + Math.random() * 2.5,
        flicker: Math.random() > 0.5
      });
    }
  };

  const launchRocket = () => {
    const x = width * 0.15 + Math.random() * (width * 0.7);
    const targetY = height * 0.12 + Math.random() * (height * 0.4);
    const color = FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)];
    const speed = 11 + Math.random() * 5;
    rockets.push({
      x,
      y: height,
      targetY,
      vx: (Math.random() - 0.5) * 2.5,
      vy: -speed,
      color,
      trail: []
    });
  };

  // Bắn ngay loạt pháo hoa đầu tiên
  launchRocket();
  setTimeout(launchRocket, 180);
  setTimeout(launchRocket, 360);

  let animationFrameId: number;

  const loop = () => {
    if (!isRunning) return;

    const now = Date.now();
    const elapsed = now - startTime;

    // Xóa nền với hiệu ứng làm mờ nhẹ tạo vệt sáng
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'lighter';

    // Bắn thêm pháo hoa mới trong suốt khoảng thời gian durationMs
    if (elapsed < durationMs - 1200) {
      if (now - lastLaunchTime > 280) {
        launchRocket();
        if (Math.random() > 0.4) launchRocket();
        lastLaunchTime = now;
      }
    }

    // Cập nhật và vẽ các rocket bay lên
    for (let i = rockets.length - 1; i >= 0; i--) {
      const r = rockets[i];
      r.x += r.vx;
      r.y += r.vy;
      r.vy += 0.08; // Lực hút làm giảm tốc dần

      r.trail.push({ x: r.x, y: r.y, alpha: 1 });
      if (r.trail.length > 6) r.trail.shift();

      // Vẽ vệt khói sáng bay lên
      ctx.beginPath();
      ctx.strokeStyle = r.color;
      ctx.lineWidth = 2.5;
      r.trail.forEach((pt, idx) => {
        ctx.strokeStyle = `rgba(255, 235, 59, ${idx / r.trail.length})`;
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.stroke();

      // Khi rocket đạt đến độ cao targetY hoặc bắt đầu rơi xuống thì phát nổ!
      if (r.y <= r.targetY || r.vy >= -1) {
        createExplosion(r.x, r.y, r.color);
        rockets.splice(i, 1);
      }
    }

    // Cập nhật và vẽ các hạt tia lửa nổ bung
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.96; // Lực cản không khí
      p.vy = p.vy * 0.96 + 0.12; // Trọng lực rơi xuống nhẹ nhàng
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.flicker && Math.random() > 0.4 ? p.alpha * 0.6 : p.alpha;
      ctx.shadowBlur = 10;
      ctx.shadowColor = p.color;
      ctx.fill();
    }
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;

    // Dừng khi hết thời gian và tất cả hạt đã biến mất
    if (elapsed > durationMs && particles.length === 0 && rockets.length === 0) {
      stop();
      return;
    }

    animationFrameId = requestAnimationFrame(loop);
  };

  const stop = () => {
    isRunning = false;
    window.removeEventListener('resize', handleResize);
    cancelAnimationFrame(animationFrameId);
    if (canvas && canvas.parentNode) {
      canvas.parentNode.removeChild(canvas);
    }
  };

  animationFrameId = requestAnimationFrame(loop);

  // Tự động dọn dẹp tối đa sau durationMs + 2000ms
  setTimeout(stop, durationMs + 2000);

  return stop;
}
