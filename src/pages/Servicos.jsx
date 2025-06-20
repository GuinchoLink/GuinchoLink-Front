import React, { useState } from 'react';
import ServicoForm from '../components/ServicoForm.jsx';
import { servicoService } from '../services/servicoService.js';
import { FormattedAlert, formatBusinessRuleError } from '../utils/errorHandler.jsx';

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
      const errorInfo = formatBusinessRuleError(error.message || 'Erro ao cadastrar serviço');
      setError(errorInfo.message);
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
            <div className={`alert alert-dismissible fade show mb-4 ${
              error.includes('Limite Diário Atingido') ? 'alert-warning' :
              error.includes('Funcionário Indisponível') ? 'alert-info' :
              error.includes('Dados Inválidos') ? 'alert-secondary' :
              error.includes('Erro de Conexão') ? 'alert-dark' :
              'alert-danger'
            }`} role="alert">
              <div className="d-flex align-items-start">
                <div className="me-3 mt-1">
                  {error.includes('Limite Diário Atingido') && <i className="bi bi-calendar-x fs-4 text-warning"></i>}
                  {error.includes('Funcionário Indisponível') && <i className="bi bi-person-x fs-4 text-info"></i>}
                  {error.includes('Dados Inválidos') && <i className="bi bi-exclamation-circle fs-4 text-secondary"></i>}
                  {error.includes('Erro de Conexão') && <i className="bi bi-wifi-off fs-4 text-dark"></i>}
                  {!error.includes('Limite Diário') && !error.includes('Funcionário Indisponível') && 
                   !error.includes('Dados Inválidos') && !error.includes('Erro de Conexão') && 
                   <i className="bi bi-exclamation-triangle fs-4 text-danger"></i>}
                </div>
                <div className="flex-grow-1">
                  <strong className="d-block mb-1">
                    {error.includes('Limite Diário Atingido') && 'Regra de Negócio - Limite Diário'}
                    {error.includes('Funcionário Indisponível') && 'Regra de Negócio - Funcionário Ocupado'}
                    {error.includes('Dados Inválidos') && 'Erro de Validação'}
                    {error.includes('Erro de Conexão') && 'Problema de Conectividade'}
                    {!error.includes('Limite Diário') && !error.includes('Funcionário Indisponível') && 
                     !error.includes('Dados Inválidos') && !error.includes('Erro de Conexão') && 'Erro no Sistema'}
                  </strong>
                  <div>{error}</div>
                </div>
              </div>
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
