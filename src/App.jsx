import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TipoServicoPage from './pages/TipoServicoPage';
import Clientes from './pages/Clientes';
import Servicos from './pages/Servicos';
import ServicosListagem from './pages/ServicosListagem';
import ServicosPorFuncionario from './pages/ServicosPorFuncionario';
import Funcionarios from './pages/Funcionarios';
import AdministradoresPage from './pages/AdministradoresPage';
import VeiculosEmpresa from './pages/VeiculosEmpresa';
import VeiculosClientes from './pages/VeiculosClientes';
import Relatorios from './pages/Relatorios';
import FimServicos from './pages/FimServicos';
import Feedbacks from './pages/Feedbacks';
import EstatisticasGerais from './pages/EstatisticasGerais';
import EstatisticasPorCliente from './pages/EstatisticasPorCliente';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router 
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <Routes>
          {/* Rota de login (pública) */}
          <Route path="/login" element={<Login />} />
          
          {/* Rotas protegidas */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout>
                <Navigate to="/dashboard" replace />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/tipos-servico" element={
            <ProtectedRoute>
              <Layout>
                <TipoServicoPage />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/clientes" element={
            <ProtectedRoute>
              <Layout>
                <Clientes />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/servicos" element={
            <ProtectedRoute>
              <Layout>
                <Servicos />
              </Layout>
            </ProtectedRoute>
          } />
            <Route path="/servicos-listagem" element={
            <ProtectedRoute>
              <Layout>
                <ServicosListagem />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/servicos-por-funcionario" element={
            <ProtectedRoute>
              <Layout>
                <ServicosPorFuncionario />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/funcionarios" element={
            <ProtectedRoute>
              <Layout>
                <Funcionarios />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/administradores" element={
            <ProtectedRoute>
              <Layout>
                <AdministradoresPage />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/veiculos-empresa" element={
            <ProtectedRoute>
              <Layout>
                <VeiculosEmpresa />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/veiculos-clientes" element={
            <ProtectedRoute>
              <Layout>
                <VeiculosClientes />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/relatorios" element={
            <ProtectedRoute>
              <Layout>
                <Relatorios />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/fim-servicos" element={
            <ProtectedRoute>
              <Layout>
                <FimServicos />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/feedbacks" element={
            <ProtectedRoute>
              <Layout>
                <Feedbacks />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/estatisticas-gerais" element={
            <ProtectedRoute>
              <Layout>
                <EstatisticasGerais />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/estatisticas-cliente" element={
            <ProtectedRoute>
              <Layout>
                <EstatisticasPorCliente />
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
