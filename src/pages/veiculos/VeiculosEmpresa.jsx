import React, { useState, useEffect } from 'react';
import VeiculoEmpresaList from '../../components/veiculos/VeiculoEmpresaList';
import VeiculoEmpresaForm from '../../components/veiculos/VeiculoEmpresaForm';
import Modal from '../../components/common/Modal';
import { veiculoEmpresaService } from '../../services/veiculoEmpresaService';

const VeiculosEmpresa = () => {
  const [veiculos, setVeiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVeiculo, setEditingVeiculo] = useState(null);
  const [error, setError] = useState('');

  // Carregar todos os veículos
  const loadVeiculos = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await veiculoEmpresaService.findAll();
      setVeiculos(data);
    } catch (error) {
      setError(error.message);
      console.error('Erro ao carregar veículos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados na montagem do componente
  useEffect(() => {
    loadVeiculos();
  }, []);

  // Lidar com criação de novo veículo
  const handleCreate = () => {
    setEditingVeiculo(null);
    setIsModalOpen(true);
  };

  // Lidar com edição de veículo
  const handleEdit = (veiculo) => {
    setEditingVeiculo(veiculo);
    setIsModalOpen(true);
  };

  // Lidar com exclusão de veículo
  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este veículo?')) {
      try {
        await veiculoEmpresaService.delete(id);
        await loadVeiculos(); // Recarregar a lista
      } catch (error) {
        setError(error.message);
        console.error('Erro ao deletar veículo:', error);
      }
    }
  };

  // Lidar com submissão do formulário
  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      setError('');

      if (editingVeiculo) {
        // Atualizar existente
        await veiculoEmpresaService.update(editingVeiculo.id, formData);
      } else {
        // Criar novo
        await veiculoEmpresaService.create(formData);
      }

      setIsModalOpen(false);
      setEditingVeiculo(null);
      await loadVeiculos(); // Recarregar a lista
    } catch (error) {
      setError(error.message);
      console.error('Erro ao salvar veículo:', error);
    } finally {
      setFormLoading(false);
    }
  };

  // Lidar com cancelamento do formulário
  const handleFormCancel = () => {
    setIsModalOpen(false);
    setEditingVeiculo(null);
    setError('');
  };

  return (
    <div className="h-100 d-flex flex-column overflow-hidden">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-shrink-0">
        <div>
          <h2 className="text-primary fw-bold mb-2">
            <i className="bi bi-truck me-3"></i>
            Gerenciar Veículos da Empresa
          </h2>
          <p className="text-muted mb-0">
            Cadastre e gerencie a frota de veículos da empresa
          </p>
        </div>
        <button 
          onClick={handleCreate}
          className="btn btn-primary btn-lg shadow"
        >
          <i className="bi bi-truck-fill me-2"></i>
          Novo Veículo
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
          <VeiculoEmpresaList
            veiculos={veiculos}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
          />
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleFormCancel}
        title={editingVeiculo ? 'Editar Veículo' : 'Novo Veículo'}
        size="lg"
      >
        <VeiculoEmpresaForm
          initialData={editingVeiculo}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          loading={formLoading}
        />
      </Modal>
    </div>
  );
};

export default VeiculosEmpresa;
