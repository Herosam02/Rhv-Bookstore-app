export type ReadingStatus = 'reading' | 'completed' | 'want' | null;

export interface Review {
  id: string;
  user: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  likes: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  genre: string;
  tags: string[];
  description: string;
  publisher: string;
  publishedYear: number;
  pages: number;
  language: string;
  isbn: string;
  availability: 'in-stock' | 'limited' | 'preorder';
  bestseller?: boolean;
  isNewArrival?: boolean;
  editorsPick?: boolean;
  trending?: boolean;
  releaseDate: string;
  reviews: Review[];
  chapters: string[];
  similar?: string[];
}

export interface CartItem {
  id: string;
  title: string;
  author: string;
  cover: string;
  price: number;
  quantity: number;
}

export interface ReadingStat {
  bookId: string;
  status: ReadingStatus;
  progress: number;
  addedAt: string;
  finishedAt?: string;
}

export interface OrderItem {
  id: string;
  title: string;
  author: string;
  cover: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  user_id: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  platformFee: number;
  tax: number;
  total: number;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_intent_id?: string;
  stripe_session_id?: string;
  createdAt: string;
}

export interface Playlist {
  id: string;
  user_id: string;
  title: string;
  description: string;
  cover?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface PlaylistItem {
  id: string;
  playlistId: string;
  bookId: string;
  position: number;
  addedAt: string;
}