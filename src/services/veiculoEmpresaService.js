import api from './api';

export const veiculoEmpresaService = {
  // Buscar todos os veículos
  async findAll() {
    const response = await api.get('/veiculoEmpresa');
    return response.data;
  },

  // Buscar veículos por status
  async findByStatus(status) {
    const response = await api.get(`/veiculoEmpresa/status?status=${status}`);
    return response.data;
  },

  // Buscar veículo por ID
  async findByPk(id) {
    const response = await api.get(`/veiculoEmpresa/${id}`);
    return response.data;
  },

  // Criar novo veículo
  async create(data) {
    const response = await api.post('/veiculoEmpresa', data);
    return response.data;
  },

  // Atualizar veículo
  async update(id, data) {
    const response = await api.put(`/veiculoEmpresa/${id}`, data);
    return response.data;
  },

  // Deletar veículo
  async delete(id) {
    const response = await api.delete(`/veiculoEmpresa/${id}`);
    return response.data;
  }
};
