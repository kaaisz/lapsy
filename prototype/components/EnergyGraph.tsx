import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ChevronLeft, TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Area, AreaChart } from "recharts";

export function EnergyGraph() {
  const weekData = [
    { day: '月', energy: 65, mood: 'good' },
    { day: '火', energy: 78, mood: 'great' },
    { day: '水', energy: 45, mood: 'low' },
    { day: '木', energy: 82, mood: 'great' },
    { day: '金', energy: 88, mood: 'excellent' },
    { day: '土', energy: 92, mood: 'excellent' },
    { day: '日', energy: 75, mood: 'good' }
  ];

  const monthData = [
    { week: 'W1', energy: 72 },
    { week: 'W2', energy: 68 },
    { week: 'W3', energy: 85 },
    { week: 'W4', energy: 81 }
  ];

  const currentEnergy = 75;
  const previousEnergy = 68;
  const trend = currentEnergy > previousEnergy ? 'up' : 'down';
  const trendValue = Math.abs(currentEnergy - previousEnergy);

  return (
    <div className="min-h-screen bg-background p-8 max-w-sm mx-auto">
      {/* Header */}
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="icon" className="mr-4 rounded-2xl">
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <h2 className="text-xl">エナジーレベル</h2>
      </div>

      {/* Current Status */}
      <Card className="p-8 mb-8 rounded-3xl border-0 shadow-sm bg-salmon-pink text-primary">
        <div className="text-center">
          <div className="text-4xl mb-2">{currentEnergy}%</div>
          <div className="text-lg mb-4">現在のエナジー</div>
          <div className="flex items-center justify-center">
            {trend === 'up' ? (
              <TrendingUp className="w-5 h-5 mr-2" />
            ) : (
              <TrendingDown className="w-5 h-5 mr-2" />
            )}
            <span className="text-sm">
              先週比 {trend === 'up' ? '+' : '-'}{trendValue}%
            </span>
          </div>
        </div>
      </Card>

      {/* Week Chart */}
      <Card className="p-6 mb-8 rounded-3xl border-0 shadow-sm">
        <div className="mb-6">
          <h3 className="mb-2">今週の変化</h3>
          <div className="text-sm text-neutral-gray">日別エナジーレベル</div>
        </div>
        
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weekData}>
              <XAxis 
                dataKey="day" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#8a8a8a' }}
              />
              <YAxis hide />
              <Area
                type="monotone"
                dataKey="energy"
                stroke="#c5ff40"
                strokeWidth={3}
                fill="#c5ff40"
                fillOpacity={0.1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Month Overview */}
      <Card className="p-6 mb-8 rounded-3xl border-0 shadow-sm">
        <div className="mb-6">
          <h3 className="mb-2">月間トレンド</h3>
          <div className="text-sm text-neutral-gray">週別平均</div>
        </div>
        
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthData}>
              <XAxis 
                dataKey="week" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#8a8a8a' }}
              />
              <YAxis hide />
              <Line
                type="monotone"
                dataKey="energy"
                stroke="#ff8a80"
                strokeWidth={3}
                dot={{ fill: '#ff8a80', strokeWidth: 0, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Insights */}
      <Card className="p-6 mb-8 rounded-3xl border-0 shadow-sm">
        <h3 className="mb-4">インサイト</h3>
        <div className="space-y-3">
          <div className="flex items-center">
            <Badge className="mr-3 bg-neon-lime text-primary rounded-full">最高</Badge>
            <span className="text-sm">土曜日 (92%)</span>
          </div>
          <div className="flex items-center">
            <Badge variant="outline" className="mr-3 rounded-full">改善</Badge>
            <span className="text-sm">水曜日に注意</span>
          </div>
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex justify-center space-x-4">
        <div className="w-3 h-3 rounded-full bg-muted"></div>
        <div className="w-3 h-3 rounded-full bg-muted"></div>
        <div className="w-3 h-3 rounded-full bg-muted"></div>
        <div className="w-3 h-3 rounded-full bg-neon-lime"></div>
        <div className="w-3 h-3 rounded-full bg-muted"></div>
      </div>
    </div>
  );
}