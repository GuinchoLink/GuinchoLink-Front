import api from './api.js';

class VeiculoClienteService {
  // Get all vehicles
  async findAll() {
    try {
      const response = await api.get('/veiculoCliente');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar veículos');
    }
  }

  // Get vehicle by ID
  async findByPk(id) {
    try {
      const response = await api.get(`/veiculoCliente/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar veículo');
    }
  }

  // Create new vehicle
  async create(veiculoData) {
    try {
      const response = await api.post('/veiculoCliente', veiculoData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao criar veículo');
    }
  }

  // Update vehicle
  async update(id, veiculoData) {
    try {
      const response = await api.put(`/veiculoCliente/${id}`, veiculoData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao atualizar veículo');
    }
  }

  // Delete vehicle
  async delete(id) {
    try {
      const response = await api.delete(`/veiculoCliente/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao deletar veículo');
    }
  }

  // Find vehicles by client ID
  async findByClientId(clienteId) {
    try {
      const response = await api.get('/veiculoCliente/por-cliente', {
        params: { cliente_id: clienteId }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erro ao buscar veículos do cliente');
    }
  }
}

export const veiculoClienteService = new VeiculoClienteService();