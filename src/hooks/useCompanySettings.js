/**
 * HOOK PARA GERENCIAMENTO DE CONFIGURAÇÕES DA EMPRESA
 * 
 * Centraliza toda lógica relacionada às configurações da empresa,
 * incluindo dados básicos, contatos, redes sociais e horários.
 * 
 * Funcionalidades:
 * - Gerenciamento de estado das configurações
 * - Validação de dados
 * - Persistência de configurações
 * - Upload de logo/imagens
 * 
 * @author Sistema Admin
 * @since 20/08/2025
 */

import { useState, useEffect, useCallback } from 'react';

/**
 * CONFIGURAÇÕES PADRÃO DA EMPRESA
 */
const DEFAULT_COMPANY_DATA = {
  name: '',
  description: '',
  logo: '',
  banner: '',
  address: '',
  number: '',
  city: '',
  state: '',
  zipCode: '',
  phone: '',
  whatsapp: '',
  email: '',
  website: '',
  facebook: '',
  instagram: '',
  // Redes sociais organizadas
  socialMedia: {
    facebook: '',
    instagram: ''
  },
  // Horários de funcionamento
  schedule: {
    monday: { open: '18:00', close: '23:00', closed: false },
    tuesday: { open: '18:00', close: '23:00', closed: false },
    wednesday: { open: '18:00', close: '23:00', closed: false },
    thursday: { open: '18:00', close: '23:00', closed: false },
    friday: { open: '18:00', close: '23:00', closed: false },
    saturday: { open: '12:00', close: '23:00', closed: false },
    sunday: { open: '12:00', close: '22:00', closed: false }
  },
  // Formas de pagamento
  paymentMethods: [
    {
      id: 'cash',
      name: 'Dinheiro',
      enabled: true,
      requiresChange: true,
      color: '#4caf50'
    },
    {
      id: 'credit_card',
      name: 'Cartão de Crédito',
      enabled: true,
      requiresChange: false,
      color: '#2196f3'
    },
    {
      id: 'debit_card',
      name: 'Cartão de Débito',
      enabled: true,
      requiresChange: false,
      color: '#ff9800'
    },
    {
      id: 'pix',
      name: 'PIX',
      enabled: true,
      requiresChange: false,
      color: '#9c27b0'
    }
  ]
};

/**
 * HOOK PRINCIPAL: useCompanySettings
 * 
 * @param {Object} options - Opções de configuração
 * @returns {Object} Estado e funções para gerenciar configurações
 */
export const useCompanySettings = (options = {}) => {
  // ========== ESTADOS ==========
  const [companyData, setCompanyData] = useState(DEFAULT_COMPANY_DATA);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // ========== EFEITOS ==========

  /**
   * Carrega configurações salvas ao montar o componente
   */
  useEffect(() => {
    loadCompanySettings();
  }, []);

  /**
   * Detecta mudanças nos dados para habilitar salvamento
   */
  useEffect(() => {
    const savedData = localStorage.getItem('companySettings');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      const hasChanged = JSON.stringify(companyData) !== JSON.stringify(parsedData);
      setHasChanges(hasChanged);
    } else {
      setHasChanges(JSON.stringify(companyData) !== JSON.stringify(DEFAULT_COMPANY_DATA));
    }
  }, [companyData]);

  // ========== FUNÇÕES DE CARREGAMENTO ==========

  /**
   * Carrega configurações do localStorage ou servidor
   */
  const loadCompanySettings = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Primeiro tenta carregar do localStorage
      const savedData = localStorage.getItem('companySettings');
      
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setCompanyData(prev => ({
          ...DEFAULT_COMPANY_DATA,
          ...parsedData
        }));
      } else {
        // Se não tem dados salvos, usa dados padrão
        setCompanyData(DEFAULT_COMPANY_DATA);
      }

      // TODO: Implementar carregamento do servidor
      // const response = await fetch('/api/company/settings');
      // const data = await response.json();
      // setCompanyData(data);

    } catch (err) {
      setError('Erro ao carregar configurações da empresa');
      console.error('Erro ao carregar configurações:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ========== FUNÇÕES DE ATUALIZAÇÃO ==========

  /**
   * Atualiza um campo específico dos dados da empresa
   */
  const updateField = useCallback((field, value) => {
    // Suporte para campos aninhados usando notação de ponto (ex: socialMedia.facebook)
    if (field.includes('.')) {
      const [parentKey, childKey] = field.split('.');
      setCompanyData(prev => ({
        ...prev,
        [parentKey]: {
          ...prev[parentKey],
          [childKey]: value
        }
      }));
    } else {
      setCompanyData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    setError(null);
  }, []);

  /**
   * Atualiza horário de funcionamento de um dia específico
   */
  const updateSchedule = useCallback((day, field, value) => {
    setCompanyData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: {
          ...prev.schedule[day],
          [field]: value
        }
      }
    }));
    setError(null);
  }, []);

  /**
   * Atualiza múltiplos campos de uma vez
   */
  const updateMultipleFields = useCallback((updates) => {
    setCompanyData(prev => ({
      ...prev,
      ...updates
    }));
    setError(null);
  }, []);

  // ========== FUNÇÕES DE VALIDAÇÃO ==========

  /**
   * Valida dados da empresa antes de salvar
   */
  const validateCompanyData = useCallback((data) => {
    const errors = [];

    // Validações obrigatórias
    if (!data.name?.trim()) {
      errors.push('Nome da empresa é obrigatório');
    }

    if (!data.phone?.trim()) {
      errors.push('Telefone é obrigatório');
    }

    if (!data.address?.trim()) {
      errors.push('Endereço é obrigatório');
    }

    // Validação de email
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('E-mail inválido');
    }

    // Validação de horários
    Object.entries(data.schedule).forEach(([day, schedule]) => {
      if (!schedule.closed && schedule.open >= schedule.close) {
        errors.push(`Horário inválido para ${day}: abertura deve ser antes do fechamento`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);

  // ========== FUNÇÕES DE PERSISTÊNCIA ==========

  /**
   * Salva configurações da empresa
   */
  const saveCompanySettings = useCallback(async () => {
    setSaving(true);
    setError(null);

    try {
      // Validar dados antes de salvar
      const validation = validateCompanyData(companyData);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Salvar no localStorage
      localStorage.setItem('companySettings', JSON.stringify(companyData));

      // TODO: Implementar salvamento no servidor
      // const response = await fetch('/api/company/settings', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(companyData)
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Erro ao salvar no servidor');
      // }

      // Simular delay do servidor
      await new Promise(resolve => setTimeout(resolve, 1500));

      setSuccess(true);
      setHasChanges(false);
      
      // Remover mensagem de sucesso após 3 segundos
      setTimeout(() => setSuccess(false), 3000);

    } catch (err) {
      setError(err.message || 'Erro ao salvar configurações');
      console.error('Erro ao salvar configurações:', err);
    } finally {
      setSaving(false);
    }
  }, [companyData, validateCompanyData]);

  // ========== FUNÇÕES DE UPLOAD ==========

  /**
   * Faz upload do logo da empresa
   */
  const uploadLogo = useCallback(async (file) => {
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        throw new Error('Arquivo deve ser uma imagem');
      }

      // Validar tamanho (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Imagem deve ter menos de 5MB');
      }

      // Criar URL temporária para preview
      const imageUrl = URL.createObjectURL(file);
      updateField('logo', imageUrl);

      // TODO: Implementar upload real para servidor
      // const formData = new FormData();
      // formData.append('logo', file);
      // 
      // const response = await fetch('/api/company/upload-logo', {
      //   method: 'POST',
      //   body: formData
      // });
      // 
      // const result = await response.json();
      // updateField('logo', result.url);

    } catch (err) {
      setError(err.message || 'Erro ao fazer upload da imagem');
      console.error('Erro no upload:', err);
    } finally {
      setLoading(false);
    }
  }, [updateField]);

  // ========== FUNÇÕES UTILITÁRIAS ==========

  /**
   * Reset configurações para valores padrão
   */
  const resetToDefaults = useCallback(() => {
    setCompanyData(DEFAULT_COMPANY_DATA);
    setError(null);
    setSuccess(false);
  }, []);

  /**
   * Limpa mensagens de erro
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Formata horários para exibição
   */
  const formatScheduleForDisplay = useCallback((schedule) => {
    return Object.entries(schedule).map(([day, hours]) => ({
      day,
      ...hours,
      displayTime: hours.closed 
        ? 'Fechado' 
        : `${hours.open} - ${hours.close}`
    }));
  }, []);

  // ========== RETORNO PÚBLICO DO HOOK ==========
  return {
    // Estados
    companyData,
    loading,
    saving,
    error,
    success,
    hasChanges,

    // Funções de atualização
    updateField,
    updateSchedule,
    updateMultipleFields,

    // Funções de persistência
    saveCompanySettings,
    loadCompanySettings,

    // Funções de upload
    uploadLogo,

    // Funções utilitárias
    resetToDefaults,
    clearError,
    formatScheduleForDisplay,
    validateCompanyData
  };
};

/**
 * HOOK PARA DADOS PÚBLICOS DA EMPRESA
 * Versão simplificada para uso no frontend público
 */
export const usePublicCompanyData = () => {
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPublicData = async () => {
      try {
        const savedData = localStorage.getItem('companySettings');
        if (savedData) {
          const data = JSON.parse(savedData);
          setCompanyData(data);
        }
      } catch (error) {
        console.error('Erro ao carregar dados públicos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPublicData();
  }, []);

  return {
    companyData,
    loading
  };
};

export default useCompanySettings;
