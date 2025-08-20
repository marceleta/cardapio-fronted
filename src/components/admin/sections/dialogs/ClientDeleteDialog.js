/**
 * @fileoverview Dialog de Confirmação de Exclusão de Cliente
 * @description Componente responsável pela confirmação de exclusão de clientes
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
  Avatar,
  Alert
} from '@mui/material';
import {
  Delete,
  Warning,
  Person
} from '@mui/icons-material';

/**
 * Componente do dialog de confirmação para exclusão de clientes
 */
const ClientDeleteDialog = ({
  open,
  onClose,
  client,
  onConfirm,
  loading = false
}) => {

  /**
   * Handler para confirmar exclusão
   */
  const handleConfirm = () => {
    if (onConfirm && client) {
      onConfirm(client.id);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
        }
      }}
    >
      <DialogTitle sx={{ 
        background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
        color: 'white',
        textAlign: 'center',
        py: 3
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <Warning fontSize="large" />
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Confirmar Exclusão
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ p: 4 }}>
        {client && (
          <Box sx={{ textAlign: 'center' }}>
            {/* Avatar e informações do cliente */}
            <Avatar sx={{ 
              bgcolor: '#e74c3c', 
              width: 60, 
              height: 60, 
              mx: 'auto', 
              mb: 2,
              opacity: 0.8
            }}>
              <Person fontSize="large" />
            </Avatar>
            
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              {client.name}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {client.whatsapp || client.phone}
            </Typography>

            {/* Alerta de confirmação */}
            <Alert severity="warning" sx={{ mb: 3, textAlign: 'left' }}>
              <Typography variant="subtitle2" gutterBottom>
                ⚠️ Esta ação não pode ser desfeita!
              </Typography>
              <Typography variant="body2">
                Ao excluir este cliente, todas as informações associadas serão 
                permanentemente removidas do sistema, incluindo:
              </Typography>
              <Box component="ul" sx={{ mt: 1, mb: 0, pl: 2 }}>
                <li>Dados pessoais e de contato</li>
                <li>Endereço de entrega</li>
                <li>Histórico de pedidos ({client.orderCount || 0} pedidos)</li>
                <li>Estatísticas de relacionamento</li>
              </Box>
            </Alert>

            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              Tem certeza que deseja excluir este cliente?
            </Typography>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{ 
        p: 3, 
        backgroundColor: '#fafafa',
        borderTop: '1px solid #e0e0e0',
        gap: 2,
        justifyContent: 'center'
      }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          size="large"
          disabled={loading}
          sx={{ 
            borderRadius: 2,
            px: 4,
            py: 1,
            borderColor: '#ddd',
            color: '#666',
            '&:hover': {
              borderColor: '#bbb',
              backgroundColor: '#f5f5f5'
            }
          }}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleConfirm} 
          variant="contained"
          size="large"
          disabled={loading}
          startIcon={loading ? null : <Delete />}
          sx={{ 
            borderRadius: 2,
            px: 4,
            py: 1,
            backgroundColor: '#e74c3c',
            fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(231, 76, 60, 0.3)',
            '&:hover': {
              backgroundColor: '#c0392b',
              boxShadow: '0 6px 20px rgba(231, 76, 60, 0.4)',
            },
            '&:disabled': {
              background: '#ddd',
              color: '#999'
            }
          }}
        >
          {loading ? 'Excluindo...' : 'Sim, Excluir Cliente'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClientDeleteDialog;
