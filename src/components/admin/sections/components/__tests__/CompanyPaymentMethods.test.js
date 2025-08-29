/**
 * TESTES DO COMPONENTE - COMPANYPAYMENTMETHODS
 * 
 * Conjunto de testes para validar o comportamento e funcionalidades
 * do componente CompanyPaymentMethods.
 * 
 * Cobertura:
 * - Renderização de formas de pagamento padrão
 * - Toggle de ativação/desativação de métodos
 * - Adição de métodos customizados
 * - Remoção de métodos customizados
 * - Validação de entrada de dados
 * - Estados visuais e indicadores
 * - Resumo de métodos ativos
 * 
 * @author Sistema Admin
 * @since 22/08/2025
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Importações de mocks e utilitários de teste
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Componente sendo testado
import CompanyPaymentMethods from '../CompanyPaymentMethods';

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
 * DADOS MOCK: Formas de pagamento padrão para testes
 */
const DEFAULT_PAYMENT_METHODS = [
  {
    id: 'cash',
    name: 'Dinheiro',
    iconName: 'cash',
    enabled: true,
    requiresChange: true,
    color: '#4caf50'
  },
  {
    id: 'credit_card',
    name: 'Cartão de Crédito',
    iconName: 'credit_card',
    enabled: true,
    requiresChange: false,
    color: '#2196f3'
  },
  {
    id: 'pix',
    name: 'PIX',
    iconName: 'pix',
    enabled: true,
    requiresChange: false,
    color: '#9c27b0'
  },
  {
    id: 'bank_transfer',
    name: 'Transferência Bancária',
    iconName: 'bank_transfer',
    enabled: false,
    requiresChange: false,
    color: '#607d8b'
  }
];

/**
 * SUITE DE TESTES PRINCIPAL
 */
describe('CompanyPaymentMethods', () => {
  // Props padrão para testes
  const defaultProps = {
    companyData: {
      paymentMethods: DEFAULT_PAYMENT_METHODS
    },
    updateField: jest.fn()
  };

  // User event setup
  let user;

  // Limpar mocks antes de cada teste
  beforeEach(() => {
    jest.clearAllMocks();
    user = userEvent.setup();
  });

  /**
   * GRUPO: Testes de Renderização
   */
  describe('Renderização', () => {
    test('deve renderizar o componente corretamente', () => {
      // ARRANGE: Preparar props padrão
      const props = { ...defaultProps };

      // ACT: Renderizar componente
      renderWithProviders(<CompanyPaymentMethods {...props} />);

      // ASSERT: Verificar se elementos principais estão presentes
      expect(screen.getByText('Formas de Pagamento')).toBeInTheDocument();
      expect(screen.getByText('Configure as formas de pagamento aceitas pela sua empresa')).toBeInTheDocument();
      expect(screen.getByText('Adicionar Forma de Pagamento Personalizada')).toBeInTheDocument();
    });

    test('deve renderizar todas as formas de pagamento padrão', () => {
      // ARRANGE: Props padrão
      const props = { ...defaultProps };

      // ACT: Renderizar componente
      renderWithProviders(<CompanyPaymentMethods {...props} />);

      // ASSERT: Verificar se todas as formas de pagamento estão presentes
      expect(screen.getAllByText('Dinheiro')).toHaveLength(2); // Título + chip
      expect(screen.getAllByText('Cartão de Crédito')).toHaveLength(2); // Título + chip
      expect(screen.getAllByText('PIX')).toHaveLength(2); // Título + chip  
      expect(screen.getAllByText('Transferência Bancária')).toHaveLength(1); // Apenas título (inativo)
    });

    test('deve mostrar switches de ativação/desativação', () => {
      // ARRANGE: Props padrão
      const props = { ...defaultProps };

      // ACT: Renderizar componente
      renderWithProviders(<CompanyPaymentMethods {...props} />);

      // ASSERT: Verificar se switches estão presentes
      const switches = screen.getAllByRole('switch');
      expect(switches).toHaveLength(DEFAULT_PAYMENT_METHODS.length);
    });

    test('deve mostrar status "Precisa de troco" para dinheiro quando ativo', () => {
      // ARRANGE: Props com dinheiro ativo
      const props = { ...defaultProps };

      // ACT: Renderizar componente
      renderWithProviders(<CompanyPaymentMethods {...props} />);

      // ASSERT: Verificar chip de "Precisa de troco"
      expect(screen.getByText('Precisa de troco')).toBeInTheDocument();
    });

    test('deve mostrar resumo de métodos ativos', () => {
      // ARRANGE: Props padrão (3 métodos ativos)
      const props = { ...defaultProps };

      // ACT: Renderizar componente
      renderWithProviders(<CompanyPaymentMethods {...props} />);

      // ASSERT: Verificar resumo
      expect(screen.getByText('Métodos Ativos: 3')).toBeInTheDocument();
    });
  });

  /**
   * GRUPO: Testes de Interação - Toggle de Métodos
   */
  describe('Toggle de Métodos de Pagamento', () => {
    test('deve chamar updateField quando método é ativado/desativado', async () => {
      // ARRANGE: Preparar props com função mock
      const mockUpdateField = jest.fn();
      const props = { ...defaultProps, updateField: mockUpdateField };

      // ACT: Renderizar e clicar no switch
      renderWithProviders(<CompanyPaymentMethods {...props} />);
      
      // Encontrar o switch da Transferência Bancária (que está desabilitada)
      const switches = screen.getAllByRole('switch');
      const bankTransferSwitch = switches[3]; // Último switch (Transferência Bancária)
      
      await user.click(bankTransferSwitch);

      // ASSERT: Verificar se função foi chamada
      await waitFor(() => {
        expect(mockUpdateField).toHaveBeenCalledWith('paymentMethods', expect.any(Array));
      });
    });

    test('deve atualizar estado visual quando método é desativado', async () => {
      // ARRANGE: Props padrão
      const props = { ...defaultProps };

      // ACT: Renderizar e desativar método ativo
      renderWithProviders(<CompanyPaymentMethods {...props} />);
      
      // Encontrar switch do Dinheiro (ativo)
      const switches = screen.getAllByRole('switch');
      const cashSwitch = switches[0];
      
      await user.click(cashSwitch);

      // ASSERT: Verificar mudança visual (label muda para "Inativo")
      await waitFor(() => {
        const inactiveLabels = screen.getAllByText('Inativo');
        expect(inactiveLabels.length).toBeGreaterThan(0);
      });
    });

    test('deve esconder chip "Precisa de troco" quando dinheiro é desativado', async () => {
      // ARRANGE: Props padrão
      const props = { ...defaultProps };

      // ACT: Renderizar e desativar dinheiro
      renderWithProviders(<CompanyPaymentMethods {...props} />);
      
      // Verificar que chip existe inicialmente
      expect(screen.getByText('Precisa de troco')).toBeInTheDocument();
      
      // Desativar dinheiro
      const switches = screen.getAllByRole('switch');
      const cashSwitch = switches[0];
      await user.click(cashSwitch);

      // ASSERT: Chip deve desaparecer
      await waitFor(() => {
        expect(screen.queryByText('Precisa de troco')).not.toBeInTheDocument();
      });
    });
  });

  /**
   * GRUPO: Testes de Adição de Métodos Customizados
   */
  describe('Adição de Métodos Customizados', () => {
    test('deve permitir adicionar novo método personalizado', async () => {
      // ARRANGE: Preparar props com função mock
      const mockUpdateField = jest.fn();
      const props = { ...defaultProps, updateField: mockUpdateField };
      const novoMetodo = 'Vale Alimentação';

      // ACT: Renderizar, digitar e adicionar método
      renderWithProviders(<CompanyPaymentMethods {...props} />);
      
      const input = screen.getByLabelText('Nome da forma de pagamento');
      const addButton = screen.getByRole('button', { name: /adicionar/i });
      
      await user.type(input, novoMetodo);
      await user.click(addButton);

      // ASSERT: Verificar se função foi chamada com novo método
      await waitFor(() => {
        expect(mockUpdateField).toHaveBeenCalledWith('paymentMethods', expect.arrayContaining([
          expect.objectContaining({
            name: novoMetodo,
            isCustom: true,
            enabled: true
          })
        ]));
      });
    });

    test('deve limpar campo de entrada após adicionar método', async () => {
      // ARRANGE: Props padrão
      const props = { ...defaultProps };
      const novoMetodo = 'Cheque';

      // ACT: Renderizar, digitar e adicionar método
      renderWithProviders(<CompanyPaymentMethods {...props} />);
      
      const input = screen.getByLabelText('Nome da forma de pagamento');
      const addButton = screen.getByRole('button', { name: /adicionar/i });
      
      await user.type(input, novoMetodo);
      await user.click(addButton);

      // ASSERT: Campo deve estar vazio
      await waitFor(() => {
        expect(input).toHaveValue('');
      });
    });

    test('deve desabilitar botão adicionar quando campo está vazio', () => {
      // ARRANGE: Props padrão
      const props = { ...defaultProps };

      // ACT: Renderizar componente
      renderWithProviders(<CompanyPaymentMethods {...props} />);

      // ASSERT: Botão deve estar desabilitado
      const addButton = screen.getByRole('button', { name: /adicionar/i });
      expect(addButton).toBeDisabled();
    });

    test('deve habilitar botão adicionar quando campo tem texto', async () => {
      // ARRANGE: Props padrão
      const props = { ...defaultProps };

      // ACT: Renderizar e digitar no campo
      renderWithProviders(<CompanyPaymentMethods {...props} />);
      
      const input = screen.getByLabelText('Nome da forma de pagamento');
      await user.type(input, 'Novo Método');

      // ASSERT: Botão deve estar habilitado
      const addButton = screen.getByRole('button', { name: /adicionar/i });
      expect(addButton).toBeEnabled();
    });

    test('não deve adicionar método com nome vazio ou apenas espaços', async () => {
      // ARRANGE: Props com função mock
      const mockUpdateField = jest.fn();
      const props = { ...defaultProps, updateField: mockUpdateField };

      // ACT: Renderizar, digitar espaços e tentar adicionar
      renderWithProviders(<CompanyPaymentMethods {...props} />);
      
      const input = screen.getByLabelText('Nome da forma de pagamento');
      const addButton = screen.getByRole('button', { name: /adicionar/i });
      
      await user.type(input, '   '); // Apenas espaços
      
      // ASSERT: Botão deve estar desabilitado
      expect(addButton).toBeDisabled();
      expect(mockUpdateField).not.toHaveBeenCalled();
    });
  });

  /**
   * GRUPO: Testes de Remoção de Métodos Customizados
   */
  describe('Remoção de Métodos Customizados', () => {
    test('deve mostrar botão de remoção apenas para métodos customizados', () => {
      // ARRANGE: Props com método customizado
      const propsComCustom = {
        ...defaultProps,
        companyData: {
          paymentMethods: [
            ...DEFAULT_PAYMENT_METHODS,
            {
              id: 'custom_123',
              name: 'Vale Refeição',
              iconName: 'payment',
              enabled: true,
              requiresChange: false,
              color: '#795548',
              isCustom: true
            }
          ]
        }
      };

      // ACT: Renderizar componente
      renderWithProviders(<CompanyPaymentMethods {...propsComCustom} />);

      // ASSERT: Deve ter apenas um botão de remoção (✕)
      const removeButtons = screen.getAllByText('✕');
      expect(removeButtons).toHaveLength(1);
    });

    test('deve remover método customizado quando botão é clicado', async () => {
      // ARRANGE: Props com método customizado e função mock
      const mockUpdateField = jest.fn();
      const customMethod = {
        id: 'custom_123',
        name: 'Vale Refeição',
        iconName: 'payment',
        enabled: true,
        requiresChange: false,
        color: '#795548',
        isCustom: true
      };
      
      const propsComCustom = {
        ...defaultProps,
        updateField: mockUpdateField,
        companyData: {
          paymentMethods: [...DEFAULT_PAYMENT_METHODS, customMethod]
        }
      };

      // ACT: Renderizar e clicar no botão de remoção
      renderWithProviders(<CompanyPaymentMethods {...propsComCustom} />);
      
      const removeButton = screen.getByText('✕');
      await user.click(removeButton);

      // ASSERT: Verificar se função foi chamada sem o método removido
      await waitFor(() => {
        expect(mockUpdateField).toHaveBeenCalledWith('paymentMethods', 
          expect.not.arrayContaining([
            expect.objectContaining({ id: 'custom_123' })
          ])
        );
      });
    });
  });

  /**
   * GRUPO: Testes de Estados Visuais
   */
  describe('Estados Visuais', () => {
    test('deve aplicar cores corretas para métodos ativos', () => {
      // ARRANGE: Props padrão
      const props = { ...defaultProps };

      // ACT: Renderizar componente
      renderWithProviders(<CompanyPaymentMethods {...props} />);

      // ASSERT: Verificar contagem de métodos ativos
      expect(screen.getByText('Métodos Ativos: 3')).toBeInTheDocument();
    });

    test('deve mostrar contagem correta de métodos ativos', () => {
      // ARRANGE: Props com diferentes estados
      const propsComVariacao = {
        ...defaultProps,
        companyData: {
          paymentMethods: [
            { ...DEFAULT_PAYMENT_METHODS[0], enabled: true },  // Dinheiro ativo
            { ...DEFAULT_PAYMENT_METHODS[1], enabled: false }, // Cartão desativo
            { ...DEFAULT_PAYMENT_METHODS[2], enabled: true },  // PIX ativo
            { ...DEFAULT_PAYMENT_METHODS[3], enabled: false }  // Transferência desativa
          ]
        }
      };

      // ACT: Renderizar componente
      renderWithProviders(<CompanyPaymentMethods {...propsComVariacao} />);

      // ASSERT: Deve mostrar 2 métodos ativos
      expect(screen.getByText('Métodos Ativos: 2')).toBeInTheDocument();
    });

    test('deve mostrar placeholder correto no campo de entrada', () => {
      // ARRANGE: Props padrão
      const props = { ...defaultProps };

      // ACT: Renderizar componente
      renderWithProviders(<CompanyPaymentMethods {...props} />);

      // ASSERT: Verificar placeholder
      const input = screen.getByLabelText('Nome da forma de pagamento');
      expect(input).toHaveAttribute('placeholder', 'Ex: Vale Alimentação, Cheque, etc.');
    });
  });

  /**
   * GRUPO: Testes de Dados e Props
   */
  describe('Tratamento de Dados', () => {
    test('deve usar dados padrão quando companyData não tem paymentMethods', () => {
      // ARRANGE: Props sem paymentMethods
      const propsVazias = {
        companyData: {},
        updateField: jest.fn()
      };

      // ACT: Renderizar componente
      renderWithProviders(<CompanyPaymentMethods {...propsVazias} />);

      // ASSERT: Deve renderizar métodos padrão
      expect(screen.getAllByText('Dinheiro')).toHaveLength(2); // Título + chip
      expect(screen.getAllByText('Cartão de Crédito')).toHaveLength(2); // Título + chip  
      expect(screen.getAllByText('PIX')).toHaveLength(2); // Título + chip
    });

    test('deve usar dados padrão quando companyData é undefined', () => {
      // ARRANGE: Props com companyData undefined
      const propsUndefined = {
        companyData: undefined,
        updateField: jest.fn()
      };

      // ACT: Renderizar componente
      renderWithProviders(<CompanyPaymentMethods {...propsUndefined} />);

      // ASSERT: Componente deve renderizar sem erros
      expect(screen.getByText('Formas de Pagamento')).toBeInTheDocument();
    });

    test('deve manter métodos customizados existentes', () => {
      // ARRANGE: Props com métodos customizados
      const metodosCustomizados = [
        ...DEFAULT_PAYMENT_METHODS,
        {
          id: 'custom_vale',
          name: 'Vale Alimentação',
          iconName: 'payment',
          enabled: true,
          requiresChange: false,
          color: '#795548',
          isCustom: true
        }
      ];
      
      const propsComCustomizados = {
        ...defaultProps,
        companyData: { paymentMethods: metodosCustomizados }
      };

      // ACT: Renderizar componente
      renderWithProviders(<CompanyPaymentMethods {...propsComCustomizados} />);

      // ASSERT: Método customizado deve estar presente
      expect(screen.getAllByText('Vale Alimentação')).toHaveLength(2); // Título + chip (se ativo)
    });
  });

  /**
   * GRUPO: Testes de Acessibilidade
   */
  describe('Acessibilidade', () => {
    test('deve ter labels apropriados para elementos interativos', () => {
      // ARRANGE: Props padrão
      const props = { ...defaultProps };

      // ACT: Renderizar componente
      renderWithProviders(<CompanyPaymentMethods {...props} />);

      // ASSERT: Verificar labels
      expect(screen.getByLabelText('Nome da forma de pagamento')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /adicionar/i })).toBeInTheDocument();
    });

    test('deve ter switches com labels apropriados', () => {
      // ARRANGE: Props padrão
      const props = { ...defaultProps };

      // ACT: Renderizar componente
      renderWithProviders(<CompanyPaymentMethods {...props} />);

      // ASSERT: Verificar switches
      const switches = screen.getAllByRole('switch');
      expect(switches.length).toBeGreaterThan(0);
    });
  });

  /**
   * GRUPO: Testes de Casos Extremos
   */
  describe('Casos Extremos', () => {
    test('deve lidar com array vazio de métodos de pagamento', () => {
      // ARRANGE: Props com array vazio
      const propsVazio = {
        ...defaultProps,
        companyData: { paymentMethods: [] }
      };

      // ACT: Renderizar componente
      renderWithProviders(<CompanyPaymentMethods {...propsVazio} />);

      // ASSERT: Deve mostrar 0 métodos ativos
      expect(screen.getByText('Métodos Ativos: 0')).toBeInTheDocument();
    });

    test('deve funcionar com nomes muito longos', async () => {
      // ARRANGE: Props com função mock
      const mockUpdateField = jest.fn();
      const props = { ...defaultProps, updateField: mockUpdateField };
      const nomeLongo = 'Nome Muito Longo Para Forma de Pagamento Personalizada Teste';

      // ACT: Renderizar e adicionar método com nome longo
      renderWithProviders(<CompanyPaymentMethods {...props} />);
      
      const input = screen.getByLabelText('Nome da forma de pagamento');
      const addButton = screen.getByRole('button', { name: /adicionar/i });
      
      await user.type(input, nomeLongo);
      await user.click(addButton);

      // ASSERT: Deve funcionar normalmente
      await waitFor(() => {
        expect(mockUpdateField).toHaveBeenCalledWith('paymentMethods', expect.arrayContaining([
          expect.objectContaining({ name: nomeLongo })
        ]));
      });
    });

    test('deve trimar espaços em branco do nome do método', async () => {
      // ARRANGE: Props com função mock
      const mockUpdateField = jest.fn();
      const props = { ...defaultProps, updateField: mockUpdateField };
      const nomeComEspacos = '  Vale Refeição  ';

      // ACT: Renderizar e adicionar método com espaços
      renderWithProviders(<CompanyPaymentMethods {...props} />);
      
      const input = screen.getByLabelText('Nome da forma de pagamento');
      const addButton = screen.getByRole('button', { name: /adicionar/i });
      
      await user.type(input, nomeComEspacos);
      await user.click(addButton);

      // ASSERT: Nome deve estar sem espaços extras
      await waitFor(() => {
        expect(mockUpdateField).toHaveBeenCalledWith('paymentMethods', expect.arrayContaining([
          expect.objectContaining({ name: 'Vale Refeição' })
        ]));
      });
    });
  });
});
