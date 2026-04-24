// Grapplers — mobile app shell (tab bar) + global app state

const { useState, useEffect, useRef, useMemo } = React;

// Global app store — shared between the two phone frames (student + athlete)
const GStore = (() => {
  const defaults = {
    endorsements: [
      { from: 'a03', to: 'a01', note: 'Rolled with Grimy at B-Team. He took my crucifix framework and made it something I hadn\'t seen. High Ground is the real deal.', date: 'APR 18 · 2026', serial: 'GRP-0028-ENDR' },
      { from: 'a02', to: 'a01', note: 'My brother. Minot State mats to Colorado. If you want to learn the High Ground, there is only one person to learn it from.', date: 'APR 12 · 2026', serial: 'GRP-0019-ENDR' },
      { from: 'a04', to: 'a01', note: 'Top pressure, wrestling entries, and the crucifix — train with him weekly. He pushes the whole room.', date: 'MAR 28 · 2026', serial: 'GRP-0014-ENDR' },
      { from: 'a01', to: 'a02', note: 'Trick brings wrestling that actually translates. Front headlock series is a cheat code.', date: 'MAR 22 · 2026', serial: 'GRP-0011-ENDR' },
    ],
    purchased: new Set(['i03']),
    bookings: [],
    followedAthletes: new Set(['a01', 'a03']),
    likedPosts: new Set(),
  };
  let state = defaults;
  const listeners = new Set();
  return {
    get: () => state,
    set: (mut) => {
      const next = typeof mut === 'function' ? mut(state) : { ...state, ...mut };
      state = { ...state, ...next };
      listeners.forEach(l => l(state));
    },
    subscribe: (l) => { listeners.add(l); return () => listeners.delete(l); },
  };
})();
window.GStore = GStore;
window.useGStore = function useGStore() {
  const [s, setS] = useState(GStore.get());
  useEffect(() => GStore.subscribe(setS), []);
  return s;
};

// Bottom tab bar — iOS style, but dark-glass
function GTabBar({ tabs, active, onChange }) {
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 40,
      padding: '8px 10px 28px',
      background: 'linear-gradient(180deg, rgba(10,11,13,0) 0%, rgba(10,11,13,0.92) 40%, var(--g-carbon) 100%)',
      backdropFilter: 'blur(18px)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-around',
        background: 'rgba(22,24,28,0.92)',
        border: '1px solid var(--g-border)',
        borderRadius: 'var(--g-r-pill)',
        padding: '6px 8px',
        boxShadow: 'var(--g-shadow-lg), inset 0 1px 0 rgba(255,255,255,0.06)',
      }}>
        {tabs.map(t => {
          const on = active === t.id;
          return (
            <button key={t.id} onClick={() => onChange(t.id)} className="g-nosel" style={{
              flex: 1, height: 44, border: 'none', background: 'transparent',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 2, color: on ? 'var(--g-fg-1)' : 'var(--g-fg-3)', cursor: 'pointer',
              position: 'relative',
            }}>
              <span style={{ fontSize: 18, lineHeight: 1, color: on ? 'var(--g-mat-hi)' : 'var(--g-fg-3)' }}>{t.icon}</span>
              <span style={{
                fontFamily: 'var(--g-display)', fontSize: 9, fontWeight: 600,
                letterSpacing: '0.14em', textTransform: 'uppercase',
              }}>{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Generic header bar for app screens — subtle, dark
function GHeader({ title, eyebrow, right, onBack, style = {} }) {
  return (
    <div style={{
      padding: '56px 18px 14px',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
      gap: 12, ...style,
    }}>
      <div style={{ minWidth: 0 }}>
        {eyebrow && <div className="g-eyebrow" style={{ marginBottom: 6 }}>{eyebrow}</div>}
        <div className="g-condensed" style={{
          fontSize: 38, color: 'var(--g-fg-1)',
          fontWeight: 800, lineHeight: 0.95,
        }}>{title}</div>
      </div>
      {right}
    </div>
  );
}

// Card frame used across feed/profile/etc
function GCard({ children, style = {}, onClick, noPad = false }) {
  return (
    <div onClick={onClick} style={{
      background: 'var(--g-graphite)',
      border: '1px solid var(--g-border)',
      borderRadius: 'var(--g-r-xl)',
      padding: noPad ? 0 : 16,
      overflow: 'hidden',
      cursor: onClick ? 'pointer' : 'default',
      ...style,
    }}>{children}</div>
  );
}

// Phone shell — dark-mode iOS frame with our content
function GPhone({ children, width = 360, height = 740, label, role }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div style={{
        width, height, borderRadius: 44, overflow: 'hidden',
        position: 'relative', background: 'var(--g-carbon)',
        boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08), 0 0 0 8px #111',
        fontFamily: 'var(--g-sans)',
      }}>
        {/* dynamic island */}
        <div style={{
          position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
          width: 110, height: 32, borderRadius: 22, background: '#000', zIndex: 50,
        }} />
        {/* status bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 45,
          height: 48, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 24px 0', pointerEvents: 'none',
        }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>9:41</div>
          <div style={{ display: 'flex', gap: 5, alignItems: 'center', color: '#fff', fontSize: 11 }}>
            <svg width="16" height="10" viewBox="0 0 19 12"><rect x="0" y="7.5" width="3" height="4.5" rx="0.7" fill="#fff"/><rect x="4.5" y="5" width="3" height="7" rx="0.7" fill="#fff"/><rect x="9" y="2.5" width="3" height="9.5" rx="0.7" fill="#fff"/><rect x="13.5" y="0" width="3" height="12" rx="0.7" fill="#fff"/></svg>
            <svg width="14" height="10" viewBox="0 0 17 12"><path d="M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2Z" fill="#fff"/><circle cx="8.5" cy="10.5" r="1.5" fill="#fff"/></svg>
            <div style={{ width: 24, height: 11, border: '1px solid #fff', borderRadius: 3, padding: 1 }}>
              <div style={{ width: '85%', height: '100%', background: '#fff', borderRadius: 1 }} />
            </div>
          </div>
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'var(--g-carbon)' }}>
          {children}
        </div>
        {/* home indicator */}
        <div style={{
          position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
          width: 134, height: 5, borderRadius: 100, background: 'rgba(255,255,255,0.55)', zIndex: 60,
        }} />
      </div>
      {label && (
        <div style={{ textAlign: 'center' }}>
          <div className="g-eyebrow" style={{ fontSize: 10, color: 'var(--g-fg-3)' }}>
            {role && <span style={{ color: 'var(--g-mat-hi)' }}>{role} · </span>}{label}
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { GTabBar, GHeader, GCard, GPhone });
