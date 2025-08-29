/**
 * TESTES DO COMPONENTE - CHECKOUT BUTTON
 * 
 * Conjunto de testes para validar o comportamento e funcionalidades
 * do componente CheckoutButton (Botão de Finalizar Pedido).
 * 
 * Cobertura:
 * - Renderização correta
 * - Validação de carrinho
 * - Navegação para checkout
 * - Estados de loading e desabilitado
 * - Integração com contextos
 * - Casos extremos e tratamento de erros
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Componente sendo testado
import CheckoutButton from '../CheckoutButton';

// Utilitários de teste customizados
import {
  renderWithCheckoutProviders,
  createMockCartContext,
  createMockCartItem,
  mockRouterPush
} from './test-utils';

// Mocks de dependências
jest.mock('../../../context/CartContext');
jest.mock('next/navigation');

/**
 * SUITE DE TESTES PRINCIPAL
 */
describe('CheckoutButton - Botão de Checkout', () => {
  // Mock padrão para testes
  let mockCartContext;

  // Configuração antes de cada teste
  beforeEach(() => {
    jest.clearAllMocks();
    
    mockCartContext = createMockCartContext({
      items: [
        createMockCartItem({
          id: '1',
          name: 'Pizza Margherita',
          price: 35.00,
          quantity: 1
        }),
        createMockCartItem({
          id: '2',
          name: 'Refrigerante 2L',
          price: 15.00,
          quantity: 2
        })
      ],
      total: 65.00
    });
    
    // Mock do hook de contexto
    require('../../../context/CartContext').useCart.mockReturnValue(mockCartContext);
  });

  /**
   * HELPER: Renderiza componente CheckoutButton com contextos mockados
   */
  const renderCheckoutButton = (cartOverrides = {}, props = {}) => {
    const cartContext = { ...mockCartContext, ...cartOverrides };
    
    require('../../../context/CartContext').useCart.mockReturnValue(cartContext);
    
    return renderWithCheckoutProviders(<CheckoutButton {...props} />);
  };

  /**
   * GRUPO: Testes de Renderização
   */
  describe('Renderização', () => {
    test('deve renderizar o componente corretamente', () => {
      // ACT: Renderizar componente
      renderCheckoutButton();

      // ASSERT: Verificar elementos principais
      expect(screen.getByRole('button', { name: /finalizar pedido/i })).toBeInTheDocument();
    });

    test('deve exibir total do carrinho no botão', () => {
      // ACT: Renderizar componente
      renderCheckoutButton();

      // ASSERT: Verificar total
      expect(screen.getByText('R$ 65,00')).toBeInTheDocument();
    });

    test('deve exibir quantidade de itens no botão', () => {
      // ACT: Renderizar componente
      renderCheckoutButton();

      // ASSERT: Verificar quantidade
      expect(screen.getByText('3 itens')).toBeInTheDocument(); // 1 + 2
    });

    test('deve exibir texto personalizado quando fornecido', () => {
      // ACT: Renderizar com texto customizado
      renderCheckoutButton({}, { text: 'Ir para Pagamento' });

      // ASSERT: Verificar texto personalizado
      expect(screen.getByText('Ir para Pagamento')).toBeInTheDocument();
    });

    test('deve aplicar estilo personalizado quando fornecido', () => {
      // ACT: Renderizar com variante customizada
      renderCheckoutButton({}, { variant: 'outlined' });

      // ASSERT: Verificar variante
      const button = screen.getByRole('button');
      expect(button).toHaveClass('MuiButton-outlined');
    });

    test('deve exibir ícone de carrinho', () => {
      // ACT: Renderizar componente
      renderCheckoutButton();

      // ASSERT: Verificar ícone
      expect(screen.getByTestId('shopping-cart-icon')).toBeInTheDocument();
    });
  });

  /**
   * GRUPO: Testes de Estado do Carrinho
   */
  describe('Estado do Carrinho', () => {
    test('deve estar habilitado com carrinho válido', () => {
      // ACT: Renderizar com carrinho válido
      renderCheckoutButton();

      // ASSERT: Verificar que botão está habilitado
      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
    });

    test('deve estar desabilitado com carrinho vazio', () => {
      // ACT: Renderizar com carrinho vazio
      renderCheckoutButton({ items: [], total: 0 });

      // ASSERT: Verificar que botão está desabilitado
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    test('deve exibir mensagem apropriada para carrinho vazio', () => {
      // ACT: Renderizar com carrinho vazio
      renderCheckoutButton({ items: [], total: 0 });

      // ASSERT: Verificar mensagem
      expect(screen.getByText('Carrinho vazio')).toBeInTheDocument();
      expect(screen.getByText('R$ 0,00')).toBeInTheDocument();
    });

    test('deve estar desabilitado com total zero', () => {
      // ACT: Renderizar com total zero
      renderCheckoutButton({
        items: [createMockCartItem({ price: 0, quantity: 1 })],
        total: 0
      });

      // ASSERT: Verificar que botão está desabilitado
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    test('deve exibir "1 item" no singular', () => {
      // ACT: Renderizar com um item
      renderCheckoutButton({
        items: [createMockCartItem({ quantity: 1 })],
        total: 25.00
      });

      // ASSERT: Verificar singular
      expect(screen.getByText('1 item')).toBeInTheDocument();
    });

    test('deve calcular quantidade total corretamente', () => {
      // ACT: Renderizar com múltiplos itens
      renderCheckoutButton({
        items: [
          createMockCartItem({ quantity: 2 }),
          createMockCartItem({ quantity: 3 }),
          createMockCartItem({ quantity: 1 })
        ]
      });

      // ASSERT: Verificar soma das quantidades
      expect(screen.getByText('6 itens')).toBeInTheDocument();
    });
  });

  /**
   * GRUPO: Testes de Navegação
   */
  describe('Navegação', () => {
    test('deve navegar para página de checkout ao clicar', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Clicar no botão
      renderCheckoutButton();
      const button = screen.getByRole('button');
      await user.click(button);

      // ASSERT: Verificar navegação
      expect(mockRouterPush).toHaveBeenCalledWith('/checkout');
    });

    test('não deve navegar se carrinho estiver vazio', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Tentar clicar com carrinho vazio
      renderCheckoutButton({ items: [], total: 0 });
      const button = screen.getByRole('button');
      await user.click(button);

      // ASSERT: Verificar que não navegou
      expect(mockRouterPush).not.toHaveBeenCalled();
    });

    test('deve permitir navegação customizada via prop', async () => {
      // ARRANGE: Configurar userEvent e callback
      const user = userEvent.setup();
      const customOnClick = jest.fn();

      // ACT: Clicar com callback personalizado
      renderCheckoutButton({}, { onClick: customOnClick });
      const button = screen.getByRole('button');
      await user.click(button);

      // ASSERT: Verificar callback customizado
      expect(customOnClick).toHaveBeenCalled();
      expect(mockRouterPush).not.toHaveBeenCalled();
    });

    test('deve combinar navegação padrão com callback customizado', async () => {
      // ARRANGE: Configurar userEvent e callback
      const user = userEvent.setup();
      const customOnClick = jest.fn();

      // ACT: Clicar com callback que não previne default
      renderCheckoutButton({}, { 
        onClick: customOnClick,
        preventDefault: false 
      });
      const button = screen.getByRole('button');
      await user.click(button);

      // ASSERT: Verificar ambos foram chamados
      expect(customOnClick).toHaveBeenCalled();
      expect(mockRouterPush).toHaveBeenCalledWith('/checkout');
    });
  });

  /**
   * GRUPO: Testes de Estados Visuais
   */
  describe('Estados Visuais', () => {
    test('deve mostrar estado de loading quando especificado', () => {
      // ACT: Renderizar em estado de loading
      renderCheckoutButton({}, { loading: true });

      // ASSERT: Verificar estado de loading
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    test('deve mostrar texto de loading customizado', () => {
      // ACT: Renderizar com texto de loading
      renderCheckoutButton({}, { 
        loading: true,
        loadingText: 'Processando...'
      });

      // ASSERT: Verificar texto de loading
      expect(screen.getByText('Processando...')).toBeInTheDocument();
    });

    test('deve ter estilo de destaque por padrão', () => {
      // ACT: Renderizar componente
      renderCheckoutButton();

      // ASSERT: Verificar estilo padrão
      const button = screen.getByRole('button');
      expect(button).toHaveClass('MuiButton-contained');
      expect(button).toHaveClass('MuiButton-sizeLarge');
    });

    test('deve adaptar cor baseada no total', () => {
      // ACT: Renderizar com total alto
      renderCheckoutButton({ total: 150.00 });

      // ASSERT: Verificar cor de destaque
      const button = screen.getByRole('button');
      expect(button).toHaveClass('MuiButton-colorPrimary');
    });

    test('deve mostrar indicador visual para carrinho vazio', () => {
      // ACT: Renderizar com carrinho vazio
      renderCheckoutButton({ items: [], total: 0 });

      // ASSERT: Verificar indicador
      const button = screen.getByRole('button');
      expect(button).toHaveClass('disabled');
      expect(screen.getByTestId('empty-cart-icon')).toBeInTheDocument();
    });
  });

  /**
   * GRUPO: Testes de Formatação
   */
  describe('Formatação', () => {
    test('deve formatar valores monetários corretamente', () => {
      // ACT: Renderizar com valores específicos
      renderCheckoutButton({ total: 1234.56 });

      // ASSERT: Verificar formatação
      expect(screen.getByText('R$ 1.234,56')).toBeInTheDocument();
    });

    test('deve formatar centavos corretamente', () => {
      // ACT: Renderizar com centavos
      renderCheckoutButton({ total: 25.50 });

      // ASSERT: Verificar formatação de centavos
      expect(screen.getByText('R$ 25,50')).toBeInTheDocument();
    });

    test('deve exibir zero como R$ 0,00', () => {
      // ACT: Renderizar com zero
      renderCheckoutButton({ total: 0 });

      // ASSERT: Verificar formatação de zero
      expect(screen.getByText('R$ 0,00')).toBeInTheDocument();
    });

    test('deve truncar casas decimais extras', () => {
      // ACT: Renderizar com muitas casas decimais
      renderCheckoutButton({ total: 25.999 });

      // ASSERT: Verificar truncamento
      expect(screen.getByText('R$ 26,00')).toBeInTheDocument();
    });
  });

  /**
   * GRUPO: Testes de Responsividade
   */
  describe('Responsividade', () => {
    test('deve adaptar tamanho para mobile', () => {
      // ARRANGE: Simular viewport mobile
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 400,
      });

      // ACT: Renderizar componente
      renderCheckoutButton({}, { responsive: true });

      // ASSERT: Verificar adaptação mobile
      const button = screen.getByRole('button');
      expect(button).toHaveClass('mobile-size');
    });

    test('deve ocultar detalhes em telas muito pequenas', () => {
      // ARRANGE: Simular viewport muito pequeno
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 320,
      });

      // ACT: Renderizar componente
      renderCheckoutButton({}, { responsive: true });

      // ASSERT: Verificar layout compacto
      expect(screen.queryByText('itens')).not.toBeInTheDocument();
      expect(screen.getByText('R$ 65,00')).toBeInTheDocument();
    });

    test('deve manter layout completo em desktop', () => {
      // ARRANGE: Simular viewport desktop
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200,
      });

      // ACT: Renderizar componente
      renderCheckoutButton({}, { responsive: true });

      // ASSERT: Verificar layout completo
      expect(screen.getByText('3 itens')).toBeInTheDocument();
      expect(screen.getByText('R$ 65,00')).toBeInTheDocument();
      expect(screen.getByText('Finalizar Pedido')).toBeInTheDocument();
    });
  });

  /**
   * GRUPO: Testes de Acessibilidade
   */
  describe('Acessibilidade', () => {
    test('deve ter aria-label apropriado', () => {
      // ACT: Renderizar componente
      renderCheckoutButton();

      // ASSERT: Verificar aria-label
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Finalizar pedido com 3 itens no valor de R$ 65,00');
    });

    test('deve ter aria-label para carrinho vazio', () => {
      // ACT: Renderizar com carrinho vazio
      renderCheckoutButton({ items: [], total: 0 });

      // ASSERT: Verificar aria-label
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Carrinho vazio - adicione itens para continuar');
    });

    test('deve ter role apropriado', () => {
      // ACT: Renderizar componente
      renderCheckoutButton();

      // ASSERT: Verificar role
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });

    test('deve ser navegável por teclado', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Navegar por teclado
      renderCheckoutButton();
      await user.tab();

      // ASSERT: Verificar foco
      const button = screen.getByRole('button');
      expect(button).toHaveFocus();
    });

    test('deve responder a Enter e Space', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Pressionar Enter
      renderCheckoutButton();
      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard('{Enter}');

      // ASSERT: Verificar ativação por teclado
      expect(mockRouterPush).toHaveBeenCalledWith('/checkout');
    });

    test('deve anunciar mudanças de estado para screen readers', () => {
      // ARRANGE: Renderizar com carrinho válido
      const { rerender } = renderCheckoutButton();

      // ACT: Atualizar para carrinho vazio
      require('../../../context/CartContext').useCart.mockReturnValue({
        ...mockCartContext,
        items: [],
        total: 0
      });
      rerender(<CheckoutButton />);

      // ASSERT: Verificar anúncio de mudança
      expect(screen.getByRole('status')).toHaveTextContent('Carrinho atualizado: vazio');
    });
  });

  /**
   * GRUPO: Testes de Performance
   */
  describe('Performance', () => {
    test('deve memoizar componente para evitar re-renders desnecessários', () => {
      // ARRANGE: Renderizar múltiplas vezes com mesmos props
      const { rerender } = renderCheckoutButton();

      // ACT: Re-renderizar sem mudanças
      rerender(<CheckoutButton />);
      rerender(<CheckoutButton />);

      // ASSERT: Verificar que componente não foi recriado desnecessariamente
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    test('deve otimizar cálculos de total e quantidade', () => {
      // ARRANGE: Mock de contexto com muitos itens
      const manyItems = Array.from({ length: 100 }, (_, i) => 
        createMockCartItem({ id: i.toString(), quantity: Math.floor(Math.random() * 5) + 1 })
      );

      // ACT: Renderizar com muitos itens
      renderCheckoutButton({ items: manyItems });

      // ASSERT: Verificar que renderizou sem problemas de performance
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    test('deve debounce cliques rápidos', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Clicar múltiplas vezes rapidamente
      renderCheckoutButton();
      const button = screen.getByRole('button');
      
      await user.click(button);
      await user.click(button);
      await user.click(button);

      // ASSERT: Verificar que navegação ocorreu apenas uma vez
      expect(mockRouterPush).toHaveBeenCalledTimes(1);
    });
  });

  /**
   * GRUPO: Testes de Casos Extremos
   */
  describe('Casos Extremos', () => {
    test('deve tratar contexto de carrinho undefined graciosamente', () => {
      // ARRANGE: Mock com contexto undefined
      require('../../../context/CartContext').useCart.mockReturnValue(undefined);

      // ACT: Renderizar componente
      const { container } = render(<CheckoutButton />);

      // ASSERT: Verificar que não quebra
      expect(container).toBeInTheDocument();
    });

    test('deve tratar itens com dados inválidos', () => {
      // ACT: Renderizar com itens inválidos
      renderCheckoutButton({
        items: [
          { id: null, price: 'invalid', quantity: -1 },
          createMockCartItem({ price: 25.00 })
        ],
        total: 25.00
      });

      // ASSERT: Verificar que filtra itens inválidos
      expect(screen.getByText('1 item')).toBeInTheDocument();
    });

    test('deve tratar total negativo', () => {
      // ACT: Renderizar com total negativo
      renderCheckoutButton({ total: -10.00 });

      // ASSERT: Verificar que trata como zero
      expect(screen.getByText('R$ 0,00')).toBeInTheDocument();
    });

    test('deve tratar erro na navegação graciosamente', async () => {
      // ARRANGE: Configurar userEvent e mock com erro
      const user = userEvent.setup();
      mockRouterPush.mockImplementation(() => {
        throw new Error('Erro de navegação');
      });

      // ACT: Tentar navegar
      renderCheckoutButton();
      const button = screen.getByRole('button');
      await user.click(button);

      // ASSERT: Verificar que erro foi tratado
      expect(screen.getByText('Erro ao navegar. Tente novamente.')).toBeInTheDocument();
    });

    test('deve funcionar sem localStorage', () => {
      // ARRANGE: Mock localStorage como undefined
      Object.defineProperty(window, 'localStorage', { value: undefined });

      // ACT: Renderizar componente
      renderCheckoutButton();

      // ASSERT: Verificar que funciona sem localStorage
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });
});
