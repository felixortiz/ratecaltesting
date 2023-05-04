import { test, expect } from '@playwright/test';
import fs from 'fs';

test('test', async ({ page }) => {
  try {
    await page.goto('https://quote.closepin.com/Quote?k=WestcorTnAl');
    await page.locator('#MainContent_ddlState').selectOption('TN');
    await page.locator('#MainContent_ddlCounties').selectOption('47093');
    await page.locator('#MainContent_ddlCity').selectOption('Blaine');
    await page.locator('#MainContent_ddlPolicyType').selectOption('Owner');
    await page.locator('#MainContent_tbxSalesPrice').fill('200000');
    await page.locator('#MainContent_tbxSalesPrice').fill('200000');
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('button', { name: 'Get Quote' }).click();
    await page.waitForSelector('#MainContent_rptrRates_rptrStandardFees_0_lblFeeAmount_0', { timeout: 5000 });
    const result = await page.$eval('#MainContent_rptrRates_rptrStandardFees_0_lblFeeAmount_0', element => element.textContent);
    fs.writeFile('chattyresult.txt', result, (err) => {
      if (err) throw err;
      console.log('Result saved to chatty-error-log.txt');
    });
  } catch (error) {
    console.error(error);
  }
});
