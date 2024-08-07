const puppeteer = require('puppeteer');

const fillEverywhereVcForm = async (formData) => {
    if (!formData) {
        console.error('No form data received');
        return;
    }

    console.log('Filling Everywhere VC form with data:', formData);

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('https://everywhere.vc', { waitUntil: 'networkidle2' });

    await new Promise(resolve => setTimeout(resolve, 9000));
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            let totalHeight = 0;
            let distance = 500;
            let timer = setInterval(() => {
                let scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });


    await page.evaluate(() => {
        const link = document.querySelector('[data-open-contacts]');
        if (link) {
            link.click();
        } else {
            console.error('Link not found');
        }
    });

    await new Promise(resolve => setTimeout(resolve, 5000));

    const cookieCloseButtonSelector = '.cookie-consent-close';
    const cookieCloseButton = await page.$(cookieCloseButtonSelector);
    if (cookieCloseButton) {
        await cookieCloseButton.click();
        console.log('Cookie consent closed');
    }

 // Переключение на iframe
 const frameHandle = await page.$('iframe[data-tally-src]');
 const frame = await frameHandle.contentFrame();

  // Список селекторов для полей ввода
  const inputSelectors = [
    'input[id="5245d670-541b-4356-8956-83cfe98b7943"]', // Name
    'input[id="c49695c3-fa46-4ab4-8215-39ed11410ca3"]', // Email
    'input[id="b4227ff0-989f-4cb1-be3d-0cd6523b7efc"]', // Linkedin
    'input[id="41374a67-e3f7-49cc-81af-065142a8629d"]', // Location
    'input[id="b9dca931-b4c7-4229-a09b-b71e34229fc8"]', // Company Name
    'input[id="ba17fa70-c769-40c8-b21b-41f227ffe8b9"]', // Company Website
    'input[id="64371833-2b47-4552-b9f3-a681b586f4f8"]'  // Investor Deck Link
];

const inputFields = await Promise.all(inputSelectors.map(selector => frame.$(selector)));

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
            value = formData.ceo_linkedin;
            break;
        case 3:
            value = formData.specific_location;
            break;
        case 4:
            value = formData.company_name;
            break;
        case 5:
            value = formData.company_website;
            break;
        case 6:
            value = formData.pitch_deck;
            break;
    }

    if (field && value) {
        console.log(`Typing into field ${i + 1} with value: ${value}`);
        await field.click({ clickCount: 3 });
        await field.type(value);
    }
}
    await page.screenshot({ path: 'everywhere_vc_form_before_submission.png', fullPage: false });
    // await frame.click('button[type="submit"]');
    await new Promise(resolve => setTimeout(resolve, 6000));
    await page.screenshot({ path: 'everywhere_vc_form_after_submission.png', fullPage: false });

    await browser.close();
    console.log('Everywhere VC form submitted successfully');
};

module.exports = fillEverywhereVcForm;
