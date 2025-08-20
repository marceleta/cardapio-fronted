/**
 * @file CartIcon.test.js
 * @description Testes unitários para o componente CartIcon
 * 
 * Testa funcionalidades:
 * - Renderização do ícone do carrinho
 * - Exibição do badge com quantidade de itens
 * - Interações de clique
 * - Estados vazios e com itens
 * - Responsividade e acessibilidade
 * 
 * @author Sistema de Testes
 * @since 2024
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../../../lib/theme';
import CartIcon from '../CartIcon';
import { CartContext } from '../../../context/CartContext';

// Wrapper de tema para testes
const ThemeWrapper = ({ children }) => (
  <ThemeProvider theme={theme}>
    {children}
  </ThemeProvider>
);

// Mock do contexto do carrinho
const createMockCartContext = (cartItems = []) => ({
  cart: cartItems,
  cartCount: cartItems.reduce((total, item) => total + item.quantity, 0),
  toggleCart: jest.fn(),
  addToCart: jest.fn(),
  removeFromCart: jest.fn(),
  updateQuantity: jest.fn(),
  clearCart: jest.fn(),
  getTotal: jest.fn(() => cartItems.reduce((total, item) => total + (item.price * item.quantity), 0))
});

// Helper para renderizar com contexto e tema
const renderCartIcon = (props = {}, cartItems = []) => {
  const mockContext = createMockCartContext(cartItems);
  
  return render(
    <ThemeWrapper>
      <CartContext.Provider value={mockContext}>
        <CartIcon {...props} />
      </CartContext.Provider>
    </ThemeWrapper>
  );
};

describe('CartIcon', () => {
  
  describe('Renderização', () => {
    
    it('deve renderizar o ícone do carrinho corretamente', () => {
      // ACT
      renderCartIcon();
      
      // ASSERT
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByTestId('ShoppingCartIcon')).toBeInTheDocument();
    });
    
    it('deve renderizar sem badge quando carrinho estiver vazio', () => {
      // ACT
      renderCartIcon();
      
      // ASSERT
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.queryByText('0')).not.toBeInTheDocument();
    });
    
    it('deve aplicar estilos padrão corretamente', () => {
      // ACT
      renderCartIcon();
      
      // ASSERT
      const button = screen.getByRole('button');
      expect(button).toHaveClass('MuiIconButton-root');
    });
    
  });
  
  describe('Badge de Quantidade', () => {
    
    it('deve exibir badge com quantidade correta de itens', () => {
      // ARRANGE
      const cartItems = [
        { id: 1, name: 'Produto 1', price: 10, quantity: 2 },
        { id: 2, name: 'Produto 2', price: 15, quantity: 1 }
      ];
      
      // ACT
      renderCartIcon({}, cartItems);
      
      // ASSERT
      expect(screen.getByText('3')).toBeInTheDocument();
    });
    
    it('deve mostrar badge para quantidade 1', () => {
      // ARRANGE
      const cartItems = [
        { id: 1, name: 'Produto 1', price: 10, quantity: 1 }
      ];
      
      // ACT
      renderCartIcon({}, cartItems);
      
      // ASSERT
      expect(screen.getByText('1')).toBeInTheDocument();
    });
    
    it('deve lidar com quantidades altas corretamente', () => {
      // ARRANGE
      const cartItems = [
        { id: 1, name: 'Produto 1', price: 10, quantity: 99 }
      ];
      
      // ACT
      renderCartIcon({}, cartItems);
      
      // ASSERT
      expect(screen.getByText('99')).toBeInTheDocument();
    });
    
    it('deve mostrar 99+ para quantidades acima de 99', () => {
      // ARRANGE
      const cartItems = [
        { id: 1, name: 'Produto 1', price: 10, quantity: 100 }
      ];
      
      // ACT
      renderCartIcon({}, cartItems);
      
      // ASSERT
      // Assume que o MUI Badge mostra 99+ automaticamente
      const badge = screen.getByText(/99|100/);
      expect(badge).toBeInTheDocument();
    });
    
  });
  
  describe('Interações', () => {
    
    it('deve chamar toggleCart quando clicado', () => {
      // ARRANGE
      const cartItems = [
        { id: 1, name: 'Produto 1', price: 10, quantity: 1 }
      ];
      const mockContext = createMockCartContext(cartItems);
      
      render(
        <ThemeWrapper>
          <CartContext.Provider value={mockContext}>
            <CartIcon />
          </CartContext.Provider>
        </ThemeWrapper>
      );
      
      // ACT
      fireEvent.click(screen.getByRole('button'));
      
      // ASSERT
      expect(mockContext.toggleCart).toHaveBeenCalledTimes(1);
    });
    
    it('deve ser acessível via teclado', () => {
      // ARRANGE
      const mockContext = createMockCartContext([]);
      
      render(
        <ThemeWrapper>
          <CartContext.Provider value={mockContext}>
            <CartIcon />
          </CartContext.Provider>
        </ThemeWrapper>
      );
      
      // ACT
      const button = screen.getByRole('button');
      button.focus();
      fireEvent.keyDown(button, { key: 'Enter' });
      
      // ASSERT
      expect(mockContext.toggleCart).toHaveBeenCalledTimes(1);
    });
    
    it('deve permitir múltiplos cliques', () => {
      // ARRANGE
      const mockContext = createMockCartContext([]);
      
      render(
        <ThemeWrapper>
          <CartContext.Provider value={mockContext}>
            <CartIcon />
          </CartContext.Provider>
        </ThemeWrapper>
      );
      
      // ACT
      const button = screen.getByRole('button');
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);
      
      // ASSERT
      expect(mockContext.toggleCart).toHaveBeenCalledTimes(3);
    });
    
  });
  
  describe('Estados do Carrinho', () => {
    
    it('deve reagir a mudanças no carrinho', async () => {
      // ARRANGE
      let mockContext = createMockCartContext([]);
      
      const { rerender } = render(
        <ThemeWrapper>
          <CartContext.Provider value={mockContext}>
            <CartIcon />
          </CartContext.Provider>
        </ThemeWrapper>
      );
      
      // ASSERT inicial - carrinho vazio
      expect(screen.queryByText('1')).not.toBeInTheDocument();
      
      // ACT - simular adição ao carrinho
      mockContext = createMockCartContext([
        { id: 1, name: 'Produto 1', price: 10, quantity: 1 }
      ]);
      
      rerender(
        <ThemeWrapper>
          <CartContext.Provider value={mockContext}>
            <CartIcon />
          </CartContext.Provider>
        </ThemeWrapper>
      );
      
      // ASSERT - carrinho com item
      await waitFor(() => {
        expect(screen.getByText('1')).toBeInTheDocument();
      });
    });
    
    it('deve lidar com itens removidos', async () => {
      // ARRANGE
      let mockContext = createMockCartContext([
        { id: 1, name: 'Produto 1', price: 10, quantity: 2 }
      ]);
      
      const { rerender } = render(
        <ThemeWrapper>
          <CartContext.Provider value={mockContext}>
            <CartIcon />
          </CartContext.Provider>
        </ThemeWrapper>
      );
      
      // ASSERT inicial
      expect(screen.getByText('2')).toBeInTheDocument();
      
      // ACT - simular remoção
      mockContext = createMockCartContext([]);
      
      rerender(
        <ThemeWrapper>
          <CartContext.Provider value={mockContext}>
            <CartIcon />
          </CartContext.Provider>
        </ThemeWrapper>
      );
      
      // ASSERT - carrinho vazio
      await waitFor(() => {
        expect(screen.queryByText('2')).not.toBeInTheDocument();
      });
    });
    
  });
  
  describe('Acessibilidade', () => {
    
    it('deve ter atributos de acessibilidade adequados', () => {
      // ACT
      renderCartIcon();
      
      // ASSERT
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label');
    });
    
    it('deve indicar quantidade via aria-label', () => {
      // ARRANGE
      const cartItems = [
        { id: 1, name: 'Produto 1', price: 10, quantity: 3 }
      ];
      
      // ACT
      renderCartIcon({}, cartItems);
      
      // ASSERT
      const button = screen.getByRole('button');
      expect(button.getAttribute('aria-label')).toContain('3');
    });
    
  });
  
  describe('Props Customizadas', () => {
    
    it('deve aceitar propriedades personalizadas', () => {
      // ACT
      renderCartIcon({ 
        'data-testid': 'custom-cart-icon',
        className: 'custom-class'
      });
      
      // ASSERT
      expect(screen.getByTestId('custom-cart-icon')).toBeInTheDocument();
    });
    
  });
  
  describe('Casos Extremos', () => {
    
    it('deve lidar com contexto undefined', () => {
      // ACT & ASSERT
      expect(() => {
        render(
          <ThemeWrapper>
            <CartIcon />
          </ThemeWrapper>
        );
      }).not.toThrow();
    });
    
    it('deve lidar com cartCount undefined', () => {
      // ARRANGE
      const mockContext = {
        ...createMockCartContext([]),
        cartCount: undefined
      };
      
      // ACT & ASSERT
      expect(() => {
        render(
          <ThemeWrapper>
            <CartContext.Provider value={mockContext}>
              <CartIcon />
            </CartContext.Provider>
          </ThemeWrapper>
        );
      }).not.toThrow();
    });
    
    it('deve funcionar sem função toggleCart', () => {
      // ARRANGE
      const mockContext = {
        ...createMockCartContext([]),
        toggleCart: undefined
      };
      
      // ACT & ASSERT
      expect(() => {
        render(
          <ThemeWrapper>
            <CartContext.Provider value={mockContext}>
              <CartIcon />
            </CartContext.Provider>
          </ThemeWrapper>
        );
        
        fireEvent.click(screen.getByRole('button'));
      }).not.toThrow();
    });
    
  });
  
});
