'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  IconButton,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  CloudUpload as CloudUploadIcon,
  Link as LinkIcon
} from '@mui/icons-material';

const BannerManager = () => {
  const [banners, setBanners] = useState([
    {
      id: 1,
      title: 'Pizza Margherita Especial',
      description: 'Massa artesanal, molho de tomate caseiro, mussarela de búfala e manjericão fresco. Apenas hoje com 30% de desconto!',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      productLink: 'pizza-margherita-123',
      active: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      title: 'Hambúrguer Gourmet',
      description: 'Pão brioche, blend de carnes especiais, queijo gruyère e molho da casa. Promoção limitada!',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      productLink: 'hamburguer-gourmet-456',
      active: false,
      createdAt: new Date().toISOString()
    }
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    productLink: '',
    active: true
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleCreateBanner = () => {
    setEditingBanner(null);
    setFormData({
      title: '',
      description: '',
      image: '',
      productLink: '',
      active: true
    });
    setImageFile(null);
    setImagePreview('');
    setDialogOpen(true);
  };

  const handleEditBanner = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      description: banner.description,
      image: banner.image,
      productLink: banner.productLink || '',
      active: banner.active
    });
    setImageFile(null);
    setImagePreview(banner.image);
    setDialogOpen(true);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem.');
        return;
      }

      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB.');
        return;
      }

      setImageFile(file);
      
      // Criar preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToServer = async (file) => {
    setUploading(true);
    try {
      // Simular upload para servidor/CDN
      // Em produção, você faria o upload real aqui
      const formData = new FormData();
      formData.append('image', file);
      
      // Simular delay de upload
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Por enquanto, vamos usar um URL de exemplo
      // Em produção, retornaria a URL real da imagem uploadada
      const uploadedUrl = `https://example.com/uploads/${Date.now()}-${file.name}`;
      
      return uploadedUrl;
    } catch (error) {
      console.error('Erro no upload:', error);
      throw new Error('Falha no upload da imagem');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteBanner = (bannerId) => {
    if (window.confirm('Tem certeza que deseja excluir este banner?')) {
      setBanners(banners.filter(banner => banner.id !== bannerId));
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingBanner(null);
    setFormData({
      title: '',
      description: '',
      image: '',
      productLink: '',
      active: true
    });
    setImageFile(null);
    setImagePreview('');
    setUploading(false);
  };

    const handleSaveBanner = async () => {
    try {
      let imageUrl = formData.image;
      
      // Se há um arquivo para upload, fazer o upload primeiro
      if (imageFile) {
        imageUrl = await uploadImageToServer(imageFile);
      }

      const bannerData = {
        ...formData,
        image: imageUrl,
        id: editingBanner ? editingBanner.id : Date.now(),
        createdAt: editingBanner ? editingBanner.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (editingBanner) {
        setBanners(banners.map(banner => 
          banner.id === editingBanner.id ? bannerData : banner
        ));
      } else {
        setBanners([...banners, bannerData]);
      }

      handleCloseDialog();
    } catch (error) {
      alert('Erro ao salvar banner: ' + error.message);
    }
  };

  const handleToggleActive = (bannerId) => {
    setBanners(banners.map(banner => 
      banner.id === bannerId 
        ? { ...banner, active: !banner.active }
        : banner
    ));
  };

  const activeBanners = banners.filter(banner => banner.active);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Gerenciar Banners
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateBanner}
          sx={{ borderRadius: 2 }}
        >
          Novo Banner
        </Button>
      </Box>

      {/* Estatísticas */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary">
                {banners.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total de Banners
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="success.main">
                {activeBanners.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Banners Ativos
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Lista de Banners */}
      <Grid container spacing={3}>
        {banners.map((banner) => (
          <Grid size={{ xs: 12, md: 6, lg: 4 }} key={banner.id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                opacity: banner.active ? 1 : 0.7
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={banner.image}
                alt={banner.title}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" component="h2" sx={{ flexGrow: 1 }}>
                    {banner.title}
                  </Typography>
                  <Chip 
                    label={banner.active ? 'Ativo' : 'Inativo'}
                    color={banner.active ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {banner.description.length > 100 
                    ? `${banner.description.substring(0, 100)}...`
                    : banner.description
                  }
                </Typography>

                {banner.productLink && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LinkIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      Link: {banner.productLink}
                    </Typography>
                  </Box>
                )}

                <Typography variant="caption" color="text.secondary">
                  Criado em: {new Date(banner.createdAt).toLocaleDateString('pt-BR')}
                </Typography>
              </CardContent>

              <CardActions>
                <FormControlLabel
                  control={
                    <Switch
                      checked={banner.active}
                      onChange={() => handleToggleActive(banner.id)}
                      size="small"
                    />
                  }
                  label={banner.active ? 'Ativo' : 'Inativo'}
                />
                
                <Box sx={{ flexGrow: 1 }} />
                
                <IconButton
                  size="small"
                  onClick={() => handleEditBanner(banner)}
                  color="primary"
                >
                  <EditIcon />
                </IconButton>
                
                <IconButton
                  size="small"
                  onClick={() => handleDeleteBanner(banner.id)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {banners.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Nenhum banner criado ainda
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Crie seu primeiro banner para atrair mais clientes
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateBanner}
          >
            Criar Primeiro Banner
          </Button>
        </Box>
      )}

      {/* Dialog de Criação/Edição */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingBanner ? 'Editar Banner' : 'Novo Banner'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
            <TextField
              fullWidth
              label="Título do Banner"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />

            <TextField
              fullWidth
              label="Descrição"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />

            {/* Upload de Imagem */}
            <Box sx={{ mt: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Imagem do Banner*
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 2,
                border: '2px dashed',
                borderColor: imagePreview ? 'primary.main' : 'grey.300',
                borderRadius: 2,
                p: 2,
                textAlign: 'center'
              }}>
                {imagePreview ? (
                  <Box>
                    <img 
                      src={imagePreview} 
                      alt="Preview"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '200px',
                        objectFit: 'contain',
                        borderRadius: '8px'
                      }}
                    />
                    <Box sx={{ mt: 1, display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <Button
                        size="small"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview('');
                          setFormData({...formData, image: ''});
                        }}
                      >
                        Remover
                      </Button>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                        id="image-upload-replace"
                      />
                      <label htmlFor="image-upload-replace">
                        <Button size="small" component="span">
                          Trocar Imagem
                        </Button>
                      </label>
                    </Box>
                  </Box>
                ) : (
                  <Box>
                    <CloudUploadIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Clique para selecionar uma imagem ou arraste aqui
                    </Typography>
                    <Typography variant="caption" color="textSecondary" display="block">
                      Formatos aceitos: JPG, PNG, GIF (máx. 5MB)
                    </Typography>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                      id="image-upload"
                    />
                    <label htmlFor="image-upload">
                      <Button 
                        variant="outlined" 
                        component="span" 
                        startIcon={<CloudUploadIcon />}
                        sx={{ mt: 1 }}
                      >
                        Selecionar Imagem
                      </Button>
                    </label>
                  </Box>
                )}
              </Box>
            </Box>

            <TextField
              fullWidth
              label="Link do Produto (Opcional)"
              value={formData.productLink}
              onChange={(e) => setFormData({ ...formData, productLink: e.target.value })}
              helperText="ID ou identificador do produto para direcionamento"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                />
              }
              label="Banner ativo"
            />

            {(formData.image || imagePreview) && (
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Preview da Imagem:
                </Typography>
                <img
                  src={imagePreview || formData.image}
                  alt="Preview"
                  style={{
                    width: '100%',
                    maxHeight: '200px',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            Cancelar
          </Button>
          <Button 
            variant="contained"
            onClick={handleSaveBanner}
            disabled={!formData.title || (!formData.image && !imageFile) || uploading}
            startIcon={uploading ? <CircularProgress size={20} /> : null}
          >
            {uploading ? 'Enviando...' : (editingBanner ? 'Salvar Alterações' : 'Criar Banner')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BannerManager;
