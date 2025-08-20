/**
 * @fileoverview Dialog de Visualização de Cliente
 * @description Componente responsável pela exibição detalhada dos dados de um cliente
 * @author Sistema de Gestão de Cardápio
 * @version 1.0.0 - Modularização do ClientsSection
 */

'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Avatar,
  Chip
} from '@mui/material';
import {
  Edit,
  Person
} from '@mui/icons-material';

/**
 * Componente do dialog de visualização detalhada de um cliente
 */
const ClientViewDialog = ({
  open,
  onClose,
  client,
  onEdit
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

  /**
   * Handler para editar cliente
   */
  const handleEdit = () => {
    if (onEdit && client) {
      onClose();
      onEdit(client);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        👁️ Detalhes do Cliente
      </DialogTitle>
      <DialogContent>
        {client && (
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              {/* Header com avatar e informações principais */}
              <Grid size={12} sx={{ textAlign: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#667eea', width: 60, height: 60, mx: 'auto', mb: 1 }}>
                  <Person fontSize="large" />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {client.name}
                </Typography>
                <Chip 
                  label={getStatusLabel(client.status)} 
                  size="small" 
                  color={getStatusColor(client.status)}
                  variant="outlined"
                />
              </Grid>

              {/* Informações de Contato */}
              <Grid size={12}>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  📞 Informações de Contato
                </Typography>
                <Typography variant="body2">
                  <strong>WhatsApp:</strong> {client.whatsapp || client.phone}
                </Typography>
              </Grid>

              {/* Endereço Completo */}
              <Grid size={12}>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  📍 Endereço Completo
                </Typography>
                <Typography variant="body2">
                  <strong>Rua:</strong> {client.street || 'Não informado'}
                  {client.number && `, ${client.number}`}
                </Typography>
                <Typography variant="body2">
                  <strong>Bairro:</strong> {client.neighborhood || 'Não informado'}
                </Typography>
                <Typography variant="body2">
                  <strong>Cidade:</strong> {client.city || 'Não informada'}
                </Typography>
                <Typography variant="body2">
                  <strong>CEP:</strong> {client.zipCode || 'Não informado'}
                </Typography>
                {client.reference && (
                  <Typography variant="body2">
                    <strong>Referência:</strong> {client.reference}
                  </Typography>
                )}
                {client.address && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    <em>Endereço original: {client.address}</em>
                  </Typography>
                )}
              </Grid>

              {/* Estatísticas */}
              <Grid size={12}>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  📊 Estatísticas
                </Typography>
                <Typography variant="body2">
                  <strong>Total de pedidos:</strong> {client.orderCount || 0}
                </Typography>
                <Typography variant="body2">
                  <strong>Cliente desde:</strong> {new Date(client.createdAt).toLocaleDateString('pt-BR')}
                </Typography>
                {client.lastOrder && (
                  <Typography variant="body2">
                    <strong>Último pedido:</strong> {new Date(client.lastOrder).toLocaleDateString('pt-BR')}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Fechar
        </Button>
        <Button 
          onClick={handleEdit} 
          variant="contained"
          startIcon={<Edit />}
        >
          Editar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClientViewDialog;
