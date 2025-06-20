import React from 'react';

/**
 * Utilitário para tratamento de mensagens de erro específicas das regras de negócio
 */

export const formatBusinessRuleError = (errorMessage) => {
  console.log('🔍 DEBUG - Mensagem de erro recebida:', errorMessage);
  
  if (!errorMessage) return 'Erro desconhecido';
  
  // Regra de negócio 1: Limite de 3 serviços por dia
  if (errorMessage.includes('Não é possível cadastrar mais de 3 serviços no dia')) {
    console.log('✅ Detectada regra de negócio - Limite de 3 serviços');
    return {
      type: 'business-rule-limit',
      title: 'Regra de Negócio - Limite Diário',
      message: '⚠️ Limite Diário Atingido: Já existem 3 serviços cadastrados para este dia. Escolha outra data ou aguarde a conclusão de serviços existentes.',
      alertClass: 'alert-warning',
      icon: 'bi-calendar-x'
    };
  }
  
  // Regra de negócio 2: Funcionário já alocado
  if (errorMessage.includes('já está alocado em outro serviço pendente')) {
    console.log('✅ Detectada regra de negócio - Funcionário ocupado');
    const funcionarioName = errorMessage.match(/O funcionário (.+?) já está alocado/)?.[1] || 'Este funcionário';
    return {
      type: 'business-rule-employee',
      title: 'Regra de Negócio - Funcionário Ocupado',
      message: `🚫 Funcionário Indisponível: ${funcionarioName} já possui um serviço pendente. Selecione outro funcionário ou aguarde a conclusão do serviço atual.`,
      alertClass: 'alert-info',
      icon: 'bi-person-x'
    };
  }
  
  // Outros erros relacionados a validações
  if (errorMessage.includes('ValidationError') || errorMessage.includes('SequelizeValidationError')) {
    return {
      type: 'validation-error',
      title: 'Erro de Validação',
      message: '📝 Dados Inválidos: Verifique se todos os campos obrigatórios foram preenchidos corretamente.',
      alertClass: 'alert-secondary',
      icon: 'bi-exclamation-circle'
    };
  }
  
  // Erros de conexão
  if (errorMessage.includes('Network Error') || errorMessage.includes('Failed to fetch')) {
    return {
      type: 'network-error',
      title: 'Problema de Conectividade',
      message: '🌐 Erro de Conexão: Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.',
      alertClass: 'alert-dark',
      icon: 'bi-wifi-off'
    };
  }
  
  // Erro genérico
  return {
    type: 'generic-error',
    title: 'Erro no Sistema',
    message: errorMessage,
    alertClass: 'alert-danger',
    icon: 'bi-exclamation-triangle'
  };
};

/**
 * Componente para exibir alertas formatados
 */
export const FormattedAlert = ({ error, onClose }) => {
  if (!error) return null;
  
  const errorInfo = formatBusinessRuleError(error);
  
  return (
    <div className={`alert alert-dismissible fade show mb-4 ${errorInfo.alertClass}`} role="alert">
      <div className="d-flex align-items-start">
        <div className="me-3 mt-1">
          <i className={`${errorInfo.icon} fs-4`}></i>
        </div>
        <div className="flex-grow-1">
          <strong className="d-block mb-1">{errorInfo.title}</strong>
          <div>{errorInfo.message}</div>
        </div>
      </div>
      <button
        type="button"
        className="btn-close"
        onClick={onClose}
      ></button>
    </div>
  );
};
