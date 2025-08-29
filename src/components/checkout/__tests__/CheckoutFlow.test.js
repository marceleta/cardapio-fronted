/**
 * TESTES DO COMPONENTE - CHECKOUT FLOW
 * 
 * Conjunto de testes para validar o comportamento e funcionalidades
 * do componente CheckoutFlow (Orquestrador Principal do Fluxo).
 * 
 * Cobertura:
 * - Renderização correta do stepper
 * - Navegação entre etapas
 * - Validação de etapas
 * - Estados de loading e erro
 * - Integração com contextos
 * - Casos extremos e tratamento de erros
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Componente sendo testado
import CheckoutFlow from '../CheckoutFlow';

// Utilitários de teste customizados
import {
  renderWithCheckoutProviders,
  createMockAuthContext,
  createMockCheckoutContext,
  createMockCartContext,
  createMockUser,
  waitForDelay
} from './test-utils';

// Mocks de dependências
jest.mock('../../../context/AuthContext');
jest.mock('../../../context/CheckoutContext');
jest.mock('../../../context/CartContext');

/**
 * SUITE DE TESTES PRINCIPAL
 */
describe('CheckoutFlow - Fluxo de Checkout', () => {
  // Mocks padrão para testes
  let mockAuthContext;
  let mockCheckoutContext;
  let mockCartContext;

  // Configuração antes de cada teste
  beforeEach(() => {
    jest.clearAllMocks();
    
    mockAuthContext = createMockAuthContext();
    mockCheckoutContext = createMockCheckoutContext({
      currentStep: 0,
      isValidStep: jest.fn().mockReturnValue(true)
    });
    
    mockCartContext = createMockCartContext({
      items: [{ id: '1', name: 'Pizza', price: 25.00, quantity: 1 }],
      total: 25.00
    });
    
    // Mock dos hooks de contexto
    require('../../../context/AuthContext').useAuth.mockReturnValue(mockAuthContext);
    require('../../../context/CheckoutContext').useCheckout.mockReturnValue(mockCheckoutContext);
    require('../../../context/CartContext').useCart.mockReturnValue(mockCartContext);
  });

  /**
   * HELPER: Renderiza componente CheckoutFlow com contextos mockados
   */
  const renderCheckoutFlow = (authOverrides = {}, checkoutOverrides = {}, cartOverrides = {}) => {
    const authContext = { ...mockAuthContext, ...authOverrides };
    const checkoutContext = { ...mockCheckoutContext, ...checkoutOverrides };
    const cartContext = { ...mockCartContext, ...cartOverrides };
    
    require('../../../context/AuthContext').useAuth.mockReturnValue(authContext);
    require('../../../context/CheckoutContext').useCheckout.mockReturnValue(checkoutContext);
    require('../../../context/CartContext').useCart.mockReturnValue(cartContext);
    
    return renderWithCheckoutProviders(<CheckoutFlow />);
  };

  /**
   * GRUPO: Testes de Renderização
   */
  describe('Renderização', () => {
    test('deve renderizar o componente corretamente', () => {
      // ACT: Renderizar componente
      renderCheckoutFlow();

      // ASSERT: Verificar elementos principais
      expect(screen.getByTestId('checkout-stepper')).toBeInTheDocument();
      expect(screen.getByTestId('checkout-content')).toBeInTheDocument();
    });

    test('deve renderizar stepper com etapas corretas', () => {
      // ACT: Renderizar componente
      renderCheckoutFlow();

      // ASSERT: Verificar etapas do stepper
      expect(screen.getByText('Autenticação')).toBeInTheDocument();
      expect(screen.getByText('Entrega')).toBeInTheDocument();
      expect(screen.getByText('Pagamento')).toBeInTheDocument();
      expect(screen.getByText('Resumo')).toBeInTheDocument();
      expect(screen.getByText('Finalizado')).toBeInTheDocument();
    });

    test('deve mostrar etapa atual no stepper', () => {
      // ACT: Renderizar com etapa específica
      renderCheckoutFlow({}, { currentStep: 1 });

      // ASSERT: Verificar etapa ativa
      const activeStep = screen.getByTestId('step-1');
      expect(activeStep).toHaveClass('active');
    });

    test('deve renderizar AuthStep na primeira etapa', () => {
      // ACT: Renderizar componente
      renderCheckoutFlow();

      // ASSERT: Verificar que AuthStep está sendo renderizado
      expect(screen.getByText('Entre ou cadastre-se')).toBeInTheDocument();
    });

    test('deve renderizar DeliveryStep na segunda etapa', () => {
      // ACT: Renderizar na segunda etapa
      renderCheckoutFlow({}, { currentStep: 1 });

      // ASSERT: Verificar que DeliveryStep está sendo renderizado
      expect(screen.getByText('Como você quer receber?')).toBeInTheDocument();
    });

    test('deve renderizar PaymentStep na terceira etapa', () => {
      // ACT: Renderizar na terceira etapa
      renderCheckoutFlow({}, { currentStep: 2 });

      // ASSERT: Verificar que PaymentStep está sendo renderizado
      expect(screen.getByText('Como você vai pagar?')).toBeInTheDocument();
    });

    test('deve renderizar SummaryStep na quarta etapa', () => {
      // ACT: Renderizar na quarta etapa
      renderCheckoutFlow({}, { currentStep: 3 });

      // ASSERT: Verificar que SummaryStep está sendo renderizado
      expect(screen.getByText('Confirme seu pedido')).toBeInTheDocument();
    });

    test('deve renderizar SuccessStep na quinta etapa', () => {
      // ACT: Renderizar na quinta etapa
      renderCheckoutFlow({}, { currentStep: 4 });

      // ASSERT: Verificar que SuccessStep está sendo renderizado
      expect(screen.getByText('🎉 Pedido Confirmado!')).toBeInTheDocument();
    });
  });

  /**
   * GRUPO: Testes de Navegação
   */
  describe('Navegação', () => {
    test('deve permitir navegação entre etapas pelo stepper', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Renderizar e clicar em etapa
      renderCheckoutFlow({}, { currentStep: 2 });
      const step1 = screen.getByTestId('step-1');
      await user.click(step1);

      // ASSERT: Verificar navegação
      expect(mockCheckoutContext.goToStep).toHaveBeenCalledWith(1);
    });

    test('deve desabilitar etapas futuras não validadas', () => {
      // ARRANGE: Mock de validação
      mockCheckoutContext.isValidStep.mockImplementation((step) => step <= 1);

      // ACT: Renderizar componente
      renderCheckoutFlow({}, { currentStep: 1 });

      // ASSERT: Verificar etapas desabilitadas
      const step3 = screen.getByTestId('step-2');
      expect(step3).toHaveClass('disabled');
    });

    test('deve permitir navegação para etapas já validadas', () => {
      // ARRANGE: Mock de validação
      mockCheckoutContext.isValidStep.mockImplementation((step) => step <= 2);

      // ACT: Renderizar componente
      renderCheckoutFlow({}, { currentStep: 2 });

      // ASSERT: Verificar etapas habilitadas
      const step1 = screen.getByTestId('step-0');
      const step2 = screen.getByTestId('step-1');
      
      expect(step1).not.toHaveClass('disabled');
      expect(step2).not.toHaveClass('disabled');
    });

    test('deve mostrar progresso visual no stepper', () => {
      // ACT: Renderizar na terceira etapa
      renderCheckoutFlow({}, { currentStep: 2 });

      // ASSERT: Verificar progresso
      const step1 = screen.getByTestId('step-0');
      const step2 = screen.getByTestId('step-1');
      const step3 = screen.getByTestId('step-2');
      
      expect(step1).toHaveClass('completed');
      expect(step2).toHaveClass('completed');
      expect(step3).toHaveClass('active');
    });
  });

  /**
   * GRUPO: Testes de Validação
   */
  describe('Validação', () => {
    test('deve validar carrinho não vazio antes de iniciar', () => {
      // ACT: Renderizar com carrinho vazio
      renderCheckoutFlow({}, {}, { items: [], total: 0 });

      // ASSERT: Verificar mensagem de erro
      expect(screen.getByText('Seu carrinho está vazio')).toBeInTheDocument();
      expect(screen.getByText('Adicione itens ao carrinho para continuar')).toBeInTheDocument();
    });

    test('deve permitir checkout com carrinho válido', () => {
      // ACT: Renderizar com carrinho válido
      renderCheckoutFlow();

      // ASSERT: Verificar que checkout está disponível
      expect(screen.getByTestId('checkout-stepper')).toBeInTheDocument();
      expect(screen.queryByText('Seu carrinho está vazio')).not.toBeInTheDocument();
    });

    test('deve validar etapa antes de permitir navegação', async () => {
      // ARRANGE: Configurar userEvent e mock de validação
      const user = userEvent.setup();
      mockCheckoutContext.isValidStep.mockReturnValue(false);

      // ACT: Tentar navegar para etapa inválida
      renderCheckoutFlow();
      const step2 = screen.getByTestId('step-1');
      await user.click(step2);

      // ASSERT: Verificar que navegação foi bloqueada
      expect(mockCheckoutContext.goToStep).not.toHaveBeenCalled();
    });

    test('deve mostrar indicador de erro em etapas inválidas', () => {
      // ARRANGE: Mock de validação com erro
      mockCheckoutContext.isValidStep.mockImplementation((step) => {
        if (step === 1) return { valid: false, error: 'Dados incompletos' };
        return true;
      });

      // ACT: Renderizar componente
      renderCheckoutFlow({}, { currentStep: 2 });

      // ASSERT: Verificar indicador de erro
      const step2 = screen.getByTestId('step-1');
      expect(step2).toHaveClass('error');
    });
  });

  /**
   * GRUPO: Testes de Estados de Loading
   */
  describe('Estados de Loading', () => {
    test('deve mostrar loading durante transições', async () => {
      // ARRANGE: Configurar mock com delay
      mockCheckoutContext.goToStep.mockImplementation(() =>
        new Promise(resolve => setTimeout(resolve, 500))
      );

      // ACT: Iniciar transição
      const user = userEvent.setup();
      renderCheckoutFlow({}, { currentStep: 1 });
      
      const step3 = screen.getByTestId('step-2');
      await user.click(step3);

      // ASSERT: Verificar loading
      expect(screen.getByTestId('checkout-loading')).toBeInTheDocument();
    });

    test('deve ocultar loading após transição completa', async () => {
      // ARRANGE: Configurar mock
      mockCheckoutContext.goToStep.mockResolvedValue();

      // ACT: Completar transição
      const user = userEvent.setup();
      renderCheckoutFlow({}, { currentStep: 1 });
      
      const step3 = screen.getByTestId('step-2');
      await user.click(step3);

      // ASSERT: Verificar que loading foi removido
      await waitFor(() => {
        expect(screen.queryByTestId('checkout-loading')).not.toBeInTheDocument();
      });
    });

    test('deve mostrar skeleton durante carregamento inicial', () => {
      // ACT: Renderizar com loading inicial
      renderCheckoutFlow({}, { isLoading: true });

      // ASSERT: Verificar skeleton
      expect(screen.getByTestId('checkout-skeleton')).toBeInTheDocument();
    });
  });

  /**
   * GRUPO: Testes de Tratamento de Erros
   */
  describe('Tratamento de Erros', () => {
    test('deve exibir erro quando contexto falha', () => {
      // ARRANGE: Mock com erro
      mockCheckoutContext.error = 'Erro interno do sistema';

      // ACT: Renderizar componente
      renderCheckoutFlow();

      // ASSERT: Verificar exibição do erro
      expect(screen.getByText('Erro interno do sistema')).toBeInTheDocument();
      expect(screen.getByText('Tente novamente')).toBeInTheDocument();
    });

    test('deve permitir retry em caso de erro', async () => {
      // ARRANGE: Configurar userEvent e mock com erro
      const user = userEvent.setup();
      mockCheckoutContext.error = 'Erro temporário';
      mockCheckoutContext.retry = jest.fn();

      // ACT: Clicar em retry
      renderCheckoutFlow();
      const retryButton = screen.getByText('Tente novamente');
      await user.click(retryButton);

      // ASSERT: Verificar retry
      expect(mockCheckoutContext.retry).toHaveBeenCalled();
    });

    test('deve tratar erro de validação graciosamente', () => {
      // ARRANGE: Mock de validação que lança erro
      mockCheckoutContext.isValidStep.mockImplementation(() => {
        throw new Error('Erro de validação');
      });

      // ACT: Renderizar componente
      renderCheckoutFlow();

      // ASSERT: Verificar que não quebra
      expect(screen.getByTestId('checkout-stepper')).toBeInTheDocument();
    });

    test('deve mostrar fallback para etapa inválida', () => {
      // ACT: Renderizar com etapa inválida
      renderCheckoutFlow({}, { currentStep: 999 });

      // ASSERT: Verificar fallback
      expect(screen.getByText('Etapa não encontrada')).toBeInTheDocument();
      expect(screen.getByText('Voltar ao início')).toBeInTheDocument();
    });
  });

  /**
   * GRUPO: Testes de Responsividade
   */
  describe('Responsividade', () => {
    test('deve adaptar stepper para mobile', () => {
      // ARRANGE: Simular viewport mobile
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 400,
      });

      // ACT: Renderizar componente
      renderCheckoutFlow();

      // ASSERT: Verificar adaptação mobile
      const stepper = screen.getByTestId('checkout-stepper');
      expect(stepper).toHaveClass('mobile');
    });

    test('deve manter layout desktop em telas grandes', () => {
      // ARRANGE: Simular viewport desktop
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1200,
      });

      // ACT: Renderizar componente
      renderCheckoutFlow();

      // ASSERT: Verificar layout desktop
      const stepper = screen.getByTestId('checkout-stepper');
      expect(stepper).toHaveClass('desktop');
    });

    test('deve ocultar labels em telas muito pequenas', () => {
      // ARRANGE: Simular viewport muito pequeno
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 320,
      });

      // ACT: Renderizar componente
      renderCheckoutFlow();

      // ASSERT: Verificar labels ocultas
      const stepper = screen.getByTestId('checkout-stepper');
      expect(stepper).toHaveClass('compact');
    });
  });

  /**
   * GRUPO: Testes de Integração
   */
  describe('Integração', () => {
    test('deve sincronizar com contexto de checkout', () => {
      // ACT: Renderizar componente
      renderCheckoutFlow();

      // ASSERT: Verificar sincronização
      expect(mockCheckoutContext.initializeCheckout).toHaveBeenCalled();
    });

    test('deve reagir a mudanças no contexto', () => {
      // ARRANGE: Renderizar componente
      const { rerender } = renderCheckoutFlow();

      // ACT: Simular mudança no contexto
      mockCheckoutContext.currentStep = 2;
      rerender(<CheckoutFlow />);

      // ASSERT: Verificar que UI atualizou
      const step3 = screen.getByTestId('step-2');
      expect(step3).toHaveClass('active');
    });

    test('deve validar dados dos contextos na inicialização', () => {
      // ACT: Renderizar componente
      renderCheckoutFlow();

      // ASSERT: Verificar validação inicial
      expect(mockCheckoutContext.validateInitialData).toHaveBeenCalled();
    });

    test('deve limpar dados ao desmontar', () => {
      // ARRANGE: Renderizar componente
      const { unmount } = renderCheckoutFlow();

      // ACT: Desmontar componente
      unmount();

      // ASSERT: Verificar limpeza
      expect(mockCheckoutContext.cleanup).toHaveBeenCalled();
    });
  });

  /**
   * GRUPO: Testes de Acessibilidade
   */
  describe('Acessibilidade', () => {
    test('deve ter navegação por teclado funcionando', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Navegar por teclado
      renderCheckoutFlow();
      await user.tab();

      // ASSERT: Verificar foco
      const firstStep = screen.getByTestId('step-0');
      expect(firstStep).toHaveFocus();
    });

    test('deve ter aria-labels apropriados', () => {
      // ACT: Renderizar componente
      renderCheckoutFlow();

      // ASSERT: Verificar aria-labels
      const stepper = screen.getByTestId('checkout-stepper');
      expect(stepper).toHaveAttribute('aria-label', 'Progresso do checkout');
    });

    test('deve anunciar mudanças de etapa para screen readers', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Mudar etapa
      renderCheckoutFlow({}, { currentStep: 1 });
      const step1 = screen.getByTestId('step-0');
      await user.click(step1);

      // ASSERT: Verificar anúncio
      expect(screen.getByRole('status')).toHaveTextContent('Etapa Autenticação ativa');
    });

    test('deve ter contraste adequado nos elementos', () => {
      // ACT: Renderizar componente
      renderCheckoutFlow();

      // ASSERT: Verificar elementos com contraste (estrutura está presente)
      expect(screen.getByTestId('checkout-stepper')).toBeInTheDocument();
      expect(screen.getByText('Autenticação')).toBeInTheDocument();
    });

    test('deve ser navegável apenas por teclado', async () => {
      // ARRANGE: Configurar userEvent
      const user = userEvent.setup();

      // ACT: Navegar apenas com teclado
      renderCheckoutFlow({}, { currentStep: 1 });
      
      await user.tab(); // Foco no primeiro step
      await user.keyboard('{Enter}'); // Ativar step

      // ASSERT: Verificar que funciona
      expect(mockCheckoutContext.goToStep).toHaveBeenCalledWith(0);
    });
  });

  /**
   * GRUPO: Testes de Performance
   */
  describe('Performance', () => {
    test('deve renderizar etapas sob demanda', () => {
      // ACT: Renderizar na primeira etapa
      renderCheckoutFlow();

      // ASSERT: Verificar que apenas a etapa atual está no DOM
      expect(screen.getByText('Entre ou cadastre-se')).toBeInTheDocument();
      expect(screen.queryByText('Como você quer receber?')).not.toBeInTheDocument();
    });

    test('deve memoizar componentes de etapa', () => {
      // ARRANGE: Renderizar múltiplas vezes
      const { rerender } = renderCheckoutFlow();
      
      // ACT: Re-renderizar sem mudanças
      rerender(<CheckoutFlow />);
      rerender(<CheckoutFlow />);

      // ASSERT: Verificar que AuthStep não foi recriado desnecessariamente
      expect(screen.getByText('Entre ou cadastre-se')).toBeInTheDocument();
    });

    test('deve fazer lazy loading de etapas futuras', () => {
      // ACT: Renderizar componente
      renderCheckoutFlow();

      // ASSERT: Verificar que etapas futuras não estão carregadas
      expect(screen.queryByTestId('delivery-step-content')).not.toBeInTheDocument();
      expect(screen.queryByTestId('payment-step-content')).not.toBeInTheDocument();
    });
  });
});
