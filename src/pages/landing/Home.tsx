import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Button from "./Button";
import "./styles.css";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const navigateToRole = (role: string) => {
    localStorage.setItem("showReturnPopup", "true");
    localStorage.setItem("user_role", role);
    navigate(`/${role}/dashboard`);
    window.scrollTo(0,0);
    document.getElementById('root')?.scrollTo(0,0);
  };

  const features = [
    {
      title: "Real-Time Production Monitoring",
      description: "Track every stage of manufacturing with live dashboards showing production status, bottlenecks, and efficiency metrics across all departments.",
      icon: (
        <svg className="w-12 h-12 text-primary" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm1-13h-2v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
        </svg>
      ),
    },
    {
      title: "Advanced Inventory Management",
      description: "Optimize stock levels with predictive analytics, automated reordering, and real-time tracking of raw materials and finished goods.",
      icon: (
        <svg className="w-12 h-12 text-primary" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 6h-4V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2zM10 4h4v2h-4V4zm10 14H4V8h16v10z" />
        </svg>
      ),
    },
    {
      title: "Comprehensive Financial Analytics",
      description: "Gain deep insights into costs, profitability, and cash flow with advanced reporting tools and customizable financial dashboards.",
      icon: (
        <svg className="w-12 h-12 text-primary" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3 14h-2v-2h2v2zm0-4h-2V7h2v5zm-5 4H8v-2h2v2zm0-4H8V7h2v5z" />
        </svg>
      ),
    },
    {
      title: "Workforce Optimization",
      description: "Manage contractors, salary workers, and production teams with integrated scheduling, performance tracking, and payroll management.",
      icon: (
        <svg className="w-12 h-12 text-primary" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
        </svg>
      ),
    },
    {
      title: "Quality Control Integration",
      description: "Implement robust quality assurance processes with automated inspections, defect tracking, and compliance management systems.",
      icon: (
        <svg className="w-12 h-12 text-primary" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      ),
    },
    {
      title: "Supply Chain Coordination",
      description: "Streamline procurement, vendor management, and logistics with end-to-end visibility across your entire supply chain network.",
      icon: (
        <svg className="w-12 h-12 text-primary" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 8h-3V4H3v10h4v2H3v4h14v-4h-4v-2h4V8zm-9 8H9v-2h2v2zm4 0h-2v-2h2v2zM7 8H5v-2h2v2zm4 0H9v-2h2v2zm4 0h-2v-2h2v2z" />
        </svg>
      ),
    },
  ];

  const industries = [
    {
      name: "Aerospace & Defense",
      icon: (
        <svg className="w-12 h-12 text-primary group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21 16.5v-2.3l-7-2.4 7-2.4V7.3L12 10.1V3h-2v7.1L3 7.3v2.3l7 2.4-7 2.4v2.3l9-3.1v7.2h2v-7.2l9 3.1z" />
        </svg>
      ),
      color: "from-blue-600 to-blue-800",
      benefit: "Precision manufacturing and regulatory compliance",
    },
    {
      name: "Automotive",
      icon: (
        <svg className="w-12 h-12 text-primary group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.92 5.01C18.72 4.42 18.16 4 17.5 4h-11C5.84 4 5.29 4.42 5.08 5.01L3 11v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 10l1.5-4.5h11L19 10H5z" />
        </svg>
      ),
      color: "from-red-500 to-red-700",
      benefit: "Streamlined supply chains and mass production",
    },
    {
      name: "Electronics & High-Tech",
      icon: (
        <svg className="w-12 h-12 text-primary group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-1 14H5V8h14v10zm-3-1h-2v-2h2v2zm-4 0h-2v-2h2v2zm-4 0H6v-2h2v2z" />
        </svg>
      ),
      color: "from-blue-500 to-blue-600",
      benefit: "Rapid innovation and inventory tracking",
    },
    {
      name: "Pharmaceuticals",
      icon: (
        <svg className="w-12 h-12 text-primary group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-3 14h-2v-3h-3v-2h3v-3h2v3h3v2h-3v3z" />
        </svg>
      ),
      color: "from-green-500 to-green-700",
      benefit: "Regulatory compliance and batch tracking",
    },
    {
      name: "Food & Beverage",
      icon: (
        <svg className="w-12 h-12 text-primary group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
        </svg>
      ),
      color: "from-orange-500 to-orange-600",
      benefit: "Safety compliance and inventory management",
    },
    {
      name: "Industrial Machinery",
      icon: (
        <svg className="w-12 h-12 text-primary group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 6h-4V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2zm-6 10h-4v-4h4v4z" />
        </svg>
      ),
      color: "from-gray-500 to-gray-700",
      benefit: "Complex assembly and maintenance tracking",
    },
    {
      name: "Chemicals",
      icon: (
        <svg className="w-12 h-12 text-primary group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 14H7v-2h10v2zm0-4H7v-2h10v2z" />
        </svg>
      ),
      color: "from-indigo-500 to-indigo-600",
      benefit: "Material tracking and safety compliance",
    },
    {
      name: "Medical Devices",
      icon: (
        <svg className="w-12 h-12 text-primary group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 6h-4V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2zM10 4h4v2h-4V4zm10 14H4V8h16v10zM9 16h2v-2h2v-2h-2v-2H9v2H7v2h2v2z" />
        </svg>
      ),
      color: "from-teal-500 to-teal-700",
      benefit: "Precision manufacturing and quality control",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero text-foreground">
      <Navbar />

{/* Hero Section */}
<section className="relative min-h-screen flex items-center justify-center overflow-hidden">
<div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10">

  {/* Progress Bar */}
  <svg
    className="absolute w-24 h-8 opacity-10"
    style={{ top: "15%", left: "12%" }}
    viewBox="0 0 100 20"
    fill="none"
    stroke="currentColor"
  >
    <rect x="0" y="6" width="100" height="8" rx="4" strokeWidth="2" strokeOpacity="0.5" />
    <rect x="0" y="6" width="70" height="8" rx="4" fill="currentColor" fillOpacity="0.3" />
  </svg>

  {/* Mini Dashboard (cards with KPIs) */}
  <svg
    className="absolute w-28 h-20 opacity-10"
    style={{ bottom: "15%", right: "18%" }}
    viewBox="0 0 120 80"
    fill="none"
    stroke="currentColor"
  >
    <rect x="5" y="5" width="40" height="25" rx="3" strokeWidth="2" strokeOpacity="0.5" />
    <rect x="55" y="5" width="60" height="25" rx="3" strokeWidth="2" strokeOpacity="0.5" />
    <rect x="5" y="45" width="110" height="25" rx="3" strokeWidth="2" strokeOpacity="0.5" />
  </svg>

  {/* Gantt Chart */}
  <svg
    className="absolute w-32 h-20 opacity-10"
    style={{ top: "65%", left: "18%" }}
    viewBox="0 0 140 80"
    fill="none"
    stroke="currentColor"
  >
    <rect x="10" y="10" width="100" height="10" rx="2" strokeWidth="2" strokeOpacity="0.5" />
    <rect x="25" y="30" width="80" height="10" rx="2" strokeWidth="2" strokeOpacity="0.5" />
    <rect x="40" y="50" width="70" height="10" rx="2" strokeWidth="2" strokeOpacity="0.5" />
  </svg>

  {/* Pie / KPI Chart */}
  <svg
    className="absolute w-16 h-16 opacity-10"
    style={{ top: "28%", right: "22%" }}
    viewBox="0 0 36 36"
    fill="none"
    stroke="currentColor"
  >
    <circle cx="18" cy="18" r="15.9155" strokeWidth="2" strokeOpacity="0.5" />
    <path
      d="M18 2.0845
         a 15.9155 15.9155 0 0 1 0 31.831
         a 15.9155 15.9155 0 0 1 0 -31.831"
      fill="currentColor"
      fillOpacity="0.3"
    />
  </svg>

  {/* Task / Checklist */}
  <svg
    className="absolute w-14 h-14 opacity-10"
    style={{ bottom: "25%", left: "25%" }}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <circle cx="12" cy="12" r="9" strokeWidth="2" strokeOpacity="0.5" />
    <path
      d="M9 12l2 2 4-4"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeOpacity="0.5"
    />
  </svg>

  {/* Bar Chart */}
  <svg
    className="absolute w-20 h-16 opacity-10"
    style={{ top: "20%", right: "10%" }}
    viewBox="0 0 50 50"
    fill="currentColor"
  >
    <rect x="5" y="30" width="6" height="15" rx="1" fillOpacity="0.3" />
    <rect x="17" y="20" width="6" height="25" rx="1" fillOpacity="0.3" />
    <rect x="29" y="10" width="6" height="35" rx="1" fillOpacity="0.3" />
    <rect x="41" y="25" width="6" height="20" rx="1" fillOpacity="0.3" />
  </svg>

</div>

  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
    <div className="text-center">
      <div className="space-y-8">
        <div className="space-y-5">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            <span className="block">Revolutionize Your</span>
            <span className="block bg-gradient-to-r py-1 from-[#06069b] to-[#0d6bf8]  bg-clip-text text-transparent">
              Manufacturing
            </span>
            <span className="block">Operations</span>
          </h1>

          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Fluxdevs ERP is the complete manufacturing management solution that integrates production, inventory, finance, and workforce management into one powerful platform.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center items-center">
          <Button
            variant="footer"
            size="lg"
            onClick={() => { navigate("/about"); window.scrollTo(0,0); document.getElementById('root')?.scrollTo(0,0); }}
            className="px-6 py-4 bg-gradient-footer text-lg"
          >
            View Live Demo
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => { navigate("/pricing"); window.scrollTo(0,0); document.getElementById('root')?.scrollTo(0,0); }}
            className="px-6 py-3 text-lg"
          >
            View Pricing
          </Button>
        </div>
      </div>
    </div>
  </div>
</section>

{/* Demo Section */}
<section className="pb-12 md:pb-10">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      
      {/* Image First */}
      <div className="relative">
        <div className="p-6 rounded-xl shadow-lg border border-slate-200 bg-white/5">
          {/* Fake window controls */}
          <div className="flex gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>

          {/* Image wrapper */}
          <div className="rounded-lg w-full  flex items-center justify-center">
            <img
              src="/erp-dashboard.png"
              alt="ERP preview"
              className="object-contain rounded-md"
            />
          </div>

          <div className="mt-4 text-center">
            <p className="text-white text-sm sm:text-base">
              Interactive ERP Dashboard Preview
            </p>
          </div>
        </div>
      </div>

      {/* Text Section */}
      <div>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
          See Fluxdevs ERP in Action
        </h2>
        <p className="text-white mb-6 text-base sm:text-lg">
          Our interactive demo showcases how Fluxdevs ERP can transform your
          manufacturing operations. From real-time production monitoring to
          advanced financial analytics, experience the power of integrated
          manufacturing management.
        </p>

        <ul className="space-y-3 mb-8">
          {[
            "Live production tracking and analytics",
            "Inventory optimization tools",
            "Financial forecasting and reporting",
            "Role-based customizable dashboards",
          ].map((item, idx) => (
            <li key={idx} className="flex items-center">
              <svg
                className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-white">{item}</span>
            </li>
          ))}
        </ul>

        <Button
          className="text-white px-8 py-3 rounded-lg bg-gradient-footer transition-all"
          onClick={() => {
            navigate("/about");
            window.scrollTo(0,0);
            document.getElementById('root')?.scrollTo(0,0);
          }}
        >
          View Full Feature Tour
        </Button>
      </div>
    </div>
  </div>
</section>


      {/* Features Section */}
      <section className="md:py-24 py-10 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful Features for Modern Manufacturing
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our comprehensive ERP solution addresses every aspect of your manufacturing business with precision and efficiency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-card p-8 rounded-2xl shadow-card hover:shadow-md transition-shadow duration-200 border border-border"
              >
                <div className="flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      {/* <sec/tion className="py-24 bg-background"> */}
        {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Tailored for Your Manufacturing Sector
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Fluxdevs ERP delivers customized solutions to meet the unique challenges of diverse manufacturing industries.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {industries.map((industry, index) => (
              <div
                key={index}
                className={`relative group bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-border bg-gradient-to-br ${industry.color}/10 hover:${industry.color}/20 transform hover:-translate-y-1`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 transform group-hover:scale-110 transition-transform duration-200">
                    {industry.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary">
                    {industry.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">{industry.benefit}</p>
                </div>

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="bg-gray-900/80 text-white text-sm rounded-lg p-4 max-w-xs shadow-lg">
                    {industry.benefit} with Fluxdevs ERP’s advanced tools for {industry.name.toLowerCase()}.
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="md:py-24 py-12  text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Manufacturing Operations?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Join hundreds of manufacturers who have increased efficiency, reduced costs, and scaled their businesses with Fluxdevs ERP.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="hero"
              size="lg"
              onClick={() => { navigate("/pricing"); window.scrollTo(0,0); document.getElementById('root')?.scrollTo(0,0); }}
              className="px-6 py-3 text-lg bg-gradient-footer text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              View Pricing
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => { navigate("/contact"); window.scrollTo(0,0); document.getElementById('root')?.scrollTo(0,0); }}
              className="px-6 py-3 text-lg border-primary-foreground text-primary-foreground hover:gradient-footer hover:text-primary"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;