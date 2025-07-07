import React from 'react';

const FuncionarioList = ({ funcionarios, onEdit, onDelete, loading }) => {
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
  const handleDelete = (funcionario) => {
    if (window.confirm(`Tem certeza que deseja excluir o funcionário "${funcionario.nome}"?`)) {
      onDelete(funcionario.id);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
        <span className="ms-3 text-muted">Carregando funcionários...</span>
      </div>
    );
  }

  if (!funcionarios || funcionarios.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-person-badge display-1 text-muted mb-3"></i>
        <h4 className="text-muted mb-2">Nenhum funcionário encontrado</h4>
        <p className="text-muted mb-0">
          Clique no botão "Novo Funcionário" para começar a cadastrar funcionários.
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
              <i className="bi bi-credit-card me-2"></i>
              CNH
            </th>
            <th scope="col" className="fw-semibold text-primary">
              <i className="bi bi-award me-2"></i>
              Categoria
            </th>
            <th scope="col" className="fw-semibold text-primary text-center">
              <i className="bi bi-gear me-2"></i>
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {funcionarios.map((funcionario) => (
            <tr key={funcionario.id}>
              <td>
                <div className="d-flex align-items-center">
                  <div className="avatar-sm bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3">
                    <i className="bi bi-person-badge text-primary"></i>
                  </div>
                  <div>
                    <div className="fw-semibold text-dark">{funcionario.nome}</div>
                    <small className="text-muted">ID: {funcionario.id}</small>
                  </div>
                </div>
              </td>
              <td>
                <span className="badge bg-light text-dark border">
                  {formatCpf(funcionario.cpf)}
                </span>
              </td>
              <td>
                <span className="text-muted">
                  {formatDate(funcionario.nascimento)}
                </span>
              </td>
              <td>
                <a 
                  href={`tel:${funcionario.telefone}`} 
                  className="text-decoration-none"
                  title="Ligar para o funcionário"
                >
                  <i className="bi bi-telephone-fill me-1 text-success"></i>
                  {formatTelefone(funcionario.telefone)}
                </a>
              </td>
              <td>
                <span className="badge bg-info text-dark">
                  {funcionario.cnh}
                </span>
              </td>
              <td>
                <span className="badge bg-warning text-dark">
                  {funcionario.categoria_cnh}
                </span>
              </td>
              <td>
                <div className="d-flex justify-content-center gap-1">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => onEdit(funcionario)}
                    title="Editar funcionário"
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleDelete(funcionario)}
                    title="Excluir funcionário"
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

export default FuncionarioList;
