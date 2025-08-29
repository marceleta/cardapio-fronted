/**
 * CONFIGURAÇÃO DE TESTES PARA SISTEMA DE CAIXA
 * 
 * Arquivo de configuração específico para testes do sistema de caixa,
 * incluindo mocks, helpers e utilities para facilitar os testes.
 * 
 * Funcionalidades:
 * - Setup global para testes do caixa
 * - Mocks padronizados para localStorage
 * - Helpers para criação de dados de teste
 * - Utilities para simulação de interações
 * - Configurações de timers e delays
 */

import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Configurar testing library
configure({
  testIdAttribute: 'data-testid',
  asyncUtilTimeout: 5000,
  computedStyleSupportsPseudoElements: true
});

/**
 * MOCK GLOBAL: localStorage
 * Simula comportamento do localStorage para testes
 */
const localStorageMock = {
  store: new Map(),
  
  getItem: jest.fn((key) => {
    return localStorageMock.store.get(key) || null;
  }),
  
  setItem: jest.fn((key, value) => {
    localStorageMock.store.set(key, value);
  }),
  
  removeItem: jest.fn((key) => {
    localStorageMock.store.delete(key);
  }),
  
  clear: jest.fn(() => {
    localStorageMock.store.clear();
  }),
  
  key: jest.fn((index) => {
    const keys = Array.from(localStorageMock.store.keys());
    return keys[index] || null;
  }),
  
  get length() {
    return localStorageMock.store.size;
  }
};

// Aplicar mock globalmente
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
});

/**
 * MOCK GLOBAL: Intersection Observer
 * Necessário para componentes que usam observação de elementos
 */
global.IntersectionObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

/**
 * MOCK GLOBAL: ResizeObserver
 * Necessário para componentes responsivos
 */
global.ResizeObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

/**
 * MOCK GLOBAL: matchMedia
 * Necessário para queries de media responsivas
 */
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

/**
 * MOCK GLOBAL: Print
 * Simula funcionalidade de impressão
 */
Object.defineProperty(window, 'print', {
  value: jest.fn(),
  writable: true
});

/**
 * HELPERS GLOBAIS PARA TESTES DE CAIXA
 */

/**
 * Cria dados mock para sessão de caixa
 */
export const createMockCashierSession = (overrides = {}) => ({
  id: `session-${Date.now()}`,
  operator: 'Operador Teste',
  openTime: new Date().toISOString(),
  initialAmount: 100.00,
  currentBalance: 150.00,
  totalSales: 3,
  totalRevenue: 89.50,
  totalWithdrawals: 25.00,
  totalSupplies: 0,
  movements: [],
  isOpen: true,
  ...overrides
});

/**
 * Cria dados mock para venda
 */
export const createMockSale = (overrides = {}) => ({
  id: `sale-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  customerName: `Cliente ${Math.floor(Math.random() * 1000)}`,
  tableNumber: Math.random() > 0.5 ? Math.floor(Math.random() * 20) + 1 : null,
  items: [
    {
      id: 'item-1',
      name: 'Produto Teste',
      price: 25.50,
      quantity: 1,
      category: 'Alimentação'
    }
  ],
  total: 25.50,
  status: 'active',
  paymentMethod: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
});

/**
 * Cria dados mock para mesa
 */
export const createMockTable = (overrides = {}) => ({
  id: `table-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  number: Math.floor(Math.random() * 50) + 1,
  isOccupied: Math.random() > 0.5,
  currentSale: null,
  occupiedSince: null,
  customers: 0,
  capacity: 4,
  ...overrides
});

/**
 * Cria dados mock para movimento de caixa
 */
export const createMockCashMovement = (overrides = {}) => ({
  id: `movement-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  type: Math.random() > 0.5 ? 'withdrawal' : 'supply',
  amount: Math.floor(Math.random() * 100) + 10,
  reason: 'Movimento de teste',
  timestamp: new Date().toISOString(),
  operator: 'Operador Teste',
  ...overrides
});

/**
 * Cria dados mock para produto
 */
export const createMockProduct = (overrides = {}) => ({
  id: `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  name: `Produto ${Math.floor(Math.random() * 1000)}`,
  description: 'Descrição do produto de teste',
  price: Math.floor(Math.random() * 5000) / 100, // Preço entre 0 e 50.00
  category: 'Categoria Teste',
  image: '/images/produto-teste.jpg',
  available: true,
  preparationTime: Math.floor(Math.random() * 30) + 5, // 5-35 minutos
  ...overrides
});

/**
 * Simula dados de localStorage para testes
 */
export const setupLocalStorageForTests = (data = {}) => {
  const defaultData = {
    'cashier_session': null,
    'cashier_sales': [],
    'cashier_tables': [],
    'cashier_movements': [],
    'cashier_settings': {
      printReceipts: true,
      autoBackup: true,
      taxRate: 0.10
    }
  };

  const mergedData = { ...defaultData, ...data };

  // Limpar storage anterior
  localStorageMock.clear();

  // Configurar novos dados
  Object.entries(mergedData).forEach(([key, value]) => {
    localStorageMock.setItem(key, JSON.stringify(value));
  });
};

/**
 * Simula delay realístico para operações assíncronas
 */
export const simulateAsyncOperation = (ms = 100) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Cria mock para funções do hook useCashierManager
 */
export const createMockCashierManager = (overrides = {}) => ({
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

  // Funções de sessão
  openCashier: jest.fn().mockImplementation(async (data) => {
    await simulateAsyncOperation();
    return Promise.resolve({ success: true, session: createMockCashierSession(data) });
  }),

  closeCashier: jest.fn().mockImplementation(async (data) => {
    await simulateAsyncOperation();
    return Promise.resolve({ success: true });
  }),

  // Funções de movimentação
  withdrawCash: jest.fn().mockImplementation(async (data) => {
    await simulateAsyncOperation();
    return Promise.resolve({ success: true, movement: createMockCashMovement({ type: 'withdrawal', ...data }) });
  }),

  supplyCash: jest.fn().mockImplementation(async (data) => {
    await simulateAsyncOperation();
    return Promise.resolve({ success: true, movement: createMockCashMovement({ type: 'supply', ...data }) });
  }),

  // Funções de venda
  createSale: jest.fn().mockImplementation(async (data) => {
    await simulateAsyncOperation();
    return Promise.resolve({ success: true, sale: createMockSale(data) });
  }),

  updateSale: jest.fn().mockImplementation(async (saleId, data) => {
    await simulateAsyncOperation();
    return Promise.resolve({ success: true, sale: createMockSale({ id: saleId, ...data }) });
  }),

  processSalePayment: jest.fn().mockImplementation(async (saleId, paymentData) => {
    await simulateAsyncOperation();
    return Promise.resolve({ 
      success: true, 
      sale: createMockSale({ 
        id: saleId, 
        status: 'completed',
        paymentMethod: paymentData.paymentMethod,
        completedAt: new Date().toISOString()
      }) 
    });
  }),

  cancelSale: jest.fn().mockImplementation(async (saleId, reason) => {
    await simulateAsyncOperation();
    return Promise.resolve({ success: true });
  }),

  // Funções de mesa
  openTable: jest.fn().mockImplementation(async (tableData) => {
    await simulateAsyncOperation();
    return Promise.resolve({ success: true, table: createMockTable({ isOccupied: true, ...tableData }) });
  }),

  closeTable: jest.fn().mockImplementation(async (tableId) => {
    await simulateAsyncOperation();
    return Promise.resolve({ success: true });
  }),

  // Função de erro
  clearError: jest.fn(),

  ...overrides
});

/**
 * Utilitários para testes de integração
 */
export const testUtils = {
  /**
   * Aguarda elemento aparecer na tela
   */
  waitForElement: async (getElement, timeout = 3000) => {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      try {
        const element = getElement();
        if (element) return element;
      } catch (error) {
        // Continua tentando
      }
      
      await simulateAsyncOperation(50);
    }
    
    throw new Error(`Elemento não encontrado após ${timeout}ms`);
  },

  /**
   * Simula sequência de eventos de usuário
   */
  simulateUserFlow: async (steps) => {
    for (const step of steps) {
      await step();
      await simulateAsyncOperation(100); // Delay entre ações
    }
  },

  /**
   * Verifica se localStorage contém dados esperados
   */
  expectLocalStorageToContain: (key, expectedData) => {
    const storedData = JSON.parse(localStorageMock.getItem(key) || 'null');
    expect(storedData).toEqual(expect.objectContaining(expectedData));
  }
};

/**
 * Setup para cada teste
 */
beforeEach(() => {
  // Limpar mocks
  jest.clearAllMocks();
  
  // Reset localStorage
  localStorageMock.clear();
  
  // Reset timers
  jest.clearAllTimers();
  
  // Setup localStorage padrão
  setupLocalStorageForTests();
});

/**
 * Cleanup após cada teste
 */
afterEach(() => {
  // Cleanup global
  jest.restoreAllMocks();
  
  // Limpar localStorage
  localStorageMock.clear();
});

/**
 * Configurações específicas para testes do caixa
 */
export const cashierTestConfig = {
  // Timeouts padrão
  DEFAULT_TIMEOUT: 3000,
  ASYNC_OPERATION_DELAY: 100,
  USER_ACTION_DELAY: 50,
  
  // Valores padrão para testes
  DEFAULT_INITIAL_AMOUNT: 100.00,
  DEFAULT_TABLE_CAPACITY: 4,
  DEFAULT_TAX_RATE: 0.10,
  
  // Configurações de formatação
  CURRENCY_FORMAT: {
    locale: 'pt-BR',
    currency: 'BRL',
    style: 'currency'
  },
  
  // Configurações de validação
  VALIDATION_RULES: {
    MIN_INITIAL_AMOUNT: 0,
    MAX_INITIAL_AMOUNT: 10000,
    MIN_SALE_AMOUNT: 0.01,
    MAX_WITHDRAWAL_AMOUNT: 1000
  }
};

// Exportar configuração como padrão
export default cashierTestConfig;
