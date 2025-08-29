import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton
} from '@mui/material';
import {
  TableRestaurant as TableIcon,
  Person as PersonIcon,
  Close as CloseIcon,
  Add as AddIcon
} from '@mui/icons-material';

const ActiveTables = ({ 
  tables = [], 
  onOpenTable, 
  onCloseTable, 
  onAddItemToTable 
}) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value || 0);
  };

  const getTableStatus = (table) => {
    if (!table.isOccupied) return { color: 'success', label: 'Livre' };
    if (table.hasOrders) return { color: 'warning', label: 'Com Pedidos' };
    return { color: 'error', label: 'Ocupada' };
  };

  const occupiedTables = tables.filter(table => table.isOccupied);
  const availableTables = tables.filter(table => !table.isOccupied);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        🪑 Controle de Mesas
      </Typography>

      {/* Resumo das mesas */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card variant="outlined">
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {availableTables.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Mesas Livres
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card variant="outlined">
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                {occupiedTables.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Mesas Ocupadas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card variant="outlined">
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary.main">
                {tables.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total de Mesas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Mesas Ocupadas */}
      {occupiedTables.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" color="primary" gutterBottom>
            🔴 Mesas Ocupadas ({occupiedTables.length})
          </Typography>
          
          <Grid container spacing={2}>
            {occupiedTables.map((table) => {
              const status = getTableStatus(table);
              return (
                <Grid item xs={12} sm={6} md={4} key={table.id}>
                  <Card variant="outlined" sx={{ bgcolor: 'warning.light', color: 'warning.contrastText' }}>
                    <CardContent>
                      {/* Cabeçalho da mesa */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TableIcon />
                          <Typography variant="h6" fontWeight="bold">
                            Mesa {table.number}
                          </Typography>
                        </Box>
                        <Chip
                          label={status.label}
                          color={status.color}
                          size="small"
                        />
                      </Box>

                      {/* Informações da mesa */}
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <PersonIcon fontSize="small" />
                          Capacidade: {table.capacity} pessoas
                        </Typography>
                        
                        {table.customer && (
                          <Typography variant="body2">
                            Cliente: {table.customer}
                          </Typography>
                        )}
                        
                        {table.startTime && (
                          <Typography variant="body2" color="text.secondary">
                            Início: {new Date(table.startTime).toLocaleTimeString('pt-BR')}
                          </Typography>
                        )}

                        {table.orders && table.orders.length > 0 && (
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="caption" color="primary">
                              {table.orders.length} pedido(s) - Total: {formatCurrency(table.total)}
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      {/* Pedidos da mesa */}
                      {table.orders && table.orders.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="caption" color="primary" gutterBottom>
                            Pedidos:
                          </Typography>
                          <List dense>
                            {table.orders.slice(0, 2).map((order, index) => (
                              <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                                <ListItemText
                                  primary={order.description || `Pedido #${order.id}`}
                                  secondary={formatCurrency(order.total)}
                                  primaryTypographyProps={{ variant: 'caption' }}
                                  secondaryTypographyProps={{ variant: 'caption' }}
                                />
                              </ListItem>
                            ))}
                            {table.orders.length > 2 && (
                              <Typography variant="caption" color="text.secondary">
                                ... e mais {table.orders.length - 2} pedidos
                              </Typography>
                            )}
                          </List>
                        </Box>
                      )}

                      {/* Ações */}
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<AddIcon />}
                          onClick={() => onAddItemToTable && onAddItemToTable(table)}
                          sx={{ flex: 1 }}
                        >
                          Adicionar
                        </Button>
                        
                        <Button
                          size="small"
                          variant="contained"
                          color="error"
                          startIcon={<CloseIcon />}
                          onClick={() => onCloseTable && onCloseTable(table.id)}
                        >
                          Fechar
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}

      {/* Mesas Livres */}
      {availableTables.length > 0 && (
        <Box>
          <Typography variant="subtitle1" color="primary" gutterBottom>
            🟢 Mesas Disponíveis ({availableTables.length})
          </Typography>
          
          <Grid container spacing={2}>
            {availableTables.map((table) => (
              <Grid item xs={6} sm={4} md={3} key={table.id}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    bgcolor: 'success.light', 
                    color: 'success.contrastText',
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'success.main',
                      transform: 'translateY(-2px)',
                      transition: 'all 0.2s'
                    }
                  }}
                  onClick={() => onOpenTable && onOpenTable(table)}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <TableIcon sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h6" fontWeight="bold">
                      Mesa {table.number}
                    </Typography>
                    <Typography variant="caption">
                      {table.capacity} lugares
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        fullWidth
                      >
                        Ocupar Mesa
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Estado vazio */}
      {tables.length === 0 && (
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
            🪑 Nenhuma mesa cadastrada
          </Typography>
          <Typography variant="body2">
            Configure as mesas do estabelecimento para controlar a ocupação
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ActiveTables;
