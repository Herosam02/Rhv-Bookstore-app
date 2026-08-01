import type { Book, Review } from '../types';

const COVER = (seed: string, w = 400, h = 600) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

const NAMES = [
  'Eleanor Whitfield', 'Marcus Bellamy', 'Sofia Castellano', 'James Okafor',
  'Priya Nair', 'David Lin', 'Hana Tanaka', 'Omar Farouk', 'Lena Petrova',
  'Carlos Mendez', 'Aisha Rahman', 'Thomas Greene', 'Margot Dubois', 'Henry Walsh',
  'Yuki Sato', 'Fatima Hassan', 'Nina Rossi', 'Samuel Adler', 'Grace Kim',
  'Ibrahim Cole', 'Roberto Salas', 'Mei Chen', 'Olivia Brooks', 'Daniel Reyes',
];

const AVATAR = (name: string) =>
  `https://i.pravatar.cc/80?u=${encodeURIComponent(name)}`;

function makeReviews(seed: string, count: number): Review[] {
  const snippets = [
    'Absolutely mesmerizing. Could not put it down.',
    'A masterclass in storytelling — every page gripped me.',
    'Beautifully written prose with haunting characters.',
    'Slow start but the payoff is worth every minute.',
    'Recommending this to everyone I know. Stunning.',
    'The world-building is unmatched. A modern classic.',
    'Emotionally devastating in the best possible way.',
    'Clever, witty, and impossible to predict.',
    'A fresh voice in a crowded genre. Brilliant.',
    'Will sit with me for a long time. Go read it.',
  ];
  const reviews: Review[] = [];
  for (let i = 0; i < count; i++) {
    const name = NAMES[(seed.length + i) % NAMES.length] || NAMES[i % NAMES.length];
    const rating = Math.random() > 0.2 ? 4 + Math.round(Math.random()) : 3;
    reviews.push({
      id: `${seed}-r${i}`,
      user: name,
      avatar: AVATAR(name),
      rating,
      date: new Date(Date.now() - i * 86400000 * 9).toISOString(),
      comment: snippets[i % snippets.length],
      likes: Math.floor(Math.random() * 80),
    });
  }
  return reviews;
}

const CH = (n: number) => Array.from({ length: n }, (_, i) => `Chapter ${i + 1}${['', ': The Beginning', ': Awakening', ': The Reckoning', ': Echoes', ': Resolution', ': Aftermath'][i % 7]}`);

interface Seed {
  title: string;
  author: string;
  genre: string;
  price: number;
  rating: number;
  releaseDate: string;
  tags?: string[];
  flags?: Partial<Pick<Book, 'bestseller' | 'isNewArrival' | 'editorsPick' | 'trending'>>;
  description?: string;
  pages?: number;
}

const SEEDS: Seed[] = [
  { title: 'The Midnight Library', author: 'Matt Haig', genre: 'Fiction', price: 14.99, rating: 4.6, releaseDate: '2024-01-12', flags: { bestseller: true, editorsPick: true }, tags: ['fantasy', 'philosophy'], pages: 304, description: 'Between life and death there is a library, and within it infinite lives await.' },
  { title: 'Atomic Habits', author: 'James Clear', genre: 'Self-Help', price: 19.99, rating: 4.8, releaseDate: '2024-03-22', flags: { bestseller: true, trending: true }, tags: ['productivity', 'psychology'], pages: 320, description: 'Tiny changes, remarkable results — a proven framework for building good habits.' },
  { title: 'Project Hail Mary', author: 'Andy Weir', genre: 'Sci-Fi', price: 16.99, rating: 4.7, releaseDate: '2024-05-10', flags: { trending: true, isNewArrival: true }, tags: ['space', 'adventure'], pages: 496, description: 'A lone astronaut must save humanity — with help from an unexpected friend.' },
  { title: 'The Silent Patient', author: 'Alex Michaelides', genre: 'Mystery', price: 12.99, rating: 4.4, releaseDate: '2024-02-18', flags: { bestseller: true }, tags: ['psychological', 'thriller'], pages: 336, description: 'A psychological thriller about a woman who shoots her husband and never speaks again.' },
  { title: 'Educated', author: 'Tara Westover', genre: 'Memoir', price: 15.99, rating: 4.7, releaseDate: '2024-01-05', flags: { editorsPick: true }, tags: ['biography', 'education'], pages: 352, description: 'A memoir about a woman who leaves her survivalist family to pursue an education.' },
  { title: 'Pachinko', author: 'Min Jin Lee', genre: 'Fiction', price: 13.99, rating: 4.5, releaseDate: '2024-04-09', flags: { editorsPick: true }, tags: ['historical', 'family'], pages: 496, description: 'A sweeping saga of a Korean family across four generations in Japan.' },
  { title: 'Dune', author: 'Frank Herbert', genre: 'Sci-Fi', price: 17.99, rating: 4.6, releaseDate: '2024-06-01', flags: { bestseller: true, trending: true }, tags: ['space-opera'], pages: 688, description: 'On the desert planet Arrakis, young Paul Atreides fights for control of the most valuable substance in the universe.' },
  { title: 'The Seven Husbands of Evelyn Hugo', author: 'Taylor Jenkins Reid', genre: 'Fiction', price: 13.49, rating: 4.7, releaseDate: '2024-02-22', flags: { bestseller: true, trending: true }, tags: ['hollywood', 'romance'], pages: 400, description: 'An aging Hollywood icon finally tells the truth about her glamorous and tragic life.' },
  { title: 'Sapiens', author: 'Yuval Noah Harari', genre: 'History', price: 18.99, rating: 4.5, releaseDate: '2024-03-15', flags: { editorsPick: true }, tags: ['anthropology'], pages: 464, description: 'A bold narrative of how Homo sapiens came to dominate the planet.' },
  { title: 'Where the Crawdads Sing', author: 'Delia Owens', genre: 'Mystery', price: 12.49, rating: 4.4, releaseDate: '2024-01-20', flags: { bestseller: true }, tags: ['nature', 'mystery'], pages: 384, description: 'A coming-of-age mystery set in the marshes of North Carolina.' },
  { title: 'Circe', author: 'Madeline Miller', genre: 'Fantasy', price: 15.99, rating: 4.6, releaseDate: '2024-04-30', flags: { editorsPick: true, trending: true }, tags: ['mythology', 'greek'], pages: 400, description: 'The witch Circe tells her own story of exile, magic, and defiance against the gods.' },
  { title: 'The Subtle Art of Not Giving a F*ck', author: 'Mark Manson', genre: 'Self-Help', price: 14.99, rating: 4.3, releaseDate: '2024-02-08', flags: { bestseller: true }, tags: ['philosophy'], pages: 224, description: 'A counterintuitive approach to living a good life.' },
  { title: 'Klara and the Sun', author: 'Kazuo Ishiguro', genre: 'Sci-Fi', price: 16.49, rating: 4.2, releaseDate: '2024-05-18', flags: { isNewArrival: true }, tags: ['ai', 'literary'], pages: 320, description: 'An artificial friend observes the world of humans with quiet devotion.' },
  { title: 'The Night Circus', author: 'Erin Morgenstern', genre: 'Fantasy', price: 14.49, rating: 4.3, releaseDate: '2024-03-02', flags: { editorsPick: true }, tags: ['magic', 'romance'], pages: 387, description: 'A magical competition unfolds within a mysterious black-and-white circus.' },
  { title: 'Becoming', author: 'Michelle Obama', genre: 'Memoir', price: 17.99, rating: 4.8, releaseDate: '2024-01-15', flags: { bestseller: true, editorsPick: true }, tags: ['biography', 'inspiring'], pages: 448, description: 'The deeply personal memoir of a First Lady of the United States.' },
  { title: 'The Alchemist', author: 'Paulo Coelho', genre: 'Fiction', price: 11.99, rating: 4.4, releaseDate: '2024-02-14', flags: { bestseller: true, trending: true }, tags: ['wisdom', 'journey'], pages: 208, description: 'A shepherd travels the world in search of treasure — and discovers himself.' },
  { title: 'Normal People', author: 'Sally Rooney', genre: 'Fiction', price: 13.99, rating: 4.0, releaseDate: '2024-04-12', flags: { isNewArrival: true }, tags: ['romance', 'literary'], pages: 288, description: 'Two young people navigate love, class, and connection across years.' },
  { title: 'The Power of Now', author: 'Eckhart Tolle', genre: 'Self-Help', price: 14.99, rating: 4.5, releaseDate: '2024-02-28', flags: { bestseller: true }, tags: ['spiritual', 'mindfulness'], pages: 236, description: 'A guide to spiritual enlightenment and living in the present moment.' },
  { title: 'A Brief History of Time', author: 'Stephen Hawking', genre: 'Science', price: 16.99, rating: 4.6, releaseDate: '2024-03-20', flags: { editorsPick: true }, tags: ['cosmology', 'physics'], pages: 256, description: 'A landmark exploration of black holes, the Big Bang, and the nature of time.' },
  { title: 'Gone Girl', author: 'Gillian Flynn', genre: 'Mystery', price: 12.99, rating: 4.3, releaseDate: '2024-01-28', flags: { bestseller: true, trending: true }, tags: ['thriller', 'psychological'], pages: 432, description: 'When his wife disappears, a husband becomes the prime suspect in a twisting mystery.' },
  { title: 'The Goldfinch', author: 'Donna Tartt', genre: 'Fiction', price: 16.99, rating: 4.2, releaseDate: '2024-05-05', flags: { isNewArrival: true, editorsPick: true }, tags: ['art', 'literary'], pages: 771, description: 'A boy survives a bombing and clings to a small painting that shapes his life.' },
  { title: 'Meditations', author: 'Marcus Aurelius', genre: 'Philosophy', price: 9.99, rating: 4.7, releaseDate: '2024-01-08', flags: { bestseller: true }, tags: ['stoicism', 'classics'], pages: 256, description: 'The private notebooks of a Roman emperor on virtue and the good life.' },
  { title: 'The Name of the Wind', author: 'Patrick Rothfuss', genre: 'Fantasy', price: 15.99, rating: 4.7, releaseDate: '2024-04-25', flags: { trending: true, editorsPick: true }, tags: ['magic', 'epic'], pages: 662, description: 'A legendary musician and magician recounts the story of his rise and fall.' },
  { title: 'Little Fires Everywhere', author: 'Celeste Ng', genre: 'Fiction', price: 13.49, rating: 4.4, releaseDate: '2024-03-08', flags: { bestseller: true }, tags: ['family', 'drama'], pages: 338, description: 'Two families in a planned community collide over secrets, race, and motherhood.' },
  { title: 'The Martian', author: 'Andy Weir', genre: 'Sci-Fi', price: 14.99, rating: 4.7, releaseDate: '2024-02-10', flags: { bestseller: true, trending: true }, tags: ['survival', 'space'], pages: 369, description: 'Stranded on Mars, an astronaut uses ingenuity to survive against impossible odds.' },
  { title: 'Educating the Heart', author: 'Priya Nair', genre: 'Self-Help', price: 13.99, rating: 4.5, releaseDate: '2024-05-22', flags: { isNewArrival: true }, tags: ['mindfulness'], pages: 240, description: 'A guide to cultivating compassion and resilience in everyday life.' },
  { title: "The Handmaid's Tale", author: 'Margaret Atwood', genre: 'Fiction', price: 14.49, rating: 4.4, releaseDate: '2024-01-30', flags: { editorsPick: true, trending: true }, tags: ['dystopia', 'literary'], pages: 311, description: 'In a theocratic future, a handmaid fights to reclaim her identity and freedom.' },
  { title: 'Deep Work', author: 'Cal Newport', genre: 'Self-Help', price: 16.99, rating: 4.6, releaseDate: '2024-03-18', flags: { bestseller: true, editorsPick: true }, tags: ['focus', 'productivity'], pages: 296, description: 'Rules for focused success in a distracted world.' },
  { title: 'The Priory of the Orange Tree', author: 'Samantha Shannon', genre: 'Fantasy', price: 17.99, rating: 4.3, releaseDate: '2024-04-15', flags: { isNewArrival: true, trending: true }, tags: ['dragons', 'epic'], pages: 848, description: 'A high fantasy of dragons, queens, and an ancient evil threatening the world.' },
  { title: 'Born a Crime', author: 'Trevor Noah', genre: 'Memoir', price: 15.49, rating: 4.8, releaseDate: '2024-02-05', flags: { bestseller: true }, tags: ['biography', 'humor'], pages: 304, description: 'A comedian recounts his childhood in apartheid South Africa.' },
  { title: "Harry Potter and the Sorcerer's Stone", author: 'J.K. Rowling', genre: 'Fantasy', price: 12.99, rating: 4.9, releaseDate: '2024-06-10', flags: { bestseller: true, trending: true, editorsPick: true }, tags: ['magic', 'school', 'children'], pages: 320, description: 'A young boy discovers he is a wizard and enters a hidden world of magic.' },
  { title: 'The Hobbit', author: 'J.R.R. Tolkien', genre: 'Fantasy', price: 13.99, rating: 4.8, releaseDate: '2024-03-25', flags: { bestseller: true, editorsPick: true }, tags: ['adventure', 'classic'], pages: 310, description: 'A reluctant hobbit joins a company of dwarves on a quest to reclaim a mountain.' },
  { title: 'A Court of Thorns and Roses', author: 'Sarah J. Maas', genre: 'Fantasy', price: 14.99, rating: 4.5, releaseDate: '2024-05-28', flags: { trending: true, isNewArrival: true }, tags: ['romance', 'fae'], pages: 432, description: 'A huntress is taken to a dangerous faerie realm and finds love and war.' },
  { title: 'The Body Keeps the Score', author: 'Bessel van der Kolk', genre: 'Self-Help', price: 18.49, rating: 4.6, releaseDate: '2024-02-16', flags: { bestseller: true, editorsPick: true }, tags: ['trauma', 'psychology'], pages: 464, description: 'How trauma reshapes the body and the science of healing.' },
  { title: 'Mistborn: The Final Empire', author: 'Brandon Sanderson', genre: 'Fantasy', price: 16.49, rating: 4.7, releaseDate: '2024-04-02', flags: { trending: true, editorsPick: true }, tags: ['epic', 'magic-system'], pages: 541, description: 'A thief discovers the power to topple a seemingly invincible dark lord.' },
  { title: 'The Lincoln Highway', author: 'Amor Towles', genre: 'Fiction', price: 15.99, rating: 4.3, releaseDate: '2024-05-12', flags: { isNewArrival: true }, tags: ['adventure', 'literary'], pages: 586, description: 'Two brothers embark on a cross-country journey that will change their lives.' },
  { title: 'Astrophysics for People in a Hurry', author: 'Neil deGrasse Tyson', genre: 'Science', price: 13.99, rating: 4.4, releaseDate: '2024-03-05', flags: { editorsPick: true }, tags: ['cosmology'], pages: 224, description: 'A breezy tour through the universe from quarks to quasars.' },
  { title: 'The Song of Achilles', author: 'Madeline Miller', genre: 'Fantasy', price: 14.49, rating: 4.6, releaseDate: '2024-02-20', flags: { bestseller: true, trending: true }, tags: ['mythology', 'romance'], pages: 378, description: 'A retelling of the Iliad through the bond between Achilles and Patroclus.' },
  { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', genre: 'Psychology', price: 17.99, rating: 4.5, releaseDate: '2024-03-28', flags: { editorsPick: true, bestseller: true }, tags: ['behavioral', 'economics'], pages: 499, description: 'A Nobel laureate reveals the two systems that shape how we think and decide.' },
  { title: 'The Vanishing Half', author: 'Brit Bennett', genre: 'Fiction', price: 14.99, rating: 4.4, releaseDate: '2024-04-22', flags: { isNewArrival: true, editorsPick: true }, tags: ['identity', 'literary'], pages: 345, description: 'Twin sisters whose lives diverge across race, place, and generations.' },
  { title: 'A Gentleman in Moscow', author: 'Amor Towles', genre: 'Fiction', price: 15.49, rating: 4.6, releaseDate: '2024-01-18', flags: { bestseller: true }, tags: ['historical', 'literary'], pages: 462, description: 'A Russian aristocrat under house arrest finds meaning within a grand hotel.' },
  { title: 'The Wolf and the Woodsman', author: 'Ava Reid', genre: 'Fantasy', price: 14.99, rating: 4.2, releaseDate: '2024-05-30', flags: { isNewArrival: true }, tags: ['folktale'], pages: 360, description: 'A pagan woman and a disgraced prince converge in a land of myth and faith.' },
  { title: 'Outliers', author: 'Malcolm Gladwell', genre: 'Self-Help', price: 15.99, rating: 4.4, releaseDate: '2024-02-26', flags: { bestseller: true }, tags: ['sociology'], pages: 309, description: 'What makes high achievers different — and why context matters more than talent.' },
  { title: 'The Institute', author: 'Stephen King', genre: 'Thriller', price: 16.99, rating: 4.3, releaseDate: '2024-04-08', flags: { trending: true }, tags: ['psychic', 'horror'], pages: 561, description: 'Children with special gifts are held in a secret institute — and plot escape.' },
  { title: 'Cunt: A Declaration of Independence', author: 'Inga Muscio', genre: 'Philosophy', price: 13.99, rating: 4.1, releaseDate: '2024-03-12', flags: {}, tags: ['feminism'], pages: 256, description: 'A bold reclaimed manifesto on womanhood and autonomy.' },
  { title: 'The Overstory', author: 'Richard Powers', genre: 'Fiction', price: 15.99, rating: 4.2, releaseDate: '2024-05-08', flags: { editorsPick: true, isNewArrival: true }, tags: ['nature', 'literary'], pages: 502, description: 'Nine strangers, summoned in different ways by trees, undertake a fight for the forests.' },
  { title: 'Hyperion', author: 'Dan Simmons', genre: 'Sci-Fi', price: 17.49, rating: 4.5, releaseDate: '2024-03-30', flags: { trending: true, editorsPick: true }, tags: ['space-opera', 'literary'], pages: 482, description: 'Seven pilgrims share their stories on a voyage to a deadly world of time.' },
  { title: 'The Five People You Meet in Heaven', author: 'Mitch Albom', genre: 'Fiction', price: 12.49, rating: 4.4, releaseDate: '2024-01-25', flags: { bestseller: true }, tags: ['afterlife', 'heartfelt'], pages: 196, description: 'A maintenance man dies and meets five souls who shaped his life.' },
  { title: 'Bad Blood', author: 'John Carreyrou', genre: 'True Crime', price: 16.99, rating: 4.6, releaseDate: '2024-04-18', flags: { editorsPick: true, trending: true }, tags: ['fraud', 'silicon-valley'], pages: 339, description: 'The inside story of the Theranos collapse and its unraveling.' },
  { title: 'The Bone Season', author: 'Samantha Shannon', genre: 'Fantasy', price: 14.99, rating: 4.1, releaseDate: '2024-05-15', flags: { isNewArrival: true }, tags: ['dystopia'], pages: 458, description: 'A clairvoyant is captured by a secretive ruling race in a future Oxford.' },
  { title: 'Atomic City Girls', author: 'June Hur', genre: 'Historical', price: 14.49, rating: 4.0, releaseDate: '2024-05-25', flags: { isNewArrival: true }, tags: ['historical'], pages: 320, description: 'A young woman working at a secret wartime facility uncovers a deadly truth.' },
];

const GENRES = ['Fiction', 'Fantasy', 'Sci-Fi', 'Mystery', 'Self-Help', 'Memoir', 'Philosophy', 'History', 'Science', 'Psychology', 'Thriller', 'Historical', 'True Crime'];
const PUBLISHERS = ['Penguin Random House', 'HarperCollins', 'Macmillan', 'Simon & Schuster', 'Houghton Mifflin', 'Knopf', 'Bloomsbury', 'Tor Books'];
const LANGS = ['English', 'Spanish', 'French', 'German', 'Japanese'];

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function extend(): void {
  const extra: Seed[] = [];
  const extraTitles = [
    'Echoes of Tomorrow', 'The Last Cartographer', 'Beneath Crimson Tides', 'Whispers in Glass Halls',
    'The Astronomer of Marrakech', 'Velvet and Vellum', 'Cities of Salt', 'The Lighthouse Keeper',
    'Children of the Pine', 'A Map of Forgotten Things', 'The Glass Republic', 'Silver and Smoke',
    'The Ironwood Throne', 'Songs of the Quiet Sea', 'The Cartomancer', 'Embers in the Snow',
    'The Weaver of Calm', 'A Year Beneath the Stars', 'The Forgotten Library', 'Halls of Amber',
  ];
  extraTitles.forEach((title, i) => {
    const genre = GENRES[(i * 3) % GENRES.length];
    extra.push({
      title,
      author: NAMES[(i * 7) % NAMES.length],
      genre: i % 5 === 0 ? genre.toUpperCase() : genre,
      price: Math.round((9.99 + Math.random() * 12) * 100) / 100,
      rating: Math.round((3.6 + Math.random() * 1.4) * 10) / 10,
      releaseDate: `2024-${pad(1 + (i % 6))}-${pad(1 + (i * 3) % 28)}`,
      tags: ['literary'],
      pages: 280 + Math.floor(Math.random() * 300),
      flags: { isNewArrival: i % 4 === 0, trending: i % 5 === 0 },
    });
  });
  SEEDS.push(...extra);
}
extend();

function normalizeGenre(g: string): string {
  return g.charAt(0).toUpperCase() + g.slice(1).toLowerCase();
}

export const books: Book[] = SEEDS.map((s, idx) => {
  const seed = `${s.title.replace(/\s+/g, '')}${idx}`;
  const reviewCount = Math.floor(20 + Math.random() * 4800);
  const availability: Book['availability'] =
    s.flags?.isNewArrival ? 'preorder' : Math.random() > 0.85 ? 'limited' : 'in-stock';
  const originalPrice = Math.random() > 0.6 ? Math.round((s.price * 1.25 + 2) * 100) / 100 : undefined;
  return {
    id: String(idx + 1),
    title: s.title,
    author: s.author,
    cover: COVER(seed + idx),
    price: s.price,
    originalPrice,
    rating: s.rating,
    reviewCount,
    genre: normalizeGenre(s.genre),
    tags: s.tags || [],
    description:
      s.description ||
      `${s.title} is a captivating ${s.genre.toLowerCase()} novel by ${s.author}. Readers praise its depth, vivid characters, and unforgettable prose.`,
    publisher: PUBLISHERS[idx % PUBLISHERS.length],
    publishedYear: 1990 + (idx % 35),
    pages: s.pages || 300 + idx,
    language: LANGS[idx % LANGS.length],
    isbn: `978-${1000000000 + idx * 137}`,
    availability,
    ...s.flags,
    releaseDate: s.releaseDate,
    reviews: makeReviews(seed, Math.min(6, Math.max(3, reviewCount % 7))),
    chapters: CH(8 + (idx % 6)),
    similar: [],
  };
});

// Wire similar books — same genre picks
books.forEach((b) => {
  b.similar = books
    .filter((x) => x.genre === b.genre && x.id !== b.id)
    .slice(0, 6)
    .map((x) => x.id);
});

export const genres: string[] = Array.from(new Set(books.map((b) => b.genre))).sort();
export const authors: string[] = Array.from(new Set(books.map((b) => b.author))).sort();

export const quotes: { text: string; author: string }[] = [
  { text: 'A reader lives a thousand lives before he dies. The man who never reads lives only one.', author: 'George R.R. Martin' },
  { text: 'Books are a uniquely portable magic.', author: 'Stephen King' },
  { text: 'Until I feared I would lose it, I never loved to read. One does not love breathing.', author: 'Harper Lee' },
  { text: 'A room without books is like a body without a soul.', author: 'Cicero' },
  { text: 'There is no friend as loyal as a book.', author: 'Ernest Hemingway' },
  { text: 'Books are the quietest and most constant of friends.', author: 'Christopher Morley' },
  { text: 'Reading is to the mind what exercise is to the body.', author: 'Joseph Addison' },
  { text: 'The more that you read, the more things you will know.', author: 'Dr. Seuss' },
];

export const testimonials = [
  {
    name: 'Amara Okafor',
    role: 'Book Blogger',
    avatar: AVATAR('Amara Okafor'),
    rating: 5,
    text: 'BookVerse has completely transformed how I discover books. The AI assistant nailed my taste within a week!',
  },
  {
    name: 'Daniel Pierce',
    role: 'Member since 2023',
    avatar: AVATAR('Daniel Pierce'),
    rating: 5,
    text: 'The reading tracker keeps me on pace for my yearly goal. The UI is the most beautiful of any bookstore online.',
  },
  {
    name: 'Lena Costa',
    role: 'Educator',
    avatar: AVATAR('Lena Costa'),
    rating: 4,
    text: 'I love the book of the day and the quotes. It feels like a curated literary companion, not just a shop.',
  },
];

export const collections = [
  { name: 'Mindful Mornings', genre: 'Self-Help', description: 'Start each day grounded and inspired.', image: COVER('mm') },
  { name: 'Galaxies & Beyond', genre: 'Sci-Fi', description: 'Travel the cosmos without leaving your chair.', image: COVER('gg') },
  { name: 'Murder Most Foul', genre: 'Mystery', description: 'Page-turning whodunits for cold nights.', image: COVER('mm2') },
  { name: 'Magic Realms', genre: 'Fantasy', description: 'Sweeping epics of power, destiny, and wonder.', image: COVER('mr') },
  { name: 'Heart of Memoir', genre: 'Memoir', description: 'True stories that move and transform.', image: COVER('hm') },
  { name: 'Big Ideas', genre: 'Philosophy', description: 'Think deeper, live fully.', image: COVER('bi') },
];

export function bookOfTheDay(): Book {
  const day = Math.floor(Date.now() / 86400000);
  return books[day % books.length];
}
