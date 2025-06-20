import React, { useState } from 'react';
import FuncionarioList from '../components/FuncionarioList';
import FuncionarioForm from '../components/FuncionarioForm';
import Modal from '../components/Modal';

const FuncionariosPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFuncionario, setSelectedFuncionario] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAdd = () => {
    setSelectedFuncionario(null);
    setIsModalOpen(true);
  };

  const handleEdit = (funcionario) => {
    setSelectedFuncionario(funcionario);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    setIsModalOpen(false);
    setSelectedFuncionario(null);
    setRefreshKey(prev => prev + 1); // Força refresh da lista
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedFuncionario(null);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Gestão de Funcionários</h1>
        <p>Gerencie os funcionários da empresa</p>
      </div>

      <div className="page-content">
        <FuncionarioList
          key={refreshKey}
          onEdit={handleEdit}
          onAdd={handleAdd}
        />
      </div>

      {isModalOpen && (
        <Modal onClose={handleCancel}>
          <FuncionarioForm
            funcionario={selectedFuncionario}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </Modal>
      )}
    </div>
  );
};

export default FuncionariosPage;
