import React from 'react';

const Servicos = () => {
  return (
    <div className="h-100 d-flex flex-column overflow-auto">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-shrink-0">
        <div>
          <h2 className="text-primary fw-bold mb-2">
            <i className="bi bi-wrench-adjustable me-3"></i>
            Gerenciar Serviços
          </h2>
          <p className="text-muted mb-0">
            Controle todos os serviços de guincho prestados
          </p>
        </div>
        <button className="btn btn-primary btn-lg">
          <i className="bi bi-plus-circle me-2"></i>
          Novo Serviço
        </button>
      </div>

      <div className="card shadow flex-grow-1 d-flex flex-column overflow-hidden">
        <div className="card-body d-flex align-items-center justify-content-center">
          <div className="text-center">
            <i className="bi bi-wrench-adjustable display-1 text-muted mb-3"></i>
            <h4 className="text-muted">Módulo de Serviços</h4>
            <p className="text-muted">Esta funcionalidade será implementada em breve.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Servicos;
