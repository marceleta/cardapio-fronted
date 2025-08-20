import { renderHook, act, waitFor } from '@testing-library/react';
import useClientsManager from '../useClientsManager';
import * as api from '../../lib/api';
import { toast } from 'react-toastify';

// Mocks
jest.mock('../../lib/api');
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('useClientsManager', () => {
  // Mock data
  const mockClients = [
    {
      id: 1,
      name: 'João Silva',
      email: 'joao@email.com',
      phone: '11999999999',
      address: 'Rua A, 123',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01000-000',
      createdAt: '2024-01-01T10:00:00Z',
    },
    {
      id: 2,
      name: 'Maria Santos',
      email: 'maria@email.com',
      phone: '11888888888',
      address: 'Rua B, 456',
      neighborhood: 'Vila Nova',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '02000-000',
      createdAt: '2024-01-02T11:00:00Z',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Estado inicial', () => {
    test('deve inicializar com valores padrão', () => {
      // Arrange
      api.clientsAPI.getAll.mockResolvedValue([]);

      // Act
      const { result } = renderHook(() => useClientsManager());

      // Assert
      expect(result.current.clients).toEqual([]);
      expect(result.current.loading).toBe(true);
      expect(result.current.searchTerm).toBe('');
      expect(result.current.selectedClient).toBe(null);
      expect(result.current.isFormDialogOpen).toBe(false);
      expect(result.current.isViewDialogOpen).toBe(false);
      expect(result.current.isDeleteDialogOpen).toBe(false);
      expect(result.current.editingClient).toBe(null);
    });

    test('deve carregar clientes na inicialização', async () => {
      // Arrange
      api.clientsAPI.getAll.mockResolvedValue(mockClients);

      // Act
      const { result } = renderHook(() => useClientsManager());

      // Assert
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      expect(result.current.clients).toEqual(mockClients);
      expect(api.clientsAPI.getAll).toHaveBeenCalledTimes(1);
    });

    test('deve lidar com erro ao carregar clientes', async () => {
      // Arrange
      const errorMessage = 'Erro ao carregar clientes';
      api.clientsAPI.getAll.mockRejectedValue(new Error(errorMessage));

      // Act
      const { result } = renderHook(() => useClientsManager());

      // Assert
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
      expect(toast.error).toHaveBeenCalledWith('Erro ao carregar clientes');
    });
  });

  describe('Busca e filtros', () => {
    test('deve atualizar termo de busca', async () => {
      // Arrange
      api.clientsAPI.getAll.mockResolvedValue(mockClients);
      const { result } = renderHook(() => useClientsManager());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Act
      act(() => {
        result.current.setSearchTerm('João');
      });

      // Assert
      expect(result.current.searchTerm).toBe('João');
    });

    test('deve filtrar clientes pelo termo de busca', async () => {
      // Arrange
      api.clientsAPI.getAll.mockResolvedValue(mockClients);
      const { result } = renderHook(() => useClientsManager());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Act
      act(() => {
        result.current.setSearchTerm('joão');
      });

      // Assert
      const filteredClients = result.current.filteredClients;
      expect(filteredClients).toHaveLength(1);
      expect(filteredClients[0].name).toBe('João Silva');
    });

    test('deve filtrar por email', async () => {
      // Arrange
      api.clientsAPI.getAll.mockResolvedValue(mockClients);
      const { result } = renderHook(() => useClientsManager());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Act
      act(() => {
        result.current.setSearchTerm('maria@email.com');
      });

      // Assert
      const filteredClients = result.current.filteredClients;
      expect(filteredClients).toHaveLength(1);
      expect(filteredClients[0].email).toBe('maria@email.com');
    });

    test('deve filtrar por telefone', async () => {
      // Arrange
      api.clientsAPI.getAll.mockResolvedValue(mockClients);
      const { result } = renderHook(() => useClientsManager());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Act
      act(() => {
        result.current.setSearchTerm('11999999999');
      });

      // Assert
      const filteredClients = result.current.filteredClients;
      expect(filteredClients).toHaveLength(1);
      expect(filteredClients[0].phone).toBe('11999999999');
    });
  });

  describe('Operações CRUD', () => {
    describe('Criar cliente', () => {
      test('deve criar um novo cliente com sucesso', async () => {
        // Arrange
        const newClient = {
          name: 'Ana Costa',
          email: 'ana@email.com',
          phone: '11777777777',
          address: 'Rua C, 789',
          neighborhood: 'Jardim',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '03000-000',
        };
        const createdClient = { id: 3, ...newClient, createdAt: '2024-01-03T12:00:00Z' };

        api.clientsAPI.getAll.mockResolvedValue(mockClients);
        api.clientsAPI.create.mockResolvedValue(createdClient);

        const { result } = renderHook(() => useClientsManager());

        await waitFor(() => {
          expect(result.current.loading).toBe(false);
        });

        // Act
        await act(async () => {
          await result.current.handleSubmit(newClient);
        });

        // Assert
        expect(api.clientsAPI.create).toHaveBeenCalledWith(newClient);
        expect(toast.success).toHaveBeenCalledWith('Cliente criado com sucesso!');
        expect(result.current.isFormDialogOpen).toBe(false);
        expect(result.current.editingClient).toBe(null);
      });

      test('deve lidar com erro ao criar cliente', async () => {
        // Arrange
        const newClient = { name: 'Teste', email: 'teste@email.com' };
        api.clientsAPI.getAll.mockResolvedValue([]);
        api.clientsAPI.create.mockRejectedValue(new Error('Erro na criação'));

        const { result } = renderHook(() => useClientsManager());

        await waitFor(() => {
          expect(result.current.loading).toBe(false);
        });

        // Act
        await act(async () => {
          await result.current.handleSubmit(newClient);
        });

        // Assert
        expect(toast.error).toHaveBeenCalledWith('Erro ao criar cliente');
      });
    });

    describe('Editar cliente', () => {
      test('deve editar um cliente existente com sucesso', async () => {
        // Arrange
        const updatedData = { name: 'João Silva Santos' };
        const updatedClient = { ...mockClients[0], ...updatedData };

        api.clientsAPI.getAll.mockResolvedValue(mockClients);
        api.clientsAPI.update.mockResolvedValue(updatedClient);

        const { result } = renderHook(() => useClientsManager());

        await waitFor(() => {
          expect(result.current.loading).toBe(false);
        });

        // Simular edição
        act(() => {
          result.current.handleEdit(mockClients[0]);
        });

        // Act
        await act(async () => {
          await result.current.handleSubmit(updatedData);
        });

        // Assert
        expect(api.clientsAPI.update).toHaveBeenCalledWith(1, updatedData);
        expect(toast.success).toHaveBeenCalledWith('Cliente atualizado com sucesso!');
        expect(result.current.isFormDialogOpen).toBe(false);
        expect(result.current.editingClient).toBe(null);
      });

      test('deve lidar com erro ao editar cliente', async () => {
        // Arrange
        api.clientsAPI.getAll.mockResolvedValue(mockClients);
        api.clientsAPI.update.mockRejectedValue(new Error('Erro na atualização'));

        const { result } = renderHook(() => useClientsManager());

        await waitFor(() => {
          expect(result.current.loading).toBe(false);
        });

        act(() => {
          result.current.handleEdit(mockClients[0]);
        });

        // Act
        await act(async () => {
          await result.current.handleSubmit({ name: 'Novo Nome' });
        });

        // Assert
        expect(toast.error).toHaveBeenCalledWith('Erro ao atualizar cliente');
      });
    });

    describe('Excluir cliente', () => {
      test('deve excluir um cliente com sucesso', async () => {
        // Arrange
        api.clientsAPI.getAll.mockResolvedValue(mockClients);
        api.clientsAPI.delete.mockResolvedValue();

        const { result } = renderHook(() => useClientsManager());

        await waitFor(() => {
          expect(result.current.loading).toBe(false);
        });

        // Act
        await act(async () => {
          await result.current.handleDelete(1);
        });

        // Assert
        expect(api.clientsAPI.delete).toHaveBeenCalledWith(1);
        expect(toast.success).toHaveBeenCalledWith('Cliente excluído com sucesso!');
        expect(result.current.isDeleteDialogOpen).toBe(false);
        expect(result.current.selectedClient).toBe(null);
      });

      test('deve lidar com erro ao excluir cliente', async () => {
        // Arrange
        api.clientsAPI.getAll.mockResolvedValue(mockClients);
        api.clientsAPI.delete.mockRejectedValue(new Error('Erro na exclusão'));

        const { result } = renderHook(() => useClientsManager());

        await waitFor(() => {
          expect(result.current.loading).toBe(false);
        });

        // Act
        await act(async () => {
          await result.current.handleDelete(1);
        });

        // Assert
        expect(toast.error).toHaveBeenCalledWith('Erro ao excluir cliente');
      });
    });
  });

  describe('Controle de diálogos', () => {
    test('deve abrir diálogo de criação', async () => {
      // Arrange
      api.clientsAPI.getAll.mockResolvedValue([]);
      const { result } = renderHook(() => useClientsManager());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Act
      act(() => {
        result.current.handleCreate();
      });

      // Assert
      expect(result.current.isFormDialogOpen).toBe(true);
      expect(result.current.editingClient).toBe(null);
    });

    test('deve abrir diálogo de edição', async () => {
      // Arrange
      api.clientsAPI.getAll.mockResolvedValue(mockClients);
      const { result } = renderHook(() => useClientsManager());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Act
      act(() => {
        result.current.handleEdit(mockClients[0]);
      });

      // Assert
      expect(result.current.isFormDialogOpen).toBe(true);
      expect(result.current.editingClient).toEqual(mockClients[0]);
    });

    test('deve abrir diálogo de visualização', async () => {
      // Arrange
      api.clientsAPI.getAll.mockResolvedValue(mockClients);
      const { result } = renderHook(() => useClientsManager());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Act
      act(() => {
        result.current.handleView(mockClients[0]);
      });

      // Assert
      expect(result.current.isViewDialogOpen).toBe(true);
      expect(result.current.selectedClient).toEqual(mockClients[0]);
    });

    test('deve abrir diálogo de exclusão', async () => {
      // Arrange
      api.clientsAPI.getAll.mockResolvedValue(mockClients);
      const { result } = renderHook(() => useClientsManager());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Act
      act(() => {
        result.current.handleDeleteClick(mockClients[0]);
      });

      // Assert
      expect(result.current.isDeleteDialogOpen).toBe(true);
      expect(result.current.selectedClient).toEqual(mockClients[0]);
    });

    test('deve fechar diálogos', async () => {
      // Arrange
      api.clientsAPI.getAll.mockResolvedValue(mockClients);
      const { result } = renderHook(() => useClientsManager());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Abrir diálogos
      act(() => {
        result.current.handleCreate();
        result.current.handleView(mockClients[0]);
        result.current.handleDeleteClick(mockClients[0]);
      });

      // Act
      act(() => {
        result.current.handleCloseFormDialog();
        result.current.handleCloseViewDialog();
        result.current.handleCloseDeleteDialog();
      });

      // Assert
      expect(result.current.isFormDialogOpen).toBe(false);
      expect(result.current.isViewDialogOpen).toBe(false);
      expect(result.current.isDeleteDialogOpen).toBe(false);
      expect(result.current.editingClient).toBe(null);
      expect(result.current.selectedClient).toBe(null);
    });
  });
});
