'use client';

import { FaCookieBite, FaCog, FaChartBar, FaUserCog, FaAd, FaBrowser, FaEnvelope } from 'react-icons/fa';

export default function CookiePolicyPage() {
  const cookieTypes = [
    {
      icon: FaCog,
      title: "Essential Cookies",
      description: "These cookies are necessary for the website to function properly. They enable basic functions like page navigation and access to secure areas of the website.",
      color: "blue"
    },
    {
      icon: FaChartBar,
      title: "Performance Cookies",
      description: "These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.",
      color: "green"
    },
    {
      icon: FaUserCog,
      title: "Functionality Cookies",
      description: "These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers.",
      color: "purple"
    },
    {
      icon: FaAd,
      title: "Targeting Cookies",
      description: "These cookies may be set through our site by our advertising partners. They may be used to build a profile of your interests and show you relevant advertisements.",
      color: "orange"
    }
  ];

  const thirdPartyServices = [
    "Google Analytics for website analytics",
    "Facebook Pixel for advertising",
    "Payment processors for transaction security",
    "Social media platforms for sharing features"
  ];

  const browserInstructions = [
    {
      name: "Google Chrome",
      instructions: "Settings → Privacy and security → Cookies and other site data"
    },
    {
      name: "Mozilla Firefox",
      instructions: "Options → Privacy & Security → Cookies and Site Data"
    },
    {
      name: "Microsoft Edge",
      instructions: "Settings → Cookies and site permissions → Cookies and site data"
    },
    {
      name: "Safari",
      instructions: "Preferences → Privacy → Cookies and website data"
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: string } = {
      blue: "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400",
      green: "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400",
      purple: "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400",
      orange: "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400"
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[400px] bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-6">
                <FaCookieBite className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-2 leading-tight">
                  Cookie Policy
                </h1>
                <p className="text-xl text-white/90">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
            <p className="text-xl text-white/90 leading-relaxed">
              Learn about how we use cookies and similar technologies to enhance your experience 
              on our platform and how you can manage your cookie preferences.
            </p>
          </div>
        </div>
      </section>

      {/* What Are Cookies Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card p-8 rounded-xl shadow-lg border border-border">
              <h2 className="text-3xl font-bold text-card-foreground mb-6">What Are Cookies</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
                They are widely used to make websites work more efficiently and provide useful information to the website owners. 
                Cookies help us provide you with a better experience by remembering your preferences and analyzing how you use our site.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How We Use Cookies Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card p-8 rounded-xl shadow-lg border border-border mb-12">
              <h2 className="text-3xl font-bold text-card-foreground mb-6">How We Use Cookies</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                We use cookies for the following purposes:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "To remember your preferences and settings",
                  "To improve website performance",
                  "To analyze how you use our website",
                  "To personalize your experience",
                  "To enable certain features and functionality",
                  "To provide secure authentication"
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Types of Cookies */}
            <h2 className="text-3xl font-bold text-card-foreground mb-8 text-center">Types of Cookies We Use</h2>
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {cookieTypes.map((type, index) => (
                <div key={index} className="bg-card p-6 rounded-xl shadow-lg border border-border">
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${getColorClasses(type.color)}`}>
                      <type.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-card-foreground">{type.title}</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {type.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Third-Party Cookies */}
            <div className="bg-card p-8 rounded-xl shadow-lg border border-border mb-12">
              <h2 className="text-3xl font-bold text-card-foreground mb-6">Third-Party Cookies</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                We use cookies from the following third-party services:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {thirdPartyServices.map((service, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-muted-foreground">{service}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Managing Cookies */}
            <div className="bg-card p-8 rounded-xl shadow-lg border border-border mb-12">
              <h2 className="text-3xl font-bold text-card-foreground mb-6">Managing Cookies</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                You can control and/or delete cookies as you wish. You can:
              </p>
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                {[
                  "Delete all cookies that are already on your computer",
                  "Set your browser to prevent cookies from being set",
                  "Use browser settings to manage cookie preferences"
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>

              {/* Browser Instructions */}
              <h3 className="text-2xl font-bold text-card-foreground mb-6">Browser-Specific Instructions</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {browserInstructions.map((browser, index) => (
                  <div key={index} className="bg-muted/30 p-4 rounded-lg">
                    <h4 className="font-semibold text-card-foreground mb-2">{browser.name}</h4>
                    <p className="text-muted-foreground text-sm">{browser.instructions}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Changes to Policy */}
            <div className="bg-card p-8 rounded-xl shadow-lg border border-border">
              <h2 className="text-3xl font-bold text-card-foreground mb-6">Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Cookie Policy from time to time. We will notify you of any changes by 
                posting the new policy on this page and updating the "Last updated" date. We encourage you 
                to review this policy periodically to stay informed about how we use cookies.
              </p>
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
                If you have any questions about our use of cookies or this Cookie Policy, 
                please don't hesitate to contact us.
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