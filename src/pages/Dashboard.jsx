import React from 'react';

const Dashboard = () => {  const stats = [
    {
      title: 'Total de Serviços',
      value: '156',
      icon: 'bi-wrench-adjustable',
      color: 'primary',
      change: '+12%',
      changeType: 'increase'
    },
    {
      title: 'Clientes Ativos',
      value: '89',
      icon: 'bi-people-fill',
      color: 'success',
      change: '+5%',
      changeType: 'increase'
    },
    {
      title: 'Funcionários',
      value: '12',
      icon: 'bi-person-badge-fill',
      color: 'info',
      change: '0%',
      changeType: 'neutral'
    },
    {
      title: 'Receita Mensal',
      value: 'R$ 45.230',
      icon: 'bi-currency-dollar',
      color: 'secondary',
      change: '+18%',
      changeType: 'increase'
    }
  ];

  const recentServices = [
    {
      id: 1,
      cliente: 'João Silva',
      servico: 'Reboque de Veículo',
      status: 'Concluído',
      valor: 'R$ 150,00',
      data: '2025-06-13'
    },
    {
      id: 2,
      cliente: 'Maria Santos',
      servico: 'Troca de Pneu',
      status: 'Em Andamento',
      valor: 'R$ 80,00',
      data: '2025-06-13'
    },
    {
      id: 3,
      cliente: 'Pedro Costa',
      servico: 'Guincho Pesado',
      status: 'Pendente',
      valor: 'R$ 300,00',
      data: '2025-06-12'
    }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Concluído':
        return 'bg-success';
      case 'Em Andamento':
        return 'bg-warning';
      case 'Pendente':
        return 'bg-secondary';
      default:
        return 'bg-secondary';
    }
  };

  return (
    <div className="h-100 d-flex flex-column overflow-hidden">      {/* Welcome Section */}
      <div className="row mb-3 flex-shrink-0">
        <div className="col-12">
          <div className="bg-gradient-primary text-white p-4 rounded-3">
            <div className="d-flex align-items-center mb-3">              <img 
                src="/guincho.png" 
                alt="GuinchoLink" 
                style={{ width: '80px', height: '80px' }}
                className="me-3"
              />
              <div>
                <h2 className="mb-1">Bem-vindo ao GuinchoLink!</h2>
                <p className="mb-0 opacity-75">
                  Gerencie seus serviços de guincho de forma eficiente e organizada.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>      {/* Stats Cards */}
      <div className="row mb-3 flex-shrink-0">
        {stats.map((stat, index) => (
          <div key={index} className="col-xl-3 col-md-6 mb-2">
            <div className={`card shadow h-100 stats-card ${stat.color}`}>
              <div className="card-body p-3">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className={`text-xs font-weight-bold text-${stat.color} text-uppercase mb-1 small`}>
                      {stat.title}
                    </div>
                    <div className="h5 mb-0 font-weight-bold" style={{ color: 'var(--primary-blue)' }}>
                      {stat.value}
                    </div>
                    <div className="mt-1">
                      <small className={`text-${stat.changeType === 'increase' ? 'success' : 'muted'}`}>
                        <i className={`bi ${stat.changeType === 'increase' ? 'bi-arrow-up' : 'bi-dash'} me-1`}></i>
                        {stat.change} desde o mês passado
                      </small>
                    </div>
                  </div>
                  <div className="col-auto">
                    <i className={`${stat.icon} text-${stat.color}`} style={{ fontSize: '1.5rem' }}></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Recent Activity */}
      <div className="row flex-grow-1 mb-4">        {/* Chart Area */}
        <div className="col-xl-8 col-lg-7 d-flex mb-4 mb-lg-0">
          <div className="card shadow w-100">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 font-weight-bold text-primary">
                <i className="bi bi-graph-up me-2"></i>
                Serviços por Mês
              </h6>
            </div>
            <div className="card-body d-flex align-items-center justify-content-center">
              <div className="text-center" style={{ color: 'var(--gray-600)' }}>
                <i className="bi bi-graph-up display-1 mb-3" style={{ color: 'var(--accent-teal)' }}></i>
                <p>Gráfico de serviços será implementado aqui</p>
                <small>Integração com biblioteca de gráficos pendente</small>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-xl-4 col-lg-5 d-flex">
          <div className="card shadow w-100">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">
                <i className="bi bi-lightning-fill me-2"></i>
                Ações Rápidas
              </h6>
            </div>
            <div className="card-body d-flex flex-column justify-content-center">
              <div className="d-grid gap-3">
                <button className="btn btn-primary btn-lg">
                  <i className="bi bi-plus-circle me-2"></i>
                  Novo Serviço
                </button>
                <button className="btn btn-success btn-lg">
                  <i className="bi bi-person-plus me-2"></i>
                  Novo Cliente
                </button>
                <button className="btn btn-info btn-lg">
                  <i className="bi bi-truck me-2"></i>
                  Novo Veículo
                </button>
                <button className="btn btn-warning btn-lg">
                  <i className="bi bi-file-earmark-text me-2"></i>
                  Relatório
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
