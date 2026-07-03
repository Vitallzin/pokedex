import React, { useState } from 'react';
import { Plus, Shield, X } from 'lucide-react';
import { useTeam } from '../../hooks/useTeam';
import { TeamCard } from '../../components/team/TeamCard';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card } from '../../components/common/Card';
import { Modal } from '../../components/common/Modal';
import './style.css';

export const Teams: React.FC = () => {
  const { teams, maxTeams, addTeam, deleteTeam } = useTeam();
  const [newTeamName, setNewTeamName] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<string | null>(null);
  const reachedTeamLimit = teams.length >= maxTeams;

  const handleAddTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTeamName.trim() && !reachedTeamLimit) {
      addTeam(newTeamName.trim());
      setNewTeamName('');
      setShowAdd(false);
    }
  };

  const confirmDelete = () => {
    if (teamToDelete) {
      deleteTeam(teamToDelete);
      setTeamToDelete(null);
    }
  };

  return (
    <div className="teams-page">
      <div className="teams-header">
        <div>
          <h2>Meus Times</h2>
          <p>Crie e gerencie seus times de batalha.</p>
        </div>
        {!showAdd && (
          <Button
            onClick={() => setShowAdd(true)}
            icon={<Plus size={20} />}
            disabled={reachedTeamLimit}
          >
            Novo Time
          </Button>
        )}
      </div>

      {showAdd && (
        <Card className="add-team-card" padding="md">
          <form className="add-team-form" onSubmit={handleAddTeam}>
            <div className="form-header">
              <h3>Novo Time</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowAdd(false)}>
                <X size={20} />
              </Button>
            </div>
            <div className="form-body">
              <Input
                type="text"
                placeholder="Ex: Time de Elite, Iniciais, etc."
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                autoFocus
                label="Nome do Time"
              />
              {reachedTeamLimit && (
                <p className="setting-description">Você chegou ao limite de {maxTeams} times nesta conta.</p>
              )}
              <div className="form-actions">
                <Button variant="secondary" onClick={() => setShowAdd(false)}>Cancelar</Button>
                <Button type="submit" disabled={reachedTeamLimit}>Criar Time</Button>
              </div>
            </div>
          </form>
        </Card>
      )}

      <div className="teams-list">
        {teams.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon" aria-hidden="true">
              <Shield size={56} strokeWidth={1.8} />
            </div>
            <p>Você ainda não criou nenhum time.</p>
            <Button variant="outline" onClick={() => setShowAdd(true)}>Começar agora</Button>
          </div>
        ) : (
          <>
            {reachedTeamLimit && (
              <div className="empty-state">
                <p>Você chegou ao limite de {maxTeams} times nesta conta.</p>
              </div>
            )}
            <div className="teams-grid">
              {teams.map(team => (
                <TeamCard
                  key={team.id}
                  team={team}
                  onDelete={(id) => setTeamToDelete(id)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <Modal
        isOpen={!!teamToDelete}
        onClose={() => setTeamToDelete(null)}
        title="Confirmar Exclusão"
        size="sm"
        footer={
          <div className="delete-modal-footer">
            <Button variant="secondary" onClick={() => setTeamToDelete(null)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Apagar
            </Button>
          </div>
        }
      >
        <div className="delete-modal-content">
          <p>Tem certeza que deseja apagar este time? Esta ação não pode ser desfeita.</p>
        </div>
      </Modal>
    </div>
  );
};
