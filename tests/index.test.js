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
    assert.ok(htmlContent.includes('<title>Rohan Varshney — Senior Software Engineer at Lyft | ROVA</title>'), 'Has correct title');
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
    assert.ok(htmlContent.includes('href="/raas/"'), 'Home page links directly to /raas/');
    assert.ok(htmlContent.includes('href="/dj/"'), 'Home page links directly to /dj/');
    assert.ok(htmlContent.includes('href="/production/"'), 'Home page links directly to /production/');
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
    const mashupsIndex = raasContent.indexOf('id="mashups"');
    const resourcesIndex = raasContent.indexOf('id="resources"');
    assert.ok(
        statsIndex !== -1 && hofIndex !== -1 && mashupsIndex !== -1 && resourcesIndex !== -1 &&
        statsIndex < hofIndex && hofIndex < mashupsIndex && mashupsIndex < resourcesIndex,
        'Sections appear in order: Statistics -> Hall Of Fame -> Mashups -> Resources'
    );

    assert.ok(raasContent.includes('src="../assets/js/portfolio.js"'), 'Raas page includes portfolio.js for audio player');
    assert.ok(raasContent.includes('href="#mashups"'), 'Topnav links to Mashups section');
    assert.ok(raasContent.includes('data-audio-player'), 'Raas page has declarative audio player');
    assert.ok(raasContent.includes('data-audio-base="../assets/audio/"'), 'Raas player points to ../assets/audio/');
    assert.ok(!/<audio\b/i.test(raasContent), 'Raas page omits eager <audio> tags so initial load downloads 0 audio bytes');
    assert.strictEqual((raasContent.match(/<!-- RAAS-AUDIO:START -->/g) || []).length, 1, 'Has exactly one RAAS-AUDIO:START marker');
    assert.strictEqual((raasContent.match(/<!-- RAAS-AUDIO:END -->/g) || []).length, 1, 'Has exactly one RAAS-AUDIO:END marker');

    const raasPlayerMatch = raasContent.match(/<article class="player"[\s\S]*?<\/article>/);
    assert.ok(raasPlayerMatch, 'Raas page has featured player article');
    assert.ok(raasPlayerMatch[0].includes('data-audio-file="mashups/raas/feel-so-raas.mp3"'), 'Raas featured player wires feel-so-raas.mp3');
    assert.ok(raasPlayerMatch[0].includes('aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"></div>'), 'Raas featured player waveform div is intact');
    assert.ok(raasPlayerMatch[0].includes('<span class="player-time" data-player-time aria-live="off">0:00 / 1:46</span>'), 'Raas featured player time span is intact');
    assert.ok(!raasPlayerMatch[0].includes('<li') && !raasPlayerMatch[0].includes('RAAS-AUDIO:'), 'Raas featured player contains no list items or sync markers');

    const raasListMatch = raasContent.match(/<ul class="release-list" id="raas-release-list">([\s\S]*?)<\/ul>/);
    assert.ok(raasListMatch, 'Raas page has #raas-release-list container');

    const raasAudioDir = path.join(__dirname, '..', 'assets', 'audio', 'mashups', 'raas');
    const raasDiskMp3s = fs.readdirSync(raasAudioDir)
        .filter((f) => !f.startsWith('.') && f.toLowerCase().endsWith('.mp3'))
        .map((f) => `mashups/raas/${f}`);
    assert.strictEqual(raasDiskMp3s.length, 10, 'Discovers all 10 Raas MP3 files under assets/audio/mashups/raas/');

    const raasRowMatches = [...raasListMatch[1].matchAll(/<li class="release(?:\s+is-active)?"[^>]*data-audio-file="([^"]+)"[^>]*>[\s\S]*?<\/li>/g)];
    assert.strictEqual(raasRowMatches.length, raasDiskMp3s.length, 'Raas #raas-release-list renders one card per Raas MP3 on disk');

    const raasRenderedFiles = new Set();
    for (const [cardHtml, relFile] of raasRowMatches) {
        assert.ok(relFile.startsWith('mashups/raas/'), `Raas page only renders mashups/raas/ files: ${relFile}`);
        raasRenderedFiles.add(relFile);
        const fullMp3Path = path.join(__dirname, '..', 'assets', 'audio', ...relFile.split('/'));
        assert.ok(fs.existsSync(fullMp3Path), `Raas audio file exists on disk: ${relFile}`);
        const mp3Header = fs.readFileSync(fullMp3Path).subarray(0, 3).toString('ascii');
        assert.ok(mp3Header === 'ID3' || mp3Header.charCodeAt(0) === 0xff, `${relFile} has valid MP3/ID3 header`);
        assert.match(cardHtml, /data-track-duration="\d+:\d{2}"/, `${relFile} card has formatted duration`);
        assert.match(cardHtml, /<div class="release-title">[^<]+<\/div>/, `${relFile} card has non-empty title`);
        assert.match(cardHtml, /<div class="release-meta">[^<]+<\/div>/, `${relFile} card has non-empty meta`);
        assert.ok(cardHtml.includes('data-release-play'), `${relFile} card has play button`);
    }
    for (const relFile of raasDiskMp3s) {
        assert.ok(raasRenderedFiles.has(relFile), `Every Raas MP3 on disk is rendered in raas/index.html: ${relFile}`);
    }

    const raasPeakMatches = [...raasContent.matchAll(/data-peaks="([0-9,]+)"/g)];
    assert.strictEqual(raasPeakMatches.length, raasDiskMp3s.length + 1, 'Raas page has real data-peaks on featured waveform and all 10 rows');
    for (const match of raasPeakMatches) {
        const peaks = match[1].split(',').map((n) => Number(n.trim()));
        assert.strictEqual(peaks.length, 80, 'Each Raas data-peaks attribute has 80 bars');
        assert.ok(peaks.every((n) => Number.isInteger(n) && n >= 12 && n <= 100), 'All Raas peaks are integers in 12..100');
    }

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
    assert.ok(!prodContent.includes('data-subfilter="raas"'), 'Production page excludes Raas sub-filter chip');
    assert.ok(!prodContent.includes('mashups/raas/'), 'Production page excludes mashups/raas/ tracks');
    assert.ok(!/soundcloud/i.test(prodContent), 'Removes all SoundCloud links and references');
    assert.ok(prodContent.includes('All Genres'), 'Production hero uses All Genres');
    assert.ok(!prodContent.includes('Desi &times; Electronic &times; Hip-Hop'), 'Removes Desi x Electronic x Hip-Hop');
    assert.ok(prodContent.includes('Logic Pro X'), 'Production uses Logic Pro X');
    assert.ok(prodContent.includes('ROVA_session_final_v44.logicx'), 'Arrangement visual uses .logicx project file');
    assert.ok(!/ableton|fl studio|\.als\b/i.test(prodContent), 'Removes Ableton Live, FL Studio, and .als references');

    // Featured player (always Move Like I Do) + Spotify embeds for Originals + all synced audio cards
    assert.ok(prodContent.includes('data-player-kicker>Featured Track</div>'), 'Emphasizes featured player as Featured Track');
    assert.ok(prodContent.includes('data-audio-file="mashups/pure usa/move-like-i-do.mp3"'), 'Wires mashups/pure usa/move-like-i-do.mp3 on featured player');
    assert.ok(prodContent.includes('data-track-title="Move Like I Do"'), 'Sets Move Like I Do as featured track title');
    assert.ok(prodContent.includes('data-track-duration="2:52"'), 'Sets 2:52 duration for Move Like I Do');
    assert.ok(prodContent.includes('<h3 class="player-title" data-player-title>Move Like I Do</h3>'), 'Displays Move Like I Do in featured player');
    assert.ok(prodContent.includes('aria-label="Play Move Like I Do"'), 'Featured play button labels Move Like I Do');
    assert.ok(prodContent.includes('0:00 / 2:52'), 'Displays 0:00 / 2:52 on featured player');
    assert.ok(prodContent.includes('<div class="cover" data-player-cover aria-hidden="true">MASHUP</div>'), 'Featured player shows MASHUP cover');
    const featuredPlayerMatch = prodContent.match(/<article class="player"[\s\S]*?<\/article>/);
    assert.ok(featuredPlayerMatch, 'Has featured player article');
    assert.ok(featuredPlayerMatch[0].includes('data-audio-file="mashups/pure usa/move-like-i-do.mp3"'), 'Featured player article itself wires mashups/pure usa/move-like-i-do.mp3');
    assert.ok(featuredPlayerMatch[0].includes('aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"></div>'), 'Featured player waveform div is intact');
    assert.ok(featuredPlayerMatch[0].includes('<span class="player-time" data-player-time aria-live="off">0:00 / 2:52</span>'), 'Featured player time span is intact');
    assert.ok(!featuredPlayerMatch[0].includes('<li') && !featuredPlayerMatch[0].includes('AUDIO-RELEASES:'), 'Featured player contains no list items or sync markers');
    assert.ok(!featuredPlayerMatch[0].includes('data-category='), 'Featured player has no data-category so category filters never hide it');
    assert.strictEqual((prodContent.match(/<!-- AUDIO-RELEASES:START -->/g) || []).length, 1, 'Has exactly one AUDIO-RELEASES:START marker');
    assert.strictEqual((prodContent.match(/<!-- AUDIO-RELEASES:END -->/g) || []).length, 1, 'Has exactly one AUDIO-RELEASES:END marker');
    assert.ok(
        prodContent.indexOf('<article class="player"') < prodContent.indexOf('id="release-list"'),
        'Featured player appears above the filterable release list'
    );
    assert.ok(
        prodContent.includes('data-subfilter-group="#release-list" data-subfilter-for="mashup" role="group" aria-label="Filter mashups by style" hidden'),
        'Includes mashup sub-filter bar hidden by default'
    );
    assert.ok(!prodContent.includes('house-pool-party.mp3'), 'Removes all usage of house-pool-party.mp3');
    assert.ok(!prodContent.includes('Featured house pool party Spotify'), 'Removes Featured house pool party Spotify link');
    assert.ok(!prodContent.includes('href="https://open.spotify.com/track/6IoqO8jmnH9Ml3BTGxDk1B"'), 'Removes featured house pool party external Spotify link');
    assert.ok(!prodContent.includes('ab67616d0000b27358f8a361049a1700f49af6b8'), 'Removes house pool party cover art');

    const spotifyEmbeds = [
        { id: 'track/6IoqO8jmnH9Ml3BTGxDk1B', height: '152', title: 'Spotify Embed: house pool party' },
        { id: 'track/1IG988cgn1YSuc0lhyk1uG', height: '152', title: 'Spotify Embed: rainy overpass' },
        { id: 'track/2NtjENcey2LS5lbxTWFeaI', height: '152', title: 'Spotify Embed: DAWN OF THE DATASTREAM' },
        { id: 'track/5WQWrRPrLNgfz5GdYFEOHl', height: '152', title: 'Spotify Embed: TO THE SKY' },
        { id: 'track/2zVLZrvwip3X4aVquQloNX', height: '152', title: 'Spotify Embed: home' },
        { id: 'album/2LE5QkOtkIjlmskNcmO7iO', height: '352', title: 'Spotify Embed: rough drafts (2024 - 2025)' },
    ];
    for (const embed of spotifyEmbeds) {
        assert.ok(
            prodContent.includes(`src="https://open.spotify.com/embed/${embed.id}?utm_source=generator"`),
            `Includes Spotify embed iframe for ${embed.title}`
        );
        assert.ok(
            prodContent.includes(`height="${embed.height}" title="${embed.title}"`),
            `Sets height="${embed.height}" and accessible title for ${embed.title}`
        );
    }
    assert.strictEqual(
        (prodContent.match(/data-category="original"/g) || []).length,
        6,
        'All 6 original items exist'
    );
    assert.strictEqual(
        (prodContent.match(/<li class="release release-embed" data-category="original">/g) || []).length,
        6,
        'Wraps all 6 Spotify Originals in filterable .release.release-embed items'
    );
    assert.strictEqual(
        (prodContent.match(/class="spotify-embed"[^>]*loading="lazy"/g) || []).length,
        6,
        'Lazy-loads all 6 Spotify embed iframes'
    );

    // Move Like I Do mashup card
    assert.ok(
        prodContent.includes('<li class="release is-active" data-category="mashup" data-subcategory="pure-usa" data-audio-file="mashups/pure usa/move-like-i-do.mp3" data-track-duration="2:52"'),
        'Marks Move Like I Do mashup card as active under mashup / pure-usa category'
    );
    assert.ok(prodContent.includes('<div class="release-title">Move Like I Do</div>'), 'Has Move Like I Do title');
    assert.ok(
        prodContent.includes('Moves Like Jagger (Maroon 5) &times; Like I Do (David Guetta &amp; Martin Garrix)'),
        'Describes Move Like I Do mashup tracks'
    );

    assert.ok(prodContent.includes('href="https://open.spotify.com/artist/4rzG9xC24GurQlOwEtqB7x"'), 'Footer links to ROVA Spotify artist profile');
    assert.ok(prodContent.includes('data-analytics-label="Footer Spotify" data-analytics-status="live"'), 'Tracks Footer Spotify link as live');
    assert.ok(!prodContent.includes('data-coming-soon="Spotify artist profile"'), 'Removes coming-soon from Footer Spotify link');
    assert.ok(prodContent.includes('data-contact-email="rohanvar@gmail.com"'), 'Configures rohanvar@gmail.com as Production contact email');
    assert.ok(!prodContent.includes('collabs@example.com'), 'Removes collabs@example.com placeholder');

    // Audio player & same-origin assets/audio/ wiring (zero eager audio tags on initial load)
    assert.ok(prodContent.includes('data-audio-player'), 'Has declarative audio player container');
    assert.ok(
        prodContent.includes('data-audio-base="../assets/audio/"'),
        'Points audio player base URL to same-origin ../assets/audio/ directory'
    );
    assert.ok(!/<audio\b/i.test(prodContent), 'Omits eager <audio> tags so initial page load downloads 0 audio bytes');

    const removedMp3Path = path.join(__dirname, '..', 'assets', 'audio', 'house-pool-party.mp3');
    assert.ok(!fs.existsSync(removedMp3Path), 'assets/audio/house-pool-party.mp3 is removed from disk');

    const audioRoot = path.join(__dirname, '..', 'assets', 'audio');
    const diskMp3s = [];
    function walkMp3s(dir) {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            if (entry.name.startsWith('.')) continue;
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) walkMp3s(full);
            else if (entry.isFile() && entry.name.toLowerCase().endsWith('.mp3')) {
                const rel = path.relative(audioRoot, full).split(path.sep).join('/');
                if (!rel.startsWith('mashups/raas/')) {
                    diskMp3s.push(rel);
                }
            }
        }
    }
    walkMp3s(audioRoot);
    assert.strictEqual(diskMp3s.length, 24, 'Discovers all 24 non-Raas uploaded MP3 files under assets/audio/');

    assert.strictEqual(
        (prodContent.match(/data-release-play/g) || []).length,
        diskMp3s.length,
        'Has one row play button per uploaded MP3 file'
    );

    const expectedCategoryBySection = {
        mashups: 'mashup',
        remixes: 'remix',
        performances: 'performance',
    };
    const prodListMatch = prodContent.match(/<ul class="release-list" id="release-list">([\s\S]*?)<\/ul>/);
    assert.ok(prodListMatch, 'Production page has #release-list container');
    assert.match(prodListMatch[1], /<!-- AUDIO-RELEASES:END -->\s*$/, 'Nothing except whitespace appears between AUDIO-RELEASES:END and </ul>');

    const rowMatches = [...prodListMatch[1].matchAll(/<li class="release(?:\s+is-active)?"[^>]*data-audio-file="([^"]+)"[^>]*>[\s\S]*?<\/li>/g)];
    assert.strictEqual(rowMatches.length, diskMp3s.length, 'Renders one release card per MP3 on disk inside #release-list');

    const renderedFiles = new Set();
    for (const [cardHtml, relFile] of rowMatches) {
        renderedFiles.add(relFile);
        const fullMp3Path = path.join(audioRoot, ...relFile.split('/'));
        assert.ok(fs.existsSync(fullMp3Path), `Audio file exists on disk: ${relFile}`);
        const mp3Header = fs.readFileSync(fullMp3Path).subarray(0, 3).toString('ascii');
        assert.ok(mp3Header === 'ID3' || mp3Header.charCodeAt(0) === 0xff, `${relFile} has valid MP3/ID3 header`);

        const parts = relFile.split('/');
        const expectedCategory = expectedCategoryBySection[parts[0]];
        assert.ok(
            cardHtml.includes(`data-category="${expectedCategory}"`),
            `${relFile} card has data-category="${expectedCategory}"`
        );
        if (parts[0] === 'mashups' && parts.length > 2) {
            const expectedSub = parts[1].trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
            assert.ok(
                cardHtml.includes(`data-subcategory="${expectedSub}"`),
                `${relFile} card has data-subcategory="${expectedSub}"`
            );
        }
        assert.match(cardHtml, /data-track-duration="\d+:\d{2}"/, `${relFile} card has formatted duration`);
        assert.match(cardHtml, /<div class="release-title">[^<]+<\/div>/, `${relFile} card has non-empty title`);
        assert.match(cardHtml, /<div class="release-meta">[^<]+<\/div>/, `${relFile} card has non-empty meta`);
        assert.ok(cardHtml.includes('data-release-play'), `${relFile} card has play button`);
    }
    for (const relFile of diskMp3s) {
        assert.ok(renderedFiles.has(relFile), `Every MP3 on disk is rendered in production/index.html: ${relFile}`);
    }

    const cssContent = fs.readFileSync(path.join(__dirname, '..', 'assets', 'css', 'portfolio.css'), 'utf8');
    assert.ok(cssContent.includes('.player-links a[hidden]'), 'CSS hides hidden player Spotify link');
    assert.ok(cssContent.includes('.release.release-embed[hidden]'), 'CSS hides filtered-out Spotify embed rows');
    assert.ok(cssContent.includes('.chips[hidden]'), 'CSS hides hidden sub-filter chip groups');

    // Real 80-bar waveform peaks and empty-state banner instead of placeholder cards
    const peakMatches = [...prodContent.matchAll(/data-peaks="([0-9,]+)"/g)];
    assert.strictEqual(peakMatches.length, diskMp3s.length + 1, 'Has real data-peaks on featured waveform and all 34 release rows');
    for (const match of peakMatches) {
        const peaks = match[1].split(',').map((n) => Number(n.trim()));
        assert.strictEqual(peaks.length, 80, 'Each data-peaks attribute has 80 bars');
        assert.ok(peaks.every((n) => Number.isInteger(n) && n >= 12 && n <= 100), 'All peaks are integers in 12..100');
    }

    assert.ok(prodContent.includes('data-filter-empty="#release-empty"'), 'Wires empty-state banner to release filter group');
    assert.ok(prodContent.includes('id="release-empty"'), 'Has release-empty coming-soon banner');
    for (const placeholder of [
        '[Artist &ndash; Song]',
        '[Bollywood Hit]',
        '[Custom Performance Mix]',
        '[Song] (ROVA Desi House Edit)',
        '[Competition Mixtape Intro]',
        'Release 06 YouTube',
    ]) {
        assert.ok(!prodContent.includes(placeholder), `Removes placeholder release card: ${placeholder}`);
    }
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

test('SEO metadata, JSON-LD schema, sitemap.xml, and robots.txt', () => {
    const pages = [
        { file: 'index.html', url: 'https://rohanvarshney.github.io/' },
        { file: path.join('dj', 'index.html'), url: 'https://rohanvarshney.github.io/dj/' },
        { file: path.join('production', 'index.html'), url: 'https://rohanvarshney.github.io/production/' },
        { file: path.join('raas', 'index.html'), url: 'https://rohanvarshney.github.io/raas/' },
    ];

    for (const page of pages) {
        const content = fs.readFileSync(path.join(__dirname, '..', page.file), 'utf8');
        assert.match(content, /<meta name="description" content="[^"]{50,}">/, `${page.file} has meta description`);
        assert.ok(content.includes(`<link rel="canonical" href="${page.url}">`), `${page.file} has canonical URL`);
        assert.ok(content.includes('<meta property="og:site_name" content="Rohan Varshney">'), `${page.file} has og:site_name`);
        assert.ok(content.includes(`<meta property="og:url" content="${page.url}">`), `${page.file} has og:url`);
        assert.match(content, /<meta property="og:title" content="[^"]+">/, `${page.file} has og:title`);
        assert.match(content, /<meta property="og:description" content="[^"]+">/, `${page.file} has og:description`);
        assert.match(content, /<meta property="og:image" content="https:\/\/rohanvarshney\.github\.io\/[^"]+">/, `${page.file} has og:image`);
        assert.ok(content.includes('<meta name="twitter:card" content="summary_large_image">'), `${page.file} has twitter:card`);
    }

    const indexContent = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
    const jsonLdMatch = indexContent.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/);
    assert.ok(jsonLdMatch, 'index.html has JSON-LD structured data');
    const jsonLd = JSON.parse(jsonLdMatch[1]);
    assert.ok(Array.isArray(jsonLd['@graph']), 'index.html JSON-LD uses @graph');
    const websiteNode = jsonLd['@graph'].find((node) => node['@type'] === 'WebSite');
    const personNode = jsonLd['@graph'].find((node) => node['@type'] === 'Person');
    assert.strictEqual(websiteNode.name, 'Rohan Varshney', 'WebSite schema sets site name');
    assert.strictEqual(websiteNode.url, 'https://rohanvarshney.github.io/', 'WebSite schema sets root URL');
    assert.strictEqual(personNode.name, 'Rohan Varshney', 'Person schema sets name');
    assert.strictEqual(personNode.jobTitle, 'Senior Software Engineer', 'Person schema sets jobTitle');
    assert.strictEqual(personNode.worksFor.name, 'Lyft', 'Person schema sets worksFor Lyft');
    assert.ok(personNode.sameAs.includes('https://linkedin.com/in/rohanvarshney'), 'Person schema links LinkedIn');
    assert.ok(personNode.sameAs.includes('https://github.com/rohanvarshney'), 'Person schema links GitHub');

    const sitemap = fs.readFileSync(path.join(__dirname, '..', 'sitemap.xml'), 'utf8');
    for (const page of pages) {
        assert.ok(sitemap.includes(`<loc>${page.url}</loc>`), `sitemap.xml includes ${page.url}`);
    }

    const robots = fs.readFileSync(path.join(__dirname, '..', 'robots.txt'), 'utf8');
    assert.ok(robots.includes('User-agent: *'), 'robots.txt allows all user agents');
    assert.ok(robots.includes('Allow: /'), 'robots.txt allows root');
    assert.ok(robots.includes('Sitemap: https://rohanvarshney.github.io/sitemap.xml'), 'robots.txt points to sitemap.xml');
});

test('assets/js/portfolio.js audio player lazy-loads tracks, scrubs, switches tracks, and handles errors', () => {
    const portfolioPath = path.join(__dirname, '..', 'assets', 'js', 'portfolio.js');
    const portfolioJs = fs.readFileSync(portfolioPath, 'utf8');

    function createMockClassList(initial = []) {
        const set = new Set(initial);
        return {
            add(cls) { set.add(cls); },
            remove(cls) { set.delete(cls); },
            contains(cls) { return set.has(cls); },
            toggle(cls, force) {
                if (force === undefined) {
                    if (set.has(cls)) { set.delete(cls); return false; }
                    set.add(cls); return true;
                }
                if (force) set.add(cls);
                else set.delete(cls);
                return Boolean(force);
            },
        };
    }

    function createMockElement(tag, { attrs = {}, classes = [], textContent = '' } = {}) {
        const attrMap = Object.assign({}, attrs);
        const listeners = {};
        const children = [];
        let _text = textContent;
        const el = {
            tagName: tag.toUpperCase(),
            style: {},
            hidden: false,
            children,
            classList: createMockClassList(classes),
            parentRow: null,
            get className() { return attrMap.class || ''; },
            set className(val) { attrMap.class = val; },
            get textContent() { return _text; },
            set textContent(val) {
                _text = String(val);
                if (val === '') children.length = 0;
            },
            getAttribute(name) {
                return Object.prototype.hasOwnProperty.call(attrMap, name) ? attrMap[name] : null;
            },
            setAttribute(name, val) {
                attrMap[name] = String(val);
            },
            removeAttribute(name) {
                delete attrMap[name];
            },
            hasAttribute(name) {
                return Object.prototype.hasOwnProperty.call(attrMap, name);
            },
            appendChild(child) {
                if (child && child._isFragment) {
                    child.children.forEach((c) => children.push(c));
                } else {
                    children.push(child);
                }
                return child;
            },
            addEventListener(type, fn) {
                listeners[type] = listeners[type] || [];
                listeners[type].push(fn);
            },
            trigger(type, eventObj) {
                (listeners[type] || []).forEach((fn) => fn(eventObj || {}));
            },
            closest(selector) {
                return selector === '.release' ? el.parentRow : null;
            },
            querySelectorAll(selector) {
                if (selector === 'span') return children;
                return [];
            },
            querySelector(selector) {
                if (selector === 'i') return children.find((c) => c.tagName === 'I') || null;
                return null;
            },
        };
        return el;
    }

    const playBtnIcon = createMockElement('i', { attrs: { class: 'fa fa-play' } });
    const playBtn = createMockElement('button', { attrs: { 'data-play-toggle': '' } });
    playBtn.appendChild(playBtnIcon);

    const wave = createMockElement('div', {
        attrs: {
            'data-waveform': '',
            'data-seed': '42',
            'data-bars': '10',
            'data-progress': '0',
            role: 'slider',
        },
    });
    wave.getBoundingClientRect = () => ({ left: 100, width: 200 });

    const coverEl = createMockElement('div', { attrs: { 'data-player-cover': '' }, classes: ['cover'], textContent: 'MASHUP' });

    const kickerEl = createMockElement('div', { attrs: { 'data-player-kicker': '' }, textContent: 'Featured Track' });
    const titleEl = createMockElement('h3', { attrs: { 'data-player-title': '' }, textContent: 'Move Like I Do' });
    const metaEl = createMockElement('div', {
        attrs: { 'data-player-meta': '' },
        textContent: 'Mashup · Moves Like Jagger (Maroon 5) × Like I Do (David Guetta & Martin Garrix)',
    });
    const timeEl = createMockElement('span', { attrs: { 'data-player-time': '' }, textContent: '0:00 / 2:52' });
    const spotifyEl = createMockElement('a', {
        attrs: {
            'data-player-spotify': '',
            href: '#',
        },
    });
    spotifyEl.hidden = true;

    function makeReleaseRow({ file, title, meta, duration, seed, peaks, spotifyHref, imgSrc, active }) {
        const row = createMockElement('li', {
            attrs: Object.assign(
                { 'data-audio-file': file, 'data-seed': seed },
                duration ? { 'data-track-duration': duration } : {},
                peaks ? { 'data-peaks': peaks } : {}
            ),
            classes: active ? ['release', 'is-active'] : ['release'],
        });
        const rowCoverImg = imgSrc ? createMockElement('img', { attrs: { src: imgSrc, alt: title + ' cover art' } }) : null;
        const rowCover = createMockElement('div', {
            classes: imgSrc ? ['cover', 'has-art'] : ['cover'],
            textContent: imgSrc ? '' : 'MASHUP',
        });
        if (rowCoverImg) {
            rowCover.appendChild(rowCoverImg);
        }
        const rowTitle = createMockElement('div', { textContent: title });
        const rowMeta = createMockElement('div', { textContent: meta });
        const rowBtnIcon = createMockElement('i', { attrs: { class: 'fa fa-play' } });
        const rowBtn = createMockElement('button', { attrs: { 'data-release-play': '' } });
        rowBtn.appendChild(rowBtnIcon);
        rowBtn.parentRow = row;
        const rowSpotify = spotifyHref ? createMockElement('a', { attrs: { href: spotifyHref } }) : null;

        row.querySelector = (sel) => {
            if (sel === '.release-title') return rowTitle;
            if (sel === '.release-meta') return rowMeta;
            if (sel === '.cover img') return rowCoverImg;
            if (sel === '.cover') return rowCover;
            if (sel === '.release-links a[href^="http"]') return rowSpotify;
            return null;
        };
        return { row, rowBtn, rowBtnIcon };
    }

    const track1 = makeReleaseRow({
        file: 'mashups/pure usa/move-like-i-do.mp3',
        title: 'Move Like I Do',
        meta: 'Mashup · Pure USA · Moves Like Jagger (Maroon 5) × Like I Do (David Guetta & Martin Garrix) · 2:52',
        duration: '2:52',
        seed: '29',
        active: true,
    });
    const track2 = makeReleaseRow({
        file: 'demo-spotify-track.mp3',
        title: 'rainy overpass',
        meta: 'Original · 1:38 · 2025',
        duration: '1:38',
        seed: '17',
        peaks: '20, 40, 80, 100, 60, 30, 50, 90, 70, 10',
        spotifyHref: 'https://open.spotify.com/track/1IG988cgn1YSuc0lhyk1uG',
        imgSrc: 'https://i.scdn.co/image/track2',
        active: false,
    });
    const mashupTrack = makeReleaseRow({
        file: 'demo-mashup.mp3',
        title: 'Demo Mashup',
        meta: 'Mashup · Track A × Track B',
        seed: '31',
        active: false,
    });

    const releaseList = createMockElement('ul', { attrs: { id: 'release-list' } });
    releaseList.querySelector = (sel) => {
        if (sel === '.release.is-active') return [track1.row, track2.row, mashupTrack.row].find((r) => r.classList.contains('is-active')) || null;
        if (sel === '.release[data-audio-file], .release[data-audio-src]') return track1.row;
        return null;
    };
    releaseList.querySelectorAll = (sel) => {
        if (sel === '[data-release-play]') return [track1.rowBtn, track2.rowBtn, mashupTrack.rowBtn];
        if (sel === '.release.is-active') return [track1.row, track2.row, mashupTrack.row].filter((r) => r.classList.contains('is-active'));
        return [];
    };

    const player = createMockElement('article', {
        attrs: {
            'data-audio-player': '',
            'data-audio-base': '../assets/audio/',
            'data-audio-file': 'mashups/pure usa/move-like-i-do.mp3',
            'data-track-title': 'Move Like I Do',
            'data-track-duration': '2:52',
            'data-track-list': '#release-list',
        },
    });
    player.querySelector = (sel) => {
        if (sel === '[data-play-toggle]') return playBtn;
        if (sel === '[data-waveform]') return wave;
        if (sel === '[data-player-cover]') return coverEl;
        if (sel === '[data-player-kicker]') return kickerEl;
        if (sel === '[data-player-title]') return titleEl;
        if (sel === '[data-player-meta]') return metaEl;
        if (sel === '[data-player-time]') return timeEl;
        if (sel === '[data-player-spotify]') return spotifyEl;
        return null;
    };

    const banner = createMockElement('div');
    const bannerText = createMockElement('span', { textContent: 'Coming soon!' });
    const trackedEvents = [];
    const createdAudios = [];
    let domReadyHandler = null;

    class MockAudio {
        constructor() {
            this.preload = '';
            this.src = '';
            this.currentTime = 0;
            this.duration = NaN;
            this.paused = true;
            this.ended = false;
            this._listeners = {};
            this.playCalls = 0;
            this.pauseCalls = 0;
            createdAudios.push(this);
        }
        addEventListener(type, fn) {
            this._listeners[type] = this._listeners[type] || [];
            this._listeners[type].push(fn);
        }
        emit(type) {
            (this._listeners[type] || []).forEach((fn) => fn({}));
        }
        play() {
            this.playCalls++;
            this.paused = false;
            this.ended = false;
            this.emit('playing');
            return Promise.resolve();
        }
        pause() {
            this.pauseCalls++;
            this.paused = true;
            this.emit('pause');
        }
        load() {}
    }

    const sandbox = {
        Audio: MockAudio,
        location: { href: 'https://rohanvarshney.github.io/production/' },
        isSecureContext: true,
        trackAnalyticsEvent(name, params) {
            trackedEvents.push({ name, params });
        },
        document: {
            title: 'ROVA Production',
            body: { getAttribute() { return ''; } },
            addEventListener(type, fn) {
                if (type === 'DOMContentLoaded') domReadyHandler = fn;
            },
            querySelector(sel) {
                if (sel === '#release-list') return releaseList;
                return null;
            },
            querySelectorAll(sel) {
                if (sel === '[data-waveform]') return [wave];
                if (sel === '[data-audio-player]') return [player];
                return [];
            },
            getElementById(id) {
                if (id === 'coming-soon-banner') return banner;
                if (id === 'coming-soon-text') return bannerText;
                return null;
            },
            createDocumentFragment() {
                return { _isFragment: true, children: [], appendChild(c) { this.children.push(c); } };
            },
            createElement(tag) {
                return createMockElement(tag);
            },
        },
        setTimeout() { return 1; },
        clearTimeout() {},
    };
    sandbox.window = sandbox;

    vm.createContext(sandbox);
    vm.runInContext(portfolioJs, sandbox);
    domReadyHandler();

    // 1. Zero Audio instances created on page load
    assert.strictEqual(createdAudios.length, 0, 'Does not instantiate Audio on initial page load');
    assert.strictEqual(wave.children.length, 10, 'Renders waveform bars on page load');

    // 2. Clicking Play lazy-loads mashups/pure usa/move-like-i-do.mp3 from ../assets/audio/ (URL-encoded)
    playBtn.trigger('click');
    assert.strictEqual(createdAudios.length, 1, 'Creates Audio lazily on first Play click');
    const audio = createdAudios[0];
    assert.strictEqual(audio.preload, 'none', 'Sets preload="none" on Audio instance');
    assert.strictEqual(
        audio.src,
        '../assets/audio/mashups/pure%20usa/move-like-i-do.mp3',
        'Loads MP3 from ../assets/audio/ base + URL-encoded data-audio-file'
    );
    assert.strictEqual(audio.playCalls, 1, 'Starts playback');
    assert.strictEqual(playBtn.getAttribute('aria-pressed'), 'true', 'Updates featured play button aria-pressed');
    assert.strictEqual(track1.rowBtn.getAttribute('aria-pressed'), 'true', 'Syncs active row play button');
    assert.strictEqual(kickerEl.textContent, 'Featured Track', 'Keeps Featured Track kicker');
    assert.strictEqual(trackedEvents[0].name, 'production_audio_play', 'Tracks production_audio_play GA4 event');

    // 3. Timeupdate updates waveform progress and time readout
    audio.duration = 172;
    audio.currentTime = 65;
    audio.emit('loadedmetadata');
    audio.emit('timeupdate');
    assert.strictEqual(timeEl.textContent, '1:05 / 2:52', 'Updates time readout during playback');
    assert.strictEqual(wave.getAttribute('aria-valuenow'), '38', 'Updates slider aria-valuenow');
    assert.ok(wave.children[0].classList.contains('played'), 'Marks elapsed waveform bars as played');
    assert.ok(!wave.children[9].classList.contains('played'), 'Leaves future waveform bars unplayed');

    // 4. Clicking waveform seeks proportionally (left=100, width=200, clientX=200 -> 50%)
    wave.trigger('click', { clientX: 200 });
    assert.strictEqual(audio.currentTime, 86, 'Seeks audio.currentTime when waveform is clicked');

    // Clicking active row play button pauses and keeps Featured Track kicker
    track1.rowBtn.trigger('click');
    assert.strictEqual(audio.paused, true, 'Pauses when clicking active row play button');
    assert.strictEqual(kickerEl.textContent, 'Featured Track', 'Preserves Featured Track kicker for active row');

    // 5. Clicking another row switches track, updates UI & peaks, and plays new MP3
    track2.rowBtn.trigger('click');
    assert.strictEqual(titleEl.textContent, 'rainy overpass', 'Updates featured player title');
    assert.strictEqual(kickerEl.textContent, 'Now playing', 'Updates kicker to Now playing');
    assert.strictEqual(
        spotifyEl.getAttribute('href'),
        'https://open.spotify.com/track/1IG988cgn1YSuc0lhyk1uG',
        'Updates featured Spotify link'
    );
    assert.strictEqual(
        audio.src,
        '../assets/audio/demo-spotify-track.mp3',
        'Switches audio.src to newly selected track'
    );
    assert.strictEqual(wave.children[3].style.height, '100%', 'Renders custom data-peaks heights when provided');
    assert.ok(track2.row.classList.contains('is-active'), 'Marks selected row as active');
    assert.ok(!track1.row.classList.contains('is-active'), 'Clears active class from previous row');

    // Clicking active row play button again pauses
    track2.rowBtn.trigger('click');
    assert.strictEqual(audio.paused, true, 'Pauses when clicking active row play button again');

    // 6. Audio error on Spotify-linked track resets state and shows Spotify fallback toast
    audio.currentTime = 0;
    audio.emit('error');
    assert.strictEqual(playBtn.getAttribute('aria-pressed'), 'false', 'Resets play button state on audio error');
    assert.strictEqual(banner.classList.contains('visible'), true, 'Shows fallback toast on audio error');
    assert.ok(bannerText.textContent.includes('listen on Spotify'), 'Displays Spotify fallback message when track has Spotify link');

    // 7. Switching to non-Spotify mashup row hides Spotify pill, omits unknown duration, and uses non-Spotify error toast
    mashupTrack.rowBtn.trigger('click');
    assert.strictEqual(titleEl.textContent, 'Demo Mashup', 'Updates featured player title to mashup');
    assert.strictEqual(kickerEl.textContent, 'Now playing', 'Updates kicker to Now playing');
    assert.strictEqual(spotifyEl.hidden, true, 'Hides Spotify link for non-Spotify mashup');
    assert.strictEqual(timeEl.textContent, '0:00', 'Omits / 0:00 when track duration is not yet known');
    assert.strictEqual(audio.src, '../assets/audio/demo-mashup.mp3', 'Loads mashup MP3 from ../assets/audio/');
    audio.currentTime = 0;
    audio.emit('error');
    assert.strictEqual(
        bannerText.textContent,
        'Audio preview unavailable right now — check back soon.',
        'Displays non-Spotify fallback message when track has no Spotify link'
    );
});

test('assets/js/portfolio.js category filters show coming-soon banner for empty categories', () => {
    const portfolioPath = path.join(__dirname, '..', 'assets', 'js', 'portfolio.js');
    const portfolioJs = fs.readFileSync(portfolioPath, 'utf8');

    let domReadyHandler = null;

    function makeChip(filter, label, pressed) {
        const attrs = { 'data-filter': filter, 'aria-pressed': String(pressed) };
        let clickHandler = null;
        return {
            textContent: label,
            getAttribute(name) { return Object.prototype.hasOwnProperty.call(attrs, name) ? attrs[name] : null; },
            setAttribute(name, val) { attrs[name] = String(val); },
            addEventListener(type, fn) { if (type === 'click') clickHandler = fn; },
            click() { if (clickHandler) clickHandler(); },
        };
    }

    function makeItem(category) {
        return {
            hidden: false,
            getAttribute(name) { return name === 'data-category' ? category : null; },
        };
    }

    const chips = [
        makeChip('all', 'All', true),
        makeChip('original', 'Originals', false),
        makeChip('remix', 'Remixes & Edits', false),
        makeChip('mashup', 'Mashups', false),
    ];
    const items = [makeItem('original'), makeItem('original')];
    const emptyTitle = { textContent: 'More releases on the way' };
    const emptyEl = {
        hidden: true,
        querySelector(sel) { return sel === '[data-empty-title]' ? emptyTitle : null; },
    };
    const filterGroup = {
        getAttribute(name) {
            if (name === 'data-filter-group') return '#release-list';
            if (name === 'data-filter-empty') return '#release-empty';
            return null;
        },
        querySelectorAll(sel) { return sel === '[data-filter]' ? chips : []; },
    };

    const sandbox = {
        location: { href: 'https://rohanvarshney.github.io/production/' },
        isSecureContext: true,
        document: {
            title: 'ROVA Production',
            body: { getAttribute() { return ''; } },
            addEventListener(type, fn) { if (type === 'DOMContentLoaded') domReadyHandler = fn; },
            querySelector(sel) { return sel === '#release-empty' ? emptyEl : null; },
            querySelectorAll(sel) {
                if (sel === '[data-filter-group]') return [filterGroup];
                if (sel === '#release-list [data-category]') return items;
                return [];
            },
            getElementById() { return null; },
        },
        setTimeout() { return 1; },
        clearTimeout() {},
    };
    sandbox.window = sandbox;

    vm.createContext(sandbox);
    vm.runInContext(portfolioJs, sandbox);
    domReadyHandler();

    assert.strictEqual(emptyEl.hidden, true, 'Empty banner starts hidden when items are visible');

    chips[1].click(); // Originals
    assert.strictEqual(items.every((i) => !i.hidden), true, 'Originals filter keeps original items visible');
    assert.strictEqual(emptyEl.hidden, true, 'Empty banner stays hidden when category has items');

    chips[2].click(); // Remixes & Edits
    assert.strictEqual(items.every((i) => i.hidden), true, 'Remixes filter hides non-matching items');
    assert.strictEqual(emptyEl.hidden, false, 'Empty banner becomes visible when category has 0 items');
    assert.strictEqual(emptyTitle.textContent, 'Remixes & Edits — coming soon', 'Updates banner title to selected category');

    chips[3].click(); // Mashups
    assert.strictEqual(emptyEl.hidden, false, 'Empty banner stays visible for Mashups');
    assert.strictEqual(emptyTitle.textContent, 'Mashups — coming soon', 'Updates banner title to Mashups');

    chips[0].click(); // All
    assert.strictEqual(items.every((i) => !i.hidden), true, 'All filter restores all items');
    assert.strictEqual(emptyEl.hidden, true, 'All filter hides empty banner');
});

test('assets/js/portfolio.js mashup sub-filters toggle visibility and filter by subcategory', () => {
    const portfolioPath = path.join(__dirname, '..', 'assets', 'js', 'portfolio.js');
    const portfolioJs = fs.readFileSync(portfolioPath, 'utf8');

    let domReadyHandler = null;

    function makeChip(attrName, value, label, pressed) {
        const attrs = { [attrName]: value, 'aria-pressed': String(pressed) };
        let clickHandler = null;
        return {
            textContent: label,
            getAttribute(name) { return Object.prototype.hasOwnProperty.call(attrs, name) ? attrs[name] : null; },
            setAttribute(name, val) { attrs[name] = String(val); },
            addEventListener(type, fn) { if (type === 'click') clickHandler = fn; },
            click() { if (clickHandler) clickHandler(); },
        };
    }

    function makeItem(category, subcategory) {
        return {
            hidden: false,
            getAttribute(name) {
                if (name === 'data-category') return category;
                if (name === 'data-subcategory') return subcategory || null;
                return null;
            },
        };
    }

    const chips = [
        makeChip('data-filter', 'all', 'All', true),
        makeChip('data-filter', 'mashup', 'Mashups', false),
        makeChip('data-filter', 'remix', 'Remixes & Edits', false),
    ];
    const subChips = [
        makeChip('data-subfilter', 'all', 'All Mashups', true),
        makeChip('data-subfilter', 'pure-usa', 'Pure USA', false),
        makeChip('data-subfilter', 'fusion', 'Fusion', false),
    ];
    const items = [
        makeItem('mashup', 'pure-usa'),
        makeItem('mashup', 'fusion'),
        makeItem('remix', null),
    ];

    const filterGroup = {
        getAttribute(name) { return name === 'data-filter-group' ? '#release-list' : null; },
        querySelectorAll(sel) { return sel === '[data-filter]' ? chips : []; },
    };
    const subFilterGroup = {
        hidden: true,
        getAttribute(name) {
            if (name === 'data-subfilter-group') return '#release-list';
            if (name === 'data-subfilter-for') return 'mashup';
            return null;
        },
        querySelectorAll(sel) { return sel === '[data-subfilter]' ? subChips : []; },
    };

    const sandbox = {
        location: { href: 'https://rohanvarshney.github.io/production/' },
        isSecureContext: true,
        document: {
            title: 'ROVA Production',
            body: { getAttribute() { return ''; } },
            addEventListener(type, fn) { if (type === 'DOMContentLoaded') domReadyHandler = fn; },
            querySelector() { return null; },
            querySelectorAll(sel) {
                if (sel === '[data-filter-group]') return [filterGroup];
                if (sel === '[data-subfilter-group]') return [subFilterGroup];
                if (sel === '#release-list [data-category]') return items;
                return [];
            },
            getElementById() { return null; },
        },
        setTimeout() { return 1; },
        clearTimeout() {},
    };
    sandbox.window = sandbox;

    vm.createContext(sandbox);
    vm.runInContext(portfolioJs, sandbox);
    domReadyHandler();

    assert.strictEqual(subFilterGroup.hidden, true, 'Mashup sub-filter starts hidden');

    chips[1].click(); // Mashups
    assert.strictEqual(subFilterGroup.hidden, false, 'Reveals mashup sub-filter when Mashups is selected');
    assert.strictEqual(items[0].hidden, false, 'Shows pure-usa mashup');
    assert.strictEqual(items[1].hidden, false, 'Shows fusion mashup');
    assert.strictEqual(items[2].hidden, true, 'Hides remix');

    subChips[1].click(); // Pure USA
    assert.strictEqual(items[0].hidden, false, 'Keeps pure-usa mashup visible');
    assert.strictEqual(items[1].hidden, true, 'Hides fusion mashup');
    assert.strictEqual(subChips[1].getAttribute('aria-pressed'), 'true', 'Marks Pure USA chip active');

    chips[2].click(); // Remixes & Edits
    assert.strictEqual(subFilterGroup.hidden, true, 'Hides mashup sub-filter when switching to Remixes');
    assert.strictEqual(subChips[0].getAttribute('aria-pressed'), 'true', 'Resets sub-filter to All Mashups');
    assert.strictEqual(items[2].hidden, false, 'Shows remix');
});
