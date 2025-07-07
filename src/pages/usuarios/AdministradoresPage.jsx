import React, { useState, useEffect } from 'react';
import AdministradorList from '../../components/usuarios/AdministradorList';
import AdministradorForm from '../../components/usuarios/AdministradorForm';
import Modal from '../../components/common/Modal';
import { administradorService } from '../../services/administradorService';

const AdministradoresPage = () => {
  const [administradores, setAdministradores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdministrador, setEditingAdministrador] = useState(null);
  const [error, setError] = useState('');

  // Load all administradores
  const loadAdministradores = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await administradorService.getAll();
      setAdministradores(data);
    } catch (error) {
      setError(error.message);
      console.error('Erro ao carregar administradores:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadAdministradores();
  }, []);

  // Handle create new administrador
  const handleCreate = () => {
    setEditingAdministrador(null);
    setIsModalOpen(true);
  };

  // Handle edit administrador
  const handleEdit = (administrador) => {
    setEditingAdministrador(administrador);
    setIsModalOpen(true);
  };

  // Handle delete administrador
  const handleDelete = async (id) => {
    try {
      await administradorService.delete(id);
      await loadAdministradores();
    } catch (error) {
      setError('Erro ao excluir administrador: ' + error.message);
    }
  };

  // Handle form submission
  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      setError('');

      if (editingAdministrador) {
        await administradorService.update(editingAdministrador.id, formData);
      } else {
        await administradorService.create(formData);
      }

      setIsModalOpen(false);
      setEditingAdministrador(null);
      await loadAdministradores();
    } catch (error) {
      setError(error.message);
    } finally {
      setFormLoading(false);
    }
  };

  // Handle form cancel
  const handleFormCancel = () => {
    setIsModalOpen(false);
    setEditingAdministrador(null);
  };

  return (
    <div className="h-100 d-flex flex-column">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-shrink-0">
        <div>
          <h2 className="text-primary fw-bold mb-2">
            <i className="bi bi-person-fill-gear me-3"></i>
            Gerenciar Administradores
          </h2>
          <p className="text-muted mb-0">
            Cadastre e gerencie os administradores do sistema
          </p>
        </div>
        <button 
          onClick={handleCreate}
          className="btn btn-primary btn-lg shadow"
        >
          <i className="bi bi-person-plus me-2"></i>
          Novo Administrador
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
          <AdministradorList
            administradores={administradores}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
          />
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleFormCancel}
        title={editingAdministrador ? 'Editar Administrador' : 'Novo Administrador'}
        size="lg"
      >
        <AdministradorForm
          initialData={editingAdministrador}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          loading={formLoading}
        />
      </Modal>
    </div>
  );
};

export default AdministradoresPage;
