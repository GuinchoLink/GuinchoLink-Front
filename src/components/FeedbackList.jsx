import React from 'react';

const FeedbackList = ({ feedbacks, onEdit, onDelete, onView, loading }) => {
  // Get star rating display
  const getStarRating = (nota) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i 
          key={i} 
          className={`bi ${i <= nota ? 'bi-star-fill' : 'bi-star'}`}
          style={{ color: i <= nota ? '#ffc107' : '#e9ecef' }}
        ></i>
      );
    }
    return stars;
  };

  // Get rating badge color
  const getRatingBadgeColor = (nota) => {
    if (nota >= 5) return 'success';
    if (nota >= 4) return 'info';
    if (nota >= 3) return 'secondary';
    if (nota >= 2) return 'warning';
    return 'danger';
  };

  // Get rating text
  const getRatingText = (nota) => {
    const ratings = {
      1: 'Péssimo',
      2: 'Ruim',
      3: 'Regular',
      4: 'Bom',
      5: 'Excelente'
    };
    return ratings[nota] || 'N/A';
  };

  // Format date display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  // Handle delete confirmation
  const handleDelete = (feedback) => {
    const confirmMessage = `⚠️ ATENÇÃO: Você está prestes a excluir o feedback.

📋 Dados do feedback:
• Nota: ${feedback.nota} (${getRatingText(feedback.nota)})
• Comentário: ${feedback.comentario || 'Sem comentário'}
• Serviço: ID ${feedback.fim_servico_id}

❗ Esta ação NÃO pode ser desfeita!

Tem certeza que deseja continuar?`;

    if (window.confirm(confirmMessage)) {
      console.log('Confirmado delete do feedback:', feedback.id);
      onDelete(feedback.id);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Carregando...</span>
          </div>
          <h5 className="text-muted">Carregando feedbacks...</h5>
          <p className="text-muted mb-0">Por favor, aguarde</p>
        </div>
      </div>
    );
  }

  if (!feedbacks || feedbacks.length === 0) {
    return (
      <div className="text-center py-5">
        <div className="mb-4">
          <i className="bi bi-chat-heart text-muted" style={{ fontSize: '5rem' }}></i>
        </div>
        <h4 className="text-muted mt-3 mb-3">Nenhum feedback encontrado</h4>
        <p className="text-muted mb-4">
          Você ainda não possui feedbacks cadastrados no sistema.<br/>
          Clique no botão "Novo Feedback" para cadastrar o primeiro feedback.
        </p>
        <div className="alert alert-info d-inline-block">
          <i className="bi bi-info-circle me-2"></i>
          <strong>Dica:</strong> Feedbacks são importantes para avaliar a qualidade dos serviços prestados.
        </div>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-primary">
          <tr>
            <th scope="col" className="fw-bold">
              <i className="bi bi-star-fill me-2"></i>Avaliação
            </th>
            <th scope="col" className="fw-bold">
              <i className="bi bi-chat-text me-2"></i>Comentário
            </th>
            <th scope="col" className="fw-bold">
              <i className="bi bi-check-circle me-2"></i>Serviço
            </th>
            <th scope="col" className="fw-bold">
              <i className="bi bi-person me-2"></i>Cliente
            </th>
            <th scope="col" className="fw-bold">
              <i className="bi bi-calendar-date me-2"></i>Data
            </th>
            <th scope="col" className="fw-bold text-center">
              <i className="bi bi-gear-fill me-2"></i>Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map((feedback) => (
            <tr key={feedback.id} className="feedback-row">
              <td>
                <div className="d-flex align-items-center">
                  <div className="me-3">
                    <div className="d-flex align-items-center mb-1">
                      {getStarRating(feedback.nota)}
                      <span className="ms-2 fw-bold text-warning">{feedback.nota}</span>
                    </div>
                    <span className={`badge bg-${getRatingBadgeColor(feedback.nota)}`}>
                      {getRatingText(feedback.nota)}
                    </span>
                  </div>
                </div>
              </td>
              <td>
                <div style={{ maxWidth: '250px' }}>
                  {feedback.comentario ? (
                    <div>
                      <span className="text-truncate d-inline-block" style={{ maxWidth: '200px' }} title={feedback.comentario}>
                        {feedback.comentario}
                      </span>
                      {feedback.comentario.length > 50 && (
                        <small className="text-muted d-block">
                          {feedback.comentario.length} caracteres
                        </small>
                      )}
                    </div>
                  ) : (
                    <span className="text-muted fst-italic">Sem comentário</span>
                  )}
                </div>
              </td>
              <td>
                <div className="d-flex align-items-center">
                  <div className="bg-success rounded-circle d-flex align-items-center justify-content-center me-2" 
                       style={{ width: '30px', height: '30px' }}>
                    <i className="bi bi-check text-white small"></i>
                  </div>
                  <div>
                    <div className="fw-semibold text-dark">Serviço #{feedback.fim_servico_id}</div>
                    <small className="text-muted">ID: {feedback.id}</small>
                  </div>
                </div>
              </td>
              <td>
                {feedback.fim_servico?.servico?.cliente ? (
                  <div>
                    <div className="fw-semibold text-dark">{feedback.fim_servico.servico.cliente.nome}</div>
                    <small className="text-muted">{feedback.fim_servico.servico.cliente.cpf}</small>
                  </div>
                ) : (
                  <small className="text-muted">Cliente não encontrado</small>
                )}
              </td>
              <td>
                <span className="text-muted">
                  {formatDate(feedback.fim_servico?.data_fim || feedback.createdAt)}
                </span>
              </td>              <td>
                <div className="d-flex gap-2 justify-content-center">
                  <button
                    className="btn btn-outline-info btn-sm"
                    onClick={() => onView(feedback)}
                    title="Visualizar feedback"
                  >
                    <i className="bi bi-eye"></i>
                  </button>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => onEdit(feedback)}
                    title="Editar feedback"
                  >
                    <i className="bi bi-pencil-square"></i>
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleDelete(feedback)}
                    title="Excluir feedback"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Info Footer */}
      <div className="text-center mt-3 pt-3 border-top">
        <small className="text-muted">
          <i className="bi bi-info-circle me-1"></i>
          Total de {feedbacks.length} feedback{feedbacks.length !== 1 ? 's' : ''} cadastrado{feedbacks.length !== 1 ? 's' : ''}
        </small>
      </div>
    </div>
  );
};

export default FeedbackList;
