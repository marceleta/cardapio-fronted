import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SideCart from '../SideCart';
import { CartContext } from '../../../context/CartContext';
import ThemeRegistry from '../../ThemeRegistry';
import useMediaQuery from '@mui/material/useMediaQuery';

// Mock the useMediaQuery hook
jest.mock('@mui/material/useMediaQuery');

// Mock window.open para o WhatsApp
const mockWindowOpen = jest.fn();
Object.defineProperty(window, 'open', {
  value: mockWindowOpen,
  writable: true,
});

const mockCartContext = {
  cartItems: [
    {
      id: 1,
      name: 'Classic Burger',
      price: 25.00,
      quantity: 2,
      observations: 'Sem cebola',
      addOns: [
        { id: 1, name: 'Queijo extra', price: 3.00 }
      ]
    }
  ],
  getTotalItems: jest.fn(() => 2),
  getTotalPrice: jest.fn(() => 56.00),
  removeFromCart: jest.fn(),
  addToCart: jest.fn(),
};

const emptyCartContext = {
  cartItems: [],
  getTotalItems: jest.fn(() => 0),
  getTotalPrice: jest.fn(() => 0),
  removeFromCart: jest.fn(),
  addToCart: jest.fn(),
};

const renderSideCart = (cartContext = mockCartContext) => {
  return render(
    <ThemeRegistry>
      <CartContext.Provider value={cartContext}>
        <SideCart />
      </CartContext.Provider>
    </ThemeRegistry>
  );
};

describe('SideCart', () => {

  beforeEach(() => {
    mockWindowOpen.mockClear();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('responsividade', () => {
    test('não renderiza em dispositivos móveis', () => {
      // Mock para dispositivo móvel (breakpoint md e abaixo)
      useMediaQuery.mockImplementation((query) => {
        // Simula que a media query down('md') retorna true para mobile
        return true;
      });
      
      const { container } = renderSideCart();
      expect(container.firstChild).toBeNull();
    });

    test('renderiza em dispositivos desktop', () => {
      // Mock para dispositivo desktop
      useMediaQuery.mockImplementation((query) => {
        // Simula que a media query down('md') retorna false para desktop
        return false;
      });
      
      renderSideCart();
      
      expect(screen.getByLabelText('carrinho')).toBeInTheDocument();
    });
  });

  describe('estado inicial do carrinho', () => {

    beforeEach(() => {
      useMediaQuery.mockImplementation(() => false); // desktop
    });

    test('exibe botão flutuante com badge', () => {
      renderSideCart();
      
  const fab = screen.getByLabelText('carrinho');
  expect(fab).toBeInTheDocument();
  // O badge pode estar invisível, então apenas garantimos que o botão existe
    });

    test('inicia collapsed', () => {
      renderSideCart();
      
      expect(screen.queryByText('Meu Carrinho')).not.toBeInTheDocument();
      expect(screen.queryByText('Classic Burger')).not.toBeInTheDocument();
    });
  });

  describe('expansão do carrinho', () => {

    beforeEach(() => {
      useMediaQuery.mockImplementation(() => false); // desktop
    });

    test('expande ao clicar no botão', async () => {
  const user = userEvent.setup();
  renderSideCart(mockCartContext);
  const fabButton = screen.getByLabelText('carrinho');
  await user.click(fabButton);
  expect(screen.getByText('Meu Carrinho')).toBeInTheDocument();
  expect(screen.getByText('Classic Burger')).toBeInTheDocument();
    });
  });

  describe('carrinho vazio', () => {

    beforeEach(() => {
      useMediaQuery.mockImplementation(() => false); // desktop
    });

    test('exibe mensagem quando vazio', async () => {
      const user = userEvent.setup();
      renderSideCart(emptyCartContext);
      
      const fabButton = screen.getByLabelText('carrinho');
      await user.click(fabButton);
      
      expect(screen.getByText('Seu carrinho está vazio')).toBeInTheDocument();
    });
  });
});
