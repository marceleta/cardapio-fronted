/**
 * PÁGINA DE DASHBOARD ADMINISTRATIVO
 * 
 * Página principal do painel administrativo que exibe
 * estatísticas gerais, métricas de performance e resumo
 * das operações do sistema.
 * 
 * Funcionalidades:
 * - Redirecionamento para a página principal do admin
 * - Proteção de rota administrativa
 * - Compatibilidade com navegação direta
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminRoute } from '../../../components/auth/ProtectedRoute';

/**
 * COMPONENTE DA PÁGINA DE DASHBOARD
 * 
 * Redireciona para a página principal do admin,
 * mantendo a URL amigável /admin/dashboard
 */
function DashboardContent() {
  const router = useRouter();

  useEffect(() => {
    // Redireciona para a página principal do admin
    router.replace('/admin');
  }, [router]);

  return null; // Não renderiza nada durante o redirecionamento
}

/**
 * COMPONENTE EXPORTADO COM PROTEÇÃO
 */
export default function DashboardPage() {
  return (
    <AdminRoute>
      <DashboardContent />
    </AdminRoute>
  );
}
