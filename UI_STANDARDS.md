# 🎨 UI Standards - Padrões de Interface do Usuário

## 📋 Índice
- [Princípios Fundamentais](#princípios-fundamentais)
- [Design System](#design-system)
- [Layouts e Estrutura](#layouts-e-estrutura)
- [Componentes Visuais](#componentes-visuais)
- [Interatividade](#interatividade)
- [Responsividade](#responsividade)
- [Acessibilidade](#acessibilidade)
- [Performance Visual](#performance-visual)
- [Microinterações](#microinterações)
- [Padrões Específicos](#padrões-específicos)

---

## 🎯 Princípios Fundamentais

### 1. Clareza e Simplicidade
```javascript
// ✅ BOM: Interface clara e focada
<Button variant="contained" color="primary">
  Salvar Cliente
</Button>

// ❌ EVITAR: Muitos elementos visuais
<Button 
  variant="contained" 
  color="primary"
  startIcon={<SaveIcon />}
  endIcon={<CheckIcon />}
  sx={{ 
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    animation: 'pulse 2s infinite'
  }}
>
  💾 Salvar Cliente ✓
</Button>
```

### 2. Consistência Visual
```javascript
// ✅ BOM: Padrão consistente de botões
const ButtonStyles = {
  primary: { variant: 'contained', color: 'primary' },
  secondary: { variant: 'outlined', color: 'primary' },
  danger: { variant: 'contained', color: 'error' }
};

// ✅ BOM: Uso consistente
<Button {...ButtonStyles.primary}>Criar</Button>
<Button {...ButtonStyles.secondary}>Cancelar</Button>
<Button {...ButtonStyles.danger}>Excluir</Button>
```

### 3. Hierarquia Visual Clara
```javascript
// ✅ BOM: Hierarquia tipográfica bem definida
<Box>
  <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
    Gestão de Clientes
  </Typography>
  <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
    Lista de Clientes Ativos
  </Typography>
  <Typography variant="body1" color="text.secondary">
    Gerencie todos os clientes cadastrados no sistema
  </Typography>
</Box>
```

---

## 🎨 Design System

### Paleta de Cores
```javascript
// Cores Primárias
const colors = {
  primary: {
    main: '#1976d2',
    light: '#42a5f5',
    dark: '#1565c0',
    contrastText: '#ffffff'
  },
  secondary: {
    main: '#dc004e',
    light: '#ff5983',
    dark: '#9a0036'
  },
  // Estados Semânticos
  success: '#2e7d32',
  warning: '#ed6c02',
  error: '#d32f2f',
  info: '#0288d1',
  // Neutros
  grey: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121'
  }
};
```

### Tipografia
```javascript
const typography = {
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  h1: { fontSize: '2.5rem', fontWeight: 300, lineHeight: 1.2 },
  h2: { fontSize: '2rem', fontWeight: 300, lineHeight: 1.2 },
  h3: { fontSize: '1.75rem', fontWeight: 400, lineHeight: 1.2 },
  h4: { fontSize: '1.5rem', fontWeight: 400, lineHeight: 1.2 },
  h5: { fontSize: '1.25rem', fontWeight: 400, lineHeight: 1.2 },
  h6: { fontSize: '1rem', fontWeight: 500, lineHeight: 1.2 },
  body1: { fontSize: '1rem', lineHeight: 1.5 },
  body2: { fontSize: '0.875rem', lineHeight: 1.5 },
  caption: { fontSize: '0.75rem', lineHeight: 1.4 }
};
```

### Espaçamentos
```javascript
// Sistema de espaçamento baseado em 8px
const spacing = {
  xs: 4,   // 4px
  sm: 8,   // 8px
  md: 16,  // 16px
  lg: 24,  // 24px
  xl: 32,  // 32px
  xxl: 48, // 48px
  xxxl: 64 // 64px
};

// ✅ BOM: Uso consistente do espaçamento
<Box sx={{ p: 3, mb: 2, mt: 1 }}> // 24px padding, 16px margin-bottom, 8px margin-top
```

---

## 📐 Layouts e Estrutura

### 1. Grid System Responsivo
```javascript
// ✅ BOM: Layout responsivo bem estruturado
<Container maxWidth="lg">
  <Grid container spacing={3}>
    <Grid item xs={12} md={8}>
      <Paper sx={{ p: 3 }}>
        <ClientsTable />
      </Paper>
    </Grid>
    <Grid item xs={12} md={4}>
      <Paper sx={{ p: 3 }}>
        <ClientsStats />
      </Paper>
    </Grid>
  </Grid>
</Container>
```

### 2. Estrutura de Cards
```javascript
// ✅ BOM: Card bem estruturado
<Card sx={{ maxWidth: 345, mb: 2 }}>
  <CardHeader
    avatar={<Avatar><PersonIcon /></Avatar>}
    title="João Silva"
    subheader="Cliente desde 15/01/2024"
    action={
      <IconButton>
        <MoreVertIcon />
      </IconButton>
    }
  />
  <CardContent>
    <Typography variant="body2" color="text.secondary">
      Informações do cliente...
    </Typography>
  </CardContent>
  <CardActions>
    <Button size="small">Visualizar</Button>
    <Button size="small">Editar</Button>
  </CardActions>
</Card>
```

### 3. Navegação e Breadcrumbs
```javascript
// ✅ BOM: Navegação clara
<Breadcrumbs separator="›" sx={{ mb: 3 }}>
  <Link href="/admin">Dashboard</Link>
  <Link href="/admin/clients">Clientes</Link>
  <Typography color="text.primary">Lista</Typography>
</Breadcrumbs>
```

---

## 🎨 Componentes Visuais

### 1. Botões com Estados Claros
```javascript
// ✅ BOM: Estados visuais bem definidos
<Button
  variant="contained"
  disabled={loading}
  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
  sx={{
    '&:hover': { transform: 'translateY(-1px)' },
    '&:disabled': { opacity: 0.6 }
  }}
>
  {loading ? 'Salvando...' : 'Salvar'}
</Button>
```

### 2. Inputs com Feedback Visual
```javascript
// ✅ BOM: Input com validação visual
<TextField
  fullWidth
  label="Nome Completo"
  value={name}
  onChange={handleNameChange}
  error={!!nameError}
  helperText={nameError || 'Digite o nome completo do cliente'}
  variant="outlined"
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <PersonIcon />
      </InputAdornment>
    )
  }}
/>
```

### 3. Tabelas Responsivas
```javascript
// ✅ BOM: Tabela com estados visuais
<TableContainer component={Paper}>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonIcon />
            Cliente
          </Box>
        </TableCell>
        <TableCell>Contato</TableCell>
        <TableCell>Status</TableCell>
        <TableCell>Ações</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {loading ? (
        // Skeleton loading
        Array.from({ length: 5 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell><Skeleton /></TableCell>
            <TableCell><Skeleton /></TableCell>
            <TableCell><Skeleton /></TableCell>
            <TableCell><Skeleton /></TableCell>
          </TableRow>
        ))
      ) : (
        clients.map(client => (
          <TableRow
            key={client.id}
            hover
            sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
          >
            <TableCell>{client.name}</TableCell>
            {/* ... */}
          </TableRow>
        ))
      )}
    </TableBody>
  </Table>
</TableContainer>
```

---

## ⚡ Interatividade

### 1. Feedback Imediato
```javascript
// ✅ BOM: Feedback visual imediato
const [liked, setLiked] = useState(false);

<IconButton
  onClick={() => setLiked(!liked)}
  sx={{
    color: liked ? 'error.main' : 'action.disabled',
    transform: liked ? 'scale(1.2)' : 'scale(1)',
    transition: 'all 0.2s ease-in-out'
  }}
>
  <FavoriteIcon />
</IconButton>
```

### 2. Estados de Loading
```javascript
// ✅ BOM: Estados de loading bem definidos
{loading ? (
  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
    <CircularProgress />
  </Box>
) : error ? (
  <Alert severity="error" sx={{ m: 2 }}>
    Erro ao carregar dados: {error}
  </Alert>
) : (
  <ClientsList clients={clients} />
)}
```

### 3. Confirmações e Alertas
```javascript
// ✅ BOM: Confirmação visual clara
<Dialog open={deleteConfirm} onClose={() => setDeleteConfirm(false)}>
  <DialogTitle>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <WarningIcon color="warning" />
      Confirmar Exclusão
    </Box>
  </DialogTitle>
  <DialogContent>
    <Alert severity="warning" sx={{ mb: 2 }}>
      Esta ação não pode ser desfeita!
    </Alert>
    <Typography>
      Tem certeza que deseja excluir o cliente <strong>"{client?.name}"</strong>?
    </Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setDeleteConfirm(false)}>
      Cancelar
    </Button>
    <Button 
      color="error" 
      variant="contained"
      onClick={handleDelete}
      startIcon={<DeleteIcon />}
    >
      Excluir
    </Button>
  </DialogActions>
</Dialog>
```

---

## 📱 Responsividade

### 1. Breakpoints Padrão
```javascript
const breakpoints = {
  xs: 0,     // Extra small devices (phones)
  sm: 600,   // Small devices (tablets)
  md: 900,   // Medium devices (small laptops)
  lg: 1200,  // Large devices (desktops)
  xl: 1536   // Extra large devices (large desktops)
};
```

### 2. Layout Adaptivo
```javascript
// ✅ BOM: Componente responsivo
<Box
  sx={{
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    gap: { xs: 2, md: 3 },
    p: { xs: 2, md: 3 }
  }}
>
  <Box sx={{ flex: { md: 1 } }}>
    <ClientsTable />
  </Box>
  <Box sx={{ 
    width: { md: 300 },
    order: { xs: -1, md: 0 }
  }}>
    <ClientsFilters />
  </Box>
</Box>
```

### 3. Texto Responsivo
```javascript
// ✅ BOM: Tipografia responsiva
<Typography
  variant="h1"
  sx={{
    fontSize: {
      xs: '1.5rem',  // 24px em mobile
      sm: '2rem',    // 32px em tablet
      md: '2.5rem'   // 40px em desktop
    },
    textAlign: { xs: 'center', md: 'left' }
  }}
>
  Dashboard
</Typography>
```

---

## ♿ Acessibilidade

### 1. Labels e ARIA
```javascript
// ✅ BOM: Acessibilidade bem implementada
<Button
  aria-label="Excluir cliente João Silva"
  aria-describedby="delete-warning"
  onClick={handleDelete}
>
  <DeleteIcon />
</Button>

<Typography id="delete-warning" variant="caption" color="text.secondary">
  Esta ação é irreversível
</Typography>
```

### 2. Navegação por Teclado
```javascript
// ✅ BOM: Suporte a navegação por teclado
<TextField
  onKeyDown={(e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
  }}
/>
```

### 3. Contraste e Cores
```javascript
// ✅ BOM: Alto contraste para acessibilidade
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Contraste 4.5:1 com branco
      contrastText: '#ffffff'
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)', // Contraste 15.8:1
      secondary: 'rgba(0, 0, 0, 0.6)'  // Contraste 9.85:1
    }
  }
});
```

---

## 🚀 Performance Visual

### 1. Loading Progressivo
```javascript
// ✅ BOM: Skeleton loading para melhor UX
const ClientCardSkeleton = () => (
  <Card sx={{ maxWidth: 345 }}>
    <CardHeader
      avatar={<Skeleton variant="circular" width={40} height={40} />}
      title={<Skeleton variant="text" sx={{ fontSize: '1rem' }} />}
      subheader={<Skeleton variant="text" sx={{ fontSize: '0.875rem' }} />}
    />
    <Skeleton variant="rectangular" height={118} />
    <CardContent>
      <Skeleton variant="text" />
      <Skeleton variant="text" width="60%" />
    </CardContent>
  </Card>
);
```

### 2. Lazy Loading de Imagens
```javascript
// ✅ BOM: Carregamento otimizado
<Avatar
  src={client.avatar}
  alt={`Foto de ${client.name}`}
  loading="lazy"
  sx={{
    width: 56,
    height: 56,
    transition: 'all 0.3s ease'
  }}
>
  {!client.avatar && <PersonIcon />}
</Avatar>
```

### 3. Virtualization para Listas Grandes
```javascript
// ✅ BOM: Lista virtualizada para performance
import { FixedSizeList as List } from 'react-window';

const VirtualizedClientList = ({ clients }) => (
  <List
    height={400}
    itemCount={clients.length}
    itemSize={80}
    itemData={clients}
  >
    {({ index, style, data }) => (
      <div style={style}>
        <ClientListItem client={data[index]} />
      </div>
    )}
  </List>
);
```

---

## ✨ Microinterações

### 1. Animações Sutis
```javascript
// ✅ BOM: Animações que melhoram a UX
<Fade in={visible} timeout={500}>
  <Card sx={{
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: 4,
      transition: 'all 0.3s ease-in-out'
    }
  }}>
    <CardContent>
      {/* Conteúdo do card */}
    </CardContent>
  </Card>
</Fade>
```

### 2. Feedback de Ações
```javascript
// ✅ BOM: Feedback visual de sucesso
const [saved, setSaved] = useState(false);

const handleSave = async () => {
  await saveClient(data);
  setSaved(true);
  setTimeout(() => setSaved(false), 2000);
};

<Button
  onClick={handleSave}
  color={saved ? 'success' : 'primary'}
  startIcon={saved ? <CheckIcon /> : <SaveIcon />}
>
  {saved ? 'Salvo!' : 'Salvar'}
</Button>
```

### 3. Transições Suaves
```javascript
// ✅ BOM: Transições entre estados
<Collapse in={expanded}>
  <CardContent>
    <Typography variant="body2">
      Detalhes adicionais do cliente...
    </Typography>
  </CardContent>
</Collapse>
```

---

## 🎯 Padrões Específicos

### 1. Formulários Intuitivos
```javascript
// ✅ BOM: Formulário bem estruturado
<form onSubmit={handleSubmit}>
  <Grid container spacing={3}>
    <Grid item xs={12}>
      <Typography variant="h6" gutterBottom>
        📋 Informações Pessoais
      </Typography>
    </Grid>
    
    <Grid item xs={12} md={8}>
      <TextField
        fullWidth
        required
        label="Nome Completo"
        value={formData.name}
        onChange={handleChange('name')}
        error={!!errors.name}
        helperText={errors.name}
      />
    </Grid>
    
    <Grid item xs={12} md={4}>
      <FormControl fullWidth>
        <InputLabel>Status</InputLabel>
        <Select
          value={formData.status}
          onChange={handleChange('status')}
        >
          <MenuItem value="active">Ativo</MenuItem>
          <MenuItem value="inactive">Inativo</MenuItem>
        </Select>
      </FormControl>
    </Grid>
    
    <Grid item xs={12}>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button variant="outlined" onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </Button>
      </Box>
    </Grid>
  </Grid>
</form>
```

### 2. Dashboards Informativos
```javascript
// ✅ BOM: Cards de métricas claros
<Grid container spacing={3}>
  {[
    { title: 'Total de Clientes', value: 1234, icon: <PeopleIcon />, color: 'primary' },
    { title: 'Novos este Mês', value: 56, icon: <TrendingUpIcon />, color: 'success' },
    { title: 'Pedidos Hoje', value: 23, icon: <ShoppingCartIcon />, color: 'info' }
  ].map((metric, index) => (
    <Grid item xs={12} sm={6} md={4} key={index}>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: `${metric.color}.main` }}>
              {metric.icon}
            </Avatar>
            <Box>
              <Typography variant="h4" component="div">
                {metric.value.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {metric.title}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  ))}
</Grid>
```

### 3. Notificações Efetivas
```javascript
// ✅ BOM: Sistema de notificações
import { toast } from 'react-toastify';

const showNotification = (type, message) => {
  const options = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true
  };

  switch (type) {
    case 'success':
      toast.success(message, options);
      break;
    case 'error':
      toast.error(message, options);
      break;
    case 'warning':
      toast.warning(message, options);
      break;
    case 'info':
      toast.info(message, options);
      break;
  }
};

// Uso:
showNotification('success', '✅ Cliente salvo com sucesso!');
showNotification('error', '❌ Erro ao salvar cliente');
```

---

## 📏 Métricas de Qualidade

### 1. Checklist de UX
- [ ] Interface intuitiva sem necessidade de tutorial
- [ ] Feedback visual para todas as ações
- [ ] Estados de loading e erro bem definidos
- [ ] Navegação clara e consistente
- [ ] Responsividade em todos os dispositivos
- [ ] Acessibilidade WCAG 2.1 AA
- [ ] Performance visual otimizada
- [ ] Microinterações que agregam valor

### 2. Testes de Usabilidade
```javascript
// Exemplo de teste automatizado de UX
describe('UX Tests', () => {
  test('deve mostrar feedback visual ao salvar', async () => {
    render(<ClientForm />);
    
    const saveButton = screen.getByRole('button', { name: /salvar/i });
    fireEvent.click(saveButton);
    
    // Verifica estado de loading
    expect(screen.getByText(/salvando/i)).toBeInTheDocument();
    
    await waitFor(() => {
      // Verifica feedback de sucesso
      expect(screen.getByText(/salvo com sucesso/i)).toBeInTheDocument();
    });
  });
});
```

---

## 🎨 Design Tokens

### Cores Semânticas
```javascript
const semanticColors = {
  success: {
    light: '#4caf50',
    main: '#2e7d32',
    dark: '#1b5e20',
    text: '✅ Sucesso!'
  },
  warning: {
    light: '#ff9800',
    main: '#ed6c02',
    dark: '#e65100',
    text: '⚠️ Atenção!'
  },
  error: {
    light: '#f44336',
    main: '#d32f2f',
    dark: '#c62828',
    text: '❌ Erro!'
  },
  info: {
    light: '#2196f3',
    main: '#0288d1',
    dark: '#01579b',
    text: 'ℹ️ Informação'
  }
};
```

### Sombras e Elevações
```javascript
const shadows = {
  card: '0 2px 8px rgba(0,0,0,0.1)',
  hover: '0 4px 16px rgba(0,0,0,0.15)',
  modal: '0 8px 32px rgba(0,0,0,0.2)',
  floating: '0 6px 24px rgba(0,0,0,0.12)'
};
```

---

## 📱 Mobile First

### Princípios Mobile
1. **Touch Targets**: Mínimo 44px de área tocável
2. **Thumb Zone**: Elementos importantes na zona do polegar
3. **Swipe Gestures**: Implementar gestos naturais
4. **Keyboard Awareness**: Interface adaptável ao teclado virtual

```javascript
// ✅ BOM: Componente mobile-friendly
<Box
  sx={{
    minHeight: 44, // Área tocável mínima
    display: 'flex',
    alignItems: 'center',
    px: 2,
    '&:active': { // Feedback de toque
      backgroundColor: 'action.pressed',
      transform: 'scale(0.98)'
    }
  }}
>
  <ListItemText primary="Item da Lista" />
</Box>
```

---

## 🎯 Conclusão

Estes padrões garantem uma experiência do usuário consistente, acessível e agradável. Lembre-se:

1. **Simplicidade** sempre vence complexidade
2. **Consistência** cria confiança
3. **Feedback** mantém o usuário informado
4. **Acessibilidade** inclui todos os usuários
5. **Performance** mantém a fluidez

### 📚 Recursos Adicionais
- [Material-UI Documentation](https://mui.com/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [React Transition Group](https://reactcommunity.org/react-transition-group/)
- [Framer Motion](https://www.framer.com/motion/)

---

*Documento criado para garantir interfaces intuitivas e agradáveis no projeto Cardápio Frontend* 🎨✨
