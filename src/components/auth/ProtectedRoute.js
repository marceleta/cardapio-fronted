/**
 * COMPONENTE DE ROTA PROTEGIDA - CONTROLE DE ACESSO
 * 
 * Componente que verifica autenticação antes de renderizar
 * páginas protegidas. Redireciona usuários não autenticados
 * para a página de login apropriada.
 * 
 * Funcionalidades:
 * - Verificação de autenticação em tempo real
 * - Redirecionamento automático para login
 * - Suporte a diferentes tipos de usuário (admin/client)
 * - Loading state durante verificação
 * - Proteção de rotas administrativas
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

/**
 * COMPONENTE DE ROTA PROTEGIDA
 * 
 * @param {Object} props - Propriedades do componente
 * @param {JSX.Element} props.children - Componentes filhos a serem renderizados
 * @param {string} props.requiredRole - Papel necessário para acessar a rota
 * @param {string} props.fallbackPath - Caminho para redirecionamento em caso de não autorização
 */
const ProtectedRoute = ({ 
  children, 
  requiredRole = null,
  fallbackPath = '/admin/login'
}) => {
  // Estados locais
  const [isChecking, setIsChecking] = useState(true);
  
  // Hooks de navegação e autenticação
  const router = useRouter();
  const pathname = usePathname();
  const { 
    user,     
    loading, 
    checkAuthStatus 
  } = useAuth();


  /**
   * EFEITO DE VERIFICAÇÃO DE AUTENTICAÇÃO
   * 
   * Executa verificação inicial e monitora mudanças
   * no estado de autenticação.
   */
  useEffect(() => {
    const verifyAuth = async () => {
      try {

        setIsChecking(true);
        
        
        // Tenta restaurar sessão se não está autenticado
        if (!user?.isAuthenticated && !loading) {
          await checkAuthStatus();
        }
        
        // Pequeno delay para evitar flash de conteúdo
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error('Erro na verificação de autenticação:', error);
      } finally {
        setIsChecking(false);
      }
    };

    verifyAuth();
  }, [user, loading, checkAuthStatus]);

  /**
   * EFEITO DE REDIRECIONAMENTO
   * 
   * Redireciona usuário baseado no estado de autenticação
   * e permissões necessárias.
   */
  useEffect(() => {

    // Não faz nada enquanto está verificando
    if (isChecking || loading) return;

    // Se não está autenticado, redireciona para login
    if (!user?.isAuthenticated) {
      console.log('👤 Usuário não autenticado, redirecionando para login...');
      router.push(fallbackPath);
      return;
    }

    // Verifica se usuário tem papel necessário
    if (requiredRole) {
      const hasRequiredRole = checkUserRole(user, requiredRole);
      
      if (!hasRequiredRole) {
        console.log(`🚫 Usuário não possui papel necessário: ${requiredRole}`);
        
        // Redireciona baseado no tipo de usuário
        if (user.isAdmin) {
          router.push('/admin/dashboard');
        } else {
          router.push('/admin/login');
        }
        return;
      }
    }

    // Para rotas administrativas, verifica se é admin
    if (pathname.startsWith('/admin') && !user.isAdmin) {
      console.log('🔒 Acesso negado à área administrativa');
      router.push('/admin/login');
      return;
    }

  }, [
    isChecking, 
    loading, 
    user, 
    requiredRole, 
    fallbackPath, 
    pathname, 
    router
  ]);

  /**
   * FUNÇÃO AUXILIAR: Verifica se usuário tem papel necessário
   */
  const checkUserRole = (userData, role) => {
    if (!userData || !role) return false;
    
    switch (role) {
      case 'admin':
        return userData.user_type === 'admin';
      case 'manager':
        return userData.user_type === 'admin' || userData.user_type === 'manager';
      case 'client':
        return userData.user_type === 'client';
      default:
        return false;
    }
  };

  /**
   * RENDERIZAÇÃO CONDICIONAL
   */
  
  // Mostra loading enquanto verifica autenticação
  if (isChecking || loading) {
    return (
      <LoadingScreen 
        message="Verificando autenticação..." 
      />
    );
  }

  // Se não está autenticado, mostra loading (redirecionamento em andamento)
  if (!user) {
    return (
      <LoadingScreen 
        message="Redirecionando para login..." 
      />
    );
  }

  // Verifica papel específico se necessário
  if (requiredRole && !checkUserRole(user, requiredRole)) {
    return (
      <LoadingScreen 
        message="Verificando permissões..." 
      />
    );
  }

  // Para rotas admin, verifica se é admin
  if (pathname.startsWith('/admin') && !user.isAdmin) {
    return (
      <LoadingScreen 
        message="Acesso negado..." 
      />
    );
  }

  // Se chegou até aqui, usuário está autorizado
  return children;
};

/**
 * COMPONENTE DE LOADING SCREEN
 * 
 * Tela de carregamento reutilizável para estados
 * de verificação de autenticação.
 */
const LoadingScreen = ({ message = 'Carregando...' }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: 'background.default',
      gap: 2
    }}
  >
    {/* Indicador de loading */}
    <CircularProgress 
      size={48}
      color="primary"
      thickness={4}
    />
    
    {/* Mensagem de loading */}
    <Typography 
      variant="body1" 
      color="text.secondary"
      textAlign="center"
    >
      {message}
    </Typography>
  </Box>
);

/**
 * COMPONENTE DE ROTA ADMINISTRATIVA
 * 
 * Wrapper específico para rotas que requerem
 * privilégios administrativos.
 */
export const AdminRoute = ({ children }) => (
  <ProtectedRoute 
    requiredRole="manager"
    fallbackPath="/admin/login"
  >
    {children}
  </ProtectedRoute>
);

/**
 * COMPONENTE DE ROTA DE CLIENTE
 * 
 * Wrapper específico para rotas que requerem
 * autenticação de cliente.
 */
export const ClientRoute = ({ children }) => (
  <ProtectedRoute 
    requiredRole="client"
    fallbackPath="/"
  >
    {children}
  </ProtectedRoute>
);

// Exportação padrão
export default ProtectedRoute;
