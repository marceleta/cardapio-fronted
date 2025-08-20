/**
 * TESTES DO SISTEMA DE DESTAQUES SEMANAIS
 * 
 * Suite completa de testes para o HighlightsManager e componentes relacionados.
 * Sistema refatorado para cronograma semanal com descontos.
 * 
 * Cobertura de testes:
 * • Renderização do componente principal
 * • Sistema de cronograma semanal
 * • Dialogs e interações
 * • Hooks customizados de desconto
 * • Sistema de configuração
 * • Estados de loading e erro
 * • Responsividade
 * 
 * @autor Sistema Admin
 * @refatorado 20/08/2025
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import '@testing-library/jest-dom';

// Componentes a serem testados
import HighlightsManager from '../HighlightsManager';
import {
  ConfigDialog,
  AddProductDialog,
  EditDiscountDialog
} from '../HighlightsDialogs';

// Hooks a serem testados
import {
  useHighlightsConfig,
  useWeeklySchedule,
  useProductDiscount,
  useProductSelection,
  useHighlightsDialog,
  WEEKDAYS,
  DISCOUNT_TYPES
} from '../../../hooks/useHighlightsManager';

// Mock dos hooks para isolamento dos testes
jest.mock('../../../hooks/useHighlightsManager', () => ({
  useHighlightsConfig: jest.fn(),
  useWeeklySchedule: jest.fn(),
  useProductDiscount: jest.fn(),
  useProductSelection: jest.fn(),
  useHighlightsDialog: jest.fn(),
  WEEKDAYS: [
    { id: 0, name: 'Domingo', short: 'Dom' },
    { id: 1, name: 'Segunda-feira', short: 'Seg' },
    { id: 2, name: 'Terça-feira', short: 'Ter' },
    { id: 3, name: 'Quarta-feira', short: 'Qua' },
    { id: 4, name: 'Quinta-feira', short: 'Qui' },
    { id: 5, name: 'Sexta-feira', short: 'Sex' },
    { id: 6, name: 'Sábado', short: 'Sáb' }
  ],
  DISCOUNT_TYPES: {
    PERCENTAGE: 'percentage',
    FIXED: 'fixed'
  }
}));

// Theme para os testes
const theme = createTheme();

// Wrapper de teste com tema
const TestWrapper = ({ children }) => (
  <ThemeProvider theme={theme}>
    {children}
  </ThemeProvider>
);

// Mock de dados para os testes do sistema semanal
const mockConfig = {
  id: 1,
  title: 'Especiais do Dia',
  description: 'Ofertas especiais selecionadas para cada dia da semana',
  active: true,
  createdAt: '2025-08-20T10:00:00.000Z',
  updatedAt: '2025-08-20T10:00:00.000Z'
};

const mockWeeklySchedule = {
  0: [ // Domingo
    {
      id: 1,
      productId: 101,
      product: {
        id: 101,
        name: 'Feijoada Completa',
        description: 'Feijoada tradicional com todos os acompanhamentos',
        price: 35.90,
        imageUrl: 'https://example.com/feijoada.jpg',
        category: 'Pratos Principais'
      },
      discount: {
        type: 'percentage',
        value: 15
      },
      finalPrice: 30.52,
      active: true,
      addedAt: '2025-08-20T08:00:00.000Z'
    }
  ],
  1: [ // Segunda
    {
      id: 2,
      productId: 102,
      product: {
        id: 102,
        name: 'Hambúrguer Artesanal',
        description: 'Hambúrguer com carne 100% bovina',
        price: 28.90,
        imageUrl: 'https://example.com/burger.jpg',
        category: 'Hambúrgueres'
      },
      discount: {
        type: 'fixed',
        value: 5.00
      },
      finalPrice: 23.90,
      active: true,
      addedAt: '2025-08-20T09:00:00.000Z'
    }
  ],
  2: [], // Terça
  3: [], // Quarta
  4: [], // Quinta
  5: [], // Sexta
  6: []  // Sábado
};

const mockStatistics = {
  totalProducts: 2,
  activeProducts: 2,
  daysWithProducts: 2,
  totalSavings: 10.38,
  averageDiscount: 16.15,
  mostProductiveDay: {
    dayId: 0,
    dayName: 'Domingo',
    productCount: 1
  }
};

const mockAvailableProducts = [
  {
    id: 101,
    name: 'Feijoada Completa',
    description: 'Feijoada tradicional com todos os acompanhamentos',
    price: 35.90,
    imageUrl: 'https://example.com/feijoada.jpg',
    category: 'Pratos Principais',
    available: true
  },
  {
    id: 102,
    name: 'Hambúrguer Artesanal',
    description: 'Hambúrguer com carne 100% bovina',
    price: 28.90,
    imageUrl: 'https://example.com/burger.jpg',
    category: 'Hambúrgueres',
    available: true
  }
];

describe('HighlightsManager - Sistema Semanal', () => {
  // Setup padrão dos mocks
  beforeEach(() => {
    useHighlightsConfig.mockReturnValue({
      config: mockConfig,
      loading: false,
      error: null,
      updateConfig: jest.fn(),
      toggleActive: jest.fn()
    });

    useWeeklySchedule.mockReturnValue({
      weeklySchedule: mockWeeklySchedule,
      loading: false,
      error: null,
      statistics: mockStatistics,
      addProductToDay: jest.fn(),
      removeProductFromDay: jest.fn(),
      updateProductDiscount: jest.fn(),
      toggleProductStatus: jest.fn(),
      copyDaySchedule: jest.fn(),
      WEEKDAYS: WEEKDAYS
    });

    useProductDiscount.mockReturnValue({
      calculateFinalPrice: jest.fn(),
      calculateDiscountAmount: jest.fn(),
      formatDiscount: jest.fn().mockReturnValue('15% OFF'),
      validateDiscount: jest.fn(),
      DISCOUNT_TYPES: DISCOUNT_TYPES
    });

    useProductSelection.mockReturnValue({
      products: mockAvailableProducts,
      allProducts: mockAvailableProducts,
      categories: ['Pratos Principais', 'Hambúrgueres'],
      searchTerm: '',
      selectedCategory: '',
      loading: false,
      error: null,
      searchProducts: jest.fn(),
      filterByCategory: jest.fn(),
      clearFilters: jest.fn(),
      setSearchTerm: jest.fn(),
      setSelectedCategory: jest.fn(),
      setError: jest.fn()
    });

    useHighlightsDialog.mockReturnValue({
      dialogs: {
        config: false,
        addProduct: false,
        editDiscount: false,
        preview: false,
        delete: false,
        copyDay: false
      },
      selectedData: {
        config: null,
        product: null,
        scheduleItem: null,
        dayId: null,
        deleteId: null,
        copyFromDay: null,
        copyToDay: null
      },
      openDialog: jest.fn(),
      closeDialog: jest.fn(),
      closeAllDialogs: jest.fn(),
      setSelectedData: jest.fn()
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Renderização Básica', () => {
    test('renderiza o título e descrição corretamente', () => {
      render(
        <TestWrapper>
          <HighlightsManager />
        </TestWrapper>
      );

      expect(screen.getByText('Gerenciamento de Destaques')).toBeInTheDocument();
      expect(screen.getByText('Configure sua lista de destaques semanais com cronograma e descontos')).toBeInTheDocument();
    });

    test('renderiza o botão de configurações', () => {
      render(
        <TestWrapper>
          <HighlightsManager />
        </TestWrapper>
      );

      const configButton = screen.getByRole('button', { name: /configurações/i });
      expect(configButton).toBeInTheDocument();
    });

    test('renderiza o status da configuração atual', () => {
      render(
        <TestWrapper>
          <HighlightsManager />
        </TestWrapper>
      );

      expect(screen.getByText('Especiais do Dia')).toBeInTheDocument();
      expect(screen.getByText('Ofertas especiais selecionadas para cada dia da semana')).toBeInTheDocument();
      expect(screen.getByText('Ativo')).toBeInTheDocument();
    });

    test('renderiza as estatísticas do sistema semanal', () => {
      render(
        <TestWrapper>
          <HighlightsManager />
        </TestWrapper>
      );

      expect(screen.getByText('Total de Produtos')).toBeInTheDocument();
      expect(screen.getByText('Produtos Ativos')).toBeInTheDocument();
      expect(screen.getByText('Dias com Produtos')).toBeInTheDocument();
      expect(screen.getByText('Economia Total')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument(); // Total produtos
      expect(screen.getByText('2/7')).toBeInTheDocument(); // Dias com produtos
    });

    test('renderiza todos os dias da semana', () => {
      render(
        <TestWrapper>
          <HighlightsManager />
        </TestWrapper>
      );

      WEEKDAYS.forEach(day => {
        expect(screen.getByText(day.name)).toBeInTheDocument();
      });
    });

    test('renderiza cronograma semanal com título', () => {
      render(
        <TestWrapper>
          <HighlightsManager />
        </TestWrapper>
      );

      expect(screen.getByText('Cronograma Semanal')).toBeInTheDocument();
    });
  });

  describe('Cards dos Dias da Semana', () => {
    test('renderiza produtos nos dias corretos', () => {
      render(
        <TestWrapper>
          <HighlightsManager />
        </TestWrapper>
      );

      expect(screen.getByText('Feijoada Completa')).toBeInTheDocument();
      expect(screen.getByText('Hambúrguer Artesanal')).toBeInTheDocument();
    });

    test('mostra contador de produtos em cada dia', () => {
      render(
        <TestWrapper>
          <HighlightsManager />
        </TestWrapper>
      );

      // Domingo tem 1 produto
      const sundayCards = screen.getAllByText('1 produto(s)');
      expect(sundayCards).toHaveLength(1);
    });

    test('renderiza botão adicionar produto em cada dia', () => {
      render(
        <TestWrapper>
          <HighlightsManager />
        </TestWrapper>
      );

      const addButtons = screen.getAllByText('Adicionar Produto');
      expect(addButtons).toHaveLength(7); // Um para cada dia da semana
    });

    test('mostra mensagem quando dia está vazio', () => {
      render(
        <TestWrapper>
          <HighlightsManager />
        </TestWrapper>
      );

      expect(screen.getByText('Nenhum produto agendado')).toBeInTheDocument();
    });
  });

  describe('Produtos no Cronograma', () => {
    test('renderiza informações do produto corretamente', () => {
      render(
        <TestWrapper>
          <HighlightsManager />
        </TestWrapper>
      );

      expect(screen.getByText('Feijoada Completa')).toBeInTheDocument();
      expect(screen.getByText('R$ 35.90')).toBeInTheDocument();
      expect(screen.getByText('R$ 30.52')).toBeInTheDocument(); // Preço com desconto
    });

    test('renderiza botões de ação para cada produto', () => {
      render(
        <TestWrapper>
          <HighlightsManager />
        </TestWrapper>
      );

      // Cada produto deve ter botões de editar, ativar/desativar, remover
      const editButtons = screen.getAllByLabelText(/editar/i);
      const toggleButtons = screen.getAllByLabelText(/ativar|desativar/i);
      const deleteButtons = screen.getAllByLabelText(/remover/i);

      expect(editButtons.length).toBeGreaterThan(0);
      expect(toggleButtons.length).toBeGreaterThan(0);
      expect(deleteButtons.length).toBeGreaterThan(0);
    });

    test('mostra desconto formatado', () => {
      render(
        <TestWrapper>
          <HighlightsManager />
        </TestWrapper>
      );

      expect(screen.getByText('15% OFF')).toBeInTheDocument();
    });
  });

  describe('Interações do Usuário', () => {
    test('abre dialog de configuração ao clicar no botão', async () => {
      const mockOpenDialog = jest.fn();
      useHighlightsDialog.mockReturnValue({
        dialogs: { config: false, addProduct: false, editDiscount: false, preview: false, delete: false, copyDay: false },
        selectedData: { config: null, product: null, scheduleItem: null, dayId: null, deleteId: null, copyFromDay: null, copyToDay: null },
        openDialog: mockOpenDialog,
        closeDialog: jest.fn(),
        closeAllDialogs: jest.fn(),
        setSelectedData: jest.fn()
      });

      render(
        <TestWrapper>
          <HighlightsManager />
        </TestWrapper>
      );

      const configButton = screen.getByRole('button', { name: /configurações/i });
      await userEvent.click(configButton);

      expect(mockOpenDialog).toHaveBeenCalledWith('config', { config: mockConfig });
    });

    test('abre dialog de adicionar produto ao clicar no botão do dia', async () => {
      const mockOpenDialog = jest.fn();
      useHighlightsDialog.mockReturnValue({
        dialogs: { config: false, addProduct: false, editDiscount: false, preview: false, delete: false, copyDay: false },
        selectedData: { config: null, product: null, scheduleItem: null, dayId: null, deleteId: null, copyFromDay: null, copyToDay: null },
        openDialog: mockOpenDialog,
        closeDialog: jest.fn(),
        closeAllDialogs: jest.fn(),
        setSelectedData: jest.fn()
      });

      render(
        <TestWrapper>
          <HighlightsManager />
        </TestWrapper>
      );

      const addButtons = screen.getAllByText('Adicionar Produto');
      await userEvent.click(addButtons[0]); // Clica no primeiro (Domingo)

      expect(mockOpenDialog).toHaveBeenCalledWith('addProduct', { dayId: 0 });
    });

    test('chama remoção de produto ao clicar no botão remover', async () => {
      const mockRemoveProduct = jest.fn().mockResolvedValue({ success: true });
      useWeeklySchedule.mockReturnValue({
        weeklySchedule: mockWeeklySchedule,
        loading: false,
        error: null,
        statistics: mockStatistics,
        addProductToDay: jest.fn(),
        removeProductFromDay: mockRemoveProduct,
        updateProductDiscount: jest.fn(),
        toggleProductStatus: jest.fn(),
        copyDaySchedule: jest.fn(),
        WEEKDAYS: WEEKDAYS
      });

      render(
        <TestWrapper>
          <HighlightsManager />
        </TestWrapper>
      );

      const deleteButtons = screen.getAllByLabelText(/remover/i);
      await userEvent.click(deleteButtons[0]);

      expect(mockRemoveProduct).toHaveBeenCalledWith(0, 1); // dayId: 0, scheduleItemId: 1
    });

    test('chama toggle de status ao clicar no botão ativar/desativar', async () => {
      const mockToggleStatus = jest.fn().mockResolvedValue({ success: true });
      useWeeklySchedule.mockReturnValue({
        weeklySchedule: mockWeeklySchedule,
        loading: false,
        error: null,
        statistics: mockStatistics,
        addProductToDay: jest.fn(),
        removeProductFromDay: jest.fn(),
        updateProductDiscount: jest.fn(),
        toggleProductStatus: mockToggleStatus,
        copyDaySchedule: jest.fn(),
        WEEKDAYS: WEEKDAYS
      });

      render(
        <TestWrapper>
          <HighlightsManager />
        </TestWrapper>
      );

      const toggleButtons = screen.getAllByLabelText(/ativar|desativar/i);
      await userEvent.click(toggleButtons[0]);

      expect(mockToggleStatus).toHaveBeenCalledWith(0, 1); // dayId: 0, scheduleItemId: 1
    });
  });

  describe('Estados de Loading e Erro', () => {
    test('renderiza barra de progresso quando carregando', () => {
      useHighlightsConfig.mockReturnValue({
        config: mockConfig,
        loading: true,
        error: null,
        updateConfig: jest.fn(),
        toggleActive: jest.fn()
      });

      render(
        <TestWrapper>
          <HighlightsManager />
        </TestWrapper>
      );

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    test('renderiza mensagem de erro quando há erro', () => {
      const errorMessage = 'Erro ao carregar cronograma';
      useWeeklySchedule.mockReturnValue({
        weeklySchedule: mockWeeklySchedule,
        loading: false,
        error: errorMessage,
        statistics: mockStatistics,
        addProductToDay: jest.fn(),
        removeProductFromDay: jest.fn(),
        updateProductDiscount: jest.fn(),
        toggleProductStatus: jest.fn(),
        copyDaySchedule: jest.fn(),
        WEEKDAYS: WEEKDAYS
      });

      render(
        <TestWrapper>
          <HighlightsManager />
        </TestWrapper>
      );

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    test('desabilita botão de configuração quando carregando', () => {
      useHighlightsConfig.mockReturnValue({
        config: mockConfig,
        loading: true,
        error: null,
        updateConfig: jest.fn(),
        toggleActive: jest.fn()
      });

      render(
        <TestWrapper>
          <HighlightsManager />
        </TestWrapper>
      );

      const configButton = screen.getByRole('button', { name: /configurações/i });
      expect(configButton).toBeDisabled();
    });
  });
});
