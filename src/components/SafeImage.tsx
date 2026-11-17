import React, { useState } from 'react';
import { Feather } from 'lucide-react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  fallbackTitle,
  className = '',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#1A1613] via-[#12100E] to-[#0B0A09] border border-[#F4EFE6]/10 p-6 text-center ${className}`}
        role="img"
        aria-label={alt || fallbackTitle || 'Editorial artwork'}
      >
        <Feather className="w-6 h-6 text-[#D97736]/70 mb-3 stroke-[1.25]" />
        <span className="font-serif text-sm tracking-wide text-[#F4EFE6]/80">
          {fallbackTitle || alt || 'MUST BE RESONANT'}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || 'Gunjit Bhagwate editorial visual'}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
      {...props}
    />
  );
};
