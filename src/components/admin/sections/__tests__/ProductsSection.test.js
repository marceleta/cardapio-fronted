/**
 * TESTES DO COMPONENTE - SEÇÃO DE PRODUTOS
 * 
 * Conjunto de testes para validar o comportamento e funcionalidades
 * da seção de produtos do painel administrativo.
 * 
 * Cobertura:
 * - Renderização correta com diferentes estados
 * - Funcionalidade de busca em tempo real
 * - Interações do usuário (buscar, adicionar produto)
 * - Integração com gerenciamento de categorias
 * - Estados vazios e de erro
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Componente sendo testado
import ProductsSection from '../ProductsSection';

// Mock dos hooks e utilitários
jest.mock('../../../../hooks/useCategoryManager', () => ({
  useCategoryManager: jest.fn()
}));

jest.mock('../../../../utils/adminHelpers', () => ({
  filterProducts: jest.fn()
}));

// Importações para mocks
import { useCategoryManager } from '../../../../hooks/useCategoryManager';
import { filterProducts } from '../../../../utils/adminHelpers';

/**
 * HELPER: Renderiza componente com providers necessários
 */
const renderWithProviders = (component) => {
  const theme = createTheme();
  
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

/**
 * HELPER: Cria dados mock para testes
 */
const createMockProduct = (overrides = {}) => ({
  id: 1,
  name: 'Pizza Margherita',
  price: 25.90,
  description: 'Pizza clássica italiana',
  category: 'Pizzas',
  imageUrl: '/pizza.jpg',
  ...overrides
});

const createMockCategory = (overrides = {}) => ({
  id: 1,
  name: 'Pizzas',
  description: 'Pizzas tradicionais',
  icon: '🍕',
  ...overrides
});

/**
 * SUITE DE TESTES PRINCIPAL
 */
describe('ProductsSection', () => {
  // Props padrão para testes
  const defaultProps = {
    products: [],
    setProducts: jest.fn(),
    categories: [],
    setCategories: jest.fn(),
    searchTerm: '',
    setSearchTerm: jest.fn(),
    onAddProduct: jest.fn(),
    onEditProduct: jest.fn(),
    onDeleteProduct: jest.fn()
  };

  // Mock padrão do hook de categorias
  const mockCategoryManager = {
    handleAddCategory: jest.fn(),
    handleEditCategory: jest.fn(),
    handleDeleteCategory: jest.fn(),
    handleCloseCategoryDialog: jest.fn(),
    handleSaveCategory: jest.fn(),
    openCategoryDialog: false,
    editingCategory: null
  };

  // Configuração antes de cada teste
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Configurar mocks padrão
    useCategoryManager.mockReturnValue(mockCategoryManager);
    filterProducts.mockImplementation((products, searchTerm) => 
      products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  /**
   * GRUPO: Testes de Renderização Básica
   */
  describe('Renderização', () => {
    /**
     * TESTE: Renderização de elementos principais
     * Verifica se todos os elementos essenciais estão presentes na tela
     */
    test('deve renderizar elementos principais da seção', () => {
      // ARRANGE: Props básicas
      const props = { ...defaultProps };

      // ACT: Renderizar componente
      renderWithProviders(<ProductsSection {...props} />);

      // ASSERT: Verificar elementos principais
      expect(screen.getByText('🍔 Gerenciar Produtos')).toBeInTheDocument();
      expect(screen.getByText(/🍽️ Produtos/)).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Buscar produtos...')).toBeInTheDocument();
      expect(screen.getByText('Novo Produto')).toBeInTheDocument();
    });

    /**
     * TESTE: Contador de produtos
     * Verifica se o contador de produtos é exibido corretamente
     */
    test('deve exibir contador correto de produtos', () => {
      // ARRANGE: Props com produtos
      const produtos = [
        createMockProduct({ id: 1, name: 'Pizza 1' }),
        createMockProduct({ id: 2, name: 'Pizza 2' })
      ];
      const props = { ...defaultProps, products: produtos };
      
      // Mock retorna todos os produtos (sem filtro)
      filterProducts.mockReturnValue(produtos);

      // ACT: Renderizar
      renderWithProviders(<ProductsSection {...props} />);

      // ASSERT: Verificar contador
      expect(screen.getByText('🍽️ Produtos (2)')).toBeInTheDocument();
    });

    /**
     * TESTE: Renderização de produtos
     * Verifica se os cards de produtos são renderizados corretamente
     */
    test('deve renderizar cards de produtos com informações corretas', () => {
      // ARRANGE: Produto para teste
      const produto = createMockProduct({
        name: 'Pizza Especial',
        price: 32.50,
        description: 'Pizza com ingredientes especiais'
      });
      const props = { ...defaultProps, products: [produto] };
      
      filterProducts.mockReturnValue([produto]);

      // ACT: Renderizar
      renderWithProviders(<ProductsSection {...props} />);

      // ASSERT: Verificar informações do produto
      expect(screen.getByText('Pizza Especial')).toBeInTheDocument();
      expect(screen.getByText('R$ 32,50')).toBeInTheDocument();
      expect(screen.getByText('Pizza com ingredientes especiais')).toBeInTheDocument();
      expect(screen.getByText('Editar')).toBeInTheDocument();
      expect(screen.getByText('Excluir')).toBeInTheDocument();
    });
  });

  /**
   * GRUPO: Testes de Funcionalidade de Busca
   */
  describe('Funcionalidade de Busca', () => {
    /**
     * TESTE: Campo de busca funcional
     * Verifica se o campo de busca chama a função de atualização
     */
    test('deve atualizar termo de busca ao digitar', async () => {
      // ARRANGE: Props com função mock
      const mockSetSearchTerm = jest.fn();
      const props = { ...defaultProps, setSearchTerm: mockSetSearchTerm };

      // ACT: Renderizar e digitar
      renderWithProviders(<ProductsSection {...props} />);
      const campoBusca = screen.getByPlaceholderText('Buscar produtos...');
      fireEvent.change(campoBusca, { target: { value: 'pizza' } });

      // ASSERT: Verificar se função foi chamada
      await waitFor(() => {
        expect(mockSetSearchTerm).toHaveBeenCalledWith('pizza');
      });
    });

    /**
     * TESTE: Filtragem de produtos
     * Verifica se os produtos são filtrados corretamente
     */
    test('deve filtrar produtos baseado no termo de busca', () => {
      // ARRANGE: Produtos e termo de busca
      const produtos = [
        createMockProduct({ id: 1, name: 'Pizza Margherita' }),
        createMockProduct({ id: 2, name: 'Hambúrguer Clássico' })
      ];
      const props = { 
        ...defaultProps, 
        products: produtos,
        searchTerm: 'pizza'
      };

      // Mock simula filtragem
      filterProducts.mockReturnValue([produtos[0]]);

      // ACT: Renderizar
      renderWithProviders(<ProductsSection {...props} />);

      // ASSERT: Verificar se função de filtro foi chamada corretamente
      expect(filterProducts).toHaveBeenCalledWith(produtos, 'pizza');
      expect(screen.getByText('Pizza Margherita')).toBeInTheDocument();
    });
  });

  /**
   * GRUPO: Testes de Interações do Usuário
   */
  describe('Interações do Usuário', () => {
    /**
     * TESTE: Botão adicionar produto
     * Verifica se callback é chamado ao clicar no botão
     */
    test('deve chamar onAddProduct ao clicar em "Novo Produto"', async () => {
      // ARRANGE: Props com função mock
      const mockOnAddProduct = jest.fn();
      const props = { ...defaultProps, onAddProduct: mockOnAddProduct };

      // ACT: Renderizar e clicar
      renderWithProviders(<ProductsSection {...props} />);
      const botaoAdicionar = screen.getByText('Novo Produto');
      fireEvent.click(botaoAdicionar);

      // ASSERT: Verificar chamada da função
      await waitFor(() => {
        expect(mockOnAddProduct).toHaveBeenCalledTimes(1);
      });
    });

    /**
     * TESTE: Botão editar produto
     * Verifica se callback de edição é chamado com produto correto
     */
    test('deve chamar onEditProduct com produto correto', async () => {
      // ARRANGE: Produto e função mock
      const produto = createMockProduct();
      const mockOnEditProduct = jest.fn();
      const props = { 
        ...defaultProps, 
        products: [produto],
        onEditProduct: mockOnEditProduct
      };
      
      filterProducts.mockReturnValue([produto]);

      // ACT: Renderizar e clicar em editar
      renderWithProviders(<ProductsSection {...props} />);
      const botaoEditar = screen.getByText('Editar');
      fireEvent.click(botaoEditar);

      // ASSERT: Verificar chamada com produto correto
      await waitFor(() => {
        expect(mockOnEditProduct).toHaveBeenCalledWith(produto);
      });
    });

    /**
     * TESTE: Botão excluir produto
     * Verifica se callback de exclusão é chamado com ID correto
     */
    test('deve chamar onDeleteProduct com ID correto', async () => {
      // ARRANGE: Produto e função mock
      const produto = createMockProduct({ id: 123 });
      const mockOnDeleteProduct = jest.fn();
      const props = { 
        ...defaultProps, 
        products: [produto],
        onDeleteProduct: mockOnDeleteProduct
      };
      
      filterProducts.mockReturnValue([produto]);

      // ACT: Renderizar e clicar em excluir
      renderWithProviders(<ProductsSection {...props} />);
      const botaoExcluir = screen.getByText('Excluir');
      fireEvent.click(botaoExcluir);

      // ASSERT: Verificar chamada com ID correto
      await waitFor(() => {
        expect(mockOnDeleteProduct).toHaveBeenCalledWith(123);
      });
    });
  });

  /**
   * GRUPO: Testes do Seletor de Visualização
   */
  describe('Seletor de Visualização', () => {
    /**
     * TESTE: Renderização dos botões de toggle
     * Verifica se os botões de visualização estão presentes
     */
    test('deve renderizar botões de seleção de visualização', () => {
      // ARRANGE: Props básicas
      const props = { ...defaultProps };

      // ACT: Renderizar componente
      renderWithProviders(<ProductsSection {...props} />);

      // ASSERT: Verificar presença dos botões
      expect(screen.getByRole('button', { name: /visualização em cards/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /visualização em lista/i })).toBeInTheDocument();
    });

    /**
     * TESTE: Visualização padrão em lista
     * Verifica se inicia com visualização em lista
     */
    test('deve iniciar com visualização em lista por padrão', () => {
      // ARRANGE: Props com produtos
      const produto = createMockProduct();
      const props = { ...defaultProps, products: [produto] };
      filterProducts.mockReturnValue([produto]);

      // ACT: Renderizar
      renderWithProviders(<ProductsSection {...props} />);

      // ASSERT: Verificar que há tabela (lista) visível por padrão
      expect(screen.getByRole('table')).toBeInTheDocument();
      
      // Verificar cabeçalhos da tabela
      expect(screen.getByText('Produto')).toBeInTheDocument();
      expect(screen.getByText('Categoria')).toBeInTheDocument();
      expect(screen.getByText('Preço')).toBeInTheDocument();
      expect(screen.getByText('Ações')).toBeInTheDocument();
    });

    /**
     * TESTE: Alternância para visualização em cards
     * Verifica se alterna corretamente para visualização em cards
     */
    test('deve alternar para visualização em cards quando clicado', async () => {
      // ARRANGE: Props com produtos
      const produto = createMockProduct();
      const props = { ...defaultProps, products: [produto] };
      filterProducts.mockReturnValue([produto]);

      // ACT: Renderizar e clicar no botão de cards
      renderWithProviders(<ProductsSection {...props} />);
      
      // Verificar que começou em lista
      expect(screen.getByRole('table')).toBeInTheDocument();
      
      const botaoCards = screen.getByRole('button', { name: /visualização em cards/i });
      fireEvent.click(botaoCards);

      // ASSERT: Verificar se mudou para formato de cards
      await waitFor(() => {
        expect(screen.queryByRole('table')).not.toBeInTheDocument();
      });
    });

    /**
     * TESTE: Volta para visualização em lista
     * Verifica se consegue voltar para lista após estar em cards
     */
    test('deve voltar para visualização em lista quando clicado', async () => {
      // ARRANGE: Props com produtos
      const produto = createMockProduct();
      const props = { ...defaultProps, products: [produto] };
      filterProducts.mockReturnValue([produto]);

      // ACT: Renderizar, ir para cards e voltar para lista
      renderWithProviders(<ProductsSection {...props} />);
      
      // Primeiro vai para cards
      const botaoCards = screen.getByRole('button', { name: /visualização em cards/i });
      fireEvent.click(botaoCards);
      
      await waitFor(() => {
        expect(screen.queryByRole('table')).not.toBeInTheDocument();
      });

      // Depois volta para lista
      const botaoLista = screen.getByRole('button', { name: /visualização em lista/i });
      fireEvent.click(botaoLista);

      // ASSERT: Verificar que tabela está visível novamente
      await waitFor(() => {
        expect(screen.getByRole('table')).toBeInTheDocument();
      });
    });

    /**
     * TESTE: Funcionalidade em ambas as visualizações
     * Verifica se botões funcionam em ambos os modos
     */
    test('deve manter funcionalidade de botões em ambas as visualizações', async () => {
      // ARRANGE: Produto e função mock
      const produto = createMockProduct({ id: 456 });
      const mockOnEditProduct = jest.fn();
      const props = { 
        ...defaultProps, 
        products: [produto],
        onEditProduct: mockOnEditProduct
      };
      filterProducts.mockReturnValue([produto]);

      // ACT: Renderizar e testar em modo lista (padrão)
      renderWithProviders(<ProductsSection {...props} />);
      
      // Testar edição em modo lista
      let botaoEditar = screen.getByText('Editar');
      fireEvent.click(botaoEditar);
      expect(mockOnEditProduct).toHaveBeenCalledWith(produto);

      // Alternar para cards
      const botaoCards = screen.getByRole('button', { name: /visualização em cards/i });
      fireEvent.click(botaoCards);
      
      await waitFor(() => {
        expect(screen.queryByRole('table')).not.toBeInTheDocument();
      });

      // Testar edição em modo cards
      mockOnEditProduct.mockClear();
      botaoEditar = screen.getByText('Editar');
      fireEvent.click(botaoEditar);

      // ASSERT: Verificar que funciona em ambos os modos
      expect(mockOnEditProduct).toHaveBeenCalledWith(produto);
    });

    /**
     * TESTE: Dados corretos na visualização em lista
     * Verifica se informações são exibidas corretamente na tabela
     */
    test('deve exibir informações corretas na visualização em lista', async () => {
      // ARRANGE: Produto com dados específicos
      const produto = createMockProduct({
        name: 'Produto Teste Lista',
        price: 19.99,
        category: 'Categoria Teste'
      });
      const props = { ...defaultProps, products: [produto] };
      filterProducts.mockReturnValue([produto]);

      // ACT: Renderizar e alternar para lista
      renderWithProviders(<ProductsSection {...props} />);
      const botaoLista = screen.getByRole('button', { name: /visualização em lista/i });
      fireEvent.click(botaoLista);

      await waitFor(() => {
        expect(screen.getByRole('table')).toBeInTheDocument();
      });

      // ASSERT: Verificar se dados estão corretos
      expect(screen.getByText('Produto Teste Lista')).toBeInTheDocument();
      expect(screen.getByText('R$ 19,99')).toBeInTheDocument();
      expect(screen.getByText('Categoria Teste')).toBeInTheDocument();
    });

    /**
     * TESTE: Acessibilidade do seletor
     * Verifica se elementos têm labels apropriados
     */
    test('deve ter labels de acessibilidade apropriados', () => {
      // ARRANGE: Props básicas
      const props = { ...defaultProps };

      // ACT: Renderizar
      renderWithProviders(<ProductsSection {...props} />);

      // ASSERT: Verificar labels de acessibilidade
      expect(screen.getByLabelText('modo de visualização')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /visualização em cards/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /visualização em lista/i })).toBeInTheDocument();
    });
  });

  /**
   * GRUPO: Testes de Estados Especiais
   */
  describe('Estados Especiais', () => {
    /**
     * TESTE: Estado vazio sem busca
     * Verifica mensagem quando não há produtos
     */
    test('deve exibir mensagem adequada quando não há produtos', () => {
      // ARRANGE: Props sem produtos
      const props = { ...defaultProps, products: [] };
      filterProducts.mockReturnValue([]);

      // ACT: Renderizar
      renderWithProviders(<ProductsSection {...props} />);

      // ASSERT: Verificar mensagem de estado vazio
      expect(screen.getByText('🔍 Nenhum produto encontrado')).toBeInTheDocument();
      expect(screen.getByText(/Adicione seu primeiro produto/)).toBeInTheDocument();
    });

    /**
     * TESTE: Estado vazio com busca
     * Verifica mensagem quando busca não retorna resultados
     */
    test('deve exibir mensagem de busca quando não há resultados', () => {
      // ARRANGE: Props com produtos mas busca sem resultados
      const produtos = [createMockProduct()];
      const props = { 
        ...defaultProps, 
        products: produtos,
        searchTerm: 'termo inexistente'
      };
      
      // Mock retorna array vazio (busca sem resultados)
      filterProducts.mockReturnValue([]);

      // ACT: Renderizar
      renderWithProviders(<ProductsSection {...props} />);

      // ASSERT: Verificar mensagem de busca
      expect(screen.getByText('🔍 Nenhum produto encontrado')).toBeInTheDocument();
      expect(screen.getByText(/Tente ajustar os filtros/)).toBeInTheDocument();
    });

    /**
     * TESTE: Contador com produtos filtrados
     * Verifica se contador reflete produtos filtrados, não total
     */
    test('deve exibir contador baseado em produtos filtrados', () => {
      // ARRANGE: 3 produtos, mas filtro retorna apenas 1
      const produtos = [
        createMockProduct({ id: 1 }),
        createMockProduct({ id: 2 }),
        createMockProduct({ id: 3 })
      ];
      const props = { ...defaultProps, products: produtos };
      
      // Mock simula filtro que retorna apenas 1 produto
      filterProducts.mockReturnValue([produtos[0]]);

      // ACT: Renderizar
      renderWithProviders(<ProductsSection {...props} />);

      // ASSERT: Contador deve mostrar 1, não 3
      expect(screen.getByText('🍽️ Produtos (1)')).toBeInTheDocument();
    });
  });

  /**
   * GRUPO: Testes de Integração com Categorias
   */
  describe('Integração com Categorias', () => {
    /**
     * TESTE: Componente CategoryManager é renderizado
     * Verifica se gerenciador de categorias está presente
     */
    test('deve renderizar componente de gerenciamento de categorias', () => {
      // ARRANGE: Props padrão
      const props = { ...defaultProps };

      // ACT: Renderizar
      renderWithProviders(<ProductsSection {...props} />);

      // ASSERT: Verificar se CategoryManager está presente
      // (Verificamos indiretamente através do hook sendo chamado)
      expect(useCategoryManager).toHaveBeenCalled();
    });
  });
});
