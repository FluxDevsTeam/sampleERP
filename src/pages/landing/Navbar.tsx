// Navbar.tsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/Button";

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 transition-transform duration-300"
      initial={{ y: 0 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="backdrop-blur-md bg-white/80 border-b border-indigo-100/60">
      <div className="max-w-7xl mx-auto px-2 sm:px-2 py-3 flex items-center justify-between">
        <Button onClick={() => navigate("/")}className="flex items-center gap-3 group">
          <motion.img
            src="/fluxdevs.png"
            alt="FluxDevs Logo"
            className="md:w-14 w-10 h-auto object-contain group-hover:scale-105 transition-transform duration-200"
            whileHover={{ scale: 1.1 }}
          />
          <span className="md:text-2xl text-xl font-semibold text-indigo-700 group-hover:text-indigo-600 transition-colors tracking-tight">
            Fluxdevs ERP
          </span>
        </Button>

        <nav className="hidden md:flex items-center gap-6">
          <Button
            onClick={() => navigate("/")}
            className={`text-[15px] font-semibold relative px-2 py-1 rounded-md ${
              location.pathname === "/" ? "text-indigo-700" : "text-slate-600 hover:text-indigo-700"
            } transition-colors`}
          >
            Home
            {location.pathname === "/" && (
              <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-indigo-600"></span>
            )}
          </Button>
          <Button
            onClick={() => navigate("/about")}
            className={`text-[15px] font-semibold relative px-2 py-1 rounded-md ${
              location.pathname === "/about" ? "text-indigo-700" : "text-slate-600 hover:text-indigo-700"
            } transition-colors`}
          >
            Features
            {location.pathname === "/about" && (
              <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-indigo-600"></span>
            )}
          </Button>
          <Button
            onClick={() => navigate("/pricing")}
            className={`text-[15px] font-semibold relative px-2 py-1 rounded-md ${
              location.pathname === "/pricing" ? "text-indigo-700" : "text-slate-600 hover:text-indigo-700"
            } transition-colors`}
          >
            Pricing
            {location.pathname === "/pricing" && (
              <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-indigo-600"></span>
            )}
          </Button>
          <Button
            onClick={() => navigate("/contact")}
            className={`text-[15px] font-semibold relative px-2 py-1 rounded-md ${
              location.pathname === "/contact" ? "text-indigo-700" : "text-slate-600 hover:text-indigo-700"
            } transition-colors`}
          >
            Contact
            {location.pathname === "/contact" && (
              <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-indigo-600"></span>
            )}
          </Button>
          <Button
            className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm hover:shadow-md hover:from-indigo-500 hover:to-violet-500 transition-all"
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
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/90 backdrop-blur-md border-t border-indigo-100"
          >
            <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-4">
              <Button
                onClick={() => {
                  navigate("/");
                  setIsMenuOpen(false);
                }}
                className={`text-base font-semibold relative ${
                  location.pathname === "/" ? "text-indigo-700" : "text-slate-700 hover:text-indigo-700"
                } transition-colors`}
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
                className={`text-base font-semibold relative ${
                  location.pathname === "/about" ? "text-indigo-700" : "text-slate-700 hover:text-indigo-700"
                } transition-colors`}
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
                className={`text-base font-semibold relative ${
                  location.pathname === "/contact" ? "text-indigo-700" : "text-slate-700 hover:text-indigo-700"
                } transition-colors`}
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
                className={`text-base font-semibold relative ${
                  location.pathname === "/pricing" ? "text-indigo-700" : "text-slate-700 hover:text-indigo-700"
                } transition-colors`}
              >
                Pricing
                {location.pathname === "/pricing" && (
                  <span className="absolute left-0 bottom-[-4px] w-full h-0.5 bg-indigo-600"></span>
                )}
              </Button>
              <Button
                className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm hover:shadow-md hover:from-indigo-500 hover:to-violet-500 transition-all"
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