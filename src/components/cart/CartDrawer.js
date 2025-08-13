'use client';

import { Drawer, Box, Typography, Button, IconButton, List, ListItem, ListItemText, Divider, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react'; // Import useState
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext'; // Import useAuth

export default function CartDrawer({ open, onClose }) {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const { addOrder } = useAuth(); // Get addOrder from useAuth
  const [customerName, setCustomerName] = useState('');
  const [customerWhatsapp, setCustomerWhatsapp] = useState('');

  const handleFinishOrder = () => {
    if (cartItems.length === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }
    if (!customerName || !customerWhatsapp) {
      alert('Por favor, preencha seu nome e WhatsApp para finalizar o pedido.');
      return;
    }

    let message = `Olá! Meu nome é ${customerName} e meu WhatsApp é ${customerWhatsapp}. Gostaria de fazer o seguinte pedido:\n\n`;

    cartItems.forEach((item) => {
      message += `- ${item.quantity}x ${item.name} (R$ ${item.price})\n`;
      if (item.observations) {
        message += `  Observações: ${item.observations}\n`;
      }
      if (item.addOns && item.addOns.length > 0) {
        item.addOns.forEach(addOn => {
          message += `  + ${addOn.name} (R$ ${addOn.price})\n`;
        });
      }
    });

    const total = getTotalPrice();
    message += `\nTotal do pedido: R$ ${total.toFixed(2).replace('.', ',')}\n\n`;
    message += `Aguardando a confirmação!`;

    // Create order object for addOrder
    const newOrder = {
      id: `ORD${Date.now()}`, // Simple unique ID
      date: new Date(),
      status: 'em produção', // Initial status
      items: cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        observations: item.observations,
        addOns: item.addOns,
      })),
      totalPrice: total,
    };

    // Replace with the restaurant's WhatsApp number
    const restaurantWhatsapp = '5511987654321'; // Example: 55 is Brazil code, 11 is DDD, then number
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${restaurantWhatsapp}&text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');
    
    // Add order to AuthContext
    addOrder(newOrder);

    clearCart();
    onClose();
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box
        sx={{
          width: { xs: '100vw', sm: 400 },
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
        role="presentation"
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <Typography variant="h5" component="div">Carrinho</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />

        {cartItems.length === 0 ? (
          <Typography sx={{ marginTop: '2rem', textAlign: 'center' }}>Seu carrinho está vazio.</Typography>
        ) : (
          <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
            {cartItems.map((item) => (
              <ListItem
                key={item.id}
                secondaryAction={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                    <IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                      <AddIcon fontSize="small" />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={() => removeFromCart(item.id)} sx={{ ml: 1 }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemText
                  primary={item.name}
                  secondary={
                    <React.Fragment>
                      <Typography component="span" variant="body2" color="text.primary">
                        R$ {(parseFloat(item.price.replace(',', '.')) * item.quantity).toFixed(2).replace('.', ',')}
                      </Typography>
                      {item.observations && (
                        <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block' }}>
                          Obs: {item.observations}
                        </Typography>
                      )}
                      {item.addOns && item.addOns.length > 0 && (
                        <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block' }}>
                          Adicionais: {item.addOns.map(ao => ao.name).join(', ')}
                        </Typography>
                      )}
                    </React.Fragment>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <Typography variant="h6">Total:</Typography>
          <Typography variant="h6">R$ {getTotalPrice().toFixed(2).replace('.', ',')}</Typography>
        </Box>

        <TextField
          label="Seu Nome"
          variant="outlined"
          fullWidth
          margin="normal"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
        <TextField
          label="Seu WhatsApp (com DDD)"
          variant="outlined"
          fullWidth
          margin="normal"
          value={customerWhatsapp}
          onChange={(e) => setCustomerWhatsapp(e.target.value)}
        />

        <Button variant="contained" color="primary" fullWidth sx={{ marginBottom: '0.5rem' }} onClick={handleFinishOrder}>
          Finalizar Pedido
        </Button>
        <Button variant="outlined" color="secondary" fullWidth onClick={clearCart}>
          Limpar Carrinho
        </Button>
      </Box>
    </Drawer>
  );
}
