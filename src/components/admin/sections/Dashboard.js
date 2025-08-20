'use client';

import React from 'react';
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
  Chip,
  IconButton
} from '@mui/material';
import {
  Assignment,
  PendingActions,
  CheckCircle,
  AttachMoney,
  Visibility
} from '@mui/icons-material';
import { calculateDashboardStats, getStatusLabel } from '../../../utils/adminHelpers';

const Dashboard = ({ orders, onViewOrder }) => {
  const { totalOrders, pendingOrders, completedOrders, totalRevenue } = calculateDashboardStats(orders);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
          📊 Painel de Controle
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Bem-vindo ao painel administrativo
        </Typography>
      </Box>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            height: '120px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <CardContent sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                    {totalOrders}
                  </Typography>
                  <Typography variant="body2">
                    Total de Pedidos
                  </Typography>
                </Box>
                <Assignment sx={{ fontSize: 50, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            height: '120px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <CardContent sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                    {pendingOrders}
                  </Typography>
                  <Typography variant="body2">
                    Pedidos Pendentes
                  </Typography>
                </Box>
                <PendingActions sx={{ fontSize: 50, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            height: '120px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <CardContent sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                    {completedOrders}
                  </Typography>
                  <Typography variant="body2">
                    Pedidos Concluídos
                  </Typography>
                </Box>
                <CheckCircle sx={{ fontSize: 50, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            color: 'white',
            height: '120px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <CardContent sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                    R$ {totalRevenue.toFixed(0)}
                  </Typography>
                  <Typography variant="body2">
                    Receita Total
                  </Typography>
                </Box>
                <AttachMoney sx={{ fontSize: 50, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          📋 Pedidos Recentes
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>#</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Cliente</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Horário</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Ação</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.slice(0, 5).map((order) => {
                const status = getStatusLabel(order.status);
                return (
                  <TableRow key={order.id} hover>
                    <TableCell sx={{ fontWeight: 'bold' }}>#{order.id}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
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
                      <IconButton 
                        size="small" 
                        onClick={() => onViewOrder(order)}
                        sx={{ color: '#3498db' }}
                      >
                        <Visibility />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Dashboard;
