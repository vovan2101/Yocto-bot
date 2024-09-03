const puppeteer = require('puppeteer');

const fillForm = async (formData) => {
    if (!formData) {
        console.error('No form data received');
        return;
    }

    console.log('Filling Precursorvc form with data:', formData);

    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'], executablePath: '/usr/bin/google-chrome-stable' });
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
    const industries = formData.industryString.split('; ');

    let selectedIndustry = 'Other'; // По умолчанию выбираем 'Other'

    // Проверяем каждое значение из списка, пока не найдём совпадение
    for (let industry of industries) {
        if (industry === 'HR / hiring / employment') {
            selectedIndustry = 'HR Tech';
            break;
        }

        const matchedOption = await page.evaluate((industry) => {
            const options = Array.from(document.querySelectorAll('#input_2_7 option'));
            return options.find(option => option.textContent.trim() === industry) !== undefined;
        }, industry);

        if (matchedOption) {
            selectedIndustry = industry;
            break;
        }
    }

    // Устанавливаем значение для formData.industry
    formData.industry = selectedIndustry;
    
    await page.select('#input_2_7', selectedIndustry);
    await page.type('#input_2_6', formData.company_website);
    await page.type('#input_2_11', formData.pitch_deck);
    let headquarteredValue;
    if (formData.headquartered === 'US' || formData.headquartered === 'Canada' || formData.headquartered === 'Mexico') {
        headquarteredValue = 'North America';
    } else {
        headquarteredValue = 'Outside of North America';
    }
    await page.select('#input_2_12', headquarteredValue);

    let locationValue;

    if ([
        'San Francisco / Bay Area', 'New York', 'Boston', 'Los Angeles',
        'Austin', 'Denver', 'Utah', 'Chicago', 'Seattle', 'Atlanta',
        'Philadelphia', 'US - Other'
    ].includes(formData.specific_location)) {
        locationValue = 'USA';
    } else if (['Toronto', 'Montreal', 'Canada - Other'].includes(formData.specific_location)) {
        locationValue = 'Canada';
    } else if (formData.specific_location === 'Asia - India') {
        locationValue = 'India';
    } else {
        locationValue = formData.other_specific_location;
    }
    await page.type('#input_2_17', locationValue);

   // Обработка поля Legal Structure
   const legalStructures = {
    "Delaware C-Corp": 0,
    "Canadian company": 1,
    "B-Corp": 2,
    "Public Benefit Corporation (PBC)": 3,
    "LLC": 4,
    "S-Corp": 5,
    "Non-profit": 6,
    "Other": 7
    };

    // Поскольку legal_structure не является массивом, просто проверяем его значение
    const structure = formData.legal_structure;

    if (legalStructures.hasOwnProperty(structure)) {
        await page.click(`#choice_2_18_${legalStructures[structure]}`);
        if (structure === "Other" && formData.other_legal_structure) {
            // Если выбран Other, вводим значение в соответствующее поле
            await page.type('#input_2_18_other', formData.other_legal_structure);
        }
    }

    await page.select('#input_2_13', formData.raising_round);
    await page.type('#input_2_15', formData.raising_amount);
    await page.type('#input_2_16', formData.pre_money_valuation);
    await page.screenshot({ path: 'precursorvc_form_before_submission.png', fullPage: true });
    
    // await page.click('#gform_submit_button_2');
    await new Promise(resolve => setTimeout(resolve, 10000));
    await page.screenshot({ path: 'precursorvc_form_after_submission.png', fullPage: true });
    await browser.close();
    console.log('Prescurorvc Form submitted successfully');
};

module.exports = fillForm;
