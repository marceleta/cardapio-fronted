/**
 * REDES SOCIAIS DA EMPRESA - COMPONENTE MODULAR
 * 
 * Componente responsável pelo cadastro e gerenciamento das redes
 * sociais da empresa (Facebook e Instagram).
 * 
 * Funcionalidades:
 * - Cadastro de perfis do Facebook e Instagram
 * - Validação de URLs das redes sociais
 * - Preview dos perfis configurados
 * - Indicadores visuais de status
 * 
 * @author Sistema Admin
 * @since 22/08/2025
 */

// ========== IMPORTAÇÕES ==========
import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  Box,
  Chip,
  Alert,
  Link,
  Divider
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Share as ShareIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Link as LinkIcon
} from '@mui/icons-material';

// ========== CONSTANTES ==========
/**
 * Padrões de URLs para validação
 */
const URL_PATTERNS = {
  facebook: {
    pattern: /^https?:\/\/(www\.)?(facebook\.com|fb\.com)\/[a-zA-Z0-9._-]+\/?$/,
    placeholder: 'https://facebook.com/sua-empresa',
    example: 'Exemplo: https://facebook.com/pizzaria-exemplo'
  },
  instagram: {
    pattern: /^https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9._-]+\/?$/,
    placeholder: 'https://instagram.com/sua_empresa',
    example: 'Exemplo: https://instagram.com/pizzaria_exemplo'
  }
};

// ========== COMPONENTE PRINCIPAL ==========
/**
 * COMPONENTE: CompanySocialMedia
 * Formulário para configuração de redes sociais
 */
const CompanySocialMedia = ({ companyData, updateField }) => {
  
  // ========== ESTADO LOCAL ==========
  const [validationErrors, setValidationErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);

  // ========== FUNÇÕES DE VALIDAÇÃO ==========
  
  /**
   * Valida URL de rede social
   */
  const validateSocialURL = (platform, url) => {
    if (!url || url.trim() === '') return true; // URLs vazias são válidas
    
    const pattern = URL_PATTERNS[platform]?.pattern;
    return pattern ? pattern.test(url.trim()) : false;
  };

  /**
   * Manipula mudanças nos campos de rede social
   */
  const handleSocialChange = (platform, value) => {
    // Atualizar valor no componente pai
    updateField(`socialMedia.${platform}`, value);
    
    // Validar URL
    const isValid = validateSocialURL(platform, value);
    setValidationErrors(prev => ({
      ...prev,
      [platform]: value && !isValid ? 'URL inválida para esta rede social' : null
    }));
  };

  /**
   * Extrai nome do usuário da URL
   */
  const extractUsername = (platform, url) => {
    if (!url || !validateSocialURL(platform, url)) return '';
    
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname.replace(/^\/+|\/+$/g, ''); // Remove barras
      return pathname || '';
    } catch {
      return '';
    }
  };

  // ========== DADOS ATUAIS ==========
  const socialMedia = companyData?.socialMedia || {};
  const facebookURL = socialMedia.facebook || '';
  const instagramURL = socialMedia.instagram || '';

  // ========== RENDER ==========
  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <ShareIcon />
          Redes Sociais
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Configure os perfis das redes sociais da sua empresa para maior visibilidade
        </Typography>

        <Grid container spacing={3}>
          {/* FACEBOOK */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ mb: 2 }}>
              <Typography 
                variant="subtitle1" 
                sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, fontWeight: 'bold' }}
              >
                <FacebookIcon sx={{ color: '#1877f2' }} />
                Facebook
              </Typography>

              <TextField
                fullWidth
                label="URL do Facebook"
                value={facebookURL}
                onChange={(e) => handleSocialChange('facebook', e.target.value)}
                error={!!validationErrors.facebook}
                helperText={validationErrors.facebook || URL_PATTERNS.facebook.example}
                placeholder={URL_PATTERNS.facebook.placeholder}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FacebookIcon sx={{ color: '#1877f2' }} />
                    </InputAdornment>
                  ),
                  endAdornment: facebookURL && (
                    <InputAdornment position="end">
                      {validateSocialURL('facebook', facebookURL) ? (
                        <CheckIcon sx={{ color: 'success.main' }} />
                      ) : (
                        <ErrorIcon sx={{ color: 'error.main' }} />
                      )}
                    </InputAdornment>
                  )
                }}
              />

              {/* Preview do Facebook */}
              {facebookURL && validateSocialURL('facebook', facebookURL) && (
                <Box sx={{ mt: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                    Preview:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FacebookIcon sx={{ color: '#1877f2', fontSize: 20 }} />
                    <Link 
                      href={facebookURL} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      sx={{ textDecoration: 'none', color: '#1877f2' }}
                    >
                      facebook.com/{extractUsername('facebook', facebookURL)}
                    </Link>
                  </Box>
                </Box>
              )}
            </Box>
          </Grid>

          {/* INSTAGRAM */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ mb: 2 }}>
              <Typography 
                variant="subtitle1" 
                sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, fontWeight: 'bold' }}
              >
                <InstagramIcon sx={{ color: '#E4405F' }} />
                Instagram
              </Typography>

              <TextField
                fullWidth
                label="URL do Instagram"
                value={instagramURL}
                onChange={(e) => handleSocialChange('instagram', e.target.value)}
                error={!!validationErrors.instagram}
                helperText={validationErrors.instagram || URL_PATTERNS.instagram.example}
                placeholder={URL_PATTERNS.instagram.placeholder}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <InstagramIcon sx={{ color: '#E4405F' }} />
                    </InputAdornment>
                  ),
                  endAdornment: instagramURL && (
                    <InputAdornment position="end">
                      {validateSocialURL('instagram', instagramURL) ? (
                        <CheckIcon sx={{ color: 'success.main' }} />
                      ) : (
                        <ErrorIcon sx={{ color: 'error.main' }} />
                      )}
                    </InputAdornment>
                  )
                }}
              />

              {/* Preview do Instagram */}
              {instagramURL && validateSocialURL('instagram', instagramURL) && (
                <Box sx={{ mt: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
                    Preview:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <InstagramIcon sx={{ color: '#E4405F', fontSize: 20 }} />
                    <Link 
                      href={instagramURL} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      sx={{ textDecoration: 'none', color: '#E4405F' }}
                    >
                      @{extractUsername('instagram', instagramURL)}
                    </Link>
                  </Box>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* RESUMO DAS REDES CONFIGURADAS */}
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
          Status das Redes Sociais
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {/* Status Facebook */}
          <Chip
            icon={<FacebookIcon />}
            label={facebookURL && validateSocialURL('facebook', facebookURL) 
              ? 'Facebook Configurado' 
              : 'Facebook Não Configurado'
            }
            color={facebookURL && validateSocialURL('facebook', facebookURL) ? 'success' : 'default'}
            variant={facebookURL && validateSocialURL('facebook', facebookURL) ? 'filled' : 'outlined'}
            sx={{
              '& .MuiChip-icon': {
                color: '#1877f2'
              }
            }}
          />

          {/* Status Instagram */}
          <Chip
            icon={<InstagramIcon />}
            label={instagramURL && validateSocialURL('instagram', instagramURL) 
              ? 'Instagram Configurado' 
              : 'Instagram Não Configurado'
            }
            color={instagramURL && validateSocialURL('instagram', instagramURL) ? 'success' : 'default'}
            variant={instagramURL && validateSocialURL('instagram', instagramURL) ? 'filled' : 'outlined'}
            sx={{
              '& .MuiChip-icon': {
                color: '#E4405F'
              }
            }}
          />
        </Box>

        {/* DICAS DE USO */}
        <Alert 
          severity="info" 
          sx={{ mt: 3 }}
          icon={<LinkIcon />}
        >
          <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
            💡 Dicas para configurar suas redes sociais:
          </Typography>
          <Typography variant="body2" component="div">
            • Use a URL completa do seu perfil (ex: https://facebook.com/sua-empresa)<br/>
            • Certifique-se de que os perfis estão públicos para melhor visibilidade<br/>
            • As URLs serão validadas automaticamente<br/>
            • Links em branco são válidos se você não usar a rede social
          </Typography>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default CompanySocialMedia;
