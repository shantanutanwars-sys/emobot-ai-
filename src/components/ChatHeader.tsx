import { Heart, Sparkles } from "lucide-react";

export const ChatHeader = () => {
  return (
    <header className="sticky top-0 z-10 bg-card/90 backdrop-blur-md border-b border-border px-6 py-4">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full gradient-calm flex items-center justify-center shadow-soft animate-pulse-soft">
            <Heart className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emotion-calm rounded-full border-2 border-card" />
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-display font-semibold text-foreground flex items-center gap-2">
            Aura
            <Sparkles className="w-4 h-4 text-primary" />
          </h1>
          <p className="text-sm text-muted-foreground">Your empathetic companion</p>
        </div>
      </div>
    </header>
  );
};