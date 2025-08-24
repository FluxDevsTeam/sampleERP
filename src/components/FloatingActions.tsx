import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaTwitter, FaLinkedin, FaFacebook, FaTiktok } from "react-icons/fa";
import { motion } from "framer-motion";

const Footer: React.FC = () => {
  const iconSize = 28;

  return (
    <footer className="bg-indigo-900 text-white py-12 px-4 sm:px-6 lg:px-8" role="contentinfo">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-lg font-semibold text-indigo-200 mb-4">FluxDevs ERP</h3>
          <p className="text-gray-200 text-sm">
            Advanced manufacturing ERP solution to streamline operations, boost efficiency, and drive growth.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-indigo-200 mb-4">Solutions</h3>
          <ul className="space-y-2 text-sm">
            {["Production Management", "Inventory Control", "Financial Analytics", "Quality Assurance"].map((item) => (
              <li key={item}>
                <span className="text-gray-200 hover:text-indigo-300 cursor-pointer transition-colors">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-indigo-200 mb-4">Company</h3>
          <ul className="space-y-2 text-sm">
            {[
              { to: "/", label: "Home" },
              { to: "/about", label: "About" },
              { to: "/contact", label: "Contact" },
              { to: "https://wa.me/2349164097582", label: "WhatsApp Support" },
            ].map((link) => (
              <li key={link.label}>
                <Link to={link.to} className="text-gray-200 hover:text-indigo-300 transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-indigo-200 mb-4">Contact Us</h3>
          <p className="text-gray-200 text-sm mb-2">
            Email: <a href="mailto:fluxdevs.company@gmail.com" className="hover:text-indigo-300 transition-colors">fluxdevs.company@gmail.com</a>
          </p>
          <p className="text-gray-200 text-sm mb-2">Phone: +234 916 409 7582</p>
          <p className="text-gray-200 text-sm mb-2">WhatsApp: +234 916 409 7582</p>
          <p className="text-gray-200 text-sm mb-2">Address: Lagos State, Nigeria</p>
          <p className="text-gray-200 text-sm">8am - 5pm, seven days a week</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-8">
        <h3 className="text-base font-semibold text-indigo-200 mb-4 text-center">Connect with Us</h3>
        <div className="flex justify-center gap-4">
          {[
            { to: "https://www.instagram.com/fluxdevs", icon: <FaInstagram size={iconSize} />, label: "Instagram" },
            { to: "https://x.com/flux_devs", icon: <FaTwitter size={iconSize} />, label: "Twitter" },
            { to: "https://www.linkedin.com/company/flux-devs/", icon: <FaLinkedin size={iconSize} />, label: "LinkedIn" },
            { to: "https://web.facebook.com/fluxxdevs/", icon: <FaFacebook size={iconSize} />, label: "Facebook" },
            { to: "https://www.tiktok.com/@fluxdevs", icon: <FaTiktok size={iconSize} />, label: "TikTok" },
          ].map((social) => (
            <motion.a
              key={social.label}
              href={social.to}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-indigo-700 text-white p-3 rounded-full hover:bg-indigo-600 transition-all"
              whileHover={{ scale: 1.1 }}
              aria-label={`Follow us on ${social.label}`}
            >
              {social.icon}
            </motion.a>
          ))}
        </div>
      </div>
      <div className="max-w-7xl mx-auto border-t border-indigo-800 mt-8 pt-6 text-center text-gray-200 text-sm">
        <p>&copy; 2025 FluxDevs. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;