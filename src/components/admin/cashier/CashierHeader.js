import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  ShoppingCart as SalesIcon,
  AttachMoney as MoneyIcon,
  Schedule as TimeIcon
} from '@mui/icons-material';

const CashierHeader = ({ 
  session,
  isOpen,
  onOpenCashier,
  onCloseCashier 
}) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value || 0);
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const getSessionDuration = () => {
    if (!session?.openTime) return 'N/A';
    const now = new Date();
    const openTime = new Date(session.openTime);
    const diffInMinutes = Math.floor((now - openTime) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min`;
    }
    
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;
    return `${hours}h ${minutes}min`;
  };

  return (
    <Box sx={{ mb: 3 }}>
      {/* Status do Caixa */}
      <Paper 
        elevation={2} 
        sx={{ 
          p: 3, 
          mb: 3,
          bgcolor: isOpen ? 'success.light' : 'warning.light',
          borderLeft: 6,
          borderColor: isOpen ? 'success.main' : 'warning.main'
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  bgcolor: isOpen ? 'success.main' : 'warning.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}
              >
                {isOpen ? '🔓' : '🔒'}
              </Box>
              
              <Box>
                <Typography variant="h5" fontWeight="bold" color="text.primary">
                  Caixa {isOpen ? 'Aberto' : 'Fechado'}
                </Typography>
                
                {isOpen && session && (
                  <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                    <Chip
                      icon={<TimeIcon />}
                      label={`Aberto há ${getSessionDuration()}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      icon={<MoneyIcon />}
                      label={`Saldo: ${formatCurrency(session.currentBalance)}`}
                      size="small"
                      color="success"
                    />
                  </Box>
                )}
                
                {!isOpen && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Abra o caixa para iniciar as operações de venda
                  </Typography>
                )}
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            {session?.operator && (
              <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Operador:
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {session.operator}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Sessão iniciada em: {formatTime(session.openTime)}
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>

      {/* Resumo Financeiro - Apenas quando caixa estiver aberto */}
      {isOpen && session && (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                  <MoneyIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" color="primary">
                    Saldo Atual
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold" color="primary.main">
                  {formatCurrency(session.currentBalance)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Inicial: {formatCurrency(session.initialAmount)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                  <SalesIcon color="success" sx={{ mr: 1 }} />
                  <Typography variant="h6" color="success.main">
                    Vendas
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold" color="success.main">
                  {session.totalSales || 0}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatCurrency(session.totalRevenue)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                  <TrendingUpIcon color="info" sx={{ mr: 1 }} />
                  <Typography variant="h6" color="info.main">
                    Entradas
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold" color="info.main">
                  {formatCurrency((session.totalRevenue || 0) + (session.totalSupplies || 0))}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Vendas + Suprimentos
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                  <TrendingUpIcon color="warning" sx={{ mr: 1, transform: 'rotate(180deg)' }} />
                  <Typography variant="h6" color="warning.main">
                    Saídas
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight="bold" color="warning.main">
                  {formatCurrency(session.totalWithdrawals)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Sangrias realizadas
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default CashierHeader;
