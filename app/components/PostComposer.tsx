import { useState, useEffect, useRef } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { ArrowLeft, Save, Calendar, Clock, FileText, AlertTriangle } from "lucide-react";
import { Post } from "../App";
import { useNavigate } from "react-router-dom";

interface PostComposerProps {
  editingPost?: Post | null;
  onSave: (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'> | Post) => void;
  onCancel: () => void;
}

export function PostComposer({ editingPost, onSave, onCancel }: PostComposerProps) {
  const [content, setContent] = useState("");
  const [postDate, setPostDate] = useState("");
  const [postTime, setPostTime] = useState("");
  const [isDraft, setIsDraft] = useState(false);
  const [errors, setErrors] = useState<{content?: string; date?: string}>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const navigate = useNavigate();
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const isEditing = !!editingPost;

  useEffect(() => {
    if (editingPost) {
      setContent(editingPost.content);
      const date = new Date(editingPost.postDate);
      setPostDate(date.toISOString().split('T')[0]);
      setPostTime(date.toTimeString().slice(0, 5));
      setIsDraft(editingPost.isDraft);
    } else {
      // Set default values for new post
      const now = new Date();
      setPostDate(now.toISOString().split('T')[0]);
      setPostTime(now.toTimeString().slice(0, 5));
      setContent("");
      setIsDraft(false);
    }
  }, [editingPost]);

  // Track unsaved changes
  useEffect(() => {
    if (editingPost) {
      const originalDate = new Date(editingPost.postDate);
      const originalDateStr = originalDate.toISOString().split('T')[0];
      const originalTimeStr = originalDate.toTimeString().slice(0, 5);
      
      const hasChanges = 
        content !== editingPost.content ||
        postDate !== originalDateStr ||
        postTime !== originalTimeStr ||
        isDraft !== editingPost.isDraft;
      
      setHasUnsavedChanges(hasChanges);
    } else {
      setHasUnsavedChanges(content.trim().length > 0);
    }
  }, [content, postDate, postTime, isDraft, editingPost]);

  // Focus content field on mount
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.focus();
    }
  }, []);

  const validateForm = () => {
    const newErrors: {content?: string; date?: string} = {};
    
    if (!content.trim()) {
      newErrors.content = "投稿内容は必須です";
    } else if (content.length > 500) {
      newErrors.content = "投稿内容は500文字以下で入力してください";
    }
    
    const selectedDateTime = new Date(`${postDate}T${postTime}`);
    if (isNaN(selectedDateTime.getTime())) {
      newErrors.date = "正しい日時を選択してください";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      // Focus first error field
      if (errors.content && contentRef.current) {
        contentRef.current.focus();
      }
      return;
    }

    const postDateTime = new Date(`${postDate}T${postTime}`);
    
    const postData = {
      content: content.trim(),
      postDate: postDateTime,
      isDraft
    };

    if (editingPost) {
      onSave({
        ...editingPost,
        ...postData
      });
    } else {
      onSave(postData);
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm("変更が保存されていません。破棄してもよろしいですか？");
      if (!confirmed) return;
    }
    onCancel();
  };

  const handleViewDrafts = () => {
    navigate('/drafts');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl/Cmd + S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
    // Escape to cancel
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const isValid = content.trim().length > 0 && content.length <= 500;
  const characterCount = content.length;
  const isOverLimit = characterCount > 500;

  return (
    <div className="min-h-screen bg-background" onKeyDown={handleKeyDown}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="w-full max-w-[560px] mx-auto px-5 sm:px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={handleCancel}
              className="rounded-2xl flex-shrink-0"
              aria-label="戻る"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <h1 className="text-lg truncate">
              {isEditing ? '投稿を編集' : '新しい投稿'}
            </h1>
            
            <Button
              onClick={handleSave}
              disabled={!isValid}
              className="rounded-2xl bg-neon-lime text-primary hover:bg-neon-lime/90 flex-shrink-0"
              aria-describedby="save-button-help"
            >
              <Save className="w-4 h-4 mr-2" />
              保存
            </Button>
          </div>
          
          {/* Keyboard shortcuts help */}
          <div id="save-button-help" className="sr-only">
            Ctrl+Sで保存、Escapeでキャンセルできます
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-[560px] mx-auto px-5 sm:px-4 py-4 space-y-6">
        {/* Unsaved changes indicator */}
        {hasUnsavedChanges && (
          <div 
            className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-2xl"
            role="status"
            aria-live="polite"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>未保存の変更があります</span>
          </div>
        )}

        {/* Drafts Link - only for new posts */}
        {!isEditing && (
          <Card className="p-4 rounded-3xl border-0 shadow-sm">
            <Button
              variant="outline"
              onClick={handleViewDrafts}
              className="w-full rounded-2xl h-12"
              aria-describedby="drafts-button-help"
            >
              <FileText className="w-4 h-4 mr-2" />
              下書きを確認
            </Button>
            <div id="drafts-button-help" className="sr-only">
              保存済みの下書き一覧を表示します
            </div>
          </Card>
        )}

        {/* Content Input */}
        <Card className="p-6 rounded-3xl border-0 shadow-sm">
          <div className="space-y-4">
            <Label htmlFor="content" className="text-base">
              投稿内容
              <span className="text-destructive ml-1" aria-label="必須">*</span>
            </Label>
            
            <div className="space-y-2">
              <textarea
                id="content"
                ref={contentRef}
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  if (errors.content) {
                    setErrors(prev => ({...prev, content: undefined}));
                  }
                }}
                placeholder="今日のことを書いてみませんか..."
                className={`min-h-32 w-full rounded-2xl border-0 bg-input-background p-4 text-base resize-none transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  errors.content ? 'ring-2 ring-destructive bg-destructive/5' : ''
                } ${
                  isOverLimit ? 'ring-2 ring-amber-500 bg-amber-50 dark:bg-amber-900/20' : ''
                }`}
                maxLength={600} // Allow slight overflow to show warning
                required
                aria-describedby="content-help content-count"
                aria-invalid={errors.content ? 'true' : 'false'}
              />
              
              <div className="flex justify-between items-center text-sm">
                <div id="content-count" className={`${isOverLimit ? 'text-amber-600' : 'text-muted-foreground'}`}>
                  {characterCount}/500文字
                  {isOverLimit && (
                    <span className="ml-2 text-amber-600">
                      ({characterCount - 500}文字超過)
                    </span>
                  )}
                </div>
                
                {errors.content && (
                  <div 
                    className="text-destructive"
                    role="alert"
                    aria-live="polite"
                  >
                    {errors.content}
                  </div>
                )}
              </div>
              
              <div id="content-help" className="sr-only">
                投稿内容を500文字以下で入力してください
              </div>
            </div>
          </div>
        </Card>

        {/* Date and Time Settings */}
        <Card className="p-6 rounded-3xl border-0 shadow-sm">
          <div className="space-y-4">
            <h2 className="text-base">投稿日時</h2>
            
            {/* Responsive grid: 2 columns on desktop, 1 column on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                type="date"
                label="日付"
                value={postDate}
                onChange={(e) => {
                  setPostDate(e.target.value);
                  if (errors.date) {
                    setErrors(prev => ({...prev, date: undefined}));
                  }
                }}
                error={errors.date}
                required
                icon={<Calendar className="w-4 h-4 text-muted-foreground" />}
              />
              
              <Input
                type="time"
                label="時刻"
                value={postTime}
                onChange={(e) => {
                  setPostTime(e.target.value);
                  if (errors.date) {
                    setErrors(prev => ({...prev, date: undefined}));
                  }
                }}
                required
                icon={<Clock className="w-4 h-4 text-muted-foreground" />}
              />
            </div>
          </div>
        </Card>

        {/* Draft Toggle */}
        <Card className="p-6 rounded-3xl border-0 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1 flex-1">
              <Label className="text-base">下書きとして保存</Label>
              <p className="text-sm text-muted-foreground">
                下書きはタイムラインに表示されません
              </p>
            </div>
            
            <div className="flex items-center space-x-2 flex-shrink-0">
              <Switch
                checked={isDraft}
                onCheckedChange={setIsDraft}
                aria-describedby="draft-help"
              />
              {isDraft && (
                <Badge className="bg-salmon-pink text-white rounded-full">
                  下書き
                </Badge>
              )}
            </div>
          </div>
          
          <div id="draft-help" className="sr-only">
            下書きとして保存すると、タイムラインには表示されません
          </div>
        </Card>
      </div>
    </div>
  );
}