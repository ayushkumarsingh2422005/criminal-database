"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { AppSessionUser } from "@/lib/types";
import {
  IconSearchProfile,
  IconPendingVerification,
  IconActiveMonitoring,
  IconArmsAct,
  IconNdpsAct,
  IconMurder,
  IconExtortion,
  IconDacoity,
  IconRobbery,
  IconBurglary,
  IconSnatching,
  IconTheft,
  IconVehicleTheft,
  IconExciseAct,
  IconOtherCrimes,
  IconChargeSheetUsers,
  IconRamgarhBuilding,
  IconJharkhandDistrictsPin,
  IconIndiaMapOutline,
  IconCasePoliceStation,
  IconAddressPoliceStation,
  IconMissionTarget,
  IconPillarSearch,
  IconPillarAnalysis,
  IconPillarMonitoring,
  IconPillarCoordination,
  IconPillarDetection,
  IconNavHome,
  IconNavDashboard,
  IconNavCriminals,
  IconNavVerification,
  IconNavReports,
  IconNavAdmin,
  IconNavUser,
} from "./HomeIcons";

interface HomePageViewProps {
  user?: AppSessionUser | null;
  stats?: {
    totalCriminals: number;
    withinRamgarh: number;
    otherDistricts: number;
    outsideJharkhand: number;
  };
}

const CRIME_CATEGORIES = [
  { label: "Arms Act", icon: IconArmsAct, query: "Arms Act" },
  { label: "NDPS Act", icon: IconNdpsAct, query: "NDPS Act" },
  { label: "Murder", icon: IconMurder, query: "Murder" },
  { label: "Extortion", icon: IconExtortion, query: "Extortion" },
  { label: "Dacoity", icon: IconDacoity, query: "Dacoity" },
  { label: "Robbery", icon: IconRobbery, query: "Robbery" },
  { label: "Burglary", icon: IconBurglary, query: "Burglary" },
  { label: "Snatching", icon: IconSnatching, query: "Snatching" },
  { label: "Theft", icon: IconTheft, query: "Theft" },
  { label: "Vehicle Theft", icon: IconVehicleTheft, query: "Vehicle Theft" },
  { label: "Excise Act", icon: IconExciseAct, query: "Excise Act" },
  { label: "Other Crimes", icon: IconOtherCrimes, query: "Other" },
];

export function HomePageView({
  user,
  stats = {
    totalCriminals: 1971,
    withinRamgarh: 1374,
    otherDistricts: 458,
    outsideJharkhand: 139,
  },
}: HomePageViewProps) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f1f5f9] text-slate-800 antialiased">
      {/* ────────────────── TOP POLICE NAVIGATION HEADER ────────────────── */}
      <header className="sticky top-0 z-50 w-full border-b border-[#1e3a5f]/40 bg-[#08182b] text-white shadow-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2 sm:px-6 lg:px-8">
          {/* Logo & Department Branding */}
          <Link href="/" className="flex items-center gap-3 transition hover:opacity-95">
            <div className="relative flex-shrink-0 drop-shadow">
              <Image
                src="/Jharkhand_Police_Logo_(India).svg.webp"
                alt="Jharkhand Police"
                width={60}
                height={60}
                unoptimized
                className="h-12 w-auto object-contain sm:h-14"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg font-extrabold tracking-tight text-white sm:text-xl">
                C.P. & D.W.
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 sm:text-xs">
                CRIME PREVENTION & DETECTION WING
              </span>
              <span className="text-[11px] font-extrabold uppercase tracking-wide text-amber-400 sm:text-xs">
                RAMGARH POLICE
              </span>
            </div>
          </Link>

          {/* Navigation Items */}
          <div className="flex items-center gap-2 sm:gap-4">
            <nav className="hidden items-center gap-1 md:flex">
              <Link
                href="/"
                className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-white/10"
              >
                <IconNavHome className="h-3.5 w-3.5 text-sky-400" />
                <span className="border-b-2 border-sky-400 pb-0.5">HOME</span>
              </Link>

              <Link
                href="/search"
                className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                <IconNavDashboard className="h-3.5 w-3.5 text-slate-400" />
                <span>DASHBOARD</span>
              </Link>

              <Link
                href="/criminals"
                className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                <IconNavCriminals className="h-3.5 w-3.5 text-slate-400" />
                <span>CRIMINALS</span>
              </Link>

              <Link
                href="/admin/verification"
                className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                <IconNavVerification className="h-3.5 w-3.5 text-slate-400" />
                <span>VERIFICATION</span>
              </Link>

              <Link
                href="/search"
                className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                <IconNavReports className="h-3.5 w-3.5 text-slate-400" />
                <span>REPORTS</span>
              </Link>

              <Link
                href="/admin"
                className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                <IconNavAdmin className="h-3.5 w-3.5 text-slate-400" />
                <span>ADMIN</span>
              </Link>
            </nav>

            {/* User Session & Logout / Login Pill */}
            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden text-right text-xs leading-tight sm:block">
                  <div className="font-semibold text-white">{user.email}</div>
                  <div className="text-[10px] capitalize text-sky-300">
                    {user.role} {user.policeStationName ? `· ${user.policeStationName}` : ""}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 rounded-lg border border-sky-400/30 bg-[#0f2e5a] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-sky-900 active:scale-95"
                  title="Logout"
                >
                  <IconNavUser className="h-3.5 w-3.5 text-sky-300" />
                  <span>LOGOUT</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 rounded-lg border border-sky-400/40 bg-[#0f2e5a] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-sky-900 active:scale-95"
              >
                <IconNavUser className="h-3.5 w-3.5 text-sky-300" />
                <span>LOGIN</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex overflow-x-auto border-t border-white/10 px-3 py-2 md:hidden">
          <div className="flex gap-2">
            <Link href="/" className="whitespace-nowrap rounded px-2.5 py-1 text-xs font-bold text-white bg-white/15">
              HOME
            </Link>
            <Link href="/search" className="whitespace-nowrap rounded px-2.5 py-1 text-xs font-semibold text-slate-300">
              DASHBOARD
            </Link>
            <Link href="/criminals" className="whitespace-nowrap rounded px-2.5 py-1 text-xs font-semibold text-slate-300">
              CRIMINALS
            </Link>
            <Link href="/admin/verification" className="whitespace-nowrap rounded px-2.5 py-1 text-xs font-semibold text-slate-300">
              VERIFICATION
            </Link>
            <Link href="/search" className="whitespace-nowrap rounded px-2.5 py-1 text-xs font-semibold text-slate-300">
              REPORTS
            </Link>
            <Link href="/admin" className="whitespace-nowrap rounded px-2.5 py-1 text-xs font-semibold text-slate-300">
              ADMIN
            </Link>
          </div>
        </div>
      </header>

      {/* ────────────────── HERO BANNER ────────────────── */}
      <section className="relative w-full overflow-hidden bg-[#071728] text-white">
        {/* Background photo with gradient overlays */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/ramgarh-police-building.jpeg"
            alt="Ramgarh Police Station"
            fill
            priority
            unoptimized
            className="object-cover object-top opacity-70 brightness-100 contrast-110"
          />
          {/* Keep left readable for text; leave center/right lighter so building shows */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#071728]/95 via-[#071728]/45 to-[#071728]/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071728]/70 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-between px-4 py-8 sm:px-6 md:flex-row md:py-12 lg:px-8">
          {/* Left Hero Content */}
          <div className="max-w-2xl text-left">
            <p className="text-sm font-medium tracking-wide text-slate-200 sm:text-base md:text-lg">
              From Criminal Profiling to
            </p>
            <h1 className="mt-0.5 text-3xl font-extrabold uppercase tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[42px]">
              PROACTIVE POLICING
            </h1>
            <p className="mt-1 text-base font-semibold text-[#38bdf8] sm:text-lg md:text-xl">
              Digital Criminal Monitoring Portal
            </p>

            <div className="mt-4 max-w-xl border-l-2 border-sky-400/80 pl-3.5">
              <p className="text-xs leading-relaxed text-slate-200 sm:text-sm sm:leading-relaxed">
                A secure digital platform for profiling, verification, monitoring and analysis of
                charge-sheeted criminals for effective crime prevention, faster detection and better
                inter-station coordination.
              </p>
            </div>
          </div>

          {/* Right Hero: SP / IPS Officer portrait */}
          <div className="mt-6 flex flex-shrink-0 flex-col items-center md:mt-0">
            <div className="relative">
              <div className="absolute -inset-2 rounded-2xl bg-sky-300/30 blur-xl" />
              <div className="relative overflow-hidden rounded-2xl border-2 border-amber-300 bg-[#1a3a5c] shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
                <Image
                  src="/images/ips.png"
                  alt="Superintendent of Police, Ramgarh"
                  width={280}
                  height={280}
                  priority
                  unoptimized
                  className="h-44 w-44 object-cover object-top brightness-110 contrast-105 sm:h-52 sm:w-52 lg:h-56 lg:w-56"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent px-3 pb-2.5 pt-8 text-center">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-amber-100 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] sm:text-[11px]">
                    Superintendent of Police
                  </p>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] sm:text-xs">
                    Ramgarh District
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────── MAIN BODY CONTAINER ────────────────── */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-5 sm:px-6 lg:px-8">
        {/* ── 3 QUICK ACTION CARDS ── */}
        <section className="-mt-8 relative z-20 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Card 1: Criminal Search */}
          <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 sm:h-18 sm:w-18 flex-shrink-0 items-center justify-center rounded-full bg-[#0d3460] text-white shadow-md">
                <IconSearchProfile className="h-9 w-9 sm:h-10 sm:w-10 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold tracking-wide text-slate-900">
                  CRIMINAL SEARCH
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Search & view criminal profiles and history
                </p>
              </div>
            </div>
            <div className="mt-5">
              <Link
                href="/search"
                className="inline-flex items-center justify-center rounded-md bg-[#0f2e5a] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-[#164282] active:scale-95"
              >
                <span>SEARCH NOW</span>
                <span className="ml-1.5">→</span>
              </Link>
            </div>
          </div>

          {/* Card 2: Verification Pending */}
          <div className="flex flex-col justify-between rounded-xl border border-amber-200/80 bg-[#fffdf5] p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 sm:h-18 sm:w-18 flex-shrink-0 items-center justify-center rounded-full bg-[#b47b19] text-white shadow-md">
                <IconPendingVerification className="h-9 w-9 sm:h-10 sm:w-10 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold tracking-wide text-amber-900">
                  VERIFICATION PENDING
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Cases pending dual physical verification
                </p>
              </div>
            </div>
            <div className="mt-5">
              <Link
                href="/admin/verification"
                className="inline-flex items-center justify-center rounded-md bg-[#b45309] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-[#92400e] active:scale-95"
              >
                <span>VIEW PENDING</span>
                <span className="ml-1.5">→</span>
              </Link>
            </div>
          </div>

          {/* Card 3: Active Monitoring */}
          <div className="flex flex-col justify-between rounded-xl border border-emerald-200/80 bg-[#f7fdf9] p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 sm:h-18 sm:w-18 flex-shrink-0 items-center justify-center rounded-full bg-[#1b7a3e] text-white shadow-md">
                <IconActiveMonitoring className="h-9 w-9 sm:h-10 sm:w-10 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold tracking-wide text-emerald-900">
                  ACTIVE MONITORING
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  Criminals under active monitoring & surveillance
                </p>
              </div>
            </div>
            <div className="mt-5">
              <Link
                href="/criminals"
                className="inline-flex items-center justify-center rounded-md bg-[#15803d] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-[#166534] active:scale-95"
              >
                <span>VIEW LIST</span>
                <span className="ml-1.5">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ── TWO COLUMN LOWER SECTION ── */}
        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* LEFT COLUMN: District Overview (8 cols on large screens) */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#0f2e5a] sm:text-sm">
                DISTRICT OVERVIEW (01 JAN 2021 – 31 MAR 2026)
              </h2>
            </div>

            {/* 4 Stat Boxes in a row */}
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {/* Box 1: Total Charge-Sheeted */}
              <Link
                href="/search"
                className="group flex flex-col items-center rounded-lg border border-blue-100 bg-[#f8faff] p-3 text-center transition hover:border-blue-300 hover:bg-blue-50/70 shadow-sm"
              >
                <div className="mb-1 text-blue-600 transition group-hover:scale-105">
                  <IconChargeSheetUsers className="h-11 w-11 sm:h-12 sm:w-12 text-blue-600" />
                </div>
                <div className="text-2xl font-black text-slate-900 sm:text-3xl">
                  {stats.totalCriminals.toLocaleString("en-IN")}
                </div>
                <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  TOTAL CHARGE-SHEETED CRIMINALS
                </div>
              </Link>

              {/* Box 2: Within Ramgarh */}
              <Link
                href="/search"
                className="group flex flex-col items-center rounded-lg border border-emerald-100 bg-[#f7fdf9] p-3 text-center transition hover:border-emerald-300 hover:bg-emerald-50/70 shadow-sm"
              >
                <div className="mb-1 text-emerald-600 transition group-hover:scale-105">
                  <IconRamgarhBuilding className="h-11 w-11 sm:h-12 sm:w-12 text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-slate-900 sm:text-3xl">
                  {stats.withinRamgarh.toLocaleString("en-IN")}
                </div>
                <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  WITHIN RAMGARH DISTRICT
                </div>
              </Link>

              {/* Box 3: Other Districts */}
              <Link
                href="/search"
                className="group flex flex-col items-center rounded-lg border border-purple-100 bg-[#faf5ff] p-3 text-center transition hover:border-purple-300 hover:bg-purple-50/70 shadow-sm"
              >
                <div className="mb-1 text-purple-600 transition group-hover:scale-105">
                  <IconJharkhandDistrictsPin className="h-11 w-11 sm:h-12 sm:w-12 text-purple-600" />
                </div>
                <div className="text-2xl font-black text-slate-900 sm:text-3xl">
                  {stats.otherDistricts.toLocaleString("en-IN")}
                </div>
                <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  OTHER DISTRICTS OF JHARKHAND
                </div>
              </Link>

              {/* Box 4: Outside Jharkhand */}
              <Link
                href="/search"
                className="group flex flex-col items-center rounded-lg border border-orange-100 bg-[#fff7ed] p-3 text-center transition hover:border-orange-300 hover:bg-orange-50/70 shadow-sm"
              >
                <div className="mb-1 text-orange-600 transition group-hover:scale-105">
                  {/* <IconIndiaMapOutline className="h-11 w-11 sm:h-12 sm:w-12 text-orange-600" /> */}
                  <Image
                    src="/images/india.png"
                    alt="India"
                    width={280}
                    height={280}
                    priority
                    unoptimized
                    className="h-11 w-11 sm:h-12 sm:w-12 object-contain object-top brightness-110 contrast-105"
                  />
                </div>
                <div className="text-2xl font-black text-slate-900 sm:text-3xl">
                  {stats.outsideJharkhand.toLocaleString("en-IN")}
                </div>
                <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  OUTSIDE JHARKHAND
                </div>
              </Link>
            </div>

            {/* Divider: Crime Categories Covered */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 font-bold uppercase tracking-wider text-slate-600">
                  CRIME CATEGORIES COVERED
                </span>
              </div>
            </div>

            {/* 12 Crime Category Badges (Prominent, High-Contrast & Larger) */}
            <div className="grid grid-cols-3 gap-y-5 gap-x-2 sm:grid-cols-4 md:grid-cols-6">
              {CRIME_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Link
                    key={cat.label}
                    href={`/search?caseType=${encodeURIComponent(cat.query)}`}
                    className="group flex flex-col items-center justify-center p-2 rounded-lg text-center transition hover:bg-slate-50"
                  >
                    <div className="flex h-12 w-12 items-center justify-center text-slate-900 transition duration-200 group-hover:scale-115 group-hover:text-[#0f2e5a]">
                      <Icon className="h-10 w-10 sm:h-11 sm:w-11" />
                    </div>
                    <span className="mt-1.5 text-center text-xs font-semibold text-slate-800 transition group-hover:text-[#0f2e5a] group-hover:font-bold leading-tight">
                      {cat.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: Dual Criminal Verification & Our Mission (4 cols on large screens) */}
          <div className="flex flex-col gap-4 lg:col-span-4">
            {/* DUAL CRIMINAL VERIFICATION CARD */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="bg-[#0f2e5a] px-4 py-2.5 text-center text-xs font-bold uppercase tracking-wider text-white">
                DUAL CRIMINAL VERIFICATION
              </div>
              <div className="p-5">
                {/* Diagram: Case PS + Address PS */}
                <div className="flex items-center justify-center gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-sky-50 text-[#0f2e5a] shadow-sm">
                      <IconCasePoliceStation className="h-8 w-8 text-[#0f2e5a]" />
                    </div>
                    <span className="mt-1.5 max-w-[95px] text-center text-[10px] font-bold leading-tight uppercase text-slate-800">
                      CASE POLICE STATION
                    </span>
                  </div>

                  <span className="text-2xl font-bold text-slate-400 pb-4">+</span>

                  <div className="flex flex-col items-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-sky-50 text-[#0f2e5a] shadow-sm">
                      <IconAddressPoliceStation className="h-8 w-8 text-[#0f2e5a]" />
                    </div>
                    <span className="mt-1.5 max-w-[95px] text-center text-[10px] font-bold leading-tight uppercase text-slate-800">
                      ADDRESS POLICE STATION
                    </span>
                  </div>
                </div>

                <p className="mt-4 text-center text-xs leading-relaxed text-slate-600">
                  Physical verification is ensured by the Case Police Station and the Address Police
                  Station (where the criminal resides, if different). The verification is recorded
                  digitally to maintain an updated and reliable criminal profile.
                </p>
              </div>
            </div>

            {/* OUR MISSION CARD */}
            <div className="rounded-xl border border-sky-200 bg-[#f0f9ff] p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-13 w-13 flex-shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-700 shadow-sm">
                  <IconMissionTarget className="h-8 w-8 text-sky-700" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-sky-950">
                    OUR MISSION
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-700">
                    To strengthen crime prevention and detection through verified data, digital
                    profiling, regular monitoring and timely police action.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ────────────────── 5-PILLAR FEATURE STRIP ────────────────── */}
      <section className="mt-6 w-full border-t border-slate-800 bg-[#081a30] py-6 text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-5 px-4 sm:px-6 md:grid-cols-5 lg:px-8">
          {/* Pillar 1 */}
          <div className="flex items-start gap-3">
            <IconPillarSearch className="mt-0.5 h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0 text-sky-400" />
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-white">
                QUICK IDENTIFICATION
              </h4>
              <p className="mt-0.5 text-[10px] leading-snug text-slate-300">
                Rapid identification of active criminals
              </p>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="flex items-start gap-3">
            <IconPillarAnalysis className="mt-0.5 h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0 text-sky-400" />
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-white">
                CRIMINAL ANALYSIS
              </h4>
              <p className="mt-0.5 text-[10px] leading-snug text-slate-300">
                Structured data for better investigation & analysis
              </p>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="flex items-start gap-3">
            <IconPillarMonitoring className="mt-0.5 h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0 text-sky-400" />
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-white">
                CONTINUOUS MONITORING
              </h4>
              <p className="mt-0.5 text-[10px] leading-snug text-slate-300">
                Regular verification & monitoring including bail released criminals
              </p>
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="flex items-start gap-3">
            <IconPillarCoordination className="mt-0.5 h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0 text-sky-400" />
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-white">
                INTER-STATION COORDINATION
              </h4>
              <p className="mt-0.5 text-[10px] leading-snug text-slate-300">
                Better information sharing & coordination across PS
              </p>
            </div>
          </div>

          {/* Pillar 5 */}
          <div className="col-span-2 flex items-start gap-3 md:col-span-1">
            <IconPillarDetection className="mt-0.5 h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0 text-sky-400" />
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-white">
                FASTER DETECTION
              </h4>
              <p className="mt-0.5 text-[10px] leading-snug text-slate-300">
                Support for quick detection & effective investigation
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────── POLICE PORTAL FOOTER ────────────────── */}
      <footer className="w-full border-t border-slate-900 bg-[#040e1b] py-3.5 text-slate-400">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 text-xs sm:flex-row sm:px-6 lg:px-8">
          {/* Security Tenets */}
          <div className="flex items-center gap-1.5 font-medium text-slate-300">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-3.5 w-3.5 text-sky-400"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>SECURE • STRUCTURED • CONNECTED • ACTION-ORIENTED</span>
          </div>

          {/* Authorization Notice */}
          <div className="flex items-center gap-1.5 text-slate-300">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-3.5 w-3.5 text-slate-400"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>For Authorised Police Use Only</span>
          </div>

          {/* Copyright */}
          <div className="text-slate-400">
            © Ramgarh Police | All Rights Reserved
          </div>
        </div>

        {/* ── Developer Credit Bottom Strip ── */}
        <div className="border-t border-white/5 bg-[#020710] py-2 text-center text-xs">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-2 px-4 sm:px-6 lg:px-8">
            <span className="text-slate-400">Designed &amp; Developed by</span>
            <a
              href="https://digicraft.one"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 rounded px-2 py-0.5 transition hover:bg-white/5"
            >
              <Image
                src="/images/digicraft-logo.png"
                alt="DigiCraft Innovation Pvt. Ltd."
                width={20}
                height={20}
                unoptimized
                className="h-4 w-4 rounded-full object-contain transition group-hover:scale-110"
              />
              <span className="font-semibold text-slate-200 transition group-hover:text-white">
                DigiCraft Innovation Pvt. Ltd.
              </span>
              <span className="text-[11px] text-sky-400 group-hover:underline">
                (digicraft.one)
              </span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
