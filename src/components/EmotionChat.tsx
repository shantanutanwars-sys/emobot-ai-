import { useRef, useEffect } from "react";
import { ChatHeader } from "./ChatHeader";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "./TypingIndicator";
import { useEmotionChat } from "@/hooks/useEmotionChat";

export const EmotionChat = () => {
  const { messages, isLoading, isStreaming, sendMessage } = useEmotionChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto bg-background">
      <ChatHeader />
      
      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((message, index) => (
          <ChatMessage
            key={message.id}
            content={message.content}
            isUser={message.isUser}
            emotion={message.emotion}
            emotionIntensity={message.emotionIntensity}
            isStreaming={isStreaming && index === messages.length - 1 && !message.isUser}
          />
        ))}
        
        {isLoading && <TypingIndicator />}
        
        <div ref={messagesEndRef} />
      </main>

      <ChatInput onSend={sendMessage} disabled={isLoading || isStreaming} />
    </div>
  );
};