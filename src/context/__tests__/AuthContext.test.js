import React from 'react';
import { render, act, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthProvider, useAuth } from '../AuthContext';

// Mock apiClient and getErrorMessage
jest.mock('../../lib/apiClient', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    get: jest.fn(),
  },
  getErrorMessage: jest.fn((err) => err.message || 'Erro desconhecido'),
}));

// Mock do useRouter do Next.js
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

const apiClient = require('../../lib/apiClient').default;
const { getErrorMessage } = require('../../lib/apiClient');

// Helper component to test context
function AuthConsumer() {
  const auth = useAuth();
  return (
    <div>
      <div data-testid="isAuthenticated">{auth.user.isAuthenticated.toString()}</div>
      <div data-testid="user-type">{auth.user.user_type || 'undefined'}</div>
      <div data-testid="loading">{auth.loading.toString()}</div>
      <div data-testid="error">{auth.error || 'null'}</div>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should provide default unauthenticated user', () => {
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId('isAuthenticated')).toHaveTextContent('false');
    expect(screen.getByTestId('user-type')).toHaveTextContent('undefined');
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
    expect(screen.getByTestId('error')).toHaveTextContent('null');
  });

  it('should login admin successfully', async () => {
    // Mock para login bem-sucedido
    apiClient.post.mockResolvedValue({
      data: {
        access: 'mock-token',
        username: 'admin@test.com',
        user_type: 'admin'
      }
    });

    // Mock successful permissions fetch
    apiClient.get.mockResolvedValue({
      data: { permissions: ['manager'] }
    });

    let auth;
    function TestComponent() {
      auth = useAuth();
      // Auto-execute login when component mounts
      React.useEffect(() => {
        if (auth && !auth.loading && !auth.user.isAuthenticated) {
          auth.loginAdmin({ username: 'admin@test.com', password: 'password123' });
        }
      }, [auth]);
      return null;
    }

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for the async operations to complete
    await waitFor(() => {
      expect(auth.user.isAuthenticated).toBe(true);
    }, { timeout: 3000 });

    expect(apiClient.post).toHaveBeenCalledWith('/auth/token/', {
      username: 'admin@test.com',
      password: 'password123'
    });
    expect(auth.user.user_type).toBe('admin');
  });

  it('should handle admin login error', async () => {
    // Mock failed login
    const errorObj = new Error('fail');
    apiClient.post.mockRejectedValue(errorObj);
    getErrorMessage.mockReturnValue('Email ou senha incorretos');

    let auth;
    function TestComponent() {
      auth = useAuth();
      React.useEffect(() => {
        if (auth && !auth.loading && !auth.user.isAuthenticated) {
          auth.loginAdmin({ username: 'admin@test.com', password: 'wrongpassword' });
        }
      }, [auth]);
      return null;
    }

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(auth.error).toBe('Email ou senha incorretos');
    }, { timeout: 3000 });

    expect(auth.user.isAuthenticated).toBe(false);
    expect(apiClient.post).toHaveBeenCalledWith('/auth/token/', {
      username: 'admin@test.com',
      password: 'wrongpassword'
    });
  });

  it('should logout and clear user', async () => {
    // Mock logout API call
    apiClient.post.mockResolvedValue({ data: { success: true } });
    
    let auth;
    function TestComponent() {
      auth = useAuth();
      return null;
    }
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    await act(async () => {
      await auth.logout();
    });
    
    // Verify user state is cleared
    expect(auth.user.isAuthenticated).toBe(false);
    expect(apiClient.post).toHaveBeenCalledWith('/auth/logout/');
  });
});
