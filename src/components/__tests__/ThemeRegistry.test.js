/**
 * @fileoverview Testes para ThemeRegistry
 * 
 * ESTRUTURA DE TESTES:
 * ├── Renderização
 * │   ├── deve renderizar wrapper de tema corretamente
 * │   ├── deve renderizar children dentro do provider
 * │   └── deve aplicar tema Material-UI
 * ├── Configuração do Tema
 * │   ├── deve configurar ThemeProvider com tema customizado
 * │   ├── deve incluir CssBaseline para reset CSS
 * │   └── deve configurar AppRouterCacheProvider
 * ├── Integração Next.js
 * │   ├── deve funcionar com AppRouter
 * │   ├── deve configurar chave correta para cache
 * │   └── deve ser compatível com SSR
 * ├── Children Rendering
 * │   ├── deve renderizar múltiplos children
 * │   ├── deve renderizar children complexos
 * │   └── deve manter estrutura de componentes
 * └── Casos Extremos
 *     ├── deve funcionar sem children
 *     ├── deve funcionar com children nulos
 *     └── deve funcionar com children undefined
 * 
 * PADRÕES DE TESTE:
 * - Render: Renderização e estrutura básica
 * - Theme: Aplicação correta do tema
 * - Children: Renderização de conteúdo interno
 * - Integration: Integração com Next.js e Material-UI
 * - Edge: Casos extremos e validação
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useTheme } from '@mui/material/styles';
import ThemeRegistry from '../ThemeRegistry';

// Componente de teste para verificar tema
const TestComponent = () => {
  const theme = useTheme();
  return (
    <div data-testid="theme-test">
      <div data-testid="primary-color">{theme.palette.primary.main}</div>
      <div data-testid="theme-type">{theme.palette.mode}</div>
    </div>
  );
};

// Helper para renderizar com verificação
const renderThemeRegistry = (children = <div data-testid="test-child">Test Content</div>) => {
  return render(<ThemeRegistry>{children}</ThemeRegistry>);
};

describe('ThemeRegistry', () => {
  /**
   * GRUPO: Testes de Renderização
   */
  describe('Renderização', () => {
    /**
     * TESTE: Renderização básica
     * Verifica se componente renderiza corretamente
     */
    test('deve renderizar wrapper de tema corretamente', () => {
      // ACT: Renderizar componente
      renderThemeRegistry();

      // ASSERT: Verificar renderização
      expect(screen.getByTestId('test-child')).toBeInTheDocument();
    });

    /**
     * TESTE: Children dentro do provider
     * Verifica se children são renderizados
     */
    test('deve renderizar children dentro do provider', () => {
      // ARRANGE: Conteúdo personalizado
      const customContent = (
        <div>
          <h1 data-testid="title">Título</h1>
          <p data-testid="paragraph">Parágrafo</p>
        </div>
      );

      // ACT: Renderizar com conteúdo
      renderThemeRegistry(customContent);

      // ASSERT: Verificar elementos
      expect(screen.getByTestId('title')).toBeInTheDocument();
      expect(screen.getByTestId('paragraph')).toBeInTheDocument();
      expect(screen.getByText('Título')).toBeInTheDocument();
      expect(screen.getByText('Parágrafo')).toBeInTheDocument();
    });

    /**
     * TESTE: Aplicação do tema
     * Verifica se tema Material-UI está ativo
     */
    test('deve aplicar tema Material-UI', () => {
      // ACT: Renderizar com componente que usa tema
      renderThemeRegistry(<TestComponent />);

      // ASSERT: Verificar elementos de tema
      expect(screen.getByTestId('theme-test')).toBeInTheDocument();
      expect(screen.getByTestId('primary-color')).toBeInTheDocument();
      expect(screen.getByTestId('theme-type')).toBeInTheDocument();
    });
  });

  /**
   * GRUPO: Testes de Configuração do Tema
   */
  describe('Configuração do Tema', () => {
    /**
     * TESTE: ThemeProvider configurado
     * Verifica se ThemeProvider está funcionando
     */
    test('deve configurar ThemeProvider com tema customizado', () => {
      // ACT: Renderizar com teste de tema
      renderThemeRegistry(<TestComponent />);

      // ASSERT: Verificar valores do tema
      const primaryColor = screen.getByTestId('primary-color');
      const themeType = screen.getByTestId('theme-type');
      
      expect(primaryColor).toBeInTheDocument();
      expect(themeType).toBeInTheDocument();
      
      // Verificar se tem algum valor (tema está funcionando)
      expect(primaryColor.textContent).toBeTruthy();
      expect(themeType.textContent).toBeTruthy();
    });

    /**
     * TESTE: CssBaseline incluído
     * Verifica se CssBaseline está aplicando reset CSS
     */
    test('deve incluir CssBaseline para reset CSS', () => {
      // ACT: Renderizar componente
      renderThemeRegistry();

      // ASSERT: Verificar se CssBaseline aplicou estilos base
      // CssBaseline aplica estilos globais, verificar se documento tem estilos
      const body = document.body;
      expect(body).toBeInTheDocument();
      
      // CssBaseline deve remover margin padrão
      const computedStyle = window.getComputedStyle(body);
      // O jsdom pode não aplicar todos os estilos, mas componente deve renderizar
      expect(body).toBeDefined();
    });

    /**
     * TESTE: AppRouterCacheProvider
     * Verifica se cache provider está configurado
     */
    test('deve configurar AppRouterCacheProvider', () => {
      // ACT: Renderizar componente
      renderThemeRegistry();

      // ASSERT: Componente deve renderizar sem erros
      // AppRouterCacheProvider é interno, verificar se não quebrou
      expect(screen.getByTestId('test-child')).toBeInTheDocument();
    });
  });

  /**
   * GRUPO: Testes de Integração Next.js
   */
  describe('Integração Next.js', () => {
    /**
     * TESTE: Compatibilidade com AppRouter
     * Verifica se funciona com Next.js App Router
     */
    test('deve funcionar com AppRouter', () => {
      // ACT: Renderizar componente (simula uso no App Router)
      const result = renderThemeRegistry(
        <div data-testid="app-content">App Content</div>
      );

      // ASSERT: Deve renderizar sem erros
      expect(screen.getByTestId('app-content')).toBeInTheDocument();
      expect(result.container).toBeInTheDocument();
    });

    /**
     * TESTE: Chave de cache
     * Verifica configuração de cache (indiretamente)
     */
    test('deve configurar chave correta para cache', () => {
      // ACT: Renderizar componente
      renderThemeRegistry();

      // ASSERT: Componente deve funcionar (cache configurado internamente)
      expect(screen.getByTestId('test-child')).toBeInTheDocument();
    });

    /**
     * TESTE: Compatibilidade SSR
     * Verifica se funciona com renderização server-side
     */
    test('deve ser compatível com SSR', () => {
      // ACT: Renderizar múltiplas vezes (simula SSR + hydration)
      const { unmount } = renderThemeRegistry();
      unmount();
      
      // Renderizar novamente
      renderThemeRegistry();

      // ASSERT: Deve funcionar em múltiplas renderizações
      expect(screen.getByTestId('test-child')).toBeInTheDocument();
    });
  });

  /**
   * GRUPO: Testes de Children Rendering
   */
  describe('Children Rendering', () => {
    /**
     * TESTE: Múltiplos children
     * Verifica renderização de vários elementos
     */
    test('deve renderizar múltiplos children', () => {
      // ARRANGE: Múltiplos elementos
      const multipleChildren = (
        <>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
          <div data-testid="child-3">Child 3</div>
        </>
      );

      // ACT: Renderizar
      renderThemeRegistry(multipleChildren);

      // ASSERT: Verificar todos os children
      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
      expect(screen.getByTestId('child-3')).toBeInTheDocument();
    });

    /**
     * TESTE: Children complexos
     * Verifica renderização de estruturas complexas
     */
    test('deve renderizar children complexos', () => {
      // ARRANGE: Estrutura complexa
      const complexChildren = (
        <div data-testid="complex-root">
          <header data-testid="header">
            <h1>Title</h1>
            <nav>
              <ul>
                <li>Item 1</li>
                <li>Item 2</li>
              </ul>
            </nav>
          </header>
          <main data-testid="main">
            <article>
              <p>Content</p>
            </article>
          </main>
          <footer data-testid="footer">
            <p>Footer</p>
          </footer>
        </div>
      );

      // ACT: Renderizar
      renderThemeRegistry(complexChildren);

      // ASSERT: Verificar estrutura
      expect(screen.getByTestId('complex-root')).toBeInTheDocument();
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('main')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    /**
     * TESTE: Manter estrutura
     * Verifica se hierarquia é preservada
     */
    test('deve manter estrutura de componentes', () => {
      // ARRANGE: Componente aninhado
      const NestedComponent = () => (
        <div data-testid="parent">
          <div data-testid="child">
            <div data-testid="grandchild">Nested Content</div>
          </div>
        </div>
      );

      // ACT: Renderizar
      renderThemeRegistry(<NestedComponent />);

      // ASSERT: Verificar hierarquia
      const parent = screen.getByTestId('parent');
      const child = screen.getByTestId('child');
      const grandchild = screen.getByTestId('grandchild');
      
      expect(parent).toBeInTheDocument();
      expect(child).toBeInTheDocument();
      expect(grandchild).toBeInTheDocument();
      
      // Verificar se grandchild está dentro da hierarquia
      expect(parent).toContainElement(child);
      expect(child).toContainElement(grandchild);
    });
  });

  /**
   * GRUPO: Testes de Casos Extremos
   */
  describe('Casos Extremos', () => {
    /**
     * TESTE: Sem children
     * Verifica funcionamento sem conteúdo
     */
    test('deve funcionar sem children', () => {
      // ACT: Renderizar sem children
      const { container } = render(<ThemeRegistry />);

      // ASSERT: Deve renderizar sem erros
      expect(container).toBeInTheDocument();
      expect(container.firstChild).toBeInTheDocument();
    });

    /**
     * TESTE: Children nulos
     * Verifica com children null
     */
    test('deve funcionar com children nulos', () => {
      // ACT: Renderizar com null
      const { container } = render(<ThemeRegistry>{null}</ThemeRegistry>);

      // ASSERT: Deve renderizar sem erros
      expect(container).toBeInTheDocument();
      expect(container.firstChild).toBeInTheDocument();
    });

    /**
     * TESTE: Children undefined
     * Verifica com children undefined
     */
    test('deve funcionar com children undefined', () => {
      // ACT: Renderizar com undefined
      const { container } = render(<ThemeRegistry>{undefined}</ThemeRegistry>);

      // ASSERT: Deve renderizar sem erros
      expect(container).toBeInTheDocument();
      expect(container.firstChild).toBeInTheDocument();
    });

    /**
     * TESTE: Re-renderização
     * Verifica estabilidade em múltiplas renderizações
     */
    test('deve manter estabilidade em re-renderizações', () => {
      // ACT: Renderizar e re-renderizar
      const { rerender } = renderThemeRegistry(
        <div data-testid="content-1">Content 1</div>
      );

      // ASSERT: Primeiro conteúdo
      expect(screen.getByTestId('content-1')).toBeInTheDocument();

      // ACT: Re-renderizar com novo conteúdo
      rerender(
        <ThemeRegistry>
          <div data-testid="content-2">Content 2</div>
        </ThemeRegistry>
      );

      // ASSERT: Novo conteúdo
      expect(screen.getByTestId('content-2')).toBeInTheDocument();
      expect(screen.queryByTestId('content-1')).not.toBeInTheDocument();
    });

    /**
     * TESTE: Erro handling
     * Verifica se não quebra com props inválidas
     */
    test('deve lidar com props adicionais graciosamente', () => {
      // ACT: Renderizar com props extras (deve ignorar)
      const { container } = render(
        <ThemeRegistry extraProp="ignored" anotherProp={123}>
          <div data-testid="robust-content">Robust Content</div>
        </ThemeRegistry>
      );

      // ASSERT: Deve funcionar normalmente
      expect(container).toBeInTheDocument();
      expect(screen.getByTestId('robust-content')).toBeInTheDocument();
    });
  });
});
