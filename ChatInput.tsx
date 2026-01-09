import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-end">
      <div className="relative flex-1">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Share how you're feeling..."
          disabled={disabled}
          className="min-h-[70px] max-h-[140px] resize-none rounded-3xl glass-effect border-border/50 focus-visible:ring-primary focus-visible:ring-2 focus-visible:border-primary/50 transition-all duration-300 hover:border-primary/30 hover:shadow-lg px-6 py-4 text-base backdrop-blur-xl"
        />
        {/* Animated border glow */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 opacity-0 hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />
      </div>
      
      <Button
        type="submit"
        disabled={!input.trim() || disabled}
        className="h-[70px] w-[70px] rounded-3xl gradient-calm hover:opacity-90 hover:scale-110 active:scale-95 transition-all duration-300 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:hover:scale-100 animate-pulse-glow group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        <Send className="w-6 h-6 transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110 relative z-10" />
      </Button>
    </form>
  );
};
