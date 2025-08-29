import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as SalesIcon,
  TableRestaurant as TableIcon
} from '@mui/icons-material';

const CashierControls = ({ 
  session,
  onWithdraw,
  onSupply,
  onNewSale,
  onNewTable,
  onCloseCashier
}) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value || 0);
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        p: 2,
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        zIndex: 1000
      }}
    >
      <Grid container spacing={2} alignItems="center">
        {/* Informações do Caixa */}
        <Grid item xs={12} md={4}>
          <Box>
            <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
              💰 Saldo do Caixa
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              {formatCurrency(session?.currentBalance)}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              Aberto em: {session?.openTime ? new Date(session.openTime).toLocaleTimeString('pt-BR') : 'N/A'}
            </Typography>
          </Box>
        </Grid>

        {/* Ações Rápidas - Vendas */}
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
            <Tooltip title="Nova Venda">
              <Button
                variant="contained"
                color="secondary"
                startIcon={<SalesIcon />}
                onClick={onNewSale}
                size="large"
              >
                Nova Venda
              </Button>
            </Tooltip>

            <Tooltip title="Nova Mesa">
              <Button
                variant="outlined"
                startIcon={<TableIcon />}
                onClick={onNewTable}
                sx={{ 
                  color: 'primary.contrastText',
                  borderColor: 'primary.contrastText',
                  '&:hover': {
                    borderColor: 'secondary.main',
                    bgcolor: 'secondary.main'
                  }
                }}
              >
                Mesa
              </Button>
            </Tooltip>
          </Box>
        </Grid>

        {/* Ações de Caixa */}
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Tooltip title="Sangria - Retirar dinheiro do caixa">
              <IconButton
                color="error"
                onClick={onWithdraw}
                sx={{ 
                  bgcolor: 'error.main',
                  color: 'error.contrastText',
                  '&:hover': { bgcolor: 'error.dark' }
                }}
              >
                <RemoveIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Suprimento - Adicionar dinheiro ao caixa">
              <IconButton
                color="success"
                onClick={onSupply}
                sx={{ 
                  bgcolor: 'success.main',
                  color: 'success.contrastText',
                  '&:hover': { bgcolor: 'success.dark' }
                }}
              >
                <AddIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Fechar Caixa">
              <IconButton
                color="warning"
                onClick={onCloseCashier}
                sx={{ 
                  bgcolor: 'warning.main',
                  color: 'warning.contrastText',
                  '&:hover': { bgcolor: 'warning.dark' }
                }}
              >
                <LockIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Grid>
      </Grid>

      {/* Indicadores de Status */}
      <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Chip
          label={`${session?.totalSales || 0} vendas hoje`}
          size="small"
          variant="outlined"
          sx={{ color: 'primary.contrastText', borderColor: 'primary.contrastText' }}
        />
        
        <Chip
          label={`Total: ${formatCurrency(session?.totalRevenue)}`}
          size="small"
          variant="outlined"
          sx={{ color: 'primary.contrastText', borderColor: 'primary.contrastText' }}
        />

        {session?.totalWithdrawals > 0 && (
          <Chip
            label={`Sangrias: ${formatCurrency(session.totalWithdrawals)}`}
            size="small"
            variant="outlined"
            color="error"
            sx={{ color: 'error.light', borderColor: 'error.light' }}
          />
        )}
      </Box>
    </Paper>
  );
};

export default CashierControls;
