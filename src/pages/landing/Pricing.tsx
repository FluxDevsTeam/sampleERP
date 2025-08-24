import React from "react";
import Navbar from "./Navbar";
import { Button } from "rsuite";

const Pricing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Navbar />

      <main className="max-w-6xl mx-auto py-20 px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <header className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl text-gray-500 font-extrabold tracking-tight leading-tight">
            Simple, Transparent <span className="text-indigo-600 dark:text-indigo-400">Pricing</span>
          </h2>
          <p className="mt-4 text-lg text-gray-500  dark:text-gray-700 max-w-3xl mx-auto">
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
                plan.highlighted ? "border-2 border-indigo-600 dark:border-indigo-500 bg-white dark:bg-gray-700 scale-105" : "bg-white dark:bg-gray-700"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-600 dark:bg-indigo-400 text-white text-sm font-semibold rounded-full shadow">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl text-blue-300 font-semibold mb-2">{plan.name}</h3>
              <p className="text-3xl text-gray-500 font-bold mb-4">
                {plan.price}
                {plan.price !== "Custom" && (
                  <span className="text-base font-normal text-gray-700 dark:text-gray-700"> / month</span>
                )}
              </p>
              <p className="mb-6 text-gray-700 dark:text-gray-300">{plan.description}</p>
              <ul className="space-y-3 mb-8 text-sm">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start text-gray-700 dark:text-gray-200">
                    <svg
                      className="w-5 h-5 text-indigo-500 mr-2 mt-0.5"
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
              <Button
                href={plan.cta === "Request a Quote" ? "#quote" : "#contact"} className="block w-full text-center text-blue-300 py-3 rounded-lg font-medium transition-all duration-300 bg-blue-300">
                {plan.cta}
              </Button>
            </div>
          ))}
  </section>

        {/* CTA Section */}
        <section className="mt-20 text-center">
          <h3 className="text-2xl text-gray-20 font-semibold mb-4">Not Sure Which Plan is Right for You?</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Contact our team for a personalized demo or consultation to find the perfect fit.
          </p>
          <a
            href="#demo"
            className="inline-block px-6 py-3 bg-indigo-500 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-300"
          >
            Contact Us
          </a>
        </section>

        {/* FAQs */}
        <section className="mt-16">
          <h3 className="text-xl font-semibold text-gray-700 text-center mb-6">Frequently Asked Questions</h3>
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
                className="bg-white dark:bg-gray-700 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <summary className="font-medium cursor-pointer text-gray-500 dark:text-white">
                  {faq.question}
                </summary>
                <p className="mt-2 text-gray-700 dark:text-gray-300">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

  {/* Floating actions are provided globally via GlobalLayout */}
    </div>
  );
};

export default Pricing;