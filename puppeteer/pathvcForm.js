const puppeteer = require('puppeteer');

const fillPathvcForm = async (formData) => {
    if (!formData) {
        console.error('No form data received');
        return;
    }

    console.log('Filling Path VC form with data:', formData);

    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'], executablePath: '/usr/bin/google-chrome-stable' });
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

    const industries = formData.industryString.split('; ');

    let selectedIndustryValue = 'Other'; // По умолчанию выбираем 'Other'

    // Проверяем каждое значение из списка, пока не найдём совпадение
    for (let industry of industries) {
        if (industry === 'AI / ML') {
            selectedIndustryValue = 'Another option';
            break;
        } else if (industry === 'Real Estate / Housing') {
            selectedIndustryValue = 'Property Tech';
            break;
        } else if (industry === 'Legal / government / regulation') {
            selectedIndustryValue = 'Legal Tech';
            break;
        } else if (industry.includes('Fin Tech')) {
            selectedIndustryValue = 'Financial Tech';
            break;
        }

        const matchedValue = await page.evaluate((industry) => {
            const options = Array.from(document.querySelectorAll('select[name="Sector"] option'));
            const matched = options.find(option => option.textContent.trim() === industry);
            return matched ? matched.value : null;
        }, industry);

        if (matchedValue) {
            selectedIndustryValue = matchedValue;
            break;
        }
    }

    // Используем значение `value` для выбора в форме
    await page.select('select[name="Sector"]', selectedIndustryValue);


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
