# 📋 Padrões de Codificação - Cardápio Frontend

## 🎯 Diretrizes Gerais

A partir de agora, todo código deve seguir essas diretrizes para garantir **modularidade**, **manutenibilidade** e **fácil compreensão**.

---

## 🔧 Arquitetura Modular

### 📁 Organização de Arquivos
```
src/
├── components/           # Componentes reutilizáveis
│   ├── admin/           # Seção administrativa
│   │   ├── sections/    # Seções principais (Dashboard, Products, etc.)
│   │   ├── dialogs/     # Modais e diálogos
│   │   └── components/  # Componentes específicos do admin
│   ├── menu/            # Interface do cardápio
│   └── ui/              # Componentes base de UI
├── hooks/               # Hooks customizados
├── utils/               # Funções utilitárias
├── context/             # Contextos React
└── lib/                 # Bibliotecas e configurações
```

### 🎯 Princípios de Modularidade

#### ✅ **Componentes Pequenos e Focados**
- Cada componente deve ter **uma responsabilidade específica**
- Máximo de 200-300 linhas por arquivo
- Se crescer muito, **quebrar em sub-componentes**

#### ✅ **Hooks Customizados**
- Separar **lógica de negócio** da apresentação
- Nomenclatura: `use + Funcionalidade` (ex: `useCategoryManager`)
- Retornar objetos com funções e estados organizados

#### ✅ **Utilitários Isolados**
- Funções auxiliares em arquivos dedicados
- Funções puras sempre que possível
- Testes unitários para funções críticas

---

## 📝 Documentação de Código

### 🎨 **Headers de Arquivo**
```javascript
/**
 * NOME DO COMPONENTE - DESCRIÇÃO BREVE
 * 
 * Descrição detalhada do propósito e funcionalidades.
 * 
 * Funcionalidades:
 * - Funcionalidade 1
 * - Funcionalidade 2
 * - Funcionalidade 3
 */
```

### 📖 **JSDoc para Funções**
```javascript
/**
 * FUNÇÃO PRINCIPAL - DESCRIÇÃO
 * 
 * @param {Object} props - Propriedades do componente
 * @param {Array} props.data - Dados para processamento
 * @param {Function} props.onAction - Callback de ação
 * @returns {JSX.Element} Elemento React renderizado
 */
```

### 💬 **Comentários de Seção**
```javascript
{/* SEÇÃO PRINCIPAL */}
{/* Descrição do que esta seção faz */}

{/* Container dos controles de ação */}
<Box>
  {/* Campo de busca em tempo real */}
  <TextField />
  
  {/* Botão de ação primária */}
  <Button />
</Box>
```

### 🔤 **Comentários de Linha**
```javascript
// Filtragem de dados baseada no termo de busca
const filteredData = filterFunction(data, searchTerm);

// Hook personalizado para gerenciar estado
const manager = useCustomManager({
  data,
  setData
});
```

---

## 🎯 Padrões de Qualidade

### 🏷️ **Nomenclatura**
- **Componentes**: PascalCase (`ProductCard`, `CategoryManager`)
- **Hooks**: camelCase com prefixo `use` (`useProductHandlers`)
- **Funções**: camelCase descritivo (`handleSaveCategory`)
- **Variáveis**: camelCase (`filteredProducts`, `isLoading`)
- **Constantes**: UPPER_SNAKE_CASE (`API_BASE_URL`)

### 🎨 **Importações Organizadas**
```javascript
// Importações do React
import React, { useState, useEffect } from 'react';

// Importações de bibliotecas externas
import { Box, Typography, Button } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';

// Importações de utilitários e componentes locais
import { filterData } from '../../../utils/helpers';
import CustomComponent from '../components/CustomComponent';
import { useCustomHook } from '../../../hooks/useCustomHook';
```

### 🔄 **Separação de Responsabilidades**

#### 📊 **Camada de Dados (Hooks)**
```javascript
// hooks/useProductManager.js
export const useProductManager = ({ products, setProducts }) => {
  // Lógica de negócio
  // Manipulação de estado
  // Chamadas API
  
  return {
    // Estados
    // Funções de ação
    // Dados processados
  };
};
```

#### 🎨 **Camada de Apresentação (Componentes)**
```javascript
// components/ProductList.js
const ProductList = ({ products, onEdit, onDelete }) => {
  // Apenas renderização
  // Mínima lógica de UI
  // Delegação para hooks
  
  return (
    // JSX estruturado e comentado
  );
};
```

#### 🛠️ **Camada de Utilitários**
```javascript
// utils/productHelpers.js
/**
 * Filtra produtos baseado em critérios de busca
 */
export const filterProducts = (products, searchTerm) => {
  // Implementação da filtragem
};

/**
 * Formata preço para exibição
 */
export const formatPrice = (price) => {
  // Implementação da formatação
};
```

---

## 🚀 Exemplos Práticos

### 📝 **Exemplo: Componente Bem Estruturado**
```javascript
/**
 * CARD DE PRODUTO - INTERFACE ADMINISTRATIVA
 * 
 * Componente responsável por exibir informações de um produto
 * com ações de edição e exclusão.
 */

const ProductCard = ({ product, onEdit, onDelete }) => {
  return (
    <Card>
      {/* IMAGEM DO PRODUTO */}
      <CardMedia
        component="img"
        image={product.imageUrl || '/placeholder.jpg'}
        alt={product.name}
      />
      
      {/* INFORMAÇÕES PRINCIPAIS */}
      <CardContent>
        {/* Nome do produto */}
        <Typography variant="h6">
          {product.name}
        </Typography>
        
        {/* Preço formatado */}
        <Typography variant="h6" color="success.main">
          {formatPrice(product.price)}
        </Typography>
      </CardContent>
      
      {/* AÇÕES DISPONÍVEIS */}
      <CardActions>
        {/* Botão de edição */}
        <Button onClick={() => onEdit(product)}>
          Editar
        </Button>
        
        {/* Botão de exclusão */}
        <Button color="error" onClick={() => onDelete(product.id)}>
          Excluir
        </Button>
      </CardActions>
    </Card>
  );
};

// Exportação padrão para uso em outros módulos
export default ProductCard;
```

### 🎣 **Exemplo: Hook Customizado**
```javascript
/**
 * HOOK PARA GERENCIAMENTO DE PRODUTOS
 * 
 * Centraliza toda lógica relacionada a operações CRUD de produtos.
 * Mantém estado sincronizado e fornece funções de ação.
 */

export const useProductManager = ({ initialProducts = [] }) => {
  // Estados locais
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Adiciona novo produto à lista
   */
  const handleAddProduct = useCallback(async (productData) => {
    setLoading(true);
    try {
      // Lógica de criação
      const newProduct = await createProduct(productData);
      setProducts(prev => [...prev, newProduct]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Atualiza produto existente
   */
  const handleUpdateProduct = useCallback(async (id, updates) => {
    setLoading(true);
    try {
      // Lógica de atualização
      const updatedProduct = await updateProduct(id, updates);
      setProducts(prev => 
        prev.map(p => p.id === id ? updatedProduct : p)
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Retorna interface pública do hook
  return {
    // Estados
    products,
    loading,
    error,
    
    // Ações
    handleAddProduct,
    handleUpdateProduct,
    
    // Utilitários
    clearError: () => setError(null)
  };
};
```

---

## ✅ Checklist de Qualidade

Antes de criar ou modificar código, verificar:

### 🔍 **Estrutura**
- [ ] Componente tem responsabilidade única?
- [ ] Arquivo tem menos de 300 linhas?
- [ ] Imports estão organizados?
- [ ] Nomes são descritivos?

### 📝 **Documentação**
- [ ] Header explicativo presente?
- [ ] JSDoc em funções principais?
- [ ] Comentários de seção importantes?
- [ ] Comentários explicam o "porquê", não o "como"?

### 🎯 **Funcionalidade**
- [ ] Lógica de negócio está em hooks?
- [ ] Componente apenas renderiza?
- [ ] Funções utilitárias são reutilizáveis?
- [ ] Props são bem definidas?

### 🧪 **Testabilidade**
- [ ] Componente é facilmente testável?
- [ ] Funções são puras quando possível?
- [ ] Dependências são injetadas?
- [ ] Estado é previsível?

---

## 🎨 Convenções de UI

### 🎨 **Material-UI**
- Usar sx prop para estilos customizados
- Manter consistência de cores e espaçamentos
- Utilizar variantes e sizes padrão quando possível

### 📱 **Responsividade**
- Sempre considerar layout mobile-first
- Usar Grid system do Material-UI
- Testar em diferentes breakpoints

### ♿ **Acessibilidade**
- alt text em imagens
- Labels em campos de formulário
- Contraste adequado de cores
- Navegação por teclado

---

## 🧪 Padrões de Testes

### 🎯 **Filosofia de Testes**

Os testes devem ser **modulares**, **legíveis** e **confiáveis**. Cada teste deve:
- **Descrever claramente** o que está sendo testado
- **Ser independente** de outros testes
- **Ter comentários explicativos** em português
- **Seguir o padrão AAA** (Arrange, Act, Assert)

---

### 📁 **Estrutura de Arquivos de Teste**

```
src/
├── components/
│   ├── admin/
│   │   ├── sections/
│   │   │   ├── ProductsSection.js
│   │   │   └── __tests__/
│   │   │       └── ProductsSection.test.js
│   │   └── dialogs/
│   │       ├── CategoryDialog.js
│   │       └── __tests__/
│   │           └── CategoryDialog.test.js
├── hooks/
│   ├── useProductManager.js
│   └── __tests__/
│       └── useProductManager.test.js
└── utils/
    ├── helpers.js
    └── __tests__/
        └── helpers.test.js
```

### 🏷️ **Nomenclatura de Testes**

- **Arquivos**: `NomeDoComponente.test.js`
- **Describe blocks**: Nome do componente/função sendo testada
- **Test cases**: Descrição em português do comportamento esperado

---

### 📝 **Template de Arquivo de Teste**

```javascript
/**
 * TESTES DO COMPONENTE - NOME DO COMPONENTE
 * 
 * Conjunto de testes para validar o comportamento e funcionalidades
 * do componente NomeDoComponente.
 * 
 * Cobertura:
 * - Renderização correta
 * - Interações do usuário
 * - Props e estados
 * - Casos extremos
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Importações de mocks e utilitários de teste
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Componente sendo testado
import NomeDoComponente from '../NomeDoComponente';

// Mock de dependências externas
jest.mock('../../../hooks/useCustomHook', () => ({
  useCustomHook: jest.fn()
}));

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
 * SUITE DE TESTES PRINCIPAL
 */
describe('NomeDoComponente', () => {
  // Props padrão para testes
  const defaultProps = {
    prop1: 'valor1',
    prop2: jest.fn(),
    prop3: []
  };

  // Limpar mocks antes de cada teste
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * GRUPO: Testes de Renderização
   */
  describe('Renderização', () => {
    test('deve renderizar o componente corretamente', () => {
      // ARRANGE: Preparar dados e mocks
      const props = { ...defaultProps };

      // ACT: Renderizar componente
      renderWithProviders(<NomeDoComponente {...props} />);

      // ASSERT: Verificar se elementos esperados estão presentes
      expect(screen.getByText('Texto Esperado')).toBeInTheDocument();
    });
  });

  /**
   * GRUPO: Testes de Interação
   */
  describe('Interações do Usuário', () => {
    test('deve chamar função ao clicar no botão', async () => {
      // ARRANGE: Preparar props com função mock
      const mockOnClick = jest.fn();
      const props = { ...defaultProps, onClick: mockOnClick };

      // ACT: Renderizar e interagir
      renderWithProviders(<NomeDoComponente {...props} />);
      const button = screen.getByRole('button', { name: /texto do botão/i });
      fireEvent.click(button);

      // ASSERT: Verificar se função foi chamada
      await waitFor(() => {
        expect(mockOnClick).toHaveBeenCalledTimes(1);
      });
    });
  });
});
```

---

### 🎯 **Tipos de Testes e Padrões**

#### 🎨 **1. Testes de Componentes**

```javascript
/**
 * EXEMPLO: Teste de Componente ProductCard
 */
describe('ProductCard', () => {
  /**
   * TESTE: Renderização básica
   * Verifica se o componente renderiza corretamente com props mínimas
   */
  test('deve renderizar informações básicas do produto', () => {
    // ARRANGE: Dados do produto de teste
    const produto = {
      id: 1,
      name: 'Pizza Margherita',
      price: 25.90,
      description: 'Pizza clássica italiana'
    };

    // ACT: Renderizar componente
    render(<ProductCard product={produto} />);

    // ASSERT: Verificar elementos renderizados
    expect(screen.getByText('Pizza Margherita')).toBeInTheDocument();
    expect(screen.getByText('R$ 25,90')).toBeInTheDocument();
    expect(screen.getByText('Pizza clássica italiana')).toBeInTheDocument();
  });

  /**
   * TESTE: Interação com botões
   * Verifica se callbacks são chamados corretamente
   */
  test('deve chamar onEdit quando botão editar é clicado', async () => {
    // ARRANGE: Mock das funções de callback
    const mockOnEdit = jest.fn();
    const produto = { id: 1, name: 'Teste' };

    // ACT: Renderizar e clicar
    render(<ProductCard product={produto} onEdit={mockOnEdit} />);
    fireEvent.click(screen.getByText('Editar'));

    // ASSERT: Verificar chamada da função
    await waitFor(() => {
      expect(mockOnEdit).toHaveBeenCalledWith(produto);
    });
  });

  /**
   * TESTE: Estado condicional
   * Verifica renderização baseada em condições
   */
  test('deve mostrar placeholder quando não há imagem', () => {
    // ARRANGE: Produto sem imagem
    const produto = { id: 1, name: 'Teste', imageUrl: null };

    // ACT: Renderizar
    render(<ProductCard product={produto} />);

    // ASSERT: Verificar imagem placeholder
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', '/placeholder-food.jpg');
  });
});
```

#### 🎣 **2. Testes de Hooks**

```javascript
/**
 * EXEMPLO: Teste de Hook useProductManager
 */
import { renderHook, act } from '@testing-library/react';

describe('useProductManager', () => {
  /**
   * TESTE: Estado inicial
   * Verifica se hook inicializa com valores corretos
   */
  test('deve inicializar com estado padrão', () => {
    // ACT: Renderizar hook
    const { result } = renderHook(() => useProductManager());

    // ASSERT: Verificar estado inicial
    expect(result.current.products).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  /**
   * TESTE: Adicionar produto
   * Verifica se função de adicionar funciona corretamente
   */
  test('deve adicionar novo produto à lista', async () => {
    // ARRANGE: Preparar hook
    const { result } = renderHook(() => useProductManager());
    const novoProduto = { name: 'Novo Produto', price: 10.00 };

    // ACT: Chamar função de adicionar
    await act(async () => {
      await result.current.handleAddProduct(novoProduto);
    });

    // ASSERT: Verificar se produto foi adicionado
    expect(result.current.products).toHaveLength(1);
    expect(result.current.products[0].name).toBe('Novo Produto');
  });

  /**
   * TESTE: Tratamento de erro
   * Verifica se erros são tratados adequadamente
   */
  test('deve capturar erro ao falhar adição de produto', async () => {
    // ARRANGE: Mock API que falha
    jest.spyOn(api, 'createProduct').mockRejectedValue(
      new Error('Erro de rede')
    );
    
    const { result } = renderHook(() => useProductManager());

    // ACT: Tentar adicionar produto
    await act(async () => {
      await result.current.handleAddProduct({});
    });

    // ASSERT: Verificar tratamento do erro
    expect(result.current.error).toBe('Erro de rede');
    expect(result.current.loading).toBe(false);
  });
});
```

#### 🛠️ **3. Testes de Utilitários**

```javascript
/**
 * EXEMPLO: Teste de Função Utilitária
 */
import { filterProducts, formatPrice } from '../helpers';

describe('Funções Utilitárias', () => {
  describe('filterProducts', () => {
    /**
     * TESTE: Filtragem por nome
     * Verifica se busca por nome funciona corretamente
     */
    test('deve filtrar produtos por nome', () => {
      // ARRANGE: Lista de produtos para teste
      const produtos = [
        { id: 1, name: 'Pizza Margherita', category: 'Pizza' },
        { id: 2, name: 'Hambúrguer Clássico', category: 'Hambúrguer' },
        { id: 3, name: 'Pizza Calabresa', category: 'Pizza' }
      ];

      // ACT: Aplicar filtro
      const resultado = filterProducts(produtos, 'pizza');

      // ASSERT: Verificar resultados filtrados
      expect(resultado).toHaveLength(2);
      expect(resultado[0].name).toBe('Pizza Margherita');
      expect(resultado[1].name).toBe('Pizza Calabresa');
    });

    /**
     * TESTE: Busca vazia
     * Verifica comportamento com termo de busca vazio
     */
    test('deve retornar todos produtos quando busca está vazia', () => {
      // ARRANGE: Lista de produtos
      const produtos = [{ id: 1, name: 'Teste' }];

      // ACT: Filtrar com termo vazio
      const resultado = filterProducts(produtos, '');

      // ASSERT: Todos produtos devem ser retornados
      expect(resultado).toEqual(produtos);
    });
  });

  describe('formatPrice', () => {
    /**
     * TESTE: Formatação de preço
     * Verifica se preços são formatados corretamente
     */
    test('deve formatar preço para moeda brasileira', () => {
      // ARRANGE: Valores de teste
      const casos = [
        { entrada: 10, esperado: 'R$ 10,00' },
        { entrada: 15.5, esperado: 'R$ 15,50' },
        { entrada: 999.99, esperado: 'R$ 999,99' }
      ];

      casos.forEach(({ entrada, esperado }) => {
        // ACT: Formatar preço
        const resultado = formatPrice(entrada);

        // ASSERT: Verificar formato correto
        expect(resultado).toBe(esperado);
      });
    });
  });
});
```

---

### 🎯 **Padrões de Qualidade para Testes**

#### ✅ **Boas Práticas**

1. **Teste apenas uma coisa por vez**
   ```javascript
   // ❌ Ruim: testa múltiplas coisas
   test('deve renderizar e chamar função', () => {
     // Testa renderização E interação
   });

   // ✅ Bom: testes separados
   test('deve renderizar corretamente', () => {
     // Apenas renderização
   });

   test('deve chamar função ao clicar', () => {
     // Apenas interação
   });
   ```

2. **Nomes descritivos em português**
   ```javascript
   // ❌ Ruim
   test('should work', () => {});

   // ✅ Bom
   test('deve adicionar produto à lista quando dados são válidos', () => {});
   ```

3. **Arrange, Act, Assert claros**
   ```javascript
   test('deve calcular total corretamente', () => {
     // ARRANGE: Preparar dados
     const items = [{ price: 10 }, { price: 20 }];

     // ACT: Executar ação
     const total = calculateTotal(items);

     // ASSERT: Verificar resultado
     expect(total).toBe(30);
   });
   ```

#### 🔍 **Cobertura de Testes**

**Componentes devem testar:**
- ✅ Renderização com props diferentes
- ✅ Interações do usuário (cliques, inputs)
- ✅ Estados condicionais
- ✅ Callbacks e eventos
- ✅ Casos extremos (dados vazios, erros)

**Hooks devem testar:**
- ✅ Estado inicial
- ✅ Mudanças de estado
- ✅ Efeitos colaterais
- ✅ Cleanup de recursos
- ✅ Tratamento de erros

**Utilitários devem testar:**
- ✅ Entradas válidas
- ✅ Entradas inválidas
- ✅ Casos extremos
- ✅ Performance (se relevante)

---

### 🎨 **Mocks e Helpers**

#### 📦 **Setup de Mocks Globais**

```javascript
// jest.setup.js
import '@testing-library/jest-dom';

// Mock do Material-UI com tema padrão
jest.mock('@mui/material/styles', () => ({
  ...jest.requireActual('@mui/material/styles'),
  useTheme: () => ({
    palette: { primary: { main: '#1976d2' } },
    spacing: (factor) => factor * 8
  })
}));

// Mock de APIs externas
global.fetch = jest.fn();

// Helper global para reset de mocks
beforeEach(() => {
  jest.clearAllMocks();
});
```

#### 🛠️ **Helpers de Teste Customizados**

```javascript
// test-utils.js
/**
 * UTILITÁRIOS DE TESTE CUSTOMIZADOS
 * 
 * Helpers reutilizáveis para facilitar a escrita de testes
 * e garantir consistência entre diferentes arquivos de teste.
 */

import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';

/**
 * Renderiza componente com todos os providers necessários
 */
export const renderWithProviders = (ui, options = {}) => {
  const { theme = createTheme(), ...renderOptions } = options;

  const Wrapper = ({ children }) => (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </BrowserRouter>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

/**
 * Cria dados mock para produtos
 */
export const createMockProduct = (overrides = {}) => ({
  id: 1,
  name: 'Produto Teste',
  price: 25.90,
  description: 'Descrição teste',
  category: 'Categoria Teste',
  imageUrl: '/test-image.jpg',
  ...overrides
});

/**
 * Simula delay para testes async
 */
export const waitForDelay = (ms = 100) => 
  new Promise(resolve => setTimeout(resolve, ms));
```

---

### 📊 **Comandos de Teste**

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com cobertura
npm run test:coverage

# Executar testes específicos
npm test ProductCard.test.js

# Executar testes por padrão
npm test -- --testNamePattern="deve renderizar"
```

---

### ✅ **Checklist de Qualidade para Testes**

Antes de finalizar testes, verificar:

#### 📝 **Documentação**
- [ ] Arquivo tem header explicativo?
- [ ] Cada teste tem comentário explicando o propósito?
- [ ] Grupos de teste estão organizados logicamente?
- [ ] Nomes dos testes são descritivos em português?

#### 🔍 **Cobertura**
- [ ] Casos principais estão cobertos?
- [ ] Casos extremos foram considerados?
- [ ] Tratamento de erro está testado?
- [ ] Interações do usuário estão testadas?

#### 🎯 **Qualidade**
- [ ] Testes são independentes?
- [ ] Mocks estão sendo limpos corretamente?
- [ ] Padrão AAA está sendo seguido?
- [ ] Testes são rápidos e confiáveis?

---

*Seguindo essas diretrizes, os testes serão **modulares**, **legíveis** e **confiáveis**, garantindo a qualidade e estabilidade do código.* 🧪✨

---

## 🛠️ Ferramentas e Utilitários de Teste Implementados

### 📦 **Bibliotecas Principais**
- **@testing-library/react** - Testes focados no usuário
- **@testing-library/jest-dom** - Matchers customizados
- **@testing-library/user-event** - Simulação de interações
- **Jest** - Framework de testes
- **Next.js Jest Integration** - Configuração otimizada

### 🎯 **Utilitários Customizados Criados**

#### 📁 **Arquivo: `/src/test-utils/index.js`**
```javascript
// Função principal de renderização
renderWithProviders(component, options)

// Factories de dados mock
createMockProduct(overrides)
createMockCategory(overrides) 
createMockUser(overrides)
createMockOrder(overrides)

// Helpers de interação
fillForm(user, formData)
clickAndWait(buttonText, waitFor)
waitForElement(text, options)
uploadFile(user, inputLabel, file)

// Mocks de APIs
mockAPI.products.getAll()
mockAPI.categories.create()
mockLocalStorage.getItem()

// Matchers customizados
toHaveClass(element, className)
toBeValidForm(form)
```

#### ⚙️ **Configuração: `jest.config.mjs`**
- Cobertura de código com limites por tipo de arquivo
- Projetos separados (Unit, Integration, Component)
- Mapeamento de módulos para imports limpos
- Configuração de performance otimizada

#### 🔧 **Setup: `jest.setup.js`**
- Mocks globais (localStorage, fetch, IntersectionObserver)
- Matchers customizados do Jest
- Configuração de ambiente limpo
- Polyfills para APIs do browser

### 📊 **Comandos de Teste Disponíveis**

```bash
# Executar todos os testes
npm test

# Testes em modo watch (desenvolvimento)
npm run test:watch

# Testes com relatório de cobertura
npm run test:coverage

# Testes específicos por arquivo
npm test ProductsSection.test.js

# Testes por padrão de nome
npm test -- --testNamePattern="deve renderizar"

# Testes de um tipo específico
npm test -- --selectProjects="Unit Tests"

# Testes com verbose output
npm test -- --verbose

# Atualizar snapshots
npm test -- --updateSnapshot
```

### 🎯 **Limites de Cobertura Estabelecidos**

| Tipo de Arquivo | Branches | Functions | Lines | Statements |
|------------------|----------|-----------|-------|------------|
| **Global** | 70% | 75% | 80% | 80% |
| **Components** | 75% | 80% | 85% | 85% |
| **Hooks** | 80% | 85% | 90% | 90% |
| **Utils** | 85% | 90% | 95% | 95% |

### 📋 **Exemplos de Implementação**

#### ✅ **Arquivos de Teste Criados:**
- `ProductsSection.test.js` - Exemplo completo de teste de componente
- `useCategoryManager.test.js` - Exemplo de teste de hook customizado  
- `adminHelpers.test.js` - Exemplo de teste de funções utilitárias

#### 🎨 **Padrões Implementados:**
- Headers descritivos em português
- Organização por grupos funcionais
- Comentários explicativos para cada teste
- Padrão AAA (Arrange, Act, Assert)
- Cobertura de casos extremos
- Mocks organizados e limpos

---

*Essas diretrizes e ferramentas garantem que o código seja **profissional**, **escalável** e **fácil de manter**. Seguir esses padrões resulta em um produto final de alta qualidade.* 🚀

---
