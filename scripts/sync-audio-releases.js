#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { execFileSync } = require('node:child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const AUDIO_DIR = path.join(ROOT_DIR, 'assets', 'audio');
const PRODUCTION_HTML = path.join(ROOT_DIR, 'production', 'index.html');
const RAAS_HTML = path.join(ROOT_DIR, 'raas', 'index.html');

const PROD_START_MARKER = '<!-- AUDIO-RELEASES:START -->';
const PROD_END_MARKER = '<!-- AUDIO-RELEASES:END -->';
const RAAS_START_MARKER = '<!-- RAAS-AUDIO:START -->';
const RAAS_END_MARKER = '<!-- RAAS-AUDIO:END -->';

const SECTION_CONFIG = {
  mashups: { category: 'mashup', cover: 'MASHUP', label: 'Mashup', order: 0 },
  remixes: { category: 'remix', cover: 'REMIX', label: 'Remix', order: 1 },
  performances: { category: 'performance', cover: 'PERF MIX', label: 'Performance Mix', order: 2 },
};

const MASHUP_SUBFOLDER_ORDER = ['western', 'indo-western-fusion', 'desi', 'raas'];

const MASHUP_SUBFOLDER_LABELS = {
  western: 'Western',
  'indo-western-fusion': 'Indo-Western Fusion',
  desi: 'Desi',
  raas: 'Raas',
};

const ACRONYMS = new Set(['EDM', 'LRAD', 'DNA', 'ROVA', 'USA', 'DJ']);

const CURATED_TRACKS = {
  // Mashups — Western
  'mashups/western/move-like-i-do.mp3': {
    title: 'Move Like I Do',
    description: 'Moves Like Jagger (Maroon 5) × Like I Do (David Guetta & Martin Garrix)',
    seed: 29,
    featured: true,
  },
  'mashups/western/the-floor-has-levels.mp3': {
    title: 'The Floor Has Levels',
    description: 'On the Floor (Jennifer Lopez & Pitbull) × Levels (Avicii)',
    order: 2,
  },
  'mashups/western/animalistic time.mp3': {
    title: 'Animalistic Time',
    description: 'Animals (Martin Garrix) × Time of Our Lives (Pitbull & Ne-Yo)',
  },
  'mashups/western/beggin-medley.mp3': {
    title: "Beggin' Medley",
    description: "Beggin' (Måneskin) × Beauty and a Beat (Justin Bieber) × Moves Like Jagger (Maroon 5)",
  },
  'mashups/western/cataclysmic_faint.mp3': {
    title: 'Cataclysmic Faint',
    description: 'The Catalyst × Faint (Linkin Park)',
  },
  'mashups/western/ghosts-have-done.mp3': {
    title: 'Ghosts Have Done',
    description: "Ghost Town (Adam Lambert) × What I've Done (Linkin Park)",
  },
  'mashups/western/saxobeat-on-the-floor.mp3': {
    title: 'Saxobeat On The Floor',
    description: 'Mr. Saxobeat (Alexandra Stan) × On the Floor (Jennifer Lopez & Pitbull)',
  },

  // Mashups — Indo-Western Fusion
  'mashups/indo-western-fusion/beautiful-raat.mp3': {
    title: 'Beautiful Raat',
    description: 'Aaj Ki Raat (Madhubanti Bagchi & Sachin-Jigar) × Beautiful Escape (Tom Misch feat. Zak Abel)',
    order: 1,
  },
  'mashups/indo-western-fusion/airplanes-945.mp3': {
    title: 'Airplanes × 9:45',
    description: 'Airplanes (B.o.B feat. Hayley Williams) × 9:45 (Prabh Singh)',
    order: 2,
  },
  'mashups/indo-western-fusion/tere-pyaar-i-want-you.mp3': {
    title: 'Tere Pyaar × I Want You',
    description: 'Tere Pyaar Mein (Arijit Singh & Pritam) × I Want You to Know (Zedd feat. Selena Gomez)',
    order: 3,
  },
  'mashups/indo-western-fusion/helpless-gulaab.mp3': {
    title: 'Helpless Gulaab',
    description: 'Akhiyaan Gulaab (Mitraz) × Helpless (John Mayer)',
    order: 4,
  },
  'mashups/indo-western-fusion/is-shiela-worth-it.mp3': {
    title: 'Is Sheila Worth It',
    description: 'Sheila Ki Jawani (Sunidhi Chauhan & Vishal-Shekhar) × Worth It (Fifth Harmony feat. Kid Ink)',
    order: 5,
  },
  'mashups/indo-western-fusion/laila-main-la-mama.mp3': {
    title: 'Laila Main La Mama',
    description: 'Laila Main Laila (Pawni Pandey) × La Mamá de la Mamá (El Alfa, CJ & El Cherry Scom)',
    order: 6,
  },
  'mashups/indo-western-fusion/ye-mera-dil-enless-summer.mp3': {
    title: 'Ye Mera Dil × Endless Summer',
    description: 'Yeh Mera Dil (Sunidhi Chauhan) × Endless Summer (Alan Walker & Zak Abel)',
    order: 7,
  },
  'mashups/indo-western-fusion/prabhu-ka-naam-medley.mp3': {
    title: 'Prabhu Ka Naam Medley',
    description: 'Leke Prabhu Ka Naam (Arijit Singh & Pritam) × Everybody (Logic) × Lil Bit (K Camp) × KMT (Drake) × Limitless (Martin Garrix & Mesto)',
    order: 8,
  },
  'mashups/indo-western-fusion/tanhayee-stars.mp3': {
    title: 'Tanhayee Stars',
    description: 'Tanhayee (Sonu Nigam) × All the Stars (Kendrick Lamar & SZA)',
    order: 9,
  },
  'mashups/indo-western-fusion/don-n-night.mp3': {
    title: "Don 'N' Night",
    description: "Main Hoon Don (Shaan) × Day 'N' Nite (Kid Cudi & Crookers)",
    order: 10,
  },
  'mashups/indo-western-fusion/lrad-zindigani.mp3': {
    title: 'LRAD Zindagani',
    description: 'Ek Toh Kum Zindagani (Neha Kakkar) × LRAD (Knife Party)',
    order: 11,
  },

  // Mashups — Desi
  'mashups/desi/dekhe-dance.mp3': {
    title: 'Dekhe Dance',
    description: 'Khwab Dekhe (Monali Thakur & Pritam) × Dance (F1rstman feat. H-Dhami, Juggy D, Mumzy Stranger & Raxstar)',
  },

  // Mashups — Raas
  'mashups/raas/besharam-divya.mp3': {
    title: 'Besharam Divya',
    description: 'Besharam Rang (Shilpa Rao & Vishal-Shekhar) × Aavya Divadiye Jagmagta Maa Na Norta (Traditional Garba)',
  },
  'mashups/raas/chunalida.mp3': {
    title: 'Chunalida',
    description: 'Chunari (Himali Vyas Naik) × Dholida (Jahnvi Shrimankar & Shail Hada)',
    featured: true,
  },
  'mashups/raas/dankeroopty.mp3': {
    title: 'Dankonteroopty',
    description: 'Danko Vagyo (Traditional Raas) × MONTERO (Lil Nas X) × Whoopty (CJ)',
  },
  'mashups/raas/feel-so-raas.mp3': {
    title: 'Feel So Raas',
    description: 'Feel So Close (Calvin Harris) × Ha Ha Re Ghaduliyo (Traditional Garba)',
  },
  'mashups/raas/kanudina-psycho.mp3': {
    title: 'Kanudina Psycho',
    description: 'Kanuda Ni Morli Ma (Traditional Raas) × Psycho (Post Malone feat. Ty Dolla $ign)',
  },
  'mashups/raas/mogal-rumble.mp3': {
    title: 'Mogal Rumble',
    description: 'Maa Mogal Ramva Aave Re (Jigardan Gadhavi) × Rumble (Skrillex, Fred again.. & Flowdan)',
  },
  'mashups/raas/patang-tu-meri.mp3': {
    title: 'Patang × Tu Meri',
    description: 'Patang (Osman Mir) × Tu Meri (Vishal Dadlani & Vishal-Shekhar)',
  },
  'mashups/raas/phool-jai.mp3': {
    title: 'Phool × Jai',
    description: 'Phool Phool Venjo Ne (Abhita Patel) × Jai Jai Shivshankar (Vishal Dadlani, Benny Dayal & Vishal-Shekhar)',
  },
  'mashups/raas/rangilo-rova.mp3': {
    title: 'Rangilo (ROVA Remix)',
    description: 'Rangilo Maro Dholna (Shubha Mudgal & Sukhwinder Singh) · Hype Edit',
  },
  'mashups/raas/sachi-edm.mp3': {
    title: 'Sachi (EDM Remix)',
    description: 'Sachi Re Mari (Bhoomi Trivedi & Osman Mir) · EDM Flip',
  },
  'mashups/raas/tongue-tied-greedy.mp3': {
    title: 'Tongue Tied Greedy',
    description: 'Tongue Tied (Grouplove) × Greedy (Tate McRae) × Asvaar (Aishwarya Majmudar)',
  },
  'mashups/raas/vari-dna.mp3': {
    title: 'VariD(o)NA',
    description: 'Vaari Jaau Re (Jigardan Gadhavi) × Don Don (Daddy Yankee, Anuel AA & Kendo Kaponi)',
  },

  // Remixes
  'remixes/ghoomaremix.mp3': {
    title: 'Ghoomar (ROVA Remix)',
    description: 'Ghoomar (Shreya Ghoshal & Swaroop Khan) · Lounge Edit',
  },
  'remixes/khuda-jaane-urban.mp3': {
    title: 'Khuda Jaane (ROVA Remix)',
    description: 'Khuda Jaane (KK & Shilpa Rao) · Urban Edit',
  },

  // Performances
  'performances/zerena-time-to-disco.mp3': {
    title: 'Zerena — Time To Disco',
    description: "It's The Time To Disco (Vasundhara Das, KK, Shaan & Loy Mendonsa) · Custom Stage Routine",
  },
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\u00b7/g, '&middot;')
    .replace(/\u00d7/g, '&times;')
    .replace(/\u2014/g, '&mdash;');
}

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function toTitleCase(rawName) {
  return rawName
    .replace(/\.mp3$/i, '')
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word) => {
      const upper = word.toUpperCase();
      if (ACRONYMS.has(upper)) {
        return upper;
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

function stableSeed(relPath) {
  let hash = 0;
  for (let i = 0; i < relPath.length; i++) {
    hash = (hash * 31 + relPath.charCodeAt(i)) % 997;
  }
  return (hash % 999) + 1;
}

function formatDuration(seconds) {
  const total = Math.floor(seconds);
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function getAudioDuration(filePath) {
  const out = execFileSync('afinfo', [filePath], { encoding: 'utf8' });
  const match = out.match(/estimated duration:\s*([0-9.]+)\s*sec/i);
  if (!match) {
    throw new Error(`Could not determine duration from afinfo for ${filePath}`);
  }
  return formatDuration(parseFloat(match[1]));
}

function parseWavDataChunk(buffer) {
  if (buffer.toString('ascii', 0, 4) !== 'RIFF' || buffer.toString('ascii', 8, 12) !== 'WAVE') {
    throw new Error('Invalid WAV header');
  }
  let offset = 12;
  while (offset + 8 <= buffer.length) {
    const chunkId = buffer.toString('ascii', offset, offset + 4);
    const chunkSize = buffer.readUInt32LE(offset + 4);
    const dataStart = offset + 8;
    if (chunkId === 'data') {
      return buffer.subarray(dataStart, Math.min(buffer.length, dataStart + chunkSize));
    }
    offset = dataStart + chunkSize + (chunkSize % 2);
  }
  throw new Error('WAV data chunk not found');
}

function getWaveformPeaks(filePath, bars = 80) {
  const tmpWav = path.join(
    os.tmpdir(),
    `rova_peaks_${process.pid}_${Date.now()}_${Math.random().toString(36).slice(2)}.wav`
  );
  try {
    execFileSync('afconvert', ['-f', 'WAVE', '-d', 'LEI16@8000', '-c', '1', filePath, tmpWav], {
      stdio: 'ignore',
    });
    const wavBuf = fs.readFileSync(tmpWav);
    const pcm = parseWavDataChunk(wavBuf);
    const totalSamples = Math.floor(pcm.length / 2);
    const chunkSize = Math.max(1, Math.floor(totalSamples / bars));
    const rmsValues = [];
    for (let i = 0; i < bars; i++) {
      const startSample = i * chunkSize;
      const endSample = i === bars - 1 ? totalSamples : Math.min(totalSamples, (i + 1) * chunkSize);
      let sumSq = 0;
      let count = 0;
      for (let s = startSample; s < endSample; s++) {
        const sample = pcm.readInt16LE(s * 2);
        sumSq += sample * sample;
        count++;
      }
      rmsValues.push(count > 0 ? Math.sqrt(sumSq / count) : 0);
    }
    const maxRms = Math.max(...rmsValues) || 1;
    return rmsValues.map((v) => Math.max(12, Math.min(100, Math.round((v / maxRms) * 100))));
  } finally {
    if (fs.existsSync(tmpWav)) {
      fs.unlinkSync(tmpWav);
    }
  }
}

function collectMp3Files(dir) {
  const results = [];
  if (!fs.existsSync(dir)) {
    return results;
  }
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) {
      continue;
    }
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectMp3Files(fullPath));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.mp3')) {
      results.push(fullPath);
    }
  }
  return results;
}

function buildTrackMetadata(fullPath) {
  const relPath = path.relative(AUDIO_DIR, fullPath).split(path.sep).join('/');
  const parts = relPath.split('/');
  const sectionKey = parts[0];
  const section = SECTION_CONFIG[sectionKey];
  if (!section) {
    return null;
  }

  const subfolder = parts.length > 2 ? parts[1] : null;
  const subLabel = subfolder
    ? MASHUP_SUBFOLDER_LABELS[subfolder] || toTitleCase(subfolder)
    : null;
  const subcategory = subfolder ? slugify(subfolder) : null;

  const curated = CURATED_TRACKS[relPath];
  const title = curated ? curated.title : toTitleCase(parts[parts.length - 1]);
  const description = curated
    ? curated.description
    : subLabel
      ? `${subLabel} ${section.label}`
      : section.label;

  const duration = getAudioDuration(fullPath);
  const peaks = getWaveformPeaks(fullPath, 80);
  const seed = curated && curated.seed ? curated.seed : stableSeed(relPath);

  const isRaas = sectionKey === 'mashups' && subfolder === 'raas';
  const cover = isRaas ? 'RAAS' : section.cover;

  const metaParts = isRaas ? [] : [section.label];
  if (!isRaas && subLabel) {
    metaParts.push(subLabel);
  }
  if (description) {
    metaParts.push(description);
  }
  metaParts.push(duration);

  return {
    relPath,
    sectionKey,
    sectionOrder: section.order,
    category: section.category,
    cover,
    subfolder,
    subcategory,
    title,
    meta: metaParts.join(' \u00b7 '),
    duration,
    peaks: peaks.join(','),
    seed,
    featured: Boolean(curated && curated.featured),
    order: curated && Number.isFinite(curated.order) ? curated.order : Infinity,
  };
}

function compareTracks(a, b) {
  if (a.sectionOrder !== b.sectionOrder) {
    return a.sectionOrder - b.sectionOrder;
  }
  if (a.sectionKey === 'mashups') {
    const idxA = MASHUP_SUBFOLDER_ORDER.indexOf(a.subfolder || '');
    const idxB = MASHUP_SUBFOLDER_ORDER.indexOf(b.subfolder || '');
    const rankA = idxA === -1 ? 999 : idxA;
    const rankB = idxB === -1 ? 999 : idxB;
    if (rankA !== rankB) {
      return rankA - rankB;
    }
    if ((a.subfolder || '') !== (b.subfolder || '')) {
      return (a.subfolder || '').localeCompare(b.subfolder || '');
    }
  }
  if (a.featured !== b.featured) {
    return a.featured ? -1 : 1;
  }
  if (a.order !== b.order) {
    return a.order - b.order;
  }
  return a.title.localeCompare(b.title);
}

function renderReleaseItem(track) {
  const classes = track.featured ? 'release is-active' : 'release';
  const subAttr = track.subcategory ? ` data-subcategory="${escapeHtml(track.subcategory)}"` : '';
  return [
    `        <li class="${classes}" data-category="${escapeHtml(track.category)}"${subAttr} data-audio-file="${escapeHtml(track.relPath)}" data-track-duration="${escapeHtml(track.duration)}" data-seed="${track.seed}"`,
    `          data-peaks="${track.peaks}">`,
    `          <div class="cover" aria-hidden="true">${escapeHtml(track.cover)}</div>`,
    '          <div>',
    `            <div class="release-title">${escapeHtml(track.title)}</div>`,
    `            <div class="release-meta">${escapeHtml(track.meta)}</div>`,
    '          </div>',
    '          <div class="release-links">',
    `            <button type="button" class="release-play-btn" data-release-play aria-label="Play ${escapeHtml(track.title)}" aria-pressed="false">`,
    '              <i class="fa fa-play" aria-hidden="true"></i>',
    '            </button>',
    '          </div>',
    '        </li>',
  ].join('\n');
}

function updateHtmlWithTracks(htmlPath, startMarker, endMarker, tracks) {
  let html = fs.readFileSync(htmlPath, 'utf8');

  const featured = tracks.find((t) => t.featured) || tracks[0];
  if (featured) {
    const playerMatch = html.match(/<article class="player"[\s\S]*?<\/article>/);
    if (!playerMatch) {
      throw new Error(`Missing <article class="player"> block in ${htmlPath}`);
    }
    let updatedPlayerHtml = playerMatch[0]
      .replace(/data-audio-file="[^"]*"/, () => `data-audio-file="${escapeHtml(featured.relPath)}"`)
      .replace(/data-track-title="[^"]*"/, () => `data-track-title="${escapeHtml(featured.title)}"`)
      .replace(/data-track-duration="[^"]*"/, () => `data-track-duration="${escapeHtml(featured.duration)}"`)
      .replace(/data-seed="[^"]*"/, () => `data-seed="${featured.seed}"`)
      .replace(
        /<div class="cover" data-player-cover aria-hidden="true">[\s\S]*?<\/div>/,
        () => `<div class="cover" data-player-cover aria-hidden="true">${escapeHtml(featured.cover)}</div>`
      )
      .replace(
        /<h3 class="player-title" data-player-title>[\s\S]*?<\/h3>/,
        () => `<h3 class="player-title" data-player-title>${escapeHtml(featured.title)}</h3>`
      )
      .replace(
        /<div class="player-meta" data-player-meta>[\s\S]*?<\/div>/,
        () => `<div class="player-meta" data-player-meta>${escapeHtml(featured.meta)}</div>`
      )
      .replace(
        /(<button[^>]*data-play-toggle[^>]*aria-label=")Play [^"]*(")/,
        (_, prefix, suffix) => `${prefix}Play ${escapeHtml(featured.title)}${suffix}`
      )
      .replace(/data-peaks="[^"]*"/, () => `data-peaks="${featured.peaks}"`)
      .replace(
        /(<span class="player-time" data-player-time aria-live="off">)0:00 \/ [^<]*(<\/span>)/,
        (_, prefix, suffix) => `${prefix}0:00 / ${escapeHtml(featured.duration)}${suffix}`
      );
    html = html.replace(/<article class="player"[\s\S]*?<\/article>/, () => updatedPlayerHtml);
  }

  const startIdx = html.indexOf(startMarker);
  const endIdx = html.indexOf(endMarker);
  if (
    startIdx === -1 ||
    endIdx === -1 ||
    endIdx <= startIdx ||
    startIdx !== html.lastIndexOf(startMarker) ||
    endIdx !== html.lastIndexOf(endMarker)
  ) {
    throw new Error(`Invalid or duplicate ${startMarker} / ${endMarker} markers in ${htmlPath}`);
  }

  const renderedBlock = `${startMarker}\n${tracks.map(renderReleaseItem).join('\n')}\n        ${endMarker}`;
  html = html.slice(0, startIdx) + renderedBlock + html.slice(endIdx + endMarker.length);

  fs.writeFileSync(htmlPath, html, 'utf8');
}

function syncAudioReleases() {
  const allMp3s = collectMp3Files(AUDIO_DIR);
  const tracks = allMp3s.map(buildTrackMetadata).filter(Boolean).sort(compareTracks);

  const raasTracks = tracks.filter((t) => t.sectionKey === 'mashups' && t.subfolder === 'raas');
  const productionTracks = tracks.filter((t) => !(t.sectionKey === 'mashups' && t.subfolder === 'raas'));

  updateHtmlWithTracks(PRODUCTION_HTML, PROD_START_MARKER, PROD_END_MARKER, productionTracks);
  updateHtmlWithTracks(RAAS_HTML, RAAS_START_MARKER, RAAS_END_MARKER, raasTracks);

  console.log(`Synced ${productionTracks.length} production tracks and ${raasTracks.length} Raas tracks.`);
}

syncAudioReleases();
