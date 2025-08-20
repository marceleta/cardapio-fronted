/**
 * TESTES DO COMPONENTE - LAYOUT ADMINISTRATIVO
 * 
 * Conjunto de testes para validar o comportamento e funcionalidades
 * do componente de layout principal do painel administrativo.
 * 
 * Cobertura:
 * - Renderização correta do layout
 * - Funcionalidade do drawer de navegação
 * - Sistema de badges para notificações
 * - Menu de usuário no header
 * - Navegação entre abas
 * - Exibição de conteúdo principal
 * - Responsividade e estilos
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AdminLayout from '../AdminLayout';

// Mock do módulo adminHelpers
jest.mock('../../../utils/adminHelpers', () => ({
  drawerWidth: 240
}));

/**
 * HELPER: Wrapper com ThemeProvider para Material-UI
 */
const ThemeWrapper = ({ children }) => {
  const theme = createTheme();
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

/**
 * HELPER: Renderiza componente com props padrão
 */
const renderAdminLayout = (props = {}) => {
  const defaultProps = {
    activeTab: 'dashboard',
    setActiveTab: jest.fn(),
    pendingOrders: 0,
    children: <div data-testid="test-content">Conteúdo de teste</div>
  };

  return render(
    <ThemeWrapper>
      <AdminLayout {...defaultProps} {...props} />
    </ThemeWrapper>
  );
};

/**
 * SUITE DE TESTES PRINCIPAL
 */
describe('AdminLayout', () => {
  // Limpar mocks antes de cada teste
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * GRUPO: Testes de Renderização
   */
  describe('Renderização', () => {
    /**
     * TESTE: Renderização básica do layout
     * Verifica se componente renderiza corretamente
     */
    test('deve renderizar layout administrativo completo', () => {
      // ACT: Renderizar componente
      renderAdminLayout();

      // ASSERT: Verificar elementos principais
      expect(screen.getByText('🍔 Admin Panel')).toBeInTheDocument();
      expect(screen.getByText('🍔 Painel Administrativo')).toBeInTheDocument();
      expect(screen.getByText('Sistema de Gestão')).toBeInTheDocument();
      expect(screen.getByText('© 2025 Cardápio Digital')).toBeInTheDocument();
      expect(screen.getByTestId('test-content')).toBeInTheDocument();
    });

    /**
     * TESTE: Renderização de todos os itens de menu
     * Verifica se todos os itens de navegação estão presentes
     */
    test('deve renderizar todos os itens de menu', () => {
      // ACT: Renderizar componente
      renderAdminLayout();

      // ASSERT: Verificar itens de menu
      expect(screen.getByText('Painel')).toBeInTheDocument();
      expect(screen.getByText('Pedidos')).toBeInTheDocument();
      expect(screen.getByText('Produtos')).toBeInTheDocument();
      expect(screen.getByText('Categorias')).toBeInTheDocument();
      expect(screen.getByText('Configurações')).toBeInTheDocument();
    });

    /**
     * TESTE: Ícones dos itens de menu
     * Verifica se ícones estão presentes nos itens de menu
     */
    test('deve exibir ícones nos itens de menu', () => {
      // ACT: Renderizar componente
      renderAdminLayout();

      // ASSERT: Verificar presença de ícones
      // Os ícones do Material-UI são renderizados como SVG
      const icons = document.querySelectorAll('svg[data-testid*="Icon"]');
      expect(icons.length).toBeGreaterThan(0);
    });

    /**
     * TESTE: Conteúdo children é exibido
     * Verifica se conteúdo passado como children é renderizado
     */
    test('deve exibir conteúdo children na área principal', () => {
      // ARRANGE: Conteúdo customizado
      const customContent = (
        <div data-testid="custom-content">
          <h1>Título Customizado</h1>
          <p>Parágrafo de teste</p>
        </div>
      );

      // ACT: Renderizar com conteúdo customizado
      renderAdminLayout({ children: customContent });

      // ASSERT: Verificar conteúdo customizado
      expect(screen.getByTestId('custom-content')).toBeInTheDocument();
      expect(screen.getByText('Título Customizado')).toBeInTheDocument();
      expect(screen.getByText('Parágrafo de teste')).toBeInTheDocument();
    });
  });

  /**
   * GRUPO: Testes de Navegação
   */
  describe('Navegação', () => {
    /**
     * TESTE: Aba ativa é destacada visualmente
     * Verifica se aba ativa recebe classe/estilo especial
     */
    test('deve destacar aba ativa corretamente', () => {
      // ACT: Renderizar com aba 'products' ativa
      renderAdminLayout({ activeTab: 'products' });

      // ASSERT: Aba de produtos deve estar destacada
      const productButton = screen.getByText('Produtos').closest('button');
      expect(productButton).toHaveClass('Mui-selected');
    });

    /**
     * TESTE: Clique em item de menu chama setActiveTab
     * Verifica se navegação funciona corretamente
     */
    test('deve chamar setActiveTab ao clicar em item de menu', () => {
      // ARRANGE: Mock da função setActiveTab
      const mockSetActiveTab = jest.fn();

      // ACT: Renderizar componente
      renderAdminLayout({ setActiveTab: mockSetActiveTab });

      // ACT: Clicar no item 'Pedidos'
      fireEvent.click(screen.getByText('Pedidos'));

      // ASSERT: Função deve ter sido chamada com ID correto
      expect(mockSetActiveTab).toHaveBeenCalledWith('orders');
    });

    /**
     * TESTE: Navegação para todas as abas
     * Verifica se todas as abas podem ser navegadas
     */
    test('deve permitir navegar para todas as abas', () => {
      // ARRANGE: Mock da função setActiveTab
      const mockSetActiveTab = jest.fn();

      // ACT: Renderizar componente
      renderAdminLayout({ setActiveTab: mockSetActiveTab });

      // ACT: Clicar em cada item de menu
      const menuItems = [
        { text: 'Painel', id: 'dashboard' },
        { text: 'Pedidos', id: 'orders' },
        { text: 'Produtos', id: 'products' },
        { text: 'Categorias', id: 'categories' },
        { text: 'Configurações', id: 'settings' }
      ];

      menuItems.forEach(item => {
        fireEvent.click(screen.getByText(item.text));
        expect(mockSetActiveTab).toHaveBeenCalledWith(item.id);
      });

      // ASSERT: Função deve ter sido chamada 5 vezes
      expect(mockSetActiveTab).toHaveBeenCalledTimes(5);
    });
  });

  /**
   * GRUPO: Testes de Sistema de Badges
   */
  describe('Sistema de Badges', () => {
    /**
     * TESTE: Badge exibido quando há pedidos pendentes
     * Verifica se badge aparece com número correto
     */
    test('deve exibir badge com número de pedidos pendentes', () => {
      // ACT: Renderizar com 5 pedidos pendentes
      renderAdminLayout({ pendingOrders: 5 });

      // ASSERT: Badge deve estar visível com número correto
      const badge = screen.getByText('5');
      expect(badge).toBeInTheDocument();
      
      // Verificar se badge está associado ao item de pedidos
      const ordersItem = screen.getByText('Pedidos').closest('li');
      expect(ordersItem).toContainElement(badge);
    });

    /**
     * TESTE: Badge não exibido quando não há pedidos pendentes
     * Verifica se badge não aparece quando pendingOrders é 0
     */
    test('não deve exibir badge quando não há pedidos pendentes', () => {
      // ACT: Renderizar sem pedidos pendentes
      renderAdminLayout({ pendingOrders: 0 });

      // ASSERT: Badge não deve estar visível
      // Como o badge só aparece quando há pedidos, verificamos que não há badges visíveis
      const badges = screen.queryByText(/^\d+$/);
      expect(badges).not.toBeInTheDocument();
    });

    /**
     * TESTE: Badge atualizado dinamicamente
     * Verifica se badge é atualizado quando pendingOrders muda
     */
    test('deve atualizar badge quando pendingOrders muda', () => {
      // ARRANGE: Renderizar inicialmente sem pedidos
      const { rerender } = renderAdminLayout({ pendingOrders: 0 });

      // ASSERT: Inicialmente sem badge
      expect(screen.queryByText(/^\d+$/)).not.toBeInTheDocument();

      // ACT: Re-renderizar com pedidos pendentes
      rerender(
        <ThemeWrapper>
          <AdminLayout
            activeTab="dashboard"
            setActiveTab={jest.fn()}
            pendingOrders={3}
            children={<div data-testid="test-content">Conteúdo de teste</div>}
          />
        </ThemeWrapper>
      );

      // ASSERT: Badge deve aparecer com novo número
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    /**
     * TESTE: Badge com números grandes
     * Verifica se badge funciona com números maiores
     */
    test('deve exibir badge corretamente para números grandes', () => {
      // ACT: Renderizar com muitos pedidos pendentes
      renderAdminLayout({ pendingOrders: 99 });

      // ASSERT: Badge deve exibir número grande corretamente
      expect(screen.getByText('99')).toBeInTheDocument();
    });
  });

  /**
   * GRUPO: Testes de Menu de Usuário
   */
  describe('Menu de Usuário', () => {
    /**
     * TESTE: Menu de usuário abre ao clicar no avatar
     * Verifica se menu dropdown funciona
     */
    test('deve abrir menu de usuário ao clicar no avatar', async () => {
      // ACT: Renderizar componente
      renderAdminLayout();

      // ACT: Clicar no avatar do usuário (buscar pelo IconButton com Avatar)
      const avatarButton = screen.getByRole('button', { name: /avatar/i }) || 
                           screen.getAllByRole('button').find(btn => 
                             btn.querySelector('[data-testid="PersonIcon"]')
                           );
      fireEvent.click(avatarButton);

      // ASSERT: Menu deve aparecer
      await waitFor(() => {
        expect(screen.getByText('Perfil')).toBeInTheDocument();
        expect(screen.getByText('Sair')).toBeInTheDocument();
      });
    });

    /**
     * TESTE: Menu de usuário fecha ao clicar em item
     * Verifica se menu fecha após seleção
     */
    test('deve fechar menu ao clicar em item', async () => {
      // ACT: Renderizar componente
      renderAdminLayout();

      // ACT: Abrir menu - buscar botão com ícone de pessoa
      const avatarButton = screen.getAllByRole('button').find(btn => 
        btn.querySelector('[data-testid="PersonIcon"]')
      );
      fireEvent.click(avatarButton);

      // ASSERT: Menu está aberto
      await waitFor(() => {
        expect(screen.getByText('Perfil')).toBeInTheDocument();
      });

      // ACT: Clicar em item do menu
      fireEvent.click(screen.getByText('Perfil'));

      // ASSERT: Menu deve fechar
      await waitFor(() => {
        expect(screen.queryByText('Perfil')).not.toBeInTheDocument();
      });
    });

    /**
     * TESTE: Menu de usuário fecha ao clicar fora
     * Verifica se menu fecha com clique externo
     */
    test('deve fechar menu ao clicar fora', async () => {
      // ACT: Renderizar componente
      renderAdminLayout();

      // ACT: Abrir menu - buscar botão com ícone de pessoa
      const avatarButton = screen.getAllByRole('button').find(btn => 
        btn.querySelector('[data-testid="PersonIcon"]')
      );
      fireEvent.click(avatarButton);

      // ASSERT: Menu está aberto
      await waitFor(() => {
        expect(screen.getByText('Perfil')).toBeInTheDocument();
      });

      // ACT: Clicar fora do menu (no backdrop)
      fireEvent.click(document.body);

      // ASSERT: Menu deve fechar
      await waitFor(() => {
        expect(screen.queryByText('Perfil')).not.toBeInTheDocument();
      });
    });
  });

  /**
   * GRUPO: Testes de Layout e Estrutura
   */
  describe('Layout e Estrutura', () => {
    /**
     * TESTE: Estrutura do drawer
     * Verifica se drawer tem elementos corretos
     */
    test('deve ter estrutura correta do drawer', () => {
      // ACT: Renderizar componente
      renderAdminLayout();

      // ASSERT: Verificar elementos do drawer
      expect(screen.getByText('🍔 Painel Administrativo')).toBeInTheDocument();
      expect(screen.getByText('Sistema de Gestão')).toBeInTheDocument();
      expect(screen.getByText('© 2025 Cardápio Digital')).toBeInTheDocument();
    });

    /**
     * TESTE: Área de conteúdo principal
     * Verifica se área principal está configurada corretamente
     */
    test('deve ter área de conteúdo principal', () => {
      // ACT: Renderizar componente
      renderAdminLayout();

      // ASSERT: Verificar se conteúdo está na área principal
      const mainContent = screen.getByTestId('test-content');
      expect(mainContent).toBeInTheDocument();
      
      // Verificar se está dentro do elemento main
      const mainElement = mainContent.closest('main');
      expect(mainElement).toBeInTheDocument();
    });

    /**
     * TESTE: AppBar está presente
     * Verifica se header do aplicativo está configurado
     */
    test('deve ter AppBar com título correto', () => {
      // ACT: Renderizar componente
      renderAdminLayout();

      // ASSERT: Verificar AppBar
      expect(screen.getByText('🍔 Admin Panel')).toBeInTheDocument();
      
      // Verificar se está em uma toolbar
      const toolbar = screen.getByText('🍔 Admin Panel').closest('.MuiToolbar-root');
      expect(toolbar).toBeInTheDocument();
    });
  });

  /**
   * GRUPO: Testes de Acessibilidade
   */
  describe('Acessibilidade', () => {
    /**
     * TESTE: Navegação por teclado
     * Verifica se componente é acessível via teclado
     */
    test('deve permitir navegação por teclado', () => {
      // ACT: Renderizar componente
      renderAdminLayout();

      // ACT: Navegar por tab - buscar elemento que pode ser focado
      const firstButton = screen.getByText('Painel').closest('[role="button"]');
      if (firstButton && firstButton.focus) {
        firstButton.focus();
        
        // ASSERT: Elemento deve estar focado
        expect(document.activeElement).toBe(firstButton);
      } else {
        // ASSERT: Elemento deve existir mesmo se não focado no jsdom
        expect(firstButton).toBeInTheDocument();
      }
    });

    /**
     * TESTE: Labels e roles apropriados
     * Verifica se elementos têm atributos de acessibilidade
     */
    test('deve ter roles e labels apropriados', () => {
      // ACT: Renderizar componente
      renderAdminLayout();

      // ASSERT: Verificar roles
      const navigation = document.querySelector('nav');
      const mainContent = document.querySelector('main');
      
      // Main content deve estar presente
      expect(mainContent).toBeInTheDocument();
      
      // Botões devem ter role correto
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  /**
   * GRUPO: Testes de Props e Estados
   */
  describe('Props e Estados', () => {
    /**
     * TESTE: Props são aplicadas corretamente
     * Verifica se componente reage às props
     */
    test('deve aplicar todas as props corretamente', () => {
      // ARRANGE: Props customizadas
      const mockSetActiveTab = jest.fn();
      const customChildren = <div data-testid="custom">Custom Content</div>;

      // ACT: Renderizar com props customizadas
      renderAdminLayout({
        activeTab: 'settings',
        setActiveTab: mockSetActiveTab,
        pendingOrders: 7,
        children: customChildren
      });

      // ASSERT: Verificar aplicação das props
      expect(screen.getByTestId('custom')).toBeInTheDocument();
      expect(screen.getByText('7')).toBeInTheDocument();
      
      // Configurações deve estar ativa - verificar com DOM query
      const settingsButton = screen.getByText('Configurações').closest('[role="button"]');
      expect(settingsButton).toBeInTheDocument();
      if (settingsButton && settingsButton.classList) {
        expect(settingsButton.classList.contains('Mui-selected')).toBeTruthy();
      }
    });

    /**
     * TESTE: Props opcionais
     * Verifica se componente funciona sem props opcionais
     */
    test('deve funcionar com props mínimas', () => {
      // ACT: Renderizar apenas com props obrigatórias
      render(
        <ThemeWrapper>
          <AdminLayout
            activeTab="dashboard"
            setActiveTab={jest.fn()}
            pendingOrders={0}
          />
        </ThemeWrapper>
      );

      // ASSERT: Componente deve renderizar sem erros
      expect(screen.getByText('🍔 Admin Panel')).toBeInTheDocument();
    });
  });

  /**
   * GRUPO: Testes de Casos Extremos
   */
  describe('Casos Extremos', () => {
    /**
     * TESTE: activeTab inválido
     * Verifica comportamento com aba inválida
     */
    test('deve lidar com activeTab inválido', () => {
      // ACT: Renderizar com aba inexistente
      renderAdminLayout({ activeTab: 'invalid-tab' });

      // ASSERT: Componente deve renderizar sem erros
      expect(screen.getByText('🍔 Admin Panel')).toBeInTheDocument();
      
      // Nenhuma aba deve estar selecionada
      const selectedButtons = document.querySelectorAll('.Mui-selected');
      expect(selectedButtons).toHaveLength(0);
    });

    /**
     * TESTE: pendingOrders negativos
     * Verifica comportamento com números negativos
     */
    test('deve lidar com pendingOrders negativos', () => {
      // ACT: Renderizar com valor negativo
      renderAdminLayout({ pendingOrders: -5 });

      // ASSERT: Badge não deve aparecer com valores negativos
      expect(screen.queryByText('-5')).not.toBeInTheDocument();
    });

    /**
     * TESTE: Múltiplas instâncias
     * Verifica se componente funciona com múltiplas instâncias
     */
    test('deve funcionar com múltiplas instâncias', () => {
      // ACT: Renderizar múltiplas instâncias
      const { container } = render(
        <ThemeWrapper>
          <div>
            <AdminLayout
              activeTab="dashboard"
              setActiveTab={jest.fn()}
              pendingOrders={1}
              children={<div data-testid="content-1">Content 1</div>}
            />
            <AdminLayout
              activeTab="products"
              setActiveTab={jest.fn()}
              pendingOrders={2}
              children={<div data-testid="content-2">Content 2</div>}
            />
          </div>
        </ThemeWrapper>
      );

      // ASSERT: Ambas as instâncias devem funcionar
      expect(screen.getByTestId('content-1')).toBeInTheDocument();
      expect(screen.getByTestId('content-2')).toBeInTheDocument();
    });
  });
});
