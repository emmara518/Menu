import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Menu,
  MapPin,
  Clock,
  Navigation,
  ChevronRight,
  Info,
  X,
} from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { BrandLogo } from './BrandLogo';
import { MenuImage } from './MenuImage';
import {
  CornerBrushAccent,
  PaperTearDivider,
  WhatsAppIcon,
} from './BrushGraphics';
import { getWhatsAppContactUrl } from '../utils/whatsapp';
import {
  ParallaxMedia,
  SMOOTH_EASE,
  TACTILE_SPRING,
  TapRippleAnchor,
  TapRippleButton,
} from './MotionPrimitives';

interface LocationScreenProps {
  onOpenDrawer: () => void;
  onGoHome: () => void;
  onBackToMenu: () => void;
}

export const LocationScreen: React.FC<LocationScreenProps> = ({
  onOpenDrawer,
  onGoHome,
  onBackToMenu,
}) => {
  const whatsappUrl = getWhatsAppContactUrl();
  const verifiedMapsUrl = siteConfig.branch.googleMapsUrl.trim();
  const [noticeType, setNoticeType] = useState<'maps' | 'whatsapp' | null>(null);

  useEffect(() => {
    if (!noticeType) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setNoticeType(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [noticeType]);

  return (
    <div className="min-h-screen espresso-luxury-bg text-[#F7E8D6] flex flex-col">
      {/* Top Overlay Bar */}
      <header className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-4 pb-2 flex items-center justify-between">
        <TapRippleButton
          type="button"
          onClick={onOpenDrawer}
          rippleTone="yellow"
          tapScale={0.9}
          aria-label="فتح القائمة"
          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-black/55 backdrop-blur-sm text-[#F7E8D6] hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-[#FFC400] transition-colors cursor-pointer"
        >
          <Menu className="w-6 h-6 relative z-10" />
        </TapRippleButton>

        <BrandLogo size="sm" onClick={onGoHome} />

        <TapRippleButton
          type="button"
          onClick={onBackToMenu}
          rippleTone="yellow"
          tapScale={0.94}
          aria-label="العودة للمنيو"
          className="group min-h-[44px] px-3.5 flex items-center gap-1 rounded-full bg-black/55 backdrop-blur-sm text-xs sm:text-sm font-bold text-[#FFC400] hover:bg-white/15 transition-colors cursor-pointer"
        >
          <span className="relative z-10">المنيو</span>
          <ChevronRight className="w-4 h-4 rotate-180 relative z-10 transition-transform duration-150 group-hover:-translate-x-0.5" />
        </TapRippleButton>
      </header>

      {/* Main Layout: Mobile vertical torn-paper stack, Desktop 2-column */}
      <main className="flex-1 w-full max-w-5xl mx-auto flex flex-col lg:grid lg:grid-cols-12 lg:items-stretch lg:gap-0 lg:px-6 lg:pb-10 lg:pt-4">
        {/* Storefront Photo (temporary AI imagery labeled clearly) with Scroll Parallax */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.36, ease: SMOOTH_EASE }}
          className="lg:col-span-6 relative -mt-[68px] lg:mt-0 min-h-[340px] sm:min-h-[410px] lg:rounded-r-3xl overflow-hidden"
        >
          <ParallaxMedia
            range={16}
            overscanScale={1.12}
            scrollScaleDelta={0.02}
            className="w-full h-full min-h-[340px] sm:min-h-[410px]"
          >
            <MenuImage
              src={siteConfig.assets.branchStorefront}
              alt={`صورة توضيحية مؤقتة لواجهة ${siteConfig.brand.nameAr}`}
              fallbackLabel={siteConfig.brand.nameAr}
              priority
              className="w-full h-full min-h-[340px] sm:min-h-[410px]"
            />
          </ParallaxMedia>
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-[#0B0908]/80 via-transparent to-[#0B0908]/50"
          />

          {/* Illuminated Sign Lockup positioned cleanly on the dark upper facade */}
          <div className="absolute top-16 sm:top-20 inset-x-0 flex justify-center pointer-events-none">
            <div className="drop-shadow-[0_4px_18px_rgba(255,196,0,0.32)]">
              <BrandLogo size="lg" />
            </div>
          </div>

          {siteConfig.branch.storefrontIsTemporary && (
            <p className="absolute bottom-12 lg:bottom-4 right-4 z-10 text-[11px] font-bold text-[#F7E8D6]/85 bg-black/65 backdrop-blur-xs px-2.5 py-1 rounded-md">
              صورة توضيحية مؤقتة لحين إضافة صورة الفرع الفعلية
            </p>
          )}

          {/* Organic Irregular Torn Paper Transition on mobile */}
          <div className="lg:hidden absolute bottom-0 inset-x-0">
            <PaperTearDivider className="h-11" />
          </div>
        </motion.div>

        {/* Cream Paper Details Panel (Boards 1, 4, 7 fusion) */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, delay: 0.08, ease: SMOOTH_EASE }}
          aria-label="معلومات الفرع والتواصل"
          className="lg:col-span-6 relative cream-paper-surface text-[#0B0908] flex-1 px-6 sm:px-8 pt-3 pb-10 lg:py-9 lg:rounded-l-3xl flex flex-col justify-between overflow-hidden"
        >
          <div className="relative z-10 space-y-4">
            {siteConfig.branch.isPlaceholder && (
              <div className="flex items-center gap-2 text-xs font-bold text-[#0B0908]/80 pb-2 border-b border-[#0B0908]/15">
                <Info className="w-4 h-4 text-[#D72626] shrink-0" />
                <span>بيانات مؤقتة — يُرجى تحديثها بالبيانات المعتمدة للفرع</span>
              </div>
            )}

            {/* Stylized Architectural Mini-Map Strip (pure vector schematic matching Boards 1 & 7) */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1, ease: SMOOTH_EASE }}
              aria-hidden="true"
              className="relative h-24 w-full rounded-2xl bg-[#EAE0D0] border border-[#0B0908]/12 overflow-hidden shadow-inner"
            >
              <svg
                viewBox="0 0 400 100"
                preserveAspectRatio="none"
                className="w-full h-full opacity-65"
              >
                <rect x="0" y="0" width="400" height="100" fill="#EAE0D0" />
                <path
                  d="M0 32 L400 22 M0 74 L400 66 M88 0 L72 100 M210 0 L224 100 M322 0 L306 100"
                  stroke="#FBF7F0"
                  strokeWidth="7"
                  fill="none"
                />
                <path
                  d="M128 0 L156 100 M0 52 L400 44"
                  stroke="#D9C7B2"
                  strokeWidth="3"
                  fill="none"
                />
                <rect x="96" y="34" width="38" height="24" rx="4" fill="#DFCEB9" />
                <rect x="234" y="28" width="60" height="32" rx="4" fill="#DFCEB9" />
                <rect x="166" y="54" width="44" height="28" rx="4" fill="#DFCEB9" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative flex items-center justify-center">
                  <motion.span
                    animate={{ scale: [1, 1.6, 1], opacity: [0.45, 0, 0.45] }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="absolute w-9 h-9 rounded-full bg-[#D72626]/35"
                  />
                  <span className="relative w-8 h-8 rounded-full bg-[#D72626] text-[#F7E8D6] flex items-center justify-center shadow-md border-2 border-[#F7E8D6]">
                    <MapPin className="w-4 h-4" />
                  </span>
                </div>
              </div>
              <span className="absolute bottom-1.5 left-2.5 text-[10px] font-bold text-[#0B0908]/65 bg-[#F7E8D6]/85 px-2 py-0.5 rounded">
                {siteConfig.brand.nameAr}
              </span>
            </motion.div>

            {/* Location Block */}
            <motion.div
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.28, delay: 0.14, ease: SMOOTH_EASE }}
              className="flex items-start gap-3.5 pb-3.5 border-b border-[#0B0908]/12"
            >
              <div className="w-10 h-10 rounded-full bg-[#0B0908] text-[#FFC400] flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-[#0B0908]">
                  {siteConfig.branch.branchName}
                </h1>
                <p className="text-sm sm:text-base font-medium text-[#0B0908]/80 mt-0.5">
                  {siteConfig.branch.address}
                </p>
              </div>
            </motion.div>

            {/* Opening Hours Block */}
            <motion.div
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.28, delay: 0.2, ease: SMOOTH_EASE }}
              className="flex items-start gap-3.5 pb-3.5 border-b border-[#0B0908]/12"
            >
              <div className="w-10 h-10 rounded-full bg-[#0B0908] text-[#FFC400] flex items-center justify-center shrink-0 mt-0.5">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-[#0B0908]">
                  ساعات العمل
                </h2>
                <p className="text-sm sm:text-base font-medium text-[#0B0908]/80 mt-0.5">
                  {siteConfig.branch.openingHours}
                </p>
              </div>
            </motion.div>

            {/* WhatsApp Contact Block */}
            <motion.div
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.28, delay: 0.26, ease: SMOOTH_EASE }}
              className="flex items-start gap-3.5"
            >
              <div className="w-10 h-10 rounded-full bg-[#0B0908] text-[#FFC400] flex items-center justify-center shrink-0 mt-0.5">
                <WhatsAppIcon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-[#0B0908]">
                  التواصل والطلبات عبر واتساب
                </h2>
                <p className="text-sm font-medium text-[#0B0908]/75 mt-0.5">
                  {whatsappUrl
                    ? `مراسلة فرع ${siteConfig.brand.nameAr} مباشرة`
                    : siteConfig.whatsapp.displayPlaceholder}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Dual Luxury Action CTAs (Board 7 Crimson WhatsApp + Gold Map) */}
          <div className="relative z-10 mt-6 space-y-2.5">
            {whatsappUrl ? (
              <TapRippleAnchor
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                rippleTone="light"
                tapScale={0.96}
                className="group w-full min-h-[50px] px-6 py-3 rounded-full bg-[#D72626] hover:bg-[#0B0908] text-[#F7E8D6] font-black text-base flex items-center justify-center gap-3 shadow-lg shadow-[#D72626]/20 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B0908]"
              >
                <span className="relative z-10">تواصل معنا على واتساب</span>
                <WhatsAppIcon className="w-5 h-5 relative z-10 transition-transform duration-200 group-hover:scale-110" />
              </TapRippleAnchor>
            ) : (
              <TapRippleButton
                type="button"
                onClick={() => setNoticeType('whatsapp')}
                rippleTone="light"
                tapScale={0.96}
                className="group w-full min-h-[50px] px-6 py-3 rounded-full bg-[#D72626] hover:bg-[#0B0908] text-[#F7E8D6] font-black text-base flex items-center justify-center gap-3 shadow-lg shadow-[#D72626]/20 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B0908] cursor-pointer"
              >
                <span className="relative z-10">تواصل معنا على واتساب</span>
                <WhatsAppIcon className="w-5 h-5 relative z-10 transition-transform duration-200 group-hover:scale-110" />
              </TapRippleButton>
            )}

            {verifiedMapsUrl ? (
              <TapRippleAnchor
                href={verifiedMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                rippleTone="dark"
                tapScale={0.96}
                className="group w-full min-h-[52px] px-6 py-3 rounded-full bg-[#FFC400] hover:bg-[#0B0908] text-[#0B0908] hover:text-[#FFC400] font-black text-base sm:text-lg flex items-center justify-center gap-3 shadow-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B0908]"
              >
                <span className="relative z-10">عرض على الخريطة</span>
                <Navigation className="w-5 h-5 relative z-10 transition-transform duration-200 group-hover:scale-110" />
              </TapRippleAnchor>
            ) : (
              <TapRippleButton
                type="button"
                onClick={() => setNoticeType('maps')}
                rippleTone="dark"
                tapScale={0.96}
                hoverScale={1.015}
                className="group w-full min-h-[52px] px-6 py-3 rounded-full bg-[#FFC400] hover:bg-[#0B0908] text-[#0B0908] hover:text-[#FFC400] font-black text-base sm:text-lg flex items-center justify-center gap-3 shadow-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B0908] cursor-pointer"
              >
                <span className="relative z-10">عرض على الخريطة</span>
                <Navigation className="w-5 h-5 relative z-10 transition-transform duration-200 group-hover:scale-110" />
              </TapRippleButton>
            )}
          </div>

          {/* Bottom Brush Corner Accent matching Screen 5 */}
          <CornerBrushAccent className="absolute bottom-0 left-0 w-44 sm:w-52 h-16 sm:h-20" />
        </motion.section>
      </main>

      {/* Notice Modal when verified Google Maps URL or WhatsApp number has not yet been set */}
      <AnimatePresence>
        {noticeType && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: SMOOTH_EASE }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-4"
            role="dialog"
            aria-modal="true"
            aria-label={
              noticeType === 'maps' ? 'رابط خرائط جوجل' : 'رقم واتساب الفرع'
            }
            onClick={() => setNoticeType(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 36, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={TACTILE_SPRING}
              className="w-full max-w-md bg-[#16100C] border border-[#FFC400]/40 rounded-3xl p-5 sm:p-6 text-[#F7E8D6] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h2 className="text-lg font-black text-[#FFC400]">
                  {noticeType === 'maps'
                    ? 'موقع الفرع على الخريطة'
                    : 'رقم واتساب المتجر'}
                </h2>
                <TapRippleButton
                  type="button"
                  rippleTone="yellow"
                  tapScale={0.88}
                  onClick={() => setNoticeType(null)}
                  aria-label="إغلاق"
                  className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-full hover:bg-white/10 cursor-pointer"
                >
                  <X className="w-5 h-5 relative z-10" />
                </TapRippleButton>
              </div>
              <p className="text-sm text-[#F7E8D6]/85 mt-3 leading-relaxed">
                {noticeType === 'maps' ? (
                  <>
                    لم يتم إدخال رابط خرائط جوجل المعتمد للفرع بعد. يُرجى إضافة الرابط الصحيح في الحقل{' '}
                    <span className="font-latin text-[#FFC400]">
                      branch.googleMapsUrl
                    </span>{' '}
                    داخل{' '}
                    <span className="font-latin">src/config/siteConfig.ts</span>.
                  </>
                ) : (
                  <>
                    لم يتم تعيين رقم واتساب المتجر بعد. يُرجى إضافة الرقم المعتمد في الحقل{' '}
                    <span className="font-latin text-[#FFC400]">
                      whatsapp.phoneNumber
                    </span>{' '}
                    داخل{' '}
                    <span className="font-latin">src/config/siteConfig.ts</span>.
                  </>
                )}
              </p>
              <TapRippleButton
                type="button"
                rippleTone="dark"
                tapScale={0.96}
                onClick={() => setNoticeType(null)}
                className="w-full min-h-[46px] mt-5 rounded-full bg-[#FFC400] hover:bg-[#F7E8D6] text-[#0B0908] font-bold text-sm transition-colors cursor-pointer"
              >
                <span className="relative z-10">حسناً</span>
              </TapRippleButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
