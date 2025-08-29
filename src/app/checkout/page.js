/**
 * PÁGINA DE CHECKOUT - FINALIZAR PEDIDO
 * 
 * Página principal do fluxo de checkout que implementa o processo completo
 * "Do Finalizar Pedido ao Envio no WhatsApp" conforme especificado.
 * 
 * Fluxo implementado:
 * 1. Verificação de Autenticação do Cliente
 * 2. Escolha do Tipo de Entrega (Delivery/Retirada)
 * 3. Seleção da Forma de Pagamento
 * 4. Resumo Final e Confirmação
 * 5. Geração da Mensagem e Redirecionamento para WhatsApp
 * 6. Página de Sucesso (Pós-Redirecionamento)
 */

'use client';

import React from 'react';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { CheckoutProvider } from '../../context/CheckoutContext';
import { AuthProvider } from '../../context/AuthContext';
import { CartProvider } from '../../context/CartContext';
import { theme } from '../../lib/theme';
import CheckoutFlow from '../../components/checkout/CheckoutFlow';

/**
 * CONFIGURAÇÕES DO RESTAURANTE
 * Em produção, essas informações devem vir de variáveis de ambiente
 */
export const RESTAURANT_CONFIG = {
  name: process.env.NEXT_PUBLIC_RESTAURANT_NAME || 'BURGUESIA',
  whatsapp: process.env.NEXT_PUBLIC_RESTAURANT_WHATSAPP || '5511999998888',
  phone: process.env.NEXT_PUBLIC_RESTAURANT_PHONE || '(11) 99999-8888',
  address: {
    street: 'Rua das Flores, 123',
    neighborhood: 'Centro',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-567'
  }
};

/**
 * COMPONENTE PRINCIPAL DA PÁGINA DE CHECKOUT
 */
export default function CheckoutPage() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CartProvider>
          <CheckoutProvider>
            <Box
              sx={{
                minHeight: '100vh',
                backgroundColor: 'grey.50',
                position: 'relative'
              }}
            >
              {/* FLUXO PRINCIPAL DO CHECKOUT */}
              <CheckoutFlow />

              {/* INFORMAÇÕES DE RODAPÉ */}
              <Box
                component="footer"
                sx={{
                  py: 2,
                  px: 3,
                  backgroundColor: 'white',
                  borderTop: 1,
                  borderColor: 'grey.200',
                  textAlign: 'center',
                  position: 'sticky',
                  bottom: 0
                }}
              >
                <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                  {RESTAURANT_CONFIG.name} • {RESTAURANT_CONFIG.phone}
                </Box>
              </Box>
            </Box>
          </CheckoutProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
