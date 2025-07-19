import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import * as lucideReact from "lucide-react";
import { useState } from "react";
import Post from "./Timeline";

interface PostDetailProps {
  post: Post;
  onEdit: (post: Post) => void;
  onDelete: (postId: string) => void;
  onBack: () => void;
}

export function PostDetail({ post, onEdit, onDelete, onBack }: PostDetailProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    onDelete(post.id);
    setShowDeleteConfirm(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="w-full max-w-[560px] mx-auto px-5 sm:px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <Button 
              // size="icon" 
              // variant="ghost" 
              onClick={onBack}
              className="rounded-2xl flex-shrink-0"
              aria-label="戻る"
            >
              <lucideReact.ArrowLeft className="w-5 h-5" />
            </Button>
            
            <h1 className="text-lg truncate">投稿の詳細</h1>
            
            <div className="flex items-center space-x-2 flex-shrink-0">
              <Button
                // size="icon"
                // variant="ghost"
                onClick={() => onEdit(post)}
                className="rounded-2xl"
                aria-label="編集"
              >
                <lucideReact.Edit3 className="w-4 h-4" />
              </Button>
              
              <Button
                // size="icon"
                // variant="ghost"
                onClick={() => setShowDeleteConfirm(true)}
                className="rounded-2xl text-destructive hover:bg-destructive hover:text-white"
                aria-label="削除"
              >
                <lucideReact.Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-[560px] mx-auto px-5 sm:px-4 py-4 space-y-6">
        {/* Post Content */}
        <Card className="p-6 rounded-3xl border-0 shadow-sm">
          <div className="space-y-4">
            {/* Status Badge */}
            <div className="flex items-center justify-between">
              {post.isDraft ? (
                <Badge className="bg-salmon-pink text-white rounded-full">
                  下書き
                </Badge>
              ) : (
                <Badge className="bg-neon-lime text-white rounded-full">
                  公開済み
                </Badge>
              )}
            </div>

            {/* Content */}
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap leading-relaxed">
                {post.content}
              </p>
            </div>
          </div>
        </Card>

        {/* Post Metadata */}
        <Card className="p-6 rounded-3xl border-0 shadow-sm">
          <div className="space-y-4">
            <h3>投稿情報</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <lucideReact.Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <span className="text-muted-foreground">投稿日時: </span>
                  <span>
                    {post.postDate.toLocaleDateString('ja-JP', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <lucideReact.Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <span className="text-muted-foreground">作成日時: </span>
                  <span>
                    {post.createdAt.toLocaleDateString('ja-JP', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>

              {post.updatedAt.getTime() !== post.createdAt.getTime() && (
                <div className="flex items-center gap-3">
                  <lucideReact.Edit3 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div>
                    <span className="text-muted-foreground">最終更新: </span>
                    <span>
                      {formatDistanceToNow(post.updatedAt, { 
                        addSuffix: true, 
                        locale: ja 
                      })}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="w-4 h-4 flex-shrink-0" />
                <div>
                  <span className="text-muted-foreground">文字数: </span>
                  <span>{post.content.length}文字</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <Alert className="rounded-2xl border-destructive">
            <lucideReact.AlertTriangle className="h-4 w-4 text-destructive" />
            <AlertDescription className="ml-2">
              <div className="space-y-3">
                <p className="text-sm">この投稿を削除しますか？この操作は取り消せません。</p>
                <div className="flex space-x-2">
                  <Button
                    // size="sm"
                    // variant="destructive"
                    onClick={handleDelete}
                    className="rounded-xl"
                  >
                    削除する
                  </Button>
                  <Button
                    // size="sm"
                    // variant="outline"
                    onClick={() => setShowDeleteConfirm(false)}
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
    </div>
  );
}