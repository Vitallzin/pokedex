import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { EvolutionNode } from '../../../types/pokemon';
import './style.css';

interface EvolutionChainProps {
  chain: EvolutionNode;
}

interface EvolutionItem {
  name: string;
  id: string | undefined;
  image: string;
}

export const EvolutionChain: React.FC<EvolutionChainProps> = ({ chain }) => {
  const getEvolutionArray = (node: EvolutionNode): EvolutionItem[] => {
    const evolutions: EvolutionItem[] = [];
    let current: EvolutionNode | undefined = node;

    while (current) {
      const id = current.species.url.split('/').filter(Boolean).pop();
      evolutions.push({
        name: current.species.name,
        id,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
      });
      current = current.evolves_to[0];
    }
    return evolutions;
  };

  const evolutions = getEvolutionArray(chain);

  return (
    <div className="evolution-chain">
      {evolutions.map((evo, index) => (
        <React.Fragment key={evo.id}>
          <Link to={`/pokemon/${evo.id}`} className="evolution-item">
            <div className="evo-image-bg">
              <img src={evo.image} alt={evo.name} />
            </div>
            <span className="evo-name">{evo.name}</span>
          </Link>
          {index < evolutions.length - 1 && (
            <div className="evo-arrow">
              <ChevronRight size={20} />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
