// 認証済ユーザー専用ページ
"use client"
import AuthGuard from "../components/AuthGuard";
import useSession from "@/hooks/useSession";
import type { Session } from "@supabase/supabase-js";
import Header from "@/components/Header";
import { Timeline } from "@/app/components/Timeline";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { PostComposer } from "@/app/components/PostComposer";
import * as PostDetail from "@/app/components/PostDetail";

type Post = {
  id: string;
  content: string;
  postDate: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
  isDraft: boolean;
};  

export default function MyPage() {
  const { session, loading }: { session: Session | null, loading: boolean } = useSession() as { session: Session | null, loading: boolean };

  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  // useEffectの外で定義
  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("postDate", { ascending: false });

    if (error) return;

    const postsWithDate = (data as Post[]).map(post => ({
      ...post,
      postDate: new Date(post.postDate),
      createdAt: new Date(post.createdAt),
      updatedAt: new Date(post.updatedAt),
    }));
    setPosts(postsWithDate);
  };

  // useEffect内で呼び出し
  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <Header />
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-neon-lime/20 border-t-neon-lime mx-auto"></div>
              <div className="absolute inset-0 animate-pulse rounded-full h-12 w-12 bg-neon-lime/10"></div>
            </div>
            <p className="text-muted-foreground font-medium">読み込み中...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!session) return null;

  const handleCancel = () => {
    // キャンセル処理
  };
  
  const handleCreatePost = async (
    post: Omit<Post, "id" | "createdAt" | "updatedAt"> | Omit<Post, "id" | "createdAt" | "updatedAt"> & { postDate: string }
  ) => {
    // postDateがstringならDateに変換
    const postDate =
      typeof post.postDate === "string"
        ? new Date(post.postDate)
        : post.postDate;

    const { error } = await supabase.from("posts").insert([
      {
        ...post,
        postDate,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    if (error) {
      // エラーハンドリング
      alert("投稿に失敗しました: " + error.message);
      return;
    }
    // 投稿成功時の処理（例: 投稿一覧を再取得 or 画面遷移）
    fetchPosts();
  };

  const handleUpdatePost = async (post: Post) => {
    const { id, ...updateFields } = post;
    const { error } = await supabase
      .from("posts")
      .update({
        ...updateFields,
        updatedAt: new Date(),
      })
      .eq("id", id);

    if (error) {
      alert("更新に失敗しました: " + error.message);
      return;
    }
    setEditingPost(null);
    setSelectedPost(null);
    // 投稿一覧を再取得
    fetchPosts();
  };

  const handleDeletePost = async (postId: string) => {
    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", postId);

    if (error) {
      console.log("delete error", error);
      alert("削除に失敗しました: " + error.message);
      return;
    }
    setSelectedPost(null); // 詳細画面を閉じる
    setEditingPost(null);  // 編集画面も閉じる（念のため）
    fetchPosts();          // 投稿一覧を再取得
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
        <Header />
        
        {/* Background decorative elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-neon-lime/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-salmon-pink/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <main className="w-full max-w-[560px] mx-auto px-5 sm:px-4">
          {editingPost ? (
            <div className="max-w-3xl mx-auto animate-fade-in">
              <PostComposer
                editingPost={{
                  ...editingPost!,
                  postDate: editingPost!.postDate instanceof Date ? editingPost!.postDate.toISOString() : editingPost!.postDate,
                  createdAt: editingPost!.createdAt instanceof Date ? editingPost!.createdAt.toISOString() : editingPost!.createdAt,
                  updatedAt: editingPost!.updatedAt instanceof Date ? editingPost!.updatedAt.toISOString() : editingPost!.updatedAt,
                }}
                onSave={(post: Omit<Post, "id" | "createdAt" | "updatedAt">) => handleUpdatePost({...post, id: editingPost!.id, createdAt: editingPost!.createdAt, updatedAt: editingPost!.updatedAt})}
                onCancel={() => setEditingPost(null)}
              />
            </div>
          ) : selectedPost ? (
            <div className="max-w-3xl mx-auto animate-fade-in">
              <PostDetail.PostDetail
                post={{
                  ...selectedPost,
                  postDate: selectedPost.postDate instanceof Date ? selectedPost.postDate : new Date(selectedPost.postDate),
                  createdAt: selectedPost.createdAt instanceof Date ? selectedPost.createdAt : new Date(selectedPost.createdAt), 
                  updatedAt: selectedPost.updatedAt instanceof Date ? selectedPost.updatedAt : new Date(selectedPost.updatedAt)
                }}
                onEdit={post => setEditingPost(post)}
                onDelete={postId => handleDeletePost(postId)}
                onBack={() => setSelectedPost(null)}
              />
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-12 animate-fade-in">
              {/* Hero Section */}
              <div className="text-center space-y-6 py-8">
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold text-foreground gradient-text">
                    マイページ
                  </h1>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    あなたの思いを投稿して、日々の記録を残しましょう
                  </p>
                </div>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                  <div className="glass-effect rounded-2xl p-6 text-center">
                    <div className="text-2xl font-bold text-neon-lime">{posts.length}</div>
                    <div className="text-sm text-muted-foreground">総投稿数</div>
                  </div>
                  <div className="glass-effect rounded-2xl p-6 text-center">
                    <div className="text-2xl font-bold text-salmon-pink">
                      {posts.filter(p => p.createdAt.toString() !== p.updatedAt.toString()).length}
                    </div>
                    <div className="text-sm text-muted-foreground">編集済み</div>
                  </div>
                  <div className="glass-effect rounded-2xl p-6 text-center">
                    <div className="text-2xl font-bold text-neutral-gray">
                      {new Set(posts.map(p => new Date(p.postDate).toDateString())).size}
                    </div>
                    <div className="text-sm text-muted-foreground">投稿日数</div>
                  </div>
                </div>
              </div>
              
              {/* 投稿作成フォーム */}
              <div className="glass-effect rounded-3xl p-8 shadow-premium border border-border/50 backdrop-blur-xl">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-foreground mb-2">新しい投稿</h2>
                  <p className="text-muted-foreground">今日のできごとや思いを記録しましょう</p>
                </div>
                <PostComposer
                  editingPost={undefined}
                  onSave={handleCreatePost}
                  onCancel={handleCancel}
                />
              </div>

              {/* タイムライン */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-foreground">タイムライン</h2>
                  {posts.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                      {posts.length}件の投稿
                    </div>
                  )}
                </div>
                
                <div className="glass-effect rounded-3xl border border-border/50 backdrop-blur-xl overflow-hidden">
                  <Timeline
                    posts={posts.map(post => ({
                      ...post,
                      postDate: post.postDate instanceof Date ? post.postDate : new Date(post.postDate),
                      createdAt: post.createdAt instanceof Date ? post.createdAt : new Date(post.createdAt),
                      updatedAt: post.updatedAt instanceof Date ? post.updatedAt : new Date(post.updatedAt),
                    }))}
                    onSelectPost={setSelectedPost}
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}
