/**
 * Permission Context - Global Management
 * 
 * Context API to manage global permission state
 * in the application. Supports both clients and administrators.
 * 
 * Features:
 * - Global permission state management
 * - Centralized functions to check permissions
 * - Integration with authentication context
 * - Local storage for persistence
 * - Custom hook for easy access to permission context
 * 
 *
 */


'use client';
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import apiClient from '../lib/apiClient';


/** 
 * Permission Context
 */
const PermissionContext = createContext(null);


/**
 * Permission Provider
 */
export const PermissionProvider = ({ children }) => {
  // Local states of the context
  const [permissions, setPermissions] = useState(null);

  /**
   * FUNÇÃO AUXILIAR PARA BUSCAR PERMISSÕES DO USUÁRIO
   */
  const fetchUserPermissions = async () => {
    try {
      const response = await apiClient.get('/users/permissions/');
      return response.data.permissions || null;
    } catch (erro) {
      console.error('Erro ao buscar permissões do usuário:', erro);
      return null;
    }
  };

    // get permissions from local storage on mount

  const loadPermissionsFromStorage = useCallback(() =>{
    const localPermissions = localStorage.getItem('permissions');
    if(localPermissions){
      return JSON.parse(localPermissions)
    }
    return null;
  });

  useEffect(() => {
      const permissions = loadPermissionsFromStorage();
      console.log('Loaded permissions from storage:', permissions);
      if(!permissions){
        const loadPermissions = async () =>{
          const apiPermissions = await fetchUserPermissions();
          localStorage.setItem('permissions', JSON.stringify(apiPermissions));
          setPermissions(apiPermissions);
        }
        loadPermissions();

    }
    else{
      setPermissions(permissions);
    }
    
  }, []);

  

  return (
    <PermissionContext.Provider value={{ permissions }}>
      {children}
    </PermissionContext.Provider>
  );

}

/** Custom hook to use the Permission Context
 */
export const usePermissions = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }
  return context;

}