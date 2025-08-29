/**
 * CABEÇALHO DO CAIXA - COMPONENTE MODULAR
 * 
 * Componente responsável por exibir informações do cabeçalho
 * da seção do caixa, incluindo status, operador e controles básicos.
 * 
 * Funcionalidades:
 * - Exibição do status do caixa
 * - Informações do operador
 * - Botões de ação principais
 * - Indicadores visuais
 * 
 * @author Sistema Admin
 * @since 22/08/2025
 */

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Avatar
} from '@mui/material';
import {
  PointOfSale as CaixaIcon,
  PlayArrow as OpenIcon,
  Stop as CloseIcon,
  Person as PersonIcon
} from '@mui/icons-material';

// ========== COMPONENTE PRINCIPAL ==========

const CashierHeader = ({ 
  session, 
  isOpen, 
  onOpenCashier, 
  onCloseCashier 
}) => {
  /**
   * Formata tempo de operação
   */
  const formatOperationTime = () => {
    if (!session.openedAt) return '';
    
    const opened = new Date(session.openedAt);
    const now = new Date();
    const diffMs = now - opened;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 2
      }}>
        {/* Informações Principais */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ 
            bgcolor: isOpen ? 'success.main' : 'grey.400',
            width: 48,
            height: 48
          }}>
            <CaixaIcon />
          </Avatar>
          
          <Box>
            <Typography variant="h4" component="h1" sx={{ 
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              Sistema de Caixa
              <Chip
                label={isOpen ? 'ABERTO' : 'FECHADO'}
                color={isOpen ? 'success' : 'default'}
                size="small"
                sx={{ fontWeight: 'bold' }}
              />
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              mt: 1
            }}>
              {/* Operador */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {session.operator || 'Sistema'}
                </Typography>
              </Box>
              
              {/* Tempo de operação */}
              {isOpen && (
                <Typography variant="body2" color="text.secondary">
                  Em operação há: {formatOperationTime()}
                </Typography>
              )}
              
              {/* Valor inicial */}
              {isOpen && (
                <Typography variant="body2" color="text.secondary">
                  Valor inicial: R$ {session.openingAmount?.toFixed(2) || '0,00'}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        {/* Controles */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          {!isOpen ? (
            <Button
              variant="contained"
              size="large"
              startIcon={<OpenIcon />}
              onClick={onOpenCashier}
              sx={{
                background: 'linear-gradient(45deg, #27ae60 30%, #2ecc71 90%)',
                fontWeight: 'bold',
                px: 3
              }}
            >
              Abrir Caixa
            </Button>
          ) : (
            <Button
              variant="outlined"
              size="large"
              startIcon={<CloseIcon />}
              onClick={onCloseCashier}
              color="error"
              sx={{
                fontWeight: 'bold',
                px: 3
              }}
            >
              Fechar Caixa
            </Button>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default CashierHeader;
