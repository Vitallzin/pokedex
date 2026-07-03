import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { AccountDetailsModal } from '../../components/profile/AccountDetailsModal';
import { LogoutConfirmModal } from '../../components/profile/LogoutConfirmModal';
import { Bell, LogOut, Moon, Sun, User } from 'lucide-react';
import './style.css';

export const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h2>Configurações</h2>
        <p>Gerencie sua conta e preferências do aplicativo.</p>
      </div>

      <div className="settings-content">
        <section className="settings-section">
          <h3>Aparência</h3>
          <Card padding="none">
            <div className="setting-item">
              <div className="setting-info">
                <div className="setting-icon">{theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}</div>
                <div>
                  <span className="setting-label">Tema Escuro</span>
                  <p className="setting-description">Alternar entre tema claro e escuro.</p>
                </div>
              </div>
              <button
                className={`toggle-switch ${theme === 'dark' ? 'active' : ''}`}
                onClick={toggleTheme}
              >
                <div className="toggle-handle" />
              </button>
            </div>
          </Card>
        </section>

        <section className="settings-section">
          <h3>Conta</h3>
          <Card padding="none">
            <div className="setting-item">
              <div className="setting-info">
                <div className="setting-icon"><User size={20} /></div>
                <div>
                  <span className="setting-label">Perfil</span>
                  <p className="setting-description">{user ? user.name : 'Não logado'}</p>
                </div>
              </div>
              {user && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAccountModalOpen(true)}
                >
                  Editar
                </Button>
              )}
            </div>
            <div className="setting-divider" />
            <div className="setting-item">
              <div className="setting-info">
                <div className="setting-icon"><Bell size={20} /></div>
                <div>
                  <span className="setting-label">Notificações</span>
                  <p className="setting-description">Gerenciar alertas e avisos.</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">Configurar</Button>
            </div>
          </Card>
        </section>

        {user && (
          <div className="logout-section">
            <Button
              variant="danger"
              size="full"
              onClick={() => setIsLogoutModalOpen(true)}
              icon={<LogOut size={20} />}
            >
              Sair da Conta
            </Button>
          </div>
        )}
      </div>

      <AccountDetailsModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
      />

      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={async () => {
          await logout();
          setIsLogoutModalOpen(false);
        }}
      />
    </div>
  );
};
