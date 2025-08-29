/**
 * UTILITÁRIOS DE TESTE CUSTOMIZADOS - CHECKOUT
 * 
 * Helpers reutilizáveis para facilitar a escrita de testes
 * e garantir consistência entre diferentes arquivos de teste do checkout.
 * 
 * Funcionalidades:
 * - Renderização com providers necessários
 * - Factories de dados mock
 * - Helpers de interação
 * - Mocks de APIs e contextos
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AuthProvider } from '../../../context/AuthContext';
import { CartProvider } from '../../../context/CartContext';
import { CheckoutProvider } from '../../../context/CheckoutContext';

/**
 * RENDERIZAÇÃO COM PROVIDERS
 * Renderiza componente com todos os providers necessários para checkout
 */
export const renderWithCheckoutProviders = (ui, options = {}) => {
  const { 
    theme = createTheme(),
    authProviderProps = {},
    cartProviderProps = {},
    checkoutProviderProps = {},
    ...renderOptions 
  } = options;

  const AllTheProviders = ({ children }) => (
    <ThemeProvider theme={theme}>
      <AuthProvider {...authProviderProps}>
        <CartProvider {...cartProviderProps}>
          <CheckoutProvider {...checkoutProviderProps}>
            {children}
          </CheckoutProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );

  return render(ui, { wrapper: AllTheProviders, ...renderOptions });
};

/**
 * FACTORIES DE DADOS MOCK
 */

/**
 * Cria dados mock para usuário
 */
export const createMockUser = (overrides = {}) => ({
  id: 1,
  name: 'João Silva',
  whatsapp: '11999998888',
  email: 'joao@email.com',
  addresses: [
    {
      id: 1,
      cep: '01234-567',
      street: 'Rua das Flores',
      number: '123',
      complement: 'Apto 45',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      reference: 'Próximo à praça'
    }
  ],
  orders: [],
  ...overrides
});

/**
 * Cria dados mock para item do carrinho
 */
export const createMockCartItem = (overrides = {}) => ({
  id: 1,
  name: 'X-Tudo',
  price: 25.00,
  quantity: 1,
  observations: '',
  addOns: [],
  ...overrides
});

/**
 * Cria dados mock para endereço
 */
export const createMockAddress = (overrides = {}) => ({
  id: 1,
  cep: '01234-567',
  street: 'Rua das Flores',
  number: '123',
  complement: 'Apto 45',
  neighborhood: 'Centro',
  city: 'São Paulo',
  state: 'SP',
  reference: 'Próximo à praça',
  ...overrides
});

/**
 * Cria dados mock para dados de entrega
 */
export const createMockDeliveryData = (overrides = {}) => ({
  type: 'delivery',
  address: createMockAddress(),
  deliveryFee: 5.00,
  estimatedTime: '45-60 minutos',
  ...overrides
});

/**
 * Cria dados mock para dados de pagamento
 */
export const createMockPaymentData = (overrides = {}) => ({
  method: 'cash',
  methodName: 'Dinheiro',
  needsChange: true,
  changeFor: 50.00,
  ...overrides
});

/**
 * HELPERS DE INTERAÇÃO
 */

/**
 * Preenche formulário de login
 */
export const fillLoginForm = async (user, { whatsapp, password }) => {
  const whatsappField = screen.getByLabelText(/WhatsApp/i);
  const passwordField = screen.getByLabelText(/Senha/i);
  
  await user.clear(whatsappField);
  await user.type(whatsappField, whatsapp);
  
  await user.clear(passwordField);
  await user.type(passwordField, password);
};

/**
 * Preenche formulário de cadastro
 */
export const fillRegisterForm = async (user, { name, whatsapp, email, password, acceptTerms = true }) => {
  const nameField = screen.getByLabelText(/Nome Completo/i);
  const whatsappField = screen.getByLabelText(/WhatsApp/i);
  const emailField = screen.getByLabelText(/E-mail/i);
  const passwordField = screen.getByLabelText(/Senha/i);
  const confirmPasswordField = screen.getByLabelText(/Confirmar Senha/i);
  
  await user.clear(nameField);
  await user.type(nameField, name);
  
  await user.clear(whatsappField);
  await user.type(whatsappField, whatsapp);
  
  await user.clear(emailField);
  await user.type(emailField, email);
  
  await user.clear(passwordField);
  await user.type(passwordField, password);
  
  await user.clear(confirmPasswordField);
  await user.type(confirmPasswordField, password);
  
  if (acceptTerms) {
    const termsCheckbox = screen.getByRole('checkbox');
    await user.click(termsCheckbox);
  }
};

/**
 * Preenche formulário de endereço
 */
export const fillAddressForm = async (user, address) => {
  const cepField = screen.getByLabelText(/CEP/i);
  const streetField = screen.getByLabelText(/Rua/i);
  const numberField = screen.getByLabelText(/Número/i);
  const neighborhoodField = screen.getByLabelText(/Bairro/i);
  
  await user.clear(cepField);
  await user.type(cepField, address.cep);
  
  await user.clear(streetField);
  await user.type(streetField, address.street);
  
  await user.clear(numberField);
  await user.type(numberField, address.number);
  
  await user.clear(neighborhoodField);
  await user.type(neighborhoodField, address.neighborhood);
  
  if (address.complement) {
    const complementField = screen.getByLabelText(/Complemento/i);
    await user.clear(complementField);
    await user.type(complementField, address.complement);
  }
  
  if (address.reference) {
    const referenceField = screen.getByLabelText(/Referência/i);
    await user.clear(referenceField);
    await user.type(referenceField, address.reference);
  }
};

/**
 * MOCKS DE CONTEXTOS
 */

/**
 * Mock do contexto de autenticação
 */
export const createMockAuthContext = (overrides = {}) => ({
  user: null,
  isAuthenticated: false,
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
  addOrder: jest.fn(),
  addAddress: jest.fn(),
  restoreSession: jest.fn(),
  ...overrides
});

/**
 * Mock do contexto de carrinho
 */
export const createMockCartContext = (overrides = {}) => ({
  cartItems: [],
  cartTotal: 0,
  addItem: jest.fn(),
  removeItem: jest.fn(),
  updateQuantity: jest.fn(),
  clearCart: jest.fn(),
  ...overrides
});

/**
 * Mock do contexto de checkout
 */
export const createMockCheckoutContext = (overrides = {}) => ({
  currentStep: 'auth',
  loading: false,
  error: null,
  deliveryData: {
    type: null,
    address: null,
    deliveryFee: 0,
    estimatedTime: null
  },
  paymentData: {
    method: null,
    changeFor: null
  },
  finalTotal: 0,
  startCheckout: jest.fn(),
  nextStep: jest.fn(),
  previousStep: jest.fn(),
  setDeliveryInfo: jest.fn(),
  setPaymentInfo: jest.fn(),
  sendToWhatsApp: jest.fn(),
  resetCheckout: jest.fn(),
  clearError: jest.fn(),
  generateWhatsAppMessage: jest.fn(),
  CHECKOUT_STEPS: {
    AUTH: 'auth',
    DELIVERY: 'delivery',
    PAYMENT: 'payment',
    SUMMARY: 'summary',
    SUCCESS: 'success'
  },
  DELIVERY_TYPES: {
    DELIVERY: 'delivery',
    TAKEAWAY: 'takeaway'
  },
  PAYMENT_METHODS: {
    CREDIT_CARD: 'credit_card',
    DEBIT_CARD: 'debit_card',
    PIX: 'pix',
    CASH: 'cash'
  },
  ...overrides
});

/**
 * MOCKS DE APIS E DEPENDÊNCIAS EXTERNAS
 */

/**
 * Mock do window.open
 */
export const mockWindowOpen = jest.fn();
Object.defineProperty(window, 'open', {
  value: mockWindowOpen,
  configurable: true
});

/**
 * Mock do localStorage
 */
export const createMockLocalStorage = () => {
  const storage = {};
  return {
    getItem: jest.fn((key) => storage[key] || null),
    setItem: jest.fn((key, value) => { storage[key] = value; }),
    removeItem: jest.fn((key) => { delete storage[key]; }),
    clear: jest.fn(() => { Object.keys(storage).forEach(key => delete storage[key]); }),
    _storage: storage
  };
};

/**
 * Mock do Next.js router
 */
export const createMockRouter = (overrides = {}) => ({
  push: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  ...overrides
});

/**
 * UTILITÁRIOS DE TEMPO
 */

/**
 * Simula delay para testes async
 */
export const waitForDelay = (ms = 100) => 
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Aguarda até que elemento apareça na tela
 */
export const waitForElement = async (text, options = {}) => {
  const { timeout = 1000 } = options;
  return await screen.findByText(text, {}, { timeout });
};

/**
 * VALIDADORES CUSTOMIZADOS
 */

/**
 * Verifica se mensagem do WhatsApp está no formato correto
 */
export const validateWhatsAppMessage = (message) => {
  const expectedPatterns = [
    /\*🍔 NOVO PEDIDO - .+ 🍔\*/,
    /\*Cliente:\* .+/,
    /\*Contato:\* .+/,
    /\*-- ITENS DO PEDIDO --\*/,
    /\*-- ENTREGA --\*/,
    /\*-- PAGAMENTO --\*/,
    /\*TOTAL DO PEDIDO:\* \*R\$ .+\*/
  ];
  
  return expectedPatterns.every(pattern => pattern.test(message));
};

/**
 * Verifica se URL do WhatsApp está no formato correto
 */
export const validateWhatsAppUrl = (url) => {
  const whatsappUrlPattern = /^https:\/\/wa\.me\/\d+\?text=.+$/;
  return whatsappUrlPattern.test(url);
};

export default {
  renderWithCheckoutProviders,
  createMockUser,
  createMockCartItem,
  createMockAddress,
  createMockDeliveryData,
  createMockPaymentData,
  fillLoginForm,
  fillRegisterForm,
  fillAddressForm,
  createMockAuthContext,
  createMockCartContext,
  createMockCheckoutContext,
  mockWindowOpen,
  createMockLocalStorage,
  createMockRouter,
  waitForDelay,
  waitForElement,
  validateWhatsAppMessage,
  validateWhatsAppUrl
};
