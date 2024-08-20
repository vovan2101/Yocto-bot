const puppeteer = require('puppeteer');

const fillWischoffForm = async (formData) => {
    if (!formData) {
        console.error('No form data received');
        return;
    }

    console.log('Filling Wischoff form with data:', formData);

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('https://airtable.com/appl0n7pzw0060tns/shr28rdgNSzNC7ioU', { waitUntil: 'networkidle2' });

    const cookieCloseButtonSelector = '.onetrust-close-btn-handler';
    const cookieCloseButton = await page.$(cookieCloseButtonSelector);
    if (cookieCloseButton) {
        await cookieCloseButton.click();
    }

    await page.waitForSelector('.formFieldAndSubmitContainer');

    const inputSelectors = [
        '.formFieldAndSubmitContainer .sharedFormField:nth-of-type(1) input', // company_name
        '.formFieldAndSubmitContainer .sharedFormField:nth-of-type(6) input', // email
    ];

    const inputFields = await Promise.all(inputSelectors.map(selector => page.$(selector)));

    for (let i = 0; i < inputFields.length; i++) {
        const field = inputFields[i];
        let value;

        switch (i) {
            case 0:
                value = formData.company_name;
                break;
            case 1:
                value = formData.email;
                break;
        }

        if (field && value) {
            await field.click({ clickCount: 3 });
            await field.type(value);
        }
    }

    // Обработка выпадающих списков
    const dropdownSelectors = [
        '.formFieldAndSubmitContainer .sharedFormField:nth-of-type(2) [data-testid="autocomplete-button"]', // industry
        '.formFieldAndSubmitContainer .sharedFormField:nth-of-type(3) [data-testid="autocomplete-button"]', // location
        '.formFieldAndSubmitContainer .sharedFormField:nth-of-type(4) [data-testid="autocomplete-button"]', // stage
    ];

    const dropdownFields = await Promise.all(dropdownSelectors.map(selector => page.$(selector)));

    for (let i = 0; i < dropdownFields.length; i++) {
        const field = dropdownFields[i];
        let value;

        switch (i) {
            case 0:
            value = 'Other'; // По умолчанию выбираем 'Other'
            const industries = formData.industryString.split('; ');

            // Проверяем каждое значение из списка, пока не найдём совпадение
            for (let industry of industries) {
                if (industry === 'FinTech') {
                    value = formData.fintech_type;
                    break;
                } else if (industry === 'Cloudtech and DevOps') {
                    value = 'Cloud infrastructure';
                    break;
                } else if (['Enterprise', 'Consumer', 'Vertical Saas', 'Cloud Infrastructure', 'B2B Marketplace', 'Healthcare'].includes(industry)) {
                    value = industry;
                    break;
                }
            }
            break
            case 1:
                value = formData.headquartered;
                value = value === 'US' ? 'US' : 'International';
                break;
            case 2:
                value = formData.raising_round;
                if (value === 'Pre-Seed' || value === 'Pre-Seed extension') {
                    value = 'Pre-seed';
                } else if (value === 'Seed' || value === 'Seed extension') {
                    value = 'Seed';
                } else if (value === 'Series A') {
                    value = 'Series A';
                } else {
                    value = formData.beyond_series_a_round;
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

    const attachmentSelector = '.formFieldAndSubmitContainer .sharedFormField:nth-of-type(5) [role="button"]';
    const urlButtonSelector = '#uppy-uploader-sidenav-child-url';
    const urlInputSelector = 'input[data-testid="urlInput"]';
    const submitUrlButtonSelector = 'button[data-testid="submitUrlButton"]';
    const uploadButtonSelector = 'button[data-testid="upload-button"]';

    await page.waitForSelector(attachmentSelector);
    const attachButton = await page.$(attachmentSelector);
    if (attachButton) {
        await attachButton.click();
        await page.waitForSelector(urlButtonSelector, { visible: true });
        const urlButton = await page.$(urlButtonSelector);
        if (urlButton) {
            await urlButton.click();
            await page.waitForSelector(urlInputSelector, { visible: true });
            const urlInput = await page.$(urlInputSelector);
            if (urlInput) {
                await urlInput.type(formData.pitch_deck);
                await new Promise(resolve => setTimeout(resolve, 2000));
                const submitUrlButton = await page.$(submitUrlButtonSelector);
                if (submitUrlButton) {
                    await submitUrlButton.click();
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    await page.waitForSelector(uploadButtonSelector, { visible: true });
                    const uploadButton = await page.$(uploadButtonSelector);
                    if (uploadButton) {
                        await uploadButton.click();
                        await new Promise(resolve => setTimeout(resolve, 2000));
                    }
                }
            }
        }
    }

    await page.screenshot({ path: 'wischoff_form_before_submission.png', fullPage: true });

    const submitButtonSelector = '.formSubmit .submitButton';
    await page.waitForSelector(submitButtonSelector);
    // await page.click(submitButtonSelector);
    await page.screenshot({ path: 'wischoff_form_after_submission.png', fullPage: true });
    console.log('Wischoff form submitted successfully');

    await browser.close();
};

module.exports = fillWischoffForm;
