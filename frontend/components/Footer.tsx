'use client';

import Link from 'next/link';
import Image from 'next/image';
import { getWhatsAppLink } from '@/lib/whatsapp';

export default function Footer() {
  const whatsappLink = getWhatsAppLink('Hello, I want to book a service.');
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+1 (215) 617-8614';
  const adminEmail = 'purityfamilyservicextonpa@yahoo.com';

  return (
    <footer className="bg-gray-900 dark:bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative w-16 h-16 md:w-20 md:h-20">
                <Image
                  src="/logo.jpg"
                  alt="Purity Family Services Logo"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 64px, 80px"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold" style={{ fontFamily: 'cursive' }}>Purity</span>
                <span className="text-xs text-gray-400 -mt-1">FAMILY SERVICES</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Professional home care services delivering excellence in compassionate, quality care for your loved ones.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="/#services" className="hover:text-white transition">
                  Companion Care
                </Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-white transition">
                  Personal Care
                </Link>
              </li>
              <li>
                <Link href="/#services" className="hover:text-white transition">
                  Specialized Care
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="/#why-us" className="hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/#process" className="hover:text-white transition">
                  Our Process
                </Link>
              </li>
              <li>
                <Link href="/#reviews" className="hover:text-white transition">
                  Reviews
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Phone: {phoneNumber}</li>
              <li>Email: <a href={`mailto:${adminEmail}`} className="hover:text-white transition">{adminEmail}</a></li>
              <li>Available 24/7</li>
              <li>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 hover:text-green-300 transition"
                >
                  Chat on WhatsApp →
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>© 2026 Purity Care Services. All rights reserved.</p>
          <p className="mt-2">HIPAA Compliant • Privacy Policy</p>
        </div>
      </div>
    </footer>
  );
}

