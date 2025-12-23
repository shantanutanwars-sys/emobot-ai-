import { cn } from "@/lib/utils";
import { EmotionBadge, type Emotion } from "./EmotionBadge";

interface ChatMessageProps {
  content: string;
  isUser: boolean;
  emotion?: Emotion;
  emotionIntensity?: "low" | "medium" | "high";
  isStreaming?: boolean;
}

export const ChatMessage = ({ 
  content, 
  isUser, 
  emotion, 
  emotionIntensity,
  isStreaming 
}: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "flex w-full animate-slide-up",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[85%] md:max-w-[70%] rounded-2xl px-5 py-3 shadow-card",
          isUser
            ? "gradient-primary text-primary-foreground rounded-br-md"
            : "bg-card text-card-foreground rounded-bl-md border border-border"
        )}
      >
        {!isUser && emotion && (
          <div className="mb-2">
            <EmotionBadge emotion={emotion} intensity={emotionIntensity} />
          </div>
        )}
        <p className="text-base leading-relaxed whitespace-pre-wrap">
          {content}
          {isStreaming && (
            <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse rounded-sm" />
          )}
        </p>
      </div>
    </div>
  );
};