import React, { useState, useEffect } from 'react';
import { clienteService } from '../services/clienteService.js';
import { funcionarioService } from '../services/funcionarioService.js';
import { tipoServicoService } from '../services/tipoServicoService.js';
import { veiculoClienteService } from '../services/veiculoClienteService.js';
import { veiculoEmpresaService } from '../services/veiculoEmpresaService.js';

const ServicoForm = ({ initialData, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    cliente_id: '',
    funcionario_id: '',
    tipo_servico_id: '',
    veiculo_cliente_id: '',
    veiculo_empresa_id: '',
    hora_solicitacao: '',
    descricao: '',
    localizacao: '',
    status: 'pendente'
  });

  const [errors, setErrors] = useState({});
  const [options, setOptions] = useState({
    clientes: [],
    funcionarios: [],
    tiposServico: [],
    veiculosCliente: [],
    veiculosEmpresa: []
  });
  const [loadingOptions, setLoadingOptions] = useState(true);

  // Load options data
  useEffect(() => {
    const loadOptions = async () => {
      try {
        setLoadingOptions(true);        const [clientes, funcionarios, tiposServico, veiculosCliente, veiculosEmpresa] = await Promise.all([
          clienteService.findAll(),
          funcionarioService.getAll(),
          tipoServicoService.findAll(),
          veiculoClienteService.findAll(),
          veiculoEmpresaService.findAll()
        ]);

        setOptions({
          clientes,
          funcionarios,
          tiposServico,
          veiculosCliente,
          veiculosEmpresa: veiculosEmpresa.filter(veiculo => veiculo.status_veiculo === 'livre')
        });
      } catch (error) {
        console.error('Erro ao carregar opções:', error);
      } finally {
        setLoadingOptions(false);
      }
    };

    loadOptions();
  }, []);

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      const data = {
        cliente_id: initialData.cliente_id || '',
        funcionario_id: initialData.funcionario_id || '',
        tipo_servico_id: initialData.tipo_servico_id || '',
        veiculo_cliente_id: initialData.veiculo_cliente_id || '',
        veiculo_empresa_id: initialData.veiculo_empresa_id || '',
        hora_solicitacao: initialData.hora_solicitacao ? new Date(initialData.hora_solicitacao).toISOString().slice(0, 16) : '',
        descricao: initialData.descricao || '',
        localizacao: initialData.localizacao || '',
        status: initialData.status || 'pendente'
      };
      setFormData(data);
    } else {
      setFormData({
        cliente_id: '',
        funcionario_id: '',
        tipo_servico_id: '',
        veiculo_cliente_id: '',
        veiculo_empresa_id: '',
        hora_solicitacao: '',
        descricao: '',
        localizacao: '',
        status: 'pendente'
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

  // Filter veículos do cliente baseado no cliente selecionado
  const getVeiculosCliente = () => {
    if (!formData.cliente_id) return [];
    return options.veiculosCliente.filter(veiculo => veiculo.cliente_id === parseInt(formData.cliente_id));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Cliente validation
    if (!formData.cliente_id) {
      newErrors.cliente_id = 'Cliente é obrigatório';
    }

    // Funcionário validation
    if (!formData.funcionario_id) {
      newErrors.funcionario_id = 'Funcionário é obrigatório';
    }

    // Tipo de serviço validation
    if (!formData.tipo_servico_id) {
      newErrors.tipo_servico_id = 'Tipo de serviço é obrigatório';
    }

    // Veículo do cliente validation
    if (!formData.veiculo_cliente_id) {
      newErrors.veiculo_cliente_id = 'Veículo do cliente é obrigatório';
    }

    // Veículo da empresa validation
    if (!formData.veiculo_empresa_id) {
      newErrors.veiculo_empresa_id = 'Veículo da empresa é obrigatório';
    }

    // Hora solicitação validation
    if (!formData.hora_solicitacao) {
      newErrors.hora_solicitacao = 'Data e hora de solicitação são obrigatórias';
    }

    // Descrição validation
    if (!formData.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
    } else if (formData.descricao.trim().length < 10 || formData.descricao.trim().length > 500) {
      newErrors.descricao = 'Descrição deve ter entre 10 e 500 caracteres';
    }

    // Localização validation
    if (!formData.localizacao.trim()) {
      newErrors.localizacao = 'Localização é obrigatória';
    } else if (formData.localizacao.trim().length < 5 || formData.localizacao.trim().length > 200) {
      newErrors.localizacao = 'Localização deve ter entre 5 e 200 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const submitData = {
        ...formData,
        cliente_id: parseInt(formData.cliente_id),
        funcionario_id: parseInt(formData.funcionario_id),
        tipo_servico_id: parseInt(formData.tipo_servico_id),
        veiculo_cliente_id: parseInt(formData.veiculo_cliente_id),
        veiculo_empresa_id: parseInt(formData.veiculo_empresa_id)
      };
      onSubmit(submitData);
    }
  };

  // Handle form clear
  const handleClear = () => {
    setFormData({
      cliente_id: '',
      funcionario_id: '',
      tipo_servico_id: '',
      veiculo_cliente_id: '',
      veiculo_empresa_id: '',
      hora_solicitacao: '',
      descricao: '',
      localizacao: '',
      status: 'pendente'
    });
    setErrors({});
    if (onCancel) onCancel();
  };

  if (loadingOptions) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-0">
      <form onSubmit={handleSubmit} className="needs-validation">
        <div className="row g-3">
          {/* Cliente */}
          <div className="col-md-6">
            <label htmlFor="cliente_id" className="form-label fw-semibold">
              <i className="bi bi-person me-2 text-primary"></i>
              Cliente *
            </label>
            <select
              className={`form-select ${errors.cliente_id ? 'is-invalid' : ''}`}
              id="cliente_id"
              name="cliente_id"
              value={formData.cliente_id}
              onChange={handleChange}
            >
              <option value="">Selecione um cliente</option>
              {options.clientes.map(cliente => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nome}
                </option>
              ))}
            </select>
            {errors.cliente_id && <div className="invalid-feedback">{errors.cliente_id}</div>}
          </div>

          {/* Funcionário */}
          <div className="col-md-6">
            <label htmlFor="funcionario_id" className="form-label fw-semibold">
              <i className="bi bi-person-badge me-2 text-primary"></i>
              Funcionário *
            </label>
            <select
              className={`form-select ${errors.funcionario_id ? 'is-invalid' : ''}`}
              id="funcionario_id"
              name="funcionario_id"
              value={formData.funcionario_id}
              onChange={handleChange}
            >
              <option value="">Selecione um funcionário</option>
              {options.funcionarios.map(funcionario => (
                <option key={funcionario.id} value={funcionario.id}>
                  {funcionario.nome}
                </option>
              ))}
            </select>
            {errors.funcionario_id && <div className="invalid-feedback">{errors.funcionario_id}</div>}
          </div>

          {/* Tipo de Serviço */}
          <div className="col-md-6">
            <label htmlFor="tipo_servico_id" className="form-label fw-semibold">
              <i className="bi bi-tools me-2 text-primary"></i>
              Tipo de Serviço *
            </label>
            <select
              className={`form-select ${errors.tipo_servico_id ? 'is-invalid' : ''}`}
              id="tipo_servico_id"
              name="tipo_servico_id"
              value={formData.tipo_servico_id}
              onChange={handleChange}
            >
              <option value="">Selecione um tipo de serviço</option>
              {options.tiposServico.map(tipo => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nome}
                </option>
              ))}
            </select>
            {errors.tipo_servico_id && <div className="invalid-feedback">{errors.tipo_servico_id}</div>}
          </div>

          {/* Veículo do Cliente */}
          <div className="col-md-6">
            <label htmlFor="veiculo_cliente_id" className="form-label fw-semibold">
              <i className="bi bi-car-front me-2 text-primary"></i>
              Veículo do Cliente *
            </label>
            <select
              className={`form-select ${errors.veiculo_cliente_id ? 'is-invalid' : ''}`}
              id="veiculo_cliente_id"
              name="veiculo_cliente_id"
              value={formData.veiculo_cliente_id}
              onChange={handleChange}
              disabled={!formData.cliente_id}
            >
              <option value="">
                {formData.cliente_id ? 'Selecione um veículo' : 'Primeiro selecione um cliente'}
              </option>
              {getVeiculosCliente().map(veiculo => (
                <option key={veiculo.id} value={veiculo.id}>
                  {veiculo.marca} {veiculo.modelo} - {veiculo.placa}
                </option>
              ))}
            </select>
            {errors.veiculo_cliente_id && <div className="invalid-feedback">{errors.veiculo_cliente_id}</div>}
          </div>

          {/* Veículo da Empresa */}
          <div className="col-md-6">
            <label htmlFor="veiculo_empresa_id" className="form-label fw-semibold">
              <i className="bi bi-truck me-2 text-primary"></i>
              Veículo da Empresa *
            </label>
            <select
              className={`form-select ${errors.veiculo_empresa_id ? 'is-invalid' : ''}`}
              id="veiculo_empresa_id"
              name="veiculo_empresa_id"
              value={formData.veiculo_empresa_id}
              onChange={handleChange}
            >
              <option value="">Selecione um veículo</option>
              {options.veiculosEmpresa.map(veiculo => (
                <option key={veiculo.id} value={veiculo.id}>
                  {veiculo.marca} {veiculo.modelo} - {veiculo.placa}
                </option>
              ))}
            </select>
            {errors.veiculo_empresa_id && <div className="invalid-feedback">{errors.veiculo_empresa_id}</div>}
          </div>

          {/* Data e Hora de Solicitação */}
          <div className="col-md-6">
            <label htmlFor="hora_solicitacao" className="form-label fw-semibold">
              <i className="bi bi-calendar-event me-2 text-primary"></i>
              Data e Hora de Solicitação *
            </label>
            <input
              type="datetime-local"
              className={`form-control ${errors.hora_solicitacao ? 'is-invalid' : ''}`}
              id="hora_solicitacao"
              name="hora_solicitacao"
              value={formData.hora_solicitacao}
              onChange={handleChange}
            />
            {errors.hora_solicitacao && <div className="invalid-feedback">{errors.hora_solicitacao}</div>}
          </div>

          {/* Status */}
          {initialData && (
            <div className="col-md-6">
              <label htmlFor="status" className="form-label fw-semibold">
                <i className="bi bi-flag me-2 text-primary"></i>
                Status
              </label>
              <select
                className="form-select"
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="pendente">Pendente</option>
                <option value="andamento">Em Andamento</option>
                <option value="finalizado">Finalizado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
          )}

          {/* Localização */}
          <div className="col-12">
            <label htmlFor="localizacao" className="form-label fw-semibold">
              <i className="bi bi-geo-alt me-2 text-primary"></i>
              Localização *
            </label>
            <input
              type="text"
              className={`form-control ${errors.localizacao ? 'is-invalid' : ''}`}
              id="localizacao"
              name="localizacao"
              value={formData.localizacao}
              onChange={handleChange}
              placeholder="Digite o endereço completo do local do serviço"
              maxLength="200"
            />
            {errors.localizacao && <div className="invalid-feedback">{errors.localizacao}</div>}
          </div>

          {/* Descrição */}
          <div className="col-12">
            <label htmlFor="descricao" className="form-label fw-semibold">
              <i className="bi bi-card-text me-2 text-primary"></i>
              Descrição do Serviço *
            </label>
            <textarea
              className={`form-control ${errors.descricao ? 'is-invalid' : ''}`}
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              placeholder="Descreva detalhadamente o serviço a ser realizado"
              maxLength="500"
              rows="4"
            />
            <div className="form-text">
              {formData.descricao.length}/500 caracteres
            </div>
            {errors.descricao && <div className="invalid-feedback">{errors.descricao}</div>}
          </div>
        </div>        <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
          <button
            type="button"
            className="btn btn-outline-secondary px-4"
            onClick={handleClear}
            disabled={loading}
          >
            <i className="bi bi-arrow-clockwise me-2"></i>
            Limpar Formulário
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
                <i className="bi bi-check-circle me-2"></i>
                {initialData ? 'Atualizar' : 'Cadastrar Serviço'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServicoForm;
