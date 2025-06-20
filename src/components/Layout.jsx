import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [fimServicoExpanded, setFimServicoExpanded] = useState(false);
  const location = useLocation();  const menuItems = [
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
    },    {
      path: '/veiculos-clientes',
      name: 'Veículos de Clientes',
      icon: 'bi bi-car-front-fill'
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
      path: '/administradores',
      name: 'Administradores',
      icon: 'bi-person-fill-gear'
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

  const fimServicoItems = [
    {
      path: '/fim-servicos',
      name: 'Cadastrar Fim Serviço',
      icon: 'bi-plus-circle'
    },
    {
      path: '/estatisticas-gerais',
      name: 'Estatísticas Gerais',
      icon: 'bi-graph-up'
    },
    {
      path: '/estatisticas-cliente',
      name: 'Estatísticas por Cliente',
      icon: 'bi-person-lines-fill'
    }
  ];  const isActive = (path) => {
    // Normalizar as rotas para comparação
    const currentPath = location.pathname;
    
    // Para a rota raiz, verificar exatamente
    if (path === '/') {
      return currentPath === '/';
    }
    
    // Para outras rotas, verificar se é exatamente igual
    const isRouteActive = currentPath === path;
    
    return isRouteActive;
  };

  // Verificar se alguma rota de fim de serviço está ativa
  const isFimServicoActive = () => {
    return fimServicoItems.some(item => isActive(item.path));
  };

  // Expandir automaticamente se uma rota de fim de serviço estiver ativa
  useEffect(() => {
    if (isFimServicoActive()) {
      setFimServicoExpanded(true);
    }
  }, [location.pathname]);
  return (
    <div className="d-flex vh-100 vw-100 position-fixed" style={{ top: 0, left: 0 }}>
      {/* Sidebar */}
      <div className={`text-white vh-100 d-flex flex-column flex-shrink-0 sidebar-dark`} 
           style={{ 
             width: sidebarCollapsed ? '100px' : '280px',
             transition: 'width 0.3s ease',
             zIndex: 1000,
             backgroundColor: 'var(--sidebar-bg)',
             borderRight: '2px solid var(--sidebar-border)'
           }}>
          {/* Header do Sidebar */}        <div className="p-3 flex-shrink-0" style={{ borderBottom: '1px solid var(--sidebar-border)' }}>
          <div className={`d-flex align-items-center ${sidebarCollapsed ? 'flex-column gap-2' : 'justify-content-between'}`}>
            {!sidebarCollapsed && (
              <div className="d-flex align-items-center">                <img 
                  src="/guincho.png" 
                  alt="GuinchoLink" 
                  style={{ width: '50px', height: '40px' }}
                  className="me-2"
                />
                <h4 className="mb-0 fw-bold" style={{ color: 'var(--accent-teal)' }}>
                  GuinchoLink
                </h4>
              </div>
            )}
            {sidebarCollapsed && (              <img 
                src="/guincho.png" 
                alt="GuinchoLink" 
                style={{ width: '32px', height: '32px' }}
                className="mb-1"
              />
            )}<button 
              className="btn btn-sm d-flex align-items-center justify-content-center"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              style={{ 
                width: '32px', 
                height: '32px', 
                padding: '0',
                fontSize: '12px',
                backgroundColor: 'var(--secondary-teal)',
                border: '1px solid var(--accent-teal)',
                color: 'white'
              }}
            >
              <i className={`bi ${sidebarCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i>
            </button>
          </div>
        </div>        {/* Menu Items */}
        <nav className="p-2 flex-grow-1 overflow-auto">
          {menuItems.map((item) => {
            const isItemActive = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link text-white d-flex align-items-center py-3 px-3 mb-1 rounded text-decoration-none position-relative ${
                  isItemActive ? 'bg-primary shadow-sm' : ''
                }`}
                style={{
                  transition: 'all 0.2s ease',
                  backgroundColor: isItemActive ? 'var(--sidebar-active)' : 'transparent'
                }}
                onMouseEnter={(e) => {
                  if (!isItemActive) {
                    e.currentTarget.style.backgroundColor = 'var(--sidebar-hover)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isItemActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <i className={`${item.icon} fs-5 ${sidebarCollapsed ? 'text-center' : 'me-3'}`} 
                   style={{ 
                     width: sidebarCollapsed ? '100%' : 'auto',
                     color: isItemActive ? 'white' : 'var(--accent-teal)'
                   }}></i>
                {!sidebarCollapsed && (
                  <span className="fw-medium">{item.name}</span>
                )}
                {isItemActive && !sidebarCollapsed && (
                  <div className="position-absolute end-0 me-2">
                    <i className="bi bi-chevron-right text-white"></i>
                  </div>
                )}
              </Link>
            );
          })}

          {/* Fim Serviços - Menu Expansível */}
          {!sidebarCollapsed && (
            <div className="mb-1">
              <button
                className={`nav-link text-white d-flex align-items-center justify-content-between py-3 px-3 rounded text-decoration-none position-relative w-100 border-0 ${
                  isFimServicoActive() ? 'bg-primary shadow-sm' : ''
                }`}
                style={{
                  transition: 'all 0.2s ease',
                  backgroundColor: isFimServicoActive() ? 'var(--sidebar-active)' : 'transparent'
                }}
                onClick={() => setFimServicoExpanded(!fimServicoExpanded)}
                onMouseEnter={(e) => {
                  if (!isFimServicoActive()) {
                    e.currentTarget.style.backgroundColor = 'var(--sidebar-hover)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isFimServicoActive()) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <div className="d-flex align-items-center">
                  <i className="bi-check-circle fs-5 me-3" 
                     style={{ color: isFimServicoActive() ? 'white' : 'var(--accent-teal)' }}></i>
                  <span className="fw-medium">Fim Serviços</span>
                </div>
                <i className={`bi ${fimServicoExpanded ? 'bi-chevron-down' : 'bi-chevron-right'} text-white`}></i>
              </button>
              
              {/* Subitens do Fim Serviços */}
              <div className={`collapse ${fimServicoExpanded ? 'show' : ''}`}>
                <div className="ms-4 mt-1">
                  {fimServicoItems.map((item) => {
                    const isItemActive = isActive(item.path);
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`nav-link text-white d-flex align-items-center py-2 px-3 mb-1 rounded text-decoration-none position-relative ${
                          isItemActive ? 'bg-primary shadow-sm' : ''
                        }`}
                        style={{
                          transition: 'all 0.2s ease',
                          backgroundColor: isItemActive ? 'var(--sidebar-active)' : 'transparent',
                          fontSize: '0.9rem'
                        }}
                        onMouseEnter={(e) => {
                          if (!isItemActive) {
                            e.currentTarget.style.backgroundColor = 'var(--sidebar-hover)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isItemActive) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }
                        }}
                      >
                        <i className={`${item.icon} fs-6 me-3`} 
                           style={{ color: isItemActive ? 'white' : 'var(--accent-teal)' }}></i>
                        <span className="fw-medium">{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Menu item colapsado para Fim Serviços */}
          {sidebarCollapsed && (
            <div className="dropdown">
              <button
                className={`nav-link text-white d-flex align-items-center py-3 px-3 mb-1 rounded text-decoration-none position-relative w-100 border-0 ${
                  isFimServicoActive() ? 'bg-primary shadow-sm' : ''
                }`}
                style={{
                  transition: 'all 0.2s ease',
                  backgroundColor: isFimServicoActive() ? 'var(--sidebar-active)' : 'transparent'
                }}
                data-bs-toggle="dropdown"
                onMouseEnter={(e) => {
                  if (!isFimServicoActive()) {
                    e.currentTarget.style.backgroundColor = 'var(--sidebar-hover)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isFimServicoActive()) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <i className="bi-check-circle fs-5 text-center" 
                   style={{ 
                     width: '100%',
                     color: isFimServicoActive() ? 'white' : 'var(--accent-teal)'
                   }}></i>
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                {fimServicoItems.map((item) => (
                  <li key={item.path}>
                    <Link className="dropdown-item" to={item.path}>
                      <i className={`${item.icon} me-2`}></i>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </nav>

        {/* User Info */}
        {!sidebarCollapsed && (
          <div className="p-3 flex-shrink-0" style={{ borderTop: '1px solid var(--sidebar-border)' }}>
            <div className="d-flex align-items-center">
              <div className="rounded-circle d-flex align-items-center justify-content-center me-3" 
                   style={{ 
                     width: '40px', 
                     height: '40px',
                     backgroundColor: 'var(--secondary-teal)'
                   }}>
                <i className="bi bi-person-fill text-white"></i>
              </div>
              <div>
                <div className="fw-medium">Administrador</div>
                <small style={{ color: 'var(--accent-teal)' }}>admin@guincholink.com</small>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 d-flex flex-column vh-100 overflow-hidden">
          {/* Top Navigation */}
        <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom flex-shrink-0" 
             style={{ borderBottomColor: 'var(--accent-teal) !important', borderBottomWidth: '2px' }}>
          <div className="container-fluid">
            <div className="d-flex align-items-center">
              <h5 className="mb-0 fw-bold" style={{ color: 'var(--primary-blue)' }}>
                {(() => {
                  const currentItem = menuItems.find(item => item.path === location.pathname);
                  if (currentItem) return currentItem.name;
                  
                  const fimServicoItem = fimServicoItems.find(item => item.path === location.pathname);
                  if (fimServicoItem) return fimServicoItem.name;
                  
                  return 'Dashboard';
                })()}
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
        <main className="flex-grow-1 p-4 overflow-hidden" style={{ backgroundColor: 'var(--gray-100)' }}>
          <div className="container-fluid h-100 overflow-hidden">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
