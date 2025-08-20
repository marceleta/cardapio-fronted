/**
 * DIALOGS DO SISTEMA DE DESTAQUES SEMANAIS
 * 
 * Componentes de dialog modulares para o sistema de destaques semanais.
 * Inclui dialogs para configuração, adição de produtos, edição de descontos,
 * cópia de cronograma e preview do sistema.
 * 
 * Dialogs inclusos:
 * - ConfigDialog: Configuração do nome e descrição da lista
 * - AddProductDialog: Seleção e adição de produtos com desconto
 * - EditDiscountDialog: Edição de desconto de produtos existentes
 * - CopyDayDialog: Cópia de produtos entre dias
 * - PreviewDialog: Preview da lista de destaques
 * - DeleteConfirmDialog: Confirmação de exclusão
 * 
 * @author Sistema Admin
 * @since 20/01/2025
 * @refatorado 20/01/2025
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  IconButton,
  Divider,
  InputAdornment,
  FormControlLabel,
  Switch,
  Alert,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Autocomplete,
  Slider,
  RadioGroup,
  Radio
} from '@mui/material';

// ========== ÍCONES ==========
import {
  Close as CloseIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  ContentCopy as CopyIcon,
  Restaurant as RestaurantIcon,
  LocalOffer as DiscountIcon,
  Percent as PercentIcon,
  AttachMoney as MoneyIcon,
  Schedule as ScheduleIcon,
  Visibility as VisibilityIcon,
  Star as StarIcon,
  Category as CategoryIcon
} from '@mui/icons-material';

// ========== HOOKS ==========
import {
  useHighlightsConfig,
  useWeeklySchedule,
  useProductDiscount,
  useProductSelection,
  WEEKDAYS,
  DISCOUNT_TYPES
} from '../../../hooks/useHighlightsManager';

/**
 * DIALOG: ConfigDialog
 * Configuração geral dos destaques (nome, descrição, status)
 */
export const ConfigDialog = ({ open, onClose, config, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    active: true
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (config) {
      setFormData({
        title: config.title || '',
        description: config.description || '',
        active: config.active !== undefined ? config.active : true
      });
    }
    setErrors({});
  }, [config, open]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Nome da lista é obrigatório';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Nome deve ter pelo menos 3 caracteres';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Descrição deve ter pelo menos 10 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.type === 'checkbox' ? event.target.checked : event.target.value
    }));
    
    // Limpa erro do campo quando usuário digita
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DiscountIcon />
          Configuração dos Destaques
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Grid container spacing={3}>
          <Grid size={12}>
            <TextField
              fullWidth
              label="Nome da Lista"
              value={formData.title}
              onChange={handleChange('title')}
              error={!!errors.title}
              helperText={errors.title || 'Ex: "Especiais do Dia", "Promoções da Semana"'}
              placeholder="Digite o nome da lista de destaques"
            />
          </Grid>
          
          <Grid size={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Descrição"
              value={formData.description}
              onChange={handleChange('description')}
              error={!!errors.description}
              helperText={errors.description || 'Descreva brevemente esta lista de destaques'}
              placeholder="Digite uma descrição para a lista"
            />
          </Grid>
          
          <Grid size={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.active}
                  onChange={handleChange('active')}
                  color="primary"
                />
              }
              label="Lista ativa"
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Quando ativa, a lista será exibida no cardápio para os clientes
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleSave}>
          Salvar Configuração
        </Button>
      </DialogActions>
    </Dialog>
  );
};

/**
 * DIALOG: AddProductDialog
 * Seleção de produto e configuração de desconto para adicionar ao cronograma
 */
export const AddProductDialog = ({ open, onClose, dayId, onAddProduct }) => {
  const {
    products,
    categories,
    searchTerm,
    selectedCategory,
    searchProducts,
    filterByCategory,
    clearFilters,
    setSearchTerm,
    setSelectedCategory
  } = useProductSelection();

  const { validateDiscount } = useProductDiscount();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [discountConfig, setDiscountConfig] = useState({
    type: DISCOUNT_TYPES.PERCENTAGE,
    value: 0
  });
  const [errors, setErrors] = useState({});

  const dayName = WEEKDAYS.find(d => d.id === dayId)?.name || 'Dia';

  useEffect(() => {
    if (open) {
      setSelectedProduct(null);
      setDiscountConfig({ type: DISCOUNT_TYPES.PERCENTAGE, value: 0 });
      setErrors({});
      clearFilters();
    }
  }, [open, clearFilters]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!selectedProduct) {
      newErrors.product = 'Selecione um produto';
    }

    if (selectedProduct && discountConfig.value > 0) {
      const discountValidation = validateDiscount(discountConfig, selectedProduct.price);
      if (!discountValidation.isValid) {
        newErrors.discount = discountValidation.errors[0];
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddProduct = () => {
    if (validateForm()) {
      onAddProduct(dayId, selectedProduct, discountConfig);
      onClose();
    }
  };

  const handleDiscountChange = (field) => (event) => {
    const value = field === 'value' ? parseFloat(event.target.value) || 0 : event.target.value;
    setDiscountConfig(prev => ({ ...prev, [field]: value }));
    
    if (errors.discount) {
      setErrors(prev => ({ ...prev, discount: '' }));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AddIcon />
          Adicionar Produto - {dayName}
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Grid container spacing={3}>
          {/* Filtros de Busca */}
          <Grid size={12}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
              />
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Categoria</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  label="Categoria"
                >
                  <MenuItem value="">Todas</MenuItem>
                  {categories.map(category => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Grid>

          {/* Lista de Produtos */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Typography variant="h6" gutterBottom>
              Selecionar Produto
            </Typography>
            {errors.product && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errors.product}
              </Alert>
            )}
            <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
              <Grid container spacing={2}>
                {products.map(product => (
                  <Grid size={{ xs: 12, sm: 6 }} key={product.id}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        border: selectedProduct?.id === product.id ? 2 : 1,
                        borderColor: selectedProduct?.id === product.id ? 'primary.main' : 'divider',
                        '&:hover': { borderColor: 'primary.main' }
                      }}
                      onClick={() => setSelectedProduct(product)}
                    >
                      <Box sx={{ display: 'flex', p: 1 }}>
                        <Avatar
                          src={product.imageUrl}
                          alt={product.name}
                          sx={{ width: 60, height: 60, mr: 2 }}
                        >
                          <RestaurantIcon />
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle2" noWrap>
                            {product.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {product.description}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                            <Typography variant="body2" fontWeight="bold">
                              R$ {product.price.toFixed(2)}
                            </Typography>
                            <Chip
                              label={product.category}
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>

          {/* Configuração de Desconto */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Typography variant="h6" gutterBottom>
              Configurar Desconto
            </Typography>
            {errors.discount && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errors.discount}
              </Alert>
            )}
            
            <FormControl component="fieldset" sx={{ mb: 2 }}>
              <RadioGroup
                value={discountConfig.type}
                onChange={handleDiscountChange('type')}
              >
                <FormControlLabel
                  value={DISCOUNT_TYPES.PERCENTAGE}
                  control={<Radio />}
                  label="Desconto Percentual"
                />
                <FormControlLabel
                  value={DISCOUNT_TYPES.FIXED}
                  control={<Radio />}
                  label="Desconto Fixo (R$)"
                />
              </RadioGroup>
            </FormControl>

            <TextField
              fullWidth
              type="number"
              label={discountConfig.type === DISCOUNT_TYPES.PERCENTAGE ? 'Percentual de Desconto' : 'Valor do Desconto'}
              value={discountConfig.value}
              onChange={handleDiscountChange('value')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {discountConfig.type === DISCOUNT_TYPES.PERCENTAGE ? <PercentIcon /> : <MoneyIcon />}
                  </InputAdornment>
                )
              }}
              helperText={
                discountConfig.type === DISCOUNT_TYPES.PERCENTAGE 
                  ? 'Digite o percentual (0-100)'
                  : 'Digite o valor em reais'
              }
            />

            {/* Preview do Desconto */}
            {selectedProduct && discountConfig.value > 0 && (
              <Card sx={{ mt: 2, bgcolor: 'success.50', borderColor: 'success.main' }} variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2" gutterBottom>
                    Preview do Desconto
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Preço Original:</Typography>
                    <Typography variant="body2" sx={{ textDecoration: 'line-through' }}>
                      R$ {selectedProduct.price.toFixed(2)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Preço Final:</Typography>
                    <Typography variant="body2" color="success.main" fontWeight="bold">
                      R$ {(
                        discountConfig.type === DISCOUNT_TYPES.PERCENTAGE
                          ? selectedProduct.price * (1 - discountConfig.value / 100)
                          : selectedProduct.price - discountConfig.value
                      ).toFixed(2)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>
          Cancelar
        </Button>
        <Button 
          variant="contained" 
          onClick={handleAddProduct}
          disabled={!selectedProduct}
        >
          Adicionar ao {dayName}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

/**
 * DIALOG: EditDiscountDialog
 * Edição de desconto de produto já adicionado
 */
export const EditDiscountDialog = ({ open, onClose, scheduleItem, dayId, onSave }) => {
  const { validateDiscount } = useProductDiscount();
  
  const [discountConfig, setDiscountConfig] = useState({
    type: DISCOUNT_TYPES.PERCENTAGE,
    value: 0
  });
  const [errors, setErrors] = useState({});

  const dayName = WEEKDAYS.find(d => d.id === dayId)?.name || 'Dia';

  useEffect(() => {
    if (scheduleItem) {
      setDiscountConfig({
        type: scheduleItem.discount?.type || DISCOUNT_TYPES.PERCENTAGE,
        value: scheduleItem.discount?.value || 0
      });
    }
    setErrors({});
  }, [scheduleItem, open]);

  const validateForm = () => {
    const newErrors = {};
    
    if (scheduleItem && discountConfig.value > 0) {
      const discountValidation = validateDiscount(discountConfig, scheduleItem.product.price);
      if (!discountValidation.isValid) {
        newErrors.discount = discountValidation.errors[0];
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(dayId, scheduleItem.id, discountConfig);
      onClose();
    }
  };

  const handleChange = (field) => (event) => {
    const value = field === 'value' ? parseFloat(event.target.value) || 0 : event.target.value;
    setDiscountConfig(prev => ({ ...prev, [field]: value }));
    
    if (errors.discount) {
      setErrors(prev => ({ ...prev, discount: '' }));
    }
  };

  if (!scheduleItem) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EditIcon />
          Editar Desconto - {dayName}
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Grid container spacing={3}>
          {/* Informações do Produto */}
          <Grid size={12}>
            <Card variant="outlined">
              <Box sx={{ display: 'flex', p: 2 }}>
                <Avatar
                  src={scheduleItem.product.imageUrl}
                  alt={scheduleItem.product.name}
                  sx={{ width: 60, height: 60, mr: 2 }}
                >
                  <RestaurantIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {scheduleItem.product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {scheduleItem.product.description}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Preço: R$ {scheduleItem.product.price.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>

          {/* Configuração de Desconto */}
          <Grid size={12}>
            {errors.discount && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errors.discount}
              </Alert>
            )}
            
            <FormControl component="fieldset" sx={{ mb: 2 }}>
              <RadioGroup
                value={discountConfig.type}
                onChange={handleChange('type')}
              >
                <FormControlLabel
                  value={DISCOUNT_TYPES.PERCENTAGE}
                  control={<Radio />}
                  label="Desconto Percentual"
                />
                <FormControlLabel
                  value={DISCOUNT_TYPES.FIXED}
                  control={<Radio />}
                  label="Desconto Fixo (R$)"
                />
              </RadioGroup>
            </FormControl>

            <TextField
              fullWidth
              type="number"
              label={discountConfig.type === DISCOUNT_TYPES.PERCENTAGE ? 'Percentual de Desconto' : 'Valor do Desconto'}
              value={discountConfig.value}
              onChange={handleChange('value')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {discountConfig.type === DISCOUNT_TYPES.PERCENTAGE ? <PercentIcon /> : <MoneyIcon />}
                  </InputAdornment>
                )
              }}
            />

            {/* Preview do Desconto */}
            {discountConfig.value > 0 && (
              <Card sx={{ mt: 2, bgcolor: 'success.50', borderColor: 'success.main' }} variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2" gutterBottom>
                    Preview do Desconto
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Preço Original:</Typography>
                    <Typography variant="body2" sx={{ textDecoration: 'line-through' }}>
                      R$ {scheduleItem.product.price.toFixed(2)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Preço Final:</Typography>
                    <Typography variant="body2" color="success.main" fontWeight="bold">
                      R$ {(
                        discountConfig.type === DISCOUNT_TYPES.PERCENTAGE
                          ? scheduleItem.product.price * (1 - discountConfig.value / 100)
                          : scheduleItem.product.price - discountConfig.value
                      ).toFixed(2)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleSave}>
          Salvar Desconto
        </Button>
      </DialogActions>
    </Dialog>
  );
};

/**
 * COMPONENTE: HighlightsDialogs
 * Container para todos os dialogs do sistema
 */
const HighlightsDialogs = ({
  dialogs,
  selectedData,
  onCloseDialog,
  onSaveConfig,
  onAddProduct,
  onEditDiscount
}) => {
  return (
    <>
      <ConfigDialog
        open={dialogs.config}
        onClose={() => onCloseDialog('config')}
        config={selectedData.config}
        onSave={onSaveConfig}
      />
      
      <AddProductDialog
        open={dialogs.addProduct}
        onClose={() => onCloseDialog('addProduct')}
        dayId={selectedData.dayId}
        onAddProduct={onAddProduct}
      />
      
      <EditDiscountDialog
        open={dialogs.editDiscount}
        onClose={() => onCloseDialog('editDiscount')}
        scheduleItem={selectedData.scheduleItem}
        dayId={selectedData.dayId}
        onSave={onEditDiscount}
      />
    </>
  );
};

export default HighlightsDialogs;
