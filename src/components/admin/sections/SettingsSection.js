/**
 * SEÇÃO DE CONFIGURAÇÕES - PAINEL ADMINISTRATIVO
 * 
 * Interface para gerenciar todas as configurações do restaurante
 * incluindo informações da empresa, configurações de sistema,
 * personalização e preferências.
 * 
 * Funcionalidades:
 * - Configuração de dados da empresa
 * - Configurações de sistema
 * - Personalização da interface
 * - Preferências do usuário
 * 
 * @author Sistema Admin
 * @since 20/08/2025
 */

// ========== IMPORTAÇÕES ==========
// React e hooks
import React, { useState } from 'react';

// Material-UI Components
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Grid,
  TextField,
  Button,
  Avatar,
  IconButton,
  Alert,
  Divider,
  FormControlLabel,
  Switch,
  Card,
  CardContent,
  CardActions,
  InputAdornment,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';

// ========== ÍCONES ==========
import {
  Business as BusinessIcon,
  Settings as SystemIcon,
  Palette as ThemeIcon,
  Person as UserIcon,
  Save as SaveIcon,
  PhotoCamera as CameraIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Language as WebsiteIcon,
  Schedule as TimeIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  WhatsApp as WhatsAppIcon,
  Edit as EditIcon
} from '@mui/icons-material';

// ========== HOOKS CUSTOMIZADOS ==========
import { useCompanySettings } from '../../../hooks/useCompanySettings';

// ========== COMPONENTES ==========

/**
 * COMPONENTE: CompanySettings
 * Formulário para configurações da empresa/restaurante
 */
const CompanySettings = () => {
  // ========== HOOK CUSTOMIZADO ==========
  const {
    companyData,
    loading,
    saving,
    error,
    success,
    hasChanges,
    updateField,
    updateSchedule,
    saveCompanySettings,
    uploadLogo,
    clearError
  } = useCompanySettings();

  // Dias da semana para horários
  const weekDays = [
    { key: 'monday', label: 'Segunda-feira' },
    { key: 'tuesday', label: 'Terça-feira' },
    { key: 'wednesday', label: 'Quarta-feira' },
    { key: 'thursday', label: 'Quinta-feira' },
    { key: 'friday', label: 'Sexta-feira' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' }
  ];

  // Estados brasileiros
  const brazilianStates = [
    { code: 'AC', name: 'Acre' },
    { code: 'AL', name: 'Alagoas' },
    { code: 'AP', name: 'Amapá' },
    { code: 'AM', name: 'Amazonas' },
    { code: 'BA', name: 'Bahia' },
    { code: 'CE', name: 'Ceará' },
    { code: 'DF', name: 'Distrito Federal' },
    { code: 'ES', name: 'Espírito Santo' },
    { code: 'GO', name: 'Goiás' },
    { code: 'MA', name: 'Maranhão' },
    { code: 'MT', name: 'Mato Grosso' },
    { code: 'MS', name: 'Mato Grosso do Sul' },
    { code: 'MG', name: 'Minas Gerais' },
    { code: 'PA', name: 'Pará' },
    { code: 'PB', name: 'Paraíba' },
    { code: 'PR', name: 'Paraná' },
    { code: 'PE', name: 'Pernambuco' },
    { code: 'PI', name: 'Piauí' },
    { code: 'RJ', name: 'Rio de Janeiro' },
    { code: 'RN', name: 'Rio Grande do Norte' },
    { code: 'RS', name: 'Rio Grande do Sul' },
    { code: 'RO', name: 'Rondônia' },
    { code: 'RR', name: 'Roraima' },
    { code: 'SC', name: 'Santa Catarina' },
    { code: 'SP', name: 'São Paulo' },
    { code: 'SE', name: 'Sergipe' },
    { code: 'TO', name: 'Tocantins' }
  ];

  // Gerar URL do mapa baseado no endereço
  const generateMapUrl = () => {
    const address = `${companyData.address} ${companyData.number}, ${companyData.city}, ${companyData.state}`;
    return `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(address)}`;
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* FEEDBACK DE ERRO */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={clearError}>
          ❌ {error}
        </Alert>
      )}

      {/* FEEDBACK DE SUCESSO */}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          ✅ Configurações da empresa salvas com sucesso!
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* INFORMAÇÕES BÁSICAS */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <BusinessIcon />
                Informações da Empresa
              </Typography>
              
              <Grid container spacing={3}>
                {/* 1. Nome do Restaurante - DOBRAR A LARGURA */}
                <Grid item xs={12} sm={10}>
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

              {/* 2. Descrição - SOZINHO nesta linha */}
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

              {/* 3. CEP - SOZINHO nesta linha */}
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label="CEP"
                    value={companyData.zipCode}
                    onChange={(e) => updateField('zipCode', e.target.value)}
                    variant="outlined"
                    placeholder="12345-678"
                  />
                </Grid>
              </Grid>

              {/* 4. Endereço (dobrado) + Número (metade) - JUNTOS nesta linha */}
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={9}>
                  <TextField
                    fullWidth
                    label="Endereço *"
                    value={companyData.address}
                    onChange={(e) => updateField('address', e.target.value)}
                    variant="outlined"
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationIcon />
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

              {/* 5. Cidade + Estado (triplicado) - JUNTOS nesta linha */}
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label="Cidade *"
                    value={companyData.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    variant="outlined"
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={9}>
                  <FormControl fullWidth variant="outlined" required>
                    <InputLabel>Estado *</InputLabel>
                    <Select
                      value={companyData.state}
                      onChange={(e) => updateField('state', e.target.value)}
                      label="Estado *"
                    >
                      {brazilianStates.map((state) => (
                        <MenuItem key={state.code} value={state.code}>
                          {state.name} ({state.code})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              {/* 6. Mapa - SOZINHO nesta linha */}
              <Grid container sx={{ mt: 2 }}>
                <Grid item xs={12}>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationIcon />
                      Localização no Mapa
                    </Typography>
                    
                    {companyData.address && companyData.city && companyData.state ? (
                      <Box
                        sx={{
                          width: '100%',
                          height: 300,
                          border: '2px solid',
                          borderColor: 'grey.300',
                          borderRadius: 2,
                          overflow: 'hidden',
                          position: 'relative',
                          background: 'linear-gradient(45deg, #f5f5f5 25%, transparent 25%), linear-gradient(-45deg, #f5f5f5 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f5f5f5 75%), linear-gradient(-45deg, transparent 75%, #f5f5f5 75%)',
                          backgroundSize: '20px 20px',
                          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                        }}
                      >
                        {/* Placeholder do mapa com informações */}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            textAlign: 'center',
                            p: 3,
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: 2,
                            boxShadow: 2
                          }}
                        >
                          <LocationIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                          <Typography variant="h6" gutterBottom>
                            📍 Localização
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {companyData.address} {companyData.number && `, ${companyData.number}`}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {companyData.city} - {companyData.state}
                          </Typography>
                          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                            CEP: {companyData.zipCode}
                          </Typography>
                          
                          <Button
                            variant="outlined"
                            size="small"
                            sx={{ mt: 2 }}
                            onClick={() => {
                              const address = `${companyData.address} ${companyData.number || ''}, ${companyData.city}, ${companyData.state}`;
                              window.open(`https://www.google.com/maps/search/${encodeURIComponent(address)}`, '_blank');
                            }}
                          >
                            🗺️ Ver no Google Maps
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <Alert severity="info" sx={{ mt: 1 }}>
                        ℹ️ Preencha o endereço completo para visualizar a localização no mapa
                      </Alert>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* LOGO E IMAGEM */}
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
                startIcon={<CameraIcon />}
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

        {/* CONTATOS */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon />
                Informações de Contato
              </Typography>
              
              <Grid container spacing={2}>
                {/* Telefone */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Telefone"
                    value={companyData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                {/* WhatsApp */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="WhatsApp"
                    value={companyData.whatsapp}
                    onChange={(e) => updateField('whatsapp', e.target.value)}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <WhatsAppIcon />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                {/* Email */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="E-mail"
                    value={companyData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    variant="outlined"
                    type="email"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                {/* Website */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Website"
                    value={companyData.website}
                    onChange={(e) => updateField('website', e.target.value)}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <WebsiteIcon />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* REDES SOCIAIS */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Redes Sociais
              </Typography>
              
              <Grid container spacing={2}>
                {/* Facebook */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Facebook"
                    value={companyData.facebook}
                    onChange={(e) => updateField('facebook', e.target.value)}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FacebookIcon />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                {/* Instagram */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Instagram"
                    value={companyData.instagram}
                    onChange={(e) => updateField('instagram', e.target.value)}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <InstagramIcon />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* HORÁRIOS DE FUNCIONAMENTO */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TimeIcon />
                Horários de Funcionamento
              </Typography>
              
              <Grid container spacing={2}>
                {weekDays.map((day) => (
                  <Grid item xs={12} sm={6} md={4} key={day.key}>
                    <Box sx={{ p: 2, border: '1px solid', borderColor: 'grey.300', borderRadius: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        {day.label}
                      </Typography>
                      
                      {/* Switch para aberto/fechado */}
                      <FormControlLabel
                        control={
                          <Switch
                            checked={!companyData.schedule[day.key].closed}
                            onChange={(e) => updateSchedule(day.key, 'closed', !e.target.checked)}
                          />
                        }
                        label={companyData.schedule[day.key].closed ? 'Fechado' : 'Aberto'}
                      />
                      
                      {/* Horários quando aberto */}
                      {!companyData.schedule[day.key].closed && (
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                          <TextField
                            size="small"
                            label="Abre"
                            type="time"
                            value={companyData.schedule[day.key].open}
                            onChange={(e) => updateSchedule(day.key, 'open', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                          />
                          <TextField
                            size="small"
                            label="Fecha"
                            type="time"
                            value={companyData.schedule[day.key].close}
                            onChange={(e) => updateSchedule(day.key, 'close', e.target.value)}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Box>
                      )}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
            
            {/* AÇÕES */}
            <CardActions sx={{ justifyContent: 'flex-end', p: 3 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={saving ? null : <SaveIcon />}
                onClick={saveCompanySettings}
                disabled={saving || !hasChanges}
                sx={{ minWidth: 140 }}
              >
                {saving ? 'Salvando...' : 'Salvar Configurações'}
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

/**
 * COMPONENTE: SystemSettings
 * Configurações de sistema e preferências
 */
const SystemSettings = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SystemIcon />
            Configurações de Sistema
          </Typography>
          
          <Alert severity="info" sx={{ mt: 2 }}>
            ℹ️ Esta seção estará disponível em breve com configurações avançadas do sistema.
          </Alert>
        </CardContent>
      </Card>
    </Box>
  );
};

/**
 * COMPONENTE PRINCIPAL: SettingsSection
 * Interface principal das configurações com abas
 */
const SettingsSection = () => {
  const [activeTab, setActiveTab] = useState('company');

  /**
   * Altera aba ativa
   */
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  /**
   * Renderiza conteúdo baseado na aba ativa
   */
  const renderTabContent = () => {
    switch (activeTab) {
      case 'company':
        return <CompanySettings />;
      case 'system':
        return <SystemSettings />;
      default:
        return <CompanySettings />;
    }
  };

  return (
    <Container maxWidth="xl">
      {/* CABEÇALHO */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          ⚙️ Configurações
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Gerencie as configurações da empresa e preferências do sistema
        </Typography>
      </Box>

      {/* ABAS DE NAVEGAÇÃO */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab
            label="Dados da Empresa"
            value="company"
            icon={<BusinessIcon />}
            iconPosition="start"
          />
          <Tab
            label="Sistema"
            value="system"
            icon={<SystemIcon />}
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      {/* CONTEÚDO DA ABA ATIVA */}
      {renderTabContent()}
    </Container>
  );
};

export default SettingsSection;
