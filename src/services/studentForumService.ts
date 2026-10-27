// =========================================================================
// DỊCH VỤ DIỄN ĐÀN HỌC SINH (STUDENT FORUM & CHAT CỘNG ĐỒNG)
// HỖ TRỢ TRÒ CHUYỆN, ĐĂNG ẢNH, BÌNH LUẬN, THẢ CẢM XÚC FACEBOOK-STYLE ĐẸP MẮT
// TÁC GIẢ BẢN QUYỀN: THẦY GIÁO ĐINH VĂN THÀNH - ĐIỆN THOẠI / ZALO: 0915.213717
// =========================================================================

export type ReactionType = 'heart' | 'like' | 'clap' | 'genius' | 'star' | 'fire' | 'joy' | 'support';

export interface ReactionDetail {
  id: ReactionType;
  label: string;
  emoji: string;
  color: string;
  hoverBg: string;
  badgeBg: string;
}

export const FORUM_REACTIONS: Record<ReactionType, ReactionDetail> = {
  heart: {
    id: 'heart',
    label: 'Thả Tim',
    emoji: '❤️',
    color: 'text-rose-600',
    hoverBg: 'hover:bg-rose-50 dark:hover:bg-rose-950/40',
    badgeBg: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800'
  },
  like: {
    id: 'like',
    label: 'Thích',
    emoji: '👍',
    color: 'text-blue-600',
    hoverBg: 'hover:bg-blue-50 dark:hover:bg-blue-950/40',
    badgeBg: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800'
  },
  clap: {
    id: 'clap',
    label: 'Vỗ Tay',
    emoji: '👏',
    color: 'text-amber-600',
    hoverBg: 'hover:bg-amber-50 dark:hover:bg-amber-950/40',
    badgeBg: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800'
  },
  genius: {
    id: 'genius',
    label: 'Sáng Tạo',
    emoji: '💡',
    color: 'text-yellow-600',
    hoverBg: 'hover:bg-yellow-50 dark:hover:bg-yellow-950/40',
    badgeBg: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/60 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800'
  },
  star: {
    id: 'star',
    label: 'Ngôi Sao',
    emoji: '🌟',
    color: 'text-amber-500',
    hoverBg: 'hover:bg-amber-50 dark:hover:bg-amber-950/40',
    badgeBg: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800'
  },
  fire: {
    id: 'fire',
    label: 'Quyết Tâm',
    emoji: '🔥',
    color: 'text-orange-600',
    hoverBg: 'hover:bg-orange-50 dark:hover:bg-orange-950/40',
    badgeBg: 'bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 border-orange-200 dark:border-orange-800'
  },
  joy: {
    id: 'joy',
    label: 'Tuyệt Vời',
    emoji: '😄',
    color: 'text-emerald-600',
    hoverBg: 'hover:bg-emerald-50 dark:hover:bg-emerald-950/40',
    badgeBg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
  },
  support: {
    id: 'support',
    label: 'Cố Lên',
    emoji: '💪',
    color: 'text-purple-600',
    hoverBg: 'hover:bg-purple-50 dark:hover:bg-purple-950/40',
    badgeBg: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800'
  }
};

export interface ReactionRecord {
  type: ReactionType;
  studentName: string;
  studentClass: string;
  time: string;
}

export interface ForumComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorClass: string;
  authorGender?: 'Nam' | 'Nữ';
  content: string;
  createdAt: string;
  likes?: number;
  likedBy?: string[];
  reactions?: Record<string, ReactionType>;
}

export interface ForumPost {
  id: string;
  authorId: string;
  authorName: string;
  authorClass: string;
  authorStudentCode: string;
  authorGender?: 'Nam' | 'Nữ';
  content: string;
  imageUrl?: string; // Ảnh đính kèm (base64 hoặc URL)
  createdAt: string;
  likes: number; // Tổng số lượt thả cảm xúc (hỗ trợ tương thích ngược)
  likedBy: string[]; // Danh sách studentId đã thả cảm xúc
  reactions?: Record<string, ReactionType>; // studentId -> ReactionType ('heart', 'like', 'star',...)
  reactionUsers?: Record<string, ReactionRecord>; // Lưu tên & lớp để hiển thị danh sách người thả cảm xúc
  comments?: ForumComment[];
  isReported?: boolean;
  reportReason?: string;
  isPinned?: boolean;
}

const STORAGE_KEY_FORUM = 'gvai_student_forum_posts_v1';
const FORUM_BROADCAST_CHANNEL = 'gvai_forum_channel';

// Danh sách bài viết mẫu truyền cảm hứng ban đầu
const INITIAL_FORUM_POSTS: ForumPost[] = [
  {
    id: 'post-welcome-admin',
    authorId: 'admin-dinh-thanh',
    authorName: 'Thầy Đinh Văn Thành (Admin)',
    authorClass: 'Giáo Viên THCS Đồng Yên',
    authorStudentCode: 'GV-ADMIN',
    authorGender: 'Nam',
    content: 'Chào mừng các em học sinh đến với Diễn đàn Học tập & Giao lưu Trực tuyến Trường THCS Đồng Yên! 🎉 Các em có thể thoải mái trao đổi bài tập, hỏi phương pháp học Tiếng Anh, đăng ảnh học tập bổ ích, cùng nhau bình luận và thả các biểu cảm cảm xúc (Thả tim, Like, Vỗ tay, Sáng tạo, Ngôi sao, Cố lên...). Lưu ý giữ gìn ngôn từ văn minh và lịch sự!',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    likes: 38,
    likedBy: ['stu-sample-1', 'stu-sample-2', 'stu-sample-3'],
    reactions: {
      'stu-sample-1': 'heart',
      'stu-sample-2': 'star',
      'stu-sample-3': 'clap'
    },
    reactionUsers: {
      'stu-sample-1': { type: 'heart', studentName: 'Nguyễn Văn Minh', studentClass: '7A1', time: '1 ngày trước' },
      'stu-sample-2': { type: 'star', studentName: 'Trần Thị Mai', studentClass: '7A1', time: '1 ngày trước' },
      'stu-sample-3': { type: 'clap', studentName: 'Đinh Quốc Đạt', studentClass: '8A1', time: '20 giờ trước' }
    },
    isPinned: true
  },
  {
    id: 'post-sample-study',
    authorId: 'stu-sample-1',
    authorName: 'Nguyễn Văn Minh',
    authorClass: '7A1',
    authorStudentCode: 'HS7A1-08',
    authorGender: 'Nam',
    content: 'Các bạn ơi, bài tập Unit 3 phần "A closer look 2" có ai làm xong câu chia thì Hiện tại hoàn thành chưa? Cho mình hỏi cách phân biệt "since" và "for" với ạ!',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    likes: 15,
    likedBy: ['stu-sample-2'],
    reactions: {
      'stu-sample-2': 'genius'
    },
    reactionUsers: {
      'stu-sample-2': { type: 'genius', studentName: 'Trần Thị Mai', studentClass: '7A1', time: '4 giờ trước' }
    },
    comments: [
      {
        id: 'cmt-1',
        postId: 'post-sample-study',
        authorId: 'stu-sample-2',
        authorName: 'Trần Thị Mai',
        authorClass: '7A1',
        authorGender: 'Nữ',
        content: '"Since" đi với mốc thời gian (VD: since 2020, since yesterday), còn "for" đi với khoảng thời gian (VD: for 3 years, for 2 hours) bạn nhé!',
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        likes: 6,
        likedBy: ['stu-sample-1']
      }
    ]
  }
];

class StudentForumService {
  private posts: ForumPost[] = [];
  private channel: BroadcastChannel | null = null;

  constructor() {
    this.initData();
    this.initBroadcast();
  }

  private initData() {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY_FORUM);
      if (raw) {
        this.posts = JSON.parse(raw);
      } else {
        this.posts = INITIAL_FORUM_POSTS;
        this.savePosts();
      }
    } catch {
      this.posts = INITIAL_FORUM_POSTS;
    }
  }

  private initBroadcast() {
    if (typeof window === 'undefined' || !window.BroadcastChannel) return;
    try {
      this.channel = new BroadcastChannel(FORUM_BROADCAST_CHANNEL);
      this.channel.onmessage = (event) => {
        if (event.data && event.data.type === 'FORUM_UPDATED') {
          this.initData();
          window.dispatchEvent(new CustomEvent('gvai_forum_data_changed'));
        }
      };
    } catch {}
  }

  private savePosts() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY_FORUM, JSON.stringify(this.posts));
      if (this.channel) {
        this.channel.postMessage({ type: 'FORUM_UPDATED', timestamp: Date.now() });
      }
      window.dispatchEvent(new CustomEvent('gvai_forum_data_changed'));
    } catch (e) {
      console.warn('Lỗi lưu bài viết diễn đàn:', e);
    }
  }

  public getPosts(): ForumPost[] {
    return [...this.posts].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  // Thêm bài viết mới
  public createPost(data: {
    authorId: string;
    authorName: string;
    authorClass: string;
    authorStudentCode: string;
    authorGender?: 'Nam' | 'Nữ';
    content: string;
    imageUrl?: string;
  }): ForumPost {
    const newPost: ForumPost = {
      id: 'post-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      authorId: data.authorId,
      authorName: data.authorName,
      authorClass: data.authorClass,
      authorStudentCode: data.authorStudentCode,
      authorGender: data.authorGender || 'Nam',
      content: data.content.trim(),
      imageUrl: data.imageUrl,
      createdAt: new Date().toISOString(),
      likes: 0,
      likedBy: [],
      reactions: {},
      reactionUsers: {},
      comments: []
    };

    this.posts.unshift(newPost);
    this.savePosts();
    return newPost;
  }

  // Thêm bình luận vào bài viết
  public addComment(postId: string, commentData: {
    authorId: string;
    authorName: string;
    authorClass: string;
    authorGender?: 'Nam' | 'Nữ';
    content: string;
  }): ForumComment | null {
    const post = this.posts.find(p => p.id === postId);
    if (!post) return null;

    if (!post.comments) post.comments = [];
    const newComment: ForumComment = {
      id: 'cmt-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      postId,
      authorId: commentData.authorId,
      authorName: commentData.authorName,
      authorClass: commentData.authorClass,
      authorGender: commentData.authorGender || 'Nam',
      content: commentData.content.trim(),
      createdAt: new Date().toISOString(),
      likes: 0,
      likedBy: [],
      reactions: {}
    };

    post.comments.push(newComment);
    this.savePosts();
    return newComment;
  }

  // Xóa bình luận: tác giả bình luận hoặc tác giả bài viết hoặc Admin
  public deleteComment(postId: string, commentId: string, currentUserId: string, isAdmin: boolean = false): boolean {
    const post = this.posts.find(p => p.id === postId);
    if (!post || !post.comments) return false;

    const cmt = post.comments.find(c => c.id === commentId);
    if (!cmt) return false;

    if (cmt.authorId !== currentUserId && post.authorId !== currentUserId && !isAdmin) {
      return false;
    }

    post.comments = post.comments.filter(c => c.id !== commentId);
    this.savePosts();
    return true;
  }

  // Thả biểu cảm cảm xúc (Reaction) Facebook-style trên bài viết
  public setReaction(
    postId: string, 
    studentId: string, 
    studentName: string, 
    studentClass: string, 
    reactionType: ReactionType
  ): { action: 'added' | 'changed' | 'removed'; currentType?: ReactionType; totalCount: number } {
    const post = this.posts.find(p => p.id === postId);
    if (!post) return { action: 'removed', totalCount: 0 };

    if (!post.reactions) post.reactions = {};
    if (!post.reactionUsers) post.reactionUsers = {};
    if (!post.likedBy) post.likedBy = [];

    const existing = post.reactions[studentId];

    if (existing === reactionType) {
      // Bấm lại đúng biểu cảm đang chọn -> Hủy biểu cảm
      delete post.reactions[studentId];
      delete post.reactionUsers[studentId];
      post.likedBy = post.likedBy.filter(id => id !== studentId);
      post.likes = Math.max(0, Object.keys(post.reactions).length);
      this.savePosts();
      return { action: 'removed', totalCount: post.likes };
    }

    // Đổi sang biểu cảm khác hoặc thả mới
    post.reactions[studentId] = reactionType;
    post.reactionUsers[studentId] = {
      type: reactionType,
      studentName,
      studentClass,
      time: 'Vừa xong'
    };
    if (!post.likedBy.includes(studentId)) {
      post.likedBy.push(studentId);
    }
    post.likes = Object.keys(post.reactions).length;
    this.savePosts();
    return { 
      action: existing ? 'changed' : 'added', 
      currentType: reactionType, 
      totalCount: post.likes 
    };
  }

  // Tương thích ngược: toggleLike bài viết
  public toggleLike(postId: string, studentId: string, studentName: string = 'Học sinh', studentClass: string = '8A1'): boolean {
    const res = this.setReaction(postId, studentId, studentName, studentClass, 'heart');
    return res.action !== 'removed';
  }

  // Thả tim cho bình luận
  public toggleCommentLike(postId: string, commentId: string, studentId: string): boolean {
    const post = this.posts.find(p => p.id === postId);
    if (!post || !post.comments) return false;

    const cmt = post.comments.find(c => c.id === commentId);
    if (!cmt) return false;

    if (!cmt.likedBy) cmt.likedBy = [];
    const hasLiked = cmt.likedBy.includes(studentId);
    if (hasLiked) {
      cmt.likedBy = cmt.likedBy.filter(id => id !== studentId);
      cmt.likes = Math.max(0, (cmt.likes || 1) - 1);
    } else {
      cmt.likedBy.push(studentId);
      cmt.likes = (cmt.likes || 0) + 1;
    }

    this.savePosts();
    return true;
  }

  // Xóa bài viết: Cho phép Tác giả tự xóa HOẶC Admin có quyền xóa
  public deletePost(postId: string, currentUserId: string, isAdmin: boolean = false): boolean {
    const post = this.posts.find(p => p.id === postId);
    if (!post) return false;

    // Chỉ tác giả bài viết hoặc Admin mới có quyền xóa
    if (post.authorId !== currentUserId && !isAdmin) {
      console.warn('Từ chối xóa bài: Không có quyền tác giả hoặc Admin!');
      return false;
    }

    this.posts = this.posts.filter(p => p.id !== postId);
    this.savePosts();
    return true;
  }

  // Tự xóa ảnh vi phạm: Tác giả bài viết hoặc Admin xóa ảnh đính kèm
  public deletePostImage(postId: string, currentUserId: string, isAdmin: boolean = false): boolean {
    const post = this.posts.find(p => p.id === postId);
    if (!post || !post.imageUrl) return false;

    if (post.authorId !== currentUserId && !isAdmin) {
      return false;
    }

    post.imageUrl = undefined;
    this.savePosts();
    return true;
  }

  // Báo cáo bài viết hoặc ảnh vi phạm
  public reportPost(postId: string, reason: string): boolean {
    const post = this.posts.find(p => p.id === postId);
    if (!post) return false;

    post.isReported = true;
    post.reportReason = reason;
    this.savePosts();
    return true;
  }

  // Admin gỡ cờ báo cáo vi phạm
  public unflagPost(postId: string, isAdmin: boolean): boolean {
    if (!isAdmin) return false;
    const post = this.posts.find(p => p.id === postId);
    if (!post) return false;

    post.isReported = false;
    post.reportReason = undefined;
    this.savePosts();
    return true;
  }
}

export const studentForumService = new StudentForumService();
