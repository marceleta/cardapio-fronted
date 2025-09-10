/**
 * TESTES PARA PERMISSION CONTEXT
 * 
 * Este arquivo contém testes abrangentes para o PermissionContext seguindo as
 * práticas definidas no DOC_JEST_PADROES_PRATICAS.MD
 */

import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import { PermissionProvider, usePermissions } from '../permissionContext';
import '@testing-library/jest-dom';
import { data } from 'react-router-dom';
import 'jest-localstorage-mock'

jest.mock('../../lib/apiClient', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

// Mock do localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => { store[key] = value.toString(); }),
    clear: jest.fn(() => { store = {}; }),
    removeItem: jest.fn((key) => { delete store[key]; }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

const apiClient = require('../../lib/apiClient').default;

// Helper component to test context
function PermissionConsumer() {
  const { permissions } = usePermissions();
  if (!permissions) return <div data-testid="permissions">Carregando...</div>;
  return (
    <div data-testid="permissions">
      <div data-testid="user-type">{permissions.user_type}</div>
      <div data-testid="products.can_create">{String(permissions.products.can_create)}</div>
      <div data-testid="products.can_edit">{String(permissions.products.can_edit)}</div>
      <div data-testid="products.can_delete">{String(permissions.products.can_delete)}</div>
      <div data-testid="products.can_view">{String(permissions.products.can_view)}</div>
      <div data-testid="users.can_create">{String(permissions.users.can_create)}</div>
      <div data-testid="users.can_edit">{String(permissions.users.can_edit)}</div>
      <div data-testid="users.can_delete">{String(permissions.users.can_delete)}</div>
      <div data-testid="users.can_view">{String(permissions.users.can_view)}</div>
      <div data-testid="company.can_edit">{String(permissions.company.can_edit)}</div>
      <div data-testid="company.can_view">{String(permissions.company.can_view)}</div>
    </div>
  );
}




describe('PermissionContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should provide default null permissions when no user is logged in', async () => {

    apiClient.get.mockResolvedValue({
      data: {
        permissions: {
          products: {
            can_create: false,
            can_edit: false,
            can_delete: false,
            can_view: true,
          },
          users: {
            can_create: false,
            can_edit: false,
            can_delete: false,
            can_view: true,
          },
          company: {
            can_edit: false,
            can_view: true,
          },
          user_type: 'manager',
        }
      }
    });

    render(
      <PermissionProvider>
        <PermissionConsumer />
      </PermissionProvider>
    )

    await waitFor(() =>{
      expect(screen.getByTestId('products.can_create')).toHaveTextContent('false');
      expect(screen.getByTestId('user-type')).toHaveTextContent('manager');
    })

    
  });

  it('should permissions in localStorage when user is logged in', async () => {

    // 1. Defina os dados de permissão que você espera
    const mockPermissions = {
      products: { can_create: false, can_edit: false, can_delete: false, can_view: true },
      users: { can_create: false, can_edit: false, can_delete: false, can_view: true },
      company: { can_edit: false, can_view: true },
      user_type: 'manager',
    };

    // 3. Mock do localStorage.getItem para retornar os dados mockados
    localStorage.getItem.mockReturnValue(JSON.stringify(mockPermissions));
    
    // Garanta que a chamada à API nunca seja resolvida
    apiClient.get.mockRejectedValue(new Error('API call should not have been made'));


    
    render(
      <PermissionProvider>
        <PermissionConsumer />
      </PermissionProvider>
    )


  await waitFor(() => {
    expect(localStorage.getItem).toHaveBeenCalled();
    expect(apiClient.get).not.toHaveBeenCalled();
    expect(screen.getByTestId('products.can_create')).toHaveTextContent('false');

    });

  });


});