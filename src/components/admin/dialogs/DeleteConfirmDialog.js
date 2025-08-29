/**
 * DIÁLOGO DE CONFIRMAÇÃO DE EXCLUSÃO
 * 
 * Modal reutilizável para confirmação de exclusão de itens.
 * Inclui alertas visuais e prevenção de ações acidentais.
 * 
 * Funcionalidades:
 * - Interface clara de confirmação
 * - Alertas de segurança
 * - Mensagem personalizável
 * - Estados de loading
 * - Prevenção de cliques acidentais
 */

'use client';

import React from 'react';

// Importações do Material-UI
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';

// Importações de ícones
import {
  Warning,
  Delete,
  Close
} from '@mui/icons-material';

/**
 * COMPONENTE PRINCIPAL DO DIÁLOGO
 */
const DeleteConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = 'Confirmar Exclusão',
  message = 'Tem certeza que deseja excluir este item?',
  warningMessage = 'Esta ação não pode ser desfeita.',
  confirmText = 'Excluir',
  cancelText = 'Cancelar',
  loading = false
}) => {
  /**
   * MANIPULADOR DE CONFIRMAÇÃO
   */
  const handleConfirm = async () => {
    if (loading) return;
    await onConfirm();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      {/* CABEÇALHO */}
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Warning color="warning" sx={{ fontSize: 32 }} />
          <Typography variant="h6" color="warning.main">
            {title}
          </Typography>
        </Box>
      </DialogTitle>

      {/* CONTEÚDO */}
      <DialogContent>
        {/* Alerta de aviso */}
        <Alert severity="warning" sx={{ mb: 2 }}>
          {warningMessage}
        </Alert>

        {/* Mensagem principal */}
        <Typography variant="body1" sx={{ mb: 2 }}>
          {message}
        </Typography>

        {/* Instruções adicionais */}
        <Typography variant="body2" color="text.secondary">
          Esta operação é irreversível. Certifique-se de que realmente deseja prosseguir.
        </Typography>
      </DialogContent>

      {/* AÇÕES */}
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          startIcon={<Close />}
          disabled={loading}
          variant="outlined"
        >
          {cancelText}
        </Button>
        <Button
          onClick={handleConfirm}
          color="error"
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} /> : <Delete />}
          disabled={loading}
        >
          {loading ? 'Excluindo...' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmDialog;
