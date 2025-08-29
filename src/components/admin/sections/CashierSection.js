/**
 * SEÇÃO DO CAIXA - SISTEMA COMPLETO DE PDV
 * 
 * Interface principal para operações de caixa, incluindo:
 * - Abertura/fechamento de caixa
 * - Lançamento e processamento de vendas
 * - Gestão de mesas e comandas
 * - Múltiplas formas de pagamento
 * - Sangria e suprimento
 * - Relatórios e controles
 * 
 * Segue padrões do CODING_STANDARDS.md e UI_STANDARDS.md
 * 
 * @author Sistema Admin
 * @since 22/08/2025
 */

'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Alert,
  Button,
  Container,
  Paper,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  ShoppingCart as SalesIcon,
  TableRestaurant as TablesIcon,
  History as HistoryIcon,
  Assessment as ReportsIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  LockOpen as OpenIcon,
  Close as CloseIcon,
  Receipt as ReceiptIcon,
  TableRestaurant as TableIcon,
  AttachMoney as MoneyIcon,
  Assessment as ReportIcon
} from '@mui/icons-material';

// Hooks
import { useCashierManager } from '../../../hooks/useCashierManager';

// Components
import CashierHeader from '../cashier/CashierHeader';
import CashierControls from '../cashier/CashierControls';
import ActiveSales from '../cashier/ActiveSales';
import ActiveTables from '../cashier/ActiveTables';
import SalesHistory from '../cashier/SalesHistory';
import CashierReports from '../cashier/CashierReports';

// Dialogs
import {
  OpenCashierDialog,
  CloseCashierDialog,
  CashMovementDialog,
  NewSaleDialog,
  PaymentDialog
} from '../cashier/dialogs';

// ========== COMPONENTE PRINCIPAL ==========

const CashierSection = () => {
  // ========== HOOKS E ESTADO ==========
  
  const {
    session,
    activeSales,
    salesHistory,
    activeTables,
    loading,
    error,
    openCashier,
    closeCashier,
    withdrawCash,
    supplyCash,
    createSale,
    updateSale,
    processSalePayment,
    cancelSale,
    openTable,
    closeTable,
    isOpen,
    totalActiveSales,
    totalActiveTables,
    clearError
  } = useCashierManager();

  // Estado para controle das abas
  const [activeTab, setActiveTab] = useState('overview');
  
  // Estados para controle dos diálogos
  const [openCashierDialog, setOpenCashierDialog] = useState(false);
  const [closeCashierDialog, setCloseCashierDialog] = useState(false);
  const [cashMovementDialog, setCashMovementDialog] = useState({ open: false, type: 'withdrawal' });
  const [newSaleDialog, setNewSaleDialog] = useState(false);
  const [paymentDialog, setPaymentDialog] = useState({ open: false, sale: null, total: 0 });
  
  // Estados adicionais para funcionalidades específicas
  const [openSaleDialog, setOpenSaleDialog] = useState(false);
  const [openTableDialog, setOpenTableDialog] = useState(false);
  const [openMovementDialog, setOpenMovementDialog] = useState(false);

  // ========== FUNÇÕES ==========

  /**
   * Manipula mudança de aba
   */
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // ========== FUNÇÕES DOS DIÁLOGOS ==========

  /**
   * Confirma abertura do caixa
   */
  const handleOpenCashierConfirm = (data) => {
    openCashier(data.initialAmount, data.observations);
    setOpenCashierDialog(false);
  };

  /**
   * Confirma fechamento do caixa
   */
  const handleCloseCashierConfirm = (data) => {
    closeCashier(data.finalAmount, data.observations);
    setCloseCashierDialog(false);
  };

  /**
   * Confirma movimentação de dinheiro (sangria/suprimento)
   */
  const handleCashMovementConfirm = (data) => {
    if (data.type === 'withdrawal') {
      withdrawCash(data.amount, data.description);
    } else {
      supplyCash(data.amount, data.description);
    }
    setCashMovementDialog({ open: false, type: 'withdrawal' });
  };

  /**
   * Confirma criação de nova venda
   */
  const handleNewSaleConfirm = (saleData) => {
    createSale(saleData);
    setNewSaleDialog(false);
  };

  /**
   * Confirma pagamento de venda
   */
  const handlePaymentConfirm = (paymentData) => {
    processSalePayment(paymentDialog.sale.id, paymentData);
    setPaymentDialog({ open: false, sale: null, total: 0 });
  };

  /**
   * Abre diálogo de sangria
   */
  const handleWithdrawal = () => {
    setCashMovementDialog({ open: true, type: 'withdrawal' });
  };

  /**
   * Abre diálogo de suprimento
   */
  const handleSupply = () => {
    setCashMovementDialog({ open: true, type: 'supply' });
  };

  /**
   * Abre diálogo de pagamento para uma venda
   */
  const handleProcessPayment = (sale, total) => {
    setPaymentDialog({ open: true, sale, total });
  };

  /**
   * Renderiza indicadores de status do caixa
   */
  const renderCashierStatus = () => {
    if (!isOpen) {
      return (
        <Alert 
          severity="warning" 
          sx={{ mb: 3 }}
          action={
            <Button 
              color="inherit" 
              size="small"
              onClick={() => setOpenCashierDialog(true)}
              startIcon={<OpenIcon />}
            >
              Abrir Caixa
            </Button>
          }
        >
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            Caixa Fechado
          </Typography>
          <Typography variant="body2">
            É necessário abrir o caixa para iniciar as operações de venda.
          </Typography>
        </Alert>
      );
    }

    return (
      <Alert 
        severity="success" 
        sx={{ mb: 3 }}
        action={
          <Button 
            color="inherit" 
            size="small"
            onClick={() => setOpenCashierDialog(true)}
            startIcon={<CloseIcon />}
          >
            Fechar Caixa
          </Button>
        }
      >
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          Caixa Aberto - {session.operator}
        </Typography>
        <Typography variant="body2">
          Aberto em: {new Date(session.openedAt).toLocaleString('pt-BR')}
        </Typography>
      </Alert>
    );
  };

  /**
   * Renderiza cards de resumo
   */
  const renderSummaryCards = () => {
    const summaryData = [
      {
        title: 'Vendas Ativas',
        value: totalActiveSales,
        icon: <ReceiptIcon />,
        color: 'primary',
        action: () => setOpenSaleDialog(true)
      },
      {
        title: 'Mesas Ativas',
        value: totalActiveTables,
        icon: <TableIcon />,
        color: 'secondary',
        action: () => setOpenTableDialog(true)
      },
      {
        title: 'Total de Vendas',
        value: `R$ ${session.totalSales?.toFixed(2) || '0,00'}`,
        icon: <SalesIcon />,
        color: 'success',
        action: null
      },
      {
        title: 'Valor em Caixa',
        value: `R$ ${session.currentAmount?.toFixed(2) || '0,00'}`,
        icon: <MoneyIcon />,
        color: 'warning',
        action: () => setOpenMovementDialog(true)
      }
    ];

    return (
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {summaryData.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                cursor: item.action ? 'pointer' : 'default',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: item.action ? 'translateY(-4px)' : 'none',
                  boxShadow: item.action ? 6 : 1
                }
              }}
              onClick={item.action}
            >
              <CardContent sx={{ 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 3
              }}>
                <Box>
                  <Typography variant="h4" sx={{ 
                    fontWeight: 'bold',
                    color: `${item.color}.main`,
                    mb: 1
                  }}>
                    {item.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.title}
                  </Typography>
                </Box>
                <Box sx={{
                  p: 2,
                  borderRadius: '50%',
                  backgroundColor: `${item.color}.50`,
                  color: `${item.color}.main`
                }}>
                  {item.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  /**
   * Renderiza conteúdo baseado na aba ativa
   */
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <Box>
            {renderSummaryCards()}
            
            <Grid container spacing={3}>
              {/* Vendas Ativas */}
              <Grid item xs={12} lg={8}>
                <ActiveSales
                  sales={activeSales}
                  onEditSale={updateSale}
                  onProcessPayment={handleProcessPayment}
                  onCancelSale={cancelSale}
                />
              </Grid>
              
              {/* Mesas Ativas */}
              <Grid item xs={12} lg={4}>
                <ActiveTables
                  tables={activeTables}
                  onOpenTable={openTable}
                  onCloseTable={closeTable}
                  onAddItemToTable={(table) => {
                    // TODO: Implementar adição de itens à mesa
                    console.log('Adicionar item à mesa:', table);
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        );
      
      case 'sales':
        return (
          <ActiveSales
            sales={activeSales}
            onEditSale={updateSale}
            onProcessPayment={handleProcessPayment}
            onCancelSale={cancelSale}
          />
        );
      
      case 'tables':
        return (
          <ActiveTables
            tables={activeTables}
            onOpenTable={openTable}
            onCloseTable={closeTable}
            onAddItemToTable={(table) => {
              // TODO: Implementar adição de itens à mesa
              console.log('Adicionar item à mesa:', table);
            }}
          />
        );
      
      case 'history':
        return (
          <SalesHistory
            sales={salesHistory}
            onViewSale={(sale) => {
              // TODO: Implementar visualização detalhada da venda
              console.log('Visualizar venda:', sale);
            }}
            onPrintReceipt={(sale) => {
              // TODO: Implementar impressão de recibo
              console.log('Imprimir recibo:', sale);
            }}
          />
        );
      
      case 'reports':
        return (
          <CashierReports
            session={session}
            salesHistory={salesHistory}
            cashMovements={session?.movements || []}
          />
        );
      
      default:
        return null;
    }
  };

  // ========== RENDER ==========
  
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Cabeçalho */}
      <CashierHeader
        session={session}
        isOpen={isOpen}
        onOpenCashier={() => setOpenCashierDialog(true)}
        onCloseCashier={() => setCloseCashierDialog(true)}
      />

      {/* Status do Caixa */}
      {renderCashierStatus()}

      {/* Alertas de Erro */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          onClose={clearError}
        >
          {error}
        </Alert>
      )}

      {/* Navegação por Abas */}
      <Paper elevation={2} sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            '& .MuiTab-root': {
              py: 2,
              minHeight: 64,
              fontSize: { xs: '0.875rem', sm: '1rem' },
              fontWeight: 500,
              minWidth: { xs: 120, sm: 160 }
            }
          }}
        >
          <Tab
            label="Visão Geral"
            value="overview"
            icon={<DashboardIcon />}
            iconPosition="start"
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 1
            }}
          />
          <Tab
            label={`Vendas (${totalActiveSales})`}
            value="sales"
            icon={<ReceiptIcon />}
            iconPosition="start"
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 1
            }}
          />
          <Tab
            label={`Mesas (${totalActiveTables})`}
            value="tables"
            icon={<TableIcon />}
            iconPosition="start"
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 1
            }}
          />
          <Tab
            label="Histórico"
            value="history"
            icon={<SalesIcon />}
            iconPosition="start"
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 1
            }}
          />
          <Tab
            label="Relatórios"
            value="reports"
            icon={<ReportIcon />}
            iconPosition="start"
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 1
            }}
          />
        </Tabs>
      </Paper>

      {/* Conteúdo da Aba Ativa */}
      <Box>
        {renderTabContent()}
      </Box>

      {/* Controles do Caixa - Sempre visíveis quando caixa está aberto */}
      {isOpen && (
        <CashierControls
          session={session}
          onWithdraw={handleWithdrawal}
          onSupply={handleSupply}
          onNewSale={() => setNewSaleDialog(true)}
          onNewTable={() => setOpenTableDialog(true)}
          onCloseCashier={() => setCloseCashierDialog(true)}
        />
      )}

      {/* ========== DIÁLOGOS ========== */}
      
      {/* Diálogo para abrir caixa */}
      <OpenCashierDialog
        open={openCashierDialog}
        onClose={() => setOpenCashierDialog(false)}
        onConfirm={handleOpenCashierConfirm}
      />

      {/* Diálogo para fechar caixa */}
      <CloseCashierDialog
        open={closeCashierDialog}
        onClose={() => setCloseCashierDialog(false)}
        onConfirm={handleCloseCashierConfirm}
        cashierData={session}
      />

      {/* Diálogo para movimentações de caixa (sangria/suprimento) */}
      <CashMovementDialog
        open={cashMovementDialog.open}
        onClose={() => setCashMovementDialog({ open: false, type: 'withdrawal' })}
        onConfirm={handleCashMovementConfirm}
        type={cashMovementDialog.type}
      />

      {/* Diálogo para nova venda */}
      <NewSaleDialog
        open={newSaleDialog}
        onClose={() => setNewSaleDialog(false)}
        onConfirm={handleNewSaleConfirm}
        products={[]} // TODO: Conectar com produtos reais
        tables={activeTables}
      />

      {/* Diálogo para processar pagamento */}
      <PaymentDialog
        open={paymentDialog.open}
        onClose={() => setPaymentDialog({ open: false, sale: null, total: 0 })}
        onConfirm={handlePaymentConfirm}
        sale={paymentDialog.sale}
        total={paymentDialog.total}
      />
    </Container>
  );
};

export default CashierSection;
