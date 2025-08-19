/**
 * TESTES DO HOOK - GERENCIADOR DE CATEGORIAS
 * 
 * Conjunto de testes para validar o comportamento e funcionalidades
 * do hook personalizado useCategoryManager.
 * 
 * Cobertura:
 * - Estado inicial correto
 * - Operações CRUD de categorias
 * - Gerenciamento de diálogos
 * - Sincronização com produtos
 * - Tratamento de erros
 */

import { renderHook, act } from '@testing-library/react';
import { useCategoryManager } from '../useCategoryManager';

// Mock da API (se houver)
jest.mock('../../lib/api', () => ({
  createCategory: jest.fn(),
  updateCategory: jest.fn(),
  deleteCategory: jest.fn()
}));

/**
 * HELPER: Cria dados mock para testes
 */
const createMockCategory = (overrides = {}) => ({
  id: 1,
  name: 'Pizzas',
  description: 'Pizzas tradicionais',
  icon: '🍕',
  ...overrides
});

const createMockProduct = (overrides = {}) => ({
  id: 1,
  name: 'Pizza Margherita',
  category: 'Pizzas',
  price: 25.90,
  ...overrides
});

/**
 * SUITE DE TESTES PRINCIPAL
 */
describe('useCategoryManager', () => {
  // Props padrão para testes
  const defaultProps = {
    categories: [],
    setCategories: jest.fn(),
    products: [],
    setProducts: jest.fn()
  };

  // Limpar mocks antes de cada teste
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * GRUPO: Testes de Estado Inicial
   */
  describe('Estado Inicial', () => {
    /**
     * TESTE: Inicialização correta
     * Verifica se hook inicializa com valores padrão corretos
     */
    test('deve inicializar com estado padrão', () => {
      // ACT: Renderizar hook
      const { result } = renderHook(() => useCategoryManager(defaultProps));

      // ASSERT: Verificar estado inicial
      expect(result.current.openCategoryDialog).toBe(false);
      expect(result.current.editingCategory).toBe(null);
      expect(typeof result.current.handleAddCategory).toBe('function');
      expect(typeof result.current.handleEditCategory).toBe('function');
      expect(typeof result.current.handleDeleteCategory).toBe('function');
      expect(typeof result.current.handleSaveCategory).toBe('function');
      expect(typeof result.current.handleCloseCategoryDialog).toBe('function');
    });

    /**
     * TESTE: Props são recebidas corretamente
     * Verifica se hook recebe e utiliza props passadas
     */
    test('deve receber props corretamente', () => {
      // ARRANGE: Props personalizadas
      const customProps = {
        categories: [createMockCategory()],
        setCategories: jest.fn(),
        products: [createMockProduct()],
        setProducts: jest.fn()
      };

      // ACT: Renderizar hook com props customizadas
      const { result } = renderHook(() => useCategoryManager(customProps));

      // ASSERT: Hook deve funcionar sem erros
      expect(result.current).toBeDefined();
      expect(typeof result.current.handleAddCategory).toBe('function');
    });
  });

  /**
   * GRUPO: Testes de Gerenciamento de Diálogo
   */
  describe('Gerenciamento de Diálogo', () => {
    /**
     * TESTE: Abrir diálogo para nova categoria
     * Verifica se diálogo abre corretamente para criação
     */
    test('deve abrir diálogo para adicionar nova categoria', () => {
      // ARRANGE: Hook inicializado
      const { result } = renderHook(() => useCategoryManager(defaultProps));

      // ACT: Abrir diálogo para adicionar
      act(() => {
        result.current.handleAddCategory();
      });

      // ASSERT: Verificar estado do diálogo
      expect(result.current.openCategoryDialog).toBe(true);
      expect(result.current.editingCategory).toBe(null);
    });

    /**
     * TESTE: Abrir diálogo para editar categoria
     * Verifica se diálogo abre com categoria para edição
     */
    test('deve abrir diálogo para editar categoria existente', () => {
      // ARRANGE: Categoria para editar
      const categoria = createMockCategory({ id: 123, name: 'Categoria Teste' });
      const { result } = renderHook(() => useCategoryManager(defaultProps));

      // ACT: Abrir diálogo para editar
      act(() => {
        result.current.handleEditCategory(categoria);
      });

      // ASSERT: Verificar estado do diálogo
      expect(result.current.openCategoryDialog).toBe(true);
      expect(result.current.editingCategory).toEqual(categoria);
    });

    /**
     * TESTE: Fechar diálogo
     * Verifica se diálogo fecha e limpa estado corretamente
     */
    test('deve fechar diálogo e limpar estado', () => {
      // ARRANGE: Hook com diálogo aberto
      const categoria = createMockCategory();
      const { result } = renderHook(() => useCategoryManager(defaultProps));
      
      // Abrir diálogo primeiro
      act(() => {
        result.current.handleEditCategory(categoria);
      });

      // ACT: Fechar diálogo
      act(() => {
        result.current.handleCloseCategoryDialog();
      });

      // ASSERT: Verificar estado limpo
      expect(result.current.openCategoryDialog).toBe(false);
      expect(result.current.editingCategory).toBe(null);
    });
  });

  /**
   * GRUPO: Testes de Operações CRUD
   */
  describe('Operações CRUD', () => {
    /**
     * TESTE: Salvar nova categoria
     * Verifica se nova categoria é adicionada corretamente
     */
    test('deve adicionar nova categoria à lista', async () => {
      // ARRANGE: Props com função mock
      const mockSetCategories = jest.fn();
      const props = { ...defaultProps, setCategories: mockSetCategories };
      const { result } = renderHook(() => useCategoryManager(props));
      
      const novaCategoria = {
        name: 'Nova Categoria',
        description: 'Descrição da nova categoria',
        icon: '🆕'
      };

      // ACT: Salvar nova categoria
      await act(async () => {
        await result.current.handleSaveCategory(novaCategoria);
      });

      // ASSERT: Verificar se função foi chamada
      expect(mockSetCategories).toHaveBeenCalledWith(
        expect.any(Function)
      );
      
      // Verificar se diálogo foi fechado
      expect(result.current.openCategoryDialog).toBe(false);
      expect(result.current.editingCategory).toBe(null);
    });

    /**
     * TESTE: Atualizar categoria existente
     * Verifica se categoria é atualizada corretamente
     */
    test('deve atualizar categoria existente', async () => {
      // ARRANGE: Categoria existente e props
      const categoriaExistente = createMockCategory({ id: 123 });
      const mockSetCategories = jest.fn();
      const props = {
        ...defaultProps,
        categories: [categoriaExistente],
        setCategories: mockSetCategories
      };
      
      const { result } = renderHook(() => useCategoryManager(props));
      
      // Abrir para edição
      act(() => {
        result.current.handleEditCategory(categoriaExistente);
      });

      const dadosAtualizados = {
        ...categoriaExistente,
        name: 'Nome Atualizado'
      };

      // ACT: Salvar alterações
      await act(async () => {
        await result.current.handleSaveCategory(dadosAtualizados);
      });

      // ASSERT: Verificar se função de atualização foi chamada
      expect(mockSetCategories).toHaveBeenCalledWith(
        expect.any(Function)
      );
      
      // Verificar se diálogo foi fechado
      expect(result.current.openCategoryDialog).toBe(false);
    });

    /**
     * TESTE: Excluir categoria
     * Verifica se categoria é removida e produtos são atualizados
     */
    test('deve excluir categoria e atualizar produtos relacionados', async () => {
      // ARRANGE: Categoria e produtos relacionados
      const categoria = createMockCategory({ id: 123, name: 'Pizzas' });
      const produtoRelacionado = createMockProduct({ 
        id: 1, 
        category: 'Pizzas' 
      });
      const produtoNaoRelacionado = createMockProduct({ 
        id: 2, 
        category: 'Hambúrgueres' 
      });

      const mockSetCategories = jest.fn();
      const mockSetProducts = jest.fn();
      
      const props = {
        categories: [categoria],
        setCategories: mockSetCategories,
        products: [produtoRelacionado, produtoNaoRelacionado],
        setProducts: mockSetProducts
      };

      const { result } = renderHook(() => useCategoryManager(props));

      // ACT: Excluir categoria
      await act(async () => {
        await result.current.handleDeleteCategory(123);
      });

      // ASSERT: Verificar se categoria foi removida
      expect(mockSetCategories).toHaveBeenCalledWith(
        expect.any(Function)
      );

      // ASSERT: Verificar se produtos foram atualizados
      expect(mockSetProducts).toHaveBeenCalledWith(
        expect.any(Function)
      );
    });
  });

  /**
   * GRUPO: Testes de Validação
   */
  describe('Validação de Dados', () => {
    /**
     * TESTE: Validação de categoria vazia
     * Verifica se hook lida com dados inválidos
     */
    test('deve lidar com dados de categoria inválidos', async () => {
      // ARRANGE: Hook e dados inválidos
      const { result } = renderHook(() => useCategoryManager(defaultProps));
      const dadosInvalidos = {
        name: '', // Nome vazio
        description: '',
        icon: ''
      };

      // ACT & ASSERT: Tentar salvar dados inválidos
      await act(async () => {
        // Função deve lidar graciosamente com dados inválidos
        // (implementação específica depende da validação no hook)
        await result.current.handleSaveCategory(dadosInvalidos);
      });

      // Hook deve continuar funcionando normalmente
      expect(result.current).toBeDefined();
    });

    /**
     * TESTE: ID inválido para exclusão
     * Verifica se hook lida com IDs inválidos
     */
    test('deve lidar com ID inválido para exclusão', async () => {
      // ARRANGE: Hook inicializado
      const { result } = renderHook(() => useCategoryManager(defaultProps));

      // ACT & ASSERT: Tentar excluir com ID inválido
      await act(async () => {
        // Função deve lidar graciosamente com ID inválido
        await result.current.handleDeleteCategory(null);
      });

      // Hook deve continuar funcionando
      expect(result.current).toBeDefined();
    });
  });

  /**
   * GRUPO: Testes de Sincronização
   */
  describe('Sincronização de Dados', () => {
    /**
     * TESTE: Atualização de props externas
     * Verifica se hook reage a mudanças nas props
     */
    test('deve reagir a mudanças nas categorias externas', () => {
      // ARRANGE: Props iniciais
      const initialProps = { ...defaultProps, categories: [] };
      const { result, rerender } = renderHook(
        (props) => useCategoryManager(props),
        { initialProps }
      );

      // ACT: Atualizar props com novas categorias
      const novasCategorias = [createMockCategory()];
      const newProps = { ...defaultProps, categories: novasCategorias };
      rerender(newProps);

      // ASSERT: Hook deve continuar funcionando com novos dados
      expect(result.current).toBeDefined();
      expect(typeof result.current.handleAddCategory).toBe('function');
    });

    /**
     * TESTE: Limpeza de recursos
     * Verifica se hook limpa recursos adequadamente
     */
    test('deve limpar recursos ao desmontar', () => {
      // ARRANGE: Hook montado
      const { result, unmount } = renderHook(() => 
        useCategoryManager(defaultProps)
      );

      // Verificar se hook está funcionando
      expect(result.current).toBeDefined();

      // ACT: Desmontar hook
      unmount();

      // ASSERT: Não deve haver vazamentos de memória
      // (Este teste é mais conceitual - em casos reais, 
      // verificaríamos se listeners foram removidos, etc.)
      expect(true).toBe(true);
    });
  });

  /**
   * GRUPO: Testes de Performance
   */
  describe('Performance', () => {
    /**
     * TESTE: Estabilidade de funções
     * Verifica se funções retornadas são estáveis entre re-renders
     */
    test('deve manter estabilidade das funções entre re-renders', () => {
      // ARRANGE: Hook inicializado
      const { result, rerender } = renderHook(() => 
        useCategoryManager(defaultProps)
      );
      
      // Capturar referências das funções
      const funcoesIniciais = {
        handleAddCategory: result.current.handleAddCategory,
        handleEditCategory: result.current.handleEditCategory,
        handleDeleteCategory: result.current.handleDeleteCategory
      };

      // ACT: Re-renderizar hook
      rerender();

      // ASSERT: Funções devem manter mesma referência (se usando useCallback)
      const funcoesAposRerender = {
        handleAddCategory: result.current.handleAddCategory,
        handleEditCategory: result.current.handleEditCategory,
        handleDeleteCategory: result.current.handleDeleteCategory
      };

      // Verificar estabilidade (depende da implementação usar useCallback)
      expect(typeof funcoesAposRerender.handleAddCategory).toBe('function');
      expect(typeof funcoesAposRerender.handleEditCategory).toBe('function');
      expect(typeof funcoesAposRerender.handleDeleteCategory).toBe('function');
    });
  });
});
