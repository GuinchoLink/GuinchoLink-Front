import React, { useState, useEffect } from 'react';
import FuncionarioList from '../../components/usuarios/FuncionarioList';
import FuncionarioForm from '../../components/usuarios/FuncionarioForm';
import Modal from '../../components/common/Modal';
import { funcionarioService } from '../../services/funcionarioService';

const Funcionarios = () => {
  const [funcionarios, setFuncionarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFuncionario, setEditingFuncionario] = useState(null);
  const [error, setError] = useState('');

  // Load all funcionarios
  const loadFuncionarios = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await funcionarioService.getAll();
      setFuncionarios(data);
    } catch (error) {
      setError(error.message);
      console.error('Erro ao carregar funcionários:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadFuncionarios();
  }, []);

  // Handle create new funcionario
  const handleCreate = () => {
    setEditingFuncionario(null);
    setIsModalOpen(true);
  };

  // Handle edit funcionario
  const handleEdit = (funcionario) => {
    setEditingFuncionario(funcionario);
    setIsModalOpen(true);
  };

  // Handle delete funcionario
  const handleDelete = async (id) => {
    try {
      await funcionarioService.delete(id);
      await loadFuncionarios();
    } catch (error) {
      setError('Erro ao excluir funcionário: ' + error.message);
    }
  };

  // Handle form submission
  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      setError('');

      if (editingFuncionario) {
        await funcionarioService.update(editingFuncionario.id, formData);
      } else {
        await funcionarioService.create(formData);
      }

      setIsModalOpen(false);
      setEditingFuncionario(null);
      await loadFuncionarios();
    } catch (error) {
      setError(error.message);
    } finally {
      setFormLoading(false);
    }
  };

  // Handle form cancel
  const handleFormCancel = () => {
    setIsModalOpen(false);
    setEditingFuncionario(null);
  };

  return (
    <div className="h-100 d-flex flex-column">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-shrink-0">
        <div>
          <h2 className="text-primary fw-bold mb-2">
            <i className="bi bi-person-badge-fill me-3"></i>
            Gerenciar Funcionários
          </h2>
          <p className="text-muted mb-0">
            Cadastre e gerencie os funcionários da empresa
          </p>
        </div>
        <button 
          onClick={handleCreate}
          className="btn btn-primary btn-lg shadow"
        >
          <i className="bi bi-person-plus me-2"></i>
          Novo Funcionário
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
          <FuncionarioList
            funcionarios={funcionarios}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
          />
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleFormCancel}
        title={editingFuncionario ? 'Editar Funcionário' : 'Novo Funcionário'}
        size="lg"
      >
        <FuncionarioForm
          initialData={editingFuncionario}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          loading={formLoading}
        />
      </Modal>
    </div>
  );
};

export default Funcionarios;
