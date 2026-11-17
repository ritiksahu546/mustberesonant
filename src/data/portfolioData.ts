export interface WritingPiece {
  id: string;
  index: string;
  title: string;
  hindiSubtitle?: string;
  language: string;
  form: string;
  readingTime: string;
  editorialContext: string;
  manuscriptContent: string;
  isPlaceholder: boolean;
  coverImage: string;
  lastUpdated: string;
}

export interface PerformanceItem {
  id: string;
  title: string;
  eventName: string;
  venue: string;
  platform: 'youtube' | 'instagram';
  embedUrl: string;
  thumbnail: string;
  duration: string;
  description: string;
  isPlaceholder: boolean;
}

export interface LiveEventItem {
  id: string;
  title: string;
  type: 'upcoming' | 'past';
  category: string;
  date: string;
  venue: string;
  city: string;
  ticketInfo: string;
  ticketUrl: string;
  posterCaption: string;
  posterImage: string;
  isPlaceholder: boolean;
}

export interface InstagramSlot {
  id: string;
  caption: string;
  format: 'Reel' | 'Poetry Excerpt' | 'Stage Moment' | 'Echo & Embers';
  postUrl: string;
  thumbnail: string;
  isPlaceholder: boolean;
}

export interface AboutProfileData {
  heading: string;
  introduction: string;
  philosophyTitle: string;
  philosophyBody: string;
  educationAndJourney: {
    id: string;
    period: string;
    title: string;
    description: string;
    isEditablePlaceholder?: boolean;
  }[];
  contactEmailPlaceholder: string;
  contactBackendEndpoint: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  enquiryType: string;
  message: string;
  submittedAt: string;
}

export const GENERATED_IMAGES = {
  heroPortrait: '/src/assets/images/hero_artist_portrait_1794914283705.jpg',
  aboutPortrait: '/src/assets/images/about_editorial_portrait_1794914284900.jpg',
  stagePerformance: '/src/assets/images/performance_stage_spoken_word_1794914287498.jpg',
  echoAndEmbers: '/src/assets/images/echo_and_embers_session_1794914289093.jpg',
  manuscriptStill: '/src/assets/images/literary_manuscript_still_1794914288048.jpg',
};

export const INITIAL_ABOUT_DATA: AboutProfileData = {
  heading: 'A little about the chaos.',
  introduction:
    'Some people write to be heard. Some write because silence has too much to say. Gunjit Bhagwate is a poet, writer and storyteller who explores human emotions, identity, chaos, hope and everything that exists between words.',
  philosophyTitle: 'Main shunya pe sawaar hoon — Riding Upon the Infinite Zero',
  philosophyBody:
    'Under the creative identity MUST BE RESONANT, Gunjit approaches writing not as ornament, but as emotional excavation. Between Hindi and English, between the quiet page and the stage microphone, his work seeks the raw frequency where personal solitude meets collective memory.',
  educationAndJourney: [
    {
      id: 'journey-1',
      period: 'Academic & Formative Roots · [Editable in CMS]',
      title: 'Education & Early Literary Foundation',
      description:
        'Editable biographical slot reserved for Gunjit Bhagwate’s academic background, formative years, and early literary influences. No unverified institutional details are displayed.',
      isEditablePlaceholder: true,
    },
    {
      id: 'journey-2',
      period: 'The Digital & Stage Voice · @mustberesonant',
      title: 'MUST BE RESONANT — Poetry, Prose & Spoken Word',
      description:
        'Crafting original Hindi and English works that confront existential questions, conflict, tenderness, grief, and resilience—anchored by the signature reflection "मैं शून्य पे सवार हूँ।"',
      isEditablePlaceholder: false,
    },
    {
      id: 'journey-3',
      period: 'Community & Cultural Curation',
      title: 'Echo and Embers & Goonj – A Home for Artists',
      description:
        'Founding Echo and Embers to cultivate intimate physical and creative spaces for emerging voices through open mics, poetry circles, storytelling evenings, and Goonj.',
      isEditablePlaceholder: false,
    },
  ],
  contactEmailPlaceholder: '[Official Email Placeholder — Click Studio CMS to Add Email]',
  contactBackendEndpoint: '/api/contact',
};

export const INITIAL_WRITINGS: WritingPiece[] = [
  {
    id: 'bhagwan',
    index: '01',
    title: 'Bhagwan',
    hindiSubtitle: 'भगवान',
    language: 'Hindi / Hindustani Poetry',
    form: 'Philosophical Verse',
    readingTime: '4 min read',
    editorialContext:
      'An intimate reckoning with faith, mortality, and the quiet conversations a human soul holds with the divine in moments of doubt and surrender.',
    manuscriptContent: `[Editable Manuscript Placeholder — "Bhagwan"]\n\nThis reading page is reserved for Gunjit Bhagwate's original poem "Bhagwan".\n\nIn accordance with editorial integrity, no AI-generated verses have been fabricated or attributed to the artist. Use the "Edit Manuscript" button above to paste or compose the official lines of "Bhagwan" in Devanagari or Roman script.`,
    isPlaceholder: true,
    coverImage: GENERATED_IMAGES.manuscriptStill,
    lastUpdated: 'Original Title Archive',
  },
  {
    id: 'tum-yuddh-ko-galat-kehte-ho',
    index: '02',
    title: 'Tum Yuddh Ko Galat Kehte Ho',
    hindiSubtitle: 'तुम युद्ध को ग़लत कहते हो',
    language: 'Hindi Spoken-Word & Poetry',
    form: 'Spoken-Word Piece',
    readingTime: '5 min read',
    editorialContext:
      'A piercing exploration of conflict—both the battles fought across borders and the unnamed wars waged silently within the human conscience.',
    manuscriptContent: `[Editable Manuscript Placeholder — "Tum Yuddh Ko Galat Kehte Ho"]\n\nThis reading page is reserved for Gunjit Bhagwate's original work "Tum Yuddh Ko Galat Kehte Ho".\n\nIn accordance with editorial integrity, no AI-generated verses have been fabricated or attributed to the artist. Click "Edit Manuscript" to supply the authentic text and stanza breaks.`,
    isPlaceholder: true,
    coverImage: GENERATED_IMAGES.heroPortrait,
    lastUpdated: 'Original Title Archive',
  },
  {
    id: 'the-art-of-never-losing-hope',
    index: '03',
    title: 'The Art of Never Losing Hope',
    language: 'English Prose & Reflections',
    form: 'Essay & Poetic Monologue',
    readingTime: '6 min read',
    editorialContext:
      'A meditation on endurance, quiet resilience, and how hope survives not as loud optimism, but as a stubborn ember in the dark.',
    manuscriptContent: `[Editable Manuscript Placeholder — "The Art of Never Losing Hope"]\n\nThis reading page is reserved for Gunjit Bhagwate's original writing "The Art of Never Losing Hope".\n\nIn accordance with editorial integrity, no fabricated text has been attributed to the artist. Click "Edit Manuscript" to insert the official prose or poetry manuscript.`,
    isPlaceholder: true,
    coverImage: GENERATED_IMAGES.aboutPortrait,
    lastUpdated: 'Original Title Archive',
  },
  {
    id: 'ghaanv',
    index: '04',
    title: 'Ghaanv',
    hindiSubtitle: 'घाव',
    language: 'Hindi Poetry',
    form: 'Lyrical Verse',
    readingTime: '3 min read',
    editorialContext:
      'On wounds that time does not erase, but transforms into ink, memory, and the quiet capacity to understand another person’s pain.',
    manuscriptContent: `[Editable Manuscript Placeholder — "Ghaanv"]\n\nThis reading page is reserved for Gunjit Bhagwate's original poem "Ghaanv".\n\nIn accordance with editorial integrity, no fabricated verses have been attributed to the artist. Click "Edit Manuscript" to publish the authentic lines.`,
    isPlaceholder: true,
    coverImage: GENERATED_IMAGES.manuscriptStill,
    lastUpdated: 'Original Title Archive',
  },
  {
    id: 'chaos-and-noise',
    index: '05',
    title: 'Chaos and Noise',
    language: 'English Poetry & Storytelling',
    form: 'Contemporary Monologue',
    readingTime: '5 min read',
    editorialContext:
      'Navigating the overwhelming static of modern existence to uncover the fragile stillness waiting underneath the noise.',
    manuscriptContent: `[Editable Manuscript Placeholder — "Chaos and Noise"]\n\nThis reading page is reserved for Gunjit Bhagwate's original work "Chaos and Noise".\n\nIn accordance with editorial integrity, no fabricated verses have been attributed to the artist. Click "Edit Manuscript" to publish the complete text.`,
    isPlaceholder: true,
    coverImage: GENERATED_IMAGES.stagePerformance,
    lastUpdated: 'Original Title Archive',
  },
];

export const INITIAL_PERFORMANCES: PerformanceItem[] = [
  {
    id: 'perf-1',
    title: 'Tum Yuddh Ko Galat Kehte Ho — Live Spoken Word',
    eventName: '[Editable Event Title — e.g. Goonj Flagship Showcase]',
    venue: '[Editable Venue Name · Supply Actual Link in CMS]',
    platform: 'youtube',
    embedUrl: '',
    thumbnail: GENERATED_IMAGES.heroPortrait,
    duration: 'Spoken Word · YouTube Slot',
    description:
      'Placeholder for full-length YouTube stage performance video. Supply a YouTube URL or video ID via the Performance Editor to enable live playback.',
    isPlaceholder: true,
  },
  {
    id: 'perf-2',
    title: 'Bhagwan — Intimate Stage Recital',
    eventName: '[Editable Event Title — e.g. Echo and Embers Session]',
    venue: '[Editable Venue Name · Supply Actual Link in CMS]',
    platform: 'instagram',
    embedUrl: '',
    thumbnail: GENERATED_IMAGES.stagePerformance,
    duration: 'Reel Performance · Instagram Slot',
    description:
      'Placeholder for Instagram Reel performance embed from @mustberesonant. Paste any Instagram Reel permalink to embed the live reel.',
    isPlaceholder: true,
  },
  {
    id: 'perf-3',
    title: 'The Art of Never Losing Hope — Storytelling Monologue',
    eventName: '[Editable Event Title — e.g. Evening of Stories]',
    venue: '[Editable Venue Name · Supply Actual Link in CMS]',
    platform: 'youtube',
    embedUrl: '',
    thumbnail: GENERATED_IMAGES.echoAndEmbers,
    duration: 'Monologue · YouTube Slot',
    description:
      'Placeholder for recorded storytelling performance. Click "Supply Video Link" to connect an official YouTube or Instagram video URL.',
    isPlaceholder: true,
  },
];

// Never display fake upcoming events or fake ticket links.
export const INITIAL_EVENTS: LiveEventItem[] = [
  {
    id: 'past-event-1',
    title: 'Goonj – A Home for Artists (Archive Slot)',
    type: 'past',
    category: 'Curated Poetry & Storytelling Gathering',
    date: '[Editable Archive Date]',
    venue: '[Editable Venue Slot — Echo and Embers]',
    city: 'India',
    ticketInfo: 'Concluded Community Session',
    ticketUrl: '',
    posterCaption: 'Echo and Embers · Intimate Circle',
    posterImage: GENERATED_IMAGES.echoAndEmbers,
    isPlaceholder: true,
  },
  {
    id: 'past-event-2',
    title: 'Echo and Embers — Open Mic & Spoken Word Night (Archive Slot)',
    type: 'past',
    category: 'Open Mic & Literary Evening',
    date: '[Editable Archive Date]',
    venue: '[Editable Venue Slot]',
    city: 'India',
    ticketInfo: 'Past Showcase Archive',
    ticketUrl: '',
    posterCaption: 'Voices Around the Ember',
    posterImage: GENERATED_IMAGES.stagePerformance,
    isPlaceholder: true,
  },
];

export const INITIAL_INSTAGRAM_SLOTS: InstagramSlot[] = [
  {
    id: 'ig-1',
    caption: '"मैं शून्य पे सवार हूँ।" — Visual poetry & spoken-word reel slot (@mustberesonant)',
    format: 'Reel',
    postUrl: 'https://www.instagram.com/mustberesonant/',
    thumbnail: GENERATED_IMAGES.heroPortrait,
    isPlaceholder: true,
  },
  {
    id: 'ig-2',
    caption: 'Words from the notebook — "Bhagwan" & late-night reflections (@mustberesonant)',
    format: 'Poetry Excerpt',
    postUrl: 'https://www.instagram.com/mustberesonant/',
    thumbnail: GENERATED_IMAGES.manuscriptStill,
    isPlaceholder: true,
  },
  {
    id: 'ig-3',
    caption: 'On stage where silence turns into resonance — Live reel placeholder (@mustberesonant)',
    format: 'Stage Moment',
    postUrl: 'https://www.instagram.com/mustberesonant/',
    thumbnail: GENERATED_IMAGES.stagePerformance,
    isPlaceholder: true,
  },
  {
    id: 'ig-4',
    caption: 'Echo and Embers · Goonj – A Home for Artists community moments (@mustberesonant)',
    format: 'Echo & Embers',
    postUrl: 'https://www.instagram.com/mustberesonant/',
    thumbnail: GENERATED_IMAGES.echoAndEmbers,
    isPlaceholder: true,
  },
];
