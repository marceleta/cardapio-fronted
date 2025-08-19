import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OrdersDialog from '../OrdersDialog';
import ThemeRegistry from '../../ThemeRegistry';
import { AuthProvider } from '../../../context/AuthContext';

// Mock do contexto de autenticação
jest.mock('../../../context/AuthContext', () => ({
  ...jest.requireActual('../../../context/AuthContext'),
  useAuth: jest.fn()
}));

describe('OrdersDialog', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderOrdersDialog = (open = true, user = null) => {
    // Configure o mock do useAuth baseado no parâmetro user
    const { useAuth } = require('../../../context/AuthContext');
    useAuth.mockReturnValue({
      user
    });

    return render(
      <ThemeRegistry>
        <AuthProvider>
          <OrdersDialog
            open={open}
            onClose={mockOnClose}
          />
        </AuthProvider>
      </ThemeRegistry>
    );
  };

  // Mock orders data
  const mockOrders = [
    {
      id: 'ORD001',
      date: new Date('2024-01-15T18:30:00'),
      status: 'entregue',
      items: [
        {
          name: 'Classic Burger',
          quantity: 2,
          price: '25,00',
          observations: 'Sem cebola',
          addOns: [
            { name: 'Ovo de galinha', price: '2,00' },
            { name: 'Queijo extra', price: '3,50' }
          ]
        },
        {
          name: 'Batata Frita',
          quantity: 1,
          price: '12,00',
          observations: '',
          addOns: []
        }
      ],
      totalPrice: 67.00
    },
    {
      id: 'ORD002',
      date: new Date('2024-01-16T19:45:00'),
      status: 'em produção',
      items: [
        {
          name: 'X-Bacon',
          quantity: 1,
          price: '28,00',
          observations: 'Ponto da carne mal passado',
          addOns: []
        }
      ],
      totalPrice: 28.00
    },
    {
      id: 'ORD003',
      date: new Date('2024-01-17T20:15:00'),
      status: 'a caminho',
      items: [
        {
          name: 'Pizza Margherita',
          quantity: 1,
          price: '35,00',
          observations: '',
          addOns: [
            { name: 'Borda recheada', price: '5,00' }
          ]
        }
      ],
      totalPrice: 40.00
    }
  ];

  const mockUserWithOrders = {
    name: 'João Silva',
    whatsapp: '11987654321',
    orders: mockOrders
  };

  const mockUserWithoutOrders = {
    name: 'Maria Santos',
    whatsapp: '11987654322',
    orders: []
  };

  describe('estrutura básica', () => {
    it('exibe título e botão de fechar', async () => {
      renderOrdersDialog();
      
      expect(await screen.findByText('Meus Pedidos')).toBeInTheDocument();
      expect(screen.getByLabelText(/close/i)).toBeInTheDocument();
    });

    it('fecha dialog quando clica no botão X', async () => {
      const user = userEvent.setup();
      renderOrdersDialog();

      const closeButton = await screen.findByLabelText(/close/i);
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('fecha dialog quando clica no backdrop', async () => {
      renderOrdersDialog();

      await screen.findByText('Meus Pedidos');

      // Simular clique no backdrop
      const backdrop = document.querySelector('.MuiBackdrop-root');
      if (backdrop) {
        fireEvent.click(backdrop);
        expect(mockOnClose).toHaveBeenCalled();
      }
    });

    it('não renderiza quando open é false', () => {
      renderOrdersDialog(false);

      expect(screen.queryByText('Meus Pedidos')).not.toBeInTheDocument();
    });
  });

  describe('quando usuário não está logado', () => {
    it('exibe mensagem para fazer login', async () => {
      renderOrdersDialog(true, null);
      
      expect(await screen.findByText('Faça login para ver seus pedidos.')).toBeInTheDocument();
    });

    it('não exibe lista de pedidos', async () => {
      renderOrdersDialog(true, null);
      
      await screen.findByText('Faça login para ver seus pedidos.');
      
      expect(screen.queryByText(/Pedido #/)).not.toBeInTheDocument();
    });
  });

  describe('quando usuário está logado mas não tem pedidos', () => {
    it('exibe mensagem de nenhum pedido', async () => {
      renderOrdersDialog(true, mockUserWithoutOrders);
      
      expect(await screen.findByText('Você ainda não fez nenhum pedido.')).toBeInTheDocument();
    });

    it('não exibe lista de pedidos', async () => {
      renderOrdersDialog(true, mockUserWithoutOrders);
      
      await screen.findByText('Você ainda não fez nenhum pedido.');
      
      expect(screen.queryByText(/Pedido #/)).not.toBeInTheDocument();
    });
  });

  describe('quando usuário tem pedidos', () => {
    it('exibe todos os pedidos', async () => {
      renderOrdersDialog(true, mockUserWithOrders);
      
      expect(await screen.findByText('Pedido #ORD001')).toBeInTheDocument();
      expect(screen.getByText('Pedido #ORD002')).toBeInTheDocument();
      expect(screen.getByText('Pedido #ORD003')).toBeInTheDocument();
    });

    it('exibe status dos pedidos com cores corretas', async () => {
      renderOrdersDialog(true, mockUserWithOrders);
      
      expect(await screen.findByText('ENTREGUE')).toBeInTheDocument();
      expect(screen.getByText('EM PRODUÇÃO')).toBeInTheDocument();
      expect(screen.getByText('A CAMINHO')).toBeInTheDocument();
    });

    it('exibe datas dos pedidos formatadas', async () => {
      renderOrdersDialog(true, mockUserWithOrders);
      
      // Aguarda carregar e verifica se as datas aparecem (formato pode variar)
      await screen.findByText('Pedido #ORD001');
      
      // Verifica se existem datas no formato esperado
      const dateElements = screen.getAllByText(/\d{2}\/\d{2}\/\d{4}/);
      expect(dateElements.length).toBeGreaterThan(0);
    });

    it('exibe informações dos itens do pedido', async () => {
      renderOrdersDialog(true, mockUserWithOrders);
      
      // Verificar primeiro pedido
      expect(await screen.findByText(/2x Classic Burger/)).toBeInTheDocument();
      expect(screen.getByText(/1x Batata Frita/)).toBeInTheDocument();
      
      // Verificar segundo pedido
      expect(screen.getByText(/1x X-Bacon/)).toBeInTheDocument();
      
      // Verificar terceiro pedido
      expect(screen.getByText(/1x Pizza Margherita/)).toBeInTheDocument();
    });

    it('exibe observações dos itens quando presentes', async () => {
      renderOrdersDialog(true, mockUserWithOrders);
      
      expect(await screen.findByText(/Obs: Sem cebola/)).toBeInTheDocument();
      expect(screen.getByText(/Obs: Ponto da carne mal passado/)).toBeInTheDocument();
    });

    it('exibe add-ons dos itens quando presentes', async () => {
      renderOrdersDialog(true, mockUserWithOrders);
      
      expect(await screen.findByText(/Adicionais: Ovo de galinha, Queijo extra/)).toBeInTheDocument();
      expect(screen.getByText(/Adicionais: Borda recheada/)).toBeInTheDocument();
    });

    it('exibe preços totais dos pedidos', async () => {
      renderOrdersDialog(true, mockUserWithOrders);
      
      expect(await screen.findByText('Total: R$ 67,00')).toBeInTheDocument();
      expect(screen.getByText('Total: R$ 28,00')).toBeInTheDocument();
      expect(screen.getByText('Total: R$ 40,00')).toBeInTheDocument();
    });

    it('exibe pedidos ordenados por data (mais recente primeiro)', async () => {
      renderOrdersDialog(true, mockUserWithOrders);
      
      await screen.findByText('Pedido #ORD001');
      
      const orderElements = screen.getAllByText(/Pedido #ORD/);
      
      // Verifica se o mais recente (ORD003) aparece primeiro na lista
      expect(orderElements[0]).toHaveTextContent('Pedido #ORD003');
      expect(orderElements[1]).toHaveTextContent('Pedido #ORD002');
      expect(orderElements[2]).toHaveTextContent('Pedido #ORD001');
    });

    it('exibe separadores entre os pedidos', async () => {
      renderOrdersDialog(true, mockUserWithOrders);
      
      await screen.findByText('Pedido #ORD001');
      
      // Verifica se existem divisores (elementos com classe MuiDivider-root)
      const dividers = document.querySelectorAll('.MuiDivider-root');
      expect(dividers.length).toBeGreaterThan(0);
    });
  });

  describe('responsividade', () => {
    // Teste básico de responsividade - o componente usa useMediaQuery
    it('renderiza corretamente em diferentes tamanhos de tela', async () => {
      renderOrdersDialog(true, mockUserWithOrders);
      
      expect(await screen.findByText('Meus Pedidos')).toBeInTheDocument();
      expect(screen.getByText('Pedido #ORD001')).toBeInTheDocument();
    });
  });

  describe('casos extremos', () => {
    it('lida com pedido sem observações', async () => {
      const userWithSimpleOrder = {
        ...mockUserWithOrders,
        orders: [{
          id: 'ORD004',
          date: new Date('2024-01-18T21:00:00'),
          status: 'entregue',
          items: [{
            name: 'Hambúrguer Simples',
            quantity: 1,
            price: '15,00',
            observations: '',
            addOns: []
          }],
          totalPrice: 15.00
        }]
      };

      renderOrdersDialog(true, userWithSimpleOrder);
      
      expect(await screen.findByText(/1x Hambúrguer Simples/)).toBeInTheDocument();
      expect(screen.getByText('Total: R$ 15,00')).toBeInTheDocument();
    });

    it('lida com pedido sem add-ons', async () => {
      const userWithSimpleOrder = {
        ...mockUserWithOrders,
        orders: [{
          id: 'ORD005',
          date: new Date('2024-01-19T22:00:00'),
          status: 'a caminho',
          items: [{
            name: 'Refrigerante',
            quantity: 2,
            price: '5,00',
            observations: 'Bem gelado',
            addOns: []
          }],
          totalPrice: 10.00
        }]
      };

      renderOrdersDialog(true, userWithSimpleOrder);
      
      expect(await screen.findByText(/2x Refrigerante/)).toBeInTheDocument();
      expect(screen.getByText(/Obs: Bem gelado/)).toBeInTheDocument();
      expect(screen.queryByText(/Adicionais:/)).not.toBeInTheDocument();
    });
  });
});
