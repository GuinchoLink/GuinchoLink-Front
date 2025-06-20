import React, { useState } from 'react';
import ServicoForm from '../components/ServicoForm.jsx';
import { servicoService } from '../services/servicoService.js';

const Servicos = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');  const handleSubmit = async (servicoData) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await servicoService.create(servicoData);
      setSuccess('Serviço cadastrado com sucesso!');
      
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (error) {
      console.error('Erro ao cadastrar serviço:', error);
      setError(error.message || 'Erro ao cadastrar serviço');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setError('');
    setSuccess('');
  };

  return (
    <div className="h-100 d-flex flex-column overflow-auto">      <div className="d-flex justify-content-between align-items-center mb-4 flex-shrink-0">
        <div>
          <h2 className="text-primary fw-bold mb-2">
            <i className="bi bi-wrench-adjustable me-3"></i>
            Cadastrar Novo Serviço
          </h2>
          <p className="text-muted mb-0">
            Preencha os dados para cadastrar um novo serviço de guincho
          </p>
        </div>
      </div>      <div className="card shadow flex-grow-1 d-flex flex-column overflow-hidden">
        <div className="card-body overflow-auto">
          {error && (
            <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
              <button
                type="button"
                className="btn-close"
                onClick={() => setError('')}
              ></button>
            </div>
          )}

          {success && (
            <div className="alert alert-success alert-dismissible fade show mb-4" role="alert">
              <i className="bi bi-check-circle me-2"></i>
              {success}
              <button
                type="button"
                className="btn-close"
                onClick={() => setSuccess('')}
              ></button>
            </div>
          )}

          <ServicoForm
            onSubmit={handleSubmit}
            onCancel={handleClear}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default Servicos;
