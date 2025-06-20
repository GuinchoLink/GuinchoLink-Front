import React from 'react';

const FeedbackView = ({ feedback }) => {
  // Get star rating display
  const getStarRating = (nota) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i 
          key={i} 
          className={`bi ${i <= nota ? 'bi-star-fill' : 'bi-star'}`}
          style={{ color: i <= nota ? '#ffc107' : '#e9ecef', fontSize: '1.5rem' }}
        ></i>
      );
    }
    return stars;
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

  // Get rating badge color
  const getRatingBadgeColor = (nota) => {
    if (nota >= 5) return 'success';
    if (nota >= 4) return 'info';
    if (nota >= 3) return 'secondary';
    if (nota >= 2) return 'warning';
    return 'danger';
  };

  // Get rating emoji
  const getRatingEmoji = (nota) => {
    const emojis = {
      1: '😠',
      2: '😞',
      3: '😐',
      4: '😊',
      5: '😍'
    };
    return emojis[nota] || '❓';
  };

  // Format date display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!feedback) {
    return (
      <div className="text-center py-4">
        <i className="bi bi-exclamation-triangle text-warning display-4"></i>
        <h5 className="mt-3">Feedback não encontrado</h5>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row g-4">
        {/* Avaliação */}
        <div className="col-12">
          <div className="card border-primary">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="bi bi-star-fill me-2"></i>
                Avaliação do Serviço
              </h5>
            </div>
            <div className="card-body text-center">
              <div className="mb-3">
                {getStarRating(feedback.nota)}
              </div>
              <div className="mb-3">
                <h2 className="display-4 mb-0">{feedback.nota}</h2>
                <span className={`badge bg-${getRatingBadgeColor(feedback.nota)} fs-5 px-3 py-2`}>
                  {getRatingEmoji(feedback.nota)} {getRatingText(feedback.nota)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Comentário */}
        <div className="col-12">
          <div className="card border-info">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">
                <i className="bi bi-chat-text me-2"></i>
                Comentário
              </h5>
            </div>
            <div className="card-body">
              {feedback.comentario ? (
                <div>
                  <blockquote className="blockquote">
                    <p className="mb-0 fs-5 text-muted fst-italic">
                      "{feedback.comentario}"
                    </p>
                  </blockquote>
                  <div className="mt-3">
                    <small className="text-muted">
                      <i className="bi bi-chat-dots me-1"></i>
                      {feedback.comentario.length} caracteres
                    </small>
                  </div>
                </div>
              ) : (
                <div className="text-center py-3">
                  <i className="bi bi-chat-x text-muted display-6"></i>
                  <p className="text-muted mt-2 mb-0">
                    Nenhum comentário foi deixado para este feedback
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Informações do Serviço */}
        <div className="col-md-6">
          <div className="card border-success">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">
                <i className="bi bi-check-circle me-2"></i>
                Serviço Finalizado
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-12">
                  <strong>ID do Serviço:</strong>
                  <span className="badge bg-success ms-2">#{feedback.fim_servico_id}</span>
                </div>
                
                {feedback.fim_servico?.servico?.cliente && (
                  <>
                    <div className="col-12">
                      <strong>Cliente:</strong>
                      <div className="mt-1">
                        <i className="bi bi-person-fill text-primary me-2"></i>
                        {feedback.fim_servico.servico.cliente.nome}
                      </div>
                      <div className="mt-1">
                        <i className="bi bi-card-text text-muted me-2"></i>
                        <small className="text-muted">
                          {feedback.fim_servico.servico.cliente.cpf}
                        </small>
                      </div>
                    </div>
                  </>
                )}

                {feedback.fim_servico?.data_fim && (
                  <div className="col-12">
                    <strong>Data de Finalização:</strong>
                    <div className="mt-1">
                      <i className="bi bi-calendar-check text-success me-2"></i>
                      {formatDate(feedback.fim_servico.data_fim)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Informações do Feedback */}
        <div className="col-md-6">
          <div className="card border-secondary">
            <div className="card-header bg-secondary text-white">
              <h5 className="mb-0">
                <i className="bi bi-info-circle me-2"></i>
                Informações do Feedback
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-12">
                  <strong>ID do Feedback:</strong>
                  <span className="badge bg-secondary ms-2">#{feedback.id}</span>
                </div>
                
                <div className="col-12">
                  <strong>Data de Criação:</strong>
                  <div className="mt-1">
                    <i className="bi bi-calendar-plus text-secondary me-2"></i>
                    {formatDate(feedback.createdAt)}
                  </div>
                </div>

                {feedback.updatedAt && feedback.updatedAt !== feedback.createdAt && (
                  <div className="col-12">
                    <strong>Última Atualização:</strong>
                    <div className="mt-1">
                      <i className="bi bi-calendar-event text-warning me-2"></i>
                      {formatDate(feedback.updatedAt)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resumo */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="alert alert-light border">
            <h6 className="alert-heading">
              <i className="bi bi-clipboard-data me-2"></i>
              Resumo do Feedback
            </h6>            <hr />
            <p className="mb-0">
              <strong>Avaliação:</strong> {getRatingEmoji(feedback.nota)} {feedback.nota}/5 ({getRatingText(feedback.nota)}) •
              <strong> Serviço:</strong> #{feedback.fim_servico_id} •
              <strong> Cliente:</strong> {feedback.fim_servico?.servico?.cliente?.nome || 'N/A'}
              {feedback.comentario && (
                <>
                  <br />
                  <strong>Comentário:</strong> {feedback.comentario.length > 100 ? 
                    `${feedback.comentario.substring(0, 100)}...` : 
                    feedback.comentario
                  }
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackView;
