/**
 * MOCK DE ARQUIVOS ESTÁTICOS - TESTES
 * 
 * Mock para arquivos de assets (imagens, ícones, etc.) usado durante testes.
 * Retorna string simples ao invés de tentar processar arquivos binários.
 */

// Mock simples para arquivos de imagem e assets
module.exports = 'test-file-stub'

// Para casos onde é necessário um objeto com propriedades
module.exports.default = 'test-file-stub'

// Mock para SVGs que podem ser usados como componentes React
module.exports.ReactComponent = 'svg'
