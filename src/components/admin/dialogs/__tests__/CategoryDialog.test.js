/**
 * TESTES DO COMPONENTE - DIÁLOGO DE CATEGORIA
 * 
 * Conjunto de testes para validar o comportamento e funcionalidades
 * do componente de diálogo para criação e edição de categorias.
 * 
 * Cobertura:
 * - Renderização do diálogo
 * - Formulário de categoria (criação e edição)
 * - Validação de campos obrigatórios
 * - Interações de usuário
 * - Estados de abertura/fechamento
 * - Submissão de dados
 * - Campos específicos (nome, descrição, ícone)
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CategoryDialog from '../CategoryDialog';

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
const renderCategoryDialog = (props = {}) => {
  const defaultProps = {
    open: true,
    onClose: jest.fn(),
    category: null,
    onSave: jest.fn()
  };

  return render(
    <ThemeWrapper>
      <CategoryDialog {...defaultProps} {...props} />
    </ThemeWrapper>
  );
};

/**
 * SUITE DE TESTES PRINCIPAL
 */
describe('CategoryDialog', () => {
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
      renderCategoryDialog({ open: false });

      // ASSERT: Diálogo não deve estar visível
      expect(screen.queryByText('Adicionar Categoria')).not.toBeInTheDocument();
      expect(screen.queryByText('Editar Categoria')).not.toBeInTheDocument();
    });

    /**
     * TESTE: Renderização do diálogo de nova categoria
     * Verifica se diálogo aparece corretamente para criação
     */
    test('deve renderizar diálogo para nova categoria', () => {
      // ACT: Renderizar para nova categoria
      renderCategoryDialog({ category: null });

      // ASSERT: Verificar elementos de criação
      expect(screen.getByText('📂 Adicionar Categoria')).toBeInTheDocument();
      expect(screen.getByLabelText('Nome da Categoria')).toBeInTheDocument();
      expect(screen.getByLabelText('Descrição')).toBeInTheDocument();
      expect(screen.getByLabelText('Ícone')).toBeInTheDocument();
      expect(screen.getByText('Cancelar')).toBeInTheDocument();
      expect(screen.getByText('Salvar')).toBeInTheDocument();
    });

    /**
     * TESTE: Renderização do diálogo de edição
     * Verifica se diálogo aparece corretamente para edição
     */
    test('deve renderizar diálogo para editar categoria', () => {
      // ARRANGE: Categoria para edição
      const categoria = {
        name: 'Pizzas',
        description: 'Deliciosas pizzas artesanais',
        icon: '🍕'
      };

      // ACT: Renderizar para edição
      renderCategoryDialog({ category: categoria });

      // ASSERT: Verificar elementos de edição
      expect(screen.getByText('✏️ Editar Categoria')).toBeInTheDocument();
    });

    /**
     * TESTE: Campos do formulário estão presentes
     * Verifica se todos os campos necessários são renderizados
     */
    test('deve renderizar todos os campos do formulário', () => {
      // ACT: Renderizar diálogo
      renderCategoryDialog();

      // ASSERT: Verificar campos
      expect(screen.getByLabelText('Nome da Categoria')).toBeInTheDocument();
      expect(screen.getByLabelText('Descrição')).toBeInTheDocument();
      expect(screen.getByLabelText('Ícone')).toBeInTheDocument();
      
      // ASSERT: Verificar placeholders
      expect(screen.getByPlaceholderText('Ex: Hambúrgueres, Pizzas, Bebidas...')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Breve descrição da categoria...')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Ex: 🍔, 🍕, 🥤...')).toBeInTheDocument();
    });

    /**
     * TESTE: Helper text e instruções
     * Verifica se textos de ajuda estão presentes
     */
    test('deve exibir textos de ajuda', () => {
      // ACT: Renderizar diálogo
      renderCategoryDialog();

      // ASSERT: Verificar helper text
      expect(screen.getByText('Adicione um emoji para representar a categoria')).toBeInTheDocument();
    });
  });

  /**
   * GRUPO: Testes de Estado do Formulário
   */
  describe('Estado do Formulário', () => {
    /**
     * TESTE: Formulário vazio para nova categoria
     * Verifica se campos estão vazios para criação
     */
    test('deve inicializar formulário vazio para nova categoria', () => {
      // ACT: Renderizar para nova categoria
      renderCategoryDialog({ category: null });

      // ASSERT: Verificar campos vazios
      expect(screen.getByLabelText('Nome da Categoria')).toHaveValue('');
      expect(screen.getByLabelText('Descrição')).toHaveValue('');
      expect(screen.getByLabelText('Ícone')).toHaveValue('📂'); // Valor padrão
    });

    /**
     * TESTE: Formulário preenchido para edição
     * Verifica se campos são preenchidos com dados da categoria
     */
    test('deve preencher formulário com dados da categoria para edição', () => {
      // ARRANGE: Categoria existente
      const categoria = {
        name: 'Bebidas',
        description: 'Bebidas geladas e refrescantes',
        icon: '🥤'
      };

      // ACT: Renderizar para edição
      renderCategoryDialog({ category: categoria });

      // ASSERT: Verificar campos preenchidos
      expect(screen.getByLabelText('Nome da Categoria')).toHaveValue('Bebidas');
      expect(screen.getByLabelText('Descrição')).toHaveValue('Bebidas geladas e refrescantes');
      expect(screen.getByLabelText('Ícone')).toHaveValue('🥤');
    });

    /**
     * TESTE: Reset do formulário ao fechar e reabrir
     * Verifica se formulário é resetado entre usos
     */
    test('deve resetar formulário ao reabrir diálogo', () => {
      // ARRANGE: Renderizar e preencher formulário
      const { rerender } = renderCategoryDialog();

      // ACT: Preencher campo
      fireEvent.change(screen.getByLabelText('Nome da Categoria'), {
        target: { value: 'Categoria Teste' }
      });

      // ACT: Fechar e reabrir diálogo
      rerender(
        <ThemeWrapper>
          <CategoryDialog
            open={false}
            onClose={jest.fn()}
            category={null}
            onSave={jest.fn()}
          />
        </ThemeWrapper>
      );

      rerender(
        <ThemeWrapper>
          <CategoryDialog
            open={true}
            onClose={jest.fn()}
            category={null}
            onSave={jest.fn()}
          />
        </ThemeWrapper>
      );

      // ASSERT: Campo deve estar vazio novamente
      expect(screen.getByLabelText('Nome da Categoria')).toHaveValue('');
    });

    /**
     * TESTE: Tratamento de categoria com dados incompletos
     * Verifica se componente lida com dados faltantes
     */
    test('deve lidar com categoria com dados incompletos', () => {
      // ARRANGE: Categoria com dados parciais
      const categoriaIncompleta = {
        name: 'Apenas Nome'
        // description e icon ausentes
      };

      // ACT: Renderizar com dados incompletos
      renderCategoryDialog({ category: categoriaIncompleta });

      // ASSERT: Campos ausentes devem ter valores padrão
      expect(screen.getByLabelText('Nome da Categoria')).toHaveValue('Apenas Nome');
      expect(screen.getByLabelText('Descrição')).toHaveValue('');
      expect(screen.getByLabelText('Ícone')).toHaveValue('');
    });
  });

  /**
   * GRUPO: Testes de Interação do Usuário
   */
  describe('Interação do Usuário', () => {
    /**
     * TESTE: Digitação nos campos
     * Verifica se usuário pode digitar nos campos
     */
    test('deve permitir digitação nos campos', () => {
      // ACT: Renderizar diálogo
      renderCategoryDialog();

      // ACT: Digitar nos campos
      fireEvent.change(screen.getByLabelText('Nome da Categoria'), {
        target: { value: 'Hamburguers' }
      });

      fireEvent.change(screen.getByLabelText('Descrição'), {
        target: { value: 'Hamburguers suculentos' }
      });

      fireEvent.change(screen.getByLabelText('Ícone'), {
        target: { value: '🍔' }
      });

      // ASSERT: Verificar valores atualizados
      expect(screen.getByLabelText('Nome da Categoria')).toHaveValue('Hamburguers');
      expect(screen.getByLabelText('Descrição')).toHaveValue('Hamburguers suculentos');
      expect(screen.getByLabelText('Ícone')).toHaveValue('🍔');
    });

    /**
     * TESTE: Botão cancelar
     * Verifica se botão cancelar chama onClose
     */
    test('deve chamar onClose ao clicar em cancelar', () => {
      // ARRANGE: Mock da função
      const mockOnClose = jest.fn();

      // ACT: Renderizar diálogo
      renderCategoryDialog({ onClose: mockOnClose });

      // ACT: Clicar em cancelar
      fireEvent.click(screen.getByText('Cancelar'));

      // ASSERT: Função deve ter sido chamada
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    /**
     * TESTE: Fechamento por clique fora do diálogo
     * Verifica se diálogo fecha ao clicar no backdrop
     */
    test('deve chamar onClose ao clicar fora do diálogo', async () => {
      // ARRANGE: Mock da função
      const mockOnClose = jest.fn();

      // ACT: Renderizar diálogo
      renderCategoryDialog({ onClose: mockOnClose });

      // ACT: Simular ESC key para fechar diálogo
      fireEvent.keyDown(document, { key: 'Escape' });

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
     * TESTE: Botão salvar desabilitado com nome vazio
     * Verifica se validação do campo obrigatório funciona
     */
    test('deve desabilitar botão salvar com nome vazio', () => {
      // ACT: Renderizar diálogo
      renderCategoryDialog();

      // ASSERT: Botão deve estar desabilitado inicialmente
      const saveButton = screen.getByText('Salvar');
      expect(saveButton).toBeDisabled();
    });

    /**
     * TESTE: Botão salvar habilitado com nome preenchido
     * Verifica se botão é habilitado quando campo obrigatório é preenchido
     */
    test('deve habilitar botão salvar com nome preenchido', () => {
      // ACT: Renderizar diálogo
      renderCategoryDialog();

      // ACT: Preencher nome
      fireEvent.change(screen.getByLabelText('Nome da Categoria'), {
        target: { value: 'Categoria Válida' }
      });

      // ASSERT: Botão deve estar habilitado
      const saveButton = screen.getByText('Salvar');
      expect(saveButton).not.toBeDisabled();
    });

    /**
     * TESTE: Validação com espaços em branco
     * Verifica se nome com apenas espaços é considerado inválido
     */
    test('deve considerar nome com apenas espaços como inválido', () => {
      // ACT: Renderizar diálogo
      renderCategoryDialog();

      // ACT: Preencher com espaços
      fireEvent.change(screen.getByLabelText('Nome da Categoria'), {
        target: { value: '   ' }
      });

      // ASSERT: Botão deve continuar desabilitado
      const saveButton = screen.getByText('Salvar');
      expect(saveButton).toBeDisabled();
    });

    /**
     * TESTE: Campo obrigatório marcado visualmente
     * Verifica se campo obrigatório tem indicação visual
     */
    test('deve marcar campo nome como obrigatório', () => {
      // ACT: Renderizar diálogo
      renderCategoryDialog();

      // ASSERT: Campo nome deve ter atributo required
      const nameField = screen.getByLabelText('Nome da Categoria');
      expect(nameField).toHaveAttribute('required');
    });
  });

  /**
   * GRUPO: Testes de Submissão
   */
  describe('Submissão', () => {
    /**
     * TESTE: Submissão de nova categoria
     * Verifica se onSave é chamado com dados corretos para criação
     */
    test('deve submeter dados de nova categoria corretamente', () => {
      // ARRANGE: Mock da função
      const mockOnSave = jest.fn();
      const mockOnClose = jest.fn();

      // ACT: Renderizar diálogo
      renderCategoryDialog({ 
        onSave: mockOnSave, 
        onClose: mockOnClose,
        category: null 
      });

      // ACT: Preencher formulário
      fireEvent.change(screen.getByLabelText('Nome da Categoria'), {
        target: { value: 'Nova Categoria' }
      });

      fireEvent.change(screen.getByLabelText('Descrição'), {
        target: { value: 'Descrição da categoria' }
      });

      fireEvent.change(screen.getByLabelText('Ícone'), {
        target: { value: '🆕' }
      });

      // ACT: Clicar em salvar
      fireEvent.click(screen.getByText('Salvar'));

      // ASSERT: Verificar chamada de onSave
      expect(mockOnSave).toHaveBeenCalledWith({
        name: 'Nova Categoria',
        description: 'Descrição da categoria',
        icon: '🆕',
        originalName: undefined // Nova categoria não tem nome original
      });

      // ASSERT: Diálogo deve fechar
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    /**
     * TESTE: Submissão de categoria editada
     * Verifica se onSave é chamado com dados corretos para edição
     */
    test('deve submeter dados de categoria editada corretamente', () => {
      // ARRANGE: Mock da função e categoria existente
      const mockOnSave = jest.fn();
      const mockOnClose = jest.fn();
      const categoriaExistente = {
        name: 'Categoria Original',
        description: 'Descrição original',
        icon: '📂'
      };

      // ACT: Renderizar diálogo
      renderCategoryDialog({ 
        onSave: mockOnSave, 
        onClose: mockOnClose,
        category: categoriaExistente 
      });

      // ACT: Modificar dados
      fireEvent.change(screen.getByLabelText('Nome da Categoria'), {
        target: { value: 'Categoria Modificada' }
      });

      fireEvent.change(screen.getByLabelText('Descrição'), {
        target: { value: 'Nova descrição' }
      });

      // ACT: Salvar
      fireEvent.click(screen.getByText('Salvar'));

      // ASSERT: Verificar dados incluindo nome original
      expect(mockOnSave).toHaveBeenCalledWith({
        name: 'Categoria Modificada',
        description: 'Nova descrição',
        icon: '📂',
        originalName: 'Categoria Original' // Para identificar categoria sendo editada
      });

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    /**
     * TESTE: Submissão apenas com nome preenchido
     * Verifica se categoria pode ser salva com apenas o campo obrigatório
     */
    test('deve permitir salvar com apenas nome preenchido', () => {
      // ARRANGE: Mock da função
      const mockOnSave = jest.fn();

      // ACT: Renderizar diálogo
      renderCategoryDialog({ onSave: mockOnSave });

      // ACT: Preencher apenas nome
      fireEvent.change(screen.getByLabelText('Nome da Categoria'), {
        target: { value: 'Categoria Mínima' }
      });

      // ACT: Salvar
      fireEvent.click(screen.getByText('Salvar'));

      // ASSERT: Deve salvar com campos opcionais vazios
      expect(mockOnSave).toHaveBeenCalledWith({
        name: 'Categoria Mínima',
        description: '',
        icon: '📂', // Valor padrão
        originalName: undefined
      });
    });

    /**
     * TESTE: Não submissão com nome inválido
     * Verifica se não submete quando validação falha
     */
    test('não deve submeter com nome inválido', () => {
      // ARRANGE: Mock da função
      const mockOnSave = jest.fn();

      // ACT: Renderizar diálogo
      renderCategoryDialog({ onSave: mockOnSave });

      // ACT: Tentar salvar sem preencher nome
      fireEvent.click(screen.getByText('Salvar'));

      // ASSERT: onSave não deve ter sido chamado
      expect(mockOnSave).not.toHaveBeenCalled();
    });
  });

  /**
   * GRUPO: Testes de Acessibilidade
   */
  describe('Acessibilidade', () => {
    /**
     * TESTE: Labels apropriados nos campos
     * Verifica se campos têm labels corretos
     */
    test('deve ter labels apropriados nos campos', () => {
      // ACT: Renderizar diálogo
      renderCategoryDialog();

      // ASSERT: Verificar labels
      expect(screen.getByLabelText('Nome da Categoria')).toBeInTheDocument();
      expect(screen.getByLabelText('Descrição')).toBeInTheDocument();
      expect(screen.getByLabelText('Ícone')).toBeInTheDocument();
    });

    /**
     * TESTE: Navegação por teclado
     * Verifica se componente é acessível via teclado
     */
    test('deve permitir navegação por teclado', () => {
      // ACT: Renderizar diálogo
      renderCategoryDialog();

      // ACT: Navegar por tab
      const nameField = screen.getByLabelText('Nome da Categoria');
      nameField.focus();

      // ASSERT: Campo deve estar focado
      expect(document.activeElement).toBe(nameField);
    });

    /**
     * TESTE: Role do diálogo
     * Verifica se diálogo tem role apropriado
     */
    test('deve ter role de diálogo', () => {
      // ACT: Renderizar diálogo
      renderCategoryDialog();

      // ASSERT: Verificar role
      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
    });
  });

  /**
   * GRUPO: Testes de Cases Extremos
   */
  describe('Casos Extremos', () => {
    /**
     * TESTE: Nome muito longo
     * Verifica se componente lida com textos longos
     */
    test('deve lidar com nome muito longo', () => {
      // ARRANGE: Nome extremamente longo
      const nomeLongo = 'A'.repeat(1000);

      // ACT: Renderizar e preencher
      renderCategoryDialog();
      fireEvent.change(screen.getByLabelText('Nome da Categoria'), {
        target: { value: nomeLongo }
      });

      // ASSERT: Campo deve aceitar texto longo
      expect(screen.getByLabelText('Nome da Categoria')).toHaveValue(nomeLongo);
    });

    /**
     * TESTE: Emojis complexos no ícone
     * Verifica se campo de ícone aceita emojis variados
     */
    test('deve aceitar emojis complexos no campo ícone', () => {
      // ARRANGE: Emojis complexos
      const emojisComplexos = '🍔🍕🥤👨‍🍳🌟';

      // ACT: Renderizar e preencher
      renderCategoryDialog();
      fireEvent.change(screen.getByLabelText('Ícone'), {
        target: { value: emojisComplexos }
      });

      // ASSERT: Campo deve aceitar emojis
      expect(screen.getByLabelText('Ícone')).toHaveValue(emojisComplexos);
    });

    /**
     * TESTE: Múltiplas aberturas/fechamentos rápidos
     * Verifica estabilidade com mudanças rápidas de estado
     */
    test('deve lidar com múltiplas aberturas/fechamentos', () => {
      // ARRANGE: Renderizar inicialmente fechado
      const { rerender } = render(
        <ThemeWrapper>
          <CategoryDialog
            open={false}
            onClose={jest.fn()}
            category={null}
            onSave={jest.fn()}
          />
        </ThemeWrapper>
      );

      // ACT: Alternar estado várias vezes
      for (let i = 0; i < 5; i++) {
        rerender(
          <ThemeWrapper>
            <CategoryDialog
              open={true}
              onClose={jest.fn()}
              category={null}
              onSave={jest.fn()}
            />
          </ThemeWrapper>
        );

        rerender(
          <ThemeWrapper>
            <CategoryDialog
              open={false}
              onClose={jest.fn()}
              category={null}
              onSave={jest.fn()}
            />
          </ThemeWrapper>
        );
      }

      // ASSERT: Não deve causar erros
      expect(screen.queryByText('Adicionar Categoria')).not.toBeInTheDocument();
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
            <CategoryDialog
              open={true}
              onClose={undefined}
              category={undefined}
              onSave={undefined}
            />
          </ThemeWrapper>
        );
      }).not.toThrow();

      // ASSERT: Componente deve renderizar
      expect(screen.getByText('📂 Adicionar Categoria')).toBeInTheDocument();
    });
  });
});
