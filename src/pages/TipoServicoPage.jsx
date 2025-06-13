import React, { useState, useEffect } from 'react';
import TipoServicoList from '../components/TipoServicoList';
import TipoServicoForm from '../components/TipoServicoForm';
import Modal from '../components/Modal';
import { tipoServicoService } from '../services/tipoServicoService';

const TipoServicoPage = () => {
  const [tiposServico, setTiposServico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTipo, setEditingTipo] = useState(null);
  const [error, setError] = useState('');

  // Load all service types
  const loadTiposServico = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await tipoServicoService.findAll();
      setTiposServico(data);
    } catch (error) {
      setError(error.message);
      console.error('Erro ao carregar tipos de serviço:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadTiposServico();
  }, []);

  // Handle create new service type
  const handleCreate = () => {
    setEditingTipo(null);
    setIsModalOpen(true);
  };

  // Handle edit service type
  const handleEdit = (tipo) => {
    setEditingTipo(tipo);
    setIsModalOpen(true);
  };

  // Handle delete service type
  const handleDelete = async (id) => {
    try {
      await tipoServicoService.delete(id);
      await loadTiposServico(); // Reload the list
    } catch (error) {
      setError(error.message);
      console.error('Erro ao deletar tipo de serviço:', error);
    }
  };

  // Handle form submission
  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      setError('');

      if (editingTipo) {
        // Update existing
        await tipoServicoService.update(editingTipo.id, formData);
      } else {
        // Create new
        await tipoServicoService.create(formData);
      }

      setIsModalOpen(false);
      setEditingTipo(null);
      await loadTiposServico(); // Reload the list
    } catch (error) {
      setError(error.message);
      console.error('Erro ao salvar tipo de serviço:', error);
    } finally {
      setFormLoading(false);
    }
  };

  // Handle form cancel
  const handleFormCancel = () => {
    setIsModalOpen(false);
    setEditingTipo(null);
    setError('');
  };

  return (
    <div className="h-100 d-flex flex-column overflow-auto">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-shrink-0">
        <div>
          <h2 className="text-primary fw-bold mb-2">
            <i className="bi bi-gear-fill me-3"></i>
            Gerenciar Tipos de Serviço
          </h2>
          <p className="text-muted mb-0">
            Cadastre e gerencie os tipos de serviço oferecidos pelo GuinchoLink
          </p>
        </div>
        <button 
          onClick={handleCreate}
          className="btn btn-primary btn-lg shadow"
        >
          <i className="bi bi-plus-circle me-2"></i>
          Novo Tipo de Serviço
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
          <TipoServicoList
            tiposServico={tiposServico}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
          />
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleFormCancel}
        title={editingTipo ? 'Editar Tipo de Serviço' : 'Novo Tipo de Serviço'}
        size="lg"
      >
        <TipoServicoForm
          initialData={editingTipo}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          loading={formLoading}
        />
      </Modal>
    </div>
  );
};

export default TipoServicoPage;
