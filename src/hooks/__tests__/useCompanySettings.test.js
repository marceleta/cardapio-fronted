/**
 * TESTES DO HOOK - useCompanySettings
 * 
 * Conjunto de testes para validar o comportamento e funcionalidades
 * do hook useCompanySettings para gerenciamento de configurações da empresa.
 * 
 * Cobertura:
 * - Estado inicial do hook
 * - Funções de atualização de dados
 * - Validação de dados
 * - Persistência de configurações
 * - Upload de logo
 * - Tratamento de erros
 * 
 * @author Sistema Admin
 * @since 20/08/2025
 */

import { renderHook, act } from '@testing-library/react';
import { useCompanySettings, usePublicCompanyData } from '../useCompanySettings';

// ========== MOCKS ==========

// Mock do localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock do URL.createObjectURL para upload de imagens
global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');

// ========== DADOS DE TESTE ==========

const mockCompanyData = {
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
};

/**
 * SUITE DE TESTES PRINCIPAL
 */
describe('useCompanySettings', () => {
  // Limpar mocks antes de cada teste
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  /**
   * GRUPO: Testes de Estado Inicial
   */
  describe('Estado Inicial', () => {
    /**
     * TESTE: Inicialização com valores padrão
     * Verifica se hook inicializa corretamente sem dados salvos
     */
    test('deve inicializar com valores padrão quando não há dados salvos', () => {
      // ACT: Renderizar hook
      const { result } = renderHook(() => useCompanySettings());

      // ASSERT: Verificar estado inicial
      expect(result.current.companyData.name).toBe('');
      expect(result.current.companyData.phone).toBe('');
      expect(result.current.loading).toBe(false);
      expect(result.current.saving).toBe(false);
      expect(result.current.error).toBe(null);
      expect(result.current.success).toBe(false);
      expect(result.current.hasChanges).toBe(false);
    });

    /**
     * TESTE: Carregamento de dados salvos
     * Verifica se hook carrega dados do localStorage
     */
    test('deve carregar dados salvos do localStorage', () => {
      // ARRANGE: Mock dados salvos no localStorage
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockCompanyData));

      // ACT: Renderizar hook
      const { result } = renderHook(() => useCompanySettings());

      // ASSERT: Verificar carregamento dos dados
      expect(result.current.companyData.name).toBe(mockCompanyData.name);
      expect(result.current.companyData.email).toBe(mockCompanyData.email);
      expect(result.current.companyData.schedule.sunday.closed).toBe(true);
    });
  });

  /**
   * GRUPO: Testes de Atualização de Dados
   */
  describe('Atualização de Dados', () => {
    /**
     * TESTE: Atualização de campo simples
     * Verifica se updateField funciona corretamente
     */
    test('deve atualizar campo específico corretamente', () => {
      // ARRANGE: Renderizar hook
      const { result } = renderHook(() => useCompanySettings());

      // ACT: Atualizar nome da empresa
      act(() => {
        result.current.updateField('name', 'Novo Nome');
      });

      // ASSERT: Verificar atualização
      expect(result.current.companyData.name).toBe('Novo Nome');
      expect(result.current.hasChanges).toBe(true);
      expect(result.current.error).toBe(null);
    });

    /**
     * TESTE: Atualização de horário de funcionamento
     * Verifica se updateSchedule funciona corretamente
     */
    test('deve atualizar horário de funcionamento específico', () => {
      // ARRANGE: Renderizar hook
      const { result } = renderHook(() => useCompanySettings());

      // ACT: Atualizar horário de segunda-feira
      act(() => {
        result.current.updateSchedule('monday', 'open', '19:00');
      });

      // ASSERT: Verificar atualização do horário
      expect(result.current.companyData.schedule.monday.open).toBe('19:00');
      expect(result.current.companyData.schedule.monday.close).toBe('23:00'); // Outros valores mantidos
      expect(result.current.hasChanges).toBe(true);
    });

    /**
     * TESTE: Fechamento de dia da semana
     * Verifica se pode marcar um dia como fechado
     */
    test('deve marcar dia como fechado corretamente', () => {
      // ARRANGE: Renderizar hook
      const { result } = renderHook(() => useCompanySettings());

      // ACT: Fechar segunda-feira
      act(() => {
        result.current.updateSchedule('monday', 'closed', true);
      });

      // ASSERT: Verificar fechamento
      expect(result.current.companyData.schedule.monday.closed).toBe(true);
    });
  });

  /**
   * GRUPO: Testes de Validação
   */
  describe('Validação de Dados', () => {
    /**
     * TESTE: Validação de dados válidos
     * Verifica se validação aceita dados corretos
     */
    test('deve validar dados corretos como válidos', () => {
      // ARRANGE: Renderizar hook
      const { result } = renderHook(() => useCompanySettings());

      // ACT: Validar dados mock
      const validation = result.current.validateCompanyData(mockCompanyData);

      // ASSERT: Verificar validação positiva
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    /**
     * TESTE: Validação de campos obrigatórios vazios
     * Verifica se validação rejeita dados incompletos
     */
    test('deve rejeitar dados com campos obrigatórios vazios', () => {
      // ARRANGE: Dados inválidos
      const invalidData = {
        ...mockCompanyData,
        name: '',
        phone: '',
        address: ''
      };

      const { result } = renderHook(() => useCompanySettings());

      // ACT: Validar dados inválidos
      const validation = result.current.validateCompanyData(invalidData);

      // ASSERT: Verificar validação negativa
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Nome da empresa é obrigatório');
      expect(validation.errors).toContain('Telefone é obrigatório');
      expect(validation.errors).toContain('Endereço é obrigatório');
    });

    /**
     * TESTE: Validação de email inválido
     * Verifica se validação rejeita email malformado
     */
    test('deve rejeitar email inválido', () => {
      // ARRANGE: Dados com email inválido
      const invalidData = {
        ...mockCompanyData,
        email: 'email-invalido'
      };

      const { result } = renderHook(() => useCompanySettings());

      // ACT: Validar email inválido
      const validation = result.current.validateCompanyData(invalidData);

      // ASSERT: Verificar rejeição do email
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('E-mail inválido');
    });

    /**
     * TESTE: Validação de horários inválidos
     * Verifica se validação rejeita horários inconsistentes
     */
    test('deve rejeitar horários de abertura após fechamento', () => {
      // ARRANGE: Dados com horário inválido
      const invalidData = {
        ...mockCompanyData,
        schedule: {
          ...mockCompanyData.schedule,
          monday: { open: '23:00', close: '18:00', closed: false }
        }
      };

      const { result } = renderHook(() => useCompanySettings());

      // ACT: Validar horário inválido
      const validation = result.current.validateCompanyData(invalidData);

      // ASSERT: Verificar rejeição do horário
      expect(validation.isValid).toBe(false);
      expect(validation.errors.some(error => error.includes('Horário inválido'))).toBe(true);
    });
  });

  /**
   * GRUPO: Testes de Persistência
   */
  describe('Persistência de Dados', () => {
    /**
     * TESTE: Salvamento bem-sucedido
     * Verifica se dados são salvos corretamente
     */
    test('deve salvar configurações com sucesso', async () => {
      // ARRANGE: Renderizar hook com dados válidos
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockCompanyData));
      const { result } = renderHook(() => useCompanySettings());

      // ACT: Salvar configurações
      await act(async () => {
        await result.current.saveCompanySettings();
      });

      // ASSERT: Verificar salvamento
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'companySettings',
        JSON.stringify(mockCompanyData)
      );
      expect(result.current.saving).toBe(false);
      expect(result.current.success).toBe(true);
      expect(result.current.hasChanges).toBe(false);
    });

    /**
     * TESTE: Erro ao salvar dados inválidos
     * Verifica se erro é tratado adequadamente
     */
    test('deve tratar erro ao tentar salvar dados inválidos', async () => {
      // ARRANGE: Hook com dados inválidos
      const { result } = renderHook(() => useCompanySettings());
      
      act(() => {
        result.current.updateField('name', ''); // Nome vazio = inválido
      });

      // ACT: Tentar salvar dados inválidos
      await act(async () => {
        await result.current.saveCompanySettings();
      });

      // ASSERT: Verificar tratamento do erro
      expect(result.current.error).toContain('Nome da empresa é obrigatório');
      expect(result.current.saving).toBe(false);
      expect(result.current.success).toBe(false);
    });
  });

  /**
   * GRUPO: Testes de Upload
   */
  describe('Upload de Logo', () => {
    /**
     * TESTE: Upload de imagem válida
     * Verifica se upload funciona com arquivo correto
     */
    test('deve fazer upload de imagem válida', async () => {
      // ARRANGE: Arquivo de imagem mock
      const mockFile = new File([''], 'logo.jpg', { type: 'image/jpeg' });
      const { result } = renderHook(() => useCompanySettings());

      // ACT: Fazer upload
      await act(async () => {
        await result.current.uploadLogo(mockFile);
      });

      // ASSERT: Verificar upload
      expect(URL.createObjectURL).toHaveBeenCalledWith(mockFile);
      expect(result.current.companyData.logo).toBe('blob:mock-url');
    });

    /**
     * TESTE: Rejeição de arquivo inválido
     * Verifica se upload rejeita arquivos não-imagem
     */
    test('deve rejeitar arquivo que não é imagem', async () => {
      // ARRANGE: Arquivo não-imagem mock
      const mockFile = new File([''], 'document.pdf', { type: 'application/pdf' });
      const { result } = renderHook(() => useCompanySettings());

      // ACT: Tentar fazer upload
      await act(async () => {
        await result.current.uploadLogo(mockFile);
      });

      // ASSERT: Verificar rejeição
      expect(result.current.error).toBe('Arquivo deve ser uma imagem');
    });

    /**
     * TESTE: Rejeição de arquivo muito grande
     * Verifica se upload rejeita arquivos maiores que 5MB
     */
    test('deve rejeitar arquivo maior que 5MB', async () => {
      // ARRANGE: Arquivo grande mock
      const mockFile = new File([''], 'logo.jpg', { type: 'image/jpeg' });
      Object.defineProperty(mockFile, 'size', { value: 6 * 1024 * 1024 }); // 6MB

      const { result } = renderHook(() => useCompanySettings());

      // ACT: Tentar fazer upload
      await act(async () => {
        await result.current.uploadLogo(mockFile);
      });

      // ASSERT: Verificar rejeição
      expect(result.current.error).toBe('Imagem deve ter menos de 5MB');
    });
  });

  /**
   * GRUPO: Testes de Funções Utilitárias
   */
  describe('Funções Utilitárias', () => {
    /**
     * TESTE: Limpeza de erro
     * Verifica se clearError remove mensagens de erro
     */
    test('deve limpar mensagem de erro', () => {
      // ARRANGE: Hook com erro
      const { result } = renderHook(() => useCompanySettings());
      
      act(() => {
        result.current.updateField('email', 'email-invalido');
        result.current.saveCompanySettings();
      });

      // ACT: Limpar erro
      act(() => {
        result.current.clearError();
      });

      // ASSERT: Verificar limpeza
      expect(result.current.error).toBe(null);
    });

    /**
     * TESTE: Reset para valores padrão
     * Verifica se resetToDefaults restaura estado inicial
     */
    test('deve resetar para valores padrão', () => {
      // ARRANGE: Hook com dados modificados
      const { result } = renderHook(() => useCompanySettings());
      
      act(() => {
        result.current.updateField('name', 'Nome Modificado');
      });

      // ACT: Reset para padrão
      act(() => {
        result.current.resetToDefaults();
      });

      // ASSERT: Verificar reset
      expect(result.current.companyData.name).toBe('');
      expect(result.current.error).toBe(null);
      expect(result.current.success).toBe(false);
    });
  });
});

/**
 * SUITE DE TESTES: usePublicCompanyData
 */
describe('usePublicCompanyData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  /**
   * TESTE: Carregamento de dados públicos
   * Verifica se hook público carrega dados corretamente
   */
  test('deve carregar dados públicos da empresa', () => {
    // ARRANGE: Mock dados salvos
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockCompanyData));

    // ACT: Renderizar hook público
    const { result } = renderHook(() => usePublicCompanyData());

    // ASSERT: Verificar carregamento
    expect(result.current.companyData).toEqual(mockCompanyData);
    expect(result.current.loading).toBe(false);
  });

  /**
   * TESTE: Tratamento de dados inexistentes
   * Verifica comportamento quando não há dados salvos
   */
  test('deve tratar ausência de dados salvos', () => {
    // ARRANGE: Sem dados salvos
    localStorageMock.getItem.mockReturnValue(null);

    // ACT: Renderizar hook público
    const { result } = renderHook(() => usePublicCompanyData());

    // ASSERT: Verificar estado sem dados
    expect(result.current.companyData).toBe(null);
    expect(result.current.loading).toBe(false);
  });
});
