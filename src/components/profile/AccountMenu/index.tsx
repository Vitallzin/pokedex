import React from 'react';
import { LogOut, User, Heart, Shield } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { getDefaultAvatar, getImageFallbackHandler } from '../../../utils/avatar';
import './style.css';

interface AccountMenuProps {
  onClose?: () => void;
  onOpenAccountDetails?: () => void;
  onLogoutRequest?: () => void;
}

export const AccountMenu: React.FC<AccountMenuProps> = ({ 
  onClose, 
  onOpenAccountDetails,
  onLogoutRequest 
}) => {
  const { user } = useAuth();
  const fallbackAvatar = getDefaultAvatar(user?.email || user?.name || 'Treinador');

  const handleLogout = () => {
    if (onLogoutRequest) {
      onLogoutRequest();
    }
    if (onClose) onClose();
  };

  const handleOpenDetails = () => {
    if (onOpenAccountDetails) onOpenAccountDetails();
    if (onClose) onClose();
  };

  return (
    <div className="account-menu">
      <div className="account-menu-header">
        <img
          src={user?.avatar || fallbackAvatar}
          alt={user?.name || 'Usuario'}
          className="account-menu-avatar"
          referrerPolicy="no-referrer"
          onError={getImageFallbackHandler(fallbackAvatar)}
        />
        <div className="account-menu-info">
          <span className="account-menu-name">{user?.name}</span>
          <span className="account-menu-email">{user?.email}</span>
        </div>
      </div>
      
      <div className="account-menu-divider" />
      
      <div className="account-menu-links">
        <button className="account-menu-link" onClick={handleOpenDetails}>
          <User size={18} />
          <span>Perfil</span>
        </button>
        <Link to="/favorites" className="account-menu-link" onClick={onClose}>
          <Heart size={18} />
          <span>Favoritos</span>
        </Link>
        <Link to="/teams" className="account-menu-link" onClick={onClose}>
          <Shield size={18} />
          <span>Meus Times</span>
        </Link>
      </div>
      
      <div className="account-menu-divider" />
      
      <button className="account-menu-logout" onClick={handleLogout}>
        <LogOut size={18} />
        <span>Sair</span>
      </button>
    </div>
  );
};
