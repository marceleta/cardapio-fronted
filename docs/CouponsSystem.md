# 💳 Sistema de Cupons de Desconto

## 📋 Visão Geral

O sistema de cupons de desconto foi desenvolvido seguindo os padrões estabelecidos em `CODING_STANDARDS.md` e `UI_STANDARDS.md`. Oferece funcionalidades completas de CRUD com validações específicas para diferentes tipos de cupons promocionais.

## 🚀 Funcionalidades Principais

### ✅ **Gerenciamento Completo**
- ✅ Criação de novos cupons
- ✅ Edição de cupons existentes
- ✅ Exclusão com confirmação
- ✅ Ativação/desativação rápida
- ✅ Validação em tempo real

### 💰 **Tipos de Desconto**
- **Porcentagem**: Desconto percentual sobre o valor total
- **Valor Fixo**: Desconto de valor fixo em reais

### 📅 **Configurações de Validade**
- **Período de Validade**: Data de início e fim
- **Dias da Semana Ativos**: Configuração específica de dias
- **Primeira Compra**: Cupons exclusivos para novos clientes

### 🎯 **Controles Avançados**
- **Valor Mínimo do Pedido**: Limite mínimo para usar o cupom
- **Desconto Máximo**: Limite máximo de desconto (para porcentagens)
- **Limite de Uso**: Controle de quantas vezes pode ser usado
- **Códigos Únicos**: Validação de códigos únicos no sistema

## 🏗️ Arquitetura do Sistema

### 📁 **Estrutura de Arquivos**

```
src/
├── hooks/
│   ├── useCouponsManager.js          # Hook principal de gerenciamento
│   └── __tests__/
│       └── useCouponsManager.test.js # Testes do hook
├── components/admin/
│   ├── sections/
│   │   ├── CouponsSection.js         # Componente principal da seção
│   │   └── __tests__/
│   │       └── CouponsSection.test.js # Testes do componente
│   └── dialogs/
│       ├── CouponDialog.js           # Modal de criação/edição
│       └── DeleteConfirmDialog.js    # Modal de confirmação
└── test-utils/
    └── index.js                      # Utilitários de teste (createMockCoupon)
```

### 🎯 **Componentes Principais**

#### 1. **useCouponsManager** (Hook)
```javascript
// Responsabilidades:
- Gerenciamento de estado dos cupons
- Operações CRUD (Create, Read, Update, Delete)
- Validações de dados
- Controle de diálogos
- Filtros e busca
- Cálculo de estatísticas
```

#### 2. **CouponsSection** (Componente)
```javascript
// Responsabilidades:
- Interface principal da seção
- Exibição de tabela de cupons
- Cards de estatísticas
- Controles de busca e filtros
- Integração com diálogos modais
```

#### 3. **CouponDialog** (Modal)
```javascript
// Responsabilidades:
- Formulário de criação/edição
- Validação em tempo real
- Preview do cupom
- Configurações avançadas
```

## 📊 **Modelo de Dados**

### 🎫 **Estrutura do Cupom**

```javascript
{
  id: number,                    // Identificador único
  code: string,                  // Código do cupom (ex: "BEMVINDO10")
  description: string,           // Descrição para o cliente
  type: 'percentage' | 'fixed_amount', // Tipo de desconto
  value: number,                 // Valor do desconto
  minOrderValue: number,         // Valor mínimo do pedido
  maxDiscount: number | null,    // Desconto máximo (apenas para %)
  startDate: string,             // Data de início (ISO)
  endDate: string,               // Data de fim (ISO)
  isActive: boolean,             // Status ativo/inativo
  firstPurchaseOnly: boolean,    // Apenas primeira compra
  activeDays: number[],          // Dias da semana [0-6] (0=Dom)
  usageLimit: number | null,     // Limite de uso
  currentUsage: number,          // Uso atual
  createdAt: string,             // Data de criação
  updatedAt: string              // Última atualização
}
```

### 📈 **Estatísticas Calculadas**

```javascript
{
  total: number,              // Total de cupons
  active: number,             // Cupons ativos
  expired: number,            // Cupons expirados
  firstPurchaseOnly: number,  // Cupons para primeira compra
  totalUsage: number          // Total de usos
}
```

## 🎨 **Interface do Usuário**

### 🎯 **Cards de Estatísticas**
- **Total de Cupons**: Contador geral
- **Cupons Ativos**: Cupons disponíveis para uso
- **Primeira Compra**: Cupons exclusivos para novos clientes
- **Total de Usos**: Quantidade total de resgates

### 📋 **Tabela de Cupons**
- **Código e Status**: Código do cupom com chips de status
- **Descrição**: Descrição detalhada
- **Desconto**: Valor formatado (% ou R$)
- **Validade**: Período de uso com dias restantes
- **Dias Ativos**: Chips dos dias da semana
- **Uso**: Contador de uso com porcentagem
- **Ações**: Botões de editar, excluir e toggle status

### 🔍 **Sistema de Busca**
- Busca por código do cupom
- Busca por descrição
- Filtros em tempo real

## ⚙️ **Validações Implementadas**

### ✅ **Validações de Código**
```javascript
- Obrigatório
- Mínimo 3 caracteres
- Apenas letras maiúsculas e números
- Código único no sistema
```

### ✅ **Validações de Valor**
```javascript
- Maior que zero
- Porcentagem não pode exceder 100%
- Valor mínimo deve ser positivo
- Desconto máximo deve ser positivo
```

### ✅ **Validações de Data**
```javascript
- Data de início obrigatória
- Data de fim obrigatória
- Data de fim posterior à data de início
- Data de fim não pode ser no passado
```

### ✅ **Validações Adicionais**
```javascript
- Pelo menos um dia da semana ativo
- Limite de uso deve ser positivo
- Descrição mínima de 10 caracteres
```

## 🧪 **Testes Implementados**

### 🎯 **Cobertura de Testes**

#### **Hook (useCouponsManager)**
- ✅ Estado inicial
- ✅ Operações CRUD
- ✅ Validações de dados
- ✅ Filtros e busca
- ✅ Controle de diálogos
- ✅ Tratamento de erros
- ✅ Cálculo de estatísticas

#### **Componente (CouponsSection)**
- ✅ Renderização básica
- ✅ Estados (loading, erro, vazio)
- ✅ Interações do usuário
- ✅ Exibição de dados
- ✅ Formatação de valores
- ✅ Controle de diálogos

### 🚀 **Comandos de Teste**

```bash
# Testar apenas cupons
npm test useCouponsManager
npm test CouponsSection

# Testar com cobertura
npm run test:coverage -- --testPathPattern=coupons

# Testar em modo watch
npm run test:watch -- useCoupons
```

## 📱 **Responsividade**

### 🎨 **Breakpoints Suportados**
- **xs (0px+)**: Layout empilhado, botões full-width
- **sm (600px+)**: Cards em grid 2x2
- **md (900px+)**: Layout completo, 4 cards por linha
- **lg (1200px+)**: Espaçamento otimizado

### 📋 **Adaptações Mobile**
- Tabela com scroll horizontal
- Chips responsivos
- Botões com tamanho otimizado
- Diálogos full-screen em mobile

## ♿ **Acessibilidade**

### ✅ **Recursos Implementados**
- Labels descritivos em todos os campos
- Navegação por teclado completa
- Contraste adequado de cores
- Feedback de erro claro
- Tooltips informativos
- ARIA labels apropriados

### 🎯 **Conformidade WCAG 2.1**
- ✅ Nível AA de contraste
- ✅ Navegação por teclado
- ✅ Leitores de tela compatíveis
- ✅ Foco visível
- ✅ Textos alternativos

## 🔧 **Como Usar**

### 1. **Acessar a Seção**
```
Admin Panel → Menu Lateral → Cupons
```

### 2. **Criar Novo Cupom**
```
1. Clicar em "Novo Cupom"
2. Preencher informações básicas
3. Configurar desconto e limites
4. Definir período de validade
5. Selecionar dias ativos
6. Salvar cupom
```

### 3. **Editar Cupom Existente**
```
1. Localizar cupom na tabela
2. Clicar no ícone de editar
3. Modificar campos desejados
4. Salvar alterações
```

### 4. **Gerenciar Status**
```
- Toggle rápido: Clicar no ícone de visibilidade
- Excluir: Clicar no ícone de lixeira e confirmar
- Buscar: Usar campo de busca no topo
```

## 🎯 **Exemplos de Uso**

### 💡 **Cupom de Boas-vindas**
```javascript
{
  code: "BEMVINDO10",
  description: "Desconto de 10% para novos clientes",
  type: "percentage",
  value: 10,
  minOrderValue: 30.00,
  maxDiscount: 20.00,
  firstPurchaseOnly: true,
  activeDays: [1,2,3,4,5,6,0] // Todos os dias
}
```

### 🍕 **Promoção de Quinta-feira**
```javascript
{
  code: "QUINTA15",
  description: "15% de desconto todas as quintas",
  type: "percentage",
  value: 15,
  minOrderValue: 50.00,
  maxDiscount: 25.00,
  firstPurchaseOnly: false,
  activeDays: [4] // Apenas quintas
}
```

### 💰 **Desconto Fixo Final de Semana**
```javascript
{
  code: "WEEKEND20",
  description: "R$ 20 de desconto no fim de semana",
  type: "fixed_amount",
  value: 20.00,
  minOrderValue: 80.00,
  firstPurchaseOnly: false,
  activeDays: [5,6,0] // Sex, Sáb, Dom
}
```

## 🚀 **Próximas Funcionalidades**

### 🔮 **Roadmap Futuro**
- [ ] **Integração com API Real**: Conectar com backend
- [ ] **Relatórios de Uso**: Analytics de performance dos cupons
- [ ] **Cupons Automáticos**: Geração baseada em regras
- [ ] **Categorias de Produtos**: Cupons específicos por categoria
- [ ] **Clientes Específicos**: Cupons direcionados
- [ ] **Múltiplos Restaurantes**: Suporte a multi-tenant

### 🎯 **Melhorias Planejadas**
- [ ] **Export/Import**: Backup e restauração de cupons
- [ ] **Templates**: Modelos pré-definidos de cupons
- [ ] **Notificações**: Alertas de cupons expirando
- [ ] **A/B Testing**: Comparação de performance
- [ ] **API de Validação**: Endpoint para validar cupons
- [ ] **Histórico**: Log de alterações nos cupons

## 📚 **Recursos Técnicos**

### 🛠️ **Dependências Principais**
- **React 18+**: Framework base
- **Material-UI v5**: Componentes de interface
- **React Hooks**: Gerenciamento de estado
- **Jest + Testing Library**: Testes automatizados

### 🎨 **Padrões Seguidos**
- **CODING_STANDARDS.md**: Estrutura e documentação
- **UI_STANDARDS.md**: Interface e experiência
- **Modularidade**: Componentes reutilizáveis
- **Testabilidade**: 90%+ de cobertura
- **Acessibilidade**: WCAG 2.1 AA
- **Responsividade**: Mobile-first

---

*Sistema desenvolvido seguindo as melhores práticas de desenvolvimento e design, garantindo qualidade, manutenibilidade e excelente experiência do usuário.* 🎯✨
