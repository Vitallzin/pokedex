import React from 'react';
import './style.css';

interface PokemonAnimationProps {
  id: number;
  name: string;
  size?: number;
}

export const PokemonAnimation: React.FC<PokemonAnimationProps> = ({ id, name, size = 150 }) => {
  // Using animated sprites from Showdown (via raw.githubusercontent.com)
  const animatedUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${id}.gif`;
  
  return (
    <div className="pokemon-animation" style={{ width: size, height: size }}>
      <img 
        src={animatedUrl} 
        alt={name} 
        className="animated-sprite"
        onError={(e) => {
          // Fallback to official artwork if gif fails
          (e.target as HTMLImageElement).src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
        }}
      />
    </div>
  );
};
