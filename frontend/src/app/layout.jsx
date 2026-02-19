import Navbar from '../components/Navbar';
import Breadcrumbs from '../components/Breadcrumbs'; 
import '../styles/globals.css';

export const metadata = {
  title: 'Revida Frontend',
  description: 'Plataforma de donaciones',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Navbar />
        <Breadcrumbs />
        <main>{children}</main>
      </body>
    </html>
  );
}