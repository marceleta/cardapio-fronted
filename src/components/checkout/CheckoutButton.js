/**
 * BOTÃO FINALIZAR PEDIDO
 * 
 * Componente que integra o checkout flow com os componentes de carrinho existentes.
 * Este botão inicia o fluxo detalhado "Do Finalizar Pedido ao Envio no WhatsApp".
 */

import React from 'react';
import { Button, Box } from '@mui/material';
import { ShoppingCart as CartIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useCart } from '../../context/CartContext';

const CheckoutButton = ({ 
  variant = 'contained',
  size = 'large',
  fullWidth = true,
  children,
  ...props 
}) => {
  const router = useRouter();
  const { cartItems, cartTotal } = useCart();

  /**
   * INICIA O FLUXO DE CHECKOUT
   */
  const handleStartCheckout = () => {
    // Verifica se há itens no carrinho
    if (!cartItems || cartItems.length === 0) {
      alert('Seu carrinho está vazio! Adicione itens antes de finalizar o pedido.');
      return;
    }

    // Redireciona para a página de checkout
    router.push('/checkout');
  };

  return (
    <Button
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      onClick={handleStartCheckout}
      startIcon={<CartIcon />}
      disabled={!cartItems || cartItems.length === 0}
      sx={{
        backgroundColor: '#25D366',
        '&:hover': {
          backgroundColor: '#1da851'
        },
        '&:disabled': {
          backgroundColor: 'grey.400',
          color: 'grey.600'
        },
        fontWeight: 'bold',
        py: 1.5,
        ...props.sx
      }}
      {...props}
    >
      {children || 'Finalizar Pedido'}
    </Button>
  );
};

export default CheckoutButton;
