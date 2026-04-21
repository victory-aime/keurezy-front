import { useThemeColors } from '_theme/useThemeColors';

// ---------------------------------------------------------------------------
// Mini UI previews — SVG mockups inside each card
// ---------------------------------------------------------------------------

/** Light mode mockup */
export function LightPreview({ color }: { color: string }) {
  const { hexToRGB } = useThemeColors();
  return (
    <svg
      viewBox="0 0 88 62"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', borderRadius: 8 }}
    >
      {/* background */}
      <rect width="88" height="62" fill="#F8F9FB" rx="8" />
      {/* left sidebar */}
      <rect width="22" height="62" fill="#EDEEF2" rx="0" />
      <rect x="4" y="8" width="14" height="14" rx="3" fill={color} />
      {/* nav items */}
      <rect x="4" y="27" width="14" height="3" rx="1.5" fill={hexToRGB(500, 0.15)} />
      <rect x="4" y="33" width="14" height="3" rx="1.5" fill={hexToRGB(500, 0.15)} />
      <rect x="4" y="39" width="14" height="3" rx="1.5" fill={hexToRGB(500, 0.15)} />
      {/* dot active */}
      <circle cx="19" cy="28.5" r="1.5" fill={color} />
      {/* main content */}
      <rect x="28" y="8" width="32" height="4" rx="2" fill="#D1D5DB" />
      <rect x="28" y="16" width="24" height="3" rx="1.5" fill="#E5E7EB" />
      <rect x="28" y="22" width="28" height="3" rx="1.5" fill="#E5E7EB" />
      {/* card */}
      <rect x="28" y="30" width="52" height="22" rx="4" fill="white" />
      <rect x="32" y="35" width="8" height="8" rx="2" fill={hexToRGB(500, 0.15)} />
      <rect x="44" y="36" width="20" height="2.5" rx="1.2" fill="#D1D5DB" />
      <rect x="44" y="41" width="14" height="2" rx="1" fill="#E5E7EB" />
      {/* badge */}
      <rect x="64" y="35" width="12" height="5" rx="2.5" fill={color} />
    </svg>
  );
}

/** Dark mode mockup */
export function DarkPreview({ color }: { color: string }) {
  const { hexToRGB } = useThemeColors();
  return (
    <svg
      viewBox="0 0 88 62"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', borderRadius: 8 }}
    >
      <rect width="88" height="62" fill="#18181b" rx="8" />
      {/* sidebar */}
      <rect width="22" height="62" fill="#27272a" />
      <rect x="4" y="8" width="14" height="14" rx="3" fill={color} />
      <rect x="4" y="27" width="14" height="3" rx="1.5" fill={hexToRGB(400, 0.35)} />
      <rect x="4" y="33" width="14" height="3" rx="1.5" fill={hexToRGB(100, 0.12)} />
      <rect x="4" y="39" width="14" height="3" rx="1.5" fill={hexToRGB(100, 0.12)} />
      <circle cx="19" cy="28.5" r="1.5" fill={color} />
      {/* content */}
      <rect x="28" y="8" width="32" height="4" rx="2" fill="#3f3f46" />
      <rect x="28" y="16" width="24" height="3" rx="1.5" fill="#52525b" />
      <rect x="28" y="22" width="28" height="3" rx="1.5" fill="#52525b" />
      {/* card */}
      <rect x="28" y="30" width="52" height="22" rx="4" fill="#27272a" />
      <rect x="32" y="35" width="8" height="8" rx="2" fill={hexToRGB(500, 0.3)} />
      <rect x="44" y="36" width="20" height="2.5" rx="1.2" fill="#3f3f46" />
      <rect x="44" y="41" width="14" height="2" rx="1" fill="#52525b" />
      <rect x="64" y="35" width="12" height="5" rx="2.5" fill={color} />
    </svg>
  );
}

/** Auto mode mockup — split half light / half dark */
export function AutoPreview({ color }: { color: string }) {
  const { hexToRGB } = useThemeColors();
  return (
    <svg
      viewBox="0 0 88 62"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', borderRadius: 8 }}
    >
      <defs>
        <clipPath id="left-half">
          <rect width="44" height="62" />
        </clipPath>
        <clipPath id="right-half">
          <rect x="44" width="44" height="62" />
        </clipPath>
      </defs>

      {/* Light side */}
      <g clipPath="url(#left-half)">
        <rect width="88" height="62" fill="#F8F9FB" rx="8" />
        <rect width="22" height="62" fill="#EDEEF2" />
        <rect x="4" y="8" width="14" height="14" rx="3" fill={color} />
        <rect x="4" y="27" width="14" height="3" rx="1.5" fill={hexToRGB(500, 0.25)} />
        <rect x="4" y="33" width="14" height="3" rx="1.5" fill={hexToRGB(500, 0.15)} />
        <circle cx="19" cy="28.5" r="1.5" fill={color} />
        <rect x="28" y="8" width="12" height="4" rx="2" fill="#D1D5DB" />
        <rect x="28" y="16" width="10" height="3" rx="1.5" fill="#E5E7EB" />
        <rect x="28" y="30" width="16" height="22" rx="4" fill="white" />
        <rect x="32" y="35" width="8" height="8" rx="2" fill={hexToRGB(500, 0.2)} />
      </g>

      {/* Dark side */}
      <g clipPath="url(#right-half)">
        <rect x="44" width="44" height="62" fill="#18181b" />
        <rect x="44" y="8" width="20" height="4" rx="2" fill="#3f3f46" />
        <rect x="44" y="16" width="14" height="3" rx="1.5" fill="#52525b" />
        <rect x="44" y="30" width="36" height="22" rx="4" fill="#27272a" />
        <rect x="48" y="35" width="8" height="8" rx="2" fill={hexToRGB(500, 0.3)} />
        <rect x="60" y="36" width="16" height="2.5" rx="1.2" fill="#3f3f46" />
        <rect x="60" y="41" width="10" height="2" rx="1" fill="#52525b" />
        <rect x="74" y="35" width="10" height="5" rx="2.5" fill={color} />
      </g>

      {/* Divider line */}
      <line x1="44" y1="0" x2="44" y2="62" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
    </svg>
  );
}
