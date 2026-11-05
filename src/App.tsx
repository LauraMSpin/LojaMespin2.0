import { useEffect } from "react";
import { HashRouter, Route, Routes, useLocation } from "react-router-dom";
import CartDrawer from "./components/CartDrawer/CartDrawer";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import ProductModal from "./components/ProductModal/ProductModal";
import Toast from "./components/Toast/Toast";
import TopBar from "./components/TopBar/TopBar";
import WhatsAppButton from "./components/WhatsAppButton/WhatsAppButton";
import { CartProvider } from "./context/CartContext";
import { UIProvider } from "./context/UIContext";
import Catalog from "./pages/Catalog/Catalog";
import Christmas from "./pages/Christmas/Christmas";
import Custom from "./pages/Custom/Custom";
import CustomProductModal from "./components/CustomProductModal/CustomProductModal";
import Home from "./pages/Home/Home";
import NotFound from "./pages/NotFound/NotFound";

function ScrollToTop() {
  const { pathname, state } = useLocation();
  useEffect(() => {
    if (!(state as { scrollTo?: string } | null)?.scrollTo) window.scrollTo(0, 0);
  }, [pathname, state]);
  return null;
}

export default function App() {
  return (
    <HashRouter>
      <CartProvider>
        <UIProvider>
          <ScrollToTop />
          <a className="skip-link sr-only" href="#conteudo" onClick={(e) => { e.preventDefault(); document.getElementById("conteudo")?.focus(); }}>
            Ir para o conteúdo
          </a>
          <TopBar />
          <Header />
          <main id="conteudo" tabIndex={-1}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalogo" element={<Catalog />} />
              <Route path="/personalizados" element={<Custom />} />
              <Route path="/natal" element={<Christmas />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <WhatsAppButton />
          <ProductModal />
          <CustomProductModal />
          <CartDrawer />
          <Toast />
        </UIProvider>
      </CartProvider>
    </HashRouter>
  );
}
