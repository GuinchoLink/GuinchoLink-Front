import api from './api.js';

class ClienteService {
  // Get all clients
  async findAll() {
    try {
      const response = await api.get('/clientes');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar clientes');
    }
  }

  // Get client by ID
  async findByPk(id) {
    try {
      const response = await api.get(`/clientes/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar cliente');
    }
  }

  // Create new client
  async create(clienteData) {
    try {
      const response = await api.post('/clientes', clienteData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao criar cliente');
    }
  }

  // Update client
  async update(id, clienteData) {
    try {
      const response = await api.put(`/clientes/${id}`, clienteData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar cliente');
    }
  }

  // Delete client
  async delete(id) {
    try {
      const response = await api.delete(`/clientes/${id}`);
      return response.data;
    } catch (error) {
      throw error;
      //throw new Error(error.response?.data?.message || 'Erro ao deletar cliente');
    }
  }
}

export const clienteService = new ClienteService();
