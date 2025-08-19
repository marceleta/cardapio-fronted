import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductDetailDialog from '../ProductDetailDialog';
import ThemeRegistry from '../../ThemeRegistry';
import { CartProvider } from '../../../context/CartContext';

// Mock product data
const mockProduct = {
  id: 1,
  name: 'Classic Burger',
  description: 'Pão, carne, queijo, alface, tomate e molho especial.',
  price: '25,00',
  imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd',
  addOns: [
    {
      title: 'Adicionais',
      options: [
        { name: 'Ovo de galinha', price: '2,00' },
        { name: 'Queijo extra', price: '3,50' },
        { name: 'Bacon', price: '4,00' }
      ]
    }
  ]
};

const mockProductWithoutAddOns = {
  id: 2,
  name: 'Simple Burger',
  description: 'Hambúrguer simples.',
  price: '20,00',
  imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd'
};

describe('ProductDetailDialog', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderProductDetailDialog = (item = mockProduct, open = true) => {
    return render(
      <ThemeRegistry>
        <CartProvider>
          <ProductDetailDialog
            open={open}
            item={item}
            onClose={mockOnClose}
          />
        </CartProvider>
      </ThemeRegistry>
    );
  };

  it('exibe informações do produto corretamente', async () => {
    renderProductDetailDialog();
    
    expect(await screen.findAllByText('Classic Burger')).toHaveLength(2);
    expect(screen.getByText('Pão, carne, queijo, alface, tomate e molho especial.')).toBeInTheDocument();
    expect(screen.getByText('R$ 25,00')).toBeInTheDocument();
    expect(screen.getByAltText('Classic Burger')).toBeInTheDocument();
  });

  it('ajusta quantidade com botões + e -', async () => {
    const user = userEvent.setup();
    renderProductDetailDialog();

    const quantityDisplay = await screen.findByText('1');
    const buttons = screen.getAllByRole('button');
    const decrementButton = buttons.find(btn => btn.querySelector('svg[data-testid="RemoveIcon"]'));
    const incrementButton = buttons.find(btn => btn.querySelector('svg[data-testid="AddIcon"]'));

    // Verificar que começa com 1
    expect(quantityDisplay).toBeInTheDocument();

    // Aumentar quantidade
    await user.click(incrementButton);
    expect(await screen.findByText('2')).toBeInTheDocument();

    // Aumentar novamente
    await user.click(incrementButton);
    expect(await screen.findByText('3')).toBeInTheDocument();

    // Diminuir quantidade
    await user.click(decrementButton);
    expect(await screen.findByText('2')).toBeInTheDocument();

    // Diminuir para 1
    await user.click(decrementButton);
    expect(await screen.findByText('1')).toBeInTheDocument();

    // Verificar que o botão de diminuir está desabilitado quando quantity = 1
    expect(decrementButton).toBeDisabled();
  });

  it('aceita input no campo de observações', async () => {
    const user = userEvent.setup();
    renderProductDetailDialog();

    const observationsField = await screen.findByLabelText(/observações/i);
    const testText = 'Sem cebola, por favor';

    await user.type(observationsField, testText);
    expect(observationsField).toHaveValue(testText);
  });

  it('permite selecionar e desselecionar add-ons', async () => {
    const user = userEvent.setup();
    renderProductDetailDialog();

    // Aguarda o carregamento do componente
    await screen.findAllByText('Classic Burger');

    const eggCheckbox = screen.getByRole('checkbox', { name: /ovo de galinha/i });
    const cheeseCheckbox = screen.getByRole('checkbox', { name: /queijo extra/i });
    const baconCheckbox = screen.getByRole('checkbox', { name: /bacon/i });

    // Verificar que nenhum add-on está selecionado inicialmente
    expect(eggCheckbox).not.toBeChecked();
    expect(cheeseCheckbox).not.toBeChecked();
    expect(baconCheckbox).not.toBeChecked();

    // Selecionar add-ons
    await user.click(eggCheckbox);
    expect(eggCheckbox).toBeChecked();

    await user.click(cheeseCheckbox);
    expect(cheeseCheckbox).toBeChecked();

    // Desselecionar add-on
    await user.click(eggCheckbox);
    expect(eggCheckbox).not.toBeChecked();
  });

  it('atualiza preço total com add-ons e quantidade', async () => {
    const user = userEvent.setup();
    renderProductDetailDialog();

    await screen.findAllByText('Classic Burger');

    const addToCartButton = screen.getByRole('button', { name: /adicionar/i });

    // Preço inicial (R$ 25,00)
    expect(addToCartButton).toHaveTextContent('R$ 25,00');

    // Adicionar add-on (R$ 25,00 + R$ 2,00 = R$ 27,00)
    const eggCheckbox = screen.getByRole('checkbox', { name: /ovo de galinha/i });
    await user.click(eggCheckbox);
    await waitFor(() => {
      expect(addToCartButton).toHaveTextContent('R$ 27,00');
    });

    // Aumentar quantidade (R$ 27,00 * 2 = R$ 54,00)
    const buttons = screen.getAllByRole('button');
    const incrementButton = buttons.find(btn => btn.querySelector('svg[data-testid="AddIcon"]'));
    await user.click(incrementButton);
    await waitFor(() => {
      expect(addToCartButton).toHaveTextContent('R$ 54,00');
    });
  });

  it('adiciona item ao carrinho com configurações corretas', async () => {
    const user = userEvent.setup();
    
    renderProductDetailDialog();

    await screen.findAllByText('Classic Burger');

    const observationsField = screen.getByLabelText(/observações/i);
    const eggCheckbox = screen.getByRole('checkbox', { name: /ovo de galinha/i });
    const addToCartButton = screen.getByRole('button', { name: /adicionar/i });

    // Configurar item
    const buttons = screen.getAllByRole('button');
    const incrementButton = buttons.find(btn => btn.querySelector('svg[data-testid="AddIcon"]'));
    await user.click(incrementButton); // Quantidade = 2
    await user.type(observationsField, 'Sem cebola');
    await user.click(eggCheckbox); // Adicionar ovo

    // Adicionar ao carrinho
    await user.click(addToCartButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('fecha dialog quando clica no botão X', async () => {
    const user = userEvent.setup();
    renderProductDetailDialog();

    await screen.findAllByText('Classic Burger');

    const closeButton = screen.getByLabelText(/close/i);
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('fecha dialog quando clica no backdrop', async () => {
    renderProductDetailDialog();

    await screen.findAllByText('Classic Burger');

    // Simular clique no backdrop
    const backdrop = document.querySelector('.MuiBackdrop-root');
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(mockOnClose).toHaveBeenCalled();
    }
  });

  it('não exibe seção de add-ons quando produto não tem add-ons', async () => {
    renderProductDetailDialog(mockProductWithoutAddOns);

    await screen.findAllByText('Simple Burger');

    // Não deve existir checkboxes de add-ons
    expect(screen.queryByRole('checkbox', { name: /ovo de galinha/i })).not.toBeInTheDocument();
    expect(screen.queryByText('Adicionais')).not.toBeInTheDocument();
  });

  it('não renderiza quando open é false', () => {
    renderProductDetailDialog(mockProduct, false);

    expect(screen.queryByText('Classic Burger')).not.toBeInTheDocument();
  });
});
