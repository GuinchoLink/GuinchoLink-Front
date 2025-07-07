import React, { useState, useEffect } from 'react';

const TipoServicoForm = ({ 
  initialData = null, 
  onSubmit, 
  onCancel, 
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    valor_hora: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        nome: initialData.nome || '',
        descricao: initialData.descricao || '',
        valor_hora: initialData.valor_hora || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (formData.nome.length < 3 || formData.nome.length > 100) {
      newErrors.nome = 'Nome deve ter entre 3 e 100 caracteres';
    }

    if (!formData.valor_hora) {
      newErrors.valor_hora = 'Valor por hora é obrigatório';
    } else if (isNaN(formData.valor_hora) || parseFloat(formData.valor_hora) < 0) {
      newErrors.valor_hora = 'Valor por hora deve ser um número maior ou igual a 0';
    }

    if (formData.descricao.length > 100) {
      newErrors.descricao = 'Descrição deve ter no máximo 100 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const dataToSubmit = {
        ...formData,
        valor_hora: parseFloat(formData.valor_hora)
      };
      onSubmit(dataToSubmit);
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nome" className="form-label fw-semibold">
            Nome <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            className={`form-control ${errors.nome ? 'is-invalid' : ''}`}
            placeholder="Digite o nome do tipo de serviço"
            disabled={loading}
          />
          {errors.nome && <div className="invalid-feedback">{errors.nome}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="valor_hora" className="form-label fw-semibold">
            Valor por Hora (R$) <span className="text-danger">*</span>
          </label>
          <div className="input-group">
            <span className="input-group-text">R$</span>
            <input
              type="number"
              id="valor_hora"
              name="valor_hora"
              value={formData.valor_hora}
              onChange={handleChange}
              className={`form-control ${errors.valor_hora ? 'is-invalid' : ''}`}
              placeholder="0,00"
              step="0.01"
              min="0"
              disabled={loading}
            />
            {errors.valor_hora && <div className="invalid-feedback">{errors.valor_hora}</div>}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="descricao" className="form-label fw-semibold">
            Descrição
          </label>
          <textarea
            id="descricao"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            className={`form-control ${errors.descricao ? 'is-invalid' : ''}`}
            placeholder="Digite uma descrição (opcional)"
            rows="3"
            disabled={loading}
          />
          {errors.descricao && <div className="invalid-feedback">{errors.descricao}</div>}
        </div>

        <div className="d-flex justify-content-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
            disabled={loading}
          >
            <i className="bi bi-x-circle me-1"></i>
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Salvando...
              </>
            ) : (
              <>
                <i className={`bi ${initialData ? 'bi-check-circle' : 'bi-plus-circle'} me-1`}></i>
                {initialData ? 'Atualizar' : 'Criar'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TipoServicoForm;
