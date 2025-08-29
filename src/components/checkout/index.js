/**
 * ÍNDICE DOS COMPONENTES DE CHECKOUT
 * 
 * Centraliza as exportações de todos os componentes
 * relacionados ao fluxo de checkout para facilitar
 * as importações em outros arquivos.
 */

// Contexto principal do checkout
export { default as CheckoutContext, useCheckout } from './context/CheckoutContext';

// Componente principal do fluxo
export { default as CheckoutFlow } from './CheckoutFlow';

// Botão para iniciar o checkout
export { default as CheckoutButton } from './CheckoutButton';

// Componentes das etapas
export { default as AuthStep } from './steps/AuthStep';
export { default as DeliveryStep } from './steps/DeliveryStep';
export { default as PaymentStep } from './steps/PaymentStep';
export { default as SummaryStep } from './steps/SummaryStep';
export { default as SuccessStep } from './steps/SuccessStep';
