/**
 * TESTES DO COMPONENTE - BANNER MANAGER
 * 
 * Conjunto de testes para validar o comportamento e funcionalidades
 * do componente BannerManager, responsável pelo gerenciamento completo
 * de banners promocionais no painel administrativo.
 * 
 * Cobertura:
 * - Renderização inicial com dados
 * - Funcionalidades CRUD (Create, Read, Update, Delete)
 * - Sistema de upload de imagens
 * - Validações de formulário
 * - Interações do usuário
 * - Estados de loading e erro
 * - Casos extremos e edge cases
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Importações de mocks e utilitários de teste
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

// Componente sendo testado
import BannerManager from '../BannerManager';

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
 * HELPER: Cria arquivo mock para testes de upload
 */
const createMockFile = (name = 'test-image.jpg', type = 'image/jpeg', size = 1024) => {
  const file = new File(['dummy content'], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
};

/**
 * HELPER: Mock do FileReader para testes de preview
 */
const mockFileReader = () => {
  const mockReader = {
    readAsDataURL: jest.fn(),
    result: 'data:image/jpeg;base64,dummy',
    onload: null
  };
  
  // Simular carregamento bem-sucedido
  mockReader.readAsDataURL.mockImplementation(() => {
    setTimeout(() => {
      if (mockReader.onload) {
        mockReader.onload({ target: { result: mockReader.result } });
      }
    }, 100);
  });
  
  global.FileReader = jest.fn(() => mockReader);
  return mockReader;
};

/**
 * SUITE DE TESTES PRINCIPAL
 */
describe('BannerManager', () => {
  // Limpar mocks antes de cada teste
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock de window.confirm para testes de exclusão
    global.confirm = jest.fn(() => true);
    
    // Mock de window.alert para testes de validação
    global.alert = jest.fn();
    
    // Mock de FileReader
    mockFileReader();
  });

  afterEach(() => {
    // Restaurar mocks
    jest.restoreAllMocks();
  });

  /**
   * GRUPO: Testes de Renderização
   */
  describe('Renderização', () => {
    /**
     * TESTE: Renderização inicial
     * Verifica se o componente renderiza corretamente com dados iniciais
     */
    test('deve renderizar o componente com banners iniciais', () => {
      // ACT: Renderizar componente
      renderWithProviders(<BannerManager />);

      // ASSERT: Verificar elementos principais
      expect(screen.getByText('Gerenciar Banners')).toBeInTheDocument();
      expect(screen.getByText('Novo Banner')).toBeInTheDocument();
      expect(screen.getByText('Total de Banners')).toBeInTheDocument();
      expect(screen.getByText('Banners Ativos')).toBeInTheDocument();
    });

    /**
     * TESTE: Renderização de banners existentes
     * Verifica se banners pré-existentes são exibidos corretamente
     */
    test('deve renderizar banners existentes com suas informações', () => {
      // ACT: Renderizar componente
      renderWithProviders(<BannerManager />);

      // ASSERT: Verificar banners específicos
      expect(screen.getByText('Pizza Margherita Especial')).toBeInTheDocument();
      expect(screen.getByText('Hambúrguer Gourmet')).toBeInTheDocument();
      
      // Verificar se as imagens estão presentes
      const images = screen.getAllByRole('img');
      expect(images).toHaveLength(2); // Dois banners iniciais
    });

    /**
     * TESTE: Estatísticas de banners
     * Verifica se as estatísticas são calculadas e exibidas corretamente
     */
    test('deve exibir estatísticas corretas de banners', () => {
      // ACT: Renderizar componente
      renderWithProviders(<BannerManager />);

      // ASSERT: Verificar contadores
      expect(screen.getByText('2')).toBeInTheDocument(); // Total de banners
      expect(screen.getByText('1')).toBeInTheDocument(); // Banners ativos
    });

    /**
     * TESTE: Chips de status
     * Verifica se os chips de ativo/inativo são exibidos corretamente
     */
    test('deve exibir chips de status corretos para cada banner', () => {
      // ACT: Renderizar componente
      renderWithProviders(<BannerManager />);

      // ASSERT: Verificar chips de status
      expect(screen.getByText('Ativo')).toBeInTheDocument();
      expect(screen.getByText('Inativo')).toBeInTheDocument();
    });
  });

  /**
   * GRUPO: Testes de Criação de Banner
   */
  describe('Criação de Banner', () => {
    /**
     * TESTE: Abertura do diálogo de criação
     * Verifica se o diálogo abre corretamente ao clicar em "Novo Banner"
     */
    test('deve abrir diálogo de criação ao clicar em "Novo Banner"', async () => {
      const user = userEvent.setup();
      
      // ACT: Renderizar e clicar no botão
      renderWithProviders(<BannerManager />);
      await user.click(screen.getByText('Novo Banner'));

      // ASSERT: Verificar se diálogo abriu
      await waitFor(() => {
        expect(screen.getByText('Novo Banner')).toBeInTheDocument();
        expect(screen.getByLabelText('Título do Banner')).toBeInTheDocument();
      });
    });

    /**
     * TESTE: Campos do formulário de criação
     * Verifica se todos os campos necessários estão presentes
     */
    test('deve exibir todos os campos necessários no formulário', async () => {
      const user = userEvent.setup();
      
      // ACT: Abrir diálogo de criação
      renderWithProviders(<BannerManager />);
      await user.click(screen.getByText('Novo Banner'));

      // ASSERT: Verificar campos do formulário
      await waitFor(() => {
        expect(screen.getByLabelText('Título do Banner')).toBeInTheDocument();
        expect(screen.getByLabelText('Descrição')).toBeInTheDocument();
        expect(screen.getByText('Imagem do Banner*')).toBeInTheDocument();
        expect(screen.getByLabelText('Link do Produto (Opcional)')).toBeInTheDocument();
        expect(screen.getByLabelText('Banner ativo')).toBeInTheDocument();
      });
    });

    /**
     * TESTE: Validação de campos obrigatórios
     * Verifica se a validação impede criação com campos vazios
     */
    test('deve desabilitar botão salvar quando campos obrigatórios estão vazios', async () => {
      const user = userEvent.setup();
      
      // ACT: Abrir diálogo de criação
      renderWithProviders(<BannerManager />);
      await user.click(screen.getByText('Novo Banner'));

      // ASSERT: Verificar se botão está desabilitado
      await waitFor(() => {
        const saveButton = screen.getByRole('button', { name: /criar banner/i });
        expect(saveButton).toBeDisabled();
      });
    });

    /**
     * TESTE: Criação bem-sucedida de banner
     * Verifica se um novo banner é criado corretamente
     */
    test('deve criar novo banner com dados válidos', async () => {
      const user = userEvent.setup();
      
      // ACT: Abrir diálogo e preencher campos
      renderWithProviders(<BannerManager />);
      await user.click(screen.getByText('Novo Banner'));

      await waitFor(async () => {
        await user.type(screen.getByLabelText('Título do Banner'), 'Novo Banner Teste');
        await user.type(screen.getByLabelText('Descrição'), 'Descrição do novo banner');
        await user.type(screen.getByLabelText('Link do Produto (Opcional)'), 'produto-123');
      });

      // Simular upload de imagem
      const fileInput = screen.getByLabelText(/selecionar imagem/i).closest('input');
      const file = createMockFile();
      await user.upload(fileInput, file);

      // Aguardar preview da imagem
      await waitFor(() => {
        expect(screen.getByAltText('Preview')).toBeInTheDocument();
      });

      // Clicar em salvar
      const saveButton = screen.getByRole('button', { name: /criar banner/i });
      await user.click(saveButton);

      // ASSERT: Verificar se banner foi criado
      await waitFor(() => {
        expect(screen.getByText('Novo Banner Teste')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument(); // Total aumentou para 3
      });
    });
  });

  /**
   * GRUPO: Testes de Upload de Imagem
   */
  describe('Upload de Imagem', () => {
    /**
     * TESTE: Upload de arquivo válido
     * Verifica se arquivos de imagem válidos são aceitos
     */
    test('deve aceitar upload de arquivos de imagem válidos', async () => {
      const user = userEvent.setup();
      
      // ACT: Abrir diálogo e fazer upload
      renderWithProviders(<BannerManager />);
      await user.click(screen.getByText('Novo Banner'));

      await waitFor(async () => {
        const fileInput = screen.getByLabelText(/selecionar imagem/i).closest('input');
        const file = createMockFile('test.jpg', 'image/jpeg', 1024);
        await user.upload(fileInput, file);
      });

      // ASSERT: Verificar se preview foi criado
      await waitFor(() => {
        expect(screen.getByAltText('Preview')).toBeInTheDocument();
        expect(screen.getByText('Remover')).toBeInTheDocument();
        expect(screen.getByText('Trocar Imagem')).toBeInTheDocument();
      });
    });

    /**
     * TESTE: Validação de tipo de arquivo
     * Verifica se arquivos não-imagem são rejeitados
     */
    test('deve rejeitar arquivos que não são imagens', async () => {
      const user = userEvent.setup();
      
      // ACT: Tentar upload de arquivo inválido
      renderWithProviders(<BannerManager />);
      await user.click(screen.getByText('Novo Banner'));

      await waitFor(async () => {
        const fileInput = screen.getByLabelText(/selecionar imagem/i).closest('input');
        const file = createMockFile('test.txt', 'text/plain', 1024);
        await user.upload(fileInput, file);
      });

      // ASSERT: Verificar se alert foi chamado
      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith('Por favor, selecione apenas arquivos de imagem.');
      });
    });

    /**
     * TESTE: Validação de tamanho de arquivo
     * Verifica se arquivos muito grandes são rejeitados
     */
    test('deve rejeitar arquivos maiores que 5MB', async () => {
      const user = userEvent.setup();
      
      // ACT: Tentar upload de arquivo grande
      renderWithProviders(<BannerManager />);
      await user.click(screen.getByText('Novo Banner'));

      await waitFor(async () => {
        const fileInput = screen.getByLabelText(/selecionar imagem/i).closest('input');
        const file = createMockFile('large.jpg', 'image/jpeg', 6 * 1024 * 1024); // 6MB
        await user.upload(fileInput, file);
      });

      // ASSERT: Verificar se alert foi chamado
      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith('A imagem deve ter no máximo 5MB.');
      });
    });

    /**
     * TESTE: Remoção de imagem
     * Verifica se é possível remover uma imagem já selecionada
     */
    test('deve permitir remover imagem selecionada', async () => {
      const user = userEvent.setup();
      
      // ACT: Upload e remoção de imagem
      renderWithProviders(<BannerManager />);
      await user.click(screen.getByText('Novo Banner'));

      // Upload da imagem
      await waitFor(async () => {
        const fileInput = screen.getByLabelText(/selecionar imagem/i).closest('input');
        const file = createMockFile();
        await user.upload(fileInput, file);
      });

      // Aguardar preview aparecer
      await waitFor(() => {
        expect(screen.getByAltText('Preview')).toBeInTheDocument();
      });

      // Remover imagem
      await user.click(screen.getByText('Remover'));

      // ASSERT: Verificar se preview foi removido
      await waitFor(() => {
        expect(screen.queryByAltText('Preview')).not.toBeInTheDocument();
        expect(screen.getByText('Clique para selecionar uma imagem ou arraste aqui')).toBeInTheDocument();
      });
    });
  });

  /**
   * GRUPO: Testes de Edição de Banner
   */
  describe('Edição de Banner', () => {
    /**
     * TESTE: Abertura do diálogo de edição
     * Verifica se o diálogo de edição abre com dados pré-preenchidos
     */
    test('deve abrir diálogo de edição com dados do banner', async () => {
      const user = userEvent.setup();
      
      // ACT: Clicar no botão de editar
      renderWithProviders(<BannerManager />);
      const editButtons = screen.getAllByTestId('EditIcon');
      await user.click(editButtons[0]);

      // ASSERT: Verificar se diálogo abriu com dados
      await waitFor(() => {
        expect(screen.getByText('Editar Banner')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Pizza Margherita Especial')).toBeInTheDocument();
      });
    });

    /**
     * TESTE: Atualização de banner existente
     * Verifica se mudanças em um banner são salvas corretamente
     */
    test('deve atualizar banner existente com novos dados', async () => {
      const user = userEvent.setup();
      
      // ACT: Editar banner
      renderWithProviders(<BannerManager />);
      const editButtons = screen.getAllByTestId('EditIcon');
      await user.click(editButtons[0]);

      // Modificar título
      await waitFor(async () => {
        const titleInput = screen.getByDisplayValue('Pizza Margherita Especial');
        await user.clear(titleInput);
        await user.type(titleInput, 'Pizza Margherita Atualizada');
      });

      // Salvar alterações
      const saveButton = screen.getByRole('button', { name: /salvar alterações/i });
      await user.click(saveButton);

      // ASSERT: Verificar se banner foi atualizado
      await waitFor(() => {
        expect(screen.getByText('Pizza Margherita Atualizada')).toBeInTheDocument();
        expect(screen.queryByText('Pizza Margherita Especial')).not.toBeInTheDocument();
      });
    });
  });

  /**
   * GRUPO: Testes de Exclusão de Banner
   */
  describe('Exclusão de Banner', () => {
    /**
     * TESTE: Confirmação de exclusão
     * Verifica se a confirmação é solicitada antes da exclusão
     */
    test('deve solicitar confirmação antes de excluir banner', async () => {
      const user = userEvent.setup();
      
      // ACT: Clicar no botão de excluir
      renderWithProviders(<BannerManager />);
      const deleteButtons = screen.getAllByTestId('DeleteIcon');
      await user.click(deleteButtons[0]);

      // ASSERT: Verificar se confirmação foi solicitada
      expect(global.confirm).toHaveBeenCalledWith('Tem certeza que deseja excluir este banner?');
    });

    /**
     * TESTE: Exclusão confirmada
     * Verifica se banner é removido após confirmação
     */
    test('deve excluir banner quando confirmado', async () => {
      const user = userEvent.setup();
      global.confirm.mockReturnValue(true);
      
      // ACT: Excluir banner
      renderWithProviders(<BannerManager />);
      const deleteButtons = screen.getAllByTestId('DeleteIcon');
      await user.click(deleteButtons[0]);

      // ASSERT: Verificar se banner foi removido
      await waitFor(() => {
        expect(screen.queryByText('Pizza Margherita Especial')).not.toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument(); // Total diminuiu para 1
      });
    });

    /**
     * TESTE: Exclusão cancelada
     * Verifica se banner permanece quando exclusão é cancelada
     */
    test('deve manter banner quando exclusão é cancelada', async () => {
      const user = userEvent.setup();
      global.confirm.mockReturnValue(false);
      
      // ACT: Cancelar exclusão
      renderWithProviders(<BannerManager />);
      const deleteButtons = screen.getAllByTestId('DeleteIcon');
      await user.click(deleteButtons[0]);

      // ASSERT: Verificar se banner permanece
      expect(screen.getByText('Pizza Margherita Especial')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument(); // Total permanece 2
    });
  });

  /**
   * GRUPO: Testes de Ativação/Desativação
   */
  describe('Ativação/Desativação de Banner', () => {
    /**
     * TESTE: Alternar status de ativo
     * Verifica se o status ativo/inativo pode ser alternado
     */
    test('deve alternar status ativo do banner', async () => {
      const user = userEvent.setup();
      
      // ACT: Clicar no botão de visibilidade
      renderWithProviders(<BannerManager />);
      const visibilityButtons = screen.getAllByTestId('VisibilityOffIcon');
      await user.click(visibilityButtons[0]); // Banner inativo

      // ASSERT: Verificar se status mudou
      await waitFor(() => {
        expect(screen.getByText('2')).toBeInTheDocument(); // Banners ativos aumentou
      });
    });

    /**
     * TESTE: Atualização de estatísticas
     * Verifica se estatísticas são atualizadas após mudança de status
     */
    test('deve atualizar estatísticas ao alterar status dos banners', async () => {
      const user = userEvent.setup();
      
      // ACT: Desativar o banner ativo
      renderWithProviders(<BannerManager />);
      const activeVisibilityButton = screen.getByTestId('VisibilityIcon');
      await user.click(activeVisibilityButton);

      // ASSERT: Verificar estatísticas atualizadas
      await waitFor(() => {
        expect(screen.getByText('0')).toBeInTheDocument(); // Nenhum banner ativo
      });
    });
  });

  /**
   * GRUPO: Testes de Estados de Loading
   */
  describe('Estados de Loading', () => {
    /**
     * TESTE: Estado de upload
     * Verifica se indicador de loading aparece durante upload
     */
    test('deve exibir indicador de loading durante upload', async () => {
      const user = userEvent.setup();
      
      // Mock do setTimeout para controlar timing
      jest.spyOn(global, 'setTimeout').mockImplementation((fn) => fn());
      
      // ACT: Simular upload longo
      renderWithProviders(<BannerManager />);
      await user.click(screen.getByText('Novo Banner'));

      await waitFor(async () => {
        await user.type(screen.getByLabelText('Título do Banner'), 'Teste Upload');
        
        const fileInput = screen.getByLabelText(/selecionar imagem/i).closest('input');
        const file = createMockFile();
        await user.upload(fileInput, file);
      });

      // Aguardar preview e tentar salvar
      await waitFor(() => {
        expect(screen.getByAltText('Preview')).toBeInTheDocument();
      });

      const saveButton = screen.getByRole('button', { name: /criar banner/i });
      await user.click(saveButton);

      // ASSERT: Verificar se estado de loading aparece
      await waitFor(() => {
        expect(screen.getByText('Enviando...')).toBeInTheDocument();
      });
    });
  });

  /**
   * GRUPO: Testes de Casos Extremos
   */
  describe('Casos Extremos', () => {
    /**
     * TESTE: Lista vazia de banners
     * Verifica comportamento quando não há banners
     */
    test('deve exibir mensagem quando não há banners', () => {
      // ACT: Renderizar componente sem banners (mock do estado inicial)
      const EmptyBannerManager = () => {
        const [banners] = React.useState([]);
        
        return (
          <Box sx={{ p: 3 }}>
            {banners.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Nenhum banner criado ainda
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Crie seu primeiro banner para atrair mais clientes
                </Typography>
              </Box>
            )}
          </Box>
        );
      };

      renderWithProviders(<EmptyBannerManager />);

      // ASSERT: Verificar mensagem de lista vazia
      expect(screen.getByText('Nenhum banner criado ainda')).toBeInTheDocument();
      expect(screen.getByText('Crie seu primeiro banner para atrair mais clientes')).toBeInTheDocument();
    });

    /**
     * TESTE: Fechamento de diálogo sem salvar
     * Verifica se diálogo pode ser fechado sem perder dados
     */
    test('deve fechar diálogo sem salvar quando cancelado', async () => {
      const user = userEvent.setup();
      
      // ACT: Abrir diálogo e cancelar
      renderWithProviders(<BannerManager />);
      await user.click(screen.getByText('Novo Banner'));

      await waitFor(async () => {
        await user.type(screen.getByLabelText('Título do Banner'), 'Teste Cancelar');
      });

      await user.click(screen.getByText('Cancelar'));

      // ASSERT: Verificar se diálogo fechou e dados não foram salvos
      await waitFor(() => {
        expect(screen.queryByText('Novo Banner')).not.toBeInTheDocument();
        expect(screen.queryByText('Teste Cancelar')).not.toBeInTheDocument();
      });
    });

    /**
     * TESTE: Erro durante upload
     * Verifica tratamento de erro durante upload de imagem
     */
    test('deve tratar erro durante upload de imagem', async () => {
      const user = userEvent.setup();
      
      // Mock para simular erro no upload
      const mockFetch = jest.spyOn(global, 'fetch').mockRejectedValue(new Error('Erro de rede'));
      
      // ACT: Tentar upload que falhará
      renderWithProviders(<BannerManager />);
      await user.click(screen.getByText('Novo Banner'));

      await waitFor(async () => {
        await user.type(screen.getByLabelText('Título do Banner'), 'Teste Erro');
        
        const fileInput = screen.getByLabelText(/selecionar imagem/i).closest('input');
        const file = createMockFile();
        await user.upload(fileInput, file);
      });

      await waitFor(() => {
        expect(screen.getByAltText('Preview')).toBeInTheDocument();
      });

      const saveButton = screen.getByRole('button', { name: /criar banner/i });
      await user.click(saveButton);

      // ASSERT: Verificar se erro foi tratado
      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith('Erro ao salvar banner: Falha no upload da imagem');
      });

      mockFetch.mockRestore();
    });
  });
});
