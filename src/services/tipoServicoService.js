import api from './api';

export const tipoServicoService = {
  // Get all service types
  findAll: async () => {
    try {
      const response = await api.get('/tipos-servico');
      return response.data;
    } catch (error) {
      throw new Error('Erro ao buscar tipos de serviço: ' + error.message);
    }
  },

  // Get service type by ID
  findById: async (id) => {
    try {
      const response = await api.get(`/tipos-servico/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao buscar tipo de serviço: ' + error.message);
    }
  },

  // Create new service type
  create: async (data) => {
    try {
      const response = await api.post('/tipos-servico', data);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao criar tipo de serviço: ' + error.message);
    }
  },

  // Update service type
  update: async (id, data) => {
    try {
      const response = await api.put(`/tipos-servico/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao atualizar tipo de serviço: ' + error.message);
    }
  },

  // Delete service type
  delete: async (id) => {
    try {
      const response = await api.delete(`/tipos-servico/${id}`);
      return response.data;
    } catch (error) {
      // Preservar o erro original para que a mensagem do servidor seja mantida
      throw error;
    }
  }
};
