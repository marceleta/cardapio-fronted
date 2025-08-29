/**
 * TESTES DO COMPONENTE - CouponsSection
 * 
 * Conjunto de testes para validar o comportamento e funcionalidades
 * do componente CouponsSection.
 * 
 * Cobertura:
 * - Renderização correta
 * - Exibição de estatísticas
 * - Interações com tabela
 * - Busca e filtros
 * - Abertura de diálogos
 * - Estados de loading e erro
 * - Ações de CRUD
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Utilitários de teste
import { renderWithProviders, createMockCoupon } from '../../../../test-utils';

// Componente sendo testado
import CouponsSection from '../CouponsSection';

// Mock do hook
jest.mock('../../../../hooks/useCouponsManager', () => ({
  useCouponsManager: jest.fn()
}));

import { useCouponsManager } from '../../../../hooks/useCouponsManager';

/**
 * DADOS MOCK PARA TESTES
 */
const mockCoupons = [
  createMockCoupon({
    id: 1,
    code: 'TESTE10',
    description: 'Cupom de teste para renderização',
    type: 'percentage',
    value: 10,
    isActive: true,
    currentUsage: 25,
    usageLimit: 100
  }),
  createMockCoupon({
    id: 2,
    code: 'FIXO20',
    description: 'Desconto fixo de teste',
    type: 'fixed_amount',
    value: 20.00,
    isActive: false,
    currentUsage: 10,
    usageLimit: null
  })
];

const mockStatistics = {
  total: 2,
  active: 1,
  expired: 0,
  firstPurchaseOnly: 0,
  totalUsage: 35
};

/**
 * HELPER: Mock padrão do hook
 */
const createMockHook = (overrides = {}) => ({
  coupons: mockCoupons,
  allCoupons: mockCoupons,
  loading: false,
  error: null,
  searchTerm: '',
  selectedCoupon: null,
  isCreateDialogOpen: false,
  isEditDialogOpen: false,
  isDeleteDialogOpen: false,
  statistics: mockStatistics,
  emptyCoupon: {},
  handleAddCoupon: jest.fn(),
  handleEditCoupon: jest.fn(),
  handleDeleteCoupon: jest.fn(),
  handleToggleStatus: jest.fn(),
  setSearchTerm: jest.fn(),
  openCreateDialog: jest.fn(),
  openEditDialog: jest.fn(),
  openDeleteDialog: jest.fn(),
  closeAllDialogs: jest.fn(),
  validateCoupon: jest.fn(),
  clearError: jest.fn(),
  ...overrides
});

/**
 * SUITE DE TESTES PRINCIPAL
 */
describe('CouponsSection', () => {
  // Configuração antes de cada teste
  beforeEach(() => {
    jest.clearAllMocks();
    useCouponsManager.mockReturnValue(createMockHook());
  });

  /**
   * GRUPO: Testes de Renderização
   */
  describe('Renderização', () => {
    /**
     * TESTE: Renderização básica
     * Verifica se componente renderiza corretamente com dados básicos
     */
    test('deve renderizar o cabeçalho da seção corretamente', () => {
      // ACT: Renderizar componente
      renderWithProviders(<CouponsSection />);

      // ASSERT: Verificar elementos do cabeçalho
      expect(screen.getByText('💳 Cupons de Desconto')).toBeInTheDocument();
      expect(screen.getByText(/Gerencie cupons promocionais/)).toBeInTheDocument();
    });

    /**
     * TESTE: Renderização de estatísticas
     * Verifica se cards de estatísticas são exibidos corretamente
     */
    test('deve renderizar cards de estatísticas', () => {
      // ACT: Renderizar componente
      renderWithProviders(<CouponsSection />);

      // ASSERT: Verificar cards de estatísticas
      expect(screen.getByText('Total de Cupons')).toBeInTheDocument();
      expect(screen.getByText('Cupons Ativos')).toBeInTheDocument();
      expect(screen.getByText('Primeira Compra')).toBeInTheDocument();
      expect(screen.getByText('Total de Usos')).toBeInTheDocument();
      
      // Verificar valores das estatísticas
      expect(screen.getByText('2')).toBeInTheDocument(); // Total
      expect(screen.getByText('1')).toBeInTheDocument(); // Active
      expect(screen.getByText('35')).toBeInTheDocument(); // Total usage
    });

    /**
     * TESTE: Campo de busca
     * Verifica se campo de busca é renderizado corretamente
     */
    test('deve renderizar campo de busca', () => {
      // ACT: Renderizar componente
      renderWithProviders(<CouponsSection />);

      // ASSERT: Verificar campo de busca
      const searchInput = screen.getByPlaceholderText(/Buscar cupons por código ou descrição/);
      expect(searchInput).toBeInTheDocument();
    });

    /**
     * TESTE: Botão de criar cupom
     * Verifica se botão de criação é renderizado
     */
    test('deve renderizar botão de criar novo cupom', () => {
      // ACT: Renderizar componente
      renderWithProviders(<CouponsSection />);

      // ASSERT: Verificar botão
      const createButton = screen.getByText('Novo Cupom');
      expect(createButton).toBeInTheDocument();
    });

    /**
     * TESTE: Tabela de cupons
     * Verifica se tabela com cupons é renderizada
     */
    test('deve renderizar tabela com cupons', () => {
      // ACT: Renderizar componente
      renderWithProviders(<CouponsSection />);

      // ASSERT: Verificar cabeçalhos da tabela
      expect(screen.getByText('Cupom')).toBeInTheDocument();
      expect(screen.getByText('Descrição')).toBeInTheDocument();
      expect(screen.getByText('Desconto')).toBeInTheDocument();
      expect(screen.getByText('Validade')).toBeInTheDocument();
      expect(screen.getByText('Dias Ativos')).toBeInTheDocument();
      expect(screen.getByText('Uso')).toBeInTheDocument();
      expect(screen.getByText('Ações')).toBeInTheDocument();

      // Verificar dados dos cupons
      expect(screen.getByText('TESTE10')).toBeInTheDocument();
      expect(screen.getByText('FIXO20')).toBeInTheDocument();
    });
  });

  /**
   * GRUPO: Testes de Estados
   */
  describe('Estados do Componente', () => {
    /**
     * TESTE: Estado de loading
     * Verifica se skeleton é exibido durante carregamento
     */
    test('deve exibir skeleton durante loading', () => {
      // ARRANGE: Mock com loading ativo
      useCouponsManager.mockReturnValue(createMockHook({ loading: true }));

      // ACT: Renderizar componente
      renderWithProviders(<CouponsSection />);

      // ASSERT: Verificar que não há dados de cupons exibidos durante loading
      expect(screen.queryByText('TESTE10')).not.toBeInTheDocument();
      expect(screen.queryByText('FIXO20')).not.toBeInTheDocument();
      
      // Verificar que a tabela ainda está presente
      expect(screen.getByText('Cupom')).toBeInTheDocument();
    });

    /**
     * TESTE: Estado de erro
     * Verifica se alerta de erro é exibido
     */
    test('deve exibir alerta de erro quando há erro', () => {
      // ARRANGE: Mock com erro
      const errorMessage = 'Erro ao carregar cupons';
      useCouponsManager.mockReturnValue(createMockHook({ 
        error: errorMessage 
      }));

      // ACT: Renderizar componente
      renderWithProviders(<CouponsSection />);

      // ASSERT: Verificar alerta de erro
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    /**
     * TESTE: Estado vazio
     * Verifica se mensagem de estado vazio é exibida
     */
    test('deve exibir mensagem quando não há cupons', () => {
      // ARRANGE: Mock sem cupons
      useCouponsManager.mockReturnValue(createMockHook({ 
        coupons: [],
        statistics: { ...mockStatistics, total: 0 }
      }));

      // ACT: Renderizar componente
      renderWithProviders(<CouponsSection />);

      // ASSERT: Verificar mensagem de estado vazio
      expect(screen.getByText('Nenhum cupom cadastrado')).toBeInTheDocument();
      expect(screen.getByText(/Comece criando seu primeiro cupom/)).toBeInTheDocument();
    });

    /**
     * TESTE: Estado de busca sem resultados
     * Verifica mensagem quando busca não encontra cupons
     */
    test('deve exibir mensagem quando busca não encontra cupons', () => {
      // ARRANGE: Mock com busca ativa mas sem resultados
      useCouponsManager.mockReturnValue(createMockHook({ 
        coupons: [],
        searchTerm: 'INEXISTENTE'
      }));

      // ACT: Renderizar componente
      renderWithProviders(<CouponsSection />);

      // ASSERT: Verificar mensagem de busca vazia
      expect(screen.getByText('Nenhum cupom encontrado')).toBeInTheDocument();
      expect(screen.getByText(/Tente ajustar os filtros/)).toBeInTheDocument();
    });
  });

  /**
   * GRUPO: Testes de Interação
   */
  describe('Interações do Usuário', () => {
    /**
     * TESTE: Busca por cupons
     * Verifica se busca funciona corretamente
     */
    test('deve permitir buscar cupons', async () => {
      // ARRANGE: Mock setup e user
      const mockSetSearchTerm = jest.fn();
      useCouponsManager.mockReturnValue(createMockHook({ 
        setSearchTerm: mockSetSearchTerm 
      }));
      const user = userEvent.setup();

      // ACT: Renderizar e interagir
      renderWithProviders(<CouponsSection />);
      const searchInput = screen.getByPlaceholderText(/Buscar cupons por código ou descrição/);
      await user.type(searchInput, 'TESTE');

      // ASSERT: Verificar se função foi chamada (userEvent chama para cada caractere)
      await waitFor(() => {
        expect(mockSetSearchTerm).toHaveBeenCalledWith('E'); // Último caractere
      });
      
      // Verificar que foi chamada múltiplas vezes
      expect(mockSetSearchTerm).toHaveBeenCalledTimes(5); // T-E-S-T-E
    });

    /**
     * TESTE: Abrir diálogo de criação
     * Verifica se clique no botão abre diálogo de criação
     */
    test('deve abrir diálogo de criação ao clicar em novo cupom', async () => {
      // ARRANGE: Mock setup e user
      const mockOpenCreateDialog = jest.fn();
      useCouponsManager.mockReturnValue(createMockHook({ 
        openCreateDialog: mockOpenCreateDialog 
      }));
      const user = userEvent.setup();

      // ACT: Renderizar e clicar
      renderWithProviders(<CouponsSection />);
      const createButton = screen.getByText('Novo Cupom');
      await user.click(createButton);

      // ASSERT: Verificar se função foi chamada
      expect(mockOpenCreateDialog).toHaveBeenCalledTimes(1);
    });

    /**
     * TESTE: Ações na tabela - Editar
     * Verifica se botão de editar funciona
     */
    test('deve abrir diálogo de edição ao clicar em editar', async () => {
      // ARRANGE: Mock setup e user
      const mockOpenEditDialog = jest.fn();
      useCouponsManager.mockReturnValue(createMockHook({ 
        openEditDialog: mockOpenEditDialog 
      }));
      const user = userEvent.setup();

      // ACT: Renderizar e clicar no botão editar
      renderWithProviders(<CouponsSection />);
      const editButtons = screen.getAllByLabelText(/Editar cupom/);
      await user.click(editButtons[0]);

      // ASSERT: Verificar se função foi chamada com cupom correto
      expect(mockOpenEditDialog).toHaveBeenCalledWith(mockCoupons[0]);
    });

    /**
     * TESTE: Ações na tabela - Excluir
     * Verifica se botão de excluir funciona
     */
    test('deve abrir diálogo de exclusão ao clicar em excluir', async () => {
      // ARRANGE: Mock setup e user
      const mockOpenDeleteDialog = jest.fn();
      useCouponsManager.mockReturnValue(createMockHook({ 
        openDeleteDialog: mockOpenDeleteDialog 
      }));
      const user = userEvent.setup();

      // ACT: Renderizar e clicar no botão excluir
      renderWithProviders(<CouponsSection />);
      const deleteButtons = screen.getAllByLabelText(/Excluir cupom/);
      await user.click(deleteButtons[0]);

      // ASSERT: Verificar se função foi chamada com cupom correto
      expect(mockOpenDeleteDialog).toHaveBeenCalledWith(mockCoupons[0]);
    });

    /**
     * TESTE: Toggle status do cupom
     * Verifica se alternância de status funciona
     */
    test('deve alternar status do cupom ao clicar no botão', async () => {
      // ARRANGE: Mock setup e user
      const mockToggleStatus = jest.fn();
      useCouponsManager.mockReturnValue(createMockHook({ 
        handleToggleStatus: mockToggleStatus 
      }));
      const user = userEvent.setup();

      // ACT: Renderizar e clicar no botão de status
      renderWithProviders(<CouponsSection />);
      const statusButtons = screen.getAllByLabelText(/Desativar|Ativar/);
      await user.click(statusButtons[0]);

      // ASSERT: Verificar se função foi chamada
      expect(mockToggleStatus).toHaveBeenCalledWith(mockCoupons[0].id);
    });
  });

  /**
   * GRUPO: Testes de Exibição de Dados
   */
  describe('Exibição de Dados', () => {
    /**
     * TESTE: Formatação de valores
     * Verifica se valores são formatados corretamente
     */
    test('deve formatar valores corretamente na tabela', () => {
      // ACT: Renderizar componente
      renderWithProviders(<CouponsSection />);

      // ASSERT: Verificar formatação de porcentagem
      expect(screen.getByText('10%')).toBeInTheDocument();
      
      // ASSERT: Verificar formatação de moeda
      expect(screen.getByText('R$ 20,00')).toBeInTheDocument();
    });

    /**
     * TESTE: Exibição de chips de status
     * Verifica se chips de status são exibidos corretamente
     */
    test('deve exibir chips de status corretamente', () => {
      // ACT: Renderizar componente
      renderWithProviders(<CouponsSection />);

      // ASSERT: Verificar chips de status
      expect(screen.getByText('Ativo')).toBeInTheDocument();
      expect(screen.getByText('Inativo')).toBeInTheDocument();
    });

    /**
     * TESTE: Exibição de dias da semana
     * Verifica se dias ativos são exibidos como chips
     */
    test('deve exibir dias da semana ativos como chips', () => {
      // ACT: Renderizar componente
      renderWithProviders(<CouponsSection />);

      // ASSERT: Verificar presença de chips de dias
      // Os dias específicos dependem dos dados mock
      const dayChips = screen.getAllByText(/Seg|Ter|Qua|Qui|Sex|Sáb|Dom/);
      expect(dayChips.length).toBeGreaterThan(0);
    });

    /**
     * TESTE: Cálculo de uso
     * Verifica se porcentagem de uso é calculada e exibida
     */
    test('deve calcular e exibir porcentagem de uso quando há limite', () => {
      // ACT: Renderizar componente
      renderWithProviders(<CouponsSection />);

      // ASSERT: Verificar cálculo de uso (25/100 = 25%)
      expect(screen.getByText('25% usado')).toBeInTheDocument();
    });
  });

  /**
   * GRUPO: Testes de Diálogos
   */
  describe('Renderização de Diálogos', () => {
    /**
     * TESTE: Renderização de diálogos quando fechados
     * Verifica se diálogos não aparecem quando fechados
     */
    test('não deve renderizar diálogos quando fechados', () => {
      // ACT: Renderizar componente
      renderWithProviders(<CouponsSection />);

      // ASSERT: Verificar que diálogos não estão visíveis
      expect(screen.queryByText('Criar Novo Cupom')).not.toBeInTheDocument();
      expect(screen.queryByText('Editar Cupom')).not.toBeInTheDocument();
      expect(screen.queryByText('Confirmar Exclusão')).not.toBeInTheDocument();
    });

    /**
     * TESTE: Renderização de diálogo de criação aberto
     * Verifica se diálogo aparece quando deve estar aberto
     */
    test('deve renderizar diálogo de criação quando aberto', () => {
      // ARRANGE: Mock com diálogo aberto
      useCouponsManager.mockReturnValue(createMockHook({ 
        isCreateDialogOpen: true 
      }));

      // ACT: Renderizar componente
      renderWithProviders(<CouponsSection />);

      // ASSERT: Verificar que diálogo está presente
      expect(screen.getByText('Criar Novo Cupom')).toBeInTheDocument();
    });
  });
});
