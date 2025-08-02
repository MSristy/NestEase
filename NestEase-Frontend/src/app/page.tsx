'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Wrench, RefreshCw, Users, CheckCircle, ArrowRight, Search } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 dark:from-blue-900 dark:via-purple-900 dark:to-indigo-900 text-white py-32">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 text-center lg:text-left">
              <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                Your Unified
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                  Home Solutions
                </span>
                Platform
              </h1>
              <p className="text-xl lg:text-2xl mb-8 text-blue-100 dark:text-blue-200 leading-relaxed">
                Find verified properties, book reliable home services, and swap items all in one place. 
                Simplifying urban living in Dhaka with cutting-edge technology.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                  <Link href="/property">
                    <Search className="w-5 h-5 mr-2" />
                    Find Properties
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4 rounded-xl font-semibold transition-all duration-300">
                  <Link href="/auth/signup">
                    Get Started Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>No Hidden Fees</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Verified Listings</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2">
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white/20 rounded-2xl p-6 text-center">
                      <Home className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
                      <h3 className="font-semibold mb-2">Properties</h3>
                      <p className="text-sm text-blue-100">350+ Verified</p>
                    </div>
                    <div className="bg-white/20 rounded-2xl p-6 text-center">
                      <Wrench className="w-12 h-12 mx-auto mb-4 text-green-400" />
                      <h3 className="font-semibold mb-2">Services</h3>
                      <p className="text-sm text-blue-100">120+ Providers</p>
                    </div>
                    <div className="bg-white/20 rounded-2xl p-6 text-center">
                      <RefreshCw className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                      <h3 className="font-semibold mb-2">Swaps</h3>
                      <p className="text-sm text-blue-100">850+ Successful</p>
                    </div>
                    <div className="bg-white/20 rounded-2xl p-6 text-center">
                      <Users className="w-12 h-12 mx-auto mb-4 text-orange-400" />
                      <h3 className="font-semibold mb-2">Users</h3>
                      <p className="text-sm text-blue-100">650+ Happy</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="text-blue-600 dark:text-blue-400 mx-auto mb-4 flex justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  650+
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-medium">
                  Happy Users
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="text-blue-600 dark:text-blue-400 mx-auto mb-4 flex justify-center">
                  <Home className="w-6 h-6" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  350+
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-medium">
                  Properties Listed
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="text-blue-600 dark:text-blue-400 mx-auto mb-4 flex justify-center">
                  <Wrench className="w-6 h-6" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  120+
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-medium">
                  Service Providers
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="text-blue-600 dark:text-blue-400 mx-auto mb-4 flex justify-center">
                  <RefreshCw className="w-6 h-6" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  850+
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-medium">
                  Successful Swaps
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-foreground">
              Everything You Need for
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Your Home
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From finding your dream home to maintaining it, we've got you covered with our comprehensive platform
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="group relative">
              <div className="bg-card rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-border group-hover:border-blue-200 dark:group-hover:border-blue-800">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Home className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">Property Rental</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">Find verified properties with smart search filters and secure rental agreements</p>
                <Button asChild variant="ghost" className="group-hover:text-blue-600 p-0 h-auto font-semibold">
                  <Link href="/property" className="flex items-center">
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="group relative">
              <div className="bg-card rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-border group-hover:border-green-200 dark:group-hover:border-green-800">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Wrench className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">Home Services</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">Book reliable professionals with live tracking and instant pricing</p>
                <Button asChild variant="ghost" className="group-hover:text-green-600 p-0 h-auto font-semibold">
                  <Link href="/services" className="flex items-center">
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="group relative">
              <div className="bg-card rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-border group-hover:border-purple-200 dark:group-hover:border-purple-800">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                  <RefreshCw className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">Swap & Save</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">Exchange items with our digital barter system and save money</p>
                <Button asChild variant="ghost" className="group-hover:text-purple-600 p-0 h-auto font-semibold">
                  <Link href="/barter" className="flex items-center">
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-900 dark:to-purple-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to Transform Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
              Home Experience?
            </span>
          </h2>
          <p className="text-xl mb-8 text-blue-100 dark:text-blue-200 max-w-3xl mx-auto">
            Join dozens of satisfied users who have simplified their home life with NestEase. 
            Start your journey today and discover the difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
              <Link href="/auth/signup">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4 rounded-xl font-semibold transition-all duration-300">
              <Link href="/property">
                <Search className="w-5 h-5 mr-2" />
                Explore Properties
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
