// =========================================================================
// DỊCH VỤ DIỄN ĐÀN HỌC SINH (STUDENT FORUM & CHAT CỘNG ĐỒNG)
// HỖ TRỢ TRÒ CHUYỆN, ĐĂNG ẢNH, TỰ XÓA BÀI/ẢNH VI PHẠM & KIỂM DUYỆT ADMIN
// TÁC GIẢ BẢN QUYỀN: THẦY GIÁO ĐINH VĂN THÀNH - ĐIỆN THOẠI / ZALO: 0915.213717
// =========================================================================

export interface ForumComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorClass: string;
  authorGender?: 'Nam' | 'Nữ';
  content: string;
  createdAt: string;
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
  likes: number;
  likedBy: string[];
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
    content: 'Chào mừng các em học sinh đến với Diễn đàn Học tập & Giao lưu Trực tuyến Trường THCS Đồng Yên! 🎉 Các em có thể thoải mái trao đổi bài tập, hỏi phương pháp học Tiếng Anh, đăng ảnh học tập bổ ích và tương tác cùng bạn bè nhé. Lưu ý giữ gìn ngôn từ văn minh và lịch sự!',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    likes: 28,
    likedBy: [],
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
    likes: 12,
    likedBy: [],
    comments: [
      {
        id: 'cmt-1',
        postId: 'post-sample-study',
        authorId: 'stu-sample-2',
        authorName: 'Trần Thị Mai',
        authorClass: '7A1',
        authorGender: 'Nữ',
        content: '"Since" đi với mốc thời gian (VD: since 2020, since yesterday), còn "for" đi với khoảng thời gian (VD: for 3 years, for 2 hours) bạn nhé!',
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
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
  }): boolean {
    const post = this.posts.find(p => p.id === postId);
    if (!post) return false;

    if (!post.comments) post.comments = [];
    const newComment: ForumComment = {
      id: 'cmt-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      postId,
      authorId: commentData.authorId,
      authorName: commentData.authorName,
      authorClass: commentData.authorClass,
      authorGender: commentData.authorGender || 'Nam',
      content: commentData.content.trim(),
      createdAt: new Date().toISOString()
    };

    post.comments.push(newComment);
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

  // Thả tim / Bỏ tim bài viết
  public toggleLike(postId: string, studentId: string): boolean {
    const post = this.posts.find(p => p.id === postId);
    if (!post) return false;

    if (!post.likedBy) post.likedBy = [];

    const hasLiked = post.likedBy.includes(studentId);
    if (hasLiked) {
      post.likedBy = post.likedBy.filter(id => id !== studentId);
      post.likes = Math.max(0, (post.likes || 1) - 1);
    } else {
      post.likedBy.push(studentId);
      post.likes = (post.likes || 0) + 1;
    }

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
