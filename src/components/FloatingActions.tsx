import React, { useEffect, useState } from "react";
import { IoLogoWhatsapp } from "react-icons/io5";

const WHATSAPP_URL = "https://wa.me/message/IJCGAQKFVMKUB1";

const ERP_PREFIXES = ["/ceo", "/admin", "/project-manager", "/factory-manager", "/store", "/shop", "/product", "/accountant"];

const isErpPath = (path: string) => ERP_PREFIXES.some(p => path.startsWith(p));

const FloatingActions: React.FC = () => {
  const [showReturnPopup, setShowReturnPopup] = useState<boolean>(() => {
    try { return localStorage.getItem("showReturnPopup") === "true"; } catch(e) { return false; }
  });
  const [isErpRoute, setIsErpRoute] = useState<boolean>(() => isErpPath(typeof window !== 'undefined' ? window.location.pathname : "/"));
  const [opacity, setOpacity] = useState<number>(0.8);

  // Keep storage-driven state in sync
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "showReturnPopup") setShowReturnPopup(e.newValue === "true");
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Detect route changes (handle pushState/popState)
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname || "/";
      setIsErpRoute(isErpPath(path));
      try { setShowReturnPopup(localStorage.getItem("showReturnPopup") === "true"); } catch(e){}
    };

    // monkey-patch history.pushState/replaceState to emit a custom event
    const patch = () => {
      const _push = history.pushState;
      const _replace = history.replaceState;
      (history as any).pushState = function () {
        _push.apply(this, arguments as any);
        window.dispatchEvent(new Event('locationchange'));
      };
      (history as any).replaceState = function () {
        _replace.apply(this, arguments as any);
        window.dispatchEvent(new Event('locationchange'));
      };
    };

    patch();
    window.addEventListener('locationchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    // initial sync
    handleLocationChange();

    return () => {
      window.removeEventListener('locationchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  // Fade whatsapp button a bit on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY || 0;
      const newOpacity = Math.max(0.6, 0.8 - scrollPosition / 1000);
      setOpacity(newOpacity);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (showReturnPopup && isErpRoute) {
    return (
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        <button
          onClick={() => {
            try { localStorage.removeItem("showReturnPopup"); localStorage.removeItem("user_role"); } catch(e){}
            setShowReturnPopup(false);
            window.location.href = "/about";
          }}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-all"
        >
          Back to Home
        </button>
        <button
          onClick={() => { try { localStorage.removeItem("showReturnPopup"); } catch(e){}; setShowReturnPopup(false); }}
          aria-label="Close"
          className="bg-gray-200 text-gray-700 p-2 rounded-full shadow hover:bg-gray-300"
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-3.5 rounded-full shadow-lg hover:scale-110 transition-all duration-200 cursor-pointer whatsapp-float"
      style={{ opacity }}
      aria-label="Chat with us on WhatsApp"
    >
      <IoLogoWhatsapp size={28} className="text-white" />
      <style>{`
        @keyframes floatAnimation {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-10px) scale(1.05); }
        }
        .whatsapp-float { animation: floatAnimation 3s ease-in-out infinite; }
      `}</style>
    </a>
  );
};

export default FloatingActions;
