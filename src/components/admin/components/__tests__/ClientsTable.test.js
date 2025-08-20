import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../../../test-utils';
import ClientsTable from '../ClientsTable';

describe('ClientsTable', () => {
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

  const defaultProps = {
    clients: mockClients,
    loading: false,
    onView: jest.fn(),
    onEdit: jest.fn(),
    onDeleteClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Renderização inicial', () => {
    test('deve renderizar cabeçalho da tabela', () => {
      // Arrange & Act
      renderWithProviders(<ClientsTable {...defaultProps} />);

      // Assert
      expect(screen.getByText('Nome')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Telefone')).toBeInTheDocument();
      expect(screen.getByText('Cidade')).toBeInTheDocument();
      expect(screen.getByText('Data de Cadastro')).toBeInTheDocument();
      expect(screen.getByText('Ações')).toBeInTheDocument();
    });

    test('deve renderizar dados dos clientes', () => {
      // Arrange & Act
      renderWithProviders(<ClientsTable {...defaultProps} />);

      // Assert
      expect(screen.getByText('João Silva')).toBeInTheDocument();
      expect(screen.getByText('joao@email.com')).toBeInTheDocument();
      expect(screen.getByText('(11) 99999-9999')).toBeInTheDocument();
      expect(screen.getAllByText('São Paulo')[0]).toBeInTheDocument();
      
      expect(screen.getByText('Maria Santos')).toBeInTheDocument();
      expect(screen.getByText('maria@email.com')).toBeInTheDocument();
      expect(screen.getByText('(11) 88888-8888')).toBeInTheDocument();
    });

    test('deve renderizar botões de ação para cada cliente', () => {
      // Arrange & Act
      renderWithProviders(<ClientsTable {...defaultProps} />);

      // Assert
      const viewButtons = screen.getAllByLabelText(/visualizar cliente/i);
      const editButtons = screen.getAllByLabelText(/editar cliente/i);
      const deleteButtons = screen.getAllByLabelText(/excluir cliente/i);

      expect(viewButtons).toHaveLength(2);
      expect(editButtons).toHaveLength(2);
      expect(deleteButtons).toHaveLength(2);
    });
  });

  describe('Estados de carregamento', () => {
    test('deve mostrar skeleton quando carregando', () => {
      // Arrange
      const props = { ...defaultProps, loading: true };

      // Act
      renderWithProviders(<ClientsTable {...props} />);

      // Assert
      const skeletons = screen.getAllByTestId('client-skeleton');
      expect(skeletons).toHaveLength(5); // 5 linhas de skeleton
    });

    test('deve mostrar mensagem quando não há clientes', () => {
      // Arrange
      const props = { ...defaultProps, clients: [] };

      // Act
      renderWithProviders(<ClientsTable {...props} />);

      // Assert
      expect(screen.getByText('Nenhum cliente encontrado')).toBeInTheDocument();
      expect(screen.getByText('Comece criando seu primeiro cliente!')).toBeInTheDocument();
    });
  });

  describe('Formatação de dados', () => {
    test('deve formatar telefone corretamente', () => {
      // Arrange & Act
      renderWithProviders(<ClientsTable {...defaultProps} />);

      // Assert
      expect(screen.getByText('(11) 99999-9999')).toBeInTheDocument();
      expect(screen.getByText('(11) 88888-8888')).toBeInTheDocument();
    });

    test('deve formatar data corretamente', () => {
      // Arrange & Act
      renderWithProviders(<ClientsTable {...defaultProps} />);

      // Assert
      expect(screen.getByText('01/01/2024')).toBeInTheDocument();
      expect(screen.getByText('02/01/2024')).toBeInTheDocument();
    });

    test('deve lidar com telefone inválido', () => {
      // Arrange
      const clientsWithInvalidPhone = [
        { ...mockClients[0], phone: '123' }
      ];
      const props = { ...defaultProps, clients: clientsWithInvalidPhone };

      // Act
      renderWithProviders(<ClientsTable {...props} />);

      // Assert
      expect(screen.getByText('123')).toBeInTheDocument();
    });

    test('deve lidar com data inválida', () => {
      // Arrange
      const clientsWithInvalidDate = [
        { ...mockClients[0], createdAt: 'invalid-date' }
      ];
      const props = { ...defaultProps, clients: clientsWithInvalidDate };

      // Act
      renderWithProviders(<ClientsTable {...props} />);

      // Assert
      expect(screen.getByText('Data inválida')).toBeInTheDocument();
    });
  });

  describe('Interações', () => {
    test('deve chamar onView ao clicar no botão de visualizar', () => {
      // Arrange
      const mockOnView = jest.fn();
      const props = { ...defaultProps, onView: mockOnView };
      renderWithProviders(<ClientsTable {...props} />);

      const viewButton = screen.getAllByLabelText(/visualizar cliente/i)[0];

      // Act
      fireEvent.click(viewButton);

      // Assert
      expect(mockOnView).toHaveBeenCalledWith(mockClients[0]);
    });

    test('deve chamar onEdit ao clicar no botão de editar', () => {
      // Arrange
      const mockOnEdit = jest.fn();
      const props = { ...defaultProps, onEdit: mockOnEdit };
      renderWithProviders(<ClientsTable {...props} />);

      const editButton = screen.getAllByLabelText(/editar cliente/i)[0];

      // Act
      fireEvent.click(editButton);

      // Assert
      expect(mockOnEdit).toHaveBeenCalledWith(mockClients[0]);
    });

    test('deve chamar onDeleteClick ao clicar no botão de excluir', () => {
      // Arrange
      const mockOnDeleteClick = jest.fn();
      const props = { ...defaultProps, onDeleteClick: mockOnDeleteClick };
      renderWithProviders(<ClientsTable {...props} />);

      const deleteButton = screen.getAllByLabelText(/excluir cliente/i)[0];

      // Act
      fireEvent.click(deleteButton);

      // Assert
      expect(mockOnDeleteClick).toHaveBeenCalledWith(mockClients[0]);
    });
  });

  describe('Responsividade', () => {
    test('deve aplicar classes responsivas corretas', () => {
      // Arrange & Act
      renderWithProviders(<ClientsTable {...defaultProps} />);

      // Assert
      const table = screen.getByRole('table');
      expect(table.closest('.MuiTableContainer-root')).toBeInTheDocument();
    });

    test('deve ter colunas com tamanhos apropriados', () => {
      // Arrange & Act
      renderWithProviders(<ClientsTable {...defaultProps} />);

      // Assert
      const nameHeader = screen.getByText('Nome');
      const actionsHeader = screen.getByText('Ações');
      
      expect(nameHeader.closest('th')).toBeInTheDocument();
      expect(actionsHeader.closest('th')).toBeInTheDocument();
    });
  });

  describe('Acessibilidade', () => {
    test('deve ter labels apropriados nos botões', () => {
      // Arrange & Act
      renderWithProviders(<ClientsTable {...defaultProps} />);

      // Assert
      const viewButtons = screen.getAllByLabelText(/visualizar cliente/i);
      const editButtons = screen.getAllByLabelText(/editar cliente/i);
      const deleteButtons = screen.getAllByLabelText(/excluir cliente/i);

      expect(viewButtons[0]).toHaveAttribute('aria-label', 'Visualizar cliente João Silva');
      expect(editButtons[0]).toHaveAttribute('aria-label', 'Editar cliente João Silva');
      expect(deleteButtons[0]).toHaveAttribute('aria-label', 'Excluir cliente João Silva');
    });

    test('deve ter tabela com role correto', () => {
      // Arrange & Act
      renderWithProviders(<ClientsTable {...defaultProps} />);

      // Assert
      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });

  describe('Ícones', () => {
    test('deve mostrar ícones corretos nos botões', () => {
      // Arrange & Act
      renderWithProviders(<ClientsTable {...defaultProps} />);

      // Assert
      expect(screen.getAllByTestId('VisibilityIcon')).toHaveLength(2);
      expect(screen.getAllByTestId('EditIcon')).toHaveLength(2);
      expect(screen.getAllByTestId('DeleteIcon')).toHaveLength(2);
    });
  });

  describe('Casos extremos', () => {
    test('deve lidar com array vazio de clientes', () => {
      // Arrange
      const props = { ...defaultProps, clients: [] };

      // Act
      renderWithProviders(<ClientsTable {...props} />);

      // Assert
      expect(screen.getByText('Nenhum cliente encontrado')).toBeInTheDocument();
    });

    test('deve lidar com cliente sem dados opcionais', () => {
      // Arrange
      const minimalClient = {
        id: 1,
        name: 'Cliente Mínimo',
        email: 'minimo@email.com',
        phone: '',
        city: '',
        createdAt: null,
      };
      const props = { ...defaultProps, clients: [minimalClient] };

      // Act
      renderWithProviders(<ClientsTable {...props} />);

      // Assert
      expect(screen.getByText('Cliente Mínimo')).toBeInTheDocument();
      expect(screen.getByText('minimo@email.com')).toBeInTheDocument();
    });
  });
});
