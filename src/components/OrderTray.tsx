import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingBag, X, Minus, Plus, Trash2, Check, Copy } from 'lucide-react';
import { CartItem } from '../types/menu';
import { siteConfig } from '../config/siteConfig';
import {
  buildWhatsAppCartMessage,
  getWhatsAppOrderUrl,
} from '../utils/whatsapp';
import { WhatsAppIcon } from './BrushGraphics';
import { MenuImage } from './MenuImage';
import {
  SMOOTH_EASE,
  TACTILE_SPRING,
  TapRippleButton,
} from './MotionPrimitives';

interface OrderTrayProps {
  items: CartItem[];
  onUpdateQuantity: (key: string, delta: number) => void;
  onRemoveItem: (key: string) => void;
  onClearCart: () => void;
}

export const OrderTray: React.FC<OrderTrayProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [previewMessage, setPreviewMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  useEffect(() => {
    if (items.length === 0) {
      setSheetOpen(false);
      setPreviewMessage(null);
    }
  }, [items.length]);

  useEffect(() => {
    if (!sheetOpen && !previewMessage) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPreviewMessage(null);
        setSheetOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [sheetOpen, previewMessage]);

  const handleCheckoutWhatsApp = () => {
    const message = buildWhatsAppCartMessage(items);
    if (!message) return;
    const url = getWhatsAppOrderUrl(message);
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      setPreviewMessage(message);
    }
  };

  const handleCopy = async () => {
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
    <>
      {/* Compact Floating Order Tray Bar (only rendered when user adds items) */}
      <AnimatePresence>
        {items.length > 0 && !sheetOpen && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={TACTILE_SPRING}
            className="fixed bottom-3 inset-x-0 z-40 px-4 pointer-events-none"
          >
            <div className="max-w-lg mx-auto pointer-events-auto">
              <TapRippleButton
                type="button"
                onClick={() => setSheetOpen(true)}
                rippleTone="dark"
                tapScale={0.97}
                className="w-full min-h-[54px] px-4 py-2.5 rounded-2xl bg-[#FFC400] hover:bg-[#F7E8D6] text-[#0B0908] shadow-2xl shadow-black/75 border border-[#FFC400] flex items-center justify-between gap-3 transition-colors cursor-pointer"
              >
                <div className="relative z-10 flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-xl bg-[#0B0908] text-[#FFC400] flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-4 h-4" />
                  </span>
                  <div className="text-right leading-tight">
                    <span className="block text-sm font-black">
                      سلة الطلب ({totalCount})
                    </span>
                    <span className="block text-[11px] font-bold text-[#0B0908]/75">
                      اضغط للمراجعة والإرسال عبر واتساب
                    </span>
                  </div>
                </div>

                <div className="relative z-10 flex items-center gap-2 shrink-0">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={totalPrice}
                      initial={{ scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.85, opacity: 0 }}
                      transition={{ duration: 0.16 }}
                      className="font-black text-base tabular-nums bg-[#0B0908] text-[#FFC400] px-3 py-1 rounded-xl"
                    >
                      <span className="font-latin">{totalPrice}</span>{' '}
                      <span className="text-xs">{siteConfig.currency.symbolAr}</span>
                    </motion.span>
                  </AnimatePresence>
                </div>
              </TapRippleButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expandable Cart Sheet */}
      <AnimatePresence>
        {sheetOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: SMOOTH_EASE }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-label="سلة الطلبات"
            onClick={() => {
              setPreviewMessage(null);
              setSheetOpen(false);
            }}
          >
            <motion.div
              initial={{ y: 60, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 60, opacity: 0, scale: 0.98 }}
              transition={TACTILE_SPRING}
              onClick={(e) => e.stopPropagation()}
              className="w-full sm:max-w-lg max-h-[85dvh] bg-[#16100C] border-t sm:border border-[#FFC400]/35 rounded-t-3xl sm:rounded-3xl text-[#F7E8D6] flex flex-col overflow-hidden shadow-2xl"
            >
              {/* Sheet Header */}
              <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-xl bg-[#FFC400] text-[#0B0908] flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4" />
                  </span>
                  <div>
                    <h2 className="text-lg font-black text-[#F7E8D6]">
                      سلة طلباتك
                    </h2>
                    <p className="text-xs text-[#F7E8D6]/65 tabular-nums">
                      {totalCount} أصناف مختارة
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <TapRippleButton
                    type="button"
                    rippleTone="crimson"
                    tapScale={0.92}
                    onClick={onClearCart}
                    aria-label="تفريغ السلة"
                    className="min-h-[38px] px-3 rounded-xl text-xs font-bold text-[#D72626] hover:bg-[#D72626]/10 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5 relative z-10" />
                    <span className="relative z-10">مسح الكل</span>
                  </TapRippleButton>
                  <TapRippleButton
                    type="button"
                    rippleTone="yellow"
                    tapScale={0.88}
                    onClick={() => {
                      setPreviewMessage(null);
                      setSheetOpen(false);
                    }}
                    aria-label="إغلاق السلة"
                    className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-full hover:bg-white/10 cursor-pointer"
                  >
                    <X className="w-5 h-5 relative z-10" />
                  </TapRippleButton>
                </div>
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto px-5 py-3 divide-y divide-white/10">
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.div
                      key={item.key}
                      layout
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -24, height: 0 }}
                      transition={{ duration: 0.2, ease: SMOOTH_EASE }}
                      className="py-3 flex items-center gap-3"
                    >
                      <MenuImage
                        src={item.product.image}
                        alt={item.product.name}
                        fallbackLabel={item.product.name}
                        className="w-14 h-14 rounded-2xl shrink-0 border border-white/15"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-base font-bold text-[#F7E8D6] truncate">
                          {item.product.name}
                        </h3>
                        <p className="text-xs text-[#F7E8D6]/65 mt-0.5 tabular-nums">
                          {item.selectedSize ? `${item.selectedSize.label} · ` : ''}
                          <span className="font-latin text-[#FFC400] font-bold">
                            {item.unitPrice * item.quantity}
                          </span>{' '}
                          {siteConfig.currency.symbolAr}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <TapRippleButton
                          type="button"
                          rippleTone="yellow"
                          tapScale={0.85}
                          onClick={() =>
                            item.quantity <= 1
                              ? onRemoveItem(item.key)
                              : onUpdateQuantity(item.key, -1)
                          }
                          aria-label="إنقاص الكمية"
                          className="min-h-[36px] min-w-[36px] rounded-xl bg-white/5 hover:bg-white/15 flex items-center justify-center text-[#F7E8D6] cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5 relative z-10" />
                        </TapRippleButton>
                        <span className="w-6 text-center text-sm font-black font-latin tabular-nums text-[#FFC400]">
                          {item.quantity}
                        </span>
                        <TapRippleButton
                          type="button"
                          rippleTone="yellow"
                          tapScale={0.85}
                          onClick={() => onUpdateQuantity(item.key, 1)}
                          aria-label="زيادة الكمية"
                          className="min-h-[36px] min-w-[36px] rounded-xl bg-white/5 hover:bg-white/15 flex items-center justify-center text-[#F7E8D6] cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5 relative z-10" />
                        </TapRippleButton>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {previewMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pt-4 pb-2"
                  >
                    <p className="text-xs text-[#F7E8D6]/75 mb-2">
                      لم يتم تعيين رقم واتساب المتجر بعد. يمكنك نسخ نص الطلب المجمع أدناه:
                    </p>
                    <pre className="p-3 rounded-2xl bg-[#0B0908] border border-white/10 text-xs sm:text-sm whitespace-pre-wrap leading-relaxed font-sans text-[#F7E8D6]">
                      {previewMessage}
                    </pre>
                  </motion.div>
                )}
              </div>

              {/* Sheet Footer CTA */}
              <div className="p-5 border-t border-white/10 bg-[#110C09] space-y-3">
                <div className="flex items-center justify-between text-base font-black">
                  <span className="text-[#F7E8D6]/85">الإجمالي الكلي</span>
                  <span className="text-xl text-[#FFC400] tabular-nums">
                    <span className="font-latin">{totalPrice}</span>{' '}
                    <span className="text-sm">{siteConfig.currency.symbolAr}</span>
                  </span>
                </div>

                {previewMessage ? (
                  <TapRippleButton
                    type="button"
                    rippleTone="dark"
                    tapScale={0.96}
                    onClick={handleCopy}
                    className="w-full min-h-[50px] rounded-full bg-[#FFC400] hover:bg-[#F7E8D6] text-[#0B0908] font-black text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 relative z-10" />
                    ) : (
                      <Copy className="w-4 h-4 relative z-10" />
                    )}
                    <span className="relative z-10">
                      {copied ? 'تم نسخ تفاصيل السلة' : 'نسخ تفاصيل الطلب'}
                    </span>
                  </TapRippleButton>
                ) : (
                  <TapRippleButton
                    type="button"
                    rippleTone="light"
                    tapScale={0.96}
                    onClick={handleCheckoutWhatsApp}
                    className="w-full min-h-[52px] rounded-full bg-[#D72626] hover:bg-[#FFC400] text-[#F7E8D6] hover:text-[#0B0908] font-black text-base flex items-center justify-center gap-2.5 shadow-lg transition-colors cursor-pointer"
                  >
                    <span className="relative z-10">إرسال الطلب عبر واتساب</span>
                    <WhatsAppIcon className="w-5 h-5 relative z-10" />
                  </TapRippleButton>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
