"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toggleFavoriteClient, getFavoritesClient } from '@/lib/services';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

type FavoritesContextType = {
  favorites: number[]; // Stores only ad IDs
  toggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
};

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  toggleFavorite: () => {},
  isFavorite: () => false,
});

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    let isMounted = true;
    if (user) {
      getFavoritesClient(user.id).then(ads => {
        if (isMounted && ads) {
            // Filter non-null and valid IDs
            const validIds = ads
              .filter((ad: any) => ad && typeof ad.id === 'number')
              .map((ad: any) => ad.id);
            setFavorites(validIds);
        }
      });
    } else {
      setFavorites([]);
    }
    return () => { isMounted = false; };
  }, [user]);

  const toggleFavorite = async (id: number) => {
    // 1. USER CHECK
    if (!user) {
        addToast('Please login to add to favorites.', 'error');
        return;
    }

    // 2. OPTIMISTIC UPDATE (Instant UI feedback)
    const isAlreadyFav = favorites.includes(id);
    if (isAlreadyFav) {
        setFavorites(prev => prev.filter(fid => fid !== id));
        addToast('Removed from favorites.', 'info');
    } else {
        setFavorites(prev => [...prev, id]);
        addToast('Added to favorites.', 'success');
    }

    // 3. BACKEND SYNC
    try {
      await toggleFavoriteClient(user.id, id);
    } catch (error) {
      console.error("Favorite action failed:", error);
      addToast('An error occurred.', 'error');

      // Revert on error
      if (isAlreadyFav) setFavorites(prev => [...prev, id]);
      else setFavorites(prev => prev.filter(fid => fid !== id));
    }
  };

  const isFavorite = (id: number) => favorites.includes(id);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}