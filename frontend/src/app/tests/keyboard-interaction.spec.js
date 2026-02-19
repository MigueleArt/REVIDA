import { test, expect } from '@playwright/test';

test('Botón Buscar ejecuta búsqueda con Space', async ({ page }) => {
  await page.goto('http://localhost:3000/dashboard/mis-donativos');

  const botonBuscar = page.getByRole('button', { name: /buscar/i });

  // Asegurarnos que el botón existe
  await expect(botonBuscar).toBeVisible();

  // Enfocarlo
  await botonBuscar.focus();

  // Presionar Space
  await page.keyboard.press('Space');

  // Verificar que aparece el mensaje de carga
  await expect(page.getByText('Cargando donaciones...')).toBeVisible();
});
