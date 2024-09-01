const puppeteer = require('puppeteer');
const path = require('path');

const fillBoostVcForm = async (formData) => {
    if (!formData) {
        console.error('No form data received');
        return;
    }

    console.log('Filling Boost VC form with data:', formData);

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('https://forms.fillout.com/t/gKcwHBe9SQus', { waitUntil: 'networkidle2' });

    await page.waitForSelector('input[data-cy="input-component"][aria-label="What is your full name?"]');

    await page.type('input[data-cy="input-component"][aria-label="What is your full name?"]', `${formData.first_name} ${formData.last_name}`);
    await page.type('input[data-cy="input-component"][aria-label="What is your email address?"]', formData.email);

    let locationValue;

    if (formData.specific_location === 'San Francisco / Bay Area') {
        locationValue = 'San Francisco, California, USA';
    } else if (formData.specific_location === 'New York') {
        locationValue = 'New York, New York, USA';
    } else if (formData.specific_location === 'Boston') {
        locationValue = 'Boston, Massachusetts, USA';
    } else if (formData.specific_location === 'Los Angeles') {
        locationValue = 'Los Angeles, California, USA';
    } else if (formData.specific_location === 'Austin') {
        locationValue = 'Austin, Texas, USA';
    } else if (formData.specific_location === 'Denver') {
        locationValue = 'Denver, Colorado, USA';
    } else if (formData.specific_location === 'Utah') {
        locationValue = 'Salt Lake City, Utah, USA';  // Можете указать любой город в штате Utah
    } else if (formData.specific_location === 'Chicago') {
        locationValue = 'Chicago, Illinois, USA';
    } else if (formData.specific_location === 'Seattle') {
        locationValue = 'Seattle, Washington, USA';
    } else if (formData.specific_location === 'Atlanta') {
        locationValue = 'Atlanta, Georgia, USA';
    } else if (formData.specific_location === 'Philadelphia') {
        locationValue = 'Philadelphia, Pennsylvania, USA';
    } else if (['US - Other', 'Canada - Other', 'Latin America', 'Europe', 'Asia - India', 'Asia - Other', 'Africa'].includes(formData.specific_location)) {
        locationValue = formData.other_specific_location;  // Используем значение из other_specific_location
    } else if (formData.specific_location === 'Toronto') {
        locationValue = 'Toronto, Ontario, Canada';
    } else if (formData.specific_location === 'Montreal') {
        locationValue = 'Montreal, Quebec, Canada';
    }

    await page.type('input[data-cy="input-component"][aria-label="Where are you located? (City, State/Country)"]', locationValue);

    await page.type('textarea[data-cy="text-area"][aria-label="In a few sentences, describe your idea / company."]', formData.company_description);
    await page.type('textarea[data-cy="text-area"][aria-label="In a few sentences, tell us why you / your team are awesome."]', formData.team_description);
    await page.type('textarea[data-cy="text-area"][aria-label="Provide a link to you / your team\'s LinkedIn profiles."]', `${formData.ceo_linkedin} ${formData.cto_linkedin} ${formData.linkedin_profiles}`);
    const fileInputs = await page.$$('.filepond--wrapper .filepond--root input.filepond--browser[type="file"][name="filepond"]');
    if (fileInputs.length >= 2) {
    const videoFileInput = fileInputs[0];
    await videoFileInput.uploadFile(path.resolve(__dirname, '..', formData.founder_video_file));
    const pitchDeckFileInput = fileInputs[1];
    await pitchDeckFileInput.uploadFile(path.resolve(__dirname, '..', formData.pitch_deck_file));
    }
    await page.type('input[data-cy="input-component"][aria-label="How did you hear about us?"]', "Networking events");

    await page.screenshot({ path: 'boostvc_form_before_submission.png', fullPage: true });

    await new Promise(resolve => setTimeout(resolve, 5000));
    // await page.click('button[data-cy="button-component"]');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await page.screenshot({ path: 'boostvc_form_after_submission.png', fullPage: true });
    await browser.close();
    console.log('Boost VC form submitted successfully');
};
module.exports = fillBoostVcForm;