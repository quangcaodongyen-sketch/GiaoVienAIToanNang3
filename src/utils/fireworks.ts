/**
 * =========================================================================
 * BỘ ĐIỀU KHIỂN HIỆU ỨNG THI ĐUA SƯ PHẠM
 * Ghi chú: Đã lược bỏ tính năng bắn pháo hoa theo yêu cầu (học sinh đã lớn)
 * =========================================================================
 */

export function launchFireworks(_durationMs: number = 3800): () => void {
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    try {
      const existingCanvas = document.getElementById('gvai-fireworks-canvas');
      if (existingCanvas && existingCanvas.parentNode) {
        existingCanvas.parentNode.removeChild(existingCanvas);
      }
    } catch {}
  }
  return () => {};
}
