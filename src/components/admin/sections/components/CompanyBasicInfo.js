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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BusinessIcon />
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          <Grid item size={2}>
            <TextField
              fullWidth
              label="Número"
              value={companyData?.number || ''}
              onChange={(e) => updateField('number', e.target.value)}
              variant="outlined"
              placeholder="123"
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
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CompanyBasicInfo;
