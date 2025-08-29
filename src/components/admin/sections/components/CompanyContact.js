/**
 * CONTATO DA EMPRESA - COMPONENTE MODULAR
 * 
 * Componente responsável pelos campos de contato da empresa,
 * incluindo telefone, WhatsApp, email e website.
 * 
 * Funcionalidades:
 * - Campos de contato com validação
 * - Máscaras para telefone/WhatsApp
 * - Links diretos para contato
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
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Phone as PhoneIcon,
  WhatsApp as WhatsAppIcon,
  Email as EmailIcon,
  Language as WebsiteIcon,
  Launch as LaunchIcon
} from '@mui/icons-material';

// ========== COMPONENTE PRINCIPAL ==========
/**
 * COMPONENTE: CompanyContact
 * Formulário para informações de contato da empresa
 */
const CompanyContact = ({ companyData, updateField }) => {
  
  // ========== FUNÇÕES AUXILIARES ==========
  
  /**
   * Abre WhatsApp com número formatado
   */
  const openWhatsApp = () => {
    if (companyData.whatsapp) {
      const cleanNumber = companyData.whatsapp.replace(/\D/g, '');
      window.open(`https://wa.me/55${cleanNumber}`, '_blank');
    }
  };

  /**
   * Abre email padrão
   */
  const openEmail = () => {
    if (companyData.email) {
      window.open(`mailto:${companyData.email}`, '_blank');
    }
  };

  /**
   * Abre website
   */
  const openWebsite = () => {
    if (companyData.website) {
      let url = companyData.website;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = `https://${url}`;
      }
      window.open(url, '_blank');
    }
  };

  /**
   * Formata telefone durante digitação
   */
  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  /**
   * Manipula mudança no telefone
   */
  const handlePhoneChange = (field, value) => {
    const formatted = formatPhone(value);
    updateField(field, formatted);
  };

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <PhoneIcon />
          Informações de Contato
        </Typography>
        
        {/* 6. Telefone + WhatsApp (dobrado cada) */}
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Telefone"
              value={companyData.phone}
              onChange={(e) => handlePhoneChange('phone', e.target.value)}
              variant="outlined"
              placeholder="(11) 12345-6789"
              sx={{
                '& .MuiInputBase-input': { fontSize: '1.4rem' },
                '& .MuiInputLabel-root': { fontSize: '1.4rem' }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon />
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="WhatsApp"
              value={companyData.whatsapp}
              onChange={(e) => handlePhoneChange('whatsapp', e.target.value)}
              variant="outlined"
              placeholder="(11) 98765-4321"
              sx={{
                '& .MuiInputBase-input': { fontSize: '1.4rem' },
                '& .MuiInputLabel-root': { fontSize: '1.4rem' }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <WhatsAppIcon sx={{ color: '#25D366' }} />
                  </InputAdornment>
                ),
                endAdornment: companyData.whatsapp && (
                  <InputAdornment position="end">
                    <IconButton 
                      onClick={openWhatsApp}
                      size="small"
                      title="Abrir WhatsApp"
                    >
                      <LaunchIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
        </Grid>

        {/* 7. Email + Website (dobrado cada) */}
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={companyData.email}
              onChange={(e) => updateField('email', e.target.value)}
              variant="outlined"
              placeholder="contato@empresa.com"
              sx={{
                '& .MuiInputBase-input': { fontSize: '1.4rem' },
                '& .MuiInputLabel-root': { fontSize: '1.4rem' }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
                endAdornment: companyData.email && (
                  <InputAdornment position="end">
                    <IconButton 
                      onClick={openEmail}
                      size="small"
                      title="Enviar email"
                    >
                      <LaunchIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Website"
              value={companyData.website}
              onChange={(e) => updateField('website', e.target.value)}
              variant="outlined"
              placeholder="www.empresa.com"
              sx={{
                '& .MuiInputBase-input': { fontSize: '1.4rem' },
                '& .MuiInputLabel-root': { fontSize: '1.4rem' }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <WebsiteIcon />
                  </InputAdornment>
                ),
                endAdornment: companyData.website && (
                  <InputAdornment position="end">
                    <IconButton 
                      onClick={openWebsite}
                      size="small"
                      title="Abrir website"
                    >
                      <LaunchIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CompanyContact;
