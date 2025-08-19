'use client';

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Menu,
  MenuItem as MenuOption
} from '@mui/material';
import {
  Add,
  Search,
  Visibility,
  MoreVert
} from '@mui/icons-material';
import { filterOrders, getStatusLabel } from '../../../utils/adminHelpers';

const OrdersSection = ({ 
  orders, 
  searchTerm, 
  setSearchTerm, 
  filterStatus, 
  setFilterStatus,
  onAddOrder,
  onViewOrder,
  onStatusChange
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedOrderId, setSelectedOrderId] = React.useState(null);

  const filteredOrders = filterOrders(orders, searchTerm, filterStatus);

  const handleMenuClick = (event, orderId) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrderId(orderId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedOrderId(null);
  };

  const handleStatusChangeClick = (status) => {
    if (selectedOrderId) {
      onStatusChange(selectedOrderId, status);
    }
    handleMenuClose();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
          🛒 Gerenciar Pedidos
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            placeholder="Buscar pedidos..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 200 }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="pending">Pendente</MenuItem>
              <MenuItem value="preparing">Preparando</MenuItem>
              <MenuItem value="completed">Concluído</MenuItem>
              <MenuItem value="cancelled">Cancelado</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={onAddOrder}
            sx={{ 
              background: 'linear-gradient(45deg, #27ae60 30%, #2ecc71 90%)',
              color: 'white',
              fontWeight: 'bold',
              boxShadow: '0 3px 10px rgba(39, 174, 96, 0.3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #229954 30%, #27ae60 90%)',
              }
            }}
          >
            Novo Pedido
          </Button>
        </Box>
      </Box>

      <Paper sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: '#f8f9fa' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>#</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Cliente</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Telefone</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Horário</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order) => {
                const status = getStatusLabel(order.status);
                return (
                  <TableRow key={order.id} hover>
                    <TableCell sx={{ fontWeight: 'bold' }}>#{order.id}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{order.phone}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#27ae60' }}>
                      R$ {order.total.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={status.label} 
                        color={status.color} 
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </TableCell>
                    <TableCell>{order.createdAt}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton 
                          size="small" 
                          onClick={() => onViewOrder(order)}
                          sx={{ color: '#3498db' }}
                        >
                          <Visibility />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={(e) => handleMenuClick(e, order.id)}
                          sx={{ color: '#7f8c8d' }}
                        >
                          <MoreVert />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {filteredOrders.length === 0 && (
        <Paper sx={{ 
          p: 4, 
          textAlign: 'center', 
          mt: 3,
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            📋 Nenhum pedido encontrado
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm || filterStatus !== 'all'
              ? 'Tente ajustar os filtros de busca' 
              : 'Quando houver pedidos, eles aparecerão aqui'
            }
          </Typography>
        </Paper>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuOption onClick={() => handleStatusChangeClick('pending')}>
          Marcar como Pendente
        </MenuOption>
        <MenuOption onClick={() => handleStatusChangeClick('preparing')}>
          Marcar como Preparando
        </MenuOption>
        <MenuOption onClick={() => handleStatusChangeClick('completed')}>
          Marcar como Concluído
        </MenuOption>
        <MenuOption onClick={() => handleStatusChangeClick('cancelled')}>
          Marcar como Cancelado
        </MenuOption>
      </Menu>
    </Box>
  );
};

export default OrdersSection;
