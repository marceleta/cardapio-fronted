/**
 * HIGHLIGHTS DIALOGS - DIALOGS PARA GERENCIAMENTO DE DESTAQUES
 * 
 * Componentes de dialogs modulares para o HighlightsManager.
 * Separados para melhor organização e reutilização.
 * 
 * Componentes:
 * • HighlightSectionDialog - Dialog para criar/editar seções
 * • ProductSelectionDialog - Dialog para gerenciar produtos
 * • PreviewDialog - Dialog para preview das seções
 * • DeleteConfirmDialog - Dialog de confirmação de exclusão
 * 
 * Seguindo padrões:
 * • UI_STANDARDS.md para design consistente
 * • CODING_STANDARDS.md para modularidade
 * • Material-UI como base do design
 * • Validações integradas
 * 
 * @autor Marcelo
 * @criado 19/08/2025
 */

'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControlLabel,
  Switch,
  IconButton,
  Typography,
  Box,
  Tabs,
  Tab,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Avatar,
  Divider,
  Alert
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Restaurant as RestaurantIcon,
  Star as StarIcon,
  Preview as PreviewIcon
} from '@mui/icons-material';

/**
 * COMPONENT: HighlightSectionDialog
 * Dialog para criar/editar seções de destaques
 */
export const HighlightSectionDialog = ({ 
  open, 
  onClose, 
  section, 
  onSave, 
  loading = false,
  existingSections = []
}) => {
  const [formData, setFormData] = useState({
    title: section?.title || '',
    description: section?.description || '',
    order: section?.order || 1,
    active: section?.active ?? true
  });

  const [errors, setErrors] = useState({});

  // ========== VALIDAÇÕES ==========
  const validateForm = () => {
    const newErrors = {};

    // Validação do título
    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Título deve ter pelo menos 3 caracteres';
    } else if (formData.title.length > 50) {
      newErrors.title = 'Título deve ter no máximo 50 caracteres';
    }

    // Verificar título único
    const titleExists = existingSections.some(s => 
      s.title.toLowerCase() === formData.title.toLowerCase() && 
      s.id !== section?.id
    );
    if (titleExists) {
      newErrors.title = 'Já existe uma seção com este título';
    }

    // Validação da descrição
    if (formData.description && formData.description.length > 200) {
      newErrors.description = 'Descrição deve ter no máximo 200 caracteres';
    }

    // Validação da ordem
    if (formData.order < 1 || formData.order > 100) {
      newErrors.order = 'Ordem deve estar entre 1 e 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ========== HANDLERS ==========
  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpar erro do campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave({
        ...section,
        ...formData,
        products: section?.products || []
      });
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      order: 1,
      active: true
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          {section?.id ? 'Editar Seção de Destaque' : 'Nova Seção de Destaque'}
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Título da Seção"
              value={formData.title}
              onChange={handleChange('title')}
              fullWidth
              required
              error={!!errors.title}
              helperText={errors.title || 'Ex: Pratos Especiais, Sobremesas Irresistíveis'}
              placeholder="Digite o título da seção..."
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              label="Descrição"
              value={formData.description}
              onChange={handleChange('description')}
              fullWidth
              multiline
              rows={3}
              error={!!errors.description}
              helperText={errors.description || `${formData.description.length}/200 caracteres`}
              placeholder="Descreva brevemente esta seção de destaques..."
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Ordem de Exibição"
              type="number"
              value={formData.order}
              onChange={handleChange('order')}
              fullWidth
              inputProps={{ min: 1, max: 100 }}
              error={!!errors.order}
              helperText={errors.order || 'Ordem em que a seção aparecerá'}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ pt: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.active}
                    onChange={handleChange('active')}
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1">
                      Seção Ativa
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formData.active ? 'Visível no cardápio' : 'Oculta do cardápio'}
                    </Typography>
                  </Box>
                }
              />
            </Box>
          </Grid>

          {section?.products && section.products.length > 0 && (
            <Grid size={{ xs: 12 }}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Produtos da Seção ({section.products.length})
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {section.products.slice(0, 5).map((product) => (
                  <Chip
                    key={product.id}
                    label={product.name}
                    avatar={<Avatar src={product.imageUrl} />}
                    variant="outlined"
                    size="small"
                  />
                ))}
                {section.products.length > 5 && (
                  <Chip
                    label={`+${section.products.length - 5} produtos`}
                    variant="outlined"
                    size="small"
                  />
                )}
              </Box>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} variant="outlined">
          Cancelar
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          disabled={loading || !formData.title.trim()}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Salvando...' : (section?.id ? 'Atualizar' : 'Criar')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

/**
 * COMPONENT: ProductSelectionDialog
 * Dialog para gerenciar produtos das seções
 */
export const ProductSelectionDialog = ({ 
  open, 
  onClose, 
  section, 
  availableProducts = [],
  onProductAdd,
  onProductRemove
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // Categorias disponíveis
  const categories = [...new Set(availableProducts.map(p => p.category))].sort();

  // Produtos filtrados
  const filteredProducts = availableProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // ========== HANDLERS ==========
  const handleClose = () => {
    setActiveTab(0);
    setSearchTerm('');
    setFilterCategory('');
    onClose();
  };

  const handleProductAdd = (product) => {
    onProductAdd(product);
  };

  const handleProductRemove = (productId) => {
    onProductRemove(productId);
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2, height: '80vh' } }}
    >
      <DialogTitle>
        <Typography variant="h6">
          Gerenciar Produtos - {section?.title}
        </Typography>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab 
              label={`Produtos da Seção (${section?.products?.length || 0})`}
              icon={<RestaurantIcon />}
            />
            <Tab 
              label={`Adicionar Produtos (${filteredProducts.length})`}
              icon={<AddIcon />}
            />
          </Tabs>
        </Box>

        {/* Tab 1: Produtos da Seção */}
        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            {section?.products && section.products.length > 0 ? (
              <Grid container spacing={2}>
                {section.products.map((product) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.id}>
                    <Card>
                      <CardMedia
                        component="img"
                        height="160"
                        image={product.imageUrl}
                        alt={product.name}
                      />
                      <CardContent>
                        <Typography variant="h6" noWrap>
                          {product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {product.description}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                          <Typography variant="h6" color="primary">
                            R$ {product.price.toFixed(2)}
                          </Typography>
                          <Chip label={product.category} size="small" variant="outlined" />
                        </Box>
                      </CardContent>
                      <CardActions>
                        <Button
                          onClick={() => handleProductRemove(product.id)}
                          color="error"
                          size="small"
                          startIcon={<DeleteIcon />}
                          fullWidth
                        >
                          Remover
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <RestaurantIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                <Typography variant="h6" color="grey.600">
                  Nenhum produto adicionado
                </Typography>
                <Typography variant="body2" color="grey.500">
                  Use a aba "Adicionar Produtos" para incluir itens nesta seção
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Tab 2: Adicionar Produtos */}
        {activeTab === 1 && (
          <Box sx={{ p: 3 }}>
            {/* Filtros */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <TextField
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: 'grey.400', mr: 1 }} />
                }}
                sx={{ flexGrow: 1 }}
              />
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Categoria</InputLabel>
                <Select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  label="Categoria"
                >
                  <MenuItem value="">Todas</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Lista de Produtos */}
            <Grid container spacing={2}>
              {filteredProducts.map((product) => {
                const isInSection = section?.products?.find(p => p.id === product.id);
                return (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.id}>
                    <Card 
                      sx={{ 
                        position: 'relative',
                        opacity: isInSection ? 0.6 : 1,
                        border: isInSection ? 2 : 1,
                        borderColor: isInSection ? 'success.main' : 'divider'
                      }}
                    >
                      {isInSection && (
                        <Chip
                          label="Adicionado"
                          color="success"
                          size="small"
                          sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
                        />
                      )}
                      <CardMedia
                        component="img"
                        height="160"
                        image={product.imageUrl}
                        alt={product.name}
                      />
                      <CardContent>
                        <Typography variant="h6" noWrap>
                          {product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {product.description}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                          <Typography variant="h6" color="primary">
                            R$ {product.price.toFixed(2)}
                          </Typography>
                          <Chip label={product.category} size="small" variant="outlined" />
                        </Box>
                      </CardContent>
                      <CardActions>
                        <Button
                          onClick={() => handleProductAdd(product)}
                          disabled={isInSection}
                          variant={isInSection ? "outlined" : "contained"}
                          size="small"
                          startIcon={isInSection ? <StarIcon /> : <AddIcon />}
                          fullWidth
                        >
                          {isInSection ? 'Já Adicionado' : 'Adicionar'}
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>

            {filteredProducts.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <SearchIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                <Typography variant="h6" color="grey.600">
                  Nenhum produto encontrado
                </Typography>
                <Typography variant="body2" color="grey.500">
                  Tente ajustar os filtros de busca
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} variant="outlined">
          Fechar
        </Button>
        <Button onClick={handleClose} variant="contained">
          Concluído
        </Button>
      </DialogActions>
    </Dialog>
  );
};

/**
 * COMPONENT: PreviewDialog
 * Dialog para preview das seções
 */
export const PreviewDialog = ({ open, onClose, section }) => {
  const [previewMode, setPreviewMode] = useState('desktop');

  const getPreviewWidth = () => {
    switch (previewMode) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      default: return '100%';
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          Preview - {section?.title}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant={previewMode === 'desktop' ? 'contained' : 'outlined'}
            size="small"
            onClick={() => setPreviewMode('desktop')}
          >
            Desktop
          </Button>
          <Button
            variant={previewMode === 'tablet' ? 'contained' : 'outlined'}
            size="small"
            onClick={() => setPreviewMode('tablet')}
          >
            Tablet
          </Button>
          <Button
            variant={previewMode === 'mobile' ? 'contained' : 'outlined'}
            size="small"
            onClick={() => setPreviewMode('mobile')}
          >
            Mobile
          </Button>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box 
          sx={{ 
            width: getPreviewWidth(),
            margin: '0 auto',
            border: '1px solid #eee',
            borderRadius: 1,
            p: 2,
            bgcolor: 'background.paper'
          }}
        >
          {section && (
            <Box>
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
                {section.title}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {section.description}
              </Typography>
              
              <Box 
                sx={{ 
                  display: 'flex', 
                  overflowX: 'auto', 
                  gap: 2, 
                  pb: 2,
                  '&::-webkit-scrollbar': {
                    height: 8
                  },
                  '&::-webkit-scrollbar-track': {
                    bgcolor: 'grey.100'
                  },
                  '&::-webkit-scrollbar-thumb': {
                    bgcolor: 'grey.400',
                    borderRadius: 1
                  }
                }}
              >
                {section.products?.map((product) => (
                  <Card key={product.id} sx={{ minWidth: 250, flex: '0 0 auto' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={product.imageUrl}
                      alt={product.name}
                    />
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {product.description}
                      </Typography>
                      <Typography variant="h6" sx={{ mt: 1, color: 'primary.main' }}>
                        R$ {product.price.toFixed(2)}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>

              {(!section.products || section.products.length === 0) && (
                <Box sx={{ textAlign: 'center', py: 4, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="body1" color="text.secondary">
                    Esta seção ainda não possui produtos
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="contained">
          Fechar Preview
        </Button>
      </DialogActions>
    </Dialog>
  );
};

/**
 * COMPONENT: DeleteConfirmDialog
 * Dialog de confirmação para exclusão
 */
export const DeleteConfirmDialog = ({ 
  open, 
  onClose, 
  onConfirm, 
  title = "Confirmar Exclusão",
  message = "Tem certeza que deseja excluir este item?",
  loading = false
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle>
        <Typography variant="h6" color="error">
          {title}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Esta ação não pode ser desfeita.
        </Alert>
        <Typography variant="body1">
          {message}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="outlined" disabled={loading}>
          Cancelar
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained"
          color="error"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <DeleteIcon />}
        >
          {loading ? 'Excluindo...' : 'Excluir'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
