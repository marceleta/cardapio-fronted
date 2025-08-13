'use client';

import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

// Mock user data - in a real app, this would come from an API
const MOCK_USER = {
  name: 'Marcelo',
  whatsapp: '11999998888',
  address: 'Rua das Flores, 123, São Paulo, SP',
  // Add a mock orders array
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
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (whatsapp, password) => {
    // Mock login logic
    if (whatsapp === '11999998888' && password === '1234') {
      setUser(MOCK_USER);
      return true;
    } 
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  // Function to add an order to the user's orders
  const addOrder = (newOrder) => {
    setUser((prevUser) => {
      if (prevUser) {
        // Ensure orders array exists and add the new order to the beginning
        const updatedOrders = [newOrder, ...(prevUser.orders || [])];
        return { ...prevUser, orders: updatedOrders };
      }
      return prevUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, addOrder }}>
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
