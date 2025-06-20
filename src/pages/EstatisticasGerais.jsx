import React, { useState, useEffect } from 'react';
import { fimServicoService } from '../services/fimServicoService';

const EstatisticasGerais = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Carregar estatísticas gerais
  const loadStatistics = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fimServicoService.getClienteStatisticsGeneral();
      setStatistics(data);
    } catch (error) {
      setError(error.message);
      console.error('Erro ao carregar estatísticas gerais:', error);
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados na montagem do componente
  useEffect(() => {
    loadStatistics();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  if (loading) {
    return (
      <div className="h-100 d-flex justify-content-center align-items-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="text-muted">Carregando estatísticas gerais...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-100 d-flex flex-column overflow-hidden">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-shrink-0">
        <div>
          <h2 className="text-primary fw-bold mb-2">
            <i className="bi bi-graph-up me-3"></i>
            Estatísticas Gerais de Fim de Serviços
          </h2>
          <p className="text-muted mb-0">
            Visualize estatísticas consolidadas de todos os fim de serviços
          </p>
        </div>
        <button 
          onClick={loadStatistics}
          className="btn btn-outline-primary"
          disabled={loading}
        >
          <i className="bi bi-arrow-clockwise me-2"></i>
          Atualizar
        </button>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show flex-shrink-0 mb-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <strong>Erro:</strong> {error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setError('')}
            aria-label="Fechar"
          ></button>
        </div>
      )}

      <div className="flex-grow-1" style={{ overflowX: 'hidden' }}>
        {!statistics ? (
          <div className="card shadow-sm h-100 d-flex align-items-center justify-content-center">
            <div className="text-center py-5">
              <div className="mb-4">
                <i className="bi bi-bar-chart display-1 text-muted"></i>
              </div>
              <h5 className="text-muted mb-3">Nenhuma estatística encontrada</h5>
              <p className="text-muted">
                Não há dados estatísticos disponíveis no momento.
              </p>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {/* Cards de Resumo */}
            <div className="col-12">
              <div className="row g-3">
                <div className="col-md-3">
                  <div className="card bg-primary text-white shadow">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="card-title text-uppercase mb-1">Total de Finalizações</h6>
                          <h3 className="mb-0">{statistics.quantidade || 0}</h3>
                        </div>
                        <i className="bi bi-check-circle-fill fs-1 opacity-75"></i>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-3">
                  <div className="card bg-success text-white shadow">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="card-title text-uppercase mb-1">Valor Total</h6>
                          <h3 className="mb-0">
                            {formatCurrency(statistics.valor_total)}
                          </h3>
                        </div>
                        <i className="bi bi-currency-dollar fs-1 opacity-75"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="card bg-info text-white shadow">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="card-title text-uppercase mb-1">Valor Médio</h6>
                          <h3 className="mb-0">
                            {formatCurrency(
                              statistics.quantidade > 0 
                                ? statistics.valor_total / statistics.quantidade 
                                : 0
                            )}
                          </h3>
                        </div>
                        <i className="bi bi-calculator fs-1 opacity-75"></i>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="card bg-warning text-dark shadow">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="card-title text-uppercase mb-1">Clientes Únicos</h6>
                          <h3 className="mb-0">
                            {statistics.finalizacoes ? 
                              [...new Set(statistics.finalizacoes.map(f => f.servico?.cliente_id))].length 
                              : 0
                            }
                          </h3>
                        </div>
                        <i className="bi bi-people-fill fs-1 opacity-75"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lista de Finalizações */}
            {statistics.finalizacoes && statistics.finalizacoes.length > 0 && (
              <div className="col-12">
                <div className="card shadow-sm">
                  <div className="card-header bg-light">
                    <h5 className="card-title mb-0">
                      <i className="bi bi-list-ul me-2"></i>
                      Todas as Finalizações
                    </h5>
                  </div>
                  <div className="card-body p-0">
                    <div className="table-responsive">
                      <table className="table table-hover table-striped align-middle mb-0" style={{ tableLayout: 'fixed', width: '100%' }}>
                        <thead className="table-dark">
                          <tr>
                            <th scope="col" style={{ width: '6%' }}>
                              <i className="bi bi-hash me-1"></i>
                              ID
                            </th>
                            <th scope="col" style={{ width: '18%' }}>
                              <i className="bi bi-person me-1"></i>
                              Cliente
                            </th>
                            <th scope="col" style={{ width: '14%' }}>
                              <i className="bi bi-car-front me-1"></i>
                              Veículo
                            </th>
                            <th scope="col" style={{ width: '13%' }}>
                              <i className="bi bi-gear me-1"></i>
                              Tipo Serviço
                            </th>
                            <th scope="col" style={{ width: '13%' }}>
                              <i className="bi bi-clock me-1"></i>
                              Data/Hora
                            </th>
                            <th scope="col" style={{ width: '10%' }}>
                              <i className="bi bi-currency-dollar me-1"></i>
                              Valor
                            </th>
                            <th scope="col" style={{ width: '10%' }}>
                              <i className="bi bi-tag me-1"></i>
                              Status
                            </th>
                            <th scope="col" style={{ width: '16%' }}>
                              <i className="bi bi-file-text me-1"></i>
                              Descrição
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {statistics.finalizacoes.map((finalizacao) => (
                            <tr key={finalizacao.id}>
                              <td>
                                <span className="badge bg-secondary fs-6">
                                  #{finalizacao.id}
                                </span>
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2"
                                       style={{ width: '28px', height: '28px', fontSize: '0.8rem', flexShrink: 0 }}>
                                    <i className="bi bi-person-fill"></i>
                                  </div>
                                  <div className="flex-grow-1 overflow-hidden">
                                    <div className="fw-bold text-truncate" title={finalizacao.servico?.veiculo_cliente?.cliente?.nome || 'N/A'}>
                                      {finalizacao.servico?.veiculo_cliente?.cliente?.nome || 'N/A'}
                                    </div>
                                    <small className="text-muted text-truncate d-block" title={`ID: ${finalizacao.servico?.cliente_id}`}>ID: {finalizacao.servico?.cliente_id}</small>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="overflow-hidden">
                                  <div className="fw-bold text-truncate" title={finalizacao.servico?.veiculo_cliente?.modelo || 'N/A'}>
                                    {finalizacao.servico?.veiculo_cliente?.modelo || 'N/A'}
                                  </div>
                                  <small className="text-muted text-truncate d-block" title={finalizacao.servico?.veiculo_cliente?.placa || 'N/A'}>
                                    {finalizacao.servico?.veiculo_cliente?.placa || 'N/A'}
                                  </small>
                                </div>
                              </td>
                              <td>
                                <span className="badge bg-info text-truncate d-block" title={finalizacao.servico?.tipo_servico?.nome || 'N/A'}>
                                  {finalizacao.servico?.tipo_servico?.nome || 'N/A'}
                                </span>
                              </td>
                              <td>
                                <div className="text-truncate" title={formatDateTime(finalizacao.hora_finalizacao)}>
                                  <span className="fw-bold">
                                    {formatDateTime(finalizacao.hora_finalizacao)}
                                  </span>
                                </div>
                              </td>
                              <td>
                                <div className="text-truncate" title={formatCurrency(finalizacao.valor_total)}>
                                  <span className="fw-bold text-success">
                                    {formatCurrency(finalizacao.valor_total)}
                                  </span>
                                </div>
                              </td>
                              <td>
                                <span className={`badge ${finalizacao.on_sale ? 'bg-warning text-dark' : 'bg-success'} fs-6`}>
                                  <i className={`bi ${finalizacao.on_sale ? 'bi-tag-fill' : 'bi-check-circle-fill'} me-1`}></i>
                                  {finalizacao.on_sale ? 'Promoção' : 'Normal'}
                                </span>
                              </td>
                              <td>
                                <div className="text-truncate" title={finalizacao.descricao_fim || 'Sem descrição'}>
                                  {finalizacao.descricao_fim ? (
                                    <span>{finalizacao.descricao_fim}</span>
                                  ) : (
                                    <span className="text-muted fst-italic">Sem descrição</span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EstatisticasGerais;
