import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Post, UserProfile } from "../App";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import { 
  ArrowLeft, 
  Calendar, 
  TrendingUp, 
  Download, 
  LogOut, 
  AlertTriangle 
} from "lucide-react";
import { useState } from "react";

interface ProfileProps {
  userProfile: UserProfile;
  posts: Post[];
  onLogout: () => void;
  onBack: () => void;
}

export function Profile({ userProfile, posts, onLogout, onBack }: ProfileProps) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleExportData = () => {
    const data = {
      profile: userProfile,
      posts: posts,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lapsy-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    onLogout();
  };

  const publishedPosts = posts.filter(post => !post.isDraft);
  const draftPosts = posts.filter(post => post.isDraft);

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
            <h1 className="text-lg">プロフィール</h1>
            <div className="w-10" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-[560px] mx-auto px-5 sm:px-4 py-4 space-y-6">
        {/* User Profile */}
        <Card className="p-6 rounded-3xl border-0 shadow-sm">
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-neon-lime flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white" role="img" aria-label="ユーザーアイコン">
                  {userProfile.username.charAt(0)}
                </span>
              </div>
              <h2 className="text-xl">{userProfile.username}</h2>
              <p className="text-sm text-muted-foreground">
                {userProfile.joinedDate.toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}から利用開始
              </p>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4 rounded-3xl border-0 shadow-sm text-center">
            <div className="space-y-1">
              <p className="text-2xl">{publishedPosts.length}</p>
              <p className="text-sm text-muted-foreground">投稿数</p>
            </div>
          </Card>
          
          <Card className="p-4 rounded-3xl border-0 shadow-sm text-center">
            <div className="space-y-1">
              <p className="text-2xl">{userProfile.currentStreak}</p>
              <p className="text-sm text-muted-foreground">連続投稿日数</p>
            </div>
          </Card>
          
          <Card className="p-4 rounded-3xl border-0 shadow-sm text-center">
            <div className="space-y-1">
              <p className="text-2xl">{draftPosts.length}</p>
              <p className="text-sm text-muted-foreground">下書き数</p>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="p-6 rounded-3xl border-0 shadow-sm">
          <div className="space-y-4">
            <h3 className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-neon-lime" />
              最近の活動
            </h3>
            
            {publishedPosts.length > 0 ? (
              <div className="space-y-3">
                {publishedPosts.slice(0, 3).map((post) => (
                  <div key={post.id} className="p-3 bg-muted/30 rounded-2xl">
                    <p className="text-sm line-clamp-2 mb-2">{post.content}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {post.postDate.toLocaleDateString('ja-JP')}
                      </span>
                      <span>
                        {formatDistanceToNow(post.createdAt, { 
                          addSuffix: true, 
                          locale: ja 
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                まだ投稿がありません
              </p>
            )}
          </div>
        </Card>

        {/* Data Management */}
        <Card className="p-6 rounded-3xl border-0 shadow-sm">
          <div className="space-y-4">
            <h3>データ管理</h3>
            
            <Button
              variant="outline"
              onClick={handleExportData}
              className="w-full rounded-2xl h-12"
              aria-describedby="export-help"
            >
              <Download className="w-4 h-4 mr-2" />
              データをエクスポート
            </Button>
            <div id="export-help" className="sr-only">
              投稿データとプロフィール情報をJSONファイルとしてダウンロードします
            </div>
            
            <div className="text-xs text-muted-foreground">
              <p>投稿とプロフィール情報をJSONファイルとしてダウンロードできます。</p>
            </div>
          </div>
        </Card>

        {/* Logout */}
        <Card className="p-6 rounded-3xl border-0 shadow-sm">
          <div className="space-y-4">
            <Button
              variant="destructive"
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full rounded-2xl h-12"
            >
              <LogOut className="w-4 h-4 mr-2" />
              ログアウト
            </Button>

            {/* Logout Confirmation */}
            {showLogoutConfirm && (
              <Alert className="rounded-2xl border-destructive">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <AlertDescription className="ml-2">
                  <div className="space-y-3">
                    <p className="text-sm">ログアウトしますか？</p>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={handleLogout}
                        className="rounded-xl"
                      >
                        ログアウト
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowLogoutConfirm(false)}
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
      </div>
    </div>
  );
}