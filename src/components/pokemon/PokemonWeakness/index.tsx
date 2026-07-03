import React from 'react';
import './style.css';

interface PokemonWeaknessProps {
  weaknesses: string[];
}

export const PokemonWeakness: React.FC<PokemonWeaknessProps> = ({ weaknesses }) => {
  return (
    <div className="pokemon-weakness-container">
      <h4 className="weakness-title">Fraquezas</h4>
      <div className="weakness-list">
        {weaknesses.map((type) => (
          <span key={type} className={`weakness-badge ${type}`}>
            {type}
          </span>
        ))}
      </div>
    </div>
  );
};
