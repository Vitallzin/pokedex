import React, { useEffect, useState } from 'react';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import type { Pokemon } from '../types/pokemon';
import { db } from '../services/firebase';
import { FavoritesContext } from './favoritesContextValue';

const MAX_FAVORITES = 100;

const getLegacyFavorites = (userId: string) => {
  const saved = localStorage.getItem(`favorites_${userId}`);
  return saved ? JSON.parse(saved) as Pokemon[] : [];
};

const sanitizePokemon = (pokemon: Pokemon) => JSON.parse(JSON.stringify(pokemon)) as Pokemon;

const getFavoritesRef = (userId: string) => {
  if (!db) return null;
  return doc(db, 'users', userId, 'favorites', 'current');
};

const saveFavorites = async (userId: string, favorites: Pokemon[]) => {
  const favoritesRef = getFavoritesRef(userId);
  if (!favoritesRef) return;

  await setDoc(favoritesRef, {
    items: favorites.slice(0, MAX_FAVORITES).map(sanitizePokemon),
    updatedAt: serverTimestamp(),
  });
};

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [favoritesByUser, setFavoritesByUser] = useState<Record<string, Pokemon[]>>({});
  const favorites = user ? favoritesByUser[user.id] ?? [] : [];

  useEffect(() => {
    if (!user) return;

    let isMounted = true;

    const loadFavorites = async () => {
      const favoritesRef = getFavoritesRef(user.id);
      const legacyFavorites = getLegacyFavorites(user.id).slice(0, MAX_FAVORITES);

      if (!favoritesRef) {
        if (isMounted) {
          setFavoritesByUser(prev => ({ ...prev, [user.id]: legacyFavorites }));
        }
        return;
      }

      const snapshot = await getDoc(favoritesRef);
      const remoteFavorites = snapshot.exists()
        ? (snapshot.data().items as Pokemon[] | undefined) ?? []
        : legacyFavorites;

      const safeFavorites = remoteFavorites.slice(0, MAX_FAVORITES);

      if (!snapshot.exists() && legacyFavorites.length > 0) {
        await saveFavorites(user.id, safeFavorites);
      }

      localStorage.removeItem(`favorites_${user.id}`);

      if (isMounted) {
        setFavoritesByUser(prev => ({ ...prev, [user.id]: safeFavorites }));
      }
    };

    void loadFavorites();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const toggleFavorite = (pokemon: Pokemon) => {
    if (!user) return;

    setFavoritesByUser(prev => {
      const currentFavorites = prev[user.id] ?? [];
      const isFav = currentFavorites.some(p => p.id === pokemon.id);
      const updated = isFav
        ? currentFavorites.filter(p => p.id !== pokemon.id)
        : currentFavorites.length >= MAX_FAVORITES
          ? currentFavorites
          : [...currentFavorites, pokemon];

      void saveFavorites(user.id, updated);
      return { ...prev, [user.id]: updated };
    });
  };

  const isFavorite = (id: number) => {
    return favorites.some(p => p.id === id);
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      maxFavorites: MAX_FAVORITES,
      toggleFavorite,
      isFavorite
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};
