import { Place, PlaceFilters, PlaceFormData, PlaceStats } from '@/types';
import { mockPlaces } from '@/mocks/data/places';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';
const PLACES_KEY = 'baljakuk_places';

// --- mock 내부 헬퍼 ---

function loadPlaces(): Place[] {
  if (typeof window === 'undefined') return [...mockPlaces];
  const raw = localStorage.getItem(PLACES_KEY);
  if (!raw) {
    localStorage.setItem(PLACES_KEY, JSON.stringify(mockPlaces));
    return [...mockPlaces];
  }
  return JSON.parse(raw);
}

function savePlaces(places: Place[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(PLACES_KEY, JSON.stringify(places));
  }
}

function applyFilters(places: Place[], filters?: PlaceFilters): Place[] {
  let result = [...places];

  if (filters?.category && filters.category !== 'all') {
    result = result.filter((p) => p.category === filters.category);
  }

  if (filters?.search?.trim()) {
    const q = filters.search.trim().toLowerCase();
    result = result.filter(
      (p) => p.name.toLowerCase().includes(q) || p.address.toLowerCase().includes(q),
    );
  }

  switch (filters?.sort) {
    case 'oldest':
      result.sort((a, b) => a.visitDate.localeCompare(b.visitDate));
      break;
    case 'rating-high':
      result.sort((a, b) => b.rating - a.rating || b.visitDate.localeCompare(a.visitDate));
      break;
    case 'rating-low':
      result.sort((a, b) => a.rating - b.rating || b.visitDate.localeCompare(a.visitDate));
      break;
    case 'name':
      result.sort((a, b) => a.name.localeCompare(b.name, 'ko'));
      break;
    default: // latest
      result.sort((a, b) => b.visitDate.localeCompare(a.visitDate));
  }

  return result;
}

// --- public API ---

export const placeService = {
  async getAllPlaces(filters?: PlaceFilters): Promise<Place[]> {
    if (USE_MOCK) return applyFilters(loadPlaces(), filters);
    // TODO: 백엔드 연동 시 교체
    return [];
  },

  async getRecentPlaces(limit = 6): Promise<Place[]> {
    if (USE_MOCK) {
      return [...loadPlaces()]
        .sort((a, b) => b.visitDate.localeCompare(a.visitDate))
        .slice(0, limit);
    }
    return [];
  },

  async getPlaceById(id: number): Promise<Place | null> {
    if (USE_MOCK) return loadPlaces().find((p) => p.id === id) ?? null;
    return null;
  },

  async getStats(): Promise<PlaceStats> {
    if (USE_MOCK) {
      const places = loadPlaces();
      const now = new Date();
      const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      return {
        total: places.length,
        thisMonth: places.filter((p) => p.visitDate.startsWith(ym)).length,
        categories: new Set(places.map((p) => p.category)).size,
      };
    }
    return { total: 0, thisMonth: 0, categories: 0 };
  },

  async createPlace(data: PlaceFormData): Promise<Place> {
    if (USE_MOCK) {
      const places = loadPlaces();
      const newPlace: Place = { ...data, id: Date.now() };
      savePlaces([newPlace, ...places]);
      return newPlace;
    }
    // TODO: 백엔드 연동 시 교체
    throw new Error('Not implemented');
  },

  async updatePlace(id: number, data: PlaceFormData): Promise<Place> {
    if (USE_MOCK) {
      const places = loadPlaces();
      const idx = places.findIndex((p) => p.id === id);
      if (idx < 0) throw new Error('장소를 찾을 수 없습니다.');
      const updated: Place = { ...data, id };
      places[idx] = updated;
      savePlaces(places);
      return updated;
    }
    throw new Error('Not implemented');
  },

  async deletePlace(id: number): Promise<void> {
    if (USE_MOCK) {
      savePlaces(loadPlaces().filter((p) => p.id !== id));
      return;
    }
    throw new Error('Not implemented');
  },
};
