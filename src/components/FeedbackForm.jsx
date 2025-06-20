import React, { useState, useEffect } from 'react';
import { feedbackService } from '../services/feedbackService.js';

const FeedbackForm = ({ initialData, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    nota: '',
    comentario: '',
    fim_servico_id: ''
  });

  const [errors, setErrors] = useState({});
  const [fimServicos, setFimServicos] = useState([]);
  const [loadingFimServicos, setLoadingFimServicos] = useState(true);

  // Notas disponíveis (1 a 5)
  const notasDisponiveis = [
    { value: 1, label: '1 - Péssimo', icon: '😠', color: 'danger' },
    { value: 2, label: '2 - Ruim', icon: '😞', color: 'warning' },
    { value: 3, label: '3 - Regular', icon: '😐', color: 'secondary' },
    { value: 4, label: '4 - Bom', icon: '😊', color: 'info' },
    { value: 5, label: '5 - Excelente', icon: '😍', color: 'success' }
  ];

  // Load fim servicos for dropdown
  useEffect(() => {
    const loadFimServicos = async () => {
      try {
        const data = await feedbackService.findAllFimServicos();
        setFimServicos(data);
      } catch (error) {
        console.error('Erro ao carregar serviços finalizados:', error);
      } finally {
        setLoadingFimServicos(false);
      }
    };

    loadFimServicos();
  }, []);

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        nota: initialData.nota || '',
        comentario: initialData.comentario || '',
        fim_servico_id: initialData.fim_servico_id || ''
      });
    } else {
      setFormData({
        nota: '',
        comentario: '',
        fim_servico_id: ''
      });
    }
    setErrors({});
  }, [initialData]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.nota) {
      newErrors.nota = 'Nota é obrigatória';
    } else if (formData.nota < 1 || formData.nota > 5) {
      newErrors.nota = 'Nota deve ser entre 1 e 5';
    }

    if (formData.comentario && formData.comentario.length > 255) {
      newErrors.comentario = 'Comentário deve ter no máximo 255 caracteres';
    }

    if (!formData.fim_servico_id) {
      newErrors.fim_servico_id = 'Serviço finalizado é obrigatório';
    }

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const submitData = {
        ...formData,
        nota: parseInt(formData.nota),
        fim_servico_id: parseInt(formData.fim_servico_id)
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error('Erro no formulário:', error);
      
      // Parse backend validation errors
      const errorMessage = error.message;
      
      // Try to map backend errors to form fields
      if (errorMessage.includes('Nota') || errorMessage.includes('nota')) {
        setErrors(prev => ({ ...prev, nota: errorMessage }));
      } else if (errorMessage.includes('Comentário') || errorMessage.includes('comentario')) {
        setErrors(prev => ({ ...prev, comentario: errorMessage }));
      } else if (errorMessage.includes('serviço') || errorMessage.includes('finalizado')) {
        setErrors(prev => ({ ...prev, fim_servico_id: errorMessage }));
      } else {
        // Generic error
        setErrors({ submit: errorMessage });
      }
    }
  };

  // Get nota display info
  const getNotaInfo = (nota) => {
    const notaInfo = notasDisponiveis.find(n => n.value === parseInt(nota));
    return notaInfo || { icon: '❓', color: 'secondary' };
  };

  return (
    <div className="container-fluid">
      <form onSubmit={handleSubmit}>
        {errors.submit && (
          <div className="alert alert-danger mb-3" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {errors.submit}
          </div>
        )}

        <div className="row g-3">
          {/* Nota */}
          <div className="col-md-6">
            <label htmlFor="nota" className="form-label fw-semibold">
              <i className="bi bi-star-fill text-warning me-2"></i>
              Nota *
            </label>
            <select
              className={`form-select ${errors.nota ? 'is-invalid' : ''}`}
              id="nota"
              name="nota"
              value={formData.nota}
              onChange={handleChange}
              required
            >
              <option value="">Selecione uma nota</option>
              {notasDisponiveis.map((nota) => (
                <option key={nota.value} value={nota.value}>
                  {nota.icon} {nota.label}
                </option>
              ))}
            </select>
            {errors.nota && (
              <div className="invalid-feedback">
                {errors.nota}
              </div>
            )}
            {formData.nota && (
              <div className="form-text">
                <span className={`badge bg-${getNotaInfo(formData.nota).color} fs-6`}>
                  {getNotaInfo(formData.nota).icon} Nota selecionada: {formData.nota}
                </span>
              </div>
            )}
          </div>

          {/* Serviço Finalizado */}
          <div className="col-md-6">
            <label htmlFor="fim_servico_id" className="form-label fw-semibold">
              <i className="bi bi-check-circle text-success me-2"></i>
              Serviço Finalizado *
            </label>
            <select
              className={`form-select ${errors.fim_servico_id ? 'is-invalid' : ''}`}
              id="fim_servico_id"
              name="fim_servico_id"
              value={formData.fim_servico_id}
              onChange={handleChange}
              disabled={loadingFimServicos}
              required
            >
              <option value="">
                {loadingFimServicos ? 'Carregando serviços...' : 'Selecione um serviço finalizado'}
              </option>
              {fimServicos.map((fimServico) => (
                <option key={fimServico.id} value={fimServico.id}>
                  ID: {fimServico.id} - {fimServico.servico?.cliente?.nome || 'Cliente não identificado'} -
                  ({new Date(fimServico.hora_finalizacao).toLocaleDateString('pt-BR')})
                </option>
              ))}
            </select>
            {errors.fim_servico_id && (
              <div className="invalid-feedback">
                {errors.fim_servico_id}
              </div>
            )}
          </div>

          {/* Comentário */}
          <div className="col-12">
            <label htmlFor="comentario" className="form-label fw-semibold">
              <i className="bi bi-chat-text text-info me-2"></i>
              Comentário (Opcional)
            </label>
            <textarea
              className={`form-control ${errors.comentario ? 'is-invalid' : ''}`}
              id="comentario"
              name="comentario"
              value={formData.comentario}
              onChange={handleChange}
              rows="4"
              maxLength="255"
              placeholder="Deixe seu comentário sobre o serviço prestado..."
            />
            {errors.comentario && (
              <div className="invalid-feedback">
                {errors.comentario}
              </div>
            )}
            <div className="form-text">
              {formData.comentario.length}/255 caracteres
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="row mt-4 pt-3 border-top">
          <div className="col-12 d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary px-4"
              onClick={onCancel}
              disabled={loading}
            >
              <i className="bi bi-x-lg me-2"></i>
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary px-4"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Salvando...
                </>
              ) : (
                <>
                  <i className="bi bi-check-lg me-2"></i>
                  {initialData ? 'Atualizar' : 'Cadastrar'}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;
