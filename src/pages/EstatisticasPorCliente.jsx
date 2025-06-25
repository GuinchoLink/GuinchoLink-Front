import React, { useState, useEffect } from 'react';
import { fimServicoService } from '../services/fimServicoService';
import { clienteService } from '../services/clienteService';

const EstatisticasPorCliente = () => {
  const [clienteId, setClienteId] = useState('');
  const [clientes, setClientes] = useState([]);
  const [loadingClientes, setLoadingClientes] = useState(false);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Carregar dados salvos ao montar o componente
  useEffect(() => {
    const savedClienteId = sessionStorage.getItem('estatisticas_cliente_id');
    const savedStatistics = sessionStorage.getItem('estatisticas_cliente_data');
    
    if (savedClienteId && savedStatistics) {
      setClienteId(savedClienteId);
      try {
        setStatistics(JSON.parse(savedStatistics));
      } catch (error) {
        console.error('Erro ao carregar dados salvos:', error);
        sessionStorage.removeItem('estatisticas_cliente_id');
        sessionStorage.removeItem('estatisticas_cliente_data');
      }
    }
    
    // Carregar lista de clientes
    loadClientes();
  }, []);

  // Carregar lista de clientes
  const loadClientes = async () => {
    try {
      setLoadingClientes(true);
      const data = await clienteService.findAll();
      setClientes(data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      setError('Erro ao carregar lista de clientes');
    } finally {
      setLoadingClientes(false);
    }
  };

  // Carregar estatísticas específicas do cliente
  const loadClienteStatistics = async (id) => {
    try {
      setLoading(true);
      setError('');
      const data = await fimServicoService.getClienteStatistics(id);
      setStatistics(data);
      
      // Salvar no sessionStorage
      sessionStorage.setItem('estatisticas_cliente_id', id);
      sessionStorage.setItem('estatisticas_cliente_data', JSON.stringify(data));
    } catch (error) {
      setError(error.message);
      console.error('Erro ao carregar estatísticas do cliente:', error);
      setStatistics(null);
      
      // Limpar dados salvos em caso de erro
      sessionStorage.removeItem('estatisticas_cliente_id');
      sessionStorage.removeItem('estatisticas_cliente_data');
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="h-100 d-flex flex-column overflow-hidden">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-shrink-0">
        <div>
          <h2 className="text-primary fw-bold mb-2">
            <i className="bi bi-person-lines-fill me-3"></i>
            Estatísticas por Cliente
          </h2>
          <p className="text-muted mb-0">
            Consulte as estatísticas detalhadas de um cliente específico
          </p>
        </div>
        {statistics && clienteId && (
          <button 
            onClick={() => loadClienteStatistics(clienteId)}
            className="btn btn-outline-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Atualizando...
              </>
            ) : (
              <>
                <i className="bi bi-arrow-clockwise me-2"></i>
                Atualizar Dados
              </>
            )}
          </button>
        )}
      </div>

      {/* Seleção de Cliente */}
      <div className="card shadow-sm mb-4 flex-shrink-0">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-12">
              <label htmlFor="clienteId" className="form-label fw-bold">
                <i className="bi bi-person me-2"></i>
                Cliente
              </label>
              <select
                className="form-select"
                id="clienteId"
                value={clienteId}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  setClienteId(selectedId);
                  if (selectedId) {
                    loadClienteStatistics(selectedId);
                  } else {
                    setStatistics(null);
                    setError('');
                    // Limpar dados salvos quando nenhum cliente está selecionado
                    sessionStorage.removeItem('estatisticas_cliente_id');
                    sessionStorage.removeItem('estatisticas_cliente_data');
                  }
                }}
                disabled={loading || loadingClientes}
              >
                <option value="">Selecione um cliente...</option>
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    #{cliente.id} - {cliente.nome}
                  </option>
                ))}
              </select>
              {loadingClientes && (
                <div className="form-text">
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Carregando clientes...
                </div>
              )}
              {loading && (
                <div className="form-text">
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Carregando estatísticas...
                </div>
              )}
            </div>
          </div>
        </div>
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

      {/* Resultados */}
      <div className="flex-grow-1" style={{ overflowX: 'hidden' }}>
        {!statistics ? (
          <div className="card shadow-sm h-100 d-flex align-items-center justify-content-center">
            <div className="text-center py-5">
              <div className="mb-4">
                <i className="bi bi-person-circle display-1 text-muted"></i>
              </div>
              <h5 className="text-muted mb-3">Selecione um cliente</h5>
              <p className="text-muted">
                Selecione um cliente na lista acima para visualizar suas estatísticas detalhadas.
              </p>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {/* Informações do Cliente */}
            <div className="col-12">
              <div className="card shadow-sm">
                <div className="card-header bg-primary">
                  <h5 className="card-title mb-0">
                    <i className="bi bi-person-badge me-2"></i>
                    Informações do Cliente
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-4">
                      <h6 className="text-muted mb-1">ID do Cliente</h6>
                      <p className="fs-5 fw-bold text-primary mb-3">
                        #{statistics.cliente_id}
                      </p>
                    </div>
                    <div className="col-md-4">
                      <h6 className="text-muted mb-1">Nome do Cliente</h6>
                      <p className="fs-5 fw-bold mb-3">
                        {clientes.find(c => c.id == statistics.cliente_id)?.nome || 
                         statistics.nomeCliente || 
                         'Nome não disponível'}
                      </p>
                    </div>
                    <div className="col-md-4">
                      <h6 className="text-muted mb-1">Primeira Finalização</h6>
                      <p className="fs-6 text-muted mb-3">
                        {statistics.finalizacoes && statistics.finalizacoes.length > 0
                          ? formatDateTime(statistics.finalizacoes[statistics.finalizacoes.length - 1].hora_finalizacao)
                          : 'N/A'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cards de Estatísticas */}
            <div className="col-12">
              <div className="row g-3">
                <div className="col-md-3">
                  <div className="card bg-success text-white shadow">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="card-title text-uppercase mb-1">Total de Serviços</h6>
                          <h3 className="mb-0">{statistics.quantidade || 0}</h3>
                        </div>
                        <i className="bi bi-gear-fill fs-1 opacity-75"></i>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-3">
                  <div className="card bg-info text-white shadow">
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
                  <div className="card bg-warning text-dark shadow">
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
                  <div className="card bg-secondary text-white shadow">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="card-title text-uppercase mb-1">Último Serviço</h6>
                          <h6 className="mb-0">
                            {statistics.finalizacoes && statistics.finalizacoes.length > 0
                              ? new Date(statistics.finalizacoes[0].hora_finalizacao).toLocaleDateString('pt-BR')
                              : 'N/A'
                            }
                          </h6>
                        </div>
                        <i className="bi bi-calendar-check fs-1 opacity-75"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detalhes dos Serviços */}
            {statistics.finalizacoes && statistics.finalizacoes.length > 0 && (
              <div className="col-12">
                <div className="card shadow-sm">
                  <div className="card-header bg-light">
                    <h5 className="card-title mb-0">
                      <i className="bi bi-list-ul me-2"></i>
                      Histórico de Finalizações
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
                            <th scope="col" style={{ width: '15%' }}>
                              <i className="bi bi-car-front me-1"></i>
                              Veículo
                            </th>
                            <th scope="col" style={{ width: '13%' }}>
                              <i className="bi bi-gear me-1"></i>
                              Tipo Serviço
                            </th>
                            <th scope="col" style={{ width: '16%' }}>
                              <i className="bi bi-geo-alt me-1"></i>
                              Localização
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
                            <th scope="col" style={{ width: '17%' }}>
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
                                <span className="text-muted text-truncate d-block" title={finalizacao.servico?.localizacao || 'N/A'}>
                                  {finalizacao.servico?.localizacao || 'N/A'}
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

export default EstatisticasPorCliente;
