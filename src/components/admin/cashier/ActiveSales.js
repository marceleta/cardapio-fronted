import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider
} from '@mui/material';
import {
  Edit as EditIcon,
  Payment as PaymentIcon,
  Delete as DeleteIcon,
  TableRestaurant as TableIcon
} from '@mui/icons-material';

const ActiveSales = ({ 
  sales = [], 
  onEditSale, 
  onProcessPayment, 
  onCancelSale 
}) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value || 0);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'primary';
      case 'pending_payment': return 'warning';
      case 'preparing': return 'info';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return 'Em Andamento';
      case 'pending_payment': return 'Aguardando Pagamento';
      case 'preparing': return 'Preparando';
      default: return 'Desconhecido';
    }
  };

  if (sales.length === 0) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: 300,
          textAlign: 'center',
          color: 'text.secondary'
        }}
      >
        <Typography variant="h6" gutterBottom>
          🛒 Nenhuma venda ativa
        </Typography>
        <Typography variant="body2">
          As vendas em andamento aparecerão aqui
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        🛒 Vendas Ativas ({sales.length})
      </Typography>

      <Grid container spacing={2}>
        {sales.map((sale) => (
          <Grid item xs={12} md={6} lg={4} key={sale.id}>
            <Card variant="outlined">
              <CardContent>
                {/* Cabeçalho da venda */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Venda #{sale.id}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(sale.timestamp).toLocaleString('pt-BR')}
                    </Typography>
                  </Box>
                  <Chip
                    label={getStatusLabel(sale.status)}
                    color={getStatusColor(sale.status)}
                    size="small"
                  />
                </Box>

                {/* Informações do cliente e mesa */}
                <Box sx={{ mb: 2 }}>
                  {sale.table && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <TableIcon fontSize="small" color="primary" />
                      <Typography variant="body2">
                        Mesa {sale.table}
                      </Typography>
                    </Box>
                  )}
                  
                  {sale.customer?.name && (
                    <Typography variant="body2" color="text.secondary">
                      Cliente: {sale.customer.name}
                    </Typography>
                  )}
                  
                  <Typography variant="body2" color="text.secondary">
                    Tipo: {sale.type === 'dine_in' ? '🍽️ Consumo no Local' : 
                           sale.type === 'takeaway' ? '🥡 Retirada' : '🚚 Delivery'}
                  </Typography>
                </Box>

                {/* Lista de itens */}
                {sale.items && sale.items.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="primary" gutterBottom>
                      Itens ({sale.items.length})
                    </Typography>
                    <List dense>
                      {sale.items.slice(0, 3).map((item, index) => (
                        <ListItem key={index} sx={{ px: 0 }}>
                          <ListItemText
                            primary={`${item.quantity}x ${item.name}`}
                            secondary={formatCurrency(item.price * item.quantity)}
                          />
                        </ListItem>
                      ))}
                      {sale.items.length > 3 && (
                        <ListItem sx={{ px: 0 }}>
                          <ListItemText
                            primary={`... e mais ${sale.items.length - 3} itens`}
                            sx={{ fontStyle: 'italic', color: 'text.secondary' }}
                          />
                        </ListItem>
                      )}
                    </List>
                  </Box>
                )}

                <Divider sx={{ my: 2 }} />

                {/* Total */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Total:
                  </Typography>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    {formatCurrency(sale.total)}
                  </Typography>
                </Box>

                {/* Ações */}
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => onEditSale && onEditSale(sale)}
                    sx={{ flex: 1 }}
                  >
                    Editar
                  </Button>
                  
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<PaymentIcon />}
                    onClick={() => onProcessPayment && onProcessPayment(sale, sale.total)}
                    sx={{ flex: 1 }}
                  >
                    Pagar
                  </Button>
                  
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => onCancelSale && onCancelSale(sale.id)}
                    title="Cancelar venda"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>

                {/* Observações */}
                {sale.observations && (
                  <Box sx={{ mt: 2, p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Obs: {sale.observations}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ActiveSales;
