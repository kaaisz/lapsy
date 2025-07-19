// 認証済ユーザー専用ページ
"use client"

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

  return (
    <div>
      <Header />
      <h1>マイページ</h1>
      {editingPost ? (
        <PostComposer
          editingPost={{
            ...editingPost,
            postDate: editingPost.postDate instanceof Date ? editingPost.postDate.toISOString() : editingPost.postDate,
            createdAt: editingPost.createdAt instanceof Date ? editingPost.createdAt.toISOString() : editingPost.createdAt,
            updatedAt: editingPost.updatedAt instanceof Date ? editingPost.updatedAt.toISOString() : editingPost.updatedAt
          }}
          onSave={async (post) => {
            if ('id' in post) {
              await handleUpdatePost(post as Post);
            }
          }}
          onCancel={() => setEditingPost(null)}
        />
      ) : selectedPost ? (
        <PostDetail.PostDetail
          post={{
            ...selectedPost,
            postDate: selectedPost.postDate instanceof Date ? selectedPost.postDate : new Date(selectedPost.postDate),
            createdAt: selectedPost.createdAt instanceof Date ? selectedPost.createdAt : new Date(selectedPost.createdAt), 
            updatedAt: selectedPost.updatedAt instanceof Date ? selectedPost.updatedAt : new Date(selectedPost.updatedAt)
          }}
          onEdit={post => setEditingPost(post)}
          onDelete={( /* postId */ ) => {/* 削除機能は後で実装 */}}
          onBack={() => setSelectedPost(null)}
        />
      ) : (
        <>
          <PostComposer
            editingPost={undefined}
            onSave={handleCreatePost}
            onCancel={handleCancel}
          />
          <ul>
            {posts.map((post) => (
              <li key={post.id}>{post.content}</li>
            ))}
          </ul>
          <Timeline
            posts={posts.map(post => ({
              ...post,
              postDate: post.postDate instanceof Date ? post.postDate : new Date(post.postDate),
              createdAt: post.createdAt instanceof Date ? post.createdAt : new Date(post.createdAt),
              updatedAt: post.updatedAt instanceof Date ? post.updatedAt : new Date(post.updatedAt),
            }))}
            onSelectPost={setSelectedPost}
          />
        </>
      )}
    </div>
  );
}
