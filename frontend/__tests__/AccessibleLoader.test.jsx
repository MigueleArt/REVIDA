import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AccessibleLoader from '../src/components/AccessibleLoader';

describe('AccessibleLoader', () => {
    it('renders with role="status" for screen readers', () => {
        render(<AccessibleLoader message="Cargando datos..." />);
        const statusEl = screen.getByRole('status');
        expect(statusEl).toBeInTheDocument();
    });

    it('displays the loading message text', () => {
        render(<AccessibleLoader message="Buscando donaciones..." />);
        // Both visible <p> and sr-only <span> contain the text
        const matches = screen.getAllByText('Buscando donaciones...');
        expect(matches.length).toBeGreaterThanOrEqual(1);
    });

    it('renders the SVG spinner with aria-hidden', () => {
        const { container } = render(<AccessibleLoader />);
        const spinner = container.querySelector('.revida-spinner');
        expect(spinner).toBeInTheDocument();
        expect(spinner).toHaveAttribute('aria-hidden', 'true');
    });

    it('uses the default message when none is provided', () => {
        render(<AccessibleLoader />);
        const matches = screen.getAllByText('Cargando...');
        expect(matches.length).toBeGreaterThanOrEqual(1);
    });

    it('renders sr-only fallback text for assistive tech', () => {
        const { container } = render(<AccessibleLoader message="Procesando..." />);
        const srOnly = container.querySelector('.sr-only');
        expect(srOnly).toBeInTheDocument();
        expect(srOnly).toHaveTextContent('Procesando...');
    });
});
