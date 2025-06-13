import React, { useState, useEffect } from 'react';

const VeiculoEmpresaForm = ({ initialData, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    placa: '',
    cor: '',
    modelo: '',
    tipo_de_veiculo_servico: '',
    status_veiculo: 'livre'
  });

  const [errors, setErrors] = useState({});

  // Opções para os campos ENUM
  const tiposVeiculo = [
    { value: 'moto', label: 'Moto' },
    { value: 'pickup', label: 'Pickup' },
    { value: 'caminhaoPrancha', label: 'Caminhão Prancha' },
    { value: 'carro', label: 'Carro' },
    { value: 'caminhaoLanca', label: 'Caminhão Lança' }
  ];

  const statusVeiculo = [
    { value: 'livre', label: 'Livre' },
    { value: 'emUso', label: 'Em Uso' },
    { value: 'manutencao', label: 'Manutenção' }
  ];

  // Preencher formulário quando há dados iniciais
  useEffect(() => {
    if (initialData) {
      setFormData({
        placa: initialData.placa || '',
        cor: initialData.cor || '',
        modelo: initialData.modelo || '',
        tipo_de_veiculo_servico: initialData.tipo_de_veiculo_servico || '',
        status_veiculo: initialData.status_veiculo || 'livre'
      });
    }
  }, [initialData]);

  // Validações
  const validateForm = () => {
    const newErrors = {};

    // Validar placa
    if (!formData.placa) {
      newErrors.placa = 'Placa é obrigatória';
    } else if (formData.placa.length !== 7) {
      newErrors.placa = 'Placa deve ter exatamente 7 caracteres';
    }

    // Validar cor
    if (!formData.cor) {
      newErrors.cor = 'Cor é obrigatória';
    } else if (formData.cor.length < 2 || formData.cor.length > 20) {
      newErrors.cor = 'Cor deve ter entre 2 e 20 caracteres';
    }

    // Validar modelo
    if (!formData.modelo) {
      newErrors.modelo = 'Modelo é obrigatório';
    } else if (formData.modelo.length < 2 || formData.modelo.length > 20) {
      newErrors.modelo = 'Modelo deve ter entre 2 e 20 caracteres';
    }

    // Validar tipo de veículo
    if (!formData.tipo_de_veiculo_servico) {
      newErrors.tipo_de_veiculo_servico = 'Tipo de veículo é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Tratar mudanças nos campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Formatar placa automaticamente
  const handlePlacaChange = (e) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (value.length > 7) {
      value = value.substr(0, 7);
    }
    
    setFormData(prev => ({
      ...prev,
      placa: value
    }));

    if (errors.placa) {
      setErrors(prev => ({
        ...prev,
        placa: ''
      }));
    }
  };

  // Enviar formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="container-fluid p-4">
      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* Placa */}
              <div className="col-md-6 mb-3">
                <label htmlFor="placa" className="form-label fw-semibold">
                  <i className="bi bi-card-text me-2 text-primary"></i>
                  Placa do Veículo *
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
                {errors.placa && (
                  <div className="invalid-feedback">
                    {errors.placa}
                  </div>
                )}
                <div className="form-text">
                  Digite a placa sem traços ou espaços (7 caracteres)
                </div>
              </div>

              {/* Tipo de Veículo */}
              <div className="col-md-6 mb-3">
                <label htmlFor="tipo_de_veiculo_servico" className="form-label fw-semibold">
                  <i className="bi bi-truck me-2 text-primary"></i>
                  Tipo de Veículo *
                </label>
                <select
                  className={`form-select ${errors.tipo_de_veiculo_servico ? 'is-invalid' : ''}`}
                  id="tipo_de_veiculo_servico"
                  name="tipo_de_veiculo_servico"
                  value={formData.tipo_de_veiculo_servico}
                  onChange={handleChange}
                >
                  <option value="">Selecione o tipo de veículo</option>
                  {tiposVeiculo.map(tipo => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </option>
                  ))}
                </select>
                {errors.tipo_de_veiculo_servico && (
                  <div className="invalid-feedback">
                    {errors.tipo_de_veiculo_servico}
                  </div>
                )}
              </div>
            </div>

            <div className="row">
              {/* Modelo */}
              <div className="col-md-6 mb-3">
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
                  placeholder="Ex: Ford F-250"
                  maxLength="20"
                />
                {errors.modelo && (
                  <div className="invalid-feedback">
                    {errors.modelo}
                  </div>
                )}
              </div>

              {/* Cor */}
              <div className="col-md-6 mb-3">
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
                  placeholder="Ex: Branco"
                  maxLength="20"
                />
                {errors.cor && (
                  <div className="invalid-feedback">
                    {errors.cor}
                  </div>
                )}
              </div>
            </div>

            <div className="row">
              {/* Status */}
              <div className="col-md-6 mb-4">
                <label htmlFor="status_veiculo" className="form-label fw-semibold">
                  <i className="bi bi-info-circle me-2 text-primary"></i>
                  Status do Veículo
                </label>
                <select
                  className="form-select"
                  id="status_veiculo"
                  name="status_veiculo"
                  value={formData.status_veiculo}
                  onChange={handleChange}
                >
                  {statusVeiculo.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Botões */}
            <div className="d-flex justify-content-end gap-3 mt-4 pt-3 border-top">
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
                    <i className="bi bi-check-lg me-2"></i>
                    {initialData ? 'Atualizar' : 'Cadastrar'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VeiculoEmpresaForm;
