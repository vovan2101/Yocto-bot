const puppeteer = require('puppeteer');

const fillForm = async (formData) => {
    if (!formData) {
        console.error('No form data received');
        return;
    }

    console.log('Filling Precursorvc form with data:', formData);

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('https://precursorvc.com/startup/', { waitUntil: 'networkidle2' });

    // Подождите, пока элементы формы не загрузятся
    await page.waitForSelector('#input_2_1_3');

    // Заполнение полей формы
    await page.type('#input_2_1_3', formData.first_name);
    await page.type('#input_2_1_6', formData.last_name);
    await page.type('#input_2_2', formData.email); 
    
    if (formData.relationship.toLowerCase() === 'founder') {
        await page.click('#choice_2_3_0');
    } else {
        await page.click('#choice_2_3_1'); 
        await page.type('#input_2_3_other', formData.other_relationship);
    }
    
    await page.type('#input_2_4', formData.company_name);
    await page.type('#input_2_5', formData.company_description);
    const industryOptions = await page.evaluate(() => {
        const options = Array.from(document.querySelectorAll('#input_2_7 option'));
        return options.map(option => ({ text: option.textContent.trim(), value: option.value }));
    });

    const selectedOption = industryOptions.find(option => option.text === formData.industry) || industryOptions.find(option => option.text === 'Other');
    
    await page.select('#input_2_7', selectedOption.value);
    await page.type('#input_2_6', formData.company_website);
    await page.type('#input_2_11', formData.pitch_deck);
    await page.select('#input_2_12', formData.headquartered);
    await page.type('#input_2_17', formData.operating_country);

    // Обработка чекбоксов для Legal Structure
    const legalStructures = {
        "Delaware C-Corp": 0,
        "Canadian company": 1,
        "B-Corp": 2,
        "Public Benefit Corporation (PBC)": 3,
        "LLC": 4,
        "S-Corp": 5,
        "Non-profit": 6
    };
    for (const structure of formData.legal_structure) {
        if (legalStructures.hasOwnProperty(structure)) {
            await page.click(`#choice_2_18_${legalStructures[structure]}`);
        }
    }

    await page.select('#input_2_13', formData.raising_round);
    await page.type('#input_2_15', formData.raising_amount);
    await page.type('#input_2_16', formData.pre_money_valuation);
    await page.screenshot({ path: 'precursorvc_form_before_submission.png', fullPage: true });
    
    // await page.click('#gform_submit_button_2');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await page.screenshot({ path: 'precursorvc_form_after_submission.png', fullPage: true });
    await browser.close();
    console.log('Prescurorvc Form submitted successfully');
};

module.exports = fillForm;
