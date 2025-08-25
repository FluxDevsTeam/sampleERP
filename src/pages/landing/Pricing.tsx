import React from "react";
import Navbar from "./Navbar";
// Removed unused rsuite Button to keep styling consistent
import Footer from "./Footer";
import { motion } from "framer-motion";
import Button from "@/components/Button";

const Pricing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900 transition-colors duration-300">
      <Navbar />

      <main className="max-w-6xl mx-auto py-20 px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <header className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl text-slate-800 font-extrabold tracking-tight leading-tight">
            Simple, Transparent <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Pricing</span>
          </h2>
          <p className="mt-4 text-lg text-slate-700 max-w-3xl mx-auto">
            Choose the plan that best fits your business needs. Unlock the full potential of FluxDevs ERP with flexible pricing designed for manufacturers.
          </p>
        </header>

        {/* Plans grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Basic",
              price: "₦1.2m",
              description: "Essential tools for small manufacturers and workshops.",
              features: [
                "Project & Product Management",
                "Basic Inventory Tracking",
                "Payroll for up to 10 employees",
                "Email Support",
              ],
              cta: "Contact Sales",
              highlighted: false,
            },
            {
              name: "Pro",
              price: "₦1.9m",
              description: "Ideal for growing manufacturers with advanced needs.",
              features: [
                "All Basic Features",
                "Advanced Inventory & Sales Reports",
                "Payroll for up to 50 employees",
                "Role-Based Dashboards",
                "Priority Email & Chat Support",
              ],
              cta: "Contact Sales",
              highlighted: true,
            },
            {
              name: "Enterprise",
              price: "₦3.0m",
              description: "Tailored for large-scale operations with custom requirements.",
              features: [
                "All Pro Features",
                "Unlimited Employees & Payroll",
                "Custom Integrations",
                "Dedicated Account Manager",
                "24/7 Phone & Chat Support",
              ],
              cta: "Request a Quote",
              highlighted: false,
            },
          ].map((plan, index) => (
            <div
              key={index}
              className={`relative p-8 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                plan.highlighted ? "border-2 border-indigo-600 bg-white scale-105" : "bg-white border border-slate-100"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-600 text-white text-sm font-semibold rounded-full shadow">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl text-indigo-700 font-semibold mb-2">{plan.name}</h3>
              <p className="text-3xl text-slate-800 font-bold mb-4">
                {plan.price}
                {plan.price !== "Custom" && (
                  <span className="text-base font-normal text-slate-600"> / month</span>
                )}
              </p>
              <p className="mb-6 text-slate-700">{plan.description}</p>
              <ul className="space-y-3 mb-8 text-sm">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start text-slate-700">
                    <svg
                      className="w-5 h-5 text-indigo-600 mr-2 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href={plan.cta === "Request a Quote" ? "#quote" : "#contact"}
                className="block w-full text-center bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3 rounded-lg font-medium transition-all duration-300 hover:from-indigo-500 hover:to-violet-500"
              >
                {plan.cta}
              </a>
            </div>
          ))}
  </section>

        {/* CTA Section */}
        <section className="mt-20 text-center">
          <h3 className="text-2xl text-slate-800 font-semibold mb-4">Not Sure Which Plan is Right for You?</h3>
          <p className="text-slate-700 mb-6">
            Contact our team for a personalized demo or consultation to find the perfect fit.
          </p>
          <a
            href="#demo"
            className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium rounded-lg hover:from-indigo-500 hover:to-violet-500 transition-colors duration-300"
          >
            Contact Us
          </a>
        </section>

        {/* FAQs */}
        <section className="mt-16">
          <h3 className="text-xl font-semibold text-slate-800 text-center mb-6">Frequently Asked Questions</h3>
          <div className="space-y-4 max-w-3xl mx-auto">
            {[
              {
                question: "Can I try FluxDevs ERP before purchasing?",
                answer: "Yes, we offer a free demo and trial period. Contact our sales team to get started.",
              },
              {
                question: "Are there any setup fees?",
                answer: "No, we don’t charge setup fees. Our pricing is transparent, and implementation support is included.",
              },
              {
                question: "Can I upgrade or downgrade my plan?",
                answer: "Absolutely! You can switch plans at any time to suit your business needs.",
              },
            ].map((faq, index) => (
              <details
                key={index}
                className="bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100"
              >
                <summary className="font-medium cursor-pointer text-slate-800">
                  {faq.question}
                </summary>
                <p className="mt-2 text-slate-700">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

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
                onClick={() => navigate("/about")}
              >
                Explore Features
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

  {/* Floating actions are provided globally via GlobalLayout */}
    </div>
  );
};

export default Pricing;