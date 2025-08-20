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
  WEEKDAYS,
  DISCOUNT_TYPES
} from '../../../hooks/useHighlightsManager';

/**
 * COMPONENTE: WeeklyScheduleCard
 * Card para exibir produtos agendados para um dia específico
 */
const WeeklyScheduleCard = ({ day, products, onAddProduct, onEditProduct, onDeleteProduct, onToggleStatus }) => {
  const { formatDiscount } = useProductDiscount();

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Cabeçalho do Dia */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h6" component="h3">
              {day.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {products.length} produto(s)
            </Typography>
          </Box>
          <Badge badgeContent={products.length} color="primary">
            <CalendarIcon color="action" />
          </Badge>
        </Box>

        {/* Lista de Produtos */}
        <Stack spacing={1}>
          {products.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>
              <RestaurantIcon sx={{ fontSize: 40, mb: 1, opacity: 0.5 }} />
              <Typography variant="body2">
                Nenhum produto agendado
              </Typography>
            </Box>
          ) : (
            products.map((item) => (
              <Card 
                key={item.id} 
                variant="outlined" 
                sx={{ 
                  p: 1,
                  opacity: item.active ? 1 : 0.6,
                  border: item.active ? '1px solid' : '1px dashed',
                  borderColor: item.active ? 'primary.main' : 'grey.400'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    sx={{ width: 32, height: 32 }}
                  >
                    <RestaurantIcon />
                  </Avatar>
                  
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography variant="subtitle2" noWrap>
                      {item.product.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          textDecoration: item.discount.value > 0 ? 'line-through' : 'none',
                          color: item.discount.value > 0 ? 'text.secondary' : 'text.primary'
                        }}
                      >
                        R$ {item.product.price.toFixed(2)}
                      </Typography>
                      {item.discount.value > 0 && (
                        <>
                          <Typography variant="body2" color="success.main" fontWeight="bold">
                            R$ {item.finalPrice.toFixed(2)}
                          </Typography>
                          <Chip 
                            label={formatDiscount(item.discount)}
                            size="small"
                            color="success"
                            sx={{ fontSize: '0.7rem', height: 16 }}
                          />
                        </>
                      )}
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Editar desconto">
                      <IconButton 
                        size="small" 
                        onClick={() => onEditProduct(item, day.id)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={item.active ? "Desativar" : "Ativar"}>
                      <IconButton 
                        size="small" 
                        onClick={() => onToggleStatus(day.id, item.id)}
                        color={item.active ? "success" : "default"}
                      >
                        {item.active ? <ActiveIcon fontSize="small" /> : <InactiveIcon fontSize="small" />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Remover">
                      <IconButton 
                        size="small" 
                        onClick={() => onDeleteProduct(day.id, item.id)}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Card>
            ))
          )}
        </Stack>
      </CardContent>

      <CardActions>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => onAddProduct(day.id)}
          size="small"
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
        <Grid item xs={12} sm={6} md={3} key={index}>
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
    WEEKDAYS: weekdays
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
   * Adiciona produto a um dia específico
   */
  const handleAddProduct = (dayId) => {
    openDialog('addProduct', { dayId });
  };

  /**
   * Edita desconto de um produto
   */
  const handleEditProduct = (scheduleItem, dayId) => {
    openDialog('editDiscount', { scheduleItem, dayId });
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
            <Grid item xs={12} sm={6} md={4} lg={3} xl={12/7} key={day.id}>
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
      {/* TODO: Implementar dialogs para configuração, adição de produtos, edição de desconto, etc. */}
      
    </Container>
  );
};

export default HighlightsManager;
