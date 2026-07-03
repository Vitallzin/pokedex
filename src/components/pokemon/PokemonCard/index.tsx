import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useFavorites } from '../../../hooks/useFavorites';
import { typeColors } from '../../../data/pokemonTypes';
import { formatPokemonId } from '../../../utils/formatPokemonId';
import type { Pokemon, PokemonType } from '../../../types/pokemon';
import './style.css';

interface PokemonCardProps {
  pokemon: Pokemon;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const mainType = pokemon.types?.[0]?.type.name ?? 'normal';
  const mainTypeColor = typeColors[mainType] ?? typeColors.normal;
  const artwork =
    pokemon.sprites?.other?.['official-artwork']?.front_default ||
    pokemon.sprites?.other?.dream_world?.front_default ||
    pokemon.sprites?.front_default;
  const isFav = isFavorite(pokemon.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(pokemon);
  };

  return (
    <Link to={`/pokemon/${pokemon.id}`} className="pokemon-card">
      <button 
        className={`favorite-btn ${isFav ? 'is-favorite' : ''}`}
        onClick={handleFavoriteClick}
        aria-label={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      >
        <Heart size={20} fill={isFav ? 'currentColor' : 'none'} />
      </button>

      <div className="card-image" style={{ backgroundColor: `${mainTypeColor}33` }}>
        {artwork && <img src={artwork} alt={pokemon.name} />}
      </div>
      <div className="card-info">
        <span className="pokemon-id">{formatPokemonId(pokemon.id)}</span>
        <h3 className="pokemon-name">{pokemon.name}</h3>
        <div className="pokemon-types">
          {(pokemon.types ?? []).map((t: PokemonType) => (
            <span 
              key={t.type.name} 
              className="type-badge"
              style={{ backgroundColor: typeColors[t.type.name] }}
            >
              {t.type.name}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};
