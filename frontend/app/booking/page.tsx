'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { MessageCircle, MessageSquare } from 'lucide-react';
import { getWhatsAppLink } from '@/lib/whatsapp';

export default function BookingPage() {
  const whatsappLink = getWhatsAppLink('Hello, I want to book a service.');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
            Start Your Booking
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            To ensure you receive the most personalized care, all our bookings are managed through a direct conversation with our family support specialists. Choose your preferred way to chat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Book on App */}
          <div className="bg-white rounded-2xl shadow-xl p-10 hover:shadow-2xl transition-all duration-300 border border-gray-100 group">
            <div className="flex items-center justify-between mb-8">
              <div className="w-20 h-20 bg-teal-50 rounded-2xl flex items-center justify-center group-hover:bg-teal-100 transition-colors shadow-lg">
                <MessageCircle className="w-10 h-10 text-teal-600" />
              </div>
              <span className="text-gray-300 text-2xl">→</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Book on App</h2>
            <p className="text-gray-600 mb-8 leading-relaxed text-lg">
              Chat with our team right here in your browser. Fast, secure, and no external apps required.
            </p>
            <Link
              href="/chat"
              className="block w-full bg-teal-600 text-white text-center py-4 rounded-xl font-semibold hover:bg-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Open In-App Chat
            </Link>
          </div>

          {/* Book on WhatsApp */}
          <div className="bg-white rounded-2xl shadow-xl p-10 hover:shadow-2xl transition-all duration-300 border border-gray-100 group">
            <div className="flex items-center justify-between mb-8">
              <div className="w-20 h-20 bg-green-50 rounded-2xl flex items-center justify-center group-hover:bg-green-100 transition-colors shadow-lg">
                <MessageSquare className="w-10 h-10 text-green-600" />
              </div>
              <span className="text-gray-300 text-2xl">↗</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Book on WhatsApp</h2>
            <p className="text-gray-600 mb-8 leading-relaxed text-lg">
              Message us directly on WhatsApp. Perfect for booking while you're on the go.
            </p>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-green-500 text-white text-center py-4 rounded-xl font-semibold hover:bg-green-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Continue to WhatsApp
            </a>
          </div>
        </div>

        {/* Service Assurances */}
        <div className="mt-16 pt-12 border-t border-gray-200 flex flex-wrap justify-center gap-10 text-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🛡️</span>
            </div>
            <span className="text-gray-700 font-semibold">SECURE BOOKING</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">➕</span>
            </div>
            <span className="text-gray-700 font-semibold">CERTIFIED CAREGIVERS</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🎧</span>
            </div>
            <span className="text-gray-700 font-semibold">24/7 SUPPORT</span>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

