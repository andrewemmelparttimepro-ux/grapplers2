// Grapplers — Main mobile app router

function MobileApp({ role = 'student', label }) {
  const [stack, setStack] = useState([{ name: role === 'athlete' ? 'home' : 'feed' }]);
  const [endorseTarget, setEndorseTarget] = useState(null);
  const [ratesOpen, setRatesOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  const top = stack[stack.length - 1];
  const push = (s) => setStack(prev => [...prev, s]);
  const pop = () => setStack(prev => prev.length > 1 ? prev.slice(0, -1) : prev);
  const reset = (name) => setStack([{ name }]);

  const tabs = role === 'athlete'
    ? [
        { id: 'home', label: 'Today', icon: '◈' },
        { id: 'feed', label: 'Feed', icon: '◇' },
        { id: 'msg',  label: 'DMs',   icon: '✉' },
        { id: 'me',   label: 'Profile', icon: '◉' },
      ]
    : [
        { id: 'feed',     label: 'Feed',     icon: '◇' },
        { id: 'discover', label: 'Find',     icon: '◎' },
        { id: 'store',    label: 'Store',    icon: '◈' },
        { id: 'msg',      label: 'DMs',      icon: '✉' },
    ];

  const setTab = (t) => reset(t);

  // Deep-link: ?profile=a0X jumps to a profile view after mount
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const pid = q.get('profile');
    if (pid && window.gAthlete(pid)) push({ name: 'profile', id: pid });
  }, []);

  const render = () => {
    const n = top.name;
    if (n === 'feed')     return <FeedScreen role={role} onViewProfile={(id) => push({ name: 'profile', id })} onOpenMessages={() => reset('msg')} />;
    if (n === 'discover') return <DiscoverScreen role={role} onViewProfile={(id) => push({ name: 'profile', id })} />;
    if (n === 'store')    return <StoreScreen onOpenInstructional={(i) => push({ name: 'instructional', i })} />;
    if (n === 'msg')      return <MessagesScreen role={role} onOpenThread={(a) => push({ name: 'thread', athlete: a })} />;
    if (n === 'thread')   return <ThreadScreen athlete={top.athlete} onBack={pop} />;
    if (n === 'home')     return (
      <AthleteHomeScreen
        onViewMyProfile={() => push({ name: 'me' })}
        onOpenMessages={() => reset('msg')}
        onOpenUpload={() => setUploadOpen(true)}
        onEditRates={() => setRatesOpen(true)}
      />
    );
    if (n === 'me')       return <ProfileScreen athleteId="a01" onBack={pop} viewerRole={role} onBookLesson={(a) => push({ name: 'booking', athlete: a })} onBuyInstructional={(i) => push({ name: 'instructional', i })} onEndorse={(a) => setEndorseTarget(a)} onOpenThread={(a) => push({ name: 'thread', athlete: a })} />;
    if (n === 'profile')  return (
      <ProfileScreen
        athleteId={top.id}
        onBack={pop}
        viewerRole={role}
        onBookLesson={(a) => push({ name: 'booking', athlete: a })}
        onBuyInstructional={(i) => push({ name: 'instructional', i })}
        onEndorse={(a) => setEndorseTarget(a)}
        onOpenThread={(a) => push({ name: 'thread', athlete: a })}
      />
    );
    if (n === 'booking')  return <BookingScreen athlete={top.athlete} onBack={pop} onComplete={() => reset(role === 'athlete' ? 'home' : 'feed')} />;
    if (n === 'instructional') return <InstructionalDetail instructional={top.i} onBack={pop} onPurchaseComplete={pop} />;
    return null;
  };

  const hideTabBar = ['profile','me','booking','instructional','thread'].includes(top.name);
  const activeViewerRole = role;

  return (
    <>
      {render()}
      {!hideTabBar && <GTabBar tabs={tabs} active={top.name} onChange={setTab} />}
      {endorseTarget && <EndorseOverlay target={endorseTarget} from={window.gAthlete('a01')} onClose={() => setEndorseTarget(null)} />}
      {ratesOpen && <EditRatesSheet onClose={() => setRatesOpen(false)} />}
      {uploadOpen && <UploadSheet onClose={() => setUploadOpen(false)} />}
    </>
  );
}

// Edit-rates sheet (athlete)
function EditRatesSheet({ onClose }) {
  const me = window.gAthlete('a01');
  const [rate, setRate] = useState(me.rate);
  const [saved, setSaved] = useState(false);
  const save = () => {
    me.rate = Number(rate) || me.rate; // mutate in-memory athlete
    setSaved(true);
    setTimeout(() => { onClose(); window.gToast(`New private rate: $${me.rate}/hr`); }, 600);
  };
  return (
    <BottomSheet onClose={onClose} title="EDIT RATES" eyebrow="◈ PRIVATE · PER HOUR">
      <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
        <span className="g-condensed" style={{ fontSize: 48, color: 'var(--g-fg-1)' }}>$</span>
        <input
          type="number"
          value={rate}
          onChange={e => setRate(e.target.value)}
          style={{
            flex: 1, background: 'transparent', border: 'none',
            fontFamily: 'var(--g-condensed)', fontSize: 64, fontWeight: 800,
            color: 'var(--g-fg-1)', outline: 'none', width: '100%',
          }}
        />
      </div>
      <div style={{ fontSize: 12, color: 'var(--g-fg-3)', fontFamily: 'var(--g-mono)', marginTop: 6 }}>
        Minimum $40 · no platform cut
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
        <GBtn variant="ghost" size="md" onClick={onClose} style={{ flex: 1 }}>Cancel</GBtn>
        <GBtn variant="mat" size="md" onClick={save} style={{ flex: 2 }} disabled={saved || Number(rate) < 40}>{saved ? 'Saved ✓' : 'Save new rate'}</GBtn>
      </div>
    </BottomSheet>
  );
}

// Upload sheet (athlete)
function UploadSheet({ onClose }) {
  const [stage, setStage] = useState('pick'); // pick → upload → done
  const [kind, setKind] = useState('clip');
  const start = () => {
    setStage('upload');
    setTimeout(() => setStage('done'), 1600);
    setTimeout(() => { onClose(); window.gToast('Content queued for review'); }, 2400);
  };
  return (
    <BottomSheet onClose={onClose} title="ADD CONTENT" eyebrow="◈ UPLOAD">
      {stage === 'pick' && (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { id: 'clip', t: 'Technique clip', d: 'Up to 3 min · mp4/mov · free or paid' },
              { id: 'post', t: 'Text post', d: 'Schedule, seminar dates, announcements' },
              { id: 'inst', t: 'New instructional', d: 'Multi-chapter series, set your price' },
            ].map(k => (
              <button key={k.id} onClick={() => setKind(k.id)} style={{
                background: kind === k.id ? 'linear-gradient(180deg, rgba(30,111,255,0.1), var(--g-graphite))' : 'var(--g-graphite)',
                border: '1px solid ' + (kind === k.id ? 'var(--g-mat)' : 'var(--g-border)'),
                borderRadius: 12, padding: 14, textAlign: 'left', cursor: 'pointer', color: 'inherit',
              }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{k.t}</div>
                <div style={{ fontSize: 11, color: 'var(--g-fg-3)', fontFamily: 'var(--g-mono)', marginTop: 3 }}>{k.d}</div>
              </button>
            ))}
          </div>
          <GBtn variant="chrome" size="lg" onClick={start} style={{ width: '100%', marginTop: 16 }}>Upload & Continue →</GBtn>
        </>
      )}
      {stage === 'upload' && (
        <div style={{ textAlign: 'center', padding: '20px 0 10px' }}>
          <div className="g-eyebrow" style={{ color: 'var(--g-mat-hi)', marginBottom: 10 }}>◉ UPLOADING…</div>
          <div style={{ width: '100%', height: 3, background: 'var(--g-graphite-2)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: 'var(--g-mat)', animation: 'gPB 1.5s ease-out forwards' }} />
          </div>
          <style>{`@keyframes gPB { from { width: 4%; } to { width: 100%; } }`}</style>
        </div>
      )}
      {stage === 'done' && (
        <div style={{ textAlign: 'center', padding: 10 }}>
          <div className="g-eyebrow" style={{ color: 'var(--g-mat-hi)', marginBottom: 10 }}>◈ SUBMITTED</div>
          <div style={{ fontSize: 13, color: 'var(--g-fg-2)' }}>Queued for review. Live within 30 minutes.</div>
        </div>
      )}
    </BottomSheet>
  );
}

// Reusable bottom sheet
function BottomSheet({ children, onClose, title, eyebrow }) {
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, zIndex: 110,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'flex-end',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', background: 'var(--g-graphite)',
        borderTop: '1px solid var(--g-border-chrome)',
        borderRadius: '24px 24px 0 0', padding: 20, paddingBottom: 34,
        animation: 'gSlideUp 300ms cubic-bezier(0.2,0.7,0.2,1)',
      }}>
        <style>{`@keyframes gSlideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>
        <div style={{ width: 40, height: 4, background: 'var(--g-border-strong)', borderRadius: 2, margin: '0 auto 16px' }} />
        {eyebrow && <div className="g-eyebrow" style={{ color: 'var(--g-mat-hi)', marginBottom: 6 }}>{eyebrow}</div>}
        {title && <div className="g-condensed" style={{ fontSize: 26, color: 'var(--g-fg-1)', marginBottom: 14 }}>{title}</div>}
        {children}
      </div>
    </div>
  );
}

Object.assign(window, { MobileApp, EditRatesSheet, UploadSheet, BottomSheet });
