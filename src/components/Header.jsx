import React from 'react';

const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm" style={{ minHeight: '70px' }}>
      <div className="container-fluid">
        <a className="navbar-brand fw-bold fs-3" href="/">
          <i className="bi bi-truck me-2"></i>
          GuinchoLink
        </a>
        
        <div className="navbar-nav ms-auto">
          <a className="nav-link active" href="/">
            <i className="bi bi-gear-fill me-1"></i>
            Tipos de Serviço
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Header;
