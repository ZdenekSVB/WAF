
import { defineStore } from 'pinia';

export const useFavoriteHeroesStore = defineStore('favoriteHeroes', {
  state: () => ({
    favoriteHeroes: [] as Array<any>, // Initialize with empty array
  }),
  getters: {
    getFavoriteHeroes: (state) => state.favoriteHeroes,
    isFavorite: (state) => (heroId: number) =>
      state.favoriteHeroes.some((hero) => hero.id === heroId),
  },
  actions: {
    addToFavorites(hero) {
      if (!this.isFavorite(hero.id)) {
        this.favoriteHeroes.push(hero);
        this.persistFavorites(); // Save favorites to localStorage
        alert(`${hero.localized_name} has been added to your favorites.`);
      } else {
        alert(`${hero.localized_name} is already in your favorites.`);
      }
    },
    removeFromFavorites(hero) {
      this.favoriteHeroes = this.favoriteHeroes.filter(
        (favHero) => favHero.id !== hero.id
      );
      this.persistFavorites(); // Save favorites to localStorage
      alert(`${hero.localized_name} has been removed from your favorites.`);
    },
    loadFavorites() {
      const storedFavorites = JSON.parse(localStorage.getItem('favoriteHeroes') || '[]');
      this.favoriteHeroes = storedFavorites;
    },
    persistFavorites() {
      localStorage.setItem('favoriteHeroes', JSON.stringify(this.favoriteHeroes));
    },
  },
});
