import React from 'react';
import { Menu, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { getDefaultAvatar, getImageFallbackHandler } from '../../../utils/avatar';
import './style.css';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const fallbackAvatar = getDefaultAvatar(user?.email || user?.name || 'Treinador');

  return (
    <header className="header">
      <div className="header-left">
        <button onClick={onMenuClick} className="icon-button" aria-label="Menu">
          <Menu size={24} />
        </button>
      </div>

      <Link to="/" className="header-title">
        <h1>Pokédex</h1>
      </Link>

      <div className="header-right">
        {isLoading ? (
          <div className="avatar-loading-placeholder" />
        ) : isAuthenticated ? (
          <div className="user-profile-summary" aria-label={`Usuário logado: ${user?.name}`}>
            <img
              src={user?.avatar || fallbackAvatar}
              alt={user?.name || 'Usuário'}
              className="avatar"
              referrerPolicy="no-referrer"
              onError={getImageFallbackHandler(fallbackAvatar)}
            />
            <span className="user-name-desktop">{user?.name}</span>
          </div>
        ) : (
          <Link to="/login" className="login-link" aria-label="Login">
            <div className="avatar-placeholder">
              <UserIcon size={20} />
            </div>
            <span>Login</span>
          </Link>
        )}
      </div>
    </header>
  );
};
