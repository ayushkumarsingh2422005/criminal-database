import React from "react";

// Action Cards Icons (Prominent, High-Resolution SVGs)
export function IconSearchProfile({ className = "w-10 h-10 text-white" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Magnifying Glass Outer Rim */}
      <circle cx="21" cy="21" r="14" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      {/* Magnifying Glass Handle */}
      <path d="M31.5 31.5L43 43" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      {/* User Silhouette Inside Lens */}
      <circle cx="21" cy="17" r="4.5" fill="currentColor" />
      <path
        d="M12.5 28C13.5 23.5 16.8 22.5 21 22.5C25.2 22.5 28.5 23.5 29.5 28"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconPendingVerification({ className = "w-10 h-10 text-white" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Clipboard Body */}
      <rect x="8" y="10" width="26" height="34" rx="4" stroke="currentColor" strokeWidth="3.5" fill="none" />
      {/* Top Clip */}
      <path
        d="M16 10V6C16 4.9 16.9 4 18 4H24C25.1 4 26 4.9 26 6V10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        fill="currentColor"
        fillOpacity="0.2"
      />
      {/* Checklist Lines with Checkboxes */}
      <rect x="13" y="17" width="4" height="4" rx="1" fill="currentColor" />
      <line x1="20" y1="19" x2="29" y2="19" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <rect x="13" y="24" width="4" height="4" rx="1" fill="currentColor" />
      <line x1="20" y1="26" x2="27" y2="26" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <rect x="13" y="31" width="4" height="4" rx="1" fill="currentColor" />
      <line x1="20" y1="33" x2="25" y2="33" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      {/* Clock Badge (Pending) */}
      <circle cx="34" cy="34" r="9" fill="#92400e" stroke="currentColor" strokeWidth="3.5" />
      <path d="M34 29.5V34L37.5 37.5" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
    </svg>
  );
}

export function IconActiveMonitoring({ className = "w-10 h-10 text-white" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Profile Head */}
      <circle cx="18" cy="15" r="7" fill="currentColor" />
      {/* Profile Shoulders */}
      <path
        d="M6 35C6 28 11.5 25 18 25C21.8 25 25.2 26 27.2 28.5"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Surveillance Eye at lower right */}
      <g>
        <path
          d="M26 34C29 28.5 35 26.5 41 34C35 41.5 29 39.5 26 34Z"
          stroke="currentColor"
          strokeWidth="3.5"
          fill="currentColor"
          fillOpacity="0.25"
        />
        <circle cx="33.5" cy="34" r="3.5" fill="currentColor" />
        <circle cx="34.5" cy="33" r="1.2" fill="#15803d" />
      </g>
    </svg>
  );
}

// ────────────────── 12 CRIME CATEGORIES (HIGH DETAIL & PROMINENT) ──────────────────

export function IconArmsAct({ className = "w-9 h-9 text-[#0f2e5a]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" fill="currentColor" className={className}>
      {/* Pistol Gun Silhouette */}
      <path d="M32 13.5L20 13V11C20 9.9 19.1 9 18 9H8C6.9 9 6 9.9 6 11V14.5H2.5C2.2 14.5 2 14.7 2 15V17C2 17.3 2.2 17.5 2.5 17.5H6V19.5H8.5V17.5H19L22.5 25.5C22.9 26.4 23.8 27 24.8 27H28C29.1 27 30 26.1 30 25V22H27.5V24.2H25.2L22.2 17.5H32C32.6 17.5 33 17.1 33 16.5V14.5C33 13.9 32.6 13.5 32 13.5ZM9 12.5H17V14.5H9V12.5ZM17 21C16.2 21 15.5 20.3 15.5 19.5H17.5C17.5 19.8 17.8 20 18 20C18.2 20 18.5 19.8 18.5 19.5H19.5C19.5 20.6 18.4 21 17 21Z" />
    </svg>
  );
}

export function IconNdpsAct({ className = "w-9 h-9 text-[#0f2e5a]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" fill="currentColor" className={className}>
      {/* 7-Blade Cannabis / Narcotic Leaf */}
      <path d="M18 3C17.2 7 16.5 11.5 18 16.5C19.5 11.5 18.8 7 18 3Z" />
      <path d="M18 16.5C14.5 12.5 11 11 6.5 11C9.5 15 13 17 18 16.5Z" />
      <path d="M18 16.5C21.5 12.5 25 11 29.5 11C26.5 15 23 17 18 16.5Z" />
      <path d="M18 16.5C12.5 17 8.5 19.5 5 24.5C10.5 24 14.5 21 18 16.5Z" />
      <path d="M18 16.5C23.5 17 27.5 19.5 31 24.5C25.5 24 21.5 21 18 16.5Z" />
      <path d="M18 16.5C15 22 13 25 9 29C14 27.5 16.5 24 18 16.5Z" />
      <path d="M18 16.5C21 22 23 25 27 29C22 27.5 19.5 24 18 16.5Z" />
      <rect x="17" y="16" width="2" height="15" rx="1" />
    </svg>
  );
}

export function IconMurder({ className = "w-9 h-9 text-[#0f2e5a]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" fill="currentColor" className={className}>
      {/* Skull and Crossbones */}
      <path d="M18 3C11.9 3 7 7.9 7 14C7 18.3 9.5 22 13 23.8V28H23V23.8C26.5 22 29 18.3 29 14C29 7.9 24.1 3 18 3ZM13 17C11.6 17 10.5 15.9 10.5 14.5C10.5 13.1 11.6 12 13 12C14.4 12 15.5 13.1 15.5 14.5C15.5 15.9 14.4 17 13 17ZM18 20.5L16.5 19H19.5L18 20.5ZM23 17C21.6 17 20.5 15.9 20.5 14.5C20.5 13.1 21.6 12 23 12C24.4 12 25.5 13.1 25.5 14.5C25.5 15.9 24.4 17 23 17ZM15 24H17V26.5H15V24ZM19 24H21V26.5H19V24Z" />
      {/* Crossed Bones */}
      <path d="M4 31C3 30 3 28.5 4 27.5L8 23.5L10.5 26L6.5 30C5.8 30.7 4.7 31 4 31Z" />
      <path d="M32 31C33 30 33 28.5 32 27.5L28 23.5L25.5 26L29.5 30C30.2 30.7 31.3 31 32 31Z" />
      <path d="M4 5C3 6 3 7.5 4 8.5L8 12.5L10.5 10L6.5 6C5.8 5.3 4.7 5 4 5Z" />
      <path d="M32 5C33 6 33 7.5 32 8.5L28 12.5L25.5 10L29.5 6C30.2 5.3 31.3 5 32 5Z" />
    </svg>
  );
}

export function IconExtortion({ className = "w-9 h-9 text-[#0f2e5a]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" fill="currentColor" className={className}>
      {/* Rupee Coin in Hand / Extortion Money Bag */}
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.5" />
      {/* Rupee Symbol ₹ */}
      <path
        d="M8.5 9H15.5M8.5 11.5H14.5M8.5 9V14.5M11.5 11.5C13.2 11.5 14.5 10.5 14.5 9M11.5 14L15.5 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Open Demanding Extortion Hand */}
      <path d="M16 20H22C24.2 20 26 21.8 26 24V29H20L14 24L16 20Z" />
      <path d="M19 18L24 14L30 18V21L25 18.5L20 21V18Z" />
      <circle cx="28" cy="14" r="2.5" fill="currentColor" />
    </svg>
  );
}

export function IconDacoity({ className = "w-9 h-9 text-[#0f2e5a]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" fill="currentColor" className={className}>
      {/* Masked Bandit Face with Bandana */}
      <path d="M18 3C12 3 8 7.5 8 13.5V17C8 19 9.5 20.5 11 21L12.5 30C12.5 31.7 13.8 33 15.5 33H20.5C22.2 33 23.5 31.7 23.5 30L25 21C26.5 20.5 28 19 28 17V13.5C28 7.5 24 3 18 3ZM8.5 15H27.5V20.5H8.5V15Z" />
      {/* Eye Cutouts */}
      <ellipse cx="13.5" cy="18" rx="2.5" ry="1.8" fill="#ffffff" />
      <ellipse cx="22.5" cy="18" rx="2.5" ry="1.8" fill="#ffffff" />
      {/* Bandana Knot details */}
      <path d="M28 20L32 23L29 25L27 21Z" />
    </svg>
  );
}

export function IconRobbery({ className = "w-9 h-9 text-[#0f2e5a]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" fill="currentColor" className={className}>
      {/* Running Robber with Loot Sack over shoulder */}
      <circle cx="23" cy="6" r="3.5" />
      <path d="M11 16C11 13.8 12.8 12 15 12C16 12 16.9 12.4 17.6 13L21.5 15.5L25 14V17.5L21 19.5L19 22.5L22.5 30H19L16 24.5L13 27.5V32H10V25.5L13 21.5L11.5 20C11.2 19 11 17.8 11 16Z" />
      {/* Loot Sack */}
      <path d="M6 16C6 13.5 7.8 12 10 12C10.8 12 11.5 12.3 12 12.8L10.5 17.5C9.8 19 8.5 19 6 16Z" />
      <circle cx="8" cy="15" r="4.5" />
    </svg>
  );
}

export function IconBurglary({ className = "w-9 h-9 text-[#0f2e5a]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" fill="currentColor" className={className}>
      {/* House with Broken Lock / Intruder Entry */}
      <path d="M18 4L3 16H7V29C7 29.8 7.7 30.5 8.5 30.5H27.5C28.3 30.5 29 29.8 29 29V16H33L18 4ZM18 15C19.7 15 21 16.3 21 18V19.5H22.5V25.5H13.5V19.5H15V18C15 16.3 16.3 15 18 15ZM18 17C17.4 17 17 17.4 17 18V19.5H19V18C19 17.4 18.6 17 18 17Z" />
    </svg>
  );
}

export function IconSnatching({ className = "w-9 h-9 text-[#0f2e5a]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Snapped Necklace Chain with Splitting Links */}
      <path d="M6 11C7.5 6.5 12 3.5 18 3.5C24 3.5 28.5 6.5 30 11" strokeDasharray="3 3" />
      <circle cx="6" cy="13" r="2.2" fill="currentColor" />
      <circle cx="10" cy="18" r="2.2" fill="currentColor" />
      <circle cx="14.5" cy="21.5" r="2.2" fill="currentColor" />
      {/* Snapping Lightning Break */}
      <path d="M16 24.5L19.5 20.5" stroke="#dc2626" strokeWidth="3.5" />
      <circle cx="21.5" cy="21.5" r="2.2" fill="currentColor" />
      <circle cx="26" cy="18" r="2.2" fill="currentColor" />
      <circle cx="30" cy="13" r="2.2" fill="currentColor" />
      {/* Snapped Falling Locket */}
      <polygon points="18,27 15,32 21,32" fill="currentColor" strokeWidth="1" />
    </svg>
  );
}

export function IconTheft({ className = "w-9 h-9 text-[#0f2e5a]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" fill="currentColor" className={className}>
      {/* Classic Burglar Face with Eye Mask and Beanie */}
      <path d="M18 4C11.5 4 9 8 9 11H27C27 8 24.5 4 18 4Z" />
      <rect x="8" y="11" width="20" height="3" rx="1" />
      <path d="M9.5 15V22C9.5 26.7 13.3 30.5 18 30.5C22.7 30.5 26.5 26.7 26.5 22V15H9.5Z" />
      {/* Dark Eye Mask */}
      <path d="M10 16.5H26V21.5C26 21.5 23 23 18 23C13 23 10 21.5 10 21.5V16.5Z" fill="#0f172a" />
      {/* White Eye Slits */}
      <ellipse cx="14" cy="19" rx="2" ry="1.4" fill="#ffffff" />
      <ellipse cx="22" cy="19" rx="2" ry="1.4" fill="#ffffff" />
    </svg>
  );
}

export function IconVehicleTheft({ className = "w-9 h-9 text-[#0f2e5a]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" fill="currentColor" className={className}>
      {/* Motorcycle Silhouette */}
      <circle cx="8" cy="24" r="5" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="28" cy="24" r="5" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M8 24L14 14H21L25 24" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M14 14L19 24H28" fill="none" stroke="currentColor" strokeWidth="2.8" />
      <path d="M21 14L24 10H27" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <circle cx="18" cy="13" r="2.2" />
      <path d="M16 19H23" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  );
}

export function IconExciseAct({ className = "w-9 h-9 text-[#0f2e5a]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" fill="currentColor" className={className}>
      {/* Liquor Bottle Silhouette */}
      <path d="M16 3H20V7H16V3Z" />
      <path d="M15 7H21L23 12V31C23 31.8 22.3 32.5 21.5 32.5H14.5C13.7 32.5 13 31.8 13 31V12L15 7Z" />
      <rect x="15.5" y="16" width="5" height="8" rx="1" fill="#ffffff" />
    </svg>
  );
}

export function IconOtherCrimes({ className = "w-9 h-9 text-[#0f2e5a]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" fill="currentColor" className={className}>
      <circle cx="18" cy="18" r="15" />
      <circle cx="11" cy="18" r="2.4" fill="#ffffff" />
      <circle cx="18" cy="18" r="2.4" fill="#ffffff" />
      <circle cx="25" cy="18" r="2.4" fill="#ffffff" />
    </svg>
  );
}

// ────────────────── DISTRICT OVERVIEW 4 COUNTERS ICONS (LARGE & VIBRANT) ──────────────────

export function IconChargeSheetUsers({ className = "w-12 h-12 text-blue-600" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="currentColor" className={className}>
      {/* Primary Center User */}
      <circle cx="24" cy="14" r="6" />
      <path d="M12 32C12 26.5 16 23 24 23C32 23 36 26.5 36 32V35H12V32Z" />
      {/* Left User */}
      <circle cx="11" cy="17" r="4.5" opacity="0.8" />
      <path d="M3 33C3 29 6 26.5 11 26.5C12.5 26.5 13.9 26.8 15.1 27.4C14.3 28.7 13.8 30.2 13.8 32V35H3V33Z" opacity="0.8" />
      {/* Right User */}
      <circle cx="37" cy="17" r="4.5" opacity="0.8" />
      <path d="M37 26.5C42 26.5 45 29 45 33V35H34.2V32C34.2 30.2 33.7 28.7 32.9 27.4C34.1 26.8 35.5 26.5 37 26.5Z" opacity="0.8" />
    </svg>
  );
}

export function IconRamgarhBuilding({ className = "w-12 h-12 text-emerald-600" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="currentColor" className={className}>
      {/* Classical Government / Police Headquarters with Pediment & Columns */}
      <path d="M24 4L4 14V18H44V14L24 4ZM8 21V36H13V21H8ZM18 21V36H23V21H18ZM28 21V36H33V21H28ZM38 21V36H43V21H38ZM3 39V43H45V39H3Z" />
    </svg>
  );
}

export function IconJharkhandDistrictsPin({ className = "w-12 h-12 text-purple-600" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="currentColor" className={className}>
      {/* Location Pin with Hollow Target Center */}
      <path d="M24 4C15.2 4 8 11.2 8 20C8 31.5 24 44 24 44C24 44 40 31.5 40 20C40 11.2 32.8 4 24 4ZM24 26C20.7 26 18 23.3 18 20C18 16.7 20.7 14 24 14C27.3 14 30 16.7 30 20C30 23.3 27.3 26 24 26Z" />
    </svg>
  );
}

export function IconIndiaMapOutline({ className = "w-12 h-12 text-orange-600" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="currentColor" className={className}>
      {/* Recognizable Stylized India Map Silhouette */}
      <path d="M20 4L26 6L28 10L32 12L28 16L30 20L36 20L38 24L34 28L32 34L28 38L24 44L20 38L18 32L12 28L10 22L14 18L16 12L20 4Z" />
      <circle cx="24" cy="24" r="3" fill="#ffffff" opacity="0.6" />
    </svg>
  );
}

// ────────────────── DUAL VERIFICATION & MISSION (LARGE & CLEAR) ──────────────────

export function IconCasePoliceStation({ className = "w-10 h-10 text-[#0f2e5a]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" fill="currentColor" className={className}>
      {/* Police Station with Police Badge Emblem */}
      <path d="M18 3L5 9V17C5 25 10.5 31.5 18 33C25.5 31.5 31 25 31 17V9L18 3ZM16 11H20V14H16V11ZM20 25H16V16H20V25Z" />
    </svg>
  );
}

export function IconAddressPoliceStation({ className = "w-10 h-10 text-[#0f2e5a]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" fill="currentColor" className={className}>
      {/* Address Station Pin with Surveillance Eye */}
      <path d="M18 3C12.5 3 8 7.5 8 13C8 20.5 18 31 18 31C18 31 28 20.5 28 13C28 7.5 23.5 3 18 3ZM18 18C15.2 18 13 15.8 13 13C13 10.2 15.2 8 18 8C20.8 8 23 10.2 23 13C23 15.8 20.8 18 18 18Z" />
      <circle cx="18" cy="13" r="2.5" fill="#ffffff" />
    </svg>
  );
}

export function IconMissionTarget({ className = "w-12 h-12 text-sky-600" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="24" cy="24" r="18" />
      <circle cx="24" cy="24" r="11" />
      <circle cx="24" cy="24" r="4" fill="currentColor" />
      {/* Arrow */}
      <path d="M37 11L27 21" strokeWidth="4" />
      <path d="M32 11H37V16" strokeWidth="4" />
    </svg>
  );
}

// ────────────────── 5 PILLARS FEATURE STRIP (LARGE & BOLD) ──────────────────

export function IconPillarSearch({ className = "w-8 h-8 text-sky-400" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="4" y="4" width="16" height="20" rx="3" />
      <line x1="8" y1="9" x2="14" y2="9" />
      <line x1="8" y1="14" x2="14" y2="14" />
      <circle cx="21" cy="21" r="5" fill="#081a30" />
      <line x1="25" y1="25" x2="29" y2="29" strokeWidth="3" />
    </svg>
  );
}

export function IconPillarAnalysis({ className = "w-8 h-8 text-sky-400" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="24" y1="26" x2="24" y2="14" strokeWidth="3" />
      <line x1="16" y1="26" x2="16" y2="8" strokeWidth="3" />
      <line x1="8" y1="26" x2="8" y2="18" strokeWidth="3" />
      <path d="M5 14L14 7L20 12L28 4" strokeWidth="3" />
      <polyline points="24 4 28 4 28 8" strokeWidth="3" />
    </svg>
  );
}

export function IconPillarMonitoring({ className = "w-8 h-8 text-sky-400" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="16" cy="16" r="4" fill="currentColor" />
      <path d="M3 16C6 9 11 5 16 5C21 5 26 9 29 16C26 23 21 27 16 27C11 27 6 23 3 16Z" />
    </svg>
  );
}

export function IconPillarCoordination({ className = "w-8 h-8 text-sky-400" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M24 15V8a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h5" />
      <rect x="11" y="13" width="18" height="14" rx="3" />
      <path d="M16 20l3 3 5-5" strokeWidth="3" />
    </svg>
  );
}

export function IconPillarDetection({ className = "w-8 h-8 text-sky-400" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" className={className}>
      <path d="M17 2L5 18H16L15 30L27 14H16L17 2Z" />
    </svg>
  );
}

// ────────────────── NAV HEADER ICONS ──────────────────

export function IconNavHome({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

export function IconNavDashboard({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
      <line x1="8" y1="16" x2="8" y2="16.01" />
      <line x1="16" y1="16" x2="16" y2="16.01" />
    </svg>
  );
}

export function IconNavCriminals({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export function IconNavVerification({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}

export function IconNavReports({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
      <path d="M4 11L11 5L15 9L21 3" strokeWidth="2" />
    </svg>
  );
}

export function IconNavAdmin({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}

export function IconNavUser({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
