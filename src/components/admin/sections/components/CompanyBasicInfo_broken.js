/**
 * INFORMAÇÕES BÁSICAS DA EMPRESA - COMPONENTE MODULAR
 * 
 * Componente responsável pelo formulário de dados básicos da empresa,
 * incluindo nome, descrição e logo.
 * 
 * Funcionalidades:
 * - Campos de informações básicas
 * - Upload de logo com preview
 * - Validação em tempo real
 * 
 * @author Sistema Admin
 * @since 20/08/2025
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
            src={companyData.logo}
            sx={{
              width: 120,
              height: 120,
              bgcolor: 'grey.100',
              border: '2px dashed grey.300'
            }}
          >
            {companyData.logo ? null : <PhotoIcon sx={{ fontSize: 40, color: 'grey.500' }} />}
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
            {companyData.logo && (
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

        {/* Nome da empresa */}
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={9}>
            <TextField
              fullWidth
              label="Nome da Empresa *"
              value={companyData.name || ''}
              onChange={(e) => updateField('name', e.target.value)}
              variant="outlined"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BusinessIcon />
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Número"
              value={companyData.number || ''}
              onChange={(e) => updateField('number', e.target.value)}
              variant="outlined"
              placeholder="123"
            />
          </Grid>
        </Grid>

        {/* Descrição */}
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Descrição"
              value={companyData.description || ''}
              onChange={(e) => updateField('description', e.target.value)}
              variant="outlined"
              multiline
              rows={3}
              placeholder="Descreva sua empresa, especialidades, diferenciais..."
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CompanyBasicInfo;

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
  Box
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
const CompanyBasicInfo = ({ 
  companyData, 
  updateField, 
  uploadLogo, 
  loading 
}) => {
  return (
    <Grid container spacing={4}>
      {/* INFORMAÇÕES BÁSICAS */}
      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <BusinessIcon />
              Informações da Empresa
            </Typography>
            
            {/* 1. Nome do Restaurante - DOBRADO */}
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nome do Restaurante *"
                  value={companyData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  variant="outlined"
                  required
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      fontSize: '1.1rem',
                      height: '56px'
                    }
                  }}
                />
              </Grid>
            </Grid>

            {/* 2. Descrição - SOZINHO */}
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descrição"
                  value={companyData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  multiline
                  rows={3}
                  variant="outlined"
                  helperText="Breve descrição que aparecerá nas informações da empresa"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* LOGO DA EMPRESA */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Logo da Empresa
            </Typography>
            
            {/* Avatar/Logo atual */}
            <Avatar
              src={companyData.logo}
              alt="Logo da empresa"
              sx={{ 
                width: 120, 
                height: 120, 
                mx: 'auto', 
                mb: 2,
                border: '3px solid',
                borderColor: 'primary.light'
              }}
            >
              <BusinessIcon sx={{ fontSize: 60 }} />
            </Avatar>

            {/* Botão para alterar logo */}
            <Button
              variant="outlined"
              startIcon={<UploadIcon />}
              component="label"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Carregando...' : 'Alterar Logo'}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    uploadLogo(file);
                  }
                }}
              />
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default CompanyBasicInfo;
