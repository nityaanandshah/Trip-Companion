'use client';

import { useState, useRef, KeyboardEvent, ChangeEvent } from 'react';

interface MessageInputProps {
  onSendMessage: (content: string) => Promise<void>;
  onTyping: (isTyping: boolean) => void;
  disabled?: boolean;
}

export default function MessageInput({
  onSendMessage,
  onTyping,
  disabled = false,
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const maxLength = 1000;
  const charactersLeft = maxLength - message.length;

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setMessage(value);

      // Trigger typing indicator
      if (value.length > 0) {
        onTyping(true);

        // Clear previous timeout
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        // Stop typing after 2 seconds of inactivity
        typingTimeoutRef.current = setTimeout(() => {
          onTyping(false);
        }, 2000);
      } else {
        onTyping(false);
      }
    }
  };

  const handleSend = async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || isSending || disabled) return;

    setIsSending(true);
    onTyping(false);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    try {
      await onSendMessage(trimmedMessage);
      setMessage('');
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  return (
    <div 
      className="p-3" 
      style={{ 
        borderTop: '1px solid #d4c7ad', 
        backgroundColor: 'white' 
      }}
    >
      <div className="flex items-end gap-2">
        {/* Textarea */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            placeholder={disabled ? 'Chat unavailable' : 'Type a message...'}
            disabled={disabled || isSending}
            rows={1}
            className="w-full resize-none px-4 py-2.5 text-sm transition-colors focus:outline-none"
            style={{ 
              maxHeight: '120px',
              border: '2px solid #d4c7ad',
              borderRadius: '2px',
              color: '#33353B',
              cursor: (disabled || isSending) ? 'not-allowed' : 'text',
              backgroundColor: (disabled || isSending) ? '#F5EFE3' : 'white'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = '#DAAA63'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#d4c7ad'}
          />

          {/* Character counter */}
          {message.length > maxLength * 0.8 && (
            <div
              className="absolute bottom-1 right-2 text-xs font-medium"
              style={{ color: charactersLeft < 50 ? '#C76D45' : 'rgba(51, 53, 59, 0.5)' }}
            >
              {charactersLeft}
            </div>
          )}
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!message.trim() || isSending || disabled}
          className="flex-shrink-0 p-2.5 text-white transition-all"
          style={{
            borderRadius: '2px',
            backgroundColor: (!message.trim() || isSending || disabled) 
              ? 'rgba(51, 53, 59, 0.3)' 
              : '#C76D45',
            cursor: (!message.trim() || isSending || disabled) ? 'not-allowed' : 'pointer'
          }}
          onMouseEnter={(e) => {
            if (!(!message.trim() || isSending || disabled)) {
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none';
          }}
          title="Send message (Enter)"
        >
          {isSending ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Helper text */}
      <p className="mt-1.5 px-1 text-xs" style={{ color: 'rgba(51, 53, 59, 0.5)' }}>
        Press <kbd 
          className="px-1.5 py-0.5 font-mono" 
          style={{ borderRadius: '2px', backgroundColor: 'rgba(51, 53, 59, 0.1)' }}
        >Enter</kbd> to
        send, <kbd 
          className="px-1.5 py-0.5 font-mono" 
          style={{ borderRadius: '2px', backgroundColor: 'rgba(51, 53, 59, 0.1)' }}
        >Shift+Enter</kbd>{' '}
        for new line
      </p>
    </div>
  );
}

