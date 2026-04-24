// Grapplers — shared data (athletes, instructionals, endorsements)
window.G_BELTS = {
  white: { label: 'White', color: '#E9E3D3', ink: '#1A1A1A' },
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

window.G_ATHLETES = [
  {
    id: 'a01', name: 'Mikael Cordova', handle: '@mikcordova',
    gym: 'Frontline Grappling · Minot, ND',
    city: 'Minot, ND', distance: 0,
    belt: 'black', degree: 2,
    styles: ['No-Gi BJJ', 'Submission Grappling'],
    specialties: ['Leg locks', 'Guard retention', 'Body lock passing'],
    record: { comp: '47–9', wins: 47, losses: 9, submissions: 31, highlight: 'ADCC Trials 2024 finalist' },
    rate: 180, followers: 12400, endorsements: 14,
    bio: 'Head coach at Frontline. Trains under Lucas Barreto. Leg lock systems & body lock passing. Available for privates 7 days a week, seminars by arrangement.',
    verified: true, featured: true,
    endorsedBy: ['a02', 'a05'],
  },
  {
    id: 'a02', name: 'Renata Oliveira', handle: '@renataoli',
    gym: 'Ten-Ten Jiu-Jitsu · Fargo, ND',
    city: 'Fargo, ND', distance: 230,
    belt: 'black', degree: 1,
    styles: ['Gi BJJ', 'No-Gi BJJ'],
    specialties: ['Closed guard', 'Collar chokes', 'Inversions'],
    record: { comp: '62–14', wins: 62, losses: 14, submissions: 44, highlight: 'IBJJF Worlds bronze 2023' },
    rate: 220, followers: 28900, endorsements: 22,
    bio: 'IBJJF world medalist. Teaching out of Ten-Ten. Specialized in closed guard systems and collar chokes for smaller athletes.',
    verified: true, featured: true,
    endorsedBy: ['a01', 'a03', 'a05'],
  },
  {
    id: 'a03', name: 'Dallas Hjelmstad', handle: '@dallashjelm',
    gym: 'Northern Cradle Wrestling Club · Bismarck, ND',
    city: 'Bismarck, ND', distance: 110,
    belt: 'black', degree: 0,
    styles: ['Folkstyle', 'Freestyle'],
    specialties: ['Cradles', 'Leg rides', 'Funk scrambles'],
    record: { comp: 'NCAA AA x2', wins: 98, losses: 17, submissions: 0, highlight: 'NCAA All-American 2022' },
    rate: 150, followers: 8700, endorsements: 9,
    bio: 'Two-time NCAA All-American. Coaching folkstyle & freestyle out of Northern Cradle. Cradle systems, ride time, tilt series.',
    verified: true,
    endorsedBy: ['a01'],
  },
  {
    id: 'a04', name: 'Priya Ramaswamy', handle: '@priyaramas',
    gym: '10th Planet Minneapolis',
    city: 'Minneapolis, MN', distance: 460,
    belt: 'brown', degree: 0,
    styles: ['No-Gi BJJ', 'Submission Grappling'],
    specialties: ['Rubber guard', 'Lockdown', 'Twister'],
    record: { comp: '33–8', wins: 33, losses: 8, submissions: 19, highlight: 'EBI vet, ADCC West Coast Trials' },
    rate: 140, followers: 6200, endorsements: 6,
    bio: '10th Planet brown belt under Denny Prokopos. Rubber guard and lockdown systems for people who actually want to use them.',
    verified: true,
    endorsedBy: ['a02'],
  },
  {
    id: 'a05', name: 'Tomás Eberle', handle: '@tomaseberle',
    gym: 'Eberle Grappling Academy',
    city: 'Denver, CO', distance: 930,
    belt: 'black', degree: 3,
    styles: ['Gi BJJ', 'No-Gi BJJ', 'Submission Grappling'],
    specialties: ['Worm guard', 'De La Riva', 'Berimbolo'],
    record: { comp: '118–31', wins: 118, losses: 31, submissions: 71, highlight: 'ADCC veteran · 2x IBJJF Pans champion' },
    rate: 300, followers: 94500, endorsements: 41,
    bio: 'Third-degree black belt. ADCC veteran. Modern guard systems. Privates booked through September — seminars open.',
    verified: true, featured: true,
    endorsedBy: ['a02'],
  },
  {
    id: 'a06', name: 'Jerome "Big Jer" Faulkner', handle: '@bigjer',
    gym: 'Roughrider Wrestling Club · Dickinson, ND',
    city: 'Dickinson, ND', distance: 140,
    belt: 'black', degree: 0,
    styles: ['Folkstyle', 'Freestyle'],
    specialties: ['Heavyweight tie-ups', 'Snap downs', 'Front headlock'],
    record: { comp: '76–12', wins: 76, losses: 12, submissions: 0, highlight: 'NDHSAA State Champion Head Coach' },
    rate: 120, followers: 4100, endorsements: 5,
    bio: 'State title head coach. HS & open mat privates. Pre-season camps November–December.',
    verified: true,
    endorsedBy: ['a03'],
  },
];

window.G_INSTRUCTIONALS = [
  {
    id: 'i01', title: 'The Minot Leg Lock System',
    author: 'a01',
    price: 87, duration: '4h 12m', chapters: 14,
    tagline: 'Low-risk entries, high-percentage finishes. No flashy nonsense.',
    cover: 'leg',
    purchased: false,
  },
  {
    id: 'i02', title: 'Closed Guard for Smaller Athletes',
    author: 'a02',
    price: 97, duration: '5h 48m', chapters: 18,
    tagline: 'What to do when everyone outweighs you by 30 pounds.',
    cover: 'guard',
    purchased: false,
  },
  {
    id: 'i03', title: 'Cradles: The Complete Folkstyle Series',
    author: 'a03',
    price: 65, duration: '3h 22m', chapters: 11,
    tagline: 'The tilt, the cradle, the ride. Season-ready.',
    cover: 'cradle',
    purchased: true,
  },
  {
    id: 'i04', title: 'Modern Worm Guard',
    author: 'a05',
    price: 127, duration: '6h 55m', chapters: 22,
    tagline: 'The same system that beat three world champions.',
    cover: 'worm',
    purchased: false,
  },
];

// Feed posts
window.G_FEED = [
  {
    id: 'p01', author: 'a01', time: '2h',
    kind: 'video',
    title: 'Outside ashi → inside sankaku, 3 hand-fight variations',
    duration: '1:42',
    stats: { likes: 412, comments: 38, saves: 91 },
  },
  {
    id: 'p02', author: 'a05', time: '5h',
    kind: 'text',
    title: 'Seminar dates locked',
    body: 'Denver July 19 · Phoenix Aug 3 · Austin Aug 24. DM for private slots around each date.',
    stats: { likes: 1280, comments: 96, saves: 14 },
  },
  {
    id: 'p03', author: 'a02', time: '1d',
    kind: 'endorsement',
    targetId: 'a01',
    body: 'Trained with Mikael last weekend at Frontline. His leg lock entries are the cleanest I have rolled with in years. Endorsed.',
    stats: { likes: 834, comments: 42, saves: 28 },
  },
  {
    id: 'p04', author: 'a03', time: '1d',
    kind: 'video',
    title: 'Cradle from short offense — why the high leg matters',
    duration: '2:08',
    stats: { likes: 267, comments: 19, saves: 54 },
  },
];

// Helpers
window.gAthlete = (id) => window.G_ATHLETES.find(a => a.id === id);
window.gFormatRecord = (r) => `${r.wins}-${r.losses}`;
