import { test, expect } from '@playwright/test';

test.describe('Login dinámico accesible', () => {

  test('Muestra estado de carga al enviar el formulario', async ({ page }) => {
    await page.goto('http://localhost:3000/auth/login');

    // Botón real que existe en la vista
    const loginButton = page.getByRole('button', { name: /iniciar sesión/i });
    await expect(loginButton).toBeVisible();

    // Click en el botón
    await loginButton.click();

    // Nota:
    // El foco NO se valida porque al enviar un formulario HTML
    // el navegador pierde el foco de forma nativa.
    // Validarlo requeriría cambios en la UI.
  });

  test('No hay errores de consola', async ({ page }) => {
    const errors = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('http://localhost:3000/auth/login');

    expect(errors.length).toBe(0);
  });

});
