import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { KeyRound, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import './style.css';

export const PasswordReset: React.FC = () => {
  const { user, updatePasswordWithCurrentPassword, sendPasswordReset, isLoading } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const canUpdatePassword = user?.providerIds.includes('password') ?? false;

  if (user && !canUpdatePassword) {
    return <Navigate to="/settings" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Preencha todos os campos.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('As novas senhas não coincidem.');
      return;
    }

    if (newPassword.length < 6) {
      setError('A nova senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    try {
      await updatePasswordWithCurrentPassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccess('Senha atualizada com sucesso!');
    } catch (err) {
      const message = err instanceof Error ? err.message : '';
      if (message.includes('auth/invalid-credential') || message.includes('auth/wrong-password')) {
        setError('Senha atual incorreta.');
        return;
      }

      if (message.includes('auth/weak-password') || message.includes('auth/password-does-not-meet-requirements')) {
        setError('A nova senha não atende à política de segurança.');
        return;
      }

      setError('Não foi possível alterar a senha. Tente novamente.');
    }
  };

  const handleForgotPassword = async () => {
    setSuccess('');
    setError('');

    try {
      await sendPasswordReset();
      setSuccess(`Enviamos um e-mail de redefinição para ${user?.email}.`);
    } catch {
      setError('Não foi possível enviar o e-mail de redefinição.');
    }
  };

  return (
    <div className="password-reset-page">
      <Card className="password-reset-card" padding="lg">
        <div className="password-reset-header">
          <div className="password-reset-icon">
            <KeyRound size={28} />
          </div>
          <h2>Redefinir senha</h2>
          <p>Confirme sua senha atual e escolha uma nova senha para sua conta.</p>
        </div>

        <form onSubmit={handleSubmit} className="password-reset-form">
          <Input
            label="Senha atual"
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Digite sua senha atual"
          />

          <Input
            label="Nova senha"
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Digite a nova senha"
          />

          <Input
            label="Confirmar nova senha"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirme a nova senha"
            error={error}
          />

          {success && <p className="password-success"><ShieldCheck size={16} />{success}</p>}

          <div className="password-reset-actions">
            <Button type="button" variant="secondary" onClick={() => navigate('/settings')}>
              Voltar
            </Button>
            <Button type="submit" loading={isLoading}>
              Alterar senha
            </Button>
          </div>
        </form>

        <div className="password-forgot-box">
          <div>
            <h3>Esqueceu a senha atual?</h3>
            <p>Enviamos um link para seu e-mail. Ao confirmar por lá, você consegue escolher uma nova senha sem informar a antiga.</p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleForgotPassword}
            loading={isLoading}
            icon={<Mail size={18} />}
          >
            Enviar e-mail
          </Button>
        </div>
      </Card>
    </div>
  );
};
