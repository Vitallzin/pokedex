import React from 'react';
import { AlertTriangle, Swords, TrendingUp, Zap } from 'lucide-react';
import type { Pokemon } from '../../../types/pokemon';
import { getBattleVerdict } from '../../../utils/compareStats';
import './style.css';

interface BattleAnalysisProps {
  p1: Pokemon;
  p2: Pokemon;
}

export const BattleAnalysis: React.FC<BattleAnalysisProps> = ({ p1, p2 }) => {
  const verdict = getBattleVerdict(p1, p2);
  const { p1: p1Details, p2: p2Details } = verdict.details;

  const winner = verdict.winner === 'p1' ? p1 : verdict.winner === 'p2' ? p2 : null;
  const isDraw = verdict.winner === 'draw';

  return (
    <div className="battle-analysis">
      <div className={`verdict-card ${isDraw ? 'draw' : ''}`}>
        <div className="verdict-header">
          <Zap size={34} className="zap-icon" />
          <div className="verdict-title">
            {isDraw ? (
              <>
                <h4>Equilíbrio de Forças</h4>
                <p>Esta seria uma batalha extremamente acirrada.</p>
              </>
            ) : (
              <>
                <h4>Veredito Final</h4>
                <p><strong>{winner?.name}</strong> possui vantagem estratégica.</p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="analysis-grid">
        <div className="analysis-box">
          <div className="box-header">
            <Swords size={22} />
            <h5>Eficiência de Tipos</h5>
          </div>
          <div className="box-content">
            <div className="advantage-row">
              <span className="p-name">{p1.name}</span>
              <span className={`multiplier x${p1Details.effectiveness.toString().replace('.', '_')}`}>
                {p1Details.effectiveness}x dano
              </span>
            </div>
            <div className="advantage-row">
              <span className="p-name">{p2.name}</span>
              <span className={`multiplier x${p2Details.effectiveness.toString().replace('.', '_')}`}>
                {p2Details.effectiveness}x dano
              </span>
            </div>
          </div>
        </div>

        <div className="analysis-box full-width">
          <div className="box-header">
            <TrendingUp size={22} />
            <h5>Análise Técnica</h5>
          </div>
          <div className="box-content summary-text">
            <p className="reason-text">{verdict.reason}</p>
          </div>
        </div>
      </div>

      <div className="disclaimer">
        <AlertTriangle size={14} />
        <span>Análise baseada na combinação de tipagem elemental e atributos de status de acordo com a PokéAPI.</span>
      </div>
    </div>
  );
};
