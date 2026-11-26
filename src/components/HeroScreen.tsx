import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, MapPin, ArrowLeft, Clock, Coffee } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { BrandLogo } from './BrandLogo';
import {
  CoffeeBeanGraphic,
  HeroCrimsonBrushSlash,
  HeroYellowBrushSlash,
  WhatsAppIcon,
  YellowBrushUnderline,
} from './BrushGraphics';
import { getWhatsAppContactUrl } from '../utils/whatsapp';
import {
  ParallaxStage,
  SMOOTH_EASE,
  TapRippleButton,
  TapRippleAnchor,
} from './MotionPrimitives';

interface HeroScreenProps {
  onOpenDrawer: () => void;
  onBrowseMenu: () => void;
  onOpenLocation: () => void;
}

export const HeroScreen: React.FC<HeroScreenProps> = ({
  onOpenDrawer,
  onBrowseMenu,
  onOpenLocation,
}) => {
  const [heroImgFailed, setHeroImgFailed] = useState(false);
  const whatsappContactUrl = getWhatsAppContactUrl();

  return (
    <div className="min-h-[100dvh] espresso-luxury-bg text-[#F7E8D6] relative overflow-hidden flex flex-col">
      {/* Dual Gold & Crimson Brush Accents framing the Hero composition (Boards 2, 5, 7) */}
      <motion.div
        initial={{ opacity: 0, x: -30, scale: 0.92 }}
        animate={{ opacity: 0.9, x: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: SMOOTH_EASE }}
        className="pointer-events-none"
      >
        <HeroYellowBrushSlash className="absolute top-24 -left-14 w-40 h-56 sm:w-52 sm:h-72 lg:left-10 lg:top-24" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 26, scale: 0.92 }}
        animate={{ opacity: 0.85, x: 0, scale: 1 }}
        transition={{ duration: 0.55, delay: 0.08, ease: SMOOTH_EASE }}
        className="pointer-events-none"
      >
        <HeroCrimsonBrushSlash className="absolute bottom-24 -right-12 w-44 h-28 sm:w-56 sm:h-36 lg:right-16 lg:bottom-20 opacity-80" />
      </motion.div>

      {/* Subtle Floating Roasted Coffee Beans with Scroll Parallax Depth */}
      <motion.div
        aria-hidden="true"
        animate={{ y: [0, -7, 0], rotate: [-12, -5, -12] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute top-32 right-6 sm:right-14 lg:right-[46%] opacity-85 z-0"
      >
        <ParallaxStage yDistance={-18} exitScale={1.04}>
          <CoffeeBeanGraphic className="w-8 h-8 sm:w-10 sm:h-10 drop-shadow-[0_6px_12px_rgba(0,0,0,0.8)]" />
        </ParallaxStage>
      </motion.div>

      <motion.div
        aria-hidden="true"
        animate={{ y: [0, 6, 0], rotate: [18, 26, 18] }}
        transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none hidden sm:block absolute bottom-36 left-10 lg:left-[48%] opacity-75 z-0"
      >
        <ParallaxStage yDistance={-14} exitScale={1.03}>
          <CoffeeBeanGraphic className="w-7 h-7 sm:w-9 sm:h-9 drop-shadow-[0_6px_12px_rgba(0,0,0,0.8)]" />
        </ParallaxStage>
      </motion.div>

      {/* Top Header */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: SMOOTH_EASE }}
        className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-3 pb-1 flex items-center justify-between gap-4"
      >
        <TapRippleButton
          type="button"
          onClick={onOpenDrawer}
          rippleTone="yellow"
          tapScale={0.9}
          aria-label="فتح القائمة"
          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-[#F7E8D6] hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-[#FFC400] transition-colors cursor-pointer"
        >
          <Menu className="w-6 h-6 relative z-10" />
        </TapRippleButton>

        <BrandLogo size="md" />

        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-3 text-sm font-bold text-[#F7E8D6]/85">
            <TapRippleButton
              type="button"
              onClick={onBrowseMenu}
              rippleTone="yellow"
              tapScale={0.95}
              className="hover:text-[#FFC400] hover:bg-white/5 transition-colors whitespace-nowrap shrink-0 cursor-pointer py-2 px-3 rounded-full"
            >
              <span className="relative z-10">المنيو</span>
            </TapRippleButton>
            <TapRippleButton
              type="button"
              onClick={onOpenLocation}
              rippleTone="yellow"
              tapScale={0.95}
              className="hover:text-[#FFC400] hover:bg-white/5 transition-colors whitespace-nowrap shrink-0 cursor-pointer py-2 px-3 rounded-full"
            >
              <span className="relative z-10">الموقع وساعات العمل</span>
            </TapRippleButton>
          </nav>

          <TapRippleButton
            type="button"
            onClick={onOpenLocation}
            rippleTone="yellow"
            tapScale={0.9}
            aria-label="الموقع وساعات العمل"
            className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-[#F7E8D6] hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-[#FFC400] transition-colors cursor-pointer"
          >
            <MapPin className="w-5 h-5 relative z-10" />
          </TapRippleButton>
        </div>
      </motion.header>

      {/* Main Hero Content */}
      <main className="relative z-10 flex-1 w-full max-w-6xl mx-auto px-5 sm:px-8 pt-2 pb-4 sm:py-6 flex flex-col lg:grid lg:grid-cols-12 lg:items-center lg:gap-10 justify-between">
        {/* Tagline & CTA Column */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.06, ease: SMOOTH_EASE }}
          className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-right pt-1 sm:pt-3 lg:pt-0"
        >
          <div className="relative inline-block -rotate-2 select-none">
            <h1 className="flex flex-col items-center lg:items-start leading-[1.02]">
              <span className="text-5xl sm:text-6xl lg:text-7xl font-black text-[#F7E8D6] drop-shadow-[0_6px_18px_rgba(0,0,0,0.95)]">
                بن يعني
              </span>
              <span className="relative inline-block text-6xl sm:text-7xl lg:text-8xl font-black text-[#FFC400] mt-0.5 drop-shadow-[0_6px_18px_rgba(0,0,0,0.95)]">
                الطيب
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ duration: 0.45, delay: 0.2, ease: SMOOTH_EASE }}
                  style={{ originX: 1 }}
                >
                  <YellowBrushUnderline className="mt-1 w-44 sm:w-60 lg:w-72" />
                </motion.div>
              </span>
            </h1>
          </div>

          <p className="mt-3 sm:mt-5 text-xs sm:text-base text-[#F7E8D6]/80 max-w-xs sm:max-w-md leading-relaxed font-medium">
            قهوة مختصة ومشروبات مميزة في أجواء مريحة — تصفح المنيو واطلب مباشرة عبر واتساب.
          </p>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4 mt-8">
            <TapRippleButton
              type="button"
              onClick={onBrowseMenu}
              rippleTone="dark"
              tapScale={0.96}
              hoverScale={1.02}
              className="group min-h-[54px] px-7 py-3 rounded-full bg-[#FFC400] hover:bg-[#F7E8D6] text-[#0B0908] font-black text-lg flex items-center gap-4 shadow-xl shadow-black/60 transition-colors cursor-pointer whitespace-nowrap"
            >
              <span className="relative z-10">تصفح المنيو</span>
              <span className="relative z-10 w-9 h-9 rounded-full bg-[#0B0908] text-[#FFC400] flex items-center justify-center transition-transform duration-200 group-hover:-translate-x-1">
                <ArrowLeft className="w-5 h-5" />
              </span>
            </TapRippleButton>
            <TapRippleButton
              type="button"
              onClick={onOpenLocation}
              rippleTone="yellow"
              tapScale={0.96}
              className="min-h-[54px] px-6 py-3 rounded-full border border-[#FFC400]/35 hover:border-[#FFC400] bg-[#16100C]/80 text-[#F7E8D6] font-bold text-base transition-colors cursor-pointer whitespace-nowrap"
            >
              <span className="relative z-10">موقعنا وساعات العمل</span>
            </TapRippleButton>
          </div>
        </motion.div>

        {/* Isolated Background-Free Coffee Asset — blends naturally into the Hero canvas */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.12, ease: SMOOTH_EASE }}
          className="lg:col-span-6 relative flex flex-col items-center justify-center -my-1 lg:my-0"
        >
          <div className="relative w-full max-w-[260px] sm:max-w-[330px] lg:max-w-[440px] mx-auto flex items-center justify-center">
            <div
              aria-hidden="true"
              className="absolute inset-8 rounded-full bg-[#FFC400]/14 blur-3xl pointer-events-none"
            />
            {heroImgFailed ? (
              <div className="w-56 h-56 flex flex-col items-center justify-center text-[#FFC400]/80">
                <Coffee className="w-12 h-12 mb-2" strokeWidth={1.5} />
                <span className="text-sm font-bold text-[#F7E8D6]/80">
                  {siteConfig.brand.nameAr}
                </span>
              </div>
            ) : (
              <ParallaxStage yDistance={24} exitScale={0.95} className="w-full">
                <motion.img
                  src={siteConfig.assets.heroCoffeeCup}
                  alt="كوب قهوة بن الطيب مع رسمة اللاتيه آرت"
                  referrerPolicy="no-referrer"
                  loading="eager"
                  fetchPriority="high"
                  onError={() => setHeroImgFailed(true)}
                  animate={{ y: [0, -5, 0] }}
                  transition={{
                    duration: 5.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="relative z-10 w-full h-auto object-contain select-none drop-shadow-[0_20px_38px_rgba(0,0,0,0.88)]"
                />
              </ParallaxStage>
            )}
          </div>
        </motion.div>

        {/* Mobile Bottom CTA + Quick 3-Action Bar (Boards 2, 4, 5, 6) */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.18, ease: SMOOTH_EASE }}
          className="lg:hidden w-full max-w-sm mx-auto pt-1 pb-2 flex flex-col items-center gap-2.5 z-20"
        >
          <TapRippleButton
            type="button"
            onClick={onBrowseMenu}
            rippleTone="dark"
            tapScale={0.96}
            className="group w-full min-h-[52px] px-5 py-2.5 rounded-full bg-[#FFC400] hover:bg-[#F7E8D6] text-[#0B0908] font-black text-lg flex items-center justify-between shadow-2xl shadow-black/75 transition-colors cursor-pointer"
          >
            <span className="relative z-10 flex-1 text-center pr-8">
              تصفح المنيو
            </span>
            <span className="relative z-10 w-9 h-9 rounded-full bg-[#0B0908] text-[#FFC400] flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:-translate-x-1">
              <ArrowLeft className="w-5 h-5" />
            </span>
          </TapRippleButton>

          {/* Compact Quick-Jump Row matching Boards 4 & 6 */}
          <div className="w-full grid grid-cols-3 gap-2">
            <TapRippleButton
              type="button"
              onClick={onOpenLocation}
              rippleTone="yellow"
              tapScale={0.94}
              className="min-h-[42px] px-2 rounded-xl bg-[#16100C]/90 border border-[#FFC400]/20 hover:border-[#FFC400]/55 text-[#F7E8D6]/90 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-[#FFC400] relative z-10 shrink-0" />
              <span className="relative z-10 whitespace-nowrap">ساعات العمل</span>
            </TapRippleButton>

            {whatsappContactUrl ? (
              <TapRippleAnchor
                href={whatsappContactUrl}
                target="_blank"
                rel="noopener noreferrer"
                rippleTone="crimson"
                tapScale={0.94}
                className="min-h-[42px] px-2 rounded-xl bg-[#16100C]/90 border border-[#D72626]/35 hover:border-[#D72626] text-[#F7E8D6]/90 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <WhatsAppIcon className="w-3.5 h-3.5 text-[#D72626] relative z-10 shrink-0" />
                <span className="relative z-10 whitespace-nowrap">واتساب</span>
              </TapRippleAnchor>
            ) : (
              <TapRippleButton
                type="button"
                onClick={onOpenLocation}
                rippleTone="crimson"
                tapScale={0.94}
                className="min-h-[42px] px-2 rounded-xl bg-[#16100C]/90 border border-[#D72626]/35 hover:border-[#D72626] text-[#F7E8D6]/90 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <WhatsAppIcon className="w-3.5 h-3.5 text-[#D72626] relative z-10 shrink-0" />
                <span className="relative z-10 whitespace-nowrap">واتساب</span>
              </TapRippleButton>
            )}

            <TapRippleButton
              type="button"
              onClick={onOpenLocation}
              rippleTone="yellow"
              tapScale={0.94}
              className="min-h-[42px] px-2 rounded-xl bg-[#16100C]/90 border border-[#FFC400]/20 hover:border-[#FFC400]/55 text-[#F7E8D6]/90 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-[#FFC400] relative z-10 shrink-0" />
              <span className="relative z-10 whitespace-nowrap">الموقع</span>
            </TapRippleButton>
          </div>
        </motion.div>
      </main>
    </div>
  );
};
