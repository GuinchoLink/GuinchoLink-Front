import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import TipoServicoPage from './pages/TipoServicoPage';
import Clientes from './pages/Clientes';
import Servicos from './pages/Servicos';
import Funcionarios from './pages/Funcionarios';
import AdministradoresPage from './pages/AdministradoresPage';
import VeiculosEmpresa from './pages/VeiculosEmpresa';
import VeiculosClientes from './pages/VeiculosClientes';
import Relatorios from './pages/Relatorios';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tipos-servico" element={<TipoServicoPage />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/servicos" element={<Servicos />} />
          <Route path="/funcionarios" element={<Funcionarios />} />
          <Route path="/administradores" element={<AdministradoresPage />} />
          <Route path="/veiculos-empresa" element={<VeiculosEmpresa />} />
          <Route path="/veiculos-clientes" element={<VeiculosClientes />} />
          <Route path="/relatorios" element={<Relatorios />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
