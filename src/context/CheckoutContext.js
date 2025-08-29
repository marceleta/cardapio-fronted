/**
 * CONTEXTO DE CHECKOUT - GERENCIAMENTO DO FLUXO DE PEDIDO
 * 
 * Contexto responsável por gerenciar todo o fluxo de checkout,
 * desde a autenticação até o envio do pedido via WhatsApp.
 * 
 * Funcionalidades:
 * - Controle de etapas do checkout
 * - Gerenciamento de dados de entrega
 * - Seleção de forma de pagamento
 * - Geração de mensagem para WhatsApp
 * - Integração com contexto de autenticação
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';

// Criação do contexto
const CheckoutContext = createContext();

/**
 * ETAPAS DO CHECKOUT
 */
export const CHECKOUT_STEPS = {
  AUTH: 'auth',           // Verificação de autenticação
  DELIVERY: 'delivery',   // Escolha do tipo de entrega
  PAYMENT: 'payment',     // Seleção da forma de pagamento
  SUMMARY: 'summary',     // Resumo final e confirmação
  SUCCESS: 'success'      // Página de sucesso
};

/**
 * TIPOS DE ENTREGA
 */
export const DELIVERY_TYPES = {
  DELIVERY: 'delivery',   // Entrega em domicílio
  TAKEAWAY: 'takeaway'    // Retirar no local
};

/**
 * FORMAS DE PAGAMENTO
 */
export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  PIX: 'pix',
  CASH: 'cash'
};

/**
 * PROVIDER DO CONTEXTO DE CHECKOUT
 */
export const CheckoutProvider = ({ children }) => {
  // Estados do checkout
  const [currentStep, setCurrentStep] = useState(CHECKOUT_STEPS.AUTH);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Dados do checkout
  const [deliveryData, setDeliveryData] = useState({
    type: null,
    address: null,
    deliveryFee: 0,
    estimatedTime: null
  });

  const [paymentData, setPaymentData] = useState({
    method: null,
    changeFor: null // Para pagamento em dinheiro
  });

  // Hooks de contextos necessários
  const { user, isAuthenticated } = useAuth();
  const { cart, total: cartTotal, clearCart } = useCart();

  /**
   * AVANÇA PARA PRÓXIMA ETAPA
   */
  const nextStep = useCallback(() => {
    const stepOrder = Object.values(CHECKOUT_STEPS);
    const currentIndex = stepOrder.indexOf(currentStep);
    
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  }, [currentStep]);

  /**
   * VOLTA PARA ETAPA ANTERIOR
   */
  const previousStep = useCallback(() => {
    const stepOrder = Object.values(CHECKOUT_STEPS);
    const currentIndex = stepOrder.indexOf(currentStep);
    
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  }, [currentStep]);

  /**
   * INICIA O CHECKOUT
   */
  const startCheckout = useCallback(() => {
    setError(null);
    
    // Verifica se há itens no carrinho
    if (!cart || cart.length === 0) {
      setError('Carrinho vazio. Adicione itens antes de finalizar o pedido.');
      return false;
    }

    // PASSO 1: Verificação de Autenticação do Cliente
    if (isAuthenticated) {
      // Cliente já está logado, prossegue para escolha de entrega
      setCurrentStep(CHECKOUT_STEPS.DELIVERY);
    } else {
      // Cliente não está logado, vai para tela de login/cadastro
      setCurrentStep(CHECKOUT_STEPS.AUTH);
    }
    
    return true;
  }, [cart, isAuthenticated]);

  /**
   * CONFIGURA DADOS DE ENTREGA
   */
  const setDeliveryInfo = useCallback((data) => {
    setDeliveryData(prev => ({
      ...prev,
      ...data
    }));
  }, []);

  /**
   * CONFIGURA DADOS DE PAGAMENTO
   */
  const setPaymentInfo = useCallback((data) => {
    setPaymentData(prev => ({
      ...prev,
      ...data
    }));
  }, []);

  /**
   * CALCULA TOTAL FINAL DO PEDIDO
   */
  const calculateFinalTotal = useCallback(() => {
    return cartTotal + deliveryData.deliveryFee;
  }, [cartTotal, deliveryData.deliveryFee]);

  /**
   * GERA MENSAGEM FORMATADA PARA WHATSAPP
   * Formato conforme especificação do fluxo detalhado
   */
  const generateWhatsAppMessage = useCallback(() => {
    const finalTotal = calculateFinalTotal();
    const restaurantName = process.env.NEXT_PUBLIC_RESTAURANT_NAME || 'BURGUESIA';
    
    // Cabeçalho da mensagem
    let message = `*🍔 NOVO PEDIDO - ${restaurantName.toUpperCase()} 🍔*\n\n`;
    
    // Dados do cliente
    message += `*Cliente:* ${user?.name || 'Cliente'}\n`;
    message += `*Contato:* ${user?.whatsapp || user?.phone || ''}\n\n`;
    
    // Itens do pedido
    message += `*-- ITENS DO PEDIDO --*\n`;
    cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      message += `- ${item.quantity}x ${item.name} (R$ ${itemTotal.toFixed(2).replace('.', ',')})\n`;
      
      // Observações do item
      if (item.observations) {
        message += `  _Obs: ${item.observations}_\n`;
      }
    });
    message += '\n';
    
    // Dados de entrega
    message += `*-- ENTREGA --*\n`;
    if (deliveryData.type === DELIVERY_TYPES.DELIVERY) {
      message += `*Tipo:* Delivery\n`;
      message += `*Endereço:* ${deliveryData.address?.street}, ${deliveryData.address?.number}`;
      
      if (deliveryData.address?.complement) {
        message += `, ${deliveryData.address.complement}`;
      }
      
      message += `, ${deliveryData.address?.neighborhood}\n`;
      
      if (deliveryData.address?.reference) {
        message += `*Referência:* ${deliveryData.address.reference}\n`;
      }
    } else {
      message += `*Tipo:* Retirar no Local\n`;
      message += `*Tempo estimado:* ${deliveryData.estimatedTime || '30-40 minutos'}\n`;
    }
    message += '\n';
    
    // Dados de pagamento
    message += `*-- PAGAMENTO --*\n`;
    const paymentMethodNames = {
      [PAYMENT_METHODS.CREDIT_CARD]: 'Cartão de Crédito',
      [PAYMENT_METHODS.DEBIT_CARD]: 'Cartão de Débito',
      [PAYMENT_METHODS.PIX]: 'PIX',
      [PAYMENT_METHODS.CASH]: 'Dinheiro'
    };
    
    message += `*Forma:* ${paymentMethodNames[paymentData.method]}\n`;
    
    if (paymentData.method === PAYMENT_METHODS.CASH && paymentData.changeFor) {
      message += `*Troco para:* R$ ${paymentData.changeFor.toFixed(2).replace('.', ',')}\n`;
    }
    message += '\n';
    
    // Resumo financeiro
    message += `-----------------------------\n`;
    message += `*Subtotal:* R$ ${cartTotal.toFixed(2).replace('.', ',')}\n`;
    
    if (deliveryData.deliveryFee > 0) {
      message += `*Taxa de Entrega:* R$ ${deliveryData.deliveryFee.toFixed(2).replace('.', ',')}\n`;
    }
    
    message += `*TOTAL DO PEDIDO:* *R$ ${finalTotal.toFixed(2).replace('.', ',')}*`;
    
    return message;
  }, [user, cart, cartTotal, deliveryData, paymentData, calculateFinalTotal]);

  /**
   * ENVIA PEDIDO PARA WHATSAPP
   * PASSO 5: Geração da Mensagem e Redirecionamento
   */
  const sendToWhatsApp = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Gera mensagem formatada
      const message = generateWhatsAppMessage();
      
      // Codifica mensagem para URL (URL Encoder)
      const encodedMessage = encodeURIComponent(message);
      
      // Número do WhatsApp do restaurante (55 + DDD + número)
      const restaurantWhatsApp = process.env.NEXT_PUBLIC_RESTAURANT_WHATSAPP || '5511999999999';
      
      // Monta URL do WhatsApp usando a API "Click to Chat"
      const whatsappUrl = `https://wa.me/${restaurantWhatsApp}?text=${encodedMessage}`;
      
      // Abre WhatsApp em nova aba (abrirá com a mensagem já digitada)
      window.open(whatsappUrl, '_blank');
      
      // Avança para página de sucesso (PASSO 6)
      setCurrentStep(CHECKOUT_STEPS.SUCCESS);
      
      // PASSO 6: Limpa carrinho após envio (ciclo completo)
      clearCart();
      
      return true;
    } catch (err) {
      console.error('Erro ao enviar pedido:', err);
      setError('Erro ao enviar pedido. Tente novamente.');
      return false;
    } finally {
      setLoading(false);
    }
  }, [generateWhatsAppMessage, clearCart]);

  /**
   * RESETA O CHECKOUT
   */
  const resetCheckout = useCallback(() => {
    setCurrentStep(CHECKOUT_STEPS.AUTH);
    setDeliveryData({
      type: null,
      address: null,
      deliveryFee: 0,
      estimatedTime: null
    });
    setPaymentData({
      method: null,
      changeFor: null
    });
    setError(null);
    setLoading(false);
  }, []);

  /**
   * LIMPA ERROS
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Valor do contexto
  const contextValue = {
    // Estados
    currentStep,
    loading,
    error,
    deliveryData,
    paymentData,
    
    // Dados calculados
    finalTotal: calculateFinalTotal(),
    
    // Ações
    startCheckout,
    nextStep,
    previousStep,
    setDeliveryInfo,
    setPaymentInfo,
    sendToWhatsApp,
    resetCheckout,
    clearError,
    
    // Utilitários
    generateWhatsAppMessage,
    
    // Constantes
    CHECKOUT_STEPS,
    DELIVERY_TYPES,
    PAYMENT_METHODS
  };

  return (
    <CheckoutContext.Provider value={contextValue}>
      {children}
    </CheckoutContext.Provider>
  );
};

/**
 * HOOK PARA USAR O CONTEXTO DE CHECKOUT
 */
export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  
  if (!context) {
    throw new Error('useCheckout deve ser usado dentro de CheckoutProvider');
  }
  
  return context;
};

export default CheckoutContext;
