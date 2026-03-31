import { Globe, TrendingUp, FileText, Lightbulb, Code2, Atom } from 'lucide-react';

const suggestions = [
  {
    icon: Globe,
    title: 'World in 24 Hours',
    description: 'Catch up on everything that happened globally today',
    color: '#06b6d4',
  },
  {
    icon: TrendingUp,
    title: 'Market Pulse',
    description: 'Stock market insights, trends, and expert analysis',
    color: '#22c55e',
  },
  {
    icon: Atom,
    title: 'Deep Research',
    description: 'Expert research simplified — complex topics explained',
    color: '#6366f1',
  },
  {
    icon: Code2,
    title: 'Code Assistant',
    description: 'Debug, write, and optimize code in any language',
    color: '#f59e0b',
  },
  {
    icon: Lightbulb,
    title: 'Brainstorm Ideas',
    description: 'Creative ideas for your business, project, or passion',
    color: '#ec4899',
  },
  {
    icon: FileText,
    title: 'Document Writer',
    description: 'Create reports, emails, and professional content',
    color: '#a855f7',
  },
];

export default function SuggestionCards({ onSuggestionClick }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
      gap: '8px',
    }}>
      {suggestions.map((s, i) => {
        const Icon = s.icon;
        return (
          <button
            key={i}
            id={`suggestion-${i}`}
            onClick={() => onSuggestionClick?.(s.title)}
            style={{
              display: 'flex', alignItems: 'flex-start', gap: '12px',
              padding: '14px 16px',
              borderRadius: '10px',
              background: '#18181f',
              border: '1px solid #2a2a35',
              cursor: 'pointer', textAlign: 'left',
              transition: 'background 0.12s ease, border-color 0.12s ease',
              animationDelay: `${i * 45}ms`,
              animation: 'fade-up 0.35s ease forwards',
              opacity: 0,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#1e1e27';
              e.currentTarget.style.borderColor = '#3a3a48';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#18181f';
              e.currentTarget.style.borderColor = '#2a2a35';
            }}
          >
            {/* Icon */}
            <div style={{
              width: '34px', height: '34px', borderRadius: '8px',
              background: s.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Icon style={{ width: '16px', height: '16px', color: '#fff' }} />
            </div>

            {/* Text */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{
                fontSize: '13px', fontWeight: 600,
                color: '#e4e4e7',
                fontFamily: 'Inter, sans-serif',
                marginBottom: '3px',
                letterSpacing: '-0.01em',
              }}>
                {s.title}
              </h3>
              <p style={{
                fontSize: '11.5px', color: '#52525b',
                lineHeight: 1.5, fontFamily: 'Inter, sans-serif',
              }}>
                {s.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
