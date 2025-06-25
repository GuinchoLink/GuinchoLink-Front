import React, { useState, useEffect } from 'react';
import { servicoService } from '../services/servicoService.js';
import { funcionarioService } from '../services/funcionarioService.js';
import { tipoServicoService } from '../services/tipoServicoService.js';
import { veiculoEmpresaService } from '../services/veiculoEmpresaService.js';
import Modal from '../components/Modal.jsx';

const ServicosListagem = () => {
  console.log('Componente ServicosListagem renderizado');
  
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Estados para modal de exclusão
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [servicoToDelete, setServicoToDelete] = useState(null);
    // Estados para modal de visualização
  const [showViewModal, setShowViewModal] = useState(false);
  const [servicoToView, setServicoToView] = useState(null);
  
  // Estados para modal de edição
  const [showEditModal, setShowEditModal] = useState(false);
  const [servicoToEdit, setServicoToEdit] = useState(null);
  const [editFormData, setEditFormData] = useState({
    status: '',
    localizacao: '',
    descricao: '',
    funcionario_id: '',
    tipo_servico_id: '',
    veiculo_empresa_id: '',
    hora_solicitacao: ''
  });  const [editLoading, setEditLoading] = useState(false);
  
  // Estados para opções dos dropdowns
  const [funcionarios, setFuncionarios] = useState([]);
  const [tiposServico, setTiposServico] = useState([]);
  const [veiculosEmpresa, setVeiculosEmpresa] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  
  // Estados para filtros
  const [filtroStatus, setFiltroStatus] = useState('');
  const [filtroCliente, setFiltroCliente] = useState('');

  useEffect(() => {
    loadServicos();
    loadVeiculosEmpresa();
  }, []);

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
      }
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
      setError(error.message || 'Erro ao carregar serviços');
    } finally {
      setLoading(false);
    }
  };

  const loadVeiculosEmpresa = async () => {
    try {
      console.log('Carregando veículos da empresa...');
      const data = await veiculoEmpresaService.findAll();
      console.log('Veículos da empresa carregados:', data);
      
      if (Array.isArray(data)) {
        setVeiculosEmpresa(data);
      } else {
        console.error('Dados de veículos não são um array:', data);
        setVeiculosEmpresa([]);
      }
    } catch (error) {
      console.error('Erro ao carregar veículos da empresa:', error);
      setVeiculosEmpresa([]);
    }
  };

  const handleView = (servico) => {
    console.log('Visualizando serviço:', servico);
    setServicoToView(servico);
    setShowViewModal(true);
  };

  const handleDelete = (servico) => {
    console.log('Tentando excluir serviço:', servico);
    setServicoToDelete(servico);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!servicoToDelete) {
      console.error('Nenhum serviço selecionado para exclusão');
      setError('Erro: Nenhum serviço selecionado para exclusão');
      return;
    }

    try {
      console.log(`Excluindo serviço ID: ${servicoToDelete.id}`);
      await servicoService.delete(servicoToDelete.id);
      
      setSuccess('Serviço excluído com sucesso!');
      setShowDeleteModal(false);
      setServicoToDelete(null);
      
      // Recarregar a lista
      await loadServicos();
      
      setTimeout(() => {
        setSuccess('');
      }, 3000);
      
    } catch (error) {
      console.error('Erro ao excluir serviço:', error);
      setError(error.message || 'Erro ao excluir serviço');
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setServicoToDelete(null);
  };  const closeViewModal = () => {
    setShowViewModal(false);
    setServicoToView(null);
  };  const loadEditOptions = async () => {
    try {
      setLoadingOptions(true);
      console.log('Carregando opções para edição...');
      
      let funcionariosData = [];
      let tiposServicoData = [];
      
      try {
        // Carregar funcionários
        console.log('Carregando funcionários...');
        funcionariosData = await funcionarioService.getAll();
        console.log('Funcionários carregados:', funcionariosData);
      } catch (funcError) {
        console.warn('Erro ao carregar funcionários, usando dados mock:', funcError);
        funcionariosData = [
          { id: 1, nome: 'João Silva' },
          { id: 2, nome: 'Maria Santos' },
          { id: 3, nome: 'Pedro Oliveira' }
        ];
      }
      
      try {
        // Carregar tipos de serviço
        console.log('Carregando tipos de serviço...');
        tiposServicoData = await tipoServicoService.findAll();
        console.log('Tipos de serviço carregados:', tiposServicoData);
      } catch (tipoError) {
        console.warn('Erro ao carregar tipos de serviço, usando dados mock:', tipoError);
        tiposServicoData = [
          { id: 1, nome: 'Guincho' },
          { id: 2, nome: 'Reboque' },
          { id: 3, nome: 'Socorro Mecânico' }
        ];
      }
      
      setFuncionarios(Array.isArray(funcionariosData) ? funcionariosData : []);
      setTiposServico(Array.isArray(tiposServicoData) ? tiposServicoData : []);
      
      console.log('Estados atualizados - Funcionários:', funcionariosData?.length || 0, 'Tipos:', tiposServicoData?.length || 0);
      
    } catch (error) {
      console.error('Erro geral ao carregar opções:', error);
      setError(`Erro ao carregar opções para edição: ${error.message}`);
    } finally {
      setLoadingOptions(false);
    }
  };
  const handleEdit = async (servico) => {
    console.log('Editando serviço:', servico);
    
    try {
      // Carregar opções primeiro
      await loadEditOptions();
      
      // Formatar data/hora para o input datetime-local
      const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      };
      
      // Preencher formulário com dados atuais
      setEditFormData({
        status: servico.status || '',
        localizacao: servico.localizacao || '',
        descricao: servico.descricao || '',
        funcionario_id: servico.funcionario_id || '',
        tipo_servico_id: servico.tipo_servico_id || '',
        veiculo_empresa_id: servico.veiculo_empresa_id || '',
        hora_solicitacao: formatDateForInput(servico.hora_solicitacao)
      });
      
      setServicoToEdit(servico);
      setShowEditModal(true);
      
    } catch (error) {
      console.error('Erro ao carregar dados para edição:', error);
      setError('Erro ao carregar dados para edição');
    }
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    if (!servicoToEdit) {
      setError('Nenhum serviço selecionado para edição');
      return;
    }

    setEditLoading(true);
    setError('');

    try {
      console.log('Enviando dados de edição:', editFormData);
      
      // Preparar dados para envio
      const dataParaEnvio = {
        ...editFormData,
        funcionario_id: parseInt(editFormData.funcionario_id) || null,
        tipo_servico_id: parseInt(editFormData.tipo_servico_id) || null,
        veiculo_empresa_id: parseInt(editFormData.veiculo_empresa_id) || null,
        hora_solicitacao: editFormData.hora_solicitacao ? new Date(editFormData.hora_solicitacao).toISOString() : null
      };
      
      // Chamar o service de atualização
      await servicoService.update(servicoToEdit.id, dataParaEnvio);
      
      setSuccess('Serviço atualizado com sucesso!');
      setShowEditModal(false);
      setServicoToEdit(null);
      setEditFormData({
        status: '',
        localizacao: '',
        descricao: '',
        funcionario_id: '',
        tipo_servico_id: '',
        veiculo_empresa_id: '',
        hora_solicitacao: ''
      });
      
      // Recarregar a lista
      await loadServicos();
      
      setTimeout(() => {
        setSuccess('');
      }, 3000);
        } catch (error) {
      console.error('Erro ao atualizar serviço:', error);
      
      // Tratar mensagens específicas das regras de negócio
      let errorMessage = error.message || 'Erro ao atualizar serviço';
      
      // Regra de negócio 1: Limite de 3 serviços por dia
      if (errorMessage.includes('Não é possível cadastrar mais de 3 serviços no dia')) {
        errorMessage = '⚠️ Limite Diário Atingido: Já existem 3 serviços cadastrados para este dia. Escolha outra data ou aguarde a conclusão de serviços existentes.';
      }
      // Regra de negócio 2: Funcionário já alocado
      else if (errorMessage.includes('já está alocado em outro serviço pendente')) {
        errorMessage = `🚫 Funcionário Indisponível: ${errorMessage.replace('O funcionário ', '').replace(' já está alocado em outro serviço pendente.', '')} já possui um serviço pendente. Selecione outro funcionário ou aguarde a conclusão do serviço atual.`;
      }
      // Outros erros relacionados a validações
      else if (errorMessage.includes('ValidationError') || errorMessage.includes('SequelizeValidationError')) {
        errorMessage = '📝 Dados Inválidos: Verifique se todos os campos obrigatórios foram preenchidos corretamente.';
      }
      // Erros de conexão
      else if (errorMessage.includes('Network Error') || errorMessage.includes('Failed to fetch')) {
        errorMessage = '🌐 Erro de Conexão: Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.';
      }
      
      setError(errorMessage);
    } finally {
      setEditLoading(false);
    }
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setServicoToEdit(null);
    setEditFormData({
      status: '',
      localizacao: '',
      descricao: '',
      funcionario_id: '',
      tipo_servico_id: '',
      veiculo_empresa_id: '',
      hora_solicitacao: ''
    });
    setEditLoading(false);
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

  // Função para obter o modelo do veículo da empresa pelo ID
  const getVeiculoModelo = (veiculoEmpresaId) => {
    if (!veiculoEmpresaId) return 'N/A';
    const veiculo = veiculosEmpresa.find(v => v.id === veiculoEmpresaId);
    return veiculo?.modelo || 'N/A';
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

  // Filtrar serviços
  const servicosFiltrados = servicos.filter(servico => {
    const matchStatus = !filtroStatus || servico.status === filtroStatus;
    const matchCliente = !filtroCliente || 
      servico.cliente?.nome?.toLowerCase().includes(filtroCliente.toLowerCase());
    
    return matchStatus && matchCliente;
  });

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
            <i className="bi bi-list-ul me-3"></i>
            Lista de Serviços
          </h2>
          <p className="text-muted mb-0">
            Visualize e gerencie todos os serviços cadastrados
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

      {/* Filtros */}
      <div className="card mb-4 flex-shrink-0">
        <div className="card-body">
          <h5 className="card-title mb-3">
            <i className="bi bi-funnel me-2"></i>
            Filtros
          </h5>
          <div className="row g-3">
            <div className="col-md-4">
              <label htmlFor="filtroStatus" className="form-label">Status</label>
              <select 
                id="filtroStatus"
                className="form-select"
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
              >
                <option value="">Todos os status</option>
                <option value="pendente">Pendente</option>
                <option value="andamento">Andamento</option>
                <option value="finalizado">Finalizado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
            <div className="col-md-4">
              <label htmlFor="filtroCliente" className="form-label">Cliente</label>
              <input
                type="text"
                id="filtroCliente"
                className="form-control"
                placeholder="Digite o nome do cliente..."
                value={filtroCliente}
                onChange={(e) => setFiltroCliente(e.target.value)}
              />
            </div>
            <div className="col-md-4 d-flex align-items-end">
              <button 
                className="btn btn-outline-secondary"
                onClick={() => {
                  setFiltroStatus('');
                  setFiltroCliente('');
                }}
              >
                <i className="bi bi-arrow-clockwise me-2"></i>
                Limpar Filtros
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de serviços */}
      <div className="card flex-grow-1 d-flex flex-column">
        <div className="card-header bg-primary">
          <h5 className="card-title mb-0">
            <i className="bi bi-table me-2"></i>
            Serviços ({servicosFiltrados.length})
          </h5>
        </div>
        <div className="card-body p-0 flex-grow-1 overflow-auto table-container">
          {servicosFiltrados.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-inbox display-1 text-muted"></i>
              <p className="text-muted mt-3">
                {servicos.length === 0 ? 'Nenhum serviço cadastrado' : 'Nenhum serviço encontrado com os filtros aplicados'}
              </p>
            </div>
          ) : (
            <div className="table-responsive table-container">
              <table className="table table-hover mb-0">
                <thead className="table-light sticky-top">
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Cliente</th>
                    <th scope="col">Tipo</th>
                    <th scope="col">Funcionário</th>
                    <th scope="col">Veículo</th>
                    <th scope="col">Data/Hora</th>
                    <th scope="col">Status</th>
                    <th scope="col">Localização</th>
                    <th scope="col" className="text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {servicosFiltrados.map((servico) => (
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
                        <div className="d-flex align-items-center">
                          <i className="bi bi-person-badge me-2 text-success"></i>
                          {servico.funcionario?.nome || 'N/A'}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <i className="bi bi-car-front me-2 text-warning"></i>
                          {getVeiculoModelo(servico.veiculo_empresa_id)}
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
                      <td className="text-center">                        <div className="btn-group" role="group">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-info"
                            onClick={() => handleView(servico)}
                            title="Visualizar detalhes"
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-warning"
                            onClick={() => handleEdit(servico)}
                            title="Editar serviço"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(servico)}
                            title="Excluir serviço"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Visualização */}
      {showViewModal && servicoToView && (
        <Modal
          isOpen={showViewModal}
          onClose={closeViewModal}
          title={`Detalhes do Serviço #${servicoToView.id}`}
          size="lg"
        >
          <div className="row g-3">            <div className="col-md-6">
              <div className="card h-100">
                <div className="card-header bg-dark">
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
            </div>            <div className="col-md-6">
              <div className="card h-100">
                <div className="card-header bg-dark">
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
                  <div className="mb-3">
                    <label className="form-label fw-bold">Veículo Usado:</label>
                    <div className="text-muted">{getVeiculoModelo(servicoToView.veiculo_empresa_id)}</div>
                  </div>
                </div>
              </div>
            </div>            <div className="col-12">
              <div className="card">
                <div className="card-header bg-dark">
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

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && servicoToDelete && (
        <Modal
          isOpen={showDeleteModal}
          onClose={cancelDelete}
          title="Confirmar Exclusão"
          size="md"
        >
          <div className="text-center">
            <i className="bi bi-exclamation-triangle-fill text-danger display-1 mb-3"></i>
            <h5 className="mb-3">Tem certeza que deseja excluir este serviço?</h5>
            <div className="alert alert-warning">
              <strong>Serviço #{servicoToDelete.id}</strong><br />
              Cliente: {servicoToDelete.cliente?.nome || 'N/A'}<br />
              Tipo: {servicoToDelete.tipo_servico?.nome || 'N/A'}
            </div>
            <p className="text-muted">
              Esta ação não pode ser desfeita. Todos os dados relacionados a este serviço serão permanentemente removidos.
            </p>
          </div>
          <div className="d-flex justify-content-center gap-3 mt-4">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={cancelDelete}
            >
              <i className="bi bi-x-lg me-2"></i>
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={confirmDelete}
            >
              <i className="bi bi-trash me-2"></i>
              Excluir Serviço
            </button>          </div>
        </Modal>
      )}      {/* Modal de Edição */}
      {showEditModal && servicoToEdit && (
        <Modal
          isOpen={showEditModal}
          onClose={closeEditModal}
          title={`Editar Serviço #${servicoToEdit.id}`}
          size="lg"
        >
          {/* Debug info */}
          {console.log('Modal de edição renderizado:')}
          {console.log('Funcionários disponíveis:', funcionarios)}
          {console.log('Tipos de serviço disponíveis:', tiposServico)}
          {console.log('Loading options:', loadingOptions)}
          
          <form onSubmit={handleEditSubmit}>
            {/* Informações do Serviço (Somente Leitura) */}
            <div className="row mb-4">
              <div className="col-12">
                <div className="card bg-light">
                  <div className="card-body">
                    <h6 className="card-title mb-3">
                      <i className="bi bi-info-circle me-2"></i>
                      Informações do Serviço
                    </h6>
                    <div className="row">
                      <div className="col-md-6">
                        <strong>ID:</strong> #{servicoToEdit.id}
                      </div>
                      <div className="col-md-6">
                        <strong>Cliente:</strong> {servicoToEdit.cliente?.nome || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Campos Editáveis */}
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="editStatus" className="form-label fw-bold">
                    <i className="bi bi-flag me-1"></i>
                    Status *
                  </label>
                  <select
                    id="editStatus"
                    name="status"
                    className="form-select"
                    value={editFormData.status}
                    onChange={handleEditFormChange}
                    required
                  >
                    <option value="">Selecione um status</option>
                    <option value="pendente">Pendente</option>
                    <option value="andamento">Andamento</option>
                    <option value="finalizado">Finalizado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="editDataHora" className="form-label fw-bold">
                    <i className="bi bi-clock me-1"></i>
                    Data e Hora *
                  </label>
                  <input
                    type="datetime-local"
                    id="editDataHora"
                    name="hora_solicitacao"
                    className="form-control"
                    value={editFormData.hora_solicitacao}
                    onChange={handleEditFormChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">                <div className="mb-3">
                  <label htmlFor="editFuncionario" className="form-label fw-bold">
                    <i className="bi bi-person-badge me-1"></i>
                    Funcionário *
                  </label>
                  {loadingOptions ? (
                    <div className="form-control d-flex align-items-center">
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Carregando funcionários...
                    </div>
                  ) : (
                    <select
                      id="editFuncionario"
                      name="funcionario_id"
                      className="form-select"
                      value={editFormData.funcionario_id}
                      onChange={handleEditFormChange}
                      required
                    >
                      <option value="">Selecione um funcionário</option>
                      {funcionarios.map((funcionario) => (
                        <option key={funcionario.id} value={funcionario.id}>
                          {funcionario.nome}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
                <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="editTipoServico" className="form-label fw-bold">
                    <i className="bi bi-gear me-1"></i>
                    Tipo de Serviço *
                  </label>
                  {loadingOptions ? (
                    <div className="form-control d-flex align-items-center">
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Carregando tipos...
                    </div>
                  ) : (
                    <select
                      id="editTipoServico"
                      name="tipo_servico_id"
                      className="form-select"
                      value={editFormData.tipo_servico_id}
                      onChange={handleEditFormChange}
                      required
                    >
                      <option value="">Selecione um tipo de serviço</option>
                      {tiposServico.map((tipo) => (
                        <option key={tipo.id} value={tipo.id}>
                          {tipo.nome}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="editVeiculoEmpresa" className="form-label fw-bold">
                    <i className="bi bi-car-front me-1"></i>
                    Veículo da Empresa
                  </label>
                  {loadingOptions ? (
                    <div className="form-control d-flex align-items-center">
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Carregando veículos...
                    </div>
                  ) : (
                    <select
                      id="editVeiculoEmpresa"
                      name="veiculo_empresa_id"
                      className="form-select"
                      value={editFormData.veiculo_empresa_id}
                      onChange={handleEditFormChange}
                    >
                      <option value="">Selecione um veículo</option>
                      {veiculosEmpresa.map((veiculo) => (
                        <option key={veiculo.id} value={veiculo.id}>
                          {veiculo.modelo} - {veiculo.placa}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
              <div className="col-md-6">
                {/* Espaço para manter o layout balanceado */}
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <div className="mb-3">
                  <label htmlFor="editLocalizacao" className="form-label fw-bold">
                    <i className="bi bi-geo-alt me-1"></i>
                    Localização
                  </label>
                  <input
                    type="text"
                    id="editLocalizacao"
                    name="localizacao"
                    className="form-control"
                    placeholder="Digite a localização do serviço"
                    value={editFormData.localizacao}
                    onChange={handleEditFormChange}
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <div className="mb-3">
                  <label htmlFor="editDescricao" className="form-label fw-bold">
                    <i className="bi bi-text-paragraph me-1"></i>
                    Descrição
                  </label>
                  <textarea
                    id="editDescricao"
                    name="descricao"
                    className="form-control"
                    rows="4"
                    placeholder="Digite a descrição do serviço"
                    value={editFormData.descricao}
                    onChange={handleEditFormChange}
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-3 mt-4">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeEditModal}
                disabled={editLoading}
              >
                <i className="bi bi-x-lg me-2"></i>
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={editLoading}
              >
                {editLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Salvando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-lg me-2"></i>
                    Salvar Alterações
                  </>
                )}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default ServicosListagem;
