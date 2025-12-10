'use client';

import { useState } from 'react';
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaClock, FaPaperPlane, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'sonner';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact-messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const result = await response.json();
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setIsSubmitted(true);
      
      // Reset form
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: '', email: '', subject: '', message: '' });
      }, 3000);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[400px] bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Get in <span className="text-blue-200">Touch</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              We're here to help and answer any questions you might have. 
              Let's start a conversation and make your urban living experience better.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="bg-card p-8 rounded-xl shadow-lg border border-border">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                  <FaPaperPlane className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-card-foreground">Send us a message</h2>
                  <p className="text-muted-foreground">We'll get back to you within 24 hours</p>
                </div>
              </div>

              {isSubmitted ? (
                <div className="text-center py-12">
                  <FaCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-card-foreground mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground">Thank you for contacting us. We'll respond soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-card-foreground mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground transition-colors"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-card-foreground mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        required
                        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-card-foreground mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                      required
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground transition-colors"
                      placeholder="What's this about?"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-card-foreground mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      required
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-background text-foreground transition-colors resize-none"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary text-primary-foreground py-4 px-6 rounded-lg hover:bg-primary/90 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="mr-2" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-card-foreground mb-8">Contact Information</h2>
              <div className="space-y-8">
                <div className="flex items-start group">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 text-blue-600 dark:text-blue-400">
                      <FaMapMarkerAlt className="w-7 h-7" />
                    </div>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-bold text-card-foreground mb-3">Visit Us</h3>
                    <div className="space-y-1">
                      <p className="text-muted-foreground leading-relaxed">123 Main Street</p>
                      <p className="text-muted-foreground leading-relaxed">Dhaka, Bangladesh</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 text-green-600 dark:text-green-400">
                      <FaEnvelope className="w-7 h-7" />
                    </div>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-bold text-card-foreground mb-3">Email Us</h3>
                    <div className="space-y-1">
                      <p className="text-muted-foreground leading-relaxed">info@nestease.com</p>
                      <p className="text-muted-foreground leading-relaxed">support@nestease.com</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 text-purple-600 dark:text-purple-400">
                      <FaPhone className="w-7 h-7" />
                    </div>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-bold text-card-foreground mb-3">Call Us</h3>
                    <div className="space-y-1">
                      <p className="text-muted-foreground leading-relaxed">+880 1700 000000</p>
                      <p className="text-muted-foreground leading-relaxed">+880 1800 000000</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 text-orange-600 dark:text-orange-400">
                      <FaClock className="w-7 h-7" />
                    </div>
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-bold text-card-foreground mb-3">Business Hours</h3>
                    <div className="space-y-1">
                      <p className="text-muted-foreground leading-relaxed">Monday - Friday: 9:00 AM - 6:00 PM</p>
                      <p className="text-muted-foreground leading-relaxed">Saturday: 10:00 AM - 4:00 PM</p>
                      <p className="text-muted-foreground leading-relaxed">Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-12 bg-muted/30 p-8 rounded-xl border border-border">
                <h3 className="text-xl font-bold text-card-foreground mb-4">Need Immediate Help?</h3>
                <p className="text-muted-foreground mb-4">
                  For urgent matters or technical support, please call our 24/7 helpline:
                </p>
                <div className="flex items-center">
                  <FaPhone className="w-5 h-5 text-primary mr-3" />
                  <span className="text-lg font-semibold text-card-foreground">+880 1700 000000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
