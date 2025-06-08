import React, { useState } from "react";
import { FaUser, FaHome } from "react-icons/fa";
import ClienteManager from "./components/ClienteManager";
import FuncionarioManager from "./components/FuncionarioManager";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("clientes");

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <div className="logo">
          <img src="logo.png" alt="RVM Logo" className="logo-img" />
        </div>
        <div
          className={`menu-item ${currentPage === "home" ? "active" : ""}`}
          onClick={() => handlePageChange("home")}
        >
          <FaHome /> Início
        </div>
        <div
          className={`menu-item ${currentPage === "clientes" ? "active" : ""}`}
          onClick={() => handlePageChange("clientes")}
        >
          <FaUser /> Clientes
        </div>
        <div
          className={`menu-item ${currentPage === "funcionarios" ? "active" : ""}`}
          onClick={() => handlePageChange("funcionarios")}
        >
          <FaUser /> Funcionários
        </div>
        <div
          className={`menu-item ${currentPage === "ordem_servico" ? "active" : ""}`}
          onClick={() => handlePageChange("ordem_servico")}
        >
          <FaUser /> Ordem de Serviço
        </div>
        <div
          className={`menu-item ${currentPage === "fim_servico" ? "active" : ""}`}
          onClick={() => handlePageChange("fim_servico")}
        >
          <FaUser /> Finalizar Serviço
        </div>
        <div
          className={`menu-item ${currentPage === "ordem_servico" ? "active" : ""}`}
          onClick={() => handlePageChange("ordem_servico")}
        >
          <FaUser /> Ordem de Serviço
        </div>
        
      </div>

      <div className="main-content">
        {/* <div className="content-header">
          <h1>
            <FaUser /> Clientes
          </h1>
          <p>Cadastro de clientes: Incluir, Listar, Alterar e Excluir!</p>
        </div> */}

        {currentPage === "clientes" && <ClienteManager />}
        {currentPage === "funcionarios" && <FuncionarioManager />}
        {currentPage === "home" && (
          <div className="welcome-content">
            <h2>Bem-vindo ao GuinchoLink</h2>
            <p>Utilize o menu lateral para navegar entre as funcionalidades.</p>
          </div>
        )}
      </div>

      <div className="footer">
        <p>
          Sistema de Gerenciamento de Guincho desenvolvido por{" "}
          <span style={{ fontWeight: "bold" }}>Welington Gulinelli</span>
        </p>
      </div>
    </div>
  );
}

export default App;
