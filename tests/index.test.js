const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

test('index.html structure and content', () => {
    const htmlPath = path.join(__dirname, '..', 'index.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');

    // Basic structure
    assert.ok(htmlContent.includes('<!DOCTYPE html>'), 'Has doctype declaration');
    assert.ok(htmlContent.includes('<html lang="en">'), 'Has html tag with language en');
    
    // Head section
    assert.ok(htmlContent.includes('<title>Rohan Varshney</title>'), 'Has correct title');
    assert.ok(htmlContent.includes('href="./assets/img/logo.ico"'), 'Has favicon references');
    
    // Main Content
    assert.ok(htmlContent.includes('<h1 class="question">Rohan Varshney'), 'Has main heading');
    assert.ok(htmlContent.includes('SENIOR SOFTWARE ENGINEER @ LYFT'), 'Has job title description');
    
    // Profile Image
    assert.ok(htmlContent.includes('src="./assets/img/faces/rohan.jpg"'), 'Has profile picture');
    
    // Professional Links
    assert.ok(htmlContent.includes('href="resume.pdf"'), 'Has resume link');
    assert.ok(htmlContent.includes('href="https://linkedin.com/in/rohanvarshney"'), 'Has LinkedIn link');
    assert.ok(htmlContent.includes('href="https://github.com/rohanvarshney"'), 'Has GitHub link');
    
    // Personal Links
    assert.ok(htmlContent.includes('href="https://www.instagram.com/rohanvar"'), 'Has Instagram link');
    assert.ok(htmlContent.includes('href="https://open.spotify.com/user/rohanvar'), 'Has Spotify link');
    assert.ok(htmlContent.includes('href="https://beliapp.co/app/rohanvar"'), 'Has Beli app link');
    
    // Sections and Taglines
    assert.ok(htmlContent.includes('Professional'), 'Has Professional section');
    assert.ok(htmlContent.includes('Making data move faster to the right places.'), 'Has Professional tagline');
    assert.ok(htmlContent.includes('Personal'), 'Has Personal section');
    assert.ok(htmlContent.includes('Always moving, always eating, always listening.'), 'Has Personal tagline');
    assert.ok(htmlContent.includes('Portfolio'), 'Has Portfolio section');
    assert.ok(htmlContent.includes('Making crowds move to the right frequencies.'), 'Has Portfolio tagline');

    // Portfolio Links and Coming Soon Banner
    assert.ok(htmlContent.includes('data-analytics-label="Raas / Garba"'), 'Has Raas / Garba portfolio item');
    assert.ok(htmlContent.includes('data-analytics-label="SpotKit"'), 'Has SpotKit portfolio item');
    assert.ok(htmlContent.includes('data-analytics-label="DJing"'), 'Has DJing portfolio item');
    assert.ok(htmlContent.includes('data-analytics-label="Production"'), 'Has Production portfolio item');
    assert.ok(htmlContent.includes('coming-soon-banner'), 'Has coming soon banner for portfolio links');
    assert.ok(!htmlContent.includes('/raas'), 'Home page does not link directly to /raas');
    assert.ok(htmlContent.includes('src="./assets/js/analytics.js"'), 'Includes shared analytics script');
    assert.ok(htmlContent.includes('data-analytics-event="resume_download"'), 'Tracks resume downloads');
});

test('raas/index.html structure and content', () => {
    const raasPath = path.join(__dirname, '..', 'raas', 'index.html');
    const raasContent = fs.readFileSync(raasPath, 'utf8');

    assert.ok(raasContent.includes('<!DOCTYPE html>'), 'Has doctype declaration');
    assert.ok(raasContent.includes('<title>Raas / Garba Resources | Rohan Varshney</title>'), 'Has correct title');
    assert.ok(raasContent.includes('id="statistics"'), 'Has Statistics section');
    assert.ok(raasContent.includes('Statistics'), 'Has Statistics heading');
    assert.ok(raasContent.includes('<div class="stat-value">19</div>'), 'Has 19 Team Mixes stat');
    assert.ok(raasContent.includes('<div class="stat-value">12</div>'), 'Has 12 Colleges Mixed For stat');
    assert.ok(raasContent.includes('<div class="stat-value">87</div>'), 'Has 87 Bid Points Earned stat');
    assert.ok(raasContent.includes('National Champion Mixes'), 'Has National Champion Mixes card');
    assert.ok(raasContent.includes('aria-label="2 National Champion Mixes"'), 'Has 2 National Champion Mixes card label');
    assert.ok(raasContent.includes('us-map-svg'), 'Has US heatmap SVG');
    assert.ok(raasContent.includes('map-tooltip'), 'Has map hover tooltip');

    const expectedPins = [
        ['GT Ramblin\' Raas', '2019, 2021, 2022'],
        ['UCF Knightraas', '2019, 2021, 2022'],
        ['Dirty South Dandiya', '2021, 2022'],
        ['Cornell Big Red Raas', '2021, 2022'],
        ['Columbia Raas', '2019, 2021'],
        ['UVA Hooraas', '2021'],
        ['VCU Ricochet Raas', '2021'],
        ['Pitt PantheRaas', '2019'],
        ['UM SwaggeRaas', '2019'],
        ['UF Gatoraas', '2021'],
        ['SLU Raas', '2021'],
        ['UCRaas', '2021'],
    ];
    for (const [team, years] of expectedPins) {
        assert.ok(
            raasContent.includes(`data-team="${team}"`) && raasContent.includes(`data-years="${years}"`),
            `Has map pinpoint for ${team} (${years})`
        );
    }

    assert.ok(raasContent.includes('Fun Facts'), 'Has Fun Facts subsection');
    assert.ok(raasContent.includes('id="hall-of-fame"'), 'Has Hall Of Fame section');
    assert.ok(raasContent.includes('Hall Of Fame'), 'Has Hall Of Fame heading');
    assert.ok(raasContent.includes('DSD Mix 2021'), 'Has DSD Mix 2021 Hall Of Fame item');
    assert.ok(raasContent.includes('GT Mix 2022'), 'Has GT Mix 2022 Hall Of Fame item');
    assert.ok(raasContent.includes('data-analytics-event="raas_hof_click"'), 'Tracks Hall Of Fame clicks');
    assert.ok(raasContent.includes('id="resources"'), 'Has Resources section');
    assert.ok(raasContent.includes('Resources'), 'Has Resources heading');

    const statsIndex = raasContent.indexOf('id="statistics"');
    const hofIndex = raasContent.indexOf('id="hall-of-fame"');
    const resourcesIndex = raasContent.indexOf('id="resources"');
    assert.ok(
        statsIndex !== -1 && hofIndex !== -1 && resourcesIndex !== -1 &&
        statsIndex < hofIndex && hofIndex < resourcesIndex,
        'Sections appear in order: Statistics -> Hall Of Fame -> Resources'
    );

    assert.ok(raasContent.includes('Project Files'), 'Has Project Files section');
    assert.ok(raasContent.includes('How to Mix'), 'Has How to Mix section');
    assert.ok(raasContent.includes('Sound FX'), 'Has Sound FX section');
    assert.ok(raasContent.includes('href="https://drive.google.com/drive/folders/1tneKiwTXmKsR8wzAICItM6zUChy3d5NX?usp=sharing"'), 'Has Sound FX Google Drive link');
    assert.ok(raasContent.includes('coming-soon-banner'), 'Has coming soon banner for unavailable links');
    assert.ok(raasContent.includes('src="../assets/logo.png"'), 'Has main logo');
    assert.ok(raasContent.includes('src="../assets/freehand-signature-3.png"'), 'Has freehand signature logo');
    assert.ok(raasContent.includes('src="../assets/js/analytics.js"'), 'Includes shared analytics script');
    assert.ok(raasContent.includes('data-analytics-event="raas_resource_click"'), 'Tracks Raas resource clicks');
});

test('assets/js/analytics.js configuration and 100% link coverage', () => {
    const analyticsPath = path.join(__dirname, '..', 'assets', 'js', 'analytics.js');
    const analyticsContent = fs.readFileSync(analyticsPath, 'utf8');

    assert.ok(analyticsContent.includes("var GA_MEASUREMENT_ID = 'G-8RL9F3RF9E';"), 'Configures live GA_MEASUREMENT_ID');
    assert.ok(analyticsContent.includes('googletagmanager.com/gtm.js'), 'Checks for gtm.js Google tag loader');
    assert.ok(analyticsContent.includes('window.trackAnalyticsEvent'), 'Exposes trackAnalyticsEvent helper');
    assert.ok(analyticsContent.includes("querySelectorAll('a[href]')"), 'Automatically binds to all a[href] elements');

    const filesToCheck = [
        path.join(__dirname, '..', 'index.html'),
        path.join(__dirname, '..', 'raas', 'index.html'),
    ];

    for (const filePath of filesToCheck) {
        const content = fs.readFileSync(filePath, 'utf8');
        assert.match(
            content,
            /<head>\s*<script async src="https:\/\/www\.googletagmanager\.com\/gtm\.js\?id=G-8RL9F3RF9E"><\/script>\s*<script>\s*window\.dataLayer = window\.dataLayer \|\| \[\];\s*function gtag\(\)\{dataLayer\.push\(arguments\);\}\s*gtag\('js', new Date\(\)\);\s*<\/script>/,
            `${filePath} includes Google tag snippet immediately after <head>`
        );
        assert.strictEqual(
            (content.match(/googletagmanager\.com\//g) || []).length,
            1,
            `${filePath} includes exactly one Google tag`
        );

        const anchorTags = content.match(/<a\b[^>]*>/gi) || [];
        assert.ok(anchorTags.length > 0, `${path.basename(filePath)} has anchor tags`);

        for (const tag of anchorTags) {
            assert.ok(
                tag.includes('data-analytics-event='),
                `Every <a> tag in ${filePath} has data-analytics-event: ${tag}`
            );
            assert.ok(
                tag.includes('data-analytics-label='),
                `Every <a> tag in ${filePath} has data-analytics-label: ${tag}`
            );
        }
    }
});
