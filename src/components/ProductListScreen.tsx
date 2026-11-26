import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronRight,
  ArrowLeft,
  Search,
  X,
  AlertCircle,
  Plus,
  Check,
} from 'lucide-react';
import { CategoryId, MenuProduct } from '../types/menu';
import { MENU_CATEGORIES, MENU_PRODUCTS } from '../data/menuData';
import { MenuImage } from './MenuImage';
import {
  HeaderCoffeeSteamIcon,
  YellowBrushSplash,
  YellowBrushUnderline,
} from './BrushGraphics';
import { siteConfig } from '../config/siteConfig';
import {
  ParallaxMedia,
  SMOOTH_EASE,
  TACTILE_SPRING,
  TapRippleButton,
} from './MotionPrimitives';

type SubFilter = 'all' | 'featured' | 'available';

interface ProductListScreenProps {
  selectedCategoryId: CategoryId;
  initialHighlightedProductId?: string;
  onSelectCategory: (categoryId: CategoryId) => void;
  onBack: () => void;
  onSelectProduct: (product: MenuProduct) => void;
  onQuickAdd: (product: MenuProduct) => void;
  hasCartItems?: boolean;
}

export const ProductListScreen: React.FC<ProductListScreenProps> = ({
  selectedCategoryId,
  initialHighlightedProductId,
  onSelectCategory,
  onBack,
  onSelectProduct,
  onQuickAdd,
  hasCartItems = false,
}) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [subFilter, setSubFilter] = useState<SubFilter>('all');
  const [highlightedId, setHighlightedId] = useState<string | null>(() => {
    const initialMatch = MENU_PRODUCTS.find(
      (p) =>
        p.id === initialHighlightedProductId &&
        p.categoryId === selectedCategoryId &&
        p.available
    );
    if (initialMatch) return initialMatch.id;
    const featured = MENU_PRODUCTS.find(
      (p) => p.categoryId === selectedCategoryId && p.featured && p.available
    );
    return featured ? featured.id : null;
  });
  const [justAddedId, setJustAddedId] = useState<string | null>(null);
  const activeTabRef = useRef<HTMLButtonElement | null>(null);
  const addedTimerRef = useRef<number | null>(null);
  const selectTimerRef = useRef<number | null>(null);
  const prevCategoryRef = useRef<CategoryId>(selectedCategoryId);
  const highlightedBeforeTapRef = useRef<string | null>(null);

  const currentCategory = useMemo(
    () =>
      MENU_CATEGORIES.find((c) => c.id === selectedCategoryId) ??
      MENU_CATEGORIES[0],
    [selectedCategoryId]
  );

  const categoryProducts = useMemo(() => {
    let base = MENU_PRODUCTS.filter((p) => p.categoryId === selectedCategoryId);
    if (subFilter === 'featured') {
      base = base.filter((p) => p.featured);
    } else if (subFilter === 'available') {
      base = base.filter((p) => p.available);
    }
    const q = query.trim().toLowerCase();
    if (!q) return base;
    return base.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [selectedCategoryId, query, subFilter]);

  useEffect(() => {
    const categoryChanged = prevCategoryRef.current !== selectedCategoryId;
    prevCategoryRef.current = selectedCategoryId;

    setSubFilter('all');
    if (categoryChanged) {
      const featured = MENU_PRODUCTS.find(
        (p) => p.categoryId === selectedCategoryId && p.featured && p.available
      );
      const firstAvailable = MENU_PRODUCTS.find(
        (p) => p.categoryId === selectedCategoryId && p.available
      );
      setHighlightedId(featured?.id ?? firstAvailable?.id ?? null);
    }

    activeTabRef.current?.scrollIntoView({
      inline: 'nearest',
      block: 'nearest',
      behavior: 'smooth',
    });
  }, [selectedCategoryId]);

  useEffect(() => {
    return () => {
      if (addedTimerRef.current) window.clearTimeout(addedTimerRef.current);
      if (selectTimerRef.current) window.clearTimeout(selectTimerRef.current);
    };
  }, []);

  const handleProductPress = (product: MenuProduct) => {
    if (!product.available) {
      highlightedBeforeTapRef.current = null;
      onSelectProduct(product);
      return;
    }

    const wasAlreadyHighlighted =
      highlightedBeforeTapRef.current !== null
        ? highlightedBeforeTapRef.current === product.id
        : highlightedId === product.id;
    highlightedBeforeTapRef.current = null;

    setHighlightedId(product.id);

    if (selectTimerRef.current) {
      window.clearTimeout(selectTimerRef.current);
      selectTimerRef.current = null;
    }

    if (wasAlreadyHighlighted) {
      onSelectProduct(product);
    } else {
      selectTimerRef.current = window.setTimeout(() => {
        selectTimerRef.current = null;
        onSelectProduct(product);
      }, 95);
    }
  };

  const handleQuickAddClick = (product: MenuProduct) => {
    if (!product.available) return;
    setHighlightedId(product.id);
    onQuickAdd(product);
    setJustAddedId(product.id);
    if (addedTimerRef.current) window.clearTimeout(addedTimerRef.current);
    addedTimerRef.current = window.setTimeout(() => {
      setJustAddedId((curr) => (curr === product.id ? null : curr));
    }, 950);
  };

  return (
    <div
      className={`min-h-screen espresso-luxury-bg text-[#F7E8D6] flex flex-col ${
        hasCartItems ? 'pb-20' : ''
      }`}
    >
      {/* Top Bar */}
      <header className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-4 pb-2 flex items-center justify-between">
        <TapRippleButton
          type="button"
          onClick={onBack}
          rippleTone="yellow"
          tapScale={0.9}
          aria-label="العودة للأقسام"
          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-[#F7E8D6] hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-[#FFC400] transition-colors cursor-pointer"
        >
          <ChevronRight className="w-6 h-6 relative z-10" />
        </TapRippleButton>

        <div className="flex flex-col items-center">
          <HeaderCoffeeSteamIcon className="w-8 h-8 text-[#FFC400]" />
        </div>

        <TapRippleButton
          type="button"
          onClick={() => {
            setSearchOpen((prev) => !prev);
            if (searchOpen) setQuery('');
          }}
          rippleTone={searchOpen ? 'dark' : 'yellow'}
          tapScale={0.9}
          aria-label={searchOpen ? 'إغلاق البحث' : 'بحث في هذا القسم'}
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
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 pb-12">
        {/* Category Heading with Brush Underline */}
        <div className="flex flex-col items-center text-center mb-4 select-none min-h-[60px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentCategory.id}
              initial={{ opacity: 0, y: 10, rotate: -1 }}
              animate={{ opacity: 1, y: 0, rotate: -1 }}
              exit={{ opacity: 0, y: -8, rotate: -1 }}
              transition={{ duration: 0.2, ease: SMOOTH_EASE }}
              className="relative inline-block"
            >
              <h1 className="text-3xl sm:text-4xl font-black text-[#F7E8D6]">
                {currentCategory.name}
              </h1>
              <YellowBrushUnderline className="mt-1 w-44 sm:w-52 mx-auto" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Category Switcher Tabs with gliding active pill */}
        <nav
          aria-label="التبديل بين الأقسام"
          className="flex items-center gap-2 overflow-x-auto pb-3 mb-2 border-b border-white/10 no-scrollbar"
        >
          {MENU_CATEGORIES.map((cat) => {
            const active = cat.id === selectedCategoryId;
            return (
              <TapRippleButton
                key={cat.id}
                ref={active ? activeTabRef : undefined}
                type="button"
                rippleTone={active ? 'dark' : 'yellow'}
                tapScale={0.94}
                onClick={() => onSelectCategory(cat.id)}
                className={`relative min-h-[40px] px-3.5 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  active
                    ? 'text-[#0B0908]'
                    : 'bg-[#17110D] text-[#F7E8D6]/80 hover:text-[#FFC400] border border-[#FFC400]/15'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="category-active-tab"
                    transition={{ type: 'spring', stiffness: 520, damping: 34 }}
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-[#FFC400] z-0"
                  />
                )}
                <span className="relative z-10">{cat.name}</span>
              </TapRippleButton>
            );
          })}
        </nav>

        {/* Sub-Filter Segmented Row (Board 6 luxury filter bar) */}
        <div
          role="group"
          aria-label="تصفية الأصناف"
          className="flex items-center gap-2 mb-3 overflow-x-auto no-scrollbar py-1"
        >
          {(
            [
              { id: 'all', label: 'الكل' },
              { id: 'featured', label: 'الأكثر طلباً' },
              { id: 'available', label: 'متوفر الآن' },
            ] as const
          ).map((tab) => {
            const active = subFilter === tab.id;
            return (
              <TapRippleButton
                key={tab.id}
                type="button"
                rippleTone={active ? 'dark' : 'yellow'}
                tapScale={0.93}
                onClick={() => setSubFilter(tab.id)}
                className={`relative min-h-[34px] px-3.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  active
                    ? 'text-[#0B0908]'
                    : 'text-[#F7E8D6]/70 hover:text-[#FFC400] bg-white/[0.03]'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="product-subfilter-pill"
                    transition={{ type: 'spring', stiffness: 430, damping: 30 }}
                    aria-hidden="true"
                    className="absolute inset-0 rounded-lg bg-[#F7E8D6] z-0"
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </TapRippleButton>
            );
          })}
        </div>

        {/* Inline Category Search */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0, y: -6 }}
              animate={{ height: 'auto', opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: SMOOTH_EASE }}
              className="overflow-hidden"
            >
              <div className="mb-4">
                <div className="relative flex items-center bg-[#17110D] border border-[#FFC400]/50 rounded-2xl px-4 py-1.5 focus-within:border-[#FFC400]">
                  <Search className="w-4 h-4 text-[#FFC400] shrink-0 ml-2.5" />
                  <input
                    type="search"
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setQuery('');
                        setSearchOpen(false);
                      }
                    }}
                    placeholder={`ابحث في ${currentCategory.name}...`}
                    className="w-full min-h-[40px] bg-transparent text-[#F7E8D6] placeholder:text-[#F7E8D6]/45 text-sm focus:outline-none"
                  />
                  {query && (
                    <TapRippleButton
                      type="button"
                      rippleTone="yellow"
                      tapScale={0.88}
                      onClick={() => setQuery('')}
                      aria-label="مسح البحث"
                      className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-full text-[#F7E8D6]/70 cursor-pointer"
                    >
                      <X className="w-4 h-4 relative z-10" />
                    </TapRippleButton>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Smooth Category Product List */}
        <AnimatePresence mode="wait">
          {categoryProducts.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.2, ease: SMOOTH_EASE }}
              className="py-12 px-4 text-center rounded-2xl border border-white/10 bg-[#17110D]"
            >
              <p className="text-lg font-bold text-[#F7E8D6] mb-2">
                لا توجد أصناف مطابقة لاختيارك
              </p>
              <TapRippleButton
                type="button"
                rippleTone="dark"
                tapScale={0.95}
                onClick={() => {
                  setQuery('');
                  setSubFilter('all');
                }}
                className="min-h-[44px] px-6 mt-2 rounded-full bg-[#FFC400] hover:bg-[#F7E8D6] text-[#0B0908] font-bold text-sm transition-colors cursor-pointer"
              >
                <span className="relative z-10">عرض كل أصناف القسم</span>
              </TapRippleButton>
            </motion.div>
          ) : (
            <motion.div
              key={`${selectedCategoryId}-${subFilter}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: SMOOTH_EASE }}
              className="space-y-2.5"
            >
              {categoryProducts.map((product, index) => {
                const isHighlighted =
                  highlightedId === product.id && product.available;
                const isJustAdded = justAddedId === product.id;

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: Math.min(index * 0.04, 0.24),
                      duration: 0.22,
                      ease: SMOOTH_EASE,
                    }}
                    onPointerEnter={(e) => {
                      if (e.pointerType === 'mouse' && product.available) {
                        setHighlightedId(product.id);
                      }
                    }}
                    className={`relative rounded-2xl flex items-center transition-colors ${
                      isHighlighted
                        ? ''
                        : 'bg-[#16100C]/65 hover:bg-[#1E1510]/90'
                    }`}
                  >
                    {/* Gliding Proportional Yellow Brush Highlight matching Screen 3 */}
                    {isHighlighted && (
                      <motion.div
                        layoutId="product-row-brush"
                        transition={{
                          type: 'spring',
                          stiffness: 520,
                          damping: 34,
                          mass: 0.55,
                        }}
                        aria-hidden="true"
                        className="absolute inset-0 pointer-events-none z-0"
                      >
                        <YellowBrushSplash className="w-full h-full" />
                      </motion.div>
                    )}

                    {/* Primary Product Row Action */}
                    <TapRippleButton
                      type="button"
                      rippleTone={isHighlighted ? 'dark' : 'yellow'}
                      tapScale={0.985}
                      onPointerDown={() => {
                        highlightedBeforeTapRef.current = highlightedId;
                        if (product.available) setHighlightedId(product.id);
                      }}
                      onPointerCancel={() => {
                        highlightedBeforeTapRef.current = null;
                      }}
                      onFocus={() => {
                        if (product.available) setHighlightedId(product.id);
                      }}
                      onClick={() => handleProductPress(product)}
                      className="group relative z-10 flex-1 min-w-0 min-h-[88px] px-3 sm:px-4 py-2.5 flex items-center gap-3.5 sm:gap-4 text-right rounded-2xl focus-visible:outline-2 focus-visible:outline-[#FFC400] cursor-pointer"
                    >
                      {/* Circular Product Thumbnail with Scroll Parallax */}
                      <ParallaxMedia
                        range={9}
                        overscanScale={1.16}
                        scrollScaleDelta={0.03}
                        className={`relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full shrink-0 border ${
                          isHighlighted
                            ? 'border-[#0B0908]/30 shadow-md'
                            : 'border-[#FFC400]/25'
                        } ${!product.available ? 'opacity-50 grayscale' : ''}`}
                      >
                        <MenuImage
                          src={product.image}
                          alt={product.name}
                          fallbackLabel={product.name}
                          imgClassName="object-center group-hover:scale-105 transition-transform duration-300"
                          className="w-full h-full"
                        />
                      </ParallaxMedia>

                      {/* Aligned Product Name, Description & Price */}
                      <div className="relative z-10 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2
                            className={`text-lg sm:text-xl font-bold leading-snug transition-colors ${
                              isHighlighted
                                ? 'text-[#0B0908]'
                                : !product.available
                                ? 'text-[#F7E8D6]/60'
                                : 'text-[#F7E8D6]'
                            }`}
                          >
                            {product.name}
                          </h2>

                          {!product.available && (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-[#D72626]">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                              <span>غير متوفر</span>
                            </span>
                          )}
                        </div>

                        <p
                          className={`text-xs sm:text-sm font-medium mt-0.5 line-clamp-1 sm:line-clamp-2 transition-colors ${
                            isHighlighted
                              ? 'text-[#0B0908]/85'
                              : !product.available
                              ? 'text-[#F7E8D6]/45'
                              : 'text-[#F7E8D6]/75'
                          }`}
                        >
                          {product.description}
                        </p>

                        <div
                          className={`mt-1 text-base sm:text-lg font-black tabular-nums transition-colors ${
                            isHighlighted
                              ? 'text-[#0B0908]'
                              : !product.available
                              ? 'text-[#FFC400]/60'
                              : 'text-[#FFC400]'
                          }`}
                        >
                          <span className="font-latin">{product.price}</span>{' '}
                          <span className="text-xs sm:text-sm font-bold">
                            {siteConfig.currency.symbolAr}
                          </span>
                        </div>
                      </div>
                    </TapRippleButton>

                    {/* Quick-Add + / Details Arrow Trailing Actions */}
                    <div className="relative z-10 pl-3 sm:pl-4 flex items-center gap-2 shrink-0">
                      {product.available && (
                        <TapRippleButton
                          type="button"
                          rippleTone={isJustAdded ? 'light' : 'dark'}
                          tapScale={0.84}
                          onClick={() => handleQuickAddClick(product)}
                          aria-label={`إضافة ${product.name} إلى الطلب`}
                          className={`min-h-[40px] min-w-[40px] rounded-full flex items-center justify-center transition-colors cursor-pointer shadow-md ${
                            isJustAdded
                              ? 'bg-[#0F5132] text-[#F7E8D6]'
                              : isHighlighted
                              ? 'bg-[#0B0908] text-[#FFC400] hover:bg-[#1B120C]'
                              : 'bg-[#FFC400] text-[#0B0908] hover:bg-[#F7E8D6]'
                          }`}
                        >
                          <AnimatePresence mode="wait" initial={false}>
                            <motion.span
                              key={isJustAdded ? 'added' : 'plus'}
                              initial={{ scale: 0.5, rotate: -45, opacity: 0 }}
                              animate={{ scale: 1, rotate: 0, opacity: 1 }}
                              exit={{ scale: 0.5, rotate: 45, opacity: 0 }}
                              transition={{ duration: 0.16 }}
                              className="relative z-10 flex"
                            >
                              {isJustAdded ? (
                                <Check className="w-4 h-4" strokeWidth={2.75} />
                              ) : (
                                <Plus className="w-4 h-4" strokeWidth={2.75} />
                              )}
                            </motion.span>
                          </AnimatePresence>
                        </TapRippleButton>
                      )}

                      {isHighlighted && (
                        <TapRippleButton
                          type="button"
                          rippleTone="dark"
                          tapScale={0.88}
                          onClick={() => onSelectProduct(product)}
                          aria-label={`عرض تفاصيل ${product.name}`}
                          className="hidden sm:flex min-h-[40px] min-w-[40px] rounded-full bg-[#0B0908]/15 text-[#0B0908] hover:bg-[#0B0908] hover:text-[#FFC400] items-center justify-center transition-colors cursor-pointer"
                        >
                          <ArrowLeft className="w-4 h-4 relative z-10" />
                        </TapRippleButton>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
