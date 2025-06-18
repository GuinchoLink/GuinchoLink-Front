import React, { useState } from 'react';

// Função para formatar data/hora no padrão "YYYY-MM-DDTHH:mm" com fuso local
const formatDateToLocalInput = (date) => {
  const pad = (n) => n.toString().padStart(2, '0');
  const d = new Date(date);
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const FimServicoForm = ({ initialData, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    servico_id: initialData?.servico_id || '',
    hora_finalizacao: initialData?.hora_finalizacao
      ? formatDateToLocalInput(initialData.hora_finalizacao)
      : formatDateToLocalInput(new Date()),
    descricao_fim: initialData?.descricao_fim || '',
    valor_total: initialData?.valor_total || ''
  });

  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Limpar erros quando o usuário digita
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }

    // Limpar erro do backend quando o usuário faz alterações
    if (backendError) {
      setBackendError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.servico_id.trim()) {
      newErrors.servico_id = 'ID do serviço é obrigatório';
    }

    if (!formData.hora_finalizacao) {
      newErrors.hora_finalizacao = 'Hora de finalização é obrigatória';
    }

    if (!formData.valor_total || isNaN(formData.valor_total) || parseFloat(formData.valor_total) < 0) {
      newErrors.valor_total = 'Valor total deve ser um número válido maior ou igual a 0';
    }

    // Tornar descrição obrigatória
    if (!formData.descricao_fim || !formData.descricao_fim.trim()) {
      newErrors.descricao_fim = 'A descrição de finalização não pode estar vazia!';
    } else if (formData.descricao_fim.length > 255) {
      newErrors.descricao_fim = 'Descrição deve ter no máximo 255 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBackendError(''); // Limpar erro anterior

    if (validateForm()) {
      const submitData = {
        servico_id: parseInt(formData.servico_id),
        valor_total: parseFloat(formData.valor_total),
        hora_finalizacao: new Date(formData.hora_finalizacao).toISOString(),
        descricao_fim: formData.descricao_fim.trim(),
        on_sale: formData.on_sale
      };

      console.log('Dados enviados para o backend:', submitData);

      try {
        await onSubmit(submitData);
      } catch (error) {
        // Capturar erros do backend
        console.error('Erro ao enviar formulário:', error);
        setBackendError(error.message || 'Erro ao salvar dados. Tente novamente.');
      }
    }
  };

  return (
    <div className="container-fluid">
      {/* Exibir erro do backend */}
      {backendError && (
        <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <strong>Erro:</strong> {backendError}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setBackendError('')}
            aria-label="Fechar"
          ></button>
        </div>
      )}
      
      <form onSubmit={handleSubmit} noValidate>
        <div className="row">
          {/* ID do Serviço */}
          <div className="col-md-6 mb-3">
            <label htmlFor="servico_id" className="form-label fw-bold">
              <i className="bi bi-hash me-2 text-primary"></i>
              ID do Serviço *
            </label>
            <input
              type="number"
              className={`form-control ${errors.servico_id ? 'is-invalid' : ''}`}
              id="servico_id"
              name="servico_id"
              value={formData.servico_id}
              onChange={handleChange}
              placeholder="Digite o ID do serviço"
              disabled={loading}
            />
            {errors.servico_id && (
              <div className="invalid-feedback">
                <i className="bi bi-exclamation-circle me-1"></i>
                {errors.servico_id}
              </div>
            )}
          </div>

          {/* Hora de Finalização */}
          <div className="col-md-6 mb-3">
            <label htmlFor="hora_finalizacao" className="form-label fw-bold">
              <i className="bi bi-clock me-2 text-primary"></i>
              Hora de Finalização *
            </label>
            <input
              type="datetime-local"
              className={`form-control ${errors.hora_finalizacao ? 'is-invalid' : ''}`}
              id="hora_finalizacao"
              name="hora_finalizacao"
              value={formData.hora_finalizacao}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.hora_finalizacao && (
              <div className="invalid-feedback">
                <i className="bi bi-exclamation-circle me-1"></i>
                {errors.hora_finalizacao}
              </div>
            )}
          </div>

          {/* Valor Total */}
          <div className="col-md-6 mb-3">
            <label htmlFor="valor_total" className="form-label fw-bold">
              <i className="bi bi-currency-dollar me-2 text-primary"></i>
              Valor Total *
            </label>
            <div className="input-group">
              <span className="input-group-text">R$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                className={`form-control ${errors.valor_total ? 'is-invalid' : ''}`}
                id="valor_total"
                name="valor_total"
                value={formData.valor_total}
                onChange={handleChange}
                placeholder="0,00"
                disabled={loading}
              />
              {errors.valor_total && (
                <div className="invalid-feedback">
                  <i className="bi bi-exclamation-circle me-1"></i>
                  {errors.valor_total}
                </div>
              )}
            </div>
          </div>

          {/* Descrição */}
          <div className="col-12 mb-4">
            <label htmlFor="descricao_fim" className="form-label fw-bold">
              <i className="bi bi-file-text me-2 text-primary"></i>
              Descrição do Fim do Serviço *
            </label>
            <textarea
              className={`form-control ${errors.descricao_fim ? 'is-invalid' : ''}`}
              id="descricao_fim"
              name="descricao_fim"
              rows="4"
              value={formData.descricao_fim}
              onChange={handleChange}
              placeholder="Descreva detalhes sobre a finalização do serviço"
              disabled={loading}
              maxLength="255"
              required
            />
            <div className="form-text">
              {formData.descricao_fim.length}/255 caracteres
            </div>
            {errors.descricao_fim && (
              <div className="invalid-feedback">
                <i className="bi bi-exclamation-circle me-1"></i>
                {errors.descricao_fim}
              </div>
            )}
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-end gap-3 pt-3 border-top">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onCancel}
                disabled={loading}
              >
                <i className="bi bi-x-circle me-2"></i>
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Salvando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    {initialData ? 'Atualizar' : 'Salvar'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FimServicoForm;
