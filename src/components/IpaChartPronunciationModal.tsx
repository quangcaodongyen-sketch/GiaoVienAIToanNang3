import React, { useState } from 'react';
import { Volume2, X, Sparkles, Check, Info, BookOpen, Mic } from 'lucide-react';
import audioPronunciationService, { VoiceAccent } from '../services/audioPronunciationService';

export interface IpaSound {
  symbol: string;
  type: 'monophthong-long' | 'monophthong-short' | 'diphthong' | 'consonant-unvoiced' | 'consonant-voiced';
  typeLabel: string;
  exampleWord: string;
  exampleWordIpa: string;
  exampleWordVi: string;
  highlightPart: string;
  mouthGuide: string;
  commonMistakeNote?: string;
  comparisonWith?: string;
}

export const IPA_44_SOUNDS: IpaSound[] = [
  // 1. NGUYÊN ÂM ĐƠN DÀI (5 ÂM)
  {
    symbol: '/iː/',
    type: 'monophthong-long',
    typeLabel: 'Nguyên âm đơn dài',
    exampleWord: 'sheep',
    exampleWordIpa: '/ʃiːp/',
    exampleWordVi: 'con cừu',
    highlightPart: 'ee',
    mouthGuide: 'Khóe miệng kéo dài sang 2 bên như đang mỉm cười, phát âm kéo dài âm "i".',
    commonMistakeNote: 'Tránh đọc ngắn thành /ɪ/ (dễ nhầm sheep với ship).',
    comparisonWith: 'Phân biệt với /ɪ/ trong "ship"'
  },
  {
    symbol: '/uː/',
    type: 'monophthong-long',
    typeLabel: 'Nguyên âm đơn dài',
    exampleWord: 'school',
    exampleWordIpa: '/skuːl/',
    exampleWordVi: 'trường học',
    highlightPart: 'oo',
    mouthGuide: 'Môi chu tròn nhỏ về phía trước, giữ luồng hơi ổn định kéo dài âm "u".',
    commonMistakeNote: 'Tránh đọc ngắn như "u" tiếng Việt.',
    comparisonWith: 'Phân biệt với /ʊ/ trong "look, book, foot"'
  },
  {
    symbol: '/ɑː/',
    type: 'monophthong-long',
    typeLabel: 'Nguyên âm đơn dài',
    exampleWord: 'smart',
    exampleWordIpa: '/smɑːt/',
    exampleWordVi: 'thông minh',
    highlightPart: 'ar',
    mouthGuide: 'Hạ cằm dưới tối đa, miệng mở rộng tự nhiên, phát âm âm "a" trầm từ sâu cuống họng.',
    commonMistakeNote: 'Dễ nhầm với /ʌ/ ngắn trong "rubber, compass".',
    comparisonWith: 'Phân biệt với /ʌ/ trong "subject, rubber"'
  },
  {
    symbol: '/ɔː/',
    type: 'monophthong-long',
    typeLabel: 'Nguyên âm đơn dài',
    exampleWord: 'sport',
    exampleWordIpa: '/spɔːt/',
    exampleWordVi: 'thể thao',
    highlightPart: 'or',
    mouthGuide: 'Tròn môi, lưỡi hơi kéo lùi về sau, phát âm âm "o" sâu và kéo dài.',
    commonMistakeNote: 'Không mở miệng quá to kẻo biến thành /ɑː/.',
    comparisonWith: 'Phân biệt với /ɒ/ trong "pot, dog"'
  },
  {
    symbol: '/ɜː/',
    type: 'monophthong-long',
    typeLabel: 'Nguyên âm đơn dài',
    exampleWord: 'bird',
    exampleWordIpa: '/bɜːd/',
    exampleWordVi: 'con chim',
    highlightPart: 'ir',
    mouthGuide: 'Miệng mở hờ tự nhiên, lưỡi hơi nâng nhẹ, phát âm âm "ơ" kéo dài sang trọng.',
    commonMistakeNote: 'Giọng Mỹ thường cuộn đầu lưỡi tạo âm R nhẹ /ɜːr/.',
    comparisonWith: 'Phân biệt với /ə/ trong "teacher"'
  },

  // 2. NGUYÊN ÂM ĐƠN NGẮN (7 ÂM)
  {
    symbol: '/ɪ/',
    type: 'monophthong-short',
    typeLabel: 'Nguyên âm đơn ngắn',
    exampleWord: 'ship',
    exampleWordIpa: '/ʃɪp/',
    exampleWordVi: 'con tàu thủy',
    highlightPart: 'i',
    mouthGuide: 'Miệng mở rộng hơn /iː/ một chút, phát âm âm "i" cực kỳ ngắn gọn và dứt khoát.',
    commonMistakeNote: 'Không kéo dài âm như "i" tiếng Việt.',
    comparisonWith: 'Phân biệt với /iː/ trong "sheep"'
  },
  {
    symbol: '/ʊ/',
    type: 'monophthong-short',
    typeLabel: 'Nguyên âm đơn ngắn',
    exampleWord: 'book',
    exampleWordIpa: '/bʊk/',
    exampleWordVi: 'quyển sách',
    highlightPart: 'oo',
    mouthGuide: 'Môi hơi chu nhẹ, thả lỏng cơ miệng, phát âm âm "u" thật nhanh và dứt khoát.',
    commonMistakeNote: 'Từ book, look, foot, good đều là /ʊ/ ngắn.',
    comparisonWith: 'Phân biệt với /uː/ trong "school, food"'
  },
  {
    symbol: '/e/',
    type: 'monophthong-short',
    typeLabel: 'Nguyên âm đơn ngắn',
    exampleWord: 'pen',
    exampleWordIpa: '/pen/',
    exampleWordVi: 'cây bút',
    highlightPart: 'e',
    mouthGuide: 'Miệng mở rộng vừa phải, môi thả lỏng, phát âm tương tự âm "e" nhưng dứt khoát.',
    commonMistakeNote: 'Không hạ hàm quá sâu kẻo nhầm sang /æ/.',
    comparisonWith: 'Phân biệt với /æ/ trong "pan, man"'
  },
  {
    symbol: '/æ/',
    type: 'monophthong-short',
    typeLabel: 'Nguyên âm đơn ngắn (A bẹt)',
    exampleWord: 'cat',
    exampleWordIpa: '/kæt/',
    exampleWordVi: 'con mèo',
    highlightPart: 'a',
    mouthGuide: 'Hạ hàm dưới xuống sâu, khóe miệng căng sang hai bên, âm nằm giữa "a" và "e".',
    commonMistakeNote: 'Lỗi cực phổ biến của học sinh VN là phát âm thành "e" hoặc "a" thuần túy.',
    comparisonWith: 'Phân biệt với /e/ trong "bed, pet"'
  },
  {
    symbol: '/ʌ/',
    type: 'monophthong-short',
    typeLabel: 'Nguyên âm đơn ngắn',
    exampleWord: 'rubber',
    exampleWordIpa: '/ˈrʌb.ər/',
    exampleWordVi: 'cục tẩy',
    highlightPart: 'u',
    mouthGuide: 'Miệng mở tự nhiên, hơi ngắn bật từ cuống họng, tương tự âm "á" ngắn.',
    commonMistakeNote: 'Các chữ "u" trong rubber, compass, subject đều là âm /ʌ/.',
    comparisonWith: 'Phân biệt với /ɑː/ trong "smart, star"'
  },
  {
    symbol: '/ɒ/',
    type: 'monophthong-short',
    typeLabel: 'Nguyên âm đơn ngắn (O ngắn)',
    exampleWord: 'watch',
    exampleWordIpa: '/wɒtʃ/',
    exampleWordVi: 'đồng hồ đeo tay',
    highlightPart: 'a',
    mouthGuide: 'Tròn môi nhẹ, hạ cằm, phát âm âm "o" thật nhanh và dứt khoát.',
    commonMistakeNote: 'Giọng Mỹ thường chuyển /ɒ/ thành /ɑː/.',
    comparisonWith: 'Phân biệt với /ɔː/ trong "water, sport"'
  },
  {
    symbol: '/ə/',
    type: 'monophthong-short',
    typeLabel: 'Nguyên âm Schwa (Âm yếu phổ biến nhất)',
    exampleWord: 'teacher',
    exampleWordIpa: '/ˈtiːtʃ.ər/',
    exampleWordVi: 'giáo viên',
    highlightPart: 'er',
    mouthGuide: 'Thả lỏng toàn bộ khuôn mặt và cơ miệng, phát âm âm "ơ" cực nhẹ, không nhấn trọng âm.',
    commonMistakeNote: 'Luôn xuất hiện ở các âm tiết không nhận trọng âm.',
    comparisonWith: 'Phân biệt với /ɜː/ trong "bird, nurse"'
  },

  // 3. NGUYÊN ÂM ĐÔI (8 ÂM)
  {
    symbol: '/eɪ/',
    type: 'diphthong',
    typeLabel: 'Nguyên âm đôi',
    exampleWord: 'face',
    exampleWordIpa: '/feɪs/',
    exampleWordVi: 'khuôn mặt',
    highlightPart: 'a',
    mouthGuide: 'Bắt đầu từ âm /e/ rồi trượt nhanh và mượt mà sang âm /ɪ/.',
    commonMistakeNote: 'Không đọc thành "ê" cứng nhắc như tiếng Việt.',
  },
  {
    symbol: '/aɪ/',
    type: 'diphthong',
    typeLabel: 'Nguyên âm đôi',
    exampleWord: 'time',
    exampleWordIpa: '/taɪm/',
    exampleWordVi: 'thời gian',
    highlightPart: 'i',
    mouthGuide: 'Mở rộng miệng phát âm /a/ rồi thu nhỏ môi trượt sang /ɪ/.',
    commonMistakeNote: 'Âm kết thúc phải là âm /ɪ/ mảnh nhẹ.',
  },
  {
    symbol: '/ɔɪ/',
    type: 'diphthong',
    typeLabel: 'Nguyên âm đôi',
    exampleWord: 'boy',
    exampleWordIpa: '/bɔɪ/',
    exampleWordVi: 'cậu bé',
    highlightPart: 'oy',
    mouthGuide: 'Tròn môi phát âm /ɔː/ rồi trượt nhẹ sang /ɪ/.',
    commonMistakeNote: 'Phát âm mượt mà, không tách rời làm 2 âm riêng.',
  },
  {
    symbol: '/aʊ/',
    type: 'diphthong',
    typeLabel: 'Nguyên âm đôi',
    exampleWord: 'house',
    exampleWordIpa: '/haʊs/',
    exampleWordVi: 'ngôi nhà',
    highlightPart: 'ou',
    mouthGuide: 'Mở rộng miệng phát âm /a/ rồi chu môi trượt sang /ʊ/.',
    commonMistakeNote: 'Nhớ phát âm cả âm đuôi /s/ ở cuối từ house.',
  },
  {
    symbol: '/əʊ/',
    type: 'diphthong',
    typeLabel: 'Nguyên âm đôi',
    exampleWord: 'home',
    exampleWordIpa: '/həʊm/',
    exampleWordVi: 'tổ ấm / nhà',
    highlightPart: 'o',
    mouthGuide: 'Bắt đầu từ âm /ə/ thả lỏng rồi chu môi tròn về phía trước thành /ʊ/ (Mỹ là /oʊ/).',
    commonMistakeNote: 'Không phát âm thành "ôm" tiếng Việt.',
  },
  {
    symbol: '/ɪə/',
    type: 'diphthong',
    typeLabel: 'Nguyên âm đôi',
    exampleWord: 'near',
    exampleWordIpa: '/nɪə/',
    exampleWordVi: 'gần gũi',
    highlightPart: 'ear',
    mouthGuide: 'Bắt đầu từ âm /ɪ/ rồi thả lỏng cơ miệng trượt dần sang âm schwa /ə/.',
    commonMistakeNote: 'Giọng Anh kết thúc bằng /ə/, giọng Mỹ uốn lưỡi nhẹ /nɪr/.',
  },
  {
    symbol: '/eə/',
    type: 'diphthong',
    typeLabel: 'Nguyên âm đôi',
    exampleWord: 'hair',
    exampleWordIpa: '/heə/',
    exampleWordVi: 'mái tóc',
    highlightPart: 'air',
    mouthGuide: 'Phát âm /e/ rồi thả lỏng trượt sang /ə/.',
    commonMistakeNote: 'Dễ nhầm với /ɪə/ trong "hear".',
  },
  {
    symbol: '/ʊə/',
    type: 'diphthong',
    typeLabel: 'Nguyên âm đôi',
    exampleWord: 'tour',
    exampleWordIpa: '/tʊə/',
    exampleWordVi: 'chuyến du lịch',
    highlightPart: 'our',
    mouthGuide: 'Chu môi phát âm /ʊ/ rồi thả lỏng trượt sang /ə/.',
    commonMistakeNote: 'Nhiều người bản ngữ hiện đại phát âm từ này thành /ɔː/.',
  },

  // 4. PHỤ ÂM VÔ THANH (8 ÂM - DÂY THANH KHÔNG RUNG)
  {
    symbol: '/p/',
    type: 'consonant-unvoiced',
    typeLabel: 'Phụ âm vô thanh (Không rung)',
    exampleWord: 'pen',
    exampleWordIpa: '/pen/',
    exampleWordVi: 'cây bút',
    highlightPart: 'p',
    mouthGuide: 'Mím chặt hai môi chặn luồng hơi, sau đó mở môi bật mạnh luồng hơi ra, cổ họng không rung.',
    commonMistakeNote: 'Tránh đọc giống âm "b" của tiếng Việt.',
    comparisonWith: 'Đối ứng với âm hữu thanh /b/'
  },
  {
    symbol: '/t/',
    type: 'consonant-unvoiced',
    typeLabel: 'Phụ âm vô thanh (Không rung)',
    exampleWord: 'tea',
    exampleWordIpa: '/tiː/',
    exampleWordVi: 'trà',
    highlightPart: 't',
    mouthGuide: 'Đầu lưỡi chạm chân răng hàm trên chặn hơi, sau đó bật mạnh luồng hơi dứt khoát.',
    commonMistakeNote: 'Là âm đuôi cực quan trọng (wanted, cat, stopped).',
    comparisonWith: 'Đối ứng với âm hữu thanh /d/'
  },
  {
    symbol: '/k/',
    type: 'consonant-unvoiced',
    typeLabel: 'Phụ âm vô thanh (Không rung)',
    exampleWord: 'cat',
    exampleWordIpa: '/kæt/',
    exampleWordVi: 'con mèo',
    highlightPart: 'c',
    mouthGuide: 'Nâng cuống lưỡi chạm vòm họng mềm chặn hơi, sau đó bật hơi mạnh ra ngoài.',
    commonMistakeNote: 'Có trong các chữ "c", "k", "ck", "qu".',
    comparisonWith: 'Đối ứng với âm hữu thanh /ɡ/'
  },
  {
    symbol: '/f/',
    type: 'consonant-unvoiced',
    typeLabel: 'Phụ âm vô thanh (Không rung)',
    exampleWord: 'fish',
    exampleWordIpa: '/fɪʃ/',
    exampleWordVi: 'con cá',
    highlightPart: 'f',
    mouthGuide: 'Răng cửa hàm trên chạm nhẹ vào môi dưới, đẩy luồng hơi thoát ra qua kẽ răng.',
    commonMistakeNote: 'Có trong "f" và "ph" (phone).',
    comparisonWith: 'Đối ứng với âm hữu thanh /v/'
  },
  {
    symbol: '/θ/',
    type: 'consonant-unvoiced',
    typeLabel: 'Phụ âm vô thanh (Âm Th cắn lưỡi thổi hơi)',
    exampleWord: 'think',
    exampleWordIpa: '/θɪŋk/',
    exampleWordVi: 'suy nghĩ',
    highlightPart: 'th',
    mouthGuide: 'ĐẶT ĐẦU LƯỠI GIỮA HAI HÀM RĂNG, thổi luồng hơi nhẹ ra ngoài, cổ họng KHÔNG RUNG.',
    commonMistakeNote: 'Lỗi học sinh VN hay đọc thành âm "th" hoặc "s" hoặc "t". Đây là âm then chốt!',
    comparisonWith: 'Đối ứng với âm hữu thanh /ð/ trong "this, that"'
  },
  {
    symbol: '/s/',
    type: 'consonant-unvoiced',
    typeLabel: 'Phụ âm vô thanh (Âm xì nhẹ)',
    exampleWord: 'see',
    exampleWordIpa: '/siː/',
    exampleWordVi: 'nhìn thấy',
    highlightPart: 's',
    mouthGuide: 'Hai hàm răng khép hờ, đầu lưỡi gần chân răng, đẩy luồng hơi xì qua kẽ răng.',
    commonMistakeNote: 'Âm đuôi số nhiều /s/ sau phụ âm vô thanh: books, cats, stops.',
    comparisonWith: 'Đối ứng với âm hữu thanh /z/ trong "dogs, plays"'
  },
  {
    symbol: '/ʃ/',
    type: 'consonant-unvoiced',
    typeLabel: 'Phụ âm vô thanh (Âm S nặng chu môi)',
    exampleWord: 'she',
    exampleWordIpa: '/ʃiː/',
    exampleWordVi: 'cô ấy',
    highlightPart: 'sh',
    mouthGuide: 'Chu môi tròn về phía trước, thân lưỡi nâng lên vòm họng, đẩy luồng hơi xì mạnh như ra hiệu im lặng.',
    commonMistakeNote: 'Có trong "sh", "ti" (action), "ci" (special).',
    comparisonWith: 'Đối ứng với âm hữu thanh /ʒ/ trong "vision"'
  },
  {
    symbol: '/tʃ/',
    type: 'consonant-unvoiced',
    typeLabel: 'Phụ âm vô thanh (Âm Ch bật hơi mạnh)',
    exampleWord: 'chair',
    exampleWordIpa: '/tʃeə/',
    exampleWordVi: 'cái ghế',
    highlightPart: 'ch',
    mouthGuide: 'Chu môi, đầu lưỡi chạm vòm miệng chặn hơi rồi bật mạnh luồng hơi ra, cổ họng không rung.',
    commonMistakeNote: 'Có trong "ch" (chair, watch) và "tu" (picture, nature).',
    comparisonWith: 'Đối ứng với âm hữu thanh /dʒ/ trong "jump, judge"'
  },

  // 5. PHỤ ÂM HỮU THANH (16 ÂM - DÂY THANH RUNG MẠNH)
  {
    symbol: '/b/',
    type: 'consonant-voiced',
    typeLabel: 'Phụ âm hữu thanh (Có rung)',
    exampleWord: 'book',
    exampleWordIpa: '/bʊk/',
    exampleWordVi: 'sách',
    highlightPart: 'b',
    mouthGuide: 'Mím hai môi rồi bật ra đồng thời làm rung mạnh dây thanh quản ở cổ họng.',
    commonMistakeNote: 'Đặt tay lên cổ họng sẽ cảm nhận rung rõ rệt.',
  },
  {
    symbol: '/d/',
    type: 'consonant-voiced',
    typeLabel: 'Phụ âm hữu thanh (Có rung)',
    exampleWord: 'door',
    exampleWordIpa: '/dɔː/',
    exampleWordVi: 'cánh cửa',
    highlightPart: 'd',
    mouthGuide: 'Đầu lưỡi chạm nướu trên rồi bật ra kèm âm thanh rung cổ họng.',
    commonMistakeNote: 'Âm đuôi quá khứ -ed sau nguyên âm và âm hữu thanh: played, cleaned.',
  },
  {
    symbol: '/ɡ/',
    type: 'consonant-voiced',
    typeLabel: 'Phụ âm hữu thanh (Có rung)',
    exampleWord: 'good',
    exampleWordIpa: '/ɡʊd/',
    exampleWordVi: 'tốt, giỏi',
    highlightPart: 'g',
    mouthGuide: 'Cuống lưỡi nâng lên chặn vòm mềm rồi hạ xuống và rung mạnh cổ họng.',
    commonMistakeNote: 'Không đọc thành "gờ" kéo dài.',
  },
  {
    symbol: '/v/',
    type: 'consonant-voiced',
    typeLabel: 'Phụ âm hữu thanh (Có rung)',
    exampleWord: 'voice',
    exampleWordIpa: '/vɔɪs/',
    exampleWordVi: 'giọng nói',
    highlightPart: 'v',
    mouthGuide: 'Răng cửa trên chạm môi dưới, đẩy luồng hơi và rung mạnh thanh quản.',
    commonMistakeNote: 'Khác với âm /f/ ở chỗ dây thanh quản phải rung rền.',
  },
  {
    symbol: '/ð/',
    type: 'consonant-voiced',
    typeLabel: 'Phụ âm hữu thanh (Âm Th cắn lưỡi rung họng)',
    exampleWord: 'this',
    exampleWordIpa: '/ðɪs/',
    exampleWordVi: 'cái này',
    highlightPart: 'th',
    mouthGuide: 'ĐẶT ĐẦU LƯỠI GIỮA HAI HÀM RĂNG, thổi hơi đồng thời RUNG MẠNH CỔ HỌNG.',
    commonMistakeNote: 'Xuất hiện trong các đại từ: this, that, these, those, they, then, mother, father.',
    comparisonWith: 'Đối ứng với âm vô thanh /θ/ trong "think, thank"'
  },
  {
    symbol: '/z/',
    type: 'consonant-voiced',
    typeLabel: 'Phụ âm hữu thanh (Âm Z rung răng)',
    exampleWord: 'zoo',
    exampleWordIpa: '/zuː/',
    exampleWordVi: 'sở thú',
    highlightPart: 'z',
    mouthGuide: 'Khép nhẹ hai hàm răng, xì luồng hơi đồng thời làm rung mạnh dây thanh quản.',
    commonMistakeNote: 'Âm đuôi số nhiều và chia ngôi thứ 3: dogs, plays, pens, reads.',
  },
  {
    symbol: '/ʒ/',
    type: 'consonant-voiced',
    typeLabel: 'Phụ âm hữu thanh (Âm Gi nhẹ rung họng)',
    exampleWord: 'vision',
    exampleWordIpa: '/ˈvɪʒ.ən/',
    exampleWordVi: 'tầm nhìn',
    highlightPart: 'si',
    mouthGuide: 'Chu môi tròn giống /ʃ/ nhưng rung mạnh thanh quản.',
    commonMistakeNote: 'Có trong "television", "usually", "decision", "measure", "pleasure".',
  },
  {
    symbol: '/dʒ/',
    type: 'consonant-voiced',
    typeLabel: 'Phụ âm hữu thanh (Âm J tiếng Anh)',
    exampleWord: 'jump',
    exampleWordIpa: '/dʒʌmp/',
    exampleWordVi: 'nhảy lên',
    highlightPart: 'j',
    mouthGuide: 'Chu môi, bật âm mạnh từ đầu lưỡi chạm vòm miệng kèm rung mạnh thanh quản.',
    commonMistakeNote: 'Có trong "j" (job), "g" (gym, age), "dge" (bridge).',
  },
  {
    symbol: '/m/',
    type: 'consonant-voiced',
    typeLabel: 'Phụ âm mũi hữu thanh',
    exampleWord: 'mother',
    exampleWordIpa: '/ˈmʌð.ər/',
    exampleWordVi: 'người mẹ',
    highlightPart: 'm',
    mouthGuide: 'Khép hai môi, luồng hơi thoát ra qua đường mũi kèm rung thanh quản.',
  },
  {
    symbol: '/n/',
    type: 'consonant-voiced',
    typeLabel: 'Phụ âm mũi hữu thanh',
    exampleWord: 'name',
    exampleWordIpa: '/neɪm/',
    exampleWordVi: 'tên',
    highlightPart: 'n',
    mouthGuide: 'Đầu lưỡi chạm nướu trên chặn khoang miệng, luồng hơi thoát qua đường mũi.',
  },
  {
    symbol: '/ŋ/',
    type: 'consonant-voiced',
    typeLabel: 'Phụ âm mũi hữu thanh (Âm Ng)',
    exampleWord: 'sing',
    exampleWordIpa: '/sɪŋ/',
    exampleWordVi: 'hát',
    highlightPart: 'ng',
    mouthGuide: 'Cuống lưỡi nâng lên chạm vòm miệng mềm chặn hơi, luồng khí thoát qua mũi.',
    commonMistakeNote: 'Thường thấy ở đuôi -ing (English, reading, song).',
  },
  {
    symbol: '/h/',
    type: 'consonant-unvoiced',
    typeLabel: 'Phụ âm hơi thở vô thanh',
    exampleWord: 'hat',
    exampleWordIpa: '/hæt/',
    exampleWordVi: 'cái mũ',
    highlightPart: 'h',
    mouthGuide: 'Mở miệng tự nhiên, thở nhẹ một luồng hơi ấm từ cổ họng ra ngoài.',
  },
  {
    symbol: '/l/',
    type: 'consonant-voiced',
    typeLabel: 'Phụ âm bên hữu thanh',
    exampleWord: 'love',
    exampleWordIpa: '/lʌv/',
    exampleWordVi: 'yêu thương',
    highlightPart: 'l',
    mouthGuide: 'Đầu lưỡi chạm nướu trên, luồng hơi đi qua hai bên mép lưỡi.',
  },
  {
    symbol: '/r/',
    type: 'consonant-voiced',
    typeLabel: 'Phụ âm uốn lưỡi hữu thanh',
    exampleWord: 'red',
    exampleWordIpa: '/red/',
    exampleWordVi: 'màu đỏ',
    highlightPart: 'r',
    mouthGuide: 'Cong đầu lưỡi về phía sau nhưng KHÔNG chạm vào vòm miệng, rung thanh quản.',
  },
  {
    symbol: '/w/',
    type: 'consonant-voiced',
    typeLabel: 'Bán nguyên âm hữu thanh',
    exampleWord: 'water',
    exampleWordIpa: '/ˈwɔː.tər/',
    exampleWordVi: 'nước uống',
    highlightPart: 'w',
    mouthGuide: 'Chu môi nhỏ lại thành hình tròn giống âm /uː/ rồi nhanh chóng mở miệng phát âm.',
  },
  {
    symbol: '/j/',
    type: 'consonant-voiced',
    typeLabel: 'Bán nguyên âm hữu thanh (Âm Y)',
    exampleWord: 'yes',
    exampleWordIpa: '/jes/',
    exampleWordVi: 'đồng ý / vâng',
    highlightPart: 'y',
    mouthGuide: 'Nâng thân lưỡi lên gần vòm miệng giống âm /iː/ rồi nhanh chóng trượt sang nguyên âm tiếp theo.',
    commonMistakeNote: 'Dễ nhầm với âm /dʒ/. Trong "yes, yellow, you, student" (/ˈstjuːdnt/).',
  }
];

interface IpaChartPronunciationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IpaChartPronunciationModal: React.FC<IpaChartPronunciationModalProps> = ({ isOpen, onClose }) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [currentAccent, setCurrentAccent] = useState<VoiceAccent>(audioPronunciationService.getAccent());
  const [activeSound, setActiveSound] = useState<IpaSound>(IPA_44_SOUNDS[0]);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speakingWord, setSpeakingWord] = useState<string>('');

  if (!isOpen) return null;

  const handleToggleAccent = (acc: VoiceAccent) => {
    setCurrentAccent(acc);
    audioPronunciationService.setAccent(acc);
  };

  const handlePlaySound = async (sound: IpaSound) => {
    setActiveSound(sound);
    setIsSpeaking(true);
    setSpeakingWord(sound.exampleWord);

    // Phát âm từ ví dụ với tốc độ chậm chuẩn
    await audioPronunciationService.speak(sound.exampleWord, {
      accent: currentAccent,
      rate: 0.78,
      onStart: () => setIsSpeaking(true),
      onEnd: () => {
        setIsSpeaking(false);
        setSpeakingWord('');
      }
    });
  };

  const filteredSounds = IPA_44_SOUNDS.filter(s => {
    if (filterType === 'all') return true;
    if (filterType === 'vowels') return s.type.startsWith('monophthong') || s.type === 'diphthong';
    if (filterType === 'consonants') return s.type.startsWith('consonant');
    if (filterType === 'tricky') {
      return ['/θ/', '/ð/', '/ʃ/', '/tʃ/', '/dʒ/', '/ʒ/', '/æ/', '/ʌ/', '/uː/', '/ʊ/'].includes(s.symbol);
    }
    return s.type === filterType;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border-2 border-blue-600 rounded-3xl shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden text-slate-800 dark:text-white">
        
        {/* HEADER MODAL */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-800 text-white p-4 sm:p-5 flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center shadow-inner">
              <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black flex items-center gap-2 tracking-tight">
                <span>Bảng 44 Âm Chuẩn Quốc Tế IPA (International Phonetic Alphabet)</span>
                <span className="text-[11px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                  Chuẩn Tuyệt Đối
                </span>
              </h2>
              <p className="text-xs text-blue-100 font-medium">
                Nghe phát âm chuẩn bản xứ từng âm tiết, khẩu hình miệng & từ ví dụ sách giáo khoa Global Success
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* TOGGLE US / UK ACCENT */}
            <div className="inline-flex rounded-xl p-1 bg-black/20 border border-white/20 text-xs font-bold">
              <button
                type="button"
                onClick={() => handleToggleAccent('US')}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                  currentAccent === 'US' ? 'bg-amber-400 text-slate-950 font-black shadow' : 'text-blue-100 hover:text-white'
                }`}
              >
                <span>🇺🇸 US (Mỹ)</span>
              </button>
              <button
                type="button"
                onClick={() => handleToggleAccent('UK')}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                  currentAccent === 'UK' ? 'bg-amber-400 text-slate-950 font-black shadow' : 'text-blue-100 hover:text-white'
                }`}
              >
                <span>🇬🇧 UK (Anh)</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* BỘ LỌC DẠNG ÂM */}
        <div className="bg-blue-50 dark:bg-slate-800/80 px-4 py-2.5 border-b border-blue-200 dark:border-slate-700 flex flex-wrap items-center gap-2 shrink-0">
          <span className="text-xs font-black text-blue-900 dark:text-blue-200 uppercase tracking-wider mr-1">
            Bộ Lọc:
          </span>
          {[
            { id: 'all', label: 'Tất cả 44 Âm' },
            { id: 'tricky', label: '⭐ Top 10 Âm Hay Thi & Dễ Nhầm' },
            { id: 'vowels', label: '20 Nguyên Âm (Vowels)' },
            { id: 'consonants', label: '24 Phụ Âm (Consonants)' },
            { id: 'monophthong-long', label: 'Nguyên âm dài (/iː/, /uː/...)' },
            { id: 'monophthong-short', label: 'Nguyên âm ngắn (/ɪ/, /ʊ/...)' },
            { id: 'diphthong', label: 'Nguyên âm đôi (/eɪ/, /aɪ/...)' }
          ].map(f => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilterType(f.id)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                filterType === f.id
                  ? 'bg-blue-600 text-white shadow font-black border border-blue-700'
                  : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-blue-100 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-600'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* NỘI DUNG CHÍNH: 2 CỘT (DANH SÁCH ÂM + CHI TIẾT ÂM ĐANG CHỌN) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* CỘT TRÁI: GRID CÁC ÂM (8 CỘT) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
              {filteredSounds.map((snd) => {
                const isSelected = activeSound.symbol === snd.symbol;
                const isCurrentSpeaking = isSpeaking && speakingWord === snd.exampleWord;

                let cardBg = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:shadow-md';
                if (snd.type.startsWith('monophthong-long')) {
                  cardBg = 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800/40';
                } else if (snd.type.startsWith('monophthong-short')) {
                  cardBg = 'bg-sky-50/50 dark:bg-sky-950/20 border-sky-200 dark:border-sky-800/40';
                } else if (snd.type === 'diphthong') {
                  cardBg = 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40';
                } else if (snd.type === 'consonant-unvoiced') {
                  cardBg = 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40';
                } else {
                  cardBg = 'bg-purple-50/50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800/40';
                }

                if (isSelected) {
                  cardBg += ' ring-2 ring-blue-600 border-blue-600 shadow-lg scale-102';
                }

                return (
                  <button
                    key={snd.symbol}
                    type="button"
                    onClick={() => handlePlaySound(snd)}
                    className={`p-2.5 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center cursor-pointer group relative overflow-hidden ${cardBg}`}
                  >
                    {isCurrentSpeaking && (
                      <span className="absolute top-1 right-1 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                      </span>
                    )}

                    <div className="font-mono text-lg sm:text-xl font-black text-blue-700 dark:text-blue-300 group-hover:scale-110 transition-transform">
                      {snd.symbol}
                    </div>

                    <div className="text-xs font-black text-slate-800 dark:text-slate-100 mt-1 flex items-center gap-1">
                      <span>{snd.exampleWord}</span>
                      <Volume2 className="w-3 h-3 text-blue-500 group-hover:text-blue-700" />
                    </div>

                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                      {snd.exampleWordVi}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CỘT PHẢI: CHI TIẾT SƯ PHẠM VÀ HƯỚNG DẪN KHẨU HÌNH (5 CỘT) */}
          <div className="lg:col-span-5 bg-gradient-to-b from-blue-50 via-white to-blue-50/40 dark:from-slate-800 dark:to-slate-850 p-5 rounded-3xl border-2 border-blue-300 dark:border-blue-900 shadow-inner flex flex-col justify-between">
            <div className="space-y-4">
              
              {/* HEADER ÂM ĐANG CHỌN */}
              <div className="flex items-center justify-between pb-3 border-b border-blue-200 dark:border-slate-700">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/40 px-2.5 py-1 rounded-full">
                    {activeSound.typeLabel}
                  </span>
                  <div className="font-mono text-4xl sm:text-5xl font-black text-blue-800 dark:text-blue-200 mt-2">
                    {activeSound.symbol}
                  </div>
                </div>

                {/* NÚT PHÁT ÂM TO */}
                <button
                  type="button"
                  onClick={() => handlePlaySound(activeSound)}
                  className="px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm flex items-center gap-2 shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95 transition cursor-pointer"
                >
                  <Volume2 className={`w-5 h-5 ${isSpeaking ? 'animate-bounce text-amber-300' : ''}`} />
                  <span>Nghe Phát Âm</span>
                </button>
              </div>

              {/* TỪ VÍ DỤ MINH HỌA */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-slate-700 shadow-sm">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  Từ ví dụ bám sát SGK:
                </div>
                <div className="flex items-baseline gap-2.5 mt-1">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    {activeSound.exampleWord}
                  </span>
                  <span className="text-base font-mono font-bold text-blue-600 dark:text-blue-400">
                    {activeSound.exampleWordIpa}
                  </span>
                  <span className="text-xs text-slate-600 dark:text-slate-300 font-medium italic">
                    ({activeSound.exampleWordVi})
                  </span>
                </div>
                <div className="mt-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                  Phần phát âm: chữ cái <strong className="text-rose-600 dark:text-rose-400 underline decoration-2">{activeSound.highlightPart}</strong> được đọc là <strong className="font-mono text-blue-600 dark:text-blue-400">{activeSound.symbol}</strong>.
                </div>
              </div>

              {/* HƯỚNG DẪN KHẨU HÌNH MIỆNG CHUẨN */}
              <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-emerald-950 dark:text-emerald-100">
                <div className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 mb-1.5">
                  <Info className="w-4 h-4 text-emerald-600" />
                  <span>Cách đặt môi, răng, lưỡi (Khẩu hình miệng):</span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed font-medium">
                  {activeSound.mouthGuide}
                </p>
              </div>

              {/* LƯU Ý DỄ NHẦM & BẪY THI */}
              {activeSound.commonMistakeNote && (
                <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-amber-950 dark:text-amber-200">
                  <div className="text-xs font-black uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Lỗi học sinh thường gặp & Bẫy đề kiểm tra:</span>
                  </div>
                  <p className="text-xs leading-relaxed font-medium">
                    {activeSound.commonMistakeNote}
                  </p>
                </div>
              )}

              {/* SO SÁNH PHÂN BIỆT */}
              {activeSound.comparisonWith && (
                <div className="text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-100/70 dark:bg-blue-900/40 px-3 py-2 rounded-xl flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{activeSound.comparisonWith}</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-blue-200 dark:border-slate-700 text-[11px] text-slate-500 text-center">
              💡 Bấm vào từng âm bên trái để luyện nghe giọng đọc chuẩn bản xứ {currentAccent === 'US' ? 'Hoa Kỳ (US)' : 'Vương quốc Anh (UK)'}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
export default IpaChartPronunciationModal;
