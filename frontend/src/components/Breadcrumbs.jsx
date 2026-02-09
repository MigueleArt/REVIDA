'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Breadcrumbs() {
  const pathname = usePathname();
  
if (pathname === '/' || pathname.startsWith('/auth')) return null;

  const pathSegments = pathname.split('/').filter(segment => segment !== '');

  return (
    <nav aria-label="Breadcrumb" style={{ padding: '1rem' }}>
      <ol style={{ listStyle: 'none', display: 'flex', gap: '0.5rem', padding: 0 }}>
        <li>
          <Link href="/">Inicio</Link>
          <span aria-hidden="true" style={{ margin: '0 0.5rem' }}>/</span>
        </li>

        {pathSegments.map((segment, index) => {
          const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
          const isLast = index === pathSegments.length - 1;

          return (
            <li key={href}>
              {isLast ? (
                <span aria-current="page" style={{ fontWeight: 'bold' }}>
                  {segment.charAt(0).toUpperCase() + segment.slice(1)}
                </span>
              ) : (
                <>
                  <Link href={href}>
                    {segment.charAt(0).toUpperCase() + segment.slice(1)}
                  </Link>
                  <span aria-hidden="true" style={{ margin: '0 0.5rem' }}>/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}