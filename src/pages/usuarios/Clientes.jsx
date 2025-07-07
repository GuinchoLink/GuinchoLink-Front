import React, { useState, useEffect } from 'react';
import ClienteList from '../../components/usuarios/ClienteList';
import ClienteForm from '../../components/usuarios/ClienteForm';
import Modal from '../../components/common/Modal';
import { clienteService } from '../../services/clienteService';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState(null);
  const [error, setError] = useState('');

  // Load all clients
  const loadClientes = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await clienteService.findAll();
      setClientes(data);
    } catch (error) {
      setError(error.message);
      console.error('Erro ao carregar clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadClientes();
  }, []);

  // Handle create new client
  const handleCreate = () => {
    setEditingCliente(null);
    setIsModalOpen(true);
  };

  // Handle edit client
  const handleEdit = (cliente) => {
    setEditingCliente(cliente);
    setIsModalOpen(true);
  };
  // Handle delete client
  const handleDelete = async (id) => {
    try {
      await clienteService.delete(id);
      await loadClientes(); // Reload the list
    } catch (error) {
      console.error('Erro completo:', error);
      console.error('Error response data:', error.response?.data);
      
      // Verificar se é o campo "err" específico do backend
      if (error.response && error.response.data && error.response.data.err) {
        setError(error.response.data.err);
      } else if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else if (error.response && error.response.data && typeof error.response.data === 'string') {
        setError(error.response.data);
      } else {
        setError('Erro ao deletar cliente: ' + error.message);
      }
      
      setTimeout(() => {
        setError('');
      }, 5000);
    }
  };

  // Handle form submission
  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      setError('');

      if (editingCliente) {
        // Update existing
        await clienteService.update(editingCliente.id, formData);
      } else {
        // Create new
        await clienteService.create(formData);
      }

      setIsModalOpen(false);
      setEditingCliente(null);
      await loadClientes(); // Reload the list
    } catch (error) {
      setError(error.message);
      console.error('Erro ao salvar cliente:', error);
    } finally {
      setFormLoading(false);
    }
  };

  // Handle form cancel
  const handleFormCancel = () => {
    setIsModalOpen(false);
    setEditingCliente(null);
    setError('');
  };

  return (
    <div className="h-100 d-flex flex-column overflow-auto">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-shrink-0">
        <div>
          <h2 className="text-primary fw-bold mb-2">
            <i className="bi bi-people-fill me-3"></i>
            Gerenciar Clientes
          </h2>
          <p className="text-muted mb-0">
            Cadastre e gerencie os clientes do GuinchoLink
          </p>
        </div>
        <button 
          onClick={handleCreate}
          className="btn btn-primary btn-lg shadow"
        >
          <i className="bi bi-person-plus me-2"></i>
          Novo Cliente
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
        <div className="card-body d-flex flex-column flex-grow-1 p-4 overflow-auto client-list">
          <ClienteList
            clientes={clientes}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
          />
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleFormCancel}
        title={editingCliente ? 'Editar Cliente' : 'Novo Cliente'}
        size="lg"
      >
        <ClienteForm
          initialData={editingCliente}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          loading={formLoading}
        />
      </Modal>
    </div>
  );
};

export default Clientes;
