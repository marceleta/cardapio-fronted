import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../../../test-utils';
import ClientsHeader from '../ClientsHeader';

describe('ClientsHeader', () => {
  const defaultProps = {
    searchTerm: '',
    onSearchChange: jest.fn(),
    onCreateClick: jest.fn(),
    clientsCount: 0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Renderização inicial', () => {
    test('deve renderizar o título corretamente', () => {
      // Arrange & Act
      renderWithProviders(<ClientsHeader {...defaultProps} />);

      // Assert
      expect(screen.getByText('Gerenciar Clientes')).toBeInTheDocument();
    });

    test('deve renderizar o campo de busca', () => {
      // Arrange & Act
      renderWithProviders(<ClientsHeader {...defaultProps} />);

      // Assert
      expect(screen.getByPlaceholderText('Buscar clientes...')).toBeInTheDocument();
    });

    test('deve renderizar o botão de criar cliente', () => {
      // Arrange & Act
      renderWithProviders(<ClientsHeader {...defaultProps} />);

      // Assert
      const createButton = screen.getByRole('button', { name: /criar cliente/i });
      expect(createButton).toBeInTheDocument();
    });

    test('deve mostrar contagem de clientes quando maior que zero', () => {
      // Arrange
      const props = { ...defaultProps, clientsCount: 5 };

      // Act
      renderWithProviders(<ClientsHeader {...props} />);

      // Assert
      expect(screen.getByText('5 clientes encontrados')).toBeInTheDocument();
    });

    test('deve mostrar mensagem quando não há clientes', () => {
      // Arrange
      const props = { ...defaultProps, clientsCount: 0 };

      // Act
      renderWithProviders(<ClientsHeader {...props} />);

      // Assert
      expect(screen.getByText('Nenhum cliente encontrado')).toBeInTheDocument();
    });
  });

  describe('Interações', () => {
    test('deve chamar onSearchChange quando digitar na busca', () => {
      // Arrange
      const mockOnSearchChange = jest.fn();
      const props = { ...defaultProps, onSearchChange: mockOnSearchChange };
      renderWithProviders(<ClientsHeader {...props} />);

      const searchInput = screen.getByPlaceholderText('Buscar clientes...');

      // Act
      fireEvent.change(searchInput, { target: { value: 'João' } });

      // Assert
      expect(mockOnSearchChange).toHaveBeenCalledWith('João');
    });

    test('deve chamar onCreateClick quando clicar no botão criar', () => {
      // Arrange
      const mockOnCreateClick = jest.fn();
      const props = { ...defaultProps, onCreateClick: mockOnCreateClick };
      renderWithProviders(<ClientsHeader {...props} />);

      const createButton = screen.getByRole('button', { name: /criar cliente/i });

      // Act
      fireEvent.click(createButton);

      // Assert
      expect(mockOnCreateClick).toHaveBeenCalledTimes(1);
    });

    test('deve refletir o valor atual da busca no input', () => {
      // Arrange
      const props = { ...defaultProps, searchTerm: 'Maria' };

      // Act
      renderWithProviders(<ClientsHeader {...props} />);

      // Assert
      const searchInput = screen.getByPlaceholderText('Buscar clientes...');
      expect(searchInput).toHaveValue('Maria');
    });

    test('deve limpar o campo de busca quando valor for vazio', () => {
      // Arrange
      const props = { ...defaultProps, searchTerm: '' };

      // Act
      renderWithProviders(<ClientsHeader {...props} />);

      // Assert
      const searchInput = screen.getByPlaceholderText('Buscar clientes...');
      expect(searchInput).toHaveValue('');
    });
  });

  describe('Acessibilidade', () => {
    test('deve ter botão com texto acessível', () => {
      // Arrange & Act
      renderWithProviders(<ClientsHeader {...defaultProps} />);

      // Assert
      const createButton = screen.getByRole('button', { name: /criar cliente/i });
      expect(createButton).toHaveAttribute('aria-label', 'Criar novo cliente');
    });

    test('deve ter input de busca com label apropriado', () => {
      // Arrange & Act
      renderWithProviders(<ClientsHeader {...defaultProps} />);

      // Assert
      const searchInput = screen.getByPlaceholderText('Buscar clientes...');
      expect(searchInput).toHaveAttribute('type', 'text');
    });
  });

  describe('Estados visuais', () => {
    test('deve mostrar ícone de busca no campo', () => {
      // Arrange & Act
      renderWithProviders(<ClientsHeader {...defaultProps} />);

      // Assert
      const searchIcon = screen.getByTestId('SearchIcon');
      expect(searchIcon).toBeInTheDocument();
    });

    test('deve mostrar ícone de adicionar no botão', () => {
      // Arrange & Act
      renderWithProviders(<ClientsHeader {...defaultProps} />);

      // Assert
      const addIcon = screen.getByTestId('AddIcon');
      expect(addIcon).toBeInTheDocument();
    });
  });

  describe('Formatação de contagem', () => {
    test('deve usar singular para 1 cliente', () => {
      // Arrange
      const props = { ...defaultProps, clientsCount: 1 };

      // Act
      renderWithProviders(<ClientsHeader {...props} />);

      // Assert
      expect(screen.getByText('1 cliente encontrado')).toBeInTheDocument();
    });

    test('deve usar plural para múltiplos clientes', () => {
      // Arrange
      const props = { ...defaultProps, clientsCount: 10 };

      // Act
      renderWithProviders(<ClientsHeader {...props} />);

      // Assert
      expect(screen.getByText('10 clientes encontrados')).toBeInTheDocument();
    });

    test('deve mostrar zero clientes corretamente', () => {
      // Arrange
      const props = { ...defaultProps, clientsCount: 0 };

      // Act
      renderWithProviders(<ClientsHeader {...props} />);

      // Assert
      expect(screen.getByText('Nenhum cliente encontrado')).toBeInTheDocument();
    });
  });
});
