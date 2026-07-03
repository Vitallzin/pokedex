import React from 'react';
import { Heart } from 'lucide-react';
import { useFavorites } from '../../hooks/useFavorites';
import { PokemonCard } from '../../components/pokemon/PokemonCard';
import './style.css';

export const Favorites: React.FC = () => {
  const { favorites, maxFavorites } = useFavorites();
  const reachedFavoriteLimit = favorites.length >= maxFavorites;

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <h2>Meus Favoritos</h2>
        <p>
          Acompanhe todos os Pokémon que você favoritou.
          {' '}
          {favorites.length}/{maxFavorites}
        </p>
        {reachedFavoriteLimit && (
          <p className="favorites-limit">Você chegou ao limite de favoritos desta conta.</p>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="empty-favorites">
          <div className="empty-icon" aria-hidden="true">
            <Heart size={56} strokeWidth={1.8} />
          </div>
          <h3>Sua lista está vazia</h3>
          <p>Explore a Pokédex e favorite seus Pokémon preferidos!</p>
        </div>
      ) : (
        <div className="pokemon-grid">
          {favorites.map(pokemon => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
          ))}
        </div>
      )}
    </div>
  );
};
