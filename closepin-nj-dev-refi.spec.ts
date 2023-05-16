import { test, expect } from '@playwright/test';
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';


const csvWriter = createCsvWriter({
  path: 'closepin-nj-dev-refi-reissue.csv',
  header: [
    { id: 'loanAmount', title: 'Loan Amount' },
    { id: 'feeAmount', title: 'Fee Amount' },
  ],
});

test.setTimeout(600000);

const loanAmounts = ['450000', '150000'];
const priorloans = ['550000', '100000'];

test('test', async ({ context }) => {
  for (let i = 0; i < loanAmounts.length; i++) {
    const page = await context.newPage();
    await page.goto('https://devquote.closepin.com/Quote?k=test-nj');
    await page.locator('#MainContent_ddlState').selectOption('NJ');
    await new Promise(r => setTimeout(r, 500));
    await page.locator('#MainContent_ddlCounties').selectOption('34001');
    await new Promise(r => setTimeout(r, 500));
    await page.locator('#MainContent_ddlCity').selectOption('Absecon');
    await new Promise(r => setTimeout(r, 500));
    await page.locator('#MainContent_ddlTranType').selectOption('Refinance');
    await new Promise(r => setTimeout(r, 500));
    await page.locator('#MainContent_tbxLoanAmount').fill(loanAmounts[i]);
    await new Promise(r => setTimeout(r, 500));
    await page.getByLabel('Advanced Quote').check();
    await new Promise(r => setTimeout(r, 500));
    await page.locator('#MainContent_tbxPriorLenderAmt').fill(priorloans[i]);  // Fill the prior loan amount
    await new Promise(r => setTimeout(r, 500));
    await page.locator('#MainContent_ddlPriorLenderPolicyMonth').selectOption('1');
    await new Promise(r => setTimeout(r, 500));
    await page.locator('#MainContent_ddlPriorLenderPolicyYear').selectOption('2022');
    await page.getByRole('button', { name: 'Continue' }).click();
    await new Promise(r => setTimeout(r, 500));
    await page.locator('#MainContent_Q1124_0').check();
    await new Promise(r => setTimeout(r, 500));
    await page.locator('#MainContent_Q1082_0').check();
    await new Promise(r => setTimeout(r, 500));
    await page.getByRole('button', { name: 'Get Quote' }).click();
    await new Promise(r => setTimeout(r, 500));

    const feeAmount = await page.locator('#MainContent_rptrRates_rptrStandardFees_0_lblFeeAmount_0').innerText();

    csvWriter.writeRecords([{ loanAmount: loanAmounts[i], feeAmount: feeAmount }])
      .then(() => console.log('The CSV file was written successfully'));

    await context.clearCookies();
    await context.clearPermissions();
    await page.close();
    await new Promise(r => setTimeout(r, 10000));
  }
});
