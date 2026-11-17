import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Maximize2,
  Minimize2,
  Edit3,
  Check,
  X,
  BookOpen,
  ArrowRight,
  Sun,
  Moon,
} from 'lucide-react';
import { WritingPiece } from '../data/portfolioData';
import { SafeImage } from './SafeImage';

interface ReadingViewProps {
  piece: WritingPiece;
  allPieces: WritingPiece[];
  onClose: () => void;
  onSelectPiece: (piece: WritingPiece) => void;
  onSaveManuscript: (
    id: string,
    updated: Partial<WritingPiece>
  ) => void;
}

export const ReadingView: React.FC<ReadingViewProps> = ({
  piece,
  allPieces,
  onClose,
  onSelectPiece,
  onSaveManuscript,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [distractionFree, setDistractionFree] = useState(false);
  const [warmPaperMode, setWarmPaperMode] = useState(false);
  const [fontScale, setFontScale] = useState<'base' | 'lg' | 'xl'>('lg');
  const [isEditing, setIsEditing] = useState(false);

  const [draftTitle, setDraftTitle] = useState(piece.title);
  const [draftHindi, setDraftHindi] = useState(piece.hindiSubtitle || '');
  const [draftContext, setDraftContext] = useState(piece.editorialContext);
  const [draftContent, setDraftContent] = useState(piece.manuscriptContent);
  const [draftReadingTime, setDraftReadingTime] = useState(piece.readingTime);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDraftTitle(piece.title);
    setDraftHindi(piece.hindiSubtitle || '');
    setDraftContext(piece.editorialContext);
    setDraftContent(piece.manuscriptContent);
    setDraftReadingTime(piece.readingTime);
    setIsEditing(false);
    setScrollProgress(0);
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [piece]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isEditing) {
          setIsEditing(false);
        } else if (distractionFree) {
          setDistractionFree(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditing, distractionFree, onClose]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const totalScroll = target.scrollHeight - target.clientHeight;
    if (totalScroll <= 0) {
      setScrollProgress(100);
      return;
    }
    const current = (target.scrollTop / totalScroll) * 100;
    setScrollProgress(Math.min(100, Math.max(0, current)));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveManuscript(piece.id, {
      title: draftTitle.trim() || piece.title,
      hindiSubtitle: draftHindi.trim() || undefined,
      editorialContext: draftContext.trim(),
      manuscriptContent: draftContent,
      readingTime: draftReadingTime.trim() || piece.readingTime,
      isPlaceholder: false,
      lastUpdated: 'Edited in Artist CMS',
    });
    setIsEditing(false);
  };

  const currentIndex = allPieces.findIndex((p) => p.id === piece.id);
  const prevPiece = currentIndex > 0 ? allPieces[currentIndex - 1] : null;
  const nextPiece =
    currentIndex < allPieces.length - 1 ? allPieces[currentIndex + 1] : null;

  const fontSizeClass =
    fontScale === 'base'
      ? 'text-lg leading-[1.9]'
      : fontScale === 'lg'
      ? 'text-xl md:text-2xl leading-[1.95]'
      : 'text-2xl md:text-3xl leading-[2.0]';

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={`fixed inset-0 z-50 overflow-y-auto transition-colors duration-300 ${
        warmPaperMode
          ? 'bg-[#F3ECE1] text-[#1A1613]'
          : 'bg-[#0B0A09] text-[#F4EFE6]'
      }`}
      role="dialog"
      aria-modal="true"
      aria-label={`Reading ${piece.title} by Gunjit Bhagwate`}
    >
      {/* Reading Progress Bar */}
      <div className="sticky top-0 left-0 right-0 z-50 h-1 bg-current/10">
        <div
          className="h-full bg-[#D97736] transition-transform duration-150 origin-left"
          style={{ transform: `scaleX(${scrollProgress / 100})` }}
        />
      </div>

      {/* Top Reading Controls Bar */}
      <div
        className={`sticky top-1 z-40 transition-opacity duration-200 ${
          warmPaperMode
            ? 'bg-[#F3ECE1]/90 border-b border-[#1A1613]/10'
            : 'bg-[#0B0A09]/90 border-b border-[#F4EFE6]/10'
        } backdrop-blur-md px-6 py-3.5`}
      >
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 text-sm font-medium opacity-80 hover:opacity-100 transition-opacity whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#D97736]" />
              <span>Back to Writings</span>
            </button>
            {!distractionFree && (
              <span className="hidden sm:inline text-xs opacity-60 font-mono tabular-nums">
                {piece.index} · {piece.title} · {Math.round(scrollProgress)}% read
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Font scale selector */}
            <div
              className={`flex items-center rounded-md p-0.5 border ${
                warmPaperMode ? 'border-[#1A1613]/15' : 'border-[#F4EFE6]/15'
              }`}
              role="group"
              aria-label="Typography scale"
            >
              {(['base', 'lg', 'xl'] as const).map((scale, idx) => (
                <button
                  key={scale}
                  onClick={() => setFontScale(scale)}
                  className={`px-2.5 py-1 text-xs font-serif transition-colors rounded cursor-pointer whitespace-nowrap shrink-0 ${
                    fontScale === scale
                      ? 'bg-[#D97736] text-[#0B0A09] font-semibold'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  {idx === 0 ? 'A' : idx === 1 ? 'A+' : 'A++'}
                </button>
              ))}
            </div>

            {/* Surface contrast toggle */}
            <button
              onClick={() => setWarmPaperMode((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                warmPaperMode
                  ? 'border-[#1A1613]/20 hover:bg-[#1A1613]/5'
                  : 'border-[#F4EFE6]/15 hover:bg-[#F4EFE6]/5'
              }`}
              title="Toggle Warm Paper or Dark Charcoal reading surface"
            >
              {warmPaperMode ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-[#D97736]" />
                  <span className="hidden sm:inline">Charcoal</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-[#D97736]" />
                  <span className="hidden sm:inline">Parchment</span>
                </>
              )}
            </button>

            {/* Distraction-free reading mode toggle */}
            <button
              onClick={() => setDistractionFree((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                distractionFree
                  ? 'bg-[#D97736] text-[#0B0A09] border-[#D97736] font-medium'
                  : warmPaperMode
                  ? 'border-[#1A1613]/20 hover:bg-[#1A1613]/5'
                  : 'border-[#F4EFE6]/15 hover:bg-[#F4EFE6]/5'
              }`}
            >
              {distractionFree ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>Exit Focus</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5 text-[#D97736]" />
                  <span>Focus Mode</span>
                </>
              )}
            </button>

            {/* Edit Manuscript toggle */}
            <button
              onClick={() => setIsEditing((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs rounded-md border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                isEditing
                  ? 'bg-[#F4EFE6] text-[#0B0A09] border-[#F4EFE6] font-medium'
                  : 'border-[#D97736]/50 text-[#D97736] hover:bg-[#D97736]/10'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Editing' : 'Edit Manuscript'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Literary Container */}
      <article className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        {/* Clean Unboxed Metadata */}
        <div className="flex flex-wrap items-center gap-2 text-xs tracking-wide opacity-70 mb-6">
          <span className="font-mono tabular-nums">No. {piece.index}</span>
          <span aria-hidden="true">·</span>
          <span>{piece.language}</span>
          <span aria-hidden="true">·</span>
          <span>{piece.form}</span>
          <span aria-hidden="true">·</span>
          <span>{piece.readingTime}</span>
          <span aria-hidden="true">·</span>
          <span>By Gunjit Bhagwate</span>
        </div>

        {/* Title & Devanagari Subtitle */}
        <header className="mb-12 pb-10 border-b border-current/10">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight leading-[1.1] mb-4">
            {piece.title}
          </h1>
          {piece.hindiSubtitle && (
            <p className="font-serif text-2xl sm:text-3xl text-[#D97736] mb-6">
              {piece.hindiSubtitle}
            </p>
          )}
          <p className="text-base md:text-lg opacity-80 leading-relaxed max-w-2xl">
            {piece.editorialContext}
          </p>
        </header>

        {/* Optional Cover Visual (Hidden in Distraction-Free Mode) */}
        {!distractionFree && !isEditing && (
          <div className="mb-14 overflow-hidden rounded-xl border border-current/10 aspect-[16/9]">
            <SafeImage
              src={piece.coverImage}
              alt={piece.title}
              fallbackTitle={piece.title}
              className="w-full h-full object-cover opacity-90"
            />
          </div>
        )}

        {/* Editable CMS Mode vs Reading Mode */}
        {isEditing ? (
          <form
            onSubmit={handleSave}
            className={`p-6 md:p-8 rounded-xl border ${
              warmPaperMode
                ? 'bg-white/70 border-[#1A1613]/15'
                : 'bg-[#141210] border-[#F4EFE6]/15'
            } space-y-6`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-current/10">
              <div>
                <h2 className="font-serif text-2xl">
                  Artist Manuscript Editor — {piece.title}
                </h2>
                <p className="text-xs opacity-70 mt-1">
                  Paste or compose Gunjit Bhagwate’s official poem or prose. Changes save immediately to your portfolio archive.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="p-2 opacity-70 hover:opacity-100 cursor-pointer"
                aria-label="Cancel editing"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs opacity-75 mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg bg-transparent border border-current/20 focus:border-[#D97736] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs opacity-75 mb-1.5">
                  Devanagari / Subtitle (Optional)
                </label>
                <input
                  type="text"
                  value={draftHindi}
                  onChange={(e) => setDraftHindi(e.target.value)}
                  placeholder="e.g. भगवान"
                  className="w-full px-3.5 py-2 text-sm rounded-lg bg-transparent border border-current/20 focus:border-[#D97736] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs opacity-75 mb-1.5">
                  Reading Time
                </label>
                <input
                  type="text"
                  value={draftReadingTime}
                  onChange={(e) => setDraftReadingTime(e.target.value)}
                  placeholder="e.g. 4 min read"
                  className="w-full px-3.5 py-2 text-sm rounded-lg bg-transparent border border-current/20 focus:border-[#D97736] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs opacity-75 mb-1.5">
                Editorial Introduction / Synopsis
              </label>
              <textarea
                rows={2}
                value={draftContext}
                onChange={(e) => setDraftContext(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-lg bg-transparent border border-current/20 focus:border-[#D97736] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs opacity-75 mb-1.5">
                Full Poem / Article Manuscript (Preserves Line & Stanza Breaks)
              </label>
              <textarea
                rows={14}
                value={draftContent}
                onChange={(e) => setDraftContent(e.target.value)}
                placeholder="Paste Gunjit Bhagwate's original poem or prose here..."
                className="w-full px-4 py-3 font-serif text-lg leading-relaxed rounded-lg bg-transparent border border-current/20 focus:border-[#D97736] focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-xs font-medium rounded-lg border border-current/20 hover:bg-current/5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2 text-xs font-medium rounded-lg bg-[#D97736] text-[#0B0A09] hover:bg-[#e58645] transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Check className="w-4 h-4" />
                <span>Save Manuscript</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-8">
            {piece.isPlaceholder && (
              <div
                className={`p-5 rounded-xl border ${
                  warmPaperMode
                    ? 'bg-[#1A1613]/5 border-[#1A1613]/15'
                    : 'bg-[#141210] border-[#D97736]/30'
                } flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}
              >
                <div className="flex items-start gap-3">
                  <BookOpen className="w-5 h-5 text-[#D97736] shrink-0 mt-0.5" />
                  <div className="text-xs leading-relaxed opacity-85">
                    <strong className="font-medium text-[#D97736] block mb-0.5">
                      Editable Manuscript Slot · Authentic Attribution Protected
                    </strong>
                    To respect Gunjit Bhagwate’s literary authorship, no fabricated poems are attributed here. Click &ldquo;Insert Original Text&rdquo; to paste the official verses for <em>{piece.title}</em>.
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-[#D97736] text-[#0B0A09] hover:bg-[#e58645] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  Insert Original Text
                </button>
              </div>
            )}

            {/* Literary Stanza Renderer */}
            <div
              className={`font-serif ${fontSizeClass} whitespace-pre-line tracking-wide selection:bg-[#D97736]/30`}
            >
              {piece.manuscriptContent}
            </div>

            {/* Signature Sign-off */}
            <div className="pt-12 mt-12 border-t border-current/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-serif text-xl italic">
                  — Gunjit Bhagwate
                </p>
                <p className="text-xs opacity-65 mt-1">
                  MUST BE RESONANT · &ldquo;मैं शून्य पे सवार हूँ।&rdquo;
                </p>
              </div>
              <div className="text-xs opacity-60 font-mono">
                {piece.lastUpdated}
              </div>
            </div>
          </div>
        )}

        {/* Previous / Next Literary Piece Navigation */}
        {!distractionFree && (
          <nav
            aria-label="Adjacent writings"
            className="mt-16 pt-10 border-t border-current/10 grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {prevPiece ? (
              <button
                onClick={() => onSelectPiece(prevPiece)}
                className="text-left p-5 rounded-xl border border-current/10 hover:border-[#D97736]/50 transition-colors group cursor-pointer"
              >
                <span className="inline-flex items-center gap-1.5 text-xs opacity-60 mb-2">
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                  <span>Previous Writing</span>
                </span>
                <p className="font-serif text-2xl group-hover:text-[#D97736] transition-colors">
                  {prevPiece.title}
                </p>
              </button>
            ) : (
              <div />
            )}

            {nextPiece ? (
              <button
                onClick={() => onSelectPiece(nextPiece)}
                className="text-right p-5 rounded-xl border border-current/10 hover:border-[#D97736]/50 transition-colors group cursor-pointer"
              >
                <span className="inline-flex items-center justify-end gap-1.5 text-xs opacity-60 mb-2">
                  <span>Next Writing</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
                <p className="font-serif text-2xl group-hover:text-[#D97736] transition-colors">
                  {nextPiece.title}
                </p>
              </button>
            ) : (
              <div />
            )}
          </nav>
        )}
      </article>
    </div>
  );
};
