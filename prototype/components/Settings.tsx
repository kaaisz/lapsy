import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { ChevronLeft, ChevronRight, User, Bell, Palette, Shield, HelpCircle, LogOut } from "lucide-react";

export function Settings() {
  const settingsSections = [
    {
      title: "アカウント",
      items: [
        { icon: <User className="w-5 h-5" />, label: "プロフィール", hasArrow: true },
        { icon: <Bell className="w-5 h-5" />, label: "通知", hasSwitch: true, enabled: true },
      ]
    },
    {
      title: "アプリ設定",
      items: [
        { icon: <Palette className="w-5 h-5" />, label: "ダークモード", hasSwitch: true, enabled: false },
        { icon: <Shield className="w-5 h-5" />, label: "プライバシー", hasArrow: true },
      ]
    },
    {
      title: "サポート",
      items: [
        { icon: <HelpCircle className="w-5 h-5" />, label: "ヘルプ", hasArrow: true },
        { icon: <LogOut className="w-5 h-5" />, label: "ログアウト", hasArrow: false, isDestructive: true },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background p-8 max-w-sm mx-auto">
      {/* Header */}
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="icon" className="mr-4 rounded-2xl">
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <h2 className="text-xl">設定</h2>
      </div>

      {/* Profile Card */}
      <Card className="p-8 mb-8 rounded-3xl border-0 shadow-sm bg-neon-lime text-primary">
        <div className="flex items-center">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mr-6">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg mb-1">田中太郎</h3>
            <div className="text-sm opacity-70">7日連続継続中</div>
          </div>
        </div>
      </Card>

      {/* Settings Sections */}
      <div className="space-y-8">
        {settingsSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <h4 className="text-sm text-neutral-gray mb-4 px-2">{section.title}</h4>
            <Card className="rounded-3xl border-0 shadow-sm overflow-hidden">
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex}>
                  {item.hasSwitch ? (
                    <div className="flex items-center justify-between p-6 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center">
                        <div className="mr-4 text-neutral-gray">
                          {item.icon}
                        </div>
                        <span>{item.label}</span>
                      </div>
                      <Switch 
                        checked={item.enabled} 
                        className="data-[state=checked]:bg-neon-lime"
                      />
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      className={`w-full justify-start p-6 h-auto rounded-none hover:bg-muted/50 ${
                        item.isDestructive ? 'text-destructive hover:text-destructive' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center">
                          <div className={`mr-4 ${item.isDestructive ? 'text-destructive' : 'text-neutral-gray'}`}>
                            {item.icon}
                          </div>
                          <span>{item.label}</span>
                        </div>
                        
                        {item.hasArrow && (
                          <ChevronRight className="w-5 h-5 text-neutral-gray" />
                        )}
                      </div>
                    </Button>
                  )}
                  {itemIndex < section.items.length - 1 && (
                    <div className="h-px bg-border mx-6" />
                  )}
                </div>
              ))}
            </Card>
          </div>
        ))}
      </div>

      {/* App Info */}
      <div className="text-center mt-12 mb-8">
        <div className="text-sm text-neutral-gray mb-2">Solution App</div>
        <div className="text-xs text-neutral-gray">バージョン 1.0.0</div>
      </div>

      {/* Navigation */}
      <div className="flex justify-center space-x-4">
        <div className="w-3 h-3 rounded-full bg-muted"></div>
        <div className="w-3 h-3 rounded-full bg-muted"></div>
        <div className="w-3 h-3 rounded-full bg-muted"></div>
        <div className="w-3 h-3 rounded-full bg-muted"></div>
        <div className="w-3 h-3 rounded-full bg-neon-lime"></div>
      </div>
    </div>
  );
}