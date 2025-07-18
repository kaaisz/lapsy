import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Plus, Search as SearchIcon, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine current tab based on pathname
  const getCurrentTab = () => {
    if (location.pathname === '/calendar') return 'calendar';
    return 'timeline';
  };
  
  const handleTabChange = (value: string) => {
    if (value === 'calendar') {
      navigate('/calendar');
    } else {
      navigate('/');
    }
  };
  
  // Check if we should show tabs (only on timeline and calendar pages)
  const shouldShowTabs = location.pathname === '/' || location.pathname === '/calendar';
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="w-full max-w-[560px] mx-auto px-5 sm:px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 
              className="text-lg cursor-pointer"
              onClick={() => navigate('/')}
            >
              Lapsy
            </h1>
            <div className="flex items-center space-x-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => navigate('/search')}
                className="rounded-2xl"
                aria-label="検索"
              >
                <SearchIcon className="w-5 h-5" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => navigate('/profile')}
                className="rounded-2xl"
                aria-label="プロフィール"
              >
                <User className="w-5 h-5" />
              </Button>
              <Button
                size="icon"
                onClick={() => navigate('/compose')}
                className="rounded-2xl bg-neon-lime text-primary hover:bg-neon-lime/90"
                aria-label="新しい投稿"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-[560px] mx-auto px-5 sm:px-4">
        {shouldShowTabs ? (
          <Tabs value={getCurrentTab()} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-2 rounded-3xl mt-4">
              <TabsTrigger value="timeline" className="rounded-2xl">タイムライン</TabsTrigger>
              <TabsTrigger value="calendar" className="rounded-2xl">カレンダー</TabsTrigger>
            </TabsList>
            
            <TabsContent value="timeline" className="mt-6">
              {location.pathname === '/' && children}
            </TabsContent>
            
            <TabsContent value="calendar" className="mt-6">
              {location.pathname === '/calendar' && children}
            </TabsContent>
          </Tabs>
        ) : (
          <div className="mt-6">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}