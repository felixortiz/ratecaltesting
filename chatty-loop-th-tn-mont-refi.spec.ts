import { test, expect } from '@playwright/test';
import { createObjectCsvWriter } from 'csv-writer';
import cheerio from 'cheerio';

const csvWriter = createObjectCsvWriter({
  path: 'policy-result-refi-th-tn2.csv',
  header: [
    { id: 'LoanAmount', title: 'Loan Amount' },
    { id: 'Result', title: 'Result' },
  ],
});

test('Test', async ({ page }) => {
  const loanAmounts = ['100000.00', '500000.00', '1000001.00'];

  for (const loanAmount of loanAmounts) {
    await page.goto('https://www.titlehoundonline.com/login.aspx?txtUserName=WLTCUser&txtPassword=wltc4529');
    await page.locator('#ContentPlaceHolder1_ddlTransactionType').selectOption('2');
    await page.waitForTimeout(1000);
    await page.locator('#ContentPlaceHolder1_ddlState').selectOption('51');
    await page.locator('#ContentPlaceHolder1_ddlCounty').selectOption('47125');
    await page.locator('#ContentPlaceHolder1_ddlCity').selectOption('Adams');
    await page.locator('#ContentPlaceHolder1_txtLoanAmount1').click();
    await page.waitForTimeout(1000);
    await page.locator('#ContentPlaceHolder1_txtLoanAmount1').fill(loanAmount);
    await page.getByRole('button', { name: 'Get Quote' }).click();
    await page.waitForTimeout(1000)
    await page.locator('#ContentPlaceHolder1_gvPolicyQuestions_chkboxQuestion_2').check();
    await page.waitForTimeout(1000)
    await page.getByRole('button', { name: 'Next >>' }).click();

    const resultElement = await page.locator('#ContentPlaceHolder1_TRIDPremiumView_gv_TRIDRates');
    const resultHtml = await resultElement.innerHTML();

    const $ = cheerio.load(resultHtml);
    const rows = $('tr').map((_, row) => {
      return $(row)
        .find('td')
        .map((_, cell) => $(cell).text().trim())
        .get();
    }).get();

    const resultTable = rows.join('\n');

    const record = [
      { LoanAmount: loanAmount, Result: resultTable },
    ];
    await csvWriter.writeRecords(record);
  }
});
