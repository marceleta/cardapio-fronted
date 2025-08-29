# Sistema de Checkout - Do "Finalizar Pedido" ao Envio no WhatsApp

Este documento descreve a implementação completa do fluxo de checkout conforme especificação detalhada.

## Fluxo Implementado

### Passo 1: Verificação de Autenticação do Cliente
**Arquivo:** `src/components/checkout/steps/AuthStep.js`

- ✅ Cliente logado: Prossegue para Passo 2
- ✅ Cliente não logado: Redirecionamento para página de login/cadastro
- ✅ Campos: "Número do WhatsApp" e "Senha"
- ✅ Link "Não tenho cadastro" para formulário de registro rápido
- ✅ Após login/cadastro: Redirecionamento para Passo 2

### Passo 2: Escolha do Tipo de Entrega
**Arquivo:** `src/components/checkout/steps/DeliveryStep.js`

#### Opção A: Delivery (Entrega em domicílio)
- ✅ Verificação de endereço salvo
- ✅ Se tem endereço: "Entregar neste endereço?" com opções para escolher outro
- ✅ Se não tem: Formulário com CEP, Rua, Número, Complemento, Bairro, Ponto de Referência
- ✅ Cálculo e exibição da taxa de entrega

#### Opção B: Retirar no Local (Takeaway)
- ✅ Exibição do endereço do restaurante
- ✅ Estimativa de tempo de preparo (30-40 minutos)

### Passo 3: Seleção da Forma de Pagamento
**Arquivo:** `src/components/checkout/steps/PaymentStep.js`

- ✅ Cartão de Crédito (na entrega/retirada)
- ✅ Cartão de Débito (na entrega/retirada)
- ✅ PIX
- ✅ Dinheiro
- ✅ **Funcionalidade Essencial:** Campo "Precisa de troco para quanto?" quando dinheiro selecionado

### Passo 4: Resumo Final e Confirmação
**Arquivo:** `src/components/checkout/steps/SummaryStep.js`

#### Exibição completa:
- ✅ **Seus Itens:** Lista detalhada de produtos, quantidade e preço
- ✅ **Endereço:** Endereço completo ou "Retirada no Local"
- ✅ **Pagamento:** Forma escolhida + informação de troco
- ✅ **Resumo Financeiro:**
  - Subtotal (soma dos produtos)
  - Taxa de Entrega
  - Total a Pagar (valor final destacado)
- ✅ **Botão:** "Confirmar e Enviar Pedido via WhatsApp"

### Passo 5: Geração da Mensagem e Redirecionamento
**Arquivo:** `src/context/CheckoutContext.js`

#### Backend (Geração da mensagem):
```
*🍔 NOVO PEDIDO - BURGUESIA 🍔*

*Cliente:* NOME_DO_CLIENTE
*Contato:* NUMERO_WHATSAPP_CLIENTE

*-- ITENS DO PEDIDO --*
- 1x X-Tudo (R$ 25,00)
  _Obs: Sem cebola_
- 2x Batata Frita G (R$ 30,00)
- 1x Coca-Cola Lata (R$ 5,00)

*-- ENTREGA --*
*Tipo:* Delivery
*Endereço:* Rua das Flores, 123, Apto 45, Centro
*Referência:* Próximo à praça

*-- PAGAMENTO --*
*Forma:* Dinheiro
*Troco para:* R$ 100,00

-----------------------------
*Subtotal:* R$ 60,00
*Taxa de Entrega:* R$ 5,00
*TOTAL DO PEDIDO:* *R$ 65,00*
```

#### Frontend (Redirecionamento):
- ✅ URL: `https://wa.me/55NUMERODORESTAURANTE?text=TEXTO_CODIFICADO`
- ✅ Texto codificado com URL Encoder
- ✅ Abre WhatsApp com mensagem já digitada
- ✅ Cliente só precisa apertar "Enviar"

### Passo 6: Página de Sucesso (Pós-Redirecionamento)
**Arquivo:** `src/components/checkout/steps/SuccessStep.js`

- ✅ Mensagem: "Quase lá! Seu pedido foi montado. Não se esqueça de clicar em 'Enviar' no seu WhatsApp"
- ✅ Exibição opcional do resumo do pedido
- ✅ **Ação do Sistema:** Carrinho limpo após envio

## Estrutura de Arquivos

```
src/
├── app/
│   └── checkout/
│       └── page.js                 # Página principal de checkout
├── components/
│   └── checkout/
│       ├── CheckoutFlow.js         # Orquestrador do fluxo
│       ├── CheckoutButton.js       # Botão "Finalizar Pedido"
│       └── steps/
│           ├── AuthStep.js         # Passo 1: Autenticação
│           ├── DeliveryStep.js     # Passo 2: Tipo de entrega
│           ├── PaymentStep.js      # Passo 3: Forma de pagamento
│           ├── SummaryStep.js      # Passo 4: Resumo e confirmação
│           └── SuccessStep.js      # Passo 6: Página de sucesso
└── context/
    ├── CheckoutContext.js          # Gerenciamento do fluxo
    └── AuthContext.js              # Sistema de autenticação
```

## Como Usar

### 1. Integração no Carrinho
```jsx
import CheckoutButton from '../components/checkout/CheckoutButton';

// No componente do carrinho
<CheckoutButton>
  Finalizar Pedido
</CheckoutButton>
```

### 2. Configuração de Variáveis de Ambiente
```env
NEXT_PUBLIC_RESTAURANT_NAME=BURGUESIA
NEXT_PUBLIC_RESTAURANT_WHATSAPP=5511999998888
NEXT_PUBLIC_RESTAURANT_PHONE=(11) 99999-8888
```

### 3. Acesso à Página de Checkout
- URL: `/checkout`
- Automaticamente verifica carrinho e autenticação
- Guia o usuário pelos 6 passos sequenciais

## Funcionalidades Especiais

### Campo de Troco (Dinheiro)
- Aparece automaticamente quando "Dinheiro" é selecionado
- Validação: valor deve ser maior que o total do pedido
- Informação incluída na mensagem do WhatsApp

### Gerenciamento de Endereços
- Salva endereços do usuário
- Oferece endereços salvos para seleção rápida
- Permite adicionar novos endereços

### Sistema de Autenticação
- Mock database para desenvolvimento
- Suporte a login e cadastro
- Sessão persistente no localStorage

### Responsividade
- Interface adaptada para mobile e desktop
- Stepper de progresso
- Validações em tempo real

## Estados do Fluxo

1. `auth` - Verificação de autenticação
2. `delivery` - Escolha do tipo de entrega
3. `payment` - Seleção da forma de pagamento
4. `summary` - Resumo final e confirmação
5. `success` - Página de sucesso

## Observações Importantes

- O sistema não processa pagamentos online (conforme especificação)
- Todas as formas de pagamento são processadas na entrega/retirada
- A mensagem do WhatsApp segue exatamente o formato especificado
- O carrinho é limpo apenas após o envio bem-sucedido para o WhatsApp
