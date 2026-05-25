export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export type PlaceCategory = '명소' | '관광지' | '공원' | '공연장' | '극장' | '음식점';

export interface Place {
  id: number;
  name: string;
  category: PlaceCategory;
  address: string;
  visitDate: string; // YYYY-MM-DD
  rating: number;   // 1~5
  memo: string;
  imageUrl?: string;
}

export interface PlaceStats {
  total: number;
  thisMonth: number;
  categories: number;
}

export type PlaceSortKey = 'latest' | 'oldest' | 'rating-high' | 'rating-low' | 'name';

export interface PlaceFilters {
  category?: PlaceCategory | 'all';
  sort?: PlaceSortKey;
  search?: string;
}

export type PlaceFormData = Omit<Place, 'id'>;

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}
