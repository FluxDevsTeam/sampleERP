import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Button from "./Button";
import "./styles.css";
import { Briefcase, Factory, BarChart3, Package, Shield, Wallet } from "lucide-react";

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
    window.scrollTo(0,0);
    document.getElementById('root')?.scrollTo(0,0);
  };

  const features = [
    {
      title: "Production Management",
      description: "End-to-end control of your manufacturing processes with real-time monitoring, task assignment, and progress tracking.",
      icon: (
        <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-6 0H5m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          <circle cx="10" cy="8" r="1" fill="currentColor" />
          <circle cx="14" cy="8" r="1" fill="currentColor" />
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
        <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 16l2-2m0 0l2 2m-2-2v6" opacity="0.6" />
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
        <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 8l-4 4-4-4" opacity="0.6" />
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
        <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          <circle cx="12" cy="7" r="1" fill="currentColor" />
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
        <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          <circle cx="9" cy="12" r="1" fill="currentColor" />
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
        <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 19l4-7 4 7M16 5l-4 7-4-7" opacity="0.6" />
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
    icon: <Briefcase className="w-8 h-8 text-primary" />,
    features: ["Financial overview", "Production metrics", "Sales performance", "Company analytics"],
  },
  {
    title: "Factory Manager Demo",
    description: "Production monitoring, workforce management, and operational efficiency tools for plant management.",
    icon: <Factory className="w-8 h-8 text-primary" />,
    features: ["Production tracking", "Workforce scheduling", "Equipment monitoring", "Quality control"],
  },
  {
    title: "Project Manager Demo",
    description: "Project planning, resource allocation, and timeline management for product development and orders.",
    icon: <BarChart3 className="w-8 h-8 text-primary" />,
    features: ["Project planning", "Resource allocation", "Timeline management", "Budget tracking"],
  },
  {
    title: "Store Keeper Demo",
    description: "Inventory management, stock tracking, and material handling for efficient warehouse operations.",
    icon: <Package className="w-8 h-8 text-primary" />,
    features: ["Inventory management", "Stock tracking", "Material handling", "Order fulfillment"],
  },
  {
    title: "Admin Demo",
    description: "System administration, user management, and configuration tools to ensure smooth ERP operations.",
    icon: <Shield className="w-8 h-8 text-primary" />,
    features: ["User management", "System configuration", "Access control", "Data backups"],
  },
  {
    title: "Accountant Demo",
    description: "Financial management, payroll processing, and reporting for accurate accounting and compliance.",
    icon: <Wallet className="w-8 h-8 text-primary" />,
    features: ["Payroll processing", "Financial reporting", "Expense tracking", "Tax compliance"],
  },
];

  return (
    <div className="min-h-screen bg-gradient-hero text-foreground">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-28 md:pb-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Complete <span className="bg-gradient-to-r py-1 from-[#06069b] to-[#0d6bf8]  bg-clip-text text-transparent">Manufacturing ERP</span> Solution
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto">
              Explore interactive demos of the full ERP experience for each user role. Click a role to open a live demo with real data.
            </p>
          </div>
        </div>
      </section>

      {/* Role Demos */}
      <section className=" ">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {roles.map((role, index) => (
  <div
    key={index}
    onClick={() => handleRoleClick(role.title)}
    className="group bg-gradient-card p-8 rounded-2xl shadow-card hover:shadow-glow transition-all duration-300 border border-border cursor-pointer"
  >
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        {role.icon}
        <h3 className="text-lg font-semibold bg-gradient-to-r py-1 from-[#4c76d6] to-[#0d67ef] bg-clip-text text-transparent">
          {role.title}
        </h3>
      </div>
<div
  className="text-xs font-medium text-white border border-white px-3 py-1 rounded-full 
             transition-all duration-200 group-hover:bg-blue-100 group-hover:text-black-900 "
>
  Open
</div>

    </div>
    <p className="text-muted-foreground mb-6">{role.description}</p>
    <div className="grid grid-cols-2 gap-3">
      {role.features.map((feature, i) => (
        <div key={i} className="flex items-center text-sm text-muted-foreground">
          <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
          {feature}
        </div>
      ))}
    </div>
  </div>
))}

          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="md:py-16 md:mt-6 py-12 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-4xl font-bold mb-4 ">
              Comprehensive Manufacturing Management
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our ERP system integrates all aspects of your manufacturing business into a single, powerful platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div className="bg-gradient-card p-8 rounded-2xl shadow-card hover:shadow-glow transition-all duration-300 border border-border">
                <div className="flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground mb-6">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.details.map((detail, i) => (
                    <li key={i} className="flex items-center text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></div>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      {/* <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built on Modern Technology
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our ERP leverages the latest technologies to ensure reliability, security, and performance.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {technologies.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-card p-6 rounded-xl shadow-card hover:shadow-glow transition-all duration-300 border border-border text-center"
              >
                <div className="text-3xl mb-3">{tech.icon}</div>
                <div className="font-semibold mb-2">{tech.name}</div>
                <div className="text-sm text-muted-foreground">{tech.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Final CTA */}
      <section className="py-12 md:py-16 bg-gradient-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Manufacturing Operations?
          </h2>
          <p className="md:text-xl text-lg mb-8 max-w-3xl mx-auto opacity-90">
            See how Fluxdevs ERP can streamline your processes, reduce costs, and drive growth with a personalized demonstration.
          </p>
          <Button
            variant="footer"
            size="lg"
            onClick={() => { navigate("/contact"); window.scrollTo(0,0); document.getElementById('root')?.scrollTo(0,0); }}
            className="px-8 py-4 text-lg bg-gradient-footer text-white hover:bg-primary-foreground/90"
          >
            Contact Us Today
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;