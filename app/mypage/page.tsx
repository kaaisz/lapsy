// 認証済ユーザー専用ページ
"use client"

import useSession from "@/hooks/useSession";
import type { Session } from "@supabase/supabase-js";
import Header from "@/components/Header";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { PostComposer } from "@/app/components/PostComposer";

type Post = {
  id: string;
  content: string;
  postDate: string;
  createdAt: string;
  updatedAt: string;
  isDraft: boolean;
};  

export default function MyPage() {
  const { session, loading }: { session: Session | null, loading: boolean } = useSession() as { session: Session | null, loading: boolean };

  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("postDate", { ascending: false });

      if (error) {
        // エラーハンドリング
        return;
      }
      setPosts(data as Post[]);
    };

    fetchPosts();
  }, []);

  if (loading) return <p>読み込み中...</p>;
  if (!session) return null;

  // 例: 編集する投稿データ
  // const editingPost = {
  //   id: "1",
  //   content: "編集する内容",
  //   postDate: "2024-06-01T12:00:00.000Z",
  //   createdAt: "2024-06-01T11:00:00.000Z",
  //   updatedAt: "2024-06-01T11:30:00.000Z",
  //   isDraft: false,
  // };

//   const handleSave = (post: Post) => {
//     // 保存処理
//   };

  const handleCancel = () => {
    // キャンセル処理
  };
  const handleCreatePost = async (post: Omit<Post, "id" | "createdAt" | "updatedAt">) => {
    const { error } = await supabase
      .from("posts")
      .insert([
        {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...post,
        }
      ]);
    if (error) {
      // エラーハンドリング
      alert("投稿に失敗しました: " + error.message);
      return;
    }
    // 投稿成功時の処理（例: 投稿一覧を再取得 or 画面遷移）
  };

  return (
    <div>
      <Header />
      <h1>マイページ</h1>
      <PostComposer
        editingPost={undefined} // ← ここをundefinedまたはnullにする
        onSave={handleCreatePost}
        onCancel={handleCancel}
      />
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.content}</li>
        ))}
      </ul>
    </div>
  );
}
