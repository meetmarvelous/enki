// Mock data for Enki Art — ported from Claude Design export

const SWATCHES = [
  ['#2a3142', '#4a5468', '#8b8d8e'],
  ['#1f2a1a', '#3d5235', '#7c8c6e'],
  ['#3a1f1f', '#6b3a3a', '#a86b6b'],
  ['#2a1f3a', '#4a3a6b', '#8b7ca8'],
  ['#3a2a1f', '#6b4a3a', '#a8866b'],
  ['#1f3a3a', '#3a6b6b', '#6ba8a8'],
  ['#3a3a1f', '#6b6b3a', '#a8a86b'],
  ['#1f1f1f', '#3a3a3a', '#6b6b6b'],
  ['#3a1f2a', '#6b3a4a', '#a86b80'],
  ['#1f2a3a', '#3a4a6b', '#6b80a8'],
];

export interface ArtworkData {
  url: string;
  ratio: string;
  w: number;
  h: number;
}

export interface Artist {
  handle: string;
  name: string;
  avatar: string;
  bio: string;
}

export interface PromptVariable {
  name: string;
  label: string;
  type: 'text' | 'checkbox';
  value: string | boolean;
}

export interface Prompt {
  id: string;
  title: string;
  artist: Artist;
  isVideo: boolean;
  art: ArtworkData;
  tags: string[];
  model: string;
  price: number;
  visibility: 'full' | 'vars-only';
  downloads: number;
  rating: number;
  publishedAt: string;
  variables: PromptVariable[];
  promptTemplate: string;
  description: string;
  versions: ArtworkData[];
}

export interface Collection {
  name: string;
  count: number;
  cover: ArtworkData;
}

export function makeArtwork(seed: number): ArtworkData {
  const s = SWATCHES[seed % SWATCHES.length];
  const ratios = ['3:4', '4:5', '1:1', '2:3', '4:3', '16:9'];
  const ratio = ratios[seed % ratios.length];
  const [w, h] = (() => {
    const [a, b] = ratio.split(':').map(Number);
    const base = 600;
    return a > b ? [base, Math.round(base * b / a)] : [Math.round(base * a / b), base];
  })();

  const variant = seed % 6;
  let inner = '';
  if (variant === 0) {
    inner = `<rect x="0" y="${h*0.6}" width="${w}" height="${h*0.4}" fill="${s[2]}"/><circle cx="${w*0.7}" cy="${h*0.45}" r="${h*0.12}" fill="${s[2]}" opacity="0.7"/>`;
  } else if (variant === 1) {
    inner = `<ellipse cx="${w*0.5}" cy="${h*0.6}" rx="${w*0.18}" ry="${h*0.28}" fill="${s[2]}" opacity="0.8"/><circle cx="${w*0.5}" cy="${h*0.32}" r="${w*0.08}" fill="${s[2]}" opacity="0.85"/>`;
  } else if (variant === 2) {
    inner = `<rect x="${w*0.15}" y="${h*0.3}" width="${w*0.3}" height="${h*0.6}" fill="${s[2]}" opacity="0.6"/><rect x="${w*0.5}" y="${h*0.2}" width="${w*0.35}" height="${h*0.7}" fill="${s[2]}" opacity="0.4"/><rect x="${w*0.2}" y="${h*0.45}" width="${w*0.05}" height="${h*0.1}" fill="${s[0]}"/><rect x="${w*0.6}" y="${h*0.3}" width="${w*0.05}" height="${h*0.1}" fill="${s[0]}"/>`;
  } else if (variant === 3) {
    inner = `<circle cx="${w*0.3}" cy="${h*0.4}" r="${w*0.25}" fill="${s[2]}" opacity="0.5"/><circle cx="${w*0.7}" cy="${h*0.65}" r="${w*0.18}" fill="${s[1]}" opacity="0.7"/>`;
  } else if (variant === 4) {
    inner = `<path d="M0,${h*0.7} Q${w*0.3},${h*0.55} ${w*0.6},${h*0.65} T${w},${h*0.6} L${w},${h} L0,${h} Z" fill="${s[1]}"/><path d="M0,${h*0.85} Q${w*0.4},${h*0.75} ${w},${h*0.8} L${w},${h} L0,${h} Z" fill="${s[2]}"/>`;
  } else {
    inner = `<ellipse cx="${w*0.5}" cy="${h*0.55}" rx="${w*0.32}" ry="${h*0.4}" fill="${s[2]}" opacity="0.9"/><ellipse cx="${w*0.42}" cy="${h*0.48}" rx="${w*0.03}" ry="${h*0.015}" fill="${s[0]}"/><ellipse cx="${w*0.58}" cy="${h*0.48}" rx="${w*0.03}" ry="${h*0.015}" fill="${s[0]}"/>`;
  }

  const grain = Array.from({length: 40}, (_, i) => {
    const x = ((seed * 7 + i * 13) % 100);
    const y = ((seed * 11 + i * 17) % 100);
    return `<circle cx="${x}%" cy="${y}%" r="0.5" fill="white" opacity="0.04"/>`;
  }).join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="g${seed}" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="${s[0]}"/><stop offset="100%" stop-color="${s[1]}"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#g${seed})"/>${inner}${grain}</svg>`;
  return { url: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`, ratio, w, h };
}

export const ARTISTS: Artist[] = [
  { handle: 'mira.veil', name: 'Mira Veil', avatar: 'MV', bio: 'Editorial portraits + cinematic frames. Working from a quiet room in Lisbon.' },
  { handle: 'kael.atrium', name: 'Kael Atrium', avatar: 'KA', bio: 'Architectural light. Concrete, glass, dust.' },
  { handle: 'nori.field', name: 'Nori Field', avatar: 'NF', bio: 'Landscapes that feel half-remembered.' },
  { handle: 'jun.echo', name: 'Jun Echo', avatar: 'JE', bio: 'Motion studies and slow cinema.' },
  { handle: 'sasha.r', name: 'Sasha Ren', avatar: 'SR', bio: 'Infographic specialist. Editorial, financial, scientific.' },
  { handle: 'ode.studio', name: 'Ode Studio', avatar: 'OS', bio: 'Two-person studio. Product imagery + abstract.' },
  { handle: 'ines.b', name: 'Inès Brun', avatar: 'IB', bio: 'Fashion + beauty. Paris.' },
  { handle: 'theo.k', name: 'Theo Kessler', avatar: 'TK', bio: 'Sci-fi worldbuilding for film and games.' },
];

export const TAGS = ['portrait', 'cinematic', 'infographic', 'landscape', 'architecture', 'editorial', 'abstract', 'product', 'fashion', 'sci-fi', 'noir', 'minimal', 'dramatic', 'soft-light'];
export const MODELS = ['Midjourney v7', 'Flux 1.1 Pro', 'Sora', 'Veo 3', 'Nano Banana', 'Kling 2.0', 'Runway Gen-4', 'Imagen 4'];

const PROMPT_TITLES = [
  'Quiet Window, Late Afternoon',
  'The Editor — Scientific Infographic',
  'Concrete Cathedral',
  'Boy with the Linen Shirt',
  'Slow Tide, Iron Coast',
  'Hands Holding Citrus',
  'Brutalist Lobby, Empty',
  'Annual Report — Financial Spread',
  'Couple, Two Frames',
  'Studio Portrait — Soft Key',
  'Highway at Night, Long Lens',
  'Ceramic Vessel on Marble',
  'Forest Edge, First Snow',
  'Climate Data — Editorial Chart',
  'Backstage, Show 04',
  'Glass Atrium at Noon',
  'Runner on the Bridge',
  'Tea Bowl, Single Light',
  'Map of Imaginary Trade Routes',
  'Stairwell, Looking Up',
  'The Botanist',
  'Race Car, Dust Plume',
  'Two Chairs, One Window',
  'Cargo Ship, Nine Frames',
];

function buildPromptTemplate(variables: PromptVariable[]): string {
  let template = 'A photograph of [subject], [mood], lit by [lighting]. Set in [location], wearing [wardrobe]. Shot on [lens] with [composition].';
  variables.forEach(v => {
    if (!template.includes(`[${v.name}]`)) {
      template += ` [${v.name}]`;
    }
  });
  template = template.replace(/\[(\w+)\]/g, (m, n) => {
    return variables.find(v => v.name === n) ? m : '';
  });
  template += ' Editorial. Restrained. No text, no logos.';
  return template;
}

function buildPrompt(seed: number): Prompt {
  const t = PROMPT_TITLES[seed % PROMPT_TITLES.length];
  const a = ARTISTS[seed % ARTISTS.length];
  const isVideo = seed % 5 === 3 || seed % 7 === 2;
  const art = makeArtwork(seed);
  const tagPool = [...TAGS].sort((x, y) => ((seed * 31 + x.length) % 7) - ((seed * 17 + y.length) % 7));
  const tags = tagPool.slice(0, 2 + (seed % 3));
  const model = MODELS[seed % MODELS.length];
  const price = [0.05, 0.10, 0.25, 0.50, 1.00, 2.00][seed % 6];
  const downloads = ((seed * 137 + 41) % 9000) + 120;

  const varPool: PromptVariable[] = [
    { name: 'subject', label: 'Subject', type: 'text', value: 'a young woman with dark hair' },
    { name: 'mood', label: 'Mood', type: 'text', value: 'contemplative, soft' },
    { name: 'lighting', label: 'Lighting', type: 'text', value: 'late afternoon window light' },
    { name: 'palette', label: 'Color palette', type: 'text', value: 'warm earth, dusty rose, cream' },
    { name: 'location', label: 'Location', type: 'text', value: 'a small wooden room' },
    { name: 'film_grain', label: 'Add film grain', type: 'checkbox', value: true },
    { name: 'shallow_dof', label: 'Shallow depth of field', type: 'checkbox', value: true },
    { name: 'wardrobe', label: 'Wardrobe', type: 'text', value: 'natural linen, no logos' },
    { name: 'composition', label: 'Composition', type: 'text', value: 'rule of thirds, head left' },
    { name: 'lens', label: 'Lens', type: 'text', value: '85mm, f/1.8' },
  ];
  const numVars = 2 + (seed % 4);
  const variables = varPool.slice((seed * 3) % 4, ((seed * 3) % 4) + numVars);

  const visibility: 'full' | 'vars-only' = (seed % 3 === 0) ? 'vars-only' : 'full';

  return {
    id: `p_${seed}`,
    title: t,
    artist: a,
    isVideo,
    art,
    tags,
    model,
    price,
    visibility,
    downloads,
    rating: 4.2 + ((seed % 8) / 10),
    publishedAt: `${(seed % 28) + 1} day${seed % 28 === 0 ? '' : 's'} ago`,
    variables,
    promptTemplate: buildPromptTemplate(variables),
    description: 'A flexible base for editorial work. Adjust the variables to fit your subject and mood — this prompt was originally written for portrait but holds up for still life and interiors with small tweaks.',
    versions: [0, 1, 2, 3].map(i => makeArtwork(seed * 11 + i + 1)),
  };
}

export const PROMPTS: Prompt[] = Array.from({ length: 24 }, (_, i) => buildPrompt(i));

export const COLLECTIONS: Collection[] = [
  { name: 'Infographics', count: 7, cover: makeArtwork(4) },
  { name: 'Hero shots', count: 12, cover: makeArtwork(0) },
  { name: 'Quiet rooms', count: 5, cover: makeArtwork(11) },
  { name: 'For the deck', count: 9, cover: makeArtwork(7) },
];

export const NETWORKS = [
  { name: 'Base', token: 'USDC', balance: '142.18', color: '#0052ff' },
  { name: 'Solana', token: 'USDC', balance: '83.50', color: '#9945ff' },
  { name: 'Polygon', token: 'USDC', balance: '0.00', color: '#8247e5' },
  { name: 'Arbitrum', token: 'USDC', balance: '21.04', color: '#28a0f0' },
];

export const QC_MODELS = [
  { id: 'nano-banana-pro', name: 'Nano Banana Pro', cost: 0.04, kind: 'image' },
  { id: 'gpt-image-2', name: 'GPT-Image-2', cost: 0.06, kind: 'image' },
];
export const QC_RATIOS = ['1:1', '4:5', '3:2', '16:9', '9:16', '21:9'];
export const QC_RESOLUTIONS = ['1K', '2K', '4K'];

export function parseTokens(text: string): string[] {
  const re = /\[(\w+)\]/g;
  const set: string[] = [];
  const seen = new Set<string>();
  let m;
  while ((m = re.exec(text))) {
    if (!seen.has(m[1])) { seen.add(m[1]); set.push(m[1]); }
  }
  return set;
}
