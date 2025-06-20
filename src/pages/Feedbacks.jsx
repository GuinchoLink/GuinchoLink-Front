import React, { useState, useEffect } from 'react';
import { feedbackService } from '../services/feedbackService.js';
import FeedbackForm from '../components/FeedbackForm.jsx';
import FeedbackList from '../components/FeedbackList.jsx';
import FeedbackView from '../components/FeedbackView.jsx';
import Modal from '../components/Modal.jsx';

const Feedbacks = () => {  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [viewingFeedback, setViewingFeedback] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [filterNota, setFilterNota] = useState('');

  // Load all feedbacks
  const loadFeedbacks = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await feedbackService.findAll();
      setFeedbacks(data);
    } catch (error) {
      setError(error.message);
      console.error('Erro ao carregar feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadFeedbacks();
  }, []);

  // Clear messages after some time
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 10000); // 10 segundos para erro (mais tempo para ler)
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Handle create new feedback
  const handleCreate = () => {
    setEditingFeedback(null);
    setError('');
    setSuccessMessage('');
    setIsModalOpen(true);
  };

  // Handle edit feedback
  const handleEdit = (feedback) => {
    setEditingFeedback(feedback);
    setError('');
    setSuccessMessage('');
    setIsModalOpen(true);
  };

  // Handle view feedback
  const handleView = (feedback) => {
    setViewingFeedback(feedback);
    setIsViewModalOpen(true);
  };

  // Handle delete feedback with improved error handling
  const handleDelete = async (id) => {
    try {
      setError('');
      setSuccessMessage('');
      
      console.log('Iniciando processo de exclusão do feedback ID:', id);
      
      // Find feedback for better feedback
      const feedback = feedbacks.find(f => f.id === id);
      const feedbackInfo = feedback ? `Nota ${feedback.nota}` : `ID ${id}`;
      
      await feedbackService.delete(id);
      
      console.log('Feedback deletado com sucesso');
      setSuccessMessage(`Feedback "${feedbackInfo}" foi excluído com sucesso!`);
      
      await loadFeedbacks(); // Reload the list
    } catch (error) {
      console.error('Erro capturado no handleDelete:', error);
      
      // Determine error type and show appropriate message
      let errorMessage = error.message;
      
      // Add more context to common errors
      if (errorMessage.includes('não encontrado')) {
        errorMessage = `❌ Feedback não encontrado: Este feedback pode já ter sido excluído ou não existe mais no sistema.`;
      } else if (errorMessage.includes('servidor')) {
        errorMessage = `❌ Erro do servidor: ${errorMessage}
        
🔄 Tente novamente em alguns instantes. Se o problema persistir, entre em contato com o suporte.`;
      }
      
      setError(errorMessage);
    }
  };

  // Handle filter by nota
  const handleFilterByNota = async (nota) => {
    try {
      setLoading(true);
      setError('');
      setFilterNota(nota);
      
      if (nota === '') {
        // Load all feedbacks
        await loadFeedbacks();
      } else {
        // Load filtered feedbacks
        const data = await feedbackService.findByNota(nota);
        setFeedbacks(data.feedbackNota || []);
      }
    } catch (error) {
      setError(error.message);
      console.error('Erro ao filtrar feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      setError('');
      
      if (editingFeedback) {
        await feedbackService.update(editingFeedback.id, formData);
        setSuccessMessage(`Feedback foi atualizado com sucesso!`);
      } else {
        await feedbackService.create(formData);
        setSuccessMessage(`Feedback foi cadastrado com sucesso!`);
      }
      
      setIsModalOpen(false);
      await loadFeedbacks(); // Reload the list
    } catch (error) {
      console.error('Erro ao salvar feedback:', error);
      throw error; // Re-throw for form to handle
    } finally {
      setFormLoading(false);
    }
  };
  // Handle form cancel
  const handleFormCancel = () => {
    setIsModalOpen(false);
    setEditingFeedback(null);
    setError('');
  };

  // Handle view modal close
  const handleViewModalClose = () => {
    setIsViewModalOpen(false);
    setViewingFeedback(null);
  };

  // Get rating statistics
  const getRatingStats = () => {
    if (!feedbacks.length) return null;
    
    const stats = {};
    feedbacks.forEach(feedback => {
      stats[feedback.nota] = (stats[feedback.nota] || 0) + 1;
    });
    
    const total = feedbacks.length;
    const average = feedbacks.reduce((sum, f) => sum + f.nota, 0) / total;
    
    return { stats, total, average: average.toFixed(1) };
  };

  const ratingStats = getRatingStats();

  return (
    <div className="h-100 d-flex flex-column overflow-auto">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-shrink-0">
        <div>
          <h2 className="text-primary fw-bold mb-2">
            <i className="bi bi-chat-heart-fill me-3"></i>
            Gerenciar Feedbacks
          </h2>
          <p className="text-muted mb-0">
            Gerencie os feedbacks dos serviços prestados
          </p>
        </div>
        <button 
          className="btn btn-primary btn-lg shadow"
          onClick={handleCreate}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Novo Feedback
        </button>
      </div>

      {/* Rating Statistics */}
      {ratingStats && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="card bg-light">
              <div className="card-body">
                <div className="row text-center">
                  <div className="col-md-2">
                    <h4 className="text-primary mb-1">{ratingStats.total}</h4>
                    <small className="text-muted">Total</small>
                  </div>
                  <div className="col-md-2">
                    <h4 className="text-warning mb-1">{ratingStats.average}</h4>
                    <small className="text-muted">Média</small>
                  </div>
                  {[5, 4, 3, 2, 1].map(nota => (
                    <div key={nota} className="col-md-1">
                      <h5 className="mb-1">{ratingStats.stats[nota] || 0}</h5>
                      <small className="text-muted">
                        {Array(nota).fill().map((_, i) => (
                          <i key={i} className="bi bi-star-fill text-warning"></i>
                        ))}
                      </small>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="row mb-3">
        <div className="col-md-4">
          <select
            className="form-select"
            value={filterNota}
            onChange={(e) => handleFilterByNota(e.target.value)}
          >
            <option value="">Todas as notas</option>
            <option value="5">⭐⭐⭐⭐⭐ Excelente (5)</option>
            <option value="4">⭐⭐⭐⭐ Bom (4)</option>
            <option value="3">⭐⭐⭐ Regular (3)</option>
            <option value="2">⭐⭐ Ruim (2)</option>
            <option value="1">⭐ Péssimo (1)</option>
          </select>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show flex-shrink-0 mb-4" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i>
          <strong>Sucesso:</strong> {successMessage}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setSuccessMessage('')}
            aria-label="Fechar"
          ></button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show flex-shrink-0 mb-4" role="alert">
          <div className="d-flex align-items-start">
            <i className="bi bi-exclamation-triangle-fill me-2 flex-shrink-0 mt-1"></i>
            <div className="flex-grow-1">
              <strong>Erro ao processar operação:</strong>
              <div className="mt-2" style={{ whiteSpace: 'pre-line' }}>
                {error}
              </div>
            </div>
          </div>
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setError('')}
            aria-label="Fechar"
          ></button>
        </div>
      )}

      {/* Content */}
      <div className="card shadow-sm flex-grow-1 d-flex flex-column overflow-hidden">
        <div className="card-body d-flex flex-column flex-grow-1 p-4 overflow-auto">
          <FeedbackList
            feedbacks={feedbacks}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
            onView={handleView}
          />
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleFormCancel}
        title={editingFeedback ? 'Editar Feedback' : 'Novo Feedback'}
        size="lg"
      >
        <FeedbackForm
          initialData={editingFeedback}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          loading={formLoading}
        />
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Visualizar Feedback"
        size="lg"
      >
        <FeedbackView feedback={viewingFeedback} />
      </Modal>
    </div>
  );
};

export default Feedbacks;
