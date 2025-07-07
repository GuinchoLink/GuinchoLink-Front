import React, { useState, useEffect } from 'react';
import VeiculoClienteList from '../../components/veiculos/VeiculoClienteList';
import VeiculoClienteForm from '../../components/veiculos/VeiculoClienteForm';
import Modal from '../../components/common/Modal';
import { veiculoClienteService } from '../../services/veiculoClienteService';

const VeiculosClientes = () => {
  const [veiculos, setVeiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVeiculo, setEditingVeiculo] = useState(null);
  const [error, setError] = useState('');

  // Load all vehicles
  const loadVeiculos = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await veiculoClienteService.findAll();
      setVeiculos(data);
    } catch (error) {
      setError(error.message);
      console.error('Erro ao carregar veículos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadVeiculos();
  }, []);

  // Handle create new vehicle
  const handleCreate = () => {
    setEditingVeiculo(null);
    setIsModalOpen(true);
  };

  // Handle edit vehicle
  const handleEdit = (veiculo) => {
    setEditingVeiculo(veiculo);
    setIsModalOpen(true);
  };

  // Handle delete vehicle
  const handleDelete = async (id) => {
    try {
      await veiculoClienteService.delete(id);
      await loadVeiculos(); // Reload the list
    } catch (error) {
      setError(error.message);
      console.error('Erro ao deletar veículo:', error);
    }
  };

  // Handle form submission
  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      setError('');

      if (editingVeiculo) {
        // Update existing
        await veiculoClienteService.update(editingVeiculo.id, formData);
      } else {
        // Create new
        await veiculoClienteService.create(formData);
      }

      setIsModalOpen(false);
      setEditingVeiculo(null);
      await loadVeiculos(); // Reload the list
    } catch (error) {
      setError(error.message);
      console.error('Erro ao salvar veículo:', error);
    } finally {
      setFormLoading(false);
    }
  };

  // Handle form cancel
  const handleFormCancel = () => {
    setIsModalOpen(false);
    setEditingVeiculo(null);
    setError('');
  };

  return (
    <div className="h-100 d-flex flex-column overflow-auto">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-shrink-0">
        <div>
          <h2 className="text-primary fw-bold mb-2">
            <i className="bi bi-truck-front-fill me-3"></i>
            Gerenciar Veículos de Clientes
          </h2>
          <p className="text-muted mb-0">
            Cadastre e gerencie os veículos dos clientes do GuinchoLink
          </p>
        </div>
        <button 
          onClick={handleCreate}
          className="btn btn-primary btn-lg shadow"
        >
          <i className="bi bi-plus-circle me-2"></i>
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
          <VeiculoClienteList
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
        <VeiculoClienteForm
          initialData={editingVeiculo}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          loading={formLoading}
        />
      </Modal>
    </div>
  );
};

export default VeiculosClientes;