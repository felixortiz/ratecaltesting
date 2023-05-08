import { test, expect } from '@playwright/test';
import { createObjectCsvWriter } from 'csv-writer';
import cheerio from 'cheerio';
test.setTimeout(600000);

const csvWriter = createObjectCsvWriter({
  path: 'standard_fees_expanded_loan.csv',
  header: [
    { id: 'loopIndex', title: 'Loop Index' },
    { id: 'standardFee', title: 'Standard Fee' },
  ],
});

test('test', async ({ browser }) => {
  const loanAmounts = ['100000.00', '500000.00', '1000001.00', '100000.00', '500000.00', '1000001.00', '100000.00', '500000.00', '1000001.00'];
  const priorOwnerAmounts = ['100000.00', '500000.00', '1000001.00', '50000.00', '250000.00', '500000.00', '200000.00', '600000.00', '1500000.00'];

  for (let i = 0; i < 9; i++) {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    await page.goto('https://quote.closepin.com/Quote?k=WestcorTnAl');
    await page.locator('#MainContent_ddlTranType').selectOption('Refinance');
    await page.waitForTimeout(1000);
    await page.locator('#MainContent_ddlState').selectOption('TN');
    await page.waitForTimeout(1000);
    await page.locator('#MainContent_ddlCounties').selectOption('47001');
    await page.waitForTimeout(1000);
    await page.locator('#MainContent_ddlCity').selectOption('Andersonville');
    await page.waitForTimeout(1000);
    await page.getByLabel('Advanced Quote').check();
    await page.waitForTimeout(1000);
    await page.locator('#MainContent_tbxLoanAmount').fill(loanAmounts[i]);
    await page.waitForTimeout(1000);
    await page.locator('#MainContent_tbxPriorQwnerAmt').fill(priorOwnerAmounts[i]);
    await page.waitForTimeout(1000);
    await page.locator('#MainContent_ddlPriorOwnerPolicyMonth').selectOption('1');
    await page.waitForTimeout(1000);
    await page.locator('#MainContent_ddlPriorOwnerPolicyYear').selectOption('2022');
    await page.waitForTimeout(1000);
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.waitForTimeout(1000);
    await page.locator('#MainContent_Q214_0').check();
    await page.waitForTimeout(1000);
    await page.locator('#MainContent_Q1080_0').check();
    await page.getByRole('button', { name: 'Get Quote' }).click();
    await page.waitForTimeout(1000);

    const standardFee = await page.locator('#MainContent_rptrRates_rptrStandardFees_0_lblFeeAmount_0').textContent();
    await csvWriter.writeRecords([{ loopIndex: i + 1, standardFee }]);
    
    await context.close();
    await new Promise(resolve => setTimeout(resolve, 20000));
  }
});
