import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../../test-utils';
import ClientFormDialog from '../ClientFormDialog';

describe('ClientFormDialog', () => {
  const defaultProps = {
    open: true,
    onClose: jest.fn(),
    onSubmit: jest.fn(),
    editingClient: null,
    loading: false,
  };

  const mockEditingClient = {
    id: 1,
    name: 'João Silva',
    email: 'joao@email.com',
    phone: '11999999999',
    address: 'Rua A, 123',
    neighborhood: 'Centro',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01000-000',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Renderização inicial', () => {
    test('deve renderizar modal quando aberto', () => {
      // Arrange & Act
      renderWithProviders(<ClientFormDialog {...defaultProps} />);

      // Assert
      expect(screen.getByText('Criar Cliente')).toBeInTheDocument();
    });

    test('deve não renderizar quando fechado', () => {
      // Arrange
      const props = { ...defaultProps, open: false };

      // Act
      renderWithProviders(<ClientFormDialog {...props} />);

      // Assert
      expect(screen.queryByText('Criar Cliente')).not.toBeInTheDocument();
    });

    test('deve renderizar todos os campos do formulário', () => {
      // Arrange & Act
      renderWithProviders(<ClientFormDialog {...defaultProps} />);

      // Assert
      expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/telefone/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/endereço/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/bairro/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/cidade/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/estado/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/cep/i)).toBeInTheDocument();
    });

    test('deve renderizar botões de ação', () => {
      // Arrange & Act
      renderWithProviders(<ClientFormDialog {...defaultProps} />);

      // Assert
      expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /criar cliente/i })).toBeInTheDocument();
    });
  });

  describe('Modo de edição', () => {
    test('deve mostrar título correto para edição', () => {
      // Arrange
      const props = { ...defaultProps, editingClient: mockEditingClient };

      // Act
      renderWithProviders(<ClientFormDialog {...props} />);

      // Assert
      expect(screen.getByText('Editar Cliente')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /salvar alterações/i })).toBeInTheDocument();
    });

    test('deve preencher campos com dados do cliente em edição', () => {
      // Arrange
      const props = { ...defaultProps, editingClient: mockEditingClient };

      // Act
      renderWithProviders(<ClientFormDialog {...props} />);

      // Assert
      expect(screen.getByDisplayValue('João Silva')).toBeInTheDocument();
      expect(screen.getByDisplayValue('joao@email.com')).toBeInTheDocument();
      expect(screen.getByDisplayValue('(11) 99999-9999')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Rua A, 123')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Centro')).toBeInTheDocument();
      expect(screen.getByDisplayValue('São Paulo')).toBeInTheDocument();
      expect(screen.getByDisplayValue('SP')).toBeInTheDocument();
      expect(screen.getByDisplayValue('01000-000')).toBeInTheDocument();
    });
  });

  describe('Validação de formulário', () => {
    test('deve mostrar erros para campos obrigatórios vazios', async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithProviders(<ClientFormDialog {...defaultProps} />);

      const submitButton = screen.getByRole('button', { name: /criar cliente/i });

      // Act
      await user.click(submitButton);

      // Assert
      await waitFor(() => {
        expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument();
        expect(screen.getByText('Email é obrigatório')).toBeInTheDocument();
        expect(screen.getByText('Telefone é obrigatório')).toBeInTheDocument();
      });
    });

    test('deve validar formato de email inválido', async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithProviders(<ClientFormDialog {...defaultProps} />);

      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', { name: /criar cliente/i });

      // Act
      await user.type(emailInput, 'email-invalido');
      await user.click(submitButton);

      // Assert
      await waitFor(() => {
        expect(screen.getByText('Email deve ter um formato válido')).toBeInTheDocument();
      });
    });

    test('deve validar formato de telefone inválido', async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithProviders(<ClientFormDialog {...defaultProps} />);

      const phoneInput = screen.getByLabelText(/telefone/i);
      const submitButton = screen.getByRole('button', { name: /criar cliente/i });

      // Act
      await user.type(phoneInput, '123');
      await user.click(submitButton);

      // Assert
      await waitFor(() => {
        expect(screen.getByText('Telefone deve ter 10 ou 11 dígitos')).toBeInTheDocument();
      });
    });

    test('deve validar formato de CEP inválido', async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithProviders(<ClientFormDialog {...defaultProps} />);

      const zipCodeInput = screen.getByLabelText(/cep/i);
      const submitButton = screen.getByRole('button', { name: /criar cliente/i });

      // Act
      await user.type(zipCodeInput, '123');
      await user.click(submitButton);

      // Assert
      await waitFor(() => {
        expect(screen.getByText('CEP deve ter o formato 00000-000')).toBeInTheDocument();
      });
    });
  });

  describe('Formatação de campos', () => {
    test('deve formatar telefone durante digitação', async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithProviders(<ClientFormDialog {...defaultProps} />);

      const phoneInput = screen.getByLabelText(/telefone/i);

      // Act
      await user.type(phoneInput, '11999999999');

      // Assert
      expect(phoneInput).toHaveValue('(11) 99999-9999');
    });

    test('deve formatar CEP durante digitação', async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithProviders(<ClientFormDialog {...defaultProps} />);

      const zipCodeInput = screen.getByLabelText(/cep/i);

      // Act
      await user.type(zipCodeInput, '01000000');

      // Assert
      expect(zipCodeInput).toHaveValue('01000-000');
    });

    test('deve limitar estado a 2 caracteres', async () => {
      // Arrange
      const user = userEvent.setup();
      renderWithProviders(<ClientFormDialog {...defaultProps} />);

      const stateInput = screen.getByLabelText(/estado/i);

      // Act
      await user.type(stateInput, 'SPSP');

      // Assert
      expect(stateInput).toHaveValue('SP');
    });
  });

  describe('Interações', () => {
    test('deve chamar onClose ao clicar em cancelar', async () => {
      // Arrange
      const user = userEvent.setup();
      const mockOnClose = jest.fn();
      const props = { ...defaultProps, onClose: mockOnClose };
      renderWithProviders(<ClientFormDialog {...props} />);

      const cancelButton = screen.getByRole('button', { name: /cancelar/i });

      // Act
      await user.click(cancelButton);

      // Assert
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test('deve chamar onSubmit com dados válidos', async () => {
      // Arrange
      const user = userEvent.setup();
      const mockOnSubmit = jest.fn();
      const props = { ...defaultProps, onSubmit: mockOnSubmit };
      renderWithProviders(<ClientFormDialog {...props} />);

      // Preencher campos obrigatórios
      await user.type(screen.getByLabelText(/nome completo/i), 'João Silva');
      await user.type(screen.getByLabelText(/email/i), 'joao@email.com');
      await user.type(screen.getByLabelText(/telefone/i), '11999999999');

      const submitButton = screen.getByRole('button', { name: /criar cliente/i });

      // Act
      await user.click(submitButton);

      // Assert
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          name: 'João Silva',
          email: 'joao@email.com',
          phone: '11999999999',
          address: '',
          neighborhood: '',
          city: '',
          state: '',
          zipCode: '',
        });
      });
    });

    test('deve resetar formulário após fechamento', async () => {
      // Arrange
      const user = userEvent.setup();
      const { rerender } = renderWithProviders(<ClientFormDialog {...defaultProps} />);

      await user.type(screen.getByLabelText(/nome completo/i), 'Teste');

      // Act - fechar e reabrir
      rerender(<ClientFormDialog {...{ ...defaultProps, open: false }} />);
      rerender(<ClientFormDialog {...defaultProps} />);

      // Assert
      expect(screen.getByLabelText(/nome completo/i)).toHaveValue('');
    });
  });

  describe('Estados de carregamento', () => {
    test('deve desabilitar botões durante carregamento', () => {
      // Arrange
      const props = { ...defaultProps, loading: true };

      // Act
      renderWithProviders(<ClientFormDialog {...props} />);

      // Assert
      const submitButton = screen.getByRole('button', { name: /criar cliente/i });
      expect(submitButton).toBeDisabled();
    });

    test('deve mostrar indicador de carregamento', () => {
      // Arrange
      const props = { ...defaultProps, loading: true };

      // Act
      renderWithProviders(<ClientFormDialog {...props} />);

      // Assert
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  describe('Busca de CEP', () => {
    test('deve buscar endereço ao digitar CEP válido', async () => {
      // Arrange
      const user = userEvent.setup();
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          logradouro: 'Praça da Sé',
          bairro: 'Sé',
          localidade: 'São Paulo',
          uf: 'SP',
        }),
      });

      renderWithProviders(<ClientFormDialog {...defaultProps} />);

      const zipCodeInput = screen.getByLabelText(/cep/i);

      // Act
      await user.type(zipCodeInput, '01001000');
      fireEvent.blur(zipCodeInput);

      // Assert
      await waitFor(() => {
        expect(screen.getByDisplayValue('Praça da Sé')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Sé')).toBeInTheDocument();
        expect(screen.getByDisplayValue('São Paulo')).toBeInTheDocument();
        expect(screen.getByDisplayValue('SP')).toBeInTheDocument();
      });
    });

    test('deve lidar com erro na busca de CEP', async () => {
      // Arrange
      const user = userEvent.setup();
      global.fetch = jest.fn().mockRejectedValue(new Error('Erro na API'));

      renderWithProviders(<ClientFormDialog {...defaultProps} />);

      const zipCodeInput = screen.getByLabelText(/cep/i);

      // Act
      await user.type(zipCodeInput, '01001000');
      fireEvent.blur(zipCodeInput);

      // Assert
      // Campos devem permanecer vazios
      await waitFor(() => {
        expect(screen.getByLabelText(/endereço/i)).toHaveValue('');
      });
    });
  });

  describe('Acessibilidade', () => {
    test('deve ter títulos com hierarquia correta', () => {
      // Arrange & Act
      renderWithProviders(<ClientFormDialog {...defaultProps} />);

      // Assert
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Criar Cliente');
    });

    test('deve ter labels associados aos inputs', () => {
      // Arrange & Act
      renderWithProviders(<ClientFormDialog {...defaultProps} />);

      // Assert
      const nameInput = screen.getByLabelText(/nome completo/i);
      const emailInput = screen.getByLabelText(/email/i);
      
      expect(nameInput).toHaveAttribute('id');
      expect(emailInput).toHaveAttribute('id');
    });

    test('deve ter foco inicial no primeiro campo', () => {
      // Arrange & Act
      renderWithProviders(<ClientFormDialog {...defaultProps} />);

      // Assert
      const nameInput = screen.getByLabelText(/nome completo/i);
      expect(nameInput).toHaveFocus();
    });
  });
});
