import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronRight,
  Heart,
  Minus,
  Plus,
  Copy,
  Check,
  X,
  AlertCircle,
  ShoppingBag,
} from 'lucide-react';
import { MenuProduct, ProductSizeOption } from '../types/menu';
import { MenuImage } from './MenuImage';
import {
  CoffeeBeanGraphic,
  CoffeeCupIcon,
  CornerBrushAccent,
  PaperTearDivider,
  WhatsAppIcon,
  YellowBrushSplash,
} from './BrushGraphics';
import { siteConfig } from '../config/siteConfig';
import {
  buildWhatsAppOrderMessage,
  getWhatsAppOrderUrl,
} from '../utils/whatsapp';
import {
  ParallaxStage,
  SMOOTH_EASE,
  TACTILE_SPRING,
  TapRippleButton,
} from './MotionPrimitives';

interface ProductDetailScreenProps {
  product: MenuProduct;
  isFavorite: boolean;
  onToggleFavorite: (productId: string) => void;
  onAddToCart: (
    product: MenuProduct,
    selectedSize?: ProductSizeOption,
    quantity?: number
  ) => void;
  onBack: () => void;
  hasCartItems?: boolean;
}

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  product,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
  onBack,
  hasCartItems = false,
}) => {
  const defaultSize: ProductSizeOption | undefined =
    product.supportsSizes && product.sizes && product.sizes.length > 0
      ? product.sizes.find((s) => s.key === 'medium') ?? product.sizes[0]
      : undefined;

  const [selectedSize, setSelectedSize] = useState<ProductSizeOption | undefined>(
    defaultSize
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [qtyDirection, setQtyDirection] = useState<1 | -1>(1);
  const [justAdded, setJustAdded] = useState(false);
  const [previewMessage, setPreviewMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const addedTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const nextDefault =
      product.supportsSizes && product.sizes && product.sizes.length > 0
        ? product.sizes.find((s) => s.key === 'medium') ?? product.sizes[0]
        : undefined;
    setSelectedSize(nextDefault);
    setQuantity(1);
    setJustAdded(false);
    setPreviewMessage(null);
    setCopied(false);
  }, [product]);

  useEffect(() => {
    return () => {
      if (addedTimerRef.current !== null) {
        window.clearTimeout(addedTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!previewMessage) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPreviewMessage(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [previewMessage]);

  const unitPrice = selectedSize ? selectedSize.price : product.price;
  const totalPrice = unitPrice * quantity;

  const handleOrderClick = () => {
    if (!product.available) return;
    const message = buildWhatsAppOrderMessage({
      product,
      selectedSize,
      quantity,
    });
    const url = getWhatsAppOrderUrl(message);

    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      setPreviewMessage(message);
    }
  };

  const handleAddToTrayClick = () => {
    if (!product.available) return;
    onAddToCart(product, selectedSize, quantity);
    setJustAdded(true);
    if (addedTimerRef.current !== null) {
      window.clearTimeout(addedTimerRef.current);
    }
    addedTimerRef.current = window.setTimeout(() => {
      setJustAdded(false);
    }, 1150);
  };

  const handleCopyMessage = async () => {
    if (!previewMessage) return;
    try {
      await navigator.clipboard.writeText(previewMessage);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = previewMessage;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      } finally {
        document.body.removeChild(textarea);
      }
    }
  };

  return (
    <div className="min-h-screen espresso-luxury-bg text-[#F7E8D6] flex flex-col">
      {/* Top Overlay Navigation */}
      <header className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-4 pb-2 flex items-center justify-between">
        <TapRippleButton
          type="button"
          onClick={onBack}
          rippleTone="yellow"
          tapScale={0.9}
          aria-label="العودة للمنتجات"
          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-black/55 backdrop-blur-sm text-[#F7E8D6] hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-[#FFC400] transition-colors cursor-pointer"
        >
          <ChevronRight className="w-6 h-6 relative z-10" />
        </TapRippleButton>

        <TapRippleButton
          type="button"
          onClick={() => onToggleFavorite(product.id)}
          rippleTone={isFavorite ? 'crimson' : 'yellow'}
          tapScale={0.86}
          aria-label={isFavorite ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
          aria-pressed={isFavorite}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-black/55 backdrop-blur-sm text-[#F7E8D6] hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-[#FFC400] transition-colors cursor-pointer"
        >
          <motion.span
            key={isFavorite ? 'fav-on' : 'fav-off'}
            initial={isFavorite ? { scale: 0.7 } : { scale: 1 }}
            animate={
              isFavorite ? { scale: [1, 1.38, 0.92, 1] } : { scale: [1, 0.85, 1] }
            }
            transition={{ duration: 0.34, ease: SMOOTH_EASE }}
            className="relative z-10 flex items-center justify-center"
          >
            <Heart
              className={`w-6 h-6 transition-colors ${
                isFavorite ? 'text-[#D72626] fill-[#D72626]' : 'text-[#F7E8D6]'
              }`}
            />
          </motion.span>
        </TapRippleButton>
      </header>

      {/* Main Layout: Mobile torn-paper transition from dark photography into Cream parchment; Desktop split */}
      <main className="flex-1 w-full max-w-5xl mx-auto flex flex-col lg:grid lg:grid-cols-12 lg:items-stretch lg:gap-8 lg:px-6 lg:pb-12 lg:pt-4">
        {/* Product Image Stage */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.38, ease: SMOOTH_EASE }}
          className="lg:col-span-6 relative -mt-[68px] lg:mt-0 flex items-center justify-center bg-[#0B0908] lg:rounded-3xl lg:border lg:border-white/10 overflow-hidden"
        >
          {/* Warm Roast Spotlight Glow behind product with counter-parallax */}
          <ParallaxStage
            yDistance={-18}
            exitScale={1.06}
            className="pointer-events-none absolute inset-0"
          >
            <div
              aria-hidden="true"
              className="w-full h-full bg-[radial-gradient(circle_at_50%_46%,rgba(255,196,0,0.22),rgba(215,38,38,0.09)_42%,transparent_72%)]"
            />
          </ParallaxStage>

          {/* Subtle Coffee Bean Accents */}
          <ParallaxStage
            yDistance={-22}
            exitScale={1.05}
            className="pointer-events-none absolute top-20 right-6"
          >
            <CoffeeBeanGraphic className="w-7 h-7 opacity-40 rotate-12" />
          </ParallaxStage>
          <ParallaxStage
            yDistance={-14}
            exitScale={1.04}
            className="pointer-events-none hidden sm:block absolute bottom-16 left-6"
          >
            <CoffeeBeanGraphic className="w-8 h-8 opacity-35 -rotate-45" />
          </ParallaxStage>

          <div className="relative w-full max-w-[420px] lg:max-w-[460px] aspect-square mx-auto pt-12 pb-6 px-4 lg:py-8">
            <ParallaxStage yDistance={30} exitScale={0.93} className="w-full h-full">
              <MenuImage
                src={product.image}
                alt={product.name}
                fallbackLabel={product.name}
                priority
                transparentBg
                className="w-full h-full drop-shadow-[0_22px_34px_rgba(0,0,0,0.85)]"
              />
            </ParallaxStage>
          </div>

          {/* Torn Paper Edge into Cream Parchment on mobile */}
          <div className="lg:hidden absolute bottom-0 inset-x-0 z-10">
            <PaperTearDivider className="h-11" />
          </div>
        </motion.div>

        {/* Cream Paper Details Panel (Boards 1, 3, 5, 7 fusion) */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.36, delay: 0.08, ease: SMOOTH_EASE }}
          aria-label="تفاصيل المنتج والطلب"
          className={`lg:col-span-6 relative cream-paper-surface text-[#0B0908] flex-1 px-6 sm:px-8 pt-3 lg:py-8 lg:rounded-3xl lg:border lg:border-[#FFC400]/25 lg:shadow-2xl flex flex-col items-center lg:items-start text-center lg:text-right justify-between overflow-hidden ${
            hasCartItems ? 'pb-24 lg:pb-24' : 'pb-10 lg:pb-8'
          }`}
        >
          <div className="relative z-10 w-full flex flex-col items-center lg:items-start">
            {/* Product Name framed over Crimson Brush Splash */}
            <motion.div
              initial={{ scale: 0.92, rotate: -3 }}
              animate={{ scale: 1, rotate: -2 }}
              transition={TACTILE_SPRING}
              className="relative inline-flex items-center justify-center px-8 py-2.5 mb-2.5"
            >
              <YellowBrushSplash
                color="#D72626"
                className="absolute inset-0 w-full h-full"
              />
              <h1 className="relative z-10 text-2xl sm:text-3xl font-black text-[#F7E8D6]">
                {product.name}
              </h1>
            </motion.div>

            {!product.available && (
              <div className="inline-flex items-center gap-1.5 text-sm font-bold text-[#D72626] mb-2">
                <AlertCircle className="w-4 h-4" />
                <span>غير متوفر حالياً</span>
              </div>
            )}

            <p className="text-sm sm:text-base font-medium text-[#0B0908]/80 max-w-md leading-relaxed">
              {product.description}
            </p>

            {/* Unit Price & Signature Gold Brush Total Price */}
            <div className="mt-4 w-full max-w-sm flex flex-col items-center lg:items-start gap-2">
              <div className="text-xs sm:text-sm font-bold text-[#0B0908]/70 tabular-nums flex items-center gap-1.5">
                <span>سعر الوحدة:</span>
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={unitPrice}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.16, ease: SMOOTH_EASE }}
                    className="font-latin text-[#0B0908] font-black inline-block"
                  >
                    {unitPrice}
                  </motion.span>
                </AnimatePresence>
                <span>{siteConfig.currency.symbolAr}</span>
              </div>

              <div className="relative inline-flex items-center gap-2.5 px-6 py-2">
                <YellowBrushSplash
                  color="#FFC400"
                  className="absolute inset-0 w-full h-full"
                />
                <span className="relative z-10 text-xs sm:text-sm font-black text-[#0B0908]/85">
                  الإجمالي:
                </span>
                <span className="relative z-10 text-3xl sm:text-4xl font-black text-[#0B0908] tabular-nums leading-none overflow-hidden inline-flex items-baseline">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={totalPrice}
                      initial={{
                        opacity: 0,
                        y: qtyDirection > 0 ? 12 : -12,
                        scale: 0.92,
                      }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{
                        opacity: 0,
                        y: qtyDirection > 0 ? -12 : 12,
                        scale: 0.92,
                      }}
                      transition={{ duration: 0.18, ease: SMOOTH_EASE }}
                      className="font-latin inline-block"
                    >
                      {totalPrice}
                    </motion.span>
                  </AnimatePresence>
                </span>
                <span className="relative z-10 text-base sm:text-lg font-black text-[#0B0908]">
                  {siteConfig.currency.symbolAr}
                </span>
              </div>
            </div>

            {/* Size Selection — RTL order: صغير (right), متوسط (center), كبير (left) */}
            {product.supportsSizes && product.sizes && product.sizes.length > 0 && (
              <div className="w-full max-w-sm mt-5">
                <p className="text-sm font-black text-[#0B0908] mb-2 text-center lg:text-right">
                  اختر الحجم
                </p>
                <div dir="rtl" className="grid grid-cols-3 gap-2.5">
                  {product.sizes.map((size) => {
                    const isSelected = selectedSize?.key === size.key;
                    return (
                      <TapRippleButton
                        key={size.key}
                        type="button"
                        rippleTone={isSelected ? 'yellow' : 'dark'}
                        tapScale={0.94}
                        onClick={() => {
                          setQtyDirection(
                            size.price >= (selectedSize?.price ?? unitPrice)
                              ? 1
                              : -1
                          );
                          setSelectedSize(size);
                        }}
                        aria-pressed={isSelected}
                        className={`relative min-h-[68px] py-2 px-2 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#0B0908] ${
                          isSelected
                            ? 'border-[#0B0908] text-[#FFC400]'
                            : 'bg-[#FBF3E8] border-[#0B0908]/15 text-[#0B0908] hover:border-[#0B0908]/45'
                        }`}
                      >
                        {isSelected && (
                          <motion.span
                            layoutId="detail-size-pill"
                            transition={{
                              type: 'spring',
                              stiffness: 420,
                              damping: 30,
                            }}
                            aria-hidden="true"
                            className="absolute inset-0 rounded-[15px] bg-[#0B0908] z-0"
                          />
                        )}
                        <motion.span
                          animate={
                            isSelected ? { scale: [1, 1.15, 1] } : { scale: 1 }
                          }
                          transition={{ duration: 0.25 }}
                          className="relative z-10 flex"
                        >
                          <CoffeeCupIcon sizeScale={size.key} className="w-6 h-6" />
                        </motion.span>
                        <span className="relative z-10 text-xs sm:text-sm font-bold whitespace-nowrap">
                          {size.label}
                        </span>
                      </TapRippleButton>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            {product.supportsQuantity !== false && (
              <div className="w-full max-w-sm mt-4 flex items-center justify-between bg-[#EFE0CB]/85 border border-[#0B0908]/12 rounded-2xl px-4 py-2">
                <span className="text-sm font-black text-[#0B0908]">الكمية</span>
                <div className="flex items-center gap-3">
                  <TapRippleButton
                    type="button"
                    rippleTone="dark"
                    tapScale={0.86}
                    onClick={() => {
                      setQtyDirection(-1);
                      setQuantity((q) => Math.max(1, q - 1));
                    }}
                    disabled={quantity <= 1}
                    aria-label="إنقاص الكمية"
                    className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl bg-[#0B0908]/10 hover:bg-[#0B0908]/20 disabled:opacity-35 text-[#0B0908] transition-colors cursor-pointer disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4 relative z-10" />
                  </TapRippleButton>
                  <span className="w-8 text-center text-lg font-black font-latin tabular-nums text-[#0B0908] overflow-hidden inline-flex justify-center">
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span
                        key={quantity}
                        initial={{ opacity: 0, y: qtyDirection > 0 ? 10 : -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: qtyDirection > 0 ? -10 : 10 }}
                        transition={{ duration: 0.16, ease: SMOOTH_EASE }}
                        className="inline-block"
                      >
                        {quantity}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                  <TapRippleButton
                    type="button"
                    rippleTone="dark"
                    tapScale={0.86}
                    onClick={() => {
                      setQtyDirection(1);
                      setQuantity((q) => Math.min(20, q + 1));
                    }}
                    disabled={quantity >= 20}
                    aria-label="زيادة الكمية"
                    className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl bg-[#0B0908]/10 hover:bg-[#0B0908]/20 disabled:opacity-35 text-[#0B0908] transition-colors cursor-pointer disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4 relative z-10" />
                  </TapRippleButton>
                </div>
              </div>
            )}
          </div>

          {/* Dual Luxury CTA Row: Add to Tray + Crimson WhatsApp Order */}
          <div className="relative z-10 w-full max-w-sm mt-5 space-y-2.5">
            {product.available && (
              <TapRippleButton
                type="button"
                onClick={handleAddToTrayClick}
                rippleTone={justAdded ? 'light' : 'dark'}
                tapScale={0.96}
                className={`w-full min-h-[48px] px-5 py-2.5 rounded-full font-black text-sm sm:text-base flex items-center justify-center gap-2 border transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B0908] ${
                  justAdded
                    ? 'bg-[#0F5132] border-[#0F5132] text-[#F7E8D6]'
                    : 'bg-[#FFC400] hover:bg-[#0B0908] border-[#FFC400] hover:border-[#0B0908] text-[#0B0908] hover:text-[#FFC400]'
                }`}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={justAdded ? 'added' : 'add'}
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.85, opacity: 0 }}
                    transition={{ duration: 0.14 }}
                    className="relative z-10 flex items-center gap-2"
                  >
                    {justAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>تمت الإضافة لسلة الطلب</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>أضف للسلة ({totalPrice} {siteConfig.currency.symbolAr})</span>
                      </>
                    )}
                  </motion.span>
                </AnimatePresence>
              </TapRippleButton>
            )}

            <TapRippleButton
              type="button"
              onClick={handleOrderClick}
              disabled={!product.available}
              rippleTone="light"
              tapScale={0.96}
              hoverScale={1.015}
              className={`group w-full min-h-[54px] px-6 py-3 rounded-full font-black text-base sm:text-lg flex items-center justify-center gap-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B0908] ${
                product.available
                  ? 'bg-[#D72626] hover:bg-[#0B0908] text-[#F7E8D6] cursor-pointer shadow-lg shadow-[#D72626]/20'
                  : 'bg-[#D72626]/15 border border-[#D72626]/60 text-[#D72626] cursor-not-allowed'
              }`}
            >
              <span className="relative z-10">
                {product.available ? 'اطلب الآن عبر واتساب' : 'غير متوفر للطلب حالياً'}
              </span>
              {product.available && (
                <WhatsAppIcon className="w-6 h-6 shrink-0 relative z-10 transition-transform duration-200 group-hover:scale-110" />
              )}
            </TapRippleButton>
          </div>

          {/* Signature Corner Brush Stroke */}
          <CornerBrushAccent className="pointer-events-none absolute bottom-0 left-0 w-36 sm:w-44 h-12 sm:h-14 opacity-85" />
        </motion.section>
      </main>

      {/* Order Message Preview Modal when WhatsApp number is not yet configured */}
      <AnimatePresence>
        {previewMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: SMOOTH_EASE }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-4"
            role="dialog"
            aria-modal="true"
            aria-label="معاينة رسالة طلب واتساب"
            onClick={() => setPreviewMessage(null)}
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
                  تفاصيل الطلب عبر واتساب
                </h2>
                <TapRippleButton
                  type="button"
                  rippleTone="yellow"
                  tapScale={0.88}
                  onClick={() => setPreviewMessage(null)}
                  aria-label="إغلاق"
                  className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-full hover:bg-white/10 cursor-pointer"
                >
                  <X className="w-5 h-5 relative z-10" />
                </TapRippleButton>
              </div>

              <p className="text-xs text-[#F7E8D6]/75 mt-3 leading-relaxed">
                لم يتم تعيين رقم واتساب المتجر بعد في ملف الإعدادات (
                <span className="font-latin">src/config/siteConfig.ts</span>
                ). يمكنك نسخ نص الطلب الجاهز أدناه:
              </p>

              <pre className="mt-3 p-3.5 rounded-2xl bg-[#0B0908] border border-white/10 text-sm whitespace-pre-wrap leading-relaxed font-sans text-[#F7E8D6]">
                {previewMessage}
              </pre>

              <div className="mt-4 flex items-center gap-3">
                <TapRippleButton
                  type="button"
                  rippleTone="dark"
                  tapScale={0.96}
                  onClick={handleCopyMessage}
                  className="flex-1 min-h-[46px] rounded-full bg-[#FFC400] hover:bg-[#F7E8D6] text-[#0B0908] font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={copied ? 'copied' : 'copy'}
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.7, opacity: 0 }}
                      transition={{ duration: 0.14 }}
                      className="relative z-10 flex items-center gap-2"
                    >
                      {copied ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                      <span>{copied ? 'تم نسخ الطلب' : 'نسخ تفاصيل الطلب'}</span>
                    </motion.span>
                  </AnimatePresence>
                </TapRippleButton>
                <TapRippleButton
                  type="button"
                  rippleTone="yellow"
                  tapScale={0.96}
                  onClick={() => setPreviewMessage(null)}
                  className="min-h-[46px] px-5 rounded-full border border-white/20 text-sm font-bold hover:bg-white/5 cursor-pointer"
                >
                  <span className="relative z-10">إغلاق</span>
                </TapRippleButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
