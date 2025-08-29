const { render } = require('@testing-library/react');
const React = require('react');

// Mock simples dos contextos
jest.mock('./src/context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
  })
}));

jest.mock('./src/context/CheckoutContext', () => ({
  useCheckout: () => ({
    currentStep: 'auth',
    nextStep: jest.fn(),
    previousStep: jest.fn(),
  })
}));

// Teste básico
test('debug authstep', () => {
  try {
    const AuthStep = require('./src/components/checkout/steps/AuthStep.js').default;
    console.log('AuthStep carregado:', typeof AuthStep);
    
    const result = render(React.createElement(AuthStep));
    console.log('Componente renderizado:', result.container.innerHTML);
  } catch (error) {
    console.error('Erro ao renderizar AuthStep:', error.message);
    console.error('Stack:', error.stack);
  }
});
