'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

export default function OrdersDialog({ open, onClose }) {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Sort orders by date, most recent first
  const sortedOrders = user?.orders ? [...user.orders].sort((a, b) => b.date.getTime() - a.date.getTime()) : [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'em produção':
        return 'warning.main';
      case 'a caminho':
        return 'info.main';
      case 'entregue':
        return 'success.main';
      default:
        return 'text.primary';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullScreen={isMobile} maxWidth="md" fullWidth>
      <DialogTitle>
        Meus Pedidos
        <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {!user ? (
          <Typography variant="body1" textAlign="center" sx={{ mt: 2 }}>
            Faça login para ver seus pedidos.
          </Typography>
        ) : sortedOrders.length === 0 ? (
          <Typography variant="body1" textAlign="center" sx={{ mt: 2 }}>
            Você ainda não fez nenhum pedido.
          </Typography>
        ) : (
          <List>
            {sortedOrders.map((order) => (
              <React.Fragment key={order.id}>
                <ListItem alignItems="flex-start">
                  <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color={getStatusColor(order.status)} fontWeight="bold">
                        {order.status.toUpperCase()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {order.date.toLocaleString()}
                      </Typography>
                    </Box>
                    <ListItemText
                      primary={`Pedido #${order.id}`}
                      secondary={
                        <React.Fragment>
                          <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            Itens:
                          </Typography>
                          {order.items.map((item, index) => (
                            <span key={index}>
                              {item.quantity}x {item.name} (R$ {item.price})
                              {item.observations && ` - Obs: ${item.observations}`}
                              {item.addOns && item.addOns.length > 0 && ` - Adicionais: ${item.addOns.map(ao => ao.name).join(', ')}`}
                              {index < order.items.length - 1 ? '; ' : ''}
                            </span>
                          ))}
                          <Typography variant="body1" fontWeight="bold" sx={{ mt: 1 }}>
                            Total: R$ {order.totalPrice.toFixed(2).replace('.', ',')}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </Box>
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
}
