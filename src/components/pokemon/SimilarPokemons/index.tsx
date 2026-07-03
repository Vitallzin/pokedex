import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { pokemonService } from '../../../services/pokemonService';
import { PokemonCard } from '../PokemonCard';
import type { Pokemon } from '../../../types/pokemon';
import './style.css';

interface SimilarPokemonsProps {
  type: string;
}

export const SimilarPokemons: React.FC<SimilarPokemonsProps> = ({ type }) => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchSimilar = async () => {
      try {
        const data = await pokemonService.getPokemonsByType(type);
        setPokemons(data);
      } catch (error) {
        console.error('Error fetching similar pokemons:', error);
      }
    };

    fetchSimilar();
  }, [type]);

  const scrollCards = (direction: 'left' | 'right') => {
    const container = scrollRef.current;
    if (!container) return;

    const cardWidth = container.querySelector('.similar-card-wrapper')?.clientWidth ?? 220;
    container.scrollBy({
      left: direction === 'right' ? cardWidth + 16 : -(cardWidth + 16),
      behavior: 'smooth',
    });
  };

  return (
    <div className="similar-carousel">
      <button
        className="similar-nav-btn"
        onClick={() => scrollCards('left')}
        aria-label="Ver Pokémon semelhantes anteriores"
      >
        <ChevronLeft size={22} />
      </button>

      <div className="similar-scroll" ref={scrollRef}>
        {pokemons.map(pokemon => (
          <div key={pokemon.id} className="similar-card-wrapper">
            <PokemonCard pokemon={pokemon} />
          </div>
        ))}
      </div>

      <button
        className="similar-nav-btn"
        onClick={() => scrollCards('right')}
        aria-label="Ver próximos Pokémon semelhantes"
      >
        <ChevronRight size={22} />
      </button>
    </div>
  );
};
