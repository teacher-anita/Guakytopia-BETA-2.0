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

  await page.getByRole('button', { name: /Hub/ }).click();
  await expect(page.getByText('Master Curriculum & Classroom Hub')).toBeVisible();
});

test('Student account does not expose a selected profile before sign-in', async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.removeItem('cokito_student_auth');
  });
  await page.goto('/');
  await page.getByTitle('Ver mi perfil').click();

  await expect(page.getByRole('heading', { name: 'Acceso & Sesión' })).toBeVisible();
  await expect(page.getByPlaceholder('ejemplo@correo.com o tu nombre')).toBeVisible();
  await expect(page.getByPlaceholder('••••••••')).toHaveAttribute('required', '');
  await expect(page.getByText('Mi Cuenta de Alumno')).toHaveCount(0);
});

test('A remembered Ana profile is ignored when no student session exists', async ({ page }) => {
  await page.addInitScript(() => {
    sessionStorage.removeItem('cokito_teacher_auth');
    sessionStorage.removeItem('cokito_staff_role');
    sessionStorage.removeItem('cokito_student_auth');
    localStorage.setItem('cokito_active_student_id', 'student_ana_sandoval');
  });

  await page.goto('/');
  await expect(page.getByTitle('Ver mi perfil')).toBeVisible();
  await page.getByTitle('Ver mi perfil').click();

  await expect(page.getByRole('heading', { name: 'Acceso & Sesión' })).toBeVisible();
  await expect(page.getByText('Mi Cuenta de Alumno')).toHaveCount(0);
  await expect(page.getByRole('img', { name: 'Ana Sandoval' })).toHaveCount(0);
});

test('Classroom switches between interactive classroom and materials Hub', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Classroom/ }).click();
  await expect(page.getByRole('button', { name: 'Aula interactiva' })).toBeVisible();

  await page.getByRole('button', { name: 'Classroom y nuestro Hub' }).click();
  await expect(page.getByText('Materiales Permanentes y Estructurados')).toBeVisible();
  await expect(page.getByPlaceholder('Buscar unidad o tema...')).toBeVisible();
});

test('Language Practice Lab loads its exercise interface', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Lab/ }).click();
  await expect(page.getByRole('heading', { name: 'Güakytalkie • Communication & Speaking Lab' })).toBeVisible();
  await expect(page.getByText(/Güakytalkie • 100 High-Yield Practice Drills/)).toBeVisible();
});

test('Language Practice Lab pauses and resumes speech without restarting it', async ({ page }) => {
  await page.addInitScript(() => {
    (window as any).__speechSpeakCount = 0;
    (window as any).SpeechSynthesisUtterance = class {
      text: string;
      lang = 'en-US';
      rate = 1;
      pitch = 1;
      voice: any = null;
      onstart: (() => void) | null = null;
      onend: (() => void) | null = null;
      onerror: (() => void) | null = null;
      constructor(text: string) { this.text = text; }
    };
    const speech = {
      speaking: false,
      paused: false,
      getVoices: () => [{ name: 'Google US English', lang: 'en-US' }],
      speak(utterance: any) {
        (window as any).__speechSpeakCount += 1;
        this.speaking = true;
        this.paused = false;
        utterance.onstart?.();
      },
      pause() { this.paused = true; this.speaking = false; },
      resume() { this.paused = false; this.speaking = true; },
      cancel() { this.paused = false; this.speaking = false; },
    };
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: speech });
  });

  await page.goto('/');
  await page.getByRole('button', { name: /Lab/ }).click();
  await page.getByRole('button', { name: 'Listen Audio' }).click();
  await expect(page.getByRole('button', { name: 'Pause Audio' })).toBeVisible();
  await page.getByRole('button', { name: 'Pause Audio' }).click();
  await expect(page.getByRole('button', { name: 'Resume Audio' })).toBeVisible();
  await page.getByRole('button', { name: 'Resume Audio' }).click();
  await expect(page.getByRole('button', { name: 'Pause Audio' })).toBeVisible();
  expect(await page.evaluate(() => (window as any).__speechSpeakCount)).toBe(1);
});

test('Language Practice Lab search filters the exercise jump grid', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Lab/ }).click();
  await page.getByRole('button', { name: 'All 100 Grid' }).click();

  const search = page.getByPlaceholder('Search drill or number...');
  await search.fill('2');

  await expect(page.getByRole('button', { name: '2', exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: '1', exact: true })).toHaveCount(0);
});

test('Language Practice Lab can jump directly to incorrectly answered drills', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Lab/ }).click();

  await page.getByRole('button', { name: /Good afternoon/ }).click();
  const reviewMistakesButton = page.getByRole('button', { name: /Review Mistakes/ });
  await expect(reviewMistakesButton).toContainText('1');
  await reviewMistakesButton.click();

  await expect(page.getByText('Virtual Teacher Cokitö Explains:')).toBeVisible();
  await expect(page.getByText('Exercise 1 of 100 in this view')).toBeVisible();
});

test('Language Practice Lab supports feedback, retry, and moving to the next drill', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Lab/ }).click();

  await page.getByRole('button', { name: /Good afternoon/ }).click();
  await expect(page.getByText('Virtual Teacher Cokitö Explains:')).toBeVisible();
  await expect(page.getByRole('button', { name: /Good afternoon/ })).toBeDisabled();

  await page.getByRole('button', { name: 'Retry' }).click();
  await expect(page.getByText('Virtual Teacher Cokitö Explains:')).toHaveCount(0);
  await expect(page.getByRole('button', { name: /Good afternoon/ })).toBeEnabled();

  await page.getByRole('button', { name: 'Next Drill' }).click();
  await expect(page.getByText('It is 2:30 PM. You enter the classroom. What greeting should you use?')).toBeVisible();
});

test('Arena offers English mini-games and displays five rechargeable lives', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Arena/ }).click();

  await expect(page.getByRole('heading', { name: 'Play in English. Come back for more!' })).toBeVisible();
  await expect(page.getByRole('button', { name: /Word Search/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /Scrabble Mix/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /Hangman/ })).toBeVisible();
  await expect(page.getByText('5/5')).toBeVisible();
  await expect(page.getByText('One life recharges every 30 minutes.')).toBeVisible();
});

test('Arena consumes a shared guest life after an incorrect word attempt', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Arena/ }).click();
  await page.getByRole('button', { name: /Scrabble Mix/ }).click();
  await page.getByRole('label', { name: 'Your word' }).fill('WRONG');
  await page.getByRole('button', { name: 'Check', exact: true }).click();

  await expect(page.getByText('4/5')).toBeVisible();
  const savedLives = await page.evaluate(() => JSON.parse(localStorage.getItem('guakytopia_arena_lives_guest') || '{}'));
  expect(savedLives.lives).toBe(4);
});

