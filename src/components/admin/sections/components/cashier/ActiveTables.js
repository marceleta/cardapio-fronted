/**
 * MESAS ATIVAS - COMPONENTE MODULAR
 * 
 * Componente responsável por exibir e gerenciar mesas/comandas ativas,
 * incluindo abertura, fechamento e visualização de consumo.
 * 
 * Funcionalidades:
 * - Lista de mesas abertas
 * - Abertura de novas mesas
 * - Fechamento de mesas
 * - Visualização de consumo por mesa
 * - Estados visuais claros
 * 
 * @author Sistema Admin
 * @since 22/08/2025
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  IconButton,
  Grid,
  Alert,
  Avatar,
  Fab
} from '@mui/material';
import {
  TableRestaurant as TableIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Visibility as ViewIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon
} from '@mui/icons-material';

// ========== COMPONENTE PRINCIPAL ==========

const ActiveTables = ({ 
  tables = [], 
  onOpenTable, 
  onCloseTable,
  disabled = false,
  fullView = false 
}) => {
  const [selectedTable, setSelectedTable] = useState(null);

  /**
   * Calcula tempo de mesa aberta
   */
  const getTableDuration = (openedAt) => {
    if (!openedAt) return '';
    
    const opened = new Date(openedAt);
    const now = new Date();
    const diffMs = now - opened;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  /**
   * Gera cor baseada no número da mesa
   */
  const getTableColor = (tableNumber) => {
    const colors = ['primary', 'secondary', 'success', 'warning', 'info'];
    return colors[tableNumber % colors.length];
  };

  /**
   * Renderiza um card de mesa
   */
  const renderTableCard = (table) => (
    <Card 
      key={table.id}
      sx={{ 
        mb: 2,
        border: selectedTable?.id === table.id ? '2px solid' : '1px solid',
        borderColor: selectedTable?.id === table.id ? 'primary.main' : 'divider',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: 4,
          transform: 'translateY(-2px)'
        }
      }}
    >
      <CardContent>
        {/* Cabeçalho da Mesa */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          mb: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ 
              bgcolor: `${getTableColor(table.number)}.main`,
              width: 48,
              height: 48
            }}>
              <TableIcon />
            </Avatar>
            
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Mesa {table.number}
              </Typography>
              {table.customerName && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {table.customerName}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
          
          <Chip
            label={table.status === 'active' ? 'ATIVA' : table.status.toUpperCase()}
            color={table.status === 'active' ? 'success' : 'default'}
            size="small"
          />
        </Box>

        {/* Informações da Mesa */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            mb: 1
          }}>
            <TimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              Aberta há: {getTableDuration(table.openedAt)}
            </Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary">
            Aberta em: {new Date(table.openedAt).toLocaleString('pt-BR')}
          </Typography>
        </Box>

        {/* Vendas Associadas */}
        {table.sales && table.sales.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Vendas Associadas
            </Typography>
            {table.sales.slice(0, fullView ? undefined : 2).map((sale, index) => (
              <Box 
                key={index}
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  py: 0.5,
                  px: 1,
                  backgroundColor: 'grey.50',
                  borderRadius: 1,
                  mb: 0.5
                }}
              >
                <Typography variant="caption">
                  Venda #{sale.id}
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 500 }}>
                  R$ {sale.total?.toFixed(2) || '0,00'}
                </Typography>
              </Box>
            ))}
            
            {!fullView && table.sales.length > 2 && (
              <Typography variant="caption" color="text.secondary">
                +{table.sales.length - 2} vendas adicionais
              </Typography>
            )}
          </Box>
        )}

        {/* Total da Mesa */}
        {table.sales && table.sales.length > 0 && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            pt: 2,
            borderTop: '1px solid',
            borderColor: 'divider'
          }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              Total da Mesa:
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              R$ {table.sales.reduce((sum, sale) => sum + (sale.total || 0), 0).toFixed(2)}
            </Typography>
          </Box>
        )}
      </CardContent>

      {/* Ações */}
      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton 
            size="small" 
            onClick={() => setSelectedTable(table)}
            disabled={disabled}
          >
            <ViewIcon />
          </IconButton>
        </Box>

        <Button
          size="small"
          variant="outlined"
          color="error"
          startIcon={<CloseIcon />}
          onClick={() => onCloseTable && onCloseTable(table.id)}
          disabled={disabled}
        >
          Fechar Mesa
        </Button>
      </CardActions>
    </Card>
  );

  /**
   * Renderiza estado vazio
   */
  const renderEmptyState = () => (
    <Paper sx={{ p: 4, textAlign: 'center' }}>
      <TableIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        Nenhuma mesa ativa
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {disabled 
          ? 'Abra o caixa para gerenciar mesas'
          : 'As mesas abertas aparecerão aqui'
        }
      </Typography>
      
      {!disabled && onOpenTable && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => onOpenTable(1, '')}
          sx={{ mt: 2 }}
        >
          Abrir Mesa
        </Button>
      )}
    </Paper>
  );

  // ========== RENDER ==========

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Cabeçalho */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3
      }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          🍽️ Mesas Ativas
        </Typography>
        
        <Chip
          label={`${tables.length} ${tables.length === 1 ? 'mesa' : 'mesas'}`}
          color="primary"
          icon={<TableIcon />}
        />
      </Box>

      {/* Alerta quando caixa fechado */}
      {disabled && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Caixa fechado. Abra o caixa para gerenciar mesas.
        </Alert>
      )}

      {/* Lista de Mesas */}
      {tables.length === 0 ? (
        renderEmptyState()
      ) : (
        <Box>
          {tables.map(renderTableCard)}
          
          {/* Resumo */}
          {tables.length > 0 && (
            <Paper sx={{ p: 2, mt: 2, backgroundColor: 'secondary.50' }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center'
              }}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Total de mesas ativas:
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                  {tables.length}
                </Typography>
              </Box>
            </Paper>
          )}
        </Box>
      )}

      {/* Botão Flutuante para Nova Mesa */}
      {fullView && !disabled && onOpenTable && (
        <Fab
          color="primary"
          aria-label="Nova Mesa"
          onClick={() => onOpenTable(tables.length + 1, '')}
          sx={{
            position: 'fixed',
            bottom: 100,
            right: 100,
            zIndex: 999
          }}
        >
          <AddIcon />
        </Fab>
      )}
    </Box>
  );
};

export default ActiveTables;
