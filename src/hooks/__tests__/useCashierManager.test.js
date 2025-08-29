/**
 * TESTES DO HOOK USECASHIERMANAGER
 * 
 * Conjunto de testes para validar o comportamento e funcionalidades
 * do hook personalizado de gerenciamento do caixa/POS.
 * 
 * Cobertura:
 * - Estados iniciais e configurações
 * - Operações de abertura e fechamento
 * - Gestão de vendas e pagamentos
 * - Controle de mesas e movimentações
 * - Cálculos e validações
 * - Casos extremos e tratamento de erros
 */

import { renderHook, act } from '@testing-library/react';
import { useCashierManager } from '../useCashierManager';

// Mock do localStorage para testes isolados
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

/**
 * SUITE DE TESTES PRINCIPAL
 */
describe('useCashierManager', () => {
  // Limpar mocks e localStorage antes de cada teste
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  /**
   * GRUPO: Estados Iniciais
   */
  describe('Estados Iniciais', () => {
    test('deve inicializar com caixa fechado', () => {
      // ACT: Renderizar hook
      const { result } = renderHook(() => useCashierManager());

      // ASSERT: Verificar estado inicial
      expect(result.current.isOpen).toBe(false);
      expect(result.current.session).toBe(null);
      expect(result.current.activeSales).toEqual([]);
      expect(result.current.activeTables).toEqual([]);
      expect(result.current.salesHistory).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    test('deve carregar dados persistidos do localStorage', () => {
      // ARRANGE: Mock de dados salvos
      const savedData = {
        session: {
          id: 'session-1',
          operator: 'João Silva',
          openTime: new Date().toISOString(),
          initialAmount: 100,
          currentBalance: 150,
          isOpen: true
        },
        activeSales: [
          { id: 'sale-1', total: 25.50, status: 'active' }
        ]
      };
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(savedData));

      // ACT: Renderizar hook
      const { result } = renderHook(() => useCashierManager());

      // ASSERT: Verificar dados carregados
      expect(result.current.isOpen).toBe(true);
      expect(result.current.session.operator).toBe('João Silva');
      expect(result.current.activeSales).toHaveLength(1);
    });
  });

  /**
   * GRUPO: Operações de Caixa
   */
  describe('Operações de Caixa', () => {
    test('deve abrir caixa com valor inicial', async () => {
      // ARRANGE: Preparar hook
      const { result } = renderHook(() => useCashierManager());

      // ACT: Abrir caixa
      await act(async () => {
        result.current.openCashier(100, 'Abertura turno manhã');
      });

      // ASSERT: Verificar estado após abertura
      expect(result.current.isOpen).toBe(true);
      expect(result.current.session.initialAmount).toBe(100);
      expect(result.current.session.currentBalance).toBe(100);
      expect(result.current.session.observations).toBe('Abertura turno manhã');
      expect(mockLocalStorage.setItem).toHaveBeenCalled();
    });

    test('deve fechar caixa e gerar relatório', async () => {
      // ARRANGE: Hook com caixa aberto
      const { result } = renderHook(() => useCashierManager());
      await act(async () => {
        result.current.openCashier(100, 'Teste');
      });

      // ACT: Fechar caixa
      await act(async () => {
        result.current.closeCashier(120, 'Fechamento teste');
      });

      // ASSERT: Verificar fechamento
      expect(result.current.isOpen).toBe(false);
      expect(result.current.session.finalAmount).toBe(120);
      expect(result.current.session.closeTime).toBeDefined();
    });

    test('deve rejeitar abertura quando caixa já está aberto', async () => {
      // ARRANGE: Hook com caixa já aberto
      const { result } = renderHook(() => useCashierManager());
      await act(async () => {
        result.current.openCashier(100, 'Primeiro');
      });

      // ACT: Tentar abrir novamente
      await act(async () => {
        result.current.openCashier(200, 'Segundo');
      });

      // ASSERT: Verificar erro
      expect(result.current.error).toContain('Caixa já está aberto');
      expect(result.current.session.initialAmount).toBe(100); // Valor original
    });
  });

  /**
   * GRUPO: Gestão de Vendas
   */
  describe('Gestão de Vendas', () => {
    test('deve criar nova venda', async () => {
      // ARRANGE: Caixa aberto
      const { result } = renderHook(() => useCashierManager());
      await act(async () => {
        result.current.openCashier(100, 'Teste');
      });

      const saleData = {
        customer: { name: 'João Silva' },
        table: 'Mesa 1',
        type: 'dine_in',
        items: [{ id: 1, name: 'Pizza', quantity: 1, price: 25.50 }]
      };

      // ACT: Criar venda
      await act(async () => {
        result.current.createSale(saleData);
      });

      // ASSERT: Verificar venda criada
      expect(result.current.activeSales).toHaveLength(1);
      expect(result.current.activeSales[0].customer.name).toBe('João Silva');
      expect(result.current.activeSales[0].status).toBe('active');
    });

    test('deve processar pagamento de venda', async () => {
      // ARRANGE: Caixa com venda ativa
      const { result } = renderHook(() => useCashierManager());
      await act(async () => {
        result.current.openCashier(100, 'Teste');
        result.current.createSale({
          customer: { name: 'Cliente' },
          items: [{ id: 1, price: 25.50, quantity: 1 }]
        });
      });

      const saleId = result.current.activeSales[0].id;
      const paymentData = {
        method: 'cash',
        amount: 25.50,
        receivedAmount: 30.00,
        change: 4.50
      };

      // ACT: Processar pagamento
      await act(async () => {
        result.current.processSalePayment(saleId, paymentData);
      });

      // ASSERT: Verificar pagamento processado
      expect(result.current.activeSales).toHaveLength(0); // Venda removida de ativas
      expect(result.current.salesHistory).toHaveLength(1); // Venda no histórico
      expect(result.current.session.currentBalance).toBe(125.50); // Saldo atualizado
    });

    test('deve cancelar venda ativa', async () => {
      // ARRANGE: Venda ativa
      const { result } = renderHook(() => useCashierManager());
      await act(async () => {
        result.current.openCashier(100, 'Teste');
        result.current.createSale({ customer: { name: 'Cliente' } });
      });

      const saleId = result.current.activeSales[0].id;

      // ACT: Cancelar venda
      await act(async () => {
        result.current.cancelSale(saleId);
      });

      // ASSERT: Verificar cancelamento
      expect(result.current.activeSales).toHaveLength(0);
      expect(result.current.salesHistory[0].status).toBe('cancelled');
    });
  });

  /**
   * GRUPO: Movimentações Financeiras
   */
  describe('Movimentações Financeiras', () => {
    test('deve realizar sangria', async () => {
      // ARRANGE: Caixa com saldo
      const { result } = renderHook(() => useCashierManager());
      await act(async () => {
        result.current.openCashier(200, 'Teste');
      });

      // ACT: Realizar sangria
      await act(async () => {
        result.current.withdrawCash(50, 'Sangria para depósito');
      });

      // ASSERT: Verificar sangria
      expect(result.current.session.currentBalance).toBe(150);
      expect(result.current.session.totalWithdrawals).toBe(50);
      expect(result.current.session.movements).toHaveLength(1);
      expect(result.current.session.movements[0].type).toBe('withdrawal');
    });

    test('deve realizar suprimento', async () => {
      // ARRANGE: Caixa aberto
      const { result } = renderHook(() => useCashierManager());
      await act(async () => {
        result.current.openCashier(100, 'Teste');
      });

      // ACT: Realizar suprimento
      await act(async () => {
        result.current.supplyCash(50, 'Suprimento para troco');
      });

      // ASSERT: Verificar suprimento
      expect(result.current.session.currentBalance).toBe(150);
      expect(result.current.session.totalSupplies).toBe(50);
      expect(result.current.session.movements[0].type).toBe('supply');
    });

    test('deve rejeitar sangria maior que saldo disponível', async () => {
      // ARRANGE: Caixa com pouco saldo
      const { result } = renderHook(() => useCashierManager());
      await act(async () => {
        result.current.openCashier(50, 'Teste');
      });

      // ACT: Tentar sangria maior que saldo
      await act(async () => {
        result.current.withdrawCash(100, 'Sangria inválida');
      });

      // ASSERT: Verificar erro
      expect(result.current.error).toContain('Saldo insuficiente');
      expect(result.current.session.currentBalance).toBe(50); // Saldo inalterado
    });
  });

  /**
   * GRUPO: Controle de Mesas
   */
  describe('Controle de Mesas', () => {
    test('deve abrir mesa', async () => {
      // ARRANGE: Caixa aberto
      const { result } = renderHook(() => useCashierManager());
      await act(async () => {
        result.current.openCashier(100, 'Teste');
      });

      const tableData = {
        number: 5,
        capacity: 4,
        customer: 'João Silva'
      };

      // ACT: Abrir mesa
      await act(async () => {
        result.current.openTable(tableData);
      });

      // ASSERT: Verificar mesa aberta
      expect(result.current.activeTables).toHaveLength(1);
      expect(result.current.activeTables[0].isOccupied).toBe(true);
      expect(result.current.activeTables[0].customer).toBe('João Silva');
    });

    test('deve fechar mesa', async () => {
      // ARRANGE: Mesa ativa
      const { result } = renderHook(() => useCashierManager());
      await act(async () => {
        result.current.openCashier(100, 'Teste');
        result.current.openTable({ number: 5, capacity: 4 });
      });

      const tableId = result.current.activeTables[0].id;

      // ACT: Fechar mesa
      await act(async () => {
        result.current.closeTable(tableId);
      });

      // ASSERT: Verificar mesa fechada
      expect(result.current.activeTables[0].isOccupied).toBe(false);
      expect(result.current.activeTables[0].customer).toBe(null);
    });
  });

  /**
   * GRUPO: Cálculos e Validações
   */
  describe('Cálculos e Validações', () => {
    test('deve calcular totais corretamente', async () => {
      // ARRANGE: Caixa com vendas e movimentações
      const { result } = renderHook(() => useCashierManager());
      await act(async () => {
        result.current.openCashier(100, 'Teste');
        
        // Criar venda e processar pagamento
        result.current.createSale({
          items: [{ price: 25.50, quantity: 1 }]
        });
        const saleId = result.current.activeSales[0].id;
        result.current.processSalePayment(saleId, {
          method: 'cash',
          amount: 25.50
        });

        // Realizar movimentações
        result.current.withdrawCash(20, 'Sangria');
        result.current.supplyCash(10, 'Suprimento');
      });

      // ASSERT: Verificar cálculos
      expect(result.current.session.totalRevenue).toBe(25.50);
      expect(result.current.session.totalWithdrawals).toBe(20);
      expect(result.current.session.totalSupplies).toBe(10);
      expect(result.current.session.currentBalance).toBe(115.50); // 100 + 25.50 - 20 + 10
    });

    test('deve validar dados de entrada', async () => {
      // ARRANGE: Hook inicializado
      const { result } = renderHook(() => useCashierManager());

      // ACT & ASSERT: Testar validações
      await act(async () => {
        // Valor inicial inválido
        result.current.openCashier(-10, 'Teste');
      });
      expect(result.current.error).toContain('Valor inicial deve ser positivo');

      await act(async () => {
        result.current.clearError();
        result.current.openCashier(100, 'Teste');
        
        // Sangria com valor inválido
        result.current.withdrawCash(0, 'Teste');
      });
      expect(result.current.error).toContain('Valor deve ser maior que zero');
    });
  });

  /**
   * GRUPO: Persistência de Dados
   */
  describe('Persistência de Dados', () => {
    test('deve salvar dados no localStorage após mudanças', async () => {
      // ARRANGE: Hook inicializado
      const { result } = renderHook(() => useCashierManager());

      // ACT: Realizar operações
      await act(async () => {
        result.current.openCashier(100, 'Teste');
      });

      // ASSERT: Verificar salvamento
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'cashier-session',
        expect.stringContaining('"initialAmount":100')
      );
    });

    test('deve limpar dados ao fechar caixa', async () => {
      // ARRANGE: Caixa aberto
      const { result } = renderHook(() => useCashierManager());
      await act(async () => {
        result.current.openCashier(100, 'Teste');
      });

      // ACT: Fechar caixa
      await act(async () => {
        result.current.closeCashier(100, 'Fechamento');
      });

      // ASSERT: Verificar limpeza dos dados ativos
      expect(result.current.activeSales).toEqual([]);
      expect(result.current.activeTables).toEqual([]);
    });
  });

  /**
   * GRUPO: Tratamento de Erros
   */
  describe('Tratamento de Erros', () => {
    test('deve capturar erros de localStorage', () => {
      // ARRANGE: Mock que falha
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('LocalStorage não disponível');
      });

      // ACT: Renderizar hook
      const { result } = renderHook(() => useCashierManager());

      // ASSERT: Deve inicializar com estado padrão
      expect(result.current.isOpen).toBe(false);
      expect(result.current.error).toBe(null); // Erro de carregamento não deve quebrar hook
    });

    test('deve limpar erro quando clearError é chamado', async () => {
      // ARRANGE: Hook com erro
      const { result } = renderHook(() => useCashierManager());
      await act(async () => {
        result.current.openCashier(-10, 'Teste'); // Gera erro
      });

      // ACT: Limpar erro
      act(() => {
        result.current.clearError();
      });

      // ASSERT: Verificar erro limpo
      expect(result.current.error).toBe(null);
    });
  });
});
