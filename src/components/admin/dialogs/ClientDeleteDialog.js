/**
 * DIÁLOGO DE CONFIRMAÇÃO DE EXCLUSÃO
 * 
 * Componente responsável por confirmar a exclusão de um cliente
 * com informações claras sobre a ação.
 * 
 * Funcionalidades:
 * - Confirmação segura de exclusão
 * - Exibição de informações do cliente
 * - Botões de ação claramente identificados
 * - Prevenção de exclusão acidental
 */

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
  Alert,
  IconButton
} from '@mui/material';
import {
  Close,
  Warning,
  Delete,
  Cancel,
  Person
} from '@mui/icons-material';

/**
 * COMPONENTE PRINCIPAL - ClientDeleteDialog
 * 
 * @param {Object} props - Propriedades do componente
 * @param {boolean} props.open - Estado de abertura do diálogo
 * @param {Object} props.client - Cliente a ser excluído
 * @param {boolean} props.loading - Estado de carregamento
 * @param {Function} props.onClose - Callback para fechar diálogo
 * @param {Function} props.onConfirm - Callback para confirmar exclusão
 */
const ClientDeleteDialog = ({ 
  open, 
  client, 
  loading, 
  onClose, 
  onConfirm 
}) => {
  if (!client) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 10px 40px rgba(0,0,0,0.15)'
        }
      }}
    >
      {/* CABEÇALHO DO DIÁLOGO */}
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        backgroundColor: '#ffebee',
        borderBottom: '1px solid #ffcdd2',
        color: '#d32f2f'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Warning />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Confirmar Exclusão
          </Typography>
        </Box>
        
        {/* Botão de fechar */}
        <IconButton onClick={onClose} size="small" disabled={loading}>
          <Close />
        </IconButton>
      </DialogTitle>

      {/* CONTEÚDO DO DIÁLOGO */}
      <DialogContent sx={{ p: 3 }}>
        {/* Alerta de aviso */}
        <Alert 
          severity="warning" 
          sx={{ mb: 3 }}
          icon={<Warning />}
        >
          <Typography variant="body2">
            <strong>Atenção:</strong> Esta ação não pode ser desfeita. 
            Todos os dados do cliente serão permanentemente removidos.
          </Typography>
        </Alert>

        {/* Informações do cliente */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          p: 2,
          backgroundColor: '#f8f9fa',
          borderRadius: 2,
          border: '1px solid #e9ecef'
        }}>
          {/* Avatar do cliente */}
          <Avatar sx={{ 
            width: 60, 
            height: 60, 
            bgcolor: '#dc3545'
          }}>
            <Person />
          </Avatar>

          {/* Dados do cliente */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
              {client.name}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              📱 {client.whatsapp || client.phone || 'Sem telefone'}
            </Typography>
            
            <Typography variant="body2" color="text.secondary">
              📊 {client.orderCount || 0} pedidos realizados
            </Typography>
          </Box>
        </Box>

        {/* Texto de confirmação */}
        <Typography variant="body1" sx={{ mt: 3, textAlign: 'center' }}>
          Você tem certeza que deseja excluir o cliente{' '}
          <strong>"{client.name}"</strong>?
        </Typography>

        {/* Informações adicionais sobre a exclusão */}
        {client.orderCount > 0 && (
          <Box sx={{ 
            mt: 2, 
            p: 2, 
            backgroundColor: '#fff3cd', 
            borderRadius: 2,
            border: '1px solid #ffeaa7'
          }}>
            <Typography variant="body2" color="text.secondary">
              ⚠️ Este cliente possui {client.orderCount} pedido(s) no histórico. 
              Os dados dos pedidos serão mantidos, mas a referência ao cliente será removida.
            </Typography>
          </Box>
        )}
      </DialogContent>

      {/* AÇÕES DO DIÁLOGO */}
      <DialogActions sx={{ 
        p: 3, 
        backgroundColor: '#f8f9fa',
        borderTop: '1px solid #e9ecef',
        gap: 1
      }}>
        {/* Botão cancelar */}
        <Button 
          onClick={onClose}
          startIcon={<Cancel />}
          disabled={loading}
          variant="outlined"
          sx={{ 
            color: '#6c757d',
            borderColor: '#6c757d',
            '&:hover': {
              borderColor: '#5a6268',
              backgroundColor: 'rgba(108, 117, 125, 0.04)'
            }
          }}
        >
          Cancelar
        </Button>

        {/* Botão confirmar exclusão */}
        <Button 
          onClick={onConfirm}
          startIcon={<Delete />}
          disabled={loading}
          variant="contained"
          color="error"
          sx={{
            backgroundColor: '#dc3545',
            '&:hover': {
              backgroundColor: '#c82333',
            },
            px: 3
          }}
        >
          {loading ? 'Excluindo...' : 'Sim, Excluir'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClientDeleteDialog;
