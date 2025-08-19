'use client';

import React, { useContext } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Badge,
  IconButton,
  Divider,
  Collapse,
  Fab,
} from '@mui/material';
import {
  ShoppingCart,
  ExpandLess,
  ExpandMore,
  Remove,
  Add,
} from '@mui/icons-material';
import { CartContext } from '../../context/CartContext';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

export default function SideCart() {
  const cartContext = useContext(CartContext);
  const [expanded, setExpanded] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (!cartContext) {
    return null;
  }

  if (isMobile) {
    return null;
  }
  return (
    <>
      {/* Carrinho flutuante simples sempre visível */}
      <Box
        sx={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 9999,
          display: isMobile ? 'none' : 'block',
        }}
      >
        <Fab
          color="primary"
          aria-label="carrinho"
          sx={{
            width: 60,
            height: 60,
            backgroundColor: '#ff8509',
            '&:hover': {
              backgroundColor: '#e67600',
            }
          }}
          onClick={() => setExpanded(!expanded)}
        >
          <Badge 
            badgeContent={cartContext?.getTotalItems?.() || 0} 
            color="secondary"
            sx={{
              '& .MuiBadge-badge': {
                right: -3,
                top: 3,
              },
            }}
          >
            <ShoppingCart />
          </Badge>
        </Fab>
      </Box>

      {/* Painel do carrinho */}
      {expanded && (
        <Box
          sx={{
            position: 'fixed',
            bottom: '100px',
            right: '20px',
            width: '350px',
            maxHeight: '400px',
            zIndex: 9998,
            display: isMobile ? 'none' : 'block',
          }}
        >
          <Card
            elevation={8}
            sx={{
              borderRadius: '12px',
              overflow: 'hidden',
              backgroundColor: 'white',
              border: '1px solid #e0e0e0',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            }}
          >
            {/* Header do Carrinho */}
            <Box
              sx={{
                backgroundColor: '#ff8509',
                color: 'white',
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Meu Carrinho
              </Typography>
              <IconButton 
                size="small" 
                sx={{ color: 'white' }}
                onClick={() => setExpanded(false)}
              >
                <ExpandLess />
              </IconButton>
            </Box>

            {/* Conteúdo do Carrinho */}
            <CardContent sx={{ p: 0, maxHeight: '300px', overflowY: 'auto' }}>
              {!cartContext || !cartContext.cartItems || cartContext.cartItems.length === 0 ? (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography color="text.secondary">
                    Seu carrinho está vazio
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Adicione produtos clicando neles
                  </Typography>
                </Box>
              ) : (
                <>
                  <List sx={{ py: 0 }}>
                    {cartContext.cartItems.map((item) => {
                      const itemTotal = (typeof item.price === 'number' ? item.price : parseFloat(item.price.toString().replace(',', '.'))) * item.quantity + 
                                      (item.addOns ? item.addOns.reduce((sum, ao) => sum + (typeof ao.price === 'number' ? ao.price : parseFloat(ao.price.toString().replace(',', '.'))), 0) * item.quantity : 0);
                      
                      return (
                        <React.Fragment key={item.id}>
                          <ListItem
                            sx={{
                              flexDirection: 'column',
                              alignItems: 'flex-start',
                              py: 2,
                            }}
                          >
                            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                  {item.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  R$ {typeof item.price === 'number' ? item.price.toFixed(2).replace('.', ',') : item.price} cada
                                </Typography>
                                {item.addOns && item.addOns.length > 0 && (
                                  <Typography variant="caption" color="text.secondary">
                                    + {item.addOns.map(ao => ao.name).join(', ')}
                                  </Typography>
                                )}
                                {item.observations && (
                                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontStyle: 'italic' }}>
                                    Obs: {item.observations}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                            
                            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <IconButton
                                  size="small"
                                  onClick={() => cartContext?.removeFromCart?.(item.id)}
                                  sx={{ 
                                    backgroundColor: theme.palette.grey[200],
                                    '&:hover': { backgroundColor: theme.palette.grey[300] }
                                  }}
                                >
                                  <Remove fontSize="small" />
                                </IconButton>
                                <Typography variant="body2" sx={{ minWidth: '20px', textAlign: 'center' }}>
                                  {item.quantity}
                                </Typography>
                                <IconButton
                                  size="small"
                                  onClick={() => cartContext?.addToCart?.(item)}
                                  sx={{ 
                                    backgroundColor: '#ff8509',
                                    color: 'white',
                                    '&:hover': { backgroundColor: '#e67600' }
                                  }}
                                >
                                  <Add fontSize="small" />
                                </IconButton>
                              </Box>
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                R$ {itemTotal.toFixed(2).replace('.', ',')}
                              </Typography>
                            </Box>
                          </ListItem>
                          <Divider />
                        </React.Fragment>
                      );
                    })}
                  </List>

                  {/* Footer com Total e Botão */}
                  <Box sx={{ p: 2, backgroundColor: theme.palette.grey[50] }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Total:
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ff8509' }}>
                        R$ {(cartContext?.getTotalPrice?.() ?? 0).toFixed(2).replace('.', ',')}
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => generateWhatsAppMessage(cartContext?.cartItems || [], cartContext?.getTotalPrice?.() ?? 0)}
                      sx={{
                        backgroundColor: '#25D366',
                        '&:hover': {
                          backgroundColor: '#128C7E',
                        },
                        fontWeight: 'bold',
                        py: 1.5,
                      }}
                    >
                      Finalizar Pedido
                    </Button>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Box>
      )}
    </>
  );
}

function generateWhatsAppMessage(cart, totalPrice) {
  if (!cart || cart.length === 0) return;

  let message = "🍔 *Novo Pedido* 🍔\n\n";
  
  cart.forEach((item) => {
    message += `🔸 *${item.name}*\n`;
    message += `   Quantidade: ${item.quantity}\n`;
    message += `   Preço unitário: R$ ${item.price}\n`;
    
    if (item.observations) {
      message += `   📝 Observações: ${item.observations}\n`;
    }
    
    if (item.addOns && item.addOns.length > 0) {
      message += `   🔹 Adicionais: ${item.addOns.map(ao => ao.name).join(', ')}\n`;
    }
    
    const itemTotal = (parseFloat(item.price.toString().replace(',', '.')) * item.quantity + 
                      (item.addOns ? item.addOns.reduce((sum, ao) => sum + parseFloat(ao.price.toString().replace(',', '.')), 0) * item.quantity : 0));
    message += `   💰 Subtotal: R$ ${itemTotal.toFixed(2).replace('.', ',')}\n\n`;
  });
  
  message += `🎯 *Total do Pedido: R$ ${totalPrice.toFixed(2).replace('.', ',')}*\n\n`;
  message += "Obrigado! 😊";
  
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/5511987654321?text=${encodedMessage}`;
  window.open(whatsappUrl, '_blank');
}
