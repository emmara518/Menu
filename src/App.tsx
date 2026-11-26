import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import {
  AppScreen,
  CartItem,
  CategoryId,
  MenuProduct,
  ProductSizeOption,
} from './types/menu';
import { MENU_PRODUCTS } from './data/menuData';
import { HeroScreen } from './components/HeroScreen';
import { CategoriesScreen } from './components/CategoriesScreen';
import { ProductListScreen } from './components/ProductListScreen';
import { ProductDetailScreen } from './components/ProductDetailScreen';
import { LocationScreen } from './components/LocationScreen';
import { NavigationDrawer } from './components/NavigationDrawer';
import { OrderTray } from './components/OrderTray';
import {
  NavDirection,
  SCREEN_TRANSITION_VARIANTS,
} from './components/MotionPrimitives';

const FAVORITES_STORAGE_KEY = 'ben_el_tayyib_favorites';

const SCREEN_DEPTH: Record<AppScreen, number> = {
  home: 0,
  categories: 1,
  products: 2,
  'product-detail': 3,
  location: 1,
};

function computeNavDirection(from: AppScreen, to: AppScreen): NavDirection {
  if (from === to) return 0;
  if (to === 'location' || from === 'location') {
    return to === 'home' ? -1 : 0;
  }
  return SCREEN_DEPTH[to] >= SCREEN_DEPTH[from] ? 1 : -1;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('home');
  const [navDirection, setNavDirection] = useState<NavDirection>(0);
  const currentScreenRef = useRef<AppScreen>('home');
  const shouldScrollTopRef = useRef(false);

  const [selectedCategoryId, setSelectedCategoryId] =
    useState<CategoryId>('hot-coffee');
  const [selectedProduct, setSelectedProduct] = useState<MenuProduct>(
    MENU_PRODUCTS.find((p) => p.id === 'cappuccino') ?? MENU_PRODUCTS[0]
  );
  const [detailReturnScreen, setDetailReturnScreen] =
    useState<AppScreen>('products');
  const [detailSessionKey, setDetailSessionKey] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as string[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    currentScreenRef.current = currentScreen;
  }, [currentScreen]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify(favorites)
      );
    } catch {
      // Ignore storage failures in restricted contexts
    }
  }, [favorites]);

  const syncHashFromState = (
    screen: AppScreen,
    categoryId: CategoryId,
    product: MenuProduct
  ) => {
    let nextHash = '#home';
    if (screen === 'categories') nextHash = '#menu';
    else if (screen === 'products') nextHash = `#category/${categoryId}`;
    else if (screen === 'product-detail') nextHash = `#product/${product.id}`;
    else if (screen === 'location') nextHash = '#location';

    if (window.location.hash !== nextHash) {
      window.history.pushState(null, '', nextHash);
    }
  };

  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash;
      let nextScreen: AppScreen = 'home';

      if (!hash || hash === '#home') {
        nextScreen = 'home';
      } else if (hash === '#menu') {
        nextScreen = 'categories';
      } else if (hash === '#location') {
        nextScreen = 'location';
      } else if (hash.startsWith('#category/')) {
        const catId = hash.replace('#category/', '') as CategoryId;
        if (MENU_PRODUCTS.some((p) => p.categoryId === catId)) {
          setSelectedCategoryId(catId);
        }
        nextScreen = 'products';
      } else if (hash.startsWith('#product/')) {
        const prodId = hash.replace('#product/', '');
        const found = MENU_PRODUCTS.find((p) => p.id === prodId);
        if (found) {
          setSelectedProduct(found);
          setSelectedCategoryId(found.categoryId);
        }
        nextScreen = 'product-detail';
      }

      setNavDirection(computeNavDirection(currentScreenRef.current, nextScreen));
      shouldScrollTopRef.current = true;
      setCurrentScreen(nextScreen);
    };

    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, []);

  const navigateToScreen = (screen: AppScreen) => {
    setNavDirection(computeNavDirection(currentScreen, screen));
    shouldScrollTopRef.current = true;
    setCurrentScreen(screen);
    syncHashFromState(screen, selectedCategoryId, selectedProduct);
  };

  const handleSelectCategory = (categoryId: CategoryId) => {
    setNavDirection(computeNavDirection(currentScreen, 'products'));
    shouldScrollTopRef.current = true;
    setSelectedCategoryId(categoryId);
    setCurrentScreen('products');
    syncHashFromState('products', categoryId, selectedProduct);
  };

  const handleSelectProduct = (
    product: MenuProduct,
    fromScreen: AppScreen = 'products'
  ) => {
    setNavDirection(computeNavDirection(currentScreen, 'product-detail'));
    shouldScrollTopRef.current = true;
    setSelectedProduct(product);
    setSelectedCategoryId(product.categoryId);
    setDetailReturnScreen(fromScreen);
    setDetailSessionKey((prev) => prev + 1);
    setCurrentScreen('product-detail');
    syncHashFromState('product-detail', product.categoryId, product);
  };

  const handleToggleFavorite = (productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAddToCart = (
    product: MenuProduct,
    selectedSize?: ProductSizeOption,
    quantity = 1
  ) => {
    if (!product.available) return;
    const resolvedSize =
      selectedSize ??
      (product.supportsSizes && product.sizes && product.sizes.length > 0
        ? product.sizes.find((s) => s.key === 'medium') ?? product.sizes[0]
        : undefined);
    const unitPrice = resolvedSize ? resolvedSize.price : product.price;
    const key = `${product.id}:${resolvedSize?.key ?? 'default'}`;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.key === key);
      if (existing) {
        return prev.map((item) =>
          item.key === key
            ? { ...item, quantity: Math.min(20, item.quantity + quantity) }
            : item
        );
      }
      return [
        ...prev,
        {
          key,
          product,
          selectedSize: resolvedSize,
          quantity,
          unitPrice,
        },
      ];
    });
  };

  const handleUpdateCartQuantity = (key: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.key === key
            ? { ...item, quantity: Math.min(20, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (key: string) => {
    setCartItems((prev) => prev.filter((item) => item.key !== key));
  };

  const handleClearCart = () => setCartItems([]);

  const screenMotionKey =
    currentScreen === 'product-detail'
      ? `product-detail-${selectedProduct.id}-${detailSessionKey}`
      : currentScreen;

  return (
    <MotionConfig reducedMotion="user">
      <div
        dir="rtl"
        className="min-h-screen espresso-luxury-bg text-[#F7E8D6] overflow-x-hidden"
      >
        <AnimatePresence
          mode="wait"
          custom={navDirection}
          onExitComplete={() => {
            if (shouldScrollTopRef.current) {
              shouldScrollTopRef.current = false;
              window.scrollTo({ top: 0, behavior: 'instant' });
            }
          }}
        >
          <motion.div
            key={screenMotionKey}
            custom={navDirection}
            variants={SCREEN_TRANSITION_VARIANTS}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-screen"
          >
            {currentScreen === 'home' && (
              <HeroScreen
                onOpenDrawer={() => setDrawerOpen(true)}
                onBrowseMenu={() => navigateToScreen('categories')}
                onOpenLocation={() => navigateToScreen('location')}
              />
            )}

            {currentScreen === 'categories' && (
              <CategoriesScreen
                onOpenDrawer={() => setDrawerOpen(true)}
                onGoHome={() => navigateToScreen('home')}
                onSelectCategory={handleSelectCategory}
                onSelectProduct={(product) =>
                  handleSelectProduct(product, 'categories')
                }
                onOpenLocation={() => navigateToScreen('location')}
                hasCartItems={cartItems.length > 0}
              />
            )}

            {currentScreen === 'products' && (
              <ProductListScreen
                selectedCategoryId={selectedCategoryId}
                initialHighlightedProductId={selectedProduct.id}
                onSelectCategory={setSelectedCategoryId}
                onBack={() => navigateToScreen('categories')}
                onSelectProduct={(product) =>
                  handleSelectProduct(product, 'products')
                }
                onQuickAdd={(product) => handleAddToCart(product)}
                hasCartItems={cartItems.length > 0}
              />
            )}

            {currentScreen === 'product-detail' && (
              <ProductDetailScreen
                key={`${selectedProduct.id}-${detailSessionKey}`}
                product={selectedProduct}
                isFavorite={favorites.includes(selectedProduct.id)}
                onToggleFavorite={handleToggleFavorite}
                onAddToCart={handleAddToCart}
                onBack={() => navigateToScreen(detailReturnScreen)}
                hasCartItems={cartItems.length > 0}
              />
            )}

            {currentScreen === 'location' && (
              <LocationScreen
                onOpenDrawer={() => setDrawerOpen(true)}
                onGoHome={() => navigateToScreen('home')}
                onBackToMenu={() => navigateToScreen('categories')}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {currentScreen !== 'home' && currentScreen !== 'location' && (
          <OrderTray
            items={cartItems}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveCartItem}
            onClearCart={handleClearCart}
          />
        )}

        <NavigationDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          currentScreen={currentScreen}
          onNavigateScreen={navigateToScreen}
          onSelectCategory={handleSelectCategory}
          favoritesCount={favorites.length}
        />
      </div>
    </MotionConfig>
  );
}
