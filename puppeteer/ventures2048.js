const puppeteer = require('puppeteer');

const fillVentures2048 = async (formData) => {
    if (!formData) {
        console.error('No form data received');
        return;
    }

    console.log('Filling 2048 Ventures form with data:', formData);

    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'], executablePath: '/usr/bin/google-chrome-stable' });
    const page = await browser.newPage();
    await page.goto('https://airtable.com/appV89PYGo3zN47f9/shr2lijl8JHhvxghK?prefill_Introd+By+Type=Direct&hide_Introd+By+Type=true', { waitUntil: 'networkidle2' });

    await new Promise(resolve => setTimeout(resolve, 3000));
    const cookieCloseButtonSelector = '.onetrust-close-btn-handler';
    const cookieCloseButton = await page.$(cookieCloseButtonSelector);
    if (cookieCloseButton) {
        await cookieCloseButton.click();
    } else {
        console.log('Cookie close button not found in Ventures2048, continuing...');
    }

    await page.waitForSelector('.formFieldAndSubmitContainer');

    const inputSelectors = [
        '.formFieldAndSubmitContainer .sharedFormField:nth-of-type(2) input', // your_name
        '.formFieldAndSubmitContainer .sharedFormField:nth-of-type(3) input', // your_email
        '.formFieldAndSubmitContainer .sharedFormField:nth-of-type(4) input', // company_name
        '.formFieldAndSubmitContainer .sharedFormField:nth-of-type(6) input', // company_website
        '.formFieldAndSubmitContainer .sharedFormField:nth-of-type(7) .contentEditableTextbox', // twitter_description
        '.formFieldAndSubmitContainer .sharedFormField:nth-of-type(8) input', // deck_link
        '.formFieldAndSubmitContainer .sharedFormField:nth-of-type(9) input', // ceo_linkedin
        '.formFieldAndSubmitContainer .sharedFormField:nth-of-type(10) input', // cto_linkedin
        '.formFieldAndSubmitContainer .sharedFormField:nth-of-type(11) input', // founder_video
        '.formFieldAndSubmitContainer .sharedFormField:nth-of-type(12) input', // date_founded
        '.formFieldAndSubmitContainer .sharedFormField:nth-of-type(13) .contentEditableTextbox', // vision
        '.formFieldAndSubmitContainer .sharedFormField:nth-of-type(15) input', // capital_raised
        '.formFieldAndSubmitContainer .sharedFormField:nth-of-type(16) input', // capital_to_raise
    ];

    const inputFields = await Promise.all(inputSelectors.map(selector => page.$(selector)));

    for (let i = 0; i < inputFields.length; i++) {
        const field = inputFields[i];
        let value;

        switch (i) {
            case 0:
                value = `${formData.first_name} ${formData.last_name}`;
                break;
            case 1:
                value = formData.email;
                break;
            case 2:
                value = formData.company_name;
                break;
            case 3:
                value = formData.company_website;
                break;
            case 4:
                value = formData.company_description;
                break;
            case 5:
                value = formData.pitch_deck;
                break;
            case 6:
                value = formData.ceo_linkedin;
                break;
            case 7:
                value = formData.cto_linkedin;
                break;
            case 8:
                value = formData.founder_video_url;
                break;
            case 9:
                value = formData.date_founded;
                if (value) {
                    const [year, month, day] = value.split('-');
                    value = `${day}.${month}.${year}`;
                }
                break;
            case 10:
                value = formData.vision;
                break;
            case 11:
                value = formData.raising_amount;
                break;
            case 12:
                value = formData.capital_to_raise;
                break;
        }

        if (field && value) {
            await field.click({ clickCount: 3 });
            await field.type(value);
            
        }
    }

     // Обработка выпадающих списков
     const dropdownSelectors = [
        '.formFieldAndSubmitContainer .sharedFormField:nth-of-type(14) [data-testid="autocomplete-button"]', // location
        '.formFieldAndSubmitContainer .sharedFormField:nth-of-type(5) [data-testid="autocomplete-button"]'  // vertical
    ];

    const dropdownFields = await Promise.all(dropdownSelectors.map(selector => page.$(selector)));

    for (let i = 0; i < dropdownFields.length; i++) {
        const field = dropdownFields[i];
        let value = '';

        switch (i) {
            case 0:
                value = formData.specific_location;
                break;
            case 1:
                const allowedValues = [
                    'AI / ML', 'AR / VR', 'Biotech', 'Blockchain', 'Climate', 'Marketplaces', 'Cyber Security', 
                    'Developer Tools', 'Ecommerce Enablement', 'Enterprise', 'FinTech', 'Healthcare', 
                    'Industrial Manufacturing', 'Iot', 'Longevity', 'Robotics', 'SMB SaaS', 'Space Tech', 
                    'Supply Chain', 'Gaming', 'Mobility'
                ];
            
                const industries = formData.industryString.split('; ');
            
                value = 'Other'; // По умолчанию выбираем 'Other'
            
                // Проверяем каждое значение из списка, пока не найдём совпадение
                for (let industry of industries) {
                    if (industry === 'Blockchain / Crypto / NFT / Web3') {
                        value = 'Blockchain';
                        break;
                    } else if (industry === 'Metaverse - AR/VR/ Other') {
                        value = 'AR / VR';
                        break;
                    } else if (industry === 'Cleantech / Climate / Sustainability') {
                        value = 'Climate';
                        break;
                    } else if (industry === 'Manufacturing') {
                        value = 'Industrial Manufacturing';
                        break;
                    } else if (industry === 'Electronics / IOT') {
                        value = 'Iot';
                        break;
                    } else if (industry === 'Robotics / drones') {
                        value = 'Robotics';
                        break;
                    } else if (industry === 'Supply Chain: Logistics / Shipping / Delivery') {
                        value = 'Supply Chain';
                        break;
                    } else if (allowedValues.includes(industry)) {
                        value = industry;
                        break;
                    }
                }
            
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
    await page.screenshot({ path: '2048_ventures_form_before_submission.png', fullPage: true });

    const submitButtonSelector = '.formSubmit .submitButton';
    await page.waitForSelector(submitButtonSelector);
    // await page.evaluate((selector) => {
    // document.querySelector(selector).click();
    // }, submitButtonSelector);
    await new Promise(resolve => setTimeout(resolve, 3000));
    await page.screenshot({ path: '2048_ventures_form_after_submission.png', fullPage: true });
    console.log('2048 Ventures form submitted successfully');

    await browser.close();
};

module.exports = fillVentures2048;
