// Grapplers — Marketing web page (NDAI-style hero, chrome wordmark, dark). Responsive.

function MarketingPage({ onEnter, onOpenCanvas }) {
  const enter = onEnter || window.__grapplersEnter || (() => {});
  const openCanvas = onOpenCanvas || window.__grapplersCanvas || (() => { location.href = 'Grapplers.html'; });
  const [mobile, setMobile] = React.useState(typeof window !== 'undefined' && window.matchMedia('(max-width: 820px)').matches);
  React.useEffect(() => {
    const mq = window.matchMedia('(max-width: 820px)');
    const on = () => setMobile(mq.matches);
    mq.addEventListener ? mq.addEventListener('change', on) : mq.addListener(on);
    return () => mq.removeEventListener ? mq.removeEventListener('change', on) : mq.removeListener(on);
  }, []);

  return (
    <div style={{ background: 'var(--g-obsidian)', color: 'var(--g-fg-1)', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Nav */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, backdropFilter: 'blur(20px)', background: 'rgba(5,6,8,0.72)', borderBottom: '1px solid var(--g-border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: mobile ? '12px 18px' : '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src="grapplers/icon-512.png" alt="Grapplers" style={{ width: 32, height: 32, borderRadius: 7, display: 'block', objectFit: 'cover' }} />
            <GWordmark size={mobile ? 18 : 20} />
          </div>
          {!mobile && (
            <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
              {[
                ['Athletes', 'featured'],
                ['Instructionals', 'instructionals'],
                ['How it works', 'how'],
                ['For coaches', 'cta'],
              ].map(([l, id]) => (
                <a key={l} href={'#' + id} style={{ fontSize: 13, color: 'var(--g-fg-2)', fontWeight: 500, cursor: 'pointer', letterSpacing: '-0.005em', textDecoration: 'none' }}>{l}</a>
              ))}
              <GBtn variant="ghost" size="sm" onClick={openCanvas}>Design canvas</GBtn>
              <GBtn variant="mat" size="sm" onClick={enter}>Open app →</GBtn>
            </div>
          )}
          {mobile && <GBtn variant="mat" size="sm" onClick={enter}>Open app</GBtn>}
        </div>
      </div>

      {/* Hero */}
      <section style={{ position: 'relative', padding: mobile ? '60px 22px 80px' : '120px 28px 140px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '60%', height: '100%', background: 'radial-gradient(ellipse at 80% 40%, rgba(30,111,255,0.18) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: 920 }}>
          <div className="g-eyebrow" style={{ color: 'var(--g-mat-hi)', marginBottom: 28, letterSpacing: '0.24em' }}>◈ GRAPPLERS · V.01 · MINOT, ND</div>
          <h1 style={{ fontFamily: 'var(--g-condensed)', fontSize: mobile ? 'clamp(54px, 13vw, 90px)' : 'clamp(60px, 10vw, 148px)', fontWeight: 800, lineHeight: 0.9, letterSpacing: '-0.02em', margin: 0, textTransform: 'uppercase' }}>
            The coach<br/>you can't find<br/>
            <span className="g-chrome-fill">is on Grapplers.</span>
          </h1>
          <p style={{ fontSize: mobile ? 16 : 19, color: 'var(--g-fg-2)', maxWidth: 560, marginTop: 28, lineHeight: 1.5 }}>
            A marketplace + record for the grappling community. Verified athletes. Endorsements on file. Privates, seminars, instructionals. No per-seat fees. No rented workflows.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 36, flexWrap: 'wrap' }}>
            <GBtn variant="chrome" size="lg" onClick={enter}>Open the app</GBtn>
            <GBtn variant="ghost" size="lg" onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })}>How it works →</GBtn>
          </div>
        </div>

        {/* Hero frame — only on wide viewports */}
        {!mobile && (
          <div onClick={enter} style={{ position: 'absolute', right: -60, top: 80, width: 360, height: 520, borderRadius: 32, overflow: 'hidden', background: window.gPlaceholder('hero', { hue: 220 }), border: '1px solid var(--g-border)', boxShadow: '0 40px 120px rgba(0,0,0,0.6), 0 0 0 8px #111, 0 0 80px rgba(30,111,255,0.2)', transform: 'rotate(-2deg)', cursor: 'pointer' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 60% at 50% 100%, rgba(30,111,255,0.3), transparent 70%)' }} />
            <div style={{ position: 'absolute', inset: 0, padding: 32, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <div className="g-eyebrow" style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 10 }}>◈ VERIFIED · BLACK BELT · ADCC</div>
              <div className="g-condensed" style={{ fontSize: 44, color: '#fff', lineHeight: 0.9 }}>MIKAEL<br/>CORDOVA</div>
              <div style={{ fontFamily: 'var(--g-mono)', fontSize: 11, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.08em', marginTop: 10 }}>47–9 · 31 SUBS · MINOT, ND · $180/HR</div>
              <div style={{ marginTop: 16, fontFamily: 'var(--g-mono)', fontSize: 10, color: 'var(--g-mat-hi)', letterSpacing: '0.18em' }}>TAP TO OPEN THE APP →</div>
            </div>
          </div>
        )}
      </section>

      {/* Split stat strip */}
      <section style={{ borderTop: '1px solid var(--g-border)', borderBottom: '1px solid var(--g-border)', background: 'var(--g-carbon)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: mobile ? '28px 18px' : '44px 28px', display: 'grid', gridTemplateColumns: mobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: mobile ? 22 : 0 }}>
          {[
            { v: '1,240', l: 'Verified athletes' },
            { v: '14', l: 'US states' },
            { v: '$0', l: 'Per-seat fees' },
            { v: '701-339-9802', l: 'One phone number' },
          ].map((s, i) => (
            <div key={s.l} style={{ padding: mobile ? 0 : '0 20px', borderLeft: !mobile && i > 0 ? '1px solid var(--g-border)' : 'none' }}>
              <div className="g-condensed" style={{ fontSize: mobile ? 32 : 44, color: 'var(--g-fg-1)', lineHeight: 1 }}>{s.v}</div>
              <div className="g-eyebrow" style={{ marginTop: 8 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pillars */}
      <section id="how" style={{ maxWidth: 1200, margin: '0 auto', padding: mobile ? '64px 22px' : '120px 28px' }}>
        <div className="g-eyebrow" style={{ marginBottom: 20 }}>◈ HOW GRAPPLERS WORKS</div>
        <h2 style={{ fontFamily: 'var(--g-display)', fontSize: mobile ? 32 : 56, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.02, maxWidth: 880, margin: 0 }}>
          Not a feed. Not a Facebook group.<br/>
          <span style={{ color: 'var(--g-fg-3)' }}>A record.</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : 'repeat(3, 1fr)', gap: 24, marginTop: mobile ? 40 : 70 }}>
          {[
            { n: '01', t: 'Endorsements on file',
              d: 'High-level athletes pin rising talent with a mono-serial stamp. Public. Permanent. Carries the endorser\'s belt & record.',
              extra: <div style={{ marginTop: 20 }}><EndorsementStamp from={window.gAthlete('a02')} /></div>
            },
            { n: '02', t: 'Book directly',
              d: 'Privates, group sessions, seminar slots. Calendar integrated. The coach confirms — not a call center. No per-seat fees.',
              extra: <div style={{ marginTop: 20, padding: 14, borderRadius: 8, background: 'var(--g-graphite)', border: '1px solid var(--g-border)', fontFamily: 'var(--g-mono)', fontSize: 11, color: 'var(--g-fg-2)', letterSpacing: '0.04em' }}>
                <div style={{ color: 'var(--g-mat-hi)' }}>SAT APR 26 · 10:30 AM</div>
                <div style={{ marginTop: 6 }}>60 min · private · leg locks</div>
                <div style={{ marginTop: 6, color: 'var(--g-fg-1)' }}>→ $180 · confirmed</div>
              </div>
            },
            { n: '03', t: 'Sell your game',
              d: 'Upload instructionals and keep the revenue. No platform that dilutes your voice. Your audience, your rates.',
              extra: <div style={{ marginTop: 20, display: 'flex', gap: 8 }}>
                {['leg','guard','cradle'].map(c => (
                  <div key={c} style={{ width: 56, height: 72, borderRadius: 4, background: c === 'leg' ? 'linear-gradient(135deg, #0B1E3C, #1E6FFF)' : c === 'guard' ? 'linear-gradient(135deg, #2a1a0a, #6B4423)' : 'linear-gradient(135deg, #1a1a1a, #7738B6)', border: '1px solid rgba(255,255,255,0.1)' }} />
                ))}
              </div>
            },
          ].map(p => (
            <div key={p.n} style={{ borderTop: '1px solid var(--g-border)', paddingTop: 18 }}>
              <div className="g-eyebrow" style={{ color: 'var(--g-mat-hi)', marginBottom: 14 }}>{p.n}</div>
              <h3 style={{ fontFamily: 'var(--g-display)', fontSize: mobile ? 22 : 26, fontWeight: 700, letterSpacing: '-0.015em', margin: 0, color: 'var(--g-fg-1)' }}>{p.t}</h3>
              <p style={{ fontSize: 14, color: 'var(--g-fg-2)', lineHeight: 1.55, marginTop: 10 }}>{p.d}</p>
              {p.extra}
            </div>
          ))}
        </div>
      </section>

      {/* Smash moment */}
      <section style={{ background: 'var(--g-obsidian)', borderTop: '1px solid var(--g-border)', borderBottom: '1px solid var(--g-border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: mobile ? '70px 22px' : '140px 28px', position: 'relative' }}>
          <div style={{ fontFamily: 'var(--g-condensed)', fontSize: mobile ? 'clamp(64px, 22vw, 150px)' : 'clamp(80px, 18vw, 280px)', fontWeight: 900, lineHeight: 0.85, letterSpacing: '-0.03em', textAlign: 'center', textTransform: 'uppercase' }}>
            <span className="g-chrome-fill">BUILT IN MINOT.</span>
          </div>
          <div style={{ textAlign: 'center', fontSize: mobile ? 14 : 16, color: 'var(--g-fg-2)', maxWidth: 600, margin: '30px auto 0', lineHeight: 1.5 }}>
            North Dakota has four black belts within 200 miles. We built Grapplers because that wasn't enough — and because the athletes most coaches in the Midwest should be learning from live 2,000 miles away.
          </div>
        </div>
      </section>

      {/* Featured athletes */}
      <section id="featured" style={{ maxWidth: 1200, margin: '0 auto', padding: mobile ? '60px 22px' : '100px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: mobile ? 28 : 40, gap: 12 }}>
          <div>
            <div className="g-eyebrow" style={{ marginBottom: 14 }}>◈ VERIFIED · FEATURED</div>
            <h2 style={{ fontFamily: 'var(--g-display)', fontSize: mobile ? 28 : 44, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>The record, on file.</h2>
          </div>
          <a onClick={enter} style={{ fontSize: 13, color: 'var(--g-mat-hi)', fontFamily: 'var(--g-mono)', letterSpacing: '0.08em', cursor: 'pointer', whiteSpace: 'nowrap' }}>BROWSE ALL →</a>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : 'repeat(3, 1fr)', gap: 18 }}>
          {window.G_ATHLETES.filter(a => a.featured).map(a => (
            <div key={a.id} onClick={enter} style={{ background: 'var(--g-graphite)', border: '1px solid var(--g-border)', borderRadius: 12, overflow: 'hidden', cursor: 'pointer' }}>
              <div style={{ height: 260, background: window.gPlaceholder(a.id, { hue: 220 }), position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(10,11,13,0.9) 100%)' }} />
                <div style={{ position: 'absolute', top: 14, left: 14 }}><BeltChip rank={a.belt} degree={a.degree} /></div>
                <div style={{ position: 'absolute', bottom: 14, left: 14, right: 14 }}>
                  <div className="g-condensed" style={{ fontSize: 26, color: '#fff', lineHeight: 0.95 }}>{a.name.toUpperCase()}</div>
                  <div style={{ fontFamily: 'var(--g-mono)', fontSize: 10, color: 'rgba(255,255,255,0.7)', marginTop: 4, letterSpacing: '0.08em' }}>{a.city.toUpperCase()}</div>
                </div>
              </div>
              <div style={{ padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontFamily: 'var(--g-mono)', fontSize: 11, color: 'var(--g-fg-2)', letterSpacing: '0.06em' }}>
                  {window.gFormatRecord(a.record)} · {a.endorsedBy.length} ENDORSED
                </div>
                <span style={{ fontFamily: 'var(--g-display)', fontSize: 14, fontWeight: 600, color: 'var(--g-fg-1)' }}>${a.rate}/hr →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Instructionals preview */}
      <section id="instructionals" style={{ maxWidth: 1200, margin: '0 auto', padding: mobile ? '20px 22px 60px' : '20px 28px 100px' }}>
        <div className="g-eyebrow" style={{ marginBottom: 14 }}>◈ INSTRUCTIONALS · LATEST</div>
        <h2 style={{ fontFamily: 'var(--g-display)', fontSize: mobile ? 26 : 40, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 26px' }}>Learn from the people who actually train.</h2>
        <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 14 }}>
          {window.G_INSTRUCTIONALS.map(i => {
            const a = window.gAthlete(i.author);
            const cov = { leg: 'linear-gradient(135deg, #0B1E3C, #1E6FFF)', guard: 'linear-gradient(135deg, #2a1a0a, #6B4423)', cradle: 'linear-gradient(135deg, #1a1a1a, #7738B6)', worm: 'linear-gradient(135deg, #0a0a0a, #b8252a)' }[i.cover];
            return (
              <div key={i.id} onClick={enter} style={{ cursor: 'pointer' }}>
                <div style={{ aspectRatio: '3/4', borderRadius: 8, background: cov, position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ position: 'absolute', inset: 12, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div className="g-condensed" style={{ fontSize: 16, color: '#fff', lineHeight: 0.95 }}>{i.title.toUpperCase()}</div>
                    <div style={{ fontFamily: 'var(--g-mono)', fontSize: 9, color: 'rgba(255,255,255,0.7)' }}>{i.chapters} CH · {i.duration}</div>
                  </div>
                </div>
                <div style={{ marginTop: 10, fontSize: 12, color: 'var(--g-fg-2)', fontFamily: 'var(--g-mono)' }}>{a.name} · ${i.price}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section id="cta" style={{ background: 'linear-gradient(180deg, var(--g-carbon) 0%, #081228 100%)', borderTop: '1px solid var(--g-border)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: mobile ? '72px 22px' : '120px 28px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--g-display)', fontSize: mobile ? 36 : 64, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1, margin: 0 }}>
            You bring the <span className="g-chrome-fill">mat.</span><br/>We bring the record.
          </h2>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 40, flexWrap: 'wrap' }}>
            <GBtn variant="chrome" size="lg" onClick={enter}>Open Grapplers</GBtn>
            <GBtn variant="ghost" size="lg" onClick={() => { window.__grapplersEnterAs = 'athlete'; enter(); }}>I'm a coach →</GBtn>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--g-border)', padding: mobile ? '30px 22px' : '40px 28px', background: 'var(--g-obsidian)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="grapplers/icon-512.png" alt="" style={{ width: 22, height: 22, borderRadius: 5, display: 'block' }} />
            <GWordmark size={18} />
            <span style={{ fontFamily: 'var(--g-mono)', fontSize: 11, color: 'var(--g-fg-3)', letterSpacing: '0.08em' }}>· AN NDAI CLIENT · MINOT, ND</span>
          </div>
          <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
            <a onClick={openCanvas} style={{ fontFamily: 'var(--g-mono)', fontSize: 10, color: 'var(--g-fg-3)', letterSpacing: '0.1em', cursor: 'pointer' }}>DESIGN CANVAS</a>
            <div style={{ fontFamily: 'var(--g-mono)', fontSize: 10, color: 'var(--g-fg-3)', letterSpacing: '0.1em' }}>
              ◈ GRP · V.01 · 2026 · 701-339-9802
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

Object.assign(window, { MarketingPage });
