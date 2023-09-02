//This script is designed to test the scenarios for simultaneous purchase policies in AZ

//Import Modules

import { test, expect } from '@playwright/test';
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';
import Papa from 'papaparse';
import fs from 'fs';

//import values from spreadsheet containing scenarios

const csvData = fs.readFileSync('/home/felix/playwright-testing/CA-values-th.csv', 'utf8');
const { data } = Papa.parse(csvData, {
  header: true,
  dynamicTyping: true
});
const scenarios = data;

const csvWriter = createCsvWriter({
  path: 'th-CA-import-data-test.csv',
  header: [
    { id: 'SalesPrice', title: 'Sales Price' },
    { id: 'NewLoanAmt', title: 'New Loan Amount' },
    { id: 'loanPremium', title: 'Loan Premium' },
    { id: 'correct', title: 'Correct (Y/N)' }

    
  ],
});


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
    await page.locator('#ContentPlaceHolder1_ddlState').selectOption('7');
    await page.waitForTimeout(1000)
    await page.locator('#ContentPlaceHolder1_ddlCounty').selectOption('6001');
    await page.waitForTimeout(1000)
    await page.locator('#ContentPlaceHolder1_ddlCity').selectOption('Alameda');
    await page.waitForTimeout(3000)
    await page.waitForTimeout(1000)
    await page.locator('#ContentPlaceHolder1_ddlTransactionType').selectOption('2');
    //await page.waitForTimeout(1000)
    //await page.locator('#ContentPlaceHolder1_ddlPolicyType').selectOption('1');
    //await page.locator('#ContentPlaceHolder1_txtSalePrice').fill(scenario.SalesPrice.toString());
    await page.waitForTimeout(2000)
    await page.locator('#ContentPlaceHolder1_txtLoanAmount1').fill(scenario.NewLoanAmt.toString());
    await page.waitForTimeout(1000)
    await page.getByRole('button', { name: 'Get Quote' }).click();
    await page.waitForTimeout(1000)
    await page.locator('#ContentPlaceHolder1_gvPolicyQuestions_chkboxQuestion_0').check();
    //await page.locator('#ContentPlaceHolder1_gvPolicyQuestions_chkboxQuestion_2').check();
    //await page.locator('#ContentPlaceHolder1_gvPolicyQuestions_chkboxQuestion_4').check();
    await page.getByRole('button', { name: 'Next >>' }).click();
    await page.waitForTimeout(1000)
    
    // Perform any other actions required to get the quote
    const feeAmount = await page.locator('#ContentPlaceHolder1_TRIDPremiumView_gv_TRIDRates > tbody > tr:nth-child(2) > td:nth-child(7)').innerText();
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
