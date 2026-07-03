import React, { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { Modal } from '../../common/Modal';
import { Button } from '../../common/Button';
import { Input } from '../../common/Input';
import { getAuthErrorMessage } from '../../../utils/getAuthErrorMessage';
import pikachuLogo from '../../../assets/Pikachu.webp';
import './style.css';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login, loginWithGoogle, register, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password || (isRegister && !nickname.trim())) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    try {
      if (isRegister) {
        await register(nickname, email, password);
        setSuccess('Conta criada! Confirme seu e-mail antes de entrar.');
        setPassword('');
        setIsRegister(false);
      } else {
        await login(email, password);
        onClose();
      }
    } catch (err) {
      setError(getAuthErrorMessage(err, isRegister));
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setSuccess('');

    try {
      await loginWithGoogle();
      onClose();
    } catch (err) {
      setError(getAuthErrorMessage(err, false));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isRegister ? 'Crie sua Conta' : 'Bem-vindo de volta!'}
      size="sm"
    >
      <form onSubmit={handleSubmit} className="login-modal-form">
        <div className="login-modal-header">
          <img src={pikachuLogo} alt="Pikachu" className="login-modal-logo" />
          <p className="login-modal-subtitle">
            {isRegister ? 'Cadastre-se para salvar seu progresso.' : 'Faça login para acessar seus favoritos e times.'}
          </p>
        </div>

        <Button
          type="button"
          size="full"
          variant="outline"
          onClick={handleGoogleLogin}
          loading={isLoading}
          className="google-auth-button"
        >
          <span className="google-auth-mark">G</span>
          Entrar com Google
        </Button>

        <div className="auth-divider">
          <span>ou</span>
        </div>

        {isRegister && (
          <Input
            label="Nickname"
            type="text"
            required
            autoComplete="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Como quer aparecer no app?"
          />
        )}

        <Input
          label="E-mail"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="treinador@poke.com"
        />

        <Input
          label="Senha"
          type="password"
          required
          autoComplete={isRegister ? 'new-password' : 'current-password'}
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Sua senha"
          error={error}
        />

        {success && <p className="auth-success-message">{success}</p>}

        <Button
          type="submit"
          size="full"
          loading={isLoading}
          className="login-modal-submit"
        >
          {isRegister ? 'Cadastrar' : 'Entrar'}
        </Button>

        <div className="login-modal-footer">
          {isRegister ? (
            <p>Já tem conta? <button type="button" onClick={() => setIsRegister(false)} className="toggle-auth-modal">Login</button></p>
          ) : (
            <p>Novo por aqui? <button type="button" onClick={() => setIsRegister(true)} className="toggle-auth-modal">Criar conta</button></p>
          )}
        </div>
      </form>
    </Modal>
  );
};
