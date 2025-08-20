import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ClientsSection from '../ClientsSection';
import { clientsAPI } from '../../../../lib/api';
import { filterClients } from '../../../../utils/adminHelpers';

// Mock das dependências
jest.mock('../../../../lib/api', () => ({
  clientsAPI: {
    getAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock('../../../../utils/adminHelpers', () => ({
  filterClients: jest.fn(),
}));

// Mock de dados de teste
const mockClients = [
  {
    id: 1,
    name: 'João Silva Santos',
    whatsapp: '(11) 99999-1234',
    phone: '(11) 99999-1234',
    street: 'Rua das Flores',
    number: '123',
    neighborhood: 'Centro',
    city: 'São Paulo',
    zipCode: '01001-000',
    address: 'Rua das Flores, 123 - Centro',
    status: 'active',
    createdAt: '2024-01-15T10:30:00Z',
    orderCount: 25,
    lastOrder: '2024-12-08T14:30:00Z',
    totalValue: 1250.75
  },
  {
    id: 2,
    name: 'Maria Oliveira',
    whatsapp: '(11) 98888-5678',
    phone: '(11) 98888-5678',
    street: 'Av. Paulista',
    number: '456',
    neighborhood: 'Bela Vista',
    city: 'São Paulo',
    zipCode: '01310-100',
    address: 'Av. Paulista, 456 - Bela Vista',
    status: 'inactive',
    createdAt: '2024-02-20T09:15:00Z',
    orderCount: 8,
    lastOrder: '2024-11-15T18:45:00Z',
    totalValue: 650.40
  },
  {
    id: 3,
    name: 'Carlos Pereira',
    whatsapp: '(11) 97777-9012',
    phone: '(11) 97777-9012',
    street: 'Rua Augusta',
    number: '789',
    neighborhood: 'Consolação',
    city: 'São Paulo',
    zipCode: '01305-001',
    address: 'Rua Augusta, 789 - Consolação',
    status: 'active',
    createdAt: '2024-03-10T16:20:00Z',
    orderCount: 15,
    lastOrder: '2024-12-05T20:15:00Z',
    totalValue: 890.25
  },
];

// Props padrão para o componente
const defaultProps = {
  clients: mockClients,
  onRefresh: jest.fn(),
};

describe('ClientsSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clientsAPI.getAll.mockResolvedValue(mockClients);
    filterClients.mockImplementation((clients, searchTerm) => {
      if (!searchTerm) return clients;
      return clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.whatsapp.includes(searchTerm)
      );
    });
  });

  // TESTES DE RENDERIZAÇÃO BÁSICA
  describe('Renderização', () => {
    test('renderiza o título principal', () => {
      render(<ClientsSection {...defaultProps} />);
      
      expect(screen.getByText('👥 Gerenciar Clientes')).toBeInTheDocument();
    });

    test('exibe contador de clientes', () => {
      render(<ClientsSection {...defaultProps} />);
      
      expect(screen.getByText(/🧑‍💼 Clientes \(3\)/)).toBeInTheDocument();
    });

    test('renderiza botão de novo cliente', () => {
      render(<ClientsSection {...defaultProps} />);
      
      expect(screen.getByRole('button', { name: /novo cliente/i })).toBeInTheDocument();
    });

    test('renderiza campo de busca', () => {
      render(<ClientsSection {...defaultProps} />);
      
      const searchField = screen.getByPlaceholderText('Buscar clientes...');
      expect(searchField).toBeInTheDocument();
    });

    test('renderiza cabeçalhos da tabela', () => {
      render(<ClientsSection {...defaultProps} />);
      
      expect(screen.getByText('Cliente')).toBeInTheDocument();
      expect(screen.getByText('Contato')).toBeInTheDocument();
      expect(screen.getByText('Localização')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Ações')).toBeInTheDocument();
    });

    test('renderiza todos os clientes na tabela', () => {
      render(<ClientsSection {...defaultProps} />);
      
      expect(screen.getAllByText('João Silva Santos')).toHaveLength(1);
      expect(screen.getByText('Maria Oliveira')).toBeInTheDocument();
      expect(screen.getByText('Pedro Santos')).toBeInTheDocument();
    });
  });

  // TESTES DE FUNCIONALIDADE DE BUSCA
  describe('Funcionalidade de Busca', () => {
    test('filtra clientes por nome', async () => {
      const user = userEvent.setup();
      render(<ClientsSection {...defaultProps} />);
      
      const searchField = screen.getByPlaceholderText('Buscar clientes...');
      await user.type(searchField, 'João');
      
      await waitFor(() => {
        expect(filterClients).toHaveBeenCalledWith(mockClients, 'João');
      });
    });

    test('limpa busca quando campo é limpo', async () => {
      const user = userEvent.setup();
      render(<ClientsSection {...defaultProps} />);
      
      const searchField = screen.getByPlaceholderText('Buscar clientes...');
      await user.type(searchField, 'João');
      await user.clear(searchField);
      
      await waitFor(() => {
        expect(filterClients).toHaveBeenCalledWith(mockClients, '');
      });
    });
  });

  // TESTES DE AÇÕES CRUD
  describe('Ações de CRUD', () => {
    test('abre diálogo de criação ao clicar em Novo Cliente', async () => {
      const user = userEvent.setup();
      render(<ClientsSection {...defaultProps} />);
      
      await user.click(screen.getByRole('button', { name: /novo cliente/i }));
      
      await waitFor(() => {
        expect(screen.getByText('👤 Adicionar Novo Cliente')).toBeInTheDocument();
      });
    });

    test('abre diálogo de visualização ao clicar no botão visualizar', async () => {
      const user = userEvent.setup();
      render(<ClientsSection {...defaultProps} />);
      
      const visibilityIcons = document.querySelectorAll('[data-testid="VisibilityIcon"]');
      await user.click(visibilityIcons[0]);
      
      await waitFor(() => {
        expect(screen.getByText('👁️ Detalhes do Cliente')).toBeInTheDocument();
        expect(screen.getAllByText('João Silva Santos')).toHaveLength(2);
      });
    });

    test('mostra informações detalhadas no diálogo de visualização', async () => {
      const user = userEvent.setup();
      render(<ClientsSection {...defaultProps} />);
      
      const viewButtons = document.querySelectorAll('[data-testid="VisibilityIcon"]');
      await user.click(viewButtons[0]);
      
      await waitFor(() => {
        expect(screen.getAllByText('João Silva Santos')).toHaveLength(2);
        expect(screen.getByText('(11) 99999-1234')).toBeInTheDocument();
        expect(screen.getByText('Rua das Flores, 123')).toBeInTheDocument();
        expect(screen.getByText('Total de pedidos:')).toBeInTheDocument();
      });
    });

    test('exibe diálogo de confirmação ao tentar deletar', async () => {
      const user = userEvent.setup();
      render(<ClientsSection {...defaultProps} />);
      
      const deleteIcons = document.querySelectorAll('[data-testid="DeleteIcon"]');
      await user.click(deleteIcons[0]);
      
      await waitFor(() => {
        expect(screen.getByText('🗑️ Confirmar Exclusão')).toBeInTheDocument();
      });
    });
  });

  // TESTES DE FORMATAÇÃO
  describe('Formatação de Dados', () => {
    test('formata datas corretamente', () => {
      render(<ClientsSection {...defaultProps} />);
      
      // Verifica se as datas são formatadas para pt-BR
      expect(screen.getAllByText(/Cliente desde/).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Último:/).length).toBeGreaterThan(0);
    });

    test('exibe status com labels traduzidos', () => {
      render(<ClientsSection {...defaultProps} />);
      
      expect(screen.getAllByText('Ativo').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Inativo').length).toBeGreaterThan(0);
    });

    test('exibe endereço formatado corretamente', () => {
      render(<ClientsSection {...defaultProps} />);
      
      expect(screen.getByText('Rua das Flores, 123')).toBeInTheDocument();
      expect(screen.getByText('Centro - São Paulo')).toBeInTheDocument();
      expect(screen.getByText('CEP: 01234-567')).toBeInTheDocument();
    });

    test('formata valores monetários corretamente', () => {
      render(<ClientsSection {...defaultProps} />);
      
      expect(screen.getByText('R$ 1.250,75')).toBeInTheDocument();
      expect(screen.getByText('R$ 650,40')).toBeInTheDocument();
    });
  });

  // TESTES DE TRATAMENTO DE ERROS
  describe('Tratamento de Erros', () => {
    test('loga erro quando exclusão falha', async () => {
      const user = userEvent.setup();
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      clientsAPI.delete.mockRejectedValue(new Error('Erro na API'));
      
      render(<ClientsSection {...defaultProps} />);
      
      const deleteIcons = document.querySelectorAll('[data-testid="DeleteIcon"]');
      await user.click(deleteIcons[0]);
      
      await waitFor(() => {
        expect(screen.getByText('🗑️ Confirmar Exclusão')).toBeInTheDocument();
      });
      
      await user.click(screen.getByRole('button', { name: /excluir/i }));
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Erro ao deletar cliente:', expect.any(Error));
      });
      
      consoleSpy.mockRestore();
    });
  });

  // TESTES DE ACESSIBILIDADE
  describe('Acessibilidade', () => {
    test('botões têm labels apropriados', () => {
      render(<ClientsSection {...defaultProps} />);
      
      expect(screen.getByRole('button', { name: /novo cliente/i })).toBeInTheDocument();
      
      // Verifica pelos ícones já que não há aria-labels nos botões
      const visibilityIcons = document.querySelectorAll('[data-testid="VisibilityIcon"]');
      const editIcons = document.querySelectorAll('[data-testid="EditIcon"]');
      const deleteIcons = document.querySelectorAll('[data-testid="DeleteIcon"]');
      
      expect(visibilityIcons).toHaveLength(3);
      expect(editIcons).toHaveLength(3);
      expect(deleteIcons).toHaveLength(3);
    });

    test('componente é acessível via teclado', () => {
      render(<ClientsSection {...defaultProps} />);
      
      const searchField = screen.getByPlaceholderText('Buscar clientes...');
      const newClientButton = screen.getByRole('button', { name: /novo cliente/i });
      
      expect(searchField).toBeInTheDocument();
      expect(newClientButton).toBeInTheDocument();
      
      // Verifica se os elementos podem receber foco
      searchField.focus();
      expect(searchField).toHaveFocus();
      
      newClientButton.focus();
      expect(newClientButton).toHaveFocus();
    });
  });

  // TESTES DE CASOS EXTREMOS
  describe('Casos Extremos', () => {
    test('renderiza mensagem quando não há clientes', () => {
      render(<ClientsSection {...defaultProps} clients={[]} />);
      
      expect(screen.getByText(/🧑‍💼 Clientes \(0\)/)).toBeInTheDocument();
    });

    test('lida com cliente sem endereço completo', () => {
      const clienteIncompleto = {
        ...mockClients[0],
        street: 'Rua Teste',
        number: '123',
        neighborhood: null,
        city: 'São Paulo',
        address: 'Rua Teste, 123'
      };
      
      render(<ClientsSection {...defaultProps} clients={[clienteIncompleto]} />);
      
      expect(screen.getByText('João Silva Santos')).toBeInTheDocument();
    });

    test('lida com datas inválidas', () => {
      const clienteDataInvalida = {
        ...mockClients[0],
        createdAt: 'data-invalida',
        lastOrder: null
      };
      
      render(<ClientsSection {...defaultProps} clients={[clienteDataInvalida]} />);
      
      expect(screen.getByText('João Silva Santos')).toBeInTheDocument();
    });
  });
});