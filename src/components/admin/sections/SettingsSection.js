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

  // ========== FUNÇÕES ==========
  
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
          Configure todas as informações da sua empresa para oferecer a melhor experiência aos seus clientes.
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
          {/* Alert de erro */}
          {error && Object.keys(error).length > 0 && (
            <Alert severity="error" sx={{ mb: 2 }}>
              <AlertTitle>Erro</AlertTitle>
              {Object.values(error).map((err, index) => (
                <Box key={index}>{err}</Box>
              ))}
            </Alert>
          )}      {/* Componentes modulares */}
      <CompanyBasicInfo 
        companyData={companyData}
        updateField={updateField}
      />

      <CompanyAddress 
        companyData={companyData}
        updateField={updateField}
      />

      <CompanyContact 
        companyData={companyData}
        updateField={updateField}
      />

      <CompanySchedule 
        companyData={companyData}
        updateField={updateField}
      />

      <CompanyMap 
        companyData={companyData}
        updateField={updateField}
      />

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
