import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Button from "./Button";
import "./styles.css";

const Pricing: React.FC = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Essential",
      price: "₦800,000",
      description: "Kickstart your manufacturing journey. Perfect for small workshops to organize projects, track inventory, and manage their core team.",
      features: [
        "Streamlined Project & Product Management",
        "Essential Inventory Tracking",
        "Payroll for up to 10 employees",
        "Dependable Email Support"
      ],
      cta: "Contact Sales",
      highlighted: false
    },
    {
      name: "Professional",
      price: "₦2,100,000",
      description: "Grow your manufacturing operations with advanced insights, scalability, and priority support.",
      features: [
        "All Essential features",
        "Advanced Inventory & Sales Analytics",
        "Payroll for up to 50 employees",
        "Custom Role-Based Dashboards",
        "Priority Email & Chat Support"
      ],
      cta: "Contact Sales",
      highlighted: true
    },
    {
      name: "Enterprise",
      price: "₦3,500,000",
      description: "A fully customized solution with dedicated resources and premium support for large-scale operations.",
      features: [
        "All Professional features",
        "Unlimited Employees & Payroll",
        "Custom Software Integrations",
        "Dedicated Account Manager",
        "24/7 Phone & Chat Support"
      ],
      cta: "Request a Quote",
      highlighted: false
    }
  ];

  const faqs = [
    {
      question: "Can I try Fluxdevs ERP before purchasing?",
      answer: "Yes. We offer a guided demo so you can explore real workflows, dashboards, and reports relevant to your business. For qualified teams, we also provide a short pilot environment to validate fit with your processes before committing.",
    },
    {
      question: "What's included in the listed pricing?",
      answer: "Pricing covers the software license, hosting as specified per plan (shared or dedicated), domain setup, regular security patches, and standard support. Implementation services (data migration, custom workflows, and user training) are included at a basic level and can be expanded based on your requirements.",
    },
    {
      question: "Are there any setup or hidden fees?",
      answer: "No hidden fees. We provide a transparent quote that includes everything you need to get up and running. If you request extensive customizations or complex integrations, we'll scope and price those separately, with a clear breakdown and timeline.",
    },
    {
      question: "Can I upgrade or downgrade my plan later?",
      answer: "Absolutely. You can switch between plans as your operations evolve. Moving from Essential to Professional or Enterprise is seamless, and we'll retain your data, workflows, and user roles. If downgrading, we'll help realign features to the lower tier without disrupting your core processes.",
    },
    {
      question: "What kind of hosting and domain do I get?",
      answer: "Essential and Professional run on a secure shared server with a dedicated domain configured for your business. Enterprise includes a dedicated server and dedicated domain for maximum performance, isolation, and compliance flexibility.",
    },
    {
      question: "How long does implementation take?",
      answer: "Typical implementations range from 2–6 weeks depending on scope, data migration needs, and the number of modules. We provide a project plan covering discovery, configuration, pilot testing, user training, and go-live support so there are no surprises.",
    },
    // {
    //   question: "What support is included after go-live?",
    //   answer: "All plans include ongoing updates, performance monitoring, and access to our support team. Professional receives priority email and chat support, while Enterprise adds 24/7 phone support and a dedicated account manager for proactive guidance and quarterly optimization reviews.",
    // },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero text-foreground">
      <Navbar />

      <main className="max-w-6xl mx-auto pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Simple, Transparent{" "}
            <span className="bg-gradient-to-r py-1 from-[#06069b] to-[#0d6bf8]  bg-clip-text text-transparent">
              Pricing
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Choose the plan that best fits your business needs. Unlock the full potential of Fluxdevs ERP with flexible pricing designed for manufacturers.
          </p>
        </header>

        {/* Plans grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {plans.map((plan, index) => (
            <div className={`relative bg-gradient-card p-8 rounded-2xl shadow-card hover:shadow-glow transition-all duration-300 border ${
                plan.highlighted 
                  ? "border-primary shadow-glow scale-105" 
                  : "border-border hover:border-primary/50"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-primary text-primary-foreground text-sm font-semibold rounded-full shadow-glow">
                  Most Popular
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold bg-gradient-to-r py-1 from-[#316079] to-[#0d6bf8]  bg-clip-text text-transparent mb-4">
                  {plan.price}
                </div>
                <p className="text-muted-foreground">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.highlighted ? "primary" : "outline"}
                className="w-full"
                onClick={() => navigate("/contact")}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </section>

        {/* CTA Section */}
        <div className="text-center mb-20">
          <h3 className="text-2xl font-bold mb-4">Not Sure Which Plan is Right for You?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Contact our team for a personalized demo or consultation to find the perfect fit.
          </p>
          <Button
            variant="hero"
            onClick={() => navigate("/contact")}
            className="px-8 py-3"
          >
            Contact Us
          </Button>
          <hr className="mt-8 border-t border-border max-w-4xl mx-auto" />
        </div>
        {/* FAQs */}
        <div className="md:mb-10">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4 ">
              Frequently Asked Questions
            </h3>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Everything you need to know about plans, implementation, hosting, and ongoing support before you get started.
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
      </main>

      {/* Final CTA */}
      <section className="py-12 bg-gradient-primary text-primary-foreground">
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
                onClick={() => navigate("/about")}
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

export default Pricing;