export const TypingIndicator = () => {
  return (
    <div className="flex justify-start animate-fade-in">
      <div className="bg-card border border-border rounded-2xl rounded-bl-md px-5 py-4 shadow-card">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
};