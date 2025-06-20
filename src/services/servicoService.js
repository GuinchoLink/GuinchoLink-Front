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
      console.error('Erro no create:', error.response?.data);
      
      // Tratamento específico para erros de validação do backend
      if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors.map(err => err.message || err.msg).join(', ');
        throw new Error(errorMessages);
      } else if (error.response?.data?.err) {
        throw new Error(error.response.data.err);
      } else if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (typeof error.response?.data === 'string') {
        throw new Error(error.response.data);
      }
      
      throw new Error('Erro ao criar serviço');
    }
  }
  // Update service
  async update(id, servicoData) {
    try {
      const response = await api.put(`/servicos/${id}`, servicoData);
      return response.data;
    } catch (error) {
      console.error('Erro no update:', error.response?.data);
      
      // Tratamento específico para erros de validação do backend
      if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors.map(err => err.message || err.msg).join(', ');
        throw new Error(errorMessages);
      } else if (error.response?.data?.err) {
        throw new Error(error.response.data.err);
      } else if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (typeof error.response?.data === 'string') {
        throw new Error(error.response.data);
      }
      
      throw new Error('Erro ao atualizar serviço');
    }
  }
  // Delete service
  async delete(id) {
    try {
      const response = await api.delete(`/servicos/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao excluir serviço');
    }
  }
}

export const servicoService = new ServicoService();
