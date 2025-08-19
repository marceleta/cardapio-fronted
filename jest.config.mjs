/**
 * CONFIGURAÇÃO DO JEST - TESTES MODULARES COM NEXT.JS
 * 
 * Configuração personalizada do Jest seguindo as diretrizes
 * de testes modulares e bem documentados, integrada com Next.js.
 * 
 * Funcionalidades:
 * - Ambiente de teste configurado para React/Next.js
 * - Cobertura de código detalhada
 * - Mocks automáticos para assets
 * - Helpers de teste personalizados
 * - Relatórios de qualidade
 */

import nextJest from 'next/jest.js'
 
const createJestConfig = nextJest({
  // Caminho para aplicação Next.js para carregar configurações
  dir: './',
})
 
// Configuração personalizada para Jest
const config = {
  // Provider de cobertura mais eficiente
  coverageProvider: 'v8',
  
  // Ambiente de teste para aplicações React/Next.js
  testEnvironment: 'jsdom',
  
  // Arquivos de setup executados antes dos testes
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // Padrões de arquivos de teste
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}'
  ],
  
  // Configuração de cobertura de código
  collectCoverage: true,
  collectCoverageFrom: [
    // Incluir todos arquivos React/JavaScript
    'src/**/*.{js,jsx,ts,tsx}',
    
    // Excluir arquivos desnecessários
    '!src/app/layout.js',
    '!src/app/page.js',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/test-utils/**',
    '!src/**/__tests__/**',
    '!src/**/*.{test,spec}.{js,jsx,ts,tsx}'
  ],
  
  // Diretório para relatórios de cobertura
  coverageDirectory: 'coverage',
  
  // Formatos de relatório de cobertura
  coverageReporters: [
    'text',          // Relatório no terminal
    'lcov',          // Para ferramentas como SonarQube
    'html',          // Relatório visual
    'json-summary'   // Resumo em JSON
  ],
  
  // Limites mínimos de cobertura por tipo de arquivo
  coverageThreshold: {
    global: {
      branches: 70,    // 70% das ramificações
      functions: 75,   // 75% das funções
      lines: 80,       // 80% das linhas
      statements: 80   // 80% das declarações
    },
    
    // Componentes devem ter alta cobertura
    './src/components/**/*.{js,jsx}': {
      branches: 75,
      functions: 80,
      lines: 85,
      statements: 85
    },
    
    // Hooks precisam de cobertura quase completa
    './src/hooks/**/*.{js,jsx}': {
      branches: 80,
      functions: 85,
      lines: 90,
      statements: 90
    },
    
    // Utilitários devem ter cobertura máxima
    './src/utils/**/*.{js,jsx}': {
      branches: 85,
      functions: 90,
      lines: 95,
      statements: 95
    }
  },
  
  // Mapeamento de módulos para facilitar imports
  moduleNameMapping: {
    // Aliases para imports mais limpos
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@test-utils/(.*)$': '<rootDir>/src/test-utils/$1',
    '^@lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@context/(.*)$': '<rootDir>/src/context/$1',
    
    // Mock para assets estáticos
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/src/test-utils/fileMock.js'
  },
  
  // Timeout padrão para testes
  testTimeout: 10000,
  
  // Configuração detalhada de logs
  verbose: true,
  
  // Limpeza automática de mocks
  clearMocks: true,
  restoreMocks: true,
  
  // Configuração para diferentes tipos de teste
  projects: [
    {
      displayName: '🧪 Unit Tests',
      testMatch: [
        '<rootDir>/src/**/__tests__/**/*.test.{js,jsx}',
        '<rootDir>/src/**/?(*.)(test).{js,jsx}'
      ],
      testEnvironment: 'jsdom'
    },
    {
      displayName: '🔗 Integration Tests', 
      testMatch: [
        '<rootDir>/src/**/__tests__/**/*.integration.{js,jsx}',
        '<rootDir>/src/**/?(*.)(integration).{js,jsx}'
      ],
      testEnvironment: 'jsdom',
      testTimeout: 30000
    },
    {
      displayName: '⚡ Component Tests',
      testMatch: [
        '<rootDir>/src/components/**/__tests__/**/*.{js,jsx}',
        '<rootDir>/src/components/**/*.{test,spec}.{js,jsx}'
      ],
      testEnvironment: 'jsdom'
    }
  ],
  
  // Configuração de performance
  maxWorkers: '50%',
  cache: true,
  
  // Plugins para modo watch
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ],
  
  // Ignorar durante watch mode
  watchPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/coverage/',
    '<rootDir>/.next/',
    '<rootDir>/out/'
  ],
  
  // Configurações avançadas para debugging
  detectOpenHandles: true,
  errorOnDeprecated: true,
  
  // Notificações (desabilitadas por padrão)
  notify: false,
  
  // Configurações específicas para Next.js
  transform: {
    // Next.js já cuida das transformações
  }
}
 
// Exporta configuração integrada com Next.js
export default createJestConfig(config)