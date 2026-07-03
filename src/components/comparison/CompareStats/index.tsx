import React from 'react';
import type { Pokemon, PokemonStat } from '../../../types/pokemon';
import './style.css';

interface CompareStatsProps {
  p1: Pokemon;
  p2: Pokemon;
}

const statNames: { [key: string]: string } = {
  hp: 'HP',
  attack: 'ATK',
  defense: 'DEF',
  'special-attack': 'SATK',
  'special-defense': 'SDEF',
  speed: 'SPD',
};

export const CompareStats: React.FC<CompareStatsProps> = ({ p1, p2 }) => {
  return (
    <div className="compare-stats-container">
      {p1.stats.map((s1: PokemonStat, index: number) => {
        const s2 = p2.stats[index];
        const max = Math.max(s1.base_stat, s2.base_stat, 1);
        
        return (
          <div key={s1.stat.name} className="comp-stat-row">
            <div className="comp-bar-left">
              <div className="val">{s1.base_stat}</div>
              <div className="bar-bg">
                <div 
                  className={`bar ${s1.base_stat > s2.base_stat ? 'winner' : ''}`}
                  style={{ width: `${(s1.base_stat / max) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="comp-stat-name">{statNames[s1.stat.name] || s1.stat.name}</div>
            
            <div className="comp-bar-right">
              <div className="bar-bg">
                <div 
                  className={`bar ${s2.base_stat > s1.base_stat ? 'winner' : ''}`}
                  style={{ width: `${(s2.base_stat / max) * 100}%` }}
                ></div>
              </div>
              <div className="val">{s2.base_stat}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
