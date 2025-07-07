import React from 'react';

const Relatorios = () => {
  return (
    <div className="h-100 d-flex flex-column">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-shrink-0">
        <div>
          <h2 className="text-primary fw-bold mb-2">
            <i className="bi bi-graph-up me-3"></i>
            Relatórios
          </h2>
          <p className="text-muted mb-0">
            Visualize relatórios e estatísticas do sistema
          </p>
        </div>
        <button className="btn btn-primary btn-lg">
          <i className="bi bi-file-earmark-text me-2"></i>
          Gerar Relatório
        </button>
      </div>

      <div className="flex-grow-1">
        <div className="row h-100">
          <div className="col-md-6 mb-4">
            <div className="card shadow h-100">
              <div className="card-body text-center d-flex flex-column justify-content-center">
                <i className="bi bi-graph-up text-primary display-4 mb-3"></i>
                <h5>Relatório de Serviços</h5>
                <p className="text-muted">Estatísticas de serviços prestados</p>
                <button className="btn btn-outline-primary">
                  <i className="bi bi-download me-2"></i>
                  Baixar
                </button>
              </div>
            </div>
          </div>
          
          <div className="col-md-6 mb-4">
            <div className="card shadow h-100">
              <div className="card-body text-center d-flex flex-column justify-content-center">
                <i className="bi bi-currency-dollar text-success display-4 mb-3"></i>
                <h5>Relatório Financeiro</h5>
                <p className="text-muted">Receitas e despesas mensais</p>
                <button className="btn btn-outline-success">
                  <i className="bi bi-download me-2"></i>
                  Baixar
                </button>
              </div>
            </div>
          </div>
          
          <div className="col-md-6 mb-4">
            <div className="card shadow h-100">
              <div className="card-body text-center d-flex flex-column justify-content-center">
                <i className="bi bi-people text-info display-4 mb-3"></i>
                <h5>Relatório de Clientes</h5>
                <p className="text-muted">Dados e estatísticas de clientes</p>
                <button className="btn btn-outline-info">
                  <i className="bi bi-download me-2"></i>
                  Baixar
                </button>
              </div>
            </div>
          </div>
          
          <div className="col-md-6 mb-4">
            <div className="card shadow h-100">
              <div className="card-body text-center d-flex flex-column justify-content-center">
                <i className="bi bi-truck text-warning display-4 mb-3"></i>
                <h5>Relatório de Frota</h5>
                <p className="text-muted">Status e utilização da frota</p>
                <button className="btn btn-outline-warning">
                  <i className="bi bi-download me-2"></i>
                  Baixar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Relatorios;
