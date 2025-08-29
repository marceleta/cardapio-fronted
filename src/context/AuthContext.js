'use client';

import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

// Mock user database - in a real app, this would be handled by a backend API
const MOCK_USERS = {
  '11999998888': {
    id: 1,
    name: 'Marcelo Silva',
    whatsapp: '11999998888',
    email: 'marcelo@email.com',
    password: '1234',
    addresses: [
      {
        id: 1,
        cep: '01234-567',
        street: 'Rua das Flores',
        number: '123',
        complement: 'Apto 45',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        reference: 'Próximo à praça'
      }
    ],
    orders: [
      {
        id: 'ORD001',
        date: new Date('2025-08-12T10:00:00Z'),
        status: 'entregue',
        items: [{ name: 'Classic Burger', quantity: 1, price: '25,00' }],
        totalPrice: 25.00,
      },
      {
        id: 'ORD002',
        date: new Date('2025-08-13T14:30:00Z'),
        status: 'em produção',
        items: [{ name: 'Bacon Burger', quantity: 1, price: '28,00' }, { name: 'Coca-Cola', quantity: 1, price: '5,00' }],
        totalPrice: 33.00,
      },
    ],
  },
  '11888887777': {
    id: 2,
    name: 'Ana Costa',
    whatsapp: '11888887777',
    email: 'ana@email.com',
    password: 'senha123',
    addresses: [],
    orders: []
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * REALIZA LOGIN DO USUÁRIO
   */
  const login = async ({ whatsapp, password }) => {
    try {
      // Remove formatação do WhatsApp
      const cleanWhatsApp = whatsapp.replace(/\D/g, '');
      
      // Busca usuário no mock database
      const userData = MOCK_USERS[cleanWhatsApp];
      
      if (userData && userData.password === password) {
        setUser(userData);
        setIsAuthenticated(true);
        
        // Simula salvamento no localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('isAuthenticated', 'true');
        
        return { success: true, user: userData };
      } else {
        return { 
          success: false, 
          message: 'WhatsApp ou senha incorretos' 
        };
      }
    } catch (error) {
      console.error('Erro no login:', error);
      return { 
        success: false, 
        message: 'Erro interno. Tente novamente.' 
      };
    }
  };

  /**
   * REALIZA CADASTRO DE NOVO USUÁRIO
   */
  const register = async ({ name, whatsapp, email, password }) => {
    try {
      // Remove formatação do WhatsApp
      const cleanWhatsApp = whatsapp.replace(/\D/g, '');
      
      // Verifica se usuário já existe
      if (MOCK_USERS[cleanWhatsApp]) {
        return { 
          success: false, 
          message: 'Usuário já cadastrado com este WhatsApp' 
        };
      }
      
      // Cria novo usuário
      const newUser = {
        id: Date.now(),
        name,
        whatsapp: cleanWhatsApp,
        email,
        password,
        addresses: [],
        orders: []
      };
      
      // Simula salvamento no banco de dados
      MOCK_USERS[cleanWhatsApp] = newUser;
      
      // Faz login automático
      setUser(newUser);
      setIsAuthenticated(true);
      
      // Simula salvamento no localStorage
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('isAuthenticated', 'true');
      
      return { success: true, user: newUser };
    } catch (error) {
      console.error('Erro no cadastro:', error);
      return { 
        success: false, 
        message: 'Erro interno. Tente novamente.' 
      };
    }
  };

  /**
   * REALIZA LOGOUT DO USUÁRIO
   */
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    
    // Remove dados do localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
  };

  /**
   * ADICIONA PEDIDO AO HISTÓRICO DO USUÁRIO
   */
  const addOrder = (newOrder) => {
    setUser((prevUser) => {
      if (prevUser) {
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
      if (prevUser) {
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
   * RESTAURA SESSÃO DO USUÁRIO
   */
  const restoreSession = () => {
    try {
      const savedUser = localStorage.getItem('user');
      const savedAuth = localStorage.getItem('isAuthenticated');
      
      if (savedUser && savedAuth === 'true') {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
        return true;
      }
    } catch (error) {
      console.error('Erro ao restaurar sessão:', error);
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated,
      login, 
      register,
      logout, 
      addOrder,
      addAddress,
      restoreSession
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
