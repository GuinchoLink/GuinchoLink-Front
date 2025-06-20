import api from './api.js';

class FeedbackService {
  // Get all feedbacks
  async findAll() {
    try {
      const response = await api.get('/feedback');
      return response.data;
    } catch (error) {
      console.error('Erro no findAll:', error.response?.data);
      throw new Error(error.response?.data?.err || error.response?.data?.message || 'Erro ao buscar feedbacks');
    }
  }

  // Get feedback by ID
  async findByPk(id) {
    try {
      const response = await api.get(`/feedback/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro no findByPk:', error.response?.data);
      throw new Error(error.response?.data?.err || error.response?.data?.message || 'Erro ao buscar feedback');
    }
  }

  // Create new feedback
  async create(feedbackData) {
    try {
      const response = await api.post('/feedback', feedbackData);
      return response.data;
    } catch (error) {
      console.error('Erro no create:', error.response?.data);
      
      // Tratamento específico para erros de validação do backend
      if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors.map(err => err.message || err.msg).join(', ');
        throw new Error(errorMessages);
      } else if (error.response?.data?.err) {
        throw new Error(error.response.data.err);
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (typeof error.response?.data === 'string') {
        throw new Error(error.response.data);
      }
      
      throw new Error('Erro ao criar feedback');
    }
  }

  // Update feedback
  async update(id, feedbackData) {
    try {
      const response = await api.put(`/feedback/${id}`, feedbackData);
      return response.data;
    } catch (error) {
      console.error('Erro no update:', error.response?.data);
      
      // Tratamento específico para erros de validação do backend
      if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors.map(err => err.message || err.msg).join(', ');
        throw new Error(errorMessages);
      } else if (error.response?.data?.err) {
        throw new Error(error.response.data.err);
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (typeof error.response?.data === 'string') {
        throw new Error(error.response.data);
      }
      
      throw new Error('Erro ao atualizar feedback');
    }
  }

  // Delete feedback
  async delete(id) {
    try {
      const response = await api.delete(`/feedback/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro no delete:', error.response?.data);
      
      if (error.response?.data?.err) {
        throw new Error(error.response.data.err);
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (typeof error.response?.data === 'string') {
        throw new Error(error.response.data);
      }
      
      throw new Error('Erro ao deletar feedback');
    }
  }

  // Find feedback by nota (rating)
  async findByNota(nota) {
    try {
      const response = await api.get('/feedback/nota', { params: { nota } });
      return response.data;
    } catch (error) {
      console.error('Erro no findByNota:', error.response?.data);
      throw new Error(error.response?.data?.err || error.response?.data?.message || 'Erro ao buscar feedbacks por nota');
    }
  }

  // Get all fim servicos for dropdown
  async findAllFimServicos() {
    try {
      const response = await api.get('/fim-servicos');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar fim serviços:', error.response?.data);
      throw new Error(error.response?.data?.err || error.response?.data?.message || 'Erro ao buscar serviços finalizados');
    }
  }
}

export const feedbackService = new FeedbackService();
