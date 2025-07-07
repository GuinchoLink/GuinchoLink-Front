import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import administradorService from '../../services/administradorService';

const Perfil = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    nascimento: '',
    login: '',
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: ''
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  // Função para carregar dados do usuário da API
  const loadUserData = async () => {
    if (!user || !user.id) {
      console.log('Usuário ou ID não encontrado');
      setInitialLoading(false);
      return;
    }

    try {
      setInitialLoading(true);
      console.log('Buscando dados do administrador ID:', user.id);
      
      const userData = await administradorService.getById(user.id);
      console.log('Dados recebidos da API:', userData);
      
      // Verificar se a resposta tem uma estrutura aninhada
      const data = userData.data || userData;
      
      // Pré-preencher o formulário com os dados do banco
      const formDataToSet = {
        nome: data.nome || '',
        cpf: data.cpf || '',
        nascimento: data.nascimento || '',
        login: data.login || '',
        senhaAtual: '',
        novaSenha: '',
        confirmarSenha: ''
      };
      
      console.log('Preenchendo formulário com:', formDataToSet);
      setFormData(formDataToSet);
      
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
      setMessage({ 
        type: 'error', 
        text: `Erro ao carregar dados do perfil: ${error.message}` 
      });
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    console.log('Carregando perfil do usuário:', user?.id);
    
    if (user && user.id) {
      loadUserData();
    } else {
      console.log('User ID não disponível, usando dados do contexto');
      
      // Como fallback, tentar usar dados do contexto se disponíveis
      if (user) {
        setFormData({
          nome: user.nome || '',
          cpf: user.cpf || '',
          nascimento: user.nascimento || '',
          login: user.login || '',
          senhaAtual: '',
          novaSenha: '',
          confirmarSenha: ''
        });
      }
      
      setInitialLoading(false);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validatePassword = () => {
    if (showPasswordFields) {
      if (!formData.senhaAtual || formData.senhaAtual.trim() === '') {
        setMessage({ type: 'error', text: 'Senha atual é obrigatória para alterar a senha.' });
        return false;
      }
      if (!formData.novaSenha || formData.novaSenha.trim() === '') {
        setMessage({ type: 'error', text: 'Nova senha é obrigatória.' });
        return false;
      }
      if (formData.novaSenha.length < 6) {
        setMessage({ type: 'error', text: 'Nova senha deve ter pelo menos 6 caracteres.' });
        return false;
      }
      if (formData.novaSenha !== formData.confirmarSenha) {
        setMessage({ type: 'error', text: 'Nova senha e confirmação não coincidem.' });
        return false;
      }
      // Validar se a nova senha contém pelo menos um número (conforme o modelo)
      if (!/^(?=.*[0-9]).+$/.test(formData.novaSenha)) {
        setMessage({ type: 'error', text: 'Nova senha deve conter pelo menos um número.' });
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (!validatePassword()) {
      setLoading(false);
      return;
    }

    try {
      // Verificar se o usuário e ID estão disponíveis
      if (!user || !user.id) {
        setMessage({ type: 'error', text: 'Erro: Dados do usuário não encontrados. Faça login novamente.' });
        setLoading(false);
        return;
      }

      const updateData = {
        nome: formData.nome,
        cpf: formData.cpf,
        nascimento: formData.nascimento,
        login: formData.login
      };

      // Adicionar senha APENAS se estiver alterando e os campos estão preenchidos
      if (showPasswordFields && formData.novaSenha && formData.novaSenha.trim() !== '') {
        console.log('Incluindo nova senha na atualização');
        updateData.senha = formData.novaSenha;
        // senhaAtual pode ser usada para validação no controller, mas não será processada pelo hook
        updateData.senhaAtual = formData.senhaAtual;
      } else {
        console.log('Não alterando senha - campo não será enviado');
      }

      console.log('Dados enviados para atualização:', updateData);
      console.log('ID do usuário:', user.id);

      const response = await administradorService.update(user.id, updateData);
      
      // Atualizar o contexto do usuário com os novos dados
      const updatedUser = { ...user, ...response };
      setUser(updatedUser);
      
      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
      
      // Limpar campos de senha
      if (showPasswordFields) {
        setFormData(prev => ({
          ...prev,
          senhaAtual: '',
          novaSenha: '',
          confirmarSenha: ''
        }));
        setShowPasswordFields(false);
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Erro ao atualizar perfil. Tente novamente.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">
                <i className="bi bi-person-circle me-2"></i>
                Meu Perfil
              </h4>
            </div>
            <div className="card-body">
              {initialLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Carregando...</span>
                  </div>
                  <p className="mt-3 text-muted">Buscando dados atuais do banco de dados...</p>
                </div>
              ) : (
                <>
                  {message.text && (
                    <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'} alert-dismissible fade show`}>
                      <i className={`bi ${message.type === 'success' ? 'bi-check-circle' : 'bi-exclamation-triangle'} me-2`}></i>
                      {message.text}
                      <button 
                        type="button" 
                        className="btn-close" 
                        onClick={() => setMessage({ type: '', text: '' })}
                      ></button>
                    </div>
                  )}

              <form onSubmit={handleSubmit}>
                <div className="row">
                  {/* Informações Pessoais */}
                  <div className="col-md-6">
                    <h5 className="mb-3 text-primary">
                      <i className="bi bi-person me-2"></i>
                      Informações Pessoais
                    </h5>
                    
                    <div className="mb-3">
                      <label htmlFor="nome" className="form-label">
                        Nome <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="nome"
                        name="nome"
                        value={formData.nome}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="cpf" className="form-label">
                        CPF <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="cpf"
                        name="cpf"
                        value={formData.cpf}
                        onChange={handleInputChange}
                        placeholder="000.000.000-00"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="nascimento" className="form-label">
                        Data de Nascimento <span className="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="nascimento"
                        name="nascimento"
                        value={formData.nascimento}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="login" className="form-label">
                        Login <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="login"
                        name="login"
                        value={formData.login}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Alteração de Senha */}
                  <div className="col-md-6">
                    <h5 className="mb-3 text-primary">
                      <i className="bi bi-shield-lock me-2"></i>
                      Segurança
                    </h5>
                    
                    <div className="mb-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="alterarSenha"
                          checked={showPasswordFields}
                          onChange={(e) => setShowPasswordFields(e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="alterarSenha">
                          Alterar senha
                        </label>
                      </div>
                    </div>

                    {showPasswordFields && (
                      <>
                        <div className="mb-3">
                          <label htmlFor="senhaAtual" className="form-label">
                            Senha Atual <span className="text-danger">*</span>
                          </label>
                          <input
                            type="password"
                            className="form-control"
                            id="senhaAtual"
                            name="senhaAtual"
                            value={formData.senhaAtual}
                            onChange={handleInputChange}
                            placeholder="Digite sua senha atual"
                          />
                        </div>

                        <div className="mb-3">
                          <label htmlFor="novaSenha" className="form-label">
                            Nova Senha <span className="text-danger">*</span>
                          </label>
                          <input
                            type="password"
                            className="form-control"
                            id="novaSenha"
                            name="novaSenha"
                            value={formData.novaSenha}
                            onChange={handleInputChange}
                            placeholder="Digite a nova senha (mín. 6 caracteres)"
                            minLength="6"
                          />
                        </div>

                        <div className="mb-3">
                          <label htmlFor="confirmarSenha" className="form-label">
                            Confirmar Nova Senha <span className="text-danger">*</span>
                          </label>
                          <input
                            type="password"
                            className="form-control"
                            id="confirmarSenha"
                            name="confirmarSenha"
                            value={formData.confirmarSenha}
                            onChange={handleInputChange}
                            placeholder="Confirme a nova senha"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <hr />

                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={async () => {
                      setShowPasswordFields(false);
                      setMessage({ type: '', text: '' });
                      console.log('Recarregando dados do banco...');
                      await loadUserData();
                    }}
                  >
                    <i className="bi bi-arrow-clockwise me-1"></i>
                    Recarregar Dados
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
                        <i className="bi bi-check-lg me-1"></i>
                        Salvar Alterações
                      </>
                    )}
                  </button>
                </div>
              </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
