const puppeteer = require('puppeteer');

const fillIncisiveVenturesForm = async (formData) => {
    if (!formData) {
        console.error('No form data received');
        return;
    }

    console.log('Filling Incisive Ventures form with data:', formData);

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('https://airtable.com/appAMCFupamv6Euf8/shrKq915ChZNzweep', { waitUntil: 'networkidle2' });

    const cookieCloseButtonSelector = '.onetrust-close-btn-handler';
    const cookieCloseButton = await page.$(cookieCloseButtonSelector);
    if (cookieCloseButton) {
        await cookieCloseButton.click();
    }

    await page.waitForSelector('.formFieldAndSubmitContainer');

    const inputSelectors = [
        '.formFieldAndSubmitContainer .sharedFormField:nth-of-type(1) input',
        '.formFieldAndSubmitContainer .sharedFormField:nth-of-type(2) input',
        '.formFieldAndSubmitContainer .sharedFormField:nth-of-type(3) input',
        '.formFieldAndSubmitContainer .sharedFormField:nth-of-type(4) input',
        '.formFieldAndSubmitContainer .sharedFormField:nth-of-type(6) input',
        '.formFieldAndSubmitContainer .sharedFormField:nth-of-type(7) input',
        '.formFieldAndSubmitContainer .sharedFormField:nth-of-type(8) input',
        '.formFieldAndSubmitContainer .sharedFormField:nth-of-type(9) input',
        '.formFieldAndSubmitContainer .sharedFormField:nth-of-type(10) input',
        '.cellContainer .contentEditableTextbox[contenteditable="true"]',
        '.cellContainer .contentEditableTextbox[contenteditable="true"]',
        '.formFieldAndSubmitContainer .sharedFormField:nth-of-type(19) input',
        '.formFieldAndSubmitContainer .sharedFormField:nth-of-type(20) input',
        '.cellContainer .contentEditableTextbox[contenteditable="true"]',
        '.formFieldAndSubmitContainer .cell.formCell[data-columntype="richText"] .ql-container',
        '.cellContainer .contentEditableTextbox[contenteditable="true"]',

    ];

    const inputFields = await Promise.all(inputSelectors.map(selector => page.$(selector)));

    for (let i = 0; i < inputFields.length; i++) {
        const field = inputFields[i];
        let value;

        switch (i) {
            case 0:
                value = formData.first_name;
                break;
            case 1:
                value = formData.last_name;
                break;
            case 2:
                value = formData.company_name;
                break;
            case 3:
                value = formData.email;
                break;
            case 4:
                value = formData.ceo_linkedin;
                break;
            case 5:
                value = formData.cto_linkedin;
                break;
            case 6:
                value = '';
                break;
            case 7:
                value = formData.pitch_deck;
                break;
            case 8:
                value = formData.company_website;
                break;
            case 9:
                value = formData.pitch_description;
                break;
            case 10:
                value = formData.company_solution;
                break;
            case 11:
                value = formData.capital_to_raise;
                break;
            case 12:
                value = formData.post_money_valuation;
                break;
            case 13:
                value = formData.raising_amount;
                break;
            case 14:
                value = '';
                break;
            case 15:
                value = '';
                break;
        }

        if (field && value) {
            await field.click({ clickCount: 3 }).catch(error => console.error(`Error clicking field ${i}:`, error));
            await field.type(value).catch(error => console.error(`Error typing in field ${i}:`, error));
        }
    }

    const dropdownSelectors = [
        '.formFieldAndSubmitContainer .sharedFormField:nth-of-type(5) [data-testid="autocomplete-button"]', // entrepreneurial_experience
        '.formFieldAndSubmitContainer .sharedFormField:nth-of-type(12) [data-testid="autocomplete-button"]', // location
        '.formFieldAndSubmitContainer .sharedFormField:nth-of-type(14) [data-testid="autocomplete-button"]', // primary_product
        '.formFieldAndSubmitContainer .sharedFormField:nth-of-type(15) [data-testid="autocomplete-button"]', // industry
        '.formFieldAndSubmitContainer .sharedFormField:nth-of-type(16) [data-testid="autocomplete-button"]', // product_status
        '.formFieldAndSubmitContainer .sharedFormField:nth-of-type(17) [data-testid="autocomplete-button"]', // revenue
        '.formFieldAndSubmitContainer .sharedFormField:nth-of-type(18) [data-testid="autocomplete-button"]', // raising_round
        '.formFieldAndSubmitContainer .sharedFormField:nth-of-type(23) [data-testid="autocomplete-button"]', // share_startup
        '.formFieldAndSubmitContainer .sharedFormField:nth-of-type(24) [data-testid="autocomplete-button"]', // share_startup
    ];
    const dropdownFields = await Promise.all(dropdownSelectors.map(selector => page.$(selector)));

    for (let i = 0; i < dropdownFields.length; i++) {
        const field = dropdownFields[i];
        let value;

        switch (i) {
            case 0:
                value = formData.prev_experience;
                break;
            case 1:
                value = formData.headquartered;
                if (value === 'US') {
                    value = 'United States of America';
                } else if (value === 'Asia - India / Pakistan / Bangladesh') {
                    value = 'Asia - India / Pakistan';
                } else if (value === 'Mexico' || value === 'Australia / New Zealand') {
                    value = 'Other';
                }
                break;
            case 2:
                if (typeof formData.productString === 'string' && formData.productString.length > 0) {
                    value = formData.productString.split('; ')[0];
                } else {
                    value = ''; 
                }
                break;
            case 3:
                const industries = formData.industryString.split('; ');
                const allowedValues = [
                    'Advertising / Marketing', 'Beauty / Fashion Products', 'Blockchain / Crypto / NFT / Web3', 
                    'Cannabis', 'Cleantech / Climate / Sustainability', 'Communications / Collaboration / Productivity', 
                    'Construction / Materials', 'Data / Analytics', 'AI / ML', 'Development tools & Infrastructure', 
                    'Education / Personal and professional development', 'Electronics / IOT', 
                    'Family / Parenting / Relationships / ElderTech', 'Finance - banking / payments / lending', 
                    'Finance - Insurance', 'Finance - Other', 'Food / Beverages / agriculture', 'Health / Fitness / Wellness', 
                    'HR / hiring / employment', 'Legal / government / regulation', 
                    'Supply Chain: Logistics / Shipping / Delivery', 'Manufacturing', 'Medical devices', 
                    'Mobility / Transportation', 'Personal and Professional Services', 
                    'Pets / animals', 'Physical infrastructure / Utilities', 'Real Estate / Housing', 'Robotics / drones', 
                    'Sales / Operations / Customer Service', 'Science / deep tech', 'Social media / Networking', 
                    'Travel / Hospitality', 'General / Industry agnostic'
                ];
            
                // Нажимаем на селектор для каждого значения
                for (let industry of industries) {
                    let value = 'Other'; // По умолчанию выбираем 'Other'
            
                    if (industry === 'Social Media / Community / Networking') {
                        value = 'Social media / Networking';

                    } else if (industry === 'Augmented reality (AR)' || industry === 'Virtual reality (VR)' ) {
                        value = 'Metaverse - AR/VR/ Other';

                    } else if (allowedValues.includes(industry)) {
                        value = industry;
                    }
                     
            
                    // Нажимаем на селектор
                    await field.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));
            
                    // Выбираем значение
                    await page.keyboard.type(value);
                    await page.keyboard.press('Enter');
            
                    // Добавляем небольшую задержку перед следующей итерацией
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            
                break;
            case 4:
                value = formData.product_status;
                break;
            case 5:
                if (formData.earning_amount === '1-$999') {
                    value = '< 1000';
                } else if (formData.earning_amount === '$1000-$10,000' || formData.earning_amount === '$1000-$4,999') {
                    value = '1000 - 9,999';
                } else if (formData.earning_amount === '$10,000+') {
                    value = '10,000 - 49,999';
                } 
                break;
            case 6:
                value = formData.raising_round;
            
                if (value === 'Pre-Seed extension') {
                    value = 'Pre-Seed';
                } else if (value === 'Seed extension') {
                    value = 'Seed+';
                } else if (value === 'Series A' || value === 'Beyond Series A') {
                    value = 'Series A or later';
                }
                break;
            case 7:
                value = 'Research/Search - google, etc.';
                break;
            case 8:
                value = 'Yes';
                break;
        }

        if (field && value) {
            try {
                await field.click();
                await new Promise(resolve => setTimeout(resolve, 1000));
                await page.keyboard.type(value);
                await page.keyboard.press('Enter');
            } catch (error) {
                console.error(`Error handling dropdown field ${i}:`, error);
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    await page.screenshot({ path: 'incisive_ventures_form_before_submission.png', fullPage: true });

    const submitButtonSelector = '.formSubmit .submitButton';
    // await page.waitForSelector(submitButtonSelector);
    // await page.evaluate((selector) => {
    // document.querySelector(selector).click();
    // }, submitButtonSelector);
    await new Promise(resolve => setTimeout(resolve, 3000));
    await page.screenshot({ path: 'incisive_ventures_form_after_submission.png', fullPage: true });
    console.log('Incisive Ventures form submitted successfully');

    await browser.close();
};

module.exports = fillIncisiveVenturesForm;
