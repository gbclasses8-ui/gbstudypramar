/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Bell,
  X,
  Search,
  ExternalLink,
  ChevronRight,
  ArrowLeft,
  BookOpen,
  Send,
  MessageCircle,
  Sparkles,
  CheckCircle2,
  Share2,
  Check,
  Flame,
  Award
} from 'lucide-react';
import rawData from './data.json';
import { AppData, Subject } from './types.ts';

const data = rawData as unknown as AppData;
const course = data.courses[0];

const APP_NAME = "GB STUDY";
const TELEGRAM_URL = "https://t.me/GBFreestudy";
const WHATSAPP_URL = "https://whatsapp.com/channel/0029VbE9qxbLdQel3z7cMd1W";
const LOGO_SRC = "/logo.png";
const LOGO_FALLBACK = "https://i.ibb.co/Q3g9fGSt/1791541921524.png";
const BANNER_SRC = "/assets/aistudio/WhatsApp_Image_2026-10-31_at_20.20.15_51be3925.jpeg";

type ViewState = 'subjects' | 'categories' | 'chapters';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('subjects');
  const [curSubjectIdx, setCurSubjectIdx] = useState<number>(0);
  const [activeCategory, setActiveCategory] = useState<'CHAPTERS' | 'WEEKLY TESTS'>('CHAPTERS');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [progress, setProgress] = useState<number>(30);
  const [inboxOpen, setInboxOpen] = useState<boolean>(false);
  const [hasUnread, setHasUnread] = useState<boolean>(true);
  const [popupOpen, setPopupOpen] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Initialize welcome community popup once per session
  useEffect(() => {
    const shown = sessionStorage.getItem('gb_study_popup_shown_v2');
    if (!shown) {
      const timer = setTimeout(() => {
        setPopupOpen(true);
        sessionStorage.setItem('gb_study_popup_shown_v2', 'true');
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const subjects = useMemo(() => course?.subjects || [], []);
  const curSubject: Subject | undefined = subjects[curSubjectIdx];

  // Subject categorization tags for rapid filtering
  const tags = ['All', 'History', 'Polity', 'Geography', 'Science', 'Economics', 'Static GK'];

  const filteredSubjects = useMemo(() => {
    return subjects.filter((s) => {
      const nameUpper = s.name.toUpperCase();
      const matchesSearch = nameUpper.includes(searchQuery.trim().toUpperCase());
      if (!matchesSearch) return false;

      if (selectedTag === 'All') return true;
      if (selectedTag === 'History' && nameUpper.includes('HISTORY')) return true;
      if (selectedTag === 'Polity' && nameUpper.includes('POLITY')) return true;
      if (selectedTag === 'Geography' && nameUpper.includes('GEOGRAPHY')) return true;
      if (selectedTag === 'Science' && (nameUpper.includes('BIOLOGY') || nameUpper.includes('CHEMISTRY') || nameUpper.includes('PHYSICS'))) return true;
      if (selectedTag === 'Economics' && nameUpper.includes('ECONOMICS')) return true;
      if (selectedTag === 'Static GK' && (nameUpper.includes('STATIC') || nameUpper.includes('ENVIROMENT'))) return true;
      return false;
    });
  }, [subjects, searchQuery, selectedTag]);

  // Handle navigation
  const goToSubjects = () => {
    setProgress(30);
    setCurrentView('subjects');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToCategories = (subjectIdx: number) => {
    setCurSubjectIdx(subjectIdx);
    setProgress(65);
    setCurrentView('categories');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToItems = (type: 'CHAPTERS' | 'WEEKLY TESTS') => {
    setActiveCategory(type);
    setProgress(100);
    setCurrentView('chapters');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'GB STUDY - Free Batches & Notes',
        text: 'भाइयों GB STUDY पर सभी महंगे Batches, Lectures, Notes, PDFs और Tests 100% Free उपलब्ध हैं! अभी जॉइन करें:',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    }
  };

  // Original website used 📘 book icon for all subjects with topic badges
  const getSubjectTopicEmoji = (name: string) => {
    const n = name.toUpperCase();
    if (n.includes('GEOGRAPHY')) return '🌍';
    if (n.includes('POLITY')) return '⚖️';
    if (n.includes('ANCIENT')) return '🏛️';
    if (n.includes('MEDIEVAL')) return '⚔️';
    if (n.includes('MODERN')) return '📜';
    if (n.includes('ECONOMICS')) return '📊';
    if (n.includes('BIOLOGY')) return '🧬';
    if (n.includes('CHEMISTRY')) return '🧪';
    if (n.includes('PHYSICS')) return '⚡';
    if (n.includes('ENVIROMENT')) return '🌿';
    if (n.includes('STATIC')) return '🎯';
    return '📘';
  };

  const currentItems = useMemo(() => {
    if (!curSubject) return [];
    if (activeCategory === 'CHAPTERS') {
      return curSubject.CHAPTERS || [];
    }
    return curSubject["WEEKLY TESTS"] || [];
  }, [curSubject, activeCategory]);

  return (
    <div className="min-h-screen bg-[#090d16] text-[#f8fafc] font-['Inter',sans-serif] pb-36 selection:bg-indigo-500/30 selection:text-white">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(99,102,241,0.15),rgba(255,255,255,0))]" />

      {/* Top Fixed Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-[4px] bg-[#1e293d] z-50">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-amber-400 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(99,102,241,0.7)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Floating Bell Icon for Notifications */}
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-40">
        <button
          onClick={() => {
            setInboxOpen(true);
            setHasUnread(false);
          }}
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#0f172a] border border-[#1e293b] shadow-xl hover:border-indigo-500/50 flex items-center justify-center text-slate-300 hover:text-white active:scale-95 transition relative backdrop-blur-md"
          title="Notifications"
          aria-label="Open notifications"
        >
          <Bell className="w-5 h-5" />
          {hasUnread && (
            <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-[#090d16] shadow-sm animate-pulse">
              1
            </span>
          )}
        </button>
      </div>

      {/* Notification Drawer Modal (Dark Mode) */}
      {inboxOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full max-w-md bg-[#0f172a] h-full shadow-2xl flex flex-col animate-pop-in border-l border-[#1e293b]">
            <div className="p-4 sm:p-5 border-b border-[#1e293b] flex items-center justify-between bg-[#0b1120]">
              <div className="flex items-center gap-2">
                <span className="text-xl">📬</span>
                <h3 className="font-bold text-sm tracking-wide uppercase text-slate-100">
                  GB STUDY Announcements
                </h3>
              </div>
              <button
                onClick={() => setInboxOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-[#1e293b] flex items-center justify-center text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
              {data.notifications?.map((notif, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-indigo-900/60 bg-indigo-950/30 border-l-4 border-l-indigo-500 shadow-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-900/70 text-indigo-300 border border-indigo-700/50 px-2 py-0.5 rounded">
                      {notif.tag || 'UPDATE'}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {notif.date}
                    </span>
                  </div>
                  <div
                    className="text-sm text-slate-300 leading-relaxed space-y-2 [&_a]:text-indigo-400 [&_a]:underline [&_a]:font-semibold"
                    dangerouslySetInnerHTML={{ __html: notif.message }}
                  />
                  <div className="mt-3 pt-3 border-t border-indigo-900/40 flex flex-wrap gap-3">
                    <a
                      href={TELEGRAM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" /> Telegram Channel
                    </a>
                    <span className="text-slate-600">•</span>
                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Channel
                    </a>
                  </div>
                </div>
              ))}

              <div className="p-4 rounded-xl border border-[#1e293b] bg-[#0b1120] text-xs text-slate-400 text-center">
                ✨ All GB STUDY lectures, notes, DPPs and mock tests are updated daily.
              </div>
            </div>

            <div className="p-4 border-t border-[#1e293b] bg-[#0b1120] flex gap-3">
              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs text-center flex items-center justify-center gap-1.5 shadow-md transition"
              >
                <Send className="w-3.5 h-3.5" /> Join Telegram
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs text-center flex items-center justify-center gap-1.5 shadow-md transition"
              >
                <MessageCircle className="w-3.5 h-3.5" /> Join WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp & Telegram Welcome Popup (Dark Mode) */}
      {popupOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl animate-pop-in relative border border-[#1e293b]">
            <button
              onClick={() => setPopupOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-[#162035] p-2 border border-[#1e293d] shadow-lg flex items-center justify-center overflow-hidden glow-gold">
              <img
                src={LOGO_SRC}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = LOGO_FALLBACK;
                }}
                alt="GB STUDY"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>

            <h3 className="font-black text-xl text-white mb-1">
              Join {APP_NAME}
            </h3>
            <p className="text-xs text-amber-400 font-bold mb-3 tracking-wide">
              FREE BATCHES • NOTES • DPP • QUIZ
            </p>
            <p className="text-xs sm:text-sm text-slate-300 mb-5 leading-relaxed">
              भाइयों! सभी महंगे Batches, Handwritten Notes, PDFs और Quizzes मुफ्त में पाने के लिए GB STUDY Channels से जुड़ें:
            </p>

            <div className="space-y-2.5">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold py-3 px-4 rounded-xl text-sm shadow-md transition active:scale-98"
              >
                <MessageCircle className="w-4 h-4" />
                Join WhatsApp Channel
              </a>
              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold py-3 px-4 rounded-xl text-sm shadow-md transition active:scale-98"
              >
                <Send className="w-4 h-4" />
                Join Telegram Channel
              </a>
            </div>

            <button
              onClick={() => setPopupOpen(false)}
              className="mt-4 text-xs font-medium text-slate-400 hover:text-slate-200 transition"
            >
              Maybe later, take me to courses →
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Header (Dark Mode) */}
        <header className="py-4 sm:py-6 flex items-center justify-between border-b border-[#1e293d] mb-6">
          <div className="flex items-center gap-3 cursor-pointer" onClick={goToSubjects}>
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#0f172a] p-1 border border-[#1e293b] shadow-md flex items-center justify-center overflow-hidden flex-shrink-0 glow-gold">
              <img
                src={LOGO_SRC}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = LOGO_FALLBACK;
                }}
                alt="GB STUDY"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
                  <span>{APP_NAME}</span>
                </h1>
                <span className="hidden sm:inline-flex text-[10px] font-bold tracking-wider uppercase text-amber-300 bg-amber-950/60 border border-amber-600/40 px-2 py-0.5 rounded-full">
                  FREE PLATFORM
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Premium Free Learning &bull; All Batches
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-sky-300 bg-sky-950/50 border border-sky-800/60 hover:bg-sky-900/70 transition shadow-sm"
            >
              <Send className="w-3.5 h-3.5 text-sky-400" />
              Telegram
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-300 bg-emerald-950/50 border border-emerald-800/60 hover:bg-emerald-900/70 transition shadow-sm"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              WhatsApp
            </a>
            <button
              onClick={handleShare}
              className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold text-amber-300 bg-amber-950/40 border border-amber-600/50 hover:bg-amber-900/50 transition flex items-center gap-1.5 shadow-sm active:scale-95"
              title="Share GB STUDY"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-amber-400" />}
              <span className="hidden sm:inline">{copiedLink ? 'Link Copied!' : 'SHARE'}</span>
            </button>
          </div>
        </header>

        {/* ================= HERO BANNER SECTION (USER REQUESTED CUSTOM BANNER) ================= */}
        {currentView === 'subjects' && (
          <div className="mb-8 space-y-4">
            {/* Banner Container */}
            <div className="relative overflow-hidden rounded-3xl border-2 border-amber-500/30 bg-[#0c1220] shadow-[0_10px_35px_rgba(0,0,0,0.6)] group">
              {/* The Banner Image uploaded by the user */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
                <img
                  src={BANNER_SRC}
                  alt="GB STUDY - महंगे BATCHES, COURSES ला रहा है और हमेशा लाता रहेगा"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
                />
                {/* Subtle gradient vignette to blend beautifully with dark theme */}
                <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/10 rounded-3xl" />
              </div>

              {/* Action Bar attached right below the banner */}
              <div className="p-3 sm:p-4 bg-gradient-to-r from-[#0d1424] via-[#11192e] to-[#0d1424] border-t border-amber-500/20 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-medium text-amber-200">
                  <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span className="hidden sm:inline">
                    GB STUDY: महंगे Batches &amp; Notes सभी छात्रों के लिए 100% Free!
                  </span>
                  <span className="sm:hidden">
                    सभी Batches &amp; Notes 100% Free!
                  </span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleShare}
                    className="flex-1 sm:flex-none h-9 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{copiedLink ? 'Link Copied!' : 'SHARE APP'}</span>
                  </button>

                  <a
                    href={TELEGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-9 px-3.5 rounded-xl bg-sky-950/70 hover:bg-sky-900 border border-sky-600/40 text-sky-300 font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Telegram</span>
                  </a>

                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-9 px-3.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-600/40 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= VIEW 1: SUBJECTS LIST (DARK THEME) ================= */}
        {currentView === 'subjects' && (
          <div className="space-y-6">
            {/* Dashboard Heading & Filter Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-[11px] font-extrabold tracking-wider uppercase text-indigo-400 block mb-1">
                  YOUR CLASSROOM
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Explore Learning Resources
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Choose a subject below to access complete lectures, notes, PDFs and weekly tests.
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0f172a] border border-[#1e293b] text-xs font-bold text-slate-300 shadow-sm self-start sm:self-auto">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>11 Subjects • 150+ Lectures • Free DPP</span>
              </div>
            </div>

            {/* Dark Search Input Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search subjects, chapters, or tests (e.g., Geography, Polity, River...)..."
                className="w-full pl-12 pr-10 py-3.5 bg-[#0f172a] border border-[#1e293b] rounded-2xl shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-medium text-white placeholder:text-slate-500 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Filter Tag Chips (Dark Theme) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition whitespace-nowrap ${
                    selectedTag === tag
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-[#0f172a] border border-[#1e293b] text-slate-400 hover:text-white hover:bg-[#162035]'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Subjects Grid (With Original Website's 📘 Icon and Topic Indicators) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSubjects.map((s, idx) => {
                const originalIndex = subjects.findIndex((item) => item.name === s.name);
                const chapterCount = s.CHAPTERS?.length || 0;
                const testCount = s["WEEKLY TESTS"]?.length || 0;
                const topicEmoji = getSubjectTopicEmoji(s.name);

                return (
                  <div
                    key={s.name}
                    onClick={() => goToCategories(originalIndex !== -1 ? originalIndex : idx)}
                    className="group bg-[#0f172a] border border-[#1e293b] hover:border-indigo-500/60 rounded-2xl p-5 shadow-sm hover:shadow-[0_4px_25px_rgba(79,70,229,0.18)] transition-all duration-200 cursor-pointer flex items-center justify-between active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-3.5">
                      {/* Original Website Icon: 📘 in styled container */}
                      <div className="w-12 h-12 rounded-xl bg-[#172038] group-hover:bg-indigo-950/80 border border-[#23314f] group-hover:border-indigo-500/50 flex items-center justify-center text-xl flex-shrink-0 transition shadow-inner relative">
                        <span className="text-xl">📘</span>
                        {/* Little topic tag */}
                        <span className="absolute -bottom-1 -right-1 text-[11px] bg-[#090d16] border border-[#1e293b] rounded-full w-5 h-5 flex items-center justify-center shadow">
                          {topicEmoji}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-bold text-white group-hover:text-indigo-400 transition text-sm sm:text-base leading-snug">
                          {s.name}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5 font-medium">
                          {chapterCount} Lectures • {testCount} Tests
                        </p>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#162035] group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center text-slate-400 transition flex-shrink-0 border border-[#1e293b]">
                      <ChevronRight className="w-4 h-4 transition group-hover:translate-x-0.5" />
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredSubjects.length === 0 && (
              <div className="text-center py-16 bg-[#0f172a] rounded-2xl border border-[#1e293b]">
                <p className="text-slate-400 text-base font-medium">
                  No subjects match your search "{searchQuery}"
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedTag('All');
                  }}
                  className="mt-3 text-xs font-semibold text-indigo-400 hover:underline"
                >
                  Clear search and show all subjects
                </button>
              </div>
            )}
          </div>
        )}

        {/* ================= VIEW 2: CATEGORY SELECTION (DARK THEME) ================= */}
        {currentView === 'categories' && curSubject && (
          <div className="space-y-6">
            <button
              onClick={goToSubjects}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-indigo-400 py-2 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>

            {/* Selected Subject Banner (Dark) */}
            <div className="bg-[#0f172a] border border-[#1e293b] rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#162035] border border-[#23314f] flex items-center justify-center text-3xl shadow-inner">
                  <span>📘</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-indigo-300 bg-indigo-950/80 border border-indigo-700/50 px-2.5 py-0.5 rounded-full">
                    SELECTED SUBJECT
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                    {curSubject.name}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Select a module below to access structured lectures or assessments.
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <div className="px-4 py-2 bg-[#0b1120] rounded-xl border border-[#1e293b] text-center min-w-[70px]">
                  <span className="block text-lg font-bold text-white">
                    {curSubject.CHAPTERS?.length || 0}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">
                    Lectures
                  </span>
                </div>
                <div className="px-4 py-2 bg-[#0b1120] rounded-xl border border-[#1e293b] text-center min-w-[70px]">
                  <span className="block text-lg font-bold text-white">
                    {curSubject["WEEKLY TESTS"]?.length || 0}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">
                    Tests
                  </span>
                </div>
              </div>
            </div>

            {/* Categories Selection Cards (Exact website structure in Dark Mode) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Category 1: Chapters & Lectures */}
              <div
                onClick={() => goToItems('CHAPTERS')}
                className="bg-[#0f172a] border-l-[6px] border-l-indigo-500 border border-[#1e293b] hover:border-indigo-400 rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 active:scale-[0.98] group flex items-start gap-4"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#162035] text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center text-2xl transition flex-shrink-0 border border-[#23314f]">
                  📚
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition">
                      Chapters &amp; Lectures
                    </h3>
                    <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition" />
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Complete video lectures, Hindi &amp; English class notes, DPPs, and handwritten PDF materials.
                  </p>
                  <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-indigo-300 bg-indigo-950/80 border border-indigo-800/50 px-3 py-1 rounded-full">
                    <span>{curSubject.CHAPTERS?.length || 0} Chapters available</span>
                  </div>
                </div>
              </div>

              {/* Category 2: Mock Tests & Quiz */}
              <div
                onClick={() => goToItems('WEEKLY TESTS')}
                className="bg-[#0f172a] border-l-[6px] border-l-pink-500 border border-[#1e293b] hover:border-pink-400 rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 active:scale-[0.98] group flex items-start gap-4"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#162035] text-pink-400 group-hover:bg-pink-600 group-hover:text-white flex items-center justify-center text-2xl transition flex-shrink-0 border border-[#23314f]">
                  📝
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white group-hover:text-pink-400 transition">
                      Mock Tests &amp; Quiz
                    </h3>
                    <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-pink-400 group-hover:translate-x-1 transition" />
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Test your understanding with topic-wise weekly tests, DPP quizzes, and full length assessments.
                  </p>
                  <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-pink-300 bg-pink-950/80 border border-pink-800/50 px-3 py-1 rounded-full">
                    <span>{curSubject["WEEKLY TESTS"]?.length || 0} Assessments available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= VIEW 3: CHAPTERS / TESTS LIST (DARK THEME) ================= */}
        {currentView === 'chapters' && curSubject && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => goToCategories(curSubjectIdx)}
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-indigo-400 py-2 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Modules</span>
              </button>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 font-medium">Viewing:</span>
                <span className="font-bold text-indigo-300 bg-[#0f172a] border border-[#1e293b] px-2.5 py-1 rounded-lg">
                  {curSubject.name} &bull; {activeCategory === 'CHAPTERS' ? 'LECTURES & NOTES' : 'ASSESSMENTS'}
                </span>
              </div>
            </div>

            {/* Section Header (Dark) */}
            <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-5 shadow-md flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-white">
                  {activeCategory === 'CHAPTERS' ? 'Lectures, Notes & PDFs' : 'Weekly Tests & Quizzes'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Click any button to open the video, English notes, Hindi notes, Quiz or PDF.
                </p>
              </div>
              <span className="text-xs font-bold text-indigo-300 bg-indigo-950/80 border border-indigo-700/60 px-3 py-1 rounded-full">
                {currentItems.length} Items
              </span>
            </div>

            {/* Chapters / Items Grid */}
            {currentItems.length === 0 ? (
              <div className="text-center py-20 bg-[#0f172a] rounded-3xl border border-[#1e293b]">
                <div className="text-4xl mb-3">⏳</div>
                <h4 className="text-base font-bold text-white">
                  Content will be added soon!
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                  New lectures and tests are being uploaded regularly on GB STUDY. Check back shortly!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentItems.map((item, idx) => {
                  const buttons = [
                    item.url
                      ? {
                          label: 'Video',
                          icon: '▶️',
                          url: item.url.trim().split(' ')[0],
                          bgClass: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30',
                        }
                      : null,
                    item.notes_en
                      ? {
                          label: 'Eng Notes',
                          icon: '📄',
                          url: item.notes_en.trim().split(' ')[0],
                          bgClass: 'bg-[#0284c7] hover:bg-[#0369a1] text-white shadow-sky-600/30',
                        }
                      : null,
                    item.notes_hi
                      ? {
                          label: 'Hin Notes',
                          icon: '📘',
                          url: item.notes_hi.trim().split(' ')[0],
                          bgClass: 'bg-[#059669] hover:bg-[#047857] text-white shadow-emerald-600/30',
                        }
                      : null,
                    item.quiz
                      ? {
                          label: 'Quiz',
                          icon: '❓',
                          url: item.quiz.trim().split(' ')[0],
                          bgClass: 'bg-[#db2777] hover:bg-[#be185d] text-white shadow-pink-600/30',
                        }
                      : null,
                    item.handwritten
                      ? {
                          label: 'PDF',
                          icon: '📝',
                          url: item.handwritten.trim().split(' ')[0],
                          bgClass: 'bg-[#7c3aed] hover:bg-[#6d28d9] text-white shadow-purple-600/30',
                        }
                      : null,
                  ].filter(Boolean);

                  return (
                    <div
                      key={idx}
                      className="bg-[#0f172a] border border-[#1e293b] hover:border-indigo-500/40 rounded-2xl p-5 shadow-sm transition hover:shadow-lg flex flex-col justify-between"
                    >
                      <div className="border-b border-[#1e293b] pb-3 mb-4">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-white text-sm sm:text-base leading-snug">
                            {item.title}
                          </h4>
                          <span className="text-[10px] font-bold text-slate-400 bg-[#162035] border border-[#1e293b] px-2 py-0.5 rounded flex-shrink-0">
                            #{idx + 1}
                          </span>
                        </div>
                      </div>

                      {/* Action buttons grid matching original website button styling */}
                      <div
                        className={`grid gap-2 ${
                          buttons.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
                        }`}
                      >
                        {buttons.map((btn, bIdx) => (
                          <a
                            key={bIdx}
                            href={btn!.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-sm active:scale-95 ${btn!.bgClass}`}
                          >
                            <span>{btn!.icon}</span>
                            <span>{btn!.label}</span>
                            <ExternalLink className="w-3 h-3 opacity-80 ml-0.5" />
                          </a>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modern Sticky Footer (Dark Mode with WhatsApp & Telegram Channels) */}
      <footer className="fixed bottom-0 left-0 w-full bg-[#090d16]/95 backdrop-blur-md border-t border-[#1e293b] p-3 sm:p-4 z-40 shadow-2xl">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Dual Action Banners */}
          <div className="w-full flex flex-col sm:flex-row items-center gap-2.5">
            {/* WhatsApp Banner */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:flex-1 bg-[#16a34a] hover:bg-[#15803d] text-white rounded-2xl p-3 sm:py-2.5 sm:px-4 shadow-lg hover:shadow-xl transition flex items-center justify-between active:scale-[0.99] border border-emerald-500/30"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div className="leading-tight text-left">
                  <small className="block text-[10px] font-bold uppercase tracking-wider opacity-90">
                    {APP_NAME} Community
                  </small>
                  <strong className="block text-sm font-bold">
                    Join Free Batches on WhatsApp
                  </strong>
                </div>
              </div>
              <span className="text-lg font-bold opacity-80 sm:hidden">→</span>
            </a>

            {/* Telegram Banner */}
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:flex-1 bg-[#0284c7] hover:bg-[#0369a1] text-white rounded-2xl p-3 sm:py-2.5 sm:px-4 shadow-lg hover:shadow-xl transition flex items-center justify-between active:scale-[0.99] border border-sky-500/30"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Send className="w-5 h-5 text-white" />
                </div>
                <div className="leading-tight text-left">
                  <small className="block text-[10px] font-bold uppercase tracking-wider opacity-90">
                    {APP_NAME} Telegram
                  </small>
                  <strong className="block text-sm font-bold">
                    Join @GBFreestudy on Telegram
                  </strong>
                </div>
              </div>
              <span className="text-lg font-bold opacity-80 sm:hidden">→</span>
            </a>
          </div>
        </div>
        <p className="text-center text-[10px] text-slate-500 mt-2 font-medium">
          {APP_NAME} &bull; All Batches, Lectures, Notes &amp; DPPs 100% Free
        </p>
      </footer>
    </div>
  );
}
