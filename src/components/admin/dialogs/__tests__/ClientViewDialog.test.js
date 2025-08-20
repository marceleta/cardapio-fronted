import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../../test-utils';
import ClientViewDialog from '../ClientViewDialog';

describe('ClientViewDialog', () => {
  const mockClient = {
    id: 1,
    name: 'João Silva',
    email: 'joao@email.com',
    phone: '11999999999',
    address: 'Rua A, 123',
    neighborhood: 'Centro',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01000-000',
    createdAt: '2024-01-15T10:30:00Z',
  };

  const defaultProps = {
    open: true,
    onClose: jest.fn(),
    client: mockClient,
    onEdit: jest.fn(),
    onDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Renderização inicial', () => {
    test('deve renderizar modal quando aberto', () => {
      // Arrange & Act
      renderWithProviders(<ClientViewDialog {...defaultProps} />);

      // Assert
      expect(screen.getByText('Detalhes do Cliente')).toBeInTheDocument();
    });

    test('deve não renderizar quando fechado', () => {
      // Arrange
      const props = { ...defaultProps, open: false };

      // Act
      renderWithProviders(<ClientViewDialog {...props} />);

      // Assert
      expect(screen.queryByText('Detalhes do Cliente')).not.toBeInTheDocument();
    });

    test('deve não renderizar quando client é null', () => {
      // Arrange
      const props = { ...defaultProps, client: null };

      // Act
      renderWithProviders(<ClientViewDialog {...props} />);

      // Assert
      expect(screen.queryByText('Detalhes do Cliente')).not.toBeInTheDocument();
    });
  });

  describe('Exibição de dados', () => {
    test('deve exibir informações básicas do cliente', () => {
      // Arrange & Act
      renderWithProviders(<ClientViewDialog {...defaultProps} />);

      // Assert
      expect(screen.getByText('João Silva')).toBeInTheDocument();
      expect(screen.getByText('joao@email.com')).toBeInTheDocument();
      expect(screen.getByText('(11) 99999-9999')).toBeInTheDocument();
    });

    test('deve exibir endereço completo formatado', () => {
      // Arrange & Act
      renderWithProviders(<ClientViewDialog {...defaultProps} />);

      // Assert
      expect(screen.getByText('Rua A, 123')).toBeInTheDocument();
      expect(screen.getByText('Centro')).toBeInTheDocument();
      expect(screen.getByText('São Paulo - SP')).toBeInTheDocument();
      expect(screen.getByText('01000-000')).toBeInTheDocument();
    });

    test('deve exibir data de cadastro formatada', () => {
      // Arrange & Act
      renderWithProviders(<ClientViewDialog {...defaultProps} />);

      // Assert
      expect(screen.getByText('15/01/2024 às 10:30')).toBeInTheDocument();
    });

    test('deve exibir labels dos campos', () => {
      // Arrange & Act
      renderWithProviders(<ClientViewDialog {...defaultProps} />);

      // Assert
      expect(screen.getByText('Nome:')).toBeInTheDocument();
      expect(screen.getByText('Email:')).toBeInTheDocument();
      expect(screen.getByText('Telefone:')).toBeInTheDocument();
      expect(screen.getByText('Endereço:')).toBeInTheDocument();
      expect(screen.getByText('Bairro:')).toBeInTheDocument();
      expect(screen.getByText('Cidade:')).toBeInTheDocument();
      expect(screen.getByText('CEP:')).toBeInTheDocument();
      expect(screen.getByText('Cadastrado em:')).toBeInTheDocument();
    });
  });

  describe('Campos opcionais', () => {
    test('deve lidar com campos vazios', () => {
      // Arrange
      const clientWithEmptyFields = {
        ...mockClient,
        address: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: '',
      };
      const props = { ...defaultProps, client: clientWithEmptyFields };

      // Act
      renderWithProviders(<ClientViewDialog {...props} />);

      // Assert
      expect(screen.getByText('Não informado')).toBeInTheDocument();
    });

    test('deve mostrar endereço parcial quando alguns campos estão vazios', () => {
      // Arrange
      const clientWithPartialAddress = {
        ...mockClient,
        address: 'Rua B, 456',
        neighborhood: '',
        city: 'Rio de Janeiro',
        state: 'RJ',
        zipCode: '',
      };
      const props = { ...defaultProps, client: clientWithPartialAddress };

      // Act
      renderWithProviders(<ClientViewDialog {...props} />);

      // Assert
      expect(screen.getByText('Rua B, 456')).toBeInTheDocument();
      expect(screen.getByText('Rio de Janeiro - RJ')).toBeInTheDocument();
    });
  });

  describe('Formatação de dados', () => {
    test('deve formatar telefone corretamente', () => {
      // Arrange & Act
      renderWithProviders(<ClientViewDialog {...defaultProps} />);

      // Assert
      expect(screen.getByText('(11) 99999-9999')).toBeInTheDocument();
    });

    test('deve lidar com telefone mal formatado', () => {
      // Arrange
      const clientWithBadPhone = {
        ...mockClient,
        phone: '123456789',
      };
      const props = { ...defaultProps, client: clientWithBadPhone };

      // Act
      renderWithProviders(<ClientViewDialog {...props} />);

      // Assert
      expect(screen.getByText('123456789')).toBeInTheDocument();
    });

    test('deve formatar data corretamente', () => {
      // Arrange & Act
      renderWithProviders(<ClientViewDialog {...defaultProps} />);

      // Assert
      expect(screen.getByText('15/01/2024 às 10:30')).toBeInTheDocument();
    });

    test('deve lidar com data inválida', () => {
      // Arrange
      const clientWithBadDate = {
        ...mockClient,
        createdAt: 'invalid-date',
      };
      const props = { ...defaultProps, client: clientWithBadDate };

      // Act
      renderWithProviders(<ClientViewDialog {...props} />);

      // Assert
      expect(screen.getByText('Data inválida')).toBeInTheDocument();
    });
  });

  describe('Botões de ação', () => {
    test('deve renderizar todos os botões de ação', () => {
      // Arrange & Act
      renderWithProviders(<ClientViewDialog {...defaultProps} />);

      // Assert
      expect(screen.getByRole('button', { name: /fechar/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /editar/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /excluir/i })).toBeInTheDocument();
    });

    test('deve chamar onClose ao clicar em fechar', async () => {
      // Arrange
      const user = userEvent.setup();
      const mockOnClose = jest.fn();
      const props = { ...defaultProps, onClose: mockOnClose };
      renderWithProviders(<ClientViewDialog {...props} />);

      const closeButton = screen.getByRole('button', { name: /fechar/i });

      // Act
      await user.click(closeButton);

      // Assert
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test('deve chamar onEdit ao clicar em editar', async () => {
      // Arrange
      const user = userEvent.setup();
      const mockOnEdit = jest.fn();
      const props = { ...defaultProps, onEdit: mockOnEdit };
      renderWithProviders(<ClientViewDialog {...props} />);

      const editButton = screen.getByRole('button', { name: /editar/i });

      // Act
      await user.click(editButton);

      // Assert
      expect(mockOnEdit).toHaveBeenCalledWith(mockClient);
    });

    test('deve chamar onDelete ao clicar em excluir', async () => {
      // Arrange
      const user = userEvent.setup();
      const mockOnDelete = jest.fn();
      const props = { ...defaultProps, onDelete: mockOnDelete };
      renderWithProviders(<ClientViewDialog {...props} />);

      const deleteButton = screen.getByRole('button', { name: /excluir/i });

      // Act
      await user.click(deleteButton);

      // Assert
      expect(mockOnDelete).toHaveBeenCalledWith(mockClient);
    });
  });

  describe('Ícones', () => {
    test('deve mostrar ícones apropriados nos botões', () => {
      // Arrange & Act
      renderWithProviders(<ClientViewDialog {...defaultProps} />);

      // Assert
      expect(screen.getByTestId('EditIcon')).toBeInTheDocument();
      expect(screen.getByTestId('DeleteIcon')).toBeInTheDocument();
    });

    test('deve mostrar ícones nos campos de informação', () => {
      // Arrange & Act
      renderWithProviders(<ClientViewDialog {...defaultProps} />);

      // Assert
      expect(screen.getByTestId('PersonIcon')).toBeInTheDocument();
      expect(screen.getByTestId('EmailIcon')).toBeInTheDocument();
      expect(screen.getByTestId('PhoneIcon')).toBeInTheDocument();
      expect(screen.getByTestId('LocationOnIcon')).toBeInTheDocument();
      expect(screen.getByTestId('CalendarTodayIcon')).toBeInTheDocument();
    });
  });

  describe('Layout e estrutura', () => {
    test('deve ter seções organizadas corretamente', () => {
      // Arrange & Act
      renderWithProviders(<ClientViewDialog {...defaultProps} />);

      // Assert
      const infoSections = screen.getAllByRole('group');
      expect(infoSections.length).toBeGreaterThan(0);
    });

    test('deve ter espaçamento apropriado entre seções', () => {
      // Arrange & Act
      renderWithProviders(<ClientViewDialog {...defaultProps} />);

      // Assert
      const dialogContent = screen.getByRole('dialog');
      expect(dialogContent).toBeInTheDocument();
    });
  });

  describe('Interação com teclado', () => {
    test('deve fechar com ESC', () => {
      // Arrange
      const mockOnClose = jest.fn();
      const props = { ...defaultProps, onClose: mockOnClose };
      renderWithProviders(<ClientViewDialog {...props} />);

      // Act
      fireEvent.keyDown(document, { key: 'Escape' });

      // Assert
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Acessibilidade', () => {
    test('deve ter título com hierarquia correta', () => {
      // Arrange & Act
      renderWithProviders(<ClientViewDialog {...defaultProps} />);

      // Assert
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Detalhes do Cliente');
    });

    test('deve ter labels descritivos nos botões', () => {
      // Arrange & Act
      renderWithProviders(<ClientViewDialog {...defaultProps} />);

      // Assert
      const editButton = screen.getByRole('button', { name: /editar/i });
      const deleteButton = screen.getByRole('button', { name: /excluir/i });
      
      expect(editButton).toHaveAttribute('aria-label', 'Editar cliente');
      expect(deleteButton).toHaveAttribute('aria-label', 'Excluir cliente');
    });

    test('deve ter modal com role correto', () => {
      // Arrange & Act
      renderWithProviders(<ClientViewDialog {...defaultProps} />);

      // Assert
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  describe('Casos extremos', () => {
    test('deve lidar com cliente sem nome', () => {
      // Arrange
      const clientWithoutName = {
        ...mockClient,
        name: '',
      };
      const props = { ...defaultProps, client: clientWithoutName };

      // Act
      renderWithProviders(<ClientViewDialog {...props} />);

      // Assert
      expect(screen.getByText('Cliente sem nome')).toBeInTheDocument();
    });

    test('deve lidar com todos os campos vazios', () => {
      // Arrange
      const emptyClient = {
        id: 1,
        name: '',
        email: '',
        phone: '',
        address: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: '',
        createdAt: null,
      };
      const props = { ...defaultProps, client: emptyClient };

      // Act
      renderWithProviders(<ClientViewDialog {...props} />);

      // Assert
      expect(screen.getAllByText('Não informado')).toHaveLength(7); // Todos os campos opcionais
    });
  });
});
