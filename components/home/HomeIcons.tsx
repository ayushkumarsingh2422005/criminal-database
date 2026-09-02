import React from "react";
import {
  FaGun,
  FaCannabis,
  FaSkullCrossbones,
  FaHandHoldingDollar,
  FaMask,
  FaHouseLock,
  FaLinkSlash,
  FaUserSecret,
  FaMotorcycle,
  FaWineBottle,
  FaEllipsis,
  FaUsers,
  FaBuildingColumns,
  FaLocationDot,
  FaMapLocationDot,
  FaBuildingShield,
  FaLocationCrosshairs,
  FaBullseye,
  FaIdCardClip,
  FaChartLine,
  FaEye,
  FaHandshake,
  FaBoltLightning,
  FaHouse,
  FaSquareCheck,
  FaChartBar,
  FaUser,
} from "react-icons/fa6";
import { GiRobber, GiBandit, GiPistolGun } from "react-icons/gi";
import { TbUserSearch, TbEyeSearch, TbMapPinSearch } from "react-icons/tb";
import { MdPendingActions, MdDashboard } from "react-icons/md";
import { HiMiniEllipsisHorizontalCircle } from "react-icons/hi2";

// ─────────────────────────────────────────────────────────────────────────────
// 3 QUICK ACTION CARDS ICONS (Large, crisp from react-icons)
// ─────────────────────────────────────────────────────────────────────────────

export function IconSearchProfile({ className = "w-10 h-10 text-white", style }: { className?: string; style?: React.CSSProperties }) {
  return <TbUserSearch className={className} style={style} />;
}

export function IconPendingVerification({ className = "w-10 h-10 text-white", style }: { className?: string; style?: React.CSSProperties }) {
  return <MdPendingActions className={className} style={style} />;
}

export function IconActiveMonitoring({ className = "w-10 h-10 text-white", style }: { className?: string; style?: React.CSSProperties }) {
  return <TbEyeSearch className={className} style={style} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// 12 CRIME CATEGORIES (Prominent, High-Resolution Silhouettes from react-icons)
// ─────────────────────────────────────────────────────────────────────────────

export function IconArmsAct({ className = "w-10 h-10 text-slate-900", style }: { className?: string; style?: React.CSSProperties }) {
  return <GiPistolGun className={className} style={style} />;
}

export function IconNdpsAct({ className = "w-10 h-10 text-slate-900", style }: { className?: string; style?: React.CSSProperties }) {
  return <FaCannabis className={className} style={style} />;
}

export function IconMurder({ className = "w-10 h-10 text-slate-900", style }: { className?: string; style?: React.CSSProperties }) {
  return <FaSkullCrossbones className={className} style={style} />;
}

export function IconExtortion({ className = "w-10 h-10 text-slate-900", style }: { className?: string; style?: React.CSSProperties }) {
  return <FaHandHoldingDollar className={className} style={style} />;
}

export function IconDacoity({ className = "w-10 h-10 text-slate-900", style }: { className?: string; style?: React.CSSProperties }) {
  return <GiBandit className={className} style={style} />;
}

export function IconRobbery({ className = "w-10 h-10 text-slate-900", style }: { className?: string; style?: React.CSSProperties }) {
  return <GiRobber className={className} style={style} />;
}

export function IconBurglary({ className = "w-10 h-10 text-slate-900", style }: { className?: string; style?: React.CSSProperties }) {
  return <FaHouseLock className={className} style={style} />;
}

export function IconSnatching({ className = "w-10 h-10 text-slate-900", style }: { className?: string; style?: React.CSSProperties }) {
  return <FaLinkSlash className={className} style={style} />;
}

export function IconTheft({ className = "w-10 h-10 text-slate-900", style }: { className?: string; style?: React.CSSProperties }) {
  return <FaUserSecret className={className} style={style} />;
}

export function IconVehicleTheft({ className = "w-10 h-10 text-slate-900", style }: { className?: string; style?: React.CSSProperties }) {
  return <FaMotorcycle className={className} style={style} />;
}

export function IconExciseAct({ className = "w-10 h-10 text-slate-900", style }: { className?: string; style?: React.CSSProperties }) {
  return <FaWineBottle className={className} style={style} />;
}

export function IconOtherCrimes({ className = "w-10 h-10 text-slate-900", style }: { className?: string; style?: React.CSSProperties }) {
  return <HiMiniEllipsisHorizontalCircle className={className} style={style} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// DISTRICT OVERVIEW 4 COUNTERS (react-icons)
// ─────────────────────────────────────────────────────────────────────────────

export function IconChargeSheetUsers({ className = "w-12 h-12 text-blue-600", style }: { className?: string; style?: React.CSSProperties }) {
  return <FaUsers className={className} style={style} />;
}

export function IconRamgarhBuilding({ className = "w-12 h-12 text-emerald-600", style }: { className?: string; style?: React.CSSProperties }) {
  return <FaBuildingColumns className={className} style={style} />;
}

export function IconJharkhandDistrictsPin({ className = "w-12 h-12 text-purple-600", style }: { className?: string; style?: React.CSSProperties }) {
  return <FaLocationDot className={className} style={style} />;
}

export function IconIndiaMapOutline({ className = "w-12 h-12 text-orange-600", style }: { className?: string; style?: React.CSSProperties }) {
  // Combines high-fidelity recognizable India geography with react-icons fallback
  return (
    <svg viewBox="0 0 48 48" fill="currentColor" className={className} style={style}>
      <path d="M20 4L26 6L28 10L32 12L28 16L30 20L36 20L38 24L34 28L32 34L28 38L24 44L20 38L18 32L12 28L10 22L14 18L16 12L20 4Z" />
      <circle cx="24" cy="24" r="3.5" fill="#ffffff" opacity="0.75" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DUAL VERIFICATION & MISSION (react-icons)
// ─────────────────────────────────────────────────────────────────────────────

export function IconCasePoliceStation({ className = "w-12 h-12 text-[#0f2e5a]", style }: { className?: string; style?: React.CSSProperties }) {
  return <FaBuildingShield className={className} style={style} />;
}

export function IconAddressPoliceStation({ className = "w-12 h-12 text-[#0f2e5a]", style }: { className?: string; style?: React.CSSProperties }) {
  return <TbMapPinSearch className={className} style={style} />;
}

export function IconMissionTarget({ className = "w-12 h-12 text-sky-600", style }: { className?: string; style?: React.CSSProperties }) {
  return <FaBullseye className={className} style={style} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5 PILLARS FEATURE STRIP (react-icons)
// ─────────────────────────────────────────────────────────────────────────────

export function IconPillarSearch({ className = "w-8 h-8 text-sky-400", style }: { className?: string; style?: React.CSSProperties }) {
  return <FaIdCardClip className={className} style={style} />;
}

export function IconPillarAnalysis({ className = "w-8 h-8 text-sky-400", style }: { className?: string; style?: React.CSSProperties }) {
  return <FaChartLine className={className} style={style} />;
}

export function IconPillarMonitoring({ className = "w-8 h-8 text-sky-400", style }: { className?: string; style?: React.CSSProperties }) {
  return <FaEye className={className} style={style} />;
}

export function IconPillarCoordination({ className = "w-8 h-8 text-sky-400", style }: { className?: string; style?: React.CSSProperties }) {
  return <FaHandshake className={className} style={style} />;
}

export function IconPillarDetection({ className = "w-8 h-8 text-sky-400", style }: { className?: string; style?: React.CSSProperties }) {
  return <FaBoltLightning className={className} style={style} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// NAVIGATION HEADER ICONS (react-icons)
// ─────────────────────────────────────────────────────────────────────────────

export function IconNavHome({ className = "w-4 h-4", style }: { className?: string; style?: React.CSSProperties }) {
  return <FaHouse className={className} style={style} />;
}

export function IconNavDashboard({ className = "w-4 h-4", style }: { className?: string; style?: React.CSSProperties }) {
  return <MdDashboard className={className} style={style} />;
}

export function IconNavCriminals({ className = "w-4 h-4", style }: { className?: string; style?: React.CSSProperties }) {
  return <FaUsers className={className} style={style} />;
}

export function IconNavVerification({ className = "w-4 h-4", style }: { className?: string; style?: React.CSSProperties }) {
  return <FaSquareCheck className={className} style={style} />;
}

export function IconNavReports({ className = "w-4 h-4", style }: { className?: string; style?: React.CSSProperties }) {
  return <FaChartBar className={className} style={style} />;
}

export function IconNavAdmin({ className = "w-4 h-4", style }: { className?: string; style?: React.CSSProperties }) {
  return <FaBuildingColumns className={className} style={style} />;
}

export function IconNavUser({ className = "w-4 h-4", style }: { className?: string; style?: React.CSSProperties }) {
  return <FaUser className={className} style={style} />;
}
