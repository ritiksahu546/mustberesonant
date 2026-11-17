import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Play,
  ArrowUpRight,
  ArrowDown,
  Flame,
  Mic,
  Sparkles,
  Calendar,
  Instagram,
  Send,
  SlidersHorizontal,
  Menu,
  X,
  CheckCircle2,
  Eye,
  Edit3,
  Plus,
} from 'lucide-react';
import {
  INITIAL_ABOUT_DATA,
  INITIAL_WRITINGS,
  INITIAL_PERFORMANCES,
  INITIAL_EVENTS,
  INITIAL_INSTAGRAM_SLOTS,
  GENERATED_IMAGES,
  WritingPiece,
  PerformanceItem,
  LiveEventItem,
  AboutProfileData,
  ContactSubmission,
} from './data/portfolioData';
import { SafeImage } from './components/SafeImage';
import { ReadingView } from './components/ReadingView';
import { PerformanceModal } from './components/PerformanceModal';
import { StudioCMSModal } from './components/StudioCMSModal';
import { LightboxModal, LightboxImageItem } from './components/LightboxModal';

type SectionId =
  | 'home'
  | 'about'
  | 'writings'
  | 'performances'
  | 'echo-and-embers'
  | 'events'
  | 'contact';

const STORAGE_KEYS = {
  writings: 'gb_portfolio_writings_v1',
  performances: 'gb_portfolio_performances_v1',
  events: 'gb_portfolio_events_v1',
  about: 'gb_portfolio_about_v1',
  submissions: 'gb_portfolio_submissions_v1',
};

export default function App() {
  // Persistent CMS State
  const [writings, setWritings] = useState<WritingPiece[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.writings);
      return saved ? JSON.parse(saved) : INITIAL_WRITINGS;
    } catch {
      return INITIAL_WRITINGS;
    }
  });

  const [performances, setPerformances] = useState<PerformanceItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.performances);
      return saved ? JSON.parse(saved) : INITIAL_PERFORMANCES;
    } catch {
      return INITIAL_PERFORMANCES;
    }
  });

  const [events, setEvents] = useState<LiveEventItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.events);
      return saved ? JSON.parse(saved) : INITIAL_EVENTS;
    } catch {
      return INITIAL_EVENTS;
    }
  });

  const [aboutData, setAboutData] = useState<AboutProfileData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.about);
      return saved ? JSON.parse(saved) : INITIAL_ABOUT_DATA;
    } catch {
      return INITIAL_ABOUT_DATA;
    }
  });

  const [submissions, setSubmissions] = useState<ContactSubmission[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.submissions);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.writings, JSON.stringify(writings));
    } catch {
      // ignore storage errors
    }
  }, [writings]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.performances,
        JSON.stringify(performances)
      );
    } catch {
      // ignore
    }
  }, [performances]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.events, JSON.stringify(events));
    } catch {
      // ignore
    }
  }, [events]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.about, JSON.stringify(aboutData));
    } catch {
      // ignore
    }
  }, [aboutData]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.submissions,
        JSON.stringify(submissions)
      );
    } catch {
      // ignore
    }
  }, [submissions]);

  // Navigation & View States
  const [activeSection, setActiveSection] = useState<SectionId>('home');
  const [pageViewMode, setPageViewMode] = useState<'monograph' | SectionId>(
    'monograph'
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Interactive Filters & Modals
  const [writingFilter, setWritingFilter] = useState<'all' | 'hindi' | 'english'>(
    'all'
  );
  const [eventFilter, setEventFilter] = useState<'upcoming' | 'past' | 'all'>(
    'upcoming'
  );
  const [activeReadingPiece, setActiveReadingPiece] =
    useState<WritingPiece | null>(null);
  const [activePerformance, setActivePerformance] =
    useState<PerformanceItem | null>(null);
  const [lightboxItem, setLightboxItem] = useState<LightboxImageItem | null>(
    null
  );
  const [cmsState, setCmsState] = useState<{
    open: boolean;
    tab: 'writings' | 'events' | 'performances' | 'settings' | 'inbox';
  }>({ open: false, tab: 'writings' });

  // Echo & Embers Spotlight Drawer state
  const [echoModalOpen, setEchoModalOpen] = useState(false);

  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactEnquiry, setContactEnquiry] = useState(
    'Spoken-Word Performance / Show Booking'
  );
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactStatus, setContactStatus] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Navigate to section smoothly
  const navigateToSection = (section: SectionId) => {
    setActiveSection(section);
    setMobileMenuOpen(false);
    if (pageViewMode !== 'monograph' && section !== 'home') {
      setPageViewMode(section);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (pageViewMode !== 'monograph' && section === 'home') {
      setPageViewMode('monograph');
    }
    setTimeout(() => {
      const el = document.getElementById(section);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 40);
  };

  // CMS Update Handlers
  const handleUpdateWriting = (id: string, updated: Partial<WritingPiece>) => {
    setWritings((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...updated } : w))
    );
    if (activeReadingPiece && activeReadingPiece.id === id) {
      setActiveReadingPiece((prev) => (prev ? { ...prev, ...updated } : null));
    }
  };

  const handleAddWriting = (newPiece: WritingPiece) => {
    setWritings((prev) => [...prev, newPiece]);
  };

  const handleUpdatePerformance = (
    id: string,
    updated: Partial<PerformanceItem>
  ) => {
    setPerformances((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
    );
    if (activePerformance && activePerformance.id === id) {
      setActivePerformance((prev) => (prev ? { ...prev, ...updated } : null));
    }
  };

  const handleAddEvent = (newEvent: LiveEventItem) => {
    setEvents((prev) => [newEvent, ...prev]);
    setEventFilter(newEvent.type);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const handleUpdateAboutData = (updated: Partial<AboutProfileData>) => {
    setAboutData((prev) => ({ ...prev, ...updated }));
  };

  const handleResetDefaults = () => {
    setWritings(INITIAL_WRITINGS);
    setPerformances(INITIAL_PERFORMANCES);
    setEvents(INITIAL_EVENTS);
    setAboutData(INITIAL_ABOUT_DATA);
  };

  // Handle Contact Form Submission with Configurable Backend
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      setContactStatus({
        type: 'error',
        text: 'Please complete your name, email address, and message.',
      });
      return;
    }

    setContactSubmitting(true);
    setContactStatus(null);

    const payload = {
      name: contactName.trim(),
      email: contactEmail.trim(),
      enquiryType: contactEnquiry,
      message: contactMessage.trim(),
    };

    try {
      const endpoint = aboutData.contactBackendEndpoint || '/api/contact';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const newRecord: ContactSubmission = {
        id: `local-${Date.now()}`,
        ...payload,
        submittedAt: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
      };

      setSubmissions((prev) => [newRecord, ...prev]);

      if (response.ok) {
        setContactStatus({
          type: 'success',
          text: 'Your message has been delivered. Thank you for reaching out to Gunjit Bhagwate.',
        });
      } else {
        setContactStatus({
          type: 'success',
          text: 'Your enquiry has been recorded in the Studio Inbox. Thank you for reaching out.',
        });
      }

      setContactName('');
      setContactEmail('');
      setContactMessage('');
    } catch {
      const fallbackRecord: ContactSubmission = {
        id: `local-${Date.now()}`,
        ...payload,
        submittedAt: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
      };
      setSubmissions((prev) => [fallbackRecord, ...prev]);
      setContactStatus({
        type: 'success',
        text: 'Your enquiry has been saved to the Studio Inbox. We will connect with you soon.',
      });
      setContactName('');
      setContactEmail('');
      setContactMessage('');
    } finally {
      setContactSubmitting(false);
    }
  };

  // Filtered Writings
  const filteredWritings = writings.filter((w) => {
    if (writingFilter === 'all') return true;
    if (writingFilter === 'hindi')
      return w.language.toLowerCase().includes('hindi');
    return w.language.toLowerCase().includes('english');
  });

  // Filtered Events
  const upcomingEventsCount = events.filter((e) => e.type === 'upcoming').length;
  const pastEventsCount = events.filter((e) => e.type === 'past').length;
  const filteredEvents = events.filter((e) => {
    if (eventFilter === 'all') return true;
    return e.type === eventFilter;
  });

  // Editorial Photography Items for About Section
  const aboutPhotos: LightboxImageItem[] = [
    {
      src: GENERATED_IMAGES.aboutPortrait,
      title: 'Between Words and Silence',
      caption:
        'Late-evening writing session—exploring identity, human emotion, and the quiet architecture of verse.',
      credit: 'Editorial Portrait · MUST BE RESONANT',
    },
    {
      src: GENERATED_IMAGES.manuscriptStill,
      title: 'Ink & Ember Notebooks',
      caption:
        'Working drafts and handwritten verses in Hindi and English before they reach the stage.',
      credit: 'Studio Archive · Gunjit Bhagwate',
    },
    {
      src: GENERATED_IMAGES.heroPortrait,
      title: 'Under the Stage Spotlight',
      caption:
        'Spoken-word performance where written solitude transforms into shared resonance.',
      credit: 'Stage Documentary · Live Archive',
    },
  ];

  // Helper to check if a section should render based on view mode
  const shouldShowSection = (section: SectionId) => {
    if (pageViewMode === 'monograph') return true;
    return pageViewMode === section;
  };

  return (
    <div className="min-h-screen bg-[#0B0A09] text-[#F4EFE6] relative selection:bg-[#D97736]/30 selection:text-[#F4EFE6]">
      {/* Subtle Film Grain Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-30 bg-film-grain"
        aria-hidden="true"
      />

      {/* TOP BAR CONTRACT: Strictly 1 row, 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-40 bg-[#0B0A09]/85 backdrop-blur-md border-b border-[#F4EFE6]/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-4">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              setPageViewMode('monograph');
              navigateToSection('home');
            }}
            className="font-serif text-xl sm:text-2xl tracking-[0.14em] text-[#F4EFE6] hover:text-[#D97736] transition-colors whitespace-nowrap shrink-0"
          >
            GUNJIT BHAGWATE
          </a>

          {/* Zone 2: Concise single-line navigation links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center gap-7 text-sm text-[#A39B8B]"
          >
            {(
              [
                { id: 'home', label: 'Home' },
                { id: 'about', label: 'About' },
                { id: 'writings', label: 'Writings' },
                { id: 'performances', label: 'Performances' },
                { id: 'echo-and-embers', label: 'Echo and Embers' },
                { id: 'events', label: 'Events' },
              ] as { id: SectionId; label: string }[]
            ).map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigateToSection(item.id);
                }}
                className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b ${
                  activeSection === item.id
                    ? 'text-[#F4EFE6] border-[#D97736]'
                    : 'border-transparent hover:text-[#F4EFE6] hover:border-[#F4EFE6]/40'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                navigateToSection('contact');
              }}
              className="px-4 py-2 text-xs font-medium bg-[#D97736] text-[#0B0A09] rounded-lg hover:bg-[#e58645] transition-colors whitespace-nowrap shrink-0"
            >
              Contact
            </a>

            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="lg:hidden p-2 text-[#F4EFE6] hover:text-[#D97736] transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.16 }}
              className="lg:hidden bg-[#12100E] border-b border-[#F4EFE6]/10 px-6 py-5"
            >
              <nav className="flex flex-col space-y-3 text-sm">
                {(
                  [
                    { id: 'home', label: '01. Home' },
                    { id: 'about', label: '02. About' },
                    { id: 'writings', label: '03. Writings' },
                    { id: 'performances', label: '04. Performances' },
                    { id: 'echo-and-embers', label: '05. Echo and Embers' },
                    { id: 'events', label: '06. Events' },
                    { id: 'contact', label: '07. Contact' },
                  ] as { id: SectionId; label: string }[]
                ).map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigateToSection(item.id);
                    }}
                    className={`py-1.5 transition-colors ${
                      activeSection === item.id
                        ? 'text-[#D97736] font-medium'
                        : 'text-[#F4EFE6]/80 hover:text-[#F4EFE6]'
                    }`}
                  >
                    {item.label}
                  </a>
                ))}

                <div className="pt-3 border-t border-[#F4EFE6]/10 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setCmsState({ open: true, tab: 'writings' });
                    }}
                    className="inline-flex items-center gap-2 text-xs text-[#D97736] font-medium cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Open Studio CMS (Edit Content)</span>
                  </button>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Editorial Sub-Toolbar: Chapter View Switcher & Studio CMS Trigger */}
      <div className="bg-[#12100E]/90 border-b border-[#F4EFE6]/8 px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs text-[#A39B8B]">
          <div className="flex items-center gap-2 overflow-x-auto">
            <span>Reading Format:</span>
            <button
              onClick={() => setPageViewMode('monograph')}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                pageViewMode === 'monograph'
                  ? 'bg-[#F4EFE6]/10 text-[#F4EFE6] font-medium'
                  : 'hover:text-[#F4EFE6]'
              }`}
            >
              Full Literary Issue
            </button>
            <span aria-hidden="true">·</span>
            {(
              [
                { id: 'about', label: 'About' },
                { id: 'writings', label: 'Writings' },
                { id: 'performances', label: 'Performances' },
                { id: 'echo-and-embers', label: 'Echo & Embers' },
                { id: 'events', label: 'Events' },
                { id: 'contact', label: 'Contact' },
              ] as { id: SectionId; label: string }[]
            ).map((chapter) => (
              <button
                key={chapter.id}
                onClick={() => {
                  setPageViewMode(chapter.id);
                  setActiveSection(chapter.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  pageViewMode === chapter.id
                    ? 'bg-[#D97736] text-[#0B0A09] font-medium'
                    : 'hover:text-[#F4EFE6]'
                }`}
              >
                {chapter.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCmsState({ open: true, tab: 'writings' })}
            className="inline-flex items-center gap-1.5 text-xs text-[#D97736] hover:text-[#e58645] transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Artist CMS · Edit Writings, Events & Links</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main>
        {/* 1. HOMEPAGE HERO SECTION */}
        {shouldShowSection('home') && (
          <section
            id="home"
            className="relative min-h-[90vh] flex items-center overflow-hidden border-b border-[#F4EFE6]/10"
          >
            {/* Full-screen Atmospheric Artist Portrait Background */}
            <div className="absolute inset-0 z-0">
              <SafeImage
                src={GENERATED_IMAGES.heroPortrait}
                alt="Gunjit Bhagwate performing spoken word on a dimly lit stage"
                className="w-full h-full object-cover object-center scale-[1.01]"
              />
              {/* Measured Scrim Overlays for WCAG Contrast */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0B0A09] via-[#0B0A09]/80 to-[#0B0A09]/35" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0A09] via-[#0B0A09]/35 to-[#0B0A09]/60" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto w-full px-6 py-24 md:py-32">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-3xl space-y-8"
              >
                {/* Clean Unboxed Brand Identity Metadata */}
                <div className="flex flex-wrap items-center gap-2.5 text-xs tracking-[0.2em] text-[#D97736]">
                  <span>MUST BE RESONANT</span>
                  <span aria-hidden="true" className="text-[#A39B8B]">
                    ·
                  </span>
                  <span className="text-[#F4EFE6]/80">
                    Artist | Writer | Poet
                  </span>
                  <span aria-hidden="true" className="text-[#A39B8B]">
                    ·
                  </span>
                  <a
                    href="https://www.instagram.com/mustberesonant/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#A39B8B] hover:text-[#F4EFE6] transition-colors"
                  >
                    @mustberesonant
                  </a>
                </div>

                {/* Main Heading */}
                <div className="space-y-4">
                  <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-normal tracking-[0.04em] text-[#F4EFE6] leading-[1.02]">
                    GUNJIT BHAGWATE
                  </h1>
                  <p className="font-serif text-2xl sm:text-3xl text-[#F4EFE6]/90 italic font-normal max-w-2xl">
                    Poet. Writer. Storyteller. An echo that refuses to fade.
                  </p>
                </div>

                {/* Prominent Hindi Tagline */}
                <div className="py-5 border-y border-[#F4EFE6]/15 max-w-xl space-y-1.5">
                  <p
                    lang="hi"
                    className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#D97736] tracking-wide leading-snug"
                  >
                    &ldquo;मैं शून्य पे सवार हूँ।&rdquo;
                  </p>
                  <p className="text-xs tracking-[0.16em] text-[#A39B8B] uppercase">
                    Main shunya pe sawaar hoon
                  </p>
                </div>

                {/* Two CTA Buttons */}
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    onClick={() => navigateToSection('writings')}
                    className="inline-flex items-center gap-2.5 px-7 py-3.5 text-sm font-medium bg-[#D97736] text-[#0B0A09] rounded-lg hover:bg-[#e58645] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Explore My Words</span>
                  </button>

                  <button
                    onClick={() => navigateToSection('performances')}
                    className="inline-flex items-center gap-2.5 px-7 py-3.5 text-sm font-medium bg-[#12100E]/85 text-[#F4EFE6] border border-[#F4EFE6]/25 rounded-lg hover:border-[#D97736] hover:text-[#D97736] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Play className="w-4 h-4 text-[#D97736]" />
                    <span>Watch My Performances</span>
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Subtle Scroll Indicator */}
            <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 hidden sm:flex flex-col items-center gap-2">
              <button
                onClick={() => navigateToSection('about')}
                className="flex flex-col items-center gap-1.5 text-xs tracking-[0.2em] text-[#A39B8B] hover:text-[#F4EFE6] transition-colors cursor-pointer"
                aria-label="Scroll to About section"
              >
                <span>SCROLL</span>
                <ArrowDown className="w-3.5 h-3.5 text-[#D97736] animate-bounce" />
              </button>
            </div>
          </section>
        )}

        {/* 2. ABOUT SECTION */}
        {shouldShowSection('about') && (
          <section
            id="about"
            className="py-24 md:py-32 px-6 border-b border-[#F4EFE6]/10"
          >
            <div className="max-w-7xl mx-auto space-y-20">
              {/* Top Split: Artist Introduction & Editorial Portrait */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
                <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 text-xs text-[#A39B8B]">
                      <span className="font-mono text-[#D97736]">01</span>
                      <span aria-hidden="true">·</span>
                      <span>Artist Monograph & Philosophy</span>
                    </div>

                    <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-[#F4EFE6] leading-[1.08]">
                      {aboutData.heading}
                    </h2>

                    <p className="font-serif text-2xl sm:text-3xl text-[#F4EFE6]/90 leading-relaxed">
                      &ldquo;{aboutData.introduction}&rdquo;
                    </p>
                  </div>

                  {/* Creative Philosophy Block */}
                  <div className="p-7 sm:p-8 rounded-2xl bg-[#12100E] border border-[#F4EFE6]/10 space-y-4">
                    <div className="text-xs text-[#D97736] tracking-wider">
                      CREATIVE PHILOSOPHY · MUST BE RESONANT
                    </div>
                    <h3 className="font-serif text-2xl sm:text-3xl text-[#F4EFE6]">
                      {aboutData.philosophyTitle}
                    </h3>
                    <p className="text-sm sm:text-base text-[#A39B8B] leading-relaxed">
                      {aboutData.philosophyBody}
                    </p>
                  </div>
                </div>

                {/* Right Column Portrait */}
                <div className="lg:col-span-5 flex flex-col">
                  <div
                    onClick={() => setLightboxItem(aboutPhotos[0])}
                    className="group relative flex-1 min-h-[420px] rounded-2xl overflow-hidden border border-[#F4EFE6]/15 cursor-pointer"
                  >
                    <SafeImage
                      src={GENERATED_IMAGES.aboutPortrait}
                      alt="Gunjit Bhagwate writing by a window at dusk"
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0A09]/90 via-transparent to-transparent" />
                    <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                      <div>
                        <p className="font-serif text-xl text-[#F4EFE6]">
                          Silence Has Too Much To Say
                        </p>
                        <p className="text-xs text-[#A39B8B]">
                          Artist Portrait · Click to view full plate
                        </p>
                      </div>
                      <span className="p-2 rounded-lg bg-[#0B0A09]/80 border border-[#F4EFE6]/20 text-[#D97736]">
                        <Eye className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Education & Creative Journey */}
              <div className="pt-8 border-t border-[#F4EFE6]/10 space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <p className="text-xs text-[#A39B8B] mb-2">
                      Chronicle · Authentic Biography Structure
                    </p>
                    <h3 className="font-serif text-3xl sm:text-4xl text-[#F4EFE6]">
                      Education & Creative Journey
                    </h3>
                  </div>
                  <button
                    onClick={() => setCmsState({ open: true, tab: 'settings' })}
                    className="inline-flex items-center gap-1.5 text-xs text-[#D97736] hover:underline cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Customize Bio Details in CMS</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {aboutData.educationAndJourney.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-6 rounded-2xl bg-[#12100E] border border-[#F4EFE6]/10 flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="text-xs text-[#A39B8B] flex items-center gap-2">
                          <span className="font-mono text-[#D97736]">
                            0{idx + 1}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{item.period}</span>
                        </div>
                        <h4 className="font-serif text-2xl text-[#F4EFE6]">
                          {item.title}
                        </h4>
                        <p className="text-sm text-[#A39B8B] leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Editorial Photography Gallery */}
              <div className="pt-8 border-t border-[#F4EFE6]/10 space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <p className="text-xs text-[#A39B8B] mb-2">
                      Visual Monograph · Film & Stage Plates
                    </p>
                    <h3 className="font-serif text-3xl sm:text-4xl text-[#F4EFE6]">
                      Editorial Photography
                    </h3>
                  </div>
                  <span className="text-xs text-[#A39B8B]">
                    Click any photograph to open fullscreen lightbox
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {aboutPhotos.map((photo, index) => (
                    <button
                      key={index}
                      onClick={() => setLightboxItem(photo)}
                      className="group text-left rounded-2xl overflow-hidden bg-[#12100E] border border-[#F4EFE6]/10 hover:border-[#D97736]/50 transition-colors cursor-pointer"
                    >
                      <div className="aspect-[4/3] overflow-hidden">
                        <SafeImage
                          src={photo.src}
                          alt={photo.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-5 space-y-1.5">
                        <p className="text-xs text-[#A39B8B]">{photo.credit}</p>
                        <h4 className="font-serif text-xl text-[#F4EFE6] group-hover:text-[#D97736] transition-colors">
                          {photo.title}
                        </h4>
                        <p className="text-xs text-[#A39B8B] line-clamp-2 leading-relaxed">
                          {photo.caption}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 3. POETRY & WRITING SECTION */}
        {shouldShowSection('writings') && (
          <section
            id="writings"
            className="py-24 md:py-32 px-6 bg-[#0E0C0A] border-b border-[#F4EFE6]/10"
          >
            <div className="max-w-7xl mx-auto space-y-14">
              {/* Section Header & Interactive Filter Controls */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#F4EFE6]/10">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-[#A39B8B]">
                    <span className="font-mono text-[#D97736]">02</span>
                    <span aria-hidden="true">·</span>
                    <span>Poetry, Prose & Literary Archive</span>
                  </div>
                  <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-[#F4EFE6]">
                    Words that stay.
                  </h2>
                  <p className="text-sm sm:text-base text-[#A39B8B] max-w-xl">
                    Select any title below to enter the distraction-free reading room with reading progress indicator and editable manuscript support.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Functional Filter Buttons */}
                  <div
                    className="flex items-center gap-1 p-1 bg-[#161311] border border-[#F4EFE6]/10 rounded-lg"
                    role="group"
                    aria-label="Filter writings by language"
                  >
                    {(
                      [
                        { id: 'all', label: 'All Works' },
                        { id: 'hindi', label: 'Hindi' },
                        { id: 'english', label: 'English' },
                      ] as const
                    ).map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setWritingFilter(tab.id)}
                        className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                          writingFilter === tab.id
                            ? 'bg-[#D97736] text-[#0B0A09]'
                            : 'text-[#A39B8B] hover:text-[#F4EFE6]'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCmsState({ open: true, tab: 'writings' })}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border border-[#D97736]/40 text-[#D97736] hover:bg-[#D97736]/10 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Manage Manuscripts</span>
                  </button>
                </div>
              </div>

              {/* Literary Index List */}
              <div className="divide-y divide-[#F4EFE6]/10">
                {filteredWritings.map((piece) => (
                  <article
                    key={piece.id}
                    onClick={() => setActiveReadingPiece(piece)}
                    className="group py-8 sm:py-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 cursor-pointer hover:bg-[#14110F]/60 px-4 -mx-4 rounded-xl transition-colors"
                  >
                    <div className="space-y-3 max-w-3xl">
                      {/* Clean Unboxed Metadata */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#A39B8B]">
                        <span className="font-mono text-[#D97736] tabular-nums">
                          {piece.index}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{piece.language}</span>
                        <span aria-hidden="true">·</span>
                        <span>{piece.form}</span>
                        <span aria-hidden="true">·</span>
                        <span>{piece.readingTime}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-[#D97736]/90">
                          {piece.isPlaceholder
                            ? 'Editable Manuscript Slot'
                            : 'Published Text'}
                        </span>
                      </div>

                      {/* Title */}
                      <div className="flex flex-wrap items-baseline gap-4">
                        <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#F4EFE6] group-hover:text-[#D97736] transition-colors">
                          {piece.title}
                        </h3>
                        {piece.hindiSubtitle && (
                          <span className="font-serif text-xl sm:text-2xl text-[#A39B8B]">
                            {piece.hindiSubtitle}
                          </span>
                        )}
                      </div>

                      <p className="text-sm sm:text-base text-[#A39B8B] leading-relaxed">
                        {piece.editorialContext}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <span className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium rounded-lg border border-[#F4EFE6]/20 text-[#F4EFE6] group-hover:bg-[#D97736] group-hover:text-[#0B0A09] group-hover:border-[#D97736] transition-colors whitespace-nowrap shrink-0">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Read Piece</span>
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 4. PERFORMANCES SECTION */}
        {shouldShowSection('performances') && (
          <section
            id="performances"
            className="py-24 md:py-32 px-6 border-b border-[#F4EFE6]/10"
          >
            <div className="max-w-7xl mx-auto space-y-14">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-[#A39B8B]">
                    <span className="font-mono text-[#D97736]">03</span>
                    <span aria-hidden="true">·</span>
                    <span>Spoken-Word Stage & Reel Screening Room</span>
                  </div>
                  <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-[#F4EFE6]">
                    Not just words. An experience.
                  </h2>
                  <p className="text-sm sm:text-base text-[#A39B8B] max-w-2xl">
                    Spoken-word recitals, live stage recordings, and intimate reels. Supports direct YouTube and Instagram Reel embedding via the Studio CMS.
                  </p>
                </div>

                <button
                  onClick={() =>
                    setCmsState({ open: true, tab: 'performances' })
                  }
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium rounded-lg border border-[#D97736]/40 text-[#D97736] hover:bg-[#D97736]/10 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Supply YouTube / Reel Links</span>
                </button>
              </div>

              {/* Video Gallery Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {performances.map((perf) => (
                  <div
                    key={perf.id}
                    className="group rounded-2xl overflow-hidden bg-[#12100E] border border-[#F4EFE6]/10 flex flex-col justify-between"
                  >
                    <div>
                      {/* Thumbnail Container */}
                      <div
                        onClick={() => setActivePerformance(perf)}
                        className="relative aspect-video overflow-hidden bg-[#070605] cursor-pointer"
                      >
                        <SafeImage
                          src={perf.thumbnail}
                          alt={perf.title}
                          className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#12100E] via-[#0B0A09]/40 to-transparent" />

                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-14 h-14 rounded-full bg-[#0B0A09]/80 border border-[#D97736] flex items-center justify-center group-hover:scale-110 group-hover:bg-[#D97736] transition-all">
                            <Play className="w-5 h-5 text-[#D97736] group-hover:text-[#0B0A09] translate-x-0.5" />
                          </div>
                        </div>

                        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-[#F4EFE6]/85">
                          <span>{perf.duration}</span>
                          <span>
                            {perf.embedUrl
                              ? 'Live Video Ready'
                              : 'Video Link Placeholder'}
                          </span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-6 space-y-3">
                        {/* Unboxed Event & Venue Metadata */}
                        <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#A39B8B]">
                          <span>{perf.eventName}</span>
                          <span aria-hidden="true">·</span>
                          <span>{perf.venue}</span>
                        </div>

                        <h3 className="font-serif text-2xl text-[#F4EFE6] group-hover:text-[#D97736] transition-colors">
                          {perf.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-[#A39B8B] leading-relaxed">
                          {perf.description}
                        </p>
                      </div>
                    </div>

                    <div className="px-6 pb-6 pt-2 flex items-center justify-between gap-3">
                      <button
                        onClick={() => setActivePerformance(perf)}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium rounded-lg bg-[#F4EFE6]/10 text-[#F4EFE6] hover:bg-[#D97736] hover:text-[#0B0A09] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Watch Performance</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 5. ECHO AND EMBERS SECTION */}
        {shouldShowSection('echo-and-embers') && (
          <section
            id="echo-and-embers"
            className="py-24 md:py-32 px-6 bg-[#100D0B] border-b border-[#F4EFE6]/10"
          >
            <div className="max-w-7xl mx-auto space-y-16">
              {/* Top Split: Community Introduction & Visual */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
                <div className="lg:col-span-6 flex flex-col justify-between space-y-8">
                  <div className="space-y-5">
                    <div className="flex items-center gap-2 text-xs text-[#D97736]">
                      <Flame className="w-4 h-4" />
                      <span>CREATIVE VENTURE BY GUNJIT BHAGWATE</span>
                    </div>

                    <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-[#F4EFE6] leading-[1.08]">
                      Where voices find a home.
                    </h2>

                    <p className="font-serif text-2xl text-[#D97736] italic">
                      Echo and Embers — A sanctuary for raw stories, unspoken verse, and collective listening.
                    </p>

                    <p className="text-sm sm:text-base text-[#A39B8B] leading-relaxed">
                      Founded by Gunjit Bhagwate, <strong className="text-[#F4EFE6] font-medium">Echo and Embers</strong> is an independent creative venture born from a simple belief: every honest voice deserves a room that truly listens. Away from algorithms and stage fright, it brings writers, poets, musicians, and listeners together around warm light and unfiltered human stories.
                    </p>
                  </div>

                  {/* Flagship Initiative Spotlight: Goonj – A Home for Artists */}
                  <div className="p-7 rounded-2xl bg-[#16120F] border border-[#D97736]/30 space-y-3">
                    <div className="text-xs text-[#D97736] tracking-wider uppercase">
                      Flagship Initiative
                    </div>
                    <h3 className="font-serif text-3xl text-[#F4EFE6]">
                      Goonj – A Home for Artists
                    </h3>
                    <p className="text-sm text-[#A39B8B] leading-relaxed">
                      An intimate flagship gathering curated under Echo and Embers—where established voices and first-time performers share the same circle, celebrating Hindi and English poetry, acoustic storytelling, and lasting artistic kinship.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      onClick={() => setEchoModalOpen(true)}
                      className="inline-flex items-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-medium rounded-lg bg-[#D97736] text-[#0B0A09] hover:bg-[#e58645] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <span>Explore Echo and Embers</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        setContactEnquiry('Echo and Embers Community / Open Mic');
                        navigateToSection('contact');
                      }}
                      className="inline-flex items-center gap-2 px-5 py-3.5 text-xs sm:text-sm font-medium rounded-lg border border-[#F4EFE6]/20 text-[#F4EFE6] hover:border-[#D97736] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <span>Collaborate With Us</span>
                    </button>
                  </div>
                </div>

                {/* Right Column: Community Photography */}
                <div className="lg:col-span-6 flex flex-col gap-6">
                  <div
                    onClick={() =>
                      setLightboxItem({
                        src: GENERATED_IMAGES.echoAndEmbers,
                        title: 'Echo and Embers · Intimate Circle',
                        caption:
                          'Poets, storytellers, and listeners gathered for an evening of spoken word and shared warmth.',
                        credit: 'Echo and Embers Community Archive',
                      })
                    }
                    className="group relative flex-1 min-h-[340px] rounded-2xl overflow-hidden border border-[#F4EFE6]/15 cursor-pointer"
                  >
                    <SafeImage
                      src={GENERATED_IMAGES.echoAndEmbers}
                      alt="Echo and Embers intimate poetry and storytelling gathering"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0A09] via-transparent to-transparent" />
                    <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                      <div>
                        <p className="text-xs text-[#D97736]">
                          Goonj – A Home for Artists
                        </p>
                        <p className="font-serif text-2xl text-[#F4EFE6]">
                          Intimate Storytelling & Poetry Circle
                        </p>
                      </div>
                      <span className="p-2 rounded-lg bg-[#0B0A09]/80 border border-[#F4EFE6]/20 text-[#D97736]">
                        <Eye className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Four Pillars of Echo and Embers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
                {[
                  {
                    icon: Mic,
                    title: 'Open Mic Events',
                    meta: 'Emerging & Seasoned Voices',
                    desc: 'Welcoming stages designed for honest expression where first-timers and veteran performers share their newest work.',
                  },
                  {
                    icon: BookOpen,
                    title: 'Poetry Sessions',
                    meta: 'Baithaks & Reading Circles',
                    desc: 'Curated thematic readings and craft discussions celebrating Hindustani, Hindi, and contemporary English verse.',
                  },
                  {
                    icon: Sparkles,
                    title: 'Storytelling Events',
                    meta: 'Long-Form Personal Narrative',
                    desc: 'Candlelit evenings dedicated to the ancient art of oral storytelling, memory, and lived human experience.',
                  },
                  {
                    icon: Flame,
                    title: 'Goonj – A Home for Artists',
                    meta: 'Flagship Cultural Gathering',
                    desc: 'A multi-disciplinary sanctuary uniting spoken word, literature, and intimate community connection.',
                  },
                ].map((pillar, i) => {
                  const IconComp = pillar.icon;
                  return (
                    <div
                      key={i}
                      className="p-6 rounded-2xl bg-[#14110E] border border-[#F4EFE6]/10 space-y-3"
                    >
                      <div className="flex items-center justify-between text-xs text-[#A39B8B]">
                        <span>{pillar.meta}</span>
                        <IconComp className="w-4 h-4 text-[#D97736]" />
                      </div>
                      <h3 className="font-serif text-2xl text-[#F4EFE6]">
                        {pillar.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#A39B8B] leading-relaxed">
                        {pillar.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* 6. EVENTS & SHOWS SECTION */}
        {shouldShowSection('events') && (
          <section
            id="events"
            className="py-24 md:py-32 px-6 border-b border-[#F4EFE6]/10"
          >
            <div className="max-w-7xl mx-auto space-y-14">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#F4EFE6]/10">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-[#A39B8B]">
                    <span className="font-mono text-[#D97736]">05</span>
                    <span aria-hidden="true">·</span>
                    <span>Live Dates, Gatherings & Show Archive</span>
                  </div>
                  <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-[#F4EFE6]">
                    Events & Shows
                  </h2>
                  <p className="text-sm sm:text-base text-[#A39B8B] max-w-xl">
                    Official live performance dates and past archives. Only verified schedules and authentic ticket links are published here.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div
                    className="flex items-center gap-1 p-1 bg-[#161311] border border-[#F4EFE6]/10 rounded-lg"
                    role="group"
                    aria-label="Filter events"
                  >
                    <button
                      onClick={() => setEventFilter('upcoming')}
                      className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        eventFilter === 'upcoming'
                          ? 'bg-[#D97736] text-[#0B0A09]'
                          : 'text-[#A39B8B] hover:text-[#F4EFE6]'
                      }`}
                    >
                      Upcoming ({upcomingEventsCount})
                    </button>
                    <button
                      onClick={() => setEventFilter('past')}
                      className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        eventFilter === 'past'
                          ? 'bg-[#D97736] text-[#0B0A09]'
                          : 'text-[#A39B8B] hover:text-[#F4EFE6]'
                      }`}
                    >
                      Past Shows ({pastEventsCount})
                    </button>
                    <button
                      onClick={() => setEventFilter('all')}
                      className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        eventFilter === 'all'
                          ? 'bg-[#D97736] text-[#0B0A09]'
                          : 'text-[#A39B8B] hover:text-[#F4EFE6]'
                      }`}
                    >
                      All
                    </button>
                  </div>

                  <button
                    onClick={() => setCmsState({ open: true, tab: 'events' })}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg border border-[#D97736]/40 text-[#D97736] hover:bg-[#D97736]/10 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add / Manage Events</span>
                  </button>
                </div>
              </div>

              {/* Events List or Authentic Empty State */}
              {filteredEvents.length === 0 ? (
                <div className="p-10 sm:p-14 rounded-2xl bg-[#12100E] border border-[#F4EFE6]/10 text-center max-w-3xl mx-auto space-y-5">
                  <Calendar className="w-8 h-8 text-[#D97736] mx-auto stroke-[1.5]" />
                  <h3 className="font-serif text-3xl text-[#F4EFE6]">
                    No Upcoming Public Dates Announced Yet
                  </h3>
                  <p className="text-sm text-[#A39B8B] leading-relaxed max-w-xl mx-auto">
                    In keeping with complete authenticity, no placeholder or unconfirmed upcoming tour dates are displayed. New spoken-word shows and <strong className="text-[#F4EFE6]">Echo and Embers</strong> sessions appear here as soon as bookings are finalized.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => setCmsState({ open: true, tab: 'events' })}
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium rounded-lg bg-[#D97736] text-[#0B0A09] hover:bg-[#e58645] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Publish Confirmed Show (CMS)</span>
                    </button>
                    <button
                      onClick={() => setEventFilter('past')}
                      className="px-5 py-2.5 text-xs font-medium rounded-lg border border-[#F4EFE6]/20 text-[#F4EFE6] hover:border-[#D97736] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      View Past Show Archive ({pastEventsCount})
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filteredEvents.map((ev) => (
                    <div
                      key={ev.id}
                      className="rounded-2xl overflow-hidden bg-[#12100E] border border-[#F4EFE6]/10 grid grid-cols-1 sm:grid-cols-12"
                    >
                      {/* Event Poster Visual */}
                      <div className="sm:col-span-5 relative min-h-[240px] bg-[#080706]">
                        <SafeImage
                          src={ev.posterImage}
                          alt={ev.title}
                          className="w-full h-full object-cover opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0A09] via-[#0B0A09]/30 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <p className="text-[11px] tracking-widest uppercase text-[#D97736]">
                            {ev.posterCaption}
                          </p>
                          <p className="font-serif text-lg text-[#F4EFE6] leading-snug">
                            {ev.title}
                          </p>
                        </div>
                      </div>

                      {/* Event Info */}
                      <div className="sm:col-span-7 p-6 flex flex-col justify-between space-y-6">
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center gap-2 text-xs text-[#A39B8B]">
                            <span className="text-[#D97736] uppercase tracking-wider">
                              {ev.type === 'upcoming'
                                ? 'Upcoming Performance'
                                : 'Past Archive'}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>{ev.category}</span>
                          </div>

                          <h3 className="font-serif text-2xl sm:text-3xl text-[#F4EFE6]">
                            {ev.title}
                          </h3>

                          <div className="space-y-1 text-xs sm:text-sm text-[#A39B8B] pt-1">
                            <p>
                              <strong className="text-[#F4EFE6] font-medium">
                                Date:
                              </strong>{' '}
                              {ev.date}
                            </p>
                            <p>
                              <strong className="text-[#F4EFE6] font-medium">
                                Venue:
                              </strong>{' '}
                              {ev.venue} · {ev.city}
                            </p>
                            <p>
                              <strong className="text-[#F4EFE6] font-medium">
                                Status:
                              </strong>{' '}
                              {ev.ticketInfo}
                            </p>
                          </div>
                        </div>

                        <div className="pt-2 flex flex-wrap items-center gap-3">
                          {ev.type === 'upcoming' && ev.ticketUrl ? (
                            <a
                              href={ev.ticketUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium rounded-lg bg-[#D97736] text-[#0B0A09] hover:bg-[#e58645] transition-colors whitespace-nowrap shrink-0"
                            >
                              <span>Book Tickets</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </a>
                          ) : ev.type === 'upcoming' ? (
                            <button
                              onClick={() => {
                                setContactEnquiry(
                                  `Ticket / RSVP Enquiry: ${ev.title}`
                                );
                                navigateToSection('contact');
                              }}
                              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium rounded-lg bg-[#D97736] text-[#0B0A09] hover:bg-[#e58645] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                            >
                              <span>Request RSVP / Tickets</span>
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                setCmsState({ open: true, tab: 'events' })
                              }
                              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg border border-[#F4EFE6]/15 text-[#A39B8B] hover:text-[#F4EFE6] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit Archive Details</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* 7. INSTAGRAM INTEGRATION SECTION */}
        {shouldShowSection('home') && (
          <section
            id="instagram"
            className="py-24 md:py-32 px-6 bg-[#0E0C0A] border-b border-[#F4EFE6]/10"
          >
            <div className="max-w-7xl mx-auto space-y-12">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-[#A39B8B]">
                    <Instagram className="w-3.5 h-3.5 text-[#D97736]" />
                    <span>@mustberesonant · Visual Journal & Reels</span>
                  </div>
                  <h2 className="font-serif text-4xl sm:text-5xl text-[#F4EFE6]">
                    A little more of my world.
                  </h2>
                </div>

                <a
                  href="https://www.instagram.com/mustberesonant/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 text-xs font-medium rounded-lg bg-[#D97736] text-[#0B0A09] hover:bg-[#e58645] transition-colors whitespace-nowrap shrink-0"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Follow @mustberesonant on Instagram</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {INITIAL_INSTAGRAM_SLOTS.map((slot) => (
                  <a
                    key={slot.id}
                    href={slot.postUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-2xl overflow-hidden bg-[#12100E] border border-[#F4EFE6]/10 hover:border-[#D97736]/50 transition-colors flex flex-col justify-between"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <SafeImage
                        src={slot.thumbnail}
                        alt={slot.caption}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0A09] via-transparent to-transparent" />
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs text-[#F4EFE6]/90">
                        <span>{slot.format}</span>
                        <ArrowUpRight className="w-4 h-4 text-[#D97736]" />
                      </div>
                    </div>
                    <div className="p-4 space-y-1.5">
                      <p className="text-xs text-[#F4EFE6]/90 line-clamp-2 leading-relaxed">
                        {slot.caption}
                      </p>
                      <p className="text-[11px] text-[#A39B8B]">
                        @mustberesonant · Editable Reel / Post Slot
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 8. CONTACT SECTION */}
        {shouldShowSection('contact') && (
          <section id="contact" className="py-24 md:py-32 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              {/* Left Column: Contact Channels & Context */}
              <div className="lg:col-span-5 space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs text-[#A39B8B]">
                    <span className="font-mono text-[#D97736]">06</span>
                    <span aria-hidden="true">·</span>
                    <span>Bookings, Commissions & Community</span>
                  </div>

                  <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-[#F4EFE6] leading-[1.08]">
                    Let&apos;s create something that resonates.
                  </h2>

                  <p className="text-sm sm:text-base text-[#A39B8B] leading-relaxed">
                    For spoken-word performances, university festivals, literary commissions, or <strong className="text-[#F4EFE6] font-medium">Echo and Embers</strong> collaborations, reach out directly below or connect via Instagram.
                  </p>
                </div>

                {/* Direct Contact Options */}
                <div className="space-y-4 pt-2">
                  <a
                    href="https://www.instagram.com/mustberesonant/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-5 rounded-xl bg-[#12100E] border border-[#F4EFE6]/10 hover:border-[#D97736]/50 transition-colors group"
                  >
                    <div className="flex items-center justify-between text-xs text-[#A39B8B] mb-1">
                      <span>Instagram Direct Message</span>
                      <ArrowUpRight className="w-4 h-4 text-[#D97736] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                    <p className="font-serif text-2xl text-[#F4EFE6]">
                      @mustberesonant
                    </p>
                  </a>

                  <div className="p-5 rounded-xl bg-[#12100E] border border-[#F4EFE6]/10">
                    <div className="flex items-center justify-between text-xs text-[#A39B8B] mb-1">
                      <span>Official Email Slot</span>
                      <button
                        onClick={() =>
                          setCmsState({ open: true, tab: 'settings' })
                        }
                        className="text-[#D97736] hover:underline cursor-pointer"
                      >
                        Configure in CMS
                      </button>
                    </div>
                    <p className="font-serif text-xl text-[#F4EFE6] break-words">
                      {aboutData.contactEmailPlaceholder}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() =>
                        setContactEnquiry(
                          'Spoken-Word Performance / Show Booking'
                        )
                      }
                      className="text-left p-4 rounded-xl bg-[#12100E] border border-[#F4EFE6]/10 hover:border-[#D97736]/50 transition-colors cursor-pointer"
                    >
                      <p className="text-xs text-[#D97736] mb-1">Live Stage</p>
                      <p className="font-serif text-xl text-[#F4EFE6]">
                        Show Bookings
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setContactEnquiry('Creative Collaboration / Commission')
                      }
                      className="text-left p-4 rounded-xl bg-[#12100E] border border-[#F4EFE6]/10 hover:border-[#D97736]/50 transition-colors cursor-pointer"
                    >
                      <p className="text-xs text-[#D97736] mb-1">
                        Partnerships
                      </p>
                      <p className="font-serif text-xl text-[#F4EFE6]">
                        Collaboration Enquiries
                      </p>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Working Contact Form */}
              <div className="lg:col-span-7">
                <form
                  onSubmit={handleContactSubmit}
                  className="p-8 sm:p-10 rounded-2xl bg-[#12100E] border border-[#F4EFE6]/10 space-y-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#F4EFE6]/10">
                    <div>
                      <h3 className="font-serif text-2xl sm:text-3xl text-[#F4EFE6]">
                        Send an Enquiry
                      </h3>
                      <p className="text-xs text-[#A39B8B] mt-0.5">
                        Connected to endpoint:{' '}
                        <span className="font-mono text-[#F4EFE6]/80">
                          {aboutData.contactBackendEndpoint}
                        </span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCmsState({ open: true, tab: 'inbox' })}
                      className="text-xs text-[#D97736] hover:underline cursor-pointer"
                    >
                      View Inbox ({submissions.length})
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-xs text-[#A39B8B] mb-2"
                      >
                        Your Name *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full px-4 py-3 text-sm rounded-lg bg-[#0B0A09] border border-[#F4EFE6]/15 text-[#F4EFE6] placeholder:text-[#A39B8B]/50 focus:border-[#D97736] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-email"
                        className="block text-xs text-[#A39B8B] mb-2"
                      >
                        Email Address *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 text-sm rounded-lg bg-[#0B0A09] border border-[#F4EFE6]/15 text-[#F4EFE6] placeholder:text-[#A39B8B]/50 focus:border-[#D97736] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-enquiry"
                      className="block text-xs text-[#A39B8B] mb-2"
                    >
                      Event / Collaboration Enquiry
                    </label>
                    <select
                      id="contact-enquiry"
                      value={contactEnquiry}
                      onChange={(e) => setContactEnquiry(e.target.value)}
                      className="w-full px-4 py-3 text-sm rounded-lg bg-[#0B0A09] border border-[#F4EFE6]/15 text-[#F4EFE6] focus:border-[#D97736] focus:outline-none"
                    >
                      <option value="Spoken-Word Performance / Show Booking">
                        Spoken-Word Performance / Show Booking
                      </option>
                      <option value="Creative Collaboration / Commission">
                        Creative Collaboration / Literary Commission
                      </option>
                      <option value="Echo and Embers Community / Open Mic">
                        Echo and Embers / Goonj – A Home for Artists
                      </option>
                      <option value="University / Festival Feature">
                        University / Cultural Festival Feature
                      </option>
                      <option value="Personal Note / Reader Message">
                        Personal Note / Reader Message
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-xs text-[#A39B8B] mb-2"
                    >
                      Message *
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      required
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Share details about your event, dates, venue, or creative idea..."
                      className="w-full px-4 py-3 text-sm rounded-lg bg-[#0B0A09] border border-[#F4EFE6]/15 text-[#F4EFE6] placeholder:text-[#A39B8B]/50 focus:border-[#D97736] focus:outline-none"
                    />
                  </div>

                  {contactStatus && (
                    <div
                      className={`p-4 rounded-xl border text-xs flex items-start gap-2.5 ${
                        contactStatus.type === 'success'
                          ? 'bg-[#D97736]/10 border-[#D97736]/40 text-[#F4EFE6]'
                          : 'bg-red-950/40 border-red-500/40 text-red-200'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#D97736] shrink-0 mt-0.5" />
                      <span>{contactStatus.text}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-end">
                    <button
                      type="submit"
                      disabled={contactSubmitting}
                      className="inline-flex items-center gap-2 px-7 py-3.5 text-xs sm:text-sm font-medium rounded-lg bg-[#D97736] text-[#0B0A09] hover:bg-[#e58645] disabled:opacity-50 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <Send className="w-4 h-4" />
                      <span>
                        {contactSubmitting
                          ? 'Sending Enquiry...'
                          : 'Send Message'}
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* 10. FOOTER */}
      <footer className="bg-[#080706] border-t border-[#F4EFE6]/10 py-16 md:py-24 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#F4EFE6]/10">
            <div className="md:col-span-6 space-y-4">
              <p className="text-xs tracking-[0.22em] text-[#D97736]">
                MUST BE RESONANT
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl tracking-[0.08em] text-[#F4EFE6]">
                GUNJIT BHAGWATE
              </h2>
              <p className="font-serif text-2xl text-[#F4EFE6]/90 italic">
                &ldquo;Main shunya pe sawaar hoon.&rdquo; · &ldquo;मैं शून्य पे सवार हूँ।&rdquo;
              </p>
              <p className="font-serif text-lg text-[#A39B8B] pt-2">
                &ldquo;Some words are written. Some are felt. Some stay.&rdquo;
              </p>
            </div>

            <div className="md:col-span-3 space-y-3">
              <p className="text-xs uppercase tracking-wider text-[#A39B8B]">
                Navigation
              </p>
              <ul className="space-y-2 text-sm text-[#F4EFE6]/80">
                {(
                  [
                    { id: 'home', label: 'Home' },
                    { id: 'about', label: 'About' },
                    { id: 'writings', label: 'Writings' },
                    { id: 'performances', label: 'Performances' },
                    { id: 'echo-and-embers', label: 'Echo and Embers' },
                    { id: 'events', label: 'Events' },
                    { id: 'contact', label: 'Contact' },
                  ] as { id: SectionId; label: string }[]
                ).map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        navigateToSection(item.id);
                      }}
                      className="hover:text-[#D97736] transition-colors"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-3 space-y-4">
              <p className="text-xs uppercase tracking-wider text-[#A39B8B]">
                Identity & Venture
              </p>
              <div className="space-y-2 text-sm text-[#A39B8B]">
                <p>
                  <span className="text-[#F4EFE6]">Instagram:</span>{' '}
                  <a
                    href="https://www.instagram.com/mustberesonant/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#D97736] hover:underline"
                  >
                    @mustberesonant
                  </a>
                </p>
                <p>
                  <span className="text-[#F4EFE6]">Creative venture:</span> Echo
                  and Embers
                </p>
                <p>
                  <span className="text-[#F4EFE6]">Initiative:</span> Goonj – A
                  Home for Artists
                </p>
              </div>
              <button
                onClick={() => setCmsState({ open: true, tab: 'writings' })}
                className="inline-flex items-center gap-1.5 text-xs text-[#D97736] hover:underline cursor-pointer pt-2"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Open Studio CMS</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A39B8B]">
            <p>
              © {new Date().getFullYear()} Gunjit Bhagwate · MUST BE RESONANT.
              All literary rights reserved.
            </p>
            <p>Artist · Writer · Poet · Storyteller</p>
          </div>
        </div>
      </footer>

      {/* ECHO AND EMBERS SHOWCASE MODAL */}
      <AnimatePresence>
        {echoModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Echo and Embers Community"
          >
            <div className="w-full max-w-3xl bg-[#12100E] border border-[#F4EFE6]/15 rounded-2xl overflow-hidden shadow-2xl my-auto">
              <div className="relative h-56 sm:h-64 overflow-hidden">
                <SafeImage
                  src={GENERATED_IMAGES.echoAndEmbers}
                  alt="Echo and Embers Session"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12100E] via-[#12100E]/50 to-transparent" />
                <button
                  onClick={() => setEchoModalOpen(false)}
                  className="absolute top-4 right-4 p-2 rounded-lg bg-[#0B0A09]/80 text-[#F4EFE6] hover:text-[#D97736] cursor-pointer"
                  aria-label="Close Echo and Embers modal"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-6 right-6">
                  <p className="text-xs text-[#D97736] tracking-wider uppercase">
                    Gunjit Bhagwate&apos;s Creative Venture
                  </p>
                  <h3 className="font-serif text-3xl sm:text-4xl text-[#F4EFE6]">
                    Echo and Embers · Goonj – A Home for Artists
                  </h3>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <p className="text-sm sm:text-base text-[#A39B8B] leading-relaxed">
                  <strong className="text-[#F4EFE6]">Echo and Embers</strong> brings together poets, writers, storytellers, and listeners across intimate open mics, curated poetry baithaks, and flagship{' '}
                  <strong className="text-[#F4EFE6]">Goonj – A Home for Artists</strong>{' '}
                  sessions. Whether you want to perform your own piece, host a collaborative session, or attend the next gathering, you have a seat in the circle.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#0B0A09] border border-[#F4EFE6]/10">
                    <h4 className="font-serif text-xl text-[#F4EFE6] mb-1">
                      Perform at an Open Mic
                    </h4>
                    <p className="text-xs text-[#A39B8B] leading-relaxed">
                      Share original Hindi or English poetry, storytelling, or acoustic pieces in an attentive, distraction-free room.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#0B0A09] border border-[#F4EFE6]/10">
                    <h4 className="font-serif text-xl text-[#F4EFE6] mb-1">
                      Host a Goonj Session
                    </h4>
                    <p className="text-xs text-[#A39B8B] leading-relaxed">
                      Partner with Echo and Embers to bring an intimate literary showcase to your cultural space, café, or campus.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => setEchoModalOpen(false)}
                    className="px-4 py-2.5 text-xs font-medium rounded-lg border border-[#F4EFE6]/15 text-[#A39B8B] hover:text-[#F4EFE6] cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setEchoModalOpen(false);
                      setContactEnquiry('Echo and Embers Community / Open Mic');
                      navigateToSection('contact');
                    }}
                    className="px-6 py-2.5 text-xs font-medium rounded-lg bg-[#D97736] text-[#0B0A09] hover:bg-[#e58645] cursor-pointer"
                  >
                    Join or Collaborate with Echo and Embers
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* LITERARY READING VIEW MODAL */}
      {activeReadingPiece && (
        <ReadingView
          piece={activeReadingPiece}
          allPieces={writings}
          onClose={() => setActiveReadingPiece(null)}
          onSelectPiece={(next) => setActiveReadingPiece(next)}
          onSaveManuscript={handleUpdateWriting}
        />
      )}

      {/* SPOKEN-WORD PERFORMANCE THEATER MODAL */}
      <PerformanceModal
        performance={activePerformance}
        onClose={() => setActivePerformance(null)}
        onUpdatePerformance={handleUpdatePerformance}
      />

      {/* PHOTOGRAPHY LIGHTBOX MODAL */}
      <LightboxModal
        item={lightboxItem}
        onClose={() => setLightboxItem(null)}
      />

      {/* STUDIO CMS MODAL */}
      <StudioCMSModal
        isOpen={cmsState.open}
        initialTab={cmsState.tab}
        onClose={() => setCmsState((prev) => ({ ...prev, open: false }))}
        writings={writings}
        onUpdateWriting={handleUpdateWriting}
        onAddWriting={handleAddWriting}
        events={events}
        onAddEvent={handleAddEvent}
        onDeleteEvent={handleDeleteEvent}
        performances={performances}
        onUpdatePerformance={handleUpdatePerformance}
        aboutData={aboutData}
        onUpdateAboutData={handleUpdateAboutData}
        submissions={submissions}
        onResetDefaults={handleResetDefaults}
      />
    </div>
  );
}
