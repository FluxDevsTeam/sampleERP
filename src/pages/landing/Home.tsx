// Home.tsx
import React from "react";
import { useNavigate } from "react-router-dom"; 
import Navbar from "./Navbar";
import Footer from "./Footer";
import Button from "../../components/Button";
import { motion } from "framer-motion";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const navigateToRole = (role: string) => {
    localStorage.setItem("showReturnPopup", "true");
    localStorage.setItem("user_role", role);
    navigate(`/${role}/dashboard`);
  };

  const features = [
    {
      title: "Real-Time Production Monitoring",
      description: "Track every stage of manufacturing with live dashboards showing production status, bottlenecks, and efficiency metrics across all departments.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      title: "Advanced Inventory Management",
      description: "Optimize stock levels with predictive analytics, automated reordering, and real-time tracking of raw materials and finished goods.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      ),
    },
    {
      title: "Comprehensive Financial Analytics",
      description: "Gain deep insights into costs, profitability, and cash flow with advanced reporting tools and customizable financial dashboards.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "Workforce Optimization",
      description: "Manage contractors, salary workers, and production teams with integrated scheduling, performance tracking, and payroll management.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      title: "Quality Control Integration",
      description: "Implement robust quality assurance processes with automated inspections, defect tracking, and compliance management systems.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      title: "Supply Chain Coordination",
      description: "Streamline procurement, vendor management, and logistics with end-to-end visibility across your entire supply chain network.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
  ];

  // stats removed (unused in landing page)

  return (
    <div className="bg-gradient-to-b from-slate-50 to-white overflow-x-hidden pt-10">
      <Navbar />

      {/* Hero Section */}
      <section className="flex items-start md:items-center overflow-hidden py-10 md:pt-24">
        {/* Flowing pastel gradient background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute -top-28 -left-24 w-[85vw] h-[85vw] md:w-[60vw] md:h-[60vw] rounded-full blur-3xl opacity-30"
            style={{ background: "radial-gradient(circle at 30% 30%, #93c5fd, transparent 10%)" }}
          />
          <motion.div
            animate={{ y: [0, -16, 0], x: [0, 8, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-36 -right-24 w-[85vw] h-[85vw] md:w-[60vw] md:h-[60vw] rounded-full blur-3xl opacity-30"
            style={{ background: "radial-gradient(circle at 70% 70%, #bfdbfe, transparent 40%)" }}
          />
          <motion.div
            animate={{ y: [0, 14, 0], x: [0, -6, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[65vw] h-[65vw] md:w-[45vw] md:h-[45vw] rounded-full blur-3xl opacity-25"
            style={{ background: "radial-gradient(circle at 50% 50%, #e0f2fe, transparent 45%)" }}
          />
          {/* Subtle grid overlay */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.2"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-slate-800 mb-3 sm:mb-6 leading-snug md:leading-tight tracking-tight">
              Revolutionize Your <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Manufacturing Operations</span> With Intelligent ERP
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-700 mb-5 sm:mb-8 max-w-3xl mx-auto">
              FluxDevs ERP is the complete manufacturing management solution that integrates production, inventory, finance, and workforce management into one powerful platform designed for growth-focused manufacturers.
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-4 justify-center">
              <Button
                className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 sm:px-8 py-3 rounded-lg text-base sm:text-lg hover:from-indigo-500 hover:to-violet-500 transition-all shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl"
                onClick={() => { navigate("/about"); window.scrollTo({top:0,behavior:'smooth'}); }}
              >
                Checkout Demo
              </Button>
              <Button
                className="w-full sm:w-auto bg-white text-indigo-700 border border-indigo-200 px-6 sm:px-8 py-3 rounded-lg text-base sm:text-lg hover:bg-indigo-50 transition-all shadow-md sm:shadow-lg hover:shadow-lg sm:hover:shadow-xl"
                onClick={() => { navigate("/pricing"); window.scrollTo({top:0,behavior:'smooth'}); }}
              >
                View Pricing
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section className="bg-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm md:text-base opacity-90">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Features Section */}
      <section className="max-w-7xl mx-auto md:py-16 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">Powerful Features for Modern Manufacturing</h2>
          <p className="text-lg text-slate-700 max-w-3xl mx-auto">
            Our comprehensive ERP solution is designed to address every aspect of your manufacturing business with precision and efficiency.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all border border-slate-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="flex justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4 text-center">{feature.title}</h3>
              <p className="text-slate-700 text-center">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Demo Section */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-6">See FluxDevs ERP in Action</h2>
              <p className="text-slate-700 mb-6">
                Our interactive demo showcases how FluxDevs ERP can transform your manufacturing operations. From real-time production monitoring to advanced financial analytics, experience the power of integrated manufacturing management.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-emerald-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-700">Live production tracking and analytics</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-emerald-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-700">Inventory optimization tools</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-emerald-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-700">Financial forecasting and reporting</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-emerald-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-700">Role-based customizable dashboards</span>
                </li>
              </ul>
              <Button
                className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-8 py-3 rounded-lg hover:from-indigo-500 hover:to-violet-500 transition-all"
                onClick={() => { navigate("/about"); window.scrollTo({top:0,behavior:'smooth'}); }}
              >
                View Full Feature Tour
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
                <div className="flex gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="bg-gray-100 rounded-lg p-4 h-64 flex items-center justify-center">
                  <img src="/website.png" alt="ERP preview" />
                </div>
                <div className="mt-4 text-center">
                  <p className="text-slate-700">Interactive ERP Dashboard Preview</p>
                </div>
              </div>
              
              {/* Floating elements around the mockup */}
              <motion.div
                className="absolute -top-4 -right-4 bg-indigo-100 p-3 rounded-full shadow-md"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </motion.div>
              
              <motion.div
                className="absolute -bottom-4 -left-4 bg-emerald-100 p-3 rounded-full shadow-md"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">Designed for Diverse Manufacturing Sectors</h2>
          <p className="text-lg text-slate-700 max-w-3xl mx-auto">
            FluxDevs ERP adapts to your specific industry needs with customizable modules and workflows.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: "Automotive", icon: "🚗", color: "bg-red-100 text-red-800" },
            { name: "Electronics", icon: "📱", color: "bg-blue-100 text-blue-800" },
            { name: "Textiles", icon: "👕", color: "bg-indigo-100 text-indigo-800" },
            { name: "Food & Beverage", icon: "🍔", color: "bg-amber-100 text-amber-800" },
            { name: "Furniture", icon: "🪑", color: "bg-emerald-100 text-emerald-800" },
            { name: "Chemicals", icon: "🧪", color: "bg-purple-100 text-purple-800" },
            { name: "Plastics", icon: "🧴", color: "bg-cyan-100 text-cyan-800" },
            { name: "Metalworking", icon: "⚙️", color: "bg-gray-100 text-gray-700" },
          ].map((industry, index) => (
            <motion.div
              key={index}
              className={`p-4 rounded-lg text-center ${industry.color} shadow-md hover:shadow-lg transition-shadow`}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-2xl mb-2">{industry.icon}</div>
              <div className="font-medium">{industry.name}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-violet-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Transform Your Manufacturing Operations?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
              Join hundreds of manufacturers who have increased efficiency, reduced costs, and scaled their businesses with FluxDevs ERP.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                className="bg-white text-indigo-700 px-8 py-3 rounded-lg text-lg hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl"
                onClick={() => { navigate("/pricing"); window.scrollTo({top:0,behavior:'smooth'}); }}
              >
                View Pricing
              </Button>
              <Button
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg text-lg hover:bg-white hover:text-indigo-700 transition-all"
                onClick={() => { navigate("/contact"); window.scrollTo({top:0,behavior:'smooth'}); }}
              >
                Contact Us
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;