import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    login: '',
    senha: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Tentando fazer login...'); // Debug
      const result = await login(formData.login, formData.senha);
      console.log('Resultado do login:', result); // Debug
      
      if (result.success) {
        console.log('Login bem-sucedido, redirecionando para dashboard...'); // Debug
        navigate('/dashboard');
      } else {
        console.log('Login falhou:', result.message); // Debug
        setError(result.message);
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error); // Debug
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page d-flex align-items-center justify-content-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card login-card shadow">
              <div className="card-body">
                <div className="text-center mb-4">
                  <img 
                    src="/GuinchoLink-Front/guincho.png" 
                    alt="GuinchoLink" 
                    className="login-logo mb-3"
                    style={{ height: '60px' }}
                  />
                  <h2 className="text-primary fw-bold">GuinchoLink</h2>
                  <p className="text-muted">Faça login para acessar o sistema</p>
                </div>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="login-form">
                  <div className="mb-3">
                    <label htmlFor="login" className="form-label fw-semibold">
                      <i className="bi bi-person-fill me-2"></i>
                      Login
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="login"
                      name="login"
                      value={formData.login}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      placeholder="Digite seu login"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="senha" className="form-label fw-semibold">
                      <i className="bi bi-lock-fill me-2"></i>
                      Senha
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="senha"
                      name="senha"
                      value={formData.senha}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      placeholder="Digite sua senha"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 login-btn"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Entrando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Entrar
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
