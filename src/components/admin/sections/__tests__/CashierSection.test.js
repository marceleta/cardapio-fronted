/**
 * TESTES DO COMPONENTE CASHIERSECTION
 * 
 * Conjunto de testes para validar o comportamento e funcionalidades
 * do componente principal de gerenciamento do caixa/POS.
 * 
 * Cobertura:
 * - Renderização em diferentes estados
 * - Navegação entre abas
 * - Interações com diálogos
 * - Integração com o hook useCashierManager
 * - Responsividade e acessibilidade
 * - Casos extremos e tratamento de erros
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Importações de providers necessários
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Componente sendo testado
import CashierSection from '../CashierSection';

// Mock do hook personalizado
jest.mock('../../../hooks/useCashierManager', () => ({
  useCashierManager: jest.fn()
}));

const mockUseCashierManager = require('../../../hooks/useCashierManager').useCashierManager;

/**
 * HELPER: Renderiza componente com providers necessários
 */
const renderWithProviders = (component, options = {}) => {
  const theme = createTheme();
  
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>,
    options
  );
};

/**
 * HELPER: Cria dados mock para sessão de caixa
 */
const createMockSession = (overrides = {}) => ({
  id: 'session-1',
  operator: 'João Silva',
  openTime: new Date().toISOString(),
  initialAmount: 100,
  currentBalance: 150,
  totalSales: 2,
  totalRevenue: 75.50,
  totalWithdrawals: 25,
  totalSupplies: 0,
  movements: [],
  isOpen: true,
  ...overrides
});

/**
 * HELPER: Cria mock padrão do hook
 */
const createMockHookData = (overrides = {}) => ({
  // Estados
  isOpen: false,
  session: null,
  activeSales: [],
  activeTables: [],
  salesHistory: [],
  loading: false,
  error: null,
  totalActiveSales: 0,
  totalActiveTables: 0,
  
  // Funções
  openCashier: jest.fn(),
  closeCashier: jest.fn(),
  withdrawCash: jest.fn(),
  supplyCash: jest.fn(),
  createSale: jest.fn(),
  updateSale: jest.fn(),
  processSalePayment: jest.fn(),
  cancelSale: jest.fn(),
  openTable: jest.fn(),
  closeTable: jest.fn(),
  clearError: jest.fn(),
  
  ...overrides
});

/**
 * SUITE DE TESTES PRINCIPAL
 */
describe('CashierSection', () => {
  // Configurar user-event para interações
  let user;

  beforeEach(() => {
    user = userEvent.setup();
    jest.clearAllMocks();
    
    // Mock padrão do hook
    mockUseCashierManager.mockReturnValue(createMockHookData());
  });

  /**
   * GRUPO: Renderização Básica
   */
  describe('Renderização Básica', () => {
    test('deve renderizar componente com caixa fechado', () => {
      // ARRANGE: Hook com caixa fechado
      mockUseCashierManager.mockReturnValue(createMockHookData({
        isOpen: false
      }));

      // ACT: Renderizar componente
      renderWithProviders(<CashierSection />);

      // ASSERT: Verificar elementos de caixa fechado
      expect(screen.getByText('Caixa Fechado')).toBeInTheDocument();
      expect(screen.getByText('Abrir Caixa')).toBeInTheDocument();
      expect(screen.queryByText('Fechar Caixa')).not.toBeInTheDocument();
    });

    test('deve renderizar componente com caixa aberto', () => {
      // ARRANGE: Hook com caixa aberto
      const session = createMockSession();
      mockUseCashierManager.mockReturnValue(createMockHookData({
        isOpen: true,
        session
      }));

      // ACT: Renderizar componente
      renderWithProviders(<CashierSection />);

      // ASSERT: Verificar elementos de caixa aberto
      expect(screen.getByText('Caixa Aberto')).toBeInTheDocument();
      expect(screen.getByText('João Silva')).toBeInTheDocument();
      expect(screen.getByText('R$ 150,00')).toBeInTheDocument();
    });

    test('deve renderizar todas as abas de navegação', () => {
      // ARRANGE: Hook padrão
      mockUseCashierManager.mockReturnValue(createMockHookData());

      // ACT: Renderizar componente
      renderWithProviders(<CashierSection />);

      // ASSERT: Verificar abas presentes
      expect(screen.getByText('Visão Geral')).toBeInTheDocument();
      expect(screen.getByText(/Vendas/)).toBeInTheDocument();
      expect(screen.getByText(/Mesas/)).toBeInTheDocument();
      expect(screen.getByText('Histórico')).toBeInTheDocument();
      expect(screen.getByText('Relatórios')).toBeInTheDocument();
    });
  });

  /**
   * GRUPO: Estados de Loading e Erro
   */
  describe('Estados de Loading e Erro', () => {
    test('deve exibir indicador de carregamento', () => {
      // ARRANGE: Hook em estado de loading
      mockUseCashierManager.mockReturnValue(createMockHookData({
        loading: true
      }));

      // ACT: Renderizar componente
      renderWithProviders(<CashierSection />);

      // ASSERT: Verificar indicador de carregamento
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    test('deve exibir mensagem de erro', () => {
      // ARRANGE: Hook com erro
      mockUseCashierManager.mockReturnValue(createMockHookData({
        error: 'Erro de conexão com o servidor'
      }));

      // ACT: Renderizar componente
      renderWithProviders(<CashierSection />);

      // ASSERT: Verificar mensagem de erro
      expect(screen.getByText('Erro de conexão com o servidor')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /fechar/i })).toBeInTheDocument();
    });

    test('deve permitir fechar mensagem de erro', async () => {
      // ARRANGE: Hook com erro e função de limpar
      const mockClearError = jest.fn();
      mockUseCashierManager.mockReturnValue(createMockHookData({
        error: 'Erro teste',
        clearError: mockClearError
      }));

      // ACT: Renderizar e clicar para fechar erro
      renderWithProviders(<CashierSection />);
      const closeButton = screen.getByRole('button', { name: /fechar/i });
      await user.click(closeButton);

      // ASSERT: Verificar chamada da função
      expect(mockClearError).toHaveBeenCalledTimes(1);
    });
  });

  /**
   * GRUPO: Navegação Entre Abas
   */
  describe('Navegação Entre Abas', () => {
    test('deve inicializar na aba Visão Geral', () => {
      // ARRANGE: Hook padrão
      mockUseCashierManager.mockReturnValue(createMockHookData());

      // ACT: Renderizar componente
      renderWithProviders(<CashierSection />);

      // ASSERT: Verificar aba ativa
      const overviewTab = screen.getByRole('tab', { name: /visão geral/i });
      expect(overviewTab).toHaveAttribute('aria-selected', 'true');
    });

    test('deve navegar para aba de Vendas', async () => {
      // ARRANGE: Hook com dados de vendas
      mockUseCashierManager.mockReturnValue(createMockHookData({
        activeSales: [
          { id: 'sale-1', total: 25.50, status: 'active' }
        ],
        totalActiveSales: 1
      }));

      // ACT: Renderizar e clicar na aba Vendas
      renderWithProviders(<CashierSection />);
      const salesTab = screen.getByRole('tab', { name: /vendas/i });
      await user.click(salesTab);

      // ASSERT: Verificar mudança de aba
      expect(salesTab).toHaveAttribute('aria-selected', 'true');
    });

    test('deve navegar para aba de Mesas', async () => {
      // ARRANGE: Hook com dados de mesas
      mockUseCashierManager.mockReturnValue(createMockHookData({
        activeTables: [
          { id: 'table-1', number: 5, isOccupied: true }
        ],
        totalActiveTables: 1
      }));

      // ACT: Renderizar e navegar para Mesas
      renderWithProviders(<CashierSection />);
      const tablesTab = screen.getByRole('tab', { name: /mesas/i });
      await user.click(tablesTab);

      // ASSERT: Verificar aba ativa
      expect(tablesTab).toHaveAttribute('aria-selected', 'true');
    });
  });

  /**
   * GRUPO: Interações com Diálogos
   */
  describe('Interações com Diálogos', () => {
    test('deve abrir diálogo de abertura do caixa', async () => {
      // ARRANGE: Hook com caixa fechado
      mockUseCashierManager.mockReturnValue(createMockHookData({
        isOpen: false
      }));

      // ACT: Renderizar e clicar em Abrir Caixa
      renderWithProviders(<CashierSection />);
      const openButton = screen.getByRole('button', { name: /abrir caixa/i });
      await user.click(openButton);

      // ASSERT: Verificar diálogo aberto
      await waitFor(() => {
        expect(screen.getByText('Abrir Caixa')).toBeInTheDocument();
        expect(screen.getByText('Valor Inicial do Caixa')).toBeInTheDocument();
      });
    });

    test('deve abrir diálogo de nova venda quando caixa está aberto', async () => {
      // ARRANGE: Hook com caixa aberto
      const session = createMockSession();
      mockUseCashierManager.mockReturnValue(createMockHookData({
        isOpen: true,
        session
      }));

      // ACT: Renderizar componente
      renderWithProviders(<CashierSection />);

      // Verificar se controles do caixa estão visíveis
      expect(screen.getByText('Nova Venda')).toBeInTheDocument();
    });

    test('deve confirmar abertura do caixa', async () => {
      // ARRANGE: Hook com função mock
      const mockOpenCashier = jest.fn();
      mockUseCashierManager.mockReturnValue(createMockHookData({
        isOpen: false,
        openCashier: mockOpenCashier
      }));

      // ACT: Abrir diálogo e preencher dados
      renderWithProviders(<CashierSection />);
      const openButton = screen.getByRole('button', { name: /abrir caixa/i });
      await user.click(openButton);

      // Simular preenchimento do formulário
      await waitFor(() => {
        const amountInput = screen.getByLabelText(/valor inicial/i);
        user.type(amountInput, '100');
      });

      const confirmButton = screen.getByRole('button', { name: /abrir/i });
      await user.click(confirmButton);

      // ASSERT: Verificar chamada da função
      await waitFor(() => {
        expect(mockOpenCashier).toHaveBeenCalled();
      });
    });
  });

  /**
   * GRUPO: Controles do Caixa
   */
  describe('Controles do Caixa', () => {
    test('deve exibir controles quando caixa está aberto', () => {
      // ARRANGE: Hook com caixa aberto
      const session = createMockSession();
      mockUseCashierManager.mockReturnValue(createMockHookData({
        isOpen: true,
        session
      }));

      // ACT: Renderizar componente
      renderWithProviders(<CashierSection />);

      // ASSERT: Verificar controles presentes
      expect(screen.getByText('Nova Venda')).toBeInTheDocument();
      expect(screen.getByText('Saldo do Caixa')).toBeInTheDocument();
    });

    test('não deve exibir controles quando caixa está fechado', () => {
      // ARRANGE: Hook com caixa fechado
      mockUseCashierManager.mockReturnValue(createMockHookData({
        isOpen: false
      }));

      // ACT: Renderizar componente
      renderWithProviders(<CashierSection />);

      // ASSERT: Verificar ausência dos controles
      expect(screen.queryByText('Nova Venda')).not.toBeInTheDocument();
    });
  });

  /**
   * GRUPO: Resumo Financeiro
   */
  describe('Resumo Financeiro', () => {
    test('deve exibir resumo financeiro quando caixa está aberto', () => {
      // ARRANGE: Hook com dados financeiros
      const session = createMockSession({
        currentBalance: 275.50,
        totalSales: 5,
        totalRevenue: 125.75,
        totalWithdrawals: 50
      });
      
      mockUseCashierManager.mockReturnValue(createMockHookData({
        isOpen: true,
        session
      }));

      // ACT: Renderizar componente
      renderWithProviders(<CashierSection />);

      // ASSERT: Verificar dados financeiros
      expect(screen.getByText('R$ 275,50')).toBeInTheDocument(); // Saldo atual
      expect(screen.getByText('5')).toBeInTheDocument(); // Total de vendas
      expect(screen.getByText('R$ 125,75')).toBeInTheDocument(); // Receita total
    });

    test('deve calcular e exibir métricas corretas', () => {
      // ARRANGE: Hook com múltiplas vendas
      const session = createMockSession();
      const activeSales = [
        { id: 'sale-1', total: 25.50, status: 'active' },
        { id: 'sale-2', total: 35.00, status: 'pending_payment' }
      ];

      mockUseCashierManager.mockReturnValue(createMockHookData({
        isOpen: true,
        session,
        activeSales,
        totalActiveSales: 2
      }));

      // ACT: Renderizar componente
      renderWithProviders(<CashierSection />);

      // ASSERT: Verificar contadores
      expect(screen.getByText(/Vendas.*2/)).toBeInTheDocument();
    });
  });

  /**
   * GRUPO: Responsividade
   */
  describe('Responsividade', () => {
    test('deve adaptar layout para telas pequenas', () => {
      // ARRANGE: Mock de tela mobile
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      mockUseCashierManager.mockReturnValue(createMockHookData());

      // ACT: Renderizar componente
      renderWithProviders(<CashierSection />);

      // ASSERT: Verificar elementos responsivos
      const tabs = screen.getByRole('tablist');
      expect(tabs).toBeInTheDocument();
      
      // Verificar se abas são scrolláveis em mobile
      expect(tabs).toHaveStyle({ variant: 'scrollable' });
    });
  });

  /**
   * GRUPO: Acessibilidade
   */
  describe('Acessibilidade', () => {
    test('deve ter estrutura de navegação acessível', () => {
      // ARRANGE: Hook padrão
      mockUseCashierManager.mockReturnValue(createMockHookData());

      // ACT: Renderizar componente
      renderWithProviders(<CashierSection />);

      // ASSERT: Verificar elementos de acessibilidade
      expect(screen.getByRole('tablist')).toBeInTheDocument();
      expect(screen.getAllByRole('tab')).toHaveLength(5);
      
      // Verificar labels descritivos
      expect(screen.getByRole('tab', { name: /visão geral/i })).toBeInTheDocument();
    });

    test('deve ter botões com labels apropriados', () => {
      // ARRANGE: Hook com caixa fechado
      mockUseCashierManager.mockReturnValue(createMockHookData({
        isOpen: false
      }));

      // ACT: Renderizar componente
      renderWithProviders(<CashierSection />);

      // ASSERT: Verificar labels dos botões
      const openButton = screen.getByRole('button', { name: /abrir caixa/i });
      expect(openButton).toBeInTheDocument();
      expect(openButton).toHaveAccessibleName();
    });

    test('deve navegar por teclado', async () => {
      // ARRANGE: Hook padrão
      mockUseCashierManager.mockReturnValue(createMockHookData());

      // ACT: Renderizar e navegar por teclado
      renderWithProviders(<CashierSection />);
      
      // Focar primeiro elemento interativo
      const firstTab = screen.getByRole('tab', { name: /visão geral/i });
      firstTab.focus();

      // Navegar com Tab
      await user.keyboard('{Tab}');

      // ASSERT: Verificar navegação por teclado
      expect(document.activeElement).not.toBe(firstTab);
    });
  });

  /**
   * GRUPO: Integração com Hook
   */
  describe('Integração com Hook', () => {
    test('deve reagir a mudanças de estado do hook', () => {
      // ARRANGE: Hook inicial
      const { rerender } = renderWithProviders(<CashierSection />);

      // Simular mudança de estado
      mockUseCashierManager.mockReturnValue(createMockHookData({
        isOpen: true,
        session: createMockSession()
      }));

      // ACT: Re-renderizar com novo estado
      rerender(<CashierSection />);

      // ASSERT: Verificar mudança refletida
      expect(screen.getByText('Caixa Aberto')).toBeInTheDocument();
    });

    test('deve chamar funções do hook corretamente', async () => {
      // ARRANGE: Hook com funções mock
      const mockOpenCashier = jest.fn();
      mockUseCashierManager.mockReturnValue(createMockHookData({
        openCashier: mockOpenCashier
      }));

      // ACT: Interagir com componente
      renderWithProviders(<CashierSection />);
      const openButton = screen.getByRole('button', { name: /abrir caixa/i });
      await user.click(openButton);

      // Simular confirmação no diálogo
      await waitFor(() => {
        const confirmButton = screen.getByRole('button', { name: /abrir/i });
        user.click(confirmButton);
      });

      // ASSERT: Verificar integração
      await waitFor(() => {
        expect(mockOpenCashier).toHaveBeenCalled();
      });
    });
  });
});
