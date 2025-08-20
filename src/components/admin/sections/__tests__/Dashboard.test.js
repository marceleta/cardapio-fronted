/**
 * TESTES DO COMPONENTE - DASHBOARD ADMINISTRATIVO
 * 
 * Conjunto de testes para validar o comportamento e funcionalidades
 * do componente de dashboard do painel administrativo.
 * 
 * Cobertura:
 * - Renderização de estatísticas em cards
 * - Cálculo e exibição de métricas
 * - Tabela de pedidos recentes
 * - Interação com visualização de pedidos
 * - Estados com diferentes dados
 * - Formatação de valores e datas
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Dashboard from '../Dashboard';

// Mock do módulo adminHelpers
jest.mock('../../../../utils/adminHelpers', () => ({
  calculateDashboardStats: jest.fn(),
  getStatusLabel: jest.fn()
}));

import { calculateDashboardStats, getStatusLabel } from '../../../../utils/adminHelpers';

/**
 * HELPER: Wrapper com ThemeProvider para Material-UI
 */
const ThemeWrapper = ({ children }) => {
  const theme = createTheme();
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

/**
 * HELPER: Dados mock de pedidos
 */
const mockOrders = [
  {
    id: 1,
    customerName: 'João Silva',
    total: 45.80,
    status: 'pending',
    createdAt: '01/12/2024, 10:30'
  },
  {
    id: 2,
    customerName: 'Maria Santos',
    total: 32.50,
    status: 'completed',
    createdAt: '01/12/2024, 11:15'
  },
  {
    id: 3,
    customerName: 'Pedro Costa',
    total: 67.90,
    status: 'preparing',
    createdAt: '01/12/2024, 12:00'
  },
  {
    id: 4,
    customerName: 'Ana Oliveira',
    total: 28.40,
    status: 'completed',
    createdAt: '01/12/2024, 12:45'
  },
  {
    id: 5,
    customerName: 'Carlos Lima',
    total: 51.20,
    status: 'pending',
    createdAt: '01/12/2024, 13:20'
  },
  {
    id: 6,
    customerName: 'Luiza Ferreira',
    total: 39.60,
    status: 'completed',
    createdAt: '01/12/2024, 14:10'
  }
];

/**
 * HELPER: Mock das estatísticas do dashboard
 */
const mockStats = {
  totalOrders: 6,
  pendingOrders: 2,
  completedOrders: 3,
  totalRevenue: 265.40
};

/**
 * HELPER: Renderiza componente com props padrão
 */
const renderDashboard = (props = {}) => {
  const defaultProps = {
    orders: mockOrders,
    onViewOrder: jest.fn()
  };

  return render(
    <ThemeWrapper>
      <Dashboard {...defaultProps} {...props} />
    </ThemeWrapper>
  );
};

/**
 * SUITE DE TESTES PRINCIPAL
 */
describe('Dashboard', () => {
  // Configurar mocks antes de cada teste
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock para calculateDashboardStats
    calculateDashboardStats.mockReturnValue(mockStats);
    
    // Mock para getStatusLabel
    getStatusLabel.mockImplementation((status) => {
      const statusMap = {
        pending: { label: 'Pendente', color: 'warning' },
        preparing: { label: 'Preparando', color: 'info' },
        completed: { label: 'Concluído', color: 'success' },
        cancelled: { label: 'Cancelado', color: 'error' }
      };
      return statusMap[status] || { label: 'Desconhecido', color: 'default' };
    });
  });

  /**
   * GRUPO: Testes de Renderização
   */
  describe('Renderização', () => {
    /**
     * TESTE: Renderização básica do dashboard
     * Verifica se componente renderiza corretamente
     */
    test('deve renderizar dashboard completo', () => {
      // ACT: Renderizar componente
      renderDashboard();

      // ASSERT: Verificar elementos principais
      expect(screen.getByText('📊 Painel de Controle')).toBeInTheDocument();
      expect(screen.getByText('Bem-vindo ao painel administrativo')).toBeInTheDocument();
      expect(screen.getByText('📋 Pedidos Recentes')).toBeInTheDocument();
    });

    /**
     * TESTE: Renderização dos cards de estatísticas
     * Verifica se todos os cards são exibidos
     */
    test('deve renderizar todos os cards de estatísticas', () => {
      // ACT: Renderizar componente
      renderDashboard();

      // ASSERT: Verificar cards
      expect(screen.getByText('Total de Pedidos')).toBeInTheDocument();
      expect(screen.getByText('Pedidos Pendentes')).toBeInTheDocument();
      expect(screen.getByText('Pedidos Concluídos')).toBeInTheDocument();
      expect(screen.getByText('Receita Total')).toBeInTheDocument();
    });

    /**
     * TESTE: Exibição dos valores das estatísticas
     * Verifica se valores são exibidos corretamente
     */
    test('deve exibir valores das estatísticas corretamente', () => {
      // ACT: Renderizar componente
      renderDashboard();

      // ASSERT: Verificar valores dos cards
      expect(screen.getByText('6')).toBeInTheDocument(); // Total de pedidos
      expect(screen.getByText('2')).toBeInTheDocument(); // Pedidos pendentes
      expect(screen.getByText('3')).toBeInTheDocument(); // Pedidos concluídos
      expect(screen.getByText('R$ 265')).toBeInTheDocument(); // Receita (arredondada)
    });
  });

  /**
   * GRUPO: Testes de Cálculo de Estatísticas
   */
  describe('Cálculo de Estatísticas', () => {
    /**
     * TESTE: Função calculateDashboardStats é chamada
     * Verifica se função utilitária é chamada com dados corretos
     */
    test('deve chamar calculateDashboardStats com pedidos', () => {
      // ACT: Renderizar componente
      renderDashboard();

      // ASSERT: Função deve ter sido chamada com os pedidos
      expect(calculateDashboardStats).toHaveBeenCalledWith(mockOrders);
      expect(calculateDashboardStats).toHaveBeenCalledTimes(1);
    });

    /**
     * TESTE: Diferentes cenários de estatísticas
     * Verifica se dashboard funciona com diferentes dados
     */
    test('deve exibir estatísticas para diferentes cenários', () => {
      // ARRANGE: Mock com diferentes estatísticas
      const customStats = {
        totalOrders: 0,
        pendingOrders: 0,
        completedOrders: 0,
        totalRevenue: 0
      };
      calculateDashboardStats.mockReturnValue(customStats);

      // ACT: Renderizar componente
      renderDashboard({ orders: [] });

      // ASSERT: Verificar valores zerados
      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getByText('R$ 0')).toBeInTheDocument();
    });

    /**
     * TESTE: Formatação da receita
     * Verifica se receita é formatada corretamente
     */
    test('deve formatar receita corretamente', () => {
      // ARRANGE: Mock com valor decimal
      const statsComDecimal = {
        totalOrders: 5,
        pendingOrders: 1,
        completedOrders: 4,
        totalRevenue: 1234.56
      };
      calculateDashboardStats.mockReturnValue(statsComDecimal);

      // ACT: Renderizar componente
      renderDashboard();

      // ASSERT: Verificar formatação (arredondamento)
      expect(screen.getByText('R$ 1235')).toBeInTheDocument();
    });
  });

  /**
   * GRUPO: Testes da Tabela de Pedidos Recentes
   */
  describe('Tabela de Pedidos Recentes', () => {
    /**
     * TESTE: Cabeçalho da tabela
     * Verifica se cabeçalho tem todas as colunas
     */
    test('deve renderizar cabeçalho da tabela completo', () => {
      // ACT: Renderizar componente
      renderDashboard();

      // ASSERT: Verificar colunas do cabeçalho
      expect(screen.getByText('#')).toBeInTheDocument();
      expect(screen.getByText('Cliente')).toBeInTheDocument();
      expect(screen.getByText('Total')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Horário')).toBeInTheDocument();
      expect(screen.getByText('Ação')).toBeInTheDocument();
    });

    /**
     * TESTE: Exibição dos primeiros 5 pedidos
     * Verifica se apenas os 5 primeiros pedidos são exibidos
     */
    test('deve exibir apenas os 5 primeiros pedidos', () => {
      // ACT: Renderizar componente
      renderDashboard();

      // ASSERT: Verificar se apenas 5 pedidos são exibidos
      expect(screen.getByText('#1')).toBeInTheDocument();
      expect(screen.getByText('#2')).toBeInTheDocument();
      expect(screen.getByText('#3')).toBeInTheDocument();
      expect(screen.getByText('#4')).toBeInTheDocument();
      expect(screen.getByText('#5')).toBeInTheDocument();
      expect(screen.queryByText('#6')).not.toBeInTheDocument();
    });

    /**
     * TESTE: Dados dos pedidos na tabela
     * Verifica se dados são exibidos corretamente
     */
    test('deve exibir dados dos pedidos corretamente', () => {
      // ACT: Renderizar componente
      renderDashboard();

      // ASSERT: Verificar dados do primeiro pedido
      expect(screen.getByText('João Silva')).toBeInTheDocument();
      expect(screen.getByText('R$ 45.80')).toBeInTheDocument();
      expect(screen.getByText('01/12/2024, 10:30')).toBeInTheDocument();

      // ASSERT: Verificar dados do segundo pedido
      expect(screen.getByText('Maria Santos')).toBeInTheDocument();
      expect(screen.getByText('R$ 32.50')).toBeInTheDocument();
    });

    /**
     * TESTE: Status dos pedidos com chips
     * Verifica se status são exibidos como chips coloridos
     */
    test('deve exibir status como chips coloridos', () => {
      // ACT: Renderizar componente
      renderDashboard();

      // ASSERT: Verificar se getStatusLabel foi chamada para cada pedido
      expect(getStatusLabel).toHaveBeenCalledWith('pending');
      expect(getStatusLabel).toHaveBeenCalledWith('completed');
      expect(getStatusLabel).toHaveBeenCalledWith('preparing');

      // ASSERT: Verificar se labels dos status são exibidos
      expect(screen.getByText('Pendente')).toBeInTheDocument();
      expect(screen.getByText('Concluído')).toBeInTheDocument();
      expect(screen.getByText('Preparando')).toBeInTheDocument();
    });

    /**
     * TESTE: Botões de ação na tabela
     * Verifica se botões de visualização estão presentes
     */
    test('deve exibir botões de visualização para cada pedido', () => {
      // ACT: Renderizar componente
      renderDashboard();

      // ASSERT: Verificar se há 5 botões de visualização (um para cada pedido)
      const viewButtons = screen.getAllByRole('button');
      expect(viewButtons).toHaveLength(5);
    });
  });

  /**
   * GRUPO: Testes de Interação
   */
  describe('Interação', () => {
    /**
     * TESTE: Clique no botão de visualizar pedido
     * Verifica se função onViewOrder é chamada
     */
    test('deve chamar onViewOrder ao clicar em visualizar pedido', () => {
      // ARRANGE: Mock da função
      const mockOnViewOrder = jest.fn();

      // ACT: Renderizar componente
      renderDashboard({ onViewOrder: mockOnViewOrder });

      // ACT: Clicar no primeiro botão de visualização
      const viewButtons = screen.getAllByRole('button');
      fireEvent.click(viewButtons[0]);

      // ASSERT: Função deve ter sido chamada com o pedido correto
      expect(mockOnViewOrder).toHaveBeenCalledWith(mockOrders[0]);
      expect(mockOnViewOrder).toHaveBeenCalledTimes(1);
    });

    /**
     * TESTE: Múltiplos cliques em diferentes pedidos
     * Verifica se todos os botões funcionam corretamente
     */
    test('deve permitir visualizar diferentes pedidos', () => {
      // ARRANGE: Mock da função
      const mockOnViewOrder = jest.fn();

      // ACT: Renderizar componente
      renderDashboard({ onViewOrder: mockOnViewOrder });

      // ACT: Clicar em diferentes botões
      const viewButtons = screen.getAllByRole('button');
      fireEvent.click(viewButtons[0]); // Primeiro pedido
      fireEvent.click(viewButtons[2]); // Terceiro pedido

      // ASSERT: Função deve ter sido chamada para ambos os pedidos
      expect(mockOnViewOrder).toHaveBeenCalledWith(mockOrders[0]);
      expect(mockOnViewOrder).toHaveBeenCalledWith(mockOrders[2]);
      expect(mockOnViewOrder).toHaveBeenCalledTimes(2);
    });
  });

  /**
   * GRUPO: Testes com Diferentes Estados de Dados
   */
  describe('Estados de Dados', () => {
    /**
     * TESTE: Dashboard com lista vazia
     * Verifica se componente funciona sem pedidos
     */
    test('deve renderizar com lista de pedidos vazia', () => {
      // ARRANGE: Estatísticas zeradas
      calculateDashboardStats.mockReturnValue({
        totalOrders: 0,
        pendingOrders: 0,
        completedOrders: 0,
        totalRevenue: 0
      });

      // ACT: Renderizar com lista vazia
      renderDashboard({ orders: [] });

      // ASSERT: Componente deve renderizar sem erros
      expect(screen.getByText('📊 Painel de Controle')).toBeInTheDocument();
      expect(screen.getByText('R$ 0')).toBeInTheDocument();
      
      // ASSERT: Tabela deve estar vazia (apenas cabeçalho)
      expect(screen.getByText('Cliente')).toBeInTheDocument();
      expect(screen.queryByText('João Silva')).not.toBeInTheDocument();
    });

    /**
     * TESTE: Dashboard com mais de 5 pedidos
     * Verifica se apenas os 5 primeiros são exibidos
     */
    test('deve limitar exibição a 5 pedidos quando há mais', () => {
      // ARRANGE: Lista com mais de 5 pedidos
      const muitosPedidos = [...mockOrders]; // 6 pedidos no mock

      // ACT: Renderizar componente
      renderDashboard({ orders: muitosPedidos });

      // ASSERT: Apenas 5 pedidos devem aparecer na tabela
      expect(screen.getByText('#1')).toBeInTheDocument();
      expect(screen.getByText('#2')).toBeInTheDocument();
      expect(screen.getByText('#3')).toBeInTheDocument();
      expect(screen.getByText('#4')).toBeInTheDocument();
      expect(screen.getByText('#5')).toBeInTheDocument();
      expect(screen.queryByText('#6')).not.toBeInTheDocument();
    });

    /**
     * TESTE: Dashboard com um único pedido
     * Verifica se funciona com poucos dados
     */
    test('deve funcionar com apenas um pedido', () => {
      // ARRANGE: Lista com um pedido
      const umPedido = [mockOrders[0]];
      calculateDashboardStats.mockReturnValue({
        totalOrders: 1,
        pendingOrders: 1,
        completedOrders: 0,
        totalRevenue: 45.80
      });

      // ACT: Renderizar componente
      renderDashboard({ orders: umPedido });

      // ASSERT: Verificar dados
      expect(screen.getByText('1')).toBeInTheDocument(); // Total
      expect(screen.getByText('João Silva')).toBeInTheDocument();
      expect(screen.queryByText('Maria Santos')).not.toBeInTheDocument();
    });
  });

  /**
   * GRUPO: Testes de Props
   */
  describe('Props', () => {
    /**
     * TESTE: Prop orders é utilizada corretamente
     * Verifica se dados são passados corretamente
     */
    test('deve utilizar prop orders corretamente', () => {
      // ARRANGE: Pedidos customizados
      const pedidosCustomizados = [
        {
          id: 999,
          customerName: 'Cliente Teste',
          total: 100.00,
          status: 'completed',
          createdAt: '02/12/2024, 15:00'
        }
      ];

      // ACT: Renderizar com pedidos customizados
      renderDashboard({ orders: pedidosCustomizados });

      // ASSERT: Dados customizados devem aparecer
      expect(screen.getByText('#999')).toBeInTheDocument();
      expect(screen.getByText('Cliente Teste')).toBeInTheDocument();
      expect(screen.getByText('R$ 100.00')).toBeInTheDocument();
    });

    /**
     * TESTE: Prop onViewOrder é obrigatória
     * Verifica se função é chamada corretamente
     */
    test('deve funcionar sem prop onViewOrder', () => {
      // ACT: Renderizar sem onViewOrder
      expect(() => {
        renderDashboard({ onViewOrder: undefined });
      }).not.toThrow();

      // ASSERT: Componente deve renderizar
      expect(screen.getByText('📊 Painel de Controle')).toBeInTheDocument();
    });
  });

  /**
   * GRUPO: Testes de Layout e Estilos
   */
  describe('Layout e Estilos', () => {
    /**
     * TESTE: Grid layout dos cards
     * Verifica se cards estão em grid responsivo
     */
    test('deve organizar cards em grid layout', () => {
      // ACT: Renderizar componente
      renderDashboard();

      // ASSERT: Verificar presença de grid containers
      const gridContainers = document.querySelectorAll('.MuiGrid-container');
      expect(gridContainers.length).toBeGreaterThan(0);
    });

    /**
     * TESTE: Estrutura da tabela
     * Verifica se tabela tem estrutura correta
     */
    test('deve ter estrutura de tabela correta', () => {
      // ACT: Renderizar componente
      renderDashboard();

      // ASSERT: Verificar elementos da tabela
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
      
      const tableHead = table.querySelector('thead');
      const tableBody = table.querySelector('tbody');
      expect(tableHead).toBeInTheDocument();
      expect(tableBody).toBeInTheDocument();
    });

    /**
     * TESTE: Paper container para tabela
     * Verifica se tabela está em container estilizado
     */
    test('deve envolver tabela em Paper component', () => {
      // ACT: Renderizar componente
      renderDashboard();

      // ASSERT: Verificar Paper component
      const paperElement = document.querySelector('.MuiPaper-root');
      expect(paperElement).toBeInTheDocument();
    });
  });

  /**
   * GRUPO: Testes de Casos Extremos
   */
  describe('Casos Extremos', () => {
    /**
     * TESTE: Pedidos com valores muito altos
     * Verifica se formatação funciona com números grandes
     */
    test('deve lidar com valores monetários altos', () => {
      // ARRANGE: Estatísticas com valores altos
      calculateDashboardStats.mockReturnValue({
        totalOrders: 1000,
        pendingOrders: 500,
        completedOrders: 500,
        totalRevenue: 999999.99
      });

      // ACT: Renderizar componente
      renderDashboard();

      // ASSERT: Valores altos devem ser exibidos
      expect(screen.getByText('1000')).toBeInTheDocument();
      expect(screen.getByText('R$ 1000000')).toBeInTheDocument(); // Arredondado
    });

    /**
     * TESTE: Pedidos com dados incompletos
     * Verifica robustez com dados malformados
     */
    test('deve lidar com dados incompletos graciosamente', () => {
      // ARRANGE: Pedido com dados incompletos
      const pedidoIncompleto = [
        {
          id: 1,
          customerName: '',
          total: null,
          status: undefined,
          createdAt: ''
        }
      ];

      // ACT: Renderizar com dados incompletos
      expect(() => {
        renderDashboard({ orders: pedidoIncompleto });
      }).not.toThrow();

      // ASSERT: Componente deve renderizar
      expect(screen.getByText('📊 Painel de Controle')).toBeInTheDocument();
    });

    /**
     * TESTE: Status de pedido desconhecido
     * Verifica se função getStatusLabel lida com status inválidos
     */
    test('deve lidar com status desconhecidos', () => {
      // ARRANGE: Mock para status desconhecido
      getStatusLabel.mockReturnValue({ label: 'Desconhecido', color: 'default' });

      const pedidoStatusDesconhecido = [
        {
          id: 1,
          customerName: 'Teste',
          total: 10.00,
          status: 'status_inexistente',
          createdAt: '01/12/2024, 10:00'
        }
      ];

      // ACT: Renderizar componente
      renderDashboard({ orders: pedidoStatusDesconhecido });

      // ASSERT: Status desconhecido deve ser exibido
      expect(screen.getByText('Desconhecido')).toBeInTheDocument();
    });
  });
});
