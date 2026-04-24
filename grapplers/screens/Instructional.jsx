// Grapplers — Instructional detail + purchase, Booking flow, Messages, Onboarding

function InstructionalCard({ instructional: i, onOpen, compact = false }) {
  const author = window.gAthlete(i.author);
  const state = window.useGStore();
  const owned = state.purchased.has(i.id);
  const coverGrad = {
    leg:    'linear-gradient(135deg, #0B1E3C, #1E6FFF 120%)',
    guard:  'linear-gradient(135deg, #2a1a0a, #6B4423 120%)',
    cradle: 'linear-gradient(135deg, #1a1a1a, #7738B6 120%)',
    worm:   'linear-gradient(135deg, #0a0a0a, #b8252a 120%)',
  }[i.cover] || 'linear-gradient(135deg, #0a0a0a, #333)';

  return (
    <div onClick={onOpen} style={{
      display: 'flex', gap: 12, padding: compact ? 10 : 12,
      background: 'var(--g-graphite)', border: '1px solid var(--g-border)',
      borderRadius: 12, marginBottom: 10, cursor: 'pointer',
    }}>
      <div style={{
        width: compact ? 72 : 96, aspectRatio: '3/4', borderRadius: 6, flexShrink: 0,
        background: coverGrad, position: 'relative', overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.1), transparent 60%)' }} />
        <div style={{
          position: 'absolute', top: 6, left: 6, right: 6,
          fontFamily: 'var(--g-condensed)', fontWeight: 800, fontSize: compact ? 10 : 13,
          color: '#fff', letterSpacing: '-0.01em', lineHeight: 1, textTransform: 'uppercase',
        }}>{i.title.split(' ').slice(0, 4).join(' ')}</div>
        <div style={{
          position: 'absolute', bottom: 6, left: 6,
          fontFamily: 'var(--g-mono)', fontSize: 8, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.1em',
        }}>{i.chapters} CH · {i.duration}</div>
      </div>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ fontSize: compact ? 13 : 15, fontWeight: 600, color: 'var(--g-fg-1)', lineHeight: 1.25 }}>{i.title}</div>
        <div style={{ fontSize: 11, color: 'var(--g-fg-3)', fontFamily: 'var(--g-mono)' }}>by {author.name}</div>
        <div style={{ fontSize: 12, color: 'var(--g-fg-2)', lineHeight: 1.4, marginTop: 2 }}>{i.tagline}</div>
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          {owned ? (
            <span className="g-eyebrow" style={{ color: 'var(--g-mat-hi)', letterSpacing: '0.2em' }}>◈ OWNED</span>
          ) : (
            <span style={{
              fontFamily: 'var(--g-display)', fontWeight: 700, fontSize: 15, color: 'var(--g-fg-1)',
            }}>${i.price}</span>
          )}
          <span style={{ marginLeft: 'auto', color: 'var(--g-fg-3)', fontSize: 14 }}>→</span>
        </div>
      </div>
    </div>
  );
}

function InstructionalDetail({ instructional: i, onBack, onPurchaseComplete }) {
  const author = window.gAthlete(i.author);
  const state = window.useGStore();
  const owned = state.purchased.has(i.id);
  const [stage, setStage] = useState(owned ? 'owned' : 'browse'); // browse → pay → success/owned
  const [playing, setPlaying] = useState(null); // { idx, title, duration }

  const purchase = () => {
    setStage('pay');
    setTimeout(() => {
      window.GStore.set(s => {
        const next = new Set(s.purchased);
        next.add(i.id);
        return { purchased: next };
      });
      setStage('success');
    }, 1400);
  };

  const chapterTitles = [
    'Framework & dominant top position',
    'Reverse half — getting there from everywhere',
    'Crucifix entries: turtle, side, half',
    "The M-plata & its cousins",
    "D'arce from the High Ground",
    'Defending the comeback · escape chains',
  ];
  const playChapter = (n) => {
    // Chapter 1 is free for everyone; others require ownership
    if (n > 0 && !owned) {
      window.gToast('Purchase to unlock this chapter');
      return;
    }
    setPlaying({ idx: n, title: chapterTitles[n], duration: `${18 + n * 3}:${String(20 + n).padStart(2, '0')}` });
  };

  return (
    <div style={{ height: '100%', overflowY: 'auto', paddingBottom: 120 }} className="g-scroll">
      <div style={{
        position: 'relative', height: 380,
        background: 'linear-gradient(180deg, #0B1E3C 0%, #050608 90%)',
      }}>
        <button onClick={onBack} style={{
          position: 'absolute', top: 56, left: 16, width: 36, height: 36, borderRadius: '50%',
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(20px)',
          border: '1px solid var(--g-border)', color: '#fff', fontSize: 14, cursor: 'pointer', zIndex: 10,
        }}>←</button>
        {/* cover */}
        <div style={{
          position: 'absolute', top: 100, left: '50%', transform: 'translateX(-50%)',
          width: 180, aspectRatio: '3/4', borderRadius: 8,
          background: 'linear-gradient(135deg, #0B1E3C, #1E6FFF 120%)',
          boxShadow: '0 30px 80px rgba(30,111,255,0.4), 0 0 0 1px rgba(255,255,255,0.1)',
          padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          <div>
            <div className="g-eyebrow" style={{ color: 'rgba(255,255,255,0.6)' }}>◈ GRAPPLERS · V.01</div>
            <div className="g-condensed" style={{ fontSize: 24, color: '#fff', marginTop: 10, lineHeight: 0.95 }}>
              {i.title.toUpperCase()}
            </div>
          </div>
          <div style={{ fontFamily: 'var(--g-mono)', fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>
            {author.name.toUpperCase()}<br/>
            {i.chapters} CHAPTERS · {i.duration}
          </div>
        </div>
      </div>

      <div style={{ padding: '30px 20px 0' }}>
        <div style={{ fontSize: 14, color: 'var(--g-fg-2)', lineHeight: 1.5, marginBottom: 14 }}>{i.tagline}</div>
        <div onClick={() => {}} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderTop: '1px solid var(--g-border)', borderBottom: '1px solid var(--g-border)' }}>
          <GAvatar athlete={author} size={32} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{author.name}</span>
              {author.verified && <VerifiedMark size={11} />}
            </div>
            <div style={{ fontSize: 10, color: 'var(--g-fg-3)', fontFamily: 'var(--g-mono)' }}>{author.gym}</div>
          </div>
          <BeltChip rank={author.belt} degree={author.degree} />
        </div>

        <div style={{ marginTop: 20 }}>
          <div className="g-eyebrow" style={{ marginBottom: 10 }}>◇ CHAPTERS · {i.chapters}</div>
          {chapterTitles.map((c, n) => {
            const locked = n > 0 && !owned;
            return (
              <button key={n} onClick={() => playChapter(n)} style={{
                width: '100%', background: 'transparent', border: 'none', textAlign: 'left',
                display: 'flex', gap: 12, padding: '10px 0', borderBottom: n < 5 ? '1px solid var(--g-border)' : 'none',
                color: 'inherit', cursor: 'pointer',
                opacity: locked ? 0.6 : 1,
              }}>
                <span style={{ fontFamily: 'var(--g-mono)', fontSize: 11, color: 'var(--g-fg-3)', width: 28 }}>0{n+1}</span>
                <span style={{ flex: 1, fontSize: 13, color: 'var(--g-fg-1)' }}>{c}</span>
                <span style={{ fontFamily: 'var(--g-mono)', fontSize: 10, color: 'var(--g-fg-3)' }}>{18 + n * 3}:{String(20 + n).padStart(2, '0')}</span>
                {n === 0 && <span style={{ color: 'var(--g-mat-hi)', fontSize: 10, fontFamily: 'var(--g-mono)' }}>◉ FREE</span>}
                {locked && <span style={{ color: 'var(--g-fg-3)', fontSize: 11, fontFamily: 'var(--g-mono)' }}>◇ LOCKED</span>}
                {!locked && <span style={{ color: 'var(--g-mat-hi)', fontSize: 12 }}>▶</span>}
              </button>
            );
          })}
        </div>
      </div>
      {playing && (
        <VideoPlayer
          title={playing.title}
          subtitle={`${i.title} · Ch. ${playing.idx + 1} · ${playing.duration}`}
          onClose={() => setPlaying(null)}
        />
      )}

      {/* purchase bar — sticky bottom */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px 16px 34px',
        background: 'linear-gradient(180deg, transparent 0%, var(--g-carbon) 40%)',
        display: 'flex', alignItems: 'center', gap: 10, zIndex: 30,
      }}>
        {stage === 'browse' && (
          <>
            <div style={{ flex: 1 }}>
              <div className="g-eyebrow" style={{ marginBottom: 2 }}>INSTANT ACCESS</div>
              <div className="g-condensed" style={{ fontSize: 28, color: 'var(--g-fg-1)' }}>${i.price}</div>
            </div>
            <GBtn variant="mat" size="lg" onClick={purchase}>Purchase →</GBtn>
          </>
        )}
        {stage === 'pay' && (
          <div style={{ width: '100%', textAlign: 'center', padding: 14 }}>
            <div className="g-eyebrow" style={{ color: 'var(--g-mat-hi)', marginBottom: 6 }}>◉ PROCESSING · APPLE PAY</div>
            <div style={{ width: '100%', height: 2, background: 'var(--g-graphite-2)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', background: 'var(--g-mat)', width: '100%', animation: 'gLoad 1.4s ease-out forwards' }} />
            </div>
            <style>{`@keyframes gLoad { from { transform: translateX(-100%); } to { transform: translateX(0); } }`}</style>
          </div>
        )}
        {stage === 'success' && (
          <div style={{ flex: 1, display: 'flex', gap: 10, alignItems: 'center' }}>
            <EndorsementStamp from={{ name: 'RECEIPT · ' + i.id.toUpperCase() }} date="APR 24 · 2026" serial={`GRP-INST-${Math.floor(Math.random() * 9000 + 1000)}`} compact />
            <GBtn variant="chrome" size="md" onClick={() => playChapter(0)}>Watch →</GBtn>
          </div>
        )}
        {stage === 'owned' && (
          <GBtn variant="chrome" size="lg" style={{ flex: 1 }} onClick={() => playChapter(2)}>▶  Continue · Ch. 3 of {i.chapters}</GBtn>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Booking flow
// ─────────────────────────────────────────────────────────────
function BookingScreen({ athlete, onBack, onComplete }) {
  const [step, setStep] = useState(1); // 1 type, 2 date, 3 time, 4 pay, 5 confirm
  const [kind, setKind] = useState('private');
  const [date, setDate] = useState(null);
  const [slot, setSlot] = useState(null);

  const kinds = [
    { id: 'private', label: 'Private Lesson', dur: '60 min', price: athlete.rate, desc: '1-on-1 at their gym or yours' },
    { id: 'group',   label: 'Small Group',    dur: '90 min', price: Math.round(athlete.rate * 0.6), desc: '2–4 students · split the rate' },
    { id: 'seminar', label: 'Seminar Slot',   dur: '3 hr',  price: 65, desc: 'Book a spot in an upcoming seminar' },
  ];
  const selected = kinds.find(k => k.id === kind);

  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(2026, 3, 25 + i);
    return {
      iso: d.toISOString().slice(0, 10),
      day: ['SUN','MON','TUE','WED','THU','FRI','SAT'][d.getDay()],
      n: d.getDate(),
      m: ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'][d.getMonth()],
      avail: [2, 3, 4, 7, 8, 10, 11].includes(i),
    };
  });
  const slots = ['7:00 AM', '10:30 AM', '12:00 PM', '4:00 PM', '6:00 PM', '7:30 PM'];

  const confirm = () => {
    setStep(5);
    window.GStore.set(s => ({
      bookings: [...s.bookings, { athleteId: athlete.id, kind, date, slot, price: selected.price }],
    }));
  };

  return (
    <div style={{ height: '100%', overflowY: 'auto', paddingBottom: 110 }} className="g-scroll">
      {/* header */}
      <div style={{ padding: '56px 16px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={step === 1 ? onBack : () => setStep(step - 1)} style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'var(--g-graphite)', border: '1px solid var(--g-border)',
          color: 'var(--g-fg-1)', fontSize: 14, cursor: 'pointer',
        }}>←</button>
        <div style={{ flex: 1 }}>
          <div className="g-eyebrow">STEP {step} OF 4 · BOOKING</div>
          <div className="g-condensed" style={{ fontSize: 22, color: 'var(--g-fg-1)' }}>
            {['','SESSION TYPE','PICK A DATE','PICK A TIME','CONFIRM','BOOKED'][step]}
          </div>
        </div>
      </div>

      {/* progress dots */}
      <div style={{ display: 'flex', gap: 4, padding: '0 16px 18px' }}>
        {[1,2,3,4].map(n => (
          <div key={n} style={{ flex: 1, height: 2, background: n <= step ? 'var(--g-mat)' : 'var(--g-graphite-2)', borderRadius: 2 }} />
        ))}
      </div>

      <div style={{ padding: '0 16px' }}>
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{
              padding: 12, display: 'flex', alignItems: 'center', gap: 12,
              background: 'var(--g-graphite)', border: '1px solid var(--g-border)', borderRadius: 12, marginBottom: 6,
            }}>
              <GAvatar athlete={athlete} size={44} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{athlete.name}</div>
                <div style={{ fontSize: 11, color: 'var(--g-fg-3)', fontFamily: 'var(--g-mono)' }}>{athlete.gym}</div>
              </div>
              <BeltChip rank={athlete.belt} degree={athlete.degree} />
            </div>
            {kinds.map(k => (
              <div key={k.id} onClick={() => setKind(k.id)} style={{
                padding: 14, borderRadius: 12, cursor: 'pointer',
                background: kind === k.id ? 'linear-gradient(180deg, rgba(30,111,255,0.1), var(--g-graphite))' : 'var(--g-graphite)',
                border: kind === k.id ? '1px solid var(--g-mat)' : '1px solid var(--g-border)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--g-fg-1)' }}>{k.label}</div>
                  <div style={{ fontFamily: 'var(--g-display)', fontWeight: 700, fontSize: 16 }}>${k.price}</div>
                </div>
                <div style={{ fontSize: 11, color: 'var(--g-fg-3)', fontFamily: 'var(--g-mono)', marginTop: 3 }}>{k.dur.toUpperCase()} · {k.desc}</div>
              </div>
            ))}
            <GBtn variant="mat" size="lg" onClick={() => setStep(2)} style={{ marginTop: 10 }}>Continue →</GBtn>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="g-eyebrow" style={{ marginBottom: 10 }}>◇ AVAILABLE · NEXT 14 DAYS</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {days.map(d => (
                <div key={d.iso} onClick={() => d.avail && setDate(d)} style={{
                  padding: '10px 4px', borderRadius: 8, textAlign: 'center', cursor: d.avail ? 'pointer' : 'not-allowed',
                  opacity: d.avail ? 1 : 0.35,
                  background: date?.iso === d.iso ? 'var(--g-mat)' : 'var(--g-graphite)',
                  border: '1px solid ' + (date?.iso === d.iso ? 'var(--g-mat)' : 'var(--g-border)'),
                }}>
                  <div style={{ fontSize: 9, fontFamily: 'var(--g-mono)', letterSpacing: '0.1em', color: date?.iso === d.iso ? '#fff' : 'var(--g-fg-3)' }}>{d.day}</div>
                  <div style={{ fontSize: 20, fontFamily: 'var(--g-display)', fontWeight: 700, color: date?.iso === d.iso ? '#fff' : 'var(--g-fg-1)' }}>{d.n}</div>
                  <div style={{ fontSize: 9, fontFamily: 'var(--g-mono)', color: date?.iso === d.iso ? 'rgba(255,255,255,0.8)' : 'var(--g-fg-3)' }}>{d.m}</div>
                </div>
              ))}
            </div>
            <GBtn variant="mat" size="lg" disabled={!date} onClick={() => setStep(3)} style={{ marginTop: 20, width: '100%' }}>Continue →</GBtn>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="g-eyebrow" style={{ marginBottom: 10 }}>
              ◇ {date.day} {date.m} {date.n} · {athlete.gym.split('·')[0].trim()}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {slots.map(s => (
                <div key={s} onClick={() => setSlot(s)} style={{
                  padding: '14px', borderRadius: 8, textAlign: 'center', cursor: 'pointer',
                  background: slot === s ? 'var(--g-mat)' : 'var(--g-graphite)',
                  border: '1px solid ' + (slot === s ? 'var(--g-mat)' : 'var(--g-border)'),
                  fontFamily: 'var(--g-display)', fontWeight: 600, fontSize: 14,
                  color: slot === s ? '#fff' : 'var(--g-fg-1)',
                }}>{s}</div>
              ))}
            </div>
            <GBtn variant="mat" size="lg" disabled={!slot} onClick={() => setStep(4)} style={{ marginTop: 20, width: '100%' }}>Review →</GBtn>
          </div>
        )}

        {step === 4 && (
          <div>
            <div style={{
              padding: 16, borderRadius: 12, background: 'var(--g-graphite)',
              border: '1px solid var(--g-border)', marginBottom: 14,
            }}>
              <div className="g-eyebrow" style={{ marginBottom: 10 }}>◇ BOOKING SUMMARY</div>
              {[
                ['Athlete', athlete.name],
                ['Session', selected.label],
                ['Date', `${date.day} ${date.m} ${date.n}, 2026`],
                ['Time', slot],
                ['Location', athlete.gym.split('·')[0].trim()],
                ['Duration', selected.dur],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px dashed var(--g-border)' }}>
                  <span style={{ fontSize: 11, color: 'var(--g-fg-3)', fontFamily: 'var(--g-mono)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{k}</span>
                  <span style={{ fontSize: 12, color: 'var(--g-fg-1)', fontWeight: 500, textAlign: 'right' }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{
              padding: 16, borderRadius: 12, background: 'var(--g-graphite)',
              border: '1px solid var(--g-border)', marginBottom: 14,
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
            }}>
              <div>
                <div className="g-eyebrow">TOTAL · USD</div>
                <div style={{ fontSize: 11, color: 'var(--g-fg-3)', fontFamily: 'var(--g-mono)', marginTop: 2 }}>no per-seat · no fees</div>
              </div>
              <div className="g-condensed" style={{ fontSize: 38, color: 'var(--g-fg-1)' }}>${selected.price}</div>
            </div>
            <GBtn variant="chrome" size="lg" onClick={confirm} style={{ width: '100%' }}>Pay & Book →</GBtn>
          </div>
        )}

        {step === 5 && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{
              width: 80, height: 80, margin: '0 auto 20px', borderRadius: '50%',
              background: 'var(--g-gradient-chrome)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, color: '#1a1a1a', fontWeight: 800,
              boxShadow: 'var(--g-shadow-chrome)',
            }}>◈</div>
            <div className="g-condensed" style={{ fontSize: 30, color: 'var(--g-fg-1)', marginBottom: 6 }}>BOOKED.</div>
            <div style={{ fontSize: 13, color: 'var(--g-fg-2)', marginBottom: 20 }}>
              {athlete.name.split(' ')[0]} will confirm within 2 hours.
            </div>
            <div style={{ textAlign: 'left', margin: '0 auto', maxWidth: 280 }}>
              <EndorsementStamp from={{ name: 'BOOKING CONFIRMED' }} date={`${date.m} ${date.n} · ${slot}`} serial={`GRP-BK-${Math.floor(Math.random() * 90000 + 10000)}`} />
            </div>
            <GBtn variant="ghost" size="md" onClick={onComplete} style={{ marginTop: 24 }}>Back to app</GBtn>
          </div>
        )}
      </div>
    </div>
  );
}

// Endorse overlay — athlete action
function EndorseOverlay({ target, from, onClose }) {
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const submit = () => {
    if (!note.trim()) return;
    const serial = `GRP-${String(Math.floor(Math.random() * 9000 + 1000)).padStart(4, '0')}-ENDR`;
    const now = new Date();
    const date = `${['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'][now.getMonth()]} ${now.getDate()} · ${now.getFullYear()}`;
    window.GStore.set(s => ({
      endorsements: [{ from: from.id, to: target.id, note, date, serial }, ...s.endorsements],
    }));
    setSubmitted(true);
  };

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'flex-end',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', background: 'var(--g-graphite)',
        borderTop: '1px solid var(--g-border-chrome)',
        borderRadius: '24px 24px 0 0', padding: 20, paddingBottom: 34,
        animation: 'gSlideUp 300ms cubic-bezier(0.2,0.7,0.2,1)',
      }}>
        <style>{`@keyframes gSlideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>
        <div style={{ width: 40, height: 4, background: 'var(--g-border-strong)', borderRadius: 2, margin: '0 auto 16px' }} />
        {!submitted ? (
          <>
            <div className="g-eyebrow" style={{ color: 'var(--g-mat-hi)', marginBottom: 6 }}>◈ FILE ENDORSEMENT</div>
            <div className="g-condensed" style={{ fontSize: 26, color: 'var(--g-fg-1)', marginBottom: 6 }}>
              ENDORSE {target.name.toUpperCase()}
            </div>
            <div style={{ fontSize: 12, color: 'var(--g-fg-2)', marginBottom: 16 }}>
              Your endorsement is public & permanent. It will carry your belt and record.
            </div>
            <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="What do they do better than anyone? Be specific." style={{
              width: '100%', minHeight: 90, resize: 'none',
              background: 'var(--g-carbon)', border: '1px solid var(--g-border)',
              borderRadius: 8, padding: 12, color: 'var(--g-fg-1)',
              fontFamily: 'var(--g-sans)', fontSize: 13, lineHeight: 1.5,
            }} />
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <GBtn variant="ghost" size="md" onClick={onClose} style={{ flex: 1 }}>Cancel</GBtn>
              <GBtn variant="mat" size="md" disabled={!note.trim()} onClick={submit} style={{ flex: 2 }}>File Endorsement ◈</GBtn>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div className="g-eyebrow" style={{ color: 'var(--g-mat-hi)', marginBottom: 12 }}>◈ FILED · ON THE RECORD</div>
            <div style={{ margin: '0 auto', maxWidth: 280, textAlign: 'left' }}>
              <EndorsementStamp from={from} />
            </div>
            <GBtn variant="ghost" size="md" onClick={onClose} style={{ marginTop: 20 }}>Done</GBtn>
          </div>
        )}
      </div>
    </div>
  );
}

// Faux video player — animated mat pattern, scrubber, play/pause, close.
function VideoPlayer({ title, subtitle, onClose }) {
  const [playing, setPlaying] = useState(true);
  const [t, setT] = useState(0); // seconds elapsed (mocked)
  const total = 120; // 2 min mock
  useEffect(() => {
    if (!playing) return;
    const h = setInterval(() => setT(x => (x + 1) >= total ? 0 : x + 1), 1000);
    return () => clearInterval(h);
  }, [playing]);
  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 200,
      background: '#000', display: 'flex', flexDirection: 'column',
    }}>
      {/* Top bar */}
      <div style={{ padding: '56px 16px 12px', display: 'flex', alignItems: 'center', gap: 12, background: 'linear-gradient(180deg, rgba(0,0,0,0.8), transparent)' }}>
        <button onClick={onClose} style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
          color: '#fff', fontSize: 16, cursor: 'pointer',
        }}>×</button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, color: '#fff', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--g-mono)', letterSpacing: '0.06em' }}>{subtitle}</div>
        </div>
      </div>
      {/* Video surface */}
      <div style={{
        flex: 1, position: 'relative', overflow: 'hidden',
        background: 'radial-gradient(ellipse at 50% 50%, #0b1428 0%, #000 80%)',
      }}>
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: playing ? 0.5 : 0.25, transition: 'opacity 300ms ease' }}>
          <defs>
            <pattern id="playgrid" width="28" height="28" patternUnits="userSpaceOnUse">
              <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#1E6FFF" strokeWidth="0.6"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#playgrid)" />
        </svg>
        {/* Moving figures */}
        <div style={{
          position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
          fontFamily: 'var(--g-condensed)', fontSize: 80, color: 'rgba(255,255,255,0.12)',
          fontWeight: 900, letterSpacing: '-0.05em', userSelect: 'none', pointerEvents: 'none',
        }}>◈◈◈</div>
        <button onClick={() => setPlaying(p => !p)} style={{
          position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
          width: 80, height: 80, borderRadius: '50%',
          background: 'rgba(0,0,0,0.6)', border: '1.5px solid rgba(255,255,255,0.6)',
          color: '#fff', fontSize: 28, cursor: 'pointer', paddingLeft: playing ? 0 : 4,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(6px)',
          opacity: playing ? 0 : 1, transition: 'opacity 200ms ease',
        }}>{playing ? '❚❚' : '▶'}</button>
        {/* Tap overlay to toggle when playing */}
        {playing && (
          <div onClick={() => setPlaying(false)} style={{ position: 'absolute', inset: 0, cursor: 'pointer' }} />
        )}
      </div>
      {/* Scrubber */}
      <div style={{ padding: '12px 18px 30px', background: 'linear-gradient(0deg, rgba(0,0,0,0.85), transparent)' }}>
        <div onClick={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const pct = (e.clientX - r.left) / r.width;
          setT(Math.max(0, Math.min(total - 1, Math.round(pct * total))));
        }} style={{ height: 14, display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <div style={{ position: 'relative', width: '100%', height: 3, background: 'rgba(255,255,255,0.2)', borderRadius: 2 }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${(t / total) * 100}%`, background: 'var(--g-mat)', borderRadius: 2 }} />
            <div style={{ position: 'absolute', left: `calc(${(t / total) * 100}% - 6px)`, top: -4.5, width: 12, height: 12, borderRadius: '50%', background: '#fff' }} />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--g-mono)', fontSize: 10, color: 'rgba(255,255,255,0.7)', marginTop: 6, letterSpacing: '0.04em' }}>
          <span>{fmt(t)}</span>
          <span>-{fmt(total - t)}</span>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { InstructionalCard, InstructionalDetail, BookingScreen, EndorseOverlay, VideoPlayer });
