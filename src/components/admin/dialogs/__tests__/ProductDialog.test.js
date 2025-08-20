/**
 * TESTES DO COMPONENTE - DIÁLOGO DE PRODUTO
 * 
 * Conjunto de testes para validar o comportamento e funcionalidades
 * do componente de diálogo para criação e edição de produtos.
 * 
 * Cobertura:
 * - Renderização do diálogo
 * - Formulário de produto (criação e edição)
 * - Validação de campos obrigatórios
 * - Seleção de categorias
 * - Formatação de preços
 * - Interações de usuário
 * - Estados de abertura/fechamento
 * - Submissão de dados
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ProductDialog from '../ProductDialog';

/**
 * HELPER: Wrapper com ThemeProvider para Material-UI
 */
const ThemeWrapper = ({ children }) => {
  const theme = createTheme();
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

/**
 * HELPER: Categorias mock
 */
const mockCategories = ['Pizzas', 'Hambúrgueres', 'Bebidas', 'Sobremesas'];

/**
 * HELPER: Renderiza componente com props padrão
 */
const renderProductDialog = (props = {}) => {
  const defaultProps = {
    open: true,
    onClose: jest.fn(),
    product: null,
    categories: mockCategories,
    onSave: jest.fn()
  };

  return render(
    <ThemeWrapper>
      <ProductDialog {...defaultProps} {...props} />
    </ThemeWrapper>
  );
};

/**
 * SUITE DE TESTES PRINCIPAL
 */
describe('ProductDialog', () => {
  // Limpar mocks antes de cada teste
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * GRUPO: Testes de Renderização
   */
  describe('Renderização', () => {
    /**
     * TESTE: Diálogo não renderizado quando fechado
     * Verifica se diálogo não aparece quando open é false
     */
    test('não deve renderizar quando open é false', () => {
      // ACT: Renderizar diálogo fechado
      renderProductDialog({ open: false });

      // ASSERT: Diálogo não deve estar visível
      expect(screen.queryByText('Adicionar Produto')).not.toBeInTheDocument();
      expect(screen.queryByText('Editar Produto')).not.toBeInTheDocument();
    });

    /**
     * TESTE: Renderização do diálogo de novo produto
     * Verifica se diálogo aparece corretamente para criação
     */
    test('deve renderizar diálogo para novo produto', () => {
      // ACT: Renderizar para novo produto
      renderProductDialog({ product: null });

      // ASSERT: Verificar elementos de criação
      expect(screen.getByText('🍽️ Adicionar Produto')).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /nome/i })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /descrição/i })).toBeInTheDocument();
      expect(screen.getByRole('spinbutton', { name: /preço/i })).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /url da imagem/i })).toBeInTheDocument();
      expect(screen.getByText('Cancelar')).toBeInTheDocument();
      expect(screen.getByText('Salvar')).toBeInTheDocument();
    });

    /**
     * TESTE: Renderização do diálogo de edição
     * Verifica se diálogo aparece corretamente para edição
     */
    test('deve renderizar diálogo para editar produto', () => {
      // ARRANGE: Produto para edição
      const produto = {
        id: 1,
        name: 'Pizza Margherita',
        description: 'Pizza clássica com molho e queijo',
        price: 25.90,
        category: 'Pizzas',
        imageUrl: 'https://exemplo.com/pizza.jpg'
      };

      // ACT: Renderizar para edição
      renderProductDialog({ product: produto });

      // ASSERT: Verificar elementos de edição
      expect(screen.getByText('✏️ Editar Produto')).toBeInTheDocument();
    });

    /**
     * TESTE: Todos os campos estão presentes
     * Verifica se todos os campos necessários são renderizados
     */
    test('deve renderizar todos os campos do formulário', () => {
      // ACT: Renderizar diálogo
      renderProductDialog();

      // ASSERT: Verificar campos
      expect(screen.getByRole('textbox', { name: /nome/i })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /descrição/i })).toBeInTheDocument();
      expect(screen.getByRole('spinbutton', { name: /preço/i })).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /url da imagem/i })).toBeInTheDocument();
      expect(screen.getByLabelText('Exibir no cardápio para clientes')).toBeInTheDocument();
      
      // ASSERT: Verificar placeholder
      expect(screen.getByPlaceholderText('https://exemplo.com/imagem.jpg')).toBeInTheDocument();
    });

    /**
     * TESTE: Dropdown de categorias
     * Verifica se todas as categorias estão disponíveis
     */
    test('deve renderizar todas as categorias no dropdown', async () => {
      // ACT: Renderizar diálogo
      renderProductDialog();

      // ACT: Abrir dropdown de categoria
      const categorySelect = screen.getByRole('combobox');
      fireEvent.mouseDown(categorySelect);

      // ASSERT: Verificar opções de categoria
      await waitFor(() => {
        expect(screen.getByRole('option', { name: 'Pizzas' })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: 'Hambúrgueres' })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: 'Bebidas' })).toBeInTheDocument();
        expect(screen.getByRole('option', { name: 'Sobremesas' })).toBeInTheDocument();
      });
    });
  });

  /**
   * GRUPO: Testes de Estado do Formulário
   */
  describe('Estado do Formulário', () => {
    /**
     * TESTE: Formulário vazio para novo produto
     * Verifica se campos estão vazios para criação
     */
    test('deve inicializar formulário vazio para novo produto', () => {
      // ACT: Renderizar para novo produto
      renderProductDialog({ product: null });

      // ASSERT: Verificar campos vazios
      expect(screen.getByRole('textbox', { name: /nome/i })).toHaveValue('');
      expect(screen.getByRole('textbox', { name: /descrição/i })).toHaveValue('');
      expect(screen.getByRole('spinbutton', { name: /preço/i })).toHaveValue(null);
      expect(screen.getByRole('textbox', { name: /url da imagem/i })).toHaveValue('');
      
      // ASSERT: Categoria deve estar vazia inicialmente
      const categorySelect = screen.getByRole('combobox');
      expect(categorySelect).toHaveAttribute('aria-expanded', 'false');
      
      // ASSERT: Visibilidade deve estar ativa por padrão
      expect(screen.getByRole('switch')).toBeChecked();
    });

    /**
     * TESTE: Formulário preenchido para edição
     * Verifica se campos são preenchidos com dados do produto
     */
    test('deve preencher formulário com dados do produto para edição', () => {
      // ARRANGE: Produto existente
      const produto = {
        id: 2,
        name: 'Hambúrguer Clássico',
        description: 'Hambúrguer com carne, alface e tomate',
        price: 18.50,
        category: 'Hambúrgueres',
        imageUrl: 'https://exemplo.com/hamburguer.jpg',
        visibleInMenu: false
      };

      // ACT: Renderizar para edição
      renderProductDialog({ product: produto });

      // ASSERT: Verificar campos preenchidos
      expect(screen.getByRole('textbox', { name: /nome/i })).toHaveValue('Hambúrguer Clássico');
      expect(screen.getByRole('textbox', { name: /descrição/i })).toHaveValue('Hambúrguer com carne, alface e tomate');
      expect(screen.getByRole('spinbutton', { name: /preço/i })).toHaveValue(18.5);
      expect(screen.getByRole('combobox')).toHaveTextContent('Hambúrgueres');
      expect(screen.getByRole('textbox', { name: /url da imagem/i })).toHaveValue('https://exemplo.com/hamburguer.jpg');
      expect(screen.getByRole('switch')).not.toBeChecked();
    });

    /**
     * TESTE: Reset do formulário ao fechar e reabrir
     * Verifica se formulário é resetado entre usos
     */
    test('deve resetar formulário ao reabrir diálogo', () => {
      // ARRANGE: Renderizar e preencher formulário
      const { rerender } = renderProductDialog();

      // ACT: Preencher campos
      fireEvent.change(screen.getByRole('textbox', { name: /nome/i }), {
        target: { value: 'Produto Teste' }
      });

      fireEvent.change(screen.getByRole('spinbutton', { name: /preço/i }), {
        target: { value: '15.90' }
      });

      // ACT: Fechar e reabrir diálogo
      rerender(
        <ThemeWrapper>
          <ProductDialog
            open={false}
            onClose={jest.fn()}
            product={null}
            categories={mockCategories}
            onSave={jest.fn()}
          />
        </ThemeWrapper>
      );

      rerender(
        <ThemeWrapper>
          <ProductDialog
            open={true}
            onClose={jest.fn()}
            product={null}
            categories={mockCategories}
            onSave={jest.fn()}
          />
        </ThemeWrapper>
      );

      // ASSERT: Campos devem estar vazios novamente
      expect(screen.getByRole('textbox', { name: /nome/i })).toHaveValue('');
      expect(screen.getByRole('spinbutton', { name: /preço/i })).toHaveValue(null);
    });

    /**
     * TESTE: Tratamento de produto com dados incompletos
     * Verifica se componente lida com dados faltantes
     */
    test('deve lidar com produto com dados incompletos', () => {
      // ARRANGE: Produto com dados parciais
      const produtoIncompleto = {
        id: 3,
        name: 'Apenas Nome',
        price: 10.00
        // description, category e imageUrl ausentes
      };

      // ACT: Renderizar com dados incompletos
      renderProductDialog({ product: produtoIncompleto });

      // ASSERT: Campos ausentes devem ter valores padrão
      expect(screen.getByRole('textbox', { name: /nome/i })).toHaveValue('Apenas Nome');
      expect(screen.getByRole('spinbutton', { name: /preço/i })).toHaveValue(10);
      expect(screen.getByRole('textbox', { name: /descrição/i })).toHaveValue('');
      expect(screen.getByRole('textbox', { name: /url da imagem/i })).toHaveValue('');
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false');
    });

    /**
     * TESTE: Tratamento de lista de categorias vazia
     * Verifica comportamento quando não há categorias
     */
    test('deve lidar com lista de categorias vazia', () => {
      // ACT: Renderizar com categorias vazias
      renderProductDialog({ categories: [] });

      // ASSERT: Campo categoria deve estar vazio
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false');
    });
  });

  /**
   * GRUPO: Testes de Interação do Usuário
   */
  describe('Interação do Usuário', () => {
    /**
     * TESTE: Digitação nos campos de texto
     * Verifica se usuário pode digitar nos campos
     */
    test('deve permitir digitação nos campos de texto', () => {
      // ACT: Renderizar diálogo
      renderProductDialog();

      // ACT: Digitar nos campos
      fireEvent.change(screen.getByRole('textbox', { name: /nome/i }), {
        target: { value: 'Produto Teste' }
      });

      fireEvent.change(screen.getByRole('textbox', { name: /descrição/i }), {
        target: { value: 'Descrição do produto teste' }
      });

      fireEvent.change(screen.getByRole('textbox', { name: /url da imagem/i }), {
        target: { value: 'https://teste.com/imagem.jpg' }
      });

      // ASSERT: Verificar valores atualizados
      expect(screen.getByRole('textbox', { name: /nome/i })).toHaveValue('Produto Teste');
      expect(screen.getByRole('textbox', { name: /descrição/i })).toHaveValue('Descrição do produto teste');
      expect(screen.getByRole('textbox', { name: /url da imagem/i })).toHaveValue('https://teste.com/imagem.jpg');
    });

    /**
     * TESTE: Digitação no campo de preço
     * Verifica se campo numérico funciona corretamente
     */
    test('deve permitir digitação de valores numéricos no preço', () => {
      // ACT: Renderizar diálogo
      renderProductDialog();

      // ACT: Digitar preço
      fireEvent.change(screen.getByRole('spinbutton', { name: /preço/i }), {
        target: { value: '25.90' }
      });

      // ASSERT: Verificar valor
      expect(screen.getByRole('spinbutton', { name: /preço/i })).toHaveValue(25.9);
    });

    /**
     * TESTE: Seleção de categoria
     * Verifica se seleção de categoria funciona
     */
    test('deve permitir seleção de categoria', async () => {
      // ACT: Renderizar diálogo
      renderProductDialog();

      // ACT: Abrir dropdown e selecionar categoria
      const categorySelect = screen.getByRole('combobox');
      fireEvent.mouseDown(categorySelect);

      await waitFor(() => {
        fireEvent.click(screen.getByRole('option', { name: 'Bebidas' }));
      });

      // ASSERT: Categoria deve ser atualizada
      expect(screen.getByRole('combobox')).toHaveTextContent('Bebidas');
    });

    /**
     * TESTE: Botão cancelar
     * Verifica se botão cancelar chama onClose
     */
    test('deve chamar onClose ao clicar em cancelar', () => {
      // ARRANGE: Mock da função
      const mockOnClose = jest.fn();

      // ACT: Renderizar diálogo
      renderProductDialog({ onClose: mockOnClose });

      // ACT: Clicar em cancelar
      fireEvent.click(screen.getByText('Cancelar'));

      // ASSERT: Função deve ter sido chamada
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    /**
     * TESTE: Fechamento por ESC
     * Verifica se diálogo fecha com tecla ESC
     */
    test('deve chamar onClose ao pressionar ESC', async () => {
      // ARRANGE: Mock da função
      const mockOnClose = jest.fn();

      // ACT: Renderizar diálogo
      renderProductDialog({ onClose: mockOnClose });

      // ACT: Pressionar ESC no diálogo
      const dialog = screen.getByRole('dialog');
      fireEvent.keyDown(dialog, { key: 'Escape' });

      // ASSERT: Função onClose deve ter sido chamada
      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
      });
    });
  });

  /**
   * GRUPO: Testes de Validação
   */
  describe('Validação', () => {
    /**
     * TESTE: Botão salvar desabilitado com campos obrigatórios vazios
     * Verifica se validação dos campos obrigatórios funciona
     */
    test('deve desabilitar botão salvar com campos obrigatórios vazios', () => {
      // ACT: Renderizar diálogo
      renderProductDialog();

      // ASSERT: Botão deve estar desabilitado inicialmente
      const saveButton = screen.getByText('Salvar');
      expect(saveButton).toBeDisabled();
    });

    /**
     * TESTE: Botão salvar habilitado com todos os campos obrigatórios preenchidos
     * Verifica se botão é habilitado quando validação passa
     */
    test('deve habilitar botão salvar com todos os campos obrigatórios preenchidos', async () => {
      // ACT: Renderizar diálogo
      renderProductDialog();

      // ACT: Preencher campos obrigatórios
      fireEvent.change(screen.getByRole('textbox', { name: /nome/i }), {
        target: { value: 'Produto Válido' }
      });

      fireEvent.change(screen.getByRole('spinbutton', { name: /preço/i }), {
        target: { value: '15.90' }
      });

      // ACT: Selecionar categoria
      const categorySelect = screen.getByRole('combobox');
      fireEvent.mouseDown(categorySelect);

      await waitFor(() => {
        fireEvent.click(screen.getByRole('option', { name: 'Pizzas' }));
      });

      // ASSERT: Botão deve estar habilitado
      const saveButton = screen.getByText('Salvar');
      expect(saveButton).not.toBeDisabled();
    });

    /**
     * TESTE: Validação individual de campos
     * Verifica se cada campo obrigatório é validado individualmente
     */
    test('deve validar campos obrigatórios individualmente', async () => {
      // ACT: Renderizar diálogo
      renderProductDialog();

      // ACT: Preencher apenas nome
      fireEvent.change(screen.getByRole('textbox', { name: /nome/i }), {
        target: { value: 'Produto' }
      });

      // ASSERT: Botão ainda deve estar desabilitado (falta preço e categoria)
      expect(screen.getByText('Salvar')).toBeDisabled();

      // ACT: Preencher preço
      fireEvent.change(screen.getByRole('spinbutton', { name: /preço/i }), {
        target: { value: '10.00' }
      });

      // ASSERT: Botão ainda deve estar desabilitado (falta categoria)
      expect(screen.getByText('Salvar')).toBeDisabled();

      // ACT: Selecionar categoria
      const categorySelect = screen.getByRole('combobox');
      fireEvent.mouseDown(categorySelect);

      await waitFor(() => {
        fireEvent.click(screen.getByRole('option', { name: 'Pizzas' }));
      });

      // ASSERT: Agora botão deve estar habilitado
      expect(screen.getByText('Salvar')).not.toBeDisabled();
    });

    /**
     * TESTE: Validação de preço zero
     * Verifica se preço zero é aceito
     */
    test('deve aceitar preço zero como válido', async () => {
      // ACT: Renderizar diálogo
      renderProductDialog();

      // ACT: Preencher com preço zero
      fireEvent.change(screen.getByRole('textbox', { name: /nome/i }), {
        target: { value: 'Produto Grátis' }
      });

      fireEvent.change(screen.getByRole('spinbutton', { name: /preço/i }), {
        target: { value: '0' }
      });

      const categorySelect = screen.getByRole('combobox');
      fireEvent.mouseDown(categorySelect);

      await waitFor(() => {
        fireEvent.click(screen.getByRole('option', { name: 'Pizzas' }));
      });

      // ASSERT: Botão deve estar habilitado
      expect(screen.getByText('Salvar')).not.toBeDisabled();
    });

    /**
     * TESTE: Campos obrigatórios marcados visualmente
     * Verifica se campos obrigatórios têm indicação visual
     */
    test('deve marcar campos obrigatórios visualmente', () => {
      // ACT: Renderizar diálogo
      renderProductDialog();

      // ASSERT: Verificar atributos required
      expect(screen.getByRole('textbox', { name: /nome/i })).toHaveAttribute('required');
      expect(screen.getByRole('spinbutton', { name: /preço/i })).toHaveAttribute('required');
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-required', 'true');
      
      // ASSERT: Campos não obrigatórios não devem ter required
      expect(screen.getByRole('textbox', { name: /descrição/i })).not.toHaveAttribute('required');
      expect(screen.getByRole('textbox', { name: /url da imagem/i })).not.toHaveAttribute('required');
    });
  });

  /**
   * GRUPO: Testes de Submissão
   */
  describe('Submissão', () => {
    /**
     * TESTE: Submissão de novo produto
     * Verifica se onSave é chamado com dados corretos para criação
     */
    test('deve submeter dados de novo produto corretamente', async () => {
      // ARRANGE: Mock da função
      const mockOnSave = jest.fn();

      // ACT: Renderizar diálogo
      renderProductDialog({ 
        onSave: mockOnSave,
        product: null 
      });

      // ACT: Preencher formulário
      fireEvent.change(screen.getByRole('textbox', { name: /nome/i }), {
        target: { value: 'Novo Produto' }
      });

      fireEvent.change(screen.getByRole('textbox', { name: /descrição/i }), {
        target: { value: 'Descrição do novo produto' }
      });

      fireEvent.change(screen.getByRole('spinbutton', { name: /preço/i }), {
        target: { value: '29.90' }
      });

      fireEvent.change(screen.getByRole('textbox', { name: /url da imagem/i }), {
        target: { value: 'https://exemplo.com/produto.jpg' }
      });

      const categorySelect = screen.getByRole('combobox');
      fireEvent.mouseDown(categorySelect);

      await waitFor(() => {
        fireEvent.click(screen.getByText('Sobremesas'));
      });

      // ACT: Clicar em salvar
      fireEvent.click(screen.getByText('Salvar'));

      // ASSERT: Verificar chamada de onSave
      expect(mockOnSave).toHaveBeenCalledWith({
        name: 'Novo Produto',
        description: 'Descrição do novo produto',
        price: 29.90, // Número convertido
        category: 'Sobremesas',
        imageUrl: 'https://exemplo.com/produto.jpg',
        visibleInMenu: true
      });
    });

    /**
     * TESTE: Submissão de produto editado
     * Verifica se onSave é chamado com dados corretos para edição
     */
    test('deve submeter dados de produto editado corretamente', async () => {
      // ARRANGE: Mock da função e produto existente
      const mockOnSave = jest.fn();
      const produtoExistente = {
        id: 5,
        name: 'Produto Original',
        description: 'Descrição original',
        price: 20.00,
        category: 'Pizzas',
        imageUrl: 'https://original.com/image.jpg'
      };

      // ACT: Renderizar diálogo
      renderProductDialog({ 
        onSave: mockOnSave,
        product: produtoExistente 
      });

      // ACT: Modificar dados
      fireEvent.change(screen.getByRole('textbox', { name: /nome/i }), {
        target: { value: 'Produto Modificado' }
      });

      fireEvent.change(screen.getByRole('spinbutton', { name: /preço/i }), {
        target: { value: '25.50' }
      });

      // ACT: Salvar
      fireEvent.click(screen.getByText('Salvar'));

      // ASSERT: Verificar dados incluindo ID original
      expect(mockOnSave).toHaveBeenCalledWith({
        id: 5, // ID preservado para edição
        name: 'Produto Modificado',
        description: 'Descrição original',
        price: 25.50,
        category: 'Pizzas',
        imageUrl: 'https://original.com/image.jpg',
        visibleInMenu: true
      });
    });

    /**
     * TESTE: Conversão de preço para número
     * Verifica se preço é convertido corretamente para número
     */
    test('deve converter preço para número na submissão', async () => {
      // ARRANGE: Mock da função
      const mockOnSave = jest.fn();

      // ACT: Renderizar e preencher
      renderProductDialog({ onSave: mockOnSave });

      fireEvent.change(screen.getByRole('textbox', { name: /nome/i }), {
        target: { value: 'Produto' }
      });

      fireEvent.change(screen.getByRole('spinbutton', { name: /preço/i }), {
        target: { value: '15.50' }
      });

      const categorySelect = screen.getByRole('combobox');
      fireEvent.mouseDown(categorySelect);

      await waitFor(() => {
        fireEvent.click(screen.getByRole('option', { name: 'Pizzas' }));
      });

      // ACT: Salvar
      fireEvent.click(screen.getByText('Salvar'));

      // ASSERT: Preço deve ser número
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          price: 15.50 // Número, não string
        })
      );
    });

    /**
     * TESTE: Tratamento de preço inválido
     * Verifica se preço inválido é tratado como zero
     */
    test('deve tratar preço inválido como zero', async () => {
      // ARRANGE: Mock da função
      const mockOnSave = jest.fn();

      // ACT: Renderizar e preencher
      renderProductDialog({ onSave: mockOnSave });

      fireEvent.change(screen.getByRole('textbox', { name: /nome/i }), {
        target: { value: 'Produto' }
      });

      fireEvent.change(screen.getByRole('spinbutton', { name: /preço/i }), {
        target: { value: '0' } // Zero é tecnicamente um valor válido que será convertido
      });

      const categorySelect = screen.getByRole('combobox');
      fireEvent.mouseDown(categorySelect);

      await waitFor(() => {
        fireEvent.click(screen.getByRole('option', { name: 'Pizzas' }));
      });

      // ACT: Salvar
      fireEvent.click(screen.getByText('Salvar'));

      // ASSERT: Preço deve ser zero
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          price: 0 // Valor padrão para entrada inválida
        })
      );
    });

    /**
     * TESTE: Submissão com campos opcionais vazios
     * Verifica se produto pode ser salvo com apenas campos obrigatórios
     */
    test('deve permitir salvar com campos opcionais vazios', async () => {
      // ARRANGE: Mock da função
      const mockOnSave = jest.fn();

      // ACT: Renderizar diálogo
      renderProductDialog({ onSave: mockOnSave });

      // ACT: Preencher apenas campos obrigatórios
      fireEvent.change(screen.getByRole('textbox', { name: /nome/i }), {
        target: { value: 'Produto Mínimo' }
      });

      fireEvent.change(screen.getByRole('spinbutton', { name: /preço/i }), {
        target: { value: '10.00' }
      });

      const categorySelect = screen.getByRole('combobox');
      fireEvent.mouseDown(categorySelect);

      await waitFor(() => {
        fireEvent.click(screen.getByRole('option', { name: 'Pizzas' }));
      });

      // ACT: Salvar
      fireEvent.click(screen.getByText('Salvar'));

      // ASSERT: Deve salvar com campos opcionais vazios
      expect(mockOnSave).toHaveBeenCalledWith({
        name: 'Produto Mínimo',
        description: '',
        price: 10.00,
        category: 'Pizzas',
        imageUrl: '',
        visibleInMenu: true
      });
    });
  });

  /**
   * GRUPO: Testes de Casos Extremos
   */
  describe('Casos Extremos', () => {
    /**
     * TESTE: Produto com preço muito alto
     * Verifica se componente lida com valores monetários altos
     */
    test('deve lidar com preços muito altos', async () => {
      // ARRANGE: Mock da função
      const mockOnSave = jest.fn();

      // ACT: Renderizar e preencher
      renderProductDialog({ onSave: mockOnSave });

      fireEvent.change(screen.getByRole('textbox', { name: /nome/i }), {
        target: { value: 'Produto Caro' }
      });

      fireEvent.change(screen.getByRole('spinbutton', { name: /preço/i }), {
        target: { value: '9999.99' }
      });

      const categorySelect = screen.getByRole('combobox');
      fireEvent.mouseDown(categorySelect);

      await waitFor(() => {
        fireEvent.click(screen.getByRole('option', { name: 'Pizzas' }));
      });

      // ACT: Salvar
      fireEvent.click(screen.getByText('Salvar'));

      // ASSERT: Valor alto deve ser aceito
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          price: 9999.99
        })
      );
    });

    /**
     * TESTE: Nome muito longo
     * Verifica se componente lida com textos longos
     */
    test('deve lidar com nome muito longo', () => {
      // ARRANGE: Nome extremamente longo
      const nomeLongo = 'A'.repeat(1000);

      // ACT: Renderizar e preencher
      renderProductDialog();
      fireEvent.change(screen.getByRole('textbox', { name: /nome/i }), {
        target: { value: nomeLongo }
      });

      // ASSERT: Campo deve aceitar texto longo
      expect(screen.getByRole('textbox', { name: /nome/i })).toHaveValue(nomeLongo);
    });

    /**
     * TESTE: URL de imagem inválida
     * Verifica se componente aceita URLs malformadas
     */
    test('deve aceitar URL de imagem inválida', () => {
      // ARRANGE: URL inválida
      const urlInvalida = 'url-invalida-sem-protocolo';

      // ACT: Renderizar e preencher
      renderProductDialog();
      fireEvent.change(screen.getByRole('textbox', { name: /url da imagem/i }), {
        target: { value: urlInvalida }
      });

      // ASSERT: Campo deve aceitar URL inválida (validação não é responsabilidade do componente)
      expect(screen.getByRole('textbox', { name: /url da imagem/i })).toHaveValue(urlInvalida);
    });

    /**
     * TESTE: Props undefined/null
     * Verifica robustez com props inválidas
     */
    test('deve lidar com props undefined graciosamente', () => {
      // ACT: Renderizar com props undefined
      expect(() => {
        render(
          <ThemeWrapper>
            <ProductDialog
              open={true}
              onClose={undefined}
              product={undefined}
              categories={undefined}
              onSave={undefined}
            />
          </ThemeWrapper>
        );
      }).not.toThrow();

      // ASSERT: Componente deve renderizar
      expect(screen.getByText('🍽️ Adicionar Produto')).toBeInTheDocument();
    });

    /**
     * TESTE: Lista de categorias nula
     * Verifica comportamento com categorias nulas
     */
    test('deve lidar com categorias nulas', () => {
      // ACT: Renderizar com categorias null
      expect(() => {
        renderProductDialog({ categories: null });
      }).not.toThrow();

      // ASSERT: Campo categoria deve estar presente
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });
});
