/**
 * EXEMPLO DE INTEGRAÇÃO DO CHECKOUT BUTTON
 * 
 * Este arquivo mostra como substituir os botões "Finalizar Pedido" existentes
 * pelo novo sistema de checkout implementado.
 */

import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import CheckoutButton from '../checkout/CheckoutButton';
import { useCart } from '../../context/CartContext';

/**
 * EXEMPLO 1: Carrinho Lateral (SideCart)
 */
export const SideCartExample = () => {
  const { cartItems, cartTotal } = useCart();

  return (
    <Card>
      <CardContent>
        {/* Lista de itens do carrinho */}
        {cartItems.map((item) => (
          <Box key={item.id} sx={{ mb: 1 }}>
            <Typography variant="body2">
              {item.quantity}x {item.name} - R$ {item.price}
            </Typography>
          </Box>
        ))}
        
        {/* Total */}
        <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
          Total: R$ {cartTotal.toFixed(2)}
        </Typography>
        
        {/* BOTÃO DE CHECKOUT - Substitui o botão antigo */}
        <CheckoutButton fullWidth>
          Finalizar Pedido
        </CheckoutButton>
      </CardContent>
    </Card>
  );
};

/**
 * EXEMPLO 2: Drawer do Carrinho (CartDrawer)
 */
export const CartDrawerExample = () => {
  const { cartItems, cartTotal } = useCart();

  return (
    <Box sx={{ p: 2 }}>
      {/* Lista de itens */}
      {cartItems.map((item) => (
        <Box key={item.id} sx={{ mb: 1 }}>
          <Typography variant="body2">
            {item.quantity}x {item.name} - R$ {item.price}
          </Typography>
        </Box>
      ))}
      
      {/* Total */}
      <Box sx={{ mt: 2, mb: 2, p: 2, backgroundColor: 'grey.100', borderRadius: 1 }}>
        <Typography variant="h6" align="center">
          Total: R$ {cartTotal.toFixed(2)}
        </Typography>
      </Box>
      
      {/* BOTÃO DE CHECKOUT */}
      <CheckoutButton 
        variant="contained" 
        size="large" 
        fullWidth
        sx={{ mb: 1 }}
      >
        Finalizar Pedido
      </CheckoutButton>
      
      {/* Botão limpar carrinho */}
      <CheckoutButton 
        variant="outlined" 
        color="secondary" 
        fullWidth
        onClick={() => {/* função para limpar carrinho */}}
      >
        Limpar Carrinho
      </CheckoutButton>
    </Box>
  );
};

/**
 * EXEMPLO 3: Botão Flutuante (Floating Action Button)
 */
export const FloatingCheckoutExample = () => {
  const { cartItems } = useCart();
  
  // Só mostra se há itens no carrinho
  if (!cartItems || cartItems.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 1000
      }}
    >
      <CheckoutButton
        variant="contained"
        size="medium"
        fullWidth={false}
        sx={{
          borderRadius: '50px',
          px: 3,
          boxShadow: 3
        }}
      >
        Finalizar ({cartItems.length})
      </CheckoutButton>
    </Box>
  );
};

/**
 * EXEMPLO 4: Integração Personalizada
 */
export const CustomCheckoutExample = () => {
  return (
    <Box sx={{ textAlign: 'center', p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Pronto para finalizar?
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Revise seu pedido e prossiga para o pagamento
      </Typography>
      
      <CheckoutButton
        variant="contained"
        size="large"
        sx={{
          background: 'linear-gradient(45deg, #25D366 30%, #128C7E 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #128C7E 30%, #075E54 90%)',
          },
          borderRadius: 2,
          px: 4,
          py: 2
        }}
      >
        🛒 Finalizar Pedido via WhatsApp
      </CheckoutButton>
    </Box>
  );
};

// Como usar nos arquivos existentes:
/*

// Em SideCart.js:
import CheckoutButton from '../checkout/CheckoutButton';

// Substitua:
<Button onClick={generateWhatsAppMessage}>Finalizar Pedido</Button>

// Por:
<CheckoutButton>Finalizar Pedido</CheckoutButton>

---

// Em CartDrawer.js:
import CheckoutButton from '../checkout/CheckoutButton';

// Substitua:
<Button onClick={handleFinishOrder}>Finalizar Pedido</Button>

// Por:
<CheckoutButton>Finalizar Pedido</CheckoutButton>

*/
