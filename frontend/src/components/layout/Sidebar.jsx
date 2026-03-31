import { useState } from 'react';
import {
  Search, Compass, Library, FileText, History,
  MessageSquare, X, Plus, Zap, ChevronRight,
} from 'lucide-react';

const navItems = [
  { icon: Compass,  label: 'Explore', id: 'explore' },
  { icon: Library,  label: 'Library', id: 'library' },
  { icon: FileText, label: 'Files',   id: 'files'   },
  { icon: History,  label: 'History', id: 'history'  },
];

const dotColors = ['#6366f1', '#06b6d4', '#ec4899', '#f59e0b'];

const recentChats = [
  { id: 1, title: 'Brainstorming small business ideas', time: '2h ago' },
  { id: 2, title: 'The history of the Roman empire',   time: '5h ago' },
  { id: 3, title: 'Crypto investment strategies',      time: '1d ago' },
  { id: 4, title: 'React performance optimization',    time: '2d ago' },
];

export default function Sidebar({ isOpen, onClose, onNewChat }) {
  const [activeNav, setActiveNav] = useState('explore');
  const [search, setSearch] = useState('');

  const filtered = recentChats.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  /* ── shared button reset ── */
  const base = {
    width: '100%', border: 'none', cursor: 'pointer',
    fontFamily: 'Inter, sans-serif', letterSpacing: '-0.01em',
    textAlign: 'left', transition: 'background 0.12s ease, color 0.12s ease',
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.55)',
            zIndex: 40,
          }}
        />
      )}

      <aside
        style={{
          width: '256px', flexShrink: 0,
          display: 'flex', flexDirection: 'column', height: '100%',
          background: '#0e0e14',
          borderRight: '1px solid #1e1e28',
          position: 'relative', zIndex: 50,
          transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1)',
        }}
        className={isOpen ? '' : 'sidebar-mobile-hidden'}
      >

        {/* ── Logo ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 16px 14px',
          borderBottom: '1px solid #1e1e28',
        }}>
          <div id="sidebar-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '30px', height: '30px', borderRadius: '8px',
              background: '#6366f1',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Zap style={{ width: '14px', height: '14px', color: '#fff', fill: '#fff' }} />
            </div>
            <span style={{
              fontFamily: 'Outfit, sans-serif', fontWeight: 800,
              fontSize: '15px', color: '#f4f4f5', letterSpacing: '-0.03em',
            }}>
              Valerio<span style={{ color: '#6366f1' }}>.ai</span>
            </span>
          </div>

          <button
            id="sidebar-close-btn"
            onClick={onClose}
            className="sidebar-close-desktop-hidden"
            style={{
              width: '28px', height: '28px', borderRadius: '7px', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: '#1e1e28', cursor: 'pointer', color: '#52525b',
              transition: 'background 0.12s ease, color 0.12s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#2a2a35'; e.currentTarget.style.color = '#a1a1aa'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#1e1e28'; e.currentTarget.style.color = '#52525b'; }}
          >
            <X style={{ width: '13px', height: '13px' }} />
          </button>
        </div>

        {/* ── New Chat ── */}
        <div style={{ padding: '12px 12px 8px' }}>
          <button
            id="new-chat-btn"
            onClick={onNewChat}
            style={{
              ...base,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              padding: '9px 0', borderRadius: '8px',
              background: '#6366f1', color: '#fff',
              fontSize: '13px', fontWeight: 600,
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#5558e8'}
            onMouseLeave={e => e.currentTarget.style.background = '#6366f1'}
          >
            <Plus style={{ width: '14px', height: '14px' }} />
            New Chat
          </button>
        </div>

        {/* ── Search ── */}
        <div style={{ padding: '0 12px 10px' }}>
          <div style={{ position: 'relative' }}>
            <Search style={{
              position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)',
              width: '13px', height: '13px', color: '#52525b', pointerEvents: 'none',
            }} />
            <input
              id="sidebar-search"
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search…"
              style={{
                width: '100%', paddingLeft: '30px', paddingRight: '10px',
                paddingTop: '7px', paddingBottom: '7px',
                borderRadius: '7px', background: '#1a1a22',
                border: '1px solid #2a2a35', color: '#f4f4f5',
                fontSize: '12.5px', fontFamily: 'Inter, sans-serif', outline: 'none',
                transition: 'border-color 0.15s ease',
              }}
              onFocus={e => e.target.style.borderColor = '#6366f1'}
              onBlur={e => e.target.style.borderColor = '#2a2a35'}
            />
          </div>
        </div>

        {/* ── Nav ── */}
        <nav style={{ padding: '0 8px 10px', borderBottom: '1px solid #1e1e28' }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const active = activeNav === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => setActiveNav(item.id)}
                style={{
                  ...base,
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '8px 10px', borderRadius: '7px',
                  background: active ? '#1e1e2e' : 'transparent',
                  color: active ? '#a5b4fc' : '#71717a',
                  fontSize: '13px', fontWeight: 500, marginBottom: '1px',
                  border: active ? '1px solid #2a2a45' : '1px solid transparent',
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = '#18181f'; e.currentTarget.style.color = '#a1a1aa'; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#71717a'; } }}
              >
                <Icon style={{ width: '14px', height: '14px', flexShrink: 0 }} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {active && <ChevronRight style={{ width: '12px', height: '12px', opacity: 0.4 }} />}
              </button>
            );
          })}
        </nav>

        {/* ── Recent chats ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 8px', minHeight: 0 }}>
          <p style={{
            fontSize: '10px', fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.1em', color: '#3f3f46',
            padding: '0 6px', marginBottom: '6px',
          }}>Recent</p>

          {filtered.length === 0
            ? <p style={{ fontSize: '12.5px', color: '#3f3f46', padding: '6px' }}>No results</p>
            : filtered.map((chat, i) => (
              <button
                key={chat.id}
                id={`chat-item-${chat.id}`}
                style={{
                  ...base,
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '7px 10px', borderRadius: '7px',
                  background: 'transparent', color: '#71717a', marginBottom: '1px',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#18181f'; e.currentTarget.style.color = '#a1a1aa'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#71717a'; }}
              >
                {/* Colored dot instead of icon box */}
                <span style={{
                  width: '7px', height: '7px', borderRadius: '50%',
                  background: dotColors[i % dotColors.length],
                  flexShrink: 0,
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontSize: '12.5px', fontWeight: 500,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    lineHeight: 1.4,
                  }}>{chat.title}</p>
                  <p style={{ fontSize: '11px', color: '#3f3f46', marginTop: '1px' }}>{chat.time}</p>
                </div>
              </button>
            ))
          }
        </div>

        {/* ── Bottom user card ── */}
        <div style={{ borderTop: '1px solid #1e1e28', padding: '10px 12px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '9px',
            padding: '8px 10px', borderRadius: '8px', background: '#18181f',
            border: '1px solid #2a2a35',
          }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '7px',
              background: '#6366f1',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: '12px', fontWeight: 700, flexShrink: 0,
            }}>M</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '12.5px', fontWeight: 600, color: '#f4f4f5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                Marcus A.
              </p>
              <p style={{ fontSize: '10.5px', color: '#52525b' }}>Pro Plan</p>
            </div>
            <span style={{
              fontSize: '10px', fontWeight: 700, padding: '2px 6px',
              borderRadius: '4px', background: '#1e1e2e',
              color: '#a5b4fc', border: '1px solid #2a2a45',
            }}>PRO</span>
          </div>
        </div>
      </aside>

      <style>{`
        @media (max-width: 1023px) {
          aside {
            position: fixed !important;
            top: 0; left: 0; height: 100% !important;
            transform: ${isOpen ? 'translateX(0)' : 'translateX(-100%)'};
          }
          .sidebar-close-desktop-hidden { display: flex !important; }
        }
        @media (min-width: 1024px) {
          .sidebar-close-desktop-hidden { display: none !important; }
        }
      `}</style>
    </>
  );
}
