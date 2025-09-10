/**
 * CLIENTE API CENTRALIZADO - CONFIGURAÇÃO FETCH
 * 
 * Cliente HTTP baseado em fetch nativo com configurações globais para
 * comunicação com o backend. Inclui interceptadores simulados para 
 * autenticação e tratamento de erros.
 * 
 * Funcionalidades:
 * - Configuração centralizada de URL base e timeout
 * - Headers automáticos para autenticação JWT
 * - Tratamento robusto de erros de rede e servidor
 * - Compatibilidade com padrões Axios para facilitar migração futura
 */

// Configuração base da API
const API_CONFIG = {
  // TODO: Alterar para URL real do backend quando disponível
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  timeout: 10000, // 10 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * CLIENTE API PERSONALIZADO
 * 
 * Wrapper do fetch nativo que simula comportamento do Axios
 */
class ApiClient {
  constructor(config) {
    this.config = config;
    this.requestInterceptors = [];
    this.responseInterceptors = [];
  }

  /**
   * Adiciona interceptador de requisição
   */
  addRequestInterceptor(onFulfilled, onRejected) {
    this.requestInterceptors.push({ onFulfilled, onRejected });
  }

  /**
   * Adiciona interceptador de resposta
   */
  addResponseInterceptor(onFulfilled, onRejected) {
    this.responseInterceptors.push({ onFulfilled, onRejected });
  }

  /**
   * Executa requisição HTTP
   */
  async request(url, options = {}) {
    try {
      // Monta URL completa
      const fullUrl = url.startsWith('http') ? url : `${this.config.baseURL}${url}`;
      
      // Configuração inicial
      let config = {
        method: options.method || 'GET',
        headers: {
          ...this.config.headers,
          ...options.headers
        },
        ...options
      };

      // Aplica interceptadores de requisição
      for (const interceptor of this.requestInterceptors) {
        if (interceptor.onFulfilled) {
          config = interceptor.onFulfilled(config);
        }
      }

      // Log da requisição (sempre)
      console.log('[API REQUEST]', {
        method: config.method,
        url: fullUrl,
        body: config.body ? (() => { try { return JSON.parse(config.body); } catch { return config.body; } })() : undefined,
        headers: config.headers
      });

      // Log da requisição em desenvolvimento
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔄 API Request: ${config.method} ${fullUrl}`);
      }

      // Executa requisição com timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch(fullUrl, {
        ...config,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // Cria objeto de resposta compatível com Axios
      const result = {
        status: response.status,
        statusText: response.statusText,
        data: response.ok ? await response.json().catch(() => null) : null,
        config: config,
        request: response
      };

      // Log da resposta em desenvolvimento
      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ API Response: ${result.status} ${fullUrl}`);
      }

      // Aplica interceptadores de resposta em caso de sucesso
      if (response.ok) {
        for (const interceptor of this.responseInterceptors) {
          if (interceptor.onFulfilled) {
            interceptor.onFulfilled(result);
          }
        }
        return result;
      } else {
        // Simula erro do Axios
        throw {
          response: result,
          request: response,
          message: `Request failed with status ${response.status}`
        };
      }

    } catch (error) {
      // Aplica interceptadores de resposta em caso de erro
      for (const interceptor of this.responseInterceptors) {
        if (interceptor.onRejected) {
          interceptor.onRejected(error);
        }
      }

      // Log detalhado do erro para debugging
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ API Error:', {
          status: error.response?.status,
          message: error.message,
          url: url
        });
      }

      throw error;
    }

    
  }

  // Métodos de conveniência
  async get(url, config) {
    return this.request(url, { ...config, method: 'GET' });
  }

  async post(url, data, config) {
    return this.request(url, { 
      ...config, 
      method: 'POST', 
      body: data ? JSON.stringify(data) : undefined 
    });
  }

  async put(url, data, config) {
    return this.request(url, { 
      ...config, 
      method: 'PUT', 
      body: data ? JSON.stringify(data) : undefined 
    });
  }

  async delete(url, config) {
    return this.request(url, { ...config, method: 'DELETE' });
  }
}

/**
 * INSTÂNCIA PRINCIPAL DO CLIENTE API
 */
const apiClient = new ApiClient(API_CONFIG);

/**
 * CONFIGURAÇÃO DOS INTERCEPTADORES
 */

// Interceptador de requisição: adiciona token JWT
apiClient.addRequestInterceptor(
  (config) => {
    // Recupera token do localStorage (apenas no cliente)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');

      console.log('🔑 Token JWT adicionado na requisição:', token);
      
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Erro na configuração da requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptador de resposta: trata erros de autenticação
apiClient.addResponseInterceptor(
  (response) => response,
  (error) => {
    // Tratamento de erro 401 - Token expirado ou inválido
    if (error.response && error.response.status === 401) {
      console.warn('🔒 Token expirado ou inválido. Redirecionando para login...');
      
      // Remove token inválido do localStorage (apenas no cliente)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        
        // Redireciona para página de login se não estiver já nela
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/admin/login';
        }
      }
    }
    
    throw error;
  }
);

/**
 * FUNÇÕES UTILITÁRIAS PARA TRATAMENTO DE ERROS
 */

/**
 * Extrai mensagem de erro legível da resposta da API
 * 
 * @param {Object} error - Objeto de erro
 * @returns {string} Mensagem de erro formatada
 */
export const getErrorMessage = (error) => {
  if (error.response) {
    // Erro com resposta do servidor
    return error.response.data?.message || 
           `Erro ${error.response.status}: ${error.response.statusText}`;
  } else if (error.request) {
    // Erro de rede - sem resposta
    return 'Erro de conexão. Verifique sua internet e tente novamente.';
  } else if (error.name === 'AbortError') {
    // Requisição cancelada
    return 'Requisição cancelada pelo usuário.';
  } else {
    // Erro de configuração
    return 'Erro interno da aplicação. Tente novamente.';
  }
};

/**
 * Verifica se erro é de autenticação
 * 
 * @param {Object} error - Objeto de erro
 * @returns {boolean} True se for erro de autenticação
 */
export const isAuthError = (error) => {
  return error.response && error.response.status === 401;
};

/**
 * Verifica se erro é de rede
 * 
 * @param {Object} error - Objeto de erro
 * @returns {boolean} True se for erro de rede
 */
export const isNetworkError = (error) => {
  return error.request && !error.response;
};

// Exportação da instância principal
export default apiClient;