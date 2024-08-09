const puppeteer = require('puppeteer');

const fillPathvcForm = async (formData) => {
    if (!formData) {
        console.error('No form data received');
        return;
    }

    console.log('Filling Path VC form with data:', formData);

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('https://www.path.vc/form', { waitUntil: 'networkidle2' });

    // Подождите, пока элементы формы не загрузятся
    await page.waitForSelector('input[name="Founder-Name"]');

    // Заполнение полей формы
    await page.type('input[name="Founder-Name"]', formData.first_name);
    await page.type('input[name="Founder-Name-2"]', formData.last_name);
    await page.type('input[name="E-mail-Address"]', formData.email);
    await page.type('input[name="Founder-LinkedIn"]', formData.ceo_linkedin);
    await page.type('input[name="Company-Name"]', formData.company_name);
    await page.type('input[name="One-line-Description"]', formData.company_description);
    await page.type('input[name="url"]', formData.company_website);

    let industry = formData.industry;
    if (industry === 'AI / ML') {
        industry = 'AI / Machine Learning';
    } else if (industry === 'Real Estate / Housing') {
        industry = 'Property Tech';
    } else if (industry === 'Legal / government / regulation') {
        industry = 'Legal Tech';
    } else if (industry.includes('Fin Tech')) {
        industry = 'Financial Tech';
    }

    const industryOptions = await page.evaluate(() => {
        const options = Array.from(document.querySelectorAll('select[name="Sector"] option'));
        return options.map(option => ({ text: option.textContent.trim(), value: option.value }));
    });

    const selectedOption = industryOptions.find(option => option.text === industry) || industryOptions.find(option => option.text === 'Other');
    
    await page.select('select[name="Sector"]', selectedOption.value);

    await page.type('input[name="Video-pitch-URL"]', formData.founder_video_url);
    await page.type('input[name="Pitch-Deck-URL"]', formData.pitch_deck);
    await page.screenshot({ path: 'pathvc_form_before_submission.png', fullPage: true });

    // Отправка формы
    // await page.click('input[type="submit"]');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await page.screenshot({ path: 'pathvc_form_after_submission.png', fullPage: true });
    await browser.close();
    console.log('Path VC form submitted successfully');
};

module.exports = fillPathvcForm;
