import React from 'react';

const ClienteList = ({ clientes, onEdit, onDelete, loading }) => {
  // Format CPF for display
  const formatCpf = (cpf) => {
    if (!cpf) return '';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  // Format phone for display
  const formatTelefone = (telefone) => {
    if (!telefone) return '';
    return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '$1 $2-$3');
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  // Handle delete confirmation
  const handleDelete = (cliente) => {
    if (window.confirm(`Tem certeza que deseja excluir o cliente "${cliente.nome}"?`)) {
      onDelete(cliente.id);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
        <span className="ms-3 text-muted">Carregando clientes...</span>
      </div>
    );
  }

  if (!clientes || clientes.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-people display-1 text-muted mb-3"></i>
        <h4 className="text-muted mb-2">Nenhum cliente encontrado</h4>
        <p className="text-muted mb-0">
          Clique no botão "Novo Cliente" para começar a cadastrar clientes.
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
              <i className="bi bi-telephone me-2"></i>
              Telefone
            </th>
            <th scope="col" className="fw-semibold text-primary">
              <i className="bi bi-geo-alt me-2"></i>
              Endereço
            </th>
            <th scope="col" className="fw-semibold text-primary text-center">
              <i className="bi bi-gear me-2"></i>
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.id}>
              <td>
                <div className="d-flex align-items-center">
                  <div className="avatar-sm bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3">
                    <i className="bi bi-person text-primary"></i>
                  </div>
                  <div>
                    <div className="fw-semibold text-dark">{cliente.nome}</div>
                    <small className="text-muted">ID: {cliente.id}</small>
                  </div>
                </div>
              </td>
              <td>
                <span className="badge bg-light text-dark border">
                  {formatCpf(cliente.cpf)}
                </span>
              </td>
              <td>
                <span className="text-muted">
                  {formatDate(cliente.nascimento)}
                </span>
              </td>
              <td>
                <a 
                  href={`tel:${cliente.telefone}`} 
                  className="text-decoration-none"
                  title="Ligar para o cliente"
                >
                  <i className="bi bi-telephone-fill me-1 text-success"></i>
                  {formatTelefone(cliente.telefone)}
                </a>
              </td>
              <td>
                <span className="text-muted" title={cliente.endereco}>
                  {cliente.endereco.length > 30 
                    ? `${cliente.endereco.substring(0, 30)}...` 
                    : cliente.endereco
                  }
                </span>
              </td>
              <td>
                <div className="d-flex justify-content-center gap-1">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => onEdit(cliente)}
                    title="Editar cliente"
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleDelete(cliente)}
                    title="Excluir cliente"
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

export default ClienteList;
