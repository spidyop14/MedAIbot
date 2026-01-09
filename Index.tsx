import { useState, useRef, useEffect } from "react";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { TypingIndicator } from "@/components/TypingIndicator";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface MoodState {
  mood: string;
  emoji: string;
  emotion_intensity: string;
}

// Cyberpunk mood-based neon accents
const moodNeonColors: Record<string, { primary: string; secondary: string; glow: string }> = {
  happy: { primary: "hsl(50 100% 50%)", secondary: "hsl(25 100% 55%)", glow: "hsl(50 100% 50% / 0.6)" },
  sad: { primary: "hsl(220 100% 60%)", secondary: "hsl(260 100% 50%)", glow: "hsl(220 100% 60% / 0.6)" },
  anxious: { primary: "hsl(25 100% 55%)", secondary: "hsl(0 100% 50%)", glow: "hsl(25 100% 55% / 0.6)" },
  stressed: { primary: "hsl(0 100% 55%)", secondary: "hsl(320 100% 50%)", glow: "hsl(0 100% 55% / 0.6)" },
  peaceful: { primary: "hsl(180 100% 50%)", secondary: "hsl(200 100% 60%)", glow: "hsl(180 100% 50% / 0.6)" },
  calm: { primary: "hsl(180 100% 50%)", secondary: "hsl(150 100% 50%)", glow: "hsl(180 100% 50% / 0.6)" },
  energetic: { primary: "hsl(320 100% 60%)", secondary: "hsl(280 100% 60%)", glow: "hsl(320 100% 60% / 0.6)" },
  neutral: { primary: "hsl(180 100% 50%)", secondary: "hsl(320 100% 60%)", glow: "hsl(180 100% 50% / 0.4)" },
};

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [moodState, setMoodState] = useState<MoodState | null>(null);
  const [isAnalyzingMood, setIsAnalyzingMood] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
  const MOOD_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-mood`;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const analyzeMood = async (userMessage: string) => {
    setIsAnalyzingMood(true);
    try {
      const response = await fetch(MOOD_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (response.ok) {
        const moodData = await response.json();
        setMoodState(moodData);
      }
    } catch (error) {
      console.error("Mood analysis error:", error);
    } finally {
      setIsAnalyzingMood(false);
    }
  };

  const streamChat = async (userMessage: string) => {
    const updatedMessages = [...messages, { role: "user" as const, content: userMessage }];
    setMessages(updatedMessages);
    setIsLoading(true);

    // Analyze mood in parallel
    analyzeMood(userMessage);

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!resp.ok) {
        if (resp.status === 429) {
          toast.error("Too many requests. Please try again in a moment.");
          setMessages(messages);
          setIsLoading(false);
          return;
        }
        if (resp.status === 402) {
          toast.error("Service temporarily unavailable. Please try again later.");
          setMessages(messages);
          setIsLoading(false);
          return;
        }
        throw new Error("Failed to start chat stream");
      }

      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;
      let assistantContent = "";

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) =>
                    i === prev.length - 1 ? { ...m, content: assistantContent } : m
                  );
                }
                return [...prev, { role: "assistant", content: assistantContent }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Final flush
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) =>
                    i === prev.length - 1 ? { ...m, content: assistantContent } : m
                  );
                }
                return [...prev, { role: "assistant", content: assistantContent }];
              });
            }
          } catch {
            /* ignore partial leftovers */
          }
        }
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Something went wrong. Please try again.");
      setMessages(messages);
      setIsLoading(false);
    }
  };

  const currentNeon = moodState ? moodNeonColors[moodState.mood] || moodNeonColors.neutral : moodNeonColors.neutral;

  return (
    <div className="flex flex-col h-screen relative overflow-hidden bg-background">
      {/* Cyberpunk base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-[hsl(280_40%_8%)] to-background" />
      
      {/* Animated grid */}
      <div className="absolute inset-0 cyber-grid opacity-60" />
      
      {/* Dynamic neon orbs based on mood */}
      <div 
        className="absolute top-1/4 -left-32 w-96 h-96 rounded-full blur-[120px] transition-all duration-1000 animate-float-slow"
        style={{ background: currentNeon.primary, opacity: 0.4 }}
      />
      <div 
        className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full blur-[100px] transition-all duration-1000 animate-float"
        style={{ background: currentNeon.secondary, opacity: 0.3 }}
      />
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px] transition-all duration-1000"
        style={{ background: currentNeon.glow, opacity: 0.15 }}
      />
      
      {/* Scanline effect overlay */}
      <div className="absolute inset-0 scanlines pointer-events-none" />
      
      {/* Horizontal neon lines */}
      <div className="absolute top-20 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute bottom-20 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/50 to-transparent" />
      

      <div className="flex flex-col h-screen relative z-10">
      <header className="border-b border-primary/20 bg-card/30 backdrop-blur-md sticky top-0 z-10 animate-fade-in-up">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold neon-text-cyan animate-neon-pulse tracking-wider">
            HEALMATE
          </h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6 max-w-4xl relative z-10">
          {messages.length === 0 ? (
            <WelcomeScreen />
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <ChatMessage 
                  key={index} 
                  role={message.role} 
                  content={message.content}
                  mood={moodState?.mood}
                />
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-primary/20 bg-card/30 backdrop-blur-md sticky bottom-0 relative z-10">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <ChatInput onSend={streamChat} disabled={isLoading} />
        </div>
      </footer>
      </div>
    </div>
  );
};

export default Index;
