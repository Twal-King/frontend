import { Link } from 'react-router-dom';

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 px-4 py-5 group">
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4A7CFF" />
            <stop offset="100%" stopColor="#7B5CFF" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="8" fill="url(#logo-grad)" />
        <text
          x="16"
          y="22"
          textAnchor="middle"
          fill="white"
          fontSize="18"
          fontWeight="700"
          fontFamily="Inter, system-ui, sans-serif"
          letterSpacing="-0.5"
        >
          TK
        </text>
      </svg>
      <span
        className="text-lg font-bold tracking-tight text-primary group-hover:text-accent transition-colors"
        style={{ fontFamily: "'Inter', system-ui, sans-serif", letterSpacing: '-0.03em' }}
      >
        Twal-King
      </span>
    </Link>
  );
}
