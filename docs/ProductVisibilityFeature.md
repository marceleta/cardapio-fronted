# Funcionalidade: Controle de Visibilidade de Produtos no Cardápio

## 📋 Visão Geral

Implementada funcionalidade para controlar se um produto será exibido ou não no cardápio público para os clientes. Esta funcionalidade está disponível tanto na criação quanto na edição de produtos.

## 🔧 Implementação

### Campos Adicionados

**ProductDialog.js:**
- Campo `visibleInMenu` (boolean) no estado do formulário
- Switch para controlar a visibilidade
- Valor padrão: `true` (produto visível por padrão)
- Texto explicativo dinâmico baseado no estado

**ProductsSection.js:**
- Indicadores visuais de visibilidade nos cards e tabela
- Chips com ícones "Visível" / "Oculto"
- Opacidade reduzida para produtos ocultos
- Borda tracejada para produtos ocultos (modo cards)

### Interface do Switch

```javascript
<FormControlLabel
  control={
    <Switch
      checked={formData.visibleInMenu}
      onChange={(e) => setFormData({ ...formData, visibleInMenu: e.target.checked })}
      color="primary"
    />
  }
  label={
    <Box>
      <Typography variant="body1">
        Exibir no cardápio para clientes
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {formData.visibleInMenu 
          ? "O produto será visível no cardápio público" 
          : "O produto ficará oculto para os clientes"
        }
      </Typography>
    </Box>
  }
/>
```

## 🎨 Indicadores Visuais

### Cards de Produtos
- **Visível**: Chip verde com ícone de olho aberto
- **Oculto**: Chip cinza com ícone de olho fechado, opacidade 70%, borda tracejada

### Tabela de Produtos
- **Visível**: Chip "Visível no cardápio" (verde)
- **Oculto**: Chip "Oculto do cardápio" (cinza), linha com fundo levemente acinzentado

## 📊 Estrutura de Dados

```javascript
// Estrutura do produto com o novo campo
{
  id: 1,
  name: "Pizza Margherita",
  description: "Pizza clássica com molho e queijo",
  price: 25.90,
  category: "Pizzas",
  imageUrl: "https://exemplo.com/pizza.jpg",
  visibleInMenu: true // ← Novo campo
}
```

## 🔄 Compatibilidade

- **Produtos existentes**: Se `visibleInMenu` for `undefined`, o produto é tratado como visível (`true`)
- **Valores padrão**: Novos produtos têm `visibleInMenu: true` por padrão
- **Retrocompatibilidade**: Produtos sem este campo continuam funcionando normalmente

## 🧪 Testes

Atualizados os testes do `ProductDialog` para incluir:
- Verificação do campo de visibilidade
- Estado padrão do switch (marcado)
- Preenchimento correto em edição
- Submissão com valor de visibilidade

## 💡 Casos de Uso

1. **Produtos sazonais**: Ocultar produtos fora de temporada
2. **Produtos em falta**: Ocultar produtos indisponíveis temporariamente
3. **Produtos em teste**: Ocultar produtos em fase de teste
4. **Produtos administrativos**: Ocultar itens usados apenas internamente

## 🎯 Benefícios

- ✅ Controle granular sobre o que é exibido aos clientes
- ✅ Não necessita deletar produtos temporariamente indisponíveis
- ✅ Interface intuitiva com feedback visual claro
- ✅ Compatibilidade com produtos existentes
- ✅ Fácil identificação visual no painel admin

---

**Data de Implementação**: 20 de agosto de 2025
**Desenvolvedor**: GitHub Copilot
**Status**: ✅ Concluído e testado
