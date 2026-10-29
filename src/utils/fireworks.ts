/**
 * =========================================================================
 * BỘ HIỆU ỨNG PHÁO HOA ĂN MỪNG SƯ PHẠM SIÊU MƯỢT 60FPS (LIGHTWEIGHT FIREWORKS)
 * Tối ưu hóa hiệu năng cao: Không giật đơ, không lag, mượt mà trên cả điện thoại yếu.
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
}

interface Rocket {
  x: number;
  y: number;
  targetY: number;
  vx: number;
  vy: number;
  color: string;
}

// Bảng màu rực rỡ, tươi vui, tươi sáng đậm chất sư phạm
const VIBRANT_COLORS = [
  '#FF2E93', // Hồng neon
  '#FF9900', // Cam vàng rực
  '#FFD700', // Vàng hoàng gia
  '#00FF88', // Xanh lục ngọc
  '#00E5FF', // Xanh cyan sáng
  '#3D7BFF', // Xanh sapphire
  '#B845FF', // Tím ánh kim
  '#FFFFFF'  // Trắng sao băng
];

let activeStopFunction: (() => void) | null = null;

export function launchFireworks(durationMs: number = 3800): () => void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return () => {};
  }

  // 1. Nếu đang có đợt bắn pháo hoa cũ, dọn sạch ngay để tránh cộng dồn gây đơ lác
  if (activeStopFunction) {
    try {
      activeStopFunction();
    } catch {}
    activeStopFunction = null;
  }

  const existingCanvas = document.getElementById('gvai-fireworks-canvas');
  if (existingCanvas && existingCanvas.parentNode) {
    existingCanvas.parentNode.removeChild(existingCanvas);
  }

  // 2. Nhận diện thiết bị di động để tự động giảm tải hạt
  const isMobile = window.innerWidth < 768;
  const maxActiveParticles = isMobile ? 120 : 220;
  const particlesPerBlast = isMobile ? 32 : 55;

  // 3. Khởi tạo Canvas toàn màn hình
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

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) {
    canvas.remove();
    return () => {};
  }

  // Giới hạn độ phân giải canvas tối đa để GPU render nhẹ nhàng, tuyệt đối không giật
  let width = (canvas.width = Math.min(window.innerWidth, 1440));
  let height = (canvas.height = Math.min(window.innerHeight, 900));

  const handleResize = () => {
    width = canvas.width = Math.min(window.innerWidth, 1440);
    height = canvas.height = Math.min(window.innerHeight, 900);
  };
  window.addEventListener('resize', handleResize);

  const rockets: Rocket[] = [];
  const particles: Particle[] = [];
  let isRunning = true;
  const startTime = Date.now();
  let lastRocketTime = 0;
  let animationFrameId: number;

  // Hàm tạo vụ nổ bung tỏa
  const createBlast = (x: number, y: number, baseColor: string) => {
    // Nếu số hạt đang nhiều thì không tạo thêm để bảo đảm luôn 60 FPS
    if (particles.length >= maxActiveParticles) return;

    const count = particlesPerBlast;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3;
      const speed = 2 + Math.random() * 5.5;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: Math.random() > 0.35 ? baseColor : VIBRANT_COLORS[Math.floor(Math.random() * VIBRANT_COLORS.length)],
        alpha: 1,
        decay: 0.016 + Math.random() * 0.02,
        size: 2 + Math.random() * 2
      });
    }
  };

  // Hàm phóng rocket từ chân màn hình bay lên
  const spawnRocket = () => {
    if (rockets.length >= 3) return; // Tối đa 3 quả bay cùng lúc
    const x = width * 0.15 + Math.random() * (width * 0.7);
    const targetY = height * 0.12 + Math.random() * (height * 0.35);
    const color = VIBRANT_COLORS[Math.floor(Math.random() * VIBRANT_COLORS.length)];
    rockets.push({
      x,
      y: height,
      targetY,
      vx: (Math.random() - 0.5) * 2,
      vy: -(11 + Math.random() * 4),
      color
    });
  };

  // Bắn đợt khởi đầu
  spawnRocket();
  setTimeout(spawnRocket, 250);

  // VÒNG LẶP ANIMATION SIÊU TỐC KHÔNG GIẬT LAG
  const loop = () => {
    if (!isRunning) return;

    const now = Date.now();
    const elapsed = now - startTime;

    // Làm mờ nền cực nhẹ tạo vệt sáng đuôi sao (Không dùng shadowBlur)
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
    ctx.fillRect(0, 0, width, height);

    // Dùng chế độ 'lighter' tạo ánh sáng rực rỡ tự nhiên không tốn tài nguyên
    ctx.globalCompositeOperation = 'lighter';

    // Bắn thêm rocket theo nhịp
    if (elapsed < durationMs - 1000) {
      if (now - lastRocketTime > (isMobile ? 550 : 420)) {
        spawnRocket();
        lastRocketTime = now;
      }
    }

    // 1. Cập nhật và vẽ rockets bay lên
    for (let i = rockets.length - 1; i >= 0; i--) {
      const r = rockets[i];
      const prevX = r.x;
      const prevY = r.y;

      r.x += r.vx;
      r.y += r.vy;
      r.vy += 0.14; // Trọng lực nhẹ

      // Vẽ tia sáng bay lên
      ctx.beginPath();
      ctx.moveTo(prevX, prevY);
      ctx.lineTo(r.x, r.y);
      ctx.strokeStyle = r.color;
      ctx.lineWidth = 3;
      ctx.stroke();

      // Nổ khi đạt độ cao
      if (r.y <= r.targetY || r.vy >= -1) {
        createBlast(r.x, r.y, r.color);
        rockets.splice(i, 1);
      }
    }

    // 2. Cập nhật và vẽ các hạt tia lửa nổ bung
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.95; // Cản gió
      p.vy = p.vy * 0.95 + 0.12; // Trọng lực rơi
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Kết thúc khi hết giờ và hạt đã tan biến
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
    if (activeStopFunction === stop) {
      activeStopFunction = null;
    }
  };

  activeStopFunction = stop;
  animationFrameId = requestAnimationFrame(loop);

  // Tự động thu dọn tài nguyên an toàn
  setTimeout(stop, durationMs + 1200);

  return stop;
}
