/**
 * GERENCIAMENTO DE DESTAQUES SEMANAIS
 * 
 * Sistema de gerenciamento de produtos destacados com cronograma semanal
 * Permite configurar uma lista de destaques com nome personalizável,
 * agendar produtos por dia da semana e aplicar descontos.
 * 
 * Funcionalidades:
 * - Configuração personalizada do nome da lista (ex: "Especiais do Dia", "Promoções da Semana")
 * - Cronograma semanal de produtos
 * - Sistema de descontos (percentual ou valor fixo)
 * - Seleção de produtos por dia da semana
 * - Estatísticas e analytics
 * 
 * @author Sistema Admin
 * @since 20/01/2025
 * @refatorado 20/01/2025
 */

'use client';

import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Chip,
  Avatar,
  Divider,
  Tooltip,
  Alert,
  LinearProgress,
  Stack,
  Badge
} from '@mui/material';

// ========== ÍCONES ==========
import {
  Settings as SettingsIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  LocalOffer as DiscountIcon,
  Visibility as VisibilityIcon,
  MoreVert as MoreVertIcon,
  DateRange as CalendarIcon,
  AttachMoney as MoneyIcon,
  Star as StarIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  PlayArrow as ActiveIcon,
  Pause as InactiveIcon,
  Restaurant as RestaurantIcon
} from '@mui/icons-material';

// ========== HOOKS ==========
import {
  useHighlightsConfig,
  useWeeklySchedule,
  useProductDiscount,
  useProductSelection,
  useHighlightsDialog,
  DISCOUNT_TYPES
} from '../../../hooks/useHighlightsManager';

// ========== COMPONENTES ==========
import HighlightsDialogs from './HighlightsDialogs';

/**
 * COMPONENTE: WeeklyScheduleCard
 * Card para exibir produtos agendados para um dia específico
 */
const WeeklyScheduleCard = ({ day, products, onAddProduct, onEditProduct, onDeleteProduct, onToggleStatus }) => {
  const { formatDiscount } = useProductDiscount();

  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      border: '2px solid',
      borderColor: 'grey.200',
      '&:hover': {
        borderColor: 'primary.light',
        boxShadow: 2
      }
    }}>
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        {/* Cabeçalho do Dia */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3,
          p: 2,
          bgcolor: 'primary.light',
          borderRadius: 2,
          color: 'primary.contrastText'
        }}>
          <Box>
            <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold' }}>
              {day.name}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              {products.length} produto(s) agendado(s)
            </Typography>
          </Box>
          <Badge badgeContent={products.length} color="secondary" max={99}>
            <CalendarIcon sx={{ fontSize: 32 }} />
          </Badge>
        </Box>

        {/* Lista de Produtos */}
        <Stack spacing={3}>
          {products.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
              <RestaurantIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
              <Typography variant="h6" sx={{ mb: 1 }}>
                Nenhum produto agendado
              </Typography>
              <Typography variant="body2">
                Clique no botão abaixo para adicionar produtos a este dia
              </Typography>
            </Box>
          ) : (
            products.map((item) => (
              <Card 
                key={item.id} 
                variant="outlined" 
                sx={{ 
                  p: 2,
                  opacity: item.active ? 1 : 0.6,
                  border: item.active ? '2px solid' : '2px dashed',
                  borderColor: item.active ? 'primary.main' : 'grey.400',
                  minHeight: 100,
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                {/* Avatar do produto */}
                <Avatar
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  sx={{ 
                    width: 56, 
                    height: 56,
                    border: '2px solid',
                    borderColor: 'grey.200',
                    mr: 2,
                    flexShrink: 0
                  }}
                >
                  <RestaurantIcon />
                </Avatar>
                
                {/* Informações do produto */}
                <Box sx={{ flexGrow: 1, minWidth: 0, mr: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                    {item.product.name}
                  </Typography>
                  {item.product.description && (
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        mb: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {item.product.description}
                    </Typography>
                  )}
                  
                  {/* Preços */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        textDecoration: item.discount.value > 0 ? 'line-through' : 'none',
                        color: item.discount.value > 0 ? 'text.secondary' : 'primary.main',
                        fontWeight: item.discount.value > 0 ? 'normal' : 'bold'
                      }}
                    >
                      R$ {item.product.price.toFixed(2)}
                    </Typography>
                    {item.discount.value > 0 && (
                      <>
                        <Typography variant="h6" color="success.main" fontWeight="bold">
                          R$ {item.finalPrice.toFixed(2)}
                        </Typography>
                        <Chip 
                          label={formatDiscount(item.discount)}
                          size="medium"
                          color="success"
                          sx={{ fontSize: '0.8rem', fontWeight: 'bold' }}
                        />
                      </>
                    )}
                  </Box>
                </Box>

                {/* Botões de ação na lateral direita */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flexShrink: 0 }}>
                  <Tooltip title="Editar desconto">
                    <IconButton 
                      size="medium" 
                      onClick={() => onEditProduct(item, day.id)}
                      sx={{ 
                        bgcolor: 'action.hover',
                        '&:hover': { bgcolor: 'primary.light', color: 'primary.contrastText' }
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={item.active ? "Desativar" : "Ativar"}>
                    <IconButton 
                      size="medium" 
                      onClick={() => onToggleStatus(day.id, item.id)}
                      sx={{
                        bgcolor: item.active ? 'success.light' : 'action.hover',
                        color: item.active ? 'success.contrastText' : 'text.primary',
                        '&:hover': { 
                          bgcolor: item.active ? 'success.main' : 'success.light',
                          color: 'success.contrastText'
                        }
                      }}
                    >
                      {item.active ? <ActiveIcon /> : <InactiveIcon />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Remover">
                    <IconButton 
                      size="medium" 
                      onClick={() => onDeleteProduct(day.id, item.id)}
                      sx={{
                        bgcolor: 'action.hover',
                        '&:hover': { bgcolor: 'error.light', color: 'error.contrastText' }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Card>
            ))
          )}
        </Stack>
      </CardContent>

      <CardActions sx={{ p: 3, pt: 2 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => onAddProduct(day.id)}
          size="large"
          sx={{
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 'bold',
            boxShadow: 2,
            '&:hover': {
              boxShadow: 4
            }
          }}
        >
          Adicionar Produto
        </Button>
      </CardActions>
    </Card>
  );
};

/**
 * COMPONENTE: StatisticsCards
 * Cards de estatísticas do sistema
 */
const StatisticsCards = ({ statistics }) => {
  const statsConfig = [
    {
      title: 'Total de Produtos',
      value: statistics.totalProducts,
      icon: <RestaurantIcon />,
      color: 'primary'
    },
    {
      title: 'Produtos Ativos',
      value: statistics.activeProducts,
      icon: <ActiveIcon />,
      color: 'success'
    },
    {
      title: 'Dias com Produtos',
      value: `${statistics.daysWithProducts}/7`,
      icon: <CalendarIcon />,
      color: 'info'
    },
    {
      title: 'Economia Total',
      value: `R$ ${statistics.totalSavings.toFixed(2)}`,
      icon: <MoneyIcon />,
      color: 'warning'
    }
  ];

  return (
    <Grid container spacing={2}>
      {statsConfig.map((stat, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: `${stat.color}.main` }}>
                  {stat.icon}
                </Avatar>
                <Box>
                  <Typography variant="h6" component="div">
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.title}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

/**
 * COMPONENTE PRINCIPAL: HighlightsManager
 * Interface principal para gerenciar destaques semanais
 */
const HighlightsManager = () => {
  // ========== HOOKS ==========
  const {
    config,
    loading: configLoading,
    error: configError,
    updateConfig,
    toggleActive
  } = useHighlightsConfig();

  const {
    weeklySchedule,
    loading: scheduleLoading,
    error: scheduleError,
    statistics,
    addProductToDay,
    removeProductFromDay,
    updateProductDiscount,
    toggleProductStatus,
    copyDaySchedule,
    WEEKDAYS
  } = useWeeklySchedule();

  const { formatDiscount } = useProductDiscount();
  
  const {
    dialogs,
    selectedData,
    openDialog,
    closeDialog
  } = useHighlightsDialog();

  // ========== HANDLERS ==========

  /**
   * Salva configuração dos destaques
   */
  const handleSaveConfig = async (configData) => {
    const result = await updateConfig(configData);
    if (result.success) {
      closeDialog('config');
    }
  };

  /**
   * Adiciona produto a um dia específico
   */
  const handleAddProduct = (dayId) => {
    openDialog('addProduct', { dayId });
  };

  /**
   * Confirma adição de produto com desconto
   */
  const handleConfirmAddProduct = async (dayId, product, discountConfig) => {
    const result = await addProductToDay(dayId, product, discountConfig);
    if (result.success) {
      closeDialog('addProduct');
    }
  };

  /**
   * Edita desconto de um produto
   */
  const handleEditProduct = (scheduleItem, dayId) => {
    openDialog('editDiscount', { scheduleItem, dayId });
  };

  /**
   * Confirma edição de desconto
   */
  const handleConfirmEditDiscount = async (dayId, scheduleItemId, discountConfig) => {
    const result = await updateProductDiscount(dayId, scheduleItemId, discountConfig);
    if (result.success) {
      closeDialog('editDiscount');
    }
  };

  /**
   * Remove produto de um dia
   */
  const handleDeleteProduct = async (dayId, scheduleItemId) => {
    const result = await removeProductFromDay(dayId, scheduleItemId);
    if (!result.success) {
      console.error('Erro ao remover produto:', result.error);
    }
  };

  /**
   * Toggle status ativo/inativo do produto
   */
  const handleToggleStatus = async (dayId, scheduleItemId) => {
    const result = await toggleProductStatus(dayId, scheduleItemId);
    if (!result.success) {
      console.error('Erro ao alterar status:', result.error);
    }
  };

  /**
   * Copia produtos de um dia para outro
   */
  const handleCopyDay = (fromDayId, toDayId) => {
    openDialog('copyDay', { copyFromDay: fromDayId, copyToDay: toDayId });
  };

  // ========== RENDERIZAÇÃO ==========
  const isLoading = configLoading || scheduleLoading;
  const hasError = configError || scheduleError;

  return (
    <Container maxWidth="xl">
      {/* ========== LOADING ========== */}
      {isLoading && <LinearProgress sx={{ mb: 2 }} />}

      {/* ========== ERROS ========== */}
      {hasError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {configError || scheduleError}
        </Alert>
      )}

      {/* ========== CABEÇALHO ========== */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Gerenciamento de Destaques
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Configure sua lista de destaques semanais com cronograma e descontos
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<SettingsIcon />}
              onClick={() => openDialog('config', { config })}
              disabled={isLoading}
            >
              Configurações
            </Button>
            <Button
              variant="outlined"
              startIcon={<VisibilityIcon />}
              onClick={() => openDialog('preview')}
            >
              Visualizar
            </Button>
          </Box>
        </Box>

        {/* Status da Configuração */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: config.active ? 'success.main' : 'warning.main' }}>
                {config.active ? <ActiveIcon /> : <InactiveIcon />}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6">
                  {config.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {config.description}
                </Typography>
              </Box>
              <Chip
                label={config.active ? 'Ativo' : 'Inativo'}
                color={config.active ? 'success' : 'warning'}
                variant="outlined"
              />
            </Box>
          </CardContent>
        </Card>

        {/* Estatísticas */}
        <StatisticsCards statistics={statistics} />
      </Box>

      {/* ========== CRONOGRAMA SEMANAL ========== */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ScheduleIcon />
          Cronograma Semanal
        </Typography>
        
        <Grid container spacing={2}>
          {WEEKDAYS.map((day) => (
            <Grid size={{ xs: 12, sm: 12, md: 8, lg: 6, xl: 4 }} key={day.id}>
              <WeeklyScheduleCard
                day={day}
                products={weeklySchedule[day.id] || []}
                onAddProduct={handleAddProduct}
                onEditProduct={handleEditProduct}
                onDeleteProduct={handleDeleteProduct}
                onToggleStatus={handleToggleStatus}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ========== DIALOGS ========== */}
      <HighlightsDialogs
        dialogs={dialogs}
        selectedData={selectedData}
        onCloseDialog={closeDialog}
        onSaveConfig={handleSaveConfig}
        onAddProduct={handleConfirmAddProduct}
        onEditDiscount={handleConfirmEditDiscount}
      />
      
    </Container>
  );
};

export default HighlightsManager;
