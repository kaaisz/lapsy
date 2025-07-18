import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ChevronLeft, Clock, Target, Zap } from "lucide-react";

export function ActionCards() {
  const actions = [
    {
      id: 1,
      title: "5分間瞑想",
      description: "心を落ち着けて、今この瞬間に集中しましょう",
      duration: "5分",
      category: "マインドフルネス",
      icon: <Target className="w-6 h-6" />,
      color: "bg-salmon-pink"
    },
    {
      id: 2,
      title: "水を飲む",
      description: "コップ1杯の水を飲んで、体に水分補給をしましょう",
      duration: "1分",
      category: "健康",
      icon: <Zap className="w-6 h-6" />,
      color: "bg-neon-lime"
    },
    {
      id: 3,
      title: "ストレッチ",
      description: "肩と首のストレッチで、体の緊張をほぐしましょう",
      duration: "3分",
      category: "運動",
      icon: <Clock className="w-6 h-6" />,
      color: "bg-neutral-gray"
    }
  ];

  return (
    <div className="min-h-screen bg-background p-8 max-w-sm mx-auto">
      {/* Header */}
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="icon" className="mr-4 rounded-2xl">
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <h2 className="text-xl">おすすめの行動</h2>
      </div>

      {/* Subtitle */}
      <div className="mb-12">
        <p className="text-neutral-gray">
          今のあなたにぴったりの<br />
          小さな行動を提案します
        </p>
      </div>

      {/* Action Cards */}
      <div className="space-y-6">
        {actions.map((action, index) => (
          <Card 
            key={action.id} 
            className={`p-8 rounded-3xl border-0 shadow-sm ${action.color} ${
              action.color === 'bg-neon-lime' || action.color === 'bg-salmon-pink' 
                ? 'text-primary' 
                : 'text-white'
            }`}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center mb-3">
                  {action.icon}
                  <Badge 
                    variant="secondary" 
                    className={`ml-3 rounded-full ${
                      action.color === 'bg-neon-lime' || action.color === 'bg-salmon-pink'
                        ? 'bg-white/20 text-current'
                        : 'bg-white/30 text-white'
                    }`}
                  >
                    {action.duration}
                  </Badge>
                </div>
                <h3 className="text-lg mb-3">{action.title}</h3>
                <p className={`text-sm mb-6 ${
                  action.color === 'bg-neon-lime' || action.color === 'bg-salmon-pink'
                    ? 'text-primary/70'
                    : 'text-white/70'
                }`}>
                  {action.description}
                </p>
              </div>
            </div>
            
            <Button 
              className={`w-full rounded-2xl h-12 ${
                action.color === 'bg-neon-lime' 
                  ? 'bg-primary text-neon-lime hover:bg-primary/90'
                  : action.color === 'bg-salmon-pink'
                  ? 'bg-primary text-salmon-pink hover:bg-primary/90'
                  : 'bg-white text-neutral-gray hover:bg-white/90'
              }`}
            >
              今すぐ始める
            </Button>
          </Card>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-center space-x-4 mt-12">
        <div className="w-3 h-3 rounded-full bg-muted"></div>
        <div className="w-3 h-3 rounded-full bg-neon-lime"></div>
        <div className="w-3 h-3 rounded-full bg-muted"></div>
        <div className="w-3 h-3 rounded-full bg-muted"></div>
        <div className="w-3 h-3 rounded-full bg-muted"></div>
      </div>
    </div>
  );
}