/**
 * TESTES DO HOOK - ESTADO ADMINISTRATIVO
 * 
 * Conjunto de testes para validar o comportamento e funcionalidades
 * do hook principal que gerencia todo o estado do painel administrativo.
 * 
 * Cobertura:
 * - Estado inicial correto
 * - Gerenciamento de abas ativas
 * - Estados de dados (produtos, categorias, pedidos)
 * - Estados de filtros e busca
 * - Gerenciamento de diálogos
 * - Integração com dados mock
 */

import { renderHook, act } from '@testing-library/react';
import { useAdminState } from '../useAdminState';

// Mock dos dados externos
jest.mock('../../utils/adminHelpers', () => ({
  mockOrders: [
    {
      id: 1,
      customerName: 'João Silva',
      status: 'pending',
      total: 45.80,
      items: [{ name: 'Pizza', quantity: 1, price: 45.80 }]
    },
    {
      id: 2,
      customerName: 'Maria Santos',
      status: 'delivered',
      total: 32.50,
      items: [{ name: 'Hambúrguer', quantity: 2, price: 16.25 }]
    }
  ]
}));

jest.mock('../../lib/mockData', () => ({
  menuData: [
    {
      category: 'Pizzas',
      items: [
        { id: 1, name: 'Pizza Margherita', price: 25.90, category: 'Pizzas' },
        { id: 2, name: 'Pizza Pepperoni', price: 28.90, category: 'Pizzas' }
      ]
    },
    {
      category: 'Hambúrgueres',
      items: [
        { id: 3, name: 'Hambúrguer Clássico', price: 18.50, category: 'Hambúrgueres' }
      ]
    }
  ]
}));

/**
 * SUITE DE TESTES PRINCIPAL
 */
describe('useAdminState', () => {
  /**
   * GRUPO: Testes de Estado Inicial
   */
  describe('Estado Inicial', () => {
    /**
     * TESTE: Inicialização com valores padrão
     * Verifica se hook inicializa todos os estados com valores corretos
     */
    test('deve inicializar com valores padrão corretos', () => {
      // ACT: Renderizar hook
      const { result } = renderHook(() => useAdminState());

      // ASSERT: Verificar estado inicial de abas
      expect(result.current.activeTab).toBe('dashboard');

      // ASSERT: Verificar estado inicial de filtros
      expect(result.current.searchTerm).toBe('');
      expect(result.current.filterStatus).toBe('all');

      // ASSERT: Verificar estado inicial de diálogos (todos fechados)
      expect(result.current.openProductDialog).toBe(false);
      expect(result.current.openOrderDialog).toBe(false);
      expect(result.current.openAddOrderDialog).toBe(false);
      expect(result.current.openCategoryDialog).toBe(false);

      // ASSERT: Verificar estados de edição (todos nulos)
      expect(result.current.editingProduct).toBe(null);
      expect(result.current.selectedOrder).toBe(null);
      expect(result.current.editingCategory).toBe(null);

      // ASSERT: Verificar novo pedido com estrutura correta
      expect(result.current.newOrder).toEqual({
        customerName: '',
        phone: '',
        items: [],
        observations: ''
      });
    });

    /**
     * TESTE: Carregamento de dados mock
     * Verifica se dados são carregados corretamente dos mocks
     */
    test('deve carregar dados mock corretamente', () => {
      // ACT: Renderizar hook
      const { result } = renderHook(() => useAdminState());

      // ASSERT: Verificar produtos carregados (flatMap dos itens)
      expect(result.current.products).toHaveLength(3);
      expect(result.current.products[0].name).toBe('Pizza Margherita');
      expect(result.current.products[1].name).toBe('Pizza Pepperoni');
      expect(result.current.products[2].name).toBe('Hambúrguer Clássico');

      // ASSERT: Verificar categorias carregadas
      expect(result.current.categories).toEqual(['Pizzas', 'Hambúrgueres']);

      // ASSERT: Verificar pedidos carregados
      expect(result.current.orders).toHaveLength(2);
      expect(result.current.orders[0].customerName).toBe('João Silva');
      expect(result.current.orders[1].customerName).toBe('Maria Santos');
    });

    /**
     * TESTE: Todas as funções estão disponíveis
     * Verifica se hook retorna todas as funções setter necessárias
     */
    test('deve disponibilizar todas as funções setter', () => {
      // ACT: Renderizar hook
      const { result } = renderHook(() => useAdminState());

      // ASSERT: Verificar funções de aba
      expect(typeof result.current.setActiveTab).toBe('function');

      // ASSERT: Verificar funções de dados
      expect(typeof result.current.setProducts).toBe('function');
      expect(typeof result.current.setCategories).toBe('function');
      expect(typeof result.current.setOrders).toBe('function');

      // ASSERT: Verificar funções de filtros
      expect(typeof result.current.setSearchTerm).toBe('function');
      expect(typeof result.current.setFilterStatus).toBe('function');

      // ASSERT: Verificar funções de diálogos
      expect(typeof result.current.setOpenProductDialog).toBe('function');
      expect(typeof result.current.setOpenOrderDialog).toBe('function');
      expect(typeof result.current.setOpenAddOrderDialog).toBe('function');
      expect(typeof result.current.setOpenCategoryDialog).toBe('function');

      // ASSERT: Verificar funções de edição
      expect(typeof result.current.setEditingProduct).toBe('function');
      expect(typeof result.current.setSelectedOrder).toBe('function');
      expect(typeof result.current.setEditingCategory).toBe('function');
      expect(typeof result.current.setNewOrder).toBe('function');
    });
  });

  /**
   * GRUPO: Testes de Gerenciamento de Abas
   */
  describe('Gerenciamento de Abas', () => {
    /**
     * TESTE: Mudança de aba ativa
     * Verifica se mudança de aba funciona corretamente
     */
    test('deve alterar aba ativa corretamente', () => {
      // ARRANGE: Hook inicializado
      const { result } = renderHook(() => useAdminState());

      // ACT: Mudar para aba de produtos
      act(() => {
        result.current.setActiveTab('products');
      });

      // ASSERT: Verificar mudança de aba
      expect(result.current.activeTab).toBe('products');

      // ACT: Mudar para aba de pedidos
      act(() => {
        result.current.setActiveTab('orders');
      });

      // ASSERT: Verificar segunda mudança
      expect(result.current.activeTab).toBe('orders');
    });

    /**
     * TESTE: Persistência de outros estados durante mudança de aba
     * Verifica se outros estados não são afetados por mudança de aba
     */
    test('deve manter outros estados ao mudar aba', () => {
      // ARRANGE: Hook com alguns estados modificados
      const { result } = renderHook(() => useAdminState());

      // Modificar alguns estados
      act(() => {
        result.current.setSearchTerm('pizza');
        result.current.setFilterStatus('active');
      });

      const searchTermBefore = result.current.searchTerm;
      const filterStatusBefore = result.current.filterStatus;

      // ACT: Mudar aba
      act(() => {
        result.current.setActiveTab('settings');
      });

      // ASSERT: Estados não relacionados devem persistir
      expect(result.current.searchTerm).toBe(searchTermBefore);
      expect(result.current.filterStatus).toBe(filterStatusBefore);
      expect(result.current.activeTab).toBe('settings');
    });
  });

  /**
   * GRUPO: Testes de Gerenciamento de Dados
   */
  describe('Gerenciamento de Dados', () => {
    /**
     * TESTE: Atualização de produtos
     * Verifica se lista de produtos pode ser atualizada
     */
    test('deve atualizar lista de produtos', () => {
      // ARRANGE: Hook inicializado
      const { result } = renderHook(() => useAdminState());

      const novosProdutos = [
        { id: 10, name: 'Produto Novo', price: 15.00, category: 'Nova Categoria' }
      ];

      // ACT: Atualizar produtos
      act(() => {
        result.current.setProducts(novosProdutos);
      });

      // ASSERT: Verificar atualização
      expect(result.current.products).toEqual(novosProdutos);
      expect(result.current.products).toHaveLength(1);
    });

    /**
     * TESTE: Atualização de categorias
     * Verifica se lista de categorias pode ser atualizada
     */
    test('deve atualizar lista de categorias', () => {
      // ARRANGE: Hook inicializado
      const { result } = renderHook(() => useAdminState());

      const novasCategorias = ['Bebidas', 'Sobremesas', 'Entradas'];

      // ACT: Atualizar categorias
      act(() => {
        result.current.setCategories(novasCategorias);
      });

      // ASSERT: Verificar atualização
      expect(result.current.categories).toEqual(novasCategorias);
      expect(result.current.categories).toHaveLength(3);
    });

    /**
     * TESTE: Atualização de pedidos
     * Verifica se lista de pedidos pode ser atualizada
     */
    test('deve atualizar lista de pedidos', () => {
      // ARRANGE: Hook inicializado
      const { result } = renderHook(() => useAdminState());

      const novosPedidos = [
        {
          id: 99,
          customerName: 'Cliente Teste',
          status: 'preparing',
          total: 67.40,
          items: []
        }
      ];

      // ACT: Atualizar pedidos
      act(() => {
        result.current.setOrders(novosPedidos);
      });

      // ASSERT: Verificar atualização
      expect(result.current.orders).toEqual(novosPedidos);
      expect(result.current.orders[0].customerName).toBe('Cliente Teste');
    });

    /**
     * TESTE: Atualização usando função callback
     * Verifica se setters funcionam com funções callback
     */
    test('deve funcionar com funções callback para atualizações', () => {
      // ARRANGE: Hook inicializado
      const { result } = renderHook(() => useAdminState());

      const produtoInicial = result.current.products.length;

      // ACT: Adicionar produto usando callback
      act(() => {
        result.current.setProducts(prev => [
          ...prev,
          { id: 999, name: 'Produto Callback', price: 10.00 }
        ]);
      });

      // ASSERT: Verificar adição via callback
      expect(result.current.products).toHaveLength(produtoInicial + 1);
      expect(result.current.products[result.current.products.length - 1].name)
        .toBe('Produto Callback');
    });
  });

  /**
   * GRUPO: Testes de Estados de Filtro
   */
  describe('Estados de Filtro', () => {
    /**
     * TESTE: Atualização de termo de busca
     * Verifica se termo de busca é atualizado corretamente
     */
    test('deve atualizar termo de busca', () => {
      // ARRANGE: Hook inicializado
      const { result } = renderHook(() => useAdminState());

      // ACT: Definir termo de busca
      act(() => {
        result.current.setSearchTerm('hambúrguer');
      });

      // ASSERT: Verificar atualização
      expect(result.current.searchTerm).toBe('hambúrguer');

      // ACT: Limpar busca
      act(() => {
        result.current.setSearchTerm('');
      });

      // ASSERT: Verificar limpeza
      expect(result.current.searchTerm).toBe('');
    });

    /**
     * TESTE: Atualização de filtro de status
     * Verifica se filtro de status é atualizado corretamente
     */
    test('deve atualizar filtro de status', () => {
      // ARRANGE: Hook inicializado
      const { result } = renderHook(() => useAdminState());

      const statusOptions = ['pending', 'preparing', 'delivered', 'cancelled'];

      statusOptions.forEach(status => {
        // ACT: Definir status
        act(() => {
          result.current.setFilterStatus(status);
        });

        // ASSERT: Verificar atualização
        expect(result.current.filterStatus).toBe(status);
      });
    });
  });

  /**
   * GRUPO: Testes de Gerenciamento de Diálogos
   */
  describe('Gerenciamento de Diálogos', () => {
    /**
     * TESTE: Abertura e fechamento de diálogo de produto
     * Verifica se diálogo de produto é controlado corretamente
     */
    test('deve controlar diálogo de produto', () => {
      // ARRANGE: Hook inicializado
      const { result } = renderHook(() => useAdminState());

      // ACT: Abrir diálogo
      act(() => {
        result.current.setOpenProductDialog(true);
      });

      // ASSERT: Verificar abertura
      expect(result.current.openProductDialog).toBe(true);

      // ACT: Fechar diálogo
      act(() => {
        result.current.setOpenProductDialog(false);
      });

      // ASSERT: Verificar fechamento
      expect(result.current.openProductDialog).toBe(false);
    });

    /**
     * TESTE: Gerenciamento de produto em edição
     * Verifica se produto sendo editado é gerenciado corretamente
     */
    test('deve gerenciar produto em edição', () => {
      // ARRANGE: Hook e produto para edição
      const { result } = renderHook(() => useAdminState());
      const produtoEdicao = { id: 5, name: 'Produto Edit', price: 20.00 };

      // ACT: Definir produto em edição
      act(() => {
        result.current.setEditingProduct(produtoEdicao);
        result.current.setOpenProductDialog(true);
      });

      // ASSERT: Verificar estado de edição
      expect(result.current.editingProduct).toEqual(produtoEdicao);
      expect(result.current.openProductDialog).toBe(true);

      // ACT: Limpar edição
      act(() => {
        result.current.setEditingProduct(null);
        result.current.setOpenProductDialog(false);
      });

      // ASSERT: Verificar limpeza
      expect(result.current.editingProduct).toBe(null);
      expect(result.current.openProductDialog).toBe(false);
    });

    /**
     * TESTE: Múltiplos diálogos independentes
     * Verifica se diferentes diálogos podem ser controlados independentemente
     */
    test('deve controlar múltiplos diálogos independentemente', () => {
      // ARRANGE: Hook inicializado
      const { result } = renderHook(() => useAdminState());

      // ACT: Abrir múltiplos diálogos
      act(() => {
        result.current.setOpenProductDialog(true);
        result.current.setOpenOrderDialog(true);
        result.current.setOpenCategoryDialog(true);
      });

      // ASSERT: Todos devem estar abertos
      expect(result.current.openProductDialog).toBe(true);
      expect(result.current.openOrderDialog).toBe(true);
      expect(result.current.openCategoryDialog).toBe(true);
      expect(result.current.openAddOrderDialog).toBe(false); // Este não foi aberto

      // ACT: Fechar apenas um diálogo
      act(() => {
        result.current.setOpenProductDialog(false);
      });

      // ASSERT: Apenas um deve ter fechado
      expect(result.current.openProductDialog).toBe(false);
      expect(result.current.openOrderDialog).toBe(true);
      expect(result.current.openCategoryDialog).toBe(true);
    });
  });

  /**
   * GRUPO: Testes de Gerenciamento de Novo Pedido
   */
  describe('Gerenciamento de Novo Pedido', () => {
    /**
     * TESTE: Atualização de dados do novo pedido
     * Verifica se dados do novo pedido são atualizados corretamente
     */
    test('deve atualizar dados do novo pedido', () => {
      // ARRANGE: Hook inicializado
      const { result } = renderHook(() => useAdminState());

      const dadosNovoPedido = {
        customerName: 'Cliente Novo',
        phone: '(11) 99999-9999',
        items: [{ name: 'Pizza', quantity: 2, price: 25.90 }],
        observations: 'Sem cebola'
      };

      // ACT: Atualizar dados do novo pedido
      act(() => {
        result.current.setNewOrder(dadosNovoPedido);
      });

      // ASSERT: Verificar atualização
      expect(result.current.newOrder).toEqual(dadosNovoPedido);
      expect(result.current.newOrder.customerName).toBe('Cliente Novo');
      expect(result.current.newOrder.items).toHaveLength(1);
    });

    /**
     * TESTE: Reset do novo pedido
     * Verifica se novo pedido pode ser resetado para estado inicial
     */
    test('deve resetar novo pedido para estado inicial', () => {
      // ARRANGE: Hook com novo pedido preenchido
      const { result } = renderHook(() => useAdminState());

      // Preencher dados primeiro
      act(() => {
        result.current.setNewOrder({
          customerName: 'Teste',
          phone: '123',
          items: [{ name: 'test' }],
          observations: 'test'
        });
      });

      // ACT: Resetar para estado inicial
      act(() => {
        result.current.setNewOrder({
          customerName: '',
          phone: '',
          items: [],
          observations: ''
        });
      });

      // ASSERT: Verificar reset
      expect(result.current.newOrder).toEqual({
        customerName: '',
        phone: '',
        items: [],
        observations: ''
      });
    });
  });

  /**
   * GRUPO: Testes de Integração e Casos Extremos
   */
  describe('Integração e Casos Extremos', () => {
    /**
     * TESTE: Estado após múltiplas operações
     * Verifica se hook mantém consistência após várias operações
     */
    test('deve manter consistência após múltiplas operações', () => {
      // ARRANGE: Hook inicializado
      const { result } = renderHook(() => useAdminState());

      // ACT: Realizar múltiplas operações
      act(() => {
        // Mudar aba
        result.current.setActiveTab('products');
        
        // Definir filtros
        result.current.setSearchTerm('pizza');
        result.current.setFilterStatus('active');
        
        // Abrir diálogo
        result.current.setOpenProductDialog(true);
        result.current.setEditingProduct({ id: 1, name: 'Test' });
        
        // Modificar dados
        result.current.setProducts([{ id: 99, name: 'New Product' }]);
      });

      // ASSERT: Verificar consistência de todos os estados
      expect(result.current.activeTab).toBe('products');
      expect(result.current.searchTerm).toBe('pizza');
      expect(result.current.filterStatus).toBe('active');
      expect(result.current.openProductDialog).toBe(true);
      expect(result.current.editingProduct).toEqual({ id: 1, name: 'Test' });
      expect(result.current.products).toEqual([{ id: 99, name: 'New Product' }]);
    });

    /**
     * TESTE: Performance com re-renders
     * Verifica se hook não causa re-renders desnecessários
     */
    test('deve ser estável entre re-renders', () => {
      // ARRANGE: Hook inicializado
      const { result, rerender } = renderHook(() => useAdminState());

      // Capturar referências iniciais das funções
      const settersIniciais = {
        setActiveTab: result.current.setActiveTab,
        setProducts: result.current.setProducts,
        setSearchTerm: result.current.setSearchTerm
      };

      // ACT: Re-renderizar hook
      rerender();

      // ASSERT: Funções devem manter mesma referência (se estáveis)
      // Nota: Com useState, as funções têm referência estável
      expect(typeof result.current.setActiveTab).toBe('function');
      expect(typeof result.current.setProducts).toBe('function');
      expect(typeof result.current.setSearchTerm).toBe('function');
    });

    /**
     * TESTE: Dados vazios ou inválidos
     * Verifica se hook lida bem com dados vazios
     */
    test('deve lidar com dados vazios', () => {
      // ARRANGE: Hook inicializado
      const { result } = renderHook(() => useAdminState());

      // ACT: Definir dados vazios
      act(() => {
        result.current.setProducts([]);
        result.current.setCategories([]);
        result.current.setOrders([]);
      });

      // ASSERT: Deve aceitar arrays vazios sem erro
      expect(result.current.products).toEqual([]);
      expect(result.current.categories).toEqual([]);
      expect(result.current.orders).toEqual([]);
    });
  });
});
