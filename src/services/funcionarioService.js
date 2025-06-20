import api from './api';

export const funcionarioService = {
  // Buscar todos os funcionários
  getAll: async () => {
    try {
      const response = await api.get('/funcionario');
      return response.data;
    } catch (error) {
      throw new Error('Erro ao buscar funcionários: ' + error.message);
    }
  },

  // Buscar funcionário por ID
  getById: async (id) => {
    try {
      const response = await api.get(`/funcionario/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao buscar funcionário: ' + error.message);
    }
  },
  // Criar novo funcionário
  create: async (funcionarioData) => {
    try {
      const response = await api.post('/funcionario', funcionarioData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Erro ao criar funcionário: ' + error.message);
    }
  },
  // Atualizar funcionário
  update: async (id, funcionarioData) => {
    try {
      const response = await api.put(`/funcionario/${id}`, funcionarioData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Erro ao atualizar funcionário: ' + error.message);
    }
  },

  // Deletar funcionário
  delete: async (id) => {
    try {
      const response = await api.delete(`/funcionario/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao deletar funcionário: ' + error.message);
    }
  }
};
