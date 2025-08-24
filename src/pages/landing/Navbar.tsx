// Navbar.tsx
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/Button";

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <motion.header
      className="bg-white text-gray-500 shadow-md sticky top-0 z-50 transition-transform duration-300"
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Button onClick={() => navigate("/")}className="flex items-center gap-3 group">
          <motion.img
            src="/fluxdevs.png"
            alt="FluxDevs Logo"
            className="md:w-14 w-10 h-auto object-contain group-hover:scale-105 transition-transform duration-200"
            whileHover={{ scale: 1.1 }}
          />
          <span className="md:text-2xl text-xl font-extrabold text-indigo-800 group-hover:text-indigo-600 transition-colors">
            Fluxdevs ERP
          </span>
        </Button>

        <nav className="hidden md:flex items-center gap-8">
          <Button
            onClick={() => navigate("/")}
            className={`text-lg font-semibold relative ${
              location.pathname === "/" ? "text-indigo-600" : "text-gray-500 hover:text-indigo-600"
            } transition-colors hover:scale-105`}
          >
            Home
            {location.pathname === "/" && (
              <span className="absolute left-0 bottom-[-4px] w-full h-0.5 bg-indigo-600"></span>
            )}
          </Button>
          <Button
            onClick={() => navigate("/about")}
            className={`text-lg font-semibold relative ${
              location.pathname === "/about" ? "text-indigo-600" : "text-gray-500 hover:text-indigo-600"
            } transition-colors hover:scale-105`}
          >
            Features
            {location.pathname === "/about" && (
              <span className="absolute left-0 bottom-[-4px] w-full h-0.5 bg-indigo-600"></span>
            )}
          </Button>
          <Button
            onClick={() => navigate("/contact")}
            className={`text-lg font-semibold relative ${
              location.pathname === "/contact" ? "text-indigo-600" : "text-gray-500 hover:text-indigo-600"
            } transition-colors hover:scale-105`}
          >
            Contact
            {location.pathname === "/contact" && (
              <span className="absolute left-0 bottom-[-4px] w-full h-0.5 bg-indigo-600"></span>
            )}
          </Button>
          <Button
            onClick={() => navigate("/pricing")}
            className={`text-lg font-semibold relative ${
              location.pathname === "/pricing" ? "text-indigo-600" : "text-gray-500 hover:text-indigo-600"
            } transition-colors hover:scale-105`}
          >
            Pricing
            {location.pathname === "/pricing" && (
              <span className="absolute left-0 bottom-[-4px] w-full h-0.5 bg-indigo-600"></span>
            )}
          </Button>
          <Button
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-500 transition-all shadow-lg hover:shadow-xl hover:scale-105"
            onClick={() => navigate("/about")}
          >
            View Demo
          </Button>
        </nav>

        <button
          className="md:hidden text-indigo-600 hover:text-indigo-500 focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-gray-50 backdrop-blur-md border-t border-indigo-200"
          >
            <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-4">
              <Button
                onClick={() => {
                  navigate("/");
                  setIsMenuOpen(false);
                }}
                className={`text-lg font-semibold relative ${
                  location.pathname === "/" ? "text-indigo-600" : "text-gray-500 hover:text-indigo-600"
                } transition-colors hover:scale-105`}
              >
                Home
                {location.pathname === "/" && (
                  <span className="absolute left-0 bottom-[-4px] w-full h-0.5 bg-indigo-600"></span>
                )}
              </Button>
              <Button
                onClick={() => {
                  navigate("/about");
                  setIsMenuOpen(false);
                }}
                className={`text-lg font-semibold relative ${
                  location.pathname === "/about" ? "text-indigo-600" : "text-gray-500 hover:text-indigo-600"
                } transition-colors hover:scale-105`}
              >
                Features
                {location.pathname === "/about" && (
                  <span className="absolute left-0 bottom-[-4px] w-full h-0.5 bg-indigo-600"></span>
                )}
              </Button>
              <Button
                onClick={() => {
                  navigate("/contact");
                  setIsMenuOpen(false);
                }}
                className={`text-lg font-semibold relative ${
                  location.pathname === "/contact" ? "text-indigo-600" : "text-gray-500 hover:text-indigo-600"
                } transition-colors hover:scale-105`}
              >
                Contact
                {location.pathname === "/contact" && (
                  <span className="absolute left-0 bottom-[-4px] w-full h-0.5 bg-indigo-600"></span>
                )}
              </Button>
              <Button
                onClick={() => {
                  navigate("/pricing");
                  setIsMenuOpen(false);
                }}
                className={`text-lg font-semibold relative ${
                  location.pathname === "/pricing" ? "text-indigo-600" : "text-gray-500 hover:text-indigo-600"
                } transition-colors hover:scale-105`}
              >
                Pricing
                {location.pathname === "/pricing" && (
                  <span className="absolute left-0 bottom-[-4px] w-full h-0.5 bg-indigo-600"></span>
                )}
              </Button>
              <Button
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-500 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                onClick={() => {
                  navigate("/about");
                  setIsMenuOpen(false);
                }}
              >
                View Demo
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;