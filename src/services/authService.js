/**
 * SERVIÇO DE AUTENTICAÇÃO - CAMADA DE API
 * 
 * Serviço responsável por centralizar todas as chamadas
 * relacionadas à autenticação e autorização do sistema.
 * 
 * Funcionalidades:
 * - Login de administradores e clientes
 * - Logout e invalidação de sessão
 * - Verificação de token e status de autenticação
 * - Refresh de tokens quando disponível
 * - Recuperação de senha (futuro)
 */

import apiClient, { getErrorMessage } from '../lib/apiClient';

/**
 * SERVIÇO DE AUTENTICAÇÃO
 * 
 * Agrupa todas as operações relacionadas à autenticação
 * seguindo o padrão de camada de serviço.
 */
const authService = {
  /**
   * LOGIN DE ADMINISTRADOR
   * 
   * Autentica administrador com email e senha
   * 
   * @param {Object} credentials - Credenciais de login
   * @param {string} credentials.email - Email do administrador
   * @param {string} credentials.password - Senha do administrador
   * @returns {Promise<Object>} Resposta da API com token e dados do usuário
   */
  async loginAdmin(credentials) {
    try {
      // TODO: Implementar chamada real quando API estiver disponível
      const response = await apiClient.post('/auth/admin/login', credentials);
      return response.data;
    } catch (error) {
      // Log do erro para debugging
      console.error('Erro no login admin:', error);
      throw error;
    }
  },

  /**
   * LOGIN DE CLIENTE
   * 
   * Autentica cliente com WhatsApp e senha
   * 
   * @param {Object} credentials - Credenciais de login
   * @param {string} credentials.whatsapp - WhatsApp do cliente
   * @param {string} credentials.password - Senha do cliente
   * @returns {Promise<Object>} Resposta da API com token e dados do usuário
   */
  async loginClient(credentials) {
    try {
      // TODO: Implementar chamada real quando API estiver disponível
      const response = await apiClient.post('/auth/client/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Erro no login cliente:', error);
      throw error;
    }
  },

  /**
   * CADASTRO DE CLIENTE
   * 
   * Registra novo cliente no sistema
   * 
   * @param {Object} userData - Dados do novo cliente
   * @param {string} userData.name - Nome completo
   * @param {string} userData.whatsapp - Número do WhatsApp
   * @param {string} userData.email - Email do cliente
   * @param {string} userData.password - Senha escolhida
   * @returns {Promise<Object>} Resposta da API com dados do usuário criado
   */
  async registerClient(userData) {
    try {
      // TODO: Implementar chamada real quando API estiver disponível
      const response = await apiClient.post('/auth/client/register', userData);
      return response.data;
    } catch (error) {
      console.error('Erro no cadastro cliente:', error);
      throw error;
    }
  },

  /**
   * LOGOUT UNIVERSAL
   * 
   * Invalida token no servidor e limpa sessão
   * 
   * @returns {Promise<Object>} Confirmação de logout
   */
  async logout() {
    try {
      // TODO: Implementar chamada real quando API estiver disponível
      const response = await apiClient.post('/auth/logout');
      return response.data;
    } catch (error) {
      // Mesmo com erro no servidor, considera logout local bem-sucedido
      console.warn('Erro no logout servidor (continuando logout local):', error);
      return { success: true, message: 'Logout realizado localmente' };
    }
  },

  /**
   * VERIFICAÇÃO DE TOKEN
   * 
   * Valida token atual e retorna dados do usuário
   * 
   * @returns {Promise<Object>} Dados do usuário autenticado
   */
  async verifyToken() {
    try {
      // TODO: Implementar chamada real quando API estiver disponível
      const response = await apiClient.get('/auth/verify');
      return response.data;
    } catch (error) {
      console.error('Erro na verificação de token:', error);
      throw error;
    }
  },

  /**
   * REFRESH DE TOKEN
   * 
   * Obtém novo token usando refresh token
   * 
   * @param {string} refreshToken - Token de refresh
   * @returns {Promise<Object>} Novo token de acesso
   */
  async refreshToken(refreshToken) {
    try {
      // TODO: Implementar quando sistema de refresh tokens estiver disponível
      const response = await apiClient.post('/auth/refresh', {
        refreshToken
      });
      return response.data;
    } catch (error) {
      console.error('Erro no refresh de token:', error);
      throw error;
    }
  },

  /**
   * RECUPERAÇÃO DE SENHA
   * 
   * Solicita reset de senha via email
   * 
   * @param {string} email - Email para envio do reset
   * @returns {Promise<Object>} Confirmação de envio
   */
  async forgotPassword(email) {
    try {
      // TODO: Implementar quando funcionalidade estiver disponível
      const response = await apiClient.post('/auth/forgot-password', {
        email
      });
      return response.data;
    } catch (error) {
      console.error('Erro na recuperação de senha:', error);
      throw error;
    }
  },

  /**
   * RESET DE SENHA
   * 
   * Define nova senha usando token de reset
   * 
   * @param {Object} resetData - Dados para reset
   * @param {string} resetData.token - Token de reset recebido por email
   * @param {string} resetData.newPassword - Nova senha
   * @returns {Promise<Object>} Confirmação de reset
   */
  async resetPassword(resetData) {
    try {
      // TODO: Implementar quando funcionalidade estiver disponível
      const response = await apiClient.post('/auth/reset-password', resetData);
      return response.data;
    } catch (error) {
      console.error('Erro no reset de senha:', error);
      throw error;
    }
  },

  /**
   * ALTERAÇÃO DE SENHA
   * 
   * Altera senha do usuário autenticado
   * 
   * @param {Object} passwordData - Dados da alteração
   * @param {string} passwordData.currentPassword - Senha atual
   * @param {string} passwordData.newPassword - Nova senha
   * @returns {Promise<Object>} Confirmação de alteração
   */
  async changePassword(passwordData) {
    try {
      // TODO: Implementar quando funcionalidade estiver disponível
      const response = await apiClient.put('/auth/change-password', passwordData);
      return response.data;
    } catch (error) {
      console.error('Erro na alteração de senha:', error);
      throw error;
    }
  }
};

/**
 * UTILITÁRIOS DE AUTENTICAÇÃO
 */

/**
 * Verifica se token existe no localStorage
 * 
 * @returns {boolean} True se token existe
 */
export const hasValidToken = () => {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem('authToken');
  return !!token;
};

/**
 * Obtém dados do usuário do localStorage
 * 
 * @returns {Object|null} Dados do usuário ou null
 */
export const getUserFromStorage = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Erro ao recuperar dados do usuário:', error);
    return null;
  }
};

/**
 * Remove dados de autenticação do localStorage
 */
export const clearAuthData = () => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  localStorage.removeItem('isAuthenticated');
};

/**
 * Armazena dados de autenticação no localStorage
 * 
 * @param {string} token - Token JWT
 * @param {Object} user - Dados do usuário
 */
export const storeAuthData = (token, user) => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('authToken', token);
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('isAuthenticated', 'true');
};

// Exportação padrão do serviço
export default authService;
