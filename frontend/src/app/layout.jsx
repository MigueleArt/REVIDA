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
        <a className="skip-link" href="#main-content">
          Saltar al contenido principal
        </a>
        <Navbar />
        <Breadcrumbs />
        <main id="main-content">{children}</main>
      </body>
    </html>
  );
}
