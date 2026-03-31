import { Menu, ChevronDown, Bell, Settings, LogOut, User, Zap } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const models = [
  { name: 'Valerio V 1.2', tag: 'Latest' },
  { name: 'Valerio V 1.1', tag: null },
  { name: 'Valerio V 1.0', tag: 'Legacy' },
];

export default function TopBar({ onMenuClick }) {
  const [modelOpen,   setModelOpen]   = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [selected,    setSelected]    = useState(models[0].name);
  const modelRef   = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handler = e => {
      if (modelRef.current   && !modelRef.current.contains(e.target))   setModelOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const dropdownBase = {
    position: 'absolute', top: 'calc(100% + 6px)', zIndex: 100,
    borderRadius: '10px', overflow: 'hidden',
    background: '#13131a',
    border: '1px solid #2a2a35',
    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    animation: 'ddFade 0.12s ease',
  };

  const iconBtn = (id, onClick, title, children) => (
    <button
      id={id}
      onClick={onClick}
      title={title}
      style={{
        width: '32px', height: '32px', borderRadius: '7px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#18181f', border: '1px solid #2a2a35',
        color: '#52525b', cursor: 'pointer',
        transition: 'background 0.12s ease, color 0.12s ease',
        flexShrink: 0,
      }}
      onMouseEnter={e => { e.currentTarget.style.background = '#222230'; e.currentTarget.style.color = '#a1a1aa'; }}
      onMouseLeave={e => { e.currentTarget.style.background = '#18181f'; e.currentTarget.style.color = '#52525b'; }}
    >
      {children}
    </button>
  );

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 16px', height: '52px', flexShrink: 0,
      background: '#0e0e14',
      borderBottom: '1px solid #1e1e28',
      position: 'relative', zIndex: 20,
    }}>

      {/* ── Left ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

        {/* Hamburger */}
        {iconBtn('mobile-menu-btn', onMenuClick, 'Toggle sidebar',
          <Menu style={{ width: '15px', height: '15px' }} />
        )}

        {/* Divider */}
        <div style={{ width: '1px', height: '18px', background: '#2a2a35' }} />

        {/* Model selector */}
        <div style={{ position: 'relative' }} ref={modelRef}>
          <button
            id="model-selector-btn"
            onClick={() => setModelOpen(v => !v)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '5px 10px', borderRadius: '7px',
              background: '#18181f', border: '1px solid #2a2a35',
              color: '#a1a1aa', fontSize: '12.5px', fontWeight: 500,
              cursor: 'pointer', transition: 'background 0.12s ease',
              fontFamily: 'Inter, sans-serif', letterSpacing: '-0.01em',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#222230'}
            onMouseLeave={e => e.currentTarget.style.background = '#18181f'}
          >
            <div style={{
              width: '16px', height: '16px', borderRadius: '4px',
              background: '#6366f1',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Zap style={{ width: '9px', height: '9px', color: '#fff', fill: '#fff' }} />
            </div>
            <span style={{ color: '#d4d4d8' }}>{selected}</span>
            <ChevronDown style={{
              width: '12px', height: '12px', color: '#52525b',
              transform: modelOpen ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.15s ease',
            }} />
          </button>

          {modelOpen && (
            <div style={{ ...dropdownBase, left: 0, minWidth: '196px' }}>
              <div style={{ padding: '8px 12px 6px', borderBottom: '1px solid #2a2a35' }}>
                <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#3f3f46' }}>
                  Model
                </p>
              </div>
              {models.map((m, i) => (
                <button
                  key={m.name}
                  id={`model-option-${i}`}
                  onClick={() => { setSelected(m.name); setModelOpen(false); }}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '8px 12px', border: 'none', cursor: 'pointer',
                    background: selected === m.name ? '#1e1e2e' : 'transparent',
                    color: selected === m.name ? '#a5b4fc' : '#71717a',
                    fontSize: '12.5px', fontFamily: 'Inter, sans-serif',
                    transition: 'background 0.1s ease',
                  }}
                  onMouseEnter={e => { if (selected !== m.name) e.currentTarget.style.background = '#18181f'; }}
                  onMouseLeave={e => { if (selected !== m.name) e.currentTarget.style.background = 'transparent'; }}
                >
                  <span style={{ fontWeight: selected === m.name ? 600 : 400 }}>{m.name}</span>
                  {m.tag && (
                    <span style={{
                      fontSize: '10px', fontWeight: 600, padding: '1px 5px',
                      borderRadius: '4px',
                      background: m.tag === 'Latest' ? 'rgba(34,197,94,0.12)' : '#1e1e28',
                      color: m.tag === 'Latest' ? '#22c55e' : '#52525b',
                      border: m.tag === 'Latest' ? '1px solid rgba(34,197,94,0.2)' : '1px solid #2a2a35',
                    }}>
                      {m.tag}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Right ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>

        {/* Bell */}
        <div style={{ position: 'relative' }}>
          {iconBtn('notification-btn', null, 'Notifications',
            <Bell style={{ width: '14px', height: '14px' }} />
          )}
          <span style={{
            position: 'absolute', top: '8px', right: '8px',
            width: '5px', height: '5px', borderRadius: '50%',
            background: '#6366f1',
          }} />
        </div>

        {/* Profile */}
        <div style={{ position: 'relative' }} ref={profileRef}>
          <button
            id="profile-btn"
            onClick={() => setProfileOpen(v => !v)}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '4px 8px 4px 4px', borderRadius: '8px',
              background: '#18181f', border: '1px solid #2a2a35',
              cursor: 'pointer', transition: 'background 0.12s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#222230'}
            onMouseLeave={e => e.currentTarget.style.background = '#18181f'}
          >
            <div style={{
              width: '26px', height: '26px', borderRadius: '6px',
              background: '#6366f1',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: '11px', fontWeight: 700,
            }}>M</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#d4d4d8', fontFamily: 'Inter, sans-serif', lineHeight: 1.3 }}>Marcus A.</span>
              <span style={{ fontSize: '10px', color: '#52525b', fontFamily: 'Inter, sans-serif' }}>Pro Plan</span>
            </div>
            <ChevronDown style={{
              width: '12px', height: '12px', color: '#3f3f46',
              transform: profileOpen ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.15s ease',
            }} />
          </button>

          {profileOpen && (
            <div style={{ ...dropdownBase, right: 0, minWidth: '188px' }}>
              {/* Header */}
              <div style={{ padding: '10px 12px', borderBottom: '1px solid #2a2a35' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '30px', height: '30px', borderRadius: '7px',
                    background: '#6366f1',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: '13px', fontWeight: 700,
                  }}>M</div>
                  <div>
                    <p style={{ fontSize: '12.5px', fontWeight: 600, color: '#f4f4f5', fontFamily: 'Inter, sans-serif' }}>Marcus Aurelius</p>
                    <p style={{ fontSize: '11px', color: '#52525b', fontFamily: 'Inter, sans-serif', marginTop: '1px' }}>Marcaurel@gmail.com</p>
                  </div>
                </div>
              </div>

              {/* Items */}
              {[
                { icon: User,     label: 'Profile',  id: 'menu-profile'  },
                { icon: Settings, label: 'Settings', id: 'menu-settings' },
              ].map(({ icon: Icon, label, id }) => (
                <button key={id} id={id} style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '8px 12px', border: 'none', background: 'transparent',
                  color: '#71717a', fontSize: '12.5px', fontFamily: 'Inter, sans-serif',
                  cursor: 'pointer', transition: 'background 0.1s ease, color 0.1s ease',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#18181f'; e.currentTarget.style.color = '#f4f4f5'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#71717a'; }}
                >
                  <Icon style={{ width: '13px', height: '13px' }} />
                  {label}
                </button>
              ))}

              <div style={{ borderTop: '1px solid #2a2a35' }}>
                <button id="menu-logout" style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '8px 12px', border: 'none', background: 'transparent',
                  color: '#71717a', fontSize: '12.5px', fontFamily: 'Inter, sans-serif',
                  cursor: 'pointer', transition: 'background 0.1s ease, color 0.1s ease',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.06)'; e.currentTarget.style.color = '#ef4444'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#71717a'; }}
                >
                  <LogOut style={{ width: '13px', height: '13px' }} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes ddFade {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
