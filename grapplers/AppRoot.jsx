// Grapplers — AppRoot. The real app shell:
//   marketing → onboarding → live app (student or athlete role)
// Responsive: full-screen on mobile, phone frame on desktop (beside a dark stage).
// Persists store (purchases, endorsements, follows, likes, bookings, messages) to localStorage.
// Broadcasts across tabs via 'storage' events.

const LS_KEY = 'grapplers.v1';
const LS_ROUTE = 'grapplers.route';

// ---- Persistence bridge over GStore ---------------------------------------
function serialize(s) {
  return {
    endorsements: s.endorsements,
    purchased: Array.from(s.purchased),
    bookings: s.bookings,
    followedAthletes: Array.from(s.followedAthletes),
    likedPosts: Array.from(s.likedPosts),
    threadMessages: s.threadMessages || {},
    notificationsEnabled: s.notificationsEnabled !== false,
  };
}
function hydrate(raw) {
  if (!raw) return null;
  try {
    const j = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return {
      endorsements: j.endorsements || [],
      purchased: new Set(j.purchased || []),
      bookings: j.bookings || [],
      followedAthletes: new Set(j.followedAthletes || []),
      likedPosts: new Set(j.likedPosts || []),
      threadMessages: j.threadMessages || {},
      notificationsEnabled: j.notificationsEnabled !== false,
    };
  } catch (e) { return null; }
}

(function installPersistence() {
  // Seed: extend defaults with thread messages + notif flag, then overlay persisted
  const seed = window.GStore.get();
  window.GStore.set({
    threadMessages: seed.threadMessages || {},
    notificationsEnabled: seed.notificationsEnabled !== false,
  });
  const persisted = hydrate(localStorage.getItem(LS_KEY));
  if (persisted) window.GStore.set(persisted);
  // Write-through
  window.GStore.subscribe((s) => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(serialize(s))); } catch (e) {}
  });
  // Cross-tab sync
  window.addEventListener('storage', (e) => {
    if (e.key === LS_KEY && e.newValue) {
      const next = hydrate(e.newValue);
      if (next) window.GStore.set(next);
    }
  });
})();

// ---- Toast (imperative helper) --------------------------------------------
window.gToast = (msg) => {
  const n = document.createElement('div');
  n.className = 'g-toast';
  n.textContent = msg;
  document.body.appendChild(n);
  setTimeout(() => n.remove(), 2400);
};

// ---- Responsive phone — fills viewport on mobile, frame on desktop --------
function ResponsivePhone({ children, role, onExit }) {
  const [wide, setWide] = React.useState(typeof window !== 'undefined' && window.matchMedia('(min-width: 900px)').matches);
  React.useEffect(() => {
    const mq = window.matchMedia('(min-width: 900px)');
    const on = () => setWide(mq.matches);
    mq.addEventListener ? mq.addEventListener('change', on) : mq.addListener(on);
    return () => mq.removeEventListener ? mq.removeEventListener('change', on) : mq.removeListener(on);
  }, []);

  if (!wide) {
    // Mobile/tablet: fill viewport; no chrome.
    return (
      <div style={{
        position: 'fixed', inset: 0, background: 'var(--g-carbon)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>{children}</div>
      </div>
    );
  }

  // Desktop: phone frame on a dark stage with ambient glow + role chip.
  return (
    <div className="gx-stage" style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 24px',
      background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(30,111,255,0.08), transparent 70%), var(--g-carbon)',
      gap: 40, flexWrap: 'wrap',
    }}>
      {/* Left rail — marketing headline + brand */}
      <div style={{ maxWidth: 420, color: 'var(--g-fg-1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
          <img src="grapplers/icon-512.png" alt="Grapplers" style={{ width: 56, height: 56, borderRadius: 12, display: 'block', boxShadow: '0 12px 40px rgba(30,111,255,0.2), 0 0 0 1px rgba(255,255,255,0.06)' }} />
          <div>
            <div className="g-eyebrow" style={{ color: 'var(--g-mat-hi)', marginBottom: 4 }}>
              ◈ {role === 'athlete' ? 'ATHLETE' : 'STUDENT'} · LIVE APP
            </div>
            <GWordmark size={32} />
          </div>
        </div>
        <h1 style={{
          fontFamily: 'var(--g-condensed)', fontSize: 56, fontWeight: 800,
          lineHeight: 0.92, letterSpacing: '-0.01em', margin: '20px 0 14px',
          textTransform: 'uppercase',
        }}>
          The coach you can't find <span className="g-chrome-fill">is on Grapplers.</span>
        </h1>
        <p style={{ color: 'var(--g-fg-2)', fontSize: 15, lineHeight: 1.6, margin: 0 }}>
          Tap anywhere in the phone to use the app. Your progress — bookings, purchases, endorsements,
          follows — saves locally across visits.
        </p>
        <div style={{ display: 'flex', gap: 10, marginTop: 26 }}>
          <GBtn variant="ghost" size="sm" onClick={onExit}>← Back to marketing</GBtn>
          <GBtn variant="ghost" size="sm" onClick={() => {
            if (confirm('Reset all app state? This clears bookings, purchases, follows, likes, endorsements, and messages.')) {
              localStorage.removeItem(LS_KEY);
              location.reload();
            }
          }}>Reset state</GBtn>
        </div>
        <div style={{
          marginTop: 36, fontFamily: 'var(--g-mono)', fontSize: 10,
          color: 'var(--g-fg-3)', letterSpacing: '0.18em',
        }}>GRP · V.01 · 2026 · AN NDAI CLIENT</div>
      </div>

      {/* Phone frame */}
      <GPhone width={390} height={820} role={role === 'athlete' ? 'ATHLETE' : 'STUDENT'}
              label={role === 'athlete' ? 'Endorse · manage profile' : 'Book privates · buy instructionals'}>
        {children}
      </GPhone>
    </div>
  );
}
window.ResponsivePhone = ResponsivePhone;

// ---- Top-level router -----------------------------------------------------
function AppRoot() {
  // Route states: 'marketing' | 'onboarding' | 'app'
  const [route, setRoute] = React.useState(() => localStorage.getItem(LS_ROUTE) || 'marketing');
  const [role, setRole] = React.useState(() => localStorage.getItem('grapplers.role') || 'student');
  React.useEffect(() => { localStorage.setItem(LS_ROUTE, route); }, [route]);
  React.useEffect(() => { localStorage.setItem('grapplers.role', role); }, [role]);

  // Deep-link support: ?r=app&role=athlete or ?r=canvas
  React.useEffect(() => {
    const q = new URLSearchParams(location.search);
    const r = q.get('r');
    const rl = q.get('role');
    if (rl === 'athlete' || rl === 'student') setRole(rl);
    if (r === 'app' || r === 'onboarding' || r === 'marketing') setRoute(r);
    if (r === 'canvas') { location.href = 'Grapplers.html'; }
  }, []);

  // Browser back button
  React.useEffect(() => {
    const on = () => {
      const q = new URLSearchParams(location.search);
      setRoute(q.get('r') || 'marketing');
    };
    window.addEventListener('popstate', on);
    return () => window.removeEventListener('popstate', on);
  }, []);

  const go = (next, roleOverride) => {
    if (roleOverride) setRole(roleOverride);
    setRoute(next);
    const q = new URLSearchParams(location.search);
    q.set('r', next); if (roleOverride) q.set('role', roleOverride);
    history.pushState({}, '', '?' + q.toString());
  };

  if (route === 'marketing') return <MarketingApp onEnter={() => go('onboarding')} onOpenCanvas={() => { location.href = 'Grapplers.html'; }} />;
  if (route === 'onboarding') return <OnboardingFlow onComplete={(r) => go('app', r)} onBack={() => go('marketing')} />;
  // route === 'app'
  return (
    <ResponsivePhone role={role} onExit={() => go('marketing')}>
      <MobileApp role={role} />
    </ResponsivePhone>
  );
}

// Marketing wrapper — injects a working "Open app" CTA + wraps the responsive landing
function MarketingApp({ onEnter, onOpenCanvas }) {
  // Provide CTA handler via window so MarketingPage's buttons can call it (we wrap below)
  React.useEffect(() => {
    window.__grapplersEnter = onEnter;
    window.__grapplersCanvas = onOpenCanvas;
    return () => { window.__grapplersEnter = null; window.__grapplersCanvas = null; };
  }, [onEnter, onOpenCanvas]);
  return (
    <div style={{ background: 'var(--g-obsidian)' }}>
      <MarketingPage onEnter={onEnter} onOpenCanvas={onOpenCanvas} />
    </div>
  );
}

// Onboarding full-viewport wrapper
function OnboardingFlow({ onComplete, onBack }) {
  return (
    <ResponsivePhone role="student" onExit={onBack}>
      <OnboardingScreen onComplete={onComplete} />
    </ResponsivePhone>
  );
}

Object.assign(window, { AppRoot, MarketingApp, OnboardingFlow });
