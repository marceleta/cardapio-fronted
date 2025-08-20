/**
 * HIGHLIGHTS HOOKS - GERENCIAMENTO DE DESTAQUES SEMANAIS
 * 
 * Sistema refatorado para gerenciar uma única lista de destaques
 * com produtos agendados por dia da semana e sistema de descontos.
 * 
 * Funcionalidades:
 * • useHighlightsConfig - Configuração geral dos destaques (nome, etc)
 * • useWeeklySchedule - Gerenciamento de produtos por dia da semana
 * • useProductDiscount - Sistema de descontos (fixo ou percentual)
 * • useHighlightsValidation - Validações específicas do novo sistema
 * 
 * Seguindo padrões:
 * • CODING_STANDARDS.md para separação de responsabilidades
 * • Custom hooks para lógica complexa
 * • Estado centralizado e reutilizável
 * • Validações consistentes
 * 
 * @autor Marcelo
 * @refatorado 20/08/2025
 */

import { useState, useEffect, useCallback, useMemo } from 'react';

// ========== DIAS DA SEMANA CONSTANTES ==========
const WEEKDAYS = [
  { id: 0, name: 'Domingo', short: 'Dom' },
  { id: 1, name: 'Segunda-feira', short: 'Seg' },
  { id: 2, name: 'Terça-feira', short: 'Ter' },
  { id: 3, name: 'Quarta-feira', short: 'Qua' },
  { id: 4, name: 'Quinta-feira', short: 'Qui' },
  { id: 5, name: 'Sexta-feira', short: 'Sex' },
  { id: 6, name: 'Sábado', short: 'Sáb' }
];

// ========== TIPOS DE DESCONTO ==========
const DISCOUNT_TYPES = {
  PERCENTAGE: 'percentage',
  FIXED: 'fixed'
};

/**
 * HOOK: useHighlightsConfig
 * Gerencia configurações gerais dos destaques
 */
export const useHighlightsConfig = () => {
  // ========== ESTADO DA CONFIGURAÇÃO ==========
  const [config, setConfig] = useState({
    id: 1,
    title: 'Especiais do Dia',
    description: 'Ofertas especiais selecionadas para cada dia da semana',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ========== OPERAÇÕES DE CONFIGURAÇÃO ==========

  /**
   * Atualiza configuração dos destaques
   */
  const updateConfig = useCallback(async (newConfig) => {
    setLoading(true);
    setError(null);

    try {
      const updatedConfig = {
        ...config,
        ...newConfig,
        updatedAt: new Date().toISOString()
      };

      setConfig(updatedConfig);
      return { success: true, data: updatedConfig };
    } catch (err) {
      setError('Erro ao atualizar configuração');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [config]);

  /**
   * Toggle do status ativo/inativo
   */
  const toggleActive = useCallback(async () => {
    return await updateConfig({ active: !config.active });
  }, [config.active, updateConfig]);

  return {
    // Estados
    config,
    loading,
    error,
    
    // Operações
    updateConfig,
    toggleActive,
    
    // Utilidades
    setError
  };
};

/**
 * HOOK: useWeeklySchedule
 * Gerencia produtos agendados por dia da semana
 */
export const useWeeklySchedule = () => {
  // ========== ESTADO DO CRONOGRAMA SEMANAL ==========
  const [weeklySchedule, setWeeklySchedule] = useState({
    0: [], // Domingo
    1: [], // Segunda
    2: [], // Terça
    3: [], // Quarta
    4: [], // Quinta
    5: [], // Sexta
    6: []  // Sábado
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ========== DADOS MOCK INICIAIS ==========
  const initializeSchedule = useCallback(() => {
    const mockSchedule = {
      0: [ // Domingo
        {
          id: 1,
          productId: 101,
          product: {
            id: 101,
            name: 'Feijoada Completa',
            description: 'Feijoada tradicional com todos os acompanhamentos',
            price: 35.90,
            imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            category: 'Pratos Principais'
          },
          discount: {
            type: DISCOUNT_TYPES.PERCENTAGE,
            value: 15
          },
          finalPrice: 30.52,
          active: true,
          addedAt: new Date().toISOString()
        }
      ],
      1: [ // Segunda
        {
          id: 2,
          productId: 102,
          product: {
            id: 102,
            name: 'Hambúrguer Artesanal',
            description: 'Hambúrguer com carne 100% bovina',
            price: 28.90,
            imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            category: 'Hambúrgueres'
          },
          discount: {
            type: DISCOUNT_TYPES.FIXED,
            value: 5.00
          },
          finalPrice: 23.90,
          active: true,
          addedAt: new Date().toISOString()
        }
      ],
      2: [], // Terça
      3: [], // Quarta
      4: [], // Quinta
      5: [], // Sexta
      6: []  // Sábado
    };

    setWeeklySchedule(mockSchedule);
  }, []);

  // ========== OPERAÇÕES DO CRONOGRAMA ==========

  /**
   * Adiciona produto a um dia específico
   */
  const addProductToDay = useCallback(async (dayId, product, discountConfig = null) => {
    setLoading(true);
    setError(null);

    try {
      const newScheduleItem = {
        id: Date.now(),
        productId: product.id,
        product,
        discount: discountConfig || { type: DISCOUNT_TYPES.PERCENTAGE, value: 0 },
        finalPrice: calculateFinalPrice(product.price, discountConfig),
        active: true,
        addedAt: new Date().toISOString()
      };

      setWeeklySchedule(prev => ({
        ...prev,
        [dayId]: [...prev[dayId], newScheduleItem]
      }));

      return { success: true, data: newScheduleItem };
    } catch (err) {
      setError('Erro ao adicionar produto');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Remove produto de um dia específico
   */
  const removeProductFromDay = useCallback(async (dayId, scheduleItemId) => {
    setLoading(true);
    setError(null);

    try {
      setWeeklySchedule(prev => ({
        ...prev,
        [dayId]: prev[dayId].filter(item => item.id !== scheduleItemId)
      }));

      return { success: true };
    } catch (err) {
      setError('Erro ao remover produto');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Atualiza desconto de um produto
   */
  const updateProductDiscount = useCallback(async (dayId, scheduleItemId, discountConfig) => {
    setLoading(true);
    setError(null);

    try {
      setWeeklySchedule(prev => ({
        ...prev,
        [dayId]: prev[dayId].map(item => 
          item.id === scheduleItemId 
            ? {
                ...item,
                discount: discountConfig,
                finalPrice: calculateFinalPrice(item.product.price, discountConfig),
                updatedAt: new Date().toISOString()
              }
            : item
        )
      }));

      return { success: true };
    } catch (err) {
      setError('Erro ao atualizar desconto');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Toggle status ativo de um produto
   */
  const toggleProductStatus = useCallback(async (dayId, scheduleItemId) => {
    setLoading(true);
    setError(null);

    try {
      setWeeklySchedule(prev => ({
        ...prev,
        [dayId]: prev[dayId].map(item => 
          item.id === scheduleItemId 
            ? { ...item, active: !item.active, updatedAt: new Date().toISOString() }
            : item
        )
      }));

      return { success: true };
    } catch (err) {
      setError('Erro ao alterar status');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Copia produtos de um dia para outro
   */
  const copyDaySchedule = useCallback(async (fromDayId, toDayId) => {
    setLoading(true);
    setError(null);

    try {
      const sourceItems = weeklySchedule[fromDayId];
      const copiedItems = sourceItems.map(item => ({
        ...item,
        id: Date.now() + Math.random(),
        addedAt: new Date().toISOString()
      }));

      setWeeklySchedule(prev => ({
        ...prev,
        [toDayId]: [...prev[toDayId], ...copiedItems]
      }));

      return { success: true };
    } catch (err) {
      setError('Erro ao copiar cronograma');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [weeklySchedule]);

  // ========== ESTATÍSTICAS ==========
  const statistics = useMemo(() => {
    const allItems = Object.values(weeklySchedule).flat();
    const activeItems = allItems.filter(item => item.active);
    
    const totalOriginalValue = allItems.reduce((sum, item) => sum + item.product.price, 0);
    const totalDiscountedValue = allItems.reduce((sum, item) => sum + item.finalPrice, 0);
    const totalSavings = totalOriginalValue - totalDiscountedValue;

    const daysWithProducts = Object.keys(weeklySchedule).filter(
      dayId => weeklySchedule[dayId].length > 0
    ).length;

    return {
      totalProducts: allItems.length,
      activeProducts: activeItems.length,
      daysWithProducts,
      totalSavings,
      averageDiscount: totalSavings / (totalOriginalValue || 1) * 100,
      mostProductiveDay: getMostProductiveDay(weeklySchedule)
    };
  }, [weeklySchedule]);

  // ========== INICIALIZAÇÃO ==========
  useEffect(() => {
    const hasData = Object.values(weeklySchedule).some(day => day.length > 0);
    if (!hasData) {
      initializeSchedule();
    }
  }, [initializeSchedule, weeklySchedule]);

  return {
    // Estados
    weeklySchedule,
    loading,
    error,
    statistics,
    WEEKDAYS,
    
    // Operações
    addProductToDay,
    removeProductFromDay,
    updateProductDiscount,
    toggleProductStatus,
    copyDaySchedule,
    
    // Utilidades
    setError,
    setWeeklySchedule
  };
};

/**
 * HOOK: useHighlightsValidation
 * Validações para dados das seções de destaques
 */
export const useHighlightsValidation = () => {
  /**
   * Valida dados da seção
   */
  const validateSection = useCallback((sectionData) => {
    const errors = {};

    // Validação do título
    if (!sectionData.title?.trim()) {
      errors.title = 'Título é obrigatório';
    } else if (sectionData.title.length < 3) {
      errors.title = 'Título deve ter pelo menos 3 caracteres';
    } else if (sectionData.title.length > 50) {
      errors.title = 'Título deve ter no máximo 50 caracteres';
    }

    // Validação da descrição
    if (sectionData.description && sectionData.description.length > 200) {
      errors.description = 'Descrição deve ter no máximo 200 caracteres';
    }

    // Validação da ordem
    if (sectionData.order !== undefined && sectionData.order !== null && 
        (sectionData.order < 1 || sectionData.order > 100)) {
      errors.order = 'Ordem deve estar entre 1 e 100';
    }

    // Validação dos produtos
    if (sectionData.products && sectionData.products.length === 0) {
      errors.products = 'Seção deve ter pelo menos um produto';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }, []);

  /**
   * Valida duplicação de título
   */
  const validateUniqueTitle = useCallback((title, currentSectionId, existingSections) => {
    const titleExists = existingSections.some(section => 
      section.title.toLowerCase() === title.toLowerCase() && 
      section.id !== currentSectionId
    );

    return {
      isValid: !titleExists,
      error: titleExists ? 'Já existe uma seção com este título' : null
    };
  }, []);

  /**
   * Valida ordem única
   */
  const validateUniqueOrder = useCallback((order, currentSectionId, existingSections) => {
    const orderExists = existingSections.some(section => 
      section.order === order && 
      section.id !== currentSectionId
    );

    return {
      isValid: !orderExists,
      error: orderExists ? 'Já existe uma seção com esta ordem' : null
    };
  }, []);

  return {
    validateSection,
    validateUniqueTitle,
    validateUniqueOrder
  };
};

/**
 * HOOK: useProductDiscount
 * Gerencia cálculos e validações de desconto
 */
export const useProductDiscount = () => {
  // ========== FUNÇÕES DE CÁLCULO ==========
  
  /**
   * Calcula preço final com desconto
   */
  const calculateFinalPrice = useCallback((originalPrice, discountConfig) => {
    if (!discountConfig || !discountConfig.value || discountConfig.value <= 0) {
      return originalPrice;
    }

    if (discountConfig.type === DISCOUNT_TYPES.PERCENTAGE) {
      const discountAmount = (originalPrice * discountConfig.value) / 100;
      return Math.max(0, originalPrice - discountAmount);
    } else if (discountConfig.type === DISCOUNT_TYPES.FIXED) {
      return Math.max(0, originalPrice - discountConfig.value);
    }

    return originalPrice;
  }, []);

  /**
   * Calcula valor do desconto
   */
  const calculateDiscountAmount = useCallback((originalPrice, discountConfig) => {
    if (!discountConfig || !discountConfig.value || discountConfig.value <= 0) {
      return 0;
    }

    if (discountConfig.type === DISCOUNT_TYPES.PERCENTAGE) {
      return (originalPrice * discountConfig.value) / 100;
    } else if (discountConfig.type === DISCOUNT_TYPES.FIXED) {
      return Math.min(discountConfig.value, originalPrice);
    }

    return 0;
  }, []);

  /**
   * Formata desconto para exibição
   */
  const formatDiscount = useCallback((discountConfig) => {
    if (!discountConfig || !discountConfig.value || discountConfig.value <= 0) {
      return 'Sem desconto';
    }

    if (discountConfig.type === DISCOUNT_TYPES.PERCENTAGE) {
      return `${discountConfig.value}% OFF`;
    } else if (discountConfig.type === DISCOUNT_TYPES.FIXED) {
      return `R$ ${discountConfig.value.toFixed(2)} OFF`;
    }

    return 'Desconto inválido';
  }, []);

  /**
   * Valida configuração de desconto
   */
  const validateDiscount = useCallback((discountConfig, originalPrice) => {
    const errors = [];

    if (!discountConfig) {
      return { isValid: true, errors: [] };
    }

    if (!discountConfig.type || !Object.values(DISCOUNT_TYPES).includes(discountConfig.type)) {
      errors.push('Tipo de desconto inválido');
    }

    if (discountConfig.value === undefined || discountConfig.value === null) {
      errors.push('Valor do desconto é obrigatório');
    } else if (isNaN(discountConfig.value) || discountConfig.value < 0) {
      errors.push('Valor do desconto deve ser um número positivo');
    } else {
      if (discountConfig.type === DISCOUNT_TYPES.PERCENTAGE && discountConfig.value > 100) {
        errors.push('Desconto percentual não pode ser maior que 100%');
      }
      
      if (discountConfig.type === DISCOUNT_TYPES.FIXED && discountConfig.value > originalPrice) {
        errors.push('Desconto fixo não pode ser maior que o preço original');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);

  return {
    // Funções de cálculo
    calculateFinalPrice,
    calculateDiscountAmount,
    formatDiscount,
    validateDiscount,
    
    // Constantes
    DISCOUNT_TYPES
  };
};

/**
 * HOOK: useProductSelection  
 * Gerencia seleção de produtos para adicionar aos destaques
 */
export const useProductSelection = () => {
  // ========== ESTADO DA SELEÇÃO ==========
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ========== PRODUTOS MOCK ==========
  const initializeProducts = useCallback(() => {
    const mockProducts = [
      // Pratos Principais
      {
        id: 101,
        name: 'Feijoada Completa',
        description: 'Feijoada tradicional com todos os acompanhamentos',
        price: 35.90,
        imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        category: 'Pratos Principais',
        available: true
      },
      {
        id: 102,
        name: 'Hambúrguer Artesanal',
        description: 'Hambúrguer com carne 100% bovina',
        price: 28.90,
        imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        category: 'Hambúrgueres',
        available: true
      },
      {
        id: 103,
        name: 'Risotto de Camarão',
        description: 'Risotto cremoso com camarões frescos',
        price: 58.90,
        imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        category: 'Pratos Principais',
        available: true
      },
      {
        id: 104,
        name: 'Salmão Grelhado',
        description: 'Salmão grelhado com legumes da estação',
        price: 49.90,
        imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        category: 'Pratos Principais',
        available: true
      },
      // Bebidas
      {
        id: 201,
        name: 'Suco Natural de Laranja',
        description: 'Suco fresco de laranja',
        price: 8.90,
        imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        category: 'Bebidas',
        available: true
      },
      {
        id: 202,
        name: 'Refrigerante Coca-Cola',
        description: 'Lata 350ml gelada',
        price: 5.90,
        imageUrl: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        category: 'Bebidas',
        available: true
      },
      // Sobremesas
      {
        id: 301,
        name: 'Tiramisù Tradicional',
        description: 'Clássico italiano com café e mascarpone',
        price: 24.90,
        imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        category: 'Sobremesas',
        available: true
      },
      {
        id: 302,
        name: 'Pudim de Leite',
        description: 'Pudim caseiro com calda de caramelo',
        price: 18.90,
        imageUrl: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        category: 'Sobremesas',
        available: true
      }
    ];

    setProducts(mockProducts);
  }, []);

  // ========== FILTROS E BUSCA ==========
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = searchTerm === '' || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === '' || 
        product.category === selectedCategory;

      return matchesSearch && matchesCategory && product.available;
    });
  }, [products, searchTerm, selectedCategory]);

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map(p => p.category))];
    return uniqueCategories.sort();
  }, [products]);

  // ========== OPERAÇÕES ==========

  /**
   * Busca produtos
   */
  const searchProducts = useCallback(async (term) => {
    setLoading(true);
    setError(null);
    
    try {
      setSearchTerm(term);
      return { success: true };
    } catch (err) {
      setError('Erro na busca');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Filtra por categoria
   */
  const filterByCategory = useCallback(async (category) => {
    setLoading(true);
    setError(null);
    
    try {
      setSelectedCategory(category);
      return { success: true };
    } catch (err) {
      setError('Erro no filtro');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Limpa filtros
   */
  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('');
  }, []);

  // ========== INICIALIZAÇÃO ==========
  useEffect(() => {
    if (products.length === 0) {
      initializeProducts();
    }
  }, [initializeProducts, products.length]);

  return {
    // Estados
    products: filteredProducts,
    allProducts: products,
    categories,
    searchTerm,
    selectedCategory,
    loading,
    error,
    
    // Operações
    searchProducts,
    filterByCategory,
    clearFilters,
    setSearchTerm,
    setSelectedCategory,
    
    // Utilidades
    setError
  };
};

/**
 * HOOK: useHighlightsDialog
 * Gerencia estados dos dialogs do sistema de destaques semanais
 */
export const useHighlightsDialog = () => {
  const [dialogs, setDialogs] = useState({
    config: false,
    addProduct: false,
    editDiscount: false,
    preview: false,
    delete: false,
    copyDay: false
  });

  const [selectedData, setSelectedData] = useState({
    config: null,
    product: null,
    scheduleItem: null,
    dayId: null,
    deleteId: null,
    copyFromDay: null,
    copyToDay: null
  });

  /**
   * Abre dialog específico
   */
  const openDialog = useCallback((dialogType, data = null) => {
    setDialogs(prev => ({ ...prev, [dialogType]: true }));
    if (data) {
      setSelectedData(prev => ({ ...prev, ...data }));
    }
  }, []);

  /**
   * Fecha dialog específico
   */
  const closeDialog = useCallback((dialogType) => {
    setDialogs(prev => ({ ...prev, [dialogType]: false }));
    // Limpa dados relacionados ao dialog fechado
    if (dialogType === 'config') {
      setSelectedData(prev => ({ ...prev, config: null }));
    } else if (dialogType === 'addProduct') {
      setSelectedData(prev => ({ ...prev, product: null, dayId: null }));
    } else if (dialogType === 'editDiscount') {
      setSelectedData(prev => ({ ...prev, scheduleItem: null, dayId: null }));
    } else if (dialogType === 'delete') {
      setSelectedData(prev => ({ ...prev, deleteId: null, dayId: null }));
    } else if (dialogType === 'copyDay') {
      setSelectedData(prev => ({ ...prev, copyFromDay: null, copyToDay: null }));
    }
  }, []);

  /**
   * Fecha todos os dialogs
   */
  const closeAllDialogs = useCallback(() => {
    setDialogs({
      config: false,
      addProduct: false,
      editDiscount: false,
      preview: false,
      delete: false,
      copyDay: false
    });
    setSelectedData({
      config: null,
      product: null,
      scheduleItem: null,
      dayId: null,
      deleteId: null,
      copyFromDay: null,
      copyToDay: null
    });
  }, []);

  return {
    dialogs,
    selectedData,
    openDialog,
    closeDialog,
    closeAllDialogs,
    setSelectedData
  };
};

// ========== FUNÇÕES UTILITÁRIAS ==========

/**
 * Calcula preço final com desconto
 */
export const calculateFinalPrice = (originalPrice, discountConfig) => {
  if (!discountConfig || !discountConfig.value || discountConfig.value <= 0) {
    return originalPrice;
  }

  if (discountConfig.type === DISCOUNT_TYPES.PERCENTAGE) {
    const discountAmount = (originalPrice * discountConfig.value) / 100;
    return Math.max(0, originalPrice - discountAmount);
  } else if (discountConfig.type === DISCOUNT_TYPES.FIXED) {
    return Math.max(0, originalPrice - discountConfig.value);
  }

  return originalPrice;
};

/**
 * Encontra o dia mais produtivo
 */
const getMostProductiveDay = (weeklySchedule) => {
  let maxProducts = 0;
  let mostProductiveDay = null;

  Object.entries(weeklySchedule).forEach(([dayId, products]) => {
    if (products.length > maxProducts) {
      maxProducts = products.length;
      mostProductiveDay = parseInt(dayId);
    }
  });

  if (mostProductiveDay !== null) {
    const dayInfo = WEEKDAYS.find(d => d.id === mostProductiveDay);
    return {
      dayId: mostProductiveDay,
      dayName: dayInfo?.name || 'Desconhecido',
      productCount: maxProducts
    };
  }

  return null;
};

// ========== EXPORTAÇÕES DAS CONSTANTES ==========
export { WEEKDAYS, DISCOUNT_TYPES };
