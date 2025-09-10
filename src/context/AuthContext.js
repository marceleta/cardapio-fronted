/**
 * CONTEXTO DE AUTENTICAÇÃO - GERENCIAMENTO GLOBAL
 * 
 * Context API para gerenciar estado de autenticação globalmente
 * na aplicação. Suporta tanto clientes quanto administradores.
 * 
 * Funcionalidades:
 * - Estado global de autenticação do usuário
 * - Persistência de token no localStorage
 * - Login para clientes e administradores
 * - Funções de login e logout centralizadas
 * - Hook customizado para facilitar uso
 */

'use client';

import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiClient, { getErrorMessage } from '../lib/apiClient';
import { resolve } from 'styled-jsx/css';
import { data } from 'react-router-dom';

/**
 * CONTEXTO DE AUTENTICAÇÃO
 */
const AuthContext = createContext(null);

/**
 * PROVEDOR DE AUTENTICAÇÃO
 */
export const AuthProvider = ({ children }) => {
  // Estados locais do contexto
  const [user, setUser] = useState({isAuthenticated: false});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  /**
   * LOGIN DE CLIENTE (WhatsApp + Senha)
   */
  const loginClient = async ({ whatsapp, password }) => {
    try {
      setLoading(true);
      setError(null);
      
      // Remove formatação do WhatsApp
      const cleanWhatsApp = whatsapp.replace(/\D/g, '');
      
      // Busca usuário no mock database
      const userData = MOCK_USERS[cleanWhatsApp];
      
      if (userData && userData.password === password) {
        setUser(userData);
        
        // Simula salvamento no localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('authToken', 'client-token-' + Date.now());
        localStorage.setItem('isAuthenticated', 'true');
        
        return { success: true, user: userData };
      } else {
        throw new Error('WhatsApp ou senha incorretos');
      }
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * FUNÇÃO AUXILIAR PARA BUSCAR PERMISSÕES DO USUÁRIO
   */
  
  const fetchUserPermissions = async () => {
    try {
      const response = await apiClient.get('/users/permissions/');
      return response.data.permissions;
    } catch (erro) {
      console.error('Erro ao buscar permissões do usuário:', erro);
      return [];
    }
  };


  /**
   * LOGIN DE ADMINISTRADOR (Email + Senha)
   */

  const loginAdmin = useCallback(async ({ username, password }) => {
    try {
      setLoading(true);
      setError(null);
      
      // Chama API de autenticação
      const response = await apiClient.post('/auth/token/', { username, password });


      // Verifica se a resposta contém dados do usuário
      if (response && response.data) {

        // token JWT
        const token = response.data.access;
        localStorage.setItem('authToken', token);

        // Normaliza dados do usuário
        const dataUser = dataUserNormalized(response);

        // Atualiza estado
        setUser(dataUser);


        localStorage.setItem('user', JSON.stringify(dataUser));

        return { success: true, user: dataUser };
      }

      return { success: false };

    } catch (err) {
      const errorMessage = 'Email ou senha incorretos';
      setError(errorMessage);
      console.error('Erro no login admin:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);


  const dataUserNormalized = (apiResponse) => {

    if(apiResponse && apiResponse.data){

      const { username, access, user_type } = apiResponse.data;
      const isAdmin = (user_type === 'admin' || user_type === 'manager');
      const isClient = (user_type === 'client');

      return {
        username: username,
        isAuthenticated: true,
        token: access,
        user_type: user_type,
        isAdmin: isAdmin,
        isClient: isClient
      }

    }

  }

  /**
   * CADASTRO DE CLIENTE
   */
  const register = async ({ name, whatsapp, email, password }) => {
    try {
      setLoading(true);
      setError(null);
      
      // Remove formatação do WhatsApp
      const cleanWhatsApp = whatsapp.replace(/\D/g, '');
      
      // Verifica se usuário já existe
      if (MOCK_USERS[cleanWhatsApp]) {
        throw new Error('Usuário já cadastrado com este WhatsApp');
      }
      
      // Cria novo usuário
      const newUser = {
        id: Date.now(),
        name,
        whatsapp: cleanWhatsApp,
        email,
        password,
        role: 'client',
        addresses: [],
        orders: []
      };
      
      // Simula salvamento no banco de dados
      MOCK_USERS[cleanWhatsApp] = newUser;
      
      // Faz login automático
      setUser(newUser);
      
      // Simula salvamento no localStorage
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('authToken', 'client-token-' + Date.now());
      localStorage.setItem('isAuthenticated', 'true');
      
      return { success: true, user: newUser };
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  /**
   * LOGOUT UNIVERSAL
   */
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      
      
      await apiClient.post('/auth/logout/');
      
      // Remove dados do localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      
      
      // Limpa estado
      setUser({isAuthenticated: false});
      setError(null);
      
      // Redireciona baseado no tipo de usuário atual
      if (user.user_type === 'admin' || user.user_type === 'manager') {
        router.push('/admin/login');
      } else {
        // Para clientes ou quando não há usuário definido
        router.push('/');
      }
      
    } catch (err) {
      console.error('Erro no logout:', err);
      // Mesmo com erro, limpa dados locais
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      setUser({isAuthenticated: false});

    } finally {
      setLoading(false);
    }
  }, [router, user]);

  /**
   * VERIFICAÇÃO DE AUTENTICAÇÃO
   */
  const checkAuthStatus = useCallback(async () => {
    try {
      
      const user = localStorage.getItem('user');
      const dataUser = JSON.parse(user);
      setUser(dataUser);
      

    } catch (error) {
      console.error('Erro ao restaurar sessão:', error);
      // Remove dados corrompidos
      localStorage.removeItem('user');
      
    }

    return false;
  }, []);

  /**
   * ADICIONA PEDIDO AO HISTÓRICO DO USUÁRIO
   */
  const addOrder = (newOrder) => {
    setUser((prevUser) => {
      if (prevUser && prevUser.role === 'client') {
        const updatedUser = {
          ...prevUser,
          orders: [newOrder, ...(prevUser.orders || [])]
        };
        
        // Atualiza também no mock database
        MOCK_USERS[prevUser.whatsapp] = updatedUser;
        
        // Atualiza localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        return updatedUser;
      }
      return prevUser;
    });
  };

  /**
   * ADICIONA ENDEREÇO AO USUÁRIO
   */
  const addAddress = (newAddress) => {
    setUser((prevUser) => {
      if (prevUser && prevUser.role === 'client') {
        const updatedUser = {
          ...prevUser,
          addresses: [...(prevUser.addresses || []), { ...newAddress, id: Date.now() }]
        };
        
        // Atualiza também no mock database
        MOCK_USERS[prevUser.whatsapp] = updatedUser;
        
        // Atualiza localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        return updatedUser;
      }
      return prevUser;
    });
  };

  /**
   * LIMPAR ERRO
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * RESTAURA SESSÃO (Método legado para compatibilidade)
   */
  const restoreSession = checkAuthStatus;

  return (
    <AuthContext.Provider value={{ 
      // Estados
      user, 
      loading,
      error,
      
      // Métodos de autenticação
      login: loginClient, // Mantém compatibilidade
      loginClient,
      loginAdmin,
      register,
      logout, 
      
      // Métodos de cliente
      addOrder,
      addAddress,
      
      // Utilitários
      restoreSession,
      checkAuthStatus,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * HOOK CUSTOMIZADO PARA AUTENTICAÇÃO
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
