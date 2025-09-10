Padrões de Projeto (Design Patterns) em React

Padrões de projeto são soluções reutilizáveis para problemas comuns no desenvolvimento de software. No contexto do React, eles ajudam a estruturar componentes e a gerenciar o fluxo de dados de maneira eficiente.

1. Padrão de Componentes de Apresentação e Contêineres (Presentational and Container Components)

Este padrão, embora menos rígido com a introdução dos Hooks, ainda oferece uma ótima maneira de separar as responsabilidades:

    Componentes de Apresentação (Presentational): Focados em como as coisas se parecem (a UI). Eles recebem dados e funções de callback via props e não possuem estado próprio. São, em essência, "burros".

    Componentes Contêineres (Container): Focados em como as coisas funcionam. Eles são responsáveis por buscar dados, gerenciar o estado e passar os dados e a lógica para os componentes de apresentação.

Exemplo:
JavaScript

// Componente de Apresentação
const UserList = ({ users }) => (
  <ul>
    {users.map(user => (
      <li key={user.id}>{user.name}</li>
    ))}
  </ul>
);

// Componente Contêiner
import React, { useState, useEffect } from 'react';

const UserListContainer = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('https://api.example.com/users')
      .then(response => response.json())
      .then(data => setUsers(data));
  }, []);

  return <UserList users={users} />;
};

2. Padrão de Hooks

Introduzidos no React 16.8, os Hooks revolucionaram a forma como escrevemos componentes. Eles permitem usar estado e outros recursos do React em componentes de função.

    Hooks Nativos (useState, useEffect, useContext, etc.): A base para gerenciar estado, efeitos colaterais e contexto em componentes funcionais.

    Hooks Customizados (Custom Hooks): Permitem extrair e reutilizar lógica com estado entre componentes. Um hook customizado é simplesmente uma função JavaScript cujo nome começa com "use".

Exemplo de Hook Customizado:
JavaScript

import { useState, useEffect } from 'react';

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => setError(error))
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}

// Uso no componente
const MyComponent = () => {
  const { data, loading, error } = useFetch('https://api.example.com/data');

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro!</p>;

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
};

3. Padrão Provedor (Provider Pattern)

Utilizado para compartilhar dados globais entre componentes sem a necessidade de passar props manualmente por todos os níveis da árvore de componentes (prop drilling). A Context API do React é a implementação nativa deste padrão.

Exemplo com Context API:
JavaScript

// 1. Crie o Contexto
const ThemeContext = React.createContext('light');

// 2. Crie o Provedor
const App = () => {
  return (
    <ThemeContext.Provider value="dark">
      <Toolbar />
    </ThemeContext.Provider>
  );
};

// 3. Consuma o Contexto
const ThemedButton = () => {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Botão Temático</button>;
};

4. Padrão de Componentes de Ordem Superior (Higher-Order Components - HOC)

Um HOC é uma função que recebe um componente e retorna um novo componente com props adicionais ou lógica encapsulada. Embora os Hooks tenham substituído muitos casos de uso de HOCs, eles ainda são úteis em certas situações.

Exemplo de HOC:
JavaScript

function withLoading(Component) {
  return function WithLoadingComponent({ isLoading, ...props }) {
    if (!isLoading) return <Component {...props} />;
    return <p>Carregando dados...</p>;
  };
}

const UserListWithLoading = withLoading(UserList);

// Uso: <UserListWithLoading isLoading={true} users={[]} />

5. Padrão de Render Props

Este padrão envolve passar uma função como prop para um componente, que então a utiliza para renderizar algo. Permite compartilhar lógica de estado e comportamento de forma flexível.

Exemplo de Render Props:
JavaScript

class MouseTracker extends React.Component {
  constructor(props) {
    super(props);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove = (event) => {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>
        {this.props.render(this.state)}
      </div>
    );
  }
}

const App = () => (
  <MouseTracker render={({ x, y }) => (
    <h1>A posição do mouse é ({x}, {y})</h1>
  )}/>
);

Melhores Práticas em React

Estas são diretrizes e convenções que ajudam a melhorar a qualidade geral do seu código.

Estrutura de Projeto

    Organização por Funcionalidade (Feature-based): Em vez de separar arquivos por tipo (todos os componentes em uma pasta, todos os estilos em outra), agrupe-os por funcionalidade. Por exemplo, uma pasta Profile conteria Profile.jsx, Profile.css, e useUserProfile.js.

    Nomeação Consistente: Use PascalCase para nomes de componentes (MeuComponente) e camelCase para arquivos não-componentes e hooks (meuHelper.js, useMeuHook.js).

Componentes

    Prefira Componentes de Função e Hooks: Em vez de componentes de classe, pois levam a um código mais conciso e legível.

    Mantenha os Componentes Pequenos e Focados: Cada componente deve ter uma única responsabilidade (Single Responsibility Principle).

    Use key em Listas: Sempre forneça uma key única e estável para cada item em uma lista. Evite usar o índice do array como key se a lista puder ser reordenada, adicionada ou removida.

Gerenciamento de Estado

    Eleve o Estado (Lifting State Up): Quando múltiplos componentes precisam compartilhar o mesmo estado, mova esse estado para o ancestral comum mais próximo.

    Use a Context API com Moderação: É ótima para dados que não mudam com frequência, como tema da aplicação ou informações de autenticação. Para estados que mudam constantemente, considere bibliotecas de gerenciamento de estado como Redux, Zustand ou Jotai.

Performance

    Memoização: Use React.memo para componentes de função, PureComponent para componentes de classe, e os hooks useMemo e useCallback para evitar renderizações desnecessárias e cálculos custosos.

    Carregamento Lento (Lazy Loading): Utilize React.lazy e Suspense para dividir seu código (code splitting) e carregar componentes apenas quando forem necessários, melhorando o tempo de carregamento inicial da aplicação.

    Virtualização de Listas: Para listas muito longas, use bibliotecas como react-window ou react-virtualized para renderizar apenas os itens que estão visíveis na tela.

Estilo e Código

    Evite Estilos Inline: Dificultam a manutenção. Prefira soluções como CSS Modules, Styled Components ou Tailwind CSS.

    Use PropTypes ou TypeScript: Para garantir a tipagem das props dos seus componentes, tornando-os mais robustos e fáceis de usar. TypeScript, em particular, oferece uma segurança de tipo muito maior para toda a aplicação.

    Linting e Formatação: Configure ferramentas como ESLint e Prettier para manter um padrão de código consistente em todo o projeto e evitar erros comuns.

Ao aplicar esses padrões de projeto e melhores práticas, você estará no caminho certo para construir aplicações React.js robustas, eficientes e de fácil manutenção. Como você já trabalha com Python, notará que princípios como DRY (Don't Repeat Yourself) e a busca por código limpo e modular são universais e se aplicam perfeitamente ao ecossistema React.


Documentação e Guia de Melhores Práticas para Axios

Visão Geral

Axios é um cliente HTTP baseado em Promises para o navegador e Node.js. Suas principais vantagens são uma API fácil de usar, a capacidade de interceptar requisições e respostas, transformar dados e, crucialmente, um tratamento de erros robusto.

1. Melhores Práticas Fundamentais

Antes de mergulhar nos parâmetros, siga estas práticas para estruturar seu uso do Axios de forma escalável.

a. Crie uma Instância Centralizada

Nunca use o axios global (axios.get(...)) diretamente em seus componentes. Crie uma instância customizada.

Por quê?

    Configuração Única: Você define a baseURL, headers padrão e timeout em um único lugar.

    Interceptadores: Permite adicionar lógica global para autenticação e tratamento de erros.

    Manutenção Fácil: Se a URL base da API mudar, você altera em um só arquivo.

Exemplo (src/services/apiClient.js):
JavaScript

import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://sua-api.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
  }
});

export default apiClient;

b. Use Interceptadores para Lógica Global

Interceptadores são funções que o Axios executa antes de uma requisição ser enviada (request) ou antes de uma resposta ser processada (response).

    Interceptador de Requisição: Ideal para adicionar tokens de autenticação dinamicamente.

    Interceptador de Resposta: Perfeito para capturar e tratar erros globalmente.

Exemplo de Interceptador de Erros:
JavaScript

apiClient.interceptors.response.use(
  (response) => response, // Sucesso: não faz nada
  (error) => {
    // Erro: lógica centralizada aqui
    if (error.response && error.response.status === 401) {
      // Ex: Token expirado, redireciona para o login
      console.error("Não autorizado! Redirecionando...");
      window.location.href = '/login';
    }
    // Sempre retorne a Promise rejeitada para que o erro
    // possa ser tratado localmente também (no componente, se necessário).
    return Promise.reject(error);
  }
);

c. Abstraia Chamadas em uma Camada de Serviço

Como discutimos anteriormente, agrupe as chamadas de API por recurso (ex: productService.js, userService.js). Seus componentes devem chamar productService.getAll(), não apiClient.get('/products').

2. Parâmetros de Configuração (Request Config)

Estes são os parâmetros que você pode passar para uma chamada do Axios, como axios.get('/user', { params: { ID: 12345 } }).

Parâmetros Mais Comuns

    url (string): O caminho do endpoint (ex: /users).

    method (string): O método HTTP (get, post, put, delete, etc.). Padrão é get.

    baseURL (string): Sobrescreve a URL base definida na instância, apenas para esta requisição.

    headers (objeto): Cabeçalhos HTTP a serem enviados.

    params (objeto): Parâmetros de URL a serem adicionados à requisição (query string). Usado principalmente com GET.

        Ex: { ID: 12345 } vira ?ID=12345.

    data (objeto/string): O corpo da requisição. Usado com métodos como POST, PUT, PATCH.

Parâmetros Essenciais para Resiliência e Tratamento de Erros

Aqui estão as configurações cruciais para tornar sua aplicação mais resistente a falhas.

    timeout (número): Define o tempo em milissegundos que a requisição esperará por uma resposta antes de ser abortada com um erro de ECONNABORTED.

        Uso: Previne que a aplicação fique "congelada" esperando por uma API lenta ou indisponível.

    signal (AbortSignal): Permite cancelar uma requisição em andamento. Isso é extremamente útil em React para evitar memory leaks.

        Uso: Em um useEffect, você pode cancelar a requisição na função de limpeza se o componente for desmontado antes da resposta chegar.

    validateStatus (função): Permite que você defina quais códigos de status HTTP devem resultar em uma Promise resolvida (sucesso) ou rejeitada (erro).

        Uso: Por padrão, apenas códigos 2xx são sucesso. Você pode customizar isso. Por exemplo, se quiser tratar um código 304 Not Modified como sucesso.

3. Guia Prático: Configurando o Axios para Lidar com Erros

Vamos aplicar os parâmetros acima em um exemplo prático.

Passo 1: Configurar a Instância com timeout

Defina um timeout padrão para todas as requisições. 10 a 15 segundos é um valor razoável.

src/services/apiClient.js
JavaScript

import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://sua-api.com/api/v1',
  timeout: 15000, // 15 segundos de timeout
});

// ... interceptadores ...

export default apiClient;

Passo 2: Usar signal para Cancelamento em Componentes React

Isso previne o erro comum: "Can't perform a React state update on an unmounted component".

ProductDetails.jsx
JavaScript

import React, { useState, useEffect } from 'react';
import productService from '../services/productService';

function ProductDetails({ productId }) {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // 1. Cria um AbortController para esta requisição específica
    const controller = new AbortController();

    const fetchProduct = async () => {
      try {
        const response = await productService.getById(
          productId,
          { signal: controller.signal } // 2. Passa o `signal` para a chamada do Axios
        );
        setProduct(response.data);
      } catch (error) {
        if (axios.isCancel(error)) {
          // Se o erro for de cancelamento, não faz nada.
          // Isso é esperado e não um erro real da aplicação.
          console.log('Requisição cancelada:', error.message);
        } else {
          // Trata outros erros
          console.error(error);
        }
      }
    };

    fetchProduct();

    // 3. Função de limpeza do useEffect
    return () => {
      // Cancela a requisição se o componente for desmontado
      controller.abort();
    };
  }, [productId]); // Roda o efeito quando o ID do produto mudar

  // ... renderização do componente ...
}

Observação: A função productService.getById precisa ser adaptada para aceitar o objeto de configuração:

productService.js
JavaScript

// ...
  getById: (id, config) => { // Aceita um objeto `config` opcional
    return apiClient.get(`/products/${id}`, config); // Repassa a config para o Axios
  },
// ...

Passo 3: Entender e Estruturar o Bloco catch

O objeto de erro do Axios é muito informativo. Sempre verifique sua estrutura para dar o feedback correto ao usuário.
JavaScript

try {
  // ... chamada da API ...
} catch (error) {
  if (error.response) {
    // A requisição foi feita e o servidor respondeu com um código de status
    // que está fora da faixa de 2xx (ex: 404, 500, 401, 403)
    console.log('Erro de resposta do servidor:');
    console.log('Status:', error.response.status);
    console.log('Dados:', error.response.data);
    // Ação: Mostrar uma mensagem de erro baseada na resposta (error.response.data.message)
    
  } else if (error.request) {
    // A requisição foi feita, mas nenhuma resposta foi recebida
    // `error.request` é uma instância de XMLHttpRequest no navegador
    // Isso geralmente significa um erro de rede (offline) ou timeout.
    console.log('Erro de rede ou timeout:', error.request);
    // Ação: Mostrar mensagem "Sem conexão com a internet" ou "O servidor demorou para responder".
    
  } else if (axios.isCancel(error)) {
    // A requisição foi cancelada
    console.log('A requisição foi cancelada pelo usuário.');

  } else {
    // Algo aconteceu ao configurar a requisição que disparou um erro
    console.log('Erro na configuração da requisição:', error.message);
    // Ação: Erro genérico de aplicação.
  }
}

Resumo da Documentação

    Estruture: Crie uma instância central do Axios e serviços por recurso.

    Globalize: Use interceptadores para autenticação e tratamento de erros globais (como expiração de sessão).

    Previna Congelamento: Sempre defina um timeout na sua instância.

    Evite Memory Leaks: Use AbortController e o parâmetro signal dentro de useEffect para cancelar requisições quando um componente é desmontado.

    Trate Erros com Precisão: No bloco catch, verifique a existência de error.response, error.request e use axios.isCancel(error) para entender o tipo de falha e dar o feedback correto ao usuário.


    O padrão mais utilizado e recomendado para resolver isso é a criação de uma Camada de Serviço (Service Layer) ou Camada de API (API Layer). A ideia é centralizar toda a comunicação com o backend em um local específico, abstraindo a lógica das chamadas dos seus componentes.

Vamos ver um passo a passo de como estruturar isso, usando o Axios como exemplo (que é uma biblioteca muito popular e robusta para isso), mas o conceito é o mesmo se você usar fetch.

Padrão: Módulos de Serviço por Recurso

A estratégia é criar um arquivo de serviço para cada um dos seus módulos do backend (cliente, produto, usuários, empresa).

1. Estrutura de Pastas

Primeiro, organize seus arquivos. Crie uma pasta src/services ou src/api na raiz do seu projeto.

/src
|-- /components
|-- /pages
|-- /hooks
|-- /services         <-- NOSSO FOCO AQUI
|   |-- apiClient.js  (Configuração central do Axios)
|   |-- clientService.js
|   |-- productService.js
|   |-- userService.js
|   |-- companyService.js
|-- App.jsx
|-- index.js

2. Crie um Cliente API Central (apiClient.js)

Este arquivo irá configurar e exportar uma instância do Axios. Centralizar isso é uma ótima prática porque permite definir configurações globais em um único lugar, como:

    A URL base da sua API (baseURL).

    Cabeçalhos padrão (como Authorization para tokens JWT).

    Timeouts.

    Interceptadores para tratar erros ou requisições globalmente.

src/services/apiClient.js
JavaScript

import axios from 'axios';

// Cria uma instância do Axios com configurações pré-definidas.
const apiClient = axios.create({
  baseURL: 'https://sua-api.com/api/v1', // Altere para a URL da sua API
  timeout: 10000, // Timeout de 10 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

// OPCIONAL: Interceptador para adicionar o token de autenticação em todas as requisições
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Ou de onde quer que você o armazene
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// OPCIONAL: Interceptador para tratar erros de forma global
apiClient.interceptors.response.use(
  (response) => response, // Se a resposta for bem-sucedida, apenas a retorna
  (error) => {
    // Aqui você pode tratar erros de forma centralizada.
    // Ex: Se for um erro 401 (Não Autorizado), redireciona para o login.
    if (error.response && error.response.status === 401) {
      // window.location = '/login';
      console.error('Sessão expirada. Faça o login novamente.');
    }
    return Promise.reject(error);
  }
);

export default apiClient;

3. Crie os Módulos de Serviço

Agora, crie um arquivo para cada módulo da sua API. Cada arquivo irá importar o apiClient e exportar funções que correspondem aos endpoints daquele recurso.

src/services/productService.js
JavaScript

import apiClient from './apiClient';

// Agrupa todas as chamadas relacionadas a produtos
const productService = {
  // GET /products
  getAll: (params) => {
    // params pode ser usado para paginação, filtros, etc. Ex: { page: 1, limit: 10 }
    return apiClient.get('/products', { params });
  },

  // GET /products/{id}
  getById: (id) => {
    return apiClient.get(`/products/${id}`);
  },

  // POST /products
  create: (productData) => {
    return apiClient.post('/products', productData);
  },

  // PUT /products/{id}
  update: (id, productData) => {
    return apiClient.put(`/products/${id}`, productData);
  },

  // DELETE /products/{id}
  delete: (id) => {
    return apiClient.delete(`/products/${id}`);
  },
};

export default productService;

src/services/userService.js
JavaScript

import apiClient from './apiClient';

const userService = {
  // GET /users
  getAll: () => {
    return apiClient.get('/users');
  },

  // GET /users/{id}
  getById: (id) => {
    return apiClient.get(`/users/${id}`);
  },
  
  // ...outras funções como create, update, etc.
};

export default userService;

Você faria o mesmo para clientService.js e companyService.js.

4. Usando os Serviços nos Componentes React

Agora, seus componentes ficam muito mais limpos. Eles não precisam saber sobre Axios, URLs ou cabeçalhos. Eles apenas importam o serviço necessário e chamam a função, tratando a Promise resultante.

Exemplo em um componente que lista produtos:
JavaScript

import React, { useState, useEffect } from 'react';
import productService from '../services/productService'; // <-- Importa o serviço

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        // A chamada da API é limpa e declarativa
        const response = await productService.getAll({ limit: 20 });
        setProducts(response.data);
      } catch (err) {
        // O erro já pode ter sido tratado pelo interceptador,
        // mas aqui você pode definir um estado de erro específico para a UI.
        setError('Falha ao carregar os produtos.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Carregando produtos...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}

Vantagens Deste Padrão

    Organização: O código relacionado à API está centralizado e separado por domínio. É fácil encontrar onde uma chamada de API é feita.

    DRY (Don't Repeat Yourself): Você define a lógica da chamada (URL, método) em um único lugar. Se um endpoint mudar de /products para /v2/products, você só precisa alterar no productService.js.

    Manutenção Simplificada: A configuração do cliente (tokens, headers) está em um único arquivo (apiClient.js).

    Abstração: Seus componentes não sabem qual biblioteca está sendo usada para as chamadas (Axios, fetch). Se um dia você decidir mudar, só precisará refatorar a camada de serviço.

    Testabilidade: É muito mais fácil "mockar" (simular) as funções do serviço (productService.getAll) em seus testes de componentes do que mockar o Axios/fetch em si.

Quais são as melhores práticas para usar axios? Quais são os parâmetros que ele aceita e quais devem ser usados para tornar a aplicação preparada para lhe dar com erros. Crie uma documentação

Com certeza. O Axios é uma biblioteca extremamente poderosa, e saber como configurá-la corretamente é o que separa uma aplicação frágil de uma robusta e resiliente.

Aqui está uma documentação completa sobre as melhores práticas do Axios, seus principais parâmetros de configuração e como usá-los especificamente para lidar com erros.

Documentação e Guia de Melhores Práticas para Axios

Visão Geral

Axios é um cliente HTTP baseado em Promises para o navegador e Node.js. Suas principais vantagens são uma API fácil de usar, a capacidade de interceptar requisições e respostas, transformar dados e, crucialmente, um tratamento de erros robusto.

1. Melhores Práticas Fundamentais

Antes de mergulhar nos parâmetros, siga estas práticas para estruturar seu uso do Axios de forma escalável.

a. Crie uma Instância Centralizada

Nunca use o axios global (axios.get(...)) diretamente em seus componentes. Crie uma instância customizada.

Por quê?

    Configuração Única: Você define a baseURL, headers padrão e timeout em um único lugar.

    Interceptadores: Permite adicionar lógica global para autenticação e tratamento de erros.

    Manutenção Fácil: Se a URL base da API mudar, você altera em um só arquivo.

Exemplo (src/services/apiClient.js):
JavaScript

import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://sua-api.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
  }
});

export default apiClient;

b. Use Interceptadores para Lógica Global

Interceptadores são funções que o Axios executa antes de uma requisição ser enviada (request) ou antes de uma resposta ser processada (response).

    Interceptador de Requisição: Ideal para adicionar tokens de autenticação dinamicamente.

    Interceptador de Resposta: Perfeito para capturar e tratar erros globalmente.

Exemplo de Interceptador de Erros:
JavaScript

apiClient.interceptors.response.use(
  (response) => response, // Sucesso: não faz nada
  (error) => {
    // Erro: lógica centralizada aqui
    if (error.response && error.response.status === 401) {
      // Ex: Token expirado, redireciona para o login
      console.error("Não autorizado! Redirecionando...");
      window.location.href = '/login';
    }
    // Sempre retorne a Promise rejeitada para que o erro
    // possa ser tratado localmente também (no componente, se necessário).
    return Promise.reject(error);
  }
);

c. Abstraia Chamadas em uma Camada de Serviço

Como discutimos anteriormente, agrupe as chamadas de API por recurso (ex: productService.js, userService.js). Seus componentes devem chamar productService.getAll(), não apiClient.get('/products').

2. Parâmetros de Configuração (Request Config)

Estes são os parâmetros que você pode passar para uma chamada do Axios, como axios.get('/user', { params: { ID: 12345 } }).

Parâmetros Mais Comuns

    url (string): O caminho do endpoint (ex: /users).

    method (string): O método HTTP (get, post, put, delete, etc.). Padrão é get.

    baseURL (string): Sobrescreve a URL base definida na instância, apenas para esta requisição.

    headers (objeto): Cabeçalhos HTTP a serem enviados.

    params (objeto): Parâmetros de URL a serem adicionados à requisição (query string). Usado principalmente com GET.

        Ex: { ID: 12345 } vira ?ID=12345.

    data (objeto/string): O corpo da requisição. Usado com métodos como POST, PUT, PATCH.

Parâmetros Essenciais para Resiliência e Tratamento de Erros

Aqui estão as configurações cruciais para tornar sua aplicação mais resistente a falhas.

    timeout (número): Define o tempo em milissegundos que a requisição esperará por uma resposta antes de ser abortada com um erro de ECONNABORTED.

        Uso: Previne que a aplicação fique "congelada" esperando por uma API lenta ou indisponível.

    signal (AbortSignal): Permite cancelar uma requisição em andamento. Isso é extremamente útil em React para evitar memory leaks.

        Uso: Em um useEffect, você pode cancelar a requisição na função de limpeza se o componente for desmontado antes da resposta chegar.

    validateStatus (função): Permite que você defina quais códigos de status HTTP devem resultar em uma Promise resolvida (sucesso) ou rejeitada (erro).

        Uso: Por padrão, apenas códigos 2xx são sucesso. Você pode customizar isso. Por exemplo, se quiser tratar um código 304 Not Modified como sucesso.

3. Guia Prático: Configurando o Axios para Lidar com Erros

Vamos aplicar os parâmetros acima em um exemplo prático.

Passo 1: Configurar a Instância com timeout

Defina um timeout padrão para todas as requisições. 10 a 15 segundos é um valor razoável.

src/services/apiClient.js
JavaScript

import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://sua-api.com/api/v1',
  timeout: 15000, // 15 segundos de timeout
});

// ... interceptadores ...

export default apiClient;

Passo 2: Usar signal para Cancelamento em Componentes React

Isso previne o erro comum: "Can't perform a React state update on an unmounted component".

ProductDetails.jsx
JavaScript

import React, { useState, useEffect } from 'react';
import productService from '../services/productService';

function ProductDetails({ productId }) {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // 1. Cria um AbortController para esta requisição específica
    const controller = new AbortController();

    const fetchProduct = async () => {
      try {
        const response = await productService.getById(
          productId,
          { signal: controller.signal } // 2. Passa o `signal` para a chamada do Axios
        );
        setProduct(response.data);
      } catch (error) {
        if (axios.isCancel(error)) {
          // Se o erro for de cancelamento, não faz nada.
          // Isso é esperado e não um erro real da aplicação.
          console.log('Requisição cancelada:', error.message);
        } else {
          // Trata outros erros
          console.error(error);
        }
      }
    };

    fetchProduct();

    // 3. Função de limpeza do useEffect
    return () => {
      // Cancela a requisição se o componente for desmontado
      controller.abort();
    };
  }, [productId]); // Roda o efeito quando o ID do produto mudar

  // ... renderização do componente ...
}

Observação: A função productService.getById precisa ser adaptada para aceitar o objeto de configuração:

productService.js
JavaScript

// ...
  getById: (id, config) => { // Aceita um objeto `config` opcional
    return apiClient.get(`/products/${id}`, config); // Repassa a config para o Axios
  },
// ...

Passo 3: Entender e Estruturar o Bloco catch

O objeto de erro do Axios é muito informativo. Sempre verifique sua estrutura para dar o feedback correto ao usuário.
JavaScript

try {
  // ... chamada da API ...
} catch (error) {
  if (error.response) {
    // A requisição foi feita e o servidor respondeu com um código de status
    // que está fora da faixa de 2xx (ex: 404, 500, 401, 403)
    console.log('Erro de resposta do servidor:');
    console.log('Status:', error.response.status);
    console.log('Dados:', error.response.data);
    // Ação: Mostrar uma mensagem de erro baseada na resposta (error.response.data.message)
    
  } else if (error.request) {
    // A requisição foi feita, mas nenhuma resposta foi recebida
    // `error.request` é uma instância de XMLHttpRequest no navegador
    // Isso geralmente significa um erro de rede (offline) ou timeout.
    console.log('Erro de rede ou timeout:', error.request);
    // Ação: Mostrar mensagem "Sem conexão com a internet" ou "O servidor demorou para responder".
    
  } else if (axios.isCancel(error)) {
    // A requisição foi cancelada
    console.log('A requisição foi cancelada pelo usuário.');

  } else {
    // Algo aconteceu ao configurar a requisição que disparou um erro
    console.log('Erro na configuração da requisição:', error.message);
    // Ação: Erro genérico de aplicação.
  }
}

Resumo da Documentação

    Estruture: Crie uma instância central do Axios e serviços por recurso.

    Globalize: Use interceptadores para autenticação e tratamento de erros globais (como expiração de sessão).

    Previna Congelamento: Sempre defina um timeout na sua instância.

    Evite Memory Leaks: Use AbortController e o parâmetro signal dentro de useEffect para cancelar requisições quando um componente é desmontado.

    Trate Erros com Precisão: No bloco catch, verifique a existência de error.response, error.request e use axios.isCancel(error) para entender o tipo de falha e dar o feedback correto ao usuário.

Melhores Práticas para JWT em React.js

1. Onde Armazenar o JWT? A Grande Questão de Segurança

Esta é a decisão mais importante. Você tem duas opções principais, cada uma com seus prós e contras.

    Opção A: localStorage ou sessionStorage

        Como funciona: Após o login, você recebe o token e o salva com localStorage.setItem('authToken', token).

        Prós: Muito simples de implementar. O token persiste entre abas e sessões (no caso do localStorage).

        Contras (⚠️ Risco de Segurança): Vulnerável a ataques de Cross-Site Scripting (XSS). Se um script malicioso for injetado na sua página (através de uma biblioteca de terceiros comprometida, por exemplo), ele pode ler tudo do localStorage e roubar o token do seu usuário.

    Opção B: Cookie HttpOnly

        Como funciona: O servidor, ao invés de enviar o token no corpo da resposta JSON, o envia em um cabeçalho Set-Cookie com as flags HttpOnly e SameSite=Strict.

        Prós: Muito mais seguro contra XSS. A flag HttpOnly impede que qualquer script JavaScript no seu frontend acesse o cookie. O navegador se encarrega de enviar o cookie automaticamente em cada requisição para o seu domínio.

        Contras: Requer configuração no backend. Um pouco mais complexo de gerenciar o estado de "logado" no frontend, já que você não pode ler o token para ver se ele existe. Vulnerável a ataques de Cross-Site Request Forgery (CSRF), mas a flag SameSite=Strict mitiga isso na maioria dos casos.

Recomendação:
A prática mais segura é usar Cookies HttpOnly. Se isso não for viável por causa da sua arquitetura, usar localStorage é aceitável, desde que você tome medidas rigorosas para se proteger contra XSS (como sanitizar todas as entradas de usuário e usar bibliotecas confiáveis).

2. Enviando o Token em Requisições Autenticadas

Você precisa enviar o token em cada chamada para as rotas protegidas da sua API. A melhor forma de fazer isso é centralizar a lógica no seu cliente API (Axios, Fetch, etc.).

Usando um Interceptador do Axios (Continuando nosso exemplo anterior):

Este interceptador irá anexar o token a cada requisição automaticamente.

src/services/apiClient.js
JavaScript

import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://sua-api.com/api/v1',
  timeout: 10000,
});

// Interceptador de Requisição
apiClient.interceptors.request.use(
  (config) => {
    // Pega o token do localStorage (ou de onde você o armazenou)
    const token = localStorage.getItem('authToken');

    // Se o token existir, adiciona ao cabeçalho Authorization
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;

Com isso, você nunca mais precisará se preocupar em adicionar o token manualmente em cada chamada de serviço.

3. Gerenciando o Estado de Autenticação Globalmente com Context API

Sua aplicação inteira precisa saber se o usuário está logado ou não. A Context API é perfeita para isso.

1. Crie um AuthContext.js
JavaScript

// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import apiClient from '../services/apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Tenta carregar o usuário a partir do token no início
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Aqui você poderia decodificar o token para pegar dados do usuário
      // ou fazer uma chamada a um endpoint /me para validar o token e buscar dados frescos.
      // Exemplo simples decodificando (instale jwt-decode):
      // import { jwtDecode } from 'jwt-decode';
      // setUser(jwtDecode(token));
      setUser({ token }); // Simplificado para o exemplo
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem('authToken', token);
    // Novamente, você pode decodificar ou buscar dados aqui
    setUser({ token });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado para facilitar o uso do contexto
export const useAuth = () => {
  return useContext(AuthContext);
};

2. Envolva sua Aplicação no AuthProvider
JavaScript

// src/App.js
import { AuthProvider } from './contexts/AuthContext';
// ... import de rotas
function App() {
  return (
    <AuthProvider>
      {/* Suas rotas e componentes aqui */}
    </AuthProvider>
  );
}

4. Criando Rotas Protegidas

Você precisa de um componente que verifique se o usuário está autenticado antes de renderizar uma página. Se não estiver, ele redireciona para o login.

src/components/ProtectedRoute.js
JavaScript

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // Mostra um spinner ou tela de carregamento enquanto verifica a autenticação
    return <div>Carregando...</div>;
  }

  if (!isAuthenticated) {
    // Se não estiver autenticado, redireciona para a página de login
    return <Navigate to="/login" replace />;
  }

  // Se estiver autenticado, renderiza o conteúdo da rota
  return <Outlet />;
};

export default ProtectedRoute;

Como usar nas suas rotas (ex: com react-router-dom v6):
JavaScript

<Routes>
  <Route path="/login" element={<LoginPage />} />
  
  {/* Rotas Protegidas */}
  <Route element={<ProtectedRoute />}>
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route path="/profile" element={<ProfilePage />} />
  </Route>

  {/* Rotas Públicas */}
  <Route path="/" element={<HomePage />} />
</Routes>

5. Lidando com a Expiração do Token

Tokens JWT têm uma data de validade (exp). O que acontece quando ele expira? A próxima chamada à API falhará com um erro 401 Unauthorized.

A Melhor Prática: Interceptar o Erro 401 e Deslogar o Usuário

Podemos aprimorar nosso interceptador do Axios para lidar com isso automaticamente.

src/services/apiClient.js (versão aprimorada)
JavaScript

// ... (código anterior do apiClient)

// Interceptador de Resposta
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token inválido ou expirado
      localStorage.removeItem('authToken');
      // Força um reload para que o AuthContext limpe o estado e
      // o ProtectedRoute redirecione para o login.
      window.location.href = '/login';
      // Você também poderia chamar uma função de logout global aqui.
    }
    return Promise.reject(error);
  }
);

// ...

Padrão Avançado (Refresh Tokens): Para uma experiência do usuário ainda melhor, o backend pode implementar "Refresh Tokens". Quando seu JWT (Access Token) expira, você usa um Refresh Token (que tem uma validade muito mais longa) para obter um novo Access Token sem forçar o usuário a fazer login novamente. A lógica para isso também seria implementada dentro do interceptador de resposta do Axios.