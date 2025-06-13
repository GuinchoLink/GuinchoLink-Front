import React, { useState } from 'react';

const VeiculoEmpresaList = ({ veiculos, onEdit, onDelete, loading }) => {
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const getTipoVeiculoLabel = (tipo) => {
    const tipos = {
      'moto': 'Moto',
      'pickup': 'Pickup',
      'caminhaoPrancha': 'Caminhão Prancha',
      'carro': 'Carro',
      'caminhaoLanca': 'Caminhão Lança'
    };
    return tipos[tipo] || tipo;
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      'livre': 'Livre',
      'emUso': 'Em Uso',
      'manutencao': 'Manutenção'
    };
    return statusMap[status] || status;
  };

  const getStatusBadge = (status) => {
    const badges = {
      'livre': 'bg-success',
      'emUso': 'bg-warning',
      'manutencao': 'bg-danger'
    };
    return badges[status] || 'bg-secondary';
  };

  const getTipoIcon = (tipo) => {
    const iconConfig = {
      'moto': { type: 'image', value: '/src/assets/images/motocicleta.png' },
      'pickup': { type: 'image', value: '/src/assets/images/caminhonete.png' },
      'caminhaoPrancha': { type: 'icon', value: 'bi-truck-flatbed' },
      'carro': { type: 'image', value: '/src/assets/images/sedan.png' },
      'caminhaoLanca': { type: 'icon', value: 'bi-truck' }
    };
    return iconConfig[tipo] || { type: 'image', value: '/src/assets/images/sedan.png' };
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="text-muted">Carregando veículos...</p>
        </div>
      </div>
    );
  }

  if (!veiculos || veiculos.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100">
        <div className="text-center">
          <i className="bi bi-truck display-1 text-muted mb-3"></i>
          <h4 className="text-muted">Nenhum veículo cadastrado</h4>
          <p className="text-muted">Clique em "Novo Veículo" para adicionar o primeiro veículo da frota.</p>
        </div>
      </div>
    );
  }

  const STATUS_ORDENADO = ['livre', 'emUso', 'manutencao'];

  // Função para filtrar veículos
  const veiculosFiltrados = veiculos.filter(veiculo => {
    const statusMatch = filtroStatus === 'todos' || veiculo.status_veiculo === filtroStatus;
    const tipoMatch = filtroTipo === 'todos' || veiculo.tipo_de_veiculo_servico === filtroTipo;
    return statusMatch && tipoMatch;
  });

  return (
    <div className="h-100 d-flex flex-column overflow-hidden">
      {/* Filtros */}
      <div className="row mb-3 flex-shrink-0 gx-3">
        <div className="col-md-6">
          <label className="form-label fw-bold">
            <i className="bi bi-funnel me-2"></i>
            Filtrar por Status
          </label>
          <select 
            className="form-select"
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
          >
            <option value="todos">Todos os Status</option>
            <option value="livre">Livre</option>
            <option value="emUso">Em Uso</option>
            <option value="manutencao">Manutenção</option>
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold">
            <i className="bi bi-car-front me-2"></i>
            Filtrar por Tipo
          </label>
          <select 
            className="form-select"
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
          >
            <option value="todos">Todos os Tipos</option>
            <option value="moto">Moto</option>
            <option value="carro">Carro</option>
            <option value="pickup">Pickup</option>
            <option value="caminhaoPrancha">Caminhão Prancha</option>
            <option value="caminhaoLanca">Caminhão Lança</option>
          </select>
        </div>
      </div>

      {/* Resumo dos veículos - FIXO NO TOPO */}
      <div className="row mb-3 flex-shrink-0 gx-2">
        <div className="col-md-4">
          <div className="card text-center border-success">
            <div className="card-body py-2 px-2">
              <i className="bi bi-check-circle-fill text-success fs-4"></i>
              <h6 className="card-title mt-1 mb-1 small">Livres</h6>
              <h5 className="text-success mb-0">
                {veiculosFiltrados.filter(v => v.status_veiculo === 'livre').length}
              </h5>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center border-warning">
            <div className="card-body py-2 px-2">
              <i className="bi bi-clock-fill text-warning fs-4"></i>
              <h6 className="card-title mt-1 mb-1 small">Em Uso</h6>
              <h5 className="text-warning mb-0">
                {veiculosFiltrados.filter(v => v.status_veiculo === 'emUso').length}
              </h5>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center border-danger">
            <div className="card-body py-2 px-2">
              <i className="bi bi-tools text-danger fs-4"></i>
              <h6 className="card-title mt-1 mb-1 small">Manutenção</h6>
              <h5 className="text-danger mb-0">
                {veiculosFiltrados.filter(v => v.status_veiculo === 'manutencao').length}
              </h5>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de veículos - COM ROLAGEM VERTICAL APENAS */}
      <div className="flex-grow-1 overflow-y-auto overflow-x-hidden">
        {veiculosFiltrados.length === 0 ? (
          <div className="d-flex justify-content-center align-items-center h-100">
            <div className="text-center">
              <i className="bi bi-search display-1 text-muted mb-3"></i>
              <h4 className="text-muted">Nenhum veículo encontrado</h4>
              <p className="text-muted">Tente ajustar os filtros para encontrar os veículos desejados.</p>
            </div>
          </div>
        ) : (
          <>
            {/* Lista de veículos por status */}
            {STATUS_ORDENADO.map((status) => {
              const veiculosPorStatus = veiculosFiltrados.filter(v => v.status_veiculo === status);
              if (veiculosPorStatus.length === 0) return null;

              return (
                <div key={status} className="mb-4">
                  <h5 className="mb-3">
                    <span className={`badge ${getStatusBadge(status)} me-2`}>
                      {getStatusLabel(status)}
                    </span>
                  Veículos ({veiculosPorStatus.length})
                </h5>
            <div className="row g-3 gx-3">
              {veiculosPorStatus.map((veiculo) => (
                <div key={veiculo.id} className="col-lg-4 col-md-6">
                  <div className="card h-100 shadow-sm border-0">
                    <div className="card-body p-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div className="d-flex align-items-center flex-grow-1 min-w-0">
                          <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                            style={{ width: '40px', height: '40px', flexShrink: 0 }}>
                            {getTipoIcon(veiculo.tipo_de_veiculo_servico).type === 'image' ? (
                              <img 
                                src={getTipoIcon(veiculo.tipo_de_veiculo_servico).value} 
                                alt={getTipoVeiculoLabel(veiculo.tipo_de_veiculo_servico)}
                                style={{ width: '24px', height: '24px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
                              />
                            ) : (
                              <i className={getTipoIcon(veiculo.tipo_de_veiculo_servico).value}></i>
                            )}
                          </div>
                          <div className="flex-grow-1 min-w-0">
                            <h6 className="card-title mb-0 fw-bold text-truncate">{veiculo.placa}</h6>
                            <small className="text-muted text-truncate d-block">{getTipoVeiculoLabel(veiculo.tipo_de_veiculo_servico)}</small>
                          </div>
                        </div>
                        <span className={`badge ${getStatusBadge(veiculo.status_veiculo)} ms-2`} style={{ flexShrink: 0 }}>
                          {getStatusLabel(veiculo.status_veiculo)}
                        </span>
                      </div>

                      <div className="row mb-3 gx-2">
                        <div className="col-6">
                          <small className="text-muted d-block">Modelo</small>
                          <strong className="small text-truncate d-block">{veiculo.modelo}</strong>
                        </div>
                        <div className="col-6">
                          <small className="text-muted d-block">Cor</small>
                          <strong className="small text-truncate d-block">{veiculo.cor}</strong>
                        </div>
                      </div>

                      <div className="d-flex gap-2">
                        {veiculo.status_veiculo === 'emUso' ? (
                          <div 
                            className="flex-fill"
                            title="Não é possível editar o veículo, pois ele está em uso"
                            style={{ cursor: 'not-allowed' }}
                          >
                            <button
                              className="btn btn-outline-secondary btn-sm w-100"
                              disabled
                              style={{ pointerEvents: 'none' }}
                            >
                              <i className="bi bi-pencil me-1"></i>
                              <span className="d-none d-lg-inline">Editar</span>
                            </button>
                          </div>
                        ) : (
                          <button
                            className="btn btn-outline-primary btn-sm flex-fill"
                            onClick={() => onEdit(veiculo)}
                            title="Editar veículo"
                          >
                            <i className="bi bi-pencil me-1"></i>
                            <span className="d-none d-lg-inline">Editar</span>
                          </button>
                        )}
                        
                        {veiculo.status_veiculo === 'emUso' ? (
                          <div 
                            className="flex-fill"
                            title="Não é possível excluir o veículo, pois ele está em uso"
                            style={{ cursor: 'not-allowed' }}
                          >
                            <button
                              className="btn btn-outline-secondary btn-sm w-100"
                              disabled
                              style={{ pointerEvents: 'none' }}
                            >
                              <i className="bi bi-trash me-1"></i>
                              <span className="d-none d-lg-inline">Excluir</span>
                            </button>
                          </div>
                        ) : (
                          <button
                            className="btn btn-outline-danger btn-sm flex-fill"
                            onClick={() => onDelete(veiculo.id)}
                            title="Excluir veículo"
                          >
                            <i className="bi bi-trash me-1"></i>
                            <span className="d-none d-lg-inline">Excluir</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
          </>
        )}
      </div>
    </div>
  );
};

export default VeiculoEmpresaList;
