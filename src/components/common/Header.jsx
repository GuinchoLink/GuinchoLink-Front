import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm" style={{ minHeight: '70px' }}>
      <div className="container-fluid">
        <a className="navbar-brand fw-bold fs-3" href="/">
          <i className="bi bi-truck me-2"></i>
          GuinchoLink
        </a>
        
        <div className="navbar-nav ms-auto d-flex align-items-center">
          {user && (
            <div className="d-flex align-items-center">
              <span className="navbar-text me-3">
                <i className="bi bi-person-fill me-1"></i>
                Olá, {user.nome}
              </span>
              <button 
                className="btn btn-outline-light btn-sm"
                onClick={handleLogout}
                title="Sair"
              >
                <i className="bi bi-box-arrow-right me-1"></i>
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
