import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      path: '/',
      name: 'Dashboard',
      icon: 'bi-speedometer2'
    },
    {
      path: '/tipos-servico',
      name: 'Tipos de Serviço',
      icon: 'bi-gear-fill'
    },
    {
      path: '/clientes',
      name: 'Clientes',
      icon: 'bi-people-fill'
    },
    {
      path: '/servicos',
      name: 'Serviços',
      icon: 'bi-wrench-adjustable'
    },
    {
      path: '/funcionarios',
      name: 'Funcionários',
      icon: 'bi-person-badge-fill'
    },
    {
      path: '/veiculos-empresa',
      name: 'Veículos Empresa',
      icon: 'bi-truck-flatbed'
    },
    {
      path: '/relatorios',
      name: 'Relatórios',
      icon: 'bi-graph-up'
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="d-flex vh-100 vw-100 position-fixed" style={{ top: 0, left: 0 }}>
      {/* Sidebar */}
      <div className={`bg-dark text-white vh-100 d-flex flex-column flex-shrink-0`} 
           style={{ 
             width: sidebarCollapsed ? '70px' : '280px',
             transition: 'width 0.3s ease',
             zIndex: 1000
           }}>
        
        {/* Header do Sidebar */}
        <div className="p-3 border-bottom border-secondary flex-shrink-0">
          <div className="d-flex align-items-center justify-content-between">
            {!sidebarCollapsed && (
              <h4 className="mb-0 fw-bold text-primary">
                <i className="bi bi-truck me-2"></i>
                GuinchoLink
              </h4>
            )}
            <button 
              className="btn btn-outline-light btn-sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <i className={`bi ${sidebarCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i>
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-2 flex-grow-1 overflow-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link text-white d-flex align-items-center py-3 px-3 mb-1 rounded text-decoration-none ${
                isActive(item.path) ? 'bg-primary' : ''
              }`}
              style={{
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (!isActive(item.path)) {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.path)) {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
            >
              <i className={`${item.icon} fs-5 ${sidebarCollapsed ? 'text-center' : 'me-3'}`} 
                 style={{ width: sidebarCollapsed ? '100%' : 'auto' }}></i>
              {!sidebarCollapsed && (
                <span className="fw-medium">{item.name}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* User Info */}
        {!sidebarCollapsed && (
          <div className="p-3 border-top border-secondary flex-shrink-0">
            <div className="d-flex align-items-center">
              <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" 
                   style={{ width: '40px', height: '40px' }}>
                <i className="bi bi-person-fill text-white"></i>
              </div>
              <div>
                <div className="fw-medium">Administrador</div>
                <small className="text-muted">admin@guincholink.com</small>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 d-flex flex-column vh-100 overflow-hidden">
        
        {/* Top Navigation */}
        <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom flex-shrink-0">
          <div className="container-fluid">
            <div className="d-flex align-items-center">
              <h5 className="mb-0 text-dark fw-bold">
                {menuItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
              </h5>
            </div>
            
            <div className="d-flex align-items-center gap-3">
              <button className="btn btn-outline-primary btn-sm">
                <i className="bi bi-bell me-1"></i>
                Notificações
              </button>
              <div className="dropdown">
                <button className="btn btn-outline-secondary dropdown-toggle btn-sm" 
                        type="button" 
                        data-bs-toggle="dropdown">
                  <i className="bi bi-person-circle me-1"></i>
                  Perfil
                </button>
                <ul className="dropdown-menu">
                  <li><a className="dropdown-item" href="#"><i className="bi bi-person me-2"></i>Meu Perfil</a></li>
                  <li><a className="dropdown-item" href="#"><i className="bi bi-gear me-2"></i>Configurações</a></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><a className="dropdown-item text-danger" href="#"><i className="bi bi-box-arrow-right me-2"></i>Sair</a></li>
                </ul>
              </div>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main className="flex-grow-1 p-4 bg-light overflow-hidden">
          <div className="container-fluid h-100 overflow-hidden">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
