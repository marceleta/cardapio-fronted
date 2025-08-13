import { Inter } from 'next/font/google';
import '../styles/globals.css';
import ThemeRegistry from '../components/ThemeRegistry';
import { AuthProvider } from '../context/AuthContext'; // Import AuthProvider

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Cardápio Giga Burger',
  description: 'O Gigante do Vale.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        <AuthProvider> {/* Wrap children with AuthProvider */}
          <ThemeRegistry>{children}</ThemeRegistry>
        </AuthProvider>
      </body>
    </html>
  );
}
