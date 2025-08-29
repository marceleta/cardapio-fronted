/**
 * TESTES DO COMPONENTE - SUMMARY STEP
 * 
 * Conjunto de testes para validar o comportamento e funcionalidades
 * do componente SummaryStep (PASSO 4: Resumo Final e Confirmação).
 * 
 * Cobertura:
 * - Renderização correta do resumo
 * - Exibição de informações do pedido
 * - Geração da mensagem do WhatsApp
 * - Validação antes do envio
 * - Confirmação e redirecionamento
 * - Casos extremos e tratamento de erros
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Componente sendo testado
import SummaryStep from '../steps/SummaryStep';

// Utilitários de teste customizados
import {
  renderWithCheckoutProviders,
  createMockAuthContext,
  createMockCheckoutContext,
  createMockCartContext,
  createMockUser,
  createMockAddress,
  createMockCartItem,
  validateWhatsAppMessage,
  validateWhatsAppUrl
} from './test-utils';

// Mocks de dependências
jest.mock('../../../context/AuthContext');
jest.mock('../../../context/CheckoutContext');
jest.mock('../../../context/CartContext');

/**
 * SUITE DE TESTES PRINCIPAL
 */
describe('SummaryStep - Etapa de Resumo', () => {
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
      deliveryType: 'delivery',
      deliveryAddress: createMockAddress({
        street: 'Rua das Flores, 123',
        neighborhood: 'Centro',
        city: 'São Paulo'
      }),
      deliveryFee: 8.50,
      paymentMethod: 'pix',
      paymentDetails: { totalAmount: 58.50 }
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
   * HELPER: Renderiza componente SummaryStep com contextos mockados
   */
  const renderSummaryStep = (authOverrides = {}, checkoutOverrides = {}, cartOverrides = {}) => {
    const authContext = { ...mockAuthContext, ...authOverrides };
    const checkoutContext = { ...mockCheckoutContext, ...checkoutOverrides };
    const cartContext = { ...mockCartContext, ...cartOverrides };
    
    require('../../../context/AuthContext').useAuth.mockReturnValue(authContext);
    require('../../../context/CheckoutContext').useCheckout.mockReturnValue(checkoutContext);
    require('../../../context/CartContext').useCart.mockReturnValue(cartContext);
    
    return renderWithCheckoutProviders(<SummaryStep />);
  };

  /**
   * GRUPO: Testes de Renderização
   */
  describe('Renderização', () => {
    test('deve renderizar o componente corretamente', () => {
      // ACT: Renderizar componente
      renderSummaryStep();

      // ASSERT: Verificar elementos principais
      expect(screen.getByText('Confirme seu pedido')).toBeInTheDocument();
      expect(screen.getByText('Revise todas as informações antes de finalizar')).toBeInTheDocument();
    });

    test('deve exibir informações do cliente', () => {
      // ACT: Renderizar componente
      renderSummaryStep();

      // ASSERT: Verificar dados do cliente
      expect(screen.getByText('Dados do Cliente')).toBeInTheDocument();
      expect(screen.getByText('João Silva')).toBeInTheDocument();
      expect(screen.getByText('(11) 99999-8888')).toBeInTheDocument();
    });

    test('deve exibir itens do pedido', () => {
      // ACT: Renderizar componente
      renderSummaryStep();

      // ASSERT: Verificar itens
      expect(screen.getByText('Itens do Pedido')).toBeInTheDocument();
      expect(screen.getByText('Pizza Margherita')).toBeInTheDocument();
      expect(screen.getByText('Refrigerante 2L')).toBeInTheDocument();
      expect(screen.getByText('1x')).toBeInTheDocument();
      expect(screen.getByText('R$ 35,00')).toBeInTheDocument();
      expect(screen.getByText('R$ 15,00')).toBeInTheDocument();
    });

    test('deve exibir informações de entrega para delivery', () => {
      // ACT: Renderizar componente
      renderSummaryStep();

      // ASSERT: Verificar dados de entrega
      expect(screen.getByText('Entrega')).toBeInTheDocument();
      expect(screen.getByText('🛵 Entrega')).toBeInTheDocument();
      expect(screen.getByText('Rua das Flores, 123')).toBeInTheDocument();
      expect(screen.getByText('Centro, São Paulo')).toBeInTheDocument();
    });

    test('deve exibir informações de retirada para pickup', () => {
      // ACT: Renderizar com retirada
      renderSummaryStep({}, { 
        deliveryType: 'pickup',
        deliveryAddress: null,
        deliveryFee: 0
      });

      // ASSERT: Verificar dados de retirada
      expect(screen.getByText('🏪 Retirada no Local')).toBeInTheDocument();
      expect(screen.getByText('Retire seu pedido em nossa loja')).toBeInTheDocument();
    });

    test('deve exibir informações de pagamento', () => {
      // ACT: Renderizar componente
      renderSummaryStep();

      // ASSERT: Verificar dados de pagamento
      expect(screen.getByText('Pagamento')).toBeInTheDocument();
      expect(screen.getByText('📱 PIX')).toBeInTheDocument();
    });

    test('deve exibir resumo financeiro', () => {
      // ACT: Renderizar componente
      renderSummaryStep();

      // ASSERT: Verificar valores
      expect(screen.getByText('Resumo do Pedido')).toBeInTheDocument();
      expect(screen.getByText('Subtotal:')).toBeInTheDocument();
      expect(screen.getByText('R$ 50,00')).toBeInTheDocument();
      expect(screen.getByText('Taxa de entrega:')).toBeInTheDocument();
      expect(screen.getByText('R$ 8,50')).toBeInTheDocument();
      expect(screen.getByText('Total:')).toBeInTheDocument();
      expect(screen.getByText('R$ 58,50')).toBeInTheDocument();
    });
  });

  /**
   * GRUPO: Testes de Métodos de Pagamento
   */
  describe('Métodos de Pagamento', () => {
    test('deve exibir detalhes do pagamento em dinheiro', () => {
      // ACT: Renderizar com pagamento em dinheiro
      renderSummaryStep({}, {
        paymentMethod: 'cash',
        paymentDetails: {
          cashAmount: 70.00,
          changeAmount: 11.50
        }
      });

      // ASSERT: Verificar detalhes do dinheiro
      expect(screen.getByText('💰 Dinheiro')).toBeInTheDocument();
      expect(screen.getByText('Valor pago: R$ 70,00')).toBeInTheDocument();
      expect(screen.getByText('Troco: R$ 11,50')).toBeInTheDocument();
    });

    test('deve exibir detalhes do pagamento em dinheiro exato', () => {
      // ACT: Renderizar com dinheiro exato
      renderSummaryStep({}, {
        paymentMethod: 'cash',
        paymentDetails: {
          cashAmount: 58.50,
          changeAmount: 0
        }
      });

      // ASSERT: Verificar dinheiro exato
      expect(screen.getByText('💰 Dinheiro')).toBeInTheDocument();
      expect(screen.getByText('Valor exato')).toBeInTheDocument();
    });

    test('deve exibir detalhes do cartão de crédito', () => {
      // ACT: Renderizar com cartão de crédito
      renderSummaryStep({}, {
        paymentMethod: 'credit',
        paymentDetails: {
          installments: 3,
          installmentAmount: 19.50
        }
      });

      // ASSERT: Verificar detalhes do crédito
      expect(screen.getByText('💳 Cartão de Crédito')).toBeInTheDocument();
      expect(screen.getByText('3x de R$ 19,50')).toBeInTheDocument();
    });

    test('deve exibir detalhes do cartão de débito', () => {
      // ACT: Renderizar com cartão de débito
      renderSummaryStep({}, {
        paymentMethod: 'debit',
        paymentDetails: { totalAmount: 58.50 }
      });

      // ASSERT: Verificar detalhes do débito
      expect(screen.getByText('💳 Cartão de Débito')).toBeInTheDocument();
      expect(screen.getByText('Pagamento à vista')).toBeInTheDocument();
    });

    test('deve exibir detalhes do PIX', () => {
      // ACT: Renderizar com PIX
      renderSummaryStep();

      // ASSERT: Verificar detalhes do PIX
      expect(screen.getByText('📱 PIX')).toBeInTheDocument();
      expect(screen.getByText('Pagamento instantâneo')).toBeInTheDocument();
    });
  });

  /**
   * GRUPO: Testes de Geração de Mensagem WhatsApp
   */
  describe('Geração de Mensagem WhatsApp', () => {
    test('deve gerar mensagem correta para entrega com PIX', () => {
      // ACT: Renderizar componente
      renderSummaryStep();

      // ASSERT: Verificar se generateWhatsAppMessage foi chamado
      expect(mockCheckoutContext.generateWhatsAppMessage).toHaveBeenCalled();
    });

    test('deve gerar mensagem correta para retirada com dinheiro', () => {
      // ACT: Renderizar com retirada e dinheiro
      renderSummaryStep({}, {
        deliveryType: 'pickup',
        deliveryAddress: null,
        deliveryFee: 0,
        paymentMethod: 'cash',
        paymentDetails: {
          cashAmount: 50.00,
          changeAmount: 0
        }
      });

      // ASSERT: Verificar geração da mensagem
      expect(mockCheckoutContext.generateWhatsAppMessage).toHaveBeenCalled();
    });

    test('deve incluir observações quando fornecidas', () => {
      // ACT: Renderizar com observações
      renderSummaryStep({}, {
        observations: 'Sem cebola na pizza, por favor'
      });

      // ASSERT: Verificar que observações são incluídas
      expect(screen.getByText('Observações')).toBeInTheDocument();
      expect(screen.getByText('Sem cebola na pizza, por favor')).toBeInTheDocument();
    });

    test('deve mostrar campo para adicionar observações', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Renderizar e clicar para adicionar observações
      renderSummaryStep();
      const addObservationsButton = screen.getByText('Adicionar Observações');
      await user.click(addObservationsButton);

      // ASSERT: Verificar campo de observações
      expect(screen.getByLabelText(/Observações/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Ex: Sem cebola, ponto da carne, etc.')).toBeInTheDocument();
    });

    test('deve salvar observações digitadas', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Adicionar observações
      renderSummaryStep();
      
      const addObservationsButton = screen.getByText('Adicionar Observações');
      await user.click(addObservationsButton);
      
      const observationsField = screen.getByLabelText(/Observações/i);
      await user.type(observationsField, 'Pizza bem assada');

      // ASSERT: Verificar que setObservations foi chamado
      expect(mockCheckoutContext.setObservations).toHaveBeenCalledWith('Pizza bem assada');
    });
  });

  /**
   * GRUPO: Testes de Confirmação e Envio
   */
  describe('Confirmação e Envio', () => {
    test('deve confirmar pedido e enviar para WhatsApp', async () => {
      // ARRANGE: Configurar userEvent e mock
      const user = userEvent.setup();
      mockCheckoutContext.sendToWhatsApp.mockResolvedValue(true);

      // ACT: Confirmar pedido
      renderSummaryStep();
      const confirmButton = screen.getByText('Confirmar Pedido');
      await user.click(confirmButton);

      // ASSERT: Verificar que sendToWhatsApp foi chamado
      expect(mockCheckoutContext.sendToWhatsApp).toHaveBeenCalled();
    });

    test('deve mostrar loading durante envio', async () => {
      // ARRANGE: Configurar mock com delay
      const user = userEvent.setup();
      mockCheckoutContext.sendToWhatsApp.mockImplementation(() =>
        new Promise(resolve => setTimeout(() => resolve(true), 500))
      );

      // ACT: Confirmar pedido
      renderSummaryStep();
      const confirmButton = screen.getByText('Confirmar Pedido');
      await user.click(confirmButton);

      // ASSERT: Verificar estado de loading
      expect(screen.getByText('Enviando pedido...')).toBeInTheDocument();
      expect(confirmButton).toBeDisabled();
    });

    test('deve avançar para próxima etapa após envio bem-sucedido', async () => {
      // ARRANGE: Configurar mock de sucesso
      const user = userEvent.setup();
      mockCheckoutContext.sendToWhatsApp.mockResolvedValue(true);

      // ACT: Confirmar pedido
      renderSummaryStep();
      const confirmButton = screen.getByText('Confirmar Pedido');
      await user.click(confirmButton);

      // ASSERT: Verificar navegação
      await waitFor(() => {
        expect(mockCheckoutContext.nextStep).toHaveBeenCalled();
      });
    });

    test('deve tratar erro no envio para WhatsApp', async () => {
      // ARRANGE: Configurar mock com erro
      const user = userEvent.setup();
      mockCheckoutContext.sendToWhatsApp.mockResolvedValue(false);

      // ACT: Tentar confirmar pedido
      renderSummaryStep();
      const confirmButton = screen.getByText('Confirmar Pedido');
      await user.click(confirmButton);

      // ASSERT: Verificar tratamento do erro
      await waitFor(() => {
        expect(screen.getByText('Erro ao abrir WhatsApp. Tente novamente.')).toBeInTheDocument();
      });
    });

    test('deve permitir nova tentativa após erro', async () => {
      // ARRANGE: Configurar mock que falha depois funciona
      const user = userEvent.setup();
      mockCheckoutContext.sendToWhatsApp
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(true);

      // ACT: Tentar, falhar, tentar novamente
      renderSummaryStep();
      
      const confirmButton = screen.getByText('Confirmar Pedido');
      await user.click(confirmButton);
      
      await waitFor(() => {
        expect(screen.getByText('Erro ao abrir WhatsApp. Tente novamente.')).toBeInTheDocument();
      });
      
      await user.click(confirmButton);

      // ASSERT: Verificar que tentou novamente
      expect(mockCheckoutContext.sendToWhatsApp).toHaveBeenCalledTimes(2);
    });

    test('deve validar dados antes de enviar', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Tentar confirmar sem dados completos
      renderSummaryStep({}, { paymentMethod: null });
      const confirmButton = screen.getByText('Confirmar Pedido');
      await user.click(confirmButton);

      // ASSERT: Verificar que não enviou
      expect(mockCheckoutContext.sendToWhatsApp).not.toHaveBeenCalled();
      expect(screen.getByText('Dados incompletos. Verifique as informações.')).toBeInTheDocument();
    });
  });

  /**
   * GRUPO: Testes de Navegação
   */
  describe('Navegação', () => {
    test('deve voltar para etapa anterior', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Clicar em voltar
      renderSummaryStep();
      const backButton = screen.getByText('Voltar');
      await user.click(backButton);

      // ASSERT: Verificar navegação
      expect(mockCheckoutContext.prevStep).toHaveBeenCalled();
    });

    test('deve permitir edição de informações', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Clicar em editar entrega
      renderSummaryStep();
      const editDeliveryButton = screen.getByTestId('edit-delivery');
      await user.click(editDeliveryButton);

      // ASSERT: Verificar que voltou para etapa específica
      expect(mockCheckoutContext.goToStep).toHaveBeenCalledWith(1); // DeliveryStep
    });

    test('deve permitir edição de pagamento', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Clicar em editar pagamento
      renderSummaryStep();
      const editPaymentButton = screen.getByTestId('edit-payment');
      await user.click(editPaymentButton);

      // ASSERT: Verificar que voltou para etapa específica
      expect(mockCheckoutContext.goToStep).toHaveBeenCalledWith(2); // PaymentStep
    });
  });

  /**
   * GRUPO: Testes de Formatação e Exibição
   */
  describe('Formatação e Exibição', () => {
    test('deve formatar valores monetários corretamente', () => {
      // ACT: Renderizar componente
      renderSummaryStep();

      // ASSERT: Verificar formatação
      expect(screen.getByText('R$ 50,00')).toBeInTheDocument();
      expect(screen.getByText('R$ 8,50')).toBeInTheDocument();
      expect(screen.getByText('R$ 58,50')).toBeInTheDocument();
    });

    test('deve formatar WhatsApp corretamente', () => {
      // ACT: Renderizar componente
      renderSummaryStep();

      // ASSERT: Verificar formatação do WhatsApp
      expect(screen.getByText('(11) 99999-8888')).toBeInTheDocument();
    });

    test('deve exibir quantidade de itens corretamente', () => {
      // ACT: Renderizar com item de quantidade múltipla
      renderSummaryStep({}, {}, {
        items: [
          createMockCartItem({
            id: '1',
            name: 'Pizza Margherita',
            price: 35.00,
            quantity: 2
          })
        ]
      });

      // ASSERT: Verificar exibição da quantidade
      expect(screen.getByText('2x')).toBeInTheDocument();
    });

    test('deve truncar observações muito longas', async () => {
      // ARRANGE: Configurar userEvent e observação longa
      const user = userEvent.setup();
      const longObservation = 'A'.repeat(200);

      // ACT: Adicionar observação longa
      renderSummaryStep();
      
      const addObservationsButton = screen.getByText('Adicionar Observações');
      await user.click(addObservationsButton);
      
      const observationsField = screen.getByLabelText(/Observações/i);
      await user.type(observationsField, longObservation);

      // ASSERT: Verificar truncamento
      expect(observationsField.value).toHaveLength(150); // Limite definido
    });
  });

  /**
   * GRUPO: Testes de Estados Especiais
   */
  describe('Estados Especiais', () => {
    test('deve funcionar com carrinho contendo apenas um item', () => {
      // ACT: Renderizar com um item
      renderSummaryStep({}, {}, {
        items: [
          createMockCartItem({
            id: '1',
            name: 'Pizza Margherita',
            price: 35.00,
            quantity: 1
          })
        ],
        total: 35.00
      });

      // ASSERT: Verificar exibição
      expect(screen.getByText('Pizza Margherita')).toBeInTheDocument();
      expect(screen.getByText('R$ 35,00')).toBeInTheDocument();
    });

    test('deve funcionar com entrega gratuita', () => {
      // ACT: Renderizar com entrega gratuita
      renderSummaryStep({}, { deliveryFee: 0 });

      // ASSERT: Verificar exibição
      expect(screen.getByText('Grátis')).toBeInTheDocument();
    });

    test('deve exibir horário estimado de entrega', () => {
      // ACT: Renderizar componente
      renderSummaryStep();

      // ASSERT: Verificar horário estimado
      expect(screen.getByText('Tempo estimado:')).toBeInTheDocument();
      expect(screen.getByText('30-45 minutos')).toBeInTheDocument();
    });

    test('deve exibir horário estimado de retirada', () => {
      // ACT: Renderizar com retirada
      renderSummaryStep({}, { deliveryType: 'pickup' });

      // ASSERT: Verificar horário estimado
      expect(screen.getByText('Tempo estimado:')).toBeInTheDocument();
      expect(screen.getByText('15-20 minutos')).toBeInTheDocument();
    });

    test('deve preservar dados ao renderizar novamente', () => {
      // ACT: Renderizar componente múltiplas vezes
      const { rerender } = renderSummaryStep();
      rerender(<SummaryStep />);

      // ASSERT: Verificar que dados são preservados
      expect(screen.getByText('João Silva')).toBeInTheDocument();
      expect(screen.getByText('Pizza Margherita')).toBeInTheDocument();
    });
  });
});
