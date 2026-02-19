import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Page from '../src/app/page'

describe('Home Page', () => {
    it('renders a heading', () => {
        render(<Page />)

        const heading = screen.getByRole('heading', { level: 1, name: /Bienvenido a Revida/i })

        expect(heading).toBeInTheDocument()
    })
})
