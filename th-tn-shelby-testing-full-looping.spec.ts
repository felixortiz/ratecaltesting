//TH-TN-SHELBY-TESTING
//This script will run the scenarios to test the accuracy of the TH engine that is linked to wltic.com
//requires playwright, cheerio and csv-writer libraries

//This series of tests is for the TH engine in wltic.com for Tenessee, Shelby county
//First test is for all purchase scenarios

//Purchase - Owner's policy only

//Sales prices  $100,000.00 $100,001.00 $1,000,001.00 $100,000.00 $100,001.00 $1,000,001.00 
//Previous Loan prices '50000.00', '100000.00', '500000.00'
//import and set up playwright libraries and set timeout for test



import { test } from '@playwright/test';
import { createObjectCsvWriter } from 'csv-writer';
test.setTimeout(18000000);

//set up prices array to be placed in sales price selector
const salePrices = ['100000.00', '100001.00', '1000001.00'];
const previousloans = ['50000.00', '100000.00', '500000.00'];
const newloanamount1 = ['150000.00', '125000.00', '1250000.00']
const newloanamount2 = ['75000.00', '100000.00', '750000.00']

async function retryLogin(page, attempts) {
  for (let i = 0; i < attempts; i++) {
    await page.goto('https://www.titlehoundonline.com/login.aspx?txtUserName=WLTCUser&txtPassword=wltc4529');

    // Check if login was successful by looking for a specific element
    try {
      await page.waitForSelector('#ContentPlaceHolder1_ddlState', { timeout: 5000 });
      break;
    } catch (error) {
      if (i === attempts - 1) {
        throw new Error('Login failed after multiple attempts');
      }
    }
  }
}

//run the tests with output to a csv
const csvWriter = createObjectCsvWriter({
  path: 'th-tn-shelby-purchase-owner-loop-output.csv',
  header: [
    { id: 'loopIndex', title: 'Loop Index' },
    { id: 'result', title: 'Result' },
  ],
});

test('3 loop test', async ({ browser }) => {
    for (let i = 0; i < salePrices.length; i++) {
      const context = await browser.newContext();
      const page = await context.newPage();
  
    await retryLogin(page, 3); // Replace the previous login attempt with this function call

    await page.locator('#ContentPlaceHolder1_ddlState').selectOption('51');
    await page.waitForTimeout(1000)
    await page.locator('#ContentPlaceHolder1_ddlCounty').selectOption('47157');
    await page.waitForTimeout(1000)
    await page.locator('#ContentPlaceHolder1_ddlCity').selectOption('Arlington');
    await page.waitForTimeout(1000)
    await page.locator('#ContentPlaceHolder1_ddlPolicyType').selectOption('1');
    await page.waitForTimeout(1000)
    await page.locator('#ContentPlaceHolder1_txtSalePrice').fill(salePrices[i]);
    await page.waitForTimeout(1000)
    await page.getByRole('button', { name: 'Get Quote' }).click();
    await page.waitForTimeout(1000)
    await page.getByRole('button', { name: 'Next >>' }).click();

    // Extract the result from the table
    const result = await page.locator('#ContentPlaceHolder1_TRIDPremiumView_gv_TRIDRates > tbody > tr.GridViewRowStyle > td:nth-child(7)').textContent();

    // Write the result to the CSV file
    await csvWriter.writeRecords([{ loopIndex: i + 1, result }]);

    // Close the browser context and wait before the next iteration
    await context.close();
    await new Promise(resolve => setTimeout(resolve, 10000));
  }
});

//The next set of tests is with the enhanced homeowner's policy

test('3 loop test expanded homeowner', async ({ browser }) => {
    for (let i = 0; i < salePrices.length; i++) {
      const context = await browser.newContext();
      const page = await context.newPage();

      const csvWriter = createObjectCsvWriter({
        path: 'th-tn-shelby-purchase-owner-loop-expanded-output.csv',
        header: [
          { id: 'loopIndex', title: 'Loop Index' },
          { id: 'result', title: 'Result' },
        ],
      });
      
  
      await page.goto('https://www.titlehoundonline.com/login.aspx?txtUserName=WLTCUser&txtPassword=wltc4529');
  
      await page.locator('#ContentPlaceHolder1_ddlState').selectOption('51');
      await page.waitForTimeout(1000)
      await page.locator('#ContentPlaceHolder1_ddlCounty').selectOption('47157');
      await page.waitForTimeout(1000)
      await page.locator('#ContentPlaceHolder1_ddlCity').selectOption('Arlington');
      await page.waitForTimeout(1000)
      await page.locator('#ContentPlaceHolder1_ddlPolicyType').selectOption('1');
      await page.waitForTimeout(1000)
      await page.locator('#ContentPlaceHolder1_txtSalePrice').fill(salePrices[i]);
      await page.waitForTimeout(1000)
      await page.getByRole('button', { name: 'Get Quote' }).click();
      await page.waitForTimeout(1000)
      await page.locator('#ContentPlaceHolder1_gvPolicyQuestions_chkboxQuestion_1').check();
      await page.getByRole('button', { name: 'Next >>' }).click();
  
      // Extract the result from the table
      const result = await page.locator('#ContentPlaceHolder1_TRIDPremiumView_gv_TRIDRates > tbody > tr.GridViewRowStyle > td:nth-child(7)').textContent();
  
      // Write the result to the CSV file
      await csvWriter.writeRecords([{ loopIndex: i + 1, result }]);
  
      // Close the browser context and wait before the next iteration
      await context.close();
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
  });

  //the next set of tests is with a risssue discount.  

  test('3 loop test reissueonly', async ({ browser }) => {
    for (let i = 0; i < salePrices.length; i++) {
      for (let j = 0; j < previousloans.length; j++) {
        const context = await browser.newContext();
        const page = await context.newPage();
        
      const csvWriter = createObjectCsvWriter({
        path: 'th-tn-shelby-purchase-owner-loop-reissue-dscnt.csv',
        header: [
          { id: 'loopIndex', title: 'Loop Index' },
          { id: 'result', title: 'Result' },
        ],
      });
      
  
      await page.goto('https://www.titlehoundonline.com/login.aspx?txtUserName=WLTCUser&txtPassword=wltc4529');
  
      await page.locator('#ContentPlaceHolder1_ddlState').selectOption('51');
      await page.waitForTimeout(1000)
      await page.locator('#ContentPlaceHolder1_ddlCounty').selectOption('47157');
      await page.waitForTimeout(1000)
      await page.locator('#ContentPlaceHolder1_ddlCity').selectOption('Arlington');
      await page.waitForTimeout(1000)
      await page.locator('#ContentPlaceHolder1_ddlPolicyType').selectOption('1');
      await page.waitForTimeout(1000)
      await page.locator('#ContentPlaceHolder1_txtSalePrice').fill(salePrices[i]);
      await page.locator('#ContentPlaceHolder1_txtPriorLenderPolicyAmount').fill(previousloans[j]);      await page.locator('#ContentPlaceHolder1_ddlDaysLenderPolicyAge').selectOption('1');
      await page.locator('#ContentPlaceHolder1_ddlMonthsLenderPolicyAge').selectOption('1');
      await page.locator('#ContentPlaceHolder1_ddlYearsLenderPolicyAge').selectOption('2022');
      await page.waitForTimeout(1000)
      await page.getByRole('button', { name: 'Get Quote' }).click();
      await page.waitForTimeout(1000)
      await page.locator('#ContentPlaceHolder1_gvPolicyQuestions_chkboxQuestion_1').check();
      await page.getByRole('button', { name: 'Next >>' }).click();
  
      // Extract the result from the table
      const result = await page.locator('#ContentPlaceHolder1_TRIDPremiumView_gv_TRIDRates > tbody > tr.GridViewRowStyle > td:nth-child(7)').textContent();
  
      // Write the result to the CSV file
      await csvWriter.writeRecords([{ loopIndex: `Sale Price ${i + 1}, Previous Loan ${j + 1}`, result }]);

      // Close the browser context and wait before the next iteration
      await context.close();
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
  }
});

//The next test is with an extended ALTA homeowner policy and reissue discount

test('4 loop test reissue expanded', async ({ browser }) => {
    for (let i = 0; i < salePrices.length; i++) {
      for (let j = 0; j < previousloans.length; j++) {
        const context = await browser.newContext();
        const page = await context.newPage();
        
      const csvWriter = createObjectCsvWriter({
        path: 'th-tn-shelby-purchase-owner-loop-reissue-dscnt-expandedowner.csv',
        header: [
          { id: 'loopIndex', title: 'Loop Index' },
          { id: 'result', title: 'Result' },
        ],
      });
      
  
      await page.goto('https://www.titlehoundonline.com/login.aspx?txtUserName=WLTCUser&txtPassword=wltc4529');
  
      await page.locator('#ContentPlaceHolder1_ddlState').selectOption('51');
      await page.waitForTimeout(1000)
      await page.locator('#ContentPlaceHolder1_ddlCounty').selectOption('47157');
      await page.waitForTimeout(1000)
      await page.locator('#ContentPlaceHolder1_ddlCity').selectOption('Arlington');
      await page.waitForTimeout(1000)
      await page.locator('#ContentPlaceHolder1_ddlPolicyType').selectOption('1');
      await page.waitForTimeout(1000)
      await page.locator('#ContentPlaceHolder1_txtSalePrice').fill(salePrices[i]);
      await page.waitForTimeout(1000)
      await page.locator('#ContentPlaceHolder1_txtPriorLenderPolicyAmount').fill(previousloans[j]);      await page.locator('#ContentPlaceHolder1_ddlDaysLenderPolicyAge').selectOption('1');
      await page.waitForTimeout(1000)
      await page.locator('#ContentPlaceHolder1_ddlMonthsLenderPolicyAge').selectOption('1');
      await page.waitForTimeout(1000)
      await page.locator('#ContentPlaceHolder1_ddlYearsLenderPolicyAge').selectOption('2022');
      await page.waitForTimeout(1000)
      await page.getByRole('button', { name: 'Get Quote' }).click();
      await page.waitForTimeout(1000)
      await page.locator('#ContentPlaceHolder1_gvPolicyQuestions_chkboxQuestion_1').check();
      await page.waitForTimeout(1000)
      await page.locator('#ContentPlaceHolder1_gvPolicyQuestions_chkboxQuestion_0').uncheck();
      await page.getByRole('button', { name: 'Next >>' }).click();
      await page.waitForTimeout(1000)

      // Extract the result from the table
      const result = await page.locator('#ContentPlaceHolder1_TRIDPremiumView_gv_TRIDRates > tbody > tr.GridViewRowStyle > td:nth-child(7)').textContent();
  
      // Write the result to the CSV file
      await csvWriter.writeRecords([{ loopIndex: `Sale Price ${i + 1}, Previous Loan ${j + 1}`, result }]);

      // Close the browser context and wait before the next iteration
      await context.close();
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
  }
});

//The next series of tests is for simultaneous purchase issue - owner and lender.

test('5 loop test simultaneous', async ({ browser }) => {
    for (let i = 0; i < salePrices.length; i++) {
      for (let j = 0; j < previousloans.length; j++) {
        const context = await browser.newContext();
        const page = await context.newPage();
        
      const csvWriter = createObjectCsvWriter({
        path: 'th-tn-shelby-purchase-simultaneous.csv',
        header: [
          { id: 'loopIndex', title: 'Loop Index' },
          { id: 'result', title: 'Result' },
        ],
      });
      
  
      await page.goto('https://www.titlehoundonline.com/login.aspx?txtUserName=WLTCUser&txtPassword=wltc4529');
  
      await page.locator('#ContentPlaceHolder1_ddlState').selectOption('51');
      await page.waitForTimeout(1000)
      await page.locator('#ContentPlaceHolder1_ddlCounty').selectOption('47157');
      await page.waitForTimeout(1000)
      await page.locator('#ContentPlaceHolder1_ddlCity').selectOption('Arlington');
      await page.waitForTimeout(1000)      
      await page.locator('#ContentPlaceHolder1_ddlPolicyType').selectOption('2');
      await page.waitForTimeout(1000)
      await page.locator('#ContentPlaceHolder1_txtSalePrice').fill(salePrices[i]);
      await page.waitForTimeout(1000)
      await page.locator('#ContentPlaceHolder1_txtLoanAmount1').fill(newloanamount1);
      await page.waitForTimeout(1000)
      await page.locator('#ContentPlaceHolder1_ddlDaysLenderPolicyAge').selectOption('1');
      await page.waitForTimeout(1000)
      await page.locator('#ContentPlaceHolder1_ddlMonthsLenderPolicyAge').selectOption('1');
      await page.waitForTimeout(1000)
      await page.locator('#ContentPlaceHolder1_ddlYearsLenderPolicyAge').selectOption('2022');
      await page.waitForTimeout(1000)
      await page.getByRole('button', { name: 'Get Quote' }).click();
      await page.waitForTimeout(1000)
      await page.locator('#ContentPlaceHolder1_gvPolicyQuestions_chkboxQuestion_1').check();
      await page.waitForTimeout(1000)
      await page.locator('#ContentPlaceHolder1_gvPolicyQuestions_chkboxQuestion_0').uncheck();
      await page.getByRole('button', { name: 'Next >>' }).click();
      await page.waitForTimeout(1000)

      // Extract the result from the table
      const result = await page.locator('#ContentPlaceHolder1_TRIDPremiumView_gv_TRIDRates > tbody > tr.GridViewRowStyle > td:nth-child(7)').textContent();
  
      // Write the result to the CSV file
      await csvWriter.writeRecords([{ loopIndex: `Sale Price ${i + 1}, Previous Loan ${j + 1}`, result }]);

      // Close the browser context and wait before the next iteration
      await context.close();
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
  }
});

//Same test as above, but with different values for loan amount

test('6 loop test simultaneous more', async ({ browser }) => {
    for (let i = 0; i < salePrices.length; i++) {
      for (let j = 0; j < previousloans.length; j++) {
        const context = await browser.newContext();
        const page = await context.newPage();
        
      const csvWriter = createObjectCsvWriter({
        path: 'th-tn-shelby-purchase-simultaneous-more.csv',
        header: [
          { id: 'loopIndex', title: 'Loop Index' },
          { id: 'result', title: 'Result' },
        ],
      });
      
  
      await page.goto('https://www.titlehoundonline.com/login.aspx?txtUserName=WLTCUser&txtPassword=wltc4529');
  
      await page.locator('#ContentPlaceHolder1_ddlState').selectOption('51');
      await page.waitForTimeout(1000)
      await page.locator('#ContentPlaceHolder1_ddlCounty').selectOption('47157');
      await page.waitForTimeout(1000)
      await page.locator('#ContentPlaceHolder1_ddlCity').selectOption('Arlington');
      await page.waitForTimeout(1000)      
      await page.locator('#ContentPlaceHolder1_ddlPolicyType').selectOption('2');
      await page.waitForTimeout(1000)
      await page.locator('#ContentPlaceHolder1_txtSalePrice').fill(salePrices[i]);
      await page.waitForTimeout(1000)
      await page.locator('#ContentPlaceHolder1_txtLoanAmount1').fill(newloanamount2);
      await page.waitForTimeout(1000)
      await page.locator('#ContentPlaceHolder1_ddlDaysLenderPolicyAge').selectOption('1');
      await page.waitForTimeout(1000)
      await page.locator('#ContentPlaceHolder1_ddlMonthsLenderPolicyAge').selectOption('1');
      await page.waitForTimeout(1000)
      await page.locator('#ContentPlaceHolder1_ddlYearsLenderPolicyAge').selectOption('2022');
      await page.waitForTimeout(1000)
      await page.getByRole('button', { name: 'Get Quote' }).click();
      await page.waitForTimeout(1000)
      await page.locator('#ContentPlaceHolder1_gvPolicyQuestions_chkboxQuestion_1').check();
      await page.waitForTimeout(1000)
      await page.locator('#ContentPlaceHolder1_gvPolicyQuestions_chkboxQuestion_0').uncheck();
      await page.getByRole('button', { name: 'Next >>' }).click();
      await page.waitForTimeout(1000)

      // Extract the result from the table
      const result = await page.locator('#ContentPlaceHolder1_TRIDPremiumView_gv_TRIDRates > tbody > tr.GridViewRowStyle > td:nth-child(7)').textContent();
  
      // Write the result to the CSV file
      await csvWriter.writeRecords([{ loopIndex: `Sale Price ${i + 1}, Previous Loan ${j + 1}`, result }]);

      // Close the browser context and wait before the next iteration
      await context.close();
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
  }
});

