/**
 * TESTES PARA DIÁLOGOS DO CAIXA
 * 
 * Conjunto de testes para validar o comportamento dos diálogos
 * utilizados no sistema de caixa/POS.
 * 
 * Componentes testados:
 * - OpenCashierDialog: Abertura do caixa
 * - CloseCashierDialog: Fechamento do caixa
 * - CashMovementDialog: Movimentações de caixa
 * - NewSaleDialog: Nova venda
 * - PaymentDialog: Processamento de pagamentos
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Importações de providers necessários
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Componentes sendo testados
import OpenCashierDialog from '../dialogs/OpenCashierDialog';
import CloseCashierDialog from '../dialogs/CloseCashierDialog';
import CashMovementDialog from '../dialogs/CashMovementDialog';
import NewSaleDialog from '../dialogs/NewSaleDialog';
import PaymentDialog from '../dialogs/PaymentDialog';

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
  openTime: new Date().toISOString(),
  initialAmount: 100,
  currentBalance: 150,
  totalSales: 2,
  totalRevenue: 75.50,
  ...overrides
});

/**
 * SUITE: OpenCashierDialog
 */
describe('OpenCashierDialog', () => {
  let user;
  const mockProps = {
    open: true,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
    loading: false
  };

  beforeEach(() => {
    user = userEvent.setup();
    jest.clearAllMocks();
  });

  test('deve renderizar diálogo de abertura', () => {
    // ACT: Renderizar diálogo
    renderWithProviders(<OpenCashierDialog {...mockProps} />);

    // ASSERT: Verificar elementos presentes
    expect(screen.getByText('Abrir Caixa')).toBeInTheDocument();
    expect(screen.getByLabelText(/operador/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/valor inicial/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /abrir/i })).toBeInTheDocument();
  });

  test('deve validar campos obrigatórios', async () => {
    // ACT: Tentar confirmar sem preencher
    renderWithProviders(<OpenCashierDialog {...mockProps} />);
    const confirmButton = screen.getByRole('button', { name: /abrir/i });
    await user.click(confirmButton);

    // ASSERT: Verificar mensagens de validação
    await waitFor(() => {
      expect(screen.getByText(/operador é obrigatório/i)).toBeInTheDocument();
      expect(screen.getByText(/valor inicial é obrigatório/i)).toBeInTheDocument();
    });
  });

  test('deve formatar valor corretamente', async () => {
    // ACT: Preencher campo de valor
    renderWithProviders(<OpenCashierDialog {...mockProps} />);
    const amountInput = screen.getByLabelText(/valor inicial/i);
    await user.type(amountInput, '12345');

    // ASSERT: Verificar formatação
    expect(amountInput).toHaveValue('R$ 123,45');
  });

  test('deve chamar onConfirm com dados corretos', async () => {
    // ACT: Preencher formulário e confirmar
    renderWithProviders(<OpenCashierDialog {...mockProps} />);
    
    await user.type(screen.getByLabelText(/operador/i), 'João Silva');
    await user.type(screen.getByLabelText(/valor inicial/i), '10000');
    
    const confirmButton = screen.getByRole('button', { name: /abrir/i });
    await user.click(confirmButton);

    // ASSERT: Verificar chamada com dados corretos
    await waitFor(() => {
      expect(mockProps.onConfirm).toHaveBeenCalledWith({
        operator: 'João Silva',
        initialAmount: 100.00
      });
    });
  });

  test('deve exibir estado de loading', () => {
    // ARRANGE: Props com loading
    const loadingProps = { ...mockProps, loading: true };

    // ACT: Renderizar com loading
    renderWithProviders(<OpenCashierDialog {...loadingProps} />);

    // ASSERT: Verificar estado de loading
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /abrir/i })).toBeDisabled();
  });

  test('deve fechar diálogo ao cancelar', async () => {
    // ACT: Clicar em cancelar
    renderWithProviders(<OpenCashierDialog {...mockProps} />);
    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    await user.click(cancelButton);

    // ASSERT: Verificar chamada de fechamento
    expect(mockProps.onClose).toHaveBeenCalledTimes(1);
  });
});

/**
 * SUITE: CloseCashierDialog
 */
describe('CloseCashierDialog', () => {
  let user;
  const mockProps = {
    open: true,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
    session: createMockSession(),
    loading: false
  };

  beforeEach(() => {
    user = userEvent.setup();
    jest.clearAllMocks();
  });

  test('deve renderizar resumo da sessão', () => {
    // ACT: Renderizar diálogo
    renderWithProviders(<CloseCashierDialog {...mockProps} />);

    // ASSERT: Verificar resumo exibido
    expect(screen.getByText('Fechar Caixa')).toBeInTheDocument();
    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText('R$ 150,00')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // Total de vendas
    expect(screen.getByText('R$ 75,50')).toBeInTheDocument(); // Receita
  });

  test('deve validar valor final informado', async () => {
    // ACT: Informar valor diferente do esperado
    renderWithProviders(<CloseCashierDialog {...mockProps} />);
    
    const finalAmountInput = screen.getByLabelText(/valor final/i);
    await user.type(finalAmountInput, '10000'); // R$ 100,00 (diferente dos R$ 150,00 esperados)

    const confirmButton = screen.getByRole('button', { name: /fechar/i });
    await user.click(confirmButton);

    // ASSERT: Verificar alerta de divergência
    await waitFor(() => {
      expect(screen.getByText(/divergência detectada/i)).toBeInTheDocument();
      expect(screen.getByText(/diferença.*r\$.*50,00/i)).toBeInTheDocument();
    });
  });

  test('deve permitir fechar com divergência confirmada', async () => {
    // ACT: Confirmar fechamento com divergência
    renderWithProviders(<CloseCashierDialog {...mockProps} />);
    
    await user.type(screen.getByLabelText(/valor final/i), '10000');
    await user.click(screen.getByRole('button', { name: /fechar/i }));

    // Confirmar divergência
    await waitFor(() => {
      const confirmDivergenceButton = screen.getByRole('button', { name: /confirmar mesmo assim/i });
      user.click(confirmDivergenceButton);
    });

    // ASSERT: Verificar chamada de fechamento
    await waitFor(() => {
      expect(mockProps.onConfirm).toHaveBeenCalledWith({
        finalAmount: 100.00,
        hasDivergence: true,
        divergenceAmount: -50.00,
        observations: expect.any(String)
      });
    });
  });

  test('deve incluir observações no fechamento', async () => {
    // ACT: Adicionar observações
    renderWithProviders(<CloseCashierDialog {...mockProps} />);
    
    const observationsInput = screen.getByLabelText(/observações/i);
    await user.type(observationsInput, 'Sessão finalizada normalmente');
    
    await user.type(screen.getByLabelText(/valor final/i), '15000');
    await user.click(screen.getByRole('button', { name: /fechar/i }));

    // ASSERT: Verificar observações incluídas
    await waitFor(() => {
      expect(mockProps.onConfirm).toHaveBeenCalledWith(
        expect.objectContaining({
          observations: 'Sessão finalizada normalmente'
        })
      );
    });
  });
});

/**
 * SUITE: CashMovementDialog
 */
describe('CashMovementDialog', () => {
  let user;
  const mockProps = {
    open: true,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
    type: 'withdrawal', // 'withdrawal' ou 'supply'
    loading: false
  };

  beforeEach(() => {
    user = userEvent.setup();
    jest.clearAllMocks();
  });

  test('deve renderizar diálogo de retirada', () => {
    // ACT: Renderizar diálogo de retirada
    renderWithProviders(<CashMovementDialog {...mockProps} />);

    // ASSERT: Verificar elementos específicos de retirada
    expect(screen.getByText('Retirada de Caixa')).toBeInTheDocument();
    expect(screen.getByLabelText(/valor da retirada/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/motivo/i)).toBeInTheDocument();
  });

  test('deve renderizar diálogo de suprimento', () => {
    // ARRANGE: Props para suprimento
    const supplyProps = { ...mockProps, type: 'supply' };

    // ACT: Renderizar diálogo de suprimento
    renderWithProviders(<CashMovementDialog {...supplyProps} />);

    // ASSERT: Verificar elementos específicos de suprimento
    expect(screen.getByText('Suprimento de Caixa')).toBeInTheDocument();
    expect(screen.getByLabelText(/valor do suprimento/i)).toBeInTheDocument();
  });

  test('deve validar campos obrigatórios', async () => {
    // ACT: Tentar confirmar sem preencher
    renderWithProviders(<CashMovementDialog {...mockProps} />);
    const confirmButton = screen.getByRole('button', { name: /confirmar/i });
    await user.click(confirmButton);

    // ASSERT: Verificar mensagens de validação
    await waitFor(() => {
      expect(screen.getByText(/valor é obrigatório/i)).toBeInTheDocument();
      expect(screen.getByText(/motivo é obrigatório/i)).toBeInTheDocument();
    });
  });

  test('deve chamar onConfirm com dados corretos', async () => {
    // ACT: Preencher e confirmar movimentação
    renderWithProviders(<CashMovementDialog {...mockProps} />);
    
    await user.type(screen.getByLabelText(/valor/i), '5000');
    await user.type(screen.getByLabelText(/motivo/i), 'Pagamento de fornecedor');
    
    const confirmButton = screen.getByRole('button', { name: /confirmar/i });
    await user.click(confirmButton);

    // ASSERT: Verificar chamada com dados corretos
    await waitFor(() => {
      expect(mockProps.onConfirm).toHaveBeenCalledWith({
        type: 'withdrawal',
        amount: 50.00,
        reason: 'Pagamento de fornecedor'
      });
    });
  });
});

/**
 * SUITE: NewSaleDialog
 */
describe('NewSaleDialog', () => {
  let user;
  const mockProps = {
    open: true,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
    loading: false
  };

  beforeEach(() => {
    user = userEvent.setup();
    jest.clearAllMocks();
  });

  test('deve renderizar opções de venda', () => {
    // ACT: Renderizar diálogo
    renderWithProviders(<NewSaleDialog {...mockProps} />);

    // ASSERT: Verificar opções presentes
    expect(screen.getByText('Nova Venda')).toBeInTheDocument();
    expect(screen.getByText('Venda no Balcão')).toBeInTheDocument();
    expect(screen.getByText('Venda para Mesa')).toBeInTheDocument();
    expect(screen.getByText('Delivery')).toBeInTheDocument();
  });

  test('deve permitir seleção de tipo de venda', async () => {
    // ACT: Selecionar venda para mesa
    renderWithProviders(<NewSaleDialog {...mockProps} />);
    const tableOption = screen.getByRole('button', { name: /venda para mesa/i });
    await user.click(tableOption);

    // ASSERT: Verificar seleção
    expect(tableOption).toHaveAttribute('aria-pressed', 'true');
  });

  test('deve exibir campo de mesa quando necessário', async () => {
    // ACT: Selecionar venda para mesa
    renderWithProviders(<NewSaleDialog {...mockProps} />);
    const tableOption = screen.getByRole('button', { name: /venda para mesa/i });
    await user.click(tableOption);

    // ASSERT: Verificar campo de mesa
    await waitFor(() => {
      expect(screen.getByLabelText(/número da mesa/i)).toBeInTheDocument();
    });
  });

  test('deve validar número da mesa', async () => {
    // ACT: Selecionar mesa e tentar confirmar sem número
    renderWithProviders(<NewSaleDialog {...mockProps} />);
    
    await user.click(screen.getByRole('button', { name: /venda para mesa/i }));
    await user.click(screen.getByRole('button', { name: /criar venda/i }));

    // ASSERT: Verificar validação
    await waitFor(() => {
      expect(screen.getByText(/número da mesa é obrigatório/i)).toBeInTheDocument();
    });
  });

  test('deve criar venda no balcão', async () => {
    // ACT: Criar venda no balcão
    renderWithProviders(<NewSaleDialog {...mockProps} />);
    
    await user.click(screen.getByRole('button', { name: /venda no balcão/i }));
    await user.click(screen.getByRole('button', { name: /criar venda/i }));

    // ASSERT: Verificar chamada
    await waitFor(() => {
      expect(mockProps.onConfirm).toHaveBeenCalledWith({
        type: 'counter',
        tableNumber: null,
        customerInfo: null
      });
    });
  });
});

/**
 * SUITE: PaymentDialog
 */
describe('PaymentDialog', () => {
  let user;
  const mockSale = {
    id: 'sale-1',
    total: 75.50,
    items: [
      { id: 'item-1', name: 'Hambúrguer', price: 25.50, quantity: 2 },
      { id: 'item-2', name: 'Refrigerante', price: 12.25, quantity: 2 }
    ]
  };

  const mockProps = {
    open: true,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
    sale: mockSale,
    loading: false
  };

  beforeEach(() => {
    user = userEvent.setup();
    jest.clearAllMocks();
  });

  test('deve renderizar resumo da venda', () => {
    // ACT: Renderizar diálogo
    renderWithProviders(<PaymentDialog {...mockProps} />);

    // ASSERT: Verificar resumo da venda
    expect(screen.getByText('Finalizar Pagamento')).toBeInTheDocument();
    expect(screen.getByText('R$ 75,50')).toBeInTheDocument();
    expect(screen.getByText('Hambúrguer')).toBeInTheDocument();
    expect(screen.getByText('2x')).toBeInTheDocument();
  });

  test('deve permitir seleção de método de pagamento', async () => {
    // ACT: Selecionar método de pagamento
    renderWithProviders(<PaymentDialog {...mockProps} />);
    
    const creditCardOption = screen.getByRole('button', { name: /cartão de crédito/i });
    await user.click(creditCardOption);

    // ASSERT: Verificar seleção
    expect(creditCardOption).toHaveAttribute('aria-pressed', 'true');
  });

  test('deve calcular troco para pagamento em dinheiro', async () => {
    // ACT: Selecionar dinheiro e informar valor pago
    renderWithProviders(<PaymentDialog {...mockProps} />);
    
    await user.click(screen.getByRole('button', { name: /dinheiro/i }));
    
    const paidAmountInput = screen.getByLabelText(/valor pago/i);
    await user.type(paidAmountInput, '10000'); // R$ 100,00

    // ASSERT: Verificar cálculo do troco
    await waitFor(() => {
      expect(screen.getByText('R$ 24,50')).toBeInTheDocument(); // Troco
    });
  });

  test('deve validar valor pago insuficiente', async () => {
    // ACT: Informar valor menor que o total
    renderWithProviders(<PaymentDialog {...mockProps} />);
    
    await user.click(screen.getByRole('button', { name: /dinheiro/i }));
    await user.type(screen.getByLabelText(/valor pago/i), '5000'); // R$ 50,00
    await user.click(screen.getByRole('button', { name: /finalizar/i }));

    // ASSERT: Verificar validação
    await waitFor(() => {
      expect(screen.getByText(/valor pago é insuficiente/i)).toBeInTheDocument();
    });
  });

  test('deve processar pagamento com sucesso', async () => {
    // ACT: Completar pagamento
    renderWithProviders(<PaymentDialog {...mockProps} />);
    
    await user.click(screen.getByRole('button', { name: /cartão de crédito/i }));
    await user.click(screen.getByRole('button', { name: /finalizar/i }));

    // ASSERT: Verificar processamento
    await waitFor(() => {
      expect(mockProps.onConfirm).toHaveBeenCalledWith({
        paymentMethod: 'credit_card',
        paidAmount: 75.50,
        changeAmount: 0,
        installments: 1
      });
    });
  });

  test('deve permitir pagamento parcelado no cartão', async () => {
    // ACT: Selecionar parcelamento
    renderWithProviders(<PaymentDialog {...mockProps} />);
    
    await user.click(screen.getByRole('button', { name: /cartão de crédito/i }));
    
    const installmentsSelect = screen.getByLabelText(/parcelas/i);
    await user.selectOptions(installmentsSelect, '3');

    await user.click(screen.getByRole('button', { name: /finalizar/i }));

    // ASSERT: Verificar parcelamento
    await waitFor(() => {
      expect(mockProps.onConfirm).toHaveBeenCalledWith(
        expect.objectContaining({
          installments: 3
        })
      );
    });
  });
});
