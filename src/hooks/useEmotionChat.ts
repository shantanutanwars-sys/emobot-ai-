import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import type { Emotion } from "@/components/EmotionBadge";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  emotion?: Emotion;
  emotionIntensity?: "low" | "medium" | "high";
}

interface AIResponse {
  detected_emotion: Emotion;
  response: string;
  emotion_intensity: "low" | "medium" | "high";
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/emotion-chat`;

export const useEmotionChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm Aura, your empathetic companion. I'm here to listen and support you. How are you feeling today?",
      isUser: false,
      emotion: "calm",
      emotionIntensity: "medium",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const parseAIResponse = (text: string): { emotion?: Emotion; response: string; intensity?: "low" | "medium" | "high" } => {
    try {
      // Try to parse JSON response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed: AIResponse = JSON.parse(jsonMatch[0]);
        return {
          emotion: parsed.detected_emotion,
          response: parsed.response,
          intensity: parsed.emotion_intensity,
        };
      }
    } catch {
      // If parsing fails, return raw text
    }
    return { response: text };
  };

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Prepare messages for API (exclude welcome message metadata)
    const apiMessages = [...messages.filter(m => m.id !== "welcome"), userMessage].map((m) => ({
      role: m.isUser ? "user" : "assistant",
      content: m.content,
    }));

    try {
      abortControllerRef.current = new AbortController();

      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: apiMessages }),
        signal: abortControllerRef.current.signal,
      });

      if (!resp.ok) {
        if (resp.status === 429) {
          toast.error("Too many requests. Please wait a moment.");
          return;
        }
        if (resp.status === 402) {
          toast.error("Service temporarily unavailable.");
          return;
        }
        throw new Error("Failed to get response");
      }

      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let fullResponse = "";

      setIsLoading(false);
      setIsStreaming(true);

      const assistantMessageId = (Date.now() + 1).toString();

      // Add empty assistant message
      setMessages((prev) => [
        ...prev,
        { id: assistantMessageId, content: "", isUser: false },
      ]);

      while (true) {
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
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              fullResponse += content;
              
              // Update the message with streaming content
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantMessageId
                    ? { ...m, content: fullResponse }
                    : m
                )
              );
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Parse final response for emotion data
      const parsedResponse = parseAIResponse(fullResponse);

      // Update with final parsed response
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessageId
            ? {
                ...m,
                content: parsedResponse.response,
                emotion: parsedResponse.emotion,
                emotionIntensity: parsedResponse.intensity,
              }
            : m
        )
      );
    } catch (error) {
      if ((error as Error).name === "AbortError") return;
      console.error("Chat error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  }, [messages]);

  return {
    messages,
    isLoading,
    isStreaming,
    sendMessage,
  };
};