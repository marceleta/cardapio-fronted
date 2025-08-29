/**
 * TESTES DO COMPONENTE - PAYMENT STEP
 * 
 * Conjunto de testes para validar o comportamento e funcionalidades
 * do componente PaymentStep (PASSO 3: Seleção da Forma de Pagamento).
 * 
 * Cobertura:
 * - Renderização correta
 * - Seleção de métodos de pagamento
 * - Cálculo de troco
 * - Validações de entrada
 * - Formulários específicos por método
 * - Casos extremos e tratamento de erros
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Componente sendo testado
import PaymentStep from '../steps/PaymentStep';

// Utilitários de teste customizados
import {
  renderWithCheckoutProviders,
  createMockAuthContext,
  createMockCheckoutContext,
  createMockCartContext,
  waitForDelay
} from './test-utils';

// Mocks de dependências
jest.mock('../../../context/AuthContext');
jest.mock('../../../context/CheckoutContext');
jest.mock('../../../context/CartContext');

/**
 * SUITE DE TESTES PRINCIPAL
 */
describe('PaymentStep - Etapa de Pagamento', () => {
  // Mocks padrão para testes
  let mockAuthContext;
  let mockCheckoutContext;
  let mockCartContext;

  // Configuração antes de cada teste
  beforeEach(() => {
    jest.clearAllMocks();
    
    mockAuthContext = createMockAuthContext();
    mockCheckoutContext = createMockCheckoutContext({
      paymentMethod: null,
      paymentDetails: {},
      deliveryFee: 5.00
    });
    
    mockCartContext = createMockCartContext({
      total: 45.50
    });
    
    // Mock dos hooks de contexto
    require('../../../context/AuthContext').useAuth.mockReturnValue(mockAuthContext);
    require('../../../context/CheckoutContext').useCheckout.mockReturnValue(mockCheckoutContext);
    require('../../../context/CartContext').useCart.mockReturnValue(mockCartContext);
  });

  /**
   * HELPER: Renderiza componente PaymentStep com contextos mockados
   */
  const renderPaymentStep = (authOverrides = {}, checkoutOverrides = {}, cartOverrides = {}) => {
    const authContext = { ...mockAuthContext, ...authOverrides };
    const checkoutContext = { ...mockCheckoutContext, ...checkoutOverrides };
    const cartContext = { ...mockCartContext, ...cartOverrides };
    
    require('../../../context/AuthContext').useAuth.mockReturnValue(authContext);
    require('../../../context/CheckoutContext').useCheckout.mockReturnValue(checkoutContext);
    require('../../../context/CartContext').useCart.mockReturnValue(cartContext);
    
    return renderWithCheckoutProviders(<PaymentStep />);
  };

  /**
   * GRUPO: Testes de Renderização
   */
  describe('Renderização', () => {
    test('deve renderizar o componente corretamente', () => {
      // ACT: Renderizar componente
      renderPaymentStep();

      // ASSERT: Verificar elementos principais
      expect(screen.getByText('Como você vai pagar?')).toBeInTheDocument();
      expect(screen.getByText('Escolha a forma de pagamento')).toBeInTheDocument();
    });

    test('deve mostrar todos os métodos de pagamento disponíveis', () => {
      // ACT: Renderizar componente
      renderPaymentStep();

      // ASSERT: Verificar métodos de pagamento
      expect(screen.getByText('💰 Dinheiro')).toBeInTheDocument();
      expect(screen.getByText('💳 Cartão de Débito')).toBeInTheDocument();
      expect(screen.getByText('💳 Cartão de Crédito')).toBeInTheDocument();
      expect(screen.getByText('📱 PIX')).toBeInTheDocument();
    });

    test('deve mostrar descrições dos métodos de pagamento', () => {
      // ACT: Renderizar componente
      renderPaymentStep();

      // ASSERT: Verificar descrições
      expect(screen.getByText('Pagamento na entrega/retirada')).toBeInTheDocument();
      expect(screen.getByText('Maquininha na entrega')).toBeInTheDocument();
      expect(screen.getByText('Instantâneo via QR Code')).toBeInTheDocument();
    });

    test('deve mostrar resumo do pedido', () => {
      // ACT: Renderizar componente
      renderPaymentStep();

      // ASSERT: Verificar resumo
      expect(screen.getByText('Subtotal:')).toBeInTheDocument();
      expect(screen.getByText('R$ 45,50')).toBeInTheDocument();
      expect(screen.getByText('Taxa de entrega:')).toBeInTheDocument();
      expect(screen.getByText('R$ 5,00')).toBeInTheDocument();
      expect(screen.getByText('Total:')).toBeInTheDocument();
      expect(screen.getByText('R$ 50,50')).toBeInTheDocument();
    });
  });

  /**
   * GRUPO: Testes de Seleção de Método de Pagamento
   */
  describe('Seleção de Método de Pagamento', () => {
    test('deve selecionar pagamento em dinheiro', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Renderizar e selecionar dinheiro
      renderPaymentStep();
      const cashCard = screen.getByTestId('payment-cash');
      await user.click(cashCard);

      // ASSERT: Verificar que setPaymentMethod foi chamado
      expect(mockCheckoutContext.setPaymentMethod).toHaveBeenCalledWith('cash');
    });

    test('deve selecionar cartão de débito', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Renderizar e selecionar débito
      renderPaymentStep();
      const debitCard = screen.getByTestId('payment-debit');
      await user.click(debitCard);

      // ASSERT: Verificar que setPaymentMethod foi chamado
      expect(mockCheckoutContext.setPaymentMethod).toHaveBeenCalledWith('debit');
    });

    test('deve selecionar cartão de crédito', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Renderizar e selecionar crédito
      renderPaymentStep();
      const creditCard = screen.getByTestId('payment-credit');
      await user.click(creditCard);

      // ASSERT: Verificar que setPaymentMethod foi chamado
      expect(mockCheckoutContext.setPaymentMethod).toHaveBeenCalledWith('credit');
    });

    test('deve selecionar PIX', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Renderizar e selecionar PIX
      renderPaymentStep();
      const pixCard = screen.getByTestId('payment-pix');
      await user.click(pixCard);

      // ASSERT: Verificar que setPaymentMethod foi chamado
      expect(mockCheckoutContext.setPaymentMethod).toHaveBeenCalledWith('pix');
    });

    test('deve marcar visualmente método selecionado', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Renderizar e selecionar dinheiro
      renderPaymentStep();
      const cashCard = screen.getByTestId('payment-cash');
      await user.click(cashCard);

      // ASSERT: Verificar marcação visual
      expect(cashCard).toHaveClass('selected');
    });

    test('deve permitir mudança de método de pagamento', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Selecionar dinheiro, depois PIX
      renderPaymentStep();
      
      const cashCard = screen.getByTestId('payment-cash');
      await user.click(cashCard);
      
      const pixCard = screen.getByTestId('payment-pix');
      await user.click(pixCard);

      // ASSERT: Verificar mudança
      expect(mockCheckoutContext.setPaymentMethod).toHaveBeenCalledWith('cash');
      expect(mockCheckoutContext.setPaymentMethod).toHaveBeenCalledWith('pix');
    });
  });

  /**
   * GRUPO: Testes de Formulário de Dinheiro e Troco
   */
  describe('Formulário de Dinheiro e Troco', () => {
    test('deve mostrar campo de troco ao selecionar dinheiro', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Selecionar dinheiro
      renderPaymentStep();
      const cashCard = screen.getByTestId('payment-cash');
      await user.click(cashCard);

      // ASSERT: Verificar campo de troco
      await waitFor(() => {
        expect(screen.getByText('Precisa de troco?')).toBeInTheDocument();
        expect(screen.getByLabelText(/Valor que você vai pagar/i)).toBeInTheDocument();
      });
    });

    test('deve calcular troco corretamente', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Selecionar dinheiro e inserir valor
      renderPaymentStep();
      const cashCard = screen.getByTestId('payment-cash');
      await user.click(cashCard);

      await waitFor(() => {
        const amountField = screen.getByLabelText(/Valor que você vai pagar/i);
        return user.type(amountField, '60');
      });

      // ASSERT: Verificar cálculo do troco
      await waitFor(() => {
        expect(screen.getByText('Troco: R$ 9,50')).toBeInTheDocument();
      });
    });

    test('deve validar valor mínimo para troco', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Inserir valor menor que o total
      renderPaymentStep();
      const cashCard = screen.getByTestId('payment-cash');
      await user.click(cashCard);

      await waitFor(() => {
        const amountField = screen.getByLabelText(/Valor que você vai pagar/i);
        return user.type(amountField, '40');
      });

      // ASSERT: Verificar mensagem de erro
      await waitFor(() => {
        expect(screen.getByText('Valor deve ser maior ou igual ao total do pedido')).toBeInTheDocument();
      });
    });

    test('deve salvar detalhes do pagamento em dinheiro', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Preencher dados do dinheiro
      renderPaymentStep();
      const cashCard = screen.getByTestId('payment-cash');
      await user.click(cashCard);

      await waitFor(() => {
        const amountField = screen.getByLabelText(/Valor que você vai pagar/i);
        return user.type(amountField, '60');
      });

      // ASSERT: Verificar que detalhes foram salvos
      expect(mockCheckoutContext.setPaymentDetails).toHaveBeenCalledWith({
        cashAmount: 60,
        changeAmount: 9.50
      });
    });

    test('deve permitir pagamento exato (sem troco)', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Selecionar dinheiro e marcar pagamento exato
      renderPaymentStep();
      const cashCard = screen.getByTestId('payment-cash');
      await user.click(cashCard);

      await waitFor(() => {
        const exactCheckbox = screen.getByLabelText(/Tenho o valor exato/i);
        return user.click(exactCheckbox);
      });

      // ASSERT: Verificar que campo de valor foi desabilitado
      const amountField = screen.getByLabelText(/Valor que você vai pagar/i);
      expect(amountField).toBeDisabled();
      expect(amountField.value).toBe('50.50');
    });
  });

  /**
   * GRUPO: Testes de Cartão de Crédito
   */
  describe('Formulário de Cartão de Crédito', () => {
    test('deve mostrar opções de parcelamento para cartão de crédito', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Selecionar cartão de crédito
      renderPaymentStep();
      const creditCard = screen.getByTestId('payment-credit');
      await user.click(creditCard);

      // ASSERT: Verificar opções de parcelamento
      await waitFor(() => {
        expect(screen.getByText('Parcelamento')).toBeInTheDocument();
        expect(screen.getByText('1x de R$ 50,50 (sem juros)')).toBeInTheDocument();
        expect(screen.getByText('2x de R$ 25,25 (sem juros)')).toBeInTheDocument();
        expect(screen.getByText('3x de R$ 16,83 (sem juros)')).toBeInTheDocument();
      });
    });

    test('deve selecionar parcelamento', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Selecionar cartão de crédito e parcelamento
      renderPaymentStep();
      const creditCard = screen.getByTestId('payment-credit');
      await user.click(creditCard);

      await waitFor(() => {
        const installment2x = screen.getByTestId('installment-2');
        return user.click(installment2x);
      });

      // ASSERT: Verificar seleção do parcelamento
      expect(mockCheckoutContext.setPaymentDetails).toHaveBeenCalledWith({
        installments: 2,
        installmentAmount: 25.25
      });
    });

    test('deve calcular parcelas corretamente', async () => {
      // ARRANGE: Configurar userEvent com valor diferente
      const user = userEvent.setup();

      // ACT: Renderizar com valor maior
      renderPaymentStep({}, {}, { total: 150.00 });
      
      const creditCard = screen.getByTestId('payment-credit');
      await user.click(creditCard);

      // ASSERT: Verificar cálculo das parcelas
      await waitFor(() => {
        expect(screen.getByText('1x de R$ 155,00 (sem juros)')).toBeInTheDocument(); // 150 + 5 taxa
        expect(screen.getByText('2x de R$ 77,50 (sem juros)')).toBeInTheDocument();
        expect(screen.getByText('3x de R$ 51,67 (sem juros)')).toBeInTheDocument();
      });
    });
  });

  /**
   * GRUPO: Testes de PIX
   */
  describe('Formulário de PIX', () => {
    test('deve mostrar instruções do PIX', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Selecionar PIX
      renderPaymentStep();
      const pixCard = screen.getByTestId('payment-pix');
      await user.click(pixCard);

      // ASSERT: Verificar instruções
      await waitFor(() => {
        expect(screen.getByText('Como funciona o PIX:')).toBeInTheDocument();
        expect(screen.getByText('1. Finalize o pedido')).toBeInTheDocument();
        expect(screen.getByText('2. Você receberá o QR Code no WhatsApp')).toBeInTheDocument();
        expect(screen.getByText('3. Escaneie com seu banco ou app de pagamento')).toBeInTheDocument();
        expect(screen.getByText('4. Confirme o pagamento')).toBeInTheDocument();
      });
    });

    test('deve mostrar valor total para PIX', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Selecionar PIX
      renderPaymentStep();
      const pixCard = screen.getByTestId('payment-pix');
      await user.click(pixCard);

      // ASSERT: Verificar valor destacado
      await waitFor(() => {
        expect(screen.getByText('Valor total: R$ 50,50')).toBeInTheDocument();
      });
    });

    test('deve salvar detalhes do PIX', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Selecionar PIX
      renderPaymentStep();
      const pixCard = screen.getByTestId('payment-pix');
      await user.click(pixCard);

      // ASSERT: Verificar que detalhes foram salvos
      await waitFor(() => {
        expect(mockCheckoutContext.setPaymentDetails).toHaveBeenCalledWith({
          totalAmount: 50.50
        });
      });
    });
  });

  /**
   * GRUPO: Testes de Cartão de Débito
   */
  describe('Formulário de Cartão de Débito', () => {
    test('deve mostrar informações do débito', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Selecionar débito
      renderPaymentStep();
      const debitCard = screen.getByTestId('payment-debit');
      await user.click(debitCard);

      // ASSERT: Verificar informações
      await waitFor(() => {
        expect(screen.getByText('Pagamento à vista')).toBeInTheDocument();
        expect(screen.getByText('Valor será debitado diretamente da sua conta')).toBeInTheDocument();
        expect(screen.getByText('Valor total: R$ 50,50')).toBeInTheDocument();
      });
    });

    test('deve salvar detalhes do débito', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Selecionar débito
      renderPaymentStep();
      const debitCard = screen.getByTestId('payment-debit');
      await user.click(debitCard);

      // ASSERT: Verificar que detalhes foram salvos
      await waitFor(() => {
        expect(mockCheckoutContext.setPaymentDetails).toHaveBeenCalledWith({
          totalAmount: 50.50
        });
      });
    });
  });

  /**
   * GRUPO: Testes de Validação e Navegação
   */
  describe('Validação e Navegação', () => {
    test('deve habilitar botão Continuar após selecionar método de pagamento', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Selecionar PIX
      renderPaymentStep();
      const pixCard = screen.getByTestId('payment-pix');
      await user.click(pixCard);

      // ASSERT: Verificar que botão está habilitado
      await waitFor(() => {
        const continueButton = screen.getByText('Continuar');
        expect(continueButton).not.toBeDisabled();
      });
    });

    test('deve manter botão Continuar desabilitado sem seleção', () => {
      // ACT: Renderizar componente
      renderPaymentStep();

      // ASSERT: Verificar que botão está desabilitado
      const continueButton = screen.getByText('Continuar');
      expect(continueButton).toBeDisabled();
    });

    test('deve avançar para próxima etapa ao clicar em Continuar', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Selecionar método e continuar
      renderPaymentStep();
      
      const pixCard = screen.getByTestId('payment-pix');
      await user.click(pixCard);
      
      await waitFor(() => {
        const continueButton = screen.getByText('Continuar');
        return user.click(continueButton);
      });

      // ASSERT: Verificar navegação
      expect(mockCheckoutContext.nextStep).toHaveBeenCalled();
    });

    test('deve voltar para etapa anterior', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Clicar em voltar
      renderPaymentStep();
      const backButton = screen.getByText('Voltar');
      await user.click(backButton);

      // ASSERT: Verificar navegação
      expect(mockCheckoutContext.prevStep).toHaveBeenCalled();
    });

    test('deve validar valor mínimo para dinheiro antes de continuar', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Selecionar dinheiro com valor insuficiente e tentar continuar
      renderPaymentStep();
      const cashCard = screen.getByTestId('payment-cash');
      await user.click(cashCard);

      await waitFor(() => {
        const amountField = screen.getByLabelText(/Valor que você vai pagar/i);
        return user.type(amountField, '40');
      });

      await waitFor(() => {
        const continueButton = screen.getByText('Continuar');
        return user.click(continueButton);
      });

      // ASSERT: Verificar que não avançou
      expect(mockCheckoutContext.nextStep).not.toHaveBeenCalled();
    });
  });

  /**
   * GRUPO: Testes de Formatação e Máscara
   */
  describe('Formatação e Máscara', () => {
    test('deve formatar valor monetário no campo de troco', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Digitar valor no campo
      renderPaymentStep();
      const cashCard = screen.getByTestId('payment-cash');
      await user.click(cashCard);

      await waitFor(() => {
        const amountField = screen.getByLabelText(/Valor que você vai pagar/i);
        return user.type(amountField, '10050');
      });

      // ASSERT: Verificar formatação
      const amountField = screen.getByLabelText(/Valor que você vai pagar/i);
      expect(amountField.value).toBe('100,50');
    });

    test('deve exibir valores monetários formatados corretamente', () => {
      // ACT: Renderizar componente
      renderPaymentStep();

      // ASSERT: Verificar formatação dos valores
      expect(screen.getByText('R$ 45,50')).toBeInTheDocument();
      expect(screen.getByText('R$ 5,00')).toBeInTheDocument();
      expect(screen.getByText('R$ 50,50')).toBeInTheDocument();
    });
  });

  /**
   * GRUPO: Testes de Estados Especiais
   */
  describe('Estados Especiais', () => {
    test('deve funcionar com entrega gratuita', () => {
      // ACT: Renderizar com entrega gratuita
      renderPaymentStep({}, { deliveryFee: 0 });

      // ASSERT: Verificar valores
      expect(screen.getByText('R$ 45,50')).toBeInTheDocument(); // subtotal
      expect(screen.getByText('Grátis')).toBeInTheDocument(); // taxa
      expect(screen.getByText('R$ 45,50')).toBeInTheDocument(); // total
    });

    test('deve tratar carrinho vazio graciosamente', () => {
      // ACT: Renderizar com carrinho vazio
      renderPaymentStep({}, {}, { total: 0 });

      // ASSERT: Verificar que não quebra
      expect(screen.getByText('R$ 0,00')).toBeInTheDocument();
    });

    test('deve preservar seleção ao renderizar novamente', () => {
      // ARRANGE: Simular seleção prévia
      renderPaymentStep({}, { paymentMethod: 'pix' });

      // ASSERT: Verificar que PIX está selecionado
      const pixCard = screen.getByTestId('payment-pix');
      expect(pixCard).toHaveClass('selected');
    });

    test('deve limpar detalhes ao trocar método de pagamento', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Selecionar dinheiro, depois PIX
      renderPaymentStep();
      
      const cashCard = screen.getByTestId('payment-cash');
      await user.click(cashCard);
      
      const pixCard = screen.getByTestId('payment-pix');
      await user.click(pixCard);

      // ASSERT: Verificar que detalhes foram limpos
      expect(mockCheckoutContext.setPaymentDetails).toHaveBeenCalledWith({});
    });
  });
});
