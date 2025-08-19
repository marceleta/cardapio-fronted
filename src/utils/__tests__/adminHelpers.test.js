/**
 * TESTES DE FUNÇÕES UTILITÁRIAS - HELPERS ADMINISTRATIVOS
 * 
 * Conjunto de testes para validar o comportamento das funções
 * utilitárias usadas no painel administrativo.
 * 
 * Cobertura:
 * - Filtragem de produtos
 * - Formatação de dados
 * - Validações
 * - Transformações de dados
 * - Casos extremos e edge cases
 */

import {
  filterProducts,
  formatPrice,
  validateProductData,
  calculateCategoryStats,
  sortProductsByCategory
} from '../adminHelpers';

/**
 * HELPER: Cria dados mock para testes
 */
const createMockProduct = (overrides = {}) => ({
  id: 1,
  name: 'Produto Teste',
  price: 25.90,
  description: 'Descrição do produto',
  category: 'Categoria Teste',
  imageUrl: '/test-image.jpg',
  ...overrides
});

/**
 * SUITE DE TESTES PRINCIPAL
 */
describe('Funções Utilitárias Administrativas', () => {

  /**
   * GRUPO: Testes da função filterProducts
   */
  describe('filterProducts', () => {
    /**
     * TESTE: Filtragem por nome do produto
     * Verifica se busca por nome funciona corretamente (case-insensitive)
     */
    test('deve filtrar produtos por nome (case-insensitive)', () => {
      // ARRANGE: Lista de produtos para teste
      const produtos = [
        createMockProduct({ id: 1, name: 'Pizza Margherita' }),
        createMockProduct({ id: 2, name: 'Hambúrguer Clássico' }),
        createMockProduct({ id: 3, name: 'Pizza Calabresa' }),
        createMockProduct({ id: 4, name: 'Salada Caesar' })
      ];

      // ACT: Aplicar filtro por nome
      const resultado = filterProducts(produtos, 'pizza');

      // ASSERT: Verificar resultados filtrados
      expect(resultado).toHaveLength(2);
      expect(resultado[0].name).toBe('Pizza Margherita');
      expect(resultado[1].name).toBe('Pizza Calabresa');
    });

    /**
     * TESTE: Filtragem por categoria
     * Verifica se busca inclui categoria do produto
     */
    test('deve filtrar produtos por categoria', () => {
      // ARRANGE: Produtos de diferentes categorias
      const produtos = [
        createMockProduct({ id: 1, name: 'Produto A', category: 'Pizzas' }),
        createMockProduct({ id: 2, name: 'Produto B', category: 'Hambúrgueres' }),
        createMockProduct({ id: 3, name: 'Produto C', category: 'Pizzas' })
      ];

      // ACT: Filtrar por categoria
      const resultado = filterProducts(produtos, 'hambúrguer');

      // ASSERT: Deve encontrar produto da categoria Hambúrgueres
      expect(resultado).toHaveLength(1);
      expect(resultado[0].category).toBe('Hambúrgueres');
    });

    /**
     * TESTE: Filtragem por descrição
     * Verifica se busca inclui descrição do produto
     */
    test('deve filtrar produtos por descrição', () => {
      // ARRANGE: Produtos com descrições específicas
      const produtos = [
        createMockProduct({ 
          id: 1, 
          name: 'Produto A', 
          description: 'Deliciosa pizza italiana' 
        }),
        createMockProduct({ 
          id: 2, 
          name: 'Produto B', 
          description: 'Hambúrguer artesanal' 
        })
      ];

      // ACT: Filtrar por palavra na descrição
      const resultado = filterProducts(produtos, 'italiana');

      // ASSERT: Deve encontrar produto com descrição correspondente
      expect(resultado).toHaveLength(1);
      expect(resultado[0].description).toContain('italiana');
    });

    /**
     * TESTE: Busca vazia retorna todos produtos
     * Verifica comportamento com termo de busca vazio
     */
    test('deve retornar todos produtos quando busca está vazia', () => {
      // ARRANGE: Lista de produtos
      const produtos = [
        createMockProduct({ id: 1 }),
        createMockProduct({ id: 2 }),
        createMockProduct({ id: 3 })
      ];

      // ACT: Filtrar com termo vazio
      const resultado = filterProducts(produtos, '');

      // ASSERT: Todos produtos devem ser retornados
      expect(resultado).toEqual(produtos);
      expect(resultado).toHaveLength(3);
    });

    /**
     * TESTE: Busca sem resultados
     * Verifica comportamento quando nenhum produto corresponde
     */
    test('deve retornar array vazio quando nenhum produto corresponde', () => {
      // ARRANGE: Produtos que não correspondem à busca
      const produtos = [
        createMockProduct({ name: 'Pizza', category: 'Pizzas' }),
        createMockProduct({ name: 'Hambúrguer', category: 'Hambúrgueres' })
      ];

      // ACT: Buscar termo que não existe
      const resultado = filterProducts(produtos, 'sushi');

      // ASSERT: Array vazio deve ser retornado
      expect(resultado).toEqual([]);
      expect(resultado).toHaveLength(0);
    });

    /**
     * TESTE: Tratamento de dados inválidos
     * Verifica robustez com entradas inválidas
     */
    test('deve lidar graciosamente com dados inválidos', () => {
      // ACT & ASSERT: Testar diferentes entradas inválidas
      expect(filterProducts(null, 'busca')).toEqual([]);
      expect(filterProducts(undefined, 'busca')).toEqual([]);
      expect(filterProducts([], null)).toEqual([]);
      expect(filterProducts([], undefined)).toEqual([]);
    });
  });

  /**
   * GRUPO: Testes da função formatPrice
   */
  describe('formatPrice', () => {
    /**
     * TESTE: Formatação básica de preços
     * Verifica se preços são formatados corretamente para real brasileiro
     */
    test('deve formatar preços para moeda brasileira', () => {
      // ARRANGE & ACT & ASSERT: Testar diferentes valores
      const casos = [
        { entrada: 10, esperado: 'R$ 10,00' },
        { entrada: 15.5, esperado: 'R$ 15,50' },
        { entrada: 999.99, esperado: 'R$ 999,99' },
        { entrada: 1234.56, esperado: 'R$ 1.234,56' },
        { entrada: 0, esperado: 'R$ 0,00' }
      ];

      casos.forEach(({ entrada, esperado }) => {
        const resultado = formatPrice(entrada);
        expect(resultado).toBe(esperado);
      });
    });

    /**
     * TESTE: Números decimais longos
     * Verifica arredondamento correto
     */
    test('deve arredondar corretamente números com muitas casas decimais', () => {
      // ARRANGE: Números com muitas casas decimais
      const casos = [
        { entrada: 10.999, esperado: 'R$ 11,00' },
        { entrada: 15.554, esperado: 'R$ 15,55' },
        { entrada: 25.556, esperado: 'R$ 25,56' }
      ];

      casos.forEach(({ entrada, esperado }) => {
        // ACT: Formatar preço
        const resultado = formatPrice(entrada);

        // ASSERT: Verificar arredondamento
        expect(resultado).toBe(esperado);
      });
    });

    /**
     * TESTE: Valores negativos
     * Verifica tratamento de valores negativos
     */
    test('deve formatar valores negativos corretamente', () => {
      // ACT: Formatar valor negativo
      const resultado = formatPrice(-10.50);

      // ASSERT: Verificar formatação negativa
      expect(resultado).toBe('-R$ 10,50');
    });

    /**
     * TESTE: Valores inválidos
     * Verifica robustez com entradas inválidas
     */
    test('deve lidar com valores inválidos', () => {
      // ACT & ASSERT: Testar entradas inválidas
      expect(formatPrice(null)).toBe('R$ 0,00');
      expect(formatPrice(undefined)).toBe('R$ 0,00');
      expect(formatPrice(NaN)).toBe('R$ 0,00');
      expect(formatPrice('abc')).toBe('R$ 0,00');
    });
  });

  /**
   * GRUPO: Testes da função validateProductData
   */
  describe('validateProductData', () => {
    /**
     * TESTE: Validação de produto válido
     * Verifica se produto com todos dados corretos passa na validação
     */
    test('deve validar produto com dados corretos', () => {
      // ARRANGE: Produto válido
      const produtoValido = {
        name: 'Pizza Margherita',
        price: 25.90,
        description: 'Pizza clássica italiana',
        category: 'Pizzas'
      };

      // ACT: Validar produto
      const resultado = validateProductData(produtoValido);

      // ASSERT: Validação deve passar
      expect(resultado.isValid).toBe(true);
      expect(resultado.errors).toEqual([]);
    });

    /**
     * TESTE: Validação com nome vazio
     * Verifica se nome obrigatório é validado
     */
    test('deve rejeitar produto sem nome', () => {
      // ARRANGE: Produto sem nome
      const produtoInvalido = {
        name: '',
        price: 25.90,
        description: 'Descrição',
        category: 'Categoria'
      };

      // ACT: Validar produto
      const resultado = validateProductData(produtoInvalido);

      // ASSERT: Validação deve falhar
      expect(resultado.isValid).toBe(false);
      expect(resultado.errors).toContain('Nome é obrigatório');
    });

    /**
     * TESTE: Validação de preço inválido
     * Verifica se preço é validado corretamente
     */
    test('deve rejeitar produto com preço inválido', () => {
      // ARRANGE: Casos de preços inválidos
      const casosInvalidos = [
        { price: -10, erro: 'Preço deve ser positivo' },
        { price: 0, erro: 'Preço deve ser maior que zero' },
        { price: 'abc', erro: 'Preço deve ser um número válido' },
        { price: null, erro: 'Preço é obrigatório' }
      ];

      casosInvalidos.forEach(({ price, erro }) => {
        // ARRANGE: Produto com preço inválido
        const produto = {
          name: 'Produto Teste',
          price,
          description: 'Descrição',
          category: 'Categoria'
        };

        // ACT: Validar produto
        const resultado = validateProductData(produto);

        // ASSERT: Validação deve falhar com erro específico
        expect(resultado.isValid).toBe(false);
        expect(resultado.errors).toContain(erro);
      });
    });

    /**
     * TESTE: Múltiplos erros de validação
     * Verifica se todos erros são capturados simultaneamente
     */
    test('deve capturar múltiplos erros de validação', () => {
      // ARRANGE: Produto com múltiplos erros
      const produtoInvalido = {
        name: '', // Nome vazio
        price: -10, // Preço negativo
        description: '', // Descrição vazia
        category: '' // Categoria vazia
      };

      // ACT: Validar produto
      const resultado = validateProductData(produtoInvalido);

      // ASSERT: Múltiplos erros devem ser reportados
      expect(resultado.isValid).toBe(false);
      expect(resultado.errors.length).toBeGreaterThan(1);
      expect(resultado.errors).toContain('Nome é obrigatório');
      expect(resultado.errors).toContain('Preço deve ser positivo');
    });
  });

  /**
   * GRUPO: Testes da função calculateCategoryStats
   */
  describe('calculateCategoryStats', () => {
    /**
     * TESTE: Cálculo de estatísticas básicas
     * Verifica se estatísticas são calculadas corretamente
     */
    test('deve calcular estatísticas de categorias corretamente', () => {
      // ARRANGE: Produtos de diferentes categorias
      const produtos = [
        createMockProduct({ category: 'Pizzas', price: 20.00 }),
        createMockProduct({ category: 'Pizzas', price: 30.00 }),
        createMockProduct({ category: 'Hambúrgueres', price: 15.00 }),
        createMockProduct({ category: 'Hambúrgueres', price: 25.00 }),
        createMockProduct({ category: 'Saladas', price: 12.00 })
      ];

      // ACT: Calcular estatísticas
      const stats = calculateCategoryStats(produtos);

      // ASSERT: Verificar estatísticas calculadas
      expect(stats).toEqual({
        'Pizzas': { count: 2, averagePrice: 25.00, totalValue: 50.00 },
        'Hambúrgueres': { count: 2, averagePrice: 20.00, totalValue: 40.00 },
        'Saladas': { count: 1, averagePrice: 12.00, totalValue: 12.00 }
      });
    });

    /**
     * TESTE: Lista vazia de produtos
     * Verifica comportamento com lista vazia
     */
    test('deve retornar objeto vazio para lista vazia', () => {
      // ACT: Calcular estatísticas de lista vazia
      const stats = calculateCategoryStats([]);

      // ASSERT: Deve retornar objeto vazio
      expect(stats).toEqual({});
    });

    /**
     * TESTE: Produtos sem categoria
     * Verifica tratamento de produtos sem categoria definida
     */
    test('deve lidar com produtos sem categoria', () => {
      // ARRANGE: Produtos sem categoria
      const produtos = [
        createMockProduct({ category: null, price: 10.00 }),
        createMockProduct({ category: undefined, price: 20.00 }),
        createMockProduct({ category: '', price: 30.00 })
      ];

      // ACT: Calcular estatísticas
      const stats = calculateCategoryStats(produtos);

      // ASSERT: Produtos sem categoria devem ser agrupados adequadamente
      expect(stats['Sem Categoria']).toBeDefined();
      expect(stats['Sem Categoria'].count).toBe(3);
    });
  });

  /**
   * GRUPO: Testes da função sortProductsByCategory
   */
  describe('sortProductsByCategory', () => {
    /**
     * TESTE: Ordenação alfabética por categoria
     * Verifica se produtos são ordenados corretamente por categoria
     */
    test('deve ordenar produtos por categoria alfabeticamente', () => {
      // ARRANGE: Produtos em ordem aleatória
      const produtos = [
        createMockProduct({ name: 'Produto C', category: 'Zebra' }),
        createMockProduct({ name: 'Produto A', category: 'Alpha' }),
        createMockProduct({ name: 'Produto B', category: 'Beta' })
      ];

      // ACT: Ordenar produtos
      const produtosOrdenados = sortProductsByCategory(produtos);

      // ASSERT: Verificar ordem das categorias
      expect(produtosOrdenados[0].category).toBe('Alpha');
      expect(produtosOrdenados[1].category).toBe('Beta');
      expect(produtosOrdenados[2].category).toBe('Zebra');
    });

    /**
     * TESTE: Ordenação secundária por nome
     * Verifica se produtos da mesma categoria são ordenados por nome
     */
    test('deve ordenar por nome dentro da mesma categoria', () => {
      // ARRANGE: Produtos da mesma categoria
      const produtos = [
        createMockProduct({ name: 'Zebra Pizza', category: 'Pizzas' }),
        createMockProduct({ name: 'Alpha Pizza', category: 'Pizzas' }),
        createMockProduct({ name: 'Beta Pizza', category: 'Pizzas' })
      ];

      // ACT: Ordenar produtos
      const produtosOrdenados = sortProductsByCategory(produtos);

      // ASSERT: Verificar ordem dos nomes
      expect(produtosOrdenados[0].name).toBe('Alpha Pizza');
      expect(produtosOrdenados[1].name).toBe('Beta Pizza');
      expect(produtosOrdenados[2].name).toBe('Zebra Pizza');
    });

    /**
     * TESTE: Lista vazia
     * Verifica comportamento com array vazio
     */
    test('deve retornar array vazio para entrada vazia', () => {
      // ACT: Ordenar lista vazia
      const resultado = sortProductsByCategory([]);

      // ASSERT: Deve retornar array vazio
      expect(resultado).toEqual([]);
    });

    /**
     * TESTE: Imutabilidade
     * Verifica se array original não é modificado
     */
    test('não deve modificar array original', () => {
      // ARRANGE: Array original
      const produtosOriginais = [
        createMockProduct({ name: 'B', category: 'Z' }),
        createMockProduct({ name: 'A', category: 'Y' })
      ];
      const copiaOriginal = [...produtosOriginais];

      // ACT: Ordenar produtos
      const produtosOrdenados = sortProductsByCategory(produtosOriginais);

      // ASSERT: Array original deve permanecer inalterado
      expect(produtosOriginais).toEqual(copiaOriginal);
      expect(produtosOrdenados).not.toBe(produtosOriginais); // Diferente referência
    });
  });

  /**
   * GRUPO: Testes de Performance e Edge Cases
   */
  describe('Performance e Casos Extremos', () => {
    /**
     * TESTE: Performance com grande volume de dados
     * Verifica se funções lidam bem com muitos produtos
     */
    test('deve lidar com grande volume de produtos', () => {
      // ARRANGE: Gerar muitos produtos
      const muitosProdutos = Array.from({ length: 1000 }, (_, index) => 
        createMockProduct({
          id: index,
          name: `Produto ${index}`,
          category: `Categoria ${index % 10}`
        })
      );

      // ACT & ASSERT: Funções devem executar sem erro
      expect(() => {
        filterProducts(muitosProdutos, 'Produto');
        calculateCategoryStats(muitosProdutos);
        sortProductsByCategory(muitosProdutos);
      }).not.toThrow();
    });

    /**
     * TESTE: Caracteres especiais
     * Verifica se funções lidam com caracteres especiais
     */
    test('deve lidar com caracteres especiais', () => {
      // ARRANGE: Produtos com caracteres especiais
      const produtos = [
        createMockProduct({ 
          name: 'Açaí com Granola', 
          category: 'Sobremesas & Doces' 
        }),
        createMockProduct({ 
          name: 'Café Expresso', 
          category: 'Bebidas Quentes' 
        })
      ];

      // ACT & ASSERT: Funções devem funcionar normalmente
      expect(() => {
        filterProducts(produtos, 'açaí');
        sortProductsByCategory(produtos);
        calculateCategoryStats(produtos);
      }).not.toThrow();

      // Verificar se busca funciona com acentos
      const resultado = filterProducts(produtos, 'acai');
      expect(resultado).toHaveLength(1); // Assumindo busca normalizada
    });
  });
});
