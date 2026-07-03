import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card } from '../../components/common/Card';
import { getAuthErrorMessage } from '../../utils/getAuthErrorMessage';
import pikachuLogo from '../../assets/Pikachu.webp';
import './style.css';

export const Login: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login, loginWithGoogle, register, isLoading } = useAuth();
  const navigate = useNavigate();

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
        setSuccess('Conta criada! Enviamos um e-mail de confirmação. Confirme seu e-mail antes de entrar.');
        setPassword('');
        setIsRegister(false);
      } else {
        await login(email, password);
        navigate('/');
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
      navigate('/');
    } catch (err) {
      setError(getAuthErrorMessage(err, false));
    }
  };

  return (
    <div className="login-page">
      <Card className="login-card" padding="lg">
        <div className="login-header">
          <img src={pikachuLogo} alt="Pikachu Logo" className="login-logo" />
          <h2>{isRegister ? 'Criar sua Conta' : 'Bem-vindo, Treinador!'}</h2>
          <p>{isRegister ? 'Cadastre-se para começar sua jornada Pokémon.' : 'Faça login para salvar seus favoritos e criar times.'}</p>
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

        <form onSubmit={handleSubmit} className="login-form">
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
            placeholder="Sua senha secreta"
            error={error}
          />

          {success && <p className="auth-success-message">{success}</p>}

          <Button
            type="submit"
            size="full"
            loading={isLoading}
            className="login-submit"
          >
            {isRegister ? 'Criar Conta' : 'Entrar na Jornada'}
          </Button>
        </form>

        <div className="login-footer">
          {isRegister ? (
            <p>Já tem uma conta? <button onClick={() => setIsRegister(false)} className="toggle-auth">Faça Login</button></p>
          ) : (
            <p>Não tem uma conta? <button onClick={() => setIsRegister(true)} className="toggle-auth">Crie uma agora!</button></p>
          )}
        </div>
      </Card>
    </div>
  );
};
