/**
 * MIDDLEWARE DE AUTENTICAÇÃO - NEXT.JS (SIMPLIFICADO)
 * 
 * Middleware simplificado para redirecionamento básico
 * de rotas administrativas não autenticadas.
 */

import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Se está tentando acessar /admin e não está na página de login
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }
    
    // Verifica se tem token no cookie
    const authToken = request.cookies.get('authToken')?.value;
    
    if (!authToken) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*'
  ],
};
