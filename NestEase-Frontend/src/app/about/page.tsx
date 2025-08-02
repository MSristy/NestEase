'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { FaUsers, FaHome, FaTools, FaExchangeAlt, FaRocket, FaHeart, FaShieldAlt, FaLeaf } from 'react-icons/fa';

interface Stats {
  users: {
    total: number;
    active: number;
  };
  properties: {
    total: number;
    verified: number;
  };
  serviceProviders: {
    total: number;
    verified: number;
  };
  barterItems: {
    addSwapItems: number;
    sellProducts: number;
    itemOffers: number;
    total: number;
  };
}

export default function AboutPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:3001/public/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const teamMembers = [
    {
      name: "Tareq Monour",
      role: "Founder & CEO",
      image: "/1.jpg",
      bio: "Visionary leader with 10+ years in tech entrepreneurship"
    },
    {
      name: "Mosharraf Hosen",
      role: "Co-Founder & CTO",
      image: "/2.jpg",
      bio: "Tech expert specializing in scalable architecture"
    },
    {
      name: "Mahmuda Akter Sristy",
      role: "Head of Design",
      image: "/3.jpg",
      bio: "Creative designer focused on user experience excellence"
    },
    {
      name: "Al Mahmuz Chowdhury",
      role: "Head of Operations",
      image: "/4.jpg",
      bio: "Operations specialist ensuring smooth platform delivery"
    }
  ];

  const values = [
    {
      icon: FaShieldAlt,
      title: "Trust & Security",
      description: "We prioritize the safety and security of our community members"
    },
    {
      icon: FaRocket,
      title: "Innovation",
      description: "Continuously evolving to meet the changing needs of urban living"
    },
    {
      icon: FaLeaf,
      title: "Sustainability",
      description: "Promoting eco-friendly practices through our Swap & Save feature"
    },
    {
      icon: FaHeart,
      title: "Community",
      description: "Building strong connections between neighbors and service providers"
    }
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K+`;
    }
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[500px] bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 h-full flex items-center relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              About <span className="text-blue-200">NestEase</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              Revolutionizing urban living in Dhaka through innovative home solutions that connect communities and simplify life
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                <span className="text-white font-semibold">🏠 Property Solutions</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                <span className="text-white font-semibold">🔧 Home Services</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                <span className="text-white font-semibold">♻️ Swap & Save</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Our Story</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              NestEase was born from a simple observation: urban living in Dhaka is challenging. 
              We saw the struggles of finding verified properties, reliable home services, 
              and sustainable ways to manage household items. Our platform brings together 
              these essential services under one roof, making urban living easier and more 
              sustainable.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-border">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-6">
                <FaRocket className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-card-foreground mb-4">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To simplify urban living by providing verified, reliable, and sustainable 
                home solutions for everyone in Dhaka, creating a connected community where 
                everyone can thrive.
              </p>
            </div>
            <div className="bg-card p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-border">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6">
                <FaHome className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-card-foreground mb-4">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                To become the go-to platform for all home-related needs, creating a 
                community of trust and sustainability that transforms how people live 
                and interact in urban environments.
              </p>
            </div>
            <div className="bg-card p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-border">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-6">
                <FaHeart className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-card-foreground mb-4">Our Values</h3>
              <p className="text-muted-foreground leading-relaxed">
                Trust, Innovation, Sustainability, and Community are at the heart of 
                everything we do. We believe in building lasting relationships and 
                creating positive impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-foreground mb-16">What Drives Us</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 bg-card rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 border border-border">
                  <value.icon className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-card-foreground mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-foreground mb-16">Meet Our Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-card p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-border group">
                <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden ring-4 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-card-foreground mb-2">{member.name}</h3>
                  <p className="text-primary font-semibold mb-3">{member.role}</p>
                  <p className="text-muted-foreground text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-white mb-16">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl text-center border border-white/20">
              <FaUsers className="w-12 h-12 text-white mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-white mb-2">
                {loading ? '...' : formatNumber(stats?.users?.total || 0)}
              </h3>
              <p className="text-white/90 font-semibold">Active Users</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl text-center border border-white/20">
              <FaHome className="w-12 h-12 text-white mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-white mb-2">
                {loading ? '...' : formatNumber(stats?.properties?.verified || 0)}
              </h3>
              <p className="text-white/90 font-semibold">Verified Properties</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl text-center border border-white/20">
              <FaTools className="w-12 h-12 text-white mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-white mb-2">
                {loading ? '...' : formatNumber(stats?.serviceProviders?.total || 0)}
              </h3>
              <p className="text-white/90 font-semibold">Service Professionals</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl text-center border border-white/20">
              <FaExchangeAlt className="w-12 h-12 text-white mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-white mb-2">
                {loading ? '...' : formatNumber(stats?.barterItems?.total || 0)}
              </h3>
              <p className="text-white/90 font-semibold">Barter Items</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 