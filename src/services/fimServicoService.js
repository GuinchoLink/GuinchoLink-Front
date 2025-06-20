import api from './api';

export const fimServicoService = {
  // Buscar todos os fim de serviços
  async findAll() {
    const response = await api.get('/fim-servicos');
    return response.data;
  },

  // Buscar fim de serviço por ID
  async findById(id) {
    const response = await api.get(`/fim-servicos/${id}`);
    return response.data;
  },

  // Buscar fim de serviços por serviço ID
  async findByServicoId(servicoId) {
    const response = await api.get(`/fim-servicos/servico/${servicoId}`);
    return response.data;
  },

  // Buscar fim de serviços por cliente ID
  async findByClienteId(clienteId) {
    const response = await api.get(`/fim-servicos/cliente/${clienteId}`);
    return response.data;
  },

  // Buscar estatísticas gerais de todos os clientes
  async getClienteStatisticsGeneral() {
    const response = await api.get('/fim-servicos/cliente-statistics');
    return response.data;
  },

  // Buscar estatísticas de um cliente específico
  async getClienteStatistics(clienteId) {
    const response = await api.get(`/fim-servicos/cliente-statistics/${clienteId}`);
    return response.data;
  },

  // Criar novo fim de serviço
  async create(data) {
    const response = await api.post('/fim-servicos', data);
    return response.data;
  },

  // Atualizar fim de serviço
  async update(id, data) {
    const response = await api.put(`/fim-servicos/${id}`, data);
    return response.data;
  },

  // Deletar fim de serviço
  async delete(id) {
    const response = await api.delete(`/fim-servicos/${id}`);
    return response.data;
  }
};
