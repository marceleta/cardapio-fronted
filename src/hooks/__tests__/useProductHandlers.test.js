/**
 * TESTES DO HOOK - HANDLERS DE PRODUTOS
 * 
 * Conjunto de testes para validar o comportamento e funcionalidades
 * do hook responsável por gerenciar ações CRUD de produtos.
 * 
 * Cobertura:
 * - Abertura de diálogo para adicionar produto
 * - Abertura de diálogo para editar produto
 * - Exclusão de produtos com confirmação
 * - Salvamento de novos produtos
 * - Atualização de produtos existentes
 * - Gerenciamento de estado de diálogos
 */

import { renderHook, act } from '@testing-library/react';
import { useProductHandlers } from '../useProductHandlers';

/**
 * HELPER: Cria props mock para o hook
 */
const createMockProps = (overrides = {}) => ({
  products: [
    { id: 1, name: 'Pizza Margherita', price: 25.90, category: 'Pizzas' },
    { id: 2, name: 'Pizza Pepperoni', price: 28.90, category: 'Pizzas' },
    { id: 3, name: 'Hambúrguer Clássico', price: 18.50, category: 'Hambúrgueres' }
  ],
  setProducts: jest.fn(),
  setOpenProductDialog: jest.fn(),
  setEditingProduct: jest.fn(),
  ...overrides
});

/**
 * SUITE DE TESTES PRINCIPAL
 */
describe('useProductHandlers', () => {
  // Limpar mocks antes de cada teste
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock do window.confirm
    global.confirm = jest.fn();
  });

  // Restaurar mocks após todos os testes
  afterAll(() => {
    global.confirm.mockRestore?.();
  });

  /**
   * GRUPO: Testes de Inicialização
   */
  describe('Inicialização', () => {
    /**
     * TESTE: Hook retorna todas as funções necessárias
     * Verifica se hook inicializa com interface completa
     */
    test('deve retornar todas as funções handler', () => {
      // ARRANGE: Props mock
      const props = createMockProps();

      // ACT: Renderizar hook
      const { result } = renderHook(() => useProductHandlers(props));

      // ASSERT: Verificar interface do hook
      expect(typeof result.current.handleAddProduct).toBe('function');
      expect(typeof result.current.handleEditProduct).toBe('function');
      expect(typeof result.current.handleDeleteProduct).toBe('function');
      expect(typeof result.current.handleSaveProduct).toBe('function');
    });

    /**
     * TESTE: Hook funciona com props mínimas
     * Verifica se hook inicializa mesmo com props básicas
     */
    test('deve funcionar com props mínimas', () => {
      // ARRANGE: Props mínimas
      const props = {
        products: [],
        setProducts: jest.fn(),
        setOpenProductDialog: jest.fn(),
        setEditingProduct: jest.fn()
      };

      // ACT: Renderizar hook
      const { result } = renderHook(() => useProductHandlers(props));

      // ASSERT: Hook deve funcionar sem erros
      expect(result.current).toBeDefined();
      expect(typeof result.current.handleAddProduct).toBe('function');
    });
  });

  /**
   * GRUPO: Testes de Adicionar Produto
   */
  describe('Adicionar Produto', () => {
    /**
     * TESTE: Abertura de diálogo para novo produto
     * Verifica se diálogo é aberto corretamente para criação
     */
    test('deve abrir diálogo para adicionar novo produto', () => {
      // ARRANGE: Props mock
      const props = createMockProps();

      const { result } = renderHook(() => useProductHandlers(props));

      // ACT: Chamar função de adicionar
      act(() => {
        result.current.handleAddProduct();
      });

      // ASSERT: Verificar chamadas das funções
      expect(props.setEditingProduct).toHaveBeenCalledWith(null);
      expect(props.setOpenProductDialog).toHaveBeenCalledWith(true);
    });

    /**
     * TESTE: Estado limpo para novo produto
     * Verifica se estado é limpo ao adicionar novo produto
     */
    test('deve limpar produto em edição ao adicionar novo', () => {
      // ARRANGE: Props mock
      const mockSetEditingProduct = jest.fn();
      const mockSetOpenProductDialog = jest.fn();
      
      const props = createMockProps({
        setEditingProduct: mockSetEditingProduct,
        setOpenProductDialog: mockSetOpenProductDialog
      });

      const { result } = renderHook(() => useProductHandlers(props));

      // ACT: Adicionar produto
      act(() => {
        result.current.handleAddProduct();
      });

      // ASSERT: Produto em edição deve ser limpo
      expect(mockSetEditingProduct).toHaveBeenCalledWith(null);
      expect(mockSetEditingProduct).toHaveBeenCalledTimes(1);
      
      // ASSERT: Diálogo deve ser aberto
      expect(mockSetOpenProductDialog).toHaveBeenCalledWith(true);
      expect(mockSetOpenProductDialog).toHaveBeenCalledTimes(1);
    });
  });

  /**
   * GRUPO: Testes de Editar Produto
   */
  describe('Editar Produto', () => {
    /**
     * TESTE: Abertura de diálogo para editar produto
     * Verifica se diálogo é aberto com produto correto para edição
     */
    test('deve abrir diálogo para editar produto existente', () => {
      // ARRANGE: Props e produto para edição
      const props = createMockProps();
      const produtoEdicao = { id: 5, name: 'Produto Edição', price: 15.00 };

      const { result } = renderHook(() => useProductHandlers(props));

      // ACT: Chamar função de editar
      act(() => {
        result.current.handleEditProduct(produtoEdicao);
      });

      // ASSERT: Verificar chamadas corretas
      expect(props.setEditingProduct).toHaveBeenCalledWith(produtoEdicao);
      expect(props.setOpenProductDialog).toHaveBeenCalledWith(true);
    });

    /**
     * TESTE: Edição com produto diferente
     * Verifica se diferentes produtos podem ser editados
     */
    test('deve permitir editar diferentes produtos', () => {
      // ARRANGE: Props mock
      const props = createMockProps();
      const produto1 = { id: 1, name: 'Produto 1', price: 10.00 };
      const produto2 = { id: 2, name: 'Produto 2', price: 20.00 };

      const { result } = renderHook(() => useProductHandlers(props));

      // ACT: Editar primeiro produto
      act(() => {
        result.current.handleEditProduct(produto1);
      });

      // ASSERT: Verificar primeira edição
      expect(props.setEditingProduct).toHaveBeenCalledWith(produto1);

      // ACT: Editar segundo produto
      act(() => {
        result.current.handleEditProduct(produto2);
      });

      // ASSERT: Verificar segunda edição
      expect(props.setEditingProduct).toHaveBeenCalledWith(produto2);
      expect(props.setOpenProductDialog).toHaveBeenCalledTimes(2);
    });
  });

  /**
   * GRUPO: Testes de Excluir Produto
   */
  describe('Excluir Produto', () => {
    /**
     * TESTE: Exclusão com confirmação positiva
     * Verifica se produto é excluído quando usuário confirma
     */
    test('deve excluir produto quando usuário confirma', () => {
      // ARRANGE: Props mock com confirmação positiva
      global.confirm.mockReturnValue(true);
      const mockSetProducts = jest.fn();
      const produtosIniciais = [
        { id: 1, name: 'Produto 1' },
        { id: 2, name: 'Produto 2' },
        { id: 3, name: 'Produto 3' }
      ];

      const props = createMockProps({
        products: produtosIniciais,
        setProducts: mockSetProducts
      });

      const { result } = renderHook(() => useProductHandlers(props));

      // ACT: Excluir produto ID 2
      act(() => {
        result.current.handleDeleteProduct(2);
      });

      // ASSERT: Verificar confirmação foi chamada
      expect(global.confirm).toHaveBeenCalledWith(
        'Tem certeza que deseja excluir este produto?'
      );

      // ASSERT: Verificar produto foi removido
      expect(mockSetProducts).toHaveBeenCalledWith([
        { id: 1, name: 'Produto 1' },
        { id: 3, name: 'Produto 3' }
      ]);
    });

    /**
     * TESTE: Cancelamento da exclusão
     * Verifica se produto não é excluído quando usuário cancela
     */
    test('não deve excluir produto quando usuário cancela', () => {
      // ARRANGE: Props mock com confirmação negativa
      global.confirm.mockReturnValue(false);
      const mockSetProducts = jest.fn();
      
      const props = createMockProps({
        setProducts: mockSetProducts
      });

      const { result } = renderHook(() => useProductHandlers(props));

      // ACT: Tentar excluir produto
      act(() => {
        result.current.handleDeleteProduct(1);
      });

      // ASSERT: Confirmação deve ter sido chamada
      expect(global.confirm).toHaveBeenCalledWith(
        'Tem certeza que deseja excluir este produto?'
      );

      // ASSERT: setProducts não deve ter sido chamado
      expect(mockSetProducts).not.toHaveBeenCalled();
    });

    /**
     * TESTE: Exclusão de produto inexistente
     * Verifica comportamento ao tentar excluir produto que não existe
     */
    test('deve lidar com exclusão de produto inexistente', () => {
      // ARRANGE: Props mock com confirmação positiva
      global.confirm.mockReturnValue(true);
      const mockSetProducts = jest.fn();
      const produtosIniciais = [
        { id: 1, name: 'Produto 1' },
        { id: 2, name: 'Produto 2' }
      ];

      const props = createMockProps({
        products: produtosIniciais,
        setProducts: mockSetProducts
      });

      const { result } = renderHook(() => useProductHandlers(props));

      // ACT: Tentar excluir produto inexistente
      act(() => {
        result.current.handleDeleteProduct(999);
      });

      // ASSERT: Lista deve continuar igual (filtro não encontra o ID)
      expect(mockSetProducts).toHaveBeenCalledWith(produtosIniciais);
    });
  });

  /**
   * GRUPO: Testes de Salvar Produto
   */
  describe('Salvar Produto', () => {
    /**
     * TESTE: Salvamento de novo produto
     * Verifica se novo produto é adicionado corretamente
     */
    test('deve adicionar novo produto à lista', () => {
      // ARRANGE: Props mock
      const mockSetProducts = jest.fn();
      const mockSetOpenProductDialog = jest.fn();
      const mockSetEditingProduct = jest.fn();
      
      const produtosExistentes = [
        { id: 1, name: 'Produto 1', price: 10.00 },
        { id: 2, name: 'Produto 2', price: 20.00 }
      ];

      const props = createMockProps({
        products: produtosExistentes,
        setProducts: mockSetProducts,
        setOpenProductDialog: mockSetOpenProductDialog,
        setEditingProduct: mockSetEditingProduct
      });

      const { result } = renderHook(() => useProductHandlers(props));

      const novoProduto = {
        name: 'Produto Novo',
        price: 15.00,
        category: 'Nova Categoria',
        description: 'Descrição do novo produto'
      };

      // ACT: Salvar novo produto (sem ID)
      act(() => {
        result.current.handleSaveProduct(novoProduto);
      });

      // ASSERT: Produto deve ser adicionado com ID gerado
      expect(mockSetProducts).toHaveBeenCalledWith([
        ...produtosExistentes,
        {
          ...novoProduto,
          id: 3 // ID gerado baseado no maior ID existente + 1
        }
      ]);

      // ASSERT: Diálogo deve ser fechado e edição limpa
      expect(mockSetOpenProductDialog).toHaveBeenCalledWith(false);
      expect(mockSetEditingProduct).toHaveBeenCalledWith(null);
    });

    /**
     * TESTE: Atualização de produto existente
     * Verifica se produto existente é atualizado corretamente
     */
    test('deve atualizar produto existente', () => {
      // ARRANGE: Props mock
      const mockSetProducts = jest.fn();
      const mockSetOpenProductDialog = jest.fn();
      const mockSetEditingProduct = jest.fn();
      
      const produtosExistentes = [
        { id: 1, name: 'Produto 1', price: 10.00, category: 'Cat1' },
        { id: 2, name: 'Produto 2', price: 20.00, category: 'Cat2' },
        { id: 3, name: 'Produto 3', price: 30.00, category: 'Cat3' }
      ];

      const props = createMockProps({
        products: produtosExistentes,
        setProducts: mockSetProducts,
        setOpenProductDialog: mockSetOpenProductDialog,
        setEditingProduct: mockSetEditingProduct
      });

      const { result } = renderHook(() => useProductHandlers(props));

      const produtoAtualizado = {
        id: 2,
        name: 'Produto 2 Atualizado',
        price: 25.00,
        category: 'Cat2 Nova',
        description: 'Nova descrição'
      };

      // ACT: Salvar produto existente (com ID)
      act(() => {
        result.current.handleSaveProduct(produtoAtualizado);
      });

      // ASSERT: Produto específico deve ser atualizado na lista
      expect(mockSetProducts).toHaveBeenCalledWith([
        { id: 1, name: 'Produto 1', price: 10.00, category: 'Cat1' },
        produtoAtualizado,
        { id: 3, name: 'Produto 3', price: 30.00, category: 'Cat3' }
      ]);

      // ASSERT: Estados de diálogo devem ser limpos
      expect(mockSetOpenProductDialog).toHaveBeenCalledWith(false);
      expect(mockSetEditingProduct).toHaveBeenCalledWith(null);
    });

    /**
     * TESTE: Geração de ID para lista vazia
     * Verifica se ID é gerado corretamente quando não há produtos
     */
    test('deve gerar ID 1 para lista vazia', () => {
      // ARRANGE: Props com lista vazia
      const mockSetProducts = jest.fn();
      
      const props = createMockProps({
        products: [],
        setProducts: mockSetProducts
      });

      const { result } = renderHook(() => useProductHandlers(props));

      const novoProduto = {
        name: 'Primeiro Produto',
        price: 10.00
      };

      // ACT: Salvar primeiro produto
      act(() => {
        result.current.handleSaveProduct(novoProduto);
      });

      // ASSERT: ID deve ser 1
      expect(mockSetProducts).toHaveBeenCalledWith([
        {
          ...novoProduto,
          id: 1
        }
      ]);
    });

    /**
     * TESTE: Preservação de propriedades existentes na atualização
     * Verifica se propriedades não enviadas são preservadas
     */
    test('deve preservar propriedades não atualizadas', () => {
      // ARRANGE: Produto com várias propriedades
      const produtoOriginal = {
        id: 1,
        name: 'Produto Original',
        price: 15.00,
        category: 'Categoria Original',
        description: 'Descrição original',
        imageUrl: '/image.jpg',
        available: true
      };

      const mockSetProducts = jest.fn();
      const props = createMockProps({
        products: [produtoOriginal],
        setProducts: mockSetProducts
      });

      const { result } = renderHook(() => useProductHandlers(props));

      // Atualização parcial (apenas nome e preço)
      const atualizacaoParcial = {
        id: 1,
        name: 'Produto Atualizado',
        price: 18.00
      };

      // ACT: Salvar atualização parcial
      act(() => {
        result.current.handleSaveProduct(atualizacaoParcial);
      });

      // ASSERT: Propriedades originais devem ser preservadas
      expect(mockSetProducts).toHaveBeenCalledWith([
        {
          id: 1,
          name: 'Produto Atualizado', // Atualizado
          price: 18.00, // Atualizado
          category: 'Categoria Original', // Preservado
          description: 'Descrição original', // Preservado
          imageUrl: '/image.jpg', // Preservado
          available: true // Preservado
        }
      ]);
    });
  });

  /**
   * GRUPO: Testes de Integração e Casos Extremos
   */
  describe('Integração e Casos Extremos', () => {
    /**
     * TESTE: Fluxo completo de CRUD
     * Verifica se operações podem ser realizadas em sequência
     */
    test('deve executar fluxo completo de CRUD', () => {
      // ARRANGE: Props mock
      const mockSetProducts = jest.fn();
      const mockSetOpenProductDialog = jest.fn();
      const mockSetEditingProduct = jest.fn();
      global.confirm.mockReturnValue(true);

      let produtos = [
        { id: 1, name: 'Produto 1', price: 10.00 }
      ];

      const props = createMockProps({
        products: produtos,
        setProducts: mockSetProducts,
        setOpenProductDialog: mockSetOpenProductDialog,
        setEditingProduct: mockSetEditingProduct
      });

      const { result } = renderHook(() => useProductHandlers(props));

      // ACT 1: Adicionar produto
      act(() => {
        result.current.handleAddProduct();
      });

      // ACT 2: Editar produto
      act(() => {
        result.current.handleEditProduct(produtos[0]);
      });

      // ACT 3: Salvar novo produto
      act(() => {
        result.current.handleSaveProduct({
          name: 'Produto Novo',
          price: 25.00
        });
      });

      // ACT 4: Excluir produto
      act(() => {
        result.current.handleDeleteProduct(1);
      });

      // ASSERT: Todas as operações devem ter sido executadas
      expect(mockSetEditingProduct).toHaveBeenCalledWith(null); // Adicionar
      expect(mockSetEditingProduct).toHaveBeenCalledWith(produtos[0]); // Editar
      expect(mockSetProducts).toHaveBeenCalledTimes(2); // Salvar + Excluir
      expect(global.confirm).toHaveBeenCalledTimes(1); // Confirmar exclusão
    });

    /**
     * TESTE: Comportamento com props inválidas
     * Verifica robustez com dados inválidos
     */
    test('deve lidar com props inválidas graciosamente', () => {
      // ARRANGE: Props com valores nulos/undefined
      const props = {
        products: null,
        setProducts: jest.fn(),
        setOpenProductDialog: jest.fn(),
        setEditingProduct: jest.fn()
      };

      // ACT & ASSERT: Hook deve funcionar sem erros
      expect(() => {
        const { result } = renderHook(() => useProductHandlers(props));
        
        // Tentar usar as funções não deve causar erro
        act(() => {
          result.current.handleAddProduct();
        });
        
      }).not.toThrow();
    });

    /**
     * TESTE: Performance com grande quantidade de produtos
     * Verifica se hook funciona bem com muitos produtos
     */
    test('deve funcionar com grande quantidade de produtos', () => {
      // ARRANGE: Lista com muitos produtos
      const muitosProdutos = Array.from({ length: 1000 }, (_, index) => ({
        id: index + 1,
        name: `Produto ${index + 1}`,
        price: (index + 1) * 10
      }));

      const mockSetProducts = jest.fn();
      const props = createMockProps({
        products: muitosProdutos,
        setProducts: mockSetProducts
      });

      const { result } = renderHook(() => useProductHandlers(props));

      // ACT: Salvar novo produto
      act(() => {
        result.current.handleSaveProduct({
          name: 'Produto 1001',
          price: 10010
        });
      });

      // ASSERT: Operação deve funcionar normalmente
      expect(mockSetProducts).toHaveBeenCalledWith([
        ...muitosProdutos,
        {
          name: 'Produto 1001',
          price: 10010,
          id: 1001 // ID gerado corretamente
        }
      ]);
    });
  });
});
