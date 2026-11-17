import React, { useState, useEffect } from 'react';
import { X, Play, ExternalLink, Edit3, Check, Film } from 'lucide-react';
import { PerformanceItem } from '../data/portfolioData';
import { SafeImage } from './SafeImage';

interface PerformanceModalProps {
  performance: PerformanceItem | null;
  onClose: () => void;
  onUpdatePerformance: (id: string, updated: Partial<PerformanceItem>) => void;
}

function resolveEmbedUrl(rawUrl: string, platform: 'youtube' | 'instagram'): string | null {
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  if (platform === 'youtube' || trimmed.includes('youtube.com') || trimmed.includes('youtu.be')) {
    const ytRegex =
      /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = trimmed.match(ytRegex);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0`;
    }
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      return `https://www.youtube.com/embed/${trimmed}?autoplay=1&rel=0`;
    }
  }

  if (platform === 'instagram' || trimmed.includes('instagram.com')) {
    const igRegex = /instagram\.com\/(?:p|reel|tv)\/([a-zA-Z0-9_-]+)/;
    const match = trimmed.match(igRegex);
    if (match && match[1]) {
      return `https://www.instagram.com/reel/${match[1]}/embed`;
    }
  }

  if (trimmed.startsWith('https://')) {
    return trimmed;
  }

  return null;
}

export const PerformanceModal: React.FC<PerformanceModalProps> = ({
  performance,
  onClose,
  onUpdatePerformance,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [eventName, setEventName] = useState('');
  const [venue, setVenue] = useState('');
  const [platform, setPlatform] = useState<'youtube' | 'instagram'>('youtube');
  const [embedUrl, setEmbedUrl] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (performance) {
      setTitle(performance.title);
      setEventName(performance.eventName);
      setVenue(performance.venue);
      setPlatform(performance.platform);
      setEmbedUrl(performance.embedUrl);
      setDescription(performance.description);
      setIsEditing(false);
    }
  }, [performance]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  if (!performance) return null;

  const resolvedIframeSrc = resolveEmbedUrl(performance.embedUrl, performance.platform);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePerformance(performance.id, {
      title: title.trim() || performance.title,
      eventName: eventName.trim() || performance.eventName,
      venue: venue.trim() || performance.venue,
      platform,
      embedUrl: embedUrl.trim(),
      description: description.trim() || performance.description,
      isPlaceholder: !embedUrl.trim(),
    });
    setIsEditing(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={performance.title}
    >
      <div className="relative w-full max-w-4xl bg-[#12100E] border border-[#F4EFE6]/15 rounded-2xl overflow-hidden shadow-2xl my-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F4EFE6]/10">
          <div className="flex items-center gap-2 text-xs text-[#A39B8B]">
            <Film className="w-4 h-4 text-[#D97736]" />
            <span>Spoken-Word Screening Room</span>
            <span aria-hidden="true">·</span>
            <span className="uppercase tracking-wider">
              {performance.platform === 'youtube' ? 'YouTube Embed' : 'Instagram Reel'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditing((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#D97736]/40 text-[#D97736] hover:bg-[#D97736]/10 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Close Editor' : 'Supply Video Link / Edit'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#A39B8B] hover:text-[#F4EFE6] rounded-lg transition-colors cursor-pointer"
              aria-label="Close performance theater"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Player or Placeholder Stage */}
        {!isEditing ? (
          <div>
            <div className="relative aspect-video w-full bg-[#070605] overflow-hidden">
              {resolvedIframeSrc ? (
                <iframe
                  src={resolvedIframeSrc}
                  title={performance.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="relative w-full h-full flex flex-col items-center justify-center p-8 text-center">
                  <SafeImage
                    src={performance.thumbnail}
                    alt={performance.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-35"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0A09] via-[#0B0A09]/70 to-[#0B0A09]/40" />

                  <div className="relative z-10 max-w-lg space-y-4">
                    <div className="w-14 h-14 rounded-full bg-[#D97736]/20 border border-[#D97736] flex items-center justify-center mx-auto">
                      <Play className="w-6 h-6 text-[#D97736] translate-x-0.5" />
                    </div>
                    <h3 className="font-serif text-2xl sm:text-3xl text-[#F4EFE6]">
                      {performance.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#A39B8B] leading-relaxed">
                      This slot is ready for Gunjit Bhagwate’s official{' '}
                      {performance.platform === 'youtube' ? 'YouTube video' : 'Instagram Reel'}{' '}
                      link. Supply the performance URL below to activate the embedded player.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-5 py-2.5 text-xs font-medium rounded-lg bg-[#D97736] text-[#0B0A09] hover:bg-[#e58645] transition-colors cursor-pointer whitespace-nowrap shrink-0"
                      >
                        Supply Video Link Now
                      </button>
                      <a
                        href="https://www.instagram.com/mustberesonant/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium rounded-lg border border-[#F4EFE6]/20 text-[#F4EFE6] hover:bg-[#F4EFE6]/5 transition-colors whitespace-nowrap shrink-0"
                      >
                        <span>View @mustberesonant</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Performance Details Footer */}
            <div className="p-6 sm:p-8 space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#A39B8B]">
                <span>{performance.eventName}</span>
                <span aria-hidden="true">·</span>
                <span>{performance.venue}</span>
                <span aria-hidden="true">·</span>
                <span>{performance.duration}</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#F4EFE6]">
                {performance.title}
              </h2>
              <p className="text-sm text-[#A39B8B] leading-relaxed max-w-2xl">
                {performance.description}
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-5">
            <div>
              <h3 className="font-serif text-2xl text-[#F4EFE6]">
                Configure Spoken-Word Performance Slot
              </h3>
              <p className="text-xs text-[#A39B8B] mt-1">
                Paste any YouTube watch URL, YouTube video ID, or Instagram Reel link to embed the live performance.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#A39B8B] mb-1.5">
                  Performance Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg bg-[#0B0A09] border border-[#F4EFE6]/15 text-[#F4EFE6] focus:border-[#D97736] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-[#A39B8B] mb-1.5">
                  Platform Type
                </label>
                <select
                  value={platform}
                  onChange={(e) =>
                    setPlatform(e.target.value as 'youtube' | 'instagram')
                  }
                  className="w-full px-3.5 py-2 text-sm rounded-lg bg-[#0B0A09] border border-[#F4EFE6]/15 text-[#F4EFE6] focus:border-[#D97736] focus:outline-none"
                >
                  <option value="youtube">YouTube Video</option>
                  <option value="instagram">Instagram Reel</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#A39B8B] mb-1.5">
                  Event Name
                </label>
                <input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="e.g. Echo and Embers Live"
                  className="w-full px-3.5 py-2 text-sm rounded-lg bg-[#0B0A09] border border-[#F4EFE6]/15 text-[#F4EFE6] focus:border-[#D97736] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-[#A39B8B] mb-1.5">
                  Venue & City
                </label>
                <input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="e.g. The Habitat, Mumbai"
                  className="w-full px-3.5 py-2 text-sm rounded-lg bg-[#0B0A09] border border-[#F4EFE6]/15 text-[#F4EFE6] focus:border-[#D97736] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#A39B8B] mb-1.5">
                YouTube URL / Video ID or Instagram Reel Link
              </label>
              <input
                type="text"
                value={embedUrl}
                onChange={(e) => setEmbedUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... or https://www.instagram.com/reel/..."
                className="w-full px-3.5 py-2 text-sm rounded-lg bg-[#0B0A09] border border-[#F4EFE6]/15 text-[#F4EFE6] focus:border-[#D97736] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-[#A39B8B] mb-1.5">
                Performance Notes / Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-lg bg-[#0B0A09] border border-[#F4EFE6]/15 text-[#F4EFE6] focus:border-[#D97736] focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-xs font-medium rounded-lg border border-[#F4EFE6]/15 text-[#A39B8B] hover:text-[#F4EFE6] transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-medium rounded-lg bg-[#D97736] text-[#0B0A09] hover:bg-[#e58645] transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Check className="w-4 h-4" />
                <span>Save Performance</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
