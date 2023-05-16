import { test, expect } from '@playwright/test';
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';

const csvWriter = createCsvWriter({
  path: 'closepin-nj-dev-purchase-lender-enchanced.csv',
  header: [
    { id: 'salesPrice', title: 'Sales Price' },
    { id: 'feeAmount', title: 'Fee Amount' },
  ],
});

const salesPrices = ['100001', '450000', '2000001'];

test.setTimeout(600000);

test('test', async ({ context }) => {
  for (let i = 0; i < salesPrices.length; i++) {
    const page = await context.newPage();
    await page.goto('https://devquote.closepin.com/Quote?k=test-nj');
    await page.locator('#MainContent_ddlState').selectOption('NJ');
    await new Promise(r => setTimeout(r, 500));
    await page.locator('#MainContent_ddlCounties').selectOption('34001');
    await new Promise(r => setTimeout(r, 500));
    await page.locator('#MainContent_ddlCity').selectOption('Absecon');
    await new Promise(r => setTimeout(r, 500));
    await page.locator('#MainContent_ddlTranType').selectOption('Purchase');
    await new Promise(r => setTimeout(r, 500));
    await page.locator('#MainContent_ddlPolicyType').selectOption('Lender');
    await new Promise(r => setTimeout(r, 500));
    await page.locator('#MainContent_tbxLoanAmount').fill(salesPrices[i]);
    await new Promise(r => setTimeout(r, 500));
    await page.getByRole('button', { name: 'Continue' }).click();
    await new Promise(r => setTimeout(r, 500));
    //await page.locator('#MainContent_Q863_0').check();
    await page.locator('#MainContent_Q846_0').check();
    await new Promise(r => setTimeout(r, 500));
    await page.getByRole('button', { name: 'Get Quote' }).click();
    await new Promise(r => setTimeout(r, 500));

    const feeAmount = await page.locator('#MainContent_rptrRates_rptrStandardFees_0_lblFeeAmount_0').innerText();

    csvWriter.writeRecords([{ salesPrice: salesPrices[i], feeAmount: feeAmount }])
      .then(() => console.log('The CSV file was written successfully'));

    await context.clearCookies();
    await context.clearPermissions();
    await page.close();
    await new Promise(r => setTimeout(r, 10000));
  }
});
