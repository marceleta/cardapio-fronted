/**
 * TESTES PARA COMPONENTES AUXILIARES DO CAIXA
 * 
 * Conjunto de testes para validar os componentes auxiliares
 * utilizados no sistema de caixa/POS.
 * 
 * Componentes testados:
 * - CashierHeader: Cabeçalho com informações da sessão
 * - CashierControls: Controles principais do caixa
 * - ActiveSales: Lista de vendas ativas
 * - ActiveTables: Gerenciamento de mesas
 * - SalesHistory: Histórico de vendas
 * - CashierReports: Relatórios e métricas
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Importações de providers necessários
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Componentes sendo testados
import CashierHeader from '../components/CashierHeader';
import CashierControls from '../components/CashierControls';
import ActiveSales from '../components/ActiveSales';
import ActiveTables from '../components/ActiveTables';
import SalesHistory from '../components/SalesHistory';
import CashierReports from '../components/CashierReports';

/**
 * HELPER: Renderiza componente com providers necessários
 */
const renderWithProviders = (component, options = {}) => {
  const theme = createTheme();
  
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>,
    options
  );
};

/**
 * HELPER: Cria dados mock para sessão
 */
const createMockSession = (overrides = {}) => ({
  id: 'session-1',
  operator: 'João Silva',
  openTime: new Date('2024-01-15T08:00:00Z').toISOString(),
  initialAmount: 100,
  currentBalance: 150,
  totalSales: 2,
  totalRevenue: 75.50,
  totalWithdrawals: 25,
  totalSupplies: 0,
  movements: [],
  isOpen: true,
  ...overrides
});

/**
 * HELPER: Cria dados mock para vendas
 */
const createMockSales = () => [
  {
    id: 'sale-1',
    customerName: 'Cliente A',
    tableNumber: 5,
    items: [
      { id: 'item-1', name: 'Hambúrguer', price: 25.50, quantity: 1 },
      { id: 'item-2', name: 'Refrigerante', price: 8.00, quantity: 2 }
    ],
    total: 41.50,
    status: 'active',
    createdAt: new Date('2024-01-15T10:30:00Z').toISOString()
  },
  {
    id: 'sale-2',
    customerName: 'Cliente B',
    tableNumber: null, // Venda no balcão
    items: [
      { id: 'item-3', name: 'Pizza Margherita', price: 34.00, quantity: 1 }
    ],
    total: 34.00,
    status: 'pending_payment',
    createdAt: new Date('2024-01-15T11:15:00Z').toISOString()
  }
];

/**
 * HELPER: Cria dados mock para mesas
 */
const createMockTables = () => [
  {
    id: 'table-1',
    number: 1,
    isOccupied: true,
    currentSale: 'sale-1',
    occupiedSince: new Date('2024-01-15T10:30:00Z').toISOString(),
    customers: 4
  },
  {
    id: 'table-2',
    number: 2,
    isOccupied: false,
    currentSale: null,
    occupiedSince: null,
    customers: 0
  },
  {
    id: 'table-3',
    number: 3,
    isOccupied: true,
    currentSale: null, // Mesa ocupada mas sem venda
    occupiedSince: new Date('2024-01-15T11:00:00Z').toISOString(),
    customers: 2
  }
];

/**
 * SUITE: CashierHeader
 */
describe('CashierHeader', () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
    jest.clearAllMocks();
  });

  test('deve renderizar informações da sessão', () => {
    // ARRANGE: Sessão mock
    const session = createMockSession();

    // ACT: Renderizar header
    renderWithProviders(
      <CashierHeader 
        session={session}
        onClose={jest.fn()}
        onCashMovement={jest.fn()}
      />
    );

    // ASSERT: Verificar informações exibidas
    expect(screen.getByText('Caixa Aberto')).toBeInTheDocument();
    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText('R$ 150,00')).toBeInTheDocument();
    expect(screen.getByText(/08:00/)).toBeInTheDocument(); // Horário de abertura
  });

  test('deve calcular tempo de sessão corretamente', () => {
    // ARRANGE: Sessão com tempo específico
    const session = createMockSession({
      openTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 horas atrás
    });

    // ACT: Renderizar header
    renderWithProviders(
      <CashierHeader 
        session={session}
        onClose={jest.fn()}
        onCashMovement={jest.fn()}
      />
    );

    // ASSERT: Verificar tempo de sessão
    expect(screen.getByText(/2h/)).toBeInTheDocument();
  });

  test('deve chamar função de fechamento', async () => {
    // ARRANGE: Mock da função
    const mockOnClose = jest.fn();
    const session = createMockSession();

    // ACT: Renderizar e clicar em fechar
    renderWithProviders(
      <CashierHeader 
        session={session}
        onClose={mockOnClose}
        onCashMovement={jest.fn()}
      />
    );

    const closeButton = screen.getByRole('button', { name: /fechar caixa/i });
    await user.click(closeButton);

    // ASSERT: Verificar chamada
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('deve abrir menu de movimentações', async () => {
    // ARRANGE: Setup do componente
    const session = createMockSession();

    // ACT: Renderizar e abrir menu
    renderWithProviders(
      <CashierHeader 
        session={session}
        onClose={jest.fn()}
        onCashMovement={jest.fn()}
      />
    );

    const movementButton = screen.getByRole('button', { name: /movimentações/i });
    await user.click(movementButton);

    // ASSERT: Verificar menu aberto
    expect(screen.getByText('Retirada')).toBeInTheDocument();
    expect(screen.getByText('Suprimento')).toBeInTheDocument();
  });
});

/**
 * SUITE: CashierControls
 */
describe('CashierControls', () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
    jest.clearAllMocks();
  });

  test('deve renderizar controles principais', () => {
    // ACT: Renderizar controles
    renderWithProviders(
      <CashierControls 
        onNewSale={jest.fn()}
        onQuickActions={jest.fn()}
        disabled={false}
      />
    );

    // ASSERT: Verificar controles presentes
    expect(screen.getByRole('button', { name: /nova venda/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ações rápidas/i })).toBeInTheDocument();
  });

  test('deve chamar função de nova venda', async () => {
    // ARRANGE: Mock da função
    const mockOnNewSale = jest.fn();

    // ACT: Renderizar e clicar
    renderWithProviders(
      <CashierControls 
        onNewSale={mockOnNewSale}
        onQuickActions={jest.fn()}
        disabled={false}
      />
    );

    const newSaleButton = screen.getByRole('button', { name: /nova venda/i });
    await user.click(newSaleButton);

    // ASSERT: Verificar chamada
    expect(mockOnNewSale).toHaveBeenCalledTimes(1);
  });

  test('deve desabilitar controles quando necessário', () => {
    // ACT: Renderizar com controles desabilitados
    renderWithProviders(
      <CashierControls 
        onNewSale={jest.fn()}
        onQuickActions={jest.fn()}
        disabled={true}
      />
    );

    // ASSERT: Verificar estado desabilitado
    expect(screen.getByRole('button', { name: /nova venda/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /ações rápidas/i })).toBeDisabled();
  });

  test('deve exibir atalhos de teclado', () => {
    // ACT: Renderizar controles
    renderWithProviders(
      <CashierControls 
        onNewSale={jest.fn()}
        onQuickActions={jest.fn()}
        disabled={false}
      />
    );

    // ASSERT: Verificar atalhos exibidos
    expect(screen.getByText('F2')).toBeInTheDocument(); // Atalho nova venda
    expect(screen.getByText('F3')).toBeInTheDocument(); // Atalho ações rápidas
  });
});

/**
 * SUITE: ActiveSales
 */
describe('ActiveSales', () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
    jest.clearAllMocks();
  });

  test('deve renderizar lista de vendas ativas', () => {
    // ARRANGE: Vendas mock
    const sales = createMockSales();

    // ACT: Renderizar lista
    renderWithProviders(
      <ActiveSales 
        sales={sales}
        onUpdateSale={jest.fn()}
        onProcessPayment={jest.fn()}
        onCancelSale={jest.fn()}
      />
    );

    // ASSERT: Verificar vendas exibidas
    expect(screen.getByText('Cliente A')).toBeInTheDocument();
    expect(screen.getByText('Cliente B')).toBeInTheDocument();
    expect(screen.getByText('Mesa 5')).toBeInTheDocument();
    expect(screen.getByText('Balcão')).toBeInTheDocument();
    expect(screen.getByText('R$ 41,50')).toBeInTheDocument();
    expect(screen.getByText('R$ 34,00')).toBeInTheDocument();
  });

  test('deve filtrar vendas por status', async () => {
    // ARRANGE: Vendas com diferentes status
    const sales = createMockSales();

    // ACT: Renderizar e filtrar
    renderWithProviders(
      <ActiveSales 
        sales={sales}
        onUpdateSale={jest.fn()}
        onProcessPayment={jest.fn()}
        onCancelSale={jest.fn()}
      />
    );

    const filterSelect = screen.getByLabelText(/filtrar por status/i);
    await user.selectOptions(filterSelect, 'pending_payment');

    // ASSERT: Verificar filtragem
    expect(screen.getByText('Cliente B')).toBeInTheDocument();
    expect(screen.queryByText('Cliente A')).not.toBeInTheDocument();
  });

  test('deve processar pagamento de venda', async () => {
    // ARRANGE: Mock da função
    const mockProcessPayment = jest.fn();
    const sales = createMockSales();

    // ACT: Renderizar e processar pagamento
    renderWithProviders(
      <ActiveSales 
        sales={sales}
        onUpdateSale={jest.fn()}
        onProcessPayment={mockProcessPayment}
        onCancelSale={jest.fn()}
      />
    );

    const paymentButtons = screen.getAllByRole('button', { name: /finalizar pagamento/i });
    await user.click(paymentButtons[0]);

    // ASSERT: Verificar chamada
    expect(mockProcessPayment).toHaveBeenCalledWith(sales[0]);
  });

  test('deve exibir detalhes da venda', async () => {
    // ARRANGE: Vendas mock
    const sales = createMockSales();

    // ACT: Renderizar e expandir venda
    renderWithProviders(
      <ActiveSales 
        sales={sales}
        onUpdateSale={jest.fn()}
        onProcessPayment={jest.fn()}
        onCancelSale={jest.fn()}
      />
    );

    const expandButton = screen.getAllByRole('button', { name: /ver detalhes/i })[0];
    await user.click(expandButton);

    // ASSERT: Verificar detalhes exibidos
    await waitFor(() => {
      expect(screen.getByText('Hambúrguer')).toBeInTheDocument();
      expect(screen.getByText('Refrigerante')).toBeInTheDocument();
      expect(screen.getByText('1x R$ 25,50')).toBeInTheDocument();
      expect(screen.getByText('2x R$ 8,00')).toBeInTheDocument();
    });
  });

  test('deve exibir mensagem quando não há vendas', () => {
    // ACT: Renderizar sem vendas
    renderWithProviders(
      <ActiveSales 
        sales={[]}
        onUpdateSale={jest.fn()}
        onProcessPayment={jest.fn()}
        onCancelSale={jest.fn()}
      />
    );

    // ASSERT: Verificar mensagem
    expect(screen.getByText(/nenhuma venda ativa/i)).toBeInTheDocument();
    expect(screen.getByText(/criar uma nova venda/i)).toBeInTheDocument();
  });
});

/**
 * SUITE: ActiveTables
 */
describe('ActiveTables', () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
    jest.clearAllMocks();
  });

  test('deve renderizar grid de mesas', () => {
    // ARRANGE: Mesas mock
    const tables = createMockTables();

    // ACT: Renderizar grid
    renderWithProviders(
      <ActiveTables 
        tables={tables}
        onOpenTable={jest.fn()}
        onCloseTable={jest.fn()}
        onCreateSaleForTable={jest.fn()}
      />
    );

    // ASSERT: Verificar mesas exibidas
    expect(screen.getByText('Mesa 1')).toBeInTheDocument();
    expect(screen.getByText('Mesa 2')).toBeInTheDocument();
    expect(screen.getByText('Mesa 3')).toBeInTheDocument();
  });

  test('deve distinguir visualmente mesas ocupadas', () => {
    // ARRANGE: Mesas mock
    const tables = createMockTables();

    // ACT: Renderizar grid
    renderWithProviders(
      <ActiveTables 
        tables={tables}
        onOpenTable={jest.fn()}
        onCloseTable={jest.fn()}
        onCreateSaleForTable={jest.fn()}
      />
    );

    // ASSERT: Verificar estados visuais
    const table1 = screen.getByRole('button', { name: /mesa 1/i });
    const table2 = screen.getByRole('button', { name: /mesa 2/i });
    
    expect(table1).toHaveClass('occupied'); // Mesa ocupada
    expect(table2).toHaveClass('available'); // Mesa disponível
  });

  test('deve exibir informações de ocupação', () => {
    // ARRANGE: Mesas mock
    const tables = createMockTables();

    // ACT: Renderizar grid
    renderWithProviders(
      <ActiveTables 
        tables={tables}
        onOpenTable={jest.fn()}
        onCloseTable={jest.fn()}
        onCreateSaleForTable={jest.fn()}
      />
    );

    // ASSERT: Verificar informações exibidas
    expect(screen.getByText('4 pessoas')).toBeInTheDocument(); // Mesa 1
    expect(screen.getByText('2 pessoas')).toBeInTheDocument(); // Mesa 3
    expect(screen.getByText(/10:30/)).toBeInTheDocument(); // Horário ocupação
  });

  test('deve abrir mesa disponível', async () => {
    // ARRANGE: Mock da função
    const mockOpenTable = jest.fn();
    const tables = createMockTables();

    // ACT: Renderizar e abrir mesa
    renderWithProviders(
      <ActiveTables 
        tables={tables}
        onOpenTable={mockOpenTable}
        onCloseTable={jest.fn()}
        onCreateSaleForTable={jest.fn()}
      />
    );

    const table2 = screen.getByRole('button', { name: /mesa 2/i });
    await user.click(table2);

    // ASSERT: Verificar chamada
    expect(mockOpenTable).toHaveBeenCalledWith(tables[1]);
  });

  test('deve criar venda para mesa ocupada', async () => {
    // ARRANGE: Mock da função
    const mockCreateSale = jest.fn();
    const tables = createMockTables();

    // ACT: Renderizar e criar venda
    renderWithProviders(
      <ActiveTables 
        tables={tables}
        onOpenTable={jest.fn()}
        onCloseTable={jest.fn()}
        onCreateSaleForTable={mockCreateSale}
      />
    );

    const table3 = screen.getByRole('button', { name: /mesa 3/i });
    await user.doubleClick(table3); // Double click para criar venda

    // ASSERT: Verificar chamada
    expect(mockCreateSale).toHaveBeenCalledWith(tables[2]);
  });
});

/**
 * SUITE: SalesHistory
 */
describe('SalesHistory', () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
    jest.clearAllMocks();
  });

  test('deve renderizar histórico de vendas', () => {
    // ARRANGE: Histórico mock
    const history = [
      {
        id: 'sale-h1',
        customerName: 'Cliente Histórico A',
        total: 45.00,
        paymentMethod: 'credit_card',
        completedAt: new Date('2024-01-15T09:30:00Z').toISOString(),
        items: [{ name: 'Pizza', price: 45.00, quantity: 1 }]
      },
      {
        id: 'sale-h2',
        customerName: 'Cliente Histórico B',
        total: 23.50,
        paymentMethod: 'cash',
        completedAt: new Date('2024-01-15T08:45:00Z').toISOString(),
        items: [{ name: 'Sanduíche', price: 23.50, quantity: 1 }]
      }
    ];

    // ACT: Renderizar histórico
    renderWithProviders(
      <SalesHistory 
        history={history}
        onViewDetails={jest.fn()}
        onPrintReceipt={jest.fn()}
      />
    );

    // ASSERT: Verificar vendas exibidas
    expect(screen.getByText('Cliente Histórico A')).toBeInTheDocument();
    expect(screen.getByText('Cliente Histórico B')).toBeInTheDocument();
    expect(screen.getByText('R$ 45,00')).toBeInTheDocument();
    expect(screen.getByText('R$ 23,50')).toBeInTheDocument();
    expect(screen.getByText('Cartão de Crédito')).toBeInTheDocument();
    expect(screen.getByText('Dinheiro')).toBeInTheDocument();
  });

  test('deve filtrar por período', async () => {
    // ARRANGE: Histórico com vendas de diferentes datas
    const history = [
      {
        id: 'sale-today',
        customerName: 'Venda Hoje',
        total: 30.00,
        completedAt: new Date().toISOString()
      },
      {
        id: 'sale-yesterday',
        customerName: 'Venda Ontem',
        total: 25.00,
        completedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    // ACT: Renderizar e filtrar por hoje
    renderWithProviders(
      <SalesHistory 
        history={history}
        onViewDetails={jest.fn()}
        onPrintReceipt={jest.fn()}
      />
    );

    const periodFilter = screen.getByLabelText(/período/i);
    await user.selectOptions(periodFilter, 'today');

    // ASSERT: Verificar filtragem
    expect(screen.getByText('Venda Hoje')).toBeInTheDocument();
    expect(screen.queryByText('Venda Ontem')).not.toBeInTheDocument();
  });

  test('deve buscar por cliente', async () => {
    // ARRANGE: Histórico mock
    const history = [
      { id: 'sale-1', customerName: 'João Silva', total: 30.00 },
      { id: 'sale-2', customerName: 'Maria Santos', total: 25.00 }
    ];

    // ACT: Renderizar e buscar
    renderWithProviders(
      <SalesHistory 
        history={history}
        onViewDetails={jest.fn()}
        onPrintReceipt={jest.fn()}
      />
    );

    const searchInput = screen.getByLabelText(/buscar cliente/i);
    await user.type(searchInput, 'João');

    // ASSERT: Verificar busca
    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.queryByText('Maria Santos')).not.toBeInTheDocument();
  });
});

/**
 * SUITE: CashierReports
 */
describe('CashierReports', () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
    jest.clearAllMocks();
  });

  test('deve renderizar métricas da sessão', () => {
    // ARRANGE: Dados da sessão
    const session = createMockSession({
      totalSales: 10,
      totalRevenue: 234.50,
      totalWithdrawals: 50,
      totalSupplies: 25
    });

    // ACT: Renderizar relatórios
    renderWithProviders(
      <CashierReports 
        session={session}
        salesData={[]}
        onExportReport={jest.fn()}
      />
    );

    // ASSERT: Verificar métricas exibidas
    expect(screen.getByText('10')).toBeInTheDocument(); // Total vendas
    expect(screen.getByText('R$ 234,50')).toBeInTheDocument(); // Receita
    expect(screen.getByText('R$ 50,00')).toBeInTheDocument(); // Retiradas
    expect(screen.getByText('R$ 25,00')).toBeInTheDocument(); // Suprimentos
  });

  test('deve calcular ticket médio', () => {
    // ARRANGE: Dados para cálculo
    const session = createMockSession({
      totalSales: 5,
      totalRevenue: 125.00
    });

    // ACT: Renderizar relatórios
    renderWithProviders(
      <CashierReports 
        session={session}
        salesData={[]}
        onExportReport={jest.fn()}
      />
    );

    // ASSERT: Verificar ticket médio calculado
    expect(screen.getByText('R$ 25,00')).toBeInTheDocument(); // 125/5 = 25
  });

  test('deve gerar gráfico de vendas por hora', () => {
    // ARRANGE: Dados de vendas
    const salesData = [
      { hour: 9, sales: 3, revenue: 75.00 },
      { hour: 10, sales: 5, revenue: 125.00 },
      { hour: 11, sales: 2, revenue: 50.00 }
    ];

    // ACT: Renderizar relatórios
    renderWithProviders(
      <CashierReports 
        session={createMockSession()}
        salesData={salesData}
        onExportReport={jest.fn()}
      />
    );

    // ASSERT: Verificar presença do gráfico
    expect(screen.getByTestId('sales-chart')).toBeInTheDocument();
  });

  test('deve exportar relatório', async () => {
    // ARRANGE: Mock da função
    const mockExportReport = jest.fn();

    // ACT: Renderizar e exportar
    renderWithProviders(
      <CashierReports 
        session={createMockSession()}
        salesData={[]}
        onExportReport={mockExportReport}
      />
    );

    const exportButton = screen.getByRole('button', { name: /exportar relatório/i });
    await user.click(exportButton);

    // ASSERT: Verificar chamada
    expect(mockExportReport).toHaveBeenCalledTimes(1);
  });

  test('deve mostrar comparação com período anterior', () => {
    // ARRANGE: Dados com comparação
    const session = createMockSession({
      totalRevenue: 150.00,
      previousPeriodRevenue: 120.00
    });

    // ACT: Renderizar relatórios
    renderWithProviders(
      <CashierReports 
        session={session}
        salesData={[]}
        onExportReport={jest.fn()}
      />
    );

    // ASSERT: Verificar indicador de crescimento
    expect(screen.getByText(/\+25%/)).toBeInTheDocument(); // Crescimento de 25%
    expect(screen.getByTestId('growth-indicator')).toHaveClass('positive');
  });
});
