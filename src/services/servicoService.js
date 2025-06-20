import api from './api.js';

class ServicoService {
  // Get all services
  async findAll() {
    try {
      const response = await api.get('/servicos');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar serviços');
    }
  }

  // Get service by ID
  async findByPk(id) {
    try {
      const response = await api.get(`/servicos/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar serviço');
    }
  }

  // Create new service
  async create(servicoData) {
    try {
      const response = await api.post('/servicos', servicoData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao criar serviço');
    }
  }

  // Update service
  async update(id, servicoData) {
    try {
      const response = await api.put(`/servicos/${id}`, servicoData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar serviço');
    }
  }

  // Delete service
  async delete(id) {
    try {
      const response = await api.delete(`/servicos/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const servicoService = new ServicoService();
