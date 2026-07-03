import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, Save, Sparkles } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { Modal } from '../../common/Modal';
import { Button } from '../../common/Button';
import { Input } from '../../common/Input';
import { getDefaultAvatar, getImageFallbackHandler } from '../../../utils/avatar';
import './style.css';

interface AccountDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountDetailsModal: React.FC<AccountDetailsModalProps> = ({ isOpen, onClose }) => {
  const { user, updateUser, isLoading } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const canUpdatePassword = user?.providerIds.includes('password') ?? false;
  const usesGoogleProvider = user?.providerIds.includes('google.com') ?? false;
  const fallbackAvatar = getDefaultAvatar(user?.email || name || 'Treinador');

  useEffect(() => {
    if (!isOpen) return;
    setName(user?.name || '');
    setAvatar(user?.avatar || '');
    setSuccess('');
    setError('');
  }, [isOpen, user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    try {
      await updateUser({ name, avatar });
      setSuccess('Perfil atualizado com sucesso!');
    } catch {
      setError('Erro ao atualizar perfil.');
    }
  };

  const generateNewAvatar = () => {
    const newAvatar = getDefaultAvatar(crypto.randomUUID());
    setAvatar(newAvatar);
  };

  const goToPasswordPage = () => {
    onClose();
    navigate('/account/password');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalhes da Conta"
      size="md"
    >
      <div className="account-details-container">
        <section className="account-details-section">
          <h3>Informa&ccedil;&otilde;es Pessoais</h3>
          <form onSubmit={handleUpdateProfile} className="account-details-form">
            <div className="avatar-edit-container">
              <div className="avatar-wrapper">
                <img
                  src={avatar || fallbackAvatar}
                  alt={name || 'Usuario'}
                  className="large-avatar"
                  referrerPolicy="no-referrer"
                  onError={getImageFallbackHandler(fallbackAvatar)}
                />
              </div>

              {!usesGoogleProvider && (
                <div className="avatar-actions">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={generateNewAvatar}
                    icon={<Sparkles size={16} />}
                  >
                    Gerar avatar
                  </Button>
                </div>
              )}

              <p className="avatar-hint">
                {usesGoogleProvider
                  ? 'Contas Google usam a foto do Google.'
                  : 'Contas criadas por e-mail usam avatar gerado pela API.'}
              </p>
            </div>

            <Input
              label="Nome / Apelido"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
            />

            <Input
              label="E-mail"
              type="email"
              value={user?.email || ''}
              disabled
              placeholder="treinador@poke.com"
            />

            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}

            <Button
              type="submit"
              loading={isLoading}
              icon={<Save size={18} />}
            >
              Salvar Altera&ccedil;&otilde;es
            </Button>
          </form>
        </section>

        {canUpdatePassword && (
          <>
            <div className="account-details-divider" />
            <section className="account-details-section password-summary">
              <div>
                <h3>Senha</h3>
                <p>Altere sua senha usando a senha atual ou envie um e-mail de redefini&ccedil;&atilde;o.</p>
              </div>
              <Button
                type="button"
                variant="secondary"
                icon={<KeyRound size={18} />}
                onClick={goToPasswordPage}
              >
                Redefinir senha
              </Button>
            </section>
          </>
        )}
      </div>
    </Modal>
  );
};
