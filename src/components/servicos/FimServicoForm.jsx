import React, { useState, useEffect } from 'react';
import { servicoService } from '../../services/servicoService';

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
  const [servicos, setServicos] = useState([]);
  const [loadingServicos, setLoadingServicos] = useState(true);

  // Carregar serviços disponíveis
  useEffect(() => {
    const loadServicos = async () => {
      try {
        setLoadingServicos(true);
        const data = await servicoService.findAll();
        
        // Filtrar apenas serviços com status "pendente"
        const servicosPendentes = data.filter(servico => servico.status === 'pendente');
        setServicos(servicosPendentes);
      } catch (error) {
        console.error('Erro ao carregar serviços:', error);
        setBackendError('Erro ao carregar lista de serviços');
      } finally {
        setLoadingServicos(false);
      }
    };

    loadServicos();
  }, []);

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

    if (!formData.servico_id) {
      newErrors.servico_id = 'Selecione um serviço';
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
      <style>
        {`
          input[type="datetime-local"]::-webkit-calendar-picker-indicator {
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='%23212529' d='M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v1h14V3a1 1 0 0 0-1-1H2zm13 3H1v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V5z'/%3e%3c/svg%3e");
            background-color: transparent;
            background-repeat: no-repeat;
            background-position: center;
            background-size: 16px;
            width: 20px;
            height: 20px;
            cursor: pointer;
            border: 1px solid #ced4da;
            border-radius: 4px;
            padding: 2px;
          }
          
          input[type="datetime-local"]::-webkit-calendar-picker-indicator:hover {
            background-color: #f8f9fa;
            border-color: #86b7fe;
          }
          
          input[type="datetime-local"] {
            color-scheme: light;
          }
        `}
      </style>
      
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
          {/* Seleção do Serviço */}
          <div className="col-md-6 mb-3">
            <label htmlFor="servico_id" className="form-label fw-bold">
              <i className="bi bi-gear me-2 text-primary"></i>
              Serviço *
            </label>
            {loadingServicos ? (
              <div className="form-control d-flex align-items-center">
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Carregando serviços...
              </div>
            ) : (
              <select
                className={`form-select ${errors.servico_id ? 'is-invalid' : ''}`}
                id="servico_id"
                name="servico_id"
                value={formData.servico_id}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="">
                  {servicos.length === 0 ? 'Nenhum serviço pendente encontrado' : 'Selecione um serviço pendente'}
                </option>
                {servicos.map((servico) => (
                  <option key={servico.id} value={servico.id}>
                    #{servico.id} - {servico.cliente?.nome} | {servico.funcionario?.nome} | {servico.tipo_servico?.nome}
                  </option>
                ))}
              </select>
            )}
            {errors.servico_id && (
              <div className="invalid-feedback">
                <i className="bi bi-exclamation-circle me-1"></i>
                {errors.servico_id}
              </div>
            )}
            {formData.servico_id && (
              <div className="form-text">
                <small className="text-muted">
                  <i className="bi bi-info-circle me-1"></i>
                  {(() => {
                    const servicoSelecionado = servicos.find(s => s.id === parseInt(formData.servico_id));
                    return servicoSelecionado ? 
                      `Status: ${servicoSelecionado.status} | Local: ${servicoSelecionado.localizacao}` : 
                      '';
                  })()}
                </small>
              </div>
            )}
            {!loadingServicos && servicos.length === 0 && (
              <div className="form-text">
                <small className="text-warning">
                  <i className="bi bi-exclamation-triangle me-1"></i>
                  Não há serviços pendentes disponíveis para finalização no momento.
                </small>
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
