// Grapplers — Messages, Onboarding, Discover screens

function MessagesScreen({ onOpenThread, role }) {
  const threads = [
    { athleteId: 'a05', last: 'Locked in for July 19. Bring gi.', unread: 2, time: '2h' },
    { athleteId: 'a02', last: 'Sent over the collar-choke clip you asked for.', unread: 0, time: '1d' },
    { athleteId: 'a01', last: 'Saturday open mat — room for 2 more.', unread: 0, time: '2d' },
    { athleteId: 'a03', last: 'Folkstyle camp pricing below. Let me know.', unread: 1, time: '3d' },
  ];
  return (
    <div style={{ height: '100%', overflowY: 'auto', paddingBottom: 110 }} className="g-scroll">
      <GHeader title="MESSAGES" eyebrow={`◈ ${role === 'athlete' ? 'ATHLETE' : 'STUDENT'} · DMS`} right={
        <button style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--g-graphite)', border: '1px solid var(--g-border)', color: 'var(--g-fg-1)', fontSize: 18, cursor: 'pointer' }}>✎</button>
      } />
      <div style={{ padding: '8px 0' }}>
        {threads.map(t => {
          const a = window.gAthlete(t.athleteId);
          return (
            <div key={t.athleteId} onClick={() => onOpenThread(a)} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', cursor: 'pointer',
              borderBottom: '1px solid var(--g-border)',
            }}>
              <GAvatar athlete={a} size={48} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--g-fg-1)' }}>{a.name}</span>
                  {a.verified && <VerifiedMark size={11} />}
                  <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--g-fg-3)', fontFamily: 'var(--g-mono)' }}>{t.time}</span>
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: t.unread ? 'var(--g-fg-1)' : 'var(--g-fg-3)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.last}</span>
                  {t.unread > 0 && <span style={{ minWidth: 18, height: 18, padding: '0 6px', borderRadius: 999, background: 'var(--g-mat)', color: '#fff', fontSize: 10, fontWeight: 600, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{t.unread}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ThreadScreen({ athlete, onBack }) {
  const state = window.useGStore();
  const saved = state.threadMessages?.[athlete.id];
  const seed = [
    { from: 'them', t: '9:12 AM', text: 'Saw your DM — yes, Saturday privates are open.' },
    { from: 'me',   t: '9:14 AM', text: 'Great. Looking for leg lock work mostly, some guard retention.' },
    { from: 'them', t: '9:16 AM', text: 'Perfect. 10:30 or 12:00?' },
    { from: 'me',   t: '9:17 AM', text: '10:30.' },
    { from: 'them', t: '9:18 AM', text: 'Locked in. $180, bring gi + no-gi.' },
  ];
  const msgs = saved && saved.length ? saved : seed;
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);
  const taRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs.length, typing]);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    const now = new Date();
    const t = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    const next = [...msgs, { from: 'me', t, text }];
    window.GStore.set(s => ({ threadMessages: { ...s.threadMessages, [athlete.id]: next } }));
    setDraft('');
    setTyping(true);
    // Simulated reply — picks a plausible coach response
    const replyBank = [
      'Sounds good.', 'Roger. See you then.',
      `Got it — I'll queue up ${athlete.specialties[0].toLowerCase()} work.`,
      'Confirmed. Bring a mouthguard.',
      'Copy. Add $20 if you want video review after.',
    ];
    const pick = replyBank[Math.floor(Math.random() * replyBank.length)];
    setTimeout(() => {
      const now2 = new Date();
      const t2 = now2.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
      window.GStore.set(s => ({
        threadMessages: {
          ...s.threadMessages,
          [athlete.id]: [...(s.threadMessages?.[athlete.id] || next), { from: 'them', t: t2, text: pick }],
        },
      }));
      setTyping(false);
    }, 1200 + Math.random() * 700);
  };

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '56px 16px 14px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid var(--g-border)' }}>
        <button onClick={onBack} style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--g-graphite)', border: '1px solid var(--g-border)', color: '#fff', fontSize: 14, cursor: 'pointer' }}>←</button>
        <GAvatar athlete={athlete} size={34} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
            {athlete.name}
            {athlete.verified && <VerifiedMark size={11} />}
          </div>
          <div style={{ fontSize: 10, fontFamily: 'var(--g-mono)', color: 'var(--g-fg-3)' }}>◉ online · {athlete.gym.split('·')[0].trim()}</div>
        </div>
        <button onClick={() => window.gToast('Call feature coming soon')} style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--g-graphite)', border: '1px solid var(--g-border)', color: 'var(--g-fg-1)', fontSize: 12, cursor: 'pointer' }}>☎</button>
      </div>
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '16px' }} className="g-scroll">
        <div className="g-eyebrow" style={{ textAlign: 'center', marginBottom: 16 }}>TODAY · APR 24</div>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.from === 'me' ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
            <div style={{
              maxWidth: '75%', padding: '9px 13px', borderRadius: 18,
              background: m.from === 'me' ? 'var(--g-mat)' : 'var(--g-graphite-2)',
              color: '#fff', fontSize: 13, lineHeight: 1.4,
              borderBottomRightRadius: m.from === 'me' ? 4 : 18,
              borderBottomLeftRadius: m.from === 'me' ? 18 : 4,
              whiteSpace: 'pre-wrap', wordBreak: 'break-word',
            }}>{m.text}</div>
          </div>
        ))}
        {typing && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 8 }}>
            <div style={{
              padding: '10px 14px', borderRadius: 18,
              background: 'var(--g-graphite-2)', color: '#fff', fontSize: 13,
              borderBottomLeftRadius: 4, display: 'inline-flex', gap: 4,
            }}>
              <span className="gx-dot" style={{ animation: 'gxBounce 1.2s infinite', animationDelay: '0s' }}>●</span>
              <span className="gx-dot" style={{ animation: 'gxBounce 1.2s infinite', animationDelay: '0.2s' }}>●</span>
              <span className="gx-dot" style={{ animation: 'gxBounce 1.2s infinite', animationDelay: '0.4s' }}>●</span>
            </div>
            <style>{`@keyframes gxBounce { 0%,60%,100%{opacity:0.3;transform:translateY(0)} 30%{opacity:1;transform:translateY(-2px)} } .gx-dot{font-size:9px;color:var(--g-fg-3)}`}</style>
          </div>
        )}
        <div style={{ textAlign: 'center', margin: '16px 0' }}>
          <div style={{ display: 'inline-block', maxWidth: 280, textAlign: 'left' }}>
            <EndorsementStamp from={{ name: 'BOOKING · SAT APR 26' }} date="10:30 AM · 60 MIN" serial="GRP-BK-44218" compact />
          </div>
        </div>
      </div>
      <div style={{ padding: '10px 12px 30px', borderTop: '1px solid var(--g-border)', display: 'flex', gap: 8, alignItems: 'flex-end' }}>
        <textarea
          ref={taRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKey}
          rows={1}
          placeholder={`Message ${athlete.name.split(' ')[0]}…`}
          style={{
            flex: 1, background: 'var(--g-graphite-2)', borderRadius: 20,
            padding: '10px 14px', fontSize: 13, color: 'var(--g-fg-1)',
            border: '1px solid var(--g-border)', fontFamily: 'var(--g-sans)',
            resize: 'none', maxHeight: 120, lineHeight: 1.4,
          }}
        />
        <button onClick={send} disabled={!draft.trim()} style={{
          width: 38, height: 38, borderRadius: '50%',
          background: draft.trim() ? 'var(--g-mat)' : 'var(--g-graphite-2)',
          border: 'none', color: '#fff', fontSize: 16, cursor: draft.trim() ? 'pointer' : 'default',
          transition: 'background 120ms ease',
        }}>→</button>
      </div>
    </div>
  );
}

// Discover / search — filterable list
function DiscoverScreen({ onViewProfile, role }) {
  const [style, setStyle] = useState('All');
  const [belt, setBelt] = useState('All');
  const [q, setQ] = useState('');
  const [mapOpen, setMapOpen] = useState(false);
  const athletes = window.G_ATHLETES.filter(a => {
    if (style !== 'All' && !a.styles.includes(style)) return false;
    if (belt !== 'All' && a.belt !== belt) return false;
    if (q.trim()) {
      const hay = `${a.name} ${a.handle} ${a.gym} ${a.city} ${a.specialties.join(' ')} ${a.styles.join(' ')}`.toLowerCase();
      if (!hay.includes(q.trim().toLowerCase())) return false;
    }
    return true;
  }).sort((a, b) => a.distance - b.distance);

  return (
    <div style={{ height: '100%', overflowY: 'auto', paddingBottom: 110 }} className="g-scroll">
      <GHeader title="FIND COACHES" eyebrow="◈ DISCOVER" />
      {/* search */}
      <div style={{ padding: '0 16px 14px' }}>
        <div style={{ position: 'relative' }}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, gym, style, specialty…"
            style={{
              width: '100%', height: 42, padding: '0 16px 0 38px',
              background: 'var(--g-graphite)', border: '1px solid var(--g-border)',
              borderRadius: 999, color: 'var(--g-fg-1)', fontSize: 13,
              fontFamily: 'var(--g-sans)',
            }}
          />
          <span style={{ position: 'absolute', left: 14, top: 13, color: 'var(--g-fg-3)', fontSize: 14 }}>◎</span>
          {q && (
            <button onClick={() => setQ('')} style={{
              position: 'absolute', right: 8, top: 7, width: 28, height: 28,
              borderRadius: '50%', background: 'var(--g-graphite-2)', border: '1px solid var(--g-border)',
              color: 'var(--g-fg-3)', fontSize: 12, cursor: 'pointer',
            }}>×</button>
          )}
        </div>
      </div>
      {/* filters */}
      <div style={{ padding: '0 16px 10px' }}>
        <div className="g-eyebrow" style={{ marginBottom: 8 }}>◇ STYLE</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
          {['All', 'No-Gi BJJ', 'Gi BJJ', 'Folkstyle', 'Submission Grappling'].map(s => (
            <span key={s} onClick={() => setStyle(s)} style={{
              padding: '5px 10px', borderRadius: 999, cursor: 'pointer',
              background: style === s ? 'var(--g-fg-1)' : 'transparent',
              color: style === s ? 'var(--g-carbon)' : 'var(--g-fg-2)',
              border: style === s ? 'none' : '1px solid var(--g-border-strong)',
              fontSize: 10, fontFamily: 'var(--g-display)', fontWeight: 600,
              letterSpacing: '0.14em', textTransform: 'uppercase', whiteSpace: 'nowrap',
            }}>{s}</span>
          ))}
        </div>
        <div className="g-eyebrow" style={{ marginBottom: 8 }}>◇ BELT / RANK</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['All', 'black', 'brown', 'purple'].map(b => (
            <span key={b} onClick={() => setBelt(b)} style={{
              padding: '5px 10px', borderRadius: 999, cursor: 'pointer',
              background: belt === b ? 'var(--g-fg-1)' : 'transparent',
              color: belt === b ? 'var(--g-carbon)' : 'var(--g-fg-2)',
              border: belt === b ? 'none' : '1px solid var(--g-border-strong)',
              fontSize: 10, fontFamily: 'var(--g-display)', fontWeight: 600,
              letterSpacing: '0.14em', textTransform: 'uppercase',
            }}>{b === 'All' ? 'ALL' : window.G_BELTS[b].label}</span>
          ))}
        </div>
      </div>
      {/* map preview strip */}
      <div style={{ margin: '10px 16px 16px', position: 'relative', height: 120, borderRadius: 12, overflow: 'hidden', background: 'linear-gradient(135deg, #081228 0%, #050608 100%)', border: '1px solid var(--g-border)' }}>
        {/* grid lines */}
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.25 }}>
          <defs>
            <pattern id="mat-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#1E6FFF" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mat-grid)" />
        </svg>
        {/* pins */}
        {[{x:20,y:45,size:14,self:true},{x:55,y:35,size:10},{x:38,y:70,size:8},{x:75,y:60,size:8},{x:85,y:20,size:6}].map((p, i) => (
          <div key={i} style={{
            position: 'absolute', left: `${p.x}%`, top: `${p.y}%`, transform: 'translate(-50%, -50%)',
            width: p.size, height: p.size, borderRadius: '50%',
            background: p.self ? 'var(--g-gradient-chrome)' : 'var(--g-mat)',
            boxShadow: p.self ? '0 0 0 3px rgba(255,255,255,0.1)' : '0 0 12px rgba(30,111,255,0.6)',
            border: p.self ? '1px solid rgba(0,0,0,0.4)' : 'none',
          }} />
        ))}
        <div style={{ position: 'absolute', bottom: 8, left: 12, fontFamily: 'var(--g-mono)', fontSize: 10, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.1em' }}>◎ MINOT, ND · {athletes.length} NEARBY</div>
        <button onClick={() => setMapOpen(true)} style={{ position: 'absolute', top: 8, right: 10, background: 'rgba(0,0,0,0.5)', padding: '3px 8px', borderRadius: 4, fontSize: 10, fontFamily: 'var(--g-mono)', color: '#fff', letterSpacing: '0.08em', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.15)' }}>EXPAND MAP →</button>
      </div>

      <div className="g-eyebrow" style={{ padding: '0 16px 10px' }}>◇ {athletes.length} COACH{athletes.length === 1 ? '' : 'ES'} · SORTED BY DISTANCE</div>

      {mapOpen && <FullMapOverlay athletes={athletes} onClose={() => setMapOpen(false)} onPick={(id) => { setMapOpen(false); onViewProfile(id); }} />}
      {!athletes.length && (
        <div style={{ textAlign: 'center', padding: '40px 24px', color: 'var(--g-fg-3)', fontFamily: 'var(--g-mono)', fontSize: 11, letterSpacing: '0.1em' }}>
          ◇ NO COACHES MATCH · TRY RELAXING FILTERS ◇
        </div>
      )}

      {athletes.map(a => (
        <div key={a.id} onClick={() => onViewProfile(a.id)} style={{
          display: 'flex', gap: 12, padding: '12px 16px', borderBottom: '1px solid var(--g-border)', cursor: 'pointer',
        }}>
          <GAvatar athlete={a} size={52} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--g-fg-1)' }}>{a.name}</span>
              {a.verified && <VerifiedMark size={11} />}
            </div>
            <div style={{ fontSize: 11, color: 'var(--g-fg-3)', fontFamily: 'var(--g-mono)', marginBottom: 4 }}>
              {window.gFormatRecord(a.record)} · {a.distance === 0 ? 'LOCAL' : `${a.distance}MI`} · ${a.rate}/HR
            </div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
              <BeltChip rank={a.belt} degree={a.degree} />
              {a.styles.slice(0, 2).map(s => (
                <span key={s} style={{ fontSize: 9, fontFamily: 'var(--g-display)', fontWeight: 500, color: 'var(--g-fg-3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>· {s}</span>
              ))}
            </div>
          </div>
          <span style={{ color: 'var(--g-fg-3)', fontSize: 14, alignSelf: 'center' }}>→</span>
        </div>
      ))}
    </div>
  );
}

// Simple My / Store view
function StoreScreen({ onOpenInstructional }) {
  const state = window.useGStore();
  const owned = window.G_INSTRUCTIONALS.filter(i => state.purchased.has(i.id));
  const browse = window.G_INSTRUCTIONALS.filter(i => !state.purchased.has(i.id));
  return (
    <div style={{ height: '100%', overflowY: 'auto', paddingBottom: 110 }} className="g-scroll">
      <GHeader title="INSTRUCTIONALS" eyebrow="◈ STORE · LIBRARY" />
      <div style={{ padding: '0 16px' }}>
        {owned.length > 0 && (
          <>
            <div className="g-eyebrow" style={{ marginBottom: 10, color: 'var(--g-mat-hi)' }}>◈ YOUR LIBRARY · {owned.length}</div>
            {owned.map(i => <InstructionalCard key={i.id} instructional={i} onOpen={() => onOpenInstructional(i)} />)}
          </>
        )}
        <div className="g-eyebrow" style={{ margin: '18px 0 10px' }}>◇ BROWSE · NEW</div>
        {browse.map(i => <InstructionalCard key={i.id} instructional={i} onOpen={() => onOpenInstructional(i)} />)}
      </div>
    </div>
  );
}

// Fullscreen map overlay — pickable pins
function FullMapOverlay({ athletes, onClose, onPick }) {
  // Distribute pins deterministically by athlete id seed
  const positions = athletes.map((a, i) => {
    const h = String(a.id).split('').reduce((x, c) => x + c.charCodeAt(0), 0);
    return { a, x: 10 + ((h * 13) % 80), y: 10 + ((h * 7) % 72) };
  });
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, zIndex: 120,
      background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', maxWidth: 560, height: '80%', maxHeight: 620,
        background: 'linear-gradient(135deg, #081228 0%, #050608 100%)',
        border: '1px solid var(--g-border-strong)', borderRadius: 16,
        position: 'relative', overflow: 'hidden',
        boxShadow: 'var(--g-shadow-lg)',
      }}>
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.3 }}>
          <defs>
            <pattern id="mat-grid-full" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1E6FFF" strokeWidth="0.6"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mat-grid-full)" />
        </svg>
        <div style={{
          position: 'absolute', top: 14, left: 14, right: 14,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          zIndex: 5,
        }}>
          <div>
            <div className="g-eyebrow" style={{ color: 'var(--g-mat-hi)' }}>◎ NEARBY · {athletes.length} COACHES</div>
            <div className="g-condensed" style={{ fontSize: 22, color: '#fff' }}>MINOT, ND</div>
          </div>
          <button onClick={onClose} style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(0,0,0,0.5)', border: '1px solid var(--g-border)',
            color: '#fff', fontSize: 16, cursor: 'pointer',
          }}>×</button>
        </div>
        {/* You — center pin */}
        <div style={{
          position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
          width: 18, height: 18, borderRadius: '50%',
          background: 'var(--g-gradient-chrome)', border: '1px solid rgba(0,0,0,0.4)',
          boxShadow: '0 0 0 6px rgba(255,255,255,0.08)',
        }} />
        {positions.map(({ a, x, y }) => (
          <button key={a.id} onClick={() => onPick(a.id)} style={{
            position: 'absolute', left: `${x}%`, top: `${y}%`,
            transform: 'translate(-50%, -50%)',
            padding: '6px 10px', borderRadius: 999,
            background: 'var(--g-mat)', color: '#fff',
            border: 'none', cursor: 'pointer',
            boxShadow: '0 0 20px rgba(30,111,255,0.6), 0 0 0 4px rgba(30,111,255,0.15)',
            fontFamily: 'var(--g-display)', fontSize: 11, fontWeight: 600,
            letterSpacing: '0.02em', whiteSpace: 'nowrap',
          }}>
            {a.name.split(' ').map(n => n[0]).slice(0, 2).join('')} · {a.distance === 0 ? 'LOCAL' : `${a.distance}MI`}
          </button>
        ))}
        <div style={{
          position: 'absolute', bottom: 14, left: 14, right: 14,
          display: 'flex', gap: 8, justifyContent: 'center',
          fontFamily: 'var(--g-mono)', fontSize: 10,
          color: 'rgba(255,255,255,0.7)', letterSpacing: '0.1em',
        }}>TAP A PIN TO VIEW PROFILE · DRAG IS A DEMO FUTURE</div>
      </div>
    </div>
  );
}

// Onboarding — student/athlete role selector + verification for athletes
function OnboardingScreen({ onComplete }) {
  const [step, setStep] = useState(1); // 1 role, 2 verify (if athlete), 3 done
  const [role, setRole] = useState(window.__grapplersEnterAs || 'student');
  // Consume the one-shot preselect hint set by marketing "I'm a coach" CTA
  useEffect(() => { if (window.__grapplersEnterAs) { window.__grapplersEnterAs = null; } }, []);

  return (
    <div style={{ height: '100%', overflowY: 'auto', paddingBottom: 40, background: 'radial-gradient(ellipse at 50% -20%, rgba(30,111,255,0.12) 0%, transparent 50%), var(--g-carbon)' }} className="g-scroll">
      {step === 1 && (
        <div style={{ padding: '80px 22px 30px' }}>
          <div className="g-eyebrow" style={{ color: 'var(--g-mat-hi)', marginBottom: 18 }}>◈ WELCOME TO</div>
          <GWordmark size={48} />
          <div style={{ fontSize: 14, color: 'var(--g-fg-2)', marginTop: 20, lineHeight: 1.55 }}>
            A marketplace for grapplers who actually train. Built in Minot, ND. No rented workflows. No per-seat fees.
          </div>
          <div style={{ margin: '40px 0 16px' }}>
            <div className="g-eyebrow" style={{ marginBottom: 12 }}>I AM A…</div>
            {[
              { id: 'student', t: 'Student', d: 'I want to find coaches, book lessons, buy instructionals.' },
              { id: 'athlete', t: 'Athlete / Coach', d: 'I want to get booked, build a profile, sell content.' },
            ].map(r => (
              <div key={r.id} onClick={() => setRole(r.id)} style={{
                padding: 16, borderRadius: 12, marginBottom: 10, cursor: 'pointer',
                background: role === r.id ? 'linear-gradient(180deg, rgba(30,111,255,0.12), var(--g-graphite))' : 'var(--g-graphite)',
                border: role === r.id ? '1px solid var(--g-mat)' : '1px solid var(--g-border)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', border: '1.5px solid ' + (role === r.id ? 'var(--g-mat-hi)' : 'var(--g-fg-3)'), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {role === r.id && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--g-mat-hi)' }} />}
                  </div>
                  <span style={{ fontFamily: 'var(--g-display)', fontSize: 16, fontWeight: 600 }}>{r.t}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--g-fg-2)', marginTop: 6, paddingLeft: 28 }}>{r.d}</div>
              </div>
            ))}
          </div>
          <GBtn variant="chrome" size="lg" onClick={() => setStep(role === 'athlete' ? 2 : 3)} style={{ width: '100%' }}>
            Continue →
          </GBtn>
          <div style={{ fontFamily: 'var(--g-mono)', fontSize: 9, color: 'var(--g-fg-3)', textAlign: 'center', marginTop: 30, letterSpacing: '0.1em' }}>
            GRP · V.01 · NO RENTED WORKFLOWS
          </div>
        </div>
      )}

      {step === 2 && (
        <div style={{ padding: '56px 22px 30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <button onClick={() => setStep(1)} style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--g-graphite)', border: '1px solid var(--g-border)', color: '#fff', fontSize: 13, cursor: 'pointer' }}>←</button>
            <div>
              <div className="g-eyebrow">STEP 2 OF 3</div>
              <div className="g-condensed" style={{ fontSize: 24, color: 'var(--g-fg-1)' }}>VERIFY SKILL</div>
            </div>
          </div>
          <div style={{ fontSize: 13, color: 'var(--g-fg-2)', marginBottom: 20, lineHeight: 1.5 }}>
            We verify every athlete before they can charge for lessons. Pick <b>one</b>:
          </div>
          {[
            { t: 'Competition record', d: 'IBJJF / UWW / NCAA / ADCC match history auto-fetched.', pick: true },
            { t: 'Belt verification', d: 'Your instructor confirms via in-app stamp.' },
            { t: 'Athlete endorsement', d: 'A verified Grappler endorses your credentials.' },
          ].map((o, i) => (
            <div key={i} style={{
              padding: 14, borderRadius: 12, marginBottom: 10,
              background: o.pick ? 'linear-gradient(180deg, rgba(30,111,255,0.1), var(--g-graphite))' : 'var(--g-graphite)',
              border: o.pick ? '1px solid var(--g-mat)' : '1px solid var(--g-border)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{o.t}</div>
                {o.pick && <span className="g-eyebrow" style={{ color: 'var(--g-mat-hi)' }}>◈ RECOMMENDED</span>}
              </div>
              <div style={{ fontSize: 12, color: 'var(--g-fg-2)', marginTop: 4 }}>{o.d}</div>
            </div>
          ))}
          <div style={{ marginTop: 8 }}>
            <EndorsementStamp from={{ name: 'ADCC · TRIAL FINALIST 2024' }} date="VERIFIED · APR 24" serial="GRP-VRF-0092" />
          </div>
          <GBtn variant="chrome" size="lg" onClick={() => setStep(3)} style={{ width: '100%', marginTop: 20 }}>
            Verify & Continue →
          </GBtn>
        </div>
      )}

      {step === 3 && (
        <div style={{ padding: '80px 22px 30px', textAlign: 'center' }}>
          <div style={{
            width: 96, height: 96, margin: '0 auto 24px', borderRadius: '50%',
            background: 'var(--g-gradient-chrome)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36, color: '#1a1a1a', fontWeight: 800,
            boxShadow: 'var(--g-shadow-chrome)',
          }}>◈</div>
          <div className="g-condensed" style={{ fontSize: 36, color: 'var(--g-fg-1)', lineHeight: 0.95 }}>
            YOU'RE IN.
          </div>
          <div style={{ fontSize: 13, color: 'var(--g-fg-2)', margin: '10px 0 24px' }}>
            {role === 'athlete' ? 'Build your profile. Set rates. Get endorsed.' : 'Find coaches near you. Watch free clips. Book your first private.'}
          </div>
          <GBtn variant="mat" size="lg" onClick={() => onComplete(role)} style={{ width: '100%' }}>
            Enter Grapplers →
          </GBtn>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { MessagesScreen, ThreadScreen, DiscoverScreen, StoreScreen, OnboardingScreen, FullMapOverlay });
