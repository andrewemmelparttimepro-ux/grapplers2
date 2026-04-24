// Grapplers — Feed screen (social, endorsement-heavy)

function FeedPost({ post, onEndorse, onViewProfile }) {
  const author = window.gAthlete(post.author);
  const target = post.targetId ? window.gAthlete(post.targetId) : null;
  const state = window.useGStore();
  const liked = state.likedPosts.has(post.id);
  const toggleLike = (e) => {
    e.stopPropagation();
    window.GStore.set(s => {
      const next = new Set(s.likedPosts);
      next.has(post.id) ? next.delete(post.id) : next.add(post.id);
      return { likedPosts: next };
    });
  };

  return (
    <div className="g-rise" style={{ padding: '0 16px', marginBottom: 18 }}>
      {/* header row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <div onClick={() => onViewProfile(author.id)} style={{ cursor: 'pointer' }}>
          <GAvatar athlete={author} size={36} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--g-fg-1)' }}>{author.name}</span>
            {author.verified && <VerifiedMark size={12} />}
            <BeltChip rank={author.belt} degree={author.degree} style={{ transform: 'scale(0.85)', transformOrigin: 'left' }} />
          </div>
          <div style={{ fontSize: 11, color: 'var(--g-fg-3)', fontFamily: 'var(--g-mono)', letterSpacing: '0.04em' }}>
            {author.handle} · {post.time} · {author.city}
          </div>
        </div>
        <button style={{
          border: 'none', background: 'transparent', color: 'var(--g-fg-3)',
          fontSize: 18, cursor: 'pointer', padding: 4,
        }}>⋯</button>
      </div>

      {/* body by kind */}
      {post.kind === 'video' && (
        <div style={{
          position: 'relative', borderRadius: 12, overflow: 'hidden',
          height: 220, background: window.gPlaceholder(post.id, { hue: 215 }),
          border: '1px solid var(--g-border)',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(circle at 50% 50%, transparent 40%, rgba(0,0,0,0.7) 100%)',
          }} />
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: 56, height: 56, borderRadius: '50%',
            background: 'rgba(0,0,0,0.65)', border: '1.5px solid rgba(255,255,255,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, color: '#fff', paddingLeft: 4,
          }}>▶</div>
          <div style={{
            position: 'absolute', top: 10, left: 10,
            fontFamily: 'var(--g-mono)', fontSize: 10, letterSpacing: '0.12em',
            color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase',
            background: 'rgba(0,0,0,0.5)', padding: '3px 7px', borderRadius: 2,
          }}>◉ TECHNIQUE · {post.duration}</div>
          <div style={{
            position: 'absolute', bottom: 12, left: 14, right: 14,
            color: '#fff', fontSize: 14, fontWeight: 600,
            fontFamily: 'var(--g-display)',
          }}>{post.title}</div>
        </div>
      )}

      {post.kind === 'text' && (
        <div style={{
          padding: '14px 16px',
          background: 'var(--g-graphite)',
          border: '1px solid var(--g-border)',
          borderRadius: 12,
        }}>
          <div className="g-eyebrow" style={{ color: 'var(--g-mat-hi)', marginBottom: 6 }}>{post.title}</div>
          <div style={{ fontSize: 14, color: 'var(--g-fg-1)', lineHeight: 1.5 }}>{post.body}</div>
        </div>
      )}

      {post.kind === 'endorsement' && target && (
        <div style={{
          padding: 14, borderRadius: 12,
          background: 'linear-gradient(180deg, rgba(30,111,255,0.08) 0%, var(--g-graphite) 100%)',
          border: '1px solid rgba(30,111,255,0.24)',
        }}>
          <div className="g-eyebrow" style={{ color: 'var(--g-mat-hi)', marginBottom: 10, letterSpacing: '0.24em' }}>
            ◈ ENDORSEMENT FILED
          </div>
          <div style={{ fontSize: 14, color: 'var(--g-fg-1)', lineHeight: 1.5, marginBottom: 12 }}>
            "{post.body}"
          </div>
          <div onClick={() => onViewProfile(target.id)} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: 10,
            background: 'rgba(0,0,0,0.3)', borderRadius: 8, cursor: 'pointer',
            border: '1px solid var(--g-border)',
          }}>
            <GAvatar athlete={target} size={32} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--g-fg-1)' }}>{target.name}</div>
              <div style={{ fontSize: 10, color: 'var(--g-fg-3)', fontFamily: 'var(--g-mono)' }}>
                {window.gFormatRecord(target.record)} · {target.city}
              </div>
            </div>
            <span style={{ color: 'var(--g-fg-3)', fontSize: 14 }}>→</span>
          </div>
        </div>
      )}

      {/* actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 10, paddingLeft: 2 }}>
        <button onClick={toggleLike} style={{
          border: 'none', background: 'transparent', color: liked ? 'var(--g-mat-hi)' : 'var(--g-fg-3)',
          fontSize: 12, fontFamily: 'var(--g-mono)', cursor: 'pointer', padding: 0,
          display: 'flex', alignItems: 'center', gap: 6, letterSpacing: '0.06em',
        }}>
          <span style={{ fontSize: 15 }}>{liked ? '◉' : '◎'}</span>
          {post.stats.likes + (liked ? 1 : 0)}
        </button>
        <span style={{ color: 'var(--g-fg-3)', fontSize: 12, fontFamily: 'var(--g-mono)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 14 }}>✉</span>{post.stats.comments}
        </span>
        <span style={{ color: 'var(--g-fg-3)', fontSize: 12, fontFamily: 'var(--g-mono)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 14 }}>✦</span>{post.stats.saves}
        </span>
      </div>
    </div>
  );
}

function FeedScreen({ onViewProfile, role, onOpenMessages }) {
  const state = window.useGStore();
  const [filter, setFilter] = useState('Following');
  const filters = ['Following', 'Near me', 'Technique', 'Endorsements', 'Seminars'];
  const filtered = window.G_FEED.filter(p => {
    if (filter === 'Following') return state.followedAthletes.has(p.author);
    if (filter === 'Near me') {
      const a = window.gAthlete(p.author);
      return a.distance <= 250;
    }
    if (filter === 'Technique') return p.kind === 'video';
    if (filter === 'Endorsements') return p.kind === 'endorsement';
    if (filter === 'Seminars') return p.kind === 'text';
    return true;
  });

  return (
    <div style={{ height: '100%', overflowY: 'auto', paddingBottom: 110 }} className="g-scroll">
      {/* top chrome */}
      <div style={{
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        padding: '56px 16px 14px',
      }}>
        <div>
          <div className="g-eyebrow" style={{ marginBottom: 4, color: 'var(--g-fg-3)' }}>◈ {role === 'athlete' ? 'ATHLETE' : 'STUDENT'} · FEED</div>
          <GWordmark size={26} />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => window.gToast('Notifications cleared')} style={iconBtn}>◇</button>
          <button onClick={() => onOpenMessages && onOpenMessages()} style={iconBtn}>✉</button>
        </div>
      </div>

      {/* Filter strip */}
      <div style={{ display: 'flex', gap: 8, padding: '0 16px 14px', overflowX: 'auto' }} className="g-scroll">
        {filters.map(f => {
          const on = filter === f;
          return (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '6px 12px', borderRadius: 999,
              background: on ? 'var(--g-fg-1)' : 'transparent',
              color: on ? 'var(--g-carbon)' : 'var(--g-fg-2)',
              border: on ? 'none' : '1px solid var(--g-border-strong)',
              fontSize: 11, fontFamily: 'var(--g-display)', fontWeight: 600,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              whiteSpace: 'nowrap', cursor: 'pointer',
            }}>{f}</button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--g-fg-3)' }}>
          <div className="g-eyebrow" style={{ marginBottom: 10, letterSpacing: '0.2em' }}>◇ NOTHING IN {filter.toUpperCase()} ◇</div>
          <div style={{ fontSize: 12, fontFamily: 'var(--g-mono)', letterSpacing: '0.05em' }}>
            {filter === 'Following' ? 'Follow someone to see posts here.' : 'Try another filter.'}
          </div>
          <div style={{ marginTop: 18 }}>
            <GBtn variant="ghost" size="sm" onClick={() => setFilter('Technique')}>Show technique posts</GBtn>
          </div>
        </div>
      ) : (
        filtered.map(p => <FeedPost key={p.id} post={p} onViewProfile={onViewProfile} />)
      )}

      <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--g-fg-3)', fontFamily: 'var(--g-mono)', fontSize: 10, letterSpacing: '0.2em' }}>
        ◇ END OF FEED ◇
      </div>
    </div>
  );
}

const iconBtn = {
  width: 36, height: 36, borderRadius: '50%',
  background: 'var(--g-graphite)', border: '1px solid var(--g-border)',
  color: 'var(--g-fg-1)', fontSize: 14, cursor: 'pointer',
};

Object.assign(window, { FeedScreen, FeedPost });
