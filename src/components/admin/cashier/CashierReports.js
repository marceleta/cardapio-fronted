import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as MoneyIcon,
  Receipt as ReceiptIcon,
  Assessment as AssessmentIcon,
  Print as PrintIcon
} from '@mui/icons-material';

const CashierReports = ({ 
  session,
  salesHistory = [],
  cashMovements = [] 
}) => {
  const [reportPeriod, setReportPeriod] = useState('today');

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value || 0);
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  // Filtrar dados por período
  const filterByPeriod = (data, period) => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return data.filter(item => {
      const itemDate = new Date(item.timestamp);
      
      switch (period) {
        case 'today':
          return itemDate >= startOfDay;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return itemDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return itemDate >= monthAgo;
        default:
          return true;
      }
    });
  };

  const filteredSales = filterByPeriod(salesHistory, reportPeriod);
  const filteredMovements = filterByPeriod(cashMovements, reportPeriod);

  // Calcular métricas
  const completedSales = filteredSales.filter(sale => sale.status === 'completed');
  const totalRevenue = completedSales.reduce((sum, sale) => sum + (sale.total || 0), 0);
  const totalSales = completedSales.length;
  const averageTicket = totalSales > 0 ? totalRevenue / totalSales : 0;
  
  const withdrawals = filteredMovements.filter(mov => mov.type === 'withdrawal');
  const supplies = filteredMovements.filter(mov => mov.type === 'supply');
  const totalWithdrawals = withdrawals.reduce((sum, mov) => sum + (mov.amount || 0), 0);
  const totalSupplies = supplies.reduce((sum, mov) => sum + (mov.amount || 0), 0);

  // Vendas por método de pagamento
  const paymentMethods = {};
  completedSales.forEach(sale => {
    if (sale.payment?.method) {
      const method = sale.payment.method;
      paymentMethods[method] = (paymentMethods[method] || 0) + sale.total;
    }
  });

  const getPeriodLabel = (period) => {
    switch (period) {
      case 'today': return 'Hoje';
      case 'week': return 'Última Semana';
      case 'month': return 'Último Mês';
      default: return 'Todos';
    }
  };

  const getPaymentMethodLabel = (method) => {
    switch (method) {
      case 'cash': return 'Dinheiro';
      case 'card': return 'Cartão';
      case 'pix': return 'PIX';
      case 'voucher': return 'Vale';
      default: return method;
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          📊 Relatórios e Analytics
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Período</InputLabel>
            <Select
              value={reportPeriod}
              onChange={(e) => setReportPeriod(e.target.value)}
              label="Período"
            >
              <MenuItem value="today">Hoje</MenuItem>
              <MenuItem value="week">Última Semana</MenuItem>
              <MenuItem value="month">Último Mês</MenuItem>
            </Select>
          </FormControl>
          
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={() => window.print()}
          >
            Imprimir
          </Button>
        </Box>
      </Box>

      {/* Cards de Métricas Principais */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <MoneyIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="primary" fontWeight="bold">
                {formatCurrency(totalRevenue)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Receita Total
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {getPeriodLabel(reportPeriod)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <ReceiptIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="success.main" fontWeight="bold">
                {totalSales}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total de Vendas
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Finalizadas com sucesso
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUpIcon color="info" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="info.main" fontWeight="bold">
                {formatCurrency(averageTicket)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ticket Médio
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Por venda finalizada
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <AssessmentIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" color="warning.main" fontWeight="bold">
                {formatCurrency(session?.currentBalance)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Saldo do Caixa
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Atual disponível
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Métodos de Pagamento */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                💳 Métodos de Pagamento
              </Typography>
              
              {Object.keys(paymentMethods).length > 0 ? (
                <Box>
                  {Object.entries(paymentMethods).map(([method, amount]) => (
                    <Box key={method} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="body1">
                        {getPaymentMethodLabel(method)}
                      </Typography>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body1" fontWeight="bold">
                          {formatCurrency(amount)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {((amount / totalRevenue) * 100).toFixed(1)}%
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                  Nenhuma venda registrada no período
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Movimentações de Caixa */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                💰 Movimentações de Caixa
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                    <TrendingUpIcon color="success" />
                    <Typography variant="subtitle2" color="success.dark">
                      Suprimentos
                    </Typography>
                    <Typography variant="h6" color="success.dark" fontWeight="bold">
                      {formatCurrency(totalSupplies)}
                    </Typography>
                    <Typography variant="caption">
                      {supplies.length} movimentações
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
                    <TrendingDownIcon color="error" />
                    <Typography variant="subtitle2" color="error.dark">
                      Sangrias
                    </Typography>
                    <Typography variant="h6" color="error.dark" fontWeight="bold">
                      {formatCurrency(totalWithdrawals)}
                    </Typography>
                    <Typography variant="caption">
                      {withdrawals.length} movimentações
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Últimas Movimentações */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📋 Últimas Movimentações
              </Typography>
              
              {filteredMovements.length > 0 ? (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Data/Hora</TableCell>
                        <TableCell>Tipo</TableCell>
                        <TableCell>Descrição</TableCell>
                        <TableCell align="right">Valor</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredMovements.slice(0, 10).map((movement, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Typography variant="body2">
                              {formatDateTime(movement.timestamp)}
                            </Typography>
                          </TableCell>
                          
                          <TableCell>
                            <Chip
                              label={movement.type === 'withdrawal' ? 'Sangria' : 'Suprimento'}
                              color={movement.type === 'withdrawal' ? 'error' : 'success'}
                              size="small"
                            />
                          </TableCell>
                          
                          <TableCell>
                            <Typography variant="body2">
                              {movement.description}
                            </Typography>
                          </TableCell>
                          
                          <TableCell align="right">
                            <Typography 
                              variant="body2" 
                              fontWeight="bold"
                              color={movement.type === 'withdrawal' ? 'error.main' : 'success.main'}
                            >
                              {movement.type === 'withdrawal' ? '-' : '+'}{formatCurrency(movement.amount)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                  Nenhuma movimentação registrada no período
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CashierReports;
