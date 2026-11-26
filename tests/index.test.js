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
    assert.ok(htmlContent.includes('Taking ideas from concept to code.'), 'Has Projects tagline');

    const professionalIndex = htmlContent.indexOf('<div class="social-section-title">Professional</div>');
    const personalIndex = htmlContent.indexOf('<div class="social-section-title">Personal</div>');
    const portfolioIndex = htmlContent.indexOf('<div class="social-section-title">Portfolio</div>');
    const projectsIndex = htmlContent.indexOf('<div class="social-section-title">Projects</div>');
    const spotkitIndex = htmlContent.indexOf('data-analytics-label="SpotKit"');
    const beliNormIndex = htmlContent.indexOf('data-analytics-label="Beli Ranking Normalization"');
    assert.ok(
        professionalIndex !== -1 &&
        personalIndex !== -1 &&
        portfolioIndex !== -1 &&
        projectsIndex !== -1 &&
        professionalIndex < projectsIndex &&
        projectsIndex < personalIndex &&
        personalIndex < portfolioIndex,
        'Sections appear in order: Professional -> Projects -> Personal -> Portfolio'
    );
    assert.ok(
        spotkitIndex > projectsIndex && spotkitIndex < personalIndex,
        'SpotKit appears under Projects section'
    );
    assert.ok(
        beliNormIndex > spotkitIndex && beliNormIndex < personalIndex,
        'Beli Ranking Normalization appears as second item under Projects section'
    );

    const djingIndex = htmlContent.indexOf('data-analytics-label="DJing"');
    const productionIndex = htmlContent.indexOf('data-analytics-label="Production"');
    const raasIndex = htmlContent.indexOf('data-analytics-label="Raas / Garba"');
    assert.ok(
        djingIndex > portfolioIndex &&
        productionIndex > djingIndex &&
        raasIndex > productionIndex,
        'Portfolio items appear in order: DJing -> Production -> Raas / Garba'
    );

    // Portfolio & Projects Links and Coming Soon Banner
    assert.ok(htmlContent.includes('data-analytics-label="Raas / Garba"'), 'Has Raas / Garba portfolio item');
    assert.match(htmlContent, /data-analytics-label="Raas \/ Garba"[\s\S]*?<svg\b[\s\S]*?dandiya-front[\s\S]*?dandiya-back[\s\S]*?<\/svg>[\s\S]*?<\/a>/, 'Raas / Garba uses adorned dandiya inline SVG with spiral stripes, crossover mask, and tassels');
    assert.ok(htmlContent.includes('data-analytics-label="SpotKit"'), 'Has SpotKit project item');
    assert.ok(htmlContent.includes('data-analytics-event="project_link_click"'), 'Tracks SpotKit as project_link_click');
    assert.ok(htmlContent.includes('data-analytics-category="projects"'), 'Categorizes SpotKit under projects');
    assert.ok(htmlContent.includes('data-analytics-label="Beli Ranking Normalization"'), 'Has Beli Ranking Normalization project item');
    assert.ok(htmlContent.includes('href="https://rohanvarshney.github.io/beli-ranking-normalization/"'), 'Home page links directly to Beli Ranking Normalization');
    assert.ok(htmlContent.includes('data-analytics-label="Beli Ranking Normalization" data-analytics-status="live"'), 'Tracks Beli Ranking Normalization as live');
    assert.ok(!htmlContent.includes("showComingSoon(event, 'Beli Ranking Normalization')"), 'Beli Ranking Normalization no longer triggers coming soon banner');
    assert.match(htmlContent, /data-analytics-label="Beli Ranking Normalization"[\s\S]*?<svg\b[\s\S]*?<\/svg>[\s\S]*?<\/a>/, 'Beli Ranking Normalization uses an inline SVG bell curve icon');
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
        'Beli Ranking Normalization',
    ];
    for (const label of expectedIconLabels) {
        assert.ok(
            htmlContent.includes(`aria-label="${label}"`) &&
            htmlContent.includes(`data-tooltip="${label}"`),
            `Icon link has matching aria-label and data-tooltip for ${label}`
        );
    }

    const indexAnchors = htmlContent.match(/<a\b[^>]*>/gi) || [];
    assert.strictEqual(indexAnchors.length, 11, 'Homepage has all 11 icon links');
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
    assert.ok(raasContent.includes('<li><strong>DSD 2021-2022</strong></li>'), 'Has DSD 2021-2022 Hall Of Fame item without description');
    assert.ok(raasContent.includes('<li><strong>GT 2022-2023</strong></li>'), 'Has GT 2022-2023 Hall Of Fame item without description');
    assert.ok(raasContent.includes('<li><strong>RAS XIII: Raas Reboot (2021)</strong></li>'), 'Has RAS XIII: Raas Reboot (2021) Hall Of Fame item without description');
    assert.ok(raasContent.includes('<li><strong>UCF 2019-2020</strong></li>'), 'Has UCF 2019-2020 Hall Of Fame item without description');
    assert.ok(raasContent.includes('<li><strong>Raas Chaos Mixtape (2022)</strong></li>'), 'Has Raas Chaos Mixtape (2022) Hall Of Fame item without description');
    assert.ok(raasContent.includes('<li><strong>GT 2019-2020</strong></li>'), 'Has GT 2019-2020 Hall Of Fame item without description');
    const hofMatch = raasContent.match(/<ul class="hof-list">([\s\S]*?)<\/ul>/);
    assert.ok(hofMatch && !hofMatch[1].includes('&mdash;'), 'Hall Of Fame items omit descriptions after em dash');
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
    assert.ok(raasContent.includes('<footer class="footer">'), 'Has semantic footer matching DJ/Production pages');
    assert.ok(raasContent.includes('class="footer-links"'), 'Footer has footer-links container');
    assert.ok(raasContent.includes('class="footer-social"'), 'Footer has footer-social container');
    assert.ok(raasContent.includes('href="../dj/"'), 'Footer cross-links to DJing');
    assert.ok(raasContent.includes('href="../production/"'), 'Footer cross-links to Production');
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

    // Updated genres, bio, location, Serato setup, and placeholder removal
    assert.ok(djContent.includes('house (disco, tech, progressive)'), 'Includes house (disco, tech, progressive)');
    assert.ok(djContent.includes('throwbacks'), 'Includes throwbacks');
    assert.ok(!djContent.includes('Desi house') && !djContent.includes('Desi House'), 'Removes Desi house references');
    assert.ok(!djContent.includes('Afrobeats') && !djContent.includes('Hip-Hop / Afro'), 'Removes Afrobeats references');
    assert.ok(djContent.includes('years of production and practice'), 'Includes years of production and practice');
    assert.ok(!djContent.includes('national-champion'), 'Removes national-champion reference');
    assert.ok(djContent.includes('Based in Brooklyn, NYC'), 'Includes Based in Brooklyn, NYC');
    assert.ok(!djContent.includes('Travels nationwide'), 'Removes Travels nationwide');
    assert.ok(djContent.includes('Serato DJ Pro'), 'Includes Serato DJ Pro');
    assert.ok(!djContent.includes('Rekordbox'), 'Removes Rekordbox reference');
    assert.ok(djContent.includes('data-contact-email="rohanvar@gmail.com"'), 'Uses rohanvar@gmail.com as booking email');
    assert.ok(!djContent.includes('bookings@example.com'), 'Removes bookings@example.com placeholder');

    assert.ok(djContent.includes('</span> Now booking</div>'), 'Status chip reads Now booking');
    assert.ok(!djContent.includes('Now booking 2026'), 'Removes date range from status chip');

    assert.ok(djContent.includes('when to drop the beat.'), 'Hero lead says drop the beat');
    assert.ok(!djContent.includes('drop the dhol'), 'Removes drop the dhol from hero lead');

    const chipsMatch = djContent.match(/<div class="chips">([\s\S]*?)<\/div>/);
    assert.ok(chipsMatch, 'Has What you\'ll hear chips');
    assert.ok(chipsMatch[1].includes('<span class="chip">Pop</span>'), 'Chips include Pop');
    assert.ok(chipsMatch[1].includes('<span class="chip">Punjabi</span>'), 'Chips include Punjabi');
    assert.ok(chipsMatch[1].includes('<span class="chip">Electronic</span>'), 'Chips include Electronic');
    assert.ok(!chipsMatch[1].includes('Bhangra'), 'Chips exclude Bhangra');

    const eventsMatch = djContent.match(/<section[^>]*id="events"[\s\S]*?<\/section>/);
    assert.ok(eventsMatch, 'Has Events section');
    assert.ok(eventsMatch[0].includes('class="grid-2"'), 'Events section uses grid-2');
    assert.strictEqual((eventsMatch[0].match(/class="tile"/g) || []).length, 4, 'Events section has 4 cards');
    assert.ok(!eventsMatch[0].includes('Weddings &amp; Sangeets'), 'Events section removes Weddings & Sangeets');
    assert.ok(!eventsMatch[0].includes('College &amp; Showcases'), 'Events section removes College & Showcases');

    const gigsMatch = djContent.match(/<section[^>]*id="gigs"[\s\S]*?<\/section>/);
    assert.ok(gigsMatch, 'Has Gigs section');
    assert.strictEqual((gigsMatch[0].match(/<li class="gig/g) || []).length, 2, 'Selected Gigs has 2 items');

    assert.ok(!djContent.includes('id="testimonials"') && !djContent.includes('Kind Words'), 'Removes Kind Words section');
    assert.ok(!djContent.includes('ig.me/m/'), 'DJ page does not use broken ig.me/m/ links');
    assert.ok(djContent.includes('href="https://www.instagram.com/rohanvar"'), 'DJ page links to instagram.com/rohanvar');

    const djWithoutFooter = djContent.replace(/<footer[\s\S]*?<\/footer>/, '');
    assert.ok(!/raas|garba|navratri|collegiate/i.test(djWithoutFooter), 'DJ page body copy is agnostic of Raas/Garba');
    assert.ok(!/soundcloud/i.test(djContent), 'Removes all SoundCloud links and references');

    const leftoverPlaceholders = [
        '[Spring',
        '[City',
        '[Featured',
        '[60]',
        '[2026]',
        '[Sangeet',
        '[Desi',
        '[Navratri',
        '[Open',
        '[Dec',
        '[Venue',
        '[Name',
        '[Update',
        '[DDJ',
        '[region]',
        '[weddings',
    ];
    for (const token of leftoverPlaceholders) {
        assert.ok(!djContent.includes(token), `Removes leftover placeholder token: ${token}`);
    }
});

test('production/index.html structure and content', () => {
    const prodPath = path.join(__dirname, '..', 'production', 'index.html');
    const prodContent = fs.readFileSync(prodPath, 'utf8');

    assert.ok(prodContent.includes('<!DOCTYPE html>'), 'Has doctype declaration');
    assert.ok(prodContent.includes('<title>ROVA Production — Collabs, Remixes &amp; Custom Mixes | Rohan Varshney</title>'), 'Has correct title');
    assert.ok(prodContent.includes('data-contact-email='), 'Has data-contact-email attribute');
    assert.ok(prodContent.includes('id="releases"'), 'Has Releases section');
    assert.ok(prodContent.includes('id="services"'), 'Has Services section');
    assert.ok(!prodContent.includes('id="process"') && !prodContent.includes('How It Works') && !prodContent.includes('href="#process"'), 'Removes How It Works section and nav link');
    assert.ok(!prodContent.includes('id="credits"') && !prodContent.includes('Experience &amp; Toolkit') && !prodContent.includes('href="#credits"'), 'Removes Experience & Toolkit section and nav link');
    assert.ok(!prodContent.includes('id="testimonials"') && !prodContent.includes('Kind Words'), 'Removes Kind Words section');
    assert.ok(!prodContent.includes('ig.me/m/'), 'Production page does not use broken ig.me/m/ links');
    assert.ok(prodContent.includes('href="https://www.instagram.com/rohanvar"'), 'Production page links to instagram.com/rohanvar');
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
    assert.ok(prodContent.includes('years of production and practice'), 'Production page highlights years of production and practice');

    const prodWithoutFooter = prodContent.replace(/<footer[\s\S]*?<\/footer>/, '');
    assert.ok(
        !/raas|garba|dandiya|national-champion|collegiate/i.test(prodWithoutFooter),
        'Production page body copy is agnostic of Raas/Garba'
    );
    assert.ok(!/soundcloud/i.test(prodContent), 'Removes all SoundCloud links and references');
    assert.ok(prodContent.includes('All Genres'), 'Production hero uses All Genres');
    assert.ok(!prodContent.includes('Desi &times; Electronic &times; Hip-Hop'), 'Removes Desi x Electronic x Hip-Hop');
    assert.ok(prodContent.includes('Logic Pro X'), 'Production uses Logic Pro X');
    assert.ok(prodContent.includes('ROVA_session_final_v44.logicx'), 'Arrangement visual uses .logicx project file');
    assert.ok(!/ableton|fl studio|\.als\b/i.test(prodContent), 'Removes Ableton Live, FL Studio, and .als references');

    assert.ok(prodContent.includes('house pool party'), 'Has house pool party release');
    assert.ok(prodContent.includes('href="https://open.spotify.com/track/6IoqO8jmnH9Ml3BTGxDk1B"'), 'Links to house pool party on Spotify');
    assert.ok(prodContent.includes('data-analytics-label="house pool party Spotify" data-analytics-status="live"'), 'Tracks house pool party Spotify link as live');

    assert.ok(prodContent.includes('rainy overpass'), 'Has rainy overpass release');
    assert.ok(prodContent.includes('href="https://open.spotify.com/track/1IG988cgn1YSuc0lhyk1uG"'), 'Links to rainy overpass on Spotify');
    assert.ok(prodContent.includes('data-analytics-label="rainy overpass Spotify" data-analytics-status="live"'), 'Tracks rainy overpass Spotify link as live');

    assert.ok(prodContent.includes('DAWN OF THE DATASTREAM'), 'Has DAWN OF THE DATASTREAM release');
    assert.ok(prodContent.includes('Single &middot; 1:20 &middot; 2025'), 'Marks DAWN OF THE DATASTREAM as a single');
    assert.ok(prodContent.includes('href="https://open.spotify.com/track/2NtjENcey2LS5lbxTWFeaI"'), 'Links to DAWN OF THE DATASTREAM on Spotify');
    assert.ok(prodContent.includes('data-analytics-label="DAWN OF THE DATASTREAM Spotify" data-analytics-status="live"'), 'Tracks DAWN OF THE DATASTREAM Spotify link as live');

    assert.ok(prodContent.includes('TO THE SKY'), 'Has TO THE SKY release');
    assert.ok(prodContent.includes('Single &middot; 3:47 &middot; 2025'), 'Marks TO THE SKY as a single');
    assert.ok(prodContent.includes('href="https://open.spotify.com/track/5WQWrRPrLNgfz5GdYFEOHl"'), 'Links to TO THE SKY on Spotify');
    assert.ok(prodContent.includes('data-analytics-label="TO THE SKY Spotify" data-analytics-status="live"'), 'Tracks TO THE SKY Spotify link as live');

    assert.ok(prodContent.includes('rough drafts (2024 - 2025)'), 'Has rough drafts (2024 - 2025) EP release');
    assert.ok(prodContent.includes('EP &middot; 5 Tracks &middot; 8:45 &middot; 2025'), 'Marks rough drafts (2024 - 2025) as an EP');
    assert.ok(prodContent.includes('href="https://open.spotify.com/album/2LE5QkOtkIjlmskNcmO7iO"'), 'Links to rough drafts (2024 - 2025) on Spotify');
    assert.ok(prodContent.includes('data-analytics-label="rough drafts (2024 - 2025) Spotify" data-analytics-status="live"'), 'Tracks rough drafts (2024 - 2025) Spotify link as live');

    assert.ok(prodContent.includes('href="https://open.spotify.com/artist/4rzG9xC24GurQlOwEtqB7x"'), 'Footer links to ROVA Spotify artist profile');
    assert.ok(prodContent.includes('data-analytics-label="Footer Spotify" data-analytics-status="live"'), 'Tracks Footer Spotify link as live');
    assert.ok(!prodContent.includes('data-coming-soon="Spotify artist profile"'), 'Removes coming-soon from Footer Spotify link');
    assert.ok(prodContent.includes('data-contact-email="rohanvar@gmail.com"'), 'Configures rohanvar@gmail.com as Production contact email');
    assert.ok(!prodContent.includes('collabs@example.com'), 'Removes collabs@example.com placeholder');
});

test('assets/js/analytics.js configuration and 100% link coverage', () => {
    const analyticsPath = path.join(__dirname, '..', 'assets', 'js', 'analytics.js');
    const analyticsContent = fs.readFileSync(analyticsPath, 'utf8');

    assert.ok(analyticsContent.includes("var GA_MEASUREMENT_ID = 'G-8RL9F3RF9E';"), 'Configures live GA_MEASUREMENT_ID');
    assert.ok(analyticsContent.includes('googletagmanager.com/gtag/js'), 'Checks for gtag/js Google tag loader');
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
            /<head>\s*<script async src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-8RL9F3RF9E"><\/script>\s*<script>\s*window\.dataLayer = window\.dataLayer \|\| \[\];\s*function gtag\(\)\{dataLayer\.push\(arguments\);\}\s*gtag\('js', new Date\(\)\);\s*gtag\('config', 'G-8RL9F3RF9E'\);\s*<\/script>/,
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

test('assets/js/analytics.js tracks click and middle-click (auxclick) with normalized link_url', () => {
    const analyticsPath = path.join(__dirname, '..', 'assets', 'js', 'analytics.js');
    const analyticsJs = fs.readFileSync(analyticsPath, 'utf8');

    function runAnalyticsScenario(pageUrl, linkSpecs) {
        let domReadyHandler = null;
        const gtagCalls = [];
        const links = linkSpecs.map((spec) => {
            const listeners = {};
            const attrs = Object.assign({}, spec.attrs);
            return {
                textContent: spec.textContent || '',
                getAttribute(name) {
                    return Object.prototype.hasOwnProperty.call(attrs, name) ? attrs[name] : null;
                },
                addEventListener(type, fn) {
                    listeners[type] = fn;
                },
                trigger(type, eventObj) {
                    if (listeners[type]) {
                        listeners[type](eventObj);
                    }
                },
            };
        });

        const parsed = new URL(pageUrl);
        const sandbox = {
            URL,
            dataLayer: [],
            gtag(...args) {
                gtagCalls.push(args);
            },
            location: {
                href: parsed.href,
                pathname: parsed.pathname,
                origin: parsed.origin,
            },
            document: {
                querySelector() {
                    return {};
                },
                querySelectorAll(selector) {
                    return selector === 'a[href]' ? links : [];
                },
                addEventListener(type, fn) {
                    if (type === 'DOMContentLoaded') {
                        domReadyHandler = fn;
                    }
                },
            },
        };
        sandbox.window = sandbox;

        vm.runInNewContext(analyticsJs, sandbox);
        assert.ok(domReadyHandler, 'Registers DOMContentLoaded listener');
        domReadyHandler();

        return { links, gtagCalls };
    }

    // 1. Click, middle-click (button 1), and non-middle auxclick (button 2)
    const homeScenario = runAnalyticsScenario('https://rohanvarshney.github.io/', [
        {
            attrs: {
                href: 'resume.pdf',
                'data-analytics-event': 'resume_download',
                'data-analytics-category': 'professional',
                'data-analytics-label': 'Resume PDF',
            },
        },
        {
            attrs: {
                href: '/dj',
                'data-analytics-event': 'portfolio_link_click',
                'data-analytics-category': 'portfolio',
                'data-analytics-label': 'DJing',
                'data-analytics-status': 'live',
            },
        },
        {
            attrs: {
                href: 'https://linkedin.com/in/rohanvarshney',
                'data-analytics-event': 'social_link_click',
                'data-analytics-category': 'professional',
                'data-analytics-label': 'LinkedIn',
            },
        },
        {
            attrs: {
                href: '#',
                'data-analytics-event': 'dj_mix_click',
                'data-analytics-category': 'dj',
                'data-analytics-label': 'Featured Mixcloud',
                'data-analytics-status': 'coming_soon',
            },
        },
    ]);

    homeScenario.links[0].trigger('click');
    homeScenario.links[0].trigger('auxclick', { button: 1 });
    homeScenario.links[0].trigger('auxclick', { button: 2 }); // right-click should be ignored
    homeScenario.links[1].trigger('click');
    homeScenario.links[2].trigger('auxclick', { button: 1 });
    homeScenario.links[3].trigger('click');

    assert.deepStrictEqual(
        JSON.parse(JSON.stringify(homeScenario.gtagCalls)),
        [
            [
                'event',
                'resume_download',
                {
                    page_path: '/',
                    page_location: 'https://rohanvarshney.github.io/',
                    transport_type: 'beacon',
                    event_category: 'professional',
                    event_label: 'Resume PDF',
                    link_url: 'https://rohanvarshney.github.io/resume.pdf',
                    link_status: 'live',
                },
            ],
            [
                'event',
                'resume_download',
                {
                    page_path: '/',
                    page_location: 'https://rohanvarshney.github.io/',
                    transport_type: 'beacon',
                    event_category: 'professional',
                    event_label: 'Resume PDF',
                    link_url: 'https://rohanvarshney.github.io/resume.pdf',
                    link_status: 'live',
                },
            ],
            [
                'event',
                'portfolio_link_click',
                {
                    page_path: '/',
                    page_location: 'https://rohanvarshney.github.io/',
                    transport_type: 'beacon',
                    event_category: 'portfolio',
                    event_label: 'DJing',
                    link_url: 'https://rohanvarshney.github.io/dj/',
                    link_status: 'live',
                },
            ],
            [
                'event',
                'social_link_click',
                {
                    page_path: '/',
                    page_location: 'https://rohanvarshney.github.io/',
                    transport_type: 'beacon',
                    event_category: 'professional',
                    event_label: 'LinkedIn',
                    link_url: 'https://linkedin.com/in/rohanvarshney',
                    link_status: 'live',
                },
            ],
            [
                'event',
                'dj_mix_click',
                {
                    page_path: '/',
                    page_location: 'https://rohanvarshney.github.io/',
                    transport_type: 'beacon',
                    event_category: 'dj',
                    event_label: 'Featured Mixcloud',
                    link_url: '#',
                    link_status: 'coming_soon',
                },
            ],
        ],
        'Tracks click and middle-click (button 1) with normalized link_url while ignoring right-click auxclick'
    );

    // 2. Relative links from subpages normalize consistently
    const subpageScenario = runAnalyticsScenario('https://rohanvarshney.github.io/raas/', [
        { attrs: { href: '../dj/', 'data-analytics-event': 'portfolio_link_click', 'data-analytics-label': 'Footer DJing' } },
        { attrs: { href: '../', 'data-analytics-event': 'navigation_click', 'data-analytics-label': 'Home' } },
        { attrs: { href: '../assets/logo.png', 'data-analytics-event': 'press_download', 'data-analytics-label': 'Logo PNG' } },
        { attrs: { href: '#statistics', 'data-analytics-event': 'navigation_click', 'data-analytics-label': 'Nav Statistics' } },
        { attrs: { href: 'mailto:rohanvar@gmail.com?subject=DJ%20Booking', 'data-analytics-event': 'contact_click', 'data-analytics-label': 'Booking Email' } },
    ]);

    subpageScenario.links.forEach((link) => link.trigger('click'));

    assert.deepStrictEqual(
        subpageScenario.gtagCalls.map((call) => call[2].link_url),
        [
            'https://rohanvarshney.github.io/dj/',
            'https://rohanvarshney.github.io/',
            'https://rohanvarshney.github.io/assets/logo.png',
            '#statistics',
            'mailto:rohanvar@gmail.com?subject=DJ%20Booking',
        ],
        'Normalizes relative directory/file links while preserving anchors and mailto URLs'
    );
});
