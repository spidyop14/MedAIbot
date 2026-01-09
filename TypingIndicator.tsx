import { Sparkles } from "lucide-react";
import aiAvatar from "@/assets/ai-avatar.png";

export const TypingIndicator = () => {
  return (
    <div className="flex gap-4 mb-8 group animate-slide-in-left">
      {/* Avatar with floating animation */}
      <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0 animate-float-slow delay-200">
        <div className="absolute inset-0 animate-blob-morph opacity-60 gradient-calm" />
        <div className="relative z-10 w-full h-full rounded-full overflow-hidden ring-2 ring-white/50 shadow-lg">
          <img 
            src={aiAvatar}
            alt="AI Assistant"
            className="w-full h-full object-cover"
          />
        </div>
        <Sparkles 
          className="absolute -top-1 -right-1 w-4 h-4 text-accent animate-pulse" 
          strokeWidth={2}
        />
      </div>

      {/* Typing bubble */}
      <div className="flex flex-col gap-2 max-w-[75%]">
        <div className="relative px-6 py-5 glass-effect rounded-3xl rounded-tl-md shadow-lg animate-pulse-glow">
          <div className="flex gap-2 items-center">
            <div className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
            <div className="w-2.5 h-2.5 rounded-full bg-accent animate-bounce [animation-delay:-0.15s]" />
            <div className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce" />
          </div>
          
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-3xl rounded-tl-md pointer-events-none" />
        </div>

        <div className="text-xs text-muted-foreground px-2 animate-pulse">
          HealMate is thinking...
        </div>
      </div>
    </div>
  );
};
