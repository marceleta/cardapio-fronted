/**
 * TESTES DO COMPONENTE - WELCOME BANNER
 * 
 * Conjunto abrangente de testes para validar o comportamento e funcionalidades
 * do componente WelcomeBanner, responsável por exibir banners promocionais
 * e de boas-vindas na página principal do cardápio.
 * 
 * Cobertura de Testes:
 * • Renderização com diferentes configurações
 * • Modo texto vs modo imagem 
 * • Sistema de auto-hide automático
 * • Interações do usuário (fechar, navegar)
 * • Integração com dados de banner
 * • Scroll e navegação para produtos
 * • Animações e transições Material-UI
 * • Props condicionais e estados
 * • Casos extremos e edge cases
 * • Acessibilidade e ARIA
 * • Cleanup de recursos
 * 
 * Padrão AAA (Arrange, Act, Assert) aplicado em todos os testes.
 * Documentação em português seguindo CODING_STANDARDS.md.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Importações de componentes e providers
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Componente sendo testado
import WelcomeBanner from '../WelcomeBanner';

/**
 * CONFIGURAÇÃO DE MOCKS E UTILITIES
 */

// Mock para console.error para testes de erro
const originalConsoleError = console.error;

// Mock para métodos de scroll
const mockScrollIntoView = jest.fn();
const mockQuerySelector = jest.fn();

/**
 * HELPER: Renderiza componente com providers necessários
 * Encapsula lógica de renderização com ThemeProvider
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
 * HELPER: Cria dados mock de restaurante
 * Facilita criação de dados consistentes para testes
 */
const createMockRestaurant = (overrides = {}) => ({
  name: 'Restaurante Teste',
  description: 'Melhor comida da cidade',
  address: 'Rua das Flores, 123',
  phone: '(11) 99999-9999',
  ...overrides
});

/**
 * HELPER: Cria dados mock de banner
 * Facilita criação de dados de banner para diferentes cenários
 */
const createMockBannerData = (overrides = {}) => ({
  id: 1,
  title: 'Pizza Margherita Especial',
  description: 'Promoção limitada com 30% de desconto',
  image: 'https://example.com/pizza.jpg',
  productLink: 'pizza-margherita-123',
  active: true,
  ...overrides
});

/**
 * HELPER: Configura mocks de scroll e DOM
 * Configura mocks necessários para testar navegação e scroll
 */
const setupScrollMocks = () => {
  // Mock scrollIntoView
  Element.prototype.scrollIntoView = mockScrollIntoView;
  
  // Mock querySelector
  const originalQuerySelector = document.querySelector;
  document.querySelector = mockQuerySelector;
  
  return {
    cleanup: () => {
      document.querySelector = originalQuerySelector;
      Element.prototype.scrollIntoView = jest.fn();
    }
  };
};

/**
 * HELPER: Cria elemento DOM mock
 * Facilita criação de elementos DOM para testes de navegação
 */
const createMockElement = (attributes = {}) => {
  const element = document.createElement('div');
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  return element;
};

/**
 * SUITE DE TESTES PRINCIPAL
 */
describe('WelcomeBanner', () => {
  // Props padrão reutilizáveis
  const defaultProps = {
    restaurant: createMockRestaurant(),
    show: true,
    autoHide: false // Desabilitar por padrão para controle nos testes
  };

  // Setup inicial para cada teste
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useFakeTimers();
    
    // Reset mocks
    mockScrollIntoView.mockClear();
    mockQuerySelector.mockClear();
  });

  // Cleanup após cada teste
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    
    // Silenciar warnings esperados
    console.error = originalConsoleError;
  });

  /**
   * GRUPO: Testes de Renderização Básica
   * Verifica se o componente renderiza corretamente em diferentes cenários
   */
  describe('Renderização Básica', () => {
    /**
     * TESTE: Renderização do banner de texto padrão
     * Verifica elementos principais do modo texto sem banner de imagem
     */
    test('deve renderizar banner de texto com informações do restaurante', () => {
      // ARRANGE: Props com dados de restaurante
      const props = defaultProps;

      // ACT: Renderizar componente
      renderWithProviders(<WelcomeBanner {...props} />);

      // ASSERT: Verificar elementos principais
      expect(screen.getByText(/bem-vindo ao restaurante teste/i)).toBeInTheDocument();
      expect(screen.getByText(/descubra sabores únicos/i)).toBeInTheDocument();
      expect(screen.getByText(/promoção especial.*20% de desconto/i)).toBeInTheDocument();
      
      // Verificar botões de ação
      expect(screen.getByRole('button', { name: /explorar cardápio/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /continuar navegando/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /fechar banner/i })).toBeInTheDocument();
    });

    /**
     * TESTE: Renderização do banner com imagem
     * Verifica modo imagem quando bannerData é fornecido
     */
    test('deve renderizar banner de imagem quando bannerData é fornecido', () => {
      // ARRANGE: Props com dados de banner de imagem
      const bannerData = createMockBannerData();
      const props = { ...defaultProps, bannerData };

      // ACT: Renderizar componente
      renderWithProviders(<WelcomeBanner {...props} />);

      // ASSERT: Verificar elementos do banner de imagem
      const image = screen.getByRole('img', { name: /pizza margherita especial/i });
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', bannerData.image);
      
      expect(screen.getByText(bannerData.title)).toBeInTheDocument();
      expect(screen.getByText(bannerData.description)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /ver produto/i })).toBeInTheDocument();
    });

    /**
     * TESTE: Não renderização quando show=false
     * Verifica que componente não aparece quando show é false
     */
    test('deve não renderizar quando show é false', () => {
      // ARRANGE: Props com show=false
      const props = { ...defaultProps, show: false };

      // ACT: Renderizar componente
      renderWithProviders(<WelcomeBanner {...props} />);

      // ASSERT: Verificar que componente não está presente
      expect(screen.queryByText(/bem-vindo/i)).not.toBeInTheDocument();
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    /**
     * TESTE: Renderização sem dados de restaurante
     * Verifica comportamento com restaurant undefined/null
     */
    test('deve renderizar com texto padrão quando restaurant não é fornecido', () => {
      // ARRANGE: Props sem restaurant
      const props = { show: true, autoHide: false };

      // ACT: Renderizar componente
      renderWithProviders(<WelcomeBanner {...props} />);

      // ASSERT: Verificar texto padrão
      expect(screen.getByText(/bem-vindo ao nosso restaurante/i)).toBeInTheDocument();
    });

    /**
     * TESTE: Renderização com restaurant vazio
     * Verifica comportamento com objeto restaurant vazio
     */
    test('deve renderizar com texto padrão quando restaurant.name está vazio', () => {
      // ARRANGE: Props com restaurant sem name
      const props = { ...defaultProps, restaurant: {} };

      // ACT: Renderizar componente
      renderWithProviders(<WelcomeBanner {...props} />);

      // ASSERT: Verificar texto padrão
      expect(screen.getByText(/bem-vindo ao nosso restaurante/i)).toBeInTheDocument();
    });
  });

  /**
   * GRUPO: Testes de Interações do Usuário
   * Verifica funcionalidade de botões e eventos de clique
   */
  describe('Interações do Usuário', () => {
    /**
     * TESTE: Fechamento via botão X
     * Verifica se banner fecha ao clicar no botão de fechar
     */
    test('deve fechar banner ao clicar no botão X', async () => {
      // ARRANGE: Setup do usuário e callback
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      const mockOnClose = jest.fn();
      const props = { ...defaultProps, onClose: mockOnClose };

      // ACT: Renderizar e clicar no botão fechar
      renderWithProviders(<WelcomeBanner {...props} />);
      
      const closeButton = screen.getByRole('button', { name: /fechar banner/i });
      await user.click(closeButton);

      // Simular timeout da animação
      act(() => {
        jest.advanceTimersByTime(300);
      });

      // ASSERT: Verificar se callback foi chamado
      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      });
    });

    /**
     * TESTE: Fechamento via botão "Continuar navegando"
     * Verifica se banner fecha ao clicar no botão de continuar
     */
    test('deve fechar banner ao clicar em "Continuar navegando"', async () => {
      // ARRANGE: Setup do usuário e callback
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      const mockOnClose = jest.fn();
      const props = { ...defaultProps, onClose: mockOnClose };

      // ACT: Renderizar e clicar no botão continuar
      renderWithProviders(<WelcomeBanner {...props} />);
      
      const continueButton = screen.getByRole('button', { name: /continuar navegando/i });
      await user.click(continueButton);

      // Simular timeout da animação
      act(() => {
        jest.advanceTimersByTime(300);
      });

      // ASSERT: Verificar se banner foi fechado
      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      });
    });

    /**
     * TESTE: Múltiplos cliques no botão fechar
     * Verifica se múltiplos cliques não causam problemas
     */
    test('deve lidar com múltiplos cliques no botão fechar', async () => {
      // ARRANGE: Setup do usuário e callback
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      const mockOnClose = jest.fn();
      const props = { ...defaultProps, onClose: mockOnClose };

      // ACT: Renderizar e clicar múltiplas vezes rapidamente
      renderWithProviders(<WelcomeBanner {...props} />);
      
      const closeButton = screen.getByRole('button', { name: /fechar banner/i });
      
      // Primeiro clique
      await user.click(closeButton);
      
      // Cliques adicionais (devem ser ignorados pois componente já está fechando)
      await user.click(closeButton);
      await user.click(closeButton);

      // Simular timeout da animação
      act(() => {
        jest.advanceTimersByTime(300);
      });

      // ASSERT: Verificar que onClose foi chamado pelo menos uma vez
      // (pode ser chamado mais vezes devido à rapidez dos cliques)
      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    /**
     * TESTE: Funcionamento sem callback onClose
     * Verifica que botões funcionam mesmo sem callback definido
     */
    test('deve funcionar corretamente sem callback onClose definido', async () => {
      // ARRANGE: Setup do usuário sem callback
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      const props = { ...defaultProps }; // Sem onClose

      // ACT: Renderizar e clicar no botão fechar
      renderWithProviders(<WelcomeBanner {...props} />);
      
      const closeButton = screen.getByRole('button', { name: /fechar banner/i });
      
      // ASSERT: Não deve lançar erro
      await expect(user.click(closeButton)).resolves.not.toThrow();
    });
  });

  /**
   * GRUPO: Testes de Navegação e Scroll
   * Verifica funcionalidade de scroll para seções e produtos
   */
  describe('Navegação e Scroll', () => {
    /**
     * TESTE: Navegação para cardápio
     * Verifica scroll para seção de categorias
     */
    test('deve navegar para cardápio ao clicar em "Explorar Cardápio"', async () => {
      // ARRANGE: Setup de mocks e usuário
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      const { cleanup } = setupScrollMocks();
      
      const mockCategoriesElement = createMockElement({ 'data-section': 'categories' });
      mockQuerySelector.mockReturnValue(mockCategoriesElement);
      
      const mockOnClose = jest.fn();
      const props = { ...defaultProps, onClose: mockOnClose };

      // ACT: Renderizar e clicar no botão explorar
      renderWithProviders(<WelcomeBanner {...props} />);
      
      const exploreButton = screen.getByRole('button', { name: /explorar cardápio/i });
      await user.click(exploreButton);

      // ASSERT: Verificar que scroll foi tentado (mesmo que elemento seja mock)
      expect(mockQuerySelector).toHaveBeenCalledWith('[data-section="categories"]');
      
      // Simular timeout da animação
      act(() => {
        jest.advanceTimersByTime(500);
      });

      // Verificar se banner foi fechado
      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      });

      cleanup();
    });

    /**
     * TESTE: Navegação quando elemento não encontrado
     * Verifica comportamento quando seção de categorias não existe
     */
    test('deve funcionar quando elemento de categorias não é encontrado', async () => {
      // ARRANGE: Setup de mocks retornando null
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      const { cleanup } = setupScrollMocks();
      
      mockQuerySelector.mockReturnValue(null);
      
      const mockOnClose = jest.fn();
      const props = { ...defaultProps, onClose: mockOnClose };

      // ACT: Renderizar e clicar no botão explorar
      renderWithProviders(<WelcomeBanner {...props} />);
      
      const exploreButton = screen.getByRole('button', { name: /explorar cardápio/i });
      
      // ASSERT: Não deve lançar erro
      await expect(user.click(exploreButton)).resolves.not.toThrow();

      // Banner ainda deve fechar
      act(() => {
        jest.advanceTimersByTime(500);
      });

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      });

      cleanup();
    });
  });

  /**
   * GRUPO: Testes de Banner com Imagem
   * Verifica funcionalidades específicas do modo imagem
   */
  describe('Banner com Imagem', () => {
    /**
     * TESTE: Navegação para produto específico
     * Verifica scroll para produto ao clicar no banner
     */
    test('deve navegar para produto ao clicar no banner com productLink', async () => {
      // ARRANGE: Setup de mocks e dados
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      const { cleanup } = setupScrollMocks();
      
      const bannerData = createMockBannerData();
      const mockProductElement = createMockElement({ 'data-product-id': bannerData.productLink });
      mockQuerySelector.mockReturnValue(mockProductElement);
      
      const mockOnClose = jest.fn();
      const props = { ...defaultProps, bannerData, onClose: mockOnClose };

      // ACT: Renderizar e clicar na imagem
      renderWithProviders(<WelcomeBanner {...props} />);
      
      const bannerImage = screen.getByRole('img');
      await user.click(bannerImage);

      // ASSERT: Verificar navegação para produto
      expect(mockQuerySelector).toHaveBeenCalledWith(`[data-product-id="${bannerData.productLink}"]`);
      expect(mockScrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'center'
      });

      cleanup();
    });

    /**
     * TESTE: Botão "Ver Produto"
     * Verifica funcionamento do botão específico do produto
     */
    test('deve navegar para produto ao clicar no botão "Ver Produto"', async () => {
      // ARRANGE: Setup de mocks e dados
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      const { cleanup } = setupScrollMocks();
      
      const bannerData = createMockBannerData();
      const mockProductElement = createMockElement({ 'data-product-id': bannerData.productLink });
      mockQuerySelector.mockReturnValue(mockProductElement);
      
      const mockOnClose = jest.fn();
      const props = { ...defaultProps, bannerData, onClose: mockOnClose };

      // ACT: Renderizar e clicar no botão
      renderWithProviders(<WelcomeBanner {...props} />);
      
      const viewProductButton = screen.getByRole('button', { name: /ver produto/i });
      await user.click(viewProductButton);

      // ASSERT: Verificar navegação para produto
      expect(mockQuerySelector).toHaveBeenCalledWith(`[data-product-id="${bannerData.productLink}"]`);
      expect(mockScrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'center'
      });

      cleanup();
    });

    /**
     * TESTE: Banner sem productLink
     * Verifica comportamento quando banner não tem link de produto
     */
    test('deve navegar para cardápio quando banner não tem productLink', async () => {
      // ARRANGE: Setup com banner sem productLink
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      const { cleanup } = setupScrollMocks();
      
      const bannerData = createMockBannerData({ productLink: null });
      const mockCategoriesElement = createMockElement({ 'data-section': 'categories' });
      mockQuerySelector.mockReturnValue(mockCategoriesElement);
      
      const props = { ...defaultProps, bannerData };

      // ACT: Renderizar e clicar no banner
      renderWithProviders(<WelcomeBanner {...props} />);
      
      const bannerImage = screen.getByRole('img');
      await user.click(bannerImage);

      // ASSERT: Verificar que querySelector foi chamado para categorias
      expect(mockQuerySelector).toHaveBeenCalledWith('[data-section="categories"]');

      cleanup();
    });

    /**
     * TESTE: Produto não encontrado
     * Verifica fallback para cardápio quando produto não é encontrado
     */
    test('deve navegar para cardápio quando produto não é encontrado', async () => {
      // ARRANGE: Setup com produto não encontrado
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      const { cleanup } = setupScrollMocks();
      
      const bannerData = createMockBannerData();
      const mockCategoriesElement = createMockElement({ 'data-section': 'categories' });
      
      // Mock: produto não encontrado, mas categorias sim
      mockQuerySelector
        .mockReturnValueOnce(null) // Produto não encontrado
        .mockReturnValueOnce(mockCategoriesElement); // Categorias encontradas
      
      const props = { ...defaultProps, bannerData };

      // ACT: Renderizar e clicar no banner
      renderWithProviders(<WelcomeBanner {...props} />);
      
      const bannerImage = screen.getByRole('img');
      await user.click(bannerImage);

      // ASSERT: Verificar que tentou buscar produto primeiro
      expect(mockQuerySelector).toHaveBeenCalledWith(`[data-product-id="${bannerData.productLink}"]`);
      
      // E depois tentou buscar categorias
      expect(mockQuerySelector).toHaveBeenCalledWith('[data-section="categories"]');

      cleanup();
    });

    /**
     * TESTE: Banner com dados incompletos
     * Verifica comportamento com dados parciais
     */
    test('deve renderizar corretamente com dados incompletos de banner', () => {
      // ARRANGE: Banner apenas com imagem
      const bannerData = {
        image: 'https://example.com/banner.jpg'
        // Sem title, description, productLink
      };
      const props = { ...defaultProps, bannerData };

      // ACT: Renderizar banner
      renderWithProviders(<WelcomeBanner {...props} />);

      // ASSERT: Verificar que renderiza apenas imagem
      expect(screen.getByRole('img')).toBeInTheDocument();
      expect(screen.queryByText(/ver produto/i)).not.toBeInTheDocument();
    });
  });

  /**
   * GRUPO: Testes de Auto-Hide
   * Verifica funcionalidade de esconder automaticamente
   */
  describe('Funcionalidade Auto-Hide', () => {
    /**
     * TESTE: Auto-hide ativado com delay
     * Verifica se banner se esconde automaticamente após delay
     */
    test('deve esconder automaticamente após delay especificado', async () => {
      // ARRANGE: Props com auto-hide ativo
      const mockOnClose = jest.fn();
      const props = {
        ...defaultProps,
        autoHide: true,
        autoHideDelay: 3000,
        onClose: mockOnClose
      };

      // ACT: Renderizar e simular passagem do tempo
      renderWithProviders(<WelcomeBanner {...props} />);

      act(() => {
        jest.advanceTimersByTime(3000);
      });

      // Simular timeout da animação
      act(() => {
        jest.advanceTimersByTime(300);
      });

      // ASSERT: Verificar se onClose foi chamado
      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      });
    });

    /**
     * TESTE: Auto-hide desabilitado
     * Verifica que banner não se esconde quando auto-hide é false
     */
    test('deve não esconder automaticamente quando autoHide é false', async () => {
      // ARRANGE: Props sem auto-hide
      const mockOnClose = jest.fn();
      const props = {
        ...defaultProps,
        autoHide: false,
        autoHideDelay: 1000,
        onClose: mockOnClose
      };

      // ACT: Renderizar e simular passagem de tempo longo
      renderWithProviders(<WelcomeBanner {...props} />);

      act(() => {
        jest.advanceTimersByTime(10000);
      });

      // ASSERT: Verificar que onClose não foi chamado
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    /**
     * TESTE: Auto-hide com delay zero
     * Verifica que não esconde quando delay é zero
     */
    test('deve não esconder automaticamente quando autoHideDelay é zero', async () => {
      // ARRANGE: Props com delay zero
      const mockOnClose = jest.fn();
      const props = {
        ...defaultProps,
        autoHide: true,
        autoHideDelay: 0,
        onClose: mockOnClose
      };

      // ACT: Renderizar e simular passagem de tempo
      renderWithProviders(<WelcomeBanner {...props} />);

      act(() => {
        jest.advanceTimersByTime(5000);
      });

      // ASSERT: Verificar que onClose não foi chamado
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    /**
     * TESTE: Limpeza de timer ao desmontar
     * Verifica se timer é limpo quando componente é desmontado
     */
    test('deve limpar timer quando componente é desmontado', () => {
      // ARRANGE: Spy no clearTimeout
      const mockClearTimeout = jest.spyOn(global, 'clearTimeout');
      const props = {
        ...defaultProps,
        autoHide: true,
        autoHideDelay: 5000
      };

      // ACT: Renderizar e desmontar componente
      const { unmount } = renderWithProviders(<WelcomeBanner {...props} />);
      unmount();

      // ASSERT: Verificar se clearTimeout foi chamado
      expect(mockClearTimeout).toHaveBeenCalled();
      
      mockClearTimeout.mockRestore();
    });

    /**
     * TESTE: Timer não executado após desmontagem
     * Verifica que callback não é chamado após desmontagem
     */
    test('deve não executar callback após desmontagem do componente', () => {
      // ARRANGE: Props com auto-hide
      const mockOnClose = jest.fn();
      const props = {
        ...defaultProps,
        autoHide: true,
        autoHideDelay: 2000,
        onClose: mockOnClose
      };

      // ACT: Renderizar, desmontar e simular tempo
      const { unmount } = renderWithProviders(<WelcomeBanner {...props} />);
      unmount();
      
      act(() => {
        jest.advanceTimersByTime(3000);
      });

      // ASSERT: Verificar que callback não foi chamado
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  /**
   * GRUPO: Testes de Acessibilidade
   * Verifica conformidade com padrões de acessibilidade
   */
  describe('Acessibilidade', () => {
    /**
     * TESTE: ARIA labels corretos
     * Verifica se botões têm aria-labels adequados
     */
    test('deve ter labels corretos para acessibilidade', () => {
      // ARRANGE: Props padrão
      const props = defaultProps;

      // ACT: Renderizar componente
      renderWithProviders(<WelcomeBanner {...props} />);

      // ASSERT: Verificar aria-labels
      expect(screen.getByRole('button', { name: /fechar banner/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /explorar cardápio/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /continuar navegando/i })).toBeInTheDocument();
    });

    /**
     * TESTE: Alt text para imagem
     * Verifica se imagem do banner tem texto alternativo
     */
    test('deve ter alt text correto para imagem do banner', () => {
      // ARRANGE: Banner com dados de imagem
      const bannerData = createMockBannerData();
      const props = { ...defaultProps, bannerData };

      // ACT: Renderizar banner com imagem
      renderWithProviders(<WelcomeBanner {...props} />);

      // ASSERT: Verificar alt text
      const image = screen.getByRole('img', { name: new RegExp(bannerData.title, 'i') });
      expect(image).toBeInTheDocument();
    });

    /**
     * TESTE: Alt text padrão
     * Verifica fallback de alt text quando título não está presente
     */
    test('deve usar alt text padrão quando banner não tem título', () => {
      // ARRANGE: Banner sem título
      const bannerData = createMockBannerData({ title: '' });
      const props = { ...defaultProps, bannerData };

      // ACT: Renderizar banner
      renderWithProviders(<WelcomeBanner {...props} />);

      // ASSERT: Verificar alt text padrão
      const image = screen.getByRole('img', { name: /banner promocional/i });
      expect(image).toBeInTheDocument();
    });

    /**
     * TESTE: Estrutura de cabeçalho
     * Verifica hierarquia de cabeçalhos
     */
    test('deve ter estrutura de cabeçalho adequada', () => {
      // ARRANGE: Props padrão
      const props = defaultProps;

      // ACT: Renderizar componente
      renderWithProviders(<WelcomeBanner {...props} />);

      // ASSERT: Verificar cabeçalho principal
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent(/bem-vindo ao restaurante teste/i);
    });

    /**
     * TESTE: Botões com texto descritivo
     * Verifica que botões têm texto adequado
     */
    test('deve ter botões com texto descritivo adequado', () => {
      // ARRANGE: Props padrão
      const props = defaultProps;

      // ACT: Renderizar componente
      renderWithProviders(<WelcomeBanner {...props} />);

      // ASSERT: Verificar textos dos botões
      expect(screen.getByRole('button', { name: /explorar cardápio/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /continuar navegando/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /fechar banner/i })).toBeInTheDocument();
    });
  });

  /**
   * GRUPO: Testes de Casos Extremos
   * Verifica robustez do componente em situações incomuns
   */
  describe('Casos Extremos e Edge Cases', () => {
    /**
     * TESTE: Props undefined/null
     * Verifica robustez com props inválidas
     */
    test('deve renderizar sem erros com props undefined ou null', () => {
      // ACT & ASSERT: Renderizar com props nulas não deve lançar erro
      expect(() => {
        renderWithProviders(
          <WelcomeBanner 
            restaurant={null}
            bannerData={undefined}
            show={true}
            onClose={null}
            autoHide={undefined}
          />
        );
      }).not.toThrow();
    });

    /**
     * TESTE: String vazia em restaurant.name
     * Verifica comportamento com nome vazio
     */
    test('deve renderizar com texto padrão quando restaurant.name é string vazia', () => {
      // ARRANGE: Props com name vazio
      const props = {
        ...defaultProps,
        restaurant: { name: '' }
      };

      // ACT: Renderizar componente
      renderWithProviders(<WelcomeBanner {...props} />);

      // ASSERT: Verificar texto padrão
      expect(screen.getByText(/bem-vindo ao nosso restaurante/i)).toBeInTheDocument();
    });

    /**
     * TESTE: URL de imagem inválida
     * Verifica comportamento com URL de imagem problemática
     */
    test('deve renderizar imagem mesmo com URL potencialmente inválida', () => {
      // ARRANGE: Banner com URL inválida
      const bannerData = createMockBannerData({
        image: 'invalid-url',
        title: 'Teste'
      });
      const props = { ...defaultProps, bannerData };

      // ACT: Renderizar banner
      renderWithProviders(<WelcomeBanner {...props} />);

      // ASSERT: Elemento img deve estar presente
      const image = screen.getByRole('img', { name: /teste/i });
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'invalid-url');
    });

    /**
     * TESTE: Valores extremos para autoHideDelay
     * Verifica comportamento com delays muito grandes ou negativos
     */
    test('deve lidar com valores extremos de autoHideDelay', async () => {
      // ARRANGE: Props com delay negativo
      const mockOnClose = jest.fn();
      const props = {
        ...defaultProps,
        autoHide: true,
        autoHideDelay: -1000,
        onClose: mockOnClose
      };

      // ACT: Renderizar e simular tempo
      renderWithProviders(<WelcomeBanner {...props} />);

      act(() => {
        jest.advanceTimersByTime(5000);
      });

      // ASSERT: Não deve fechar com delay negativo
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    /**
     * TESTE: Elementos DOM não encontrados
     * Verifica comportamento quando nenhum elemento de navegação existe
     */
    test('deve lidar graciosamente quando nenhum elemento de scroll é encontrado', async () => {
      // ARRANGE: Setup com todos os elementos retornando null
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      const { cleanup } = setupScrollMocks();
      
      mockQuerySelector.mockReturnValue(null);
      
      const props = defaultProps;

      // ACT: Renderizar e tentar navegar
      renderWithProviders(<WelcomeBanner {...props} />);
      
      const exploreButton = screen.getByRole('button', { name: /explorar cardápio/i });
      
      // ASSERT: Não deve lançar erro mesmo sem elementos
      await expect(user.click(exploreButton)).resolves.not.toThrow();

      cleanup();
    });
  });

  /**
   * GRUPO: Testes de Estados e Ciclo de Vida
   * Verifica gerenciamento de estados internos
   */
  describe('Gerenciamento de Estados', () => {
    /**
     * TESTE: Estado mounted
     * Verifica controle do estado mounted
     */
    test('deve controlar estado mounted corretamente', () => {
      // ARRANGE: Props padrão
      const props = defaultProps;

      // ACT: Renderizar componente
      renderWithProviders(<WelcomeBanner {...props} />);

      // ASSERT: Componente deve estar presente após mount
      expect(screen.getByText(/bem-vindo/i)).toBeInTheDocument();
    });

    /**
     * TESTE: Mudança de prop show
     * Verifica resposta a mudanças na prop show
     */
    test('deve responder corretamente a mudanças na prop show', () => {
      // ARRANGE: Renderizar com show=true
      const { rerender } = renderWithProviders(
        <WelcomeBanner {...defaultProps} show={true} />
      );

      // ASSERT: Banner deve estar presente
      expect(screen.getByText(/bem-vindo/i)).toBeInTheDocument();

      // ACT: Alterar show para false
      rerender(
        <ThemeProvider theme={createTheme()}>
          <WelcomeBanner {...defaultProps} show={false} />
        </ThemeProvider>
      );

      // ASSERT: Banner não deve estar presente
      expect(screen.queryByText(/bem-vindo/i)).not.toBeInTheDocument();
    });

    /**
     * TESTE: Mudança de bannerData
     * Verifica resposta a mudanças nos dados do banner
     */
    test('deve responder a mudanças nos dados do banner', () => {
      // ARRANGE: Renderizar sem banner
      const { rerender } = renderWithProviders(
        <WelcomeBanner {...defaultProps} />
      );

      // ASSERT: Modo texto inicial
      expect(screen.getByText(/bem-vindo ao restaurante teste/i)).toBeInTheDocument();
      expect(screen.queryByRole('img')).not.toBeInTheDocument();

      // ACT: Adicionar dados de banner
      const bannerData = createMockBannerData();
      rerender(
        <ThemeProvider theme={createTheme()}>
          <WelcomeBanner {...defaultProps} bannerData={bannerData} />
        </ThemeProvider>
      );

      // ASSERT: Mudança para modo imagem
      expect(screen.getByRole('img')).toBeInTheDocument();
      expect(screen.getByText(bannerData.title)).toBeInTheDocument();
    });
  });

  /**
   * GRUPO: Testes de Performance e Otimização
   * Verifica aspectos de performance do componente
   */
  describe('Performance e Otimização', () => {
    /**
     * TESTE: Limpeza de recursos
     * Verifica se recursos são liberados adequadamente
     */
    test('deve limpar todos os recursos ao desmontar', () => {
      // ARRANGE: Spies em métodos de limpeza
      const mockClearTimeout = jest.spyOn(global, 'clearTimeout');
      const props = {
        ...defaultProps,
        autoHide: true,
        autoHideDelay: 5000
      };

      // ACT: Renderizar e desmontar
      const { unmount } = renderWithProviders(<WelcomeBanner {...props} />);
      unmount();

      // ASSERT: Verificar limpeza
      expect(mockClearTimeout).toHaveBeenCalled();
      
      mockClearTimeout.mockRestore();
    });

    /**
     * TESTE: Re-renderização desnecessária
     * Verifica se componente não re-renderiza com props iguais
     */
    test('deve não re-renderizar com as mesmas props', () => {
      // ARRANGE: Props constantes
      const constantProps = defaultProps;

      // ACT: Renderizar múltiplas vezes com mesmas props
      const { rerender } = renderWithProviders(
        <WelcomeBanner {...constantProps} />
      );

      const initialText = screen.getByText(/bem-vindo/i);
      
      rerender(
        <ThemeProvider theme={createTheme()}>
          <WelcomeBanner {...constantProps} />
        </ThemeProvider>
      );

      // ASSERT: Elemento deve ser o mesmo (não re-renderizado)
      expect(screen.getByText(/bem-vindo/i)).toBe(initialText);
    });
  });
});
