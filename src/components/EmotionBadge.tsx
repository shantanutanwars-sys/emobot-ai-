import { cn } from "@/lib/utils";

type Emotion = "happy" | "sad" | "angry" | "anxious" | "calm" | "neutral";

interface EmotionBadgeProps {
  emotion: Emotion;
  intensity?: "low" | "medium" | "high";
  className?: string;
}

const emotionConfig: Record<Emotion, { label: string; emoji: string; colorClass: string }> = {
  happy: { label: "Happy", emoji: "😊", colorClass: "bg-emotion-happy text-foreground" },
  sad: { label: "Sad", emoji: "😢", colorClass: "bg-emotion-sad text-primary-foreground" },
  angry: { label: "Angry", emoji: "😠", colorClass: "bg-emotion-angry text-primary-foreground" },
  anxious: { label: "Anxious", emoji: "😰", colorClass: "bg-emotion-anxious text-foreground" },
  calm: { label: "Calm", emoji: "😌", colorClass: "bg-emotion-calm text-primary-foreground" },
  neutral: { label: "Neutral", emoji: "😐", colorClass: "bg-emotion-neutral text-primary-foreground" },
};

export const EmotionBadge = ({ emotion, intensity = "medium", className }: EmotionBadgeProps) => {
  const config = emotionConfig[emotion];
  
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium animate-bounce-in",
        config.colorClass,
        intensity === "high" && "ring-2 ring-offset-2 ring-offset-background",
        className
      )}
    >
      <span className="text-base">{config.emoji}</span>
      <span>{config.label}</span>
    </span>
  );
};

export type { Emotion };