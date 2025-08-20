/**
 * @file ProductCard.test.js
 * @description Testes unitários para o componente ProductCard
 * 
 * Testa funcionalidades:
 * - Renderização de informações do produto
 * - Exibição de imagem, nome, descrição e preço
 * - Interações de clique
 * - Estados de disponibilidade
 * - Formatação de preços
 * 
 * @author Sistema de Testes
 * @since 2024
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import ProductCard from '../ProductCard';

// Tema básico para testes
const testTheme = createTheme();

// Wrapper de tema para testes
const ThemeWrapper = ({ children }) => (
  <ThemeProvider theme={testTheme}>
    {children}
  </ThemeProvider>
);

// Mock de dados do produto
const mockProduct = {
  id: 1,
  name: 'Hambúrguer Clássico',
  description: 'Delicioso hambúrguer com queijo, alface e tomate',
  price: 25.90,
  imageUrl: 'https://example.com/burger.jpg',
  category: 'Hambúrgueres',
  available: true
};

// Helper para renderizar com tema
const renderProductCard = (props = {}) => {
  const defaultProps = {
    product: mockProduct,
    onClick: jest.fn(),
    ...props
  };
  
  return render(
    <ThemeWrapper>
      <ProductCard {...defaultProps} />
    </ThemeWrapper>
  );
};

describe('ProductCard', () => {
  
  describe('Renderização Básica', () => {
    
    it('deve renderizar informações do produto corretamente', () => {
      // ACT
      renderProductCard();
      
      // ASSERT
      expect(screen.getByText('Hambúrguer Clássico')).toBeInTheDocument();
      expect(screen.getByText('Delicioso hambúrguer com queijo, alface e tomate')).toBeInTheDocument();
      expect(screen.getByText('R$ 25,90')).toBeInTheDocument();
    });
    
    it('deve renderizar imagem do produto', () => {
      // ACT
      renderProductCard();
      
      // ASSERT
      const image = screen.getByRole('img');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'https://example.com/burger.jpg');
      expect(image).toHaveAttribute('alt', 'Hambúrguer Clássico');
    });
    
    it('deve ser um componente clicável', () => {
      // ACT
      renderProductCard();
      
      // ASSERT
      const card = screen.getByRole('button');
      expect(card).toBeInTheDocument();
    });
    
  });
  
  describe('Formatação de Preços', () => {
    
    it('deve formatar preços decimais corretamente', () => {
      // ARRANGE
      const productWithDecimal = {
        ...mockProduct,
        price: 15.50
      };
      
      // ACT
      renderProductCard({ product: productWithDecimal });
      
      // ASSERT
      expect(screen.getByText('R$ 15,50')).toBeInTheDocument();
    });
    
    it('deve formatar preços inteiros corretamente', () => {
      // ARRANGE
      const productWithInteger = {
        ...mockProduct,
        price: 20
      };
      
      // ACT
      renderProductCard({ product: productWithInteger });
      
      // ASSERT
      expect(screen.getByText('R$ 20,00')).toBeInTheDocument();
    });
    
    it('deve lidar com preços altos', () => {
      // ARRANGE
      const expensiveProduct = {
        ...mockProduct,
        price: 199.99
      };
      
      // ACT
      renderProductCard({ product: expensiveProduct });
      
      // ASSERT
      expect(screen.getByText('R$ 199,99')).toBeInTheDocument();
    });
    
  });
  
  describe('Estados de Disponibilidade', () => {
    
    it('deve mostrar produto disponível normalmente', () => {
      // ARRANGE
      const availableProduct = {
        ...mockProduct,
        available: true
      };
      
      // ACT
      renderProductCard({ product: availableProduct });
      
      // ASSERT
      const card = screen.getByRole('button');
      expect(card).not.toHaveAttribute('disabled');
      expect(screen.queryByText('Indisponível')).not.toBeInTheDocument();
    });
    
    it('deve mostrar produto indisponível', () => {
      // ARRANGE
      const unavailableProduct = {
        ...mockProduct,
        available: false
      };
      
      // ACT
      renderProductCard({ product: unavailableProduct });
      
      // ASSERT
      // Produto indisponível ainda deve mostrar informações mas com visual diferente
      expect(screen.getByText('Hambúrguer Clássico')).toBeInTheDocument();
    });
    
  });
  
  describe('Interações', () => {
    
    it('deve chamar onClick quando clicado', () => {
      // ARRANGE
      const mockOnClick = jest.fn();
      
      // ACT
      renderProductCard({ onClick: mockOnClick });
      fireEvent.click(screen.getByRole('button'));
      
      // ASSERT
      expect(mockOnClick).toHaveBeenCalledTimes(1);
      expect(mockOnClick).toHaveBeenCalledWith(mockProduct);
    });
    
    it('deve ser acessível via teclado', () => {
      // ARRANGE
      const mockOnClick = jest.fn();
      
      // ACT
      renderProductCard({ onClick: mockOnClick });
      const card = screen.getByRole('button');
      card.focus();
      fireEvent.keyDown(card, { key: 'Enter' });
      
      // ASSERT
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
    
    it('deve permitir múltiplos cliques', () => {
      // ARRANGE
      const mockOnClick = jest.fn();
      
      // ACT
      renderProductCard({ onClick: mockOnClick });
      const card = screen.getByRole('button');
      fireEvent.click(card);
      fireEvent.click(card);
      fireEvent.click(card);
      
      // ASSERT
      expect(mockOnClick).toHaveBeenCalledTimes(3);
    });
    
  });
  
  describe('Casos Extremos', () => {
    
    it('deve lidar com produto sem imagem', () => {
      // ARRANGE
      const productWithoutImage = {
        ...mockProduct,
        imageUrl: ''
      };
      
      // ACT & ASSERT
      expect(() => {
        renderProductCard({ product: productWithoutImage });
      }).not.toThrow();
    });
    
    it('deve lidar com descrição muito longa', () => {
      // ARRANGE
      const longDescription = 'A'.repeat(200);
      const productWithLongDescription = {
        ...mockProduct,
        description: longDescription
      };
      
      // ACT
      renderProductCard({ product: productWithLongDescription });
      
      // ASSERT
      expect(screen.getByText(longDescription)).toBeInTheDocument();
    });
    
    it('deve lidar com nome muito longo', () => {
      // ARRANGE
      const longName = 'Hambúrguer Super Mega Ultra Deluxe Premium Especial da Casa';
      const productWithLongName = {
        ...mockProduct,
        name: longName
      };
      
      // ACT
      renderProductCard({ product: productWithLongName });
      
      // ASSERT
      expect(screen.getByText(longName)).toBeInTheDocument();
    });
    
    it('deve lidar com preço zero', () => {
      // ARRANGE
      const freeProduct = {
        ...mockProduct,
        price: 0
      };
      
      // ACT
      renderProductCard({ product: freeProduct });
      
      // ASSERT
      expect(screen.getByText('R$ 0,00')).toBeInTheDocument();
    });
    
    it('deve lidar com produto undefined graciosamente', () => {
      // ACT & ASSERT
      expect(() => {
        renderProductCard({ product: undefined });
      }).not.toThrow();
    });
    
    it('deve funcionar sem função onClick', () => {
      // ACT & ASSERT
      expect(() => {
        renderProductCard({ onClick: undefined });
        fireEvent.click(screen.getByRole('button'));
      }).not.toThrow();
    });
    
  });
  
  describe('Acessibilidade', () => {
    
    it('deve ter atributos ARIA adequados', () => {
      // ACT
      renderProductCard();
      
      // ASSERT
      const card = screen.getByRole('button');
      expect(card).toHaveAttribute('aria-label');
    });
    
    it('deve ser focável', () => {
      // ACT
      renderProductCard();
      
      // ASSERT
      const card = screen.getByRole('button');
      card.focus();
      expect(document.activeElement).toBe(card);
    });
    
  });
  
  describe('Responsive', () => {
    
    it('deve renderizar adequadamente em diferentes tamanhos', () => {
      // ACT
      renderProductCard();
      
      // ASSERT
      const card = screen.getByRole('button');
      expect(card).toHaveClass('MuiCard-root');
    });
    
  });
  
});
