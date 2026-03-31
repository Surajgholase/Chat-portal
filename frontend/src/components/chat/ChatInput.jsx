import { ArrowUp, Paperclip, Mic, Globe } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function ChatInput({ onSend, isLoading }) {
  const [message, setMessage] = useState('');
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
    }
  }, [message]);

  const handleSubmit = () => {
    const trimmed = message.trim();
    if (trimmed && !isLoading) {
      onSend?.(trimmed);
      setMessage('');
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
  };

  const hasMsg = message.trim().length > 0;

  const smallBtn = (id, title, hoverColor, children) => (
    <button
      id={id}
      type="button"
      title={title}
      style={{
        width: '32px', height: '32px', borderRadius: '7px', border: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'transparent', color: '#52525b',
        cursor: 'pointer', flexShrink: 0,
        transition: 'background 0.1s ease, color 0.1s ease',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = '#1e1e27'; e.currentTarget.style.color = hoverColor; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#52525b'; }}
    >
      {children}
    </button>
  );

  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'flex-end', gap: '6px',
        padding: '6px 6px 6px 12px',
        borderRadius: '12px',
        background: '#18181f',
        border: `1px solid ${focused ? '#6366f1' : '#2a2a35'}`,
        transition: 'border-color 0.15s ease',
        boxShadow: focused ? '0 0 0 3px rgba(99,102,241,0.12)' : 'none',
      }}>
        {/* Attach */}
        {smallBtn('attach-btn', 'Attach file', '#a1a1aa',
          <Paperclip style={{ width: '14px', height: '14px' }} />
        )}

        {/* Textarea */}
        <textarea
          id="chat-textarea"
          ref={textareaRef}
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Ask anything…"
          rows={1}
          disabled={isLoading}
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            resize: 'none', color: '#e4e4e7', fontSize: '14px',
            fontFamily: 'Inter, sans-serif', lineHeight: '1.6',
            padding: '7px 0', minHeight: '36px', maxHeight: '180px',
            overflowY: 'auto', letterSpacing: '-0.01em',
          }}
        />

        {/* Right icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
          {smallBtn('web-search-btn', 'Web search', '#06b6d4',
            <Globe style={{ width: '14px', height: '14px' }} />
          )}
          {smallBtn('mic-btn', 'Voice input', '#a855f7',
            <Mic style={{ width: '14px', height: '14px' }} />
          )}

          {/* Send */}
          <button
            id="send-btn"
            type="button"
            onClick={handleSubmit}
            disabled={!hasMsg || isLoading}
            title="Send (Enter)"
            style={{
              width: '34px', height: '34px', borderRadius: '8px', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: hasMsg ? '#6366f1' : '#1e1e27',
              color: '#fff',
              opacity: (!hasMsg || isLoading) ? 0.45 : 1,
              cursor: hasMsg && !isLoading ? 'pointer' : 'not-allowed',
              transition: 'background 0.15s ease, opacity 0.15s ease',
              flexShrink: 0,
            }}
            onMouseEnter={e => { if (hasMsg && !isLoading) e.currentTarget.style.background = '#5558e8'; }}
            onMouseLeave={e => { e.currentTarget.style.background = hasMsg ? '#6366f1' : '#1e1e27'; }}
          >
            {isLoading ? (
              <div style={{
                width: '14px', height: '14px',
                border: '2px solid rgba(255,255,255,0.2)',
                borderTopColor: '#fff',
                borderRadius: '50%',
                animation: 'spin 0.65s linear infinite',
              }} />
            ) : (
              <ArrowUp style={{ width: '14px', height: '14px' }} />
            )}
          </button>
        </div>
      </div>

      {/* Hint */}
      <p style={{
        textAlign: 'center', fontSize: '11px', color: '#3f3f46',
        marginTop: '7px', fontFamily: 'Inter, sans-serif',
      }}>
        Valerio.ai can make mistakes — verify important information.
      </p>
    </div>
  );
}
