import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";

export function Dashboard() {
  const currentTime = new Date().toLocaleTimeString('ja-JP', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className="min-h-screen bg-background p-8 max-w-sm mx-auto">
      {/* Header */}
      <div className="mb-12">
        <div className="text-neutral-gray mb-2">{currentTime}</div>
        <h1 className="text-2xl mb-2">おはよう</h1>
        <div className="text-neutral-gray">今日の調子はどうですか？</div>
      </div>

      {/* Energy Level */}
      <Card className="p-8 mb-8 rounded-3xl border-0 shadow-sm">
        <div className="mb-6">
          <h3 className="mb-4">エナジーレベル</h3>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-neutral-gray">低</span>
            <span className="text-sm text-neutral-gray">高</span>
          </div>
          <Progress value={75} className="h-3 bg-muted" />
        </div>
        <div className="text-sm text-neutral-gray">75% - 調子良好</div>
      </Card>

      {/* Today's Focus */}
      <Card className="p-8 mb-8 rounded-3xl border-0 shadow-sm bg-neon-lime text-primary">
        <h3 className="mb-3">今日のフォーカス</h3>
        <div className="text-lg mb-4">深呼吸を3回する</div>
        <Button 
          className="w-full rounded-2xl bg-primary text-neon-lime hover:bg-primary/90 h-12"
        >
          実行する
        </Button>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Card className="p-6 rounded-3xl border-0 shadow-sm">
          <div className="text-2xl mb-2">7</div>
          <div className="text-sm text-neutral-gray">連続日数</div>
        </Card>
        <Card className="p-6 rounded-3xl border-0 shadow-sm">
          <div className="text-2xl mb-2">12</div>
          <div className="text-sm text-neutral-gray">完了した習慣</div>
        </Card>
      </div>

      {/* Navigation */}
      <div className="flex justify-center space-x-4">
        <div className="w-3 h-3 rounded-full bg-neon-lime"></div>
        <div className="w-3 h-3 rounded-full bg-muted"></div>
        <div className="w-3 h-3 rounded-full bg-muted"></div>
        <div className="w-3 h-3 rounded-full bg-muted"></div>
        <div className="w-3 h-3 rounded-full bg-muted"></div>
      </div>
    </div>
  );
}