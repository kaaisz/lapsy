// import { Card } from "./ui/card";
// import { Badge } from "./ui/badge";
// import { formatDistanceToNow, format, isSameDay } from "date-fns";
// import { ja } from "date-fns/locale";
import { isSameDay } from "date-fns";
import { Clock } from "lucide-react";
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
// const getDayOfWeek = (date: Date): string => {
//   const days = ['日', '月', '火', '水', '木', '金', '土'];
//   return days[date.getDay()];
// };

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

export function Timeline({ posts }: TimelineProps) {
  console.log("Timeline posts", posts);
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
  console.log("groupedPosts", groupedPosts);

  return (
    <div className="space-y-6 p-4 pb-8">
      <h2>デバッグ: グループ数 {groupedPosts.length}</h2>
      {groupedPosts.map((group) => (
        <div key={group.date.toISOString()}>
          <h3>{group.date.toLocaleDateString()} の投稿</h3>
          <ul>
            {group.posts.map(post => (
              <li key={post.id}>{post.content}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}