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
  EyeOff
} from 'lucide-react';
import { studentForumService, ForumPost } from '../services/studentForumService';
import { StudentProfile } from '../services/studentGradebookService';
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

// Hàm nén ảnh trước khi lưu trữ để bảo đảm hiệu năng và bộ nhớ
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
        // Nén ảnh JPEG chất lượng 0.75 để tiết kiệm dung lượng
        resolve(canvas.toDataURL('image/jpeg', 0.75));
      };
      img.onerror = () => reject(new Error('Không thể tải ảnh'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Không thể đọc file'));
    reader.readAsDataURL(file);
  });
}

export const StudentForumView: React.FC<StudentForumViewProps> = ({
  currentStudent,
  isAdmin,
  onRequestAuth,
  onRequestAdminLogin
}) => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [postContent, setPostContent] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>('');
  const [previewImageModal, setPreviewImageModal] = useState<string | null>(null);

  // Bình luận
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  const handleSelectImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn tệp hình ảnh hợp lệ (PNG, JPG, JPEG, WEBP)!');
      return;
    }

    try {
      const resized = await resizeImageBase64(file);
      setSelectedImage(resized);
    } catch {
      alert('Không thể xử lý ảnh này, vui lòng thử lại ảnh khác!');
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!currentStudent) {
      onRequestAuth();
      return;
    }

    const text = postContent.trim();
    if (!text && !selectedImage) {
      setFormError('Vui lòng nhập nội dung hoặc đính kèm ảnh trước khi đăng!');
      return;
    }

    if (checkInappropriateText(text)) {
      setFormError('⛔ Nội dung chứa từ ngữ vi phạm tiêu chuẩn văn minh học đường! Vui lòng chỉnh sửa lại.');
      return;
    }

    setIsSubmitting(true);
    try {
      studentForumService.createPost({
        authorId: currentStudent.id,
        authorName: currentStudent.name,
        authorClass: currentStudent.className,
        authorStudentCode: currentStudent.studentCode,
        authorGender: currentStudent.gender,
        content: text,
        imageUrl: selectedImage || undefined
      });

      setPostContent('');
      setSelectedImage(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      loadPosts();
    } catch (err: any) {
      setFormError('Lỗi khi đăng bài: ' + (err?.message || 'Vui lòng thử lại!'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = (post: ForumPost) => {
    const isAuthor = currentStudent && post.authorId === currentStudent.id;
    if (!isAuthor && !isAdmin) {
      alert('Chỉ tác giả bài viết hoặc Admin mới có quyền xóa bài này!');
      return;
    }

    const confirmMsg = isAdmin && !isAuthor
      ? `Thầy/Cô có chắc chắn muốn xóa bài viết của "${post.authorName}" với quyền Admin?`
      : 'Em có chắc chắn muốn xóa bài viết này của mình không?';

    if (window.confirm(confirmMsg)) {
      const currentId = currentStudent ? currentStudent.id : '';
      studentForumService.deletePost(post.id, currentId, isAdmin);
      loadPosts();
    }
  };

  const handleDeleteImage = (post: ForumPost) => {
    const isAuthor = currentStudent && post.authorId === currentStudent.id;
    if (!isAuthor && !isAdmin) {
      alert('Chỉ tác giả hoặc Admin mới có quyền xóa ảnh này!');
      return;
    }

    if (window.confirm('Em có chắc chắn muốn xóa ảnh đính kèm trong bài viết này không?')) {
      const currentId = currentStudent ? currentStudent.id : '';
      studentForumService.deletePostImage(post.id, currentId, isAdmin);
      loadPosts();
    }
  };

  const handleLike = (postId: string) => {
    if (!currentStudent) {
      onRequestAuth();
      return;
    }
    studentForumService.toggleLike(postId, currentStudent.id);
    loadPosts();
  };

  const handleReport = (post: ForumPost) => {
    const reason = prompt('Vui lòng nhập lý do báo cáo bài viết hoặc ảnh vi phạm này:');
    if (!reason || !reason.trim()) return;

    studentForumService.reportPost(post.id, reason.trim());
    loadPosts();
    alert('Cảm ơn em đã báo cáo! Ban quản trị sẽ rà soát và xử lý bài viết vi phạm.');
  };

  const handleAddComment = (postId: string) => {
    if (!currentStudent) {
      onRequestAuth();
      return;
    }

    const text = commentText.trim();
    if (!text) return;

    if (checkInappropriateText(text)) {
      alert('⛔ Bình luận chứa từ ngữ không phù hợp với môi trường sư phạm!');
      return;
    }

    studentForumService.addComment(postId, {
      authorId: currentStudent.id,
      authorName: currentStudent.name,
      authorClass: currentStudent.className,
      authorGender: currentStudent.gender,
      content: text
    });

    setCommentText('');
    setActiveCommentPostId(null);
    loadPosts();
  };

  return (
    <div className="space-y-6">
      {/* BANNER DIỄN ĐÀN */}
      <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-2 backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Diễn Đàn Trò Chuyện & Thảo Luận Học Tập</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black mb-1">
              DIỄN ĐÀN HỌC SINH — THCS ĐỒNG YÊN
            </h3>
            <p className="text-indigo-100 text-xs sm:text-sm max-w-2xl">
              Nơi các bạn học sinh trao đổi kiến thức, hỏi bài tập Tiếng Anh, chia sẻ mẹo học tập, đăng ảnh bài làm và tự xóa ảnh/bài khi cần.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isAdmin ? (
              <span className="px-3.5 py-2 rounded-xl bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md">
                <ShieldAlert className="w-4 h-4 text-purple-900" />
                <span>Admin Kiểm Duyệt Toàn Quyền</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={onRequestAdminLogin}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-amber-300" />
                <span>Quyền Quản Trị</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KHUNG ĐĂNG BÀI VIẾT (YÊU CẦU ĐĂNG NHẬP HỌC SINH) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md p-5 sm:p-6">
        {currentStudent ? (
          <form onSubmit={handleCreatePost} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-black text-sm flex items-center justify-center shadow-md shrink-0">
                {currentStudent.gender === 'Nữ' ? '👧' : '👦'}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{currentStudent.name}</span>
                  <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-mono font-bold">
                    Lớp {currentStudent.className}
                  </span>
                </h4>
                <p className="text-[11px] text-slate-500">Đăng bài trao đổi với bạn bè trường THCS Đồng Yên</p>
              </div>
            </div>

            <textarea
              rows={3}
              value={postContent}
              onChange={(e) => {
                setPostContent(e.target.value);
                setFormError('');
              }}
              placeholder="Hôm nay em muốn hỏi bài tập gì, chia sẻ bí quyết học từ vựng hay gửi lời chào đến các bạn cùng lớp?..."
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-hidden resize-none"
            />

            {/* Xem trước ảnh đính kèm */}
            {selectedImage && (
              <div className="relative inline-block rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md max-w-sm">
                <img 
                  src={selectedImage} 
                  alt="Ảnh đính kèm" 
                  className="max-h-56 w-auto object-cover rounded-2xl" 
                />
                <button
                  type="button"
                  onClick={() => {
                    setSelectedImage(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-rose-600 text-white hover:bg-rose-700 transition shadow-md cursor-pointer"
                  title="Hủy bỏ ảnh"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {formError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleSelectImage}
                  className="hidden"
                  id="forum-upload-image"
                />
                <label
                  htmlFor="forum-upload-image"
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-300 hover:text-indigo-600 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-slate-200 dark:border-slate-700"
                >
                  <ImageIcon className="w-4 h-4 text-indigo-500" />
                  <span>{selectedImage ? 'Đổi ảnh khác' : 'Đăng kèm ảnh'}</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Đang gửi...' : 'Đăng Bài Viết'}</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3 font-bold text-xl">
              💬
            </div>
            <h4 className="text-base font-black text-slate-900 dark:text-white mb-1">
              Đăng Ký hoặc Đăng Nhập Để Tham Gia Diễn Đàn
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
              Mỗi học sinh tự đăng ký tài khoản của mình để có thể gửi bài viết, bình luận, đính kèm ảnh và trò chuyện cùng bạn bè.
            </p>
            <button
              type="button"
              onClick={onRequestAuth}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs shadow-md transition inline-flex items-center gap-2 cursor-pointer"
            >
              <User className="w-4 h-4" />
              <span>Đăng Ký / Đăng Nhập Học Sinh Ngay</span>
            </button>
          </div>
        )}
      </div>

      {/* DANH SÁCH BÀI VIẾT DIỄN ĐÀN */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-600" />
            <span>Tất Cả Thảo Luận ({posts.length})</span>
          </h4>
          <span className="text-xs text-slate-500">Mới nhất xếp trên</span>
        </div>

        {posts.map((post) => {
          const isAuthor = currentStudent && post.authorId === currentStudent.id;
          const hasLiked = currentStudent && (post.likedBy || []).includes(currentStudent.id);
          const isFlagged = post.isReported === true;

          return (
            <div
              key={post.id}
              className={`bg-white dark:bg-slate-900 rounded-3xl border ${
                post.isPinned 
                  ? 'border-indigo-400 dark:border-indigo-600 shadow-indigo-500/10' 
                  : 'border-slate-200 dark:border-slate-800'
              } shadow-sm hover:shadow-md transition p-5 sm:p-6 space-y-3.5`}
            >
              {/* Header bài viết */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700 text-slate-900 dark:text-white font-black text-sm flex items-center justify-center shadow-xs">
                    {post.authorGender === 'Nữ' ? '👧' : '👦'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                        {post.authorName}
                      </h5>
                      <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-[11px] font-bold">
                        {post.authorClass}
                      </span>
                      {post.isPinned && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-600 dark:text-amber-400 text-[10px] font-black border border-amber-400/30">
                          📌 Đã ghim
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(post.createdAt).toLocaleString('vi-VN')}</span>
                    </span>
                  </div>
                </div>

                {/* Các nút hành động: Xóa bài / Xóa ảnh / Báo cáo */}
                <div className="flex items-center gap-1">
                  {(isAuthor || isAdmin) && (
                    <button
                      type="button"
                      onClick={() => handleDeletePost(post)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                      title={isAuthor ? "Em tự xóa bài viết này của mình" : "Admin xóa bài viết"}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                  {!isAuthor && !isAdmin && (
                    <button
                      type="button"
                      onClick={() => handleReport(post)}
                      className="p-2 rounded-xl text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition cursor-pointer"
                      title="Báo cáo bài viết hoặc ảnh vi phạm tiêu chuẩn"
                    >
                      <Flag className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Cảnh báo bài viết bị báo cáo vi phạm */}
              {isFlagged && (
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-xs font-bold flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>Bài viết đang bị báo cáo: "{post.reportReason || 'Nội dung cần xem xét'}".</span>
                </div>
              )}

              {/* Nội dung bài viết */}
              {post.content && (
                <p className="text-slate-800 dark:text-slate-200 text-sm whitespace-pre-wrap leading-relaxed">
                  {post.content}
                </p>
              )}

              {/* Ảnh đính kèm */}
              {post.imageUrl && (
                <div className="relative group max-w-lg rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                  <img
                    src={post.imageUrl}
                    alt="Ảnh đính kèm"
                    onClick={() => setPreviewImageModal(post.imageUrl || null)}
                    className={`max-h-80 w-auto rounded-2xl object-cover cursor-pointer transition ${
                      isFlagged ? 'blur-md hover:blur-none' : ''
                    }`}
                  />
                  
                  {/* Nút tác giả tự xóa ảnh vi phạm */}
                  {(isAuthor || isAdmin) && (
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(post)}
                      className="absolute top-2 right-2 px-2.5 py-1 rounded-xl bg-slate-900/80 hover:bg-rose-600 text-white text-xs font-bold transition flex items-center gap-1 shadow-md cursor-pointer"
                      title="Tự xóa ảnh vi phạm khỏi bài viết"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Xóa ảnh này</span>
                    </button>
                  )}
                </div>
              )}

              {/* Footer bài viết: Thả tim & Bình luận */}
              <div className="pt-2 flex items-center gap-4 text-xs font-bold text-slate-500 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center gap-1.5 transition cursor-pointer px-2.5 py-1.5 rounded-xl ${
                    hasLiked 
                      ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 font-black' 
                      : 'hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-600' : ''}`} />
                  <span>{post.likes || 0} Thích</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                  className="flex items-center gap-1.5 hover:text-indigo-600 transition cursor-pointer px-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{(post.comments || []).length} Bình luận</span>
                </button>
              </div>

              {/* Khu vực bình luận */}
              {((post.comments && post.comments.length > 0) || activeCommentPostId === post.id) && (
                <div className="pt-2 space-y-2.5">
                  {/* Danh sách bình luận cũ */}
                  {post.comments && post.comments.map((cmt) => (
                    <div key={cmt.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-xs flex items-start gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center shrink-0 text-[10px]">
                        {cmt.authorGender === 'Nữ' ? '👧' : '👦'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <strong className="text-slate-900 dark:text-white">{cmt.authorName}</strong>
                          <span className="text-[10px] text-slate-400">({cmt.authorClass})</span>
                          <span className="text-[10px] text-slate-400 ml-auto">
                            {new Date(cmt.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 mt-1 whitespace-pre-wrap">{cmt.content}</p>
                      </div>
                    </div>
                  ))}

                  {/* Form viết bình luận */}
                  {activeCommentPostId === post.id && (
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleAddComment(post.id);
                          }
                        }}
                        placeholder="Viết bình luận của em..."
                        className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-hidden focus:ring-2 focus:ring-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddComment(post.id)}
                        className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition cursor-pointer"
                      >
                        Gửi
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

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
    </div>
  );
};
