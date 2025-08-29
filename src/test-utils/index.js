/**
 * UTILITÁRIOS DE TESTE - HELPERS E CONFIGURAÇÕES
 * 
 * Conjunto de utilitários reutilizáveis para facilitar a escrita
 * de testes e garantir consistência entre diferentes arquivos de teste.
 * 
 * Funcionalidades:
 * - Renderização com providers
 * - Factories de dados mock
 * - Matchers customizados
 * - Helpers de interação
 * - Configurações globais
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';

/**
 * PROVIDER DE TESTE CUSTOMIZADO
 * 
 * Componente wrapper que inclui todos os providers necessários
 * para testes de componentes React.
 */
const TestProvider = ({ children, theme = null, router = true }) => {
  const defaultTheme = createTheme({
    palette: {
      primary: { main: '#1976d2' },
      secondary: { main: '#dc004e' },
      success: { main: '#27ae60' },
      error: { main: '#e74c3c' }
    },
    spacing: (factor) => factor * 8
  });

  const activeTheme = theme || defaultTheme;

  const content = (
    <ThemeProvider theme={activeTheme}>
      {children}
    </ThemeProvider>
  );

  return router ? (
    <BrowserRouter>{content}</BrowserRouter>
  ) : content;
};

/**
 * FUNÇÃO DE RENDERIZAÇÃO CUSTOMIZADA
 * 
 * Renderiza componente com todos os providers necessários
 * e retorna utilitários adicionais para testes.
 */
export const renderWithProviders = (ui, options = {}) => {
  const {
    theme = null,
    router = true,
    ...renderOptions
  } = options;

  const Wrapper = ({ children }) => (
    <TestProvider theme={theme} router={router}>
      {children}
    </TestProvider>
  );

  const utils = render(ui, { wrapper: Wrapper, ...renderOptions });

  return {
    ...utils,
    // Utilitários adicionais
    user: userEvent.setup(),
    
    // Helpers específicos para Material-UI
    queryByRole: screen.queryByRole,
    getByRole: screen.getByRole,
    findByRole: screen.findByRole,
    
    // Helpers para formulários
    getFormField: (label) => screen.getByLabelText(label),
    getButton: (name) => screen.getByRole('button', { name }),
    getLink: (name) => screen.getByRole('link', { name }),
    
    // Helper para aguardar carregamento
    waitForLoadingToFinish: () => waitFor(() => {
      expect(screen.queryByText(/carregando/i)).not.toBeInTheDocument();
    })
  };
};

/**
 * FACTORIES DE DADOS MOCK
 * 
 * Funções para gerar dados mock consistentes para testes.
 */

/**
 * Cria produto mock com dados realistas
 */
export const createMockProduct = (overrides = {}) => ({
  id: Math.floor(Math.random() * 1000) + 1,
  name: 'Pizza Margherita',
  price: 25.90,
  description: 'Pizza clássica italiana com molho de tomate, mussarela e manjericão',
  category: 'Pizzas',
  imageUrl: '/images/pizza-margherita.jpg',
  available: true,
  preparationTime: 15,
  ingredients: ['Molho de tomate', 'Mussarela', 'Manjericão', 'Azeite'],
  nutritionalInfo: {
    calories: 280,
    protein: 12,
    carbs: 35,
    fat: 8
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
});

/**
 * Cria categoria mock com dados realistas
 */
export const createMockCategory = (overrides = {}) => ({
  id: Math.floor(Math.random() * 100) + 1,
  name: 'Pizzas',
  description: 'Pizzas tradicionais feitas com ingredientes frescos',
  icon: '🍕',
  order: 1,
  active: true,
  color: '#ff6b6b',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
});

/**
 * Cria usuário mock com dados realistas
 */
export const createMockUser = (overrides = {}) => ({
  id: Math.floor(Math.random() * 1000) + 1,
  name: 'João Silva',
  email: 'joao.silva@email.com',
  role: 'customer',
  phone: '(11) 99999-9999',
  avatar: '/images/avatar-default.jpg',
  preferences: {
    notifications: true,
    newsletter: false,
    darkMode: false
  },
  addresses: [{
    id: 1,
    street: 'Rua das Flores, 123',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-567',
    default: true
  }],
  createdAt: new Date().toISOString(),
  lastLogin: new Date().toISOString(),
  ...overrides
});

/**
 * Cria pedido mock com dados realistas
 */
export const createMockOrder = (overrides = {}) => ({
  id: Math.floor(Math.random() * 10000) + 1,
  customerId: 1,
  customerName: 'João Silva',
  items: [
    {
      productId: 1,
      productName: 'Pizza Margherita',
      quantity: 2,
      unitPrice: 25.90,
      totalPrice: 51.80,
      notes: 'Sem cebola'
    }
  ],
  subtotal: 51.80,
  deliveryFee: 5.00,
  total: 56.80,
  status: 'pending',
  paymentMethod: 'credit_card',
  paymentStatus: 'pending',
  deliveryAddress: {
    street: 'Rua das Flores, 123',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-567'
  },
  estimatedDelivery: 45,
  notes: 'Portão azul',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
});

/**
 * Cria cupom mock com dados realistas
 */
export const createMockCoupon = (overrides = {}) => ({
  id: Math.floor(Math.random() * 1000) + 1,
  code: 'TESTE10',
  description: 'Cupom de teste para testes automatizados',
  type: 'percentage',
  value: 10,
  minOrderValue: 30.00,
  maxDiscount: 15.00,
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  isActive: true,
  firstPurchaseOnly: false,
  activeDays: [1, 2, 3, 4, 5, 6, 0],
  usageLimit: 100,
  currentUsage: 25,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
});

/**
 * HELPERS DE INTERAÇÃO
 * 
 * Funções para facilitar interações comuns em testes.
 */

/**
 * Preenche formulário com dados fornecidos
 */
export const fillForm = async (user, formData) => {
  for (const [field, value] of Object.entries(formData)) {
    const input = screen.getByLabelText(new RegExp(field, 'i'));
    await user.clear(input);
    await user.type(input, String(value));
  }
};

/**
 * Clica em botão e aguarda ação completar
 */
export const clickAndWait = async (buttonText, waitFor = null) => {
  const button = screen.getByRole('button', { name: new RegExp(buttonText, 'i') });
  fireEvent.click(button);
  
  if (waitFor) {
    await waitFor();
  }
};

/**
 * Aguarda elemento aparecer na tela
 */
export const waitForElement = async (text, options = {}) => {
  return await screen.findByText(text, options);
};

/**
 * Aguarda elemento desaparecer da tela
 */
export const waitForElementToBeRemoved = async (text) => {
  await waitFor(() => {
    expect(screen.queryByText(text)).not.toBeInTheDocument();
  });
};

/**
 * Simula upload de arquivo
 */
export const uploadFile = async (user, inputLabel, file) => {
  const input = screen.getByLabelText(new RegExp(inputLabel, 'i'));
  await user.upload(input, file);
};

/**
 * MOCKS GLOBAIS
 * 
 * Configurações de mock para APIs e dependências externas.
 */

/**
 * Mock da API local
 */
export const mockAPI = {
  // Mock para produtos
  products: {
    getAll: jest.fn(() => Promise.resolve([createMockProduct()])),
    getById: jest.fn((id) => Promise.resolve(createMockProduct({ id }))),
    create: jest.fn((data) => Promise.resolve(createMockProduct(data))),
    update: jest.fn((id, data) => Promise.resolve(createMockProduct({ id, ...data }))),
    delete: jest.fn(() => Promise.resolve({ success: true }))
  },
  
  // Mock para categorias
  categories: {
    getAll: jest.fn(() => Promise.resolve([createMockCategory()])),
    create: jest.fn((data) => Promise.resolve(createMockCategory(data))),
    update: jest.fn((id, data) => Promise.resolve(createMockCategory({ id, ...data }))),
    delete: jest.fn(() => Promise.resolve({ success: true }))
  },
  
  // Mock para pedidos
  orders: {
    getAll: jest.fn(() => Promise.resolve([createMockOrder()])),
    getById: jest.fn((id) => Promise.resolve(createMockOrder({ id }))),
    create: jest.fn((data) => Promise.resolve(createMockOrder(data))),
    updateStatus: jest.fn((id, status) => Promise.resolve(createMockOrder({ id, status })))
  },
  
  // Mock para cupons
  coupons: {
    getAll: jest.fn(() => Promise.resolve([createMockCoupon()])),
    getById: jest.fn((id) => Promise.resolve(createMockCoupon({ id }))),
    create: jest.fn((data) => Promise.resolve(createMockCoupon(data))),
    update: jest.fn((id, data) => Promise.resolve(createMockCoupon({ id, ...data }))),
    delete: jest.fn(() => Promise.resolve({ success: true })),
    validate: jest.fn((code) => Promise.resolve({ valid: true, coupon: createMockCoupon({ code }) }))
  }
};

/**
 * Mock do localStorage
 */
export const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};

/**
 * Mock do fetch global
 */
export const mockFetch = (response = {}, success = true) => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: success,
      status: success ? 200 : 400,
      json: () => Promise.resolve(response),
      text: () => Promise.resolve(JSON.stringify(response))
    })
  );
};

/**
 * MATCHERS CUSTOMIZADOS
 * 
 * Matchers específicos para facilitar assertions.
 */

/**
 * Verifica se elemento tem classe CSS específica
 */
export const toHaveClass = (element, className) => {
  const pass = element.classList.contains(className);
  return {
    pass,
    message: () => 
      pass 
        ? `Expected element not to have class "${className}"`
        : `Expected element to have class "${className}"`
  };
};

/**
 * Verifica se formulário está válido
 */
export const toBeValidForm = (form) => {
  const invalidFields = form.querySelectorAll(':invalid');
  const pass = invalidFields.length === 0;
  
  return {
    pass,
    message: () =>
      pass
        ? 'Expected form to be invalid'
        : `Expected form to be valid, but found ${invalidFields.length} invalid fields`
  };
};

/**
 * CONFIGURAÇÕES DE TESTE
 * 
 * Configurações padrão para diferentes tipos de teste.
 */

/**
 * Configuração para testes de componentes
 */
export const componentTestConfig = {
  testTimeout: 10000,
  setupFiles: ['<rootDir>/src/test-utils/setup.js'],
  testEnvironment: 'jsdom'
};

/**
 * Configuração para testes de integração
 */
export const integrationTestConfig = {
  testTimeout: 30000,
  setupFilesAfterEnv: ['<rootDir>/src/test-utils/integration-setup.js']
};

/**
 * UTILITÁRIOS DE PERFORMANCE
 * 
 * Helpers para testar performance de componentes.
 */

/**
 * Mede tempo de renderização
 */
export const measureRenderTime = (renderFunction) => {
  const start = performance.now();
  const result = renderFunction();
  const end = performance.now();
  
  return {
    ...result,
    renderTime: end - start
  };
};

/**
 * Conta re-renders de componente
 */
export const countRerenders = (TestComponent, props = {}) => {
  let renderCount = 0;
  
  const WrappedComponent = (componentProps) => {
    renderCount++;
    return <TestComponent {...componentProps} />;
  };
  
  const utils = renderWithProviders(<WrappedComponent {...props} />);
  
  return {
    ...utils,
    getRenderCount: () => renderCount,
    rerender: (newProps) => {
      utils.rerender(<WrappedComponent {...newProps} />);
      return renderCount;
    }
  };
};

/**
 * HELPERS DE ACESSIBILIDADE
 * 
 * Utilitários para testar acessibilidade.
 */

/**
 * Verifica navegação por teclado
 */
export const testKeyboardNavigation = async (user) => {
  // Simula navegação por Tab
  await user.tab();
  
  // Verifica se elemento focado é visível
  const focusedElement = document.activeElement;
  expect(focusedElement).toBeVisible();
  
  return focusedElement;
};

/**
 * Verifica se elemento tem atributos de acessibilidade
 */
export const checkAccessibility = (element) => {
  const checks = {
    hasAltText: element.hasAttribute('alt'),
    hasAriaLabel: element.hasAttribute('aria-label'),
    hasAriaDescribedBy: element.hasAttribute('aria-describedby'),
    hasRole: element.hasAttribute('role'),
    isFocusable: element.tabIndex >= 0 || element.hasAttribute('tabindex')
  };
  
  return checks;
};

/**
 * CLEANUP AUTOMÁTICO
 * 
 * Limpa mocks e estados entre testes.
 */
export const cleanupBetweenTests = () => {
  beforeEach(() => {
    // Limpar mocks
    jest.clearAllMocks();
    
    // Resetar localStorage mock
    mockLocalStorage.getItem.mockClear();
    mockLocalStorage.setItem.mockClear();
    mockLocalStorage.removeItem.mockClear();
    mockLocalStorage.clear.mockClear();
    
    // Resetar fetch mock
    if (global.fetch && global.fetch.mockClear) {
      global.fetch.mockClear();
    }
    
    // Limpar console warnings para testes limpos
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  
  afterEach(() => {
    // Restaurar console
    console.warn.mockRestore?.();
    console.error.mockRestore?.();
  });
};

// Aplicar cleanup automaticamente
cleanupBetweenTests();
