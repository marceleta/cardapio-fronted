/**
 * @fileoverview Tabela de Clientes
 * @description Componente responsável pela exibição dos dados dos clientes em formato tabular
 * @author Sistema de Gestão de Cardápio
 * @version 1.0.0 - Modularização do ClientsSection
 */

'use client';

import React from 'react';
import {
  Box,
  Paper,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  IconButton,
  Tooltip,
  Typography
} from '@mui/material';
import {
  Edit,
  Delete,
  Visibility,
  Person,
  Phone,
  LocationOn
} from '@mui/icons-material';

/**
 * Componente da tabela de clientes
 * Exibe os dados dos clientes de forma organizada com ações disponíveis
 */
const ClientsTable = ({
  clients = [],
  onView,
  onEdit,
  onDelete,
  loading = false
}) => {
  
  /**
   * Obtém a cor do status baseado no valor
   */
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  /**
   * Obtém o label do status em português
   */
  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      case 'pending': return 'Pendente';
      default: return status;
    }
  };

  // Estado vazio - nenhum cliente encontrado
  if (clients.length === 0) {
    return (
      <Paper sx={{ 
        p: 4, 
        textAlign: 'center', 
        mt: 3,
        borderRadius: 2,
        backgroundColor: '#f8f9fa' 
      }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          👤 Nenhum cliente encontrado
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {loading ? 'Carregando clientes...' : 'Adicione seu primeiro cliente ou ajuste os filtros de busca.'}
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
            <TableCell sx={{ fontWeight: 'bold' }}>Cliente</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Contato</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Localização</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Pedidos</TableCell>
            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', width: 200 }}>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {clients.map((client) => (
            <TableRow 
              key={client.id}
              sx={{ 
                '&:hover': { backgroundColor: '#f8f9fa' },
                transition: 'background-color 0.2s'
              }}
            >
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: '#667eea' }}>
                    <Person />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {client.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Cliente desde {new Date(client.createdAt).toLocaleDateString('pt-BR')}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Phone fontSize="small" color="action" />
                    <Typography variant="body2">{client.whatsapp || client.phone}</Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOn fontSize="small" color="action" />
                  <Box>
                    <Typography variant="body2">
                      {client.street ? `${client.street}, ${client.number}` : client.address}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {client.neighborhood && `${client.neighborhood} - `}{client.city}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                <Chip 
                  label={getStatusLabel(client.status)} 
                  size="small" 
                  color={getStatusColor(client.status)}
                  variant="outlined"
                />
              </TableCell>
              <TableCell>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#27ae60' }}>
                  {client.orderCount || 0}
                </Typography>
                {client.lastOrder && (
                  <Typography variant="caption" color="text.secondary">
                    Último: {new Date(client.lastOrder).toLocaleDateString('pt-BR')}
                  </Typography>
                )}
              </TableCell>
              <TableCell sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                  <Tooltip title="Visualizar">
                    <IconButton
                      size="small"
                      onClick={() => onView(client)}
                      sx={{ 
                        color: '#3498db',
                        '&:hover': { backgroundColor: 'rgba(52, 152, 219, 0.1)' }
                      }}
                    >
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Editar">
                    <IconButton
                      size="small"
                      onClick={() => onEdit(client)}
                      sx={{ 
                        color: '#f39c12',
                        '&:hover': { backgroundColor: 'rgba(243, 156, 18, 0.1)' }
                      }}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Excluir">
                    <IconButton
                      size="small"
                      onClick={() => onDelete(client.id)}
                      sx={{ 
                        color: '#e74c3c',
                        '&:hover': { backgroundColor: 'rgba(231, 76, 60, 0.1)' }
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ClientsTable;
