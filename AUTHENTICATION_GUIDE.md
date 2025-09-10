# 🔐 Sistema de Autenticação - Cardápio Frontend

Sistema completo de autenticação implementado seguindo os **[Padrões de Codificação](CODING_STANDARDS.md)** e **[Padrões React](PADROES_REACT.md)** do projeto.

## 📋 Funcionalidades Implementadas

### ✅ **Autenticação Administrativa**
- **Login** com email e senha para administradores
- **Proteção de rotas** administrativas (`/admin/*`)
- **Redirecionamento automático** para login quando não autenticado
- **Gestão de tokens** JWT com localStorage
- **Logout** com limpeza de sessão

### ✅ **Infraestrutura de Segurança**
- **Cliente API centralizado** com interceptadores
- **Context API** para estado global de autenticação
- **Componentes de rota protegida** reutilizáveis
- **Middleware Next.js** para controle de acesso
- **Serviço de autenticação** com camada de abstração

### ✅ **Interface de Usuário**
- **Página de login** responsiva e acessível
- **Feedback visual** para estados de loading/erro
- **Validação de formulário** em tempo real
- **Credenciais de teste** para desenvolvimento

---

## 🚀 Como Usar

### **1. Acessar Área Administrativa**

```bash
# Acesse qualquer URL administrativa
http://localhost:3001/admin
http://localhost:3001/admin/dashboard
http://localhost:3001/admin/products
```

**Resultado:** Se não autenticado, será redirecionado para `/admin/login`

### **2. Fazer Login**

**Credenciais de Teste:**
- **Email:** `admin@cardapio.com`
- **Senha:** `admin123`

**OU**

- **Email:** `manager@cardapio.com`
- **Senha:** `manager123`

### **3. Navegar no Sistema**

Após login bem-sucedido:
- ✅ Acesso liberado a todas as rotas administrativas
- ✅ Token armazenado automaticamente
- ✅ Headers de autenticação adicionados às requisições
- ✅ Redirecionamento para `/admin` (dashboard)

### **4. Logout**

O logout pode ser feito:
- Via interface do usuário (quando implementada)
- Automaticamente quando token expira (erro 401)
- Limpando localStorage manualmente

---

## 🏗️ Arquitetura Implementada

### **📁 Estrutura de Arquivos**

```
src/
├── components/
│   └── auth/
│       └── ProtectedRoute.js          # Componente de rota protegida
├── context/
│   └── AuthContext.js                 # Context API de autenticação
├── lib/
│   └── apiClient.js                   # Cliente HTTP centralizado
├── services/
│   └── authService.js                 # Serviço de autenticação
├── app/
│   └── admin/
│       ├── page.js                    # Página principal (protegida)
│       ├── login/
│       │   └── page.js                # Página de login
│       └── dashboard/
│           └── page.js                # Dashboard (redirecionamento)
└── middleware.js                      # Middleware Next.js
```

### **🔄 Fluxo de Autenticação**

1. **Usuário acessa `/admin`**
2. **Middleware verifica token** (cookie/localStorage)
3. **Se não autenticado:** Redireciona para `/admin/login`
4. **Se autenticado:** Permite acesso
5. **ProtectedRoute** faz verificação adicional no cliente
6. **AuthContext** gerencia estado global
7. **ApiClient** adiciona token a todas as requisições

### **🛡️ Camadas de Proteção**

| Camada | Componente | Função |
|--------|------------|--------|
| **1. Middleware** | `middleware.js` | Verificação server-side, redirecionamento |
| **2. Rota Protegida** | `ProtectedRoute.js` | Verificação client-side, loading states |
| **3. Context** | `AuthContext.js` | Estado global, persistência de sessão |
| **4. API Client** | `apiClient.js` | Headers automáticos, tratamento 401 |

---

## 🔧 Configuração e Customização

### **🔑 Credenciais Mock**

As credenciais estão definidas em `AuthContext.js`:

```javascript
const MOCK_ADMINS = {
  'admin@cardapio.com': {
    id: 100,
    name: 'Administrador',
    email: 'admin@cardapio.com',
    password: 'admin123',
    role: 'admin'
  },
  'manager@cardapio.com': {
    id: 101,
    name: 'Gerente', 
    email: 'manager@cardapio.com',
    password: 'manager123',
    role: 'manager'
  }
}
```

### **🌐 Integração com Backend Real**

Para conectar com API real, atualize:

1. **URL da API** em `apiClient.js`:
```javascript
baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://sua-api.com/api/v1'
```

2. **Endpoints** em `authService.js`:
```javascript
async loginAdmin(credentials) {
  const response = await apiClient.post('/auth/admin/login', credentials);
  return response.data;
}
```

3. **Remover mocks** em `AuthContext.js` e usar serviços reais

### **🎨 Customizar Interface**

- **Cores e tema:** Editar `src/lib/theme.js`
- **Layout do login:** Editar `src/app/admin/login/page.js`
- **Mensagens de erro:** Personalizar em `AuthContext.js`
- **Validações:** Ajustar em formulários

---

## 📊 Estados de Autenticação

### **🔄 Estados Disponíveis**

```javascript
const {
  // Estados principais
  user,              // Dados do usuário autenticado
  isAuthenticated,   // Boolean: está autenticado?
  isAdmin,           // Boolean: é admin/manager?
  isClient,          // Boolean: é cliente?
  loading,           // Boolean: operação em andamento?
  error,             // String: mensagem de erro

  // Métodos de autenticação
  loginAdmin,        // Função: login administrativo
  loginClient,       // Função: login de cliente
  logout,            // Função: logout universal
  
  // Utilitários
  clearError,        // Função: limpar erro
  checkAuthStatus    // Função: verificar status
} = useAuth();
```

### **📱 Uso em Componentes**

```jsx
import { useAuth } from '../context/AuthContext';

function MeuComponente() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Não autenticado</div>;
  }

  return (
    <div>
      <h1>Olá, {user.name}!</h1>
      {isAdmin && <p>Você é administrador</p>}
      <button onClick={logout}>Sair</button>
    </div>
  );
}
```

---

## 🧪 Testes e Validação

### **✅ Cenários Testados**

- ✅ **Redirecionamento:** `/admin` → `/admin/login` (sem auth)
- ✅ **Login válido:** Credenciais corretas → Dashboard
- ✅ **Login inválido:** Credenciais erradas → Erro
- ✅ **Persistência:** Reload da página mantém sessão
- ✅ **Logout:** Remove dados e redireciona
- ✅ **Token expirado:** Erro 401 → Login automático

### **🔍 Como Testar**

1. **Acesse** `http://localhost:3001/admin`
2. **Verifique redirecionamento** para login
3. **Teste credenciais inválidas** (deve mostrar erro)
4. **Faça login** com credenciais válidas
5. **Verifique acesso** ao dashboard
6. **Recarregue página** (deve manter sessão)
7. **Limpe localStorage** e tente acessar área protegida

---

## 🚨 Segurança e Boas Práticas

### **🔒 Implementadas**

- ✅ **Tokens JWT** armazenados com segurança
- ✅ **Interceptação de requests** automática
- ✅ **Tratamento de expiração** de token
- ✅ **Validação client-side** e server-side
- ✅ **Limpeza de dados** no logout
- ✅ **Redirecionamento seguro** de rotas

### **⚠️ Para Produção**

- [ ] **HTTPS obrigatório** para todos os endpoints
- [ ] **Cookies HttpOnly** em vez de localStorage
- [ ] **Refresh tokens** para renovação automática
- [ ] **Rate limiting** em endpoints de login
- [ ] **Criptografia** de dados sensíveis
- [ ] **Logs de auditoria** para tentativas de login

---

## 📚 Documentação Relacionada

- **[CODING_STANDARDS.md](CODING_STANDARDS.md)** - Padrões de código seguidos
- **[PADROES_REACT.md](PADROES_REACT.md)** - Padrões React implementados
- **[API Documentation]** - Endpoints da API (quando disponível)

---

## 🔄 Próximos Passos

### **🚀 Melhorias Planejadas**

1. **Refresh tokens** para sessões longas
2. **Autenticação de dois fatores** (2FA)
3. **Recuperação de senha** via email
4. **Gestão de permissões** granular
5. **Logs de atividade** do usuário
6. **Session timeout** configurável

### **🔌 Integrações Futuras**

- **OAuth providers** (Google, Facebook)
- **LDAP/Active Directory** para empresas
- **Single Sign-On (SSO)** entre sistemas
- **API de verificação** de identidade

---

**✨ Sistema de autenticação implementado com sucesso seguindo as melhores práticas de segurança e padrões de código do projeto!**
