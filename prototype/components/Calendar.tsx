import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Post } from "../App";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarProps {
  posts: Post[];
  onSelectPost: (post: Post) => void;
}

export function Calendar({ posts, onSelectPost }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get posts for selected date
  const getPostsForDate = (date: Date) => {
    return posts.filter(post => 
      post.postDate.getFullYear() === date.getFullYear() &&
      post.postDate.getMonth() === date.getMonth() &&
      post.postDate.getDate() === date.getDate()
    );
  };

  // Get post count for a date
  const getPostCount = (date: Date) => {
    return getPostsForDate(date).length;
  };

  // Get intensity class based on post count
  const getIntensityClass = (count: number) => {
    if (count === 0) return 'bg-muted';
    if (count <= 2) return 'bg-chart-1/30';
    if (count <= 5) return 'bg-chart-1/60';
    return 'bg-chart-1';
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const firstDayWeekday = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push(date);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
    setSelectedDate(null);
  };

  const handleDateClick = (date: Date) => {
    const postsForDate = getPostsForDate(date);
    if (postsForDate.length > 0) {
      setSelectedDate(date);
    }
  };

  const selectedDatePosts = selectedDate ? getPostsForDate(selectedDate) : [];

  return (
    <div className="p-4 space-y-6">
      {/* Calendar Header */}
      <Card className="p-6 rounded-3xl border-0 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => navigateMonth('prev')}
            className="rounded-2xl"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-lg">
            {currentDate.toLocaleDateString('ja-JP', { 
              year: 'numeric', 
              month: 'long' 
            })}
          </h2>
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => navigateMonth('next')}
            className="rounded-2xl"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {weekdays.map(day => (
            <div key={day} className="text-center text-xs text-neutral-gray p-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((date, index) => {
            if (!date) {
              return <div key={index} className="aspect-square" />;
            }

            const postCount = getPostCount(date);
            const isToday = date.toDateString() === new Date().toDateString();
            const isSelected = selectedDate?.toDateString() === date.toDateString();

            return (
              <button
                key={date.toISOString()}
                onClick={() => handleDateClick(date)}
                className={`
                  aspect-square rounded-xl relative transition-all hover:scale-105
                  ${getIntensityClass(postCount)}
                  ${isToday ? 'ring-2 ring-neon-lime' : ''}
                  ${isSelected ? 'ring-2 ring-salmon-pink' : ''}
                  ${postCount > 0 ? 'cursor-pointer' : 'cursor-default'}
                `}
              >
                <span className={`
                  text-sm 
                  ${postCount > 5 ? 'text-primary' : 'text-foreground'}
                  ${isToday ? 'font-medium' : ''}
                `}>
                  {date.getDate()}
                </span>
                {postCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-salmon-pink text-white text-xs flex items-center justify-center">
                    {postCount > 9 ? '9+' : postCount}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Legend */}
      <Card className="p-4 rounded-2xl border-0 shadow-sm">
        <div className="flex items-center justify-between text-xs text-neutral-gray">
          <span>投稿なし</span>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded bg-muted"></div>
            <div className="w-3 h-3 rounded bg-chart-1/30"></div>
            <div className="w-3 h-3 rounded bg-chart-1/60"></div>
            <div className="w-3 h-3 rounded bg-chart-1"></div>
          </div>
          <span>多い</span>
        </div>
      </Card>

      {/* Selected Date Posts */}
      {selectedDate && selectedDatePosts.length > 0 && (
        <Card className="p-6 rounded-3xl border-0 shadow-sm">
          <div className="mb-4">
            <h3 className="mb-2">
              {selectedDate.toLocaleDateString('ja-JP', {
                month: 'long',
                day: 'numeric',
                weekday: 'short'
              })}
            </h3>
            <Badge className="bg-salmon-pink text-white rounded-full">
              {selectedDatePosts.length}件の投稿
            </Badge>
          </div>
          
          <div className="space-y-3">
            {selectedDatePosts.map(post => (
              <div
                key={post.id}
                onClick={() => onSelectPost(post)}
                className="p-4 rounded-2xl bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
              >
                <div className="text-xs text-neutral-gray mb-2">
                  {post.postDate.toLocaleTimeString('ja-JP', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
                <p className="text-sm line-clamp-2">{post.content}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}