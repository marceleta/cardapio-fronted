/**
 * CONFIGURAÇÃO GLOBAL DE TESTES - JEST SETUP
 * 
 * Arquivo de configuração executado antes de todos os testes.
 * Configura matchers, mocks globais e utilitários necessários.
 * 
 * Funcionalidades:
 * - Matchers customizados do testing-library
 * - Mocks globais para APIs e dependências
 * - Configurações de ambiente de teste
 * - Polyfills necessários para testes
 */

// Matchers customizados para melhorar assertions
import '@testing-library/jest-dom'

// Configuração de timeout global para testes async
jest.setTimeout(10000)

// Mock global do localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  key: jest.fn(),
  length: 0
}

// Mock global do sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  key: jest.fn(),
  length: 0
}

// Aplicar mocks ao objeto global
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
})

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
  writable: true
})

// Mock do fetch global
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    blob: () => Promise.resolve(new Blob()),
    headers: new Headers(),
    url: 'http://localhost:3000',
    statusText: 'OK'
  })
)

// Mock do IntersectionObserver para componentes que usam scroll
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock do ResizeObserver para componentes responsivos
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock do matchMedia para testes de responsividade
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock do scrollTo para testes de navegação
Object.defineProperty(window, 'scrollTo', {
  value: jest.fn(),
  writable: true
})

// Mock da API de geolocalização
Object.defineProperty(navigator, 'geolocation', {
  value: {
    getCurrentPosition: jest.fn(),
    watchPosition: jest.fn(),
    clearWatch: jest.fn()
  },
  writable: true
})

// Mock de URLSearchParams para testes de query strings
global.URLSearchParams = class URLSearchParams {
  constructor(init) {
    this.params = new Map()
    if (typeof init === 'string') {
      // Parse básico de query string
      init.replace(/^\?/, '').split('&').forEach(pair => {
        const [key, value] = pair.split('=')
        if (key) this.params.set(key, value || '')
      })
    }
  }
  
  get(key) {
    return this.params.get(key)
  }
  
  set(key, value) {
    this.params.set(key, value)
  }
  
  toString() {
    const pairs = []
    this.params.forEach((value, key) => {
      pairs.push(`${key}=${value}`)
    })
    return pairs.join('&')
  }
}

// Configurar console para testes mais limpos
const originalConsoleError = console.error
const originalConsoleWarn = console.warn

// Filtrar warnings conhecidos do React/Material-UI em testes
beforeEach(() => {
  console.error = (...args) => {
    const message = args[0]
    
    // Ignorar warnings específicos que são esperados em testes
    if (
      typeof message === 'string' &&
      (
        message.includes('Warning: ReactDOM.render is no longer supported') ||
        message.includes('Warning: componentWillReceiveProps') ||
        message.includes('Material-UI: The `css` function') ||
        message.includes('act(...) is not supported')
      )
    ) {
      return
    }
    
    // Mostrar outros erros normalmente
    originalConsoleError(...args)
  }
  
  console.warn = (...args) => {
    const message = args[0]
    
    // Ignorar warnings específicos
    if (
      typeof message === 'string' &&
      (
        message.includes('deprecated') ||
        message.includes('Material-UI:')
      )
    ) {
      return
    }
    
    originalConsoleWarn(...args)
  }
})

// Restaurar console após cada teste
afterEach(() => {
  console.error = originalConsoleError
  console.warn = originalConsoleWarn
  
  // Limpar mocks entre testes
  jest.clearAllMocks()
  
  // Limpar localStorage e sessionStorage
  localStorageMock.clear()
  sessionStorageMock.clear()
  
  // Resetar fetch mock
  fetch.mockClear()
})

// Configuração global para testes de Material-UI
// Evita problemas com animações em testes
if (typeof window !== 'undefined') {
  // Desabilitar animações CSS
  const style = document.createElement('style')
  style.innerHTML = `
    *, *::before, *::after {
      animation-duration: 0s !important;
      animation-delay: 0s !important;
      transition-duration: 0s !important;
      transition-delay: 0s !important;
    }
  `
  document.head.appendChild(style)
}

// Polyfill para TextEncoder/TextDecoder se necessário
if (typeof TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util')
  global.TextEncoder = TextEncoder
  global.TextDecoder = TextDecoder
}

// Helper global para aguardar próximo tick
global.nextTick = () => new Promise(resolve => setTimeout(resolve, 0))

// Helper global para aguardar múltiplos ticks
global.waitFor = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms))

// Configuração para debugging de testes
if (process.env.DEBUG_TESTS) {
  // Log de início e fim de testes para debugging
  beforeEach(() => {
    console.log(`🧪 Iniciando teste: ${expect.getState().currentTestName}`)
  })
  
  afterEach(() => {
    console.log(`✅ Finalizando teste: ${expect.getState().currentTestName}`)
  })
}

// Matchers customizados adicionais
expect.extend({
  /**
   * Verifica se elemento tem classe CSS específica
   */
  toHaveClass(received, className) {
    const pass = received.classList?.contains(className) || false
    
    return {
      pass,
      message: () =>
        pass
          ? `Expected element not to have class "${className}"`
          : `Expected element to have class "${className}"`
    }
  },
  
  /**
   * Verifica se array está ordenado
   */
  toBeSorted(received, compareFn) {
    const sorted = [...received].sort(compareFn)
    const pass = JSON.stringify(received) === JSON.stringify(sorted)
    
    return {
      pass,
      message: () =>
        pass
          ? 'Expected array not to be sorted'
          : 'Expected array to be sorted'
    }
  },
  
  /**
   * Verifica se valor está dentro de range
   */
  toBeWithinRange(received, min, max) {
    const pass = received >= min && received <= max
    
    return {
      pass,
      message: () =>
        pass
          ? `Expected ${received} not to be within range ${min}-${max}`
          : `Expected ${received} to be within range ${min}-${max}`
    }
  }
})