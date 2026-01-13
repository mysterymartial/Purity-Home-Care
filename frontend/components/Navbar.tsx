'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-16 h-16 md:w-20 md:h-20 group-hover:scale-105 transition-transform">
              <Image
                src="/logo.jpeg"
                alt="Purity Family Services Logo"
                fill
                className="object-contain"
                priority
                sizes="(max-width: 768px) 64px, 80px"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-bold text-teal-600 group-hover:text-teal-700 transition-colors" style={{ fontFamily: 'cursive' }}>Purity</span>
              <span className="text-xs text-gray-600 -mt-1 font-medium">FAMILY SERVICES</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-10">
            <Link href="/#services" className="text-gray-700 hover:text-teal-600 transition-colors font-medium text-sm">
              Services
            </Link>
            <Link href="/#why-us" className="text-gray-700 hover:text-teal-600 transition-colors font-medium text-sm">
              Why Us
            </Link>
            <Link href="/#process" className="text-gray-700 hover:text-teal-600 transition-colors font-medium text-sm">
              Our Process
            </Link>
            <Link href="/#reviews" className="text-gray-700 hover:text-teal-600 transition-colors font-medium text-sm">
              Patient Reviews
            </Link>
            <Link
              href="/booking"
              className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-all duration-200 shadow-md hover:shadow-lg font-semibold"
            >
              Schedule Consultation
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link
              href="/#services"
              className="block text-gray-700 hover:text-teal-600"
              onClick={() => setIsOpen(false)}
            >
              Services
            </Link>
            <Link
              href="/#why-us"
              className="block text-gray-700 hover:text-teal-600"
              onClick={() => setIsOpen(false)}
            >
              Why Us
            </Link>
            <Link
              href="/#process"
              className="block text-gray-700 hover:text-teal-600"
              onClick={() => setIsOpen(false)}
            >
              Our Process
            </Link>
            <Link
              href="/#reviews"
              className="block text-gray-700 hover:text-teal-600"
              onClick={() => setIsOpen(false)}
            >
              Patient Reviews
            </Link>
            <Link
              href="/booking"
              className="block bg-teal-600 text-white px-6 py-2 rounded-lg text-center hover:bg-teal-700 transition"
              onClick={() => setIsOpen(false)}
            >
              Schedule Consultation
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

