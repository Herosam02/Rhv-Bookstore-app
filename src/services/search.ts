import { books as seedBooks } from '../data/books';
import type { Book } from '../types';

export interface SearchMatch {
  book: Book;
  field: 'title' | 'author' | 'genre' | 'tag';
  snippet: string;
}

export function searchBooks(query: string, source: Book[] = seedBooks): Book[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return source
    .filter((b) => {
      return (
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.genre.toLowerCase().includes(q) ||
        b.tags.some((t) => t.toLowerCase().includes(q)) ||
        b.description.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => score(b, q) - score(a, q));
}

function score(b: Book, q: string): number {
  let s = 0;
  if (b.title.toLowerCase().startsWith(q)) s += 50;
  if (b.title.toLowerCase().includes(q)) s += 20;
  if (b.author.toLowerCase().includes(q)) s += 15;
  if (b.genre.toLowerCase().includes(q)) s += 10;
  if (b.tags.some((t) => t.toLowerCase().includes(q))) s += 8;
  s += b.rating;
  return s;
}

export function suggest(query: string, limit = 6, source: Book[] = seedBooks): SearchMatch[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const matches: SearchMatch[] = [];
  const seen = new Set<string>();
  for (const b of source) {
    if (matches.length >= limit) break;
    const fields: Array<[SearchMatch['field'], string]> = [
      ['title', b.title],
      ['author', b.author],
      ['genre', b.genre],
    ];
    for (const [field, val] of fields) {
      const lower = val.toLowerCase();
      const idx = lower.indexOf(q);
      if (idx !== -1 && !seen.has(b.id + field)) {
        seen.add(b.id + field);
        matches.push({ book: b, field, snippet: highlight(val, idx, q.length) });
        break;
      }
    }
  }
  return matches;
}

function highlight(text: string, start: number, len: number): string {
  const before = Math.max(0, start - 12);
  const after = Math.min(text.length, start + len + 18);
  const prefix = before > 0 ? '…' : '';
  const suffix = after < text.length ? '…' : '';
  return `${prefix}${text.slice(before, after)}${suffix}`;
}

export const popularSearches = [
  'Harry Potter',
  'Mystery',
  'Self-help',
  'Fantasy',
  'Dune',
  'Thriller',
];

export function recommendByGenre(genre: string, limit = 6, source: Book[] = seedBooks): Book[] {
  const g = genre.toLowerCase();
  return source
    .filter((b) => b.genre.toLowerCase().includes(g) || b.tags.some((t) => t.toLowerCase().includes(g)))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

export function recommendSimilar(title: string, limit = 6, source: Book[] = seedBooks): Book[] {
  const target = source.find((b) => b.title.toLowerCase().includes(title.toLowerCase()));
  if (!target) return recommendByGenre(title, limit, source);
  return [...(target.similar || []).map((id) => source.find((b) => b.id === id)!)]
    .filter(Boolean)
    .slice(0, limit);
}

export function recommendForBeginners(limit = 6, source: Book[] = seedBooks): Book[] {
  return source
    .filter((b) => b.pages <= 360 && b.rating >= 4.3)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

export function recommendByRating(limit = 6, source: Book[] = seedBooks): Book[] {
  return [...source].sort((a, b) => b.rating - a.rating).slice(0, limit);
}
