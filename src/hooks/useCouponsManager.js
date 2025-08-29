/**
 * HOOK PARA GERENCIAMENTO DE CUPONS DE DESCONTO
 * 
 * Centraliza toda lógica relacionada a operações CRUD de cupons.
 * Mantém estado sincronizado e fornece funções de ação para o painel administrativo.
 * 
 * Funcionalidades:
 * - Listagem de cupons com filtros
 * - Criação de novos cupons
 * - Edição de cupons existentes
 * - Exclusão de cupons
 * - Validação de períodos de validade
 * - Controle de ativação por primeira compra
 * - Configuração de dias da semana ativos
 */

import { useState, useEffect, useCallback } from 'react';

/**
 * DADOS MOCK PARA DESENVOLVIMENTO
 * Simulação de cupons existentes no sistema
 */
const MOCK_COUPONS = [
  {
    id: 1,
    code: 'BEMVINDO10',
    description: 'Desconto de boas-vindas para novos clientes',
    type: 'percentage', // 'percentage' | 'fixed_amount'
    value: 10,
    minOrderValue: 30.00,
    maxDiscount: 15.00,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    isActive: true,
    firstPurchaseOnly: true,
    activeDays: [1, 2, 3, 4, 5, 6, 0], // 0=domingo, 1=segunda, etc.
    usageLimit: 1000,
    currentUsage: 45,
    createdAt: '2024-01-01T10:00:00Z'
  },
  {
    id: 2,
    code: 'QUINTA15',
    description: 'Desconto especial para quintas-feiras',
    type: 'percentage',
    value: 15,
    minOrderValue: 50.00,
    maxDiscount: 25.00,
    startDate: '2024-08-01',
    endDate: '2024-12-31',
    isActive: true,
    firstPurchaseOnly: false,
    activeDays: [4], // Apenas quintas-feiras
    usageLimit: 500,
    currentUsage: 123,
    createdAt: '2024-08-01T10:00:00Z'
  },
  {
    id: 3,
    code: 'FIMDESEMANA20',
    description: 'Desconto para fins de semana',
    type: 'fixed_amount',
    value: 20.00,
    minOrderValue: 80.00,
    maxDiscount: null,
    startDate: '2024-06-01',
    endDate: '2024-12-31',
    isActive: false,
    firstPurchaseOnly: false,
    activeDays: [5, 6, 0], // Sexta, sábado e domingo
    usageLimit: null, // Sem limite
    currentUsage: 67,
    createdAt: '2024-06-01T10:00:00Z'
  }
];

/**
 * ESTRUTURA DE CUPOM VAZIO PARA FORMULÁRIOS
 */
const EMPTY_COUPON = {
  code: '',
  description: '',
  type: 'percentage',
  value: 0,
  minOrderValue: 0,
  maxDiscount: null,
  startDate: '',
  endDate: '',
  isActive: true,
  firstPurchaseOnly: false,
  activeDays: [1, 2, 3, 4, 5, 6, 0], // Todos os dias por padrão
  usageLimit: null
};

/**
 * HOOK PRINCIPAL PARA GERENCIAMENTO DE CUPONS
 * 
 * @param {Object} config - Configurações do hook
 * @param {Array} config.initialCoupons - Cupons iniciais (opcional)
 * @returns {Object} Interface pública do hook
 */
export const useCouponsManager = ({ initialCoupons = [] } = {}) => {
  // Estados principais
  const [coupons, setCoupons] = useState(initialCoupons.length > 0 ? initialCoupons : MOCK_COUPONS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  
  // Estados de controle de dialogs
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  /**
   * FILTROS APLICADOS AOS CUPONS
   * Filtra por termo de busca, status e outras condições
   */
  const filteredCoupons = useCallback(() => {
    return coupons.filter(coupon => {
      // Filtro por termo de busca
      const matchesSearch = !searchTerm || 
        coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coupon.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    });
  }, [coupons, searchTerm]);

  /**
   * ESTATÍSTICAS DOS CUPONS
   * Calcula métricas úteis para dashboard
   */
  const statistics = useCallback(() => {
    const total = coupons.length;
    const active = coupons.filter(c => c.isActive).length;
    const expired = coupons.filter(c => new Date(c.endDate) < new Date()).length;
    const firstPurchaseOnly = coupons.filter(c => c.firstPurchaseOnly).length;
    const totalUsage = coupons.reduce((sum, c) => sum + c.currentUsage, 0);

    return {
      total,
      active,
      expired,
      firstPurchaseOnly,
      totalUsage
    };
  }, [coupons]);

  /**
   * VALIDAÇÃO DE DADOS DO CUPOM
   * Verifica se os dados estão corretos antes de salvar
   */
  const validateCoupon = useCallback((couponData) => {
    const errors = {};

    // Validação do código
    if (!couponData.code?.trim()) {
      errors.code = 'Código do cupom é obrigatório';
    } else if (couponData.code.length < 3) {
      errors.code = 'Código deve ter pelo menos 3 caracteres';
    } else if (!/^[A-Z0-9]+$/.test(couponData.code)) {
      errors.code = 'Código deve conter apenas letras maiúsculas e números';
    }

    // Validação de código duplicado
    const existingCoupon = coupons.find(c => 
      c.code === couponData.code && c.id !== couponData.id
    );
    if (existingCoupon) {
      errors.code = 'Já existe um cupom com este código';
    }

    // Validação da descrição
    if (!couponData.description?.trim()) {
      errors.description = 'Descrição é obrigatória';
    }

    // Validação do valor
    if (!couponData.value || couponData.value <= 0) {
      errors.value = 'Valor deve ser maior que zero';
    }

    // Validação específica por tipo
    if (couponData.type === 'percentage' && couponData.value > 100) {
      errors.value = 'Porcentagem não pode ser maior que 100%';
    }

    // Validação de datas
    if (!couponData.startDate) {
      errors.startDate = 'Data de início é obrigatória';
    }

    if (!couponData.endDate) {
      errors.endDate = 'Data de fim é obrigatória';
    }

    if (couponData.startDate && couponData.endDate) {
      if (new Date(couponData.startDate) >= new Date(couponData.endDate)) {
        errors.endDate = 'Data de fim deve ser posterior à data de início';
      }
    }

    // Validação de dias ativos
    if (!couponData.activeDays || couponData.activeDays.length === 0) {
      errors.activeDays = 'Selecione pelo menos um dia da semana';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }, [coupons]);

  /**
   * ADICIONAR NOVO CUPOM
   * Cria um novo cupom após validação
   */
  const handleAddCoupon = useCallback(async (couponData) => {
    setLoading(true);
    setError(null);

    try {
      // Validar dados
      const validation = validateCoupon(couponData);
      if (!validation.isValid) {
        throw new Error(Object.values(validation.errors)[0]);
      }

      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 800));

      // Criar novo cupom
      const newCoupon = {
        ...couponData,
        id: Date.now(), // Simulação de ID único
        currentUsage: 0,
        createdAt: new Date().toISOString()
      };

      setCoupons(prev => [newCoupon, ...prev]);
      setIsCreateDialogOpen(false);

      return { success: true, coupon: newCoupon };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [validateCoupon]);

  /**
   * EDITAR CUPOM EXISTENTE
   * Atualiza um cupom após validação
   */
  const handleEditCoupon = useCallback(async (couponId, updates) => {
    setLoading(true);
    setError(null);

    try {
      // Buscar cupom atual
      const currentCoupon = coupons.find(c => c.id === couponId);
      if (!currentCoupon) {
        throw new Error('Cupom não encontrado');
      }

      // Preparar dados atualizados
      const updatedData = { ...currentCoupon, ...updates };

      // Validar dados
      const validation = validateCoupon(updatedData);
      if (!validation.isValid) {
        throw new Error(Object.values(validation.errors)[0]);
      }

      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 800));

      // Atualizar cupom na lista
      setCoupons(prev => 
        prev.map(coupon => 
          coupon.id === couponId ? updatedData : coupon
        )
      );

      setIsEditDialogOpen(false);
      setSelectedCoupon(null);

      return { success: true, coupon: updatedData };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [coupons, validateCoupon]);

  /**
   * EXCLUIR CUPOM
   * Remove um cupom após confirmação
   */
  const handleDeleteCoupon = useCallback(async (couponId) => {
    setLoading(true);
    setError(null);

    try {
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 500));

      // Remover cupom da lista
      setCoupons(prev => prev.filter(coupon => coupon.id !== couponId));
      setIsDeleteDialogOpen(false);
      setSelectedCoupon(null);

      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * ALTERNAR STATUS DO CUPOM
   * Ativa/desativa um cupom rapidamente
   */
  const handleToggleStatus = useCallback(async (couponId) => {
    const coupon = coupons.find(c => c.id === couponId);
    if (!coupon) return;

    return await handleEditCoupon(couponId, { 
      isActive: !coupon.isActive 
    });
  }, [coupons, handleEditCoupon]);

  /**
   * CONTROLES DE DIALOGS
   */
  const openCreateDialog = useCallback(() => {
    setIsCreateDialogOpen(true);
    setError(null);
  }, []);

  const openEditDialog = useCallback((coupon) => {
    setSelectedCoupon(coupon);
    setIsEditDialogOpen(true);
    setError(null);
  }, []);

  const openDeleteDialog = useCallback((coupon) => {
    setSelectedCoupon(coupon);
    setIsDeleteDialogOpen(true);
    setError(null);
  }, []);

  const closeAllDialogs = useCallback(() => {
    setIsCreateDialogOpen(false);
    setIsEditDialogOpen(false);
    setIsDeleteDialogOpen(false);
    setSelectedCoupon(null);
    setError(null);
  }, []);

  /**
   * LIMPAR ERRO
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Interface pública do hook
  return {
    // Estados principais
    coupons: filteredCoupons(),
    allCoupons: coupons,
    loading,
    error,
    searchTerm,
    selectedCoupon,
    
    // Estados dos dialogs
    isCreateDialogOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
    
    // Dados calculados
    statistics: statistics(),
    emptyCoupon: EMPTY_COUPON,
    
    // Ações principais
    handleAddCoupon,
    handleEditCoupon,
    handleDeleteCoupon,
    handleToggleStatus,
    
    // Controles de busca
    setSearchTerm,
    
    // Controles de dialogs
    openCreateDialog,
    openEditDialog,
    openDeleteDialog,
    closeAllDialogs,
    
    // Utilitários
    validateCoupon,
    clearError
  };
};

export default useCouponsManager;
