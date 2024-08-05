const puppeteer = require('puppeteer');

const fillVentures2024 = async (formData) => {
    if (!formData) {
        console.error('No form data received');
        return;
    }

    console.log('Filling 2048 Ventures form with data:', formData);

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://airtable.com/appV89PYGo3zN47f9/shr2lijl8JHhvxghK?prefill_Introd+By+Type=Direct&hide_Introd+By+Type=true', { waitUntil: 'networkidle2' });

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
    console.log('Input fields found:', inputFields.length);

    for (let i = 0; i < inputFields.length; i++) {
        const field = inputFields[i];
        let value;

        switch (i) {
            case 0:
                value = formData.your_name;
                break;
            case 1:
                value = formData.your_email;
                break;
            case 2:
                value = formData.company_name;
                break;
            case 3:
                value = formData.company_website;
                break;
            case 4:
                value = formData.twitter_description;
                break;
            case 5:
                value = formData.deck_link;
                break;
            case 6:
                value = formData.ceo_linkedin;
                break;
            case 7:
                value = formData.cto_linkedin;
                break;
            case 8:
                value = formData.founder_video;
                break;
            case 9:
                value = formData.date_founded;
                break;
            case 10:
                value = formData.vision;
                break;
            case 11:
                value = formData.capital_raised;
                break;
            case 12:
                value = formData.capital_to_raise;
                break;
        }

        if (field && value) {
            console.log(`Filling input field ${i} with value: ${value}`);
            try {
                await field.click({ clickCount: 3 });
                await field.type(value);
            } catch (error) {
                console.error(`Error filling input field ${i}:`, error);
            }
        }
    }

     // Обработка выпадающих списков
     const dropdownSelectors = [
        '.formFieldAndSubmitContainer .sharedFormField:nth-of-type(14) [data-testid="autocomplete-button"]', // location
        '.formFieldAndSubmitContainer .sharedFormField:nth-of-type(5) [data-testid="autocomplete-button"]'  // vertical
    ];

    const dropdownFields = await Promise.all(dropdownSelectors.map(selector => page.$(selector)));
    console.log('Dropdown fields found:', dropdownFields.length);

    for (let i = 0; i < dropdownFields.length; i++) {
        const field = dropdownFields[i];
        let value;

        switch (i) {
            case 0:
                value = formData.location;
                break;
            case 1:
                value = formData.vertical;
                break;
        }

        if (field && value) {
            console.log(`Filling dropdown field ${i} with value: ${value}`);
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
    await page.evaluate((selector) => {
    document.querySelector(selector).click();
    }, submitButtonSelector);
    await new Promise(resolve => setTimeout(resolve, 3000));
    await page.screenshot({ path: '2048_ventures_form_after_submission.png', fullPage: true });
    console.log('2048 Ventures form submitted successfully');

    await browser.close();
};

const formData = {
    your_name: 'John Doe',
    your_email: 'vladeliseykin2101@gmail.com',
    company_name: 'Example Corp',
    vertical: 'AI / ML',
    company_website: 'https://example.com',
    twitter_description: 'A short description of the company.',
    deck_link: 'https://example.com/deck',
    ceo_linkedin: 'https://linkedin.com/in/ceo',
    cto_linkedin: 'https://linkedin.com/in/cto',
    founder_video: 'https://youtube.com/example',
    date_founded: '01.01.2020',
    vision: 'Our vision is to dominate the market in 5 years.',
    location: 'San Francisco / Bay Area',
    capital_raised: '100000',
    capital_to_raise: '500000',
};

fillVentures2024(formData);
