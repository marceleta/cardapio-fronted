/**
 * CONFIGURAÇÕES DO ADMIN - SEÇÃO ORGANIZADA EM ABAS
 * 
 * Esta seção permite ao administrador configurar todos os aspectos
 * da empresa usando componentes modulares organizados em abas por
 * afinidade de informações para melhor usabilidade.
 * 
 * Funcionalidades implementadas:
 * - Arquitetura modular seguindo CODING_STANDARDS.md
 * - Interface organizada em abas por categoria
 * - Design responsivo seguindo UI_STANDARDS.md
 * - Componentes especializados por responsabilidade
 * - Persistência local dos dados
 * - Interface responsiva e intuitiva
 * 
 * Abas disponíveis:
 * - Informações Básicas: Nome, descrição e logo
 * - Localização: Endereço e mapa
 * - Contato: Telefone, email e redes sociais
 * - Operação: Horários e formas de pagamento
 * 
 * @author Sistema Admin
 * @since 22/08/2025 - Reorganização em abas
 */

// ========== IMPORTAÇÕES ==========
import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Alert,
  Tabs,
  Tab,
  AlertTitle
} from '@mui/material';
import {
  Business as BusinessIcon,
  Save as SaveIcon,
  Info as InfoIcon,
  LocationOn as LocationIcon,
  ContactPhone as ContactIcon,
  Schedule as OperationIcon
} from '@mui/icons-material';
import { useCompanySettings } from '../../../hooks/useCompanySettings';

// Componentes modulares
import CompanyBasicInfo from './components/CompanyBasicInfo';
import CompanyAddress from './components/CompanyAddress';
import CompanyContact from './components/CompanyContact';
import CompanySocialMedia from './components/CompanySocialMedia';
import CompanySchedule from './components/CompanySchedule';
import CompanyPaymentMethods from './components/CompanyPaymentMethods';
import CompanyMap from './components/CompanyMap';

// ========== COMPONENTE PRINCIPAL ==========
/**
 * COMPONENTE: SettingsSection
 * Interface principal para configurações da empresa
 */
const SettingsSection = () => {
  // ========== HOOKS E ESTADO ==========
  const {
    companyData,
    updateField,
    saveCompanyData,
    isLoading,
    error
  } = useCompanySettings();

  const [saveStatus, setSaveStatus] = useState(null);
  const [activeTab, setActiveTab] = useState('basic'); // Estado para controlar a aba ativa

  // ========== FUNÇÕES ==========
  
  /**
   * Altera a aba ativa
   */
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  /**
   * Renderiza o conteúdo baseado na aba ativa
   */
  const renderTabContent = () => {
    // Descrições das abas para orientar o usuário
    const tabDescriptions = {
      basic: 'Configure o nome, descrição e logo da sua empresa',
      location: 'Defina endereço e localização no mapa',
      contact: 'Configure telefone, email e redes sociais', 
      operation: 'Defina horários de funcionamento e formas de pagamento'
    };

    const tabTitles = {
      basic: 'Informações Básicas',
      location: 'Localização e Endereço',
      contact: 'Contato e Redes Sociais',
      operation: 'Operação e Pagamentos'
    };

    const renderContent = () => {
      switch (activeTab) {
        case 'basic':
          return (
            <CompanyBasicInfo 
              companyData={companyData}
              updateField={updateField}
            />
          );
        
        case 'location':
          return (
            <>
              <CompanyAddress 
                companyData={companyData}
                updateField={updateField}
              />
              <CompanyMap 
                companyData={companyData}
                updateField={updateField}
              />
            </>
          );
        
        case 'contact':
          return (
            <>
              <CompanyContact 
                companyData={companyData}
                updateField={updateField}
              />
              <CompanySocialMedia 
                companyData={companyData}
                updateField={updateField}
              />
            </>
          );
        
        case 'operation':
          return (
            <>
              <CompanySchedule 
                companyData={companyData}
                updateField={updateField}
              />
              <CompanyPaymentMethods 
                companyData={companyData}
                updateField={updateField}
              />
            </>
          );
        
        default:
          return null;
      }
    };

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Cabeçalho da seção ativa */}
        <Paper 
          variant="outlined" 
          sx={{ 
            p: 2, 
            backgroundColor: 'primary.50',
            borderColor: 'primary.200'
          }}
        >
          <Typography variant="h6" color="primary.main" gutterBottom>
            {tabTitles[activeTab]}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {tabDescriptions[activeTab]}
          </Typography>
        </Paper>

        {/* Conteúdo da aba */}
        {renderContent()}
      </Box>
    );
  };
  
  /**
   * Salva todas as configurações da empresa
   */
  const handleSave = async () => {
    try {
      await saveCompanyData();
      setSaveStatus({ type: 'success', message: 'Configurações salvas com sucesso!' });
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      setSaveStatus({ type: 'error', message: 'Erro ao salvar configurações.' });
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  // ========== RENDER ==========
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Cabeçalho da seção */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <BusinessIcon sx={{ fontSize: 32, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            Configurações da Empresa
          </Typography>
        </Box>
        
        <Typography variant="body1" color="text.secondary">
          Configure todas as informações da sua empresa organizadas por categoria para facilitar o gerenciamento.
        </Typography>
      </Paper>

      {/* Status de salvamento */}
      {saveStatus && (
        <Alert 
          severity={saveStatus.type} 
          sx={{ mb: 3 }}
          onClose={() => setSaveStatus(null)}
        >
          {saveStatus.message}
        </Alert>
      )}

      {/* Erros de validação */}
      {error && Object.keys(error).length > 0 && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>Erro de Validação</AlertTitle>
          {Object.values(error).map((err, index) => (
            <Box key={index}>{err}</Box>
          ))}
        </Alert>
      )}

      {/* Navegação por Abas */}
      <Paper elevation={2} sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            '& .MuiTab-root': {
              py: 2,
              minHeight: 64,
              fontSize: { xs: '0.875rem', sm: '1rem' },
              fontWeight: 500,
              minWidth: { xs: 120, sm: 160 }
            },
            '& .MuiTabs-scrollButtons': {
              color: 'primary.main'
            }
          }}
        >
          <Tab
            label="Informações Básicas"
            value="basic"
            icon={<InfoIcon />}
            iconPosition="start"
            sx={{ 
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 1
            }}
          />
          <Tab
            label="Localização"
            value="location"
            icon={<LocationIcon />}
            iconPosition="start"
            sx={{ 
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 1
            }}
          />
          <Tab
            label="Contato"
            value="contact"
            icon={<ContactIcon />}
            iconPosition="start"
            sx={{ 
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 1
            }}
          />
          <Tab
            label="Operação"
            value="operation"
            icon={<OperationIcon />}
            iconPosition="start"
            sx={{ 
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 1
            }}
          />
        </Tabs>
      </Paper>

      {/* Conteúdo da Aba Ativa */}
      <Box sx={{ mb: 4 }}>
        {renderTabContent()}
      </Box>

      {/* Botão de salvar */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={isLoading}
          sx={{
            minWidth: 200,
            py: 1.5,
            fontSize: '1.1rem'
          }}
        >
          {isLoading ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
      </Box>
    </Container>
  );
};

export default SettingsSection;
