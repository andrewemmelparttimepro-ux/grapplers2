// Grapplers — Athlete Profile screen

function ProfileScreen({ athleteId, onBack, onBookLesson, onBuyInstructional, onEndorse, onOpenThread, viewerRole = 'student' }) {
  const athlete = window.gAthlete(athleteId);
  const state = window.useGStore();
  const following = state.followedAthletes.has(athleteId);
  const receivedEndorsements = state.endorsements.filter(e => e.to === athleteId);
  const athleteInstructionals = window.G_INSTRUCTIONALS.filter(i => i.author === athleteId);
  const [tab, setTab] = useState('about');
  const toggleFollow = () => window.GStore.set(s => {
    const next = new Set(s.followedAthletes);
    next.has(athleteId) ? next.delete(athleteId) : next.add(athleteId);
    return { followedAthletes: next };
  });

  return (
    <div style={{ height: '100%', overflowY: 'auto', paddingBottom: 110 }} className="g-scroll">
      {/* Hero image */}
      <div style={{
        position: 'relative', height: 340,
        background: window.gPlaceholder(athlete.id + 'hero', { hue: 220 }),
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 30%, transparent 0%, rgba(5,6,8,0.4) 70%, var(--g-carbon) 100%)' }} />
        <div style={{ position: 'absolute', top: 56, left: 16, right: 16, display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={onBack} style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(20px)',
            border: '1px solid var(--g-border)', color: '#fff', fontSize: 14, cursor: 'pointer',
          }}>←</button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => onOpenThread ? onOpenThread(athlete) : window.gToast('DM: open from Messages tab')} style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(20px)',
              border: '1px solid var(--g-border)', color: '#fff', fontSize: 14, cursor: 'pointer',
            }}>✉</button>
            <button onClick={() => {
              const url = `${location.origin}${location.pathname}?r=app&profile=${athlete.id}`;
              if (navigator.share) navigator.share({ title: `${athlete.name} on Grapplers`, url }).catch(() => {});
              else { navigator.clipboard?.writeText(url); window.gToast('Profile link copied'); }
            }} style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(20px)',
              border: '1px solid var(--g-border)', color: '#fff', fontSize: 16, cursor: 'pointer',
            }}>⋯</button>
          </div>
        </div>

        {/* Name lockup */}
        <div style={{ position: 'absolute', bottom: 18, left: 18, right: 18 }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
            <BeltChip rank={athlete.belt} degree={athlete.degree} />
            {athlete.verified && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '2px 8px', borderRadius: 2,
                background: 'rgba(30,111,255,0.15)', color: 'var(--g-mat-hi)',
                border: '1px solid rgba(30,111,255,0.4)',
                fontSize: 9, fontFamily: 'var(--g-display)', fontWeight: 600,
                letterSpacing: '0.16em', textTransform: 'uppercase',
              }}>◈ VERIFIED</span>
            )}
          </div>
          <div className="g-condensed" style={{ fontSize: 32, color: '#fff', lineHeight: 0.95 }}>
            {athlete.name.toUpperCase()}
          </div>
          <div style={{ fontFamily: 'var(--g-mono)', fontSize: 11, color: 'var(--g-fg-2)', letterSpacing: '0.06em', marginTop: 4 }}>
            {athlete.gym}
          </div>
        </div>
      </div>

      {/* Stat block */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 0, padding: '0 16px', marginTop: -20, position: 'relative', zIndex: 2 }}>
        {[
          { v: window.gFormatRecord(athlete.record), l: 'Record' },
          { v: athlete.record.submissions || '—', l: 'Subs' },
          { v: receivedEndorsements.length, l: 'Endorsed' },
          { v: `$${athlete.rate}`, l: 'Private/hr' },
        ].map((s, i, arr) => (
          <div key={s.l} style={{
            padding: '14px 4px', textAlign: 'center',
            background: 'var(--g-graphite)',
            borderLeft: i === 0 ? '1px solid var(--g-border)' : 'none',
            borderRight: '1px solid var(--g-border)',
            borderTop: '1px solid var(--g-border)',
            borderBottom: '1px solid var(--g-border)',
            borderTopLeftRadius: i === 0 ? 12 : 0,
            borderBottomLeftRadius: i === 0 ? 12 : 0,
            borderTopRightRadius: i === arr.length - 1 ? 12 : 0,
            borderBottomRightRadius: i === arr.length - 1 ? 12 : 0,
          }}>
            <div style={{ fontFamily: 'var(--g-display)', fontWeight: 700, fontSize: 18, color: 'var(--g-fg-1)' }}>{s.v}</div>
            <div style={{ fontSize: 9, fontFamily: 'var(--g-display)', letterSpacing: '0.14em', color: 'var(--g-fg-3)', textTransform: 'uppercase', marginTop: 2 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* CTAs */}
      <div style={{ padding: '16px', display: 'flex', gap: 8 }}>
        <GBtn variant="chrome" size="md" onClick={() => onBookLesson(athlete)} style={{ flex: 2 }}>
          Book private · ${athlete.rate}
        </GBtn>
        <GBtn variant={following ? 'ghost' : 'mat'} size="md" onClick={toggleFollow} style={{ flex: 1 }}>
          {following ? '✓ Following' : 'Follow'}
        </GBtn>
        {viewerRole === 'athlete' && (
          <button onClick={() => onEndorse(athlete)} style={{
            width: 40, height: 40, borderRadius: 999,
            background: 'rgba(30,111,255,0.15)', border: '1px solid rgba(30,111,255,0.4)',
            color: 'var(--g-mat-hi)', fontSize: 16, cursor: 'pointer', flexShrink: 0,
          }} title="Endorse this athlete">◈</button>
        )}
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', padding: '0 16px', borderBottom: '1px solid var(--g-border)', gap: 22 }}>
        {[['about','About'],['record','Record'],['endorsed','Endorsements'],['store','Store']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '12px 0', position: 'relative',
            fontFamily: 'var(--g-display)', fontWeight: 600, fontSize: 11,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            color: tab === k ? 'var(--g-fg-1)' : 'var(--g-fg-3)',
          }}>
            {l}
            {tab === k && <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 2, background: 'var(--g-mat)' }} />}
          </button>
        ))}
      </div>

      <div style={{ padding: 16 }}>
        {tab === 'about' && (
          <div>
            <p style={{ color: 'var(--g-fg-2)', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
              {athlete.bio}
            </p>
            <div className="g-eyebrow" style={{ marginBottom: 10 }}>◇ STYLES</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
              {athlete.styles.map(s => (
                <span key={s} style={{
                  padding: '5px 10px', borderRadius: 4,
                  background: 'var(--g-graphite-2)', border: '1px solid var(--g-border)',
                  fontSize: 11, fontFamily: 'var(--g-display)', fontWeight: 500, letterSpacing: '0.04em',
                  color: 'var(--g-fg-1)',
                }}>{s}</span>
              ))}
            </div>
            <div className="g-eyebrow" style={{ marginBottom: 10 }}>◇ SPECIALTIES</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {athlete.specialties.map((s, i) => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < athlete.specialties.length - 1 ? '1px solid var(--g-border)' : 'none' }}>
                  <span style={{ fontFamily: 'var(--g-mono)', fontSize: 10, color: 'var(--g-fg-3)', width: 24 }}>0{i+1}</span>
                  <span style={{ fontSize: 14, color: 'var(--g-fg-1)', flex: 1 }}>{s}</span>
                  <span style={{ color: 'var(--g-fg-3)', fontSize: 14 }}>→</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'record' && (
          <div>
            <div style={{
              padding: 16, borderRadius: 12, background: 'var(--g-graphite)',
              border: '1px solid var(--g-border)', marginBottom: 14,
            }}>
              <div className="g-eyebrow" style={{ marginBottom: 6 }}>COMPETITION RECORD</div>
              <div className="g-condensed" style={{ fontSize: 44, color: 'var(--g-fg-1)', lineHeight: 1 }}>
                {athlete.record.wins}<span style={{ color: 'var(--g-fg-3)' }}>—</span>{athlete.record.losses}
              </div>
              <div style={{ fontSize: 12, color: 'var(--g-fg-2)', marginTop: 6 }}>{athlete.record.highlight}</div>
            </div>
            <div className="g-eyebrow" style={{ marginBottom: 10 }}>RECENT COMPETITIONS</div>
            {[
              { e: 'ADCC West Coast Trials', r: 'Finalist', d: 'Sep 2024' },
              { e: 'Jiu-Jitsu World League', r: 'Won by heel hook · R2', d: 'Jun 2024' },
              { e: 'IBJJF No-Gi Pan', r: 'Bronze', d: 'Oct 2023' },
            ].map(m => (
              <div key={m.e} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--g-border)' }}>
                <div style={{ fontFamily: 'var(--g-mono)', fontSize: 10, color: 'var(--g-fg-3)', letterSpacing: '0.08em', width: 70 }}>{m.d.toUpperCase()}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: 'var(--g-fg-1)', fontWeight: 500 }}>{m.e}</div>
                  <div style={{ fontSize: 11, color: 'var(--g-mat-hi)', fontFamily: 'var(--g-mono)' }}>{m.r}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'endorsed' && (
          <div>
            <div className="g-eyebrow" style={{ marginBottom: 12, color: 'var(--g-fg-3)' }}>
              {receivedEndorsements.length} ENDORSEMENT{receivedEndorsements.length !== 1 ? 'S' : ''} ON FILE
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {receivedEndorsements.length === 0 && (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--g-fg-3)', fontFamily: 'var(--g-mono)', fontSize: 11 }}>
                  ◇ NO ENDORSEMENTS FILED ◇
                </div>
              )}
              {receivedEndorsements.map((e, i) => (
                <div key={i}>
                  <EndorsementStamp from={e.from} date={e.date} serial={e.serial} />
                  <div style={{ padding: '8px 14px 0', fontSize: 12, color: 'var(--g-fg-2)', fontStyle: 'italic' }}>
                    "{e.note}"
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'store' && (
          <div>
            {athleteInstructionals.length === 0 && (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--g-fg-3)', fontFamily: 'var(--g-mono)', fontSize: 11 }}>
                ◇ NO INSTRUCTIONALS LISTED ◇
              </div>
            )}
            {athleteInstructionals.map(i => (
              <InstructionalCard key={i.id} instructional={i} onOpen={() => onBuyInstructional(i)} compact />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { ProfileScreen });
