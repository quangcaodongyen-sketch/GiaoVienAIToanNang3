import { StudentDobVerificationModal } from './StudentDobVerificationModal';
import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  Image as ImageIcon, 
  Trash2, 
  Heart, 
  ShieldAlert, 
  AlertCircle, 
  X, 
  CheckCircle2, 
  User, 
  Clock, 
  Sparkles,
  Lock,
  Flag,
  CornerDownRight,
  Eye,
  EyeOff,
  ThumbsUp,
  Smile,
  Flame,
  Award,
  Lightbulb,
  Share2
} from 'lucide-react';
import { 
  studentForumService, 
  ForumPost, 
  ForumComment,
  ReactionType, 
  FORUM_REACTIONS 
} from '../services/studentForumService';
import { studentGradebookService, StudentProfile } from '../services/studentGradebookService';
import { systemMaintenanceService } from '../services/systemMaintenanceService';

interface StudentForumViewProps {
  currentStudent: StudentProfile | null;
  isAdmin: boolean;
  onRequestAuth: () => void;
  onRequestAdminLogin: () => void;
}

// Danh sách từ ngữ cấm học đường
const FORBIDDEN_WORDS = [
  'dit', 'lon', 'buoi', 'cac', 'cc', 'dcm', 'cl', 'vcl', 'vl', 'dm', 'dkm', 'đụ', 'địt', 'lồn', 'buồi', 'cặc', 'đĩ', 'chó',
  'chet', 'giet', 'tu tu', 'ma tuy', 'ke', 'da', 'sex', 'porn', 'xxx', 'fuck', 'bitch', 'asshole', 'shit', 'pussy', 'dick',
  'ngu', 'oc cho', 'suc vat', 'khung', 'dien', 'dmm', 'loz', 'lol', 'cave', 'dam tac', 'khung bo', 'phan dong'
];

function checkInappropriateText(val: string): boolean {
  if (!val) return false;
  const clean = val.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, ' ');
  const words = clean.split(/\s+/).filter(Boolean);
  return FORBIDDEN_WORDS.some(bad => words.includes(bad) || clean.includes(' ' + bad + ' '));
}

// Nén ảnh trước khi lưu trữ để bảo đảm hiệu năng
async function resizeImageBase64(file: File, maxWidth: number = 800, maxHeight: number = 800): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.75));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Quick stickers for friendly educational comments
const QUICK_FEEDBACK_STICKERS = [
  { label: '💡 Bài giải hay quá!', text: '💡 Cảm ơn bạn, cách giải này rất hay và dễ hiểu!' },
  { label: '👏 Cảm ơn bạn nhé!', text: '👏 Cảm ơn bạn đã chia sẻ kiến thức bổ ích!' },
  { label: '❤️ Rất đồng ý!', text: '❤️ Mình hoàn toàn đồng ý với ý kiến của bạn!' },
  { label: '💪 Cùng cố gắng nhé!', text: '💪 Chúng mình cùng nhau cố gắng đạt điểm cao kỳ này nhé!' }
];

// Lấy ID định danh ẩn danh của thiết bị để học sinh thả tim, like, cảm xúc không cần đăng nhập
function getAnonymousReactionId(): string {
  try {
    const key = 'GVAI_FORUM_ANON_REACTION_ID';
    let anonId = localStorage.getItem(key);
    if (!anonId) {
      anonId = 'anon_stu_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
      localStorage.setItem(key, anonId);
    }
    return anonId;
  } catch {
    return 'anon_guest_student';
  }
}

export const StudentForumView: React.FC<StudentForumViewProps> = ({
  currentStudent,
  isAdmin,
  onRequestAuth,
  onRequestAdminLogin
}) => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [showDobModal, setShowDobModal] = useState<boolean>(false);
  const [dobActionTitle, setDobActionTitle] = useState<string>('đăng bài trên diễn đàn');
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [newContent, setNewContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [previewImageModal, setPreviewImageModal] = useState<string | null>(null);

  // Reaction Bar Dock state
  const [hoveredReactionPostId, setHoveredReactionPostId] = useState<string | null>(null);
  const [reactionUsersModalPostId, setReactionUsersModalPostId] = useState<string | null>(null);

  // Quản lý bình luận
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  // Báo cáo vi phạm
  const [reportModalPostId, setReportModalPostId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('Nội dung không phù hợp với môi trường giáo dục');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tải danh sách bài viết
  const loadPosts = () => {
    setPosts(studentForumService.getPosts());
  };

  useEffect(() => {
    loadPosts();
    const handleUpdate = () => loadPosts();
    window.addEventListener('gvai_forum_data_changed', handleUpdate);
    return () => {
      window.removeEventListener('gvai_forum_data_changed', handleUpdate);
    };
  }, []);

  // Xử lý chọn ảnh
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chỉ chọn tệp hình ảnh (JPG, PNG, WebP)!');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Ảnh có dung lượng quá lớn (tối đa 10MB)!');
      return;
    }

    try {
      setIsCompressing(true);
      const base64 = await resizeImageBase64(file);
      setSelectedImage(base64);
    } catch {
      alert('Lỗi khi tải ảnh. Vui lòng thử lại!');
    } finally {
      setIsCompressing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Đăng bài viết mới
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!currentStudent && !isAdmin) {
      alert('Em vui lòng nhập Họ tên và Lớp để đăng bài trên diễn đàn nhé!');
      onRequestAuth();
      return;
    }

    // YÊU CẦU BẮT BUỘC: Xác thực danh tính bằng ngày tháng năm sinh mới cho đăng bài
    if (!isAdmin && currentStudent) {
      if (!studentGradebookService.isStudentIdentityVerified(currentStudent.id)) {
        setDobActionTitle('đăng bài viết mới trên diễn đàn');
        setPendingAction(() => () => {
          // Callback sau khi xác thực thành công sẽ tự động gửi bài
          handleCreatePost(e);
        });
        setShowDobModal(true);
        return;
      }
    }

    const text = newContent.trim();
    if (!text && !selectedImage) {
      setErrorMsg('Vui lòng nhập nội dung bài viết hoặc đính kèm ảnh!');
      return;
    }

    if (checkInappropriateText(text)) {
      alert('⚠️ CẢNH BÁO SƯ PHẠM: Bài viết chứa từ ngữ vi phạm quy chuẩn văn minh học đường!');
      setErrorMsg('Nội dung chứa từ ngữ không phù hợp với môi trường giáo dục!');
      return;
    }

    const authorId = isAdmin ? 'admin-dinh-thanh' : (currentStudent?.id || 'guest');
    const authorName = isAdmin ? 'Thầy Đinh Văn Thành (Admin)' : (currentStudent?.name || 'Học sinh');
    const authorClass = isAdmin ? 'Giáo Viên THCS Đồng Yên' : (currentStudent?.className || '8A1');
    const authorStudentCode = isAdmin ? 'GV-ADMIN' : (currentStudent?.studentCode || 'HS');
    const authorGender = currentStudent?.gender || 'Nam';

    studentForumService.createPost({
      authorId,
      authorName,
      authorClass,
      authorStudentCode,
      authorGender,
      content: text,
      imageUrl: selectedImage || undefined
    });

    // Thưởng điểm chuyên cần khi đăng bài trao đổi học tập tích cực
    if (currentStudent) {
      try {
        studentGradebookService.recordPracticeMerit(
          currentStudent.id,
          'Đăng bài trao đổi trên diễn đàn học sinh',
          5
        );
      } catch (err) {}
    }

    setNewContent('');
    setSelectedImage(null);
    setSuccessMsg('🎉 Đăng bài viết thành công! Cảm ơn em đã chia sẻ cùng các bạn.');
    setTimeout(() => setSuccessMsg(''), 4000);
    loadPosts();
  };

  // Xử lý thả biểu cảm Facebook-style (Học sinh thả tim, like, cảm xúc tự do KHÔNG CẦN ĐĂNG NHẬP)
  const handleReaction = (postId: string, reactionType: ReactionType) => {
    const studentId = isAdmin 
      ? 'admin-dinh-thanh' 
      : (currentStudent?.id || getAnonymousReactionId());
    const studentName = isAdmin 
      ? 'Thầy Đinh Văn Thành' 
      : (currentStudent?.name || 'Học sinh ẩn danh');
    const studentClass = isAdmin 
      ? 'Giáo Viên' 
      : (currentStudent?.className || 'THCS Đồng Yên');

    studentForumService.setReaction(postId, studentId, studentName, studentClass, reactionType);
    setHoveredReactionPostId(null);
    loadPosts();

    // Thưởng điểm chuyên cần khi tương tác tích cực (nếu học sinh đã đăng nhập)
    if (currentStudent) {
      try {
        studentGradebookService.recordPracticeMerit(
          currentStudent.id,
          `Thả cảm xúc ${FORUM_REACTIONS[reactionType].label} trên diễn đàn`,
          1
        );
      } catch (err) {}
    }
  };

  // Gửi bình luận
  const handleSendComment = (postId: string, customText?: string) => {
    const rawText = customText !== undefined ? customText : (commentInputs[postId] || '');
    const text = rawText.trim();
    if (!text) return;

    if (!currentStudent && !isAdmin) {
      alert('Em vui lòng nhập Họ tên và Lớp để bình luận nhé!');
      onRequestAuth();
      return;
    }

    // YÊU CẦU BẮT BUỘC: Xác thực danh tính bằng ngày tháng năm sinh mới cho bình luận
    if (!isAdmin && currentStudent) {
      if (!studentGradebookService.isStudentIdentityVerified(currentStudent.id)) {
        setDobActionTitle('gửi bình luận trên diễn đàn');
        setPendingAction(() => () => {
          handleSendComment(postId, customText);
        });
        setShowDobModal(true);
        return;
      }
    }

    if (checkInappropriateText(text)) {
      alert('⚠️ CẢNH BÁO SƯ PHẠM: Bình luận chứa từ ngữ không phù hợp với văn hóa học đường!');
      return;
    }

    const authorId = isAdmin ? 'admin-dinh-thanh' : (currentStudent?.id || 'guest');
    const authorName = isAdmin ? 'Thầy Đinh Văn Thành (Admin)' : (currentStudent?.name || 'Học sinh');
    const authorClass = isAdmin ? 'Giáo Viên' : (currentStudent?.className || '8A1');
    const authorGender = currentStudent?.gender || 'Nam';

    studentForumService.addComment(postId, {
      authorId,
      authorName,
      authorClass,
      authorGender,
      content: text
    });

    // Xóa input của bài viết này
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    loadPosts();

    // Thưởng điểm chuyên cần khi tham gia thảo luận bài vở
    if (currentStudent) {
      try {
        studentGradebookService.recordPracticeMerit(
          currentStudent.id,
          'Bình luận đóng góp học tập trên diễn đàn',
          2
        );
      } catch (err) {}
    }
  };

  // Xóa bình luận
  const handleDeleteComment = (postId: string, commentId: string) => {
    if (!window.confirm('Em có chắc chắn muốn xóa bình luận này không?')) return;
    const currentUserId = isAdmin ? 'admin-dinh-thanh' : (currentStudent?.id || '');
    studentForumService.deleteComment(postId, commentId, currentUserId, isAdmin);
    loadPosts();
  };

  // Thả tim cho bình luận (Học sinh thả like KHÔNG CẦN ĐĂNG NHẬP)
  const handleLikeComment = (postId: string, commentId: string) => {
    const studentId = isAdmin 
      ? 'admin-dinh-thanh' 
      : (currentStudent?.id || getAnonymousReactionId());
    studentForumService.toggleCommentLike(postId, commentId, studentId);
    loadPosts();
  };

  // Xóa bài viết
  const handleDeletePost = (postId: string) => {
    if (!window.confirm('Em có chắc chắn muốn xóa bài viết này không?')) return;
    const currentUserId = isAdmin ? 'admin-dinh-thanh' : (currentStudent?.id || '');
    const res = studentForumService.deletePost(postId, currentUserId, isAdmin);
    if (res) {
      loadPosts();
    } else {
      alert('Chỉ tác giả bài viết hoặc Giáo viên Admin mới có quyền xóa bài!');
    }
  };

  // Xóa ảnh vi phạm
  const handleDeleteImage = (postId: string) => {
    if (!window.confirm('Bạn có muốn xóa ảnh đính kèm của bài viết này không?')) return;
    const currentUserId = isAdmin ? 'admin-dinh-thanh' : (currentStudent?.id || '');
    studentForumService.deletePostImage(postId, currentUserId, isAdmin);
    loadPosts();
  };

  // Gửi báo cáo bài viết
  const handleSendReport = () => {
    if (!reportModalPostId) return;
    studentForumService.reportPost(reportModalPostId, reportReason);
    alert('Đã gửi báo cáo vi phạm tới Thầy Đinh Văn Thành để kiểm duyệt. Cảm ơn em!');
    setReportModalPostId(null);
    loadPosts();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in">
      {/* BANNER HEADER DIỄN ĐÀN */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white p-6 sm:p-7 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-black uppercase tracking-wider backdrop-blur-md">
              CỘNG ĐỒNG HỌC TẬP THCS ĐỒNG YÊN
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider">
              TƯƠNG TÁC SÔI ĐỘNG • VĂN MINH HỌC ĐƯỜNG
            </span>
          </div>

          <h2 className="text-xl sm:text-3xl font-black uppercase tracking-tight flex items-center gap-2.5">
            <span>💬 Diễn Đàn Trao Đổi Bài Học &amp; Thảo Luận Học Sinh</span>
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
            Học sinh có thể tự do hỏi đáp bài tập, chia sẻ phương pháp học tiếng Anh, cùng nhau bình luận, thả tim, thả like và các biểu cảm sáng tạo Facebook-style!
          </p>

          <div className="pt-2 flex items-center gap-3 text-xs font-bold text-amber-200 flex-wrap">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-xl">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Đăng bài học tập: <strong>+5đ chuyên cần</strong></span>
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-xl">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-300" />
              <span>Bình luận giúp đỡ bạn: <strong>+2đ chuyên cần</strong></span>
            </span>
          </div>
        </div>
      </div>

      {/* KHUNG ĐĂNG BÀI VIẾT MỚI */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-black text-lg shadow-sm shrink-0">
            {currentStudent ? (currentStudent.gender === 'Nữ' ? '👧' : '👦') : '👤'}
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-800 dark:text-white">
              {currentStudent ? `${currentStudent.name} (Lớp ${currentStudent.className})` : 'Chào em! Hãy đăng bài trao đổi bài tập cùng các bạn nhé'}
            </h3>
            <p className="text-xs text-slate-400">
              {currentStudent ? 'Chia sẻ câu hỏi, ảnh chụp bài tập hoặc ý kiến học tập' : 'Vui lòng vào học với Tên và Lớp để đăng bài'}
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-2xl bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleCreatePost} className="space-y-3">
          <textarea
            rows={3}
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Hôm nay em muốn hỏi bài tập nào, hoặc có mẹo ghi nhớ từ vựng nào hay muốn chia sẻ cùng các bạn không?..."
            className="w-full p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:border-indigo-600 focus:outline-hidden transition leading-relaxed resize-none"
          />

          {/* Xem trước ảnh đính kèm */}
          {selectedImage && (
            <div className="relative inline-block mt-2">
              <img
                src={selectedImage}
                alt="Đính kèm"
                className="max-h-48 rounded-2xl border border-slate-300 dark:border-slate-700 object-cover shadow-sm"
              />
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition cursor-pointer"
                title="Xóa ảnh này"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="forumImageInput"
              />
              <label
                htmlFor="forumImageInput"
                className={`px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition flex items-center gap-1.5 cursor-pointer ${
                  isCompressing ? 'opacity-50 pointer-events-none' : ''
                }`}
              >
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                <span>{isCompressing ? 'Đang nén ảnh...' : 'Đính kèm ảnh'}</span>
              </label>

              <span className="text-[11px] text-slate-400 hidden sm:inline">
                (Ảnh bài tập, sơ đồ tư duy, bảng từ vựng...)
              </span>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Đăng Lên Diễn Đàn</span>
            </button>
          </div>
        </form>
      </div>

      {/* DANH SÁCH BÀI VIẾT DIỄN ĐÀN */}
      <div className="space-y-5">
        {posts.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-2">
            <div className="text-4xl">📝</div>
            <h4 className="text-base font-bold text-slate-700 dark:text-slate-300">Chưa có bài viết nào</h4>
            <p className="text-xs text-slate-400">Hãy là người đầu tiên đặt câu hỏi và chia sẻ cùng các bạn nhé!</p>
          </div>
        ) : (
          posts.map(post => {
            const currentStudentId = isAdmin ? 'admin-dinh-thanh' : (currentStudent?.id || getAnonymousReactionId());
            const userReaction: ReactionType | undefined = post.reactions ? post.reactions[currentStudentId] : undefined;
            const hasReacted = Boolean(userReaction || (post.likedBy && post.likedBy.includes(currentStudentId)));
            const activeReactionConfig = userReaction ? FORUM_REACTIONS[userReaction] : (hasReacted ? FORUM_REACTIONS.heart : null);

            // Thống kê các biểu cảm đang có trên bài viết
            const reactionCounts: Record<ReactionType, number> = {
              heart: 0, like: 0, clap: 0, genius: 0, star: 0, fire: 0, joy: 0, support: 0
            };
            if (post.reactions) {
              Object.values(post.reactions).forEach(r => {
                if (reactionCounts[r] !== undefined) reactionCounts[r]++;
              });
            } else if (post.likes > 0) {
              reactionCounts.heart = post.likes;
            }

            const activeReactionsList = (Object.keys(reactionCounts) as ReactionType[])
              .filter(k => reactionCounts[k] > 0)
              .sort((a, b) => reactionCounts[b] - reactionCounts[a]);

            const totalReactionCount = Object.values(reactionCounts).reduce((a, b) => a + b, 0);

            const isAuthor = currentStudent && (currentStudent.id === post.authorId || currentStudent.studentCode === post.authorStudentCode);
            const canDelete = isAuthor || isAdmin;

            return (
              <div 
                key={post.id}
                className={`bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border shadow-xs transition space-y-4 ${
                  post.isPinned 
                    ? 'border-amber-300 dark:border-amber-800/80 bg-amber-50/20 dark:bg-amber-950/10' 
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Header bài viết */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-xs shrink-0">
                      {post.authorGender === 'Nữ' ? '👧' : '👦'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <strong className="text-sm font-black text-slate-900 dark:text-white">
                          {post.authorName}
                        </strong>
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                          {post.authorClass}
                        </span>
                        {post.isPinned && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                            📌 Ghim Của Thầy
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(post.createdAt).toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Menu hành động góc phải (Xóa, Báo cáo) */}
                  <div className="flex items-center gap-1.5">
                    {canDelete && (
                      <button
                        type="button"
                        onClick={() => handleDeletePost(post.id)}
                        className="p-1.5 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                        title="Xóa bài viết này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    {!canDelete && !isAdmin && (
                      <button
                        type="button"
                        onClick={() => setReportModalPostId(post.id)}
                        className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-amber-600 transition cursor-pointer"
                        title="Báo cáo vi phạm cho Giáo viên"
                      >
                        <Flag className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Nội dung bài viết */}
                <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                  {post.content}
                </div>

                {/* Ảnh đính kèm (nếu có) */}
                {post.imageUrl && (
                  <div className="relative group rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 max-w-lg bg-slate-950">
                    <img
                      src={post.imageUrl}
                      alt="Ảnh bài viết"
                      onClick={() => setPreviewImageModal(post.imageUrl || null)}
                      className="w-full max-h-96 object-contain cursor-zoom-in hover:opacity-95 transition"
                    />
                    {canDelete && (
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(post.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="Xóa ảnh này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}

                {/* THỐNG KÊ CẢM XÚC & SỐ BÌNH LUẬN (FACEBOOK STYLE) */}
                <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800/80">
                  {/* Cụm biểu cảm đã thả */}
                  <div 
                    onClick={() => {
                      if (totalReactionCount > 0) {
                        setReactionUsersModalPostId(reactionUsersModalPostId === post.id ? null : post.id);
                      }
                    }}
                    className="flex items-center gap-1.5 cursor-pointer hover:underline"
                    title="Bấm để xem danh sách các bạn đã thả cảm xúc"
                  >
                    {activeReactionsList.length > 0 ? (
                      <>
                        <div className="flex items-center -space-x-1.5">
                          {activeReactionsList.slice(0, 3).map(rKey => (
                            <span 
                              key={rKey} 
                              className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white dark:bg-slate-800 shadow-xs border border-slate-200 dark:border-slate-700 text-xs text-center"
                            >
                              {FORUM_REACTIONS[rKey].emoji}
                            </span>
                          ))}
                        </div>
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {totalReactionCount} cảm xúc
                        </span>
                      </>
                    ) : (
                      <span className="text-slate-400 italic">Hãy là người đầu tiên thả tim!</span>
                    )}
                  </div>

                  {/* Số lượt bình luận */}
                  <div className="flex items-center gap-1 font-bold text-slate-600 dark:text-slate-400">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{(post.comments || []).length} bình luận</span>
                  </div>
                </div>

                {/* DANH SÁCH NGƯỜI THẢ CẢM XÚC (POPOVER) */}
                {reactionUsersModalPostId === post.id && post.reactionUsers && Object.keys(post.reactionUsers).length > 0 && (
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5 animate-in fade-in">
                    <div className="flex items-center justify-between font-bold text-slate-700 dark:text-slate-300 pb-1 border-b border-slate-200/60">
                      <span>👥 Danh sách các bạn đã thả cảm xúc ({Object.keys(post.reactionUsers).length}):</span>
                      <button 
                        type="button" 
                        onClick={() => setReactionUsersModalPostId(null)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="max-h-36 overflow-y-auto space-y-1">
                      {Object.entries(post.reactionUsers).map(([stuId, rec]) => {
                        const rConf = FORUM_REACTIONS[rec.type] || FORUM_REACTIONS.heart;
                        return (
                          <div key={stuId} className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                              {rConf.emoji} {rec.studentName} <span className="text-slate-400 font-normal">({rec.studentClass})</span>
                            </span>
                            <span className="text-slate-400">{rec.time}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* FOOTER BÀI VIẾT: THANH TƯƠNG TÁC THẢ CẢM XÚC FACEBOOK-STYLE & NÚT BÌNH LUẬN */}
                <div className="relative pt-1 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800/80">
                  {/* FLOATING REACTION DOCK (HIỂN THỊ KHI HOVER HOẶC BẤM GIỮ) */}
                  {hoveredReactionPostId === post.id && (
                    <div 
                      onMouseEnter={() => setHoveredReactionPostId(post.id)}
                      onMouseLeave={() => setHoveredReactionPostId(null)}
                      className="absolute -top-12 left-0 z-30 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-full px-2.5 py-1.5 shadow-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-150"
                    >
                      {(Object.keys(FORUM_REACTIONS) as ReactionType[]).map(rKey => {
                        const r = FORUM_REACTIONS[rKey];
                        const isCurrentPick = userReaction === rKey;
                        return (
                          <button
                            key={rKey}
                            type="button"
                            onClick={() => handleReaction(post.id, rKey)}
                            title={r.label}
                            className={`w-9 h-9 rounded-full flex items-center justify-center text-lg hover:scale-130 transition duration-150 transform cursor-pointer ${
                              isCurrentPick ? 'bg-amber-100 ring-2 ring-amber-400 scale-110' : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                            }`}
                          >
                            <span>{r.emoji}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Nút Thả Cảm Xúc Chính */}
                  <div 
                    className="relative"
                    onMouseEnter={() => setHoveredReactionPostId(post.id)}
                  >
                    <button
                      type="button"
                      onClick={() => handleReaction(post.id, userReaction || 'heart')}
                      className={`flex items-center gap-1.5 transition cursor-pointer px-4 py-2 rounded-xl text-xs font-bold ${
                        activeReactionConfig
                          ? `${activeReactionConfig.badgeBg} font-black shadow-xs`
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {activeReactionConfig ? (
                        <>
                          <span className="text-base leading-none">{activeReactionConfig.emoji}</span>
                          <span>{activeReactionConfig.label}</span>
                        </>
                      ) : (
                        <>
                          <Heart className="w-4 h-4 text-rose-500" />
                          <span>Thả Tim</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Nút mở nhanh menu thả cảm xúc trên di động */}
                  <button
                    type="button"
                    onClick={() => setHoveredReactionPostId(hoveredReactionPostId === post.id ? null : post.id)}
                    className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 text-xs font-bold transition cursor-pointer"
                    title="Chọn biểu cảm khác"
                  >
                    <Smile className="w-4 h-4 text-amber-500" />
                  </button>
                </div>

                {/* ==================== KHU VỰC BÌNH LUẬN CỦA HỌC SINH ==================== */}
                <div className="space-y-3 pt-2">
                  {/* Danh sách bình luận đã có */}
                  {post.comments && post.comments.length > 0 && (
                    <div className="space-y-2">
                      {post.comments.map(cmt => {
                        const hasLikedCmt = Boolean(cmt.likedBy && cmt.likedBy.includes(currentStudentId));
                        const canDeleteCmt = (currentStudent && cmt.authorId === currentStudent.id) || isAuthor || isAdmin;

                        return (
                          <div 
                            key={cmt.id} 
                            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-xs flex items-start gap-2.5 transition hover:bg-slate-100/70 dark:hover:bg-slate-800"
                          >
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center shrink-0 text-xs shadow-xs">
                              {cmt.authorGender === 'Nữ' ? '👧' : '👦'}
                            </div>

                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <strong className="text-slate-900 dark:text-white font-bold">
                                    {cmt.authorName}
                                  </strong>
                                  <span className="text-[10px] text-slate-400">({cmt.authorClass})</span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                  <span>{new Date(cmt.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                                  {canDeleteCmt && (
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteComment(post.id, cmt.id)}
                                      className="text-slate-400 hover:text-rose-600 transition cursor-pointer p-0.5"
                                      title="Xóa bình luận này"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                              </div>

                              <p className="text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                                {cmt.content}
                              </p>

                              {/* Nút thích bình luận */}
                              <div className="pt-0.5 flex items-center gap-3 text-[11px] font-bold">
                                <button
                                  type="button"
                                  onClick={() => handleLikeComment(post.id, cmt.id)}
                                  className={`flex items-center gap-1 transition cursor-pointer ${
                                    hasLikedCmt ? 'text-rose-600 font-black' : 'text-slate-400 hover:text-rose-600'
                                  }`}
                                >
                                  <Heart className={`w-3 h-3 ${hasLikedCmt ? 'fill-rose-600' : ''}`} />
                                  <span>{cmt.likes || 0} Thích</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* STICKERS / BÌNH LUẬN MẪU TÍCH CỰC ĐỂ HỌC SINH CHỌN NHANH */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
                    <span className="text-slate-400 shrink-0 font-bold">Gợi ý nhanh:</span>
                    {QUICK_FEEDBACK_STICKERS.map((st, sIdx) => (
                      <button
                        key={sIdx}
                        type="button"
                        onClick={() => handleSendComment(post.id, st.text)}
                        className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold transition shrink-0 cursor-pointer border border-slate-200 dark:border-slate-700"
                        title="Bấm để gửi nhanh bình luận tích cực này"
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>

                  {/* KHUNG NHẬP BÌNH LUẬN TRỰC TIẾP */}
                  <div className="flex items-center gap-2 pt-1">
                    <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center shrink-0 text-xs">
                      {currentStudent ? (currentStudent.gender === 'Nữ' ? '👧' : '👦') : '💬'}
                    </div>

                    <input
                      type="text"
                      value={commentInputs[post.id] || ''}
                      onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSendComment(post.id);
                        }
                      }}
                      placeholder="Viết bình luận hoặc trao đổi cùng bạn (nhấn Enter để gửi)..."
                      className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-hidden focus:border-indigo-600 focus:bg-white transition"
                    />

                    <button
                      type="button"
                      onClick={() => handleSendComment(post.id)}
                      className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Gửi</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL BÁO CÁO VI PHẠM */}
      {reportModalPostId && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-amber-600">
              <Flag className="w-6 h-6" />
              <h4 className="text-base font-black text-slate-900 dark:text-white">Báo Cáo Vi Phạm Bài Viết</h4>
            </div>

            <p className="text-xs text-slate-500">
              Thầy Đinh Văn Thành sẽ kiểm duyệt và xử lý ngay nếu bài viết vi phạm đạo đức học đường.
            </p>

            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold bg-slate-50 dark:bg-slate-800"
            >
              <option value="Nội dung không phù hợp với môi trường giáo dục">Nội dung không phù hợp với môi trường giáo dục</option>
              <option value="Ngôn từ thiếu văn minh / xúc phạm bạn bè">Ngôn từ thiếu văn minh / xúc phạm bạn bè</option>
              <option value="Ảnh chụp không liên quan tới bài tập học tập">Ảnh chụp không liên quan tới bài tập học tập</option>
              <option value="Spam bài viết nhiều lần">Spam bài viết nhiều lần</option>
            </select>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReportModalPostId(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSendReport}
                className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs shadow-sm"
              >
                Gửi Báo Cáo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PHÓNG TO ẢNH */}
      {previewImageModal && (
        <div 
          onClick={() => setPreviewImageModal(null)}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-3xl max-h-[90vh]">
            <img 
              src={previewImageModal} 
              alt="Phóng to" 
              className="max-h-[85vh] w-auto rounded-3xl shadow-2xl object-contain border border-slate-700" 
            />
            <button
              onClick={() => setPreviewImageModal(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
      {/* Modal Xác Thực Danh Tính Bằng Ngày Tháng Năm Sinh */}
      <StudentDobVerificationModal
        isOpen={showDobModal}
        student={currentStudent}
        actionTitle={dobActionTitle}
        onClose={() => {
          setShowDobModal(false);
          setPendingAction(null);
        }}
        onVerified={() => {
          setShowDobModal(false);
          if (pendingAction) {
            const act = pendingAction;
            setPendingAction(null);
            setTimeout(() => act(), 150);
          }
        }}
      />
    </div>
  );
};
