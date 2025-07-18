import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect, createContext, useContext } from "react";
import { Login } from "./components/Login";
import { Timeline } from "./components/Timeline";
import { Calendar } from "./components/Calendar";
import { PostComposer } from "./components/PostComposer";
import { PostDetail } from "./components/PostDetail";
import { Search } from "./components/Search";
import { Profile } from "./components/Profile";
import { Drafts } from "./components/Drafts";
import { MainLayout } from "./components/MainLayout";

export type Post = {
  id: string;
  content: string;
  postDate: Date;
  createdAt: Date;
  updatedAt: Date;
  isDraft: boolean;
};

export type UserProfile = {
  username: string;
  joinedDate: Date;
  totalPosts: number;
  longestStreak: number;
  currentStreak: number;
};

type AppContextType = {
  isAuthenticated: boolean;
  userProfile: UserProfile;
  posts: Post[];
  login: () => void;
  logout: () => void;
  createPost: (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePost: (post: Post) => void;
  deletePost: (postId: string) => void;
};

const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

function AppProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Mock user profile
  const [userProfile] = useState<UserProfile>({
    username: "田中太郎",
    joinedDate: new Date('2024-01-01'),
    totalPosts: 156,
    longestStreak: 21,
    currentStreak: 7
  });

  // Mock posts data with more variety for better date grouping demonstration
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      content: '今日は良い天気だった。散歩をして、新しいカフェを発見した。コーヒーがとても美味しくて、店主の方とも楽しく話せた。',
      postDate: new Date('2025-01-02T14:30:00'),
      createdAt: new Date('2025-01-02T14:30:00'),
      updatedAt: new Date('2025-01-02T14:30:00'),
      isDraft: false
    },
    {
      id: '2',
      content: '朝のジョギングを再開した。久しぶりの運動だったけど、気持ちが良かった。',
      postDate: new Date('2025-01-02T07:15:00'),
      createdAt: new Date('2025-01-02T07:15:00'),
      updatedAt: new Date('2025-01-02T07:15:00'),
      isDraft: false
    },
    {
      id: '3',
      content: 'TypeScriptの新しい機能について学んだ。型安全性が向上していて、開発体験も良くなっている。',
      postDate: new Date('2025-01-01T16:45:00'),
      createdAt: new Date('2025-01-01T16:45:00'),
      updatedAt: new Date('2025-01-01T16:45:00'),
      isDraft: false
    },
    {
      id: '4',
      content: '年末年始の振り返りをした。今年は新しいことにたくさんチャレンジできた一年だった。',
      postDate: new Date('2025-01-01T22:30:00'),
      createdAt: new Date('2025-01-01T22:30:00'),
      updatedAt: new Date('2025-01-01T22:30:00'),
      isDraft: false
    },
    {
      id: '5',
      content: '図書館で読書をした。久しぶりに長時間集中して本を読めた。静かな環境は集中力を高めてくれる。',
      postDate: new Date('2024-12-31T15:20:00'),
      createdAt: new Date('2024-12-31T15:20:00'),
      updatedAt: new Date('2024-12-31T15:20:00'),
      isDraft: false
    },
    {
      id: '6',
      content: '友人との忘年会。久しぶりに会えて楽しかった。来年もみんなで集まりたい。',
      postDate: new Date('2024-12-30T19:00:00'),
      createdAt: new Date('2024-12-30T19:00:00'),
      updatedAt: new Date('2024-12-30T19:00:00'),
      isDraft: false
    },
    {
      id: '7',
      content: '下書きの投稿です。まだ完成していません。アイデアをまとめているところ。',
      postDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isDraft: true
    },
    {
      id: '8',
      content: 'これも下書きです。後で完成させる予定。新しいプロジェクトについて書きたい。',
      postDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      isDraft: true
    }
  ]);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const createPost = (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPost: Post = {
      ...post,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setPosts(prev => [newPost, ...prev]);
  };

  const updatePost = (updatedPost: Post) => {
    setPosts(prev => prev.map(post => 
      post.id === updatedPost.id 
        ? { ...updatedPost, updatedAt: new Date() }
        : post
    ));
  };

  const deletePost = (postId: string) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
  };

  return (
    <AppContext.Provider value={{
      isAuthenticated,
      userProfile,
      posts,
      login,
      logout,
      createPost,
      updatePost,
      deletePost
    }}>
      {children}
    </AppContext.Provider>
  );
}

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAppContext();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

// Login Route Component
function LoginRoute() {
  const { isAuthenticated, login } = useAppContext();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);
  
  const handleLogin = () => {
    login();
    navigate('/', { replace: true });
  };
  
  if (isAuthenticated) {
    return null;
  }
  
  return <Login onLogin={handleLogin} />;
}

// Timeline Route Component
function TimelineRoute() {
  const { posts } = useAppContext();
  const navigate = useNavigate();
  
  const handleSelectPost = (post: Post) => {
    navigate(`/post/${post.id}`);
  };
  
  return (
    <Timeline
      posts={posts.filter(post => !post.isDraft)}
      onSelectPost={handleSelectPost}
    />
  );
}

// Calendar Route Component
function CalendarRoute() {
  const { posts } = useAppContext();
  const navigate = useNavigate();
  
  const handleSelectPost = (post: Post) => {
    navigate(`/post/${post.id}`);
  };
  
  return (
    <Calendar
      posts={posts.filter(post => !post.isDraft)}
      onSelectPost={handleSelectPost}
    />
  );
}

// Post Composer Route Component
function PostComposerRoute() {
  const { posts, createPost, updatePost } = useAppContext();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const editingPost = id ? posts.find(post => post.id === id) || null : null;
  
  const handleSave = (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'> | Post) => {
    if (editingPost && 'id' in post) {
      updatePost(post);
    } else {
      createPost(post as Omit<Post, 'id' | 'createdAt' | 'updatedAt'>);
    }
    navigate('/', { replace: true });
  };
  
  const handleCancel = () => {
    navigate(-1);
  };
  
  return (
    <PostComposer
      editingPost={editingPost}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}

// Post Detail Route Component
function PostDetailRoute() {
  const { posts, deletePost } = useAppContext();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const post = id ? posts.find(p => p.id === id) : null;
  
  if (!post) {
    return <Navigate to="/" replace />;
  }
  
  const handleEdit = (post: Post) => {
    navigate(`/compose/${post.id}`);
  };
  
  const handleDelete = (postId: string) => {
    deletePost(postId);
    navigate('/', { replace: true });
  };
  
  const handleBack = () => {
    navigate(-1);
  };
  
  return (
    <PostDetail
      post={post}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onBack={handleBack}
    />
  );
}

// Search Route Component
function SearchRoute() {
  const { posts } = useAppContext();
  const navigate = useNavigate();
  
  const handleSelectPost = (post: Post) => {
    navigate(`/post/${post.id}`);
  };
  
  const handleBack = () => {
    navigate(-1);
  };
  
  return (
    <Search
      posts={posts}
      onSelectPost={handleSelectPost}
      onBack={handleBack}
    />
  );
}

// Drafts Route Component
function DraftsRoute() {
  const { posts, updatePost, deletePost } = useAppContext();
  const navigate = useNavigate();
  
  const handleSelectPost = (post: Post) => {
    navigate(`/post/${post.id}`);
  };
  
  const handleEditPost = (post: Post) => {
    navigate(`/compose/${post.id}`);
  };
  
  const handlePublishPost = (post: Post) => {
    updatePost({ ...post, isDraft: false });
  };
  
  const handleDeletePost = (postId: string) => {
    deletePost(postId);
  };
  
  const handleBack = () => {
    navigate(-1);
  };
  
  return (
    <Drafts
      posts={posts.filter(post => post.isDraft)}
      onSelectPost={handleSelectPost}
      onEditPost={handleEditPost}
      onPublishPost={handlePublishPost}
      onDeletePost={handleDeletePost}
      onBack={handleBack}
    />
  );
}

// Profile Route Component
function ProfileRoute() {
  const { userProfile, posts, logout } = useAppContext();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };
  
  const handleBack = () => {
    navigate(-1);
  };
  
  return (
    <Profile
      userProfile={userProfile}
      posts={posts}
      onLogout={handleLogout}
      onBack={handleBack}
    />
  );
}

export default function App() {
  return (
    <Router>
      <AppProvider>
        <Routes>
          <Route path="/login" element={<LoginRoute />} />
          <Route path="/" element={
            <ProtectedRoute>
              <MainLayout>
                <TimelineRoute />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/calendar" element={
            <ProtectedRoute>
              <MainLayout>
                <CalendarRoute />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/compose" element={
            <ProtectedRoute>
              <PostComposerRoute />
            </ProtectedRoute>
          } />
          <Route path="/compose/:id" element={
            <ProtectedRoute>
              <PostComposerRoute />
            </ProtectedRoute>
          } />
          <Route path="/post/:id" element={
            <ProtectedRoute>
              <PostDetailRoute />
            </ProtectedRoute>
          } />
          <Route path="/search" element={
            <ProtectedRoute>
              <SearchRoute />
            </ProtectedRoute>
          } />
          <Route path="/drafts" element={
            <ProtectedRoute>
              <DraftsRoute />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfileRoute />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppProvider>
    </Router>
  );
}