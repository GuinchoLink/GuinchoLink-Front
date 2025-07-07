import React from 'react';

const AdministradorList = ({ administradores, onEdit, onDelete, loading }) => {
  // Format CPF for display
  const formatCpf = (cpf) => {
    if (!cpf) return '';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  // Handle delete confirmation
  const handleDelete = (administrador) => {
    if (window.confirm(`Tem certeza que deseja excluir o administrador "${administrador.nome}"?`)) {
      onDelete(administrador.id);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
        <span className="ms-3 text-muted">Carregando administradores...</span>
      </div>
    );
  }

  if (!administradores || administradores.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-person-fill-gear display-1 text-muted mb-3"></i>
        <h4 className="text-muted mb-2">Nenhum administrador encontrado</h4>
        <p className="text-muted mb-0">
          Clique no botão "Novo Administrador" para começar a cadastrar administradores.
        </p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th scope="col" className="fw-semibold text-primary">
              <i className="bi bi-person me-2"></i>
              Nome
            </th>
            <th scope="col" className="fw-semibold text-primary">
              <i className="bi bi-card-text me-2"></i>
              CPF
            </th>
            <th scope="col" className="fw-semibold text-primary">
              <i className="bi bi-calendar-date me-2"></i>
              Nascimento
            </th>
            <th scope="col" className="fw-semibold text-primary">
              <i className="bi bi-person-circle me-2"></i>
              Login
            </th>
            <th scope="col" className="fw-semibold text-primary text-center">
              <i className="bi bi-gear me-2"></i>
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {administradores.map((administrador) => (
            <tr key={administrador.id}>
              <td>
                <div className="d-flex align-items-center">
                  <div className="avatar-sm bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3">
                    <i className="bi bi-person-fill-gear text-primary"></i>
                  </div>
                  <div>
                    <div className="fw-semibold text-dark">{administrador.nome}</div>
                    <small className="text-muted">ID: {administrador.id}</small>
                  </div>
                </div>
              </td>
              <td>
                <span className="badge bg-light text-dark border">
                  {formatCpf(administrador.cpf)}
                </span>
              </td>
              <td>
                <span className="text-muted">
                  {formatDate(administrador.nascimento)}
                </span>
              </td>
              <td>
                <span className="badge bg-info text-dark">
                  <i className="bi bi-person-circle me-1"></i>
                  {administrador.login}
                </span>
              </td>
              <td>
                <div className="d-flex justify-content-center gap-1">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => onEdit(administrador)}
                    title="Editar administrador"
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleDelete(administrador)}
                    title="Excluir administrador"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdministradorList;
