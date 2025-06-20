import React, { useState, useEffect } from 'react';
import { servicoService } from '../services/servicoService.js';
import { funcionarioService } from '../services/funcionarioService.js';
import Modal from '../components/Modal.jsx';

const ServicosPorFuncionario = () => {
  console.log('Componente ServicosPorFuncionario renderizado');
  
  const [servicos, setServicos] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Estados para modal de visualização
  const [showViewModal, setShowViewModal] = useState(false);
  const [servicoToView, setServicoToView] = useState(null);
  
  // Estados para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // 10 serviços por página

  useEffect(() => {
    loadFuncionarios();
    loadServicos();
  }, []);

  // Reset da página atual quando trocar de funcionário
  useEffect(() => {
    setCurrentPage(1);
  }, [funcionarioSelecionado]);

  const loadFuncionarios = async () => {
    try {
      console.log('Carregando funcionários...');
      const data = await funcionarioService.getAll();
      console.log('Funcionários carregados:', data);
      
      if (Array.isArray(data)) {
        setFuncionarios(data);
      } else {
        console.error('Dados de funcionários não são um array:', data);
        // Usar dados mock se a API falhar
        setFuncionarios([
          { id: 1, nome: 'João Silva' },
          { id: 2, nome: 'Maria Santos' },
          { id: 3, nome: 'Pedro Oliveira' }
        ]);
      }
    } catch (error) {
      console.error('Erro ao carregar funcionários:', error);
      // Usar dados mock se a API falhar
      setFuncionarios([
        { id: 1, nome: 'João Silva' },
        { id: 2, nome: 'Maria Santos' },
        { id: 3, nome: 'Pedro Oliveira' }
      ]);
    }
  };

  const loadServicos = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Carregando serviços...');
      
      const data = await servicoService.findAll();
      console.log('Dados recebidos:', data);
      
      if (Array.isArray(data)) {
        setServicos(data);
        console.log(`${data.length} serviços carregados com sucesso`);
      } else {
        console.error('Dados recebidos não são um array:', data);
        setError('Formato de dados inválido recebido do servidor');
        setServicos([]);
      }
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
      setError(error.message || 'Erro ao carregar serviços');
      setServicos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (servico) => {
    console.log('Visualizando serviço:', servico);
    setServicoToView(servico);
    setShowViewModal(true);
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setServicoToView(null);
  };

  // Função para formatar data
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Função para obter badge de status
  const getStatusBadge = (status) => {
    const statusConfig = {
      'pendente': { class: 'bg-warning text-dark', text: 'Pendente' },
      'em_andamento': { class: 'bg-info text-white', text: 'Andamento' },
      'concluido': { class: 'bg-success text-white', text: 'Finalizado' },
      'cancelado': { class: 'bg-danger text-white', text: 'Cancelado' }
    };
    
    const config = statusConfig[status] || { class: 'bg-secondary text-white', text: status || 'N/A' };
    
    return (
      <span className={`badge ${config.class}`}>
        {config.text}
      </span>
    );
  };

  // Filtrar serviços por funcionário - só mostra se funcionário estiver selecionado
  const servicosFiltrados = funcionarioSelecionado 
    ? servicos.filter(servico => servico.funcionario_id === parseInt(funcionarioSelecionado))
    : [];

  // Calcular paginação
  const totalPages = Math.ceil(servicosFiltrados.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const servicosPaginados = servicosFiltrados.slice(startIndex, endIndex);

  // Funções de paginação
  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  if (loading) {
    return (
      <div className="h-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-100 d-flex flex-column overflow-auto">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-shrink-0">
        <div>
          <h2 className="text-primary fw-bold mb-2">
            <i className="bi bi-person-lines-fill me-3"></i>
            Serviços por Funcionário
          </h2>
          <p className="text-muted mb-0">
            Visualize os serviços organizados por funcionário responsável
          </p>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show mb-3 flex-shrink-0" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setError('')}
          ></button>
        </div>
      )}

      {success && (
        <div className="alert alert-success alert-dismissible fade show mb-3 flex-shrink-0" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i>
          {success}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setSuccess('')}
          ></button>
        </div>
      )}

      {/* Filtro por Funcionário */}
      <div className="card mb-4 flex-shrink-0">
        <div className="card-body">
          <h5 className="card-title mb-3">
            <i className="bi bi-funnel me-2"></i>
            Selecionar Funcionário
          </h5>
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="filtroFuncionario" className="form-label">Funcionário</label>
              <select 
                id="filtroFuncionario"
                className="form-select"
                value={funcionarioSelecionado}
                onChange={(e) => setFuncionarioSelecionado(e.target.value)}
              >
                <option value="">Selecione um funcionário</option>
                {funcionarios.map((funcionario) => (
                  <option key={funcionario.id} value={funcionario.id}>
                    {funcionario.nome}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6 d-flex align-items-end">
              <button 
                className="btn btn-outline-secondary"
                onClick={() => setFuncionarioSelecionado('')}
              >
                <i className="bi bi-arrow-clockwise me-2"></i>
                Limpar Seleção
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Serviços */}
      <div className="flex-grow-1 d-flex flex-column">
        {funcionarioSelecionado ? (
          // Visualização filtrada por funcionário específico
          <div className="card flex-grow-1 d-flex flex-column">
            <div className="card-header bg-primary text-white">
              <h5 className="card-title mb-0">
                <i className="bi bi-table me-2"></i>
                Serviços - {funcionarios.find(f => f.id === parseInt(funcionarioSelecionado))?.nome} ({servicosFiltrados.length})
              </h5>
            </div>
            <div className="card-body p-0 flex-grow-1 overflow-auto">
              {servicosFiltrados.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-inbox display-1 text-muted"></i>
                  <p className="text-muted mt-3">
                    Nenhum serviço encontrado para este funcionário
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light sticky-top">
                      <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Cliente</th>
                        <th scope="col">Tipo</th>
                        <th scope="col">Data/Hora</th>
                        <th scope="col">Status</th>
                        <th scope="col">Localização</th>
                        <th scope="col" className="text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {servicosPaginados.map((servico) => (
                        <tr key={servico.id}>
                          <td>
                            <span className="badge bg-light text-dark">#{servico.id}</span>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <i className="bi bi-person-circle me-2 text-primary"></i>
                              {servico.cliente?.nome || 'N/A'}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <i className="bi bi-gear me-2 text-info"></i>
                              {servico.tipo_servico?.nome || 'N/A'}
                            </div>
                          </td>
                          <td>
                            <small className="text-muted">
                              {formatDate(servico.hora_solicitacao)}
                            </small>
                          </td>
                          <td>
                            {getStatusBadge(servico.status)}
                          </td>
                          <td>
                            <small className="text-muted">
                              {servico.localizacao || 'N/A'}
                            </small>
                          </td>
                          <td className="text-center">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-info"
                              onClick={() => handleView(servico)}
                              title="Visualizar detalhes"
                            >
                              <i className="bi bi-eye"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
            {/* Paginação */}
            {servicosFiltrados.length > 0 && totalPages > 1 && (
              <div className="card-footer">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="text-muted">
                    Mostrando {startIndex + 1} a {Math.min(endIndex, servicosFiltrados.length)} de {servicosFiltrados.length} serviços
                  </div>
                  <nav aria-label="Paginação dos serviços">
                    <ul className="pagination pagination-sm mb-0">
                      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button 
                          className="page-link"
                          onClick={goToPreviousPage}
                          disabled={currentPage === 1}
                        >
                          <i className="bi bi-chevron-left"></i>
                        </button>
                      </li>
                      
                      {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        // Mostrar apenas algumas páginas ao redor da atual
                        if (
                          pageNumber === 1 || 
                          pageNumber === totalPages || 
                          (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
                        ) {
                          return (
                            <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
                              <button 
                                className="page-link"
                                onClick={() => goToPage(pageNumber)}
                              >
                                {pageNumber}
                              </button>
                            </li>
                          );
                        } else if (
                          pageNumber === currentPage - 3 || 
                          pageNumber === currentPage + 3
                        ) {
                          return (
                            <li key={pageNumber} className="page-item disabled">
                              <span className="page-link">...</span>
                            </li>
                          );
                        }
                        return null;
                      })}
                      
                      <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button 
                          className="page-link"
                          onClick={goToNextPage}
                          disabled={currentPage === totalPages}
                        >
                          <i className="bi bi-chevron-right"></i>
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Mensagem para selecionar funcionário
          <div className="card flex-grow-1 d-flex flex-column">
            <div className="card-body d-flex flex-column justify-content-center align-items-center text-center py-5">
              <i className="bi bi-person-plus display-1 text-muted mb-4"></i>
              <h4 className="text-muted mb-3">Selecione um Funcionário</h4>
              <p className="text-muted mb-4 lead">
                Escolha um funcionário no dropdown acima para visualizar seus serviços
              </p>
              <div className="text-muted">
                <i className="bi bi-arrow-up me-2"></i>
                Use o dropdown "Funcionário" para fazer sua seleção
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Visualização */}
      {showViewModal && servicoToView && (
        <Modal
          isOpen={showViewModal}
          onClose={closeViewModal}
          title={`Detalhes do Serviço #${servicoToView.id}`}
          size="lg"
        >
          <div className="row g-3">
            <div className="col-md-6">
              <div className="card h-100">
                <div className="card-header bg-dark text-white">
                  <h6 className="mb-0">
                    <i className="bi bi-info-circle me-2"></i>
                    Informações Básicas
                  </h6>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Status:</label>
                    <div>{getStatusBadge(servicoToView.status)}</div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Data/Hora:</label>
                    <div className="text-muted">{formatDate(servicoToView.hora_solicitacao)}</div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Localização:</label>
                    <div className="text-muted">{servicoToView.localizacao || 'N/A'}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="card h-100">
                <div className="card-header bg-dark text-white">
                  <h6 className="mb-0">
                    <i className="bi bi-people me-2"></i>
                    Pessoas Envolvidas
                  </h6>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Cliente:</label>
                    <div className="text-muted">{servicoToView.cliente?.nome || 'N/A'}</div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Funcionário:</label>
                    <div className="text-muted">{servicoToView.funcionario?.nome || 'N/A'}</div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Tipo de Serviço:</label>
                    <div className="text-muted">{servicoToView.tipo_servico?.nome || 'N/A'}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-12">
              <div className="card">
                <div className="card-header bg-dark text-white">
                  <h6 className="mb-0">
                    <i className="bi bi-text-paragraph me-2"></i>
                    Descrição
                  </h6>
                </div>
                <div className="card-body">
                  <p className="mb-0 text-muted">
                    {servicoToView.descricao || 'Nenhuma descrição fornecida'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-end mt-4">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={closeViewModal}
            >
              <i className="bi bi-x-lg me-2"></i>
              Fechar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ServicosPorFuncionario;
