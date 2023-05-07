import { test, expect } from '@playwright/test';
import { createObjectCsvWriter } from 'csv-writer';
import cheerio from 'cheerio';

test.setTimeout(300000);

const csvWriter = createObjectCsvWriter({
  path: 'policy-result-refi-th-tn6.csv',
  header: [
    { id: 'upaidbal', title: 'unpaidbal' },
    { id: 'LoanAmount', title: 'Loan Amount' },
    { id: 'Result', title: 'Result' },
  ],
});

test('Test', async ({ browser }) => {
  const loanAmounts = ['100000.00', '500000.00', '1000001.00'];
  const unpaidbal = ['200000.00', '600000.00', '1500000.00'];

  // Create pairs
  const pairs = loanAmounts.map((loanAmount, index) => ({
    loanAmount,
    unpaidBalElem: unpaidbal[index],
  }));

  let loopIndex = 1;
  for (const pair of pairs) {
    console.log(`Loop iteration: ${loopIndex}`);
    console.log(`Current pair: loanAmount=${pair.loanAmount}, unpaidBalElem=${pair.unpaidBalElem}`);

    const context = await browser.newContext();
    const page = await context.newPage();


      await page.goto('https://www.titlehoundonline.com/login.aspx?txtUserName=WLTCUser&txtPassword=wltc4529');
      await page.locator('#ContentPlaceHolder1_ddlTransactionType').selectOption('2');
      await page.waitForTimeout(1000);
      await page.locator('#ContentPlaceHolder1_ddlState').selectOption('51');
      await page.waitForTimeout(1000);
      await page.locator('#ContentPlaceHolder1_ddlCounty').selectOption('47125');  
      await page.waitForTimeout(1000);
      await page.locator('#ContentPlaceHolder1_ddlCity').selectOption('Adams');
      await page.waitForTimeout(1000);
      await page.locator('#ContentPlaceHolder1_txtLoanAmount1').fill(pair.loanAmount);
      await page.waitForTimeout(1000);
      await page.locator('#ContentPlaceHolder1_txtPriorOwnerPolicyAmount').fill(pair.unpaidBalElem);
      await page.locator('#ContentPlaceHolder1_ddlDaysOwnerPolicyAge').selectOption('2');
      await page.locator('#ContentPlaceHolder1_ddlMonthsOwnerPolicyAge').selectOption('2');
      await page.locator('#ContentPlaceHolder1_ddlYearOwnerPolicyAge').selectOption('2023');
      await page.waitForTimeout(1000);
      await page.getByRole('button', { name: 'Get Quote' }).click();
      await page.waitForTimeout(1000);
      await page.locator('#ContentPlaceHolder1_gvPolicyQuestions_chkboxQuestion_0').check();
      await page.waitForTimeout(1000);
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
        { unpaidbal: pair.unpaidBalElem, LoanAmount: pair.loanAmount, Result: resultTable },
      ];
      await csvWriter.writeRecords(record);

      // Close the context, clear cookies, and wait for 20 seconds before the next iteration
    await context.close();
    await new Promise(resolve => setTimeout(resolve, 20000));

    loopIndex++;
  }
});
