import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../../test-utils';
import ClientDeleteDialog from '../ClientDeleteDialog';

describe('ClientDeleteDialog', () => {
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
    onConfirm: jest.fn(),
    client: mockClient,
    loading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Renderização inicial', () => {
    test('deve renderizar modal quando aberto', () => {
      // Arrange & Act
      renderWithProviders(<ClientDeleteDialog {...defaultProps} />);

      // Assert
      expect(screen.getByText('Confirmar Exclusão')).toBeInTheDocument();
    });

    test('deve não renderizar quando fechado', () => {
      // Arrange
      const props = { ...defaultProps, open: false };

      // Act
      renderWithProviders(<ClientDeleteDialog {...props} />);

      // Assert
      expect(screen.queryByText('Confirmar Exclusão')).not.toBeInTheDocument();
    });

    test('deve não renderizar quando client é null', () => {
      // Arrange
      const props = { ...defaultProps, client: null };

      // Act
      renderWithProviders(<ClientDeleteDialog {...props} />);

      // Assert
      expect(screen.queryByText('Confirmar Exclusão')).not.toBeInTheDocument();
    });
  });

  describe('Conteúdo do diálogo', () => {
    test('deve exibir mensagem de confirmação com nome do cliente', () => {
      // Arrange & Act
      renderWithProviders(<ClientDeleteDialog {...defaultProps} />);

      // Assert
      expect(screen.getByText(/tem certeza que deseja excluir o cliente/i)).toBeInTheDocument();
      expect(screen.getByText('João Silva')).toBeInTheDocument();
    });

    test('deve exibir aviso sobre irreversibilidade', () => {
      // Arrange & Act
      renderWithProviders(<ClientDeleteDialog {...defaultProps} />);

      // Assert
      expect(screen.getByText(/esta ação não pode ser desfeita/i)).toBeInTheDocument();
    });

    test('deve exibir informações adicionais do cliente', () => {
      // Arrange & Act
      renderWithProviders(<ClientDeleteDialog {...defaultProps} />);

      // Assert
      expect(screen.getByText('joao@email.com')).toBeInTheDocument();
      expect(screen.getByText('(11) 99999-9999')).toBeInTheDocument();
    });

    test('deve exibir ícone de aviso', () => {
      // Arrange & Act
      renderWithProviders(<ClientDeleteDialog {...defaultProps} />);

      // Assert
      expect(screen.getByTestId('WarningIcon')).toBeInTheDocument();
    });
  });

  describe('Botões de ação', () => {
    test('deve renderizar botões de cancelar e excluir', () => {
      // Arrange & Act
      renderWithProviders(<ClientDeleteDialog {...defaultProps} />);

      // Assert
      expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /excluir cliente/i })).toBeInTheDocument();
    });

    test('deve ter botão de excluir com cor de erro', () => {
      // Arrange & Act
      renderWithProviders(<ClientDeleteDialog {...defaultProps} />);

      // Assert
      const deleteButton = screen.getByRole('button', { name: /excluir cliente/i });
      expect(deleteButton).toHaveClass('MuiButton-colorError');
    });

    test('deve chamar onClose ao clicar em cancelar', async () => {
      // Arrange
      const user = userEvent.setup();
      const mockOnClose = jest.fn();
      const props = { ...defaultProps, onClose: mockOnClose };
      renderWithProviders(<ClientDeleteDialog {...props} />);

      const cancelButton = screen.getByRole('button', { name: /cancelar/i });

      // Act
      await user.click(cancelButton);

      // Assert
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test('deve chamar onConfirm ao clicar em excluir', async () => {
      // Arrange
      const user = userEvent.setup();
      const mockOnConfirm = jest.fn();
      const props = { ...defaultProps, onConfirm: mockOnConfirm };
      renderWithProviders(<ClientDeleteDialog {...props} />);

      const deleteButton = screen.getByRole('button', { name: /excluir cliente/i });

      // Act
      await user.click(deleteButton);

      // Assert
      expect(mockOnConfirm).toHaveBeenCalledWith(mockClient.id);
    });
  });

  describe('Estado de carregamento', () => {
    test('deve desabilitar botões durante carregamento', () => {
      // Arrange
      const props = { ...defaultProps, loading: true };

      // Act
      renderWithProviders(<ClientDeleteDialog {...props} />);

      // Assert
      const cancelButton = screen.getByRole('button', { name: /cancelar/i });
      const deleteButton = screen.getByRole('button', { name: /excluir cliente/i });
      
      expect(cancelButton).toBeDisabled();
      expect(deleteButton).toBeDisabled();
    });

    test('deve mostrar indicador de carregamento no botão', () => {
      // Arrange
      const props = { ...defaultProps, loading: true };

      // Act
      renderWithProviders(<ClientDeleteDialog {...props} />);

      // Assert
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    test('deve alterar texto do botão durante carregamento', () => {
      // Arrange
      const props = { ...defaultProps, loading: true };

      // Act
      renderWithProviders(<ClientDeleteDialog {...props} />);

      // Assert
      expect(screen.getByText('Excluindo...')).toBeInTheDocument();
    });
  });

  describe('Diferentes cenários de cliente', () => {
    test('deve lidar com cliente sem email', () => {
      // Arrange
      const clientWithoutEmail = {
        ...mockClient,
        email: '',
      };
      const props = { ...defaultProps, client: clientWithoutEmail };

      // Act
      renderWithProviders(<ClientDeleteDialog {...props} />);

      // Assert
      expect(screen.getByText('João Silva')).toBeInTheDocument();
      expect(screen.queryByText('joao@email.com')).not.toBeInTheDocument();
    });

    test('deve lidar com cliente sem telefone', () => {
      // Arrange
      const clientWithoutPhone = {
        ...mockClient,
        phone: '',
      };
      const props = { ...defaultProps, client: clientWithoutPhone };

      // Act
      renderWithProviders(<ClientDeleteDialog {...props} />);

      // Assert
      expect(screen.getByText('João Silva')).toBeInTheDocument();
      expect(screen.queryByText('(11) 99999-9999')).not.toBeInTheDocument();
    });

    test('deve exibir apenas nome quando outros dados estão vazios', () => {
      // Arrange
      const minimalClient = {
        id: 1,
        name: 'Cliente Mínimo',
        email: '',
        phone: '',
      };
      const props = { ...defaultProps, client: minimalClient };

      // Act
      renderWithProviders(<ClientDeleteDialog {...props} />);

      // Assert
      expect(screen.getByText('Cliente Mínimo')).toBeInTheDocument();
    });
  });

  describe('Interação com teclado', () => {
    test('deve fechar com ESC', () => {
      // Arrange
      const mockOnClose = jest.fn();
      const props = { ...defaultProps, onClose: mockOnClose };
      renderWithProviders(<ClientDeleteDialog {...props} />);

      // Act
      fireEvent.keyDown(document, { key: 'Escape' });

      // Assert
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test('deve focar no botão cancelar inicialmente', () => {
      // Arrange & Act
      renderWithProviders(<ClientDeleteDialog {...defaultProps} />);

      // Assert
      const cancelButton = screen.getByRole('button', { name: /cancelar/i });
      expect(cancelButton).toHaveFocus();
    });

    test('deve executar exclusão com Enter no botão excluir', async () => {
      // Arrange
      const user = userEvent.setup();
      const mockOnConfirm = jest.fn();
      const props = { ...defaultProps, onConfirm: mockOnConfirm };
      renderWithProviders(<ClientDeleteDialog {...props} />);

      const deleteButton = screen.getByRole('button', { name: /excluir cliente/i });

      // Act
      deleteButton.focus();
      await user.keyboard('{Enter}');

      // Assert
      expect(mockOnConfirm).toHaveBeenCalledWith(mockClient.id);
    });
  });

  describe('Formatação de dados', () => {
    test('deve formatar telefone corretamente na exibição', () => {
      // Arrange & Act
      renderWithProviders(<ClientDeleteDialog {...defaultProps} />);

      // Assert
      expect(screen.getByText('(11) 99999-9999')).toBeInTheDocument();
    });

    test('deve exibir telefone sem formatação se inválido', () => {
      // Arrange
      const clientWithBadPhone = {
        ...mockClient,
        phone: '123456',
      };
      const props = { ...defaultProps, client: clientWithBadPhone };

      // Act
      renderWithProviders(<ClientDeleteDialog {...props} />);

      // Assert
      expect(screen.getByText('123456')).toBeInTheDocument();
    });
  });

  describe('Acessibilidade', () => {
    test('deve ter título com hierarquia correta', () => {
      // Arrange & Act
      renderWithProviders(<ClientDeleteDialog {...defaultProps} />);

      // Assert
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Confirmar Exclusão');
    });

    test('deve ter modal com role apropriado', () => {
      // Arrange & Act
      renderWithProviders(<ClientDeleteDialog {...defaultProps} />);

      // Assert
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    test('deve ter botões com labels descritivos', () => {
      // Arrange & Act
      renderWithProviders(<ClientDeleteDialog {...defaultProps} />);

      // Assert
      const deleteButton = screen.getByRole('button', { name: /excluir cliente/i });
      expect(deleteButton).toHaveAttribute('aria-label', 'Confirmar exclusão do cliente');
    });

    test('deve ter texto com contraste adequado para ação perigosa', () => {
      // Arrange & Act
      renderWithProviders(<ClientDeleteDialog {...defaultProps} />);

      // Assert
      const warningText = screen.getByText(/esta ação não pode ser desfeita/i);
      expect(warningText).toHaveClass('MuiTypography-colorError');
    });
  });

  describe('Prevenção de ações acidentais', () => {
    test('deve exigir clique explícito para confirmação', () => {
      // Arrange
      const mockOnConfirm = jest.fn();
      const props = { ...defaultProps, onConfirm: mockOnConfirm };
      renderWithProviders(<ClientDeleteDialog {...props} />);

      // Act - apenas abrir o modal não deve triggar a confirmação
      
      // Assert
      expect(mockOnConfirm).not.toHaveBeenCalled();
    });

    test('deve destacar visualmente a ação perigosa', () => {
      // Arrange & Act
      renderWithProviders(<ClientDeleteDialog {...defaultProps} />);

      // Assert
      const deleteButton = screen.getByRole('button', { name: /excluir cliente/i });
      expect(deleteButton).toHaveClass('MuiButton-colorError');
    });

    test('deve mostrar informações suficientes para identificação', () => {
      // Arrange & Act
      renderWithProviders(<ClientDeleteDialog {...defaultProps} />);

      // Assert
      // Deve mostrar pelo menos nome e uma informação adicional
      expect(screen.getByText('João Silva')).toBeInTheDocument();
      expect(screen.getByText('joao@email.com')).toBeInTheDocument();
    });
  });

  describe('Comportamento assíncrono', () => {
    test('deve não permitir múltiplos cliques durante carregamento', async () => {
      // Arrange
      const user = userEvent.setup();
      const mockOnConfirm = jest.fn();
      const props = { ...defaultProps, onConfirm: mockOnConfirm, loading: true };
      renderWithProviders(<ClientDeleteDialog {...props} />);

      const deleteButton = screen.getByRole('button', { name: /excluindo/i });

      // Act
      await user.click(deleteButton);
      await user.click(deleteButton);

      // Assert
      expect(mockOnConfirm).toHaveBeenCalledTimes(0); // Nenhuma chamada devido ao loading
    });
  });
});
