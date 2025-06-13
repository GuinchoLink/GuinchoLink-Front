import React from 'react';

const Funcionarios = () => {
  return (
    <div className="h-100 d-flex flex-column">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-shrink-0">
        <div>
          <h2 className="text-primary fw-bold mb-2">
            <i className="bi bi-person-badge-fill me-3"></i>
            Gerenciar Funcionários
          </h2>
          <p className="text-muted mb-0">
            Cadastre e gerencie os funcionários da empresa
          </p>
        </div>
        <button className="btn btn-primary btn-lg">
          <i className="bi bi-person-plus me-2"></i>
          Novo Funcionário
        </button>
      </div>

      <div className="card shadow flex-grow-1 d-flex flex-column">
        <div className="card-body d-flex align-items-center justify-content-center">
          <div className="text-center">
            <i className="bi bi-person-badge display-1 text-muted mb-3"></i>
            <h4 className="text-muted">Módulo de Funcionários</h4>
            <p className="text-muted">Esta funcionalidade será implementada em breve.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Funcionarios;
