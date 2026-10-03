import Link from "next/link";

interface VibeMartLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  height?: number;
  showText?: boolean;
}

export function VibeMartLogo({ className = "", size = 'md', height, showText = true }: VibeMartLogoProps) {
  const iconHeight = height || (size === 'sm' ? 24 : size === 'lg' ? 42 : 32);
  const textSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl';

  return (
    <Link href="/" className={`inline-flex items-center gap-2 group ${className}`}>
      {/* High Precision Vector SVG Icon */}
      <svg
        height={iconHeight}
        viewBox="0 0 60 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-auto shrink-0 drop-shadow-2xs group-hover:scale-105 transition-transform"
      >
        {/* Blue V Shape */}
        <path
          d="M 13 8 L 30 40 L 47 8"
          stroke="#0284c7"
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Green Infinity Loop Ribbon */}
        <path
          d="M 7 26 C 7 16 20 16 30 26 C 40 36 53 36 53 26 C 53 16 40 16 30 26 C 20 36 7 36 7 26 Z"
          stroke="#34d399"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>

      {/* Text Branding */}
      {showText && (
        <span className={`font-black tracking-tight ${textSize} flex items-center leading-none`}>
          <span className="text-[#0284c7]">Vibe</span>
          <span className="text-[#1e293b]">Mart</span>
        </span>
      )}
    </Link>
  );
}
