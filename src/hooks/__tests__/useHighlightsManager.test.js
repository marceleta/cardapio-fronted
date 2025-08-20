/**
 * HIGHLIGHTS HOOKS TESTS - TESTES DOS HOOKS DE DESTAQUES
 * 
 * Suite de testes para os hooks customizados do HighlightsManager.
 * Testa a lógica de negócio separadamente da UI.
 * 
 * Hooks testados:
 * • useHighlightsManager - CRUD e estado principal
 * • useProductSelection - Seleção e filtros de produtos
 * • useHighlightsValidation - Validações de dados
 * • useHighlightsDialog - Gerenciamento de dialogs
 * • useHighlightsPreview - Preview das seções
 * 
 * @autor Marcelo
 * @criado 19/08/2025
 */

import { renderHook, act } from '@testing-library/react';
import {
  useHighlightsManager,
  useProductSelection,
  useHighlightsValidation,
  useHighlightsDialog,
  useHighlightsPreview
} from '../useHighlightsManager';

// Mock de dados de teste
const mockSection = {
  id: 1,
  title: 'Pratos Especiais',
  description: 'Nossos pratos mais populares',
  active: true,
  order: 1,
  products: []
};

const mockProduct = {
  id: 101,
  name: 'Risotto de Camarão',
  description: 'Risotto cremoso',
  price: 58.90,
  imageUrl: 'https://example.com/risotto.jpg',
  category: 'Pratos Principais',
  active: true
};

describe('useHighlightsManager Hook', () => {
  test('inicializa com dados padrão', () => {
    const { result } = renderHook(() => useHighlightsManager());

    expect(result.current.highlightSections).toHaveLength(2);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.statistics).toMatchObject({
      totalSections: 2,
      activeSections: 2,
      totalProducts: 3
    });
  });

  test('cria nova seção com sucesso', async () => {
    const { result } = renderHook(() => useHighlightsManager());

    await act(async () => {
      const response = await result.current.createSection(mockSection);
      expect(response.success).toBe(true);
      expect(response.data).toMatchObject({
        ...mockSection,
        id: expect.any(Number),
        createdAt: expect.any(String)
      });
    });

    expect(result.current.highlightSections).toHaveLength(3);
  });

  test('atualiza seção existente', async () => {
    const { result } = renderHook(() => useHighlightsManager());

    await act(async () => {
      const response = await result.current.updateSection(1, {
        title: 'Título Atualizado',
        description: 'Descrição Atualizada'
      });
      expect(response.success).toBe(true);
    });

    const updatedSection = result.current.highlightSections.find(s => s.id === 1);
    expect(updatedSection.title).toBe('Título Atualizado');
    expect(updatedSection.description).toBe('Descrição Atualizada');
    expect(updatedSection.updatedAt).toBeTruthy();
  });

  test('remove seção', async () => {
    const { result } = renderHook(() => useHighlightsManager());
    const initialLength = result.current.highlightSections.length;

    await act(async () => {
      const response = await result.current.deleteSection(1);
      expect(response.success).toBe(true);
    });

    expect(result.current.highlightSections).toHaveLength(initialLength - 1);
    expect(result.current.highlightSections.find(s => s.id === 1)).toBeUndefined();
  });

  test('alterna status da seção', async () => {
    const { result } = renderHook(() => useHighlightsManager());
    const section = result.current.highlightSections.find(s => s.id === 1);
    const initialStatus = section.active;

    await act(async () => {
      const response = await result.current.toggleSectionStatus(1);
      expect(response.success).toBe(true);
    });

    const updatedSection = result.current.highlightSections.find(s => s.id === 1);
    expect(updatedSection.active).toBe(!initialStatus);
    expect(updatedSection.updatedAt).toBeTruthy();
  });

  test('duplica seção', async () => {
    const { result } = renderHook(() => useHighlightsManager());
    const initialLength = result.current.highlightSections.length;

    await act(async () => {
      const response = await result.current.duplicateSection(1);
      expect(response.success).toBe(true);
      expect(response.data.title).toContain('(Cópia)');
    });

    expect(result.current.highlightSections).toHaveLength(initialLength + 1);
  });

  test('atualiza ordem da seção', async () => {
    const { result } = renderHook(() => useHighlightsManager());

    await act(async () => {
      const response = await result.current.updateSectionOrder(1, 5);
      expect(response.success).toBe(true);
    });

    const updatedSection = result.current.highlightSections.find(s => s.id === 1);
    expect(updatedSection.order).toBe(5);
  });

  test('calcula estatísticas corretamente', () => {
    const { result } = renderHook(() => useHighlightsManager());
    const stats = result.current.statistics;

    expect(stats.totalSections).toBeGreaterThan(0);
    expect(stats.activeSections).toBeLessThanOrEqual(stats.totalSections);
    expect(stats.inactiveSections).toBe(stats.totalSections - stats.activeSections);
    expect(stats.averageProductsPerSection).toBeGreaterThanOrEqual(0);
  });
});

describe('useProductSelection Hook', () => {
  test('inicializa com produtos disponíveis', () => {
    const { result } = renderHook(() => useProductSelection());

    expect(result.current.availableProducts).toHaveLength(6);
    expect(result.current.categories).toContain('Pizzas');
    expect(result.current.categories).toContain('Hambúrgueres');
  });

  test('filtra produtos por busca', () => {
    const { result } = renderHook(() => useProductSelection());

    act(() => {
      result.current.setSearchTerm('pizza');
    });

    expect(result.current.filteredProducts).toHaveLength(1);
    expect(result.current.filteredProducts[0].name).toContain('Pizza');
  });

  test('filtra produtos por categoria', () => {
    const { result } = renderHook(() => useProductSelection());

    act(() => {
      result.current.setSelectedCategory('Pizzas');
    });

    const pizzaProducts = result.current.filteredProducts.filter(p => p.category === 'Pizzas');
    expect(result.current.filteredProducts).toEqual(pizzaProducts);
  });

  test('filtra produtos por faixa de preço', () => {
    const { result } = renderHook(() => useProductSelection());

    act(() => {
      result.current.setPriceRange([20, 30]);
    });

    result.current.filteredProducts.forEach(product => {
      expect(product.price).toBeGreaterThanOrEqual(20);
      expect(product.price).toBeLessThanOrEqual(30);
    });
  });

  test('ordena produtos por nome', () => {
    const { result } = renderHook(() => useProductSelection());

    act(() => {
      result.current.setSortBy('name');
      result.current.setSortOrder('asc');
    });

    const sortedNames = result.current.filteredProducts.map(p => p.name);
    const expectedSorted = [...sortedNames].sort();
    expect(sortedNames).toEqual(expectedSorted);
  });

  test('ordena produtos por preço', () => {
    const { result } = renderHook(() => useProductSelection());

    act(() => {
      result.current.setSortBy('price');
      result.current.setSortOrder('desc');
    });

    const prices = result.current.filteredProducts.map(p => p.price);
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeLessThanOrEqual(prices[i - 1]);
    }
  });

  test('adiciona produto à seção', () => {
    const { result } = renderHook(() => useProductSelection());
    const section = { ...mockSection, products: [] };

    const updatedSection = result.current.addProductToSection(section, mockProduct);

    expect(updatedSection.products).toHaveLength(1);
    expect(updatedSection.products[0]).toEqual(mockProduct);
    expect(updatedSection.updatedAt).toBeTruthy();
  });

  test('não adiciona produto duplicado', () => {
    const { result } = renderHook(() => useProductSelection());
    const section = { ...mockSection, products: [mockProduct] };

    const updatedSection = result.current.addProductToSection(section, mockProduct);

    expect(updatedSection.products).toHaveLength(1);
    expect(updatedSection).toEqual(section);
  });

  test('remove produto da seção', () => {
    const { result } = renderHook(() => useProductSelection());
    const section = { ...mockSection, products: [mockProduct] };

    const updatedSection = result.current.removeProductFromSection(section, mockProduct.id);

    expect(updatedSection.products).toHaveLength(0);
    expect(updatedSection.updatedAt).toBeTruthy();
  });

  test('reordena produtos na seção', () => {
    const { result } = renderHook(() => useProductSelection());
    const product2 = { ...mockProduct, id: 102, name: 'Produto 2' };
    const section = { ...mockSection, products: [mockProduct, product2] };

    const updatedSection = result.current.reorderProductsInSection(section, 0, 1);

    expect(updatedSection.products[0]).toEqual(product2);
    expect(updatedSection.products[1]).toEqual(mockProduct);
  });

  test('limpa todos os filtros', () => {
    const { result } = renderHook(() => useProductSelection());

    act(() => {
      result.current.setSearchTerm('teste');
      result.current.setSelectedCategory('Pizzas');
      result.current.setPriceRange([20, 30]);
      result.current.setSortBy('price');
    });

    act(() => {
      result.current.clearFilters();
    });

    expect(result.current.searchTerm).toBe('');
    expect(result.current.selectedCategory).toBe('');
    expect(result.current.priceRange).toEqual([0, 100]);
    expect(result.current.sortBy).toBe('name');
    expect(result.current.sortOrder).toBe('asc');
  });
});

describe('useHighlightsValidation Hook', () => {
  test('valida seção válida', () => {
    const { result } = renderHook(() => useHighlightsValidation());
    const validSection = {
      title: 'Título Válido',
      description: 'Descrição válida',
      order: 1
    };

    const validation = result.current.validateSection(validSection);

    expect(validation.isValid).toBe(true);
    expect(Object.keys(validation.errors)).toHaveLength(0);
  });

  test('detecta título obrigatório', () => {
    const { result } = renderHook(() => useHighlightsValidation());
    const invalidSection = { title: '', description: 'Descrição' };

    const validation = result.current.validateSection(invalidSection);

    expect(validation.isValid).toBe(false);
    expect(validation.errors.title).toBe('Título é obrigatório');
  });

  test('detecta título muito curto', () => {
    const { result } = renderHook(() => useHighlightsValidation());
    const invalidSection = { title: 'AB', description: 'Descrição' };

    const validation = result.current.validateSection(invalidSection);

    expect(validation.isValid).toBe(false);
    expect(validation.errors.title).toBe('Título deve ter pelo menos 3 caracteres');
  });

  test('detecta título muito longo', () => {
    const { result } = renderHook(() => useHighlightsValidation());
    const longTitle = 'A'.repeat(51);
    const invalidSection = { title: longTitle, description: 'Descrição' };

    const validation = result.current.validateSection(invalidSection);

    expect(validation.isValid).toBe(false);
    expect(validation.errors.title).toBe('Título deve ter no máximo 50 caracteres');
  });

  test('detecta descrição muito longa', () => {
    const { result } = renderHook(() => useHighlightsValidation());
    const longDescription = 'A'.repeat(201);
    const invalidSection = { title: 'Título', description: longDescription };

    const validation = result.current.validateSection(invalidSection);

    expect(validation.isValid).toBe(false);
    expect(validation.errors.description).toBe('Descrição deve ter no máximo 200 caracteres');
  });

  test('detecta ordem inválida', () => {
    const { result } = renderHook(() => useHighlightsValidation());
    const invalidSection = { title: 'Título', order: 0 };

    const validation = result.current.validateSection(invalidSection);

    expect(validation.isValid).toBe(false);
    expect(validation.errors.order).toBe('Ordem deve estar entre 1 e 100');
  });

  test('valida título único', () => {
    const { result } = renderHook(() => useHighlightsValidation());
    const existingSections = [{ id: 1, title: 'Título Existente' }];

    const validation = result.current.validateUniqueTitle('Título Existente', 2, existingSections);

    expect(validation.isValid).toBe(false);
    expect(validation.error).toBe('Já existe uma seção com este título');
  });

  test('permite título único para edição da mesma seção', () => {
    const { result } = renderHook(() => useHighlightsValidation());
    const existingSections = [{ id: 1, title: 'Título Existente' }];

    const validation = result.current.validateUniqueTitle('Título Existente', 1, existingSections);

    expect(validation.isValid).toBe(true);
    expect(validation.error).toBe(null);
  });

  test('valida ordem única', () => {
    const { result } = renderHook(() => useHighlightsValidation());
    const existingSections = [{ id: 1, order: 1 }];

    const validation = result.current.validateUniqueOrder(1, 2, existingSections);

    expect(validation.isValid).toBe(false);
    expect(validation.error).toBe('Já existe uma seção com esta ordem');
  });
});

describe('useHighlightsDialog Hook', () => {
  test('inicializa com todos os dialogs fechados', () => {
    const { result } = renderHook(() => useHighlightsDialog());

    expect(result.current.dialogs.main).toBe(false);
    expect(result.current.dialogs.products).toBe(false);
    expect(result.current.dialogs.preview).toBe(false);
    expect(result.current.dialogs.delete).toBe(false);
  });

  test('abre dialog específico', () => {
    const { result } = renderHook(() => useHighlightsDialog());

    act(() => {
      result.current.openDialog('main');
    });

    expect(result.current.dialogs.main).toBe(true);
    expect(result.current.dialogs.products).toBe(false);
  });

  test('abre dialog com dados', () => {
    const { result } = renderHook(() => useHighlightsDialog());
    const testData = { section: mockSection };

    act(() => {
      result.current.openDialog('main', testData);
    });

    expect(result.current.dialogs.main).toBe(true);
    expect(result.current.selectedData.section).toEqual(mockSection);
  });

  test('fecha dialog específico', () => {
    const { result } = renderHook(() => useHighlightsDialog());

    act(() => {
      result.current.openDialog('main');
    });

    act(() => {
      result.current.closeDialog('main');
    });

    expect(result.current.dialogs.main).toBe(false);
  });

  test('limpa dados ao fechar dialog', () => {
    const { result } = renderHook(() => useHighlightsDialog());

    act(() => {
      result.current.openDialog('main', { section: mockSection });
    });

    act(() => {
      result.current.closeDialog('main');
    });

    expect(result.current.selectedData.section).toBe(null);
  });

  test('fecha todos os dialogs', () => {
    const { result } = renderHook(() => useHighlightsDialog());

    act(() => {
      result.current.openDialog('main');
      result.current.openDialog('products');
      result.current.openDialog('preview');
    });

    act(() => {
      result.current.closeAllDialogs();
    });

    expect(result.current.dialogs.main).toBe(false);
    expect(result.current.dialogs.products).toBe(false);
    expect(result.current.dialogs.preview).toBe(false);
    expect(result.current.dialogs.delete).toBe(false);
  });
});

describe('useHighlightsPreview Hook', () => {
  test('inicializa com configurações padrão', () => {
    const { result } = renderHook(() => useHighlightsPreview());

    expect(result.current.previewMode).toBe('desktop');
    expect(result.current.previewTheme).toBe('light');
  });

  test('altera modo de preview', () => {
    const { result } = renderHook(() => useHighlightsPreview());

    act(() => {
      result.current.setPreviewMode('mobile');
    });

    expect(result.current.previewMode).toBe('mobile');
  });

  test('altera tema de preview', () => {
    const { result } = renderHook(() => useHighlightsPreview());

    act(() => {
      result.current.setPreviewTheme('dark');
    });

    expect(result.current.previewTheme).toBe('dark');
  });

  test('gera dados de preview formatados', () => {
    const { result } = renderHook(() => useHighlightsPreview());
    const section = {
      ...mockSection,
      products: [mockProduct]
    };

    const previewData = result.current.generatePreviewData(section);

    expect(previewData.formattedProducts).toHaveLength(1);
    expect(previewData.formattedProducts[0].formattedPrice).toBe('R$ 58,90');
    expect(previewData.formattedProducts[0].shortDescription).toBeTruthy();
  });

  test('calcula estatísticas do preview', () => {
    const { result } = renderHook(() => useHighlightsPreview());
    const product2 = { ...mockProduct, id: 102, price: 25.50 };
    const section = {
      ...mockSection,
      products: [mockProduct, product2]
    };

    const stats = result.current.calculatePreviewStats(section);

    expect(stats.totalProducts).toBe(2);
    expect(stats.totalValue).toBe(84.40);
    expect(stats.averagePrice).toBe(42.20);
    expect(stats.formattedTotalValue).toBe('R$ 84,40');
    expect(stats.formattedAveragePrice).toBe('R$ 42,20');
  });

  test('trata seção sem produtos no preview', () => {
    const { result } = renderHook(() => useHighlightsPreview());
    const emptySection = { ...mockSection, products: [] };

    const stats = result.current.calculatePreviewStats(emptySection);

    expect(stats.totalProducts).toBe(0);
    expect(stats.totalValue).toBe(0);
    expect(stats.averagePrice).toBe(0);
    expect(stats.categoriesCount).toBe(0);
  });
});
