import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Search, X, ArrowLeft, MapPin, AlertCircle } from 'lucide-react';
import { CategoryId, MenuCategory, MenuProduct } from '../types/menu';
import { MENU_CATEGORIES, MENU_PRODUCTS } from '../data/menuData';
import { BrandLogo } from './BrandLogo';
import { MenuImage } from './MenuImage';
import { YellowBrushUnderline } from './BrushGraphics';
import { siteConfig } from '../config/siteConfig';
import {
  ParallaxMedia,
  SMOOTH_EASE,
  TACTILE_SPRING,
  TapRippleButton,
  useTapRipple,
  RippleOverlay,
  RippleTone,
} from './MotionPrimitives';

interface CategoriesScreenProps {
  onOpenDrawer: () => void;
  onGoHome: () => void;
  onSelectCategory: (categoryId: CategoryId) => void;
  onSelectProduct: (product: MenuProduct) => void;
  onOpenLocation: () => void;
  hasCartItems?: boolean;
}

interface CategoryThemeStyle {
  cardBg: string;
  textBg: string;
  seamGradient: string;
  titleColor: string;
  countColor: string;
  arrowBg: string;
  glowAccent: string;
  rippleTone: RippleTone;
}

const CATEGORY_THEMES: Record<CategoryId, CategoryThemeStyle> = {
  'hot-coffee': {
    cardBg: 'bg-[#1F140E]',
    textBg: 'bg-gradient-to-l from-[#1F140E] via-[#1F140E]/95 to-transparent',
    seamGradient: 'from-[#1F140E] via-[#1F140E]/65',
    titleColor: 'text-[#F7E8D6] group-hover:text-[#FFC400]',
    countColor: 'text-[#FFC400]/85',
    arrowBg: 'bg-[#FFC400] text-[#0B0908]',
    glowAccent: 'bg-[#FFC400]/10',
    rippleTone: 'yellow',
  },
  'iced-coffee': {
    cardBg: 'bg-[#451116]',
    textBg: 'bg-gradient-to-l from-[#451116] via-[#451116]/95 to-transparent',
    seamGradient: 'from-[#451116] via-[#451116]/65',
    titleColor: 'text-[#F7E8D6] group-hover:text-[#FFC400]',
    countColor: 'text-[#F7E8D6]/80',
    arrowBg: 'bg-[#FFC400] text-[#0B0908]',
    glowAccent: 'bg-[#D72626]/15',
    rippleTone: 'yellow',
  },
  'fresh-juices': {
    cardBg: 'bg-[#0F3B27]',
    textBg: 'bg-gradient-to-l from-[#0F3B27] via-[#0F3B27]/95 to-transparent',
    seamGradient: 'from-[#0F3B27] via-[#0F3B27]/65',
    titleColor: 'text-[#F7E8D6] group-hover:text-[#FFC400]',
    countColor: 'text-[#F7E8D6]/80',
    arrowBg: 'bg-[#FFC400] text-[#0B0908]',
    glowAccent: 'bg-[#198754]/15',
    rippleTone: 'yellow',
  },
  desserts: {
    cardBg: 'bg-[#F5E9D8]',
    textBg: 'bg-gradient-to-l from-[#F5E9D8] via-[#F5E9D8]/95 to-transparent',
    seamGradient: 'from-[#F5E9D8] via-[#F5E9D8]/70',
    titleColor: 'text-[#1A110C] group-hover:text-[#D72626]',
    countColor: 'text-[#1A110C]/75',
    arrowBg: 'bg-[#0B0908] text-[#FFC400]',
    glowAccent: 'bg-[#D4A54A]/15',
    rippleTone: 'dark',
  },
  'special-drinks': {
    cardBg: 'bg-[#FFC400]',
    textBg: 'bg-gradient-to-l from-[#FFC400] via-[#FFC400]/95 to-transparent',
    seamGradient: 'from-[#FFC400] via-[#FFC400]/75',
    titleColor: 'text-[#0B0908]',
    countColor: 'text-[#0B0908]/80',
    arrowBg: 'bg-[#0B0908] text-[#FFC400]',
    glowAccent: 'bg-[#0B0908]/10',
    rippleTone: 'dark',
  },
};

const CategoryCardButton: React.FC<{
  category: MenuCategory;
  index: number;
  itemCount: number;
  onSelect: () => void;
}> = ({ category, index, itemCount, onSelect }) => {
  const { ripples, triggerRipple, triggerCenterRipple, removeRipple } =
    useTapRipple();
  const theme = CATEGORY_THEMES[category.id];

  // Alternating interlocking diagonal silhouettes (no rectangular outline):
  // Even: tall right edge -> tapers toward left edge
  // Odd: tapers toward right edge -> tall left edge (parallel seam with card above)
  const isRightHeavy = index % 2 === 0;
  const clipPolygon = isRightHeavy
    ? 'polygon(0% 13%, 100% 0%, 100% 100%, 0% 87%)'
    : 'polygon(0% 0%, 100% 13%, 100% 87%, 0% 100%)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, scale: 1.015 }}
      whileTap={{ scale: 0.97 }}
      transition={{
        ...TACTILE_SPRING,
        opacity: { duration: 0.28, delay: index * 0.055, ease: SMOOTH_EASE },
        y: { duration: 0.3, delay: index * 0.055, ease: SMOOTH_EASE },
      }}
      className={`relative w-full drop-shadow-[0_14px_24px_rgba(0,0,0,0.68)] hover:z-10 ${
        index > 0 ? '-mt-1.5 sm:-mt-2' : ''
      }`}
    >
      <button
        type="button"
        onPointerDown={triggerRipple}
        onKeyDown={triggerCenterRipple}
        onClick={onSelect}
        style={{ clipPath: clipPolygon }}
        className={`group relative w-full h-32 sm:h-36 overflow-hidden ${theme.cardBg} text-right flex items-stretch focus-visible:outline-none focus-visible:brightness-110 cursor-pointer`}
      >
        <RippleOverlay
          ripples={ripples}
          onDone={removeRipple}
          tone={theme.rippleTone}
        />

        {/* Subtle ambient corner wash */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute -right-10 -top-10 w-44 h-44 rounded-full blur-2xl ${theme.glowAccent}`}
        />

        {/* Right Text Zone (RTL start) — spacious & readable inside both wide and tapered right edges */}
        <div
          className={`relative z-10 flex-1 pr-5 sm:pr-7 pl-3 py-4 flex items-center justify-between gap-3 ${theme.textBg}`}
        >
          <div className="min-w-0">
            <h2
              className={`text-xl sm:text-2xl font-black transition-colors leading-tight ${theme.titleColor}`}
            >
              {category.name}
            </h2>
            <p className={`text-xs sm:text-sm font-bold mt-1 tabular-nums ${theme.countColor}`}>
              {itemCount} أصناف
            </p>
          </div>

          <span
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full ${theme.arrowBg} flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110 group-hover:-translate-x-1 shadow-md`}
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2.25} />
          </span>
        </div>

        {/* Left Photography Pane (RTL end) with Scroll Parallax & seamless gradient blend */}
        <div className="relative z-10 w-[44%] sm:w-[46%] h-full shrink-0 overflow-hidden">
          <ParallaxMedia
            range={10}
            overscanScale={1.15}
            scrollScaleDelta={0.03}
            className="w-full h-full"
          >
            <MenuImage
              src={category.image}
              alt={category.name}
              fallbackLabel={category.name}
              imgClassName="object-center group-hover:scale-105 transition-transform duration-300"
              className="w-full h-full"
            />
          </ParallaxMedia>
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-y-0 right-0 w-14 bg-gradient-to-l ${theme.seamGradient} to-transparent`}
          />
        </div>
      </button>
    </motion.div>
  );
};

export const CategoriesScreen: React.FC<CategoriesScreenProps> = ({
  onOpenDrawer,
  onGoHome,
  onSelectCategory,
  onSelectProduct,
  onOpenLocation,
  hasCartItems = false,
}) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return MENU_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const isSearching = searchQuery.trim().length > 0;

  return (
    <div
      className={`min-h-screen espresso-luxury-bg text-[#F7E8D6] flex flex-col ${
        hasCartItems ? 'pb-20' : ''
      }`}
    >
      {/* Header */}
      <header className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-4 pb-2 flex items-center justify-between gap-4">
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

        <BrandLogo size="sm" onClick={onGoHome} />

        <div className="flex items-center gap-2">
          <TapRippleButton
            type="button"
            onClick={onOpenLocation}
            rippleTone="yellow"
            tapScale={0.95}
            aria-label="الموقع وساعات العمل"
            className="hidden sm:flex min-h-[44px] px-3 items-center gap-1.5 rounded-full text-sm font-bold text-[#F7E8D6]/85 hover:text-[#FFC400] hover:bg-white/5 transition-colors cursor-pointer whitespace-nowrap"
          >
            <MapPin className="w-4 h-4 relative z-10" />
            <span className="relative z-10">الموقع</span>
          </TapRippleButton>

          <TapRippleButton
            type="button"
            onClick={() => {
              setSearchOpen((prev) => !prev);
              if (searchOpen) setSearchQuery('');
            }}
            rippleTone={searchOpen ? 'dark' : 'yellow'}
            tapScale={0.9}
            aria-label={searchOpen ? 'إغلاق البحث' : 'البحث في المنيو'}
            aria-expanded={searchOpen}
            className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-[#FFC400] transition-colors cursor-pointer ${
              searchOpen
                ? 'bg-[#FFC400] text-[#0B0908]'
                : 'text-[#F7E8D6] hover:bg-white/10'
            }`}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={searchOpen ? 'close' : 'search'}
                initial={{ rotate: -45, opacity: 0, scale: 0.7 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 45, opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.16 }}
                className="relative z-10 flex"
              >
                {searchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
              </motion.span>
            </AnimatePresence>
          </TapRippleButton>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 pb-10">
        {/* Expandable Search Bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0, y: -8 }}
              animate={{ height: 'auto', opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: SMOOTH_EASE }}
              className="overflow-hidden"
            >
              <div className="mt-2 mb-4">
                <div className="relative flex items-center bg-[#17110D] border border-[#FFC400]/50 rounded-2xl px-4 py-2 focus-within:border-[#FFC400] transition-colors">
                  <Search className="w-5 h-5 text-[#FFC400] shrink-0 ml-3" />
                  <input
                    type="search"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setSearchQuery('');
                        setSearchOpen(false);
                      }
                    }}
                    placeholder="ابحث عن مشروب أو حلوى (مثال: كابتشينو، مانجو...)"
                    className="w-full min-h-[40px] bg-transparent text-[#F7E8D6] placeholder:text-[#F7E8D6]/45 text-sm sm:text-base focus:outline-none"
                  />
                  {searchQuery && (
                    <TapRippleButton
                      type="button"
                      rippleTone="yellow"
                      tapScale={0.88}
                      onClick={() => setSearchQuery('')}
                      aria-label="مسح البحث"
                      className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-full text-[#F7E8D6]/70 hover:text-[#FFC400] cursor-pointer"
                    >
                      <X className="w-4 h-4 relative z-10" />
                    </TapRippleButton>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Giant Title "المنيو" */}
        <div className="flex flex-col items-center justify-center pt-1 pb-5 select-none">
          <div className="relative inline-block -rotate-2">
            <h1 className="text-5xl sm:text-6xl font-black text-[#F7E8D6] tracking-tight">
              المنيو
            </h1>
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.08, ease: SMOOTH_EASE }}
              style={{ originX: 1 }}
            >
              <YellowBrushUnderline className="mt-1 w-36 sm:w-44 mx-auto" />
            </motion.div>
          </div>
        </div>

        {/* Search Results View OR Editorial Category Cards */}
        <AnimatePresence mode="wait">
          {isSearching ? (
            <motion.section
              key="search-results"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: SMOOTH_EASE }}
              aria-label="نتائج البحث"
              className="max-w-3xl mx-auto"
            >
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/15">
                <h2 className="text-base font-bold text-[#FFC400]">
                  نتائج البحث ({filteredProducts.length})
                </h2>
                <TapRippleButton
                  type="button"
                  rippleTone="yellow"
                  tapScale={0.94}
                  onClick={() => setSearchQuery('')}
                  className="text-xs font-bold text-[#F7E8D6]/70 hover:text-[#FFC400] cursor-pointer min-h-[36px] px-3 rounded-full"
                >
                  <span className="relative z-10">عرض جميع الأقسام</span>
                </TapRippleButton>
              </div>

              {filteredProducts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 px-4 text-center rounded-2xl border border-white/10 bg-[#17110D]"
                >
                  <p className="text-lg font-bold text-[#F7E8D6] mb-2">
                    لا توجد أصناف مطابقة لـ «{searchQuery}»
                  </p>
                  <p className="text-sm text-[#F7E8D6]/65 mb-5">
                    جرّب البحث باسم آخر أو تصفح أقسام المنيو.
                  </p>
                  <TapRippleButton
                    type="button"
                    rippleTone="dark"
                    tapScale={0.95}
                    onClick={() => setSearchQuery('')}
                    className="min-h-[44px] px-6 rounded-full bg-[#FFC400] hover:bg-[#F7E8D6] text-[#0B0908] font-bold text-sm cursor-pointer transition-colors"
                  >
                    <span className="relative z-10">العودة للأقسام</span>
                  </TapRippleButton>
                </motion.div>
              ) : (
                <div className="divide-y divide-white/15">
                  {filteredProducts.map((product, idx) => {
                    const catName = MENU_CATEGORIES.find(
                      (c) => c.id === product.categoryId
                    )?.name;
                    return (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: Math.min(idx * 0.035, 0.25),
                          duration: 0.22,
                          ease: SMOOTH_EASE,
                        }}
                      >
                        <TapRippleButton
                          type="button"
                          rippleTone="yellow"
                          tapScale={0.985}
                          onClick={() => onSelectProduct(product)}
                          className="group w-full py-4 px-3 flex items-center gap-4 text-right hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
                        >
                          <ParallaxMedia
                            range={7}
                            overscanScale={1.14}
                            scrollScaleDelta={0.02}
                            className="relative z-10 w-20 h-20 rounded-2xl shrink-0 border border-white/10"
                          >
                            <MenuImage
                              src={product.image}
                              alt={product.name}
                              fallbackLabel={product.name}
                              className="w-full h-full"
                            />
                          </ParallaxMedia>
                          <div className="relative z-10 flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-lg font-bold text-[#F7E8D6] group-hover:text-[#FFC400] transition-colors truncate">
                                {product.name}
                              </h3>
                              {catName && (
                                <span className="text-xs font-medium text-[#F7E8D6]/55">
                                  · {catName}
                                </span>
                              )}
                              {!product.available && (
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#D72626]">
                                  <AlertCircle className="w-3.5 h-3.5" />
                                  غير متوفر
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-[#F7E8D6]/70 line-clamp-1 mt-0.5">
                              {product.description}
                            </p>
                            <p className="text-base font-black text-[#FFC400] mt-1 tabular-nums">
                              <span className="font-latin">{product.price}</span>{' '}
                              {siteConfig.currency.symbolAr}
                            </p>
                          </div>
                          <span className="relative z-10 w-9 h-9 rounded-full bg-[#FFC400]/15 text-[#FFC400] flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:-translate-x-1">
                            <ArrowLeft className="w-4 h-4" />
                          </span>
                        </TapRippleButton>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.section>
          ) : (
            <motion.section
              key="categories-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              aria-label="أقسام المنيو"
              className="flex flex-col max-w-lg sm:max-w-xl lg:max-w-2xl mx-auto"
            >
              {MENU_CATEGORIES.map((category: MenuCategory, index: number) => {
                const count = MENU_PRODUCTS.filter(
                  (p) => p.categoryId === category.id
                ).length;
                return (
                  <CategoryCardButton
                    key={category.id}
                    category={category}
                    index={index}
                    itemCount={count}
                    onSelect={() => onSelectCategory(category.id)}
                  />
                );
              })}
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
