import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // UI-only test role for the isolated development browser; no real credentials or cloud writes.
  await page.addInitScript(() => {
    sessionStorage.setItem('cokito_teacher_auth', 'true');
    sessionStorage.setItem('cokito_staff_role', 'principal');
    localStorage.removeItem('cokito_classroom_materials');
  });
});

test('landing page renders and primary navigation reaches the Learning Hub', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Güakytopia/);
  await expect(page.getByRole('button', { name: /Home/ })).toBeVisible();

  await page.getByRole('button', { name: /^Hub/ }).click();
  await expect(page.getByText('Master Curriculum & Classroom Hub')).toBeVisible();
});

test('Classroom switches between interactive classroom and materials Hub', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /^Classroom/ }).click();
  await expect(page.getByRole('button', { name: 'Aula interactiva' })).toBeVisible();

  await page.getByRole('button', { name: 'Classroom y nuestro Hub' }).click();
  await expect(page.getByText('Materiales Permanentes y Estructurados')).toBeVisible();
  await expect(page.getByPlaceholder('Buscar unidad o tema...')).toBeVisible();
});

test('Language Practice Lab loads its exercise interface', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /^Lab/ }).click();
  await expect(page.getByText('Güakytalkie • Laboratorio de Idiomas')).toBeVisible();
  await expect(page.getByText(/100 Drills/).first()).toBeVisible();
});
