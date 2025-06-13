import api from './api';

export const administradorService = {
  // Buscar todos os administradores
  getAll: async () => {
    try {
      const response = await api.get('/administrador');
      return response.data;
    } catch (error) {
      throw new Error('Erro ao buscar administradores: ' + error.message);
    }
  },

  // Buscar administrador por ID
  getById: async (id) => {
    try {
      const response = await api.get(`/administrador/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao buscar administrador: ' + error.message);
    }
  },
  // Criar novo administrador
  create: async (administradorData) => {
    try {
      const response = await api.post('/administrador', administradorData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Erro ao criar administrador: ' + error.message);
    }
  },

  // Atualizar administrador
  update: async (id, administradorData) => {
    try {
      const response = await api.put(`/administrador/${id}`, administradorData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Erro ao atualizar administrador: ' + error.message);
    }
  },

  // Deletar administrador
  delete: async (id) => {
    try {
      const response = await api.delete(`/administrador/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao deletar administrador: ' + error.message);
    }
  }
};
