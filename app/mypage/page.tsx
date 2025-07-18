// 認証済ユーザー専用ページ
"use client"

import useSession from "@/hooks/useSession"
import type { Session } from "@supabase/supabase-js"
import Header from "@/components/Header"
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

type Post = {
  id: string;
  content: string;
  postDate: string;
  createdAt: string;
  updatedAt: string;
  isDraft: boolean;
};

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

  if (loading) return <p>読み込み中...</p>
  if (!session) return null // layout.tsxでリダイレクトされる
  return (
    <div>
      <Header />
      <div>
        <h1>こんにちは、{session.user.email} さん！</h1>
        <p>これはログイン済ユーザー専用ページです。</p>
      </div>
    </div>
  )
}
