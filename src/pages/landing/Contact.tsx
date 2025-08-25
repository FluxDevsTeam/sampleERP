// Contact.tsx
import React from "react";
import { useNavigate, Link } from "react-router-dom"; // Remove BrowserRouter import
import Navbar from "./Navbar";
import Footer from "./Footer";
import Button from "../../components/Button";
import { motion } from "framer-motion";
import { FaInstagram, FaTwitter, FaLinkedin, FaFacebook, FaTiktok, FaWhatsapp } from "react-icons/fa";

const Contact: React.FC = () => {
  const navigate = useNavigate();
  const iconSize = 24;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-10">
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto md:py-24 pt-24 px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 mb-6">
            Connect with <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">FluxDevs</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-700 mb-10 max-w-3xl mx-auto">
            Ready to revolutionize your manufacturing operations? Reach out to our team to schedule a personalized demo and see how FluxDevs ERP can boost efficiency and growth.
          </p>
          <Button
            className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-indigo-500 hover:to-violet-500 transition-all shadow-lg hover:shadow-xl"
            onClick={() => window.open("https://wa.me/2349164097582", "_blank")}
          >
            Chat on WhatsApp
          </Button>
        </motion.div>
      </section>

      {/* Contact Information Section */}
      <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Contact Us</h2>
            <p className="text-slate-700 mb-6">
              We’re here to help! Our Customer Service Team is available 8am - 5pm, seven days a week.
            </p>
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="bg-indigo-100 p-3 rounded-full mr-4">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-slate-900">Phone Support</h3>
                  <p className="text-slate-700">+234 916 409 7582</p>
                  <p className="text-sm text-slate-500">Talk to a Customer Service Representative for help with our site, app, or finding our products.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                <div className="bg-green-200 p-1 rounded-full">
                  <FaWhatsapp className="w-6 h-6 text-green-600" />
                </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-slate-900">WhatsApp Business</h3>
                  <p className="text-slate-700">+234 916 409 7582</p>
                  <p className="text-sm text-slate-500">8am - 5pm, seven days a week</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-red-100 p-3 rounded-full mr-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-slate-900">Email Us</h3>
                  <p className="text-slate-700">
                    <a href="mailto:fluxdevs.company@gmail.com" className="hover:text-indigo-600">fluxdevs.company@gmail.com</a>
                  </p>
                  <p className="text-sm text-slate-500">Response within 12 hours</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-slate-900">Office Location</h3>
                  <p className="text-slate-700">Lagos State, Nigeria</p>
                </div>
              </div>

              {/* Social Media Links */}
              <div>
                <h3 className="font-semibold text-lg text-slate-900 mb-4">Connect with Us</h3>
                <div className="flex gap-4">
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
            </div>
          </motion.div>

          {/* Why Choose FluxDevs ERP */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-indigo-50 p-8 rounded-2xl border border-indigo-200"
          >
            <h3 className="md:text-3xl text-2xl font-bold text-indigo-900 mb-6">Why Choose FluxDevs ERP?</h3>
            <ul className="space-y-4 md:text-xl text-lg">
              <li className="flex items-start">
                <svg className="w-6 h-6 text-indigo-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Tailored implementation to meet your specific manufacturing needs</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-indigo-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Comprehensive training programs for your entire team</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-indigo-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Continuous support and regular system updates</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-indigo-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Scalable solutions designed to grow with your business</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-indigo-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Advanced analytics for data-driven decision-making</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-indigo-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Seamless integration with existing software systems</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-indigo-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Robust mobile app for on-the-go management</span>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-indigo-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">Dedicated account management for personalized support</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-indigo-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Get answers to common questions about FluxDevs ERP implementation and support.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              question: "How long does implementation typically take?",
              answer: "Implementation typically ranges from 2-6 weeks, depending on your business size and complexity. We provide a detailed timeline after our initial assessment."
            },
            {
              question: "Do you offer training for our team?",
              answer: "Yes, we provide comprehensive training, including admin training for your IT team and role-specific training for various departments."
            },
            {
              question: "Can FluxDevs ERP integrate with existing systems?",
              answer: "Our ERP offers robust API capabilities and integrates with most existing software, including accounting, CRM, and supply chain tools."
            },
            {
              question: "What support is available post-implementation?",
              answer: "We offer multiple support tiers, including email, phone, and dedicated account management, to assist with technical issues and optimization."
            },
            {
              question: "Is there a mobile app for FluxDevs ERP?",
              answer: "Yes, our fully-featured mobile app allows managers to monitor operations, approve requests, and view reports on the go."
            },
            {
              question: "How often are updates released?",
              answer: "We release minor updates monthly and major feature updates quarterly, all included in your subscription at no extra cost."
            }
          ].map((faq, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold text-indigo-900 mb-3">{faq.question}</h3>
              <p className="text-gray-700">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-r from-indigo-600 to-violet-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">Transform Your Manufacturing Today</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
              Join manufacturers worldwide who have boosted efficiency, cut costs, and scaled operations with FluxDevs ERP.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                className="bg-white text-indigo-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-50 transition-all"
                onClick={() => window.open("https://wa.me/message/IJCGAQKFVMKUB1", "_blank")}
              >
                Chat on WhatsApp
              </Button>
              <Button
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-indigo-700 transition-all"
                onClick={() => { navigate("/"); window.scrollTo({top:0,behavior:'smooth'}); }}
              >
                Explore Features
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;