import React, { useState, useEffect } from 'react';

const AdministradorForm = ({ initialData, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    nascimento: '',
    login: '',
    senha: ''
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        nome: initialData.nome || '',
        cpf: initialData.cpf || '',
        nascimento: initialData.nascimento || '',
        login: initialData.login || '',
        senha: initialData.senha || ''
      });
    } else {
      setFormData({
        nome: '',
        cpf: '',
        nascimento: '',
        login: '',
        senha: ''
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

    // Login validation
    if (!formData.login.trim()) {
      newErrors.login = 'Login é obrigatório';
    }

    // Senha validation
    if (!formData.senha.trim()) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (!/^(?=.*[0-9]).+$/.test(formData.senha)) {
      newErrors.senha = 'Senha deve conter pelo menos um número';
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

        {/* Login */}
        <div className="col-md-6">
          <label htmlFor="login" className="form-label fw-semibold">
            <i className="bi bi-person-circle me-1 text-primary"></i>
            Login de Acesso *
          </label>
          <input
            type="text"
            className={`form-control ${errors.login ? 'is-invalid' : ''}`}
            id="login"
            name="login"
            value={formData.login}
            onChange={handleChange}
            placeholder="Digite o login de acesso"
            disabled={loading}
          />
          {errors.login && (
            <div className="invalid-feedback">{errors.login}</div>
          )}
        </div>

        {/* Senha */}
        <div className="col-12">
          <label htmlFor="senha" className="form-label fw-semibold">
            <i className="bi bi-shield-lock me-1 text-primary"></i>
            Senha *
          </label>
          <div className="input-group">
            <input
              type={showPassword ? 'text' : 'password'}
              className={`form-control ${errors.senha ? 'is-invalid' : ''}`}
              id="senha"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              placeholder="Digite a senha"
              disabled={loading}
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
            </button>
            {errors.senha && (
              <div className="invalid-feedback">{errors.senha}</div>
            )}
          </div>
          <div className="form-text">
            <i className="bi bi-info-circle me-1"></i>
            A senha deve conter pelo menos um número
          </div>
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

export default AdministradorForm;
