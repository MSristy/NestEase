'use client';

import { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaSearch, FaQuestionCircle, FaHeadset } from 'react-icons/fa';

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const faqCategories = [
    {
      title: "Property Rentals",
      icon: "🏠",
      faqs: [
        {
          question: "How do I list my property for rent?",
          answer: "To list your property, create an account, verify your identity, and click 'List Property' in your dashboard. You'll need to provide property details, photos, and required documents for verification. Our team will review and approve your listing within 24-48 hours."
        },
        {
          question: "How does the property verification process work?",
          answer: "We verify properties through a multi-step process including document verification, property inspection, and owner verification. This ensures all listings are legitimate and protects both landlords and tenants. Our verification team conducts thorough background checks and property visits."
        },
        {
          question: "What documents do I need to rent a property?",
          answer: "You'll typically need your national ID, proof of income, employment letter, and references. Some landlords may also require a security deposit and advance rent. We help facilitate the document verification process to make it smooth for both parties."
        }
      ]
    },
    {
      title: "Home Services",
      icon: "🔧",
      faqs: [
        {
          question: "What types of home services are available?",
          answer: "We offer a comprehensive range of home services including cleaning, plumbing, electrical work, painting, carpentry, gardening, moving, security, and maintenance. All service providers are verified professionals with ratings and reviews from previous customers."
        },
        {
          question: "How do I book a service provider?",
          answer: "Browse our service providers, select one that matches your needs, choose your preferred date and time, and complete the booking. You can pay online or in cash after service completion. All bookings are confirmed within 2 hours."
        },
        {
          question: "What if I'm not satisfied with the service?",
          answer: "We have a satisfaction guarantee. If you're not happy with the service, contact us within 24 hours and we'll work with the provider to resolve the issue or provide a refund. Your satisfaction is our priority."
        }
      ]
    },
    {
      title: "Swap & Save",
      icon: "♻️",
      faqs: [
        {
          question: "How does the Swap & Save feature work?",
          answer: "Swap & Save allows you to exchange items with other users. List your items, browse others' listings, and use our point-based system to make fair trades. No money is exchanged, making it an eco-friendly way to get what you need while reducing waste."
        },
        {
          question: "How do I determine the value of my items?",
          answer: "Our system uses a combination of factors including item condition, market value, and user ratings to assign points. You can also negotiate with other users to reach a fair exchange agreement. Our community guidelines help ensure fair trades."
        },
        {
          question: "Is it safe to trade with other users?",
          answer: "Yes, we have several safety measures in place. All users are verified, we have a rating system, and we provide secure meeting locations. We also offer dispute resolution services if any issues arise during trades."
        }
      ]
    },
    {
      title: "Payments & Billing",
      icon: "💳",
      faqs: [
        {
          question: "Is there a fee for using NestEase?",
          answer: "Basic features are free to use. We charge a small commission on successful property rentals and service bookings. The Swap & Save feature is completely free to use. We're transparent about all fees and they're clearly displayed before any transaction."
        },
        {
          question: "What payment methods are accepted?",
          answer: "We accept all major credit/debit cards, mobile banking (bKash, Nagad, Rocket), and digital wallets. For property rentals, we also support bank transfers and cash payments. All online payments are secured with SSL encryption."
        },
        {
          question: "How do I get a refund?",
          answer: "Refunds are processed within 3-5 business days depending on your payment method. For service cancellations, refunds are issued according to our cancellation policy. Contact our support team for assistance with any refund requests."
        }
      ]
    }
  ];

  const toggleItem = (index: number) => {
    setExpandedItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[400px] bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Frequently Asked <span className="text-blue-200">Questions</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              Find answers to common questions about NestEase and get the help you need
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder-muted-foreground"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {searchQuery && (
            <div className="mb-8 text-center">
              <p className="text-muted-foreground">
                Found {filteredCategories.reduce((acc, cat) => acc + cat.faqs.length, 0)} results for "{searchQuery}"
              </p>
            </div>
          )}

          <div className="max-w-4xl mx-auto space-y-12">
            {filteredCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-card rounded-xl shadow-lg border border-border overflow-hidden">
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 border-b border-border">
                  <div className="flex items-center">
                    <span className="text-3xl mr-4">{category.icon}</span>
                    <h2 className="text-2xl font-bold text-card-foreground">{category.title}</h2>
                  </div>
                </div>
                
                <div className="divide-y divide-border">
                  {category.faqs.map((faq, faqIndex) => {
                    const globalIndex = categoryIndex * 100 + faqIndex;
                    const isExpanded = expandedItems.includes(globalIndex);
                    
                    return (
                      <div key={faqIndex} className="p-6">
                        <button
                          onClick={() => toggleItem(globalIndex)}
                          className="w-full flex items-center justify-between text-left group"
                        >
                          <h3 className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors pr-4">
                            {faq.question}
                          </h3>
                          <div className="flex-shrink-0">
                            {isExpanded ? (
                              <FaChevronUp className="w-5 h-5 text-primary" />
                            ) : (
                              <FaChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                            )}
                          </div>
                        </button>
                        
                        {isExpanded && (
                          <div className="mt-4 pl-4 border-l-2 border-primary/20">
                            <p className="text-muted-foreground leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Still Have Questions */}
          <div className="mt-20 text-center">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-12 text-white">
              <FaQuestionCircle className="w-16 h-16 mx-auto mb-6 text-blue-200" />
              <h2 className="text-3xl font-bold mb-4">
                Still have questions?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Can't find the answer you're looking for? Our support team is here to help you 24/7.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="bg-white text-blue-600 py-3 px-8 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center"
                >
                  <FaHeadset className="mr-2" />
                  Contact Support
                </a>
                <a
                  href="tel:+8801700000000"
                  className="bg-blue-500 text-white py-3 px-8 rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center"
                >
                  Call Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
