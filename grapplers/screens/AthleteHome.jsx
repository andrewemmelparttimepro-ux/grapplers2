// Grapplers — Athlete "My Earnings" dashboard for athlete-role phone

function AthleteHomeScreen({ onViewMyProfile, onOpenMessages, onOpenUpload, onEditRates }) {
  const state = window.useGStore();
  // Assume current athlete is a01
  const me = window.gAthlete('a01');
  const received = state.endorsements.filter(e => e.to === me.id);
  const bookings = (state.bookings || []).filter(b => b.athleteId === me.id);

  // Compute earnings dynamically
  const baseline = 3240;
  const extra = bookings.reduce((sum, b) => sum + (b.price || 0), 0);
  const total = baseline + extra;

  return (
    <div style={{ height: '100%', overflowY: 'auto', paddingBottom: 110 }} className="g-scroll">
      <div style={{ padding: '56px 16px 14px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div className="g-eyebrow" style={{ color: 'var(--g-mat-hi)', marginBottom: 6 }}>◈ ATHLETE · TODAY</div>
          <div className="g-condensed" style={{ fontSize: 34, color: 'var(--g-fg-1)', lineHeight: 0.95 }}>
            WELCOME BACK,<br/>{me.name.split(' ')[0].toUpperCase()}.
          </div>
        </div>
        <button onClick={onViewMyProfile} title="My profile" style={{
          width: 44, height: 44, borderRadius: '50%',
          background: 'var(--g-graphite)', border: '1px solid var(--g-border)',
          padding: 0, overflow: 'hidden', cursor: 'pointer', flexShrink: 0,
        }}>
          <GAvatar athlete={me} size={44} />
        </button>
      </div>

      {/* Earnings card */}
      <div style={{ margin: '0 16px 14px', padding: 18, borderRadius: 16, background: 'linear-gradient(135deg, #0B1E3C 0%, var(--g-graphite) 100%)', border: '1px solid rgba(30,111,255,0.3)' }}>
        <div className="g-eyebrow" style={{ marginBottom: 8 }}>◇ APRIL EARNINGS · NET</div>
        <div className="g-condensed" style={{ fontSize: 48, color: '#fff', lineHeight: 1 }}>${total.toLocaleString()}</div>
        <div style={{ fontSize: 11, color: 'var(--g-fg-2)', fontFamily: 'var(--g-mono)', marginTop: 6 }}>
          ▲ 28% VS MARCH · {18 + bookings.length} PRIVATES · 12 INSTRUCTIONAL SALES
        </div>
        {bookings.length > 0 && (
          <div style={{ marginTop: 10, fontFamily: 'var(--g-mono)', fontSize: 10, color: 'var(--g-mat-hi)', letterSpacing: '0.1em' }}>
            ◈ {bookings.length} NEW BOOKING{bookings.length === 1 ? '' : 'S'} THIS SESSION · +${extra}
          </div>
        )}
      </div>

      {/* Upcoming */}
      <div style={{ padding: '0 16px' }}>
        <div className="g-eyebrow" style={{ marginBottom: 10 }}>◇ UPCOMING · 3</div>
        {[
          { when: 'TODAY · 6:00 PM', who: 'Kyle Bergstrom', kind: '60 min · Private · Leg locks' },
          { when: 'SAT · 10:30 AM', who: 'Maria Tuttle', kind: '60 min · Private · Guard retention' },
          { when: 'SUN · 9:00 AM', who: 'Open Mat', kind: '120 min · Group · $25/head · 4 booked' },
        ].map((b, i) => (
          <button key={i} onClick={() => window.gToast(`${b.who} · ${b.when}`)} style={{
            width: '100%', background: 'transparent', border: 'none', textAlign: 'left',
            display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--g-border)',
            cursor: 'pointer', color: 'inherit',
          }}>
            <div style={{ width: 80, fontFamily: 'var(--g-mono)', fontSize: 10, color: 'var(--g-mat-hi)', letterSpacing: '0.08em', paddingTop: 2 }}>{b.when}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: 'var(--g-fg-1)', fontWeight: 500 }}>{b.who}</div>
              <div style={{ fontSize: 11, color: 'var(--g-fg-3)', fontFamily: 'var(--g-mono)' }}>{b.kind}</div>
            </div>
            <span style={{ color: 'var(--g-fg-3)', fontSize: 14, alignSelf: 'center' }}>→</span>
          </button>
        ))}
      </div>

      {/* Recent endorsements received */}
      <div style={{ padding: '18px 16px 0' }}>
        <div className="g-eyebrow" style={{ marginBottom: 10 }}>◈ ENDORSEMENTS · {received.length} ON FILE</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {received.length === 0 && (
            <div style={{ padding: 20, color: 'var(--g-fg-3)', fontFamily: 'var(--g-mono)', fontSize: 11, textAlign: 'center' }}>
              ◇ AWAITING FIRST ENDORSEMENT ◇
            </div>
          )}
          {received.slice(0, 2).map((e, i) => (
            <button key={i} onClick={onViewMyProfile} style={{
              background: 'transparent', border: 'none', padding: 0, width: '100%', cursor: 'pointer', textAlign: 'left',
            }}>
              <EndorsementStamp from={e.from} date={e.date} serial={e.serial} />
            </button>
          ))}
          {received.length > 2 && (
            <button onClick={onViewMyProfile} style={{
              background: 'transparent', border: 'none', color: 'var(--g-mat-hi)',
              fontSize: 11, fontFamily: 'var(--g-mono)', letterSpacing: '0.1em',
              cursor: 'pointer', padding: '4px 0',
            }}>VIEW ALL {received.length} →</button>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ padding: '18px 16px 0', display: 'flex', gap: 8 }}>
        <GBtn variant="mat" size="md" style={{ flex: 1 }} onClick={onOpenUpload}>Add content</GBtn>
        <GBtn variant="ghost" size="md" style={{ flex: 1 }} onClick={onEditRates}>Edit rates</GBtn>
      </div>
    </div>
  );
}

Object.assign(window, { AthleteHomeScreen });
