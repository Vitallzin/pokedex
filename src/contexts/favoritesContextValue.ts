import { createContext } from 'react';
import type { Pokemon } from '../types/pokemon';

export interface FavoritesContextType {
  favorites: Pokemon[];
  maxFavorites: number;
  toggleFavorite: (pokemon: Pokemon) => void;
  isFavorite: (id: number) => boolean;
}

export const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);
