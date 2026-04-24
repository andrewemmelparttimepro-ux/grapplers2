// Grapplers — shared data. Centered on Officer Grimy (Jonathan Wilson) and his real orbit.
// IDs a01..a06 kept stable so persisted state (follows, likes, endorsements) continues to work.

window.G_BELTS = {
  white:  { label: 'White',  color: '#E9E3D3', ink: '#1A1A1A' },
  blue:   { label: 'Blue',   color: '#2B6BD6', ink: '#FFFFFF' },
  purple: { label: 'Purple', color: '#7738B6', ink: '#FFFFFF' },
  brown:  { label: 'Brown',  color: '#6B4423', ink: '#FFFFFF' },
  black:  { label: 'Black',  color: '#0A0A0A', ink: '#FFFFFF' },
};

window.G_STYLES = ['No-Gi BJJ', 'Gi BJJ', 'Folkstyle', 'Freestyle', 'Submission Grappling', 'Catch', 'Judo'];

// Placeholder silhouette — matte black subject, dim rim light
window.gPlaceholder = (seed, { hue = 220, ring = '#1E6FFF' } = {}) => {
  const s = String(seed).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const h1 = (hue + (s % 40) - 20 + 360) % 360;
  const h2 = (h1 + 30) % 360;
  return `radial-gradient(ellipse 80% 60% at 50% 110%, hsl(${h1} 40% 14%) 0%, #060708 60%),
          radial-gradient(circle at 30% 20%, hsl(${h2} 60% 28% / 0.6), transparent 50%),
          linear-gradient(180deg, #0b0c10 0%, #060708 100%)`;
};

// The claimable athlete = Officer Grimy. Any other profile viewed is "someone else's."
window.G_HERO_ATHLETE_ID = 'a01';

window.G_ATHLETES = [
  {
    id: 'a01',
    name: 'Officer Grimy', realName: 'Jonathan Wilson', handle: '@officer_grimy',
    gym: 'Wilson Bros. Grappling · Colorado Springs, CO',
    city: 'Colorado Springs, CO', distance: 0,
    belt: 'black', degree: 0,
    styles: ['No-Gi BJJ', 'Submission Grappling', 'Folkstyle'],
    specialties: ['High Ground system', 'Crucifix chokes', 'Reverse half guard'],
    record: { comp: '52–14', wins: 52, losses: 14, submissions: 33, highlight: 'Crucifix / M-plata finish over Ben Eddie · subbed Andrew Tackett' },
    rate: 200, followers: 42800, endorsements: 14,
    bio: 'Co-owner of Wilson Bros. Grappling. Minot State wrestling — five years competing, three coaching. Full-time grappler since 2023. The "Grimy" comes from how I roll: grind it out, stay on top. Built the High Ground system with Baret. Privates daily out of Colorado Springs, monthly at B-Team. Seminars nationwide.',
    verified: true, featured: true, claimable: true,
    endorsedBy: ['a02', 'a03', 'a04'],
    team: 'Colorado Wolverines · PGF',
  },
  {
    id: 'a02',
    name: 'Marcus Wilson', realName: 'Marcus "Trick" Wilson', handle: '@trickwilson',
    gym: 'Wilson Bros. Grappling · Colorado Springs, CO',
    city: 'Colorado Springs, CO', distance: 0,
    belt: 'black', degree: 0,
    styles: ['Folkstyle', 'Freestyle', 'No-Gi BJJ'],
    specialties: ['Wrestling entries for jiu-jitsu', 'Top game', 'Front headlock series'],
    record: { comp: '61–18', wins: 61, losses: 18, submissions: 22, highlight: 'Four-time state placewinner · NAIA All-American nominee' },
    rate: 150, followers: 7800, endorsements: 6,
    bio: 'Co-owner of Wilson Bros. Grappling. Wrestler first — jiu-jitsu came later. I teach the wrestling half of the Wilson Bros. system: level changes, finishes, front headlock attacks for no-gi.',
    verified: true, featured: true,
    endorsedBy: ['a01'],
  },
  {
    id: 'a03',
    name: 'Baret Yoshida', realName: 'Baret Yoshida', handle: '@baretyoshida',
    gym: 'B-Team Austin · traveling',
    city: 'Austin, TX', distance: 920,
    belt: 'black', degree: 4,
    styles: ['No-Gi BJJ', 'Submission Grappling'],
    specialties: ['Crucifix', 'High Ground system', 'Guillotines'],
    record: { comp: '214–71', wins: 214, losses: 71, submissions: 128, highlight: 'ADCC veteran · 3x ADCC Worlds medalist · Flyweight legend' },
    rate: 300, followers: 184200, endorsements: 41,
    bio: 'ADCC veteran. Multi-time world medalist. The framework Grimy calls "High Ground" started as a scrapbook of my crucifix entries — he took it places I hadn\'t gone. Still rolling, still teaching. No gi.',
    verified: true, featured: true,
    endorsedBy: [],
  },
  {
    id: 'a04',
    name: 'Mo Black', realName: 'Maurice Black', handle: '@moblack_bjj',
    gym: 'Colorado Springs',
    city: 'Colorado Springs, CO', distance: 4,
    belt: 'black', degree: 1,
    styles: ['No-Gi BJJ', 'Gi BJJ'],
    specialties: ['Guard passing', 'Body lock', 'Submission chains'],
    record: { comp: '74–22', wins: 74, losses: 22, submissions: 41, highlight: 'IBJJF No-Gi Pan silver · Fight to Win veteran' },
    rate: 140, followers: 5900, endorsements: 5,
    bio: 'Colorado Springs black belt. Train with the Wilson Bros. weekly — they bring the wrestling, I bring the guard-passing systems.',
    verified: true,
    endorsedBy: ['a01'],
  },
  {
    id: 'a05',
    name: 'Dan Reese', realName: 'Dan Reese', handle: '@danreese',
    gym: 'Colorado Springs',
    city: 'Colorado Springs, CO', distance: 5,
    belt: 'black', degree: 0,
    styles: ['No-Gi BJJ', 'Gi BJJ', 'Submission Grappling'],
    specialties: ['Back attacks', 'Inversions', 'Rubber guard'],
    record: { comp: '38–12', wins: 38, losses: 12, submissions: 25, highlight: 'Multiple regional no-gi opens · EBI invitee' },
    rate: 150, followers: 3600, endorsements: 3,
    bio: 'Competitive black belt out of Colorado Springs. Part of the weekly Wilson Bros. rotation. Back attacks and modern guard specialist.',
    verified: true,
    endorsedBy: ['a01'],
  },
  {
    id: 'a06',
    name: 'Aon Reese', realName: 'Aon Reese', handle: '@aonreese',
    gym: 'Colorado Springs',
    city: 'Colorado Springs, CO', distance: 5,
    belt: 'brown', degree: 2,
    styles: ['No-Gi BJJ'],
    specialties: ['Leg entanglements', 'Wrestling exchanges', 'Escapes'],
    record: { comp: '29–9', wins: 29, losses: 9, submissions: 17, highlight: 'Brown belt division regional champ' },
    rate: 110, followers: 2400, endorsements: 2,
    bio: 'Brown belt competitor in the Colorado Springs rotation. Young, hungry, scraps hard — and improving fast in the Wilson Bros. room.',
    verified: true,
    endorsedBy: ['a05'],
  },
];

window.G_INSTRUCTIONALS = [
  {
    id: 'i01', title: 'The High Ground System',
    author: 'a01',
    price: 97, duration: '6h 48m', chapters: 18,
    tagline: 'Top pressure, crucifix entries, reverse half. The full B-Team framework.',
    cover: 'leg',
    purchased: false,
  },
  {
    id: 'i02', title: 'Crucifix From Everywhere',
    author: 'a01',
    price: 77, duration: '4h 22m', chapters: 14,
    tagline: 'Entries from turtle, side, half, reverse half. All the wiring for the cage.',
    cover: 'cradle',
    purchased: false,
  },
  {
    id: 'i03', title: 'Reverse Half: Sweeps & Stalls',
    author: 'a01',
    price: 67, duration: '3h 58m', chapters: 12,
    tagline: 'The position everyone ends up in. Own it — don\'t tap from it.',
    cover: 'guard',
    purchased: true,
  },
  {
    id: 'i04', title: 'Wrestling Up for Jiu-Jitsu',
    author: 'a02',
    price: 87, duration: '5h 12m', chapters: 16,
    tagline: 'Level changes, finishes, and front headlocks built for no-gi.',
    cover: 'worm',
    purchased: false,
  },
];

// Feed posts
window.G_FEED = [
  {
    id: 'p01', author: 'a01', time: '2h',
    kind: 'video',
    title: 'Crucifix from reverse half — the entry everyone misses',
    duration: '2:04',
    stats: { likes: 1280, comments: 142, saves: 318 },
  },
  {
    id: 'p02', author: 'a01', time: '5h',
    kind: 'text',
    title: 'Seminar dates locked',
    body: 'Gracie Raleigh NC · May 10. Denver · Jun 7. B-Team Austin · Jun 28. High Ground system, three hours, no gi. DM for private slots around each date.',
    stats: { likes: 842, comments: 54, saves: 21 },
  },
  {
    id: 'p03', author: 'a03', time: '1d',
    kind: 'endorsement',
    targetId: 'a01',
    body: 'Rolled with Grimy at B-Team last week. The kid took the crucifix framework and made it something I hadn\'t seen. High Ground is the real deal. Endorsed.',
    stats: { likes: 2140, comments: 96, saves: 142 },
  },
  {
    id: 'p04', author: 'a02', time: '1d',
    kind: 'video',
    title: 'Front headlock → back take for no-gi',
    duration: '1:38',
    stats: { likes: 310, comments: 22, saves: 68 },
  },
];

// Helpers
window.gAthlete = (id) => window.G_ATHLETES.find(a => a.id === id);
window.gFormatRecord = (r) => `${r.wins}-${r.losses}`;
