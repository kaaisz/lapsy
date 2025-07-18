import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Post } from "../App";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import { 
  ArrowLeft, 
  FileText, 
  Edit3, 
  Trash2, 
  Send, 
  Clock,
  AlertTriangle
} from "lucide-react";
import { useState } from "react";

interface DraftsProps {
  posts: Post[];
  onSelectPost: (post: Post) => void;
  onEditPost: (post: Post) => void;
  onPublishPost: (post: Post) => void;
  onDeletePost: (postId: string) => void;
  onBack: () => void;
}

export function Drafts({ 
  posts, 
  onSelectPost, 
  onEditPost, 
  onPublishPost, 
  onDeletePost, 
  onBack 
}: DraftsProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handlePublish = (post: Post) => {
    onPublishPost(post);
  };

  const handleDelete = (postId: string) => {
    onDeletePost(postId);
    setDeletingId(null);
  };

  if (posts.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="w-full max-w-[560px] mx-auto px-5 sm:px-4 py-4">
            <div className="flex items-center justify-between">
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={onBack}
                className="rounded-2xl"
                aria-label="戻る"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-lg">下書き一覧</h1>
              <div className="w-10" />
            </div>
          </div>
        </div>

        {/* Empty State */}
        <div className="w-full max-w-[560px] mx-auto px-5 sm:px-4 py-16">
          <Card className="p-8 rounded-3xl border-0 shadow-sm text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="mb-2">下書きがありません</h2>
            <p className="text-sm text-muted-foreground mb-6">
              投稿を下書きとして保存すると、ここに表示されます
            </p>
            <Button 
              onClick={onBack}
              className="rounded-2xl bg-neon-lime text-primary hover:bg-neon-lime/90"
            >
              投稿を作成する
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="w-full max-w-[560px] mx-auto px-5 sm:px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={onBack}
              className="rounded-2xl"
              aria-label="戻る"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg">下書き一覧</h1>
            <Badge variant="outline" className="rounded-full">
              {posts.length}件
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-[560px] mx-auto px-5 sm:px-4 py-4 space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="p-6 rounded-3xl border-0 shadow-sm">
            <div className="space-y-4">
              {/* Post Content */}
              <div 
                className="cursor-pointer"
                onClick={() => onSelectPost(post)}
              >
                <div className="flex items-start justify-between mb-2">
                  <Badge className="bg-salmon-pink text-white rounded-full">
                    下書き
                  </Badge>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatDistanceToNow(post.updatedAt, { 
                      addSuffix: true, 
                      locale: ja 
                    })}
                  </div>
                </div>
                
                <p className="text-sm line-clamp-3 mb-2">
                  {post.content}
                </p>
                
                <div className="text-xs text-muted-foreground">
                  投稿予定: {post.postDate.toLocaleDateString('ja-JP', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEditPost(post)}
                  className="rounded-xl flex-1"
                >
                  <Edit3 className="w-3 h-3 mr-1" />
                  編集
                </Button>
                
                <Button
                  size="sm"
                  onClick={() => handlePublish(post)}
                  className="rounded-xl flex-1 bg-neon-lime text-primary hover:bg-neon-lime/90"
                >
                  <Send className="w-3 h-3 mr-1" />
                  公開
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDeletingId(post.id)}
                  className="rounded-xl border-destructive text-destructive hover:bg-destructive hover:text-white"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>

              {/* Delete Confirmation */}
              {deletingId === post.id && (
                <Alert className="rounded-2xl border-destructive">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <AlertDescription className="ml-2">
                    <div className="space-y-3">
                      <p className="text-sm">この下書きを削除しますか？</p>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(post.id)}
                          className="rounded-xl"
                        >
                          削除
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setDeletingId(null)}
                          className="rounded-xl"
                        >
                          キャンセル
                        </Button>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}