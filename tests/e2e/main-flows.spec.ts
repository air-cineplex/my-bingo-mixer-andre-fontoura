/// <reference types="node" />

import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { expect, test, type Page, type TestInfo } from '@playwright/test';

const evidenceDirectory = resolve('tests/26-09-04');

function evidencePath(testInfo: TestInfo, name: string, result: 'passou' | 'falhou') {
  const baseName = `${name}-${testInfo.project.name}-${result}`;
  let path = resolve(evidenceDirectory, `${baseName}.png`);
  let suffix = 2;

  while (existsSync(path)) {
    path = resolve(evidenceDirectory, `${baseName}-${suffix}.png`);
    suffix += 1;
  }

  return path;
}

async function openCleanApp(page: Page) {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
}

test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    await page.screenshot({
      path: evidencePath(testInfo, testInfo.title.split(' ')[0], 'falhou'),
      fullPage: true,
    });
  }
});

test('01-iniciar-jogo apresenta um tabuleiro jogavel', async ({ page }, testInfo) => {
  await openCleanApp(page);

  await expect(page.getByRole('heading', { name: 'Bingo Mixer' })).toBeVisible();
  await expect(page.getByText('Get five in a row to win.')).toBeVisible();
  await page.getByRole('button', { name: 'Start game' }).click();

  const board = page.getByLabel('Bingo board');
  await expect(board).toBeVisible();
  await expect(board.getByRole('button')).toHaveCount(25);
  await expect(board.getByRole('button', { name: 'Free space' })).toBeDisabled();
  await expect(page.getByText('In progress')).toBeVisible();

  await page.screenshot({
    path: evidencePath(testInfo, '01-iniciar-jogo', 'passou'),
    fullPage: true,
  });
});

test('02-completar-bingo exibe o resultado e permite continuar', async ({ page }, testInfo) => {
  await openCleanApp(page);
  await page.getByRole('button', { name: 'Start game' }).click();

  const squares = page.getByLabel('Bingo board').getByRole('button');
  for (let index = 0; index < 5; index += 1) {
    await squares.nth(index).click();
  }

  const dialog = page.getByRole('dialog', { name: 'Bingo' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText('You completed a line.')).toBeVisible();
  await page.screenshot({
    path: evidencePath(testInfo, '02-completar-bingo-modal', 'passou'),
    fullPage: true,
  });

  await dialog.getByRole('button', { name: 'Keep playing' }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByText('Bingo / You completed a line')).toBeVisible();
  await expect(page.locator('.winning-square')).toHaveCount(5);

  await page.screenshot({
    path: evidencePath(testInfo, '02-completar-bingo-continuar', 'passou'),
    fullPage: true,
  });
});

test('03-tema-e-retorno preserva o tema ao voltar ao inicio', async ({ page }, testInfo) => {
  await openCleanApp(page);

  await page.getByText('Dark', { exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: 'Start game' }).click();
  await page.getByRole('button', { name: 'Back to start' }).click();

  await expect(page.getByRole('button', { name: 'Start game' })).toBeVisible();
  await expect(page.getByRole('radio', { name: 'Dark' })).toBeChecked();
  await expect(page.getByText('How to play')).toBeVisible();

  await page.screenshot({
    path: evidencePath(testInfo, '03-tema-e-retorno', 'passou'),
    fullPage: true,
  });
});