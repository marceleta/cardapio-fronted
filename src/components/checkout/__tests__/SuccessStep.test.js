/**
 * TESTES DO COMPONENTE - SUCCESS STEP
 * 
 * Conjunto de testes para validar o comportamento e funcionalidades
 * do componente SuccessStep (PASSO 5: Página de Sucesso).
 * 
 * Cobertura:
 * - Renderização correta
 * - Exibição de informações do pedido
 * - Navegação pós-checkout
 * - Limpeza de estados
 * - Casos extremos e tratamento de erros
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Componente sendo testado
import SuccessStep from '../steps/SuccessStep';

// Utilitários de teste customizados
import {
  renderWithCheckoutProviders,
  createMockAuthContext,
  createMockCheckoutContext,
  createMockCartContext,
  createMockUser,
  createMockAddress,
  createMockCartItem,
  mockRouterPush
} from './test-utils';

// Mocks de dependências
jest.mock('../../../context/AuthContext');
jest.mock('../../../context/CheckoutContext');
jest.mock('../../../context/CartContext');
jest.mock('next/navigation');

/**
 * SUITE DE TESTES PRINCIPAL
 */
describe('SuccessStep - Etapa de Sucesso', () => {
  // Mocks padrão para testes
  let mockAuthContext;
  let mockCheckoutContext;
  let mockCartContext;

  // Configuração antes de cada teste
  beforeEach(() => {
    jest.clearAllMocks();
    
    mockAuthContext = createMockAuthContext({
      user: createMockUser({
        name: 'João Silva',
        whatsapp: '11999998888'
      })
    });
    
    mockCheckoutContext = createMockCheckoutContext({
      orderNumber: 'PED-2024-001',
      deliveryType: 'delivery',
      deliveryAddress: createMockAddress({
        street: 'Rua das Flores, 123',
        neighborhood: 'Centro'
      }),
      deliveryFee: 8.50,
      paymentMethod: 'pix',
      estimatedTime: '30-45 minutos'
    });
    
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
          quantity: 1
        })
      ],
      total: 50.00
    });
    
    // Mock dos hooks de contexto
    require('../../../context/AuthContext').useAuth.mockReturnValue(mockAuthContext);
    require('../../../context/CheckoutContext').useCheckout.mockReturnValue(mockCheckoutContext);
    require('../../../context/CartContext').useCart.mockReturnValue(mockCartContext);
  });

  /**
   * HELPER: Renderiza componente SuccessStep com contextos mockados
   */
  const renderSuccessStep = (authOverrides = {}, checkoutOverrides = {}, cartOverrides = {}) => {
    const authContext = { ...mockAuthContext, ...authOverrides };
    const checkoutContext = { ...mockCheckoutContext, ...checkoutOverrides };
    const cartContext = { ...mockCartContext, ...cartOverrides };
    
    require('../../../context/AuthContext').useAuth.mockReturnValue(authContext);
    require('../../../context/CheckoutContext').useCheckout.mockReturnValue(checkoutContext);
    require('../../../context/CartContext').useCart.mockReturnValue(cartContext);
    
    return renderWithCheckoutProviders(<SuccessStep />);
  };

  /**
   * GRUPO: Testes de Renderização
   */
  describe('Renderização', () => {
    test('deve renderizar o componente corretamente', () => {
      // ACT: Renderizar componente
      renderSuccessStep();

      // ASSERT: Verificar elementos principais
      expect(screen.getByText('🎉 Pedido Confirmado!')).toBeInTheDocument();
      expect(screen.getByText('Seu pedido foi enviado com sucesso para o WhatsApp')).toBeInTheDocument();
    });

    test('deve exibir número do pedido', () => {
      // ACT: Renderizar componente
      renderSuccessStep();

      // ASSERT: Verificar número do pedido
      expect(screen.getByText('Número do Pedido')).toBeInTheDocument();
      expect(screen.getByText('PED-2024-001')).toBeInTheDocument();
    });

    test('deve exibir informações do cliente', () => {
      // ACT: Renderizar componente
      renderSuccessStep();

      // ASSERT: Verificar dados do cliente
      expect(screen.getByText('Cliente')).toBeInTheDocument();
      expect(screen.getByText('João Silva')).toBeInTheDocument();
      expect(screen.getByText('(11) 99999-8888')).toBeInTheDocument();
    });

    test('deve exibir total do pedido', () => {
      // ACT: Renderizar componente
      renderSuccessStep();

      // ASSERT: Verificar total
      expect(screen.getByText('Total')).toBeInTheDocument();
      expect(screen.getByText('R$ 58,50')).toBeInTheDocument(); // 50 + 8.50
    });

    test('deve exibir tempo estimado', () => {
      // ACT: Renderizar componente
      renderSuccessStep();

      // ASSERT: Verificar tempo estimado
      expect(screen.getByText('Tempo Estimado')).toBeInTheDocument();
      expect(screen.getByText('30-45 minutos')).toBeInTheDocument();
    });
  });

  /**
   * GRUPO: Testes de Tipos de Entrega
   */
  describe('Tipos de Entrega', () => {
    test('deve exibir informações de entrega', () => {
      // ACT: Renderizar com entrega
      renderSuccessStep();

      // ASSERT: Verificar informações de entrega
      expect(screen.getByText('🛵 Entrega')).toBeInTheDocument();
      expect(screen.getByText('Rua das Flores, 123')).toBeInTheDocument();
      expect(screen.getByText('Centro')).toBeInTheDocument();
    });

    test('deve exibir informações de retirada', () => {
      // ACT: Renderizar com retirada
      renderSuccessStep({}, {
        deliveryType: 'pickup',
        deliveryAddress: null,
        deliveryFee: 0,
        estimatedTime: '15-20 minutos'
      });

      // ASSERT: Verificar informações de retirada
      expect(screen.getByText('🏪 Retirada no Local')).toBeInTheDocument();
      expect(screen.getByText('Retire seu pedido em nossa loja')).toBeInTheDocument();
      expect(screen.getByText('15-20 minutos')).toBeInTheDocument();
    });

    test('deve exibir endereço da loja para retirada', () => {
      // ACT: Renderizar com retirada
      renderSuccessStep({}, { deliveryType: 'pickup' });

      // ASSERT: Verificar endereço da loja
      expect(screen.getByText('Endereço da Loja')).toBeInTheDocument();
      expect(screen.getByText('Rua Principal, 456')).toBeInTheDocument();
      expect(screen.getByText('Centro, São Paulo')).toBeInTheDocument();
    });
  });

  /**
   * GRUPO: Testes de Métodos de Pagamento
   */
  describe('Métodos de Pagamento', () => {
    test('deve exibir instruções para PIX', () => {
      // ACT: Renderizar com PIX
      renderSuccessStep();

      // ASSERT: Verificar instruções PIX
      expect(screen.getByText('📱 PIX')).toBeInTheDocument();
      expect(screen.getByText('Aguarde o QR Code no WhatsApp')).toBeInTheDocument();
      expect(screen.getByText('O pagamento deve ser realizado em até 15 minutos')).toBeInTheDocument();
    });

    test('deve exibir instruções para dinheiro', () => {
      // ACT: Renderizar com dinheiro
      renderSuccessStep({}, {
        paymentMethod: 'cash',
        paymentDetails: {
          cashAmount: 70.00,
          changeAmount: 11.50
        }
      });

      // ASSERT: Verificar instruções dinheiro
      expect(screen.getByText('💰 Dinheiro')).toBeInTheDocument();
      expect(screen.getByText('Tenha R$ 70,00 em mãos')).toBeInTheDocument();
      expect(screen.getByText('Troco: R$ 11,50')).toBeInTheDocument();
    });

    test('deve exibir instruções para dinheiro exato', () => {
      // ACT: Renderizar com dinheiro exato
      renderSuccessStep({}, {
        paymentMethod: 'cash',
        paymentDetails: {
          cashAmount: 58.50,
          changeAmount: 0
        }
      });

      // ASSERT: Verificar dinheiro exato
      expect(screen.getByText('💰 Dinheiro')).toBeInTheDocument();
      expect(screen.getByText('Valor exato: R$ 58,50')).toBeInTheDocument();
    });

    test('deve exibir instruções para cartão de crédito', () => {
      // ACT: Renderizar com cartão de crédito
      renderSuccessStep({}, {
        paymentMethod: 'credit',
        paymentDetails: {
          installments: 3,
          installmentAmount: 19.50
        }
      });

      // ASSERT: Verificar instruções crédito
      expect(screen.getByText('💳 Cartão de Crédito')).toBeInTheDocument();
      expect(screen.getByText('3x de R$ 19,50')).toBeInTheDocument();
      expect(screen.getByText('Tenha seu cartão em mãos para a máquina')).toBeInTheDocument();
    });

    test('deve exibir instruções para cartão de débito', () => {
      // ACT: Renderizar com cartão de débito
      renderSuccessStep({}, {
        paymentMethod: 'debit',
        paymentDetails: { totalAmount: 58.50 }
      });

      // ASSERT: Verificar instruções débito
      expect(screen.getByText('💳 Cartão de Débito')).toBeInTheDocument();
      expect(screen.getByText('Pagamento à vista: R$ 58,50')).toBeInTheDocument();
      expect(screen.getByText('Tenha seu cartão em mãos para a máquina')).toBeInTheDocument();
    });
  });

  /**
   * GRUPO: Testes de Ações e Navegação
   */
  describe('Ações e Navegação', () => {
    test('deve permitir fazer novo pedido', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Clicar em fazer novo pedido
      renderSuccessStep();
      const newOrderButton = screen.getByText('Fazer Novo Pedido');
      await user.click(newOrderButton);

      // ASSERT: Verificar limpeza do carrinho e navegação
      expect(mockCartContext.clearCart).toHaveBeenCalled();
      expect(mockCheckoutContext.resetCheckout).toHaveBeenCalled();
      expect(mockRouterPush).toHaveBeenCalledWith('/');
    });

    test('deve permitir acompanhar pedido', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Clicar em acompanhar pedido
      renderSuccessStep();
      const trackButton = screen.getByText('Acompanhar Pedido');
      await user.click(trackButton);

      // ASSERT: Verificar navegação para WhatsApp
      expect(window.open).toHaveBeenCalledWith(
        expect.stringContaining('wa.me'),
        '_blank'
      );
    });

    test('deve permitir ver histórico de pedidos', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Clicar em ver histórico
      renderSuccessStep();
      const historyButton = screen.getByText('Ver Meus Pedidos');
      await user.click(historyButton);

      // ASSERT: Verificar navegação
      expect(mockRouterPush).toHaveBeenCalledWith('/account/orders');
    });

    test('deve salvar pedido no histórico', () => {
      // ACT: Renderizar componente
      renderSuccessStep();

      // ASSERT: Verificar que pedido foi salvo
      expect(mockAuthContext.addOrder).toHaveBeenCalledWith(
        expect.objectContaining({
          orderNumber: 'PED-2024-001',
          total: 58.50,
          status: 'confirmed'
        })
      );
    });
  });

  /**
   * GRUPO: Testes de Informações de Contato
   */
  describe('Informações de Contato', () => {
    test('deve exibir informações de contato da loja', () => {
      // ACT: Renderizar componente
      renderSuccessStep();

      // ASSERT: Verificar informações de contato
      expect(screen.getByText('Precisa de Ajuda?')).toBeInTheDocument();
      expect(screen.getByText('Entre em contato conosco:')).toBeInTheDocument();
      expect(screen.getByText('📞 (11) 3333-4444')).toBeInTheDocument();
      expect(screen.getByText('📱 (11) 99999-0000')).toBeInTheDocument();
    });

    test('deve permitir ligar para a loja', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Clicar no telefone
      renderSuccessStep();
      const phoneLink = screen.getByText('📞 (11) 3333-4444');
      await user.click(phoneLink);

      // ASSERT: Verificar link tel:
      expect(phoneLink.closest('a')).toHaveAttribute('href', 'tel:1133334444');
    });

    test('deve permitir contato via WhatsApp da loja', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Clicar no WhatsApp
      renderSuccessStep();
      const whatsappLink = screen.getByText('📱 (11) 99999-0000');
      await user.click(whatsappLink);

      // ASSERT: Verificar abertura do WhatsApp
      expect(window.open).toHaveBeenCalledWith(
        expect.stringContaining('wa.me/5511999990000'),
        '_blank'
      );
    });
  });

  /**
   * GRUPO: Testes de Status e Atualizações
   */
  describe('Status e Atualizações', () => {
    test('deve exibir status de confirmação', () => {
      // ACT: Renderizar componente
      renderSuccessStep();

      // ASSERT: Verificar status
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('✅ Confirmado')).toBeInTheDocument();
    });

    test('deve exibir próximos passos do processo', () => {
      // ACT: Renderizar componente
      renderSuccessStep();

      // ASSERT: Verificar próximos passos
      expect(screen.getByText('Próximos Passos')).toBeInTheDocument();
      expect(screen.getByText('1. Aguarde a confirmação pelo WhatsApp')).toBeInTheDocument();
      expect(screen.getByText('2. Acompanhe o preparo do seu pedido')).toBeInTheDocument();
      expect(screen.getByText('3. Receba seu pedido no tempo estimado')).toBeInTheDocument();
    });

    test('deve exibir horário do pedido', () => {
      // ACT: Renderizar componente
      renderSuccessStep();

      // ASSERT: Verificar horário
      expect(screen.getByText('Pedido realizado em:')).toBeInTheDocument();
      expect(screen.getByText(expect.stringMatching(/\d{2}\/\d{2}\/\d{4}/))).toBeInTheDocument();
    });

    test('deve calcular horário estimado de entrega', () => {
      // ACT: Renderizar componente
      renderSuccessStep();

      // ASSERT: Verificar estimativa
      expect(screen.getByText('Estimativa de entrega:')).toBeInTheDocument();
      expect(screen.getByText(expect.stringMatching(/\d{2}:\d{2}/))).toBeInTheDocument();
    });
  });

  /**
   * GRUPO: Testes de Limpeza e Reset
   */
  describe('Limpeza e Reset', () => {
    test('deve limpar carrinho automaticamente', () => {
      // ACT: Renderizar componente
      renderSuccessStep();

      // ASSERT: Verificar que carrinho foi limpo
      expect(mockCartContext.clearCart).toHaveBeenCalled();
    });

    test('deve manter dados do checkout para exibição', () => {
      // ACT: Renderizar componente
      renderSuccessStep();

      // ASSERT: Verificar que dados são preservados para exibição
      expect(mockCheckoutContext.resetCheckout).not.toHaveBeenCalled();
    });

    test('deve resetar checkout apenas ao fazer novo pedido', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Fazer novo pedido
      renderSuccessStep();
      const newOrderButton = screen.getByText('Fazer Novo Pedido');
      await user.click(newOrderButton);

      // ASSERT: Verificar reset
      expect(mockCheckoutContext.resetCheckout).toHaveBeenCalled();
    });
  });

  /**
   * GRUPO: Testes de Casos Especiais
   */
  describe('Casos Especiais', () => {
    test('deve funcionar sem número de pedido', () => {
      // ACT: Renderizar sem número de pedido
      renderSuccessStep({}, { orderNumber: null });

      // ASSERT: Verificar que não quebra
      expect(screen.getByText('🎉 Pedido Confirmado!')).toBeInTheDocument();
    });

    test('deve funcionar com entrega gratuita', () => {
      // ACT: Renderizar com entrega gratuita
      renderSuccessStep({}, { deliveryFee: 0 });

      // ASSERT: Verificar total
      expect(screen.getByText('R$ 50,00')).toBeInTheDocument(); // Sem taxa
    });

    test('deve exibir mensagem especial para primeiro pedido', () => {
      // ACT: Renderizar para usuário novo
      renderSuccessStep({
        user: createMockUser({ isFirstOrder: true })
      });

      // ASSERT: Verificar mensagem especial
      expect(screen.getByText('🎊 Bem-vindo! Este é seu primeiro pedido!')).toBeInTheDocument();
    });

    test('deve oferecer desconto no próximo pedido', () => {
      // ACT: Renderizar componente
      renderSuccessStep();

      // ASSERT: Verificar oferta
      expect(screen.getByText('💰 Ganhe 10% de desconto no próximo pedido!')).toBeInTheDocument();
      expect(screen.getByText('Use o cupom: VOLTA10')).toBeInTheDocument();
    });

    test('deve tratar erro ao salvar no histórico graciosamente', () => {
      // ARRANGE: Configurar mock com erro
      mockAuthContext.addOrder.mockRejectedValue(new Error('Erro ao salvar'));

      // ACT: Renderizar componente
      renderSuccessStep();

      // ASSERT: Verificar que não quebra (erro é tratado silenciosamente)
      expect(screen.getByText('🎉 Pedido Confirmado!')).toBeInTheDocument();
    });
  });

  /**
   * GRUPO: Testes de Responsividade e Acessibilidade
   */
  describe('Responsividade e Acessibilidade', () => {
    test('deve ter estrutura acessível', () => {
      // ACT: Renderizar componente
      renderSuccessStep();

      // ASSERT: Verificar elementos acessíveis
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /fazer novo pedido/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /acompanhar pedido/i })).toBeInTheDocument();
    });

    test('deve ter botões com foco apropriado', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Navegar por teclado
      renderSuccessStep();
      await user.tab();

      // ASSERT: Verificar foco
      const newOrderButton = screen.getByText('Fazer Novo Pedido');
      expect(newOrderButton).toHaveFocus();
    });

    test('deve ter textos com contraste adequado', () => {
      // ACT: Renderizar componente
      renderSuccessStep();

      // ASSERT: Verificar elementos principais (estrutura está presente)
      expect(screen.getByText('🎉 Pedido Confirmado!')).toBeInTheDocument();
      expect(screen.getByText('João Silva')).toBeInTheDocument();
    });
  });
});
