const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

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
    assert.ok(htmlContent.includes('.lyft-pink'), 'Has Lyft pink CSS class');
    assert.ok(htmlContent.includes('SENIOR SOFTWARE ENGINEER @ <span class="lyft-pink">LYFT</span>'), 'Has job title description with pink LYFT');
    
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
    assert.ok(htmlContent.includes('Always exploring, always eating, always listening.'), 'Has Personal tagline');
    assert.ok(htmlContent.includes('Portfolio'), 'Has Portfolio section');
    assert.ok(htmlContent.includes('Moving crowds to the right frequencies.'), 'Has Portfolio tagline');
    assert.ok(htmlContent.includes('<div class="social-section-title">Projects</div>'), 'Has Projects section');
    assert.ok(htmlContent.includes('Moving ideas from concept to code.'), 'Has Projects tagline');

    const professionalIndex = htmlContent.indexOf('<div class="social-section-title">Professional</div>');
    const personalIndex = htmlContent.indexOf('<div class="social-section-title">Personal</div>');
    const portfolioIndex = htmlContent.indexOf('<div class="social-section-title">Portfolio</div>');
    const projectsIndex = htmlContent.indexOf('<div class="social-section-title">Projects</div>');
    const spotkitIndex = htmlContent.indexOf('data-analytics-label="SpotKit"');
    assert.ok(
        professionalIndex !== -1 &&
        personalIndex !== -1 &&
        portfolioIndex !== -1 &&
        projectsIndex !== -1 &&
        professionalIndex < portfolioIndex &&
        portfolioIndex < projectsIndex &&
        projectsIndex < personalIndex,
        'Sections appear in order: Professional -> Portfolio -> Projects -> Personal'
    );
    assert.ok(
        spotkitIndex > projectsIndex && spotkitIndex < personalIndex,
        'SpotKit appears under Projects section'
    );

    // Portfolio & Projects Links and Coming Soon Banner
    assert.ok(htmlContent.includes('data-analytics-label="Raas / Garba"'), 'Has Raas / Garba portfolio item');
    assert.ok(htmlContent.includes('data-analytics-label="SpotKit"'), 'Has SpotKit project item');
    assert.ok(htmlContent.includes('data-analytics-event="project_link_click"'), 'Tracks SpotKit as project_link_click');
    assert.ok(htmlContent.includes('data-analytics-category="projects"'), 'Categorizes SpotKit under projects');
    assert.ok(htmlContent.includes('data-analytics-label="DJing"'), 'Has DJing portfolio item');
    assert.match(htmlContent, /data-analytics-label="DJing"[\s\S]*?<svg\b[\s\S]*?<\/svg>[\s\S]*?<\/a>/, 'DJing uses an inline SVG DJ controller icon');
    assert.ok(htmlContent.includes('data-analytics-label="Production"'), 'Has Production portfolio item');
    assert.ok(htmlContent.includes('coming-soon-banner'), 'Has coming soon banner for unavailable links');
    assert.ok(htmlContent.includes('href="/raas"'), 'Home page links directly to /raas');
    assert.ok(htmlContent.includes('href="/dj"'), 'Home page links directly to /dj');
    assert.ok(htmlContent.includes('href="/production"'), 'Home page links directly to /production');
    assert.ok(htmlContent.includes('href="/SpotKit"'), 'Home page links directly to /SpotKit');
    assert.ok(htmlContent.includes('src="./assets/js/analytics.js"'), 'Includes shared analytics script');
    assert.ok(htmlContent.includes('data-analytics-event="resume_download"'), 'Tracks resume downloads');

    // Desktop-only hover tooltip banner for homepage red icons
    const desktopMediaQuery = '@media (hover: hover) and (pointer: fine) and (min-width: 769px)';
    const mediaStart = htmlContent.indexOf(desktopMediaQuery);
    assert.ok(mediaStart !== -1, 'Has desktop-only hover/pointer/min-width media query');
    const mediaOpenBrace = htmlContent.indexOf('{', mediaStart);
    let depth = 0;
    let mediaEnd = -1;
    for (let i = mediaOpenBrace; i < htmlContent.length; i++) {
        if (htmlContent[i] === '{') depth++;
        else if (htmlContent[i] === '}') {
            depth--;
            if (depth === 0) {
                mediaEnd = i + 1;
                break;
            }
        }
    }
    assert.ok(mediaEnd !== -1, 'Desktop-only media query has matching closing brace');
    const desktopMediaBlock = htmlContent.slice(mediaStart, mediaEnd);
    const outsideDesktopMedia = htmlContent.slice(0, mediaStart) + htmlContent.slice(mediaEnd);

    assert.ok(
        desktopMediaBlock.includes('.social-icons a[data-tooltip]::after') &&
        desktopMediaBlock.includes('content: attr(data-tooltip)'),
        'Desktop-only media query renders tooltip banner from data-tooltip'
    );
    assert.ok(
        !outsideDesktopMedia.includes('.social-icons a:hover') &&
        !outsideDesktopMedia.includes('.social-icons a[data-tooltip]'),
        'No .social-icons a:hover or tooltip rules exist outside desktop-only media query'
    );

    const expectedIconLabels = [
        'Resumé',
        'LinkedIn',
        'GitHub',
        'Instagram',
        'Spotify',
        'Beli',
        'Raas / Garba',
        'DJing',
        'Production',
        'SpotKit',
    ];
    for (const label of expectedIconLabels) {
        assert.ok(
            htmlContent.includes(`aria-label="${label}"`) &&
            htmlContent.includes(`data-tooltip="${label}"`),
            `Icon link has matching aria-label and data-tooltip for ${label}`
        );
    }

    const indexAnchors = htmlContent.match(/<a\b[^>]*>/gi) || [];
    assert.strictEqual(indexAnchors.length, 10, 'Homepage has all 10 icon links');
    for (const tag of indexAnchors) {
        assert.ok(
            !/\btitle=/.test(tag),
            `Homepage anchor tag omits native title attribute to avoid duplicate desktop tooltip: ${tag}`
        );
    }
});

test('raas/index.html structure and content', () => {
    const raasPath = path.join(__dirname, '..', 'raas', 'index.html');
    const raasContent = fs.readFileSync(raasPath, 'utf8');

    assert.ok(raasContent.includes('<!DOCTYPE html>'), 'Has doctype declaration');
    assert.ok(raasContent.includes('<title>RAS XII - XV | Rohan Varshney</title>'), 'Has correct title');
    assert.ok(raasContent.includes('<h1 class="title">RAS XII - XV<span class="cursor"></span></h1>'), 'Has correct main heading');
    assert.ok(raasContent.includes('id="statistics"'), 'Has Statistics section');
    assert.ok(raasContent.includes('Statistics'), 'Has Statistics heading');
    assert.ok(raasContent.includes('<div class="stat-value">22</div>'), 'Has 22 Team Mixes stat');
    assert.ok(raasContent.includes('<div class="stat-value">14</div>'), 'Has 14 Colleges & Teams stat');
    assert.ok(raasContent.includes('<div class="stat-value">87</div>'), 'Has 87 Bid Points Earned stat');
    assert.ok(raasContent.includes('National Champion Mixes'), 'Has National Champion Mixes card');
    assert.ok(raasContent.includes('aria-label="2 National Champion Mixes"'), 'Has 2 National Champion Mixes card label');
    assert.ok(raasContent.includes('<div class="stat-value">11</div>'), 'Has 11 Circuit Mixtapes stat');
    assert.ok(raasContent.includes('<div class="stat-label">Circuit Mixtapes</div>'), 'Has Circuit Mixtapes label without Ladders');
    assert.ok(raasContent.includes('<div class="stat-value">1,788</div>'), 'Has 1,788 Audio Bounces Exported stat');
    assert.ok(raasContent.includes('<div class="stat-label">RAS Mixes</div>'), 'Has RAS Mixes card');
    assert.ok(raasContent.includes('<div class="stat-value">6</div>'), 'Has 6 Years Mixing stat');
    assert.ok(raasContent.includes('<div class="stat-label">Years Mixing</div>'), 'Has Years Mixing card');
    assert.strictEqual(
        (raasContent.match(/class="stat-info-btn"/g) || []).length,
        8,
        'Has info button on all 8 stat cards'
    );
    assert.strictEqual(
        (raasContent.match(/class="stat-info-popover"/g) || []).length,
        8,
        'Has info elaboration popover on all 8 stat cards'
    );
    assert.strictEqual(
        (raasContent.match(/class="map-pin-star"/g) || []).length,
        3,
        'Has star pinpoints for GT, UCF, and DSD'
    );
    assert.ok(raasContent.includes('us-map-svg'), 'Has US heatmap SVG');
    assert.ok(raasContent.includes('map-tooltip'), 'Has map hover tooltip');

    const expectedPins = [
        ['GT Ramblin\' Raas', '2018, 2019, 2021, 2022'],
        ['UCF Knightraas', '2019, 2021, 2022'],
        ['Dirty South Dandiya', '2021, 2022'],
        ['Cornell Big Red Raas', '2021'],
        ['Columbia Raas', '2019, 2021'],
        ['UVA Hooraas', '2021'],
        ['VCU Ricochet Raas', '2021'],
        ['Pitt PantheRaas', '2019'],
        ['CMU Raasta', '2021'],
        ['UNC Tar Heel Raas', '2021'],
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
    assert.ok(!raasContent.includes('Discarded Segments'), 'Fun Facts does not mention Discarded Segments');
    assert.ok(!raasContent.includes('Qurbani'), 'GT Qurbani is removed from statistics and map');
    assert.ok(raasContent.includes('id="hall-of-fame"'), 'Has Hall Of Fame section');
    assert.ok(raasContent.includes('Hall Of Fame'), 'Has Hall Of Fame heading');
    assert.ok(raasContent.includes('<ul class="hof-list">'), 'Hall Of Fame uses a bulletpoint list');
    assert.ok(!raasContent.includes('class="hof-card"'), 'Hall Of Fame does not use cards');
    assert.ok(raasContent.includes('<strong>DSD 2021-2022</strong>'), 'Has DSD 2021-2022 Hall Of Fame item');
    assert.ok(raasContent.includes('<strong>GT 2022-2023</strong>'), 'Has GT 2022-2023 Hall Of Fame item');
    assert.ok(raasContent.includes('<strong>RAS XIII: Raas Reboot (2021)</strong>'), 'Has RAS XIII: Raas Reboot (2021) Hall Of Fame item');
    assert.ok(raasContent.includes('<strong>UCF 2019-2020</strong>'), 'Has UCF 2019-2020 Hall Of Fame item');
    assert.ok(raasContent.includes('<strong>Raas Chaos Mixtape (2022)</strong>'), 'Has Raas Chaos Mixtape (2022) Hall Of Fame item');
    assert.ok(raasContent.includes('Chunalida'), 'Raas Chaos Mixtape mentions Chunalida');
    assert.ok(raasContent.includes('Feel So Raas'), 'Raas Chaos Mixtape mentions Feel So Raas');
    assert.ok(raasContent.includes('<strong>GT 2019-2020</strong>'), 'Has GT 2019-2020 Hall Of Fame item');
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

    assert.ok(raasContent.includes('<span class="resource-title">All Project Files</span>'), 'Has All Project Files section');
    assert.ok(raasContent.includes('href="https://drive.google.com/drive/folders/1RIb04DsH7YmGpx7YLLmsJvrYgw7L4jKg?usp=sharing"'), 'Has All Project Files Google Drive link');
    assert.ok(raasContent.includes('data-analytics-label="All Project Files" data-analytics-status="live"'), 'Tracks All Project Files as live');
    assert.ok(raasContent.includes('View access by request only') && raasContent.includes('comment in your request'), 'Emphasizes view-access request and recommended comment for All Project Files');
    assert.ok(raasContent.includes('<span class="resource-title">How to In-House Mix for Raas</span>'), 'Has How to In-House Mix for Raas section');
    assert.ok(raasContent.includes('href="https://docs.google.com/document/d/1MljkjOZmstdsRXOnsO0Z_NJqpnJQsBKbyGvo37Y1dNg/edit?usp=sharing"'), 'Has How to In-House Mix for Raas Google Docs link');
    assert.ok(raasContent.includes('data-analytics-label="How to In-House Mix for Raas" data-analytics-status="live"'), 'Tracks How to In-House Mix for Raas as live');
    assert.ok(raasContent.includes('<span class="resource-title">ROVA Raas Sounds</span>'), 'Has ROVA Raas Sounds section');
    assert.ok(raasContent.includes('data-analytics-label="ROVA Raas Sounds" data-analytics-status="live"'), 'Tracks ROVA Raas Sounds as live');
    assert.ok(raasContent.includes('href="https://drive.google.com/drive/folders/1tneKiwTXmKsR8wzAICItM6zUChy3d5NX?usp=sharing"'), 'Has ROVA Raas Sounds Google Drive link');
    assert.ok(raasContent.includes('coming-soon-banner'), 'Has coming soon banner for unavailable links');
    assert.ok(raasContent.includes('src="../assets/logo.png"'), 'Has main logo');
    assert.ok(raasContent.includes('src="../assets/freehand-signature-3.png"'), 'Has freehand signature logo');
    assert.ok(raasContent.includes('<nav class="topnav"'), 'Has sticky top navigation header');
    assert.ok(raasContent.includes('href="#statistics"'), 'Topnav links to Statistics section');
    assert.ok(raasContent.includes('href="#hall-of-fame"'), 'Topnav links to Hall Of Fame section');
    assert.ok(raasContent.includes('href="#resources"'), 'Topnav links to Resources section');
    assert.ok(raasContent.includes('src="../assets/js/analytics.js"'), 'Includes shared analytics script');
    assert.ok(raasContent.includes('data-analytics-event="raas_resource_click"'), 'Tracks Raas resource clicks');
});

test('dj/index.html structure and content', () => {
    const djPath = path.join(__dirname, '..', 'dj', 'index.html');
    const djContent = fs.readFileSync(djPath, 'utf8');

    assert.ok(djContent.includes('<!DOCTYPE html>'), 'Has doctype declaration');
    assert.ok(djContent.includes('<title>DJ ROVA — Bookings | Rohan Varshney</title>'), 'Has correct title');
    assert.ok(djContent.includes('data-contact-email='), 'Has data-contact-email attribute');
    assert.ok(djContent.includes('id="listen"'), 'Has Listen section');
    assert.ok(djContent.includes('id="events"'), 'Has Events section');
    assert.ok(djContent.includes('id="gigs"'), 'Has Gigs section');
    assert.ok(djContent.includes('id="press"'), 'Has Press Kit section');
    assert.ok(djContent.includes('id="faq"'), 'Has FAQ section');
    assert.ok(djContent.includes('id="book"'), 'Has Booking section');
    assert.ok(djContent.includes('data-mailto-form'), 'Has mailto inquiry form');
    assert.ok(djContent.includes('data-share'), 'Has share button');
    assert.ok(djContent.includes('title="Copy page URL"'), 'DJ share button advertises copying the page URL');
    assert.ok(djContent.includes('id="coming-soon-banner"'), 'DJ page has toast banner element');
    assert.ok(djContent.includes('data-waveform'), 'Has waveform visual');
    assert.ok(djContent.includes('data-bio-tab="short"'), 'Has short bio tab');
    assert.ok(djContent.includes('data-bio-tab="long"'), 'Has long bio tab');
    assert.ok(djContent.includes('class="dj-rig"'), 'Has live DJ rig visual');
    assert.ok(!djContent.includes('Press photo placeholder'), 'Replaces static press photo placeholder');
    assert.ok(djContent.includes('src="../assets/logo.png"'), 'Has main logo in header');
    assert.ok(djContent.includes('src="../assets/freehand-signature-3.png"'), 'Has freehand signature logo in header');
    assert.ok(djContent.includes('href="../production/"'), 'Cross-links to Production');
    assert.ok(djContent.includes('href="../raas/"'), 'Cross-links to Raas / Garba');
    assert.ok(djContent.includes('src="../assets/js/analytics.js"'), 'Includes analytics script');
    assert.ok(djContent.includes('src="../assets/js/portfolio.js"'), 'Includes portfolio script');
});

test('production/index.html structure and content', () => {
    const prodPath = path.join(__dirname, '..', 'production', 'index.html');
    const prodContent = fs.readFileSync(prodPath, 'utf8');

    assert.ok(prodContent.includes('<!DOCTYPE html>'), 'Has doctype declaration');
    assert.ok(prodContent.includes('<title>ROVA Production — Collabs, Remixes &amp; Custom Mixes | Rohan Varshney</title>'), 'Has correct title');
    assert.ok(prodContent.includes('data-contact-email='), 'Has data-contact-email attribute');
    assert.ok(prodContent.includes('id="releases"'), 'Has Releases section');
    assert.ok(prodContent.includes('id="services"'), 'Has Services section');
    assert.ok(prodContent.includes('id="process"'), 'Has Process section');
    assert.ok(prodContent.includes('id="credits"'), 'Has Credits section');
    assert.ok(prodContent.includes('id="faq"'), 'Has FAQ section');
    assert.ok(prodContent.includes('id="collab"'), 'Has Collab section');
    assert.ok(prodContent.includes('data-mailto-form'), 'Has mailto collab form');
    assert.ok(prodContent.includes('data-share'), 'Has share button');
    assert.ok(prodContent.includes('title="Copy page URL"'), 'Production share button advertises copying the page URL');
    assert.ok(prodContent.includes('id="coming-soon-banner"'), 'Production page has toast banner element');
    assert.ok(prodContent.includes('data-filter-group'), 'Has release filter buttons');
    assert.ok(prodContent.includes('class="arrangement"'), 'Has studio arrangement DAW visual');
    assert.ok(prodContent.includes('src="../assets/logo.png"'), 'Has main logo in header');
    assert.ok(prodContent.includes('src="../assets/freehand-signature-3.png"'), 'Has freehand signature logo in header');
    assert.ok(prodContent.includes('href="../dj/"'), 'Cross-links to DJing');
    assert.ok(prodContent.includes('href="../raas/"'), 'Cross-links to Raas / Garba');
    assert.ok(prodContent.includes('src="../assets/js/analytics.js"'), 'Includes analytics script');
    assert.ok(prodContent.includes('src="../assets/js/portfolio.js"'), 'Includes portfolio script');
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
        path.join(__dirname, '..', 'dj', 'index.html'),
        path.join(__dirname, '..', 'production', 'index.html'),
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

test('assets/js/portfolio.js share button copies URL and shows banner', async () => {
    const portfolioPath = path.join(__dirname, '..', 'assets', 'js', 'portfolio.js');
    const portfolioJs = fs.readFileSync(portfolioPath, 'utf8');

    assert.ok(!portfolioJs.includes('navigator.share'), 'portfolio.js does not use native navigator.share');

    function runShareScenario({ href, clipboardWriteText, execCommand }) {
        let domReadyHandler = null;
        let shareClickHandler = null;
        let lastTextarea = null;
        let shareSheetCalls = 0;
        const copiedByClipboard = [];
        const trackedEvents = [];
        const bannerClasses = new Set();
        const bannerText = { textContent: 'Coming soon!' };
        const timers = [];
        let nextTimerId = 1;

        const shareButton = {
            addEventListener(type, fn) {
                if (type === 'click') {
                    shareClickHandler = fn;
                }
            },
        };

        const banner = {
            classList: {
                add(cls) { bannerClasses.add(cls); },
                remove(cls) { bannerClasses.delete(cls); },
                contains(cls) { return bannerClasses.has(cls); },
            },
        };

        const sandbox = {
            location: { href },
            isSecureContext: true,
            trackAnalyticsEvent(name, params) {
                trackedEvents.push({ name, params });
            },
            navigator: {
                share() {
                    shareSheetCalls++;
                    return Promise.resolve();
                },
                clipboard: {
                    writeText(text) {
                        copiedByClipboard.push(text);
                        return clipboardWriteText(text);
                    },
                },
            },
            document: {
                title: 'DJ ROVA — Bookings | Rohan Varshney',
                body: {
                    getAttribute() { return ''; },
                    appendChild() {},
                    removeChild() {},
                },
                addEventListener(type, fn) {
                    if (type === 'DOMContentLoaded') {
                        domReadyHandler = fn;
                    }
                },
                querySelector() { return null; },
                querySelectorAll(selector) {
                    return selector === '[data-share]' ? [shareButton] : [];
                },
                getElementById(id) {
                    if (id === 'coming-soon-banner') return banner;
                    if (id === 'coming-soon-text') return bannerText;
                    return null;
                },
                createElement(tag) {
                    assert.strictEqual(tag, 'textarea');
                    lastTextarea = {
                        value: '',
                        style: {},
                        setAttribute() {},
                        select() {},
                        setSelectionRange() {},
                    };
                    return lastTextarea;
                },
                execCommand(cmd) {
                    return execCommand ? execCommand(cmd, lastTextarea ? lastTextarea.value : '') : false;
                },
            },
            setTimeout(fn, delay) {
                const entry = { id: nextTimerId++, fn, delay, cleared: false };
                timers.push(entry);
                return entry.id;
            },
            clearTimeout(id) {
                const entry = timers.find((t) => t.id === id);
                if (entry) entry.cleared = true;
            },
        };
        sandbox.window = sandbox;

        vm.createContext(sandbox);
        vm.runInContext(portfolioJs, sandbox);
        assert.strictEqual(typeof domReadyHandler, 'function', 'Registers DOMContentLoaded handler');
        domReadyHandler();
        assert.strictEqual(typeof shareClickHandler, 'function', 'Binds click handler to [data-share]');

        let prevented = false;
        shareClickHandler({
            preventDefault() {
                prevented = true;
            },
        });

        return {
            get prevented() { return prevented; },
            get shareSheetCalls() { return shareSheetCalls; },
            copiedByClipboard,
            trackedEvents,
            bannerClasses,
            bannerText,
            timers,
            get lastTextareaValue() { return lastTextarea ? lastTextarea.value : null; },
        };
    }

    // 1. Copies hash-stripped URL via navigator.clipboard even when navigator.share exists
    const clipboardSuccess = runShareScenario({
        href: 'https://rohanvarshney.github.io/dj/#book',
        clipboardWriteText: () => Promise.resolve(),
    });
    await new Promise((resolve) => setImmediate(resolve));

    assert.strictEqual(clipboardSuccess.prevented, true, 'Prevents default button behavior');
    assert.strictEqual(clipboardSuccess.shareSheetCalls, 0, 'Never invokes navigator.share');
    assert.deepStrictEqual(
        clipboardSuccess.copiedByClipboard,
        ['https://rohanvarshney.github.io/dj/'],
        'Copies current URL without hash fragment'
    );
    assert.strictEqual(clipboardSuccess.bannerClasses.has('visible'), true, 'Shows toast banner');
    assert.strictEqual(
        clipboardSuccess.bannerText.textContent,
        'Page URL copied to clipboard.',
        'Displays clipboard confirmation message in banner'
    );
    assert.deepStrictEqual(
        JSON.parse(JSON.stringify(clipboardSuccess.trackedEvents)),
        [{ name: 'portfolio_share', params: { event_category: 'share', event_label: 'DJ ROVA — Bookings | Rohan Varshney' } }],
        'Tracks portfolio_share analytics event'
    );
    assert.strictEqual(clipboardSuccess.timers.length, 1, 'Schedules auto-hide timeout');
    assert.strictEqual(clipboardSuccess.timers[0].delay, 3800, 'Auto-hides banner after 3800ms');
    clipboardSuccess.timers[0].fn();
    assert.strictEqual(clipboardSuccess.bannerClasses.has('visible'), false, 'Hides banner when timeout fires');

    // 2. Falls back to execCommand('copy') when clipboard.writeText rejects and succeeds
    let fallbackCopiedText = null;
    const fallbackSuccess = runShareScenario({
        href: 'https://rohanvarshney.github.io/production/#collab',
        clipboardWriteText: () => Promise.reject(new Error('Permission denied')),
        execCommand(cmd, value) {
            assert.strictEqual(cmd, 'copy');
            fallbackCopiedText = value;
            return true;
        },
    });
    await new Promise((resolve) => setImmediate(resolve));

    assert.strictEqual(fallbackSuccess.shareSheetCalls, 0, 'Never invokes navigator.share on fallback');
    assert.strictEqual(
        fallbackCopiedText,
        'https://rohanvarshney.github.io/production/',
        'Fallback copies URL without hash fragment via execCommand'
    );
    assert.strictEqual(fallbackSuccess.bannerClasses.has('visible'), true, 'Shows banner on fallback success');
    assert.strictEqual(
        fallbackSuccess.bannerText.textContent,
        'Page URL copied to clipboard.',
        'Displays clipboard confirmation message on fallback success'
    );

    // 3. Displays manual link fallback banner if both clipboard API and execCommand fail
    const fallbackFailure = runShareScenario({
        href: 'https://rohanvarshney.github.io/production/',
        clipboardWriteText: () => Promise.reject(new Error('Permission denied')),
        execCommand: () => false,
    });
    await new Promise((resolve) => setImmediate(resolve));

    assert.strictEqual(fallbackFailure.bannerClasses.has('visible'), true, 'Shows banner when copy fails');
    assert.strictEqual(
        fallbackFailure.bannerText.textContent,
        'Copy this link: https://rohanvarshney.github.io/production/',
        'Displays fallback URL banner message when copy fails'
    );
});
