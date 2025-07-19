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
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-lime mx-auto mb-4"></div>
            <p className="text-muted-foreground">読み込み中...</p>
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
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {editingPost ? (
            <div className="max-w-2xl mx-auto">
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
            <div className="max-w-2xl mx-auto">
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
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  マイページ
                </h1>
                <p className="text-muted-foreground">
                  あなたの思いを投稿しましょう
                </p>
              </div>
              
              {/* 投稿作成フォーム */}
              <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                <PostComposer
                  editingPost={undefined}
                  onSave={handleCreatePost}
                  onCancel={handleCancel}
                />
              </div>

              {/* 投稿一覧（デバッグ用簡易表示） */}
              {posts.length > 0 && (
                <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
                  <h3 className="font-medium text-foreground mb-3">投稿一覧 ({posts.length}件)</h3>
                  <ul className="space-y-2">
                    {posts.map((post) => (
                      <li key={post.id} className="text-sm text-muted-foreground truncate">
                        {post.content}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* タイムライン */}
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
          )}
        </main>
      </div>
    </AuthGuard>
  );
}
