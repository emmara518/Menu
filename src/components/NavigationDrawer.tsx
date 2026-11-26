import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Home, LayoutGrid, MapPin, Heart } from 'lucide-react';
import { AppScreen, CategoryId } from '../types/menu';
import { MENU_CATEGORIES } from '../data/menuData';
import { BrandLogo } from './BrandLogo';
import { siteConfig } from '../config/siteConfig';
import { SMOOTH_EASE, TapRippleButton } from './MotionPrimitives';

interface NavigationDrawerProps {
  open: boolean;
  onClose: () => void;
  currentScreen: AppScreen;
  onNavigateScreen: (screen: AppScreen) => void;
  onSelectCategory: (categoryId: CategoryId) => void;
  favoritesCount: number;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  open,
  onClose,
  currentScreen,
  onNavigateScreen,
  onSelectCategory,
  favoritesCount,
}) => {
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex justify-start"
          role="dialog"
          aria-modal="true"
          aria-label="قائمة التنقل"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: SMOOTH_EASE }}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 360, damping: 34, mass: 0.8 }}
            className="relative z-10 w-80 max-w-[85vw] h-full bg-[#0B0908] border-l border-white/15 flex flex-col justify-between p-6 overflow-y-auto shadow-2xl"
          >
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-white/15">
                <BrandLogo
                  size="sm"
                  onClick={() => {
                    onNavigateScreen('home');
                    onClose();
                  }}
                />
                <TapRippleButton
                  type="button"
                  onClick={onClose}
                  rippleTone="yellow"
                  tapScale={0.9}
                  aria-label="إغلاق القائمة"
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-[#F7E8D6] hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-[#FFC400] transition-colors cursor-pointer"
                >
                  <X className="w-6 h-6 relative z-10" />
                </TapRippleButton>
              </div>

              <nav className="mt-6 space-y-2" aria-label="التنقل الرئيسي">
                {[
                  {
                    screen: 'home' as AppScreen,
                    label: 'الرئيسية',
                    icon: Home,
                  },
                  {
                    screen: 'categories' as AppScreen,
                    label: 'المنيو والأقسام',
                    icon: LayoutGrid,
                  },
                  {
                    screen: 'location' as AppScreen,
                    label: 'الموقع وساعات العمل',
                    icon: MapPin,
                  },
                ].map(({ screen, label, icon: Icon }, idx) => {
                  const active = currentScreen === screen;
                  return (
                    <motion.div
                      key={screen}
                      initial={{ opacity: 0, x: 18 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.05 + idx * 0.04,
                        duration: 0.22,
                        ease: SMOOTH_EASE,
                      }}
                    >
                      <TapRippleButton
                        type="button"
                        rippleTone={active ? 'dark' : 'yellow'}
                        tapScale={0.97}
                        onClick={() => {
                          onNavigateScreen(screen);
                          onClose();
                        }}
                        className={`w-full min-h-[48px] flex items-center gap-3 px-4 rounded-xl text-base font-bold transition-colors cursor-pointer ${
                          active
                            ? 'bg-[#FFC400] text-[#0B0908]'
                            : 'text-[#F7E8D6] hover:bg-white/5'
                        }`}
                      >
                        <Icon className="w-5 h-5 shrink-0 relative z-10" />
                        <span className="relative z-10">{label}</span>
                      </TapRippleButton>
                    </motion.div>
                  );
                })}
              </nav>

              <div className="mt-8 pt-6 border-t border-white/15">
                <p className="text-xs font-bold text-[#F7E8D6]/60 mb-3 px-2">
                  أقسام المنيو
                </p>
                <div className="space-y-1">
                  {MENU_CATEGORIES.map((category, idx) => (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, x: 14 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.14 + idx * 0.035,
                        duration: 0.22,
                        ease: SMOOTH_EASE,
                      }}
                    >
                      <TapRippleButton
                        type="button"
                        rippleTone="yellow"
                        tapScale={0.97}
                        onClick={() => {
                          onSelectCategory(category.id);
                          onClose();
                        }}
                        className="group w-full min-h-[44px] flex items-center justify-between px-3 rounded-lg text-sm font-bold text-[#F7E8D6]/90 hover:text-[#FFC400] hover:bg-white/5 transition-colors cursor-pointer"
                      >
                        <span className="relative z-10">{category.name}</span>
                        <span className="relative z-10 text-[#FFC400] text-xs transition-transform duration-150 group-hover:-translate-x-1">
                          ←
                        </span>
                      </TapRippleButton>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/15 space-y-2">
              {favoritesCount > 0 && (
                <div className="flex items-center gap-2 text-xs text-[#F7E8D6]/80 px-2">
                  <Heart className="w-4 h-4 text-[#D9332B] fill-[#D9332B]" />
                  <span className="tabular-nums">المفضلة: {favoritesCount}</span>
                </div>
              )}
              <p className="text-xs text-[#F7E8D6]/50 px-2">
                {siteConfig.brand.nameAr} · {siteConfig.brand.tagline}
              </p>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};
