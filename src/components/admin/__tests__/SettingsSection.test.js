/**
 * TESTES DO COMPONENTE - SettingsSection
 * 
 * Conjunto de testes para validar o comportamento e funcionalidades
 * do componente SettingsSection para gerenciamento de configurações administrativas.
 * 
 * Cobertura:
 * - Renderização do componente
 * - Navegação entre abas
 * - Formulários de configurações da empresa
 * - Interações do usuário
 * - Estados de carregamento e erro
 * - Upload de arquivos
 * 
 * @author Sistema Admin
 * @since 20/08/2025
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import SettingsSection from '../sections/SettingsSection';
import { theme } from '../../../lib/theme';

// ========== MOCKS ==========

// Mock do hook useCompanySettings
const mockUseCompanySettings = {
  companyData: {
    name: 'Restaurante Teste',
    description: 'Descrição de teste',
    logo: '/logo-test.jpg',
    address: 'Rua Teste, 123',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '12345-678',
    phone: '(11) 1234-5678',
    whatsapp: '(11) 1234-5678',
    email: 'teste@restaurante.com',
    website: 'www.teste.com',
    facebook: '@teste',
    instagram: '@teste',
    schedule: {
      monday: { open: '18:00', close: '23:00', closed: false },
      tuesday: { open: '18:00', close: '23:00', closed: false },
      wednesday: { open: '18:00', close: '23:00', closed: false },
      thursday: { open: '18:00', close: '23:00', closed: false },
      friday: { open: '18:00', close: '23:00', closed: false },
      saturday: { open: '12:00', close: '23:00', closed: false },
      sunday: { open: '12:00', close: '22:00', closed: true }
    }
  },
  loading: false,
  saving: false,
  error: null,
  success: false,
  hasChanges: false,
  updateField: jest.fn(),
  updateSchedule: jest.fn(),
  saveCompanySettings: jest.fn(),
  uploadLogo: jest.fn(),
  validateCompanyData: jest.fn(() => ({ isValid: true, errors: [] })),
  clearError: jest.fn(),
  resetToDefaults: jest.fn()
};

jest.mock('../../../hooks/useCompanySettings', () => ({
  useCompanySettings: () => mockUseCompanySettings
}));

// Mock do URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');

/**
 * HELPER: Renderizar componente com tema
 */
const renderWithTheme = (component) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

/**
 * SUITE DE TESTES PRINCIPAL
 */
describe('SettingsSection', () => {
  // Resetar mocks antes de cada teste
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * GRUPO: Testes de Renderização
   */
  describe('Renderização', () => {
    /**
     * TESTE: Renderização básica
     * Verifica se componente renderiza corretamente
     */
    test('deve renderizar componente corretamente', () => {
      // ACT: Renderizar componente
      renderWithTheme(<SettingsSection />);

      // ASSERT: Verificar elementos principais
      expect(screen.getByText('Configurações')).toBeInTheDocument();
      expect(screen.getByRole('tabpanel', { name: /empresa/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /empresa/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /sistema/i })).toBeInTheDocument();
    });

    /**
     * TESTE: Renderização do formulário da empresa
     * Verifica se todos os campos estão presentes
     */
    test('deve renderizar formulário de configurações da empresa', () => {
      // ACT: Renderizar componente
      renderWithTheme(<SettingsSection />);

      // ASSERT: Verificar campos do formulário
      expect(screen.getByLabelText('Nome da Empresa *')).toBeInTheDocument();
      expect(screen.getByLabelText('Descrição')).toBeInTheDocument();
      expect(screen.getByLabelText('Endereço *')).toBeInTheDocument();
      expect(screen.getByLabelText('Cidade *')).toBeInTheDocument();
      expect(screen.getByLabelText('Estado *')).toBeInTheDocument();
      expect(screen.getByLabelText('CEP')).toBeInTheDocument();
      expect(screen.getByLabelText('Telefone *')).toBeInTheDocument();
      expect(screen.getByLabelText('WhatsApp')).toBeInTheDocument();
      expect(screen.getByLabelText('E-mail *')).toBeInTheDocument();
      expect(screen.getByLabelText('Website')).toBeInTheDocument();
    });

    /**
     * TESTE: Renderização dos dados da empresa
     * Verifica se valores são exibidos corretamente
     */
    test('deve exibir dados da empresa nos campos', () => {
      // ACT: Renderizar componente
      renderWithTheme(<SettingsSection />);

      // ASSERT: Verificar valores nos campos
      expect(screen.getByDisplayValue('Restaurante Teste')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Descrição de teste')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Rua Teste, 123')).toBeInTheDocument();
      expect(screen.getByDisplayValue('São Paulo')).toBeInTheDocument();
      expect(screen.getByDisplayValue('SP')).toBeInTheDocument();
      expect(screen.getByDisplayValue('teste@restaurante.com')).toBeInTheDocument();
    });

    /**
     * TESTE: Renderização dos horários de funcionamento
     * Verifica se horários são exibidos corretamente
     */
    test('deve renderizar horários de funcionamento', () => {
      // ACT: Renderizar componente
      renderWithTheme(<SettingsSection />);

      // ASSERT: Verificar horários
      expect(screen.getByText('Horários de Funcionamento')).toBeInTheDocument();
      expect(screen.getByText('Segunda-feira')).toBeInTheDocument();
      expect(screen.getByText('Domingo')).toBeInTheDocument();
      
      // Verificar campos de horário
      const timeInputs = screen.getAllByDisplayValue('18:00');
      expect(timeInputs.length).toBeGreaterThan(0);
    });

    /**
     * TESTE: Renderização das redes sociais
     * Verifica se campos de redes sociais estão presentes
     */
    test('deve renderizar campos de redes sociais', () => {
      // ACT: Renderizar componente
      renderWithTheme(<SettingsSection />);

      // ASSERT: Verificar campos de redes sociais
      expect(screen.getByText('Redes Sociais')).toBeInTheDocument();
      expect(screen.getByLabelText('Facebook')).toBeInTheDocument();
      expect(screen.getByLabelText('Instagram')).toBeInTheDocument();
      expect(screen.getByDisplayValue('@teste')).toBeInTheDocument();
    });
  });

  /**
   * GRUPO: Testes de Navegação
   */
  describe('Navegação entre Abas', () => {
    /**
     * TESTE: Aba padrão ativa
     * Verifica se aba Empresa é ativa por padrão
     */
    test('deve ter aba Empresa ativa por padrão', () => {
      // ACT: Renderizar componente
      renderWithTheme(<SettingsSection />);

      // ASSERT: Verificar aba ativa
      const empresaTab = screen.getByRole('tab', { name: /empresa/i });
      expect(empresaTab).toHaveAttribute('aria-selected', 'true');
    });

    /**
     * TESTE: Mudança para aba Sistema
     * Verifica se consegue navegar para aba Sistema
     */
    test('deve conseguir navegar para aba Sistema', async () => {
      // ARRANGE: Renderizar componente
      renderWithTheme(<SettingsSection />);
      const user = userEvent.setup();

      // ACT: Clicar na aba Sistema
      const sistemaTab = screen.getByRole('tab', { name: /sistema/i });
      await user.click(sistemaTab);

      // ASSERT: Verificar mudança de aba
      expect(sistemaTab).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByText('Configurações do Sistema')).toBeInTheDocument();
    });
  });

  /**
   * GRUPO: Testes de Interação com Formulário
   */
  describe('Interação com Formulário', () => {
    /**
     * TESTE: Edição de campo de texto
     * Verifica se consegue editar campos de texto
     */
    test('deve conseguir editar campo de nome da empresa', async () => {
      // ARRANGE: Renderizar componente
      renderWithTheme(<SettingsSection />);
      const user = userEvent.setup();

      // ACT: Editar campo nome
      const nomeField = screen.getByLabelText('Nome da Empresa *');
      await user.clear(nomeField);
      await user.type(nomeField, 'Novo Nome');

      // ASSERT: Verificar chamada da função de update
      expect(mockUseCompanySettings.updateField).toHaveBeenCalledWith('name', 'Novo Nome');
    });

    /**
     * TESTE: Edição de campo de email
     * Verifica se consegue editar email
     */
    test('deve conseguir editar campo de email', async () => {
      // ARRANGE: Renderizar componente
      renderWithTheme(<SettingsSection />);
      const user = userEvent.setup();

      // ACT: Editar email
      const emailField = screen.getByLabelText('E-mail *');
      await user.clear(emailField);
      await user.type(emailField, 'novo@email.com');

      // ASSERT: Verificar chamada da função de update
      expect(mockUseCompanySettings.updateField).toHaveBeenCalledWith('email', 'novo@email.com');
    });

    /**
     * TESTE: Edição de horário de funcionamento
     * Verifica se consegue alterar horários
     */
    test('deve conseguir editar horário de abertura', async () => {
      // ARRANGE: Renderizar componente
      renderWithTheme(<SettingsSection />);
      const user = userEvent.setup();

      // ACT: Editar horário de abertura de segunda-feira
      const openTimeInputs = screen.getAllByDisplayValue('18:00');
      const mondayOpenTime = openTimeInputs[0]; // Primeiro input de 18:00 (segunda-feira)
      await user.clear(mondayOpenTime);
      await user.type(mondayOpenTime, '19:00');

      // ASSERT: Verificar chamada da função de update
      expect(mockUseCompanySettings.updateSchedule).toHaveBeenCalledWith('monday', 'open', '19:00');
    });

    /**
     * TESTE: Marcar dia como fechado
     * Verifica se consegue marcar um dia como fechado
     */
    test('deve conseguir marcar dia como fechado', async () => {
      // ARRANGE: Renderizar componente
      renderWithTheme(<SettingsSection />);
      const user = userEvent.setup();

      // ACT: Marcar segunda-feira como fechado
      const checkboxes = screen.getAllByRole('checkbox');
      const mondayClosedCheckbox = checkboxes.find(cb => !cb.checked); // Encontrar checkbox não marcado
      if (mondayClosedCheckbox) {
        await user.click(mondayClosedCheckbox);
      }

      // ASSERT: Verificar se função foi chamada (específico depende da implementação)
      expect(mockUseCompanySettings.updateSchedule).toHaveBeenCalled();
    });

    /**
     * TESTE: Edição de redes sociais
     * Verifica se consegue editar campos de redes sociais
     */
    test('deve conseguir editar redes sociais', async () => {
      // ARRANGE: Renderizar componente
      renderWithTheme(<SettingsSection />);
      const user = userEvent.setup();

      // ACT: Editar Instagram
      const instagramField = screen.getByLabelText('Instagram');
      await user.clear(instagramField);
      await user.type(instagramField, '@novo_perfil');

      // ASSERT: Verificar chamada da função de update
      expect(mockUseCompanySettings.updateField).toHaveBeenCalledWith('instagram', '@novo_perfil');
    });
  });

  /**
   * GRUPO: Testes de Upload de Logo
   */
  describe('Upload de Logo', () => {
    /**
     * TESTE: Upload de arquivo de imagem
     * Verifica se consegue fazer upload de logo
     */
    test('deve conseguir fazer upload de logo', async () => {
      // ARRANGE: Renderizar componente
      renderWithTheme(<SettingsSection />);
      const user = userEvent.setup();

      // Criar arquivo mock
      const mockFile = new File([''], 'logo.jpg', { type: 'image/jpeg' });

      // ACT: Fazer upload
      const fileInput = screen.getByLabelText(/logo da empresa/i);
      await user.upload(fileInput, mockFile);

      // ASSERT: Verificar chamada da função de upload
      expect(mockUseCompanySettings.uploadLogo).toHaveBeenCalledWith(mockFile);
    });

    /**
     * TESTE: Botão de remoção de logo
     * Verifica se consegue remover logo
     */
    test('deve mostrar botão de remover logo quando há logo', () => {
      // ACT: Renderizar componente
      renderWithTheme(<SettingsSection />);

      // ASSERT: Verificar botão de remoção
      expect(screen.getByText('Remover Logo')).toBeInTheDocument();
    });
  });

  /**
   * GRUPO: Testes de Salvamento
   */
  describe('Salvamento de Configurações', () => {
    /**
     * TESTE: Botão de salvar
     * Verifica se botão de salvar funciona
     */
    test('deve conseguir salvar configurações', async () => {
      // ARRANGE: Renderizar componente
      renderWithTheme(<SettingsSection />);
      const user = userEvent.setup();

      // ACT: Clicar em salvar
      const saveButton = screen.getByText('Salvar Configurações');
      await user.click(saveButton);

      // ASSERT: Verificar chamada da função de salvamento
      expect(mockUseCompanySettings.saveCompanySettings).toHaveBeenCalled();
    });

    /**
     * TESTE: Estado de carregamento durante salvamento
     * Verifica se mostra estado de carregamento
     */
    test('deve mostrar estado de carregamento durante salvamento', () => {
      // ARRANGE: Mock com estado de salvamento ativo
      const mockWithSaving = {
        ...mockUseCompanySettings,
        saving: true
      };

      jest.doMock('../../../hooks/useCompanySettings', () => ({
        useCompanySettings: () => mockWithSaving
      }));

      // ACT: Renderizar componente
      renderWithTheme(<SettingsSection />);

      // ASSERT: Verificar indicador de carregamento
      expect(screen.getByText('Salvando...')).toBeInTheDocument();
    });

    /**
     * TESTE: Mensagem de sucesso
     * Verifica se mostra mensagem de sucesso após salvar
     */
    test('deve mostrar mensagem de sucesso após salvar', () => {
      // ARRANGE: Mock com estado de sucesso
      const mockWithSuccess = {
        ...mockUseCompanySettings,
        success: true
      };

      jest.doMock('../../../hooks/useCompanySettings', () => ({
        useCompanySettings: () => mockWithSuccess
      }));

      // ACT: Renderizar componente
      renderWithTheme(<SettingsSection />);

      // ASSERT: Verificar mensagem de sucesso
      expect(screen.getByText(/configurações salvas com sucesso/i)).toBeInTheDocument();
    });
  });

  /**
   * GRUPO: Testes de Estados de Erro
   */
  describe('Estados de Erro', () => {
    /**
     * TESTE: Exibição de mensagem de erro
     * Verifica se mostra erros corretamente
     */
    test('deve mostrar mensagem de erro', () => {
      // ARRANGE: Mock com erro
      const mockWithError = {
        ...mockUseCompanySettings,
        error: 'Erro de teste'
      };

      jest.doMock('../../../hooks/useCompanySettings', () => ({
        useCompanySettings: () => mockWithError
      }));

      // ACT: Renderizar componente
      renderWithTheme(<SettingsSection />);

      // ASSERT: Verificar mensagem de erro
      expect(screen.getByText('Erro de teste')).toBeInTheDocument();
    });

    /**
     * TESTE: Botão de fechar erro
     * Verifica se consegue fechar mensagem de erro
     */
    test('deve conseguir fechar mensagem de erro', async () => {
      // ARRANGE: Mock com erro
      const mockWithError = {
        ...mockUseCompanySettings,
        error: 'Erro de teste'
      };

      jest.doMock('../../../hooks/useCompanySettings', () => ({
        useCompanySettings: () => mockWithError
      }));

      renderWithTheme(<SettingsSection />);
      const user = userEvent.setup();

      // ACT: Fechar erro
      const closeButton = screen.getByRole('button', { name: /close/i });
      await user.click(closeButton);

      // ASSERT: Verificar chamada da função de limpeza
      expect(mockUseCompanySettings.clearError).toHaveBeenCalled();
    });
  });

  /**
   * GRUPO: Testes de Acessibilidade
   */
  describe('Acessibilidade', () => {
    /**
     * TESTE: Campos obrigatórios marcados
     * Verifica se campos obrigatórios têm asterisco
     */
    test('deve marcar campos obrigatórios com asterisco', () => {
      // ACT: Renderizar componente
      renderWithTheme(<SettingsSection />);

      // ASSERT: Verificar campos obrigatórios
      expect(screen.getByLabelText('Nome da Empresa *')).toBeInTheDocument();
      expect(screen.getByLabelText('Endereço *')).toBeInTheDocument();
      expect(screen.getByLabelText('Cidade *')).toBeInTheDocument();
      expect(screen.getByLabelText('Estado *')).toBeInTheDocument();
      expect(screen.getByLabelText('Telefone *')).toBeInTheDocument();
      expect(screen.getByLabelText('E-mail *')).toBeInTheDocument();
    });

    /**
     * TESTE: Navegação por teclado
     * Verifica se abas são navegáveis por teclado
     */
    test('deve permitir navegação por teclado nas abas', () => {
      // ACT: Renderizar componente
      renderWithTheme(<SettingsSection />);

      // ASSERT: Verificar atributos de acessibilidade
      const empresaTab = screen.getByRole('tab', { name: /empresa/i });
      const sistemaTab = screen.getByRole('tab', { name: /sistema/i });

      expect(empresaTab).toHaveAttribute('tabindex');
      expect(sistemaTab).toHaveAttribute('tabindex');
    });
  });

  /**
   * GRUPO: Testes de Responsividade
   */
  describe('Responsividade', () => {
    /**
     * TESTE: Layout responsivo
     * Verifica se utiliza sistema de grid responsivo
     */
    test('deve usar layout responsivo', () => {
      // ACT: Renderizar componente
      renderWithTheme(<SettingsSection />);

      // ASSERT: Verificar presença de componentes de grid do Material-UI
      const grids = document.querySelectorAll('.MuiGrid-root');
      expect(grids.length).toBeGreaterThan(0);
    });
  });
});
