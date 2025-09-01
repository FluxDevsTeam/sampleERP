import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Button from "@/components/Button";
import "./styles.css";
import { Menu, X } from "lucide-react";

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "Features" },
    { path: "/pricing", label: "Pricing" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="backdrop-blur-xl bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          
          {/* Desktop Navbar */}
          <div className="hidden md:grid grid-cols-3 items-center">
            {/* Logo (left) */}
            <div className="flex justify-start">
              <Button
                onClick={() => navigate("/")}
                variant="ghost"
                className="flex items-center gap-3 hover:bg-transparent p-0"
              >
                <img
                  src="/fluxdevs.png"
                  alt="FluxDevs Logo"
                  className="w-10 h-auto object-contain"
                />
                <span className="text-lg font-bold text-white bg-clip-text text-transparent">
                  Fluxdevs ERP
                </span>
              </Button>
            </div>

            {/* Nav (center) */}
            <nav className="flex justify-center items-center space-x-8">
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  variant="ghost"
                  size="sm"
                  className={`relative ${
                    location.pathname === item.path
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                  {location.pathname === item.path && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-primary rounded-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Button>
              ))}
            </nav>

            {/* View Demo (right) */}
            <div className="flex justify-end">
              <Button
                variant="hero"
                className="px-5 py-2 bg-gradient-to-r from-[#06069b] to-[#0d6bf8]"
                onClick={() => navigate("/about")}
              >
                View Demo
              </Button>
            </div>
          </div>

          {/* Mobile Navbar */}
          <div className="flex md:hidden items-center justify-between">
            {/* Logo */}
            <Button
              onClick={() => navigate("/")}
              variant="ghost"
              className="flex items-center gap-1 hover:bg-transparent p-0"
            >
              <img
                src="/fluxdevs.png"
                alt="FluxDevs Logo"
                className="w-8 h-auto object-contain"
              />
              <span className="text-sm font-bold text-white bg-clip-text text-transparent">
                Fluxdevs ERP
              </span>
            </Button>

            {/* Hamburger */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </Button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="md:hidden bg-background/95 text-white backdrop-blur-xl border-b border-border"
          >
            <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
              {navItems.map((item, index) => (
                <div
                >
                  <Button
                    onClick={() => {
                      navigate(item.path);
                      setIsMenuOpen(false);
                    }}
                    variant="ghost"
                    className={`w-full justify-start ${
                      location.pathname === item.path
                        ? "text-primary bg-muted"
                        : "text-muted-foreground"
                    }`}
                  >
                    {item.label}
                  </Button>
                </div>
              ))}
              <div
              >
                <Button
                  variant="hero"
                  className="w-full px-4 py-2 bg-gradient-to-r from-[#06069b] to-[#0d6bf8]"
                  onClick={() => {
                    navigate("/about");
                    setIsMenuOpen(false);
                  }}
                >
                  View Demo
                </Button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
