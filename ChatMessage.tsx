import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import aiAvatar from "@/assets/ai-avatar.png";
import userAvatar from "@/assets/user-avatar.png";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  mood?: string;
}

export const ChatMessage = ({ role, content, mood }: ChatMessageProps) => {
  const isUser = role === "user";
  
  // Emotion-based animations and colors for AI responses
  const getMoodEffects = () => {
    if (role !== "assistant" || !mood) return {};
    
    switch (mood) {
      case "happy":
      case "energetic":
        return {
          animation: "animate-bounce",
          glow: "shadow-[0_0_30px_rgba(34,197,94,0.5)]"
        };
      case "calm":
      case "peaceful":
        return {
          animation: "animate-breathe",
          glow: "shadow-[0_0_30px_rgba(59,130,246,0.5)]"
        };
      case "anxious":
      case "stressed":
        return {
          animation: "animate-pulse",
          glow: "shadow-[0_0_30px_rgba(251,146,60,0.5)]"
        };
      case "sad":
        return {
          animation: "animate-float-slow",
          glow: "shadow-[0_0_30px_rgba(139,92,246,0.5)]"
        };
      default:
        return {};
    }
  };

  const moodEffects = getMoodEffects();

  return (
    <div
      className={cn(
        "flex gap-4 mb-8 group",
        isUser ? "flex-row-reverse animate-slide-in-right" : "flex-row animate-slide-in-left"
      )}
    >
      {/* Avatar with floating animation */}
      <div
        className={cn(
          "relative w-12 h-12 flex items-center justify-center flex-shrink-0 animate-float-slow",
          isUser ? "delay-100" : "delay-200",
          moodEffects.animation
        )}
      >
        <div 
          className={cn(
            "absolute inset-0 animate-blob-morph opacity-60",
            isUser ? "gradient-warm" : "gradient-calm",
            moodEffects.glow
          )}
        />
        <div className="relative z-10 w-full h-full rounded-full overflow-hidden ring-2 ring-white/50 shadow-lg">
          <img 
            src={isUser ? userAvatar : aiAvatar}
            alt={isUser ? "User" : "AI Assistant"}
            className="w-full h-full object-cover"
          />
        </div>
        {!isUser && (
          <Sparkles 
            className="absolute -top-1 -right-1 w-4 h-4 text-accent animate-pulse" 
            strokeWidth={2}
          />
        )}
      </div>

      {/* Message bubble with unique styling */}
      <div className="flex flex-col gap-2 max-w-[75%]">
        <div
          className={cn(
            "relative px-6 py-4 shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:scale-[1.02]",
            isUser
              ? "gradient-warm rounded-3xl rounded-tr-md text-white"
              : "glass-effect rounded-3xl rounded-tl-md"
          )}
        >
          {/* Decorative corner accent */}
          <div 
            className={cn(
              "absolute w-3 h-3 opacity-50",
              isUser 
                ? "top-0 right-0 bg-white rounded-bl-full" 
                : "top-0 left-0 bg-primary/30 rounded-br-full"
            )}
          />
          
          <p className={cn(
            "text-sm md:text-base leading-relaxed whitespace-pre-wrap relative z-10",
            isUser ? "text-white" : "text-foreground"
          )}>
            {content}
          </p>

          {/* Subtle gradient overlay */}
          {!isUser && (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-3xl rounded-tl-md pointer-events-none" />
          )}
        </div>

        {/* Message timestamp effect */}
        <div className={cn(
          "text-xs text-muted-foreground px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          isUser ? "text-right" : "text-left"
        )}>
          Just now
        </div>
      </div>
    </div>
  );
};
