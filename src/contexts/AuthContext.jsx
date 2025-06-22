import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há um usuário autenticado ao inicializar
    const userData = AuthService.getUserData();
    if (userData && AuthService.isAuthenticated()) {
      setUser(userData);
    }
    setLoading(false);
  }, []);

  const login = async (loginData, senha) => {
    try {
      const response = await AuthService.login(loginData, senha);
      console.log('Resposta do login:', response); // Debug
      
      // A resposta pode vir com os dados diretamente ou dentro de 'data'
      const responseData = response.data || response;
      const { administrador, accessToken, refreshToken } = responseData;

      if (!administrador || !accessToken) {
        throw new Error('Dados de autenticação incompletos');
      }

      // Armazenar tokens e dados do usuário
      AuthService.setTokens(accessToken, refreshToken);
      AuthService.setUserData(administrador);

      setUser(administrador);

      return { success: true };
    } catch (error) {
      console.error('Erro no login:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Erro ao fazer login' 
      };
    }
  };

  const logout = async () => {
    try {
      const refreshToken = AuthService.getRefreshToken();
      if (refreshToken) {
        await AuthService.logout(refreshToken);
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      // Limpar dados locais
      AuthService.clearAuth();
      setUser(null);
    }
  };

  const refreshToken = async () => {
    try {
      const refreshToken = AuthService.getRefreshToken();
      if (!refreshToken) {
        throw new Error('Refresh token não encontrado');
      }

      const response = await AuthService.refreshToken(refreshToken);
      const { accessToken, refreshToken: newRefreshToken } = response;

      AuthService.setTokens(accessToken, newRefreshToken);

      return accessToken;
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      logout();
      throw error;
    }
  };

  const isAuthenticated = () => {
    return !!user && AuthService.isAuthenticated();
  };

  const value = {
    user,
    setUser,
    login,
    logout,
    refreshToken,
    isAuthenticated,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
