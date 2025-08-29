/**
 * ETAPA DE AUTENTICAÇÃO - CHECKOUT
 * 
 * Primeira etapa do checkout responsável por verificar e garantir
 * que o cliente esteja autenticado antes de prosseguir com o pedido.
 * 
 * Funcionalidades:
 * - Verificação de autenticação automática
 * - Formulário de login para clientes existentes
 * - Formulário de cadastro para novos clientes
 * - Validação de dados em tempo real
 * - Integração com WhatsApp para verificação
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Tabs,
  Tab,
  Grid,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Link,
  Divider
} from '@mui/material';
import {
  Person as PersonIcon,
  WhatsApp as WhatsAppIcon,
  Lock as LockIcon,
  Email as EmailIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';
import { IMaskInput } from 'react-imask';

// Hooks de contexto
import { useAuth } from '../../../context/AuthContext';
import { useCheckout } from '../../../context/CheckoutContext';

/**
 * COMPONENTE DE MÁSCARA PARA TELEFONE
 */
const PhoneMaskInput = React.forwardRef(function PhoneMaskInput(props, ref) {
  const { onChange, ...other } = props;
  
  return (
    <IMaskInput
      {...other}
      mask="(00) 00000-0000"
      definitions={{ '0': /[0-9]/ }}
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name: props.name, value } })}
      overwrite
    />
  );
});

/**
 * COMPONENTE PRINCIPAL DA ETAPA DE AUTENTICAÇÃO
 */
const AuthStep = () => {
  // Estados locais
  const [tabValue, setTabValue] = useState(0); // 0 = Login, 1 = Cadastro
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Estados do formulário de login
  const [loginForm, setLoginForm] = useState({
    whatsapp: '',
    password: ''
  });

  // Estados do formulário de cadastro
  const [registerForm, setRegisterForm] = useState({
    name: '',
    whatsapp: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });

  // Hooks de contexto
  const { login, register, isAuthenticated, user } = useAuth();
  const { nextStep } = useCheckout();

  /**
   * EFEITO PARA VERIFICAR AUTENTICAÇÃO AUTOMÁTICA
   */
  useEffect(() => {
    // Se já está autenticado, avança automaticamente
    if (isAuthenticated && user) {
      console.log('Usuário já autenticado, avançando para próxima etapa');
      nextStep();
    }
  }, [isAuthenticated, user, nextStep]);

  /**
   * MANIPULA MUDANÇA DE ABA
   */
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError(null);
    setSuccess(null);
  };

  /**
   * MANIPULA MUDANÇAS NO FORMULÁRIO DE LOGIN
   */
  const handleLoginChange = (field) => (event) => {
    setLoginForm(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    setError(null);
  };

  /**
   * MANIPULA MUDANÇAS NO FORMULÁRIO DE CADASTRO
   */
  const handleRegisterChange = (field) => (event) => {
    const value = field === 'acceptTerms' ? event.target.checked : event.target.value;
    
    setRegisterForm(prev => ({
      ...prev,
      [field]: value
    }));
    setError(null);
  };

  /**
   * VALIDA FORMULÁRIO DE LOGIN
   */
  const validateLoginForm = () => {
    if (!loginForm.whatsapp.trim()) {
      return 'WhatsApp é obrigatório';
    }

    if (!loginForm.password.trim()) {
      return 'Senha é obrigatória';
    }

    // Remove formatação do WhatsApp para validação
    const cleanWhatsApp = loginForm.whatsapp.replace(/\D/g, '');
    if (cleanWhatsApp.length !== 11) {
      return 'WhatsApp deve ter 11 dígitos (DDD + número)';
    }

    return null;
  };

  /**
   * VALIDA FORMULÁRIO DE CADASTRO
   */
  const validateRegisterForm = () => {
    if (!registerForm.name.trim()) {
      return 'Nome é obrigatório';
    }

    if (!registerForm.whatsapp.trim()) {
      return 'WhatsApp é obrigatório';
    }

    if (!registerForm.email.trim()) {
      return 'E-mail é obrigatório';
    }

    if (!registerForm.password.trim()) {
      return 'Senha é obrigatória';
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      return 'Senhas não conferem';
    }

    if (!registerForm.acceptTerms) {
      return 'Você deve aceitar os termos de uso';
    }

    // Validações específicas
    const cleanWhatsApp = registerForm.whatsapp.replace(/\D/g, '');
    if (cleanWhatsApp.length !== 11) {
      return 'WhatsApp deve ter 11 dígitos (DDD + número)';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerForm.email)) {
      return 'E-mail inválido';
    }

    if (registerForm.password.length < 6) {
      return 'Senha deve ter pelo menos 6 caracteres';
    }

    return null;
  };

  /**
   * PROCESSA LOGIN
   * PASSO 1: Verificação de Autenticação do Cliente
   */
  const handleLogin = async (event) => {
    event.preventDefault();
    
    // Validação
    const validation = validateLoginForm();
    if (validation) {
      setError(validation);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Remove formatação do WhatsApp
      const cleanWhatsApp = loginForm.whatsapp.replace(/\D/g, '');
      
      // Tenta fazer login
      const result = await login({
        whatsapp: cleanWhatsApp,
        password: loginForm.password
      });

      if (result.success) {
        setSuccess('Login realizado com sucesso!');
        
        // Aguarda um pouco para mostrar mensagem de sucesso
        setTimeout(() => {
          // Prossegue para PASSO 2: Escolha do Tipo de Entrega
          nextStep();
        }, 1000);
      } else {
        setError(result.message || 'Erro ao fazer login');
      }
    } catch (err) {
      console.error('Erro no login:', err);
      setError('Erro interno. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * PROCESSA CADASTRO
   * PASSO 1: Cadastro rápido para novos clientes
   */
  const handleRegister = async (event) => {
    event.preventDefault();
    
    // Validação
    const validation = validateRegisterForm();
    if (validation) {
      setError(validation);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Remove formatação do WhatsApp
      const cleanWhatsApp = registerForm.whatsapp.replace(/\D/g, '');
      
      // Tenta fazer cadastro
      const result = await register({
        name: registerForm.name.trim(),
        whatsapp: cleanWhatsApp,
        email: registerForm.email.trim().toLowerCase(),
        password: registerForm.password
      });

      if (result.success) {
        setSuccess('Cadastro realizado com sucesso!');
        
        // Aguarda um pouco para mostrar mensagem de sucesso
        setTimeout(() => {
          // Após cadastro bem-sucedido, prossegue para PASSO 2
          nextStep();
        }, 1000);
      } else {
        setError(result.message || 'Erro ao fazer cadastro');
      }
    } catch (err) {
      console.error('Erro no cadastro:', err);
      setError('Erro interno. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * RENDERIZA FORMULÁRIO DE LOGIN
   */
  const renderLoginForm = () => (
    <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        {/* CAMPO WHATSAPP */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            label="WhatsApp"
            value={loginForm.whatsapp}
            onChange={handleLoginChange('whatsapp')}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <WhatsAppIcon color="success" />
                </InputAdornment>
              ),
              inputComponent: PhoneMaskInput
            }}
            placeholder="(11) 99999-9999"
            helperText="Digite seu número de WhatsApp com DDD"
          />
        </Grid>

        {/* CAMPO SENHA */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            type="password"
            label="Senha"
            value={loginForm.password}
            onChange={handleLoginChange('password')}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              )
            }}
            placeholder="Digite sua senha"
          />
        </Grid>

        {/* BOTÃO DE LOGIN */}
        <Grid item xs={12}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ py: 1.5 }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </Grid>

        {/* LINK ESQUECEU SENHA */}
        <Grid item xs={12} sx={{ textAlign: 'center' }}>
          <Link
            href="#"
            variant="body2"
            color="primary"
            onClick={(e) => e.preventDefault()}
          >
            Esqueceu sua senha?
          </Link>
        </Grid>
      </Grid>
    </Box>
  );

  /**
   * RENDERIZA FORMULÁRIO DE CADASTRO
   */
  const renderRegisterForm = () => (
    <Box component="form" onSubmit={handleRegister} sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        {/* CAMPO NOME */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            label="Nome Completo"
            value={registerForm.name}
            onChange={handleRegisterChange('name')}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              )
            }}
            placeholder="Digite seu nome completo"
          />
        </Grid>

        {/* CAMPO WHATSAPP */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            required
            label="WhatsApp"
            value={registerForm.whatsapp}
            onChange={handleRegisterChange('whatsapp')}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <WhatsAppIcon color="success" />
                </InputAdornment>
              ),
              inputComponent: PhoneMaskInput
            }}
            placeholder="(11) 99999-9999"
            helperText="Número usado para receber atualizações do pedido"
          />
        </Grid>

        {/* CAMPO EMAIL */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            required
            type="email"
            label="E-mail"
            value={registerForm.email}
            onChange={handleRegisterChange('email')}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              )
            }}
            placeholder="seu@email.com"
          />
        </Grid>

        {/* CAMPO SENHA */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            required
            type="password"
            label="Senha"
            value={registerForm.password}
            onChange={handleRegisterChange('password')}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              )
            }}
            placeholder="Mínimo 6 caracteres"
            helperText="Senha para futuras compras"
          />
        </Grid>

        {/* CAMPO CONFIRMAR SENHA */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            required
            type="password"
            label="Confirmar Senha"
            value={registerForm.confirmPassword}
            onChange={handleRegisterChange('confirmPassword')}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              )
            }}
            placeholder="Digite a senha novamente"
          />
        </Grid>

        {/* CHECKBOX TERMOS */}
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={registerForm.acceptTerms}
                onChange={handleRegisterChange('acceptTerms')}
                color="primary"
              />
            }
            label={
              <Typography variant="body2">
                Aceito os{' '}
                <Link href="#" color="primary">
                  termos de uso
                </Link>{' '}
                e{' '}
                <Link href="#" color="primary">
                  política de privacidade
                </Link>
              </Typography>
            }
          />
        </Grid>

        {/* BOTÃO DE CADASTRO */}
        <Grid item xs={12}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ py: 1.5 }}
          >
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Box>
      {/* CABEÇALHO */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Entre ou cadastre-se
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Para finalizar seu pedido, precisamos de suas informações
        </Typography>
      </Box>

      {/* ALERTAS */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {/* ABAS DE LOGIN/CADASTRO */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          aria-label="Abas de autenticação"
        >
          <Tab label="Já tenho conta" />
          <Tab label="Criar conta" />
        </Tabs>
      </Box>

      {/* CONTEÚDO DAS ABAS */}
      {tabValue === 0 && renderLoginForm()}
      {tabValue === 1 && renderRegisterForm()}

      {/* INFORMAÇÕES ADICIONAIS */}
      <Box sx={{ mt: 4, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary" align="center">
          <WhatsAppIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'text-bottom' }} />
          Seus dados são seguros e serão usados apenas para processar seu pedido
        </Typography>
      </Box>
    </Box>
  );
};

export default AuthStep;
