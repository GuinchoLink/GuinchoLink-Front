import React from 'react';

const TipoServicoList = ({ 
  tiposServico = [], 
  onEdit, 
  onDelete, 
  loading = false 
}) => {
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
        <p className="text-muted">Carregando tipos de serviço...</p>
      </div>
    );
  }

  if (tiposServico.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-inbox display-1 text-muted mb-3"></i>
        <h3 className="text-muted">Nenhum tipo de serviço encontrado</h3>
        <p className="text-muted">Clique em "Novo Tipo de Serviço" para criar o primeiro.</p>
      </div>
    );
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">
          <i className="bi bi-list-ul me-2"></i>
          Tipos de Serviço ({tiposServico.length})
        </h4>
      </div>
      
      <div className="row g-4">
        {tiposServico.map((tipo) => (
          <div key={tipo.id} className="col-lg-6 col-xl-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h5 className="card-title mb-0 text-primary fw-bold">
                    <i className="bi bi-gear-fill me-2"></i>
                    {tipo.nome}
                  </h5>
                  <span className="badge bg-success fs-6">
                    {formatCurrency(tipo.valor_hora)}/h
                  </span>
                </div>
                
                {tipo.descricao && (
                  <p className="card-text text-muted flex-grow-1">
                    <i className="bi bi-info-circle me-1"></i>
                    {tipo.descricao}
                  </p>
                )}
                
                <div className="d-flex gap-2 mt-auto">
                  <button
                    onClick={() => onEdit(tipo)}
                    className="btn btn-outline-primary btn-sm flex-fill"
                    title="Editar"
                  >
                    <i className="bi bi-pencil-square me-1"></i>
                    Editar
                  </button>
                  
                  <button
                    onClick={() => {
                      if (window.confirm(`Tem certeza que deseja excluir "${tipo.nome}"?`)) {
                        onDelete(tipo.id);
                      }
                    }}
                    className="btn btn-outline-danger btn-sm flex-fill"
                    title="Excluir"
                  >
                    <i className="bi bi-trash me-1"></i>
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TipoServicoList;
