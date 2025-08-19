import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CartDrawer from '../CartDrawer';
import ThemeRegistry from '../../ThemeRegistry';
import { CartProvider } from '../../../context/CartContext';
import { AuthProvider } from '../../../context/AuthContext';

// Mock window.open
const mockWindowOpen = jest.fn();
Object.defineProperty(window, 'open', {
  writable: true,
  value: mockWindowOpen,
});

// Mock window.alert
const mockAlert = jest.fn();
Object.defineProperty(window, 'alert', {
  writable: true,
  value: mockAlert,
});

// Mock cart items
const mockCartItems = [
  {
    id: 1,
    name: 'Classic Burger',
    price: '25,00',
    quantity: 2,
    observations: 'Sem cebola',
    addOns: [
      { name: 'Ovo de galinha', price: '2,00' },
      { name: 'Queijo extra', price: '3,50' }
    ]
  },
  {
    id: 2,
    name: 'Batata Frita',
    price: '12,00',
    quantity: 1,
    observations: '',
    addOns: []
  }
];

const mockEmptyCartItems = [];

// Mock dos contextos
const mockUpdateQuantity = jest.fn();
const mockRemoveFromCart = jest.fn();
const mockGetTotalPrice = jest.fn();
const mockClearCart = jest.fn();
const mockAddOrder = jest.fn();

// Mock do useCart e useAuth
jest.mock('../../../context/CartContext', () => ({
  ...jest.requireActual('../../../context/CartContext'),
  useCart: jest.fn()
}));

jest.mock('../../../context/AuthContext', () => ({
  ...jest.requireActual('../../../context/AuthContext'),
  useAuth: () => ({
    addOrder: mockAddOrder
  })
}));

describe('CartDrawer', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetTotalPrice.mockReturnValue(67.00);
    
    // Configure default useCart mock
    const { useCart } = require('../../../context/CartContext');
    useCart.mockReturnValue({
      cartItems: mockCartItems,
      updateQuantity: mockUpdateQuantity,
      removeFromCart: mockRemoveFromCart,
      getTotalPrice: mockGetTotalPrice,
      clearCart: mockClearCart
    });
  });

  const renderCartDrawer = (open = true) => {
    return render(
      <ThemeRegistry>
        <CartProvider>
          <AuthProvider>
            <CartDrawer
              open={open}
              onClose={mockOnClose}
            />
          </AuthProvider>
        </CartProvider>
      </ThemeRegistry>
    );
  };

  it('exibe título e botão de fechar', async () => {
    renderCartDrawer();
    
    expect(await screen.findByText('Carrinho')).toBeInTheDocument();
    const closeButton = screen.getAllByRole('button').find(btn => 
      btn.querySelector('svg[data-testid="CloseIcon"]')
    );
    expect(closeButton).toBeInTheDocument();
  });

  it('exibe mensagem quando carrinho está vazio', async () => {
    // Mock carrinho vazio
    const { useCart } = require('../../../context/CartContext');
    useCart.mockReturnValue({
      cartItems: mockEmptyCartItems,
      updateQuantity: mockUpdateQuantity,
      removeFromCart: mockRemoveFromCart,
      getTotalPrice: () => 0,
      clearCart: mockClearCart
    });

    renderCartDrawer();
    
    expect(await screen.findByText('Seu carrinho está vazio.')).toBeInTheDocument();
  });

  it('exibe itens do carrinho corretamente', async () => {
    renderCartDrawer();
    
    expect(await screen.findByText('Classic Burger')).toBeInTheDocument();
    expect(screen.getByText('Batata Frita')).toBeInTheDocument();
    
    // Verificar total
    expect(screen.getByText('R$ 67,00')).toBeInTheDocument();
    
    // Verificar observações
    expect(screen.getByText('Obs: Sem cebola')).toBeInTheDocument();
    
    // Verificar add-ons
    expect(screen.getByText('Adicionais: Ovo de galinha, Queijo extra')).toBeInTheDocument();
  });

  it('atualiza quantidade do item', async () => {
    const user = userEvent.setup();
    renderCartDrawer();

    await screen.findByText('Classic Burger');

    const incrementButtons = screen.getAllByRole('button').filter(btn => 
      btn.querySelector('svg[data-testid="AddIcon"]')
    );
    const decrementButtons = screen.getAllByRole('button').filter(btn => 
      btn.querySelector('svg[data-testid="RemoveIcon"]')
    );

    // Aumentar quantidade do primeiro item
    await user.click(incrementButtons[0]);
    expect(mockUpdateQuantity).toHaveBeenCalledWith(1, 3);

    // Diminuir quantidade do primeiro item
    await user.click(decrementButtons[0]);
    expect(mockUpdateQuantity).toHaveBeenCalledWith(1, 1);
  });

  it('remove item do carrinho', async () => {
    const user = userEvent.setup();
    renderCartDrawer();

    await screen.findByText('Classic Burger');

    const deleteButtons = screen.getAllByRole('button').filter(btn => 
      btn.querySelector('svg[data-testid="DeleteIcon"]')
    );

    await user.click(deleteButtons[0]);
    expect(mockRemoveFromCart).toHaveBeenCalledWith(1);
  });

  it('aceita input nos campos de nome e WhatsApp', async () => {
    const user = userEvent.setup();
    renderCartDrawer();

    const nameField = await screen.findByLabelText(/seu nome/i);
    const whatsappField = screen.getByLabelText(/seu whatsapp/i);

    await user.type(nameField, 'João Silva');
    expect(nameField).toHaveValue('João Silva');

    await user.type(whatsappField, '11987654321');
    expect(whatsappField).toHaveValue('11987654321');
  });

  it('limpa carrinho quando clica em Limpar Carrinho', async () => {
    const user = userEvent.setup();
    renderCartDrawer();

    const clearButton = await screen.findByText(/limpar carrinho/i);
    await user.click(clearButton);

    expect(mockClearCart).toHaveBeenCalled();
  });

  it('fecha drawer quando clica no botão X', async () => {
    const user = userEvent.setup();
    renderCartDrawer();

    await screen.findByText('Carrinho');
    const closeButton = screen.getAllByRole('button').find(btn => 
      btn.querySelector('svg[data-testid="CloseIcon"]')
    );
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('não renderiza quando open é false', () => {
    renderCartDrawer(false);

    expect(screen.queryByText('Carrinho')).not.toBeInTheDocument();
  });

  it('exibe alerta quando tenta finalizar pedido com carrinho vazio', async () => {
    // Mock carrinho vazio
    const { useCart } = require('../../../context/CartContext');
    useCart.mockReturnValue({
      cartItems: mockEmptyCartItems,
      updateQuantity: mockUpdateQuantity,
      removeFromCart: mockRemoveFromCart,
      getTotalPrice: () => 0,
      clearCart: mockClearCart
    });

    const user = userEvent.setup();
    renderCartDrawer();

    const finishButton = await screen.findByText(/finalizar pedido/i);
    await user.click(finishButton);

    expect(mockAlert).toHaveBeenCalledWith('Seu carrinho está vazio!');
  });

  it('exibe alerta quando tenta finalizar pedido sem preencher campos obrigatórios', async () => {
    const user = userEvent.setup();
    renderCartDrawer();

    const finishButton = await screen.findByText(/finalizar pedido/i);
    await user.click(finishButton);

    expect(mockAlert).toHaveBeenCalledWith('Por favor, preencha seu nome e WhatsApp para finalizar o pedido.');
  });

  it('finaliza pedido corretamente com todos os dados preenchidos', async () => {
    const user = userEvent.setup();
    renderCartDrawer();

    const nameField = await screen.findByLabelText(/seu nome/i);
    const whatsappField = screen.getByLabelText(/seu whatsapp/i);
    const finishButton = screen.getByText(/finalizar pedido/i);

    // Preencher campos
    await user.type(nameField, 'João Silva');
    await user.type(whatsappField, '11987654321');

    // Finalizar pedido
    await user.click(finishButton);

    // Verificar se WhatsApp foi aberto
    expect(mockWindowOpen).toHaveBeenCalledWith(
      expect.stringContaining('https://api.whatsapp.com/send'),
      '_blank'
    );

    // Verificar se pedido foi adicionado
    expect(mockAddOrder).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'em produção',
        items: expect.any(Array),
        totalPrice: 67.00
      })
    );

    // Verificar se carrinho foi limpo e drawer fechado
    expect(mockClearCart).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('gera mensagem do WhatsApp com formatação correta', async () => {
    const user = userEvent.setup();
    renderCartDrawer();

    const nameField = await screen.findByLabelText(/seu nome/i);
    const whatsappField = screen.getByLabelText(/seu whatsapp/i);
    const finishButton = screen.getByText(/finalizar pedido/i);

    await user.type(nameField, 'João Silva');
    await user.type(whatsappField, '11987654321');
    await user.click(finishButton);

    expect(mockWindowOpen).toHaveBeenCalled();
    
    const whatsappCall = mockWindowOpen.mock.calls[0][0];
    const decodedMessage = decodeURIComponent(whatsappCall);
    
    // Verificar se a mensagem contém informações básicas
    expect(decodedMessage).toContain('João Silva');
    expect(decodedMessage).toContain('11987654321');
    expect(decodedMessage).toContain('Classic Burger');
    expect(decodedMessage).toContain('Batata Frita');
    expect(decodedMessage).toContain('Observações: Sem cebola');
    expect(decodedMessage).toContain('Ovo de galinha');
    expect(decodedMessage).toContain('Queijo extra');
    expect(decodedMessage).toContain('Total do pedido');
  });
});
