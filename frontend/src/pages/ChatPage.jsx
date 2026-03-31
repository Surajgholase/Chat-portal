import { useState, useRef, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';
import SuggestionCards from '../components/chat/SuggestionCards';
import ChatInput from '../components/chat/ChatInput';
import { Bot, Copy, ThumbsUp, ThumbsDown, RotateCcw, Zap, WifiOff, RefreshCw } from 'lucide-react';
import { startConversation, sendMessage } from '../services/api';

/* ─── Service Banner ─────────────────────────────────── */
function ServiceUnavailableBanner({ onRetry }) {
  const [retrying, setRetrying] = useState(false);
  const handleRetry = async () => {
    setRetrying(true);
    await new Promise(r => setTimeout(r, 1500));
    setRetrying(false);
    onRetry?.();
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '10px',
      padding: '9px 12px', borderRadius: '9px', marginBottom: '10px',
      background: '#1a1010',
      border: '1px solid rgba(239,68,68,0.25)',
    }}>
      <div style={{
        width: '28px', height: '28px', borderRadius: '7px',
        background: 'rgba(239,68,68,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        position: 'relative',
      }}>
        <WifiOff style={{ width: '13px', height: '13px', color: '#ef4444' }} />
        <span style={{
          position: 'absolute', top: '-2px', right: '-2px',
          width: '7px', height: '7px', borderRadius: '50%',
          background: '#ef4444',
          animation: 'pulseDot 1.8s ease-in-out infinite',
        }} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: '12.5px', fontWeight: 600, color: '#fca5a5', fontFamily: 'Inter, sans-serif', letterSpacing: '-0.01em' }}>
          AI service not available right now
        </p>
        <p style={{ fontSize: '11px', color: '#7f3535', fontFamily: 'Inter, sans-serif', marginTop: '1px' }}>
          Messages will be sent once reconnected.
        </p>
      </div>

      <button
        id="retry-service-btn"
        onClick={handleRetry}
        disabled={retrying}
        style={{
          flexShrink: 0, display: 'flex', alignItems: 'center', gap: '4px',
          padding: '5px 9px', borderRadius: '6px',
          border: '1px solid rgba(239,68,68,0.22)',
          background: 'rgba(239,68,68,0.08)',
          cursor: retrying ? 'not-allowed' : 'pointer',
          color: '#fca5a5', fontSize: '11.5px', fontWeight: 500,
          fontFamily: 'Inter, sans-serif', opacity: retrying ? 0.6 : 1,
          transition: 'background 0.1s ease',
        }}
        onMouseEnter={e => { if (!retrying) e.currentTarget.style.background = 'rgba(239,68,68,0.14)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
      >
        <RefreshCw style={{ width: '11px', height: '11px', animation: retrying ? 'spin 0.65s linear infinite' : 'none' }} />
        {retrying ? 'Retrying…' : 'Retry'}
      </button>
    </div>
  );
}

/* ─── Typing Indicator ────────────────────────────────── */
function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }} className="animate-fade-up">
      <div style={{
        width: '28px', height: '28px', borderRadius: '7px',
        background: '#6366f1',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Bot style={{ width: '13px', height: '13px', color: '#fff' }} />
      </div>
      <div style={{
        padding: '10px 14px', borderRadius: '4px 10px 10px 10px',
        background: '#18181f', border: '1px solid #2a2a35',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {[0, 1, 2].map(i => (
            <div key={i} className="typing-dot" style={{
              width: '5px', height: '5px', borderRadius: '50%',
              background: '#6366f1', animationDelay: `${i * 0.18}s`,
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Message Bubble ──────────────────────────────────── */
function MessageBubble({ message, isLatest }) {
  const [copied, setCopied] = useState(false);
  const [liked,  setLiked]  = useState(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const actionBtn = (id, onClick, title, Icon, active, activeColor) => (
    <button
      id={id}
      onClick={onClick}
      title={title}
      style={{
        display: 'flex', alignItems: 'center', gap: '3px',
        padding: '4px 6px', borderRadius: '5px', border: 'none',
        background: 'transparent',
        color: active ? activeColor : '#3f3f46',
        cursor: 'pointer', fontSize: '11px',
        fontFamily: 'Inter, sans-serif',
        transition: 'background 0.1s ease, color 0.1s ease',
      }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.background = '#1e1e27'; e.currentTarget.style.color = '#71717a'; } }}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#3f3f46'; } }}
    >
      <Icon style={{ width: '12px', height: '12px' }} />
      {id === 'copy-btn' && copied && <span>Copied</span>}
    </button>
  );

  if (message.sender === 'user') {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end' }} className="animate-fade-up">
        <div style={{
          background: '#6366f1',
          color: '#fff',
          borderRadius: '16px 16px 4px 16px',
          padding: '10px 14px',
          maxWidth: '68%',
          fontSize: '14px', lineHeight: '1.65',
          fontFamily: 'Inter, sans-serif',
          wordBreak: 'break-word', letterSpacing: '-0.01em',
        }}>
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }} className="animate-fade-up">
      {/* Bot avatar */}
      <div style={{
        width: '28px', height: '28px', borderRadius: '7px',
        background: '#6366f1',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, marginTop: '2px',
      }}>
        <Bot style={{ width: '13px', height: '13px', color: '#fff' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '76%' }}>
        <div style={{
          background: '#18181f',
          border: '1px solid #2a2a35',
          borderRadius: '4px 16px 16px 16px',
          padding: '11px 14px',
          fontSize: '14px', lineHeight: 1.75,
          color: '#d4d4d8',
          fontFamily: 'Inter, sans-serif',
          wordBreak: 'break-word', whiteSpace: 'pre-wrap',
          letterSpacing: '-0.01em',
        }}>
          {message.content}
        </div>

        {isLatest && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1px', paddingLeft: '2px' }}>
            {actionBtn('copy-btn',    handleCopy,                     copied ? 'Copied!' : 'Copy',       Copy,      copied,           '#22c55e')}
            {actionBtn('like-btn',    () => setLiked(l => l==='up'   ? null : 'up'),   'Helpful',       ThumbsUp,  liked==='up',     '#22c55e')}
            {actionBtn('dislike-btn', () => setLiked(l => l==='down' ? null : 'down'), 'Not helpful',   ThumbsDown, liked==='down',  '#ef4444')}
            {actionBtn('retry-btn',   null,                           'Retry',           RotateCcw,  false,            '#71717a')}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Welcome Screen ──────────────────────────────────── */
function WelcomeScreen({ onSuggestionClick }) {
  return (
    <div style={{
      height: '100%', overflowY: 'auto',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '56px 24px 28px',
    }}>
      {/* Greeting */}
      <div className="animate-fade-up" style={{ textAlign: 'center', marginBottom: '44px', maxWidth: '520px' }}>

        {/* Icon */}
        <div style={{
          width: '56px', height: '56px', borderRadius: '14px',
          background: '#6366f1',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 22px',
        }}>
          <Zap style={{ width: '24px', height: '24px', color: '#fff', fill: '#fff' }} />
        </div>

        <h1 style={{
          fontSize: 'clamp(1.9rem, 4.5vw, 2.9rem)',
          fontWeight: 800,
          lineHeight: 1.1,
          marginBottom: '10px',
          fontFamily: 'Outfit, sans-serif',
          letterSpacing: '-0.04em',
          color: '#f4f4f5',
        }}>
          Hello, <span style={{ color: '#6366f1' }}>Marcus</span>
        </h1>

        <p style={{
          fontSize: 'clamp(0.9rem, 2vw, 1.05rem)',
          color: '#52525b',
          fontFamily: 'Inter, sans-serif',
          letterSpacing: '-0.01em',
        }}>
          What can I help you with today?
        </p>
      </div>

      {/* Cards */}
      <div
        className="animate-fade-up"
        style={{ width: '100%', maxWidth: '820px', animationDelay: '0.08s', opacity: 0 }}
      >
        <p style={{
          fontSize: '10px', fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '0.1em',
          textAlign: 'center', color: '#3f3f46',
          marginBottom: '12px', fontFamily: 'Inter, sans-serif',
        }}>
          Popular Topics
        </p>
        <SuggestionCards onSuggestionClick={onSuggestionClick} />
      </div>
    </div>
  );
}

/* ─── Main ChatPage ───────────────────────────────────── */
export default function ChatPage() {
  const [sidebarOpen,     setSidebarOpen]     = useState(false);
  const [messages,        setMessages]        = useState([]);
  const [isTyping,        setIsTyping]        = useState(false);
  const [conversationId,  setConversationId]  = useState(null);
  const [serviceAvailable,setServiceAvailable]= useState(true);
  const messagesEndRef = useRef(null);
  const hasMsgs = messages.length > 0;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async text => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', content: text }]);
    setIsTyping(true);

    try {
      let convId = conversationId;
      if (!convId) {
        try {
          const conv = await startConversation({ title: text.slice(0, 50) });
          convId = conv.id; setConversationId(convId);
        } catch { convId = null; }
      }

      let aiResponse;
      try {
        const res = await sendMessage({ conversation_id: convId, content: text, sender: 'user' });
        aiResponse = res.response || res.ai_message?.content || res.message || "I received your message.";
      } catch {
        aiResponse = "I'm having trouble connecting to the server. Please check if the backend is running.";
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', content: aiResponse }]);
    } catch {
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', content: 'Something went wrong. Please try again.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleNewChat = () => { setMessages([]); setConversationId(null); setSidebarOpen(false); };

  return (
    <div style={{ position: 'relative', display: 'flex', height: '100vh', overflow: 'hidden', background: '#111116' }}>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} onNewChat={handleNewChat} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100vh', overflow: 'hidden' }}>

        {/* TopBar */}
        <div style={{ flexShrink: 0 }}>
          <TopBar onMenuClick={() => setSidebarOpen(v => !v)} />
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', minHeight: 0 }}>
          {!hasMsgs ? (
            <WelcomeScreen onSuggestionClick={title => handleSend(`Tell me about: ${title}`)} />
          ) : (
            <div style={{
              maxWidth: '720px', width: '100%', margin: '0 auto',
              padding: '28px 24px 8px',
              display: 'flex', flexDirection: 'column', gap: '16px',
            }}>
              {messages.map((msg, i) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  isLatest={msg.sender === 'ai' && i === messages.length - 1}
                />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} style={{ height: '1px' }} />
            </div>
          )}
        </div>

        {/* Input bar */}
        <div style={{
          flexShrink: 0,
          padding: '10px 24px 20px',
          background: '#111116',
          borderTop: hasMsgs ? '1px solid #1e1e28' : 'none',
        }}>
          <div style={{ maxWidth: '720px', margin: '0 auto' }}>
            {!serviceAvailable && (
              <ServiceUnavailableBanner onRetry={() => setServiceAvailable(true)} />
            )}
            <div style={{ position: 'relative' }}>
              <ChatInput onSend={handleSend} isLoading={isTyping || !serviceAvailable} />
              {!serviceAvailable && (
                <div style={{ position: 'absolute', inset: 0, borderRadius: '12px', cursor: 'not-allowed', zIndex: 5 }} />
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin       { to { transform: rotate(360deg); } }
        @keyframes pulseDot   {
          0%   { box-shadow: 0 0 0 0 rgba(239,68,68,0.5); }
          70%  { box-shadow: 0 0 0 5px rgba(239,68,68,0); }
          100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); }
        }
      `}</style>
    </div>
  );
}
