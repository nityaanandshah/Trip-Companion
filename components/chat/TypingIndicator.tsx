'use client';

interface TypingUser {
  userId: string;
  userName: string;
}

interface TypingIndicatorProps {
  typingUsers: TypingUser[];
}

export default function TypingIndicator({ typingUsers }: TypingIndicatorProps) {
  if (typingUsers.length === 0) return null;

  const getTypingText = () => {
    if (typingUsers.length === 1) {
      return `${typingUsers[0].userName} is typing`;
    } else if (typingUsers.length === 2) {
      return `${typingUsers[0].userName} and ${typingUsers[1].userName} are typing`;
    } else {
      return `${typingUsers.length} people are typing`;
    }
  };

  return (
    <div className="border-t border-gray-100 bg-gray-50 px-4 py-2">
      <div className="flex items-center gap-2">
        {/* Animated dots */}
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="h-2 w-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="h-2 w-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>

        {/* Text */}
        <p className="text-xs font-medium text-gray-600">{getTypingText()}...</p>
      </div>
    </div>
  );
}

