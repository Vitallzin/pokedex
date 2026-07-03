import { typeAdvantages } from '../data/typeAdvantages';

export const calculateWeaknesses = (types: string[]): string[] => {
  const effectiveness: { [key: string]: number } = {};
  
  // Initialize all types with 1x effectiveness
  Object.keys(typeAdvantages).forEach(type => {
    effectiveness[type] = 1;
  });

  // Calculate combined effectiveness for all defender types
  types.forEach(defenderType => {
    Object.keys(typeAdvantages).forEach(attackerType => {
      const multiplier = typeAdvantages[attackerType][defenderType] ?? 1;
      effectiveness[attackerType] *= multiplier;
    });
  });

  // Filter types that have > 1x effectiveness
  return Object.keys(effectiveness).filter(type => effectiveness[type] > 1);
};
