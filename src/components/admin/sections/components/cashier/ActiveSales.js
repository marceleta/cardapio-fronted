/**
 * VENDAS ATIVAS - COMPONENTE MODULAR
 * 
 * Componente responsável por exibir e gerenciar vendas ativas,
 * incluindo edição, processamento de pagamentos e cancelamentos.
 * 
 * Funcionalidades:
 * - Lista de vendas pendentes
 * - Edição de vendas
 * - Processamento de pagamentos
 * - Cancelamento de vendas
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
  Divider,
  Alert
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  Payment as PaymentIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';

// ========== COMPONENTE PRINCIPAL ==========

const ActiveSales = ({ 
  sales = [], 
  onUpdateSale, 
  onProcessPayment, 
  onCancelSale,
  disabled = false,
  fullView = false 
}) => {
  const [selectedSale, setSelectedSale] = useState(null);

  /**
   * Formata valor monetário
   */
  const formatCurrency = (value) => {
    return `R$ ${value?.toFixed(2) || '0,00'}`;
  };

  /**
   * Calcula total de itens
   */
  const getTotalItems = (items) => {
    return items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  };

  /**
   * Renderiza um card de venda
   */
  const renderSaleCard = (sale) => (
    <Card 
      key={sale.id}
      sx={{ 
        mb: 2,
        border: selectedSale?.id === sale.id ? '2px solid' : '1px solid',
        borderColor: selectedSale?.id === sale.id ? 'primary.main' : 'divider',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: 4,
          transform: 'translateY(-2px)'
        }
      }}
    >
      <CardContent>
        {/* Cabeçalho da Venda */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          mb: 2
        }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Venda #{sale.id}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {sale.customerName || 'Cliente não informado'}
            </Typography>
            {sale.tableNumber && (
              <Chip 
                label={`Mesa ${sale.tableNumber}`}
                size="small"
                color="primary"
                sx={{ mt: 0.5 }}
              />
            )}
          </Box>
          
          <Box sx={{ textAlign: 'right' }}>
            <Chip
              label={sale.status === 'pending' ? 'PENDENTE' : sale.status.toUpperCase()}
              color={sale.status === 'pending' ? 'warning' : 'default'}
              size="small"
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {new Date(sale.createdAt).toLocaleTimeString('pt-BR')}
            </Typography>
          </Box>
        </Box>

        {/* Itens da Venda */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Itens ({getTotalItems(sale.items)})
          </Typography>
          {sale.items?.slice(0, fullView ? undefined : 3).map((item, index) => (
            <Box 
              key={index}
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                py: 0.5,
                borderBottom: index < sale.items.length - 1 ? '1px solid' : 'none',
                borderColor: 'divider'
              }}
            >
              <Typography variant="body2">
                {item.quantity}x {item.name}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {formatCurrency(item.quantity * item.price)}
              </Typography>
            </Box>
          ))}
          
          {!fullView && sale.items?.length > 3 && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              +{sale.items.length - 3} itens adicionais
            </Typography>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Totais */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Subtotal:</Typography>
            <Typography variant="body2">{formatCurrency(sale.subtotal)}</Typography>
          </Box>
          
          {sale.discount > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="error">Desconto:</Typography>
              <Typography variant="body2" color="error">
                -{formatCurrency(sale.discount)}
              </Typography>
            </Box>
          )}
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            pt: 1,
            borderTop: '2px solid',
            borderColor: 'primary.main'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Total:</Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              {formatCurrency(sale.total)}
            </Typography>
          </Box>
        </Box>

        {/* Observações */}
        {sale.observations && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Obs: {sale.observations}
            </Typography>
          </Box>
        )}
      </CardContent>

      {/* Ações */}
      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton 
            size="small" 
            onClick={() => setSelectedSale(sale)}
            disabled={disabled}
          >
            <ViewIcon />
          </IconButton>
          
          <IconButton 
            size="small" 
            onClick={() => onUpdateSale && onUpdateSale(sale.id, {})}
            disabled={disabled}
          >
            <EditIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            size="small"
            variant="contained"
            startIcon={<PaymentIcon />}
            onClick={() => onProcessPayment && onProcessPayment(sale.id, [])}
            disabled={disabled}
            sx={{
              background: 'linear-gradient(45deg, #27ae60 30%, #2ecc71 90%)',
            }}
          >
            Pagar
          </Button>
          
          <Button
            size="small"
            variant="outlined"
            color="error"
            startIcon={<CancelIcon />}
            onClick={() => onCancelSale && onCancelSale(sale.id, 'Cancelado pelo operador')}
            disabled={disabled}
          >
            Cancelar
          </Button>
        </Box>
      </CardActions>
    </Card>
  );

  /**
   * Renderiza estado vazio
   */
  const renderEmptyState = () => (
    <Paper sx={{ p: 4, textAlign: 'center' }}>
      <ReceiptIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        Nenhuma venda ativa
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {disabled 
          ? 'Abra o caixa para iniciar vendas'
          : 'As vendas ativas aparecerão aqui'
        }
      </Typography>
    </Paper>
  );

  // ========== RENDER ==========

  return (
    <Box>
      {/* Cabeçalho */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3
      }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          🧾 Vendas Ativas
        </Typography>
        
        <Chip
          label={`${sales.length} ${sales.length === 1 ? 'venda' : 'vendas'}`}
          color="primary"
          icon={<ReceiptIcon />}
        />
      </Box>

      {/* Alerta quando caixa fechado */}
      {disabled && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Caixa fechado. Abra o caixa para gerenciar vendas.
        </Alert>
      )}

      {/* Lista de Vendas */}
      {sales.length === 0 ? (
        renderEmptyState()
      ) : (
        <Box>
          {sales.map(renderSaleCard)}
          
          {/* Resumo */}
          {sales.length > 0 && (
            <Paper sx={{ p: 2, mt: 2, backgroundColor: 'primary.50' }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center'
              }}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Total em vendas pendentes:
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  {formatCurrency(sales.reduce((sum, sale) => sum + sale.total, 0))}
                </Typography>
              </Box>
            </Paper>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ActiveSales;
