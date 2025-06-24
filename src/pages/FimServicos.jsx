import React, { useState, useEffect } from 'react';
import FimServicoForm from '../components/FimServicoForm';
import Modal from '../components/Modal';
import { fimServicoService } from '../services/fimServicoService';
import { servicoService } from '../services/servicoService';

const FimServicos = () => {
  const [fimServicos, setFimServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFimServico, setEditingFimServico] = useState(null);
  const [error, setError] = useState('');

  // Carregar todos os fins de serviço
  const loadFimServicos = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fimServicoService.findAll();
      setFimServicos(data);
    } catch (error) {
      setError(error.message);
      console.error('Erro ao carregar fins de serviço:', error);
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados na montagem do componente
  useEffect(() => {
    loadFimServicos();
  }, []);

  // Lidar com criação de novo fim de serviço
  const handleCreate = () => {
    setEditingFimServico(null);
    setIsModalOpen(true);
  };

  // Lidar com edição de fim de serviço
  const handleEdit = (fimServico) => {
    setEditingFimServico(fimServico);
    setIsModalOpen(true);
  };

  // Lidar com exclusão de fim de serviço
  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este fim de serviço?\n\nO serviço voltará para o status "pendente" e poderá ser finalizado novamente.')) {
      try {
        // Primeiro, buscar o fim de serviço para obter o servico_id
        const fimServicoToDelete = fimServicos.find(fs => fs.id === id);
        if (!fimServicoToDelete) {
          throw new Error('Fim de serviço não encontrado');
        }

        // Deletar o fim de serviço
        await fimServicoService.delete(id);

        // Atualizar o status do serviço para "pendente"
        await servicoService.update(fimServicoToDelete.servico_id, { 
          status: 'pendente' 
        });

        // Recarregar a lista
        await loadFimServicos();
      } catch (error) {
        setError(error.message);
        console.error('Erro ao deletar fim de serviço:', error);
      }
    }
  };

  // Lidar com submissão do formulário
  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      setError('');

      // Debug: log dos dados enviados
      console.log('Dados enviados para o backend:', formData);

      if (editingFimServico) {
        // Atualizar existente
        const result = await fimServicoService.update(editingFimServico.id, formData);
        console.log('Resultado da atualização:', result);
      } else {
        // Criar novo
        const result = await fimServicoService.create(formData);
        console.log('Resultado da criação:', result);
      }

      setIsModalOpen(false);
      setEditingFimServico(null);
      await loadFimServicos(); // Recarregar a lista
    } catch (error) {
      setError(error.message);
      console.error('Erro ao salvar fim de serviço:', error);
      // Re-throw o erro para que o formulário possa capturá-lo
      throw error;
    } finally {
      setFormLoading(false);
    }
  };

  // Lidar com cancelamento do formulário
  const handleFormCancel = () => {
    setIsModalOpen(false);
    setEditingFimServico(null);
    setError('');
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDateTime = (dateString) => {
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
          <p className="text-muted">Carregando fins de serviço...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-100 d-flex flex-column overflow-hidden">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-shrink-0">
        <div>
          <h2 className="text-primary fw-bold mb-2">
            <i className="bi bi-check-circle me-3"></i>
            Gerenciar Fins de Serviço
          </h2>
          <p className="text-muted mb-0">
            Cadastre e gerencie as finalizações dos serviços prestados
          </p>
        </div>
        <button 
          onClick={handleCreate}
          className="btn btn-primary btn-lg shadow"
        >
          <i className="bi bi-plus-circle-fill me-2"></i>
          Novo Fim de Serviço
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

      <div className="card shadow-sm flex-grow-1 d-flex flex-column overflow-hidden">
        <div className="card-body d-flex flex-column flex-grow-1 p-4 overflow-auto">
          {!fimServicos || fimServicos.length === 0 ? (
            <div className="text-center py-5">
              <div className="mb-4">
                <i className="bi bi-clipboard-x display-1 text-muted"></i>
              </div>
              <h5 className="text-muted mb-3">Nenhum fim de serviço encontrado</h5>
              <p className="text-muted">
                Não há fins de serviço cadastrados no momento.
              </p>
              <button 
                onClick={handleCreate}
                className="btn btn-primary"
              >
                <i className="bi bi-plus-circle-fill me-2"></i>
                Cadastrar Primeiro Fim de Serviço
              </button>
            </div>
          ) : (
            <div>
              <table className="table table-hover table-striped align-middle" style={{ tableLayout: 'fixed', width: '100%' }}>
                <thead className="table-dark">
                  <tr>
                    <th scope="col" style={{ width: '8%' }}>
                      <i className="bi bi-hash me-1"></i>
                      ID
                    </th>
                    <th scope="col" style={{ width: '12%' }}>
                      <i className="bi bi-gear me-1"></i>
                      Serviço
                    </th>
                    <th scope="col" style={{ width: '18%' }}>
                      <i className="bi bi-clock me-1"></i>
                      Finalização
                    </th>
                    <th scope="col" style={{ width: '13%' }}>
                      <i className="bi bi-currency-dollar me-1"></i>
                      Valor
                    </th>
                    <th scope="col" style={{ width: '12%' }}>
                      <i className="bi bi-tag me-1"></i>
                      Status
                    </th>
                    <th scope="col" style={{ width: '25%' }}>
                      <i className="bi bi-file-text me-1"></i>
                      Descrição
                    </th>
                    <th scope="col" className="text-center" style={{ width: '12%' }}>
                      <i className="bi bi-gear-fill me-1"></i>
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {fimServicos.map((fimServico) => (
                    <tr key={fimServico.id}>
                      <td>
                        <span className="badge bg-secondary fs-6">
                          #{fimServico.id}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-info fs-6">
                          Serviço #{fimServico.servico_id}
                        </span>
                      </td>
                      <td>
                        <div className="text-truncate">
                          <span className="fw-bold">
                            {formatDateTime(fimServico.hora_finalizacao)}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="text-truncate">
                          <span className="fw-bold text-success">
                            {formatCurrency(fimServico.valor_total)}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="text-truncate">
                          <span className={`badge ${fimServico.on_sale ? 'bg-warning text-dark' : 'bg-success'}`}>
                            <i className={`bi ${fimServico.on_sale ? 'bi-tag-fill' : 'bi-check-circle-fill'} me-1`}></i>
                            {fimServico.on_sale ? 'Promoção' : 'Normal'}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="text-truncate" title={fimServico.descricao_fim || 'Sem descrição'}>
                          {fimServico.descricao_fim ? (
                            <span>
                              {fimServico.descricao_fim}
                            </span>
                          ) : (
                            <span className="text-muted fst-italic">Sem descrição</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex justify-content-center gap-1">
                          <button
                            className="btn btn-sm btn-outline-primary p-1"
                            onClick={() => handleEdit(fimServico)}
                            title="Editar fim de serviço"
                            style={{ width: '28px', height: '28px' }}
                          >
                            <i className="bi bi-pencil-fill"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger p-1"
                            onClick={() => handleDelete(fimServico.id)}
                            title="Excluir fim de serviço"
                            style={{ width: '28px', height: '28px' }}
                          >
                            <i className="bi bi-trash-fill"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Informações do rodapé */}
              <div className="row mt-4">
                <div className="col-md-6">
                  <p className="text-muted mb-0">
                    <i className="bi bi-info-circle me-2"></i>
                    Mostrando {fimServicos.length} fim(ns) de serviço
                  </p>
                </div>
                <div className="col-md-6 text-end">
                  <p className="text-muted mb-0">
                    <i className="bi bi-currency-dollar me-2"></i>
                    Total: {formatCurrency(
                      fimServicos.reduce((sum, fs) => sum + parseFloat(fs.valor_total || 0), 0)
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleFormCancel}
        title={editingFimServico ? 'Editar Fim de Serviço' : 'Novo Fim de Serviço'}
        size="lg"
      >
        <FimServicoForm
          initialData={editingFimServico}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          loading={formLoading}
        />
      </Modal>
    </div>
  );
};

export default FimServicos;
