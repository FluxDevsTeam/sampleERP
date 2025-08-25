// About.tsx
import React from "react";
import { useNavigate } from "react-router-dom"; 
import Navbar from "./Navbar";
import Footer from "./Footer";
import Button from "../../components/Button";
import { motion } from "framer-motion";

const About: React.FC = () => {
  const navigate = useNavigate();

  const roleRedirects: Record<string, { key: string; path: string }> = {
    "CEO Demo": { key: "ceo", path: "/ceo/dashboard" },
    "Factory Manager Demo": { key: "factory_manager", path: "/factory-manager/dashboard" },
    "Project Manager Demo": { key: "project_manager", path: "/project-manager/dashboard" },
    "Store Keeper Demo": { key: "storekeeper", path: "/store-keeper/dashboard" },
    "Admin Demo": { key: "admin", path: "/admin/dashboard" },
    "Accountant Demo": { key: "accountant", path: "/admin/dashboard" },
  };

  const handleRoleClick = (title: string) => {
    const meta = roleRedirects[title];
    if (!meta) return;
    try {
      localStorage.setItem("user_role", meta.key);
      localStorage.setItem("showReturnPopup", "true");
    } catch (e) {}
    navigate(meta.path);
  };

  const features = [
    {
      title: "Production Management",
      description: "End-to-end control of your manufacturing processes with real-time monitoring, task assignment, and progress tracking.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-6 0H5m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      details: [
        "Real-time production tracking",
        "Work order management",
        "Quality control integration",
        "Production scheduling"
      ]
    },
    {
      title: "Inventory Optimization",
      description: "Smart inventory management with predictive analytics, automated reordering, and waste reduction tools.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      ),
      details: [
        "Raw material tracking",
        "Stock level optimization",
        "Supplier management",
        "Inventory forecasting"
      ]
    },
    {
      title: "Financial Analytics",
      description: "Comprehensive financial management with detailed reporting, cost analysis, and profitability insights.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      details: [
        "Cost tracking & analysis",
        "Profit margin reporting",
        "Budget management",
        "Financial forecasting"
      ]
    },
    {
      title: "Workforce Management",
      description: "Efficient management of your workforce with scheduling, performance tracking, and payroll integration.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      details: [
        "Employee scheduling",
        "Performance metrics",
        "Payroll integration",
        "Skill tracking"
      ]
    },
    {
      title: "Quality Control",
      description: "Maintain high quality standards with integrated quality control processes and compliance management.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      details: [
        "Quality assurance workflows",
        "Defect tracking",
        "Compliance management",
        "Audit trails"
      ]
    },
    {
      title: "Supply Chain Integration",
      description: "Seamless integration with your supply chain for efficient procurement and logistics management.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      details: [
        "Vendor management",
        "Purchase order tracking",
        "Logistics coordination",
        "Supplier performance"
      ]
    }
  ];

const roles = [
  {
    title: "CEO Demo",
    description: "Executive overview with KPIs, financial performance, and operational metrics across all departments.",
    icon: "👔",
    features: ["Financial overview", "Production metrics", "Sales performance", "Company analytics"],
  },
  {
    title: "Factory Manager Demo",
    description: "Production monitoring, workforce management, and operational efficiency tools for plant management.",
    icon: "🏭",
    features: ["Production tracking", "Workforce scheduling", "Equipment monitoring", "Quality control"],
  },
  {
    title: "Project Manager Demo",
    description: "Project planning, resource allocation, and timeline management for product development and orders.",
    icon: "📊",
    features: ["Project planning", "Resource allocation", "Timeline management", "Budget tracking"],
  },
  {
    title: "Store Keeper Demo",
    description: "Inventory management, stock tracking, and material handling for efficient warehouse operations.",
    icon: "📦",
    features: ["Inventory management", "Stock tracking", "Material handling", "Order fulfillment"],
  },
  {
    title: "Admin Demo",
    description: "System administration, user management, and configuration tools to ensure smooth ERP operations.",
    icon: "🛠️",
    features: ["User management", "System configuration", "Access control", "Data backups"],
  },
  {
    title: "Accountant Demo",
    description: "Financial management, payroll processing, and reporting for accurate accounting and compliance.",
    icon: "💸",
    features: ["Payroll processing", "Financial reporting", "Expense tracking", "Tax compliance"],
  },
];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />

      {/* Role Demos (moved to top so visitors see available demos immediately) */}
      <section id="roles" className="py-16">
        <div className="max-w-7xl mx-auto px-4 mt-4 md:mt-14 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl sm:text-5xl font-bold text-slate-800 mb-6">Complete <span className="text-4xl sm:text-5xl bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Manufacturing ERP</span> <span className="text-2xl sm:text-5xl"> Solution </span></h1>
            <p className="text-lg text-slate-700 max-w-4xl mx-auto">
              Explore interactive demos of the full ERP experience for each user role. Click a role to open a live demo of that user's interface and try the product with demo data.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {roles.map((role, index) => (
              <motion.div
                key={index}
                onClick={() => handleRoleClick(role.title)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleRoleClick(role.title); }}
                tabIndex={0}
                role="button"
                aria-label={`Open ${role.title} demo`}
                className="relative group bg-white p-8 rounded-xl shadow-lg border border-slate-100 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-2xl hover:border-indigo-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
                viewport={{ once: true }}
              >
                <span className="absolute top-4 right-4 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded-md transition">Click to open</span>
                <div className="flex items-center mb-6">
                  <span className="text-4xl mr-4">{role.icon}</span>
                  <h3 className="text-2xl font-semibold text-indigo-700">{role.title}</h3>
                  <svg className="ml-auto w-5 h-5 text-indigo-500 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transform group-hover:translate-x-1 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <p className="text-slate-700 mb-6">{role.description}</p>
                <div className="grid grid-cols-2 gap-3">
                  {role.features.map((feature, i) => (
                    <div key={i} className="flex items-center text-sm text-slate-700">
                      <svg className="w-4 h-4 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">Comprehensive Manufacturing Management</h2>
            <p className="text-lg text-slate-700 max-w-3xl mx-auto">
              Our ERP system integrates all aspects of your manufacturing business into a single, powerful platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border border-slate-100"
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
                <p className="text-slate-700 mb-6 text-center">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.details.map((detail, i) => (
                    <li key={i} className="flex items-center text-sm text-slate-700">
                      <svg className="w-4 h-4 text-emerald-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {detail}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

  {/* Role demos moved above */}

      {/* Technology Stack */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-indigo-600 mb-4">Built on Modern Technology</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Our ERP leverages the latest technologies to ensure reliability, security, and performance.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
                { name: "React", icon: "⚛️", description: "Modern frontend framework for dynamic UIs" },
                { name: "Next.js", icon: "⚡", description: "React framework for server-side rendering and static sites" },
                { name: "TypeScript", icon: "📝", description: "Type-safe JavaScript for robust development" },
                // { name: "Redux", icon: "🔄", description: "Predictable state management for complex applications" },
                // { name: "Tailwind CSS", icon: "🎨", description: "Utility-first CSS for responsive, customizable UIs" },
                // { name: "Apollo Client", icon: "🚀", description: "GraphQL client for efficient data fetching" },
                // { name: "SWR", icon: "🔄", description: "React hooks for optimized data fetching and caching" },
                // { name: "Framer Motion", icon: "🎥", description: "Smooth animations for interactive dashboards" },
                // { name: "Vite", icon: "⚡", description: "Fast build tool for optimized frontend performance" },
                // Backend Technologies
                // { name: "Node.js", icon: "🟢", description: "Scalable backend runtime for efficient APIs" },
                { name: "Python", icon: "🐍", description: "Versatile language for backend logic and automation" },
                { name: "Django", icon: "🌐", description: "High-level Python framework for rapid development" },
                // { name: "Flask", icon: "🧪", description: "Lightweight Python framework for flexible APIs" },
                { name: "Celery", icon: "🥕", description: "Distributed task queue for background processing" },
                { name: "REST API", icon: "🔗", description: "Standardized API for seamless integrations" },
                // { name: "GraphQL", icon: "📊", description: "Efficient query language for flexible APIs" },
                // { name: "gRPC", icon: "🔄", description: "High-performance RPC for low-latency microservices" },
                { name: "Kubernetes", icon: "🛳️", description: "Container orchestration for scalable deployments" },
                // { name: "Apache Kafka", icon: "📡", description: "Real-time data streaming for transaction logs" },
                { name: "RabbitMQ", icon: "🐰", description: "Message broker for asynchronous task processing" },
                // Database & Infrastructure
                { name: "PostgreSQL", icon: "🐘", description: "Robust relational database for data integrity" },
                { name: "MySQL", icon: "🐬", description: "Reliable database for high-performance queries" },
                // { name: "MongoDB", icon: "🍃", description: "NoSQL database for flexible data models" },
                { name: "Redis", icon: "🔴", description: "High-performance caching for fast data access" },
                { name: "Elasticsearch", icon: "🔍", description: "Search and analytics for inventory and logs" },
                { name: "AWS", icon: "☁️", description: "Scalable cloud infrastructure for deployment" },
                { name: "Docker", icon: "🐳", description: "Containerization for consistent environments" },
                // { name: "Prometheus", icon: "📈", description: "Monitoring and alerting for system performance" },
                // Other
                { name: "C++", icon: "⚙️", description: "High-performance language for critical components" },
            ].map((tech, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-lg text-center shadow-md hover:shadow-lg transition-shadow border border-slate-100"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-3xl mb-3">{tech.icon}</div>
                <div className="font-semibold text-slate-800 mb-2">{tech.name}</div>
                <div className="text-sm text-slate-700">{tech.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-violet-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Transform Your Manufacturing Operations?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
              See how FluxDevs ERP can streamline your processes, reduce costs, and drive growth with a personalized demonstration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                className="bg-white text-indigo-700 px-8 py-3 rounded-lg text-lg hover:bg-indigo-50 transition-all"
                onClick={() => navigate("/contact")}
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

export default About;