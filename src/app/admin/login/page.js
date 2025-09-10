/**
 * PÁGINA DE LOGIN ADMINISTRATIVO
 * 
 * Interface de autenticação para administradores e gerentes
 * do sistema. Inclui validação de formulário e integração
 * com o contexto de autenticação.
 * 
 * Funcionalidades:
 * - Formulário de login e senha
 * - Validação em tempo real dos campos
 * - Tratamento de erros de autenticação
 * - Redirecionamento após login bem-sucedido
 * - Design responsivo e acessível
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Container,
  Link
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  AdminPanelSettings,
  Email,
  Lock
} from '@mui/icons-material';
import { useAuth } from '../../../context/AuthContext';

/**
 * COMPONENTE PRINCIPAL DA PÁGINA DE LOGIN
 */
const AdminLoginPage = () => {
  // Estados do formulário
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Hooks de navegação e autenticação
  const router = useRouter();
  const { 
    loginAdmin, 
    loading, 
    error, 
    clearError, 
    user
  } = useAuth();

  /**
   * EFEITO DE REDIRECIONAMENTO
   * 
   * Redireciona para dashboard se usuário já está autenticado
   */
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      router.push('/admin/');
    }
  }, [isAuthenticated, isAdmin, router]);

  /**
   * MANIPULADOR DE MUDANÇA DE CAMPO
   * 
   * Atualiza estado do formulário e limpa erros
   */
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpa erro do campo específico
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Limpa erro global
    if (error) {
      clearError();
    }
  };

  /**
   * VALIDAÇÃO DO FORMULÁRIO
   * 
   * Valida campos obrigatórios e formato do email
   */
  const validateForm = () => {
    const errors = {};

    // Validação do login
    if (!formData.username.trim()) {
      errors.username = 'Usuário é obrigatório';
    }

    // Validação da senha
    if (!formData.password.trim()) {
      errors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 3) {
      errors.password = 'Senha deve ter pelo menos 3 caracteres';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * MANIPULADOR DE SUBMISSÃO DO FORMULÁRIO
   * 
   * Valida dados e executa login administrativo
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Valida formulário
    if (!validateForm()) {
      return;
    }

    try {
      // Executa login
      const result = await loginAdmin({
        username: formData.username.trim(),
        password: formData.password
      });

      console.log(result);

      if (result.success) {

        setIsAuthenticated(result.user.isAuthenticated);
        setIsAdmin(result.user.isAdmin);

        // Login bem-sucedido - redirecionamento será feito pelo useEffect
        router.push('/admin/');
        console.log('✅ Login administrativo realizado com sucesso');
      }
    } catch (err) {
      console.error('❌ Erro no login:', err);
    }
  };

  /**
   * TOGGLE DE VISIBILIDADE DA SENHA
   */
  const handleTogglePassword = () => {
    setShowPassword(prev => !prev);
  };

  /**
   * RENDERIZAÇÃO DO COMPONENTE
   */
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 3
        }}
      >
        <Card
          elevation={8}
          sx={{
            width: '100%',
            maxWidth: 400,
            borderRadius: 2
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* CABEÇALHO */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 3
              }}
            >
              {/* Ícone administrativo */}
              <AdminPanelSettings
                sx={{
                  fontSize: 48,
                  color: 'primary.main',
                  mb: 1
                }}
              />
              
              {/* Título */}
              <Typography
                variant="h4"
                component="h1"
                fontWeight="bold"
                color="primary.main"
                textAlign="center"
                gutterBottom
              >
                Painel Administrativo
              </Typography>
              
              {/* Subtítulo */}
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
              >
                Faça login para acessar o sistema de gerenciamento
              </Typography>
            </Box>

            {/* ALERTA DE ERRO */}
            {error && (
              <Alert
                severity="error"
                sx={{ mb: 3 }}
                onClose={clearError}
              >
                {error}
              </Alert>
            )}

            {/* FORMULÁRIO */}
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ width: '100%' }}
            >
              {/* Campo de Email */}
              <TextField
                name="username"
                label="Usuário"
                value={formData.username}
                onChange={handleInputChange}
                error={!!validationErrors.username}
                helperText={validationErrors.username}
                disabled={loading}
                fullWidth
                margin="normal"
                autoComplete="email"
                autoFocus
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Campo de Senha */}
              <TextField
                name="password"
                type={showPassword ? 'text' : 'password'}
                label="Senha"
                placeholder="Digite sua senha"
                value={formData.password}
                onChange={handleInputChange}
                error={!!validationErrors.password}
                helperText={validationErrors.password}
                disabled={loading}
                fullWidth
                margin="normal"
                autoComplete="current-password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePassword}
                        edge="end"
                        disabled={loading}
                        aria-label="toggle password visibility"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Botão de Login */}
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                fullWidth
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold'
                }}
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Entrando...
                  </>
                ) : (
                  'Entrar no Sistema'
                )}
              </Button>
            </Box>

            {/* LINK PARA VOLTAR */}
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Link
                href="/"
                underline="hover"
                color="text.secondary"
                sx={{ fontSize: '0.875rem' }}
              >
                ← Voltar para o site
              </Link>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default AdminLoginPage;
