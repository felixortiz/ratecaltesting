//This script is designed to test the scenarios for simultaneous purchase policies in AZ

//Import Modules

import { test, expect } from '@playwright/test';
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';

const csvWriter = createCsvWriter({
  path: 'title-hound-test-results-purchase-owner-extended-az1.0.csv',
  header: [
    { id: 'policyType', title: 'Policy Type' },
    { id: 'SalesPrice', title: 'Sales Price' },
    { id: 'NewLoanAmt', title: 'New Loan Amount' },
    { id: 'loanPremium', title: 'Loan Premium' },
    { id: 'correct', title: 'Correct (Y/N)' }

    
  ],
});

const scenarios = [
  { policyType: '2', SalesPrice: '100000.00', loanPremium: '$704.00', NewLoanAmt: '' },
  { policyType: '2', SalesPrice: '250000.00' , loanPremium: '$803.00' },
  { policyType: '2', SalesPrice: '750000.00' , loanPremium: '$823.00' },
  { policyType: '2', SalesPrice: '1500000.00' , loanPremium: '$3329.00' },
  { policyType: '2', SalesPrice: '100000.00' , loanPremium: '$10721.00' },
  { policyType: '2', SalesPrice: '250000.00' , loanPremium: '$10721.00' },
  { policyType: '2', SalesPrice: '750000.00' , loanPremium: '$10721.00' },
  { policyType: '2', SalesPrice: '1500000.00' , loanPremium: '$10721.00' },
  // ... Add all the other scenarios here
];

test.setTimeout(600000);

test('Title Hound Test', async ({ context }) => {
  for (const scenario of scenarios) {
    let page;
    try {
      page = await context.newPage();
    
    await page.goto('https://www.titlehoundonline.com/login.aspx?txtUserName=WLTCUser&txtPassword=wltc4529'); // replace with actual URL

    // Wait for elements before interacting
    await page.waitForSelector('#ContentPlaceHolder1_ddlState', { timeout: 5000 });


    // Fill in the form based on the `scenario`
    await page.locator('#ContentPlaceHolder1_ddlState').selectOption('5');
    await page.waitForTimeout(1000)
    await page.locator('#ContentPlaceHolder1_ddlCounty').selectOption('4001');
    await page.waitForTimeout(1000)
    await page.locator('#ContentPlaceHolder1_ddlCity').selectOption('Alpine');
    await page.waitForTimeout(1000)
    await page.locator('#ContentPlaceHolder1_ddlTransactionType').selectOption('1');
    await page.waitForTimeout(1000)
    await page.locator('#ContentPlaceHolder1_ddlPolicyType').selectOption('1');
    await page.waitForTimeout(2000)
    await page.locator('#ContentPlaceHolder1_txtSalePrice').fill(scenario.SalesPrice);
    await page.waitForTimeout(1000)
    await page.getByRole('button', { name: 'Get Quote' }).click();
    await page.waitForTimeout(1000)
    //await page.locator('#ContentPlaceHolder1_gvPolicyQuestions_chkboxQuestion_1').check();
    await page.locator('#ContentPlaceHolder1_gvPolicyQuestions_chkboxQuestion_2').check();
    await page.waitForTimeout(1000)
    await page.getByRole('button', { name: 'Next >>' }).click();
    await page.waitForTimeout(1000)
    
    // Perform any other actions required to get the quote
    const feeAmount = await page.locator('#ContentPlaceHolder1_TRIDPremiumView_gv_TRIDRates_gv_TRIDRatesDetail_1 > tbody > tr.TRIDPremiumView_TotalRow > td:nth-child(6)').innerText();
        const correct = feeAmount === scenario.loanPremium ? 'Y' : 'N';
    
        await csvWriter.writeRecords([{ 
          policyType: scenario.policyType,
          SalesPrice: scenario.SalesPrice,
          loanPremium: feeAmount, 
          correct 
        }])
        .then(() => console.log('The CSV file was written successfully'));

        console.log("About to start new scenario");
        page = await context.newPage();
        console.log("Page opened");
  
        await new Promise(r => setTimeout(r, 10000)); // Wait for 10 seconds
  
      } catch (error) {
        console.error(`An error occurred: ${error}`);
      } finally {
        if (page) {
          await page.close();
        }
        await context.clearCookies();
        await context.clearPermissions();
      }
    }
  });
