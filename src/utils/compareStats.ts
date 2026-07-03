// compareStats.ts
import type { Pokemon } from '../types/pokemon';
import { calculateEffectiveness } from '../data/typeAdvantages';

/**
 * Get a specific stat value from a Pokemon
 */
export function getStatValue(p: Pokemon, statName: string): number {
  const found = p.stats.find(s => s.stat.name === statName);
  return found ? found.base_stat : 0;
}

/**
 * Calculates a Battle Score based on damage potential, defense, and speed.
 * This simulates how effective a Pokemon is against another.
 */
export function calculateBattleMatchup(p1: Pokemon, p2: Pokemon) {
  const p1Types = p1.types.map(t => t.type.name);
  const p2Types = p2.types.map(t => t.type.name);

  // Stats for P1
  const atk1 = getStatValue(p1, 'attack');
  const spa1 = getStatValue(p1, 'special-attack');
  const speed1 = getStatValue(p1, 'speed');

  // Stats for P2
  const hp2 = getStatValue(p2, 'hp');
  const def2 = getStatValue(p2, 'defense');
  const spd2 = getStatValue(p2, 'special-defense');

  // Calculate Best Damage from P1 to P2
  // We consider both Physical and Special attacks using P1's best types (STAB)
  let bestP1Damage = 0;
  
  p1Types.forEach(type => {
    const effectiveness = calculateEffectiveness([type], p2Types);
    
    // Standard damage formula simplified: (Atk / Def) * effectiveness * STAB
    const physicalDmg = (atk1 / Math.max(def2, 1)) * effectiveness * 1.5;
    const specialDmg = (spa1 / Math.max(spd2, 1)) * effectiveness * 1.5;
    
    const maxDmg = Math.max(physicalDmg, specialDmg);
    if (maxDmg > bestP1Damage) bestP1Damage = maxDmg;
  });

  // If STAB moves are all bad (e.g. immunity), consider a basic neutral move
  if (bestP1Damage === 0) {
    const physNeutral = (atk1 / Math.max(def2, 1));
    const specNeutral = (spa1 / Math.max(spd2, 1));
    bestP1Damage = Math.max(physNeutral, specNeutral);
  }

  // Turns for P1 to kill P2
  const turnsToKillP2 = hp2 / (bestP1Damage || 1);

  return {
    damagePotential: bestP1Damage,
    turnsToKill: turnsToKillP2,
    speed: speed1,
    effectiveness: calculateEffectiveness(p1Types, p2Types)
  };
}

export function getBattleVerdict(p1: Pokemon, p2: Pokemon) {
  const analysis1 = calculateBattleMatchup(p1, p2);
  const analysis2 = calculateBattleMatchup(p2, p1);

  let winner: 'p1' | 'p2' | 'draw';
  let reason = '';

  if (analysis1.turnsToKill < analysis2.turnsToKill) {
    winner = 'p1';
  } else if (analysis2.turnsToKill < analysis1.turnsToKill) {
    winner = 'p2';
  } else if (analysis1.speed > analysis2.speed) {
    winner = 'p1';
  } else if (analysis2.speed > analysis1.speed) {
    winner = 'p2';
  } else {
    winner = 'draw';
  }

  const w = winner === 'p1' ? p1 : p2;
  const l = winner === 'p1' ? p2 : p1;
  const wAn = winner === 'p1' ? analysis1 : analysis2;
  const lAn = winner === 'p1' ? analysis2 : analysis1;

  if (winner === 'draw') {
    reason = `Ambos os Pokémon possuem um nível de força e tipos muito equilibrados, resultando em um duelo sem vantagem clara para nenhum dos lados.`;
  } else {
    const typeAdv = wAn.effectiveness > 1;
    const typeDisadv = wAn.effectiveness < 1;
    const faster = wAn.speed > lAn.speed;
    const muchStronger = (lAn.turnsToKill / wAn.turnsToKill) > 1.5;

    if (typeAdv && muchStronger) {
      reason = `${w.name} domina o confronto pois possui vantagem de tipo e estatísticas muito superiores a ${l.name}.`;
    } else if (typeAdv) {
      reason = `A vantagem de tipo de ${w.name} é o fator decisivo para superar a resistência de ${l.name}.`;
    } else if (typeDisadv && muchStronger) {
      reason = `Apesar da desvantagem de tipo, o poder bruto e os status elevados de ${w.name} permitem que ele supere ${l.name}.`;
    } else if (muchStronger) {
      reason = `${w.name} vence este duelo devido à grande superioridade em seus status base em comparação a ${l.name}.`;
    } else if (faster) {
      reason = `Em um combate equilibrado, a maior velocidade de ${w.name} permite que ele ataque primeiro e garanta a vitória sobre ${l.name}.`;
    } else {
      reason = `${w.name} possui uma leve vantagem estratégica e estatística que o coloca à frente de ${l.name} nesta disputa.`;
    }
  }

  return {
    winner,
    reason,
    details: {
      p1: analysis1,
      p2: analysis2
    }
  };
}