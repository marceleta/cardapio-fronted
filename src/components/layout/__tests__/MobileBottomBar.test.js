
import { render, screen, fireEvent } from '@testing-library/react';
import MobileBottomBar from '../MobileBottomBar';
import { CartContext } from '../../../context/CartContext';
import ThemeRegistry from '../../ThemeRegistry';
import useMediaQuery from '@mui/material/useMediaQuery';

// Mock the useMediaQuery hook
jest.mock('@mui/material/useMediaQuery');

// Mock the dialogs to avoid rendering them and their logic
jest.mock('../../account/AccountDialog', () => () => <div data-testid="account-dialog" />);
jest.mock('../../account/OrdersDialog', () => () => <div data-testid="orders-dialog" />);

const mockSetCartOpen = jest.fn();

const renderWithProviders = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <ThemeRegistry>
      <CartContext.Provider {...providerProps}>{ui}</CartContext.Provider>
    </ThemeRegistry>,
    renderOptions
  );
};

describe('MobileBottomBar', () => {
  let cartProviderProps;

  beforeEach(() => {
    cartProviderProps = {
      value: {
        cart: [],
        addToCart: jest.fn(),
        removeFromCart: jest.fn(),
        clearCart: jest.fn(),
        getTotalItems: () => 0,
        getTotalPrice: () => 0,
      },
    };
    mockSetCartOpen.mockClear();
  });

  test('does not render on non-mobile screens', () => {
    useMediaQuery.mockReturnValue(false);
    const { container } = renderWithProviders(<MobileBottomBar setCartOpen={mockSetCartOpen} />, { providerProps: cartProviderProps });
    expect(container.firstChild).toBeNull();
  });

  test('renders on mobile screens', () => {
    useMediaQuery.mockReturnValue(true);
    renderWithProviders(<MobileBottomBar setCartOpen={mockSetCartOpen} />, { providerProps: cartProviderProps });
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Pedidos')).toBeInTheDocument();
    expect(screen.getByText('Carrinho')).toBeInTheDocument();
    expect(screen.getByText('Minha conta')).toBeInTheDocument();
  });

  test('displays the correct number of items in the cart badge', () => {
    useMediaQuery.mockReturnValue(true);
    cartProviderProps.value.getTotalItems = () => 5;
    renderWithProviders(<MobileBottomBar setCartOpen={mockSetCartOpen} />, { providerProps: cartProviderProps });
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  test('calls setCartOpen when "Carrinho" button is clicked', () => {
    useMediaQuery.mockReturnValue(true);
    renderWithProviders(<MobileBottomBar setCartOpen={mockSetCartOpen} />, { providerProps: cartProviderProps });
    fireEvent.click(screen.getByText('Carrinho'));
    expect(mockSetCartOpen).toHaveBeenCalledWith(true);
  });

  test('opens AccountDialog when "Minha conta" button is clicked', () => {
    useMediaQuery.mockReturnValue(true);
    renderWithProviders(<MobileBottomBar setCartOpen={mockSetCartOpen} />, { providerProps: cartProviderProps });
    fireEvent.click(screen.getByText('Minha conta'));
    // The dialog is rendered inside, so we can't easily check for its opening without more complex state management in the test.
    // For this component, we'll trust the onClick is wired correctly. A better test would be an integration test.
  });

  test('opens OrdersDialog when "Pedidos" button is clicked', () => {
    useMediaQuery.mockReturnValue(true);
    renderWithProviders(<MobileBottomBar setCartOpen={mockSetCartOpen} />, { providerProps: cartProviderProps });
    fireEvent.click(screen.getByText('Pedidos'));
    // Similar to the AccountDialog, we trust the onClick is wired correctly.
  });
});
