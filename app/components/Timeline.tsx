import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { formatDistanceToNow, format, isSameDay } from "date-fns";
import { ja } from "date-fns/locale";
import { Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

type Post = {
  id: string;
  content: string;
  postDate: Date;
  createdAt: Date;
  updatedAt: Date;
  isDraft: boolean;
};
export default Post;

interface TimelineProps {
  posts: Post[];
  onSelectPost: (post: Post) => void;
}

// Helper function to get day of week in Japanese
const getDayOfWeek = (date: Date): string => {
  const days = ['日', '月', '火', '水', '木', '金', '土'];
  return days[date.getDay()];
};

// Helper function to group posts by date
const groupPostsByDate = (posts: Post[]) => {
  const groups: { date: Date; posts: Post[] }[] = [];
  
  posts.forEach(post => {
    const postDate = new Date(post.postDate);
    postDate.setHours(0, 0, 0, 0); // Normalize to start of day
    
    const existingGroup = groups.find(group => 
      isSameDay(group.date, postDate)
    );
    
    if (existingGroup) {
      existingGroup.posts.push(post);
    } else {
      groups.push({ date: postDate, posts: [post] });
    }
  });
  
  // Sort groups by date (newest first)
  groups.sort((a, b) => b.date.getTime() - a.date.getTime());
  
  // Sort posts within each group by time (newest first)
  groups.forEach(group => {
    group.posts.sort((a, b) => b.postDate.getTime() - a.postDate.getTime());
  });
  
  return groups;
};

export function Timeline({ posts, onSelectPost }: TimelineProps) {
  if (posts.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-neutral-gray" />
        </div>
        <h3 className="mb-2">まだ投稿がありません</h3>
        <p className="text-neutral-gray text-sm">
          右上の + ボタンから<br />
          最初の投稿を作成しましょう
        </p>
      </div>
    );
  }

  const sortedPosts = [...posts].sort((a, b) => b.postDate.getTime() - a.postDate.getTime());
  const groupedPosts = groupPostsByDate(sortedPosts);

  return (
    <div className="space-y-6 p-4 pb-8">
      {groupedPosts.map((group, groupIndex) => (
        <div key={group.date.getTime()} className="space-y-4">
          {group.posts.map((post, postIndex) => (
            <div key={post.id} className="flex gap-4 items-start">
              {/* Date indicator - only show for first post of each day */}
              {postIndex === 0 && (
                <div className="flex flex-col items-center flex-shrink-0 mt-1">
                  {/* Day of week */}
                  <div className="text-xs text-muted-foreground mb-1">
                    {getDayOfWeek(group.date)}
                  </div>
                  {/* Date circle */}
                  <div className="w-10 h-10 rounded-full bg-neon-lime text-white flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {format(group.date, 'd')}
                    </span>
                  </div>
                  {/* Connecting line to next date (if not the last group) */}
                  {groupIndex !== groupedPosts.length - 1 && (
                    <div className="w-0.5 h-6 bg-border mt-2" />
                  )}
                </div>
              )}
              
              {/* Spacer for subsequent posts on the same day */}
              {postIndex > 0 && (
                <div className="w-10 flex-shrink-0" />
              )}
              
              {/* Post card */}
              <Card
                className="flex-1 p-6 rounded-3xl border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onSelectPost(post)}
              >
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="rounded-full text-xs">
                      {formatDistanceToNow(post.postDate, { 
                        addSuffix: true, 
                        locale: ja 
                      })}
                    </Badge>
                    <div className="text-xs text-neutral-gray">
                      {post.postDate.toLocaleTimeString('ja-JP', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  <p className="leading-relaxed">{post.content}</p>
                </div>
                
                {post.createdAt.getTime() !== post.updatedAt.getTime() && (
                  <div className="text-xs text-neutral-gray flex items-center">
                    <div className="w-1 h-1 rounded-full bg-salmon-pink mr-2"></div>
                    編集済み
                  </div>
                )}
              </Card>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}