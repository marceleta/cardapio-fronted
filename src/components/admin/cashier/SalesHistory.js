import React, { useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  Grid,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Receipt as ReceiptIcon,
  FilterList as FilterIcon,
  Search as SearchIcon
} from '@mui/icons-material';

const SalesHistory = ({ 
  sales = [], 
  onViewSale, 
  onPrintReceipt 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('today');

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value || 0);
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed': return 'Finalizada';
      case 'cancelled': return 'Cancelada';
      case 'pending': return 'Pendente';
      default: return 'Desconhecido';
    }
  };

  // Filtrar vendas
  const filteredSales = sales.filter(sale => {
    // Filtro por texto
    const matchesSearch = !searchTerm || 
      sale.id.toString().includes(searchTerm) ||
      sale.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.table?.toString().includes(searchTerm);

    // Filtro por status
    const matchesStatus = statusFilter === 'all' || sale.status === statusFilter;

    // Filtro por data
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const saleDate = new Date(sale.timestamp);
      const today = new Date();
      
      switch (dateFilter) {
        case 'today':
          matchesDate = saleDate.toDateString() === today.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = saleDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = saleDate >= monthAgo;
          break;
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Calcular estatísticas
  const totalSales = filteredSales.length;
  const totalRevenue = filteredSales
    .filter(sale => sale.status === 'completed')
    .reduce((sum, sale) => sum + (sale.total || 0), 0);

  const averageTicket = totalSales > 0 ? totalRevenue / totalSales : 0;

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
          📋 Nenhuma venda registrada
        </Typography>
        <Typography variant="body2">
          O histórico de vendas aparecerá aqui
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        📋 Histórico de Vendas
      </Typography>

      {/* Estatísticas resumidas */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {totalSales}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total de Vendas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {formatCurrency(totalRevenue)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Receita Total
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main">
                {formatCurrency(averageTicket)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ticket Médio
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filtros */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Buscar vendas"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ID, cliente, mesa..."
              InputProps={{
                startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="completed">Finalizadas</MenuItem>
                <MenuItem value="cancelled">Canceladas</MenuItem>
                <MenuItem value="pending">Pendentes</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Período</InputLabel>
              <Select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                label="Período"
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="today">Hoje</MenuItem>
                <MenuItem value="week">Última Semana</MenuItem>
                <MenuItem value="month">Último Mês</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabela de vendas */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Data/Hora</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Mesa</TableCell>
              <TableCell>Itens</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredSales.map((sale) => (
              <TableRow key={sale.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    #{sale.id}
                  </Typography>
                </TableCell>
                
                <TableCell>
                  <Typography variant="body2">
                    {formatDateTime(sale.timestamp)}
                  </Typography>
                </TableCell>
                
                <TableCell>
                  <Typography variant="body2">
                    {sale.customer?.name || 'Não informado'}
                  </Typography>
                  {sale.customer?.phone && (
                    <Typography variant="caption" color="text.secondary" display="block">
                      {sale.customer.phone}
                    </Typography>
                  )}
                </TableCell>
                
                <TableCell>
                  {sale.table ? (
                    <Chip label={`Mesa ${sale.table}`} size="small" color="primary" />
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Balcão
                    </Typography>
                  )}
                </TableCell>
                
                <TableCell>
                  <Typography variant="body2">
                    {sale.items?.length || 0} itens
                  </Typography>
                </TableCell>
                
                <TableCell>
                  <Typography variant="body1" fontWeight="bold">
                    {formatCurrency(sale.total)}
                  </Typography>
                </TableCell>
                
                <TableCell>
                  <Chip
                    label={getStatusLabel(sale.status)}
                    color={getStatusColor(sale.status)}
                    size="small"
                  />
                </TableCell>
                
                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Ver detalhes">
                      <IconButton
                        size="small"
                        onClick={() => onViewSale && onViewSale(sale)}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    
                    {sale.status === 'completed' && (
                      <Tooltip title="Imprimir recibo">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => onPrintReceipt && onPrintReceipt(sale)}
                        >
                          <ReceiptIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredSales.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            Nenhuma venda encontrada com os filtros aplicados
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default SalesHistory;
