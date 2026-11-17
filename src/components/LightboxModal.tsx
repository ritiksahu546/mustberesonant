import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { SafeImage } from './SafeImage';

export interface LightboxImageItem {
  src: string;
  title: string;
  caption: string;
  credit: string;
}

interface LightboxModalProps {
  item: LightboxImageItem | null;
  onClose: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({ item, onClose }) => {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 backdrop-blur-md p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full flex items-center justify-between pb-4 text-xs text-[#A39B8B]">
          <div>
            <span className="text-[#F4EFE6] font-medium">{item.title}</span>
            <span aria-hidden="true" className="mx-2">
              ·
            </span>
            <span>{item.credit}</span>
          </div>
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#F4EFE6]/20 text-[#F4EFE6] hover:bg-[#F4EFE6]/10 transition-colors cursor-pointer"
            aria-label="Close lightbox"
          >
            <span>ESC</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="w-full max-h-[75vh] overflow-hidden rounded-xl border border-[#F4EFE6]/15 bg-[#0B0A09]">
          <SafeImage
            src={item.src}
            alt={item.title}
            className="w-full h-full max-h-[75vh] object-contain mx-auto"
          />
        </div>

        <p className="mt-4 text-sm text-[#A39B8B] text-center max-w-2xl">
          {item.caption}
        </p>
      </div>
    </div>
  );
};
