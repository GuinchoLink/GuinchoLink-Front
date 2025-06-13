import React, { useState, useEffect } from 'react';

const FuncionarioForm = ({ initialData, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    nascimento: '',
    telefone: '',
    endereco: '',
    cnh: '',
    categoria_cnh: ''
  });

  const [errors, setErrors] = useState({});

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        nome: initialData.nome || '',
        cpf: initialData.cpf || '',
        nascimento: initialData.nascimento || '',
        telefone: initialData.telefone || '',
        endereco: initialData.endereco || '',
        cnh: initialData.cnh || '',
        categoria_cnh: initialData.categoria_cnh || ''
      });
    } else {
      setFormData({
        nome: '',
        cpf: '',
        nascimento: '',
        telefone: '',
        endereco: '',
        cnh: '',
        categoria_cnh: ''
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

  // Format CPF as user types
  const handleCpfChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    
    setFormData(prev => ({ ...prev, cpf: value }));
    
    if (errors.cpf) {
      setErrors(prev => ({ ...prev, cpf: '' }));
    }
  };
  // Format telefone as user types
  const handleTelefoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{2})(\d)/, '$1 $2');
    value = value.replace(/(\d{5})(\d{1,4})$/, '$1-$2');
    
    setFormData(prev => ({ ...prev, telefone: value }));
    
    if (errors.telefone) {
      setErrors(prev => ({ ...prev, telefone: '' }));
    }
  };

  // Format CNH as user types (11 digits only)
  const handleCnhChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    // Limita a 11 dígitos
    value = value.substring(0, 11);
    
    setFormData(prev => ({ ...prev, cnh: value }));
    
    if (errors.cnh) {
      setErrors(prev => ({ ...prev, cnh: '' }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Nome validation
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (formData.nome.length < 2 || formData.nome.length > 50) {
      newErrors.nome = 'Nome deve ter entre 2 e 50 caracteres';
    }

    // CPF validation
    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(formData.cpf)) {
      newErrors.cpf = 'CPF deve estar no formato XXX.XXX.XXX-XX';
    }

    // Nascimento validation
    if (!formData.nascimento.trim()) {
      newErrors.nascimento = 'Data de nascimento é obrigatória';
    }

    // Telefone validation
    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    } else if (!/^\d{2} \d{5}-\d{4}$/.test(formData.telefone)) {
      newErrors.telefone = 'Telefone deve estar no formato XX XXXXX-XXXX';
    }

    // Endereco validation
    if (!formData.endereco.trim()) {
      newErrors.endereco = 'Endereço é obrigatório';
    }    // CNH validation
    if (!formData.cnh.trim()) {
      newErrors.cnh = 'CNH é obrigatória';
    } else if (formData.cnh.length !== 11) {
      newErrors.cnh = 'CNH deve ter exatamente 11 dígitos';
    }

    // Categoria CNH validation
    if (!formData.categoria_cnh.trim()) {
      newErrors.categoria_cnh = 'Categoria da CNH é obrigatória';
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

  const categoriasCNH = ['A', 'B', 'C', 'D', 'E', 'AB', 'AC', 'AD', 'AE'];

  return (
    <form onSubmit={handleSubmit} className="needs-validation" noValidate>
      <div className="row g-3">
        {/* Nome */}
        <div className="col-md-6">
          <label htmlFor="nome" className="form-label fw-semibold">
            <i className="bi bi-person me-1 text-primary"></i>
            Nome Completo *
          </label>
          <input
            type="text"
            className={`form-control ${errors.nome ? 'is-invalid' : ''}`}
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            maxLength={50}
            disabled={loading}
          />
          {errors.nome && (
            <div className="invalid-feedback">{errors.nome}</div>
          )}
        </div>

        {/* CPF */}
        <div className="col-md-6">
          <label htmlFor="cpf" className="form-label fw-semibold">
            <i className="bi bi-card-text me-1 text-primary"></i>
            CPF *
          </label>
          <input
            type="text"
            className={`form-control ${errors.cpf ? 'is-invalid' : ''}`}
            id="cpf"
            name="cpf"
            value={formData.cpf}
            onChange={handleCpfChange}
            placeholder="000.000.000-00"
            maxLength={14}
            disabled={loading}
          />
          {errors.cpf && (
            <div className="invalid-feedback">{errors.cpf}</div>
          )}
        </div>

        {/* Nascimento */}
        <div className="col-md-6">
          <label htmlFor="nascimento" className="form-label fw-semibold">
            <i className="bi bi-calendar-date me-1 text-primary"></i>
            Data de Nascimento *
          </label>
          <input
            type="date"
            className={`form-control ${errors.nascimento ? 'is-invalid' : ''}`}
            id="nascimento"
            name="nascimento"
            value={formData.nascimento}
            onChange={handleChange}
            disabled={loading}
          />
          {errors.nascimento && (
            <div className="invalid-feedback">{errors.nascimento}</div>
          )}
        </div>

        {/* Telefone */}
        <div className="col-md-6">
          <label htmlFor="telefone" className="form-label fw-semibold">
            <i className="bi bi-telephone me-1 text-primary"></i>
            Telefone *
          </label>
          <input
            type="text"
            className={`form-control ${errors.telefone ? 'is-invalid' : ''}`}
            id="telefone"
            name="telefone"
            value={formData.telefone}
            onChange={handleTelefoneChange}
            placeholder="11 99999-9999"
            maxLength={13}
            disabled={loading}
          />
          {errors.telefone && (
            <div className="invalid-feedback">{errors.telefone}</div>
          )}
        </div>

        {/* Endereço */}
        <div className="col-12">
          <label htmlFor="endereco" className="form-label fw-semibold">
            <i className="bi bi-geo-alt me-1 text-primary"></i>
            Endereço Completo *
          </label>
          <input
            type="text"
            className={`form-control ${errors.endereco ? 'is-invalid' : ''}`}
            id="endereco"
            name="endereco"
            value={formData.endereco}
            onChange={handleChange}
            placeholder="Ex: Rua das Flores, 123, Centro - São Paulo/SP"
            disabled={loading}
          />
          {errors.endereco && (
            <div className="invalid-feedback">{errors.endereco}</div>
          )}
        </div>        {/* CNH */}
        <div className="col-md-6">
          <label htmlFor="cnh" className="form-label fw-semibold">
            <i className="bi bi-credit-card me-1 text-primary"></i>
            Número da CNH *
          </label>
          <input
            type="text"
            className={`form-control ${errors.cnh ? 'is-invalid' : ''}`}
            id="cnh"
            name="cnh"
            value={formData.cnh}
            onChange={handleCnhChange}
            placeholder="Digite os 11 dígitos da CNH"
            maxLength={11}
            disabled={loading}
          />
          {errors.cnh && (
            <div className="invalid-feedback">{errors.cnh}</div>
          )}
          <div className="form-text">
            <i className="bi bi-info-circle me-1"></i>
            Digite apenas os 11 dígitos da CNH
          </div>
        </div>

        {/* Categoria CNH */}
        <div className="col-md-6">
          <label htmlFor="categoria_cnh" className="form-label fw-semibold">
            <i className="bi bi-award me-1 text-primary"></i>
            Categoria da CNH *
          </label>
          <select
            className={`form-select ${errors.categoria_cnh ? 'is-invalid' : ''}`}
            id="categoria_cnh"
            name="categoria_cnh"
            value={formData.categoria_cnh}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="">Selecione a categoria</option>
            {categoriasCNH.map(categoria => (
              <option key={categoria} value={categoria}>
                Categoria {categoria}
              </option>
            ))}
          </select>
          {errors.categoria_cnh && (
            <div className="invalid-feedback">{errors.categoria_cnh}</div>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="border-top pt-4 mt-4">
        <div className="d-flex gap-2 justify-content-end">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onCancel}
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
                <i className="bi bi-check-circle me-1"></i>
                {initialData ? 'Atualizar' : 'Cadastrar'}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default FuncionarioForm;
