'use client';

import { FaShieldAlt, FaEye, FaLock, FaUserCheck, FaCog, FaEnvelope } from 'react-icons/fa';

export default function PrivacyPolicyPage() {
  const sections = [
    {
      icon: FaEye,
      title: "Information We Collect",
      content: [
        {
          subtitle: "Personal Information",
          items: [
            "Name and contact information",
            "Identification documents for verification",
            "Payment information",
            "Property details and documents",
            "Service provider credentials"
          ]
        },
        {
          subtitle: "Usage Information",
          items: [
            "IP address and device information",
            "Browser type and version",
            "Pages visited and time spent",
            "Search queries",
            "Interaction with our platform"
          ]
        }
      ]
    },
    {
      icon: FaCog,
      title: "How We Use Your Information",
      items: [
        "To provide and maintain our services",
        "To verify user identities and prevent fraud",
        "To process payments and transactions",
        "To communicate with you about our services",
        "To improve our platform and user experience",
        "To comply with legal obligations"
      ]
    },
    {
      icon: FaUserCheck,
      title: "Information Sharing",
      description: "We may share your information with:",
      items: [
        "Service providers and partners",
        "Property owners and tenants",
        "Home service professionals",
        "Legal authorities when required"
      ]
    },
    {
      icon: FaLock,
      title: "Data Security",
      description: "We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure."
    },
    {
      icon: FaShieldAlt,
      title: "Your Rights",
      items: [
        "Access your personal information",
        "Correct inaccurate information",
        "Request deletion of your information",
        "Opt-out of marketing communications",
        "Withdraw consent"
      ]
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
                <FaShieldAlt className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-2 leading-tight">
                  Privacy Policy
                </h1>
                <p className="text-xl text-white/90">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
            <p className="text-xl text-white/90 leading-relaxed">
              We are committed to protecting your privacy and ensuring the security of your personal information. 
              This policy explains how we collect, use, and safeguard your data.
            </p>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card p-8 rounded-xl shadow-lg border border-border">
              <h2 className="text-3xl font-bold text-card-foreground mb-6">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                NestEase ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains 
                how we collect, use, disclose, and safeguard your information when you use our platform. By using 
                our services, you agree to the collection and use of information in accordance with this policy.
              </p>
            </div>
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
                          <ul className="space-y-2">
                            {content.items.map((item, itemIndex) => (
                              <li key={itemIndex} className="flex items-start">
                                <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                <span className="text-muted-foreground">{item}</span>
                              </li>
                            ))}
                          </ul>
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

            {/* Additional Sections */}
            <div className="bg-card rounded-xl shadow-lg border border-border overflow-hidden">
              <div className="bg-gradient-to-r from-green-500/10 to-green-500/5 p-6 border-b border-border">
                <h2 className="text-2xl font-bold text-card-foreground">Cookies and Tracking</h2>
              </div>
              <div className="p-8">
                <p className="text-muted-foreground leading-relaxed">
                  We use cookies and similar tracking technologies to improve your experience on our platform. 
                  You can control cookie preferences through your browser settings. For more detailed information, 
                  please see our <a href="/cookies" className="text-primary hover:underline">Cookie Policy</a>.
                </p>
              </div>
            </div>

            <div className="bg-card rounded-xl shadow-lg border border-border overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500/10 to-orange-500/5 p-6 border-b border-border">
                <h2 className="text-2xl font-bold text-card-foreground">Changes to This Policy</h2>
              </div>
              <div className="p-8">
                <p className="text-muted-foreground leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by 
                  posting the new policy on this page and updating the "Last updated" date. We encourage you 
                  to review this policy periodically.
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
              <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                If you have any questions about this Privacy Policy or our data practices, 
                please don't hesitate to reach out to us.
              </p>
              <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                  <h3 className="font-semibold mb-2">Email</h3>
                  <p className="text-white/90">privacy@nestease.com</p>
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