import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { formatDistanceToNow, format, isSameDay } from "date-fns";
import { ja } from "date-fns/locale";
import { Sparkles } from "lucide-react";
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
      <div className="relative p-12 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-neon-lime/5 via-transparent to-salmon-pink/5 rounded-3xl"></div>
        <div className="relative z-10">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-neon-lime to-neon-lime-light flex items-center justify-center mx-auto mb-6 shadow-lg shadow-neon-lime/25">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h3 className="mb-3 text-xl font-semibold text-foreground">まだ投稿がありません</h3>
          <p className="text-neutral-gray text-base leading-relaxed max-w-sm mx-auto">
            上の投稿フォームから<br />
            あなたの最初の投稿を作成しましょう
          </p>
        </div>
      </div>
    );
  }

  const sortedPosts = [...posts].sort((a, b) => b.postDate.getTime() - a.postDate.getTime());
  const groupedPosts = groupPostsByDate(sortedPosts);

  return (
    <div className="space-y-8 p-6 pb-12">
      {groupedPosts.map((group, groupIndex) => (
        <div key={group.date.getTime()} className="space-y-6 animate-fade-in">
          {group.posts.map((post, postIndex) => (
            <div key={post.id} className="flex gap-6 items-start group">
              {/* Date indicator - only show for first post of each day */}
              {postIndex === 0 && (
                <div className="flex flex-col items-center flex-shrink-0 mt-2 relative">
                  {/* Day of week */}
                  <div className="text-xs font-medium text-muted-foreground mb-2 tracking-wider uppercase">
                    {getDayOfWeek(group.date)}
                  </div>
                  {/* Date circle with gradient */}
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-neon-lime text-white flex items-center justify-center">
                      <span className="text-sm font-semibold">
                        {format(group.date, 'd')}
                      </span>
                    </div>
                    {/* Connecting line to next date */}
                    {groupIndex !== groupedPosts.length - 1 && (
                      <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-0.5 h-8 bg-gradient-to-b from-neon-lime/50 to-transparent" />
                    )}
                  </div>
                </div>
              )}
              
              {/* Spacer for subsequent posts on the same day */}
              {postIndex > 0 && (
                <div className="w-12 flex-shrink-0 relative">
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-gradient-to-b from-border to-transparent opacity-50" />
                </div>
              )}
              
              {/* Enhanced Post card */}
              <Card
                className="flex-1 p-8 rounded-3xl border-0 shadow-lg bg-card/80 backdrop-blur-sm cursor-pointer 
                          floating-card hover:shadow-premium-hover transition-all duration-300 ease-smooth
                          hover:border-neon-lime/20 group-hover:scale-[1.01] animate-slide-up"
                style={{ 
                  animationDelay: `${postIndex * 100}ms`,
                  background: 'linear-gradient(135deg, hsl(var(--card)) 0%, hsl(var(--card)/0.95) 100%)'
                }}
                onClick={() => onSelectPost(post)}
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between mb-2">
                    <Badge 
                      variant="outline" 
                      className="rounded-full text-xs font-medium px-3 py-1 
                                border-neon-lime/30 text-neon-lime bg-neon-lime/5 
                                hover:bg-neon-lime/10 transition-colors duration-200"
                    >
                      {formatDistanceToNow(post.postDate, { 
                        addSuffix: true, 
                        locale: ja 
                      })}
                    </Badge>
                    <div className="text-xs text-neutral-gray font-medium tabular-nums">
                      {post.postDate.toLocaleTimeString('ja-JP', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  
                  <div className="prose prose-base max-w-none">
                    <p className="leading-relaxed text-foreground m-0 text-balance">
                      {post.content}
                    </p>
                  </div>
                  
                  {post.createdAt.getTime() !== post.updatedAt.getTime() && (
                    <div className="flex items-center text-xs text-neutral-gray/80 font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-salmon-pink to-salmon-pink-light mr-2 shadow-sm"></div>
                      編集済み
                    </div>
                  )}
                </div>
                
                {/* Subtle hover gradient overlay */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-neon-lime/0 via-transparent to-salmon-pink/0 
                               group-hover:from-neon-lime/5 group-hover:to-salmon-pink/5 transition-all duration-500 pointer-events-none"></div>
              </Card>
            </div>
          ))}
        </div>
      ))}
      
      {/* Timeline end indicator */}
      <div className="flex justify-center pt-8">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-muted-foreground/50"></div>
        </div>
      </div>
    </div>
  );
}