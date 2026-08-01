import { books as seedBooks, genres as seedGenres } from '../data/books';
import type { Book } from '../types';
import {
  recommendByGenre,
  recommendByRating,
  recommendForBeginners,
  recommendSimilar,
  searchBooks,
} from './search';

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  books?: Book[];
}

const GENRE_KEYWORDS = [
  'mystery', 'fantasy', 'sci-fi', 'scifi', 'fiction', 'self-help', 'memoir',
  'history', 'philosophy', 'science', 'psychology', 'thriller', 'romance', 'historical',
];

function pickN(arr: Book[], n: number): Book[] {
  return arr.slice(0, n);
}

export function respond(query: string, source: Book[] = seedBooks): AIMessage {
  const q = query.trim();
  const lower = q.toLowerCase();
  const genres = seedGenres;

  if (!q) {
    return msg('Hi! I’m Verse, your reading assistant. Ask me to recommend books by genre, mood, or similarity to a favorite.', []);
  }

  // Similar to <title>
  const similarMatch = lower.match(/similar (?:to |like )?(.+)/);
  if (similarMatch) {
    const title = similarMatch[1].replace(/\?$/, '');
    const recs = recommendSimilar(title, 5, source);
    if (recs.length) {
      return msg(`Here are books similar to "${title}" you might love:`, recs);
    }
    return msg(`I couldn't find "${title}" in our catalog. Try another title?`, []);
  }

  // Beginners
  if (/beginner|new reader|where to start|easy read/.test(lower)) {
    return msg('These accessible, beloved reads are perfect starting points:', pickN(recommendForBeginners(5, source), 5));
  }

  // By rating
  if (/rating|highest rated|best rated|top rated|top books/.test(lower)) {
    return msg('Our highest rated books of the moment:', pickN(recommendByRating(5, source), 5));
  }

  // Trending
  if (/trend|popular|trending|hot/.test(lower)) {
    const trending = source.filter((b) => b.trending).slice(0, 5);
    return msg('Trending right now on BookVerse:', trending);
  }

  // Genre recommendation
  for (const g of GENRE_KEYWORDS) {
    if (lower.includes(g)) {
      const recs = recommendByGenre(g, 5, source);
      if (recs.length) {
        return msg(`Here are my favorite ${g} reads:`, recs);
      }
    }
  }

  // Available genres
  if (/what.*genre|list genre|categories/.test(lower)) {
    return msg(`We stock books across ${genres.length} genres: ${genres.join(', ')}. Which one speaks to you?`, []);
  }

  // Search by free text
  const found = searchBooks(q, source).slice(0, 5);
  if (found.length) {
    return msg(`I found ${found.length} books for "${q}":`, found);
  }

  return msg(
    `I'm not sure about that one. Try asking for a genre (e.g. "recommend mystery books"), a mood, or say "books similar to Dune".`,
    []
  );
}

function msg(content: string, books: Book[]): AIMessage {
  return {
    id: Math.random().toString(36).slice(2),
    role: 'assistant',
    content,
    books: books.length ? books : undefined,
  };
}
