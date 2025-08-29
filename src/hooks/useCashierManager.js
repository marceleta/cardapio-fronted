/**
 * HOOK PARA GERENCIAMENTO DO CAIXA
 * 
 * Hook personalizado para centralizar toda lógica relacionada ao
 * sistema de caixa, incluindo operações de venda, pagamentos,
 * controle de fluxo financeiro e relatórios.
 * 
 * Funcionalidades:
 * - Abertura e fechamento de caixa
 * - Lançamento de pedidos e vendas
 * - Processamento de pagamentos múltiplos
 * - Sangria e suprimento
 * - Divisão de contas
 * - Cálculo de troco
 * - Controle de mesas/comandas
 * - Relatórios de vendas
 * 
 * @author Sistema Admin
 * @since 22/08/2025
 */

import { useState, useCallback, useEffect } from 'react';

// ========== CONFIGURAÇÕES PADRÃO ==========

/**
 * Dados padrão para uma sessão de caixa
 */
const DEFAULT_CASHIER_SESSION = {
  id: null,
  openedAt: null,
  closedAt: null,
  openingAmount: 0,
  currentAmount: 0,
  totalSales: 0,
  totalCash: 0,
  totalCard: 0,
  totalPix: 0,
  totalOther: 0,
  withdrawals: [],
  supplies: [],
  status: 'closed', // 'closed', 'open'
  operator: 'Admin'
};

/**
 * Estrutura padrão para uma venda/pedido
 */
const DEFAULT_SALE = {
  id: null,
  tableNumber: null,
  customerName: '',
  items: [],
  subtotal: 0,
  discount: 0,
  total: 0,
  payments: [],
  status: 'pending', // 'pending', 'paid', 'cancelled'
  type: 'local', // 'local', 'takeaway', 'delivery'
  createdAt: null,
  observations: ''
};

/**
 * Métodos de pagamento disponíveis
 */
const PAYMENT_METHODS = [
  { id: 'cash', name: 'Dinheiro', requiresChange: true, color: '#27ae60' },
  { id: 'card_credit', name: 'Cartão de Crédito', requiresChange: false, color: '#3498db' },
  { id: 'card_debit', name: 'Cartão de Débito', requiresChange: false, color: '#2980b9' },
  { id: 'pix', name: 'PIX', requiresChange: false, color: '#9b59b6' },
  { id: 'voucher', name: 'Vale/Cupom', requiresChange: false, color: '#e67e22' }
];

// ========== HOOK PRINCIPAL ==========

export const useCashierManager = () => {
  // ========== ESTADOS ==========
  
  // Estado da sessão do caixa
  const [session, setSession] = useState(DEFAULT_CASHIER_SESSION);
  
  // Vendas/pedidos ativos
  const [activeSales, setActiveSales] = useState([]);
  
  // Histórico de vendas do dia
  const [salesHistory, setSalesHistory] = useState([]);
  
  // Mesas/comandas ativas
  const [activeTables, setActiveTables] = useState([]);
  
  // Estados de UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // ========== EFEITOS ==========
  
  /**
   * Carrega dados salvos ao montar o componente
   */
  useEffect(() => {
    loadCashierData();
  }, []);

  /**
   * Salva dados automaticamente quando há mudanças
   */
  useEffect(() => {
    if (session.id) {
      saveCashierData();
    }
  }, [session, activeSales, salesHistory]);

  // ========== FUNÇÕES DE CARREGAMENTO E PERSISTÊNCIA ==========

  /**
   * Carrega dados do caixa do localStorage
   */
  const loadCashierData = useCallback(() => {
    try {
      const savedSession = localStorage.getItem('cashierSession');
      const savedSales = localStorage.getItem('cashierActiveSales');
      const savedHistory = localStorage.getItem('cashierSalesHistory');
      const savedTables = localStorage.getItem('cashierActiveTables');

      if (savedSession) {
        setSession(JSON.parse(savedSession));
      }
      
      if (savedSales) {
        setActiveSales(JSON.parse(savedSales));
      }
      
      if (savedHistory) {
        setSalesHistory(JSON.parse(savedHistory));
      }
      
      if (savedTables) {
        setActiveTables(JSON.parse(savedTables));
      }
    } catch (error) {
      console.error('Erro ao carregar dados do caixa:', error);
      setError('Erro ao carregar dados salvos');
    }
  }, []);

  /**
   * Salva dados do caixa no localStorage
   */
  const saveCashierData = useCallback(() => {
    try {
      localStorage.setItem('cashierSession', JSON.stringify(session));
      localStorage.setItem('cashierActiveSales', JSON.stringify(activeSales));
      localStorage.setItem('cashierSalesHistory', JSON.stringify(salesHistory));
      localStorage.setItem('cashierActiveTables', JSON.stringify(activeTables));
    } catch (error) {
      console.error('Erro ao salvar dados do caixa:', error);
      setError('Erro ao salvar dados');
    }
  }, [session, activeSales, salesHistory, activeTables]);

  // ========== OPERAÇÕES DE CAIXA ==========

  /**
   * Abre uma nova sessão de caixa
   */
  const openCashier = useCallback(async (openingAmount = 0) => {
    setLoading(true);
    try {
      const newSession = {
        ...DEFAULT_CASHIER_SESSION,
        id: Date.now(),
        openedAt: new Date().toISOString(),
        openingAmount: parseFloat(openingAmount),
        currentAmount: parseFloat(openingAmount),
        status: 'open'
      };
      
      setSession(newSession);
      setError(null);
      
      return { success: true, message: 'Caixa aberto com sucesso!' };
    } catch (error) {
      setError('Erro ao abrir caixa');
      return { success: false, message: 'Erro ao abrir caixa' };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fecha a sessão atual do caixa
   */
  const closeCashier = useCallback(async () => {
    setLoading(true);
    try {
      if (activeSales.some(sale => sale.status === 'pending')) {
        throw new Error('Não é possível fechar o caixa com vendas pendentes');
      }

      const closedSession = {
        ...session,
        closedAt: new Date().toISOString(),
        status: 'closed'
      };
      
      setSession(closedSession);
      
      // Limpar vendas ativas e mesas
      setActiveSales([]);
      setActiveTables([]);
      
      return { 
        success: true, 
        message: 'Caixa fechado com sucesso!',
        report: generateCloseReport(closedSession)
      };
    } catch (error) {
      setError(error.message);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  }, [session, activeSales]);

  /**
   * Registra sangria (retirada de dinheiro)
   */
  const withdrawCash = useCallback(async (amount, reason = '') => {
    try {
      const withdrawal = {
        id: Date.now(),
        amount: parseFloat(amount),
        reason,
        timestamp: new Date().toISOString()
      };

      const updatedSession = {
        ...session,
        currentAmount: session.currentAmount - withdrawal.amount,
        withdrawals: [...session.withdrawals, withdrawal]
      };

      setSession(updatedSession);
      return { success: true, message: 'Sangria registrada com sucesso!' };
    } catch (error) {
      setError('Erro ao registrar sangria');
      return { success: false, message: 'Erro ao registrar sangria' };
    }
  }, [session]);

  /**
   * Registra suprimento (entrada de dinheiro)
   */
  const supplyCash = useCallback(async (amount, reason = '') => {
    try {
      const supply = {
        id: Date.now(),
        amount: parseFloat(amount),
        reason,
        timestamp: new Date().toISOString()
      };

      const updatedSession = {
        ...session,
        currentAmount: session.currentAmount + supply.amount,
        supplies: [...session.supplies, supply]
      };

      setSession(updatedSession);
      return { success: true, message: 'Suprimento registrado com sucesso!' };
    } catch (error) {
      setError('Erro ao registrar suprimento');
      return { success: false, message: 'Erro ao registrar suprimento' };
    }
  }, [session]);

  // ========== OPERAÇÕES DE VENDA ==========

  /**
   * Cria uma nova venda/pedido
   */
  const createSale = useCallback((saleData) => {
    try {
      const newSale = {
        ...DEFAULT_SALE,
        ...saleData,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };

      setActiveSales(prev => [...prev, newSale]);
      return { success: true, sale: newSale };
    } catch (error) {
      setError('Erro ao criar venda');
      return { success: false, message: 'Erro ao criar venda' };
    }
  }, []);

  /**
   * Atualiza uma venda existente
   */
  const updateSale = useCallback((saleId, updates) => {
    try {
      setActiveSales(prev =>
        prev.map(sale =>
          sale.id === saleId
            ? { ...sale, ...updates }
            : sale
        )
      );
      return { success: true };
    } catch (error) {
      setError('Erro ao atualizar venda');
      return { success: false };
    }
  }, []);

  /**
   * Processa pagamento de uma venda
   */
  const processSalePayment = useCallback((saleId, payments) => {
    try {
      const sale = activeSales.find(s => s.id === saleId);
      if (!sale) {
        throw new Error('Venda não encontrada');
      }

      const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
      
      if (totalPaid < sale.total) {
        throw new Error('Valor pago é menor que o total da venda');
      }

      // Atualizar venda
      const updatedSale = {
        ...sale,
        payments,
        status: 'paid',
        paidAt: new Date().toISOString()
      };

      // Atualizar session com valores dos pagamentos
      const cashPayments = payments.filter(p => p.method === 'cash');
      const cardPayments = payments.filter(p => p.method.includes('card'));
      const pixPayments = payments.filter(p => p.method === 'pix');
      const otherPayments = payments.filter(p => !['cash', 'pix'].includes(p.method) && !p.method.includes('card'));

      const updatedSession = {
        ...session,
        totalSales: session.totalSales + sale.total,
        totalCash: session.totalCash + cashPayments.reduce((sum, p) => sum + p.amount, 0),
        totalCard: session.totalCard + cardPayments.reduce((sum, p) => sum + p.amount, 0),
        totalPix: session.totalPix + pixPayments.reduce((sum, p) => sum + p.amount, 0),
        totalOther: session.totalOther + otherPayments.reduce((sum, p) => sum + p.amount, 0),
        currentAmount: session.currentAmount + cashPayments.reduce((sum, p) => sum + p.amount, 0)
      };

      // Mover venda para histórico
      setActiveSales(prev => prev.filter(s => s.id !== saleId));
      setSalesHistory(prev => [...prev, updatedSale]);
      setSession(updatedSession);

      // Calcular troco se necessário
      const change = totalPaid - sale.total;

      return { 
        success: true, 
        message: 'Pagamento processado com sucesso!',
        change: change > 0 ? change : 0
      };
    } catch (error) {
      setError(error.message);
      return { success: false, message: error.message };
    }
  }, [activeSales, session]);

  /**
   * Cancela uma venda
   */
  const cancelSale = useCallback((saleId, reason = '') => {
    try {
      const sale = activeSales.find(s => s.id === saleId);
      if (!sale) {
        throw new Error('Venda não encontrada');
      }

      const cancelledSale = {
        ...sale,
        status: 'cancelled',
        cancelledAt: new Date().toISOString(),
        cancellationReason: reason
      };

      setActiveSales(prev => prev.filter(s => s.id !== saleId));
      setSalesHistory(prev => [...prev, cancelledSale]);

      return { success: true, message: 'Venda cancelada com sucesso!' };
    } catch (error) {
      setError(error.message);
      return { success: false, message: error.message };
    }
  }, [activeSales]);

  // ========== OPERAÇÕES DE MESA/COMANDA ==========

  /**
   * Abre uma nova mesa/comanda
   */
  const openTable = useCallback((tableNumber, customerName = '') => {
    try {
      const newTable = {
        id: Date.now(),
        number: tableNumber,
        customerName,
        openedAt: new Date().toISOString(),
        sales: [],
        status: 'active'
      };

      setActiveTables(prev => [...prev, newTable]);
      return { success: true, table: newTable };
    } catch (error) {
      setError('Erro ao abrir mesa');
      return { success: false, message: 'Erro ao abrir mesa' };
    }
  }, []);

  /**
   * Fecha uma mesa/comanda
   */
  const closeTable = useCallback((tableId) => {
    try {
      const table = activeTables.find(t => t.id === tableId);
      if (!table) {
        throw new Error('Mesa não encontrada');
      }

      // Verificar se há vendas pendentes na mesa
      const pendingSales = activeSales.filter(sale => 
        sale.tableNumber === table.number && sale.status === 'pending'
      );

      if (pendingSales.length > 0) {
        throw new Error('Não é possível fechar mesa com vendas pendentes');
      }

      setActiveTables(prev => prev.filter(t => t.id !== tableId));
      return { success: true, message: 'Mesa fechada com sucesso!' };
    } catch (error) {
      setError(error.message);
      return { success: false, message: error.message };
    }
  }, [activeTables, activeSales]);

  // ========== UTILITÁRIOS ==========

  /**
   * Calcula o troco necessário
   */
  const calculateChange = useCallback((totalAmount, paidAmount) => {
    return Math.max(0, paidAmount - totalAmount);
  }, []);

  /**
   * Divide uma conta entre várias pessoas
   */
  const splitBill = useCallback((saleId, splitCount) => {
    try {
      const sale = activeSales.find(s => s.id === saleId);
      if (!sale) {
        throw new Error('Venda não encontrada');
      }

      const amountPerPerson = sale.total / splitCount;
      return { 
        success: true, 
        amountPerPerson: Math.round(amountPerPerson * 100) / 100,
        splitCount
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }, [activeSales]);

  /**
   * Gera relatório de fechamento
   */
  const generateCloseReport = useCallback((sessionData) => {
    const totalTransactions = salesHistory.filter(sale => sale.status === 'paid').length;
    const totalCancelled = salesHistory.filter(sale => sale.status === 'cancelled').length;

    return {
      period: {
        opened: sessionData.openedAt,
        closed: sessionData.closedAt
      },
      amounts: {
        opening: sessionData.openingAmount,
        closing: sessionData.currentAmount,
        totalSales: sessionData.totalSales
      },
      paymentMethods: {
        cash: sessionData.totalCash,
        card: sessionData.totalCard,
        pix: sessionData.totalPix,
        other: sessionData.totalOther
      },
      transactions: {
        total: totalTransactions,
        cancelled: totalCancelled,
        withdrawals: sessionData.withdrawals.length,
        supplies: sessionData.supplies.length
      },
      movements: {
        withdrawals: sessionData.withdrawals,
        supplies: sessionData.supplies
      }
    };
  }, [salesHistory]);

  /**
   * Limpa mensagens de erro
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ========== INTERFACE PÚBLICA ==========
  
  return {
    // Estados
    session,
    activeSales,
    salesHistory,
    activeTables,
    loading,
    error,
    
    // Operações de caixa
    openCashier,
    closeCashier,
    withdrawCash,
    supplyCash,
    
    // Operações de venda
    createSale,
    updateSale,
    processSalePayment,
    cancelSale,
    
    // Operações de mesa
    openTable,
    closeTable,
    
    // Utilitários
    calculateChange,
    splitBill,
    generateCloseReport,
    clearError,
    
    // Constantes
    paymentMethods: PAYMENT_METHODS,
    
    // Estado computado
    isOpen: session.status === 'open',
    totalActiveSales: activeSales.length,
    totalActiveTables: activeTables.length
  };
};

export default useCashierManager;
