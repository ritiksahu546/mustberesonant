import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Check,
  BookOpen,
  Calendar,
  Film,
  Settings,
  Inbox,
  RotateCcw,
} from 'lucide-react';
import {
  WritingPiece,
  PerformanceItem,
  LiveEventItem,
  AboutProfileData,
  ContactSubmission,
  GENERATED_IMAGES,
} from '../data/portfolioData';

interface StudioCMSModalProps {
  isOpen: boolean;
  initialTab?: 'writings' | 'events' | 'performances' | 'settings' | 'inbox';
  onClose: () => void;
  writings: WritingPiece[];
  onUpdateWriting: (id: string, updated: Partial<WritingPiece>) => void;
  onAddWriting: (newPiece: WritingPiece) => void;
  events: LiveEventItem[];
  onAddEvent: (newEvent: LiveEventItem) => void;
  onDeleteEvent: (id: string) => void;
  performances: PerformanceItem[];
  onUpdatePerformance: (id: string, updated: Partial<PerformanceItem>) => void;
  aboutData: AboutProfileData;
  onUpdateAboutData: (updated: Partial<AboutProfileData>) => void;
  submissions: ContactSubmission[];
  onResetDefaults: () => void;
}

export const StudioCMSModal: React.FC<StudioCMSModalProps> = ({
  isOpen,
  initialTab = 'writings',
  onClose,
  writings,
  onUpdateWriting,
  onAddWriting,
  events,
  onAddEvent,
  onDeleteEvent,
  performances,
  onUpdatePerformance,
  aboutData,
  onUpdateAboutData,
  submissions,
  onResetDefaults,
}) => {
  const [activeTab, setActiveTab] = useState<
    'writings' | 'events' | 'performances' | 'settings' | 'inbox'
  >(initialTab);

  // Selected writing for inline editing
  const [selectedWritingId, setSelectedWritingId] = useState<string>(
    writings[0]?.id || ''
  );

  // New Event Form State
  const [evTitle, setEvTitle] = useState('');
  const [evType, setEvType] = useState<'upcoming' | 'past'>('upcoming');
  const [evCategory, setEvCategory] = useState('Spoken-Word Showcase');
  const [evDate, setEvDate] = useState('');
  const [evVenue, setEvVenue] = useState('');
  const [evCity, setEvCity] = useState('');
  const [evTicketInfo, setEvTicketInfo] = useState('Tickets Available');
  const [evTicketUrl, setEvTicketUrl] = useState('');
  const [evPosterCaption, setEvPosterCaption] = useState('MUST BE RESONANT · Live');

  // New Writing Form State
  const [showNewWritingForm, setShowNewWritingForm] = useState(false);
  const [nwTitle, setNwTitle] = useState('');
  const [nwHindi, setNwHindi] = useState('');
  const [nwLang, setNwLang] = useState('Hindi / English Poetry');
  const [nwForm, setNwForm] = useState('Spoken-Word & Verse');
  const [nwContext, setNwContext] = useState('');
  const [nwContent, setNwContent] = useState('');

  // Settings State
  const [emailSlot, setEmailSlot] = useState(aboutData.contactEmailPlaceholder);
  const [backendUrl, setBackendUrl] = useState(aboutData.contactBackendEndpoint);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentWriting =
    writings.find((w) => w.id === selectedWritingId) || writings[0];

  const triggerSaved = (msg: string) => {
    setSavedNotice(msg);
    setTimeout(() => setSavedNotice(null), 2500);
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evTitle.trim() || !evDate.trim() || !evVenue.trim()) return;

    const newItem: LiveEventItem = {
      id: `event-${Date.now()}`,
      title: evTitle.trim(),
      type: evType,
      category: evCategory.trim() || 'Live Performance',
      date: evDate.trim(),
      venue: evVenue.trim(),
      city: evCity.trim() || 'India',
      ticketInfo: evTicketInfo.trim() || 'Official Entry',
      ticketUrl: evTicketUrl.trim(),
      posterCaption: evPosterCaption.trim() || 'Echo and Embers',
      posterImage:
        evType === 'upcoming'
          ? GENERATED_IMAGES.heroPortrait
          : GENERATED_IMAGES.echoAndEmbers,
      isPlaceholder: false,
    };

    onAddEvent(newItem);
    setEvTitle('');
    setEvDate('');
    setEvVenue('');
    setEvCity('');
    setEvTicketUrl('');
    triggerSaved('Event added to portfolio schedule.');
  };

  const handleCreateWriting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nwTitle.trim()) return;
    const nextIndex = String(writings.length + 1).padStart(2, '0');
    const newPiece: WritingPiece = {
      id: nwTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now(),
      index: nextIndex,
      title: nwTitle.trim(),
      hindiSubtitle: nwHindi.trim() || undefined,
      language: nwLang.trim(),
      form: nwForm.trim(),
      readingTime: '4 min read',
      editorialContext:
        nwContext.trim() || 'Original literary work by Gunjit Bhagwate.',
      manuscriptContent:
        nwContent.trim() ||
        `[Editable Manuscript — "${nwTitle.trim()}"]\n\nPaste Gunjit Bhagwate's original text here.`,
      isPlaceholder: !nwContent.trim(),
      coverImage: GENERATED_IMAGES.manuscriptStill,
      lastUpdated: 'Added via Artist CMS',
    };
    onAddWriting(newPiece);
    setSelectedWritingId(newPiece.id);
    setShowNewWritingForm(false);
    setNwTitle('');
    setNwHindi('');
    setNwContext('');
    setNwContent('');
    triggerSaved('New writing added to collection.');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateAboutData({
      contactEmailPlaceholder: emailSlot.trim(),
      contactBackendEndpoint: backendUrl.trim() || '/api/contact',
    });
    triggerSaved('Contact & backend configuration updated.');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Artist Content Management Studio"
    >
      <div className="w-full max-w-5xl bg-[#12100E] border border-[#F4EFE6]/15 rounded-2xl overflow-hidden shadow-2xl my-auto flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F4EFE6]/10 shrink-0">
          <div>
            <h2 className="font-serif text-2xl text-[#F4EFE6]">
              Artist Content Management Studio
            </h2>
            <p className="text-xs text-[#A39B8B]">
              MUST BE RESONANT · Manage writings, live show dates, performance embeds & contact backend
            </p>
          </div>
          <div className="flex items-center gap-3">
            {savedNotice && (
              <span className="text-xs text-[#D97736] font-medium">
                {savedNotice}
              </span>
            )}
            <button
              onClick={onClose}
              className="p-2 text-[#A39B8B] hover:text-[#F4EFE6] rounded-lg transition-colors cursor-pointer"
              aria-label="Close Studio CMS"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 py-2.5 bg-[#0B0A09] border-b border-[#F4EFE6]/10 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('writings')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'writings'
                ? 'bg-[#D97736] text-[#0B0A09]'
                : 'text-[#A39B8B] hover:text-[#F4EFE6]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Writings ({writings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'events'
                ? 'bg-[#D97736] text-[#0B0A09]'
                : 'text-[#A39B8B] hover:text-[#F4EFE6]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Events & Shows ({events.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('performances')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'performances'
                ? 'bg-[#D97736] text-[#0B0A09]'
                : 'text-[#A39B8B] hover:text-[#F4EFE6]'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Performance Video Links ({performances.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'settings'
                ? 'bg-[#D97736] text-[#0B0A09]'
                : 'text-[#A39B8B] hover:text-[#F4EFE6]'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Bio & Contact Backend</span>
          </button>

          <button
            onClick={() => setActiveTab('inbox')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'inbox'
                ? 'bg-[#D97736] text-[#0B0A09]'
                : 'text-[#A39B8B] hover:text-[#F4EFE6]'
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Enquiries ({submissions.length})</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: WRITINGS CMS */}
          {activeTab === 'writings' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#A39B8B]">
                    Select Title to Edit
                  </span>
                  <button
                    onClick={() => setShowNewWritingForm((prev) => !prev)}
                    className="inline-flex items-center gap-1 text-xs text-[#D97736] hover:underline cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Title</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {writings.map((w) => (
                    <button
                      key={w.id}
                      onClick={() => {
                        setSelectedWritingId(w.id);
                        setShowNewWritingForm(false);
                      }}
                      className={`w-full text-left p-3.5 rounded-xl border transition-colors cursor-pointer ${
                        selectedWritingId === w.id && !showNewWritingForm
                          ? 'bg-[#1C1815] border-[#D97736]'
                          : 'bg-[#0B0A09] border-[#F4EFE6]/10 hover:border-[#F4EFE6]/25'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs text-[#A39B8B] mb-1">
                        <span className="font-mono">{w.index}</span>
                        <span>
                          {w.isPlaceholder ? 'Editable Slot' : 'Published Text'}
                        </span>
                      </div>
                      <p className="font-serif text-lg text-[#F4EFE6]">
                        {w.title}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-8 bg-[#0B0A09] border border-[#F4EFE6]/10 rounded-xl p-5">
                {showNewWritingForm ? (
                  <form onSubmit={handleCreateWriting} className="space-y-4">
                    <h3 className="font-serif text-2xl text-[#F4EFE6]">
                      Add New Writing Piece
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-[#A39B8B] mb-1">
                          Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={nwTitle}
                          onChange={(e) => setNwTitle(e.target.value)}
                          placeholder="Title of poem or prose"
                          className="w-full px-3 py-2 text-sm rounded-lg bg-[#12100E] border border-[#F4EFE6]/15 text-[#F4EFE6]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#A39B8B] mb-1">
                          Devanagari Subtitle (Optional)
                        </label>
                        <input
                          type="text"
                          value={nwHindi}
                          onChange={(e) => setNwHindi(e.target.value)}
                          placeholder="हिन्दी शीर्षक"
                          className="w-full px-3 py-2 text-sm rounded-lg bg-[#12100E] border border-[#F4EFE6]/15 text-[#F4EFE6]"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-[#A39B8B] mb-1">
                          Language
                        </label>
                        <input
                          type="text"
                          value={nwLang}
                          onChange={(e) => setNwLang(e.target.value)}
                          className="w-full px-3 py-2 text-sm rounded-lg bg-[#12100E] border border-[#F4EFE6]/15 text-[#F4EFE6]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#A39B8B] mb-1">
                          Literary Form
                        </label>
                        <input
                          type="text"
                          value={nwForm}
                          onChange={(e) => setNwForm(e.target.value)}
                          className="w-full px-3 py-2 text-sm rounded-lg bg-[#12100E] border border-[#F4EFE6]/15 text-[#F4EFE6]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-[#A39B8B] mb-1">
                        Editorial Context / Introduction
                      </label>
                      <textarea
                        rows={2}
                        value={nwContext}
                        onChange={(e) => setNwContext(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-lg bg-[#12100E] border border-[#F4EFE6]/15 text-[#F4EFE6]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#A39B8B] mb-1">
                        Original Manuscript Text
                      </label>
                      <textarea
                        rows={8}
                        value={nwContent}
                        onChange={(e) => setNwContent(e.target.value)}
                        placeholder="Paste Gunjit Bhagwate's original poem or article..."
                        className="w-full px-3 py-2 font-serif text-base rounded-lg bg-[#12100E] border border-[#F4EFE6]/15 text-[#F4EFE6]"
                      />
                    </div>
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setShowNewWritingForm(false)}
                        className="px-4 py-2 text-xs rounded-lg border border-[#F4EFE6]/15 text-[#A39B8B]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 text-xs font-medium rounded-lg bg-[#D97736] text-[#0B0A09]"
                      >
                        Create Writing
                      </button>
                    </div>
                  </form>
                ) : currentWriting ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif text-2xl text-[#F4EFE6]">
                        Editing: {currentWriting.title}
                      </h3>
                      <span className="text-xs text-[#A39B8B]">
                        Changes auto-save as you edit
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-[#A39B8B] mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          value={currentWriting.title}
                          onChange={(e) =>
                            onUpdateWriting(currentWriting.id, {
                              title: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 text-sm rounded-lg bg-[#12100E] border border-[#F4EFE6]/15 text-[#F4EFE6]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-[#A39B8B] mb-1">
                          Devanagari Subtitle
                        </label>
                        <input
                          type="text"
                          value={currentWriting.hindiSubtitle || ''}
                          onChange={(e) =>
                            onUpdateWriting(currentWriting.id, {
                              hindiSubtitle: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 text-sm rounded-lg bg-[#12100E] border border-[#F4EFE6]/15 text-[#F4EFE6]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-[#A39B8B] mb-1">
                        Editorial Context
                      </label>
                      <textarea
                        rows={2}
                        value={currentWriting.editorialContext}
                        onChange={(e) =>
                          onUpdateWriting(currentWriting.id, {
                            editorialContext: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 text-sm rounded-lg bg-[#12100E] border border-[#F4EFE6]/15 text-[#F4EFE6]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-[#A39B8B] mb-1">
                        Full Poem / Article Content
                      </label>
                      <textarea
                        rows={10}
                        value={currentWriting.manuscriptContent}
                        onChange={(e) =>
                          onUpdateWriting(currentWriting.id, {
                            manuscriptContent: e.target.value,
                            isPlaceholder: false,
                            lastUpdated: 'Updated in Studio CMS',
                          })
                        }
                        className="w-full px-4 py-3 font-serif text-lg leading-relaxed rounded-lg bg-[#12100E] border border-[#F4EFE6]/15 text-[#F4EFE6]"
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {/* TAB 2: EVENTS & SHOWS MANAGER */}
          {activeTab === 'events' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <form
                onSubmit={handleCreateEvent}
                className="lg:col-span-5 bg-[#0B0A09] border border-[#F4EFE6]/10 rounded-xl p-5 space-y-4"
              >
                <h3 className="font-serif text-2xl text-[#F4EFE6]">
                  Add Official Show / Event
                </h3>
                <p className="text-xs text-[#A39B8B]">
                  No fake upcoming dates or fake ticket links are ever shown. Add confirmed shows here.
                </p>

                <div>
                  <label className="block text-xs text-[#A39B8B] mb-1">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={evTitle}
                    onChange={(e) => setEvTitle(e.target.value)}
                    placeholder="e.g. Goonj — Evening of Poetry & Stories"
                    className="w-full px-3 py-2 text-sm rounded-lg bg-[#12100E] border border-[#F4EFE6]/15 text-[#F4EFE6]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[#A39B8B] mb-1">
                      Schedule Status
                    </label>
                    <select
                      value={evType}
                      onChange={(e) =>
                        setEvType(e.target.value as 'upcoming' | 'past')
                      }
                      className="w-full px-3 py-2 text-sm rounded-lg bg-[#12100E] border border-[#F4EFE6]/15 text-[#F4EFE6]"
                    >
                      <option value="upcoming">Upcoming Show</option>
                      <option value="past">Past Show Archive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-[#A39B8B] mb-1">
                      Date & Time *
                    </label>
                    <input
                      type="text"
                      required
                      value={evDate}
                      onChange={(e) => setEvDate(e.target.value)}
                      placeholder="e.g. 24 Dec · 7:00 PM"
                      className="w-full px-3 py-2 text-sm rounded-lg bg-[#12100E] border border-[#F4EFE6]/15 text-[#F4EFE6]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[#A39B8B] mb-1">
                      Venue *
                    </label>
                    <input
                      type="text"
                      required
                      value={evVenue}
                      onChange={(e) => setEvVenue(e.target.value)}
                      placeholder="Venue name"
                      className="w-full px-3 py-2 text-sm rounded-lg bg-[#12100E] border border-[#F4EFE6]/15 text-[#F4EFE6]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#A39B8B] mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={evCity}
                      onChange={(e) => setEvCity(e.target.value)}
                      placeholder="City"
                      className="w-full px-3 py-2 text-sm rounded-lg bg-[#12100E] border border-[#F4EFE6]/15 text-[#F4EFE6]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[#A39B8B] mb-1">
                      Ticket Status Label
                    </label>
                    <input
                      type="text"
                      value={evTicketInfo}
                      onChange={(e) => setEvTicketInfo(e.target.value)}
                      placeholder="e.g. Limited Seating"
                      className="w-full px-3 py-2 text-sm rounded-lg bg-[#12100E] border border-[#F4EFE6]/15 text-[#F4EFE6]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#A39B8B] mb-1">
                      Poster Header Note
                    </label>
                    <input
                      type="text"
                      value={evPosterCaption}
                      onChange={(e) => setEvPosterCaption(e.target.value)}
                      placeholder="Echo and Embers"
                      className="w-full px-3 py-2 text-sm rounded-lg bg-[#12100E] border border-[#F4EFE6]/15 text-[#F4EFE6]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-[#A39B8B] mb-1">
                    Official Ticket Booking Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={evTicketUrl}
                    onChange={(e) => setEvTicketUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 text-sm rounded-lg bg-[#12100E] border border-[#F4EFE6]/15 text-[#F4EFE6]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium rounded-lg bg-[#D97736] text-[#0B0A09] hover:bg-[#e58645] transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish Event to Schedule</span>
                </button>
              </form>

              <div className="lg:col-span-7 space-y-3">
                <h3 className="font-serif text-2xl text-[#F4EFE6]">
                  Current Events Archive ({events.length})
                </h3>
                {events.length === 0 ? (
                  <p className="text-xs text-[#A39B8B] p-6 rounded-xl bg-[#0B0A09] border border-[#F4EFE6]/10">
                    No events listed yet. Use the form on the left to add upcoming or past performances.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {events.map((ev) => (
                      <div
                        key={ev.id}
                        className="p-4 rounded-xl bg-[#0B0A09] border border-[#F4EFE6]/10 flex items-center justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2 text-xs text-[#A39B8B] mb-1">
                            <span className="text-[#D97736] uppercase tracking-wider">
                              {ev.type}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>{ev.date}</span>
                            <span aria-hidden="true">·</span>
                            <span>
                              {ev.venue}, {ev.city}
                            </span>
                          </div>
                          <h4 className="font-serif text-xl text-[#F4EFE6]">
                            {ev.title}
                          </h4>
                        </div>
                        <button
                          onClick={() => onDeleteEvent(ev.id)}
                          className="p-2 text-[#A39B8B] hover:text-red-400 transition-colors cursor-pointer"
                          title="Remove event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: PERFORMANCES */}
          {activeTab === 'performances' && (
            <div className="space-y-4">
              <p className="text-xs text-[#A39B8B]">
                Supply official YouTube video URLs or Instagram Reel permalinks for each spoken-word performance card.
              </p>
              <div className="grid grid-cols-1 gap-4">
                {performances.map((perf) => (
                  <div
                    key={perf.id}
                    className="p-5 rounded-xl bg-[#0B0A09] border border-[#F4EFE6]/10 grid grid-cols-1 md:grid-cols-3 gap-4"
                  >
                    <div>
                      <label className="block text-xs text-[#A39B8B] mb-1">
                        Performance Title
                      </label>
                      <input
                        type="text"
                        value={perf.title}
                        onChange={(e) =>
                          onUpdatePerformance(perf.id, { title: e.target.value })
                        }
                        className="w-full px-3 py-2 text-sm rounded-lg bg-[#12100E] border border-[#F4EFE6]/15 text-[#F4EFE6]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#A39B8B] mb-1">
                        Event & Venue
                      </label>
                      <input
                        type="text"
                        value={perf.venue}
                        onChange={(e) =>
                          onUpdatePerformance(perf.id, { venue: e.target.value })
                        }
                        className="w-full px-3 py-2 text-sm rounded-lg bg-[#12100E] border border-[#F4EFE6]/15 text-[#F4EFE6]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#A39B8B] mb-1">
                        YouTube or Instagram Reel URL
                      </label>
                      <input
                        type="text"
                        value={perf.embedUrl}
                        onChange={(e) =>
                          onUpdatePerformance(perf.id, {
                            embedUrl: e.target.value,
                            isPlaceholder: !e.target.value.trim(),
                          })
                        }
                        placeholder="Paste YouTube or Instagram Reel link..."
                        className="w-full px-3 py-2 text-sm rounded-lg bg-[#12100E] border border-[#F4EFE6]/15 text-[#F4EFE6]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SETTINGS & CONTACT BACKEND */}
          {activeTab === 'settings' && (
            <form
              onSubmit={handleSaveSettings}
              className="max-w-2xl space-y-5 bg-[#0B0A09] border border-[#F4EFE6]/10 rounded-xl p-6"
            >
              <div>
                <h3 className="font-serif text-2xl text-[#F4EFE6]">
                  Contact & Backend Endpoint Configuration
                </h3>
                <p className="text-xs text-[#A39B8B] mt-1">
                  Configure the official display email slot and the backend API or webhook URL where contact enquiries are sent.
                </p>
              </div>

              <div>
                <label className="block text-xs text-[#A39B8B] mb-1.5">
                  Official Contact Email Display Slot (Never pre-filled with a fake address)
                </label>
                <input
                  type="text"
                  value={emailSlot}
                  onChange={(e) => setEmailSlot(e.target.value)}
                  placeholder="Enter official email address when ready..."
                  className="w-full px-3.5 py-2 text-sm rounded-lg bg-[#12100E] border border-[#F4EFE6]/15 text-[#F4EFE6]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#A39B8B] mb-1.5">
                  Configurable Contact Form Backend Endpoint (Default: /api/contact)
                </label>
                <input
                  type="text"
                  value={backendUrl}
                  onChange={(e) => setBackendUrl(e.target.value)}
                  placeholder="/api/contact or custom webhook URL"
                  className="w-full px-3.5 py-2 text-sm rounded-lg bg-[#12100E] border border-[#F4EFE6]/15 text-[#F4EFE6] font-mono"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#F4EFE6]/10">
                <button
                  type="button"
                  onClick={onResetDefaults}
                  className="inline-flex items-center gap-1.5 text-xs text-[#A39B8B] hover:text-[#F4EFE6] cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Portfolio Placeholders to Default</span>
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-medium rounded-lg bg-[#D97736] text-[#0B0A09] hover:bg-[#e58645] transition-colors cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Configuration</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 5: ENQUIRIES INBOX */}
          {activeTab === 'inbox' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-2xl text-[#F4EFE6]">
                  Received Collaboration & Booking Enquiries
                </h3>
                <span className="text-xs text-[#A39B8B] font-mono tabular-nums">
                  {submissions.length} total
                </span>
              </div>

              {submissions.length === 0 ? (
                <div className="p-8 rounded-xl bg-[#0B0A09] border border-[#F4EFE6]/10 text-center space-y-2">
                  <p className="font-serif text-xl text-[#F4EFE6]">
                    No enquiries submitted in this session yet.
                  </p>
                  <p className="text-xs text-[#A39B8B]">
                    Messages sent via the Contact section are dispatched to your configured backend endpoint and logged here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {submissions.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-5 rounded-xl bg-[#0B0A09] border border-[#F4EFE6]/10 space-y-2"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#A39B8B]">
                        <div>
                          <strong className="text-[#F4EFE6] font-medium">
                            {sub.name}
                          </strong>{' '}
                          · {sub.email} ·{' '}
                          <span className="text-[#D97736]">{sub.enquiryType}</span>
                        </div>
                        <span className="font-mono">{sub.submittedAt}</span>
                      </div>
                      <p className="text-sm text-[#F4EFE6]/90 whitespace-pre-line leading-relaxed">
                        {sub.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
