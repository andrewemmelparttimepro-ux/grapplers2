// Grapplers — Claim profile flow + personalized first-login walkthrough.
//
// The claim flow replaces the generic athlete onboarding (step 2 verify) with a
// real "Is this you?" screen showing Officer Grimy's pre-built profile, then an
// email + magic-link flow. Once claimed, the user's identity is persisted and
// subsequent sessions skip onboarding entirely.
//
// After the first successful claim, a 6-step Walkthrough component fires on the
// AthleteHomeScreen, pointing at real elements in the UI with personalized copy
// that references the claimed athlete's actual data (name, earnings, upcoming
// privates, endorsements on file).

const LS_CLAIM = 'grapplers.claim';

// ─────────────────────────────────────────────────────────────
// Claim helpers
// ─────────────────────────────────────────────────────────────
window.readClaim = () => {
  try { return JSON.parse(localStorage.getItem(LS_CLAIM) || 'null'); } catch (e) { return null; }
};
window.writeClaim = (c) => localStorage.setItem(LS_CLAIM, JSON.stringify(c));
window.clearClaim = () => localStorage.removeItem(LS_CLAIM);
window.markWalkthroughSeen = () => {
  const c = window.readClaim();
  if (c) window.writeClaim({ ...c, walkthroughSeen: true });
};

// ─────────────────────────────────────────────────────────────
// Claim Profile Screen — athlete-path replacement for the verify step.
// Shown to users who choose "Athlete / Coach" during onboarding. Flow:
//   1. Identity card: "Is this you?" (Officer Grimy prefilled)
//   2. Email input → simulated magic-link send
//   3. "Verification link clicked" (auto-advances after delay)
//   4. Calls onComplete(role='athlete', claim={ athleteId, email })
// ─────────────────────────────────────────────────────────────
function ClaimProfileScreen({ onComplete, onBack }) {
  const heroId = window.G_HERO_ATHLETE_ID || 'a01';
  const me = window.gAthlete(heroId);
  const received = (window.GStore.get().endorsements || []).filter(e => e.to === heroId);
  const instructionals = window.G_INSTRUCTIONALS.filter(i => i.author === heroId);

  const [step, setStep] = useState(1);   // 1 identity, 2 email, 3 sending, 4 verified
  const [email, setEmail] = useState('');
  const [isHim, setIsHim] = useState(true); // "this is me" vs. "I'm a different athlete"

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const submitEmail = () => {
    if (!emailValid) return;
    setStep(3);
    // Simulated link send
    setTimeout(() => setStep(4), 1200);
  };
  const finish = () => {
    const claim = {
      athleteId: heroId,
      email: email.trim(),
      claimedAt: new Date().toISOString(),
      walkthroughSeen: false,
    };
    window.writeClaim(claim);
    onComplete('athlete', claim);
  };

  return (
    <div style={{ height: '100%', overflowY: 'auto', paddingBottom: 40, background: 'radial-gradient(ellipse at 50% -20%, rgba(30,111,255,0.12) 0%, transparent 50%), var(--g-carbon)' }} className="g-scroll">
      {/* Header */}
      <div style={{ padding: '56px 22px 10px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={step === 1 ? onBack : () => setStep(Math.max(1, step - 1))} style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--g-graphite)', border: '1px solid var(--g-border)', color: '#fff', fontSize: 13, cursor: 'pointer' }}>←</button>
        <div style={{ flex: 1 }}>
          <div className="g-eyebrow">STEP {step <= 2 ? '2' : '2'} OF 3 · CLAIM YOUR PROFILE</div>
          <div className="g-condensed" style={{ fontSize: 22, color: 'var(--g-fg-1)' }}>
            {step === 1 && 'IS THIS YOU?'}
            {step === 2 && 'CLAIM WITH EMAIL'}
            {step === 3 && 'SENDING LINK…'}
            {step === 4 && 'VERIFIED ◈'}
          </div>
        </div>
      </div>

      {/* STEP 1 — identity card */}
      {step === 1 && (
        <div style={{ padding: '14px 22px 30px' }}>
          <div style={{ fontSize: 13, color: 'var(--g-fg-2)', lineHeight: 1.5, marginBottom: 16 }}>
            We pre-built your profile from your public grappling record.
            Claim it with your email to go live. Students can book you within 2 minutes.
          </div>

          {/* Pre-built identity card */}
          <div style={{
            background: 'linear-gradient(180deg, rgba(30,111,255,0.08) 0%, var(--g-graphite) 100%)',
            border: '1px solid rgba(30,111,255,0.32)', borderRadius: 16, overflow: 'hidden',
            boxShadow: '0 30px 60px rgba(0,0,0,0.45)',
          }}>
            {/* hero image */}
            <div style={{ height: 180, background: window.gPlaceholder(me.id + 'claim', { hue: 220 }), position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 0%, rgba(10,11,13,0.9) 100%)' }} />
              <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6 }}>
                <BeltChip rank={me.belt} degree={me.degree} />
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '2px 8px', borderRadius: 2,
                  background: 'rgba(30,111,255,0.15)', color: 'var(--g-mat-hi)',
                  border: '1px solid rgba(30,111,255,0.4)',
                  fontSize: 9, fontFamily: 'var(--g-display)', fontWeight: 600,
                  letterSpacing: '0.16em', textTransform: 'uppercase',
                }}>◈ PRE-BUILT</span>
              </div>
              <div style={{ position: 'absolute', bottom: 12, left: 14, right: 14 }}>
                <div className="g-condensed" style={{ fontSize: 32, color: '#fff', lineHeight: 0.95 }}>
                  {me.name.toUpperCase()}
                </div>
                <div style={{ fontFamily: 'var(--g-mono)', fontSize: 10, color: 'var(--g-fg-2)', letterSpacing: '0.08em', marginTop: 4 }}>
                  {me.realName.toUpperCase()} · {me.city.toUpperCase()}
                </div>
              </div>
            </div>

            {/* stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, borderBottom: '1px solid var(--g-border)' }}>
              {[
                { v: window.gFormatRecord(me.record), l: 'Record' },
                { v: received.length, l: 'Endorsed' },
                { v: `$${me.rate}`, l: 'Private/hr' },
              ].map((s, i) => (
                <div key={s.l} style={{
                  padding: '12px 4px', textAlign: 'center',
                  borderRight: i < 2 ? '1px solid var(--g-border)' : 'none',
                }}>
                  <div style={{ fontFamily: 'var(--g-display)', fontWeight: 700, fontSize: 16, color: 'var(--g-fg-1)' }}>{s.v}</div>
                  <div style={{ fontSize: 9, fontFamily: 'var(--g-display)', letterSpacing: '0.14em', color: 'var(--g-fg-3)', textTransform: 'uppercase', marginTop: 2 }}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* body facts */}
            <div style={{ padding: 14 }}>
              <div className="g-eyebrow" style={{ marginBottom: 8 }}>◇ ON FILE</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: 'var(--g-fg-2)', lineHeight: 1.5 }}>
                <div>▸ Gym — <span style={{ color: 'var(--g-fg-1)' }}>{me.gym}</span></div>
                <div>▸ Team — <span style={{ color: 'var(--g-fg-1)' }}>{me.team || '—'}</span></div>
                <div>▸ Specialties — <span style={{ color: 'var(--g-fg-1)' }}>{me.specialties.join(' · ')}</span></div>
                <div>▸ Instructionals — <span style={{ color: 'var(--g-fg-1)' }}>{instructionals.length} on the store</span></div>
                <div>▸ Endorsements — <span style={{ color: 'var(--g-fg-1)' }}>{received.length} on file (incl. Baret Yoshida)</span></div>
                <div>▸ Highlight — <span style={{ color: 'var(--g-mat-hi)', fontStyle: 'italic' }}>"{me.record.highlight}"</span></div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <GBtn variant="chrome" size="lg" onClick={() => { setIsHim(true); setStep(2); }} style={{ width: '100%' }}>
              ◈ Yes, this is me — claim it
            </GBtn>
            <GBtn variant="ghost" size="md" onClick={() => window.gToast('Solo profile creation coming soon — for now, demo claims Officer Grimy')} style={{ width: '100%' }}>
              I'm a different athlete
            </GBtn>
          </div>

          <div style={{ fontFamily: 'var(--g-mono)', fontSize: 9, color: 'var(--g-fg-3)', textAlign: 'center', marginTop: 18, letterSpacing: '0.1em' }}>
            GRP · V.01 · DATA FROM PUBLIC SOURCES · YOU OWN IT AFTER CLAIM
          </div>
        </div>
      )}

      {/* STEP 2 — email input */}
      {step === 2 && (
        <div style={{ padding: '14px 22px 30px' }}>
          <div style={{ fontSize: 13, color: 'var(--g-fg-2)', lineHeight: 1.5, marginBottom: 20 }}>
            We'll send a verification link. No password. Click the link on any device to go live.
          </div>
          <div className="g-eyebrow" style={{ marginBottom: 8 }}>◇ YOUR EMAIL</div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && emailValid) submitEmail(); }}
            placeholder="you@wilsonbrosgrappling.com"
            autoComplete="email"
            autoFocus
            style={{
              width: '100%', height: 52, padding: '0 16px',
              background: 'var(--g-graphite)', border: '1px solid ' + (email && !emailValid ? 'var(--g-danger)' : 'var(--g-border)'),
              borderRadius: 8, color: 'var(--g-fg-1)', fontSize: 15,
              fontFamily: 'var(--g-sans)',
            }}
          />
          {email && !emailValid && (
            <div style={{ fontSize: 11, color: 'var(--g-danger)', marginTop: 6, fontFamily: 'var(--g-mono)' }}>◇ NOT A VALID EMAIL</div>
          )}

          <div style={{ marginTop: 20, display: 'flex', gap: 8 }}>
            <GBtn variant="ghost" size="md" onClick={() => setStep(1)} style={{ flex: 1 }}>Back</GBtn>
            <GBtn variant="chrome" size="md" onClick={submitEmail} disabled={!emailValid} style={{ flex: 2 }}>
              Send verification link →
            </GBtn>
          </div>

          <div style={{ marginTop: 24, padding: 14, border: '1px dashed var(--g-border)', borderRadius: 8 }}>
            <div className="g-eyebrow" style={{ marginBottom: 8, color: 'var(--g-fg-3)' }}>◇ CLAIMING</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <GAvatar athlete={me} size={32} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--g-fg-1)' }}>{me.name}</div>
                <div style={{ fontSize: 10, fontFamily: 'var(--g-mono)', color: 'var(--g-fg-3)' }}>{me.realName} · {me.gym.split('·')[0].trim()}</div>
              </div>
              <BeltChip rank={me.belt} degree={me.degree} />
            </div>
          </div>
        </div>
      )}

      {/* STEP 3 — sending */}
      {step === 3 && (
        <div style={{ padding: '40px 22px', textAlign: 'center' }}>
          <div className="g-eyebrow" style={{ color: 'var(--g-mat-hi)', marginBottom: 14 }}>◉ SENDING LINK</div>
          <div style={{ fontSize: 15, color: 'var(--g-fg-2)', margin: '0 0 18px', lineHeight: 1.5 }}>
            Delivering a one-time verification link to<br/>
            <span style={{ color: 'var(--g-fg-1)', fontFamily: 'var(--g-mono)' }}>{email}</span>
          </div>
          <div style={{ width: '100%', height: 3, background: 'var(--g-graphite-2)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: 'var(--g-mat)', animation: 'gClaimBar 1.1s ease-out forwards' }} />
          </div>
          <style>{`@keyframes gClaimBar { from { width: 4%; } to { width: 100%; } }`}</style>
        </div>
      )}

      {/* STEP 4 — verified */}
      {step === 4 && (
        <div style={{ padding: '50px 22px 30px', textAlign: 'center' }}>
          <div style={{
            width: 96, height: 96, margin: '0 auto 24px', borderRadius: '50%',
            background: 'var(--g-gradient-chrome)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36, color: '#1a1a1a', fontWeight: 800,
            boxShadow: 'var(--g-shadow-chrome)',
          }}>◈</div>
          <div className="g-condensed" style={{ fontSize: 30, color: 'var(--g-fg-1)', lineHeight: 0.95 }}>
            YOU'RE CLAIMED.
          </div>
          <div style={{ fontSize: 13, color: 'var(--g-fg-2)', margin: '12px 0 14px', lineHeight: 1.5 }}>
            {me.name}, your profile is live to students now.
          </div>
          <div style={{ margin: '0 auto 26px', maxWidth: 280, textAlign: 'left' }}>
            <EndorsementStamp from={{ name: 'PROFILE CLAIMED · ' + me.name.toUpperCase() }} date={`${['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'][new Date().getMonth()]} ${new Date().getDate()} · ${new Date().getFullYear()}`} serial={`GRP-CLM-${Math.floor(Math.random() * 90000 + 10000)}`} />
          </div>
          <GBtn variant="mat" size="lg" onClick={finish} style={{ width: '100%' }}>
            Enter Grapplers →
          </GBtn>
          <div style={{ fontFamily: 'var(--g-mono)', fontSize: 9, color: 'var(--g-fg-3)', marginTop: 18, letterSpacing: '0.1em' }}>
            ◇ NEXT: 60-SECOND TOUR OF YOUR PROFILE
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Walkthrough — personalized 6-step tour over the AthleteHomeScreen.
// Targets DOM elements by [data-tour="<key>"]. Dims everything around
// each target with a full-screen box-shadow trick, then shows a tooltip
// card with copy that references the claimed athlete's real data.
// ─────────────────────────────────────────────────────────────
function Walkthrough({ onDone }) {
  const heroId = window.G_HERO_ATHLETE_ID || 'a01';
  const me = window.gAthlete(heroId);
  const state = window.useGStore();
  const received = state.endorsements.filter(e => e.to === heroId);
  const barEndorser = window.gAthlete(received[0]?.from)?.name || 'Baret';
  const instructionals = window.G_INSTRUCTIONALS.filter(i => i.author === heroId);
  const firstInst = instructionals[0];

  const steps = [
    {
      target: null, // full-screen greeting (no spotlight)
      title: `Welcome back, ${me.name}.`,
      body: 'Your Wilson Bros. profile is live. 60-second tour — tap Next to see what students see when they find you.',
      cta: 'Next →',
    },
    {
      target: 'profile-card',
      title: 'This is your lockup.',
      body: `Verified athlete · black belt · ${me.city}. The chip, the avatar, and the name follow you everywhere in the app.`,
      cta: 'Next →',
    },
    {
      target: 'earnings',
      title: 'April is tracking at $3,240.',
      body: `18 privates booked and 12 instructional sales — ${firstInst ? `"${firstInst.title}" is pacing as your top seller` : 'your instructionals are selling'}. Everything is net, no platform cut.`,
      cta: 'Next →',
    },
    {
      target: 'upcoming',
      title: 'Your week — 3 privates.',
      body: 'Today at 6pm with Ryan, Saturday with Maria, and a Sunday open mat. Tap any row to DM the student or pull up session notes.',
      cta: 'Next →',
    },
    {
      target: 'endorsements',
      title: `${received.length} endorsements on file.`,
      body: `Including ${barEndorser}'s from last week. Endorsements are permanent — they show on your public profile with a mono-serial stamp and the endorser's record.`,
      cta: 'Next →',
    },
    {
      target: 'quick-actions',
      title: 'Drop content. Set rates.',
      body: 'Add content to push a new crucifix clip or schedule a seminar. Edit rates any time — the change is live within seconds.',
      cta: 'Done — start using Grapplers',
    },
  ];

  const [i, setI] = useState(0);
  const [rect, setRect] = useState(null);
  const scrollParentRef = useRef(null);

  // Recompute target rect on step change + scroll + resize.
  React.useEffect(() => {
    const compute = () => {
      const key = steps[i].target;
      if (!key) { setRect(null); return; }
      const el = document.querySelector(`[data-tour="${key}"]`);
      if (!el) { setRect(null); return; }
      const r = el.getBoundingClientRect();
      setRect({
        top: r.top, left: r.left, width: r.width, height: r.height,
      });
    };

    // Scroll the target element into view, then compute after a couple frames.
    const key = steps[i].target;
    if (key) {
      const el = document.querySelector(`[data-tour="${key}"]`);
      if (el) { try { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e) {} }
    }
    compute();
    const t1 = setTimeout(compute, 260);
    const t2 = setTimeout(compute, 520);
    window.addEventListener('resize', compute);
    // Also listen for scroll on any ancestor scroll container
    window.addEventListener('scroll', compute, true);
    return () => {
      window.removeEventListener('resize', compute);
      window.removeEventListener('scroll', compute, true);
      clearTimeout(t1); clearTimeout(t2);
    };
  }, [i]);

  const next = () => {
    if (i < steps.length - 1) setI(i + 1);
    else { window.markWalkthroughSeen(); onDone(); }
  };
  const skip = () => { window.markWalkthroughSeen(); onDone(); };

  const step = steps[i];
  const hasSpot = !!rect && !!step.target;

  // Viewport-relative placement. Prefer placing tooltip below the spot; flip above if it would overflow.
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const tooltipW = 320;
  let tipTop, tipLeft, tipTransform;
  if (hasSpot) {
    const spaceBelow = vh - (rect.top + rect.height);
    const placeBelow = spaceBelow > 240;
    tipTop = placeBelow ? (rect.top + rect.height + 14) : (rect.top - 14);
    tipTransform = placeBelow ? 'none' : 'translateY(-100%)';
    tipLeft = Math.max(12, Math.min(vw - tooltipW - 12, rect.left));
  } else {
    tipTop = '50%';
    tipLeft = '50%';
    tipTransform = 'translate(-50%, -50%)';
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 500,
      pointerEvents: 'auto',
    }} onClick={(e) => { /* click outside tooltip advances, not skips */ if (e.target === e.currentTarget) next(); }}>
      {/* Dim overlay — cut-out around target via huge spread-shadow. */}
      {hasSpot ? (
        <div style={{
          position: 'fixed',
          top: rect.top - 6, left: rect.left - 6,
          width: rect.width + 12, height: rect.height + 12,
          borderRadius: 10, pointerEvents: 'none',
          boxShadow: '0 0 0 9999px rgba(0,0,0,0.82)',
          outline: '2px solid var(--g-mat-hi)',
          outlineOffset: 0,
          animation: 'gSpot 340ms cubic-bezier(0.2,0.7,0.2,1)',
        }} />
      ) : (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)' }} />
      )}
      <style>{`
        @keyframes gSpot { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: none; } }
        @keyframes gTipIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
      `}</style>

      {/* Tooltip card — placed adjacent to the spot, or centered for full-screen step. */}
      <div style={{
        position: 'fixed',
        left: tipLeft, top: tipTop, transform: tipTransform,
        width: tooltipW, maxWidth: '90vw',
        background: 'var(--g-graphite)',
        border: '1px solid var(--g-border-chrome)',
        borderRadius: 14, padding: 16,
        boxShadow: '0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(30,111,255,0.25)',
        animation: 'gTipIn 260ms cubic-bezier(0.2,0.7,0.2,1) both',
        animationDelay: '120ms',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div className="g-eyebrow" style={{ color: 'var(--g-mat-hi)', letterSpacing: '0.2em' }}>
            ◈ STEP {i + 1} OF {steps.length}
          </div>
          <button onClick={skip} style={{
            background: 'transparent', border: 'none', color: 'var(--g-fg-3)',
            fontSize: 10, fontFamily: 'var(--g-mono)', letterSpacing: '0.1em',
            cursor: 'pointer', padding: 4,
          }}>SKIP</button>
        </div>
        <div className="g-condensed" style={{ fontSize: 22, color: 'var(--g-fg-1)', lineHeight: 1.02, marginBottom: 8 }}>
          {step.title}
        </div>
        <div style={{ fontSize: 13, color: 'var(--g-fg-2)', lineHeight: 1.45, marginBottom: 14 }}>
          {step.body}
        </div>
        {/* Progress dots */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
          {steps.map((_, n) => (
            <div key={n} style={{
              flex: 1, height: 2, borderRadius: 1,
              background: n <= i ? 'var(--g-mat)' : 'var(--g-graphite-2)',
            }} />
          ))}
        </div>
        <GBtn variant="mat" size="md" onClick={next} style={{ width: '100%' }}>{step.cta}</GBtn>
      </div>
    </div>
  );
}

Object.assign(window, { ClaimProfileScreen, Walkthrough });
