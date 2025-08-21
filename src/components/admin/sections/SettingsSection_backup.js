/**
 * CONFIGURAÇÕES DO ADMIN - SEÇÃO REFATORADA
 * 
 * Esta seção permite ao administrador configurar todos os aspectos
 * da empresa usando componentes modulares para melhor organização
 * e manutenibilidade do código.
 * 
 * Funcionalidades implementadas:
 * - Arquitetura modular seguindo CODING_STANDARDS.md
 * - Componentes especializados por responsabilidade
 * - Persistência local dos dados
 * - Interface responsiva e intuitiva
 * 
 * @author Sistema Admin
 * @since 20/08/2025
 */

// ========== IMPORTAÇÕES ==========
import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Alert
} from '@mui/material';
import {
  Business as BusinessIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { useCompanySettings } from '../../../hooks/useCompanySettings';

// Componentes modulares
import CompanyBasicInfo from './components/CompanyBasicInfo';
import CompanyAddress from './components/CompanyAddress';
import CompanyContact from './components/CompanyContact';
import CompanySchedule from './components/CompanySchedule';
import CompanyMap from './components/CompanyMap';

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

      {/* DADOS DA EMPRESA */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#1976d2' }}>
            Dados da Empresa
          </Typography>
          
          <Grid container spacing={2}>
            {/* Linha 1: Nome (50%) + CNPJ (50%) */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nome da Empresa"
                value={companyData.name}
                onChange={(e) => updateField('name', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="CNPJ"
                value={companyData.cnpj || ''}
                onChange={(e) => updateField('cnpj', e.target.value)}
              />
            </Grid>

            {/* Linha 2: Descrição (100%) */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Descrição"
                value={companyData.description}
                onChange={(e) => updateField('description', e.target.value)}
              />
            </Grid>

            {/* Linha 3: CEP (25%) + Endereço (75%) */}
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="CEP"
                value={companyData.zipCode}
                onChange={(e) => updateField('zipCode', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={9}>
              <TextField
                fullWidth
                label="Endereço"
                value={companyData.address}
                onChange={(e) => updateField('address', e.target.value)}
              />
            </Grid>

            {/* Linha 4: Número (25%) + Cidade (25%) + Estado (50%) */}
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Número"
                value={companyData.number || ''}
                onChange={(e) => updateField('number', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Cidade"
                value={companyData.city}
                onChange={(e) => updateField('city', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={companyData.state}
                  onChange={(e) => updateField('state', e.target.value)}
                  label="Estado"
                >
                  <MenuItem value="">
                    <em>Selecione um estado</em>
                  </MenuItem>
                  {brazilianStates.map((state) => (
                    <MenuItem key={state.code} value={state.code}>
                      {state.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Linha 5: Telefone (50%) + Email (50%) */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Telefone"
                value={companyData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={companyData.email}
                onChange={(e) => updateField('email', e.target.value)}
              />
            </Grid>

            {/* Linha 6: Website (100%) */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Website"
                value={companyData.website}
                onChange={(e) => updateField('website', e.target.value)}
              />
            </Grid>

            {/* Linha 7: Google Maps (100%) */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Link do Google Maps"
                value={companyData.mapUrl || ''}
                onChange={(e) => updateField('mapUrl', e.target.value)}
                placeholder="Cole aqui o link de compartilhamento do Google Maps"
              />
            </Grid>

            {/* Linha 8: Logo da Empresa (100%) */}
            <Grid item xs={12}>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Logo da Empresa
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CameraIcon />}
                  sx={{ mb: 2 }}
                >
                  Fazer Upload da Logo
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
                {companyData.logo && (
                  <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <img 
                      src={companyData.logo} 
                      alt="Logo" 
                      style={{ width: 100, height: 100, objectFit: 'contain' }}
                    />
                    <Button 
                      color="error" 
                      onClick={() => updateField('logo', '')}
                    >
                      Remover
                    </Button>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>

        {/* BOTÃO DE SALVAR */}
        <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
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
    </Box>
  );
};
        {/* INFORMAÇÕES BÁSICAS */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <BusinessIcon />
                Informações da Empresa
              </Typography>
              
              <Grid container spacing={3}>
                {/* Nome da empresa */}
                <Grid item xs={12} md={8} lg={6}>
                  <TextField
                    fullWidth
                    label="Nome do Restaurante"
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

                {/* Descrição */}
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

                {/* Endereço */}
                <Grid item xs={12} md={8}>
                  <TextField
                    fullWidth
                    label="Endereço"
                    value={companyData.address}
                    onChange={(e) => updateField('address', e.target.value)}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationIcon />
                        </InputAdornment>
                      )
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="CEP"
                    value={companyData.zipCode}
                    onChange={(e) => updateField('zipCode', e.target.value)}
                    variant="outlined"
                  />
                </Grid>

                {/* Cidade e Estado */}
                <Grid item xs={12} md={8}>
                  <TextField
                    fullWidth
                    label="Cidade"
                    value={companyData.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Estado"
                    value={companyData.state}
                    onChange={(e) => updateField('state', e.target.value)}
                    variant="outlined"
                  />
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
