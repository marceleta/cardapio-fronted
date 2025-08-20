/**
 * HIGHLIGHTS MANAGER - GERENCIAMENTO DE DESTAQUES
 * 
 * Interface administrativa para gerenciar produtos em destaque no cardápio.
 * Permite criar, editar e organizar seções de destaques com produtos específicos.
 * 
 * Funcionalidades:
 * • CRUD completo de seções de highlights
 * • Seleção de produtos para destacar
 * • Ordenação por drag-and-drop
 * • Controle de visibilidade
 * • Preview em tempo real
 * • Upload de imagens customizadas
 * • Gestão de ordem de exibição
 * • Filtros e busca avançada
 * 
 * Seguindo padrões:
 * • UI_STANDARDS.md para design consistente
 * • CODING_STANDARDS.md para estrutura modular
 * • Material-UI como base do design system
 * • Responsividade mobile-first
 * • Acessibilidade WCAG 2.1
 * 
 * @autor Marcelo
 * @criado 19/08/2025
 */

'use client';

import React from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Chip,
  Divider,
  Alert,
  Snackbar,
  Fab,
  Tooltip,
  Avatar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ContentCopy as ContentCopyIcon,
  Preview as PreviewIcon,
  Restaurant as RestaurantIcon,
  Star as StarIcon
} from '@mui/icons-material';

// Importar hooks customizados
import { 
  useHighlightsManager, 
  useProductSelection, 
  useHighlightsDialog 
} from '../../../hooks/useHighlightsManager';

// Importar dialogs modulares
import {
  HighlightSectionDialog,
  ProductSelectionDialog,
  PreviewDialog,
  DeleteConfirmDialog
} from '../dialogs/HighlightsDialogs';

/**
 * COMPONENT: HighlightsManager
 * Gerenciador principal das seções de destaques
 */
const HighlightsManager = () => {
  // ========== HOOKS CUSTOMIZADOS ==========
  const {
    highlightSections,
    loading,
    error,
    statistics,
    createSection,
    updateSection,
    deleteSection,
    toggleSectionStatus,
    duplicateSection,
    setHighlightSections
  } = useHighlightsManager();

  const {
    availableProducts,
    addProductToSection,
    removeProductFromSection
  } = useProductSelection();

  const {
    dialogs,
    selectedData,
    openDialog,
    closeDialog
  } = useHighlightsDialog();

  // ========== ESTADOS LOCAIS ==========
  const [snackbar, setSnackbar] = React.useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });

  // ========== HANDLERS PRINCIPAIS ==========

  /**
   * Abre o dialog para criar/editar seção
   */
  const handleOpenDialog = (section = null) => {
    const newSection = section || {
      id: null,
      title: '',
      description: '',
      active: true,
      order: highlightSections.length + 1,
      products: []
    };
    openDialog('main', { section: newSection });
  };

  /**
   * Salva ou atualiza uma seção
   */
  const handleSaveSection = async (sectionData) => {
    let result;
    
    if (sectionData.id) {
      result = await updateSection(sectionData.id, sectionData);
      showSnackbar('Seção atualizada com sucesso!', 'success');
    } else {
      result = await createSection(sectionData);
      showSnackbar('Seção criada com sucesso!', 'success');
    }

    if (result.success) {
      closeDialog('main');
    } else {
      showSnackbar(result.error || 'Erro ao salvar seção', 'error');
    }
  };

  /**
   * Remove uma seção
   */
  const handleDeleteSection = async (sectionId) => {
    const result = await deleteSection(sectionId);
    
    if (result.success) {
      showSnackbar('Seção removida com sucesso!', 'success');
    } else {
      showSnackbar(result.error || 'Erro ao remover seção', 'error');
    }
    
    closeDialog('delete');
  };

  /**
   * Toggle do status ativo/inativo
   */
  const handleToggleActive = async (sectionId) => {
    const result = await toggleSectionStatus(sectionId);
    
    if (result.success) {
      showSnackbar('Status atualizado com sucesso!', 'success');
    } else {
      showSnackbar(result.error || 'Erro ao atualizar status', 'error');
    }
  };

  /**
   * Abre dialog para gerenciar produtos da seção
   */
  const handleManageProducts = (section) => {
    openDialog('products', { section });
  };

  /**
   * Adiciona produto à seção
   */
  const handleAddProductToSection = (product) => {
    const section = selectedData.section;
    const updatedSection = addProductToSection(section, product);
    
    // Atualizar no estado global
    setHighlightSections(prev => 
      prev.map(s => s.id === section.id ? updatedSection : s)
    );
    
    // Atualizar no estado local do dialog
    openDialog('products', { section: updatedSection });
  };

  /**
   * Remove produto da seção
   */
  const handleRemoveProductFromSection = (productId) => {
    const section = selectedData.section;
    const updatedSection = removeProductFromSection(section, productId);
    
    // Atualizar no estado global
    setHighlightSections(prev => 
      prev.map(s => s.id === section.id ? updatedSection : s)
    );
    
    // Atualizar no estado local do dialog
    openDialog('products', { section: updatedSection });
  };

  /**
   * Abre preview da seção
   */
  const handlePreview = (section) => {
    openDialog('preview', { section });
  };

  /**
   * Duplica uma seção
   */
  const handleDuplicateSection = async (section) => {
    const result = await duplicateSection(section.id);
    
    if (result.success) {
      showSnackbar('Seção duplicada com sucesso!', 'success');
    } else {
      showSnackbar(result.error || 'Erro ao duplicar seção', 'error');
    }
  };

  /**
   * Confirma exclusão de seção
   */
  const handleConfirmDelete = (sectionId) => {
    openDialog('delete', { deleteId: sectionId });
  };

  /**
   * Exibe snackbar com mensagem
   */
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // ========== RENDER ==========
  return (
    <Box sx={{ padding: 3 }}>
      {/* Header da Seção */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Gerenciar Destaques
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Configure as seções de produtos em destaque do cardápio
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          size="large"
          sx={{ borderRadius: 2, px: 3 }}
        >
          Nova Seção
        </Button>
      </Box>

      {/* Estatísticas Rápidas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {statistics.totalSections}
              </Typography>
              <Typography variant="body2">
                Seções Criadas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'success.main', color: 'white' }}>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {statistics.activeSections}
              </Typography>
              <Typography variant="body2">
                Seções Ativas
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'warning.main', color: 'white' }}>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {statistics.totalProducts}
              </Typography>
              <Typography variant="body2">
                Produtos Destacados
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'info.main', color: 'white' }}>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {availableProducts.length}
              </Typography>
              <Typography variant="body2">
                Produtos Disponíveis
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Lista de Seções */}
      <Grid container spacing={3}>
        {highlightSections.map((section) => (
          <Grid item xs={12} md={6} lg={4} key={section.id}>
            <Card 
              sx={{ 
                height: '100%',
                border: section.active ? 2 : 1,
                borderColor: section.active ? 'success.main' : 'divider',
                position: 'relative',
                '&:hover': {
                  boxShadow: 4,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s ease-in-out'
                }
              }}
            >
              {/* Status Badge */}
              <Chip
                label={section.active ? 'Ativa' : 'Inativa'}
                color={section.active ? 'success' : 'default'}
                size="small"
                sx={{ 
                  position: 'absolute', 
                  top: 12, 
                  right: 12, 
                  zIndex: 1 
                }}
              />

              <CardContent sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <StarIcon />
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                      {section.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {section.description}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Produtos: {section.products.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ordem: {section.order}
                  </Typography>
                </Box>

                {/* Produtos em Mini Preview */}
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  {section.products.slice(0, 3).map((product) => (
                    <Tooltip key={product.id} title={product.name}>
                      <Avatar
                        src={product.imageUrl}
                        sx={{ width: 32, height: 32 }}
                      />
                    </Tooltip>
                  ))}
                  {section.products.length > 3 && (
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'grey.300', fontSize: '0.75rem' }}>
                      +{section.products.length - 3}
                    </Avatar>
                  )}
                </Box>
              </CardContent>

              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Box>
                  <Tooltip title="Editar">
                    <IconButton onClick={() => handleOpenDialog(section)} size="small">
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Gerenciar Produtos">
                    <IconButton onClick={() => handleManageProducts(section)} size="small">
                      <RestaurantIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Visualizar">
                    <IconButton onClick={() => handlePreview(section)} size="small">
                      <PreviewIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
                
                <Box>
                  <Tooltip title="Duplicar">
                    <IconButton onClick={() => handleDuplicateSection(section)} size="small">
                      <ContentCopyIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={section.active ? 'Desativar' : 'Ativar'}>
                    <IconButton onClick={() => handleToggleActive(section.id)} size="small">
                      {section.active ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Excluir">
                    <IconButton 
                      onClick={() => handleConfirmDelete(section.id)} 
                      size="small"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))}

        {/* Card para Adicionar Nova Seção */}
        <Grid item xs={12} md={6} lg={4}>
          <Card 
            sx={{ 
              height: '100%',
              border: '2px dashed',
              borderColor: 'grey.300',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'primary.light',
                opacity: 0.1
              }
            }}
            onClick={() => handleOpenDialog()}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <AddIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
              <Typography variant="h6" color="grey.600">
                Adicionar Nova Seção
              </Typography>
              <Typography variant="body2" color="grey.500">
                Clique para criar uma nova seção de destaques
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* DIALOGS MODULARES */}
      
      {/* Dialog: Criar/Editar Seção */}
      <HighlightSectionDialog
        open={dialogs.main}
        onClose={() => closeDialog('main')}
        section={selectedData.section}
        onSave={handleSaveSection}
        loading={loading}
        existingSections={highlightSections}
      />

      {/* Dialog: Gerenciar Produtos */}
      <ProductSelectionDialog
        open={dialogs.products}
        onClose={() => closeDialog('products')}
        section={selectedData.section}
        availableProducts={availableProducts}
        onProductAdd={handleAddProductToSection}
        onProductRemove={handleRemoveProductFromSection}
      />

      {/* Dialog: Preview da Seção */}
      <PreviewDialog
        open={dialogs.preview}
        onClose={() => closeDialog('preview')}
        section={selectedData.section}
      />

      {/* Dialog: Confirmação de Exclusão */}
      <DeleteConfirmDialog
        open={dialogs.delete}
        onClose={() => closeDialog('delete')}
        onConfirm={() => handleDeleteSection(selectedData.deleteId)}
        title="Excluir Seção de Destaque"
        message="Tem certeza que deseja excluir esta seção? Esta ação não pode ser desfeita."
        loading={loading}
      />

      {/* Snackbar para Feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* FAB para Ação Rápida */}
      <Fab
        color="primary"
        aria-label="adicionar seção"
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
        onClick={() => handleOpenDialog()}
      >
        <AddIcon />
      </Fab>

      {/* Error Alert */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default HighlightsManager;
