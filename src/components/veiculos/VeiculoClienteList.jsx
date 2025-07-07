import React from 'react';

const VeiculoClienteList = ({ veiculos, onEdit, onDelete, loading }) => {
  // Format license plate for display
  const formatPlaca = (placa) => {
    if (!placa || placa.length !== 7) return placa;
    return `${placa.slice(0, 3)}-${placa.slice(3)}`;
  };

  // Get vehicle type icon
  const getVehicleIcon = (tipo) => {
    const icons = {
      'moto': 'bi-bicycle',
      'carro': 'bi-car-front',
      'caminhao': 'bi-truck',
      'pickup': 'bi-truck',
      'carreta': 'bi-truck-flatbed',
      'trator': 'bi-truck-flatbed',
      'onibus': 'bi-bus-front',
      'van': 'bi-truck',
      'outro': 'bi-question-circle'
    };
    return icons[tipo] || 'bi-question-circle';
  };

  // Get vehicle type label
  const getVehicleTypeLabel = (tipo) => {
    const labels = {
      'moto': 'Moto',
      'carro': 'Carro',
      'caminhao': 'Caminhão',
      'pickup': 'Pickup',
      'carreta': 'Carreta',
      'trator': 'Trator',
      'onibus': 'Ônibus',
      'van': 'Van',
      'outro': 'Outro'
    };
    return labels[tipo] || tipo;
  };

  // Get vehicle type color
  const getVehicleTypeColor = (tipo) => {
    const colors = {
      'moto': 'success',
      'carro': 'primary',
      'caminhao': 'warning',
      'pickup': 'info',
      'carreta': 'danger',
      'trator': 'secondary',
      'onibus': 'dark',
      'van': 'info',
      'outro': 'light'
    };
    return colors[tipo] || 'secondary';
  };

  // Handle delete confirmation
  const handleDelete = (veiculo) => {
    if (window.confirm(`Tem certeza que deseja excluir o veículo "${formatPlaca(veiculo.placa)}"?`)) {
      onDelete(veiculo.id);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
        <span className="ms-3 text-muted">Carregando veículos...</span>
      </div>
    );
  }

  if (!veiculos || veiculos.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-truck display-1 text-muted mb-3"></i>
        <h4 className="text-muted mb-2">Nenhum veículo encontrado</h4>
        <p className="text-muted mb-0">
          Clique no botão "Novo Veículo" para começar a cadastrar veículos.
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
              <i className="bi bi-tag me-2"></i>
              Placa
            </th>
            <th scope="col" className="fw-semibold text-primary">
              <i className="bi bi-truck me-2"></i>
              Tipo
            </th>
            <th scope="col" className="fw-semibold text-primary">
              <i className="bi bi-car-front me-2"></i>
              Modelo
            </th>            <th scope="col" className="fw-semibold text-primary">
              <i className="bi bi-palette me-2"></i>
              Cor Veículo
            </th>
            <th scope="col" className="fw-semibold text-primary">
              <i className="bi bi-person me-2"></i>
              Cliente
            </th>
            <th scope="col" className="fw-semibold text-primary text-center">
              <i className="bi bi-gear me-2"></i>
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {veiculos.map((veiculo) => (
            <tr key={veiculo.id}>
              <td>
                <div className="d-flex align-items-center">
                  <span className="badge bg-dark fs-6 font-monospace me-3">
                    {formatPlaca(veiculo.placa)}
                  </span>
                  <small className="text-muted">ID: {veiculo.id}</small>
                </div>
              </td>
              <td>
                <span className={`badge bg-${getVehicleTypeColor(veiculo.tipoDeVeiculo)}`}>
                  <i className={`${getVehicleIcon(veiculo.tipoDeVeiculo)} me-1`}></i>
                  {getVehicleTypeLabel(veiculo.tipoDeVeiculo)}
                </span>
              </td>
              <td>
                <span className="fw-medium text-dark">{veiculo.modelo}</span>
              </td>              <td>
                <span className="text-dark fw-medium">{veiculo.cor}</span>
              </td>
              <td>
                {veiculo.cliente ? (
                  <div>
                    <div className="fw-semibold text-dark">{veiculo.cliente.nome}</div>
                    <small className="text-muted">{veiculo.cliente.cpf}</small>
                  </div>
                ) : (
                  <small className="text-muted">Cliente não encontrado</small>
                )}
              </td>
              <td>
                <div className="d-flex justify-content-center gap-1">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => onEdit(veiculo)}
                    title="Editar veículo"
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleDelete(veiculo)}
                    title="Excluir veículo"
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

export default VeiculoClienteList;