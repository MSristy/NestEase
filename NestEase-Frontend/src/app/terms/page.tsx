'use client';

import { FaFileContract, FaUserCheck, FaHome, FaTools, FaExchangeAlt, FaCreditCard, FaBan, FaExclamationTriangle, FaEnvelope } from 'react-icons/fa';

export default function TermsOfServicePage() {
  const sections = [
    {
      icon: FaFileContract,
      title: "Acceptance of Terms",
      description: "By accessing or using NestEase, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access our services."
    },
    {
      icon: FaHome,
      title: "Description of Service",
      description: "NestEase provides a platform for property rental, home services, and item swapping in Dhaka. We connect users with verified properties, service professionals, and facilitate item exchanges."
    },
    {
      icon: FaUserCheck,
      title: "User Accounts",
      content: [
        {
          subtitle: "Registration",
          items: [
            "You must be at least 18 years old to create an account",
            "You must provide accurate and complete information",
            "You are responsible for maintaining the security of your account",
            "You must notify us immediately of any unauthorized use"
          ]
        },
        {
          subtitle: "Account Termination",
          description: "We reserve the right to terminate or suspend accounts that violate these terms or engage in fraudulent activities."
        }
      ]
    },
    {
      icon: FaHome,
      title: "Property Listings",
      items: [
        "All property listings must be accurate and up-to-date",
        "Property owners must verify their identity and property documents",
        "Misrepresentation of properties is strictly prohibited",
        "We reserve the right to remove any listing that violates our policies"
      ]
    },
    {
      icon: FaTools,
      title: "Home Services",
      items: [
        "Service providers must be verified and qualified",
        "All services must be performed professionally and safely",
        "Service providers are responsible for their own insurance and licenses",
        "We are not liable for the quality of services provided"
      ]
    },
    {
      icon: FaExchangeAlt,
      title: "Swap & Save",
      items: [
        "Items must be accurately described",
        "Users must be honest about item conditions",
        "No illegal or prohibited items may be listed",
        "We are not responsible for the quality of swapped items"
      ]
    },
    {
      icon: FaCreditCard,
      title: "Payments and Fees",
      items: [
        "We charge a commission on successful property rentals and service bookings",
        "All fees are clearly stated before transactions",
        "Refunds are subject to our refund policy",
        "We use secure payment processors for all transactions"
      ]
    },
    {
      icon: FaBan,
      title: "Prohibited Activities",
      items: [
        "Fraudulent or misleading listings",
        "Harassment or discrimination",
        "Violation of intellectual property rights",
        "Unauthorized access to our systems",
        "Spamming or automated data collection"
      ]
    },
    {
      icon: FaExclamationTriangle,
      title: "Limitation of Liability",
      description: "NestEase is not liable for any direct, indirect, incidental, or consequential damages resulting from the use of our platform."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[400px] bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-6">
                <FaFileContract className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-2 leading-tight">
                  Terms of Service
                </h1>
                <p className="text-xl text-white/90">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
            <p className="text-xl text-white/90 leading-relaxed">
              These terms govern your use of NestEase and outline the rules and guidelines for using our platform. 
              Please read them carefully before using our services.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            {sections.map((section, index) => (
              <div key={index} className="bg-card rounded-xl shadow-lg border border-border overflow-hidden">
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 border-b border-border">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                      <section.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-card-foreground">{section.title}</h2>
                  </div>
                </div>
                
                <div className="p-8">
                  {section.description && (
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {section.description}
                    </p>
                  )}
                  
                  {section.content ? (
                    <div className="space-y-6">
                      {section.content.map((content, contentIndex) => (
                        <div key={contentIndex}>
                          <h3 className="text-xl font-semibold text-card-foreground mb-4">
                            {content.subtitle}
                          </h3>
                          {content.description && (
                            <p className="text-muted-foreground leading-relaxed mb-4">
                              {content.description}
                            </p>
                          )}
                          {content.items && (
                            <ul className="space-y-2">
                              {content.items.map((item, itemIndex) => (
                                <li key={itemIndex} className="flex items-start">
                                  <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                  <span className="text-muted-foreground">{item}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : section.items ? (
                    <ul className="space-y-3">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            ))}

            {/* Changes to Terms Section */}
            <div className="bg-card rounded-xl shadow-lg border border-border overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500/10 to-orange-500/5 p-6 border-b border-border">
                <h2 className="text-2xl font-bold text-card-foreground">Changes to Terms</h2>
              </div>
              <div className="p-8">
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to modify these terms at any time. Continued use of our services after 
                  changes constitutes acceptance of the new terms. We will notify users of significant changes 
                  through our platform or email notifications.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-12 text-white text-center">
              <FaEnvelope className="w-16 h-16 mx-auto mb-6 text-blue-200" />
              <h2 className="text-3xl font-bold mb-4">Contact Information</h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                For questions about these Terms of Service or any legal matters, 
                please contact our legal team.
              </p>
              <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                  <h3 className="font-semibold mb-2">Email</h3>
                  <p className="text-white/90">legal@nestease.com</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                  <h3 className="font-semibold mb-2">Address</h3>
                  <p className="text-white/90">123 Main Street, Dhaka, Bangladesh</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 