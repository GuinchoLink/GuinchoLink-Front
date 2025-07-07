import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/common/Layout';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import TipoServicoPage from './pages/servicos/TipoServicoPage';
import Clientes from './pages/usuarios/Clientes';
import Servicos from './pages/servicos/Servicos';
import ServicosListagem from './pages/servicos/ServicosListagem';
import ServicosPorFuncionario from './pages/servicos/ServicosPorFuncionario';
import Funcionarios from './pages/usuarios/Funcionarios';
import AdministradoresPage from './pages/usuarios/AdministradoresPage';
import VeiculosEmpresa from './pages/veiculos/VeiculosEmpresa';
import VeiculosClientes from './pages/veiculos/VeiculosClientes';
import Relatorios from './pages/relatorios/Relatorios';
import FimServicos from './pages/servicos/FimServicos';
import Feedbacks from './pages/feedbacks/Feedbacks';
import EstatisticasGerais from './pages/relatorios/EstatisticasGerais';
import EstatisticasPorCliente from './pages/relatorios/EstatisticasPorCliente';
import Perfil from './pages/auth/Perfil';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router basename="/GuinchoLink-Front">
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
          
          <Route path="/perfil" element={
            <ProtectedRoute>
              <Layout>
                <Perfil />
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
