/**
 * INFORMAÇÕES BÁSICAS DA EMPRESA - COMPONENTE MODULAR
 * 
 * Componente responsável pelo formulário de dados básicos da empresa,
 * incluindo nome, descrição, logo e banner principal.
 * 
 * Funcionalidades:
 * - Campos de informações básicas
 * - Upload de logo com preview
 * - Upload de banner com preview responsivo
 * - Validação em tempo real
 * 
 * @author Sistema Admin
 * @since 20/08/2025
 * @updated 22/08/2025 - Adicionado campo banner
 */

// ========== IMPORTAÇÕES ==========
import React from 'react';
import {
  Grid,
  TextField,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Box,
  InputAdornment
} from '@mui/material';
import {
  Business as BusinessIcon,
  Photo as PhotoIcon,
  CloudUpload as UploadIcon
} from '@mui/icons-material';

// ========== COMPONENTE PRINCIPAL ==========
/**
 * COMPONENTE: CompanyBasicInfo
 * Formulário para informações básicas da empresa
 */
const CompanyBasicInfo = ({ companyData, updateField }) => {
  
  /**
   * Manipula upload de logo
   */
  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        updateField('logo', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * Manipula upload de banner
   */
  const handleBannerUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        updateField('banner', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <BusinessIcon />
          Informações Básicas
        </Typography>
        
        {/* Logo da empresa */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
          <Avatar
            src={companyData?.logo}
            sx={{
              width: 120,
              height: 120,
              bgcolor: 'grey.100',
              border: '2px dashed grey.300'
            }}
          >
            {companyData?.logo ? null : <PhotoIcon sx={{ fontSize: 40, color: 'grey.500' }} />}
          </Avatar>
          
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Logo da empresa (recomendado: 300x300px)
            </Typography>
            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadIcon />}
              size="small"
            >
              Escolher Logo
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleLogoUpload}
              />
            </Button>
            {companyData?.logo && (
              <Button
                variant="text"
                color="error"
                size="small"
                onClick={() => updateField('logo', '')}
                sx={{ ml: 1 }}
              >
                Remover
              </Button>
            )}
          </Box>
        </Box>

        {/* Banner da empresa */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
            Banner Principal
          </Typography>
          
          {/* Preview do banner */}
          {companyData?.banner && (
            <Box 
              sx={{ 
                mb: 2,
                border: '2px solid',
                borderColor: 'primary.200',
                borderRadius: 2,
                overflow: 'hidden',
                maxHeight: 200
              }}
            >
              <img
                src={companyData.banner}
                alt="Banner da empresa"
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '200px',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            </Box>
          )}
          
          {/* Área de upload do banner */}
          <Box 
            sx={{ 
              border: '2px dashed',
              borderColor: companyData?.banner ? 'success.main' : 'grey.300',
              borderRadius: 2,
              p: 3,
              textAlign: 'center',
              backgroundColor: companyData?.banner ? 'success.50' : 'grey.50',
              transition: 'all 0.3s ease'
            }}
          >
            <PhotoIcon 
              sx={{ 
                fontSize: 48, 
                color: companyData?.banner ? 'success.main' : 'grey.400',
                mb: 1 
              }} 
            />
            <Typography variant="body1" gutterBottom>
              {companyData?.banner ? 'Banner carregado com sucesso!' : 'Banner da página principal'}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Recomendado: 1200x400px ou proporção 3:1
            </Typography>
            
            <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'center' }}>
              <Button
                variant={companyData?.banner ? "outlined" : "contained"}
                component="label"
                startIcon={<UploadIcon />}
                size="small"
              >
                {companyData?.banner ? 'Trocar Banner' : 'Escolher Banner'}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleBannerUpload}
                />
              </Button>
              
              {companyData?.banner && (
                <Button
                  variant="text"
                  color="error"
                  size="small"
                  onClick={() => updateField('banner', '')}
                >
                  Remover
                </Button>
              )}
            </Box>
          </Box>
        </Box>

        {/* Nome da empresa */}
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item size={8} >
            <TextField
              fullWidth
              label="Nome da Empresa *"
              value={companyData?.name || ''}
              onChange={(e) => updateField('name', e.target.value)}
              variant="outlined"
              required
              sx={{
                '& .MuiInputBase-input': { fontSize: '1.4rem' },
                '& .MuiInputLabel-root': { fontSize: '1.4rem' }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BusinessIcon />
                  </InputAdornment>
                )
              }}
            />
          </Grid>

        </Grid>

        {/* Descrição */}
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item size={12}>
            <TextField
              fullWidth
              label="Descrição"
              value={companyData?.description || ''}
              onChange={(e) => updateField('description', e.target.value)}
              variant="outlined"
              multiline
              rows={3}
              placeholder="Descreva sua empresa, especialidades, diferenciais..."
              sx={{
                '& .MuiInputBase-input': { fontSize: '1.4rem' },
                '& .MuiInputLabel-root': { fontSize: '1.4rem' }
              }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CompanyBasicInfo;
