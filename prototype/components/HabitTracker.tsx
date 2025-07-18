import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ChevronLeft, Check, Plus } from "lucide-react";

export function HabitTracker() {
  const habits = [
    {
      id: 1,
      name: "朝の瞑想",
      streak: 7,
      completed: true,
      weekProgress: [true, true, true, true, true, true, true]
    },
    {
      id: 2,
      name: "水分補給",
      streak: 5,
      completed: true,
      weekProgress: [true, true, false, true, true, true, true]
    },
    {
      id: 3,
      name: "読書",
      streak: 3,
      completed: false,
      weekProgress: [false, true, true, true, false, false, false]
    },
    {
      id: 4,
      name: "運動",
      streak: 1,
      completed: false,
      weekProgress: [false, false, false, false, false, true, false]
    }
  ];

  const days = ['月', '火', '水', '木', '金', '土', '日'];

  return (
    <div className="min-h-screen bg-background p-8 max-w-sm mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="mr-4 rounded-2xl">
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <h2 className="text-xl">習慣トラッカー</h2>
        </div>
        <Button size="icon" className="rounded-2xl bg-neon-lime text-primary hover:bg-neon-lime/90">
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      {/* Week Overview */}
      <Card className="p-6 mb-8 rounded-3xl border-0 shadow-sm">
        <div className="text-center mb-6">
          <h3 className="mb-2">今週の進捗</h3>
          <div className="text-3xl mb-2">16<span className="text-lg text-neutral-gray">/28</span></div>
          <div className="text-sm text-neutral-gray">57% 完了</div>
        </div>
        
        <div className="flex justify-between">
          {days.map((day, index) => (
            <div key={day} className="text-center">
              <div className="text-xs text-neutral-gray mb-2">{day}</div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                index < 6 ? 'bg-neon-lime text-primary' : 'bg-muted text-neutral-gray'
              }`}>
                {index < 6 ? index + 1 : '0'}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Habits List */}
      <div className="space-y-4 mb-8">
        {habits.map((habit) => (
          <Card key={habit.id} className="p-6 rounded-3xl border-0 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Button
                  size="icon"
                  variant={habit.completed ? "default" : "outline"}
                  className={`mr-4 rounded-2xl w-8 h-8 ${
                    habit.completed 
                      ? 'bg-neon-lime text-primary hover:bg-neon-lime/90' 
                      : 'border-2 hover:border-neon-lime'
                  }`}
                >
                  {habit.completed && <Check className="w-4 h-4" />}
                </Button>
                <div>
                  <h4 className="mb-1">{habit.name}</h4>
                  <Badge variant="outline" className="rounded-full text-xs">
                    {habit.streak}日連続
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              {habit.weekProgress.map((completed, index) => (
                <div
                  key={index}
                  className={`w-6 h-6 rounded-full ${
                    completed ? 'bg-neon-lime' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-center space-x-4">
        <div className="w-3 h-3 rounded-full bg-muted"></div>
        <div className="w-3 h-3 rounded-full bg-muted"></div>
        <div className="w-3 h-3 rounded-full bg-neon-lime"></div>
        <div className="w-3 h-3 rounded-full bg-muted"></div>
        <div className="w-3 h-3 rounded-full bg-muted"></div>
      </div>
    </div>
  );
}