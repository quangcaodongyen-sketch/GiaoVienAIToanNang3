// ============================================================================
// HỆ THỐNG PHÁT ÂM TIẾNG ANH CHUẨN TUYỆT ĐỐI (AUDIO PRONUNCIATION SERVICE)
// Tác giả: Thầy giáo Đinh Văn Thành - Hệ sinh thái Giáo Viên AI Toàn Năng
// Tính năng:
// 1. Tự động tìm & chọn giọng đọc chuẩn bản xứ chất lượng cao nhất (Natural/Neural US & UK)
// 2. Chuyển đổi linh hoạt giữa Giọng Mỹ (US - General American) và Giọng Anh (UK - RP)
// 3. Tùy chỉnh tốc độ: Chuẩn (0.85x) hoặc Chậm rõ âm (0.70x) để nghe rõ âm đuôi & trọng âm
// 4. Tự động làm sạch thẻ HTML (<u>, </u>) và dấu trọng âm (') trước khi phát âm
// 5. Dự phòng phát âm trực tiếp từ từ điển chuẩn quốc tế (Free Dictionary Audio API)
// ============================================================================

export type VoiceAccent = 'US' | 'UK';

export interface PronounceOptions {
  accent?: VoiceAccent;
  rate?: number;
  pitch?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

export interface VoiceInfo {
  name: string;
  lang: string;
  accent: VoiceAccent;
  isNatural: boolean;
}

const STORAGE_KEY_ACCENT = 'DE_KIEM_TRA_SO_VOICE_ACCENT';
const STORAGE_KEY_RATE = 'DE_KIEM_TRA_SO_VOICE_RATE';

class AudioPronunciationService {
  private voices: SpeechSynthesisVoice[] = [];
  private isInitialized = false;
  private currentAccent: VoiceAccent = 'US';
  private currentRate = 0.82; // Tốc độ vàng: nghe rõ từng âm tiết và ending sound
  private activeUtterance: SpeechSynthesisUtterance | null = null;
  private currentAudioElement: HTMLAudioElement | null = null;
  private isSpeakingState = false;
  private currentSpeakingText = '';
  private stateListeners: Array<(isSpeaking: boolean, word: string) => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      const savedAccent = localStorage.getItem(STORAGE_KEY_ACCENT);
      if (savedAccent === 'US' || savedAccent === 'UK') {
        this.currentAccent = savedAccent;
      }
      const savedRate = localStorage.getItem(STORAGE_KEY_RATE);
      if (savedRate) {
        const parsed = parseFloat(savedRate);
        if (!isNaN(parsed) && parsed >= 0.5 && parsed <= 1.5) {
          this.currentRate = parsed;
        }
      }
      this.initVoices();
    }
  }

  // Khởi tạo và lắng nghe danh sách giọng đọc từ trình duyệt
  public initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const loadVoices = () => {
      try {
        const available = window.speechSynthesis.getVoices();
        if (available && available.length > 0) {
          this.voices = available;
          this.isInitialized = true;
        }
      } catch (e) {
        console.warn('Lỗi tải voices:', e);
      }
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Mở khóa âm thanh cho thiết bị di động (iOS/Android) khi người dùng tương tác
    const unlockAudio = () => {
      try {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      } catch (e) {}
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };
    window.addEventListener('click', unlockAudio, { once: true });
    window.addEventListener('touchstart', unlockAudio, { once: true });
  }

  // Lấy accent hiện tại
  public getAccent(): VoiceAccent {
    return this.currentAccent;
  }

  // Đổi accent (US / UK)
  public setAccent(accent: VoiceAccent) {
    this.currentAccent = accent;
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_ACCENT, accent);
    }
  }

  // Lấy tốc độ hiện tại
  public getRate(): number {
    return this.currentRate;
  }

  // Đổi tốc độ (0.5x - 1.2x)
  public setRate(rate: number) {
    this.currentRate = Math.max(0.5, Math.min(1.2, rate));
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_RATE, this.currentRate.toString());
    }
  }

  // Kiểm tra trạng thái đang đọc
  public isSpeaking(): boolean {
    return this.isSpeakingState;
  }

  public getSpeakingText(): string {
    return this.currentSpeakingText;
  }

  // Đăng ký nhận thông báo trạng thái đọc
  public subscribeState(listener: (isSpeaking: boolean, word: string) => void): () => void {
    this.stateListeners.push(listener);
    return () => {
      this.stateListeners = this.stateListeners.filter(l => l !== listener);
    };
  }

  private notifyState(isSpeaking: boolean, word: string) {
    this.isSpeakingState = isSpeaking;
    this.currentSpeakingText = word;
    this.stateListeners.forEach(fn => fn(isSpeaking, word));
  }

  // Làm sạch văn bản: Loại bỏ tag HTML <u>, </b>, dấu nháy stress (' hay ˈ)
  public cleanWordForSpeech(rawText: string): string {
    if (!rawText) return '';
    return rawText
      .replace(/<[^>]*>/g, '') // Xóa thẻ HTML
      .replace(/['"ˈˌ`]/g, '')  // Xóa dấu nháy/trọng âm gây lệch phát âm
      .replace(/[.,!?;:()\[\]{}]/g, ' ') // Xóa dấu câu
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Chọn giọng đọc bản xứ chuẩn nhất (Ưu tiên Microsoft Natural và Google US/UK)
  public getBestVoice(accent: VoiceAccent = this.currentAccent): SpeechSynthesisVoice | null {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

    if (!this.voices || this.voices.length === 0) {
      this.voices = window.speechSynthesis.getVoices();
    }
    const voices = this.voices || [];
    if (voices.length === 0) return null;

    const targetLang = accent === 'UK' ? 'en-gb' : 'en-us';

    // Danh sách ưu tiên giọng đọc chuẩn cao cấp
    const usPriorities = [
      'guy online (natural)',
      'jenny online (natural)',
      'christopher online (natural)',
      'aria online (natural)',
      'eric online (natural)',
      'michelle online (natural)',
      'google us english',
      'natural',
      'neural',
      'guy',
      'jenny',
      'samantha',
      'alex'
    ];

    const ukPriorities = [
      'sonia online (natural)',
      'ryan online (natural)',
      'libby online (natural)',
      'google uk english female',
      'google uk english male',
      'george',
      'hazel',
      'susan',
      'oliver',
      'natural',
      'neural'
    ];

    const priorities = accent === 'UK' ? ukPriorities : usPriorities;

    // 1. Tìm giọng thuộc đúng ngôn ngữ và khớp tên ưu tiên
    for (const prio of priorities) {
      const found = voices.find(v => {
        const langMatch = v.lang.toLowerCase().replace('_', '-').startsWith(targetLang);
        const nameMatch = v.name.toLowerCase().includes(prio);
        return langMatch && nameMatch;
      });
      if (found) return found;
    }

    // 2. Tìm bất kỳ giọng nào chứa prio có ngôn ngữ bắt đầu bằng 'en'
    for (const prio of priorities) {
      const found = voices.find(v => {
        const langMatch = v.lang.toLowerCase().startsWith('en');
        const nameMatch = v.name.toLowerCase().includes(prio);
        return langMatch && nameMatch;
      });
      if (found) return found;
    }

    // 3. Giọng đúng chuẩn mã ngôn ngữ en-US hoặc en-GB
    const exactLangMatch = voices.find(v => v.lang.toLowerCase().replace('_', '-').startsWith(targetLang));
    if (exactLangMatch) return exactLangMatch;

    // 4. Bất kỳ giọng tiếng Anh nào
    const anyEn = voices.find(v => v.lang.toLowerCase().startsWith('en'));
    return anyEn || null;
  }

  // Dừng phát âm ngay lập tức
  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
    if (this.currentAudioElement) {
      try {
        this.currentAudioElement.pause();
        this.currentAudioElement.currentTime = 0;
      } catch (e) {}
      this.currentAudioElement = null;
    }
    this.notifyState(false, '');
  }

  // Phát âm một từ hoặc cụm từ tiếng Anh với chuẩn tuyệt đối
  public speak(rawText: string, options?: PronounceOptions): Promise<boolean> {
    return new Promise((resolve) => {
      const cleanText = this.cleanWordForSpeech(rawText);
      if (!cleanText) {
        resolve(false);
        return;
      }

      this.stop();

      const accent = options?.accent || this.currentAccent;
      const rate = options?.rate || this.currentRate;
      const pitch = options?.pitch || 1.0;

      // Ưu tiên 1: Web Speech API với Giọng Natural / Neural cao cấp
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          }

          const utterance = new SpeechSynthesisUtterance(cleanText);
          utterance.lang = accent === 'UK' ? 'en-GB' : 'en-US';
          utterance.rate = rate;
          utterance.pitch = pitch;

          const voice = this.getBestVoice(accent);
          if (voice) {
            utterance.voice = voice;
          }

          utterance.onstart = () => {
            this.notifyState(true, cleanText);
            options?.onStart?.();
          };

          utterance.onend = () => {
            this.notifyState(false, '');
            options?.onEnd?.();
            resolve(true);
          };

          utterance.onerror = (err) => {
            console.warn('Speech error, thử fallback audio:', err);
            // Thử fallback sang Dictionary Audio MP3
            this.fallbackDictionaryAudio(cleanText, accent, options)
              .then(success => resolve(success))
              .catch(() => {
                this.notifyState(false, '');
                options?.onError?.(err);
                resolve(false);
              });
          };

          this.activeUtterance = utterance;
          window.speechSynthesis.speak(utterance);
          return;
        } catch (e) {
          console.warn('Lỗi khởi tạo speechSynthesis:', e);
        }
      }

      // Ưu tiên 2: Fallback Audio Dictionary API nếu Web Speech không hoạt động
      this.fallbackDictionaryAudio(cleanText, accent, options)
        .then(success => resolve(success))
        .catch(() => {
          this.notifyState(false, '');
          options?.onError?.('Không phát được âm thanh');
          resolve(false);
        });
    });
  }

  // Phát âm từ điển trực tuyến (Oxford / Cambridge / Free Dictionary API)
  private fallbackDictionaryAudio(word: string, accent: VoiceAccent, options?: PronounceOptions): Promise<boolean> {
    return new Promise((resolve) => {
      // Chỉ hỗ trợ từ đơn lẻ cho Audio Dictionary
      const singleWord = word.trim().split(' ')[0].toLowerCase().replace(/[^a-z]/g, '');
      if (!singleWord) {
        resolve(false);
        return;
      }

      const audioUrl = `https://api.dictionaryapi.dev/media/pronunciations/en/${singleWord}-${accent.toLowerCase()}.mp3`;
      const audio = new Audio(audioUrl);
      this.currentAudioElement = audio;
      audio.playbackRate = options?.rate || this.currentRate;

      audio.onplay = () => {
        this.notifyState(true, word);
        options?.onStart?.();
      };

      audio.onended = () => {
        this.notifyState(false, '');
        options?.onEnd?.();
        resolve(true);
      };

      audio.onerror = () => {
        // Thử lại không có hậu tố accent
        const fallbackUrl = `https://api.dictionaryapi.dev/media/pronunciations/en/${singleWord}-us.mp3`;
        const audio2 = new Audio(fallbackUrl);
        this.currentAudioElement = audio2;

        audio2.onplay = () => {
          this.notifyState(true, word);
          options?.onStart?.();
        };

        audio2.onended = () => {
          this.notifyState(false, '');
          options?.onEnd?.();
          resolve(true);
        };

        audio2.onerror = () => {
          this.notifyState(false, '');
          resolve(false);
        };

        audio2.play().catch(() => resolve(false));
      };

      audio.play().catch(() => resolve(false));
    });
  }
}

export const audioPronunciationService = new AudioPronunciationService();
export default audioPronunciationService;
