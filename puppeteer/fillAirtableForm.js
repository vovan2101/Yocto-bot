const puppeteer = require('puppeteer');

const fillAirtableForm = async (formData) => {
    if (!formData) {
        console.error('No form data received');
        return;
    }

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://airtable.com/appV89PYGo3zN47f9/shr2lijl8JHhvxghK?prefill_Introd+By+Type=Direct&hide_Introd+By+Type=true', { waitUntil: 'networkidle2' });

    console.log('Navigated to Airtable form page');

    try {
        await page.waitForSelector('input[aria-required="true"]', { timeout: 60000 });
        console.log('Selector for input with aria-required="true" found');
    } catch (error) {
        console.error('Error waiting for selector for input with aria-required="true":', error);
        await browser.close();
        return;
    }

    const fillField = async (xpath, value, screenshotName) => {
        try {
            await page.waitForSelector(`xpath/${xpath}`, { timeout: 5000 });
            await page.evaluate((xpath, value) => {
                const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                const element = result.singleNodeValue;
                if (element) {
                    element.scrollIntoView();
                    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                        element.value = value;
                    } else if (element.contentEditable === 'true') {
                        element.textContent = value;
                    } else {
                        element.innerHTML = value;
                    }
                }
            }, xpath, value);
            console.log(`Filled field: ${xpath} with value: ${value}`);
            await page.screenshot({ path: `${screenshotName}.png` });
            console.log(`Screenshot taken: ${screenshotName}`);
        } catch (error) {
            console.error(`Error filling field: ${xpath}`, error);
        }
    };

    const setDropdownValueEnhanced = async (buttonXPath, value, screenshotName) => {
        try {
            console.log(`Trying to find button with XPath: ${buttonXPath}`);
    
            // Преобразуем XPath в CSS селектор
            const buttonSelector = await page.evaluate((buttonXPath) => {
                const result = document.evaluate(buttonXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                const element = result.singleNodeValue;
                if (!element) {
                    throw new Error(`Element not found for XPath: ${buttonXPath}`);
                }
                return element.outerHTML;
            }, buttonXPath);
    
            // Ожидаем, пока элемент появится на странице с использованием page.waitForSelector
            await page.waitForSelector(buttonSelector, { timeout: 10000 });
    
            // Найдем элемент кнопки и кликнем по нему
            const button = await page.$(buttonSelector);
            if (button) {
                console.log(`Button found. Clicking button...`);
                await button.click();
                await page.waitForTimeout(1000); // Wait for the dropdown options to appear
    
                // Ожидаем появления динамически появившегося поля ввода
                const dynamicInputSelector = 'div[role="combobox"] input[type="text"]';
                console.log(`Trying to find dynamic input with selector: ${dynamicInputSelector}`);
                await page.waitForSelector(dynamicInputSelector, { timeout: 10000 });
    
                // Найдем поле ввода и введем значение
                const input = await page.$(dynamicInputSelector);
                if (input) {
                    console.log(`Input field found. Typing value...`);
                    await input.type(value);
                    await page.keyboard.press('Enter');
                    console.log(`Set dropdown value: ${value} for ${buttonXPath}`);
                    await page.screenshot({ path: `${screenshotName}.png` });
                    console.log(`Screenshot taken: ${screenshotName}`);
                } else {
                    console.error(`Input field not found for selector: ${dynamicInputSelector}`);
                }
            } else {
                console.error(`Dropdown button not found for XPath: ${buttonXPath}`);
            }
        } catch (error) {
            console.error(`Error setting dropdown value: ${buttonXPath}`, error);
        }
    };
    
    try {
        await fillField('//label[contains(text(), "Your name")]/following::input[@type="text" and @aria-required="true"]', formData.first_name, 'first_name'); // Your name
        await fillField('//label[contains(text(), "Your email")]/following::input[@type="email" and @aria-required="true"]', formData.email, 'email'); // Your email
        await fillField('//label[contains(text(), "Name of your company")]/following::input[@type="text" and @aria-required="true"]', formData.company_name, 'company_name'); // Name of your company
        await setDropdownValueEnhanced('//label[contains(text(), "Vertical")]/following::div[@data-testid="autocomplete-button"]/ancestor::div[@data-testid="cell-editor"]', formData.vertical, 'vertical'); // Vertical
        await fillField('//label[contains(text(), "Company Website")]/following::input[@type="url" and @aria-required="true"]', formData.company_website, 'company_website'); // Company Website
        await fillField('//label[contains(text(), "Twitter-length description of your company")]/following::textarea[@aria-required="true"]', formData.twitter_description, 'twitter_description'); // Twitter-length description of your company
        await fillField('//label[contains(text(), "Deck Link")]/following::input[@type="url" and @aria-required="true"]', formData.pitch_deck, 'pitch_deck'); // Deck Link
        await fillField('//label[contains(text(), "CEO LinkedIn")]/following::input[@type="url" and @aria-required="true"]', formData.ceo_linkedin, 'ceo_linkedin'); // CEO LinkedIn
        await fillField('//label[contains(text(), "CTO LinkedIn")]/following::input[@type="url"]', formData.cto_linkedin, 'cto_linkedin'); // CTO LinkedIn
        await fillField('//label[contains(text(), "Link to founder video")]/following::input[@type="url" and @aria-required="true"]', formData.founder_video, 'founder_video'); // Link to founder video
        await fillField('//label[contains(text(), "Date Founded")]/following::input[@type="text" and @aria-required="true"]', formData.date_founded, 'date_founded'); // Date Founded
        await fillField('//label[contains(text(), "Vision")]/following::textarea[@aria-required="true"]', formData.vision, 'vision'); // Vision
        await setDropdownValueEnhanced('//label[contains(text(), "Where are you located?")]/following::div[@data-testid="autocomplete-button"]/ancestor::div[@data-testid="cell-editor"]', formData.location, 'location'); // Where are you located?
        await fillField('//label[contains(text(), "How much capital have you raised?")]/following::input[@type="text" and @aria-required="true"]', formData.raised_capital, 'raised_capital'); // How much capital have you raised?
        await fillField('//label[contains(text(), "How much capital do you want to raise now?")]/following::input[@type="text" and @aria-required="true"]', formData.raising_amount, 'raising_amount'); // How much capital do you want to raise now?

        console.log('Form fields filled');

        await page.setViewport({
            width: 1920,
            height: 1080,
            deviceScaleFactor: 3,
        });

        await page.screenshot({ path: 'form_screenshot_final.png' });
        console.log('Final screenshot taken');

        await page.click('input[type="button"]');
        console.log('Form submitted');
    } catch (error) {
        console.error('Error filling form:', error);
    }

    await browser.close();
    console.log('Airtable form submitted successfully');
};

module.exports = fillAirtableForm;
