import api from './api.js';

class AuthService {
  static async login(login, senha) {
    try {
      const response = await api.post('/auth/login', {
        login,
        senha
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async logout(refreshToken) {
    try {
      await api.post('/auth/logout', { refreshToken });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }

  static async refreshToken(refreshToken) {
    try {
      const response = await api.post('/auth/refresh', {
        refreshToken
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static getToken() {
    return localStorage.getItem('accessToken');
  }

  static getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  static getUserData() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }

  static setTokens(accessToken, refreshToken) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  static setUserData(userData) {
    localStorage.setItem('userData', JSON.stringify(userData));
  }

  static clearAuth() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
  }

  static isAuthenticated() {
    const token = this.getToken();
    const userData = this.getUserData();
    return !!(token && userData);
  }
}

export default AuthService;
