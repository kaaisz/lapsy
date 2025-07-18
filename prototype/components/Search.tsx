import { useState, useEffect, useMemo } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Post } from "../App";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import { ArrowLeft, Search as SearchIcon, Calendar, Filter } from "lucide-react";

interface SearchProps {
  posts: Post[];
  onSelectPost: (post: Post) => void;
  onBack: () => void;
}

export function Search({ posts, onSelectPost, onBack }: SearchProps) {
  const [query, setQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Filter posts based on search query and date range
  const filteredPosts = useMemo(() => {
    let filtered = posts;

    // Text search
    if (query.trim()) {
      const searchTerm = query.toLowerCase();
      filtered = filtered.filter(post => 
        post.content.toLowerCase().includes(searchTerm)
      );
    }

    // Date range filter
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      filtered = filtered.filter(post => {
        const postDate = new Date(post.postDate);
        postDate.setHours(0, 0, 0, 0);
        return postDate >= start;
      });
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter(post => {
        const postDate = new Date(post.postDate);
        return postDate <= end;
      });
    }

    // Sort by post date (newest first)
    return filtered.sort((a, b) => new Date(b.postDate).getTime() - new Date(a.postDate).getTime());
  }, [posts, query, startDate, endDate]);

  const clearFilters = () => {
    setQuery("");
    setStartDate("");
    setEndDate("");
  };

  const hasActiveFilters = query.trim() || startDate || endDate;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="w-full max-w-[560px] mx-auto px-5 sm:px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={onBack}
              className="rounded-2xl flex-shrink-0"
              aria-label="戻る"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <h1 className="text-lg">検索</h1>
            
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setShowFilters(!showFilters)}
              className={`rounded-2xl flex-shrink-0 ${showFilters ? 'bg-accent' : ''}`}
              aria-label="フィルター"
            >
              <Filter className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-[560px] mx-auto px-5 sm:px-4 py-4 space-y-4">
        {/* Search Input */}
        <Card className="p-4 rounded-3xl border-0 shadow-sm">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="投稿を検索..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 rounded-2xl border-0 bg-input-background"
              aria-label="投稿内容を検索"
            />
          </div>
        </Card>

        {/* Date Range Filters */}
        {showFilters && (
          <Card className="p-6 rounded-3xl border-0 shadow-sm">
            <div className="space-y-4">
              <h3 className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                期間で絞り込み
              </h3>
              
              {/* Responsive grid: 2 columns on desktop, 1 column on mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  type="date"
                  label="開始日"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                
                <Input
                  type="date"
                  label="終了日"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full rounded-2xl"
                >
                  フィルターをクリア
                </Button>
              )}
            </div>
          </Card>
        )}

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {query.trim() && (
              <Badge variant="outline" className="rounded-full">
                "{query}"
              </Badge>
            )}
            {startDate && (
              <Badge variant="outline" className="rounded-full">
                {new Date(startDate).toLocaleDateString('ja-JP')}から
              </Badge>
            )}
            {endDate && (
              <Badge variant="outline" className="rounded-full">
                {new Date(endDate).toLocaleDateString('ja-JP')}まで
              </Badge>
            )}
          </div>
        )}

        {/* Search Results */}
        <div className="space-y-4">
          {filteredPosts.length > 0 ? (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {filteredPosts.length}件の投稿が見つかりました
                </p>
              </div>
              
              {filteredPosts.map((post) => (
                <Card 
                  key={post.id} 
                  className="p-6 rounded-3xl border-0 shadow-sm cursor-pointer hover:shadow-md transition-shadow duration-200"
                  onClick={() => onSelectPost(post)}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm line-clamp-3 flex-1">{post.content}</p>
                      {post.isDraft && (
                        <Badge className="bg-salmon-pink text-white rounded-full flex-shrink-0">
                          下書き
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {post.postDate.toLocaleDateString('ja-JP', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      <span>
                        {formatDistanceToNow(post.createdAt, { 
                          addSuffix: true, 
                          locale: ja 
                        })}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </>
          ) : (
            <Card className="p-8 rounded-3xl border-0 shadow-sm text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                  <SearchIcon className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="mb-2">投稿が見つかりませんでした</h3>
                  <p className="text-sm text-muted-foreground">
                    {hasActiveFilters 
                      ? "検索条件を変更してお試しください" 
                      : "キーワードを入力して投稿を検索してください"
                    }
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}