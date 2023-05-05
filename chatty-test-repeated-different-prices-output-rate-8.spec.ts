import { test } from '@playwright/test';
import fs from 'fs';

test('test', async ({ browser }) => {
  const prices = [900000, 1000000, 1100000, 1200000, 1300000];
  const outputFilePath = 'chatty-output1.txt';
  let outputs: string[] = [];

  const promises = prices.map(async (price) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://quote.closepin.com/Quote?k=WestcorTnAl');
    await page.waitForLoadState('networkidle');
    await page.locator('#MainContent_ddlState').selectOption('TN');
    await page.locator('#MainContent_ddlCounties').selectOption('47093');
    await page.locator('#MainContent_ddlCity').selectOption('Blaine');
    await page.waitForTimeout(1500);
    await page.locator('#MainContent_ddlPolicyType').selectOption('Owner');
    await page.waitForTimeout(3000);
    await page.locator('#MainContent_tbxSalesPrice').fill(String(price));
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.waitForTimeout(1500);
    await page.getByRole('button', { name: 'Get Quote' }).click();
    await page.waitForSelector('#MainContent_rptrRates_rptrStandardFees_0_lblFeeAmount_0');
    const ownerPremium = await page.locator('#MainContent_rptrRates_rptrStandardFees_0_lblFeeAmount_0').textContent();
    const output = `Owner premium for ${price}: ${ownerPremium}\n`;
    await context.close();
    return output;
  });

  outputs = await Promise.all(promises);

  fs.writeFileSync(outputFilePath, outputs.join(''));
});
