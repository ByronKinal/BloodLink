export function HeroBg() {
  const barcodeStripes = [
    [0,3],[5,1],[8,4],[14,1],[17,2],[21,5],[28,1],[31,3],
    [36,2],[40,1],[43,4],[49,2],[53,1],[56,3],[61,2],[65,1],[68,4],
  ]

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1600"
      height="700"
      viewBox="0 0 1600 700"
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMin slice"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="bloodFill" cx="50%" cy="25%" r="75%">
          <stop offset="0%"   stopColor="#CC1428" />
          <stop offset="100%" stopColor="#6A0010" />
        </radialGradient>
        <radialGradient id="bagShine" cx="30%" cy="20%" r="50%">
          <stop offset="0%"   stopColor="rgba(255,100,100,0.4)" />
          <stop offset="100%" stopColor="rgba(255,100,100,0)" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="14" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="bigblur"><feGaussianBlur stdDeviation="30" /></filter>
        <filter id="medblur"><feGaussianBlur stdDeviation="5" /></filter>
        <filter id="dropShadow">
          <feDropShadow dx="0" dy="8" stdDeviation="20" floodColor="#D42040" floodOpacity="0.5" />
        </filter>
        <clipPath id="bagClip">
          <rect x="920" y="70" width="280" height="380" rx="26" />
        </clipPath>
      </defs>

      {/* Atmospheric red glow — centred on the bag side */}
      <ellipse cx="1070" cy="300" rx="380" ry="340" fill="#C01030" fillOpacity="0.22" filter="url(#bigblur)" />
      <ellipse cx="1070" cy="250" rx="220" ry="200" fill="#D42040" fillOpacity="0.18" filter="url(#bigblur)" />
      <ellipse cx="1070" cy="200" rx="130" ry="120" fill="#FF2040" fillOpacity="0.10" filter="url(#bigblur)" />

      {/* ── POLE & HOOK ── */}
      <rect x="1148" y="0" width="9" height="700" fill="#2A1515" rx="4.5" opacity="0.9" />
      <rect x="1020" y="18" width="150" height="10"  fill="#2A1515" rx="5"   opacity="0.9" />

      <path d="M1152 18 Q1152 -16 1170 -16 Q1190 -16 1190 2"
        stroke="#C8942A" strokeWidth="4.5" fill="none" strokeLinecap="round" filter="url(#glow)" />
      <path d="M1152 18 Q1152 -16 1170 -16 Q1190 -16 1190 2"
        stroke="#E8B040" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" />

      {/* ── BLOOD BAG ── */}
      {/* Outer glow */}
      <rect x="908" y="58" width="304" height="404" rx="30" fill="#C01030" fillOpacity="0.35" filter="url(#bigblur)" />

      {/* Bag border + body */}
      <rect x="918" y="68" width="284" height="384" rx="26" fill="#0F0505" stroke="#C01030" strokeWidth="2" filter="url(#dropShadow)" />

      {/* Blood liquid */}
      <rect x="918" y="68" width="284" height="384" rx="26" fill="url(#bloodFill)" fillOpacity="0.88" clipPath="url(#bagClip)" />

      {/* Liquid surface wave */}
      <path d="M920 175 Q970 158 1030 172 Q1090 186 1150 170 Q1185 160 1200 168 L1200 70 L920 70 Z"
        fill="#DD1835" fillOpacity="0.35" clipPath="url(#bagClip)" />

      {/* Shine layer */}
      <rect x="918" y="68" width="284" height="384" rx="26" fill="url(#bagShine)" clipPath="url(#bagClip)" />

      {/* Stroke outline */}
      <rect x="918" y="68" width="284" height="384" rx="26" fill="none" stroke="#FF3050" strokeWidth="1" opacity="0.4" />

      {/* Inner seam */}
      <rect x="930" y="80" width="260" height="360" rx="20" fill="none" stroke="rgba(220,50,70,0.25)" strokeWidth="1" />

      {/* Label area */}
      <rect x="948" y="185" width="224" height="180" rx="12"
        fill="rgba(250,245,238,0.10)" stroke="rgba(200,148,42,0.55)" strokeWidth="1.5" />

      {/* Cross symbol */}
      <rect x="964" y="200" width="28" height="10" rx="3" fill="#C8942A" opacity="0.95" />
      <rect x="969" y="195" width="10" height="22" rx="3" fill="#C8942A" opacity="0.95" transform="translate(4,0)" />

      {/* Blood type badge */}
      <rect x="1002" y="194" width="76" height="38" rx="9" fill="#8A0C1E" stroke="rgba(255,204,213,0.3)" strokeWidth="1" />
      <text x="1040" y="219" fontFamily="Georgia,serif" fontSize="24" fontWeight="bold" fill="#FFCCD5" textAnchor="middle">O+</text>

      {/* Label lines */}
      <rect x="964" y="246" width="190" height="5" rx="2.5" fill="rgba(250,245,238,0.35)" />
      <rect x="964" y="258" width="148" height="4" rx="2"   fill="rgba(250,245,238,0.22)" />
      <rect x="964" y="270" width="168" height="4" rx="2"   fill="rgba(250,245,238,0.22)" />
      <rect x="964" y="282" width="112" height="4" rx="2"   fill="rgba(250,245,238,0.18)" />

      {/* Barcode */}
      <g transform="translate(964,302)" opacity="0.45">
        {barcodeStripes.map(([x, w], i) => (
          <rect key={i} x={x} y="0" width={w} height="26" fill="#FAF5EE" />
        ))}
        <text x="0" y="38" fontSize="9" fill="rgba(250,245,238,0.5)" fontFamily="monospace">HV-2026-0001-O+</text>
      </g>

      {/* Tube connectors */}
      <rect x="978"  y="452" width="20" height="36" rx="5" fill="#2A1515" stroke="#3A2020" strokeWidth="1" />
      <rect x="1030" y="452" width="20" height="36" rx="5" fill="#2A1515" stroke="#3A2020" strokeWidth="1" />
      <rect x="1082" y="452" width="20" height="36" rx="5" fill="#2A1515" stroke="#3A2020" strokeWidth="1" />

      {/* Tube */}
      <path d="M1040 488 Q1040 555 1068 600 Q1096 645 1096 700"
        stroke="#C8942A" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.8" />
      <path d="M1040 488 Q1040 555 1068 600 Q1096 645 1096 700"
        stroke="#9B0A1E" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6" />

      {/* Drip drops */}
      <ellipse cx="1050" cy="530" rx="7"  ry="10" fill="#A00A1E" fillOpacity="0.85" filter="url(#medblur)" />
      <ellipse cx="1062" cy="568" rx="5"  ry="8"  fill="#A00A1E" fillOpacity="0.65" filter="url(#medblur)" />
      <ellipse cx="1074" cy="600" rx="4"  ry="6"  fill="#A00A1E" fillOpacity="0.45" />

      {/* ── FLOATING BLOOD CELLS ── */}
      {/* Large 1 */}
      <ellipse cx="800" cy="190" rx="30" ry="21" fill="#B80020" fillOpacity="0.72" filter="url(#medblur)" />
      <ellipse cx="800" cy="190" rx="24" ry="16" fill="none" stroke="#E02040" strokeWidth="1.5" />
      <ellipse cx="800" cy="190" rx="11" ry="7"  fill="#7A0010" fillOpacity="0.55" />

      {/* Large 2 */}
      <ellipse cx="720" cy="490" rx="25" ry="18" fill="#B80020" fillOpacity="0.65" filter="url(#medblur)" />
      <ellipse cx="720" cy="490" rx="20" ry="14" fill="none" stroke="#D42040" strokeWidth="1.2" />

      {/* Large 3 */}
      <ellipse cx="1440" cy="400" rx="28" ry="20" fill="#B80020" fillOpacity="0.60" filter="url(#medblur)" />
      <ellipse cx="1440" cy="400" rx="22" ry="15" fill="none" stroke="#D42040" strokeWidth="1.2" />

      {/* Medium */}
      <ellipse cx="1500" cy="180" rx="22" ry="16" fill="#A80020" fillOpacity="0.55" filter="url(#medblur)" />
      <ellipse cx="640"  cy="155" rx="17" ry="12" fill="#A00018" fillOpacity="0.60" />
      <ellipse cx="640"  cy="155" rx="12" ry="8"  fill="none" stroke="#C02030" strokeWidth="1" />
      <ellipse cx="1380" cy="130" rx="15" ry="10" fill="#A00018" fillOpacity="0.55" />
      <ellipse cx="780"  cy="580" rx="16" ry="11" fill="#A00018" fillOpacity="0.50" />
      <ellipse cx="1520" cy="560" rx="14" ry="10" fill="#900018" fillOpacity="0.45" />

      {/* ── HEARTBEAT LINE ── */}
      <g opacity="0.20" transform="translate(0,490)">
        <polyline
          points="0,60 90,60 150,60 190,6 224,114 258,60 340,60 410,60 460,60 500,14 534,106 568,60 660,60 760,60 810,60 852,24 886,96 920,60 1010,60 1110,60 1162,60 1204,36 1238,84 1272,60 1370,60 1490,60 1534,46 1566,74 1598,60 1600,60"
          stroke="#C8942A" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"
        />
      </g>
    </svg>
  )
}
