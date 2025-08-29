/**
 * CONTROLES DO CAIXA - COMPONENTE MODULAR
 * 
 * Componente responsável pelos controles e ações rápidas
 * do caixa, incluindo botões de ação e movimentações.
 * 
 * Funcionalidades:
 * - Botões de ação rápida
 * - Controles de sangria e suprimento
 * - Acesso rápido a funções principais
 * - Layout responsivo
 * 
 * @author Sistema Admin
 * @since 22/08/2025
 */

import React from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Fab,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  AttachMoney as MoneyIcon,
  Receipt as ReceiptIcon,
  TableRestaurant as TableIcon,
  TrendingUp as SupplyIcon,
  TrendingDown as WithdrawIcon
} from '@mui/icons-material';

// ========== COMPONENTE PRINCIPAL ==========

const CashierControls = ({ 
  session, 
  onWithdraw, 
  onSupply, 
  onNewSale, 
  onNewTable 
}) => {
  return (
    <Paper
      elevation={4}
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        p: 2,
        borderRadius: 3,
        background: 'linear-gradient(45deg, #2c3e50 30%, #3498db 90%)',
        color: 'white',
        zIndex: 1000,
        minWidth: 280
      }}
    >
      {/* Cabeçalho dos Controles */}
      <Typography variant="h6" sx={{ 
        fontWeight: 'bold', 
        mb: 2,
        textAlign: 'center'
      }}>
        🚀 Controles Rápidos
      </Typography>

      {/* Valor Atual */}
      <Box sx={{ 
        textAlign: 'center', 
        mb: 3,
        p: 2,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 2
      }}>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          Valor em Caixa
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          R$ {session.currentAmount?.toFixed(2) || '0,00'}
        </Typography>
      </Box>

      {/* Botões de Ação Principal */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr',
        gap: 1,
        mb: 2
      }}>
        <Tooltip title="Nova Venda">
          <Button
            variant="contained"
            size="small"
            startIcon={<ReceiptIcon />}
            onClick={onNewSale}
            sx={{
              backgroundColor: 'rgba(46, 125, 50, 0.9)',
              '&:hover': {
                backgroundColor: 'rgba(46, 125, 50, 1)'
              }
            }}
          >
            Venda
          </Button>
        </Tooltip>

        <Tooltip title="Nova Mesa">
          <Button
            variant="contained"
            size="small"
            startIcon={<TableIcon />}
            onClick={onNewTable}
            sx={{
              backgroundColor: 'rgba(52, 152, 219, 0.9)',
              '&:hover': {
                backgroundColor: 'rgba(52, 152, 219, 1)'
              }
            }}
          >
            Mesa
          </Button>
        </Tooltip>
      </Box>

      {/* Movimentações */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr',
        gap: 1
      }}>
        <Tooltip title="Sangria (Retirada)">
          <Button
            variant="outlined"
            size="small"
            startIcon={<WithdrawIcon />}
            onClick={() => onWithdraw(0, 'Sangria rápida')}
            sx={{
              borderColor: 'rgba(231, 76, 60, 0.7)',
              color: 'rgba(231, 76, 60, 1)',
              '&:hover': {
                borderColor: 'rgba(231, 76, 60, 1)',
                backgroundColor: 'rgba(231, 76, 60, 0.1)'
              }
            }}
          >
            Sangria
          </Button>
        </Tooltip>

        <Tooltip title="Suprimento (Entrada)">
          <Button
            variant="outlined"
            size="small"
            startIcon={<SupplyIcon />}
            onClick={() => onSupply(0, 'Suprimento rápido')}
            sx={{
              borderColor: 'rgba(39, 174, 96, 0.7)',
              color: 'rgba(39, 174, 96, 1)',
              '&:hover': {
                borderColor: 'rgba(39, 174, 96, 1)',
                backgroundColor: 'rgba(39, 174, 96, 0.1)'
              }
            }}
          >
            Suprimento
          </Button>
        </Tooltip>
      </Box>

      {/* Indicador de Status */}
      <Box sx={{ 
        mt: 2, 
        pt: 2, 
        borderTop: '1px solid rgba(255,255,255,0.2)',
        textAlign: 'center'
      }}>
        <Typography variant="caption" sx={{ opacity: 0.7 }}>
          Caixa em operação desde {' '}
          {session.openedAt ? 
            new Date(session.openedAt).toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit'
            }) : 
            '--:--'
          }
        </Typography>
      </Box>
    </Paper>
  );
};

export default CashierControls;
