import React, { useState, useEffect } from 'react';
import { fimServicoService } from '../services/fimServicoService';
import { clienteService } from '../services/clienteService';
import { veiculoClienteService } from '../services/veiculoClienteService';
import { servicoService } from '../services/servicoService';

const Dashboard = () => {
  const [fimServicos, setFimServicos] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [veiculosClientes, setVeiculosClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Carregar dados de fim de serviços, serviços, clientes e veículos de clientes
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const [fimServicosData, servicosData, clientesData, veiculosClientesData] = await Promise.all([
        fimServicoService.findAll(),
        servicoService.findAll(),
        clienteService.findAll(),
        veiculoClienteService.findAll()
      ]);
      setFimServicos(fimServicosData || []);
      setServicos(servicosData || []);
      setClientes(clientesData || []);
      setVeiculosClientes(veiculosClientesData || []);
    } catch (error) {
      setError(error.message);
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Processar dados para o gráfico de linhas
  const processLineChartData = () => {
    if (!fimServicos || fimServicos.length === 0) return { data: [], maxValue: 0 };

    // Ordenar por data de finalização
    const sortedData = fimServicos
      .filter(item => item.hora_finalizacao && item.valor_total)
      .sort((a, b) => new Date(a.hora_finalizacao) - new Date(b.hora_finalizacao))
      .map(item => ({
        date: new Date(item.hora_finalizacao),
        value: parseFloat(item.valor_total),
        servicoId: item.servico_id
      }));

    const maxValue = Math.max(...sortedData.map(d => d.value), 0);
    
    return { data: sortedData, maxValue };
  };

  // Calcular estatísticas dos dados reais
  const getStats = () => {
    const totalServicos = fimServicos.length;
    const totalClientes = clientes.length;
    const totalVeiculosClientes = veiculosClientes.length;
    const totalReceita = fimServicos.reduce((sum, item) => sum + parseFloat(item.valor_total || 0), 0);
    
    return [
      {
        title: 'Total de Clientes',
        value: totalClientes.toString(),
        icon: 'bi-people-fill',
        color: 'primary',
        change: '+8%',
        changeType: 'increase'
      },
      {
        title: 'Receita Total',
        value: `R$ ${totalReceita.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        icon: 'bi-currency-dollar',
        color: 'success',
        change: '+18%',
        changeType: 'increase'
      },
      {
        title: 'Valor Médio por Serviço',
        value: totalServicos > 0 ? `R$ ${(totalReceita / totalServicos).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'R$ 0,00',
        icon: 'bi-calculator',
        color: 'info',
        change: '+5%',
        changeType: 'increase'
      },
      {
        title: 'Veículos de Clientes',
        value: totalVeiculosClientes.toString(),
        icon: 'bi-car-front-fill',
        color: 'secondary',
        change: '+3%',
        changeType: 'increase'
      }
    ];
  };

  // Renderizar gráfico de linhas SVG
  const LineChart = ({ data, maxValue }) => {
    const [hoveredPoint, setHoveredPoint] = useState(null);
    
    if (!data || data.length === 0) {
      return (
        <div className="d-flex align-items-center justify-content-center" style={{ height: '400px' }}>
          <p className="text-muted">Nenhum dado disponível para o gráfico</p>
        </div>
      );
    }

    const containerWidth = 100; // Use percentage-based width
    const width = 700; // Fixed internal SVG width for calculations
    const height = 400;
    const margin = { top: 20, right: 80, bottom: 60, left: 80 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Escalas
    const minDate = data[0].date;
    const maxDate = data[data.length - 1].date;
    const dateRange = maxDate.getTime() - minDate.getTime();

    const getX = (date) => (date.getTime() - minDate.getTime()) / dateRange * chartWidth;
    const getY = (value) => chartHeight - (value / maxValue) * chartHeight;

    // Criar linha
    const pathData = data.map((d, i) => {
      const x = getX(d.date);
      const y = getY(d.value);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');

    return (
      <div className="position-relative w-100">
        <div className="w-100">
          <svg 
            width="100%" 
            height={height} 
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="xMidYMid meet"
            className="border"
          >
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e9ecef" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect x={margin.left} y={margin.top} width={chartWidth} height={chartHeight} fill="url(#grid)" />
          
          {/* Eixos */}
          <g transform={`translate(${margin.left}, ${margin.top})`}>
            {/* Eixo Y */}
            <line x1="0" y1="0" x2="0" y2={chartHeight} stroke="#000" strokeWidth="2"/>
            {/* Eixo X */}
            <line x1="0" y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="#000" strokeWidth="2"/>
            
            {/* Labels do eixo Y */}
            {[0, 0.25, 0.5, 0.75, 1].map(ratio => (
              <g key={ratio}>
                <line 
                  x1="-5" 
                  y1={chartHeight - ratio * chartHeight} 
                  x2="0" 
                  y2={chartHeight - ratio * chartHeight} 
                  stroke="#000" 
                />
                <text 
                  x="-10" 
                  y={chartHeight - ratio * chartHeight + 5} 
                  textAnchor="end" 
                  fontSize="12"
                  fill="#666"
                >
                  R$ {(maxValue * ratio).toFixed(0)}
                </text>
              </g>
            ))}
            
            {/* Labels do eixo X */}
            {data.filter((_, i) => i % Math.ceil(data.length / 5) === 0).map((d, i) => (
              <g key={i}>
                <line 
                  x1={getX(d.date)} 
                  y1={chartHeight} 
                  x2={getX(d.date)} 
                  y2={chartHeight + 5} 
                  stroke="#000" 
                />
                <text 
                  x={getX(d.date)} 
                  y={chartHeight + 20} 
                  textAnchor="middle" 
                  fontSize="12"
                  fill="#666"
                >
                  {d.date.toLocaleDateString('pt-BR', { month: '2-digit', day: '2-digit' })}
                </text>
              </g>
            ))}
            
            {/* Linha do gráfico */}
            <path 
              d={pathData} 
              fill="none" 
              stroke="#007bff" 
              strokeWidth="3"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            
            {/* Pontos */}
            {data.map((d, i) => (
              <circle
                key={i}
                cx={getX(d.date)}
                cy={getY(d.value)}
                r="6"
                fill="#007bff"
                stroke="#fff"
                strokeWidth="2"
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredPoint(d)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            ))}
          </g>
          
          {/* Título dos eixos */}
          <text x={width / 2} y={height - 10} textAnchor="middle" fontSize="14" fill="#333">
            Data de Finalização
          </text>
          <text 
            x="20" 
            y={height / 2} 
            textAnchor="middle" 
            fontSize="14" 
            fill="#333"
            transform={`rotate(-90, 20, ${height / 2})`}
          >
            Valor (R$)
          </text>
        </svg>
        </div>
        
        {/* Tooltip */}
        {hoveredPoint && (
          <div 
            className="position-absolute bg-dark text-white p-2 rounded small"
            style={{
              top: '10px',
              right: '10px',
              zIndex: 1000,
              pointerEvents: 'none'
            }}
          >
            <div><strong>Serviço ID:</strong> {hoveredPoint.servicoId}</div>
            <div><strong>Data:</strong> {hoveredPoint.date.toLocaleDateString('pt-BR')}</div>
            <div><strong>Valor:</strong> R$ {hoveredPoint.value.toFixed(2)}</div>
          </div>
        )}
      </div>
    );
  };

  const stats = getStats();
  const { data: lineChartData, maxValue } = processLineChartData();

  // Obter serviços recentes dos dados reais (todos os serviços, não apenas finalizados)
  const getRecentServices = () => {
    if (!servicos || servicos.length === 0) return [];
    
    return servicos
      .sort((a, b) => new Date(b.hora_solicitacao) - new Date(a.hora_solicitacao))
      .slice(0, 5)
      .map(item => {
        // Mapear status para português
        const statusMap = {
          'pendente': { label: 'Pendente', class: 'bg-warning text-dark' },
          'em_andamento': { label: 'Em Andamento', class: 'bg-info' },
          'concluido': { label: 'Concluído', class: 'bg-success' },
          'cancelado': { label: 'Cancelado', class: 'bg-danger' }
        };
        
        const statusInfo = statusMap[item.status] || { label: item.status || 'N/A', class: 'bg-secondary' };
        
        return {
          id: item.id,
          cliente: item.cliente?.nome || item.cliente_nome || 'Cliente não informado',
          servico: `Serviço #${item.id}`,
          status: statusInfo.label,
          statusClass: statusInfo.class,
          tipoServico: item.tipo_servico?.nome || 'Tipo não informado',
          funcionario: item.funcionario?.nome || 'Funcionário não atribuído',
          data: new Date(item.hora_solicitacao).toLocaleDateString('pt-BR'),
          hora: new Date(item.hora_solicitacao).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          localizacao: item.localizacao || 'Localização não informada'
        };
      });
  };

  const recentServices = getRecentServices();

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

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        <h4>Erro ao carregar dados</h4>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadDashboardData}>
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="h-100 d-flex flex-column overflow-hidden">
      <div className="flex-grow-1 overflow-y-auto overflow-x-hidden stats-area" style={{ maxHeight: 'calc(100vh - 140px)' }}>
      {/* Welcome Section - Compact */}
      <div className="row mb-2 flex-shrink-0">
        <div className="col-12">
          <div className="bg-gradient-primary text-white p-3 rounded-3">
            <div className="d-flex align-items-center">
              <img 
                src="/GuinchoLink-Front/guincho.png" 
                alt="GuinchoLink" 
                style={{ width: '60px', height: '60px' }}
                className="me-3"
              />
              <div>
                <h3 className="mb-1">Bem-vindo ao GuinchoLink!</h3>
                <p className="mb-0 opacity-75 small">
                  Painel de controle para gerenciamento de serviços
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>      {/* Stats Cards */}
      <div className="row mb-2 flex-shrink-0">
        {stats.map((stat, index) => (
          <div key={index} className="col-xl-3 col-md-6 mb-2">
            <div className={`card shadow h-100 stats-card ${stat.color}`}>
              <div className="card-body p-2">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className={`text-xs font-weight-bold text-${stat.color} text-uppercase mb-1 small`}>
                      {stat.title}
                    </div>
                    <div className="h6 mb-0 font-weight-bold" style={{ color: 'var(--primary-blue)' }}>
                      {stat.value}
                    </div>
                    <div className="mt-1">
                      <small className={`text-${stat.changeType === 'increase' ? 'success' : 'muted'}`}>
                        <i className={`bi ${stat.changeType === 'increase' ? 'bi-arrow-up' : 'bi-dash'} me-1`}></i>
                        {stat.change}
                      </small>
                    </div>
                  </div>
                  <div className="col-auto">
                    <i className={`${stat.icon} text-${stat.color}`} style={{ fontSize: '1.2rem' }}></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Recent Activity */}
      <div className="row flex-grow-1 mb-2">
        {/* Line Chart Area */}
        <div className="col-xl-8 col-lg-7 d-flex mb-2 mb-lg-0">
          <div className="card shadow w-100">
            <div className="card-header py-2 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 font-weight-bold text-primary">
                <i className="bi bi-graph-up me-2"></i>
                Receita por Data de Finalização
              </h6>
            </div>
            <div className="card-body p-3 overflow-hidden">
              <LineChart data={lineChartData} maxValue={maxValue} />
            </div>
          </div>
        </div>

        {/* Recent Services */}
        <div className="col-xl-4 col-lg-5 d-flex">
          <div className="card shadow w-100">
            <div className="card-header py-2">
              <h6 className="m-0 font-weight-bold text-primary">
                <i className="bi bi-clock-fill me-2"></i>
                Serviços Recentes
              </h6>
            </div>
            <div className="card-body p-2 service-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {recentServices.length > 0 ? (
                <div className="list-group list-group-flush">
                  {recentServices.map((service) => (
                    <div key={service.id} className="list-group-item border-0 px-0 py-2">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <h6 className="mb-1 small fw-bold">{service.servico}</h6>
                          <p className="mb-1 text-muted small">
                            <i className="bi bi-person me-1"></i>
                            {service.cliente}
                          </p>
                          <p className="mb-1 text-muted small">
                            <i className="bi bi-gear me-1"></i>
                            {service.tipoServico}
                          </p>
                          <p className="mb-1 text-muted small">
                            <i className="bi bi-person-badge me-1"></i>
                            {service.funcionario}
                          </p>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className={`badge ${service.statusClass} small`}>
                              {service.status}
                            </span>
                            <small className="text-muted">
                              <i className="bi bi-calendar me-1"></i>
                              {service.data} {service.hora}
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted py-4">
                  <i className="bi bi-inbox display-6 mb-2"></i>
                  <p className="small mb-0">Nenhum serviço encontrado</p>
                  <small className="text-muted">Cadastre alguns serviços para vê-los aqui</small>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Dashboard;
