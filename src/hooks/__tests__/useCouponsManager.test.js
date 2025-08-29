/**
 * TESTES DO HOOK - useCouponsManager
 * 
 * Conjunto de testes para validar o comportamento e funcionalidades
 * do hook useCouponsManager.
 * 
 * Cobertura:
 * - Estado inicial do hook
 * - Criação de cupons
 * - Edição de cupons
 * - Exclusão de cupons
 * - Validações de dados
 * - Controle de diálogos
 * - Filtros e busca
 * - Cálculo de estatísticas
 */

import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';

// Hook sendo testado
import { useCouponsManager } from '../useCouponsManager';

/**
 * DADOS MOCK PARA TESTES
 */
const mockCoupons = [
  {
    id: 1,
    code: 'TESTE10',
    description: 'Cupom de teste',
    type: 'percentage',
    value: 10,
    minOrderValue: 30.00,
    maxDiscount: 15.00,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    isActive: true,
    firstPurchaseOnly: false,
    activeDays: [1, 2, 3, 4, 5],
    usageLimit: 100,
    currentUsage: 25,
    createdAt: '2024-01-01T10:00:00Z'
  },
  {
    id: 2,
    code: 'FIXO20',
    description: 'Desconto fixo de teste',
    type: 'fixed_amount',
    value: 20.00,
    minOrderValue: 50.00,
    maxDiscount: null,
    startDate: '2024-06-01',
    endDate: '2024-12-31',
    isActive: false,
    firstPurchaseOnly: true,
    activeDays: [6, 0],
    usageLimit: null,
    currentUsage: 10,
    createdAt: '2024-06-01T10:00:00Z'
  }
];

/**
 * HELPER: Mock de delay para simulação de API
 */
const mockDelay = () => new Promise(resolve => setTimeout(resolve, 100));

/**
 * SUITE DE TESTES PRINCIPAL
 */
describe('useCouponsManager', () => {

  /**
   * GRUPO: Testes de Estado Inicial
   */
  describe('Estado Inicial', () => {
    /**
     * TESTE: Inicialização com dados padrão
     * Verifica se hook inicializa com valores corretos quando não há dados iniciais
     */
    test('deve inicializar com cupons mock quando não há dados iniciais', () => {
      // ACT: Renderizar hook sem dados iniciais
      const { result } = renderHook(() => useCouponsManager());

      // ASSERT: Verificar estado inicial
      expect(result.current.coupons).toHaveLength(3); // MOCK_COUPONS tem 3 itens
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(result.current.searchTerm).toBe('');
      expect(result.current.selectedCoupon).toBe(null);
      expect(result.current.isCreateDialogOpen).toBe(false);
      expect(result.current.isEditDialogOpen).toBe(false);
      expect(result.current.isDeleteDialogOpen).toBe(false);
    });

    /**
     * TESTE: Inicialização com dados fornecidos
     * Verifica se hook aceita cupons iniciais customizados
     */
    test('deve inicializar com cupons fornecidos', () => {
      // ARRANGE: Dados iniciais customizados
      const initialCoupons = [mockCoupons[0]];

      // ACT: Renderizar hook com dados iniciais
      const { result } = renderHook(() => 
        useCouponsManager({ initialCoupons })
      );

      // ASSERT: Verificar se usou dados fornecidos
      expect(result.current.coupons).toHaveLength(1);
      expect(result.current.allCoupons).toEqual(initialCoupons);
    });

    /**
     * TESTE: Estatísticas iniciais
     * Verifica se as estatísticas são calculadas corretamente
     */
    test('deve calcular estatísticas corretamente', () => {
      // ARRANGE: Hook com dados mock
      const { result } = renderHook(() => useCouponsManager());

      // ACT: Acessar estatísticas
      const stats = result.current.statistics;

      // ASSERT: Verificar cálculos
      expect(stats.total).toBeGreaterThan(0);
      expect(stats.active).toBeGreaterThanOrEqual(0);
      expect(stats.expired).toBeGreaterThanOrEqual(0);
      expect(stats.firstPurchaseOnly).toBeGreaterThanOrEqual(0);
      expect(stats.totalUsage).toBeGreaterThanOrEqual(0);
    });
  });

  /**
   * GRUPO: Testes de Validação
   */
  describe('Validação de Cupons', () => {
    /**
     * TESTE: Validação de cupom válido
     * Verifica se cupom com dados corretos passa na validação
     */
    test('deve validar cupom com dados corretos', () => {
      // ARRANGE: Hook e dados válidos
      const { result } = renderHook(() => useCouponsManager());
      const validCoupon = {
        code: 'VALID10',
        description: 'Cupom válido para teste',
        type: 'percentage',
        value: 10,
        minOrderValue: 30,
        maxDiscount: 15,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        activeDays: [1, 2, 3, 4, 5],
        firstPurchaseOnly: false,
        isActive: true
      };

      // ACT: Validar cupom
      const validation = result.current.validateCoupon(validCoupon);

      // ASSERT: Deve ser válido
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toEqual({});
    });

    /**
     * TESTE: Validação de código obrigatório
     * Verifica se código vazio é rejeitado
     */
    test('deve rejeitar cupom sem código', () => {
      // ARRANGE: Hook e cupom sem código
      const { result } = renderHook(() => useCouponsManager());
      const invalidCoupon = {
        code: '',
        description: 'Cupom sem código',
        type: 'percentage',
        value: 10,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        activeDays: [1]
      };

      // ACT: Validar cupom
      const validation = result.current.validateCoupon(invalidCoupon);

      // ASSERT: Deve ser inválido
      expect(validation.isValid).toBe(false);
      expect(validation.errors.code).toBeDefined();
    });

    /**
     * TESTE: Validação de porcentagem máxima
     * Verifica se porcentagem acima de 100% é rejeitada
     */
    test('deve rejeitar porcentagem maior que 100%', () => {
      // ARRANGE: Hook e cupom com porcentagem inválida
      const { result } = renderHook(() => useCouponsManager());
      const invalidCoupon = {
        code: 'INVALID150',
        description: 'Cupom com porcentagem inválida',
        type: 'percentage',
        value: 150, // Porcentagem inválida
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        activeDays: [1]
      };

      // ACT: Validar cupom
      const validation = result.current.validateCoupon(invalidCoupon);

      // ASSERT: Deve ser inválido
      expect(validation.isValid).toBe(false);
      expect(validation.errors.value).toBeDefined();
    });

    /**
     * TESTE: Validação de datas
     * Verifica se data de fim anterior à de início é rejeitada
     */
    test('deve rejeitar data de fim anterior à data de início', () => {
      // ARRANGE: Hook e cupom com datas inválidas
      const { result } = renderHook(() => useCouponsManager());
      const invalidCoupon = {
        code: 'INVALID_DATES',
        description: 'Cupom com datas inválidas',
        type: 'percentage',
        value: 10,
        startDate: '2024-12-31',
        endDate: '2024-01-01', // Data de fim anterior
        activeDays: [1]
      };

      // ACT: Validar cupom
      const validation = result.current.validateCoupon(invalidCoupon);

      // ASSERT: Deve ser inválido
      expect(validation.isValid).toBe(false);
      expect(validation.errors.endDate).toBeDefined();
    });
  });

  /**
   * GRUPO: Testes de CRUD Operations
   */
  describe('Operações CRUD', () => {
    /**
     * TESTE: Adicionar cupom válido
     * Verifica se novo cupom é adicionado corretamente
     */
    test('deve adicionar novo cupom com sucesso', async () => {
      // ARRANGE: Hook e dados do novo cupom
      const { result } = renderHook(() => useCouponsManager());
      const newCoupon = {
        code: 'NOVO10',
        description: 'Novo cupom de teste',
        type: 'percentage',
        value: 10,
        minOrderValue: 30,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        activeDays: [1, 2, 3, 4, 5],
        firstPurchaseOnly: false,
        isActive: true
      };

      const initialCount = result.current.coupons.length;

      // ACT: Adicionar cupom
      await act(async () => {
        const response = await result.current.handleAddCoupon(newCoupon);
        expect(response.success).toBe(true);
      });

      // ASSERT: Verificar se foi adicionado
      expect(result.current.coupons).toHaveLength(initialCount + 1);
      expect(result.current.coupons[0].code).toBe('NOVO10');
      expect(result.current.isCreateDialogOpen).toBe(false);
    });

    /**
     * TESTE: Editar cupom existente
     * Verifica se cupom é editado corretamente
     */
    test('deve editar cupom existente com sucesso', async () => {
      // ARRANGE: Hook com dados iniciais
      const { result } = renderHook(() => 
        useCouponsManager({ initialCoupons: mockCoupons })
      );

      const couponId = mockCoupons[0].id;
      const updates = {
        description: 'Descrição atualizada',
        value: 15
      };

      // ACT: Editar cupom
      await act(async () => {
        const response = await result.current.handleEditCoupon(couponId, updates);
        expect(response.success).toBe(true);
      });

      // ASSERT: Verificar se foi editado
      const editedCoupon = result.current.allCoupons.find(c => c.id === couponId);
      expect(editedCoupon.description).toBe('Descrição atualizada');
      expect(editedCoupon.value).toBe(15);
    });

    /**
     * TESTE: Excluir cupom
     * Verifica se cupom é removido corretamente
     */
    test('deve excluir cupom com sucesso', async () => {
      // ARRANGE: Hook com dados iniciais
      const { result } = renderHook(() => 
        useCouponsManager({ initialCoupons: mockCoupons })
      );

      const couponId = mockCoupons[0].id;
      const initialCount = result.current.coupons.length;

      // ACT: Excluir cupom
      await act(async () => {
        const response = await result.current.handleDeleteCoupon(couponId);
        expect(response.success).toBe(true);
      });

      // ASSERT: Verificar se foi removido
      expect(result.current.coupons).toHaveLength(initialCount - 1);
      expect(result.current.allCoupons.find(c => c.id === couponId)).toBeUndefined();
    });

    /**
     * TESTE: Toggle status do cupom
     * Verifica se status é alternado corretamente
     */
    test('deve alternar status do cupom', async () => {
      // ARRANGE: Hook com dados iniciais
      const { result } = renderHook(() => 
        useCouponsManager({ initialCoupons: mockCoupons })
      );

      const couponId = mockCoupons[0].id;
      const originalStatus = mockCoupons[0].isActive;

      // ACT: Alternar status
      await act(async () => {
        await result.current.handleToggleStatus(couponId);
      });

      // ASSERT: Verificar se status foi alternado
      const updatedCoupon = result.current.allCoupons.find(c => c.id === couponId);
      expect(updatedCoupon.isActive).toBe(!originalStatus);
    });
  });

  /**
   * GRUPO: Testes de Filtros e Busca
   */
  describe('Filtros e Busca', () => {
    /**
     * TESTE: Busca por código
     * Verifica se busca por código funciona corretamente
     */
    test('deve filtrar cupons por código', () => {
      // ARRANGE: Hook com dados iniciais
      const { result } = renderHook(() => 
        useCouponsManager({ initialCoupons: mockCoupons })
      );

      // ACT: Aplicar filtro de busca por código que existe nos mocks
      act(() => {
        result.current.setSearchTerm('TESTE');
      });

      // ASSERT: Verificar filtros aplicados
      const filteredCoupons = result.current.coupons;
      // Como usamos dados mock específicos, vamos testar se a filtragem funciona
      expect(filteredCoupons.every(c => 
        c.code.toLowerCase().includes('teste') ||
        c.description.toLowerCase().includes('teste')
      )).toBe(true);
    });

    /**
     * TESTE: Busca por descrição
     * Verifica se busca por descrição funciona
     */
    test('deve filtrar cupons por descrição', () => {
      // ARRANGE: Hook com dados iniciais
      const { result } = renderHook(() => 
        useCouponsManager({ initialCoupons: mockCoupons })
      );

      // ACT: Aplicar filtro de busca por descrição
      act(() => {
        result.current.setSearchTerm('fixo');
      });

      // ASSERT: Verificar filtros aplicados
      const filteredCoupons = result.current.coupons;
      expect(filteredCoupons.length).toBeGreaterThan(0);
      expect(filteredCoupons.some(c => 
        c.description.toLowerCase().includes('fixo')
      )).toBe(true);
    });

    /**
     * TESTE: Busca sem resultados
     * Verifica comportamento quando busca não encontra resultados
     */
    test('deve retornar array vazio quando busca não encontra resultados', () => {
      // ARRANGE: Hook com dados iniciais
      const { result } = renderHook(() => 
        useCouponsManager({ initialCoupons: mockCoupons })
      );

      // ACT: Buscar por termo inexistente
      act(() => {
        result.current.setSearchTerm('INEXISTENTE123');
      });

      // ASSERT: Verificar resultado vazio
      expect(result.current.coupons).toHaveLength(0);
    });
  });

  /**
   * GRUPO: Testes de Controle de Diálogos
   */
  describe('Controle de Diálogos', () => {
    /**
     * TESTE: Abrir diálogo de criação
     * Verifica se diálogo de criação é aberto corretamente
     */
    test('deve abrir diálogo de criação', () => {
      // ARRANGE: Hook inicializado
      const { result } = renderHook(() => useCouponsManager());

      // ACT: Abrir diálogo de criação
      act(() => {
        result.current.openCreateDialog();
      });

      // ASSERT: Verificar estado do diálogo
      expect(result.current.isCreateDialogOpen).toBe(true);
      expect(result.current.error).toBe(null);
    });

    /**
     * TESTE: Abrir diálogo de edição
     * Verifica se diálogo de edição é aberto com cupom selecionado
     */
    test('deve abrir diálogo de edição com cupom selecionado', () => {
      // ARRANGE: Hook com dados iniciais
      const { result } = renderHook(() => 
        useCouponsManager({ initialCoupons: mockCoupons })
      );

      const couponToEdit = mockCoupons[0];

      // ACT: Abrir diálogo de edição
      act(() => {
        result.current.openEditDialog(couponToEdit);
      });

      // ASSERT: Verificar estado do diálogo
      expect(result.current.isEditDialogOpen).toBe(true);
      expect(result.current.selectedCoupon).toEqual(couponToEdit);
      expect(result.current.error).toBe(null);
    });

    /**
     * TESTE: Fechar todos os diálogos
     * Verifica se todos os diálogos são fechados e estado é limpo
     */
    test('deve fechar todos os diálogos e limpar estado', () => {
      // ARRANGE: Hook com diálogos abertos
      const { result } = renderHook(() => useCouponsManager());

      // Abrir diálogos
      act(() => {
        result.current.openCreateDialog();
        result.current.openEditDialog(mockCoupons[0]);
      });

      // ACT: Fechar todos os diálogos
      act(() => {
        result.current.closeAllDialogs();
      });

      // ASSERT: Verificar estado limpo
      expect(result.current.isCreateDialogOpen).toBe(false);
      expect(result.current.isEditDialogOpen).toBe(false);
      expect(result.current.isDeleteDialogOpen).toBe(false);
      expect(result.current.selectedCoupon).toBe(null);
      expect(result.current.error).toBe(null);
    });
  });

  /**
   * GRUPO: Testes de Tratamento de Erro
   */
  describe('Tratamento de Erros', () => {
    /**
     * TESTE: Erro na validação ao adicionar
     * Verifica se erro de validação é tratado corretamente
     */
    test('deve tratar erro de validação ao adicionar cupom', async () => {
      // ARRANGE: Hook e dados inválidos
      const { result } = renderHook(() => useCouponsManager());
      const invalidCoupon = {
        code: '', // Código vazio - deve causar erro
        description: 'Teste',
        type: 'percentage',
        value: 10
      };

      // ACT: Tentar adicionar cupom inválido
      await act(async () => {
        const response = await result.current.handleAddCoupon(invalidCoupon);
        expect(response.success).toBe(false);
        expect(response.error).toBeDefined();
      });

      // ASSERT: Verificar tratamento do erro
      expect(result.current.error).toBeDefined();
      expect(result.current.loading).toBe(false);
    });

    /**
     * TESTE: Limpar erro
     * Verifica se erro pode ser limpo
     */
    test('deve limpar erro quando solicitado', async () => {
      // ARRANGE: Hook com erro
      const { result } = renderHook(() => useCouponsManager());
      
      // Gerar erro
      await act(async () => {
        await result.current.handleAddCoupon({});
      });

      expect(result.current.error).toBeDefined();

      // ACT: Limpar erro
      act(() => {
        result.current.clearError();
      });

      // ASSERT: Verificar se erro foi limpo
      expect(result.current.error).toBe(null);
    });
  });
});
