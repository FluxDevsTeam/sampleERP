import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaTwitter, FaLinkedin, FaFacebook, FaTiktok } from "react-icons/fa";const Footer: React.FC = () => {
  const iconSize = 24;  return (
    <footer className="bg-indigo-700 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-semibold text-indigo-300 mb-4">FluxDevs ERP</h3>
          <p className="text-gray-300">
            Advanced manufacturing ERP solution designed to streamline operations, increase efficiency, and drive growth for modern manufacturers.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-indigo-300 mb-4">Solutions</h3>
          <ul className="space-y-2">
            <li><Link to="/about"  className="text-gray-300 hover:text-indigo-400 cursor-pointer transition">Production Management</Link></li>
            <li><Link to="/about" className="text-gray-300 hover:text-indigo-400 cursor-pointer transition">Inventory Control</Link></li>
            <li><Link to="/about"  className="text-gray-300 hover:text-indigo-400 cursor-pointer transition">Financial Analytics</Link></li>
            <li><Link to="/about"  className="text-gray-300 hover:text-indigo-400 cursor-pointer transition">Quality Assurance</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-indigo-300 mb-4">Company</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="text-gray-300 hover:text-indigo-400 transition">Home</Link></li>
            <li><Link to="/about" className="text-gray-300 hover:text-indigo-400 transition">About</Link></li>
            <li><Link to="/contact" className="text-gray-300 hover:text-indigo-400 transition">Contact</Link></li>
            <li><a href="https://wa.me/2349164097582" className="text-gray-300 hover:text-indigo-400 transition">WhatsApp Support</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-indigo-300 mb-4">Contact Us</h3>
          <p className="text-gray-300">Email: <a href="mailto:fluxdevs.company@gmail.com" className="hover:text-indigo-400 transition">fluxdevs.company@gmail.com</a></p>
          <p className="text-gray-300">Phone: +234 916 409 7582</p>
          <p className="text-gray-300">WhatsApp: +234 916 409 7582</p>
          <p className="text-gray-300">Address: Lagos State, Nigeria</p>
          <p className="text-gray-300 mt-2">8am - 5pm, seven days a week</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-8">
        <h3 className="text-lg font-semibold text-indigo-300 mb-4 text-center">Connect with Us</h3>
        <div className="flex justify-center gap-4">
          <a
            href="https://www.instagram.com/fluxdevs"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 transition"
          >
            <FaInstagram size={iconSize} />
          </a>
          <a
            href="https://x.com/flux_devs"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 transition"
          >
            <FaTwitter size={iconSize} />
          </a>
          <a
            href="https://www.linkedin.com/company/flux-devs/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 transition"
          >
            <FaLinkedin size={iconSize} />
          </a>
          <a
            href="https://web.facebook.com/fluxxdevs/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 transition"
          >
            <FaFacebook size={iconSize} />
          </a>
          <a
            href="https://www.tiktok.com/@fluxdevs"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 transition"
          >
            <FaTiktok size={iconSize} />
          </a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto border-t border-indigo-700 mt-8 pt-8 text-center text-gray-300">
        <p>&copy; 2025 FluxDevs. All rights reserved.</p>
      </div>
    </footer>
  );
};export default Footer;