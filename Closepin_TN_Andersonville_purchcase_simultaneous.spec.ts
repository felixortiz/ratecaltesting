import { test } from '@playwright/test';
import { createObjectCsvWriter } from 'csv-writer';
import fs from 'fs';
test.setTimeout(600000);

test('test', async ({ browser }) => {
  const prices = [100000.00, 100001.00, 1000001.00, 100000.00, 100001.00, 1000001.00];
  const loanAmounts = ['150000.00', '125000.00', '1250000.00', '75000.00', '100000', '750000'];

  const csvWriter = createObjectCsvWriter({
    path: 'Closepin_TN_Andersonville_purchcase_simultaneous_extended_result.csv',
    header: [
      { id: 'price', title: 'Price' },
      { id: 'loanAmount', title: 'Loan Amount' },
      { id: 'feeAmount2', title: 'Fee Amount 2' },
      { id: 'feeAmount5', title: 'Fee Amount 5' },
    ],
  });

  const records = [];
  for (let i = 0; i < prices.length; i++) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://quote.closepin.com/Quote?k=WestcorTnAl');
    await page.waitForLoadState('networkidle');
    await page.locator('#MainContent_ddlState').selectOption('TN');
    await page.locator('#MainContent_ddlCounties').selectOption('47001');
    await page.locator('#MainContent_ddlCity').selectOption('Andersonville');
    await page.waitForTimeout(1000);
    await page.locator('#MainContent_ddlPolicyType').selectOption('Simultaneous');
    await page.waitForTimeout(1000);
    await page.locator('#MainContent_tbxSalesPrice').fill(String(prices[i]));
    await page.waitForTimeout(1000);
    await page.locator('#MainContent_tbxLoanAmount').fill(loanAmounts[i]);
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.waitForTimeout(1000);
    await page.locator('#MainContent_Q1081_0').click();
    await page.waitForTimeout(1000);
    await page.locator('#MainContent_Q1080_0').click();
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: 'Get Quote' }).click();
    await page.waitForSelector('#MainContent_rptrRates_rptrStandardFees_0_lblFeeAmount_2 > b');
    await page.waitForSelector('#MainContent_rptrRates_rptrStandardFees_0_lblFeeAmount_5 > b');
    const feeAmount2 = await page.locator('#MainContent_rptrRates_rptrStandardFees_0_lblFeeAmount_2 > b').textContent();
    const feeAmount5 = await page.locator('#MainContent_rptrRates_rptrStandardFees_0_lblFeeAmount_5 > b').textContent();
    
    const record = {
      price: prices[i],
      loanAmount: loanAmounts[i],
      feeAmount2: feeAmount2,
      feeAmount5: feeAmount5,
    };

    records.push(record);

    await context.clearCookies();
    await context.clearPermissions();
    await context.close();
    await new Promise(resolve => setTimeout(resolve, 20000));
  }

  await csvWriter.writeRecords(records);
});