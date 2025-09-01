import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaTwitter, FaLinkedin, FaFacebook, FaTiktok } from "react-icons/fa";
import { Copy } from "lucide-react";
import Button from "./Button";

const Footer: React.FC = () => {
  const iconSize = 24;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Phone number copied!");
  };

  return (
    <footer className="bg-gradient-primary text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex justify-start mb-2 md:mb-4">
              <Button
                onClick={() => { navigate("/"); window.scrollTo(0,0); document.getElementById('root')?.scrollTo(0,0); }}
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

          <p className="text-indigo-100/90">
            Advanced manufacturing ERP solution designed to increase efficiency and drive growth for modern manufacturers.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Solutions</h3>
          <ul className="space-y-2">
            <li><Link to="/about" className="text-indigo-100/90 hover:text-white cursor-pointer transition">Production Management</Link></li>
            <li><Link to="/about" className="text-indigo-100/90 hover:text-white cursor-pointer transition">Inventory Control</Link></li>
            <li><Link to="/about" className="text-indigo-100/90 hover:text-white cursor-pointer transition">Financial Analytics</Link></li>
            <li><Link to="/about" className="text-indigo-100/90 hover:text-white cursor-pointer transition">Quality Assurance</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Company</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="text-indigo-100/90 hover:text-white transition">Home</Link></li>
            <li><Link to="/about" className="text-indigo-100/90 hover:text-white transition">About</Link></li>
            <li><Link to="/pricing" className="text-indigo-100/90 hover:text-white transition">Pricing</Link></li>
            <li><Link to="/contact" className="text-indigo-100/90 hover:text-white transition">Contact</Link></li>
            <li><a href="https://wa.me/2349164097582" className="text-indigo-100/90 hover:text-white transition">WhatsApp Support</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Contact Us</h3>
          <p className="text-indigo-100/90">
            Email:{" "}
            <a
              href="mailto:fluxdevs.company@gmail.com"
              className="hover:text-white transition"
            >
              fluxdevs.company@gmail.com
            </a>
          </p>

          {/* Copyable phone */}
          <p className="text-indigo-100/90 flex items-center gap-2">
            Phone: +234 916 409 7582
            <button
              onClick={() => copyToClipboard("+2349164097582")}
              className="p-1 rounded hover:bg-white/20 transition"
            >
              <Copy size={16} className="text-white/80 hover:text-white" />
            </button>
          </p>

          {/* Copyable WhatsApp */}
          <p className="text-indigo-100/90 flex items-center gap-2">
            WhatsApp: +234 916 409 7582
            <button
              onClick={() => copyToClipboard("+2349164097582")}
              className="p-1 rounded hover:bg-white/20 transition"
            >
              <Copy size={16} className="text-white/80 hover:text-white" />
            </button>
          </p>

          <p className="text-indigo-100/90">Address: Lagos State, Nigeria</p>
          <p className="text-indigo-100/90 mt-2">8am - 5pm, seven days a week</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8">
        <h3 className="text-lg font-semibold text-white mb-4 text-center">Connect with Us</h3>
        <div className="flex justify-center gap-4">
          <a href="https://www.instagram.com/fluxdevs" target="_blank" rel="noopener noreferrer" className="bg-white/10 text-white p-3 rounded-full hover:bg-white/20 transition border border-white/10">
            <FaInstagram size={iconSize} />
          </a>
          <a href="https://x.com/flux_devs" target="_blank" rel="noopener noreferrer" className="bg-white/10 text-white p-3 rounded-full hover:bg-white/20 transition border border-white/10">
            <FaTwitter size={iconSize} />
          </a>
          <a href="https://www.linkedin.com/company/flux-devs/" target="_blank" rel="noopener noreferrer" className="bg-white/10 text-white p-3 rounded-full hover:bg-white/20 transition border border-white/10">
            <FaLinkedin size={iconSize} />
          </a>
          <a href="https://web.facebook.com/fluxxdevs/" target="_blank" rel="noopener noreferrer" className="bg-white/10 text-white p-3 rounded-full hover:bg-white/20 transition border border-white/10">
            <FaFacebook size={iconSize} />
          </a>
          <a href="https://www.tiktok.com/@fluxdevs" target="_blank" rel="noopener noreferrer" className="bg-white/10 text-white p-3 rounded-full hover:bg-white/20 transition border border-white/10">
            <FaTiktok size={iconSize} />
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-white/10 mt-8 pt-8 text-center text-indigo-100/90">
        <p>&copy; 2025 Fluxdevs. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
