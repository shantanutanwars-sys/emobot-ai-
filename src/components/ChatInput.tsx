import { useState, KeyboardEvent } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative flex items-end gap-3 p-4 bg-card/80 backdrop-blur-md border-t border-border">
      <div className="flex-1 relative">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Share how you're feeling..."
          disabled={disabled}
          rows={1}
          className={cn(
            "w-full resize-none rounded-xl border border-input bg-background px-4 py-3 pr-12",
            "text-base placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-all duration-200",
            "min-h-[48px] max-h-[200px]"
          )}
          style={{
            height: "auto",
            overflowY: message.split("\n").length > 3 ? "auto" : "hidden",
          }}
        />
      </div>
      <button
        onClick={handleSend}
        disabled={!message.trim() || disabled}
        className={cn(
          "flex items-center justify-center w-12 h-12 rounded-xl",
          "gradient-primary text-primary-foreground shadow-soft",
          "hover:shadow-glow hover:scale-105 active:scale-95",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-soft",
          "transition-all duration-200"
        )}
        aria-label="Send message"
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
};