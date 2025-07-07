import React, { useState, useEffect } from 'react';

const ClienteForm = ({ initialData, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    nascimento: '',
    telefone: '',
    endereco: ''
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
        endereco: initialData.endereco || ''
      });
    } else {
      setFormData({
        nome: '',
        cpf: '',
        nascimento: '',
        telefone: '',
        endereco: ''
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

  // Format CPF input
  const handleCpfChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    
    setFormData(prev => ({
      ...prev,
      cpf: value
    }));
    
    if (errors.cpf) {
      setErrors(prev => ({
        ...prev,
        cpf: ''
      }));
    }
  };

  // Format phone input
  const handleTelefoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{2})(\d)/, '$1 $2');
    value = value.replace(/(\d{5})(\d)/, '$1-$2');
    
    setFormData(prev => ({
      ...prev,
      telefone: value
    }));
    
    if (errors.telefone) {
      setErrors(prev => ({
        ...prev,
        telefone: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Nome validation
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (formData.nome.trim().length < 2 || formData.nome.trim().length > 50) {
      newErrors.nome = 'Nome deve ter entre 2 e 50 caracteres';
    }

    // CPF validation
    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(formData.cpf)) {
      newErrors.cpf = 'CPF deve seguir o padrão NNN.NNN.NNN-NN';
    }

    // Nascimento validation
    if (!formData.nascimento.trim()) {
      newErrors.nascimento = 'Data de nascimento é obrigatória';
    }

    // Telefone validation
    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    } else if (!/^\d{2} \d{5}-\d{4}$/.test(formData.telefone)) {
      newErrors.telefone = 'Telefone deve seguir o padrão XX XXXXX-XXXX';
    }

    // Endereco validation
    if (!formData.endereco.trim()) {
      newErrors.endereco = 'Endereço é obrigatório';
    } else if (formData.endereco.trim().length < 2 || formData.endereco.trim().length > 50) {
      newErrors.endereco = 'Endereço deve ter entre 2 e 50 caracteres';
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
            <label htmlFor="nome" className="form-label fw-semibold">
              <i className="bi bi-person me-2 text-primary"></i>
              Nome Completo *
            </label>
            <input
              type="text"
              className={`form-control ${errors.nome ? 'is-invalid' : ''}`}
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Digite o nome completo"
              maxLength="50"
            />
            {errors.nome && <div className="invalid-feedback">{errors.nome}</div>}
          </div>

          <div className="col-md-6">
            <label htmlFor="cpf" className="form-label fw-semibold">
              <i className="bi bi-card-text me-2 text-primary"></i>
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
              maxLength="14"
            />
            {errors.cpf && <div className="invalid-feedback">{errors.cpf}</div>}
          </div>
        </div>

        <div className="row g-3 mt-2">
          <div className="col-md-6">
            <label htmlFor="nascimento" className="form-label fw-semibold">
              <i className="bi bi-calendar-date me-2 text-primary"></i>
              Data de Nascimento *
            </label>
            <input
              type="date"
              className={`form-control ${errors.nascimento ? 'is-invalid' : ''}`}
              id="nascimento"
              name="nascimento"
              value={formData.nascimento}
              onChange={handleChange}
            />
            {errors.nascimento && <div className="invalid-feedback">{errors.nascimento}</div>}
          </div>

          <div className="col-md-6">
            <label htmlFor="telefone" className="form-label fw-semibold">
              <i className="bi bi-telephone me-2 text-primary"></i>
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
              maxLength="13"
            />
            {errors.telefone && <div className="invalid-feedback">{errors.telefone}</div>}
          </div>
        </div>

        <div className="row g-3 mt-2">
          <div className="col-12">
            <label htmlFor="endereco" className="form-label fw-semibold">
              <i className="bi bi-geo-alt me-2 text-primary"></i>
              Endereço *
            </label>
            <input
              type="text"
              className={`form-control ${errors.endereco ? 'is-invalid' : ''}`}
              id="endereco"
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
              placeholder="Digite o endereço completo"
              maxLength="50"
            />
            {errors.endereco && <div className="invalid-feedback">{errors.endereco}</div>}
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

export default ClienteForm;
