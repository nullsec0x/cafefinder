import { useState, useEffect } from 'react';

const FAVORITES_KEY = 'cozy-cafe-finder-favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem(FAVORITES_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error);
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error);
    }
  }, [favorites]);

  const addToFavorites = (cafe) => {
    setFavorites(prev => {
      // Check if cafe is already in favorites
      const isAlreadyFavorite = prev.some(fav => fav.id === cafe.id);
      if (isAlreadyFavorite) {
        return prev;
      }
      return [...prev, cafe];
    });
  };

  const removeFromFavorites = (cafeId) => {
    setFavorites(prev => prev.filter(fav => fav.id !== cafeId));
  };

  const toggleFavorite = (cafe) => {
    const isFavorite = favorites.some(fav => fav.id === cafe.id);
    if (isFavorite) {
      removeFromFavorites(cafe.id);
    } else {
      addToFavorites(cafe);
    }
  };

  const isFavorite = (cafeId) => {
    return favorites.some(fav => fav.id === cafeId);
  };

  const clearAllFavorites = () => {
    setFavorites([]);
  };

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    clearAllFavorites,
    favoritesCount: favorites.length
  };
};

export default useFavorites;

