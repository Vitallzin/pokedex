import React, { useState } from 'react';
import { X, Settings, LogOut, User, LogIn, Search, GitCompare, Heart, Users, Info } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { AccountDetailsModal } from '../../profile/AccountDetailsModal';
import { LogoutConfirmModal } from '../../profile/LogoutConfirmModal';
import { Link, NavLink } from 'react-router-dom';
import './style.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { logout, isAuthenticated } = useAuth();
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setIsLogoutModalOpen(false);
    onClose();
  };

  const navItemClass = ({ isActive }: { isActive: boolean }) => (
    `sidebar-item ${isActive ? 'active' : ''}`
  );

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div>
            <span className="sidebar-eyebrow">Menu</span>
            <h2>Navegação</h2>
          </div>
          <button onClick={onClose} className="icon-button sidebar-close" aria-label="Fechar menu">
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/" className={navItemClass} onClick={onClose}>
            <Search size={20} />
            <span>Pokédex</span>
          </NavLink>

          <NavLink to="/comparison" className={navItemClass} onClick={onClose}>
            <GitCompare size={20} />
            <span>Comparar</span>
          </NavLink>

          <NavLink to="/favorites" className={navItemClass} onClick={onClose}>
            <Heart size={20} />
            <span>Favoritos</span>
          </NavLink>

          <NavLink to="/teams" className={navItemClass} onClick={onClose}>
            <Users size={20} />
            <span>Meu Time</span>
          </NavLink>

          <NavLink to="/settings" className={navItemClass} onClick={onClose}>
            <Settings size={20} />
            <span>Configurações</span>
          </NavLink>

          <NavLink to="/about" className={navItemClass} onClick={onClose}>
            <Info size={20} />
            <span>Sobre</span>
          </NavLink>

          <div className="sidebar-account">
            {isAuthenticated ? (
              <button
                className="sidebar-item"
                onClick={() => {
                  setIsAccountModalOpen(true);
                }}
              >
                <User size={20} />
                <span>Detalhes da conta</span>
              </button>
            ) : (
              <Link to="/login" className="sidebar-item" onClick={onClose}>
                <LogIn size={20} />
                <span>Login</span>
              </Link>
            )}

            {isAuthenticated && (
              <button className="sidebar-item logout" onClick={() => setIsLogoutModalOpen(true)}>
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            )}
          </div>
        </nav>
      </aside>

      <AccountDetailsModal
        isOpen={isAccountModalOpen}
        onClose={() => {
          setIsAccountModalOpen(false);
          onClose();
        }}
      />

      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
};
