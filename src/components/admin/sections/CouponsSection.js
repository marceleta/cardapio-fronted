/**
 * SEÇÃO DE CUPONS DE DESCONTO - PAINEL ADMINISTRATIVO
 * 
 * Componente responsável por gerenciar cupons de desconto do sistema.
 * Inclui funcionalidades completas de CRUD com validações específicas.
 * 
 * Funcionalidades:
 * - Listagem de cupons com estatísticas
 * - Sistema de busca em tempo real
 * - Criação e edição de cupons
 * - Configuração de períodos de validade
 * - Ativação para primeira compra
 * - Configuração de dias da semana ativos
 * - Controle de status ativo/inativo
 * - Validações de código único
 */

'use client';

import React from 'react';

// Importações do Material-UI - Componentes de interface
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  InputAdornment,
  Paper,
  Chip,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Alert,
  Fade,
  Skeleton,
  FormControlLabel,
  Tooltip,
  IconButton
} from '@mui/material';

// Importações do Material-UI - Ícones
import {
  Add,
  Search,
  Edit,
  Delete,
  LocalOffer,
  TrendingUp,
  CheckCircle,
  Cancel,
  CalendarToday,
  Schedule,
  People,
  Percent,
  AttachMoney,
  ContentCopy,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';

// Importações de hooks e utilitários
import { useCouponsManager } from '../../../hooks/useCouponsManager';
import CouponDialog from '../dialogs/CouponDialog';
import DeleteConfirmDialog from '../dialogs/DeleteConfirmDialog';

/**
 * UTILITÁRIOS DE FORMATAÇÃO
 */
const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('pt-BR');
};

const formatPercentage = (value) => {
  return `${value}%`;
};

const getDayName = (dayNumber) => {
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  return days[dayNumber];
};

/**
 * COMPONENTE DE CARD ESTATÍSTICO
 */
const StatCard = ({ title, value, icon, color = 'primary', subtitle }) => (
  <Card sx={{ 
    height: '100%',
    background: `linear-gradient(135deg, ${color === 'primary' ? '#1976d2' : 
                                       color === 'success' ? '#2e7d32' : 
                                       color === 'warning' ? '#ed6c02' : 
                                       color === 'error' ? '#d32f2f' : '#1976d2'}15, transparent)`,
    border: `1px solid ${color === 'primary' ? '#1976d2' : 
                        color === 'success' ? '#2e7d32' : 
                        color === 'warning' ? '#ed6c02' : 
                        color === 'error' ? '#d32f2f' : '#1976d2'}30`
  }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ 
          bgcolor: `${color}.main`,
          width: 56,
          height: 56
        }}>
          {icon}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" component="div" color={`${color}.main`}>
            {value}
          </Typography>
          <Typography variant="body1" color="text.primary" sx={{ fontWeight: 500 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

/**
 * COMPONENTE DE LINHA DA TABELA
 */
const CouponTableRow = ({ 
  coupon, 
  onEdit, 
  onDelete, 
  onToggleStatus, 
  loading 
}) => {
  // Verificar se cupom está expirado
  const isExpired = new Date(coupon.endDate) < new Date();
  
  // Calcular taxa de uso
  const usageRate = coupon.usageLimit ? 
    Math.round((coupon.currentUsage / coupon.usageLimit) * 100) : null;

  return (
    <TableRow 
      hover 
      sx={{ 
        '&:hover': { backgroundColor: 'action.hover' },
        opacity: coupon.isActive ? 1 : 0.6
      }}
    >
      {/* Código e Status */}
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ 
            bgcolor: coupon.isActive ? 'success.main' : 'grey.400',
            width: 32,
            height: 32
          }}>
            <LocalOffer fontSize="small" />
          </Avatar>
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {coupon.code}
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
              <Chip
                size="small"
                label={coupon.isActive ? 'Ativo' : 'Inativo'}
                color={coupon.isActive ? 'success' : 'default'}
                variant="outlined"
              />
              {isExpired && (
                <Chip
                  size="small"
                  label="Expirado"
                  color="error"
                  variant="outlined"
                />
              )}
              {coupon.firstPurchaseOnly && (
                <Chip
                  size="small"
                  label="1ª Compra"
                  color="info"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>
        </Box>
      </TableCell>

      {/* Descrição */}
      <TableCell>
        <Typography variant="body2" sx={{ maxWidth: 200 }}>
          {coupon.description}
        </Typography>
      </TableCell>

      {/* Desconto */}
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {coupon.type === 'percentage' ? (
            <Percent fontSize="small" color="primary" />
          ) : (
            <AttachMoney fontSize="small" color="primary" />
          )}
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {coupon.type === 'percentage' 
              ? formatPercentage(coupon.value)
              : formatCurrency(coupon.value)
            }
          </Typography>
        </Box>
        {coupon.minOrderValue > 0 && (
          <Typography variant="caption" color="text.secondary">
            Min: {formatCurrency(coupon.minOrderValue)}
          </Typography>
        )}
      </TableCell>

      {/* Período de Validade */}
      <TableCell>
        <Typography variant="body2">
          {formatDate(coupon.startDate)} até {formatDate(coupon.endDate)}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {Math.ceil((new Date(coupon.endDate) - new Date()) / (1000 * 60 * 60 * 24))} dias restantes
        </Typography>
      </TableCell>

      {/* Dias Ativos */}
      <TableCell>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {coupon.activeDays.map(day => (
            <Chip
              key={day}
              size="small"
              label={getDayName(day)}
              variant="outlined"
              color="primary"
            />
          ))}
        </Box>
      </TableCell>

      {/* Uso */}
      <TableCell>
        <Typography variant="body2">
          {coupon.currentUsage.toLocaleString()}
          {coupon.usageLimit && (
            <span style={{ color: 'text.secondary' }}>
              /{coupon.usageLimit.toLocaleString()}
            </span>
          )}
        </Typography>
        {usageRate !== null && (
          <Typography 
            variant="caption" 
            color={usageRate > 80 ? 'warning.main' : 'text.secondary'}
          >
            {usageRate}% usado
          </Typography>
        )}
      </TableCell>

      {/* Ações */}
      <TableCell>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {/* Toggle Status */}
          <Tooltip title={coupon.isActive ? 'Desativar' : 'Ativar'}>
            <IconButton
              size="small"
              onClick={() => onToggleStatus(coupon.id)}
              disabled={loading}
              color={coupon.isActive ? 'success' : 'default'}
            >
              {coupon.isActive ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </Tooltip>

          {/* Editar */}
          <Tooltip title="Editar cupom">
            <IconButton
              size="small"
              onClick={() => onEdit(coupon)}
              disabled={loading}
              color="primary"
            >
              <Edit />
            </IconButton>
          </Tooltip>

          {/* Excluir */}
          <Tooltip title="Excluir cupom">
            <IconButton
              size="small"
              onClick={() => onDelete(coupon)}
              disabled={loading}
              color="error"
            >
              <Delete />
            </IconButton>
          </Tooltip>
        </Box>
      </TableCell>
    </TableRow>
  );
};

/**
 * COMPONENTE PRINCIPAL DA SEÇÃO DE CUPONS
 */
const CouponsSection = () => {
  // Hook de gerenciamento de cupons
  const {
    coupons,
    loading,
    error,
    searchTerm,
    selectedCoupon,
    isCreateDialogOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
    statistics,
    emptyCoupon,
    handleAddCoupon,
    handleEditCoupon,
    handleDeleteCoupon,
    handleToggleStatus,
    setSearchTerm,
    openCreateDialog,
    openEditDialog,
    openDeleteDialog,
    closeAllDialogs,
    clearError
  } = useCouponsManager();

  return (
    <Box sx={{ p: 3 }}>
      {/* CABEÇALHO DA SEÇÃO */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          💳 Cupons de Desconto
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gerencie cupons promocionais, configurações de validade e controle de uso
        </Typography>
      </Box>

      {/* ALERTAS DE ERROR */}
      {error && (
        <Fade in={true}>
          <Alert 
            severity="error" 
            onClose={clearError}
            sx={{ mb: 3 }}
          >
            {error}
          </Alert>
        </Fade>
      )}

      {/* CARDS DE ESTATÍSTICAS */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total de Cupons"
            value={statistics.total}
            icon={<LocalOffer />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Cupons Ativos"
            value={statistics.active}
            icon={<CheckCircle />}
            color="success"
            subtitle={`${Math.round((statistics.active / statistics.total) * 100)}% do total`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Primeira Compra"
            value={statistics.firstPurchaseOnly}
            icon={<People />}
            color="info"
            subtitle="Cupons exclusivos"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total de Usos"
            value={statistics.totalUsage.toLocaleString()}
            icon={<TrendingUp />}
            color="warning"
            subtitle="Resgates realizados"
          />
        </Grid>
      </Grid>

      {/* CONTROLES SUPERIORES */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          alignItems: { sm: 'center' },
          justifyContent: 'space-between'
        }}>
          {/* Campo de busca */}
          <TextField
            placeholder="Buscar cupons por código ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="outlined"
            size="small"
            sx={{ 
              minWidth: { xs: '100%', sm: 300 },
              maxWidth: 400
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              )
            }}
          />
          
          {/* Botão de criar cupom */}
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={openCreateDialog}
            sx={{ minWidth: 180 }}
          >
            Novo Cupom
          </Button>
        </Box>
      </Paper>

      {/* TABELA DE CUPONS */}
      <Paper sx={{ mb: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Cupom</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Desconto</TableCell>
                <TableCell>Validade</TableCell>
                <TableCell>Dias Ativos</TableCell>
                <TableCell>Uso</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    {Array.from({ length: 7 }).map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton variant="text" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : coupons.length === 0 ? (
                // Estado vazio
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                      <LocalOffer sx={{ fontSize: 64, color: 'text.disabled' }} />
                      <Typography variant="h6" color="text.secondary">
                        {searchTerm ? 'Nenhum cupom encontrado' : 'Nenhum cupom cadastrado'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {searchTerm 
                          ? 'Tente ajustar os filtros de busca'
                          : 'Comece criando seu primeiro cupom de desconto'
                        }
                      </Typography>
                      {!searchTerm && (
                        <Button
                          variant="contained"
                          startIcon={<Add />}
                          onClick={openCreateDialog}
                          sx={{ mt: 2 }}
                        >
                          Criar Primeiro Cupom
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                // Lista de cupons
                coupons.map((coupon) => (
                  <CouponTableRow
                    key={coupon.id}
                    coupon={coupon}
                    onEdit={openEditDialog}
                    onDelete={openDeleteDialog}
                    onToggleStatus={handleToggleStatus}
                    loading={loading}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* DIÁLOGOS MODAIS */}
      
      {/* Diálogo de criação/edição */}
      <CouponDialog
        open={isCreateDialogOpen || isEditDialogOpen}
        onClose={closeAllDialogs}
        onSave={isCreateDialogOpen ? handleAddCoupon : handleEditCoupon}
        coupon={isEditDialogOpen ? selectedCoupon : emptyCoupon}
        mode={isCreateDialogOpen ? 'create' : 'edit'}
        loading={loading}
      />

      {/* Diálogo de confirmação de exclusão */}
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onClose={closeAllDialogs}
        onConfirm={() => handleDeleteCoupon(selectedCoupon?.id)}
        title="Excluir Cupom"
        message={`Tem certeza que deseja excluir o cupom "${selectedCoupon?.code}"?`}
        warningMessage="Esta ação não pode ser desfeita e afetará pedidos que usaram este cupom."
        loading={loading}
      />
    </Box>
  );
};

export default CouponsSection;
