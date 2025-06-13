import React, { useState, useEffect } from 'react';
import { clienteService } from '../services/clienteService';

const VeiculoClienteForm = ({ initialData, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    placa: '',
    cor: '',
    modelo: '',
    tipoDeVeiculo: '',
    cliente_id: ''
  });

  const [errors, setErrors] = useState({});
  const [clientes, setClientes] = useState([]);
  const [loadingClientes, setLoadingClientes] = useState(false);

  // Vehicle types based on the backend model
  const tiposVeiculo = [
    { value: 'moto', label: 'Moto' },
    { value: 'carro', label: 'Carro' },
    { value: 'caminhao', label: 'Caminhão' },
    { value: 'pickup', label: 'Pickup' },
    { value: 'carreta', label: 'Carreta' },
    { value: 'trator', label: 'Trator' },
    { value: 'onibus', label: 'Ônibus' },
    { value: 'van', label: 'Van' },
    { value: 'outro', label: 'Outro' }
  ];

  // Load clients on component mount
  useEffect(() => {
    loadClientes();
  }, []);

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        placa: initialData.placa || '',
        cor: initialData.cor || '',
        modelo: initialData.modelo || '',
        tipoDeVeiculo: initialData.tipoDeVeiculo || '',
        cliente_id: initialData.cliente_id || ''
      });
    } else {
      setFormData({
        placa: '',
        cor: '',
        modelo: '',
        tipoDeVeiculo: '',
        cliente_id: ''
      });
    }
    setErrors({});
  }, [initialData]);

  // Load clients list
  const loadClientes = async () => {
    try {
      setLoadingClientes(true);
      const data = await clienteService.findAll();
      setClientes(data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    } finally {
      setLoadingClientes(false);
    }
  };

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

  // Format license plate input
  const handlePlacaChange = (e) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    // Format: ABC1234 or ABC1D23
    if (value.length <= 7) {
      setFormData(prev => ({
        ...prev,
        placa: value
      }));
    }
    
    if (errors.placa) {
      setErrors(prev => ({
        ...prev,
        placa: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Placa validation
    if (!formData.placa.trim()) {
      newErrors.placa = 'Placa é obrigatória';
    } else if (formData.placa.length !== 7) {
      newErrors.placa = 'Placa deve ter exatamente 7 caracteres';
    }

    // Cor validation
    if (!formData.cor.trim()) {
      newErrors.cor = 'Cor é obrigatória';
    } else if (formData.cor.trim().length < 2 || formData.cor.trim().length > 20) {
      newErrors.cor = 'Cor deve ter entre 2 e 20 caracteres';
    }

    // Modelo validation
    if (!formData.modelo.trim()) {
      newErrors.modelo = 'Modelo é obrigatório';
    } else if (formData.modelo.trim().length < 2 || formData.modelo.trim().length > 20) {
      newErrors.modelo = 'Modelo deve ter entre 2 e 20 caracteres';
    }

    // Tipo de veículo validation
    if (!formData.tipoDeVeiculo) {
      newErrors.tipoDeVeiculo = 'Tipo de veículo é obrigatório';
    }

    // Cliente validation
    if (!formData.cliente_id) {
      newErrors.cliente_id = 'Cliente é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="container-fluid px-0">
      <form onSubmit={handleSubmit} className="needs-validation">
        <div className="row g-3">
          <div className="col-md-6">
            <label htmlFor="placa" className="form-label fw-semibold">
              <i className="bi bi-tag me-2 text-primary"></i>
              Placa *
            </label>
            <input
              type="text"
              className={`form-control ${errors.placa ? 'is-invalid' : ''}`}
              id="placa"
              name="placa"
              value={formData.placa}
              onChange={handlePlacaChange}
              placeholder="ABC1234"
              maxLength="7"
              style={{ textTransform: 'uppercase' }}
            />
            {errors.placa && <div className="invalid-feedback">{errors.placa}</div>}
          </div>

          <div className="col-md-6">
            <label htmlFor="tipoDeVeiculo" className="form-label fw-semibold">
              <i className="bi bi-truck me-2 text-primary"></i>
              Tipo de Veículo *
            </label>
            <select
              className={`form-select ${errors.tipoDeVeiculo ? 'is-invalid' : ''}`}
              id="tipoDeVeiculo"
              name="tipoDeVeiculo"
              value={formData.tipoDeVeiculo}
              onChange={handleChange}
            >
              <option value="">Selecione o tipo</option>
              {tiposVeiculo.map(tipo => (
                <option key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </option>
              ))}
            </select>
            {errors.tipoDeVeiculo && <div className="invalid-feedback">{errors.tipoDeVeiculo}</div>}
          </div>
        </div>

        <div className="row g-3 mt-2">
          <div className="col-md-6">
            <label htmlFor="modelo" className="form-label fw-semibold">
              <i className="bi bi-car-front me-2 text-primary"></i>
              Modelo *
            </label>
            <input
              type="text"
              className={`form-control ${errors.modelo ? 'is-invalid' : ''}`}
              id="modelo"
              name="modelo"
              value={formData.modelo}
              onChange={handleChange}
              placeholder="Ex: Civic, Corolla, CB600"
              maxLength="20"
            />
            {errors.modelo && <div className="invalid-feedback">{errors.modelo}</div>}
          </div>

          <div className="col-md-6">
            <label htmlFor="cor" className="form-label fw-semibold">
              <i className="bi bi-palette me-2 text-primary"></i>
              Cor *
            </label>
            <input
              type="text"
              className={`form-control ${errors.cor ? 'is-invalid' : ''}`}
              id="cor"
              name="cor"
              value={formData.cor}
              onChange={handleChange}
              placeholder="Ex: Branco, Preto, Azul"
              maxLength="20"
            />
            {errors.cor && <div className="invalid-feedback">{errors.cor}</div>}
          </div>
        </div>

        <div className="row g-3 mt-2">
          <div className="col-12">
            <label htmlFor="cliente_id" className="form-label fw-semibold">
              <i className="bi bi-person me-2 text-primary"></i>
              Cliente Proprietário *
            </label>
            <select
              className={`form-select ${errors.cliente_id ? 'is-invalid' : ''}`}
              id="cliente_id"
              name="cliente_id"
              value={formData.cliente_id}
              onChange={handleChange}
              disabled={loadingClientes}
            >
              <option value="">
                {loadingClientes ? 'Carregando clientes...' : 'Selecione o cliente'}
              </option>
              {clientes.map(cliente => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nome} - {cliente.cpf}
                </option>
              ))}
            </select>
            {errors.cliente_id && <div className="invalid-feedback">{errors.cliente_id}</div>}
          </div>
        </div>

        <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
          <button
            type="button"
            className="btn btn-outline-secondary px-4"
            onClick={onCancel}
            disabled={loading}
          >
            <i className="bi bi-x-circle me-2"></i>
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
                <i className="bi bi-check-circle me-2"></i>
                {initialData ? 'Atualizar' : 'Salvar'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VeiculoClienteForm;