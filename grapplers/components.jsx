// Grapplers — shared UI primitives (badges, chrome, buttons)
const G_BELTS = window.G_BELTS;

// The endorsement STAMP — documentary/receipt aesthetic.
// Chrome hairline border, mono serial, date, from-whom.
function EndorsementStamp({ from, date = 'APR 12 · 2026', serial = 'GRP-0014-ENDR', compact = false }) {
  const fromAthlete = typeof from === 'string' ? window.gAthlete(from) : from;
  return (
    <div style={{
      position: 'relative',
      padding: compact ? '8px 10px' : '12px 14px',
      border: '1px solid rgba(255,255,255,0.28)',
      borderRadius: 4,
      background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
      fontFamily: 'var(--g-mono)',
      display: 'flex', alignItems: 'center', gap: 10,
      minWidth: 0,
    }}>
      {/* corner marks */}
      {['tl', 'tr', 'bl', 'br'].map(c => (
        <div key={c} style={{
          position: 'absolute', width: 6, height: 6,
          borderTop: c.includes('t') ? '1px solid rgba(255,255,255,0.5)' : 'none',
          borderBottom: c.includes('b') ? '1px solid rgba(255,255,255,0.5)' : 'none',
          borderLeft: c.includes('l') ? '1px solid rgba(255,255,255,0.5)' : 'none',
          borderRight: c.includes('r') ? '1px solid rgba(255,255,255,0.5)' : 'none',
          top: c.includes('t') ? -1 : 'auto', bottom: c.includes('b') ? -1 : 'auto',
          left: c.includes('l') ? -1 : 'auto', right: c.includes('r') ? -1 : 'auto',
        }} />
      ))}
      <div style={{
        width: compact ? 22 : 28, height: compact ? 22 : 28, flexShrink: 0,
        borderRadius: '50%',
        background: 'var(--g-gradient-chrome)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: compact ? 9 : 11, color: '#1a1a1a', fontWeight: 800, fontFamily: 'var(--g-display)',
        boxShadow: '0 1px 0 rgba(255,255,255,0.3) inset, 0 -1px 0 rgba(0,0,0,0.4) inset',
      }}>◈</div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: compact ? 8 : 9, letterSpacing: '0.16em', color: 'var(--g-fg-3)', textTransform: 'uppercase' }}>
          Endorsed · {date}
        </div>
        <div style={{ fontSize: compact ? 11 : 12, color: 'var(--g-fg-1)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {fromAthlete ? fromAthlete.name : from}
        </div>
        {!compact && (
          <div style={{ fontSize: 9, color: 'var(--g-fg-3)', letterSpacing: '0.1em', marginTop: 2 }}>
            {serial}
          </div>
        )}
      </div>
    </div>
  );
}

// Belt rank chip — actual belt-bar shape with black tip
function BeltChip({ rank = 'black', degree = 0, style = {} }) {
  const belt = G_BELTS[rank] || G_BELTS.black;
  return (
    <div className="g-nosel" style={{
      display: 'inline-flex', alignItems: 'center',
      height: 18, borderRadius: 2,
      fontSize: 10, fontFamily: 'var(--g-display)', fontWeight: 600,
      letterSpacing: '0.12em', textTransform: 'uppercase',
      background: belt.color, color: belt.ink,
      padding: '0 8px', gap: 6, position: 'relative',
      overflow: 'hidden',
      boxShadow: rank === 'white' ? 'inset 0 0 0 1px rgba(0,0,0,0.15)' : 'inset 0 -2px 4px rgba(0,0,0,0.25)',
      ...style,
    }}>
      <span>{belt.label}</span>
      {/* black tip with degree stripes */}
      <span style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: 14,
        background: '#0a0a0a',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
      }}>
        {Array.from({ length: Math.min(degree, 4) }).map((_, i) => (
          <span key={i} style={{ width: 1, height: 10, background: '#ffcc33' }} />
        ))}
      </span>
      <span style={{ width: 14 }} />
    </div>
  );
}

// Verified tick — ND state-outline mark, tiny
function VerifiedMark({ size = 14 }) {
  return (
    <span title="Verified athlete" style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: size, height: size, borderRadius: '50%',
      background: 'var(--g-mat)', color: '#fff', fontSize: size * 0.65, fontWeight: 700,
      boxShadow: '0 0 0 1px rgba(255,255,255,0.15)',
    }}>✓</span>
  );
}

// Primary CTA — oxblood glow retained (marketing heroes), mat blue inside product
function GBtn({ children, variant = 'mat', size = 'md', onClick, disabled, style = {}, icon }) {
  const sizes = {
    sm: { h: 32, px: 14, fs: 12 },
    md: { h: 40, px: 18, fs: 13 },
    lg: { h: 52, px: 24, fs: 14 },
  }[size];
  const variants = {
    mat:    { bg: 'var(--g-mat)',     fg: '#fff', bd: 'none', sh: 'var(--g-shadow-mat)' },
    chrome: { bg: 'var(--g-gradient-chrome)', fg: '#0a0a0a', bd: 'none', sh: 'var(--g-shadow-chrome)' },
    ghost:  { bg: 'transparent', fg: 'var(--g-fg-1)', bd: '1px solid var(--g-border-strong)', sh: 'none' },
    oxblood:{ bg: 'var(--g-oxblood)', fg: '#fff', bd: 'none', sh: '0 8px 24px rgba(184,37,42,0.3)' },
  }[variant];
  return (
    <button onClick={onClick} disabled={disabled} className="g-nosel" style={{
      height: sizes.h, padding: `0 ${sizes.px}px`, fontSize: sizes.fs,
      fontFamily: 'var(--g-display)', fontWeight: 600, letterSpacing: '0.02em',
      background: variants.bg, color: variants.fg, border: variants.bd,
      borderRadius: 'var(--g-r-pill)', boxShadow: variants.sh,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1,
      transition: 'transform 120ms ease, box-shadow 180ms ease, filter 180ms ease',
      ...style,
    }}
    onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
    onMouseUp={e => e.currentTarget.style.transform = 'none'}
    onMouseLeave={e => e.currentTarget.style.transform = 'none'}
    >
      {icon && <span style={{ fontSize: sizes.fs + 2, lineHeight: 1 }}>{icon}</span>}
      {children}
    </button>
  );
}

// Tech eyebrow
function GEyebrow({ children, style = {} }) {
  return <div className="g-eyebrow" style={style}>{children}</div>;
}

// Small avatar with mat-blue ring
function GAvatar({ athlete, size = 40, showRing = false }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: window.gPlaceholder(athlete.id),
      flexShrink: 0, position: 'relative',
      boxShadow: showRing ? '0 0 0 2px var(--g-mat), 0 0 0 4px var(--g-carbon)' : 'none',
      overflow: 'hidden',
    }}>
      {/* silhouette initials */}
      <div style={{
        position: 'absolute', inset: 0, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--g-condensed)', fontWeight: 800,
        fontSize: size * 0.4, color: 'rgba(255,255,255,0.35)',
        letterSpacing: '-0.02em',
      }}>
        {athlete.name.split(' ').map(n => n[0]).slice(0,2).join('')}
      </div>
    </div>
  );
}

// Wordmark — chrome "GRAPPLERS" in Barlow Condensed
function GWordmark({ size = 28, style = {} }) {
  return (
    <span className="g-condensed g-chrome-fill" style={{ fontSize: size, letterSpacing: '-0.01em', ...style }}>
      GRAPPLERS
    </span>
  );
}

Object.assign(window, {
  EndorsementStamp, BeltChip, VerifiedMark, GBtn, GEyebrow, GAvatar, GWordmark,
});
