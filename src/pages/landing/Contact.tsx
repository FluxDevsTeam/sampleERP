import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Button from "./Button";
import "./styles.css";
import { FaFacebook, FaInstagram, FaLinkedin, FaTiktok, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { Copy } from "lucide-react";

const Contact: React.FC = () => {
  const navigate = useNavigate();
  const iconSize = 24;


  const benefits = [
    "Tailored implementation to meet your specific manufacturing needs",
    "Comprehensive training programs for your entire team",
    "Continuous support and regular system updates",
    "Scalable solutions designed to grow with your business",
    "Advanced analytics for data-driven decision-making",
    "Seamless integration with existing software systems",
    "Robust mobile app for on-the-go management",
    "Dedicated account management for personalized support"
  ];

  const faqs = [
    {
      question: "How long does implementation typically take?",
      answer: "Implementation typically ranges from 2-6 weeks, depending on your business size and complexity. We provide a detailed timeline after our initial assessment."
    },
    {
      question: "Do you offer training for our team?",
      answer: "Yes, we provide comprehensive training, including admin training for your IT team and role-specific training for various departments."
    },
    {
      question: "Can Fluxdevs ERP integrate with existing systems?",
      answer: "Our ERP offers robust API capabilities and integrates with most existing software, including accounting, CRM, and supply chain tools."
    },
    {
      question: "What support is available post-implementation?",
      answer: "We offer multiple support tiers, including email, phone, and dedicated account management, to assist with technical issues and optimization."
    },
    {
      question: "Is there a mobile app for Fluxdevs ERP?",
      answer: "Yes, our fully-featured mobile app allows managers to monitor operations, approve requests, and view reports on the go."
    },
    {
      question: "How often are updates released?",
      answer: "We release minor updates monthly and major feature updates quarterly, all included in your subscription at no extra cost."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero bg-background text-foreground">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-28 pb-10 md:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Connect with{" "}
              <span className="bg-gradient-to-r py-1 from-[#06069b] to-[#0d6bf8]  bg-clip-text text-transparent">
                Fluxdevs
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
              Ready to revolutionize your manufacturing operations? Reach out to our team to schedule a personalized demo and see how Fluxdevs ERP can boost efficiency and growth.
            </p>
            <Button
              variant="footer"
              size="lg"
              onClick={() => window.open("https://wa.me/2349164097582", "_blank")}
              className="px-8 py-4  bg-gradient-footer text-lg"
            >
              Chat on WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Methods */}
            <div className="bg-gradient-card p-6 md:p-8 rounded-2xl shadow-card border border-border">
              <h2 className="text-3xl font-bold mb-6 md:mb-8">Contact Us</h2>
              {/* <p className="text-muted-foreground mb-8">
                We're here to help! Our Customer Service Team is available 8am - 5pm, seven days a week.
              </p> */}
              
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="bg-blue-10 p-3 rounded-full mr-4">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg ">Phone Support</h3>
                  <p className="text-indigo-100/90 flex items-center gap-2">
                    +234 916 409 7582
                    <button
                      onClick={() => copyToClipboard("+2349164097582")}
                      className="p-1 rounded  hover:bg-white/20 transition"
                    >
                      <Copy size={16} className="text-white/80 hover:text-white" />
                    </button>
                  </p>                  <p className="text-sm text-slate-200">Talk to a Customer Service Representative.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-green-100 p-1 rounded-full mr-4">
                <div className="bg-green-200 p-1 rounded-full">
                  <FaWhatsapp className="w-8 h-8 text-green-600" />
                </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg ">WhatsApp Business</h3>
                  <p className="text-indigo-100/90 flex items-center gap-2">
                    +234 916 409 7582
                    <button
                      onClick={() => copyToClipboard("+2349164097582")}
                      className="p-1 rounded  hover:bg-white/20 transition"
                    >
                      <Copy size={16} className="text-white/80 hover:text-white" />
                    </button>
                  </p>
                  <p className="text-sm text-slate-200">8am - 5pm, seven days a week</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-red-100 p-3 rounded-full mr-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg ">Email Us</h3>
                  <p className="">
                    <a href="mailto:fluxdevs.company@gmail.com" className="hover:text-indigo-600">fluxdevs.company@gmail.com</a>
                  </p>
                  <p className="text-sm text-slate-200">Response within 12 hours</p>
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
                  <h3 className="font-semibold text-lg ">Office Location</h3>
                  <p className="">Lagos State, Nigeria</p>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="py-4">
                <h3 className="font-semibold text-lg mb-4">Connect with Us</h3>
                <div className="flex gap-2 md:gap-4">
                  <a
                    href="https://www.instagram.com/fluxdevs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-teal-600 text-white p-3 rounded-full hover:bg-teal-400 transition"
                  >
                    <FaInstagram size={iconSize} />
                  </a>
                  <a
                    href="https://x.com/flux_devs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-teal-600 text-white p-3 rounded-full hover:bg-teal-400 transition"
                  >
                    <FaTwitter size={iconSize} />
                  </a>
                  <a
                    href="https://www.linkedin.com/company/flux-devs/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-teal-600 text-white p-3 rounded-full hover:bg-teal-400 transition"
                  >
                    <FaLinkedin size={iconSize} />
                  </a>
                  <a
                    href="https://web.facebook.com/fluxxdevs/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-teal-600 text-white p-3 rounded-full hover:bg-teal-400 transition"
                  >
                    <FaFacebook size={iconSize} />
                  </a>
                  <a
                    href="https://www.tiktok.com/@fluxdevs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-teal-600 text-white p-3 rounded-full hover:bg-teal-400 transition"
                  >
                    <FaTiktok size={iconSize} />
                  </a>
                </div>
              </div>
            </div>
            </div>

            {/* Why Choose Fluxdevs ERP */}
            <div className="bg-gradient-card p-6 md:p-8  rounded-2xl shadow-card border border-border">
              <h3 className="text-3xl font-bold mb-6 md:mb-8">Why Choose Fluxdevs ERP?</h3>
              <ul className="space-y-4 md:space-y-6">
                {benefits.map((benefit, index) => (
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-primary mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-muted-foreground text-sm md:text-xl">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Get answers to common questions about Fluxdevs ERP implementation and support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {faqs.map((faq, index) => (
              <details
                className="group bg-gradient-card rounded-xl p-6 shadow-card hover:shadow-glow transition-all duration-300 border border-border"
                open={index === 0 || index==1} // Add open attribute for the first item
                key={index} // Added key for React list rendering
              >
                <summary className="flex items-start justify-between gap-4 cursor-pointer select-none">
                  <span className="font-medium text-base md:text-lg pr-4">{faq.question}</span>
                  <svg
                    className="w-5 h-5 text-primary mt-1 transition-transform duration-300 group-open:rotate-90 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </summary>
                <div className="mt-4 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 md:py-20 bg-gradient-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Transform Your Manufacturing Today</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
              Join manufacturers worldwide who have boosted efficiency, cut costs, and scaled operations with Fluxdevs ERP.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                size="lg"
                onClick={() => window.open("https://wa.me/message/IJCGAQKFVMKUB1", "_blank")}
                className="px-8 py-4 text-lg  text-white bg-gradient-footer  bg-clip-text "
              >
                Chat on WhatsApp
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => { navigate("/about"); window.scrollTo(0,0); document.getElementById('root')?.scrollTo(0,0); }}
                className="px-8 py-4 text-lg border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                Explore Features
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;