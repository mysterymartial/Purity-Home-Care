'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Check, Star, Shield, Clock, Heart, Award } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getApprovedReviews, Review } from '@/lib/api';

export default function Home() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getApprovedReviews();
        setReviews(data.slice(0, 3)); // Show top 3 reviews
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-teal-600 to-teal-800 text-white py-24 md:py-36 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-black/10"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIj48cGF0aCBkPSJNMCAwaDQwdjQwSDB6IiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==')] opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="flex items-center space-x-2 mb-6">
            <Check className="w-5 h-5 text-white bg-red-500 rounded p-1" />
            <span className="bg-red-500 px-4 py-1.5 rounded-md text-xs font-bold tracking-wider uppercase">
              LICENSED & CERTIFIED CARE
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            Premium Home Care
            <br />
            <span className="text-red-400 drop-shadow-lg">You Can Trust</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-gray-50 max-w-3xl leading-relaxed font-light">
            Professional, compassionate care services for your loved ones. From companion care to specialized support, we deliver peace of mind with clinical excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/booking"
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Start Consultation →
            </Link>
            <Link
              href="/#services"
              className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/20 px-8 py-4 rounded-lg font-semibold transition-all duration-200 text-center"
            >
              Learn More
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 pt-8 border-t border-white/20">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-extrabold mb-2">2,000+</div>
              <div className="text-gray-200 text-sm font-medium">Families Served</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-extrabold mb-2">15 yrs</div>
              <div className="text-gray-200 text-sm font-medium">Experience</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-extrabold mb-2">98%</div>
              <div className="text-gray-200 text-sm font-medium">Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-extrabold mb-2">100%</div>
              <div className="text-gray-200 text-sm font-medium">Licensed Caregivers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <p className="text-sm uppercase tracking-wider text-gray-500 mb-3 font-semibold">delivered with clinical excellence and genuine compassion</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Our Care Services</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
              Comprehensive support tailored to your loved one's needs. Each service is delivered with clinical excellence and genuine compassion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Companion Care */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 group">
              <div className="h-56 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 group-hover:from-blue-100 group-hover:to-blue-300 transition-colors"></div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Companion Care</h3>
                <p className="text-gray-600 mb-5 leading-relaxed">
                  Social engagement and emotional support to combat isolation and enhance quality of life.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-medium border border-blue-100">Conversation</span>
                  <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-medium border border-blue-100">Activities</span>
                  <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-medium border border-blue-100">Social engagement</span>
                </div>
              </div>
            </div>

            {/* Personal Care */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 group">
              <div className="h-56 bg-gradient-to-br from-teal-50 via-teal-100 to-teal-200 group-hover:from-teal-100 group-hover:to-teal-300 transition-colors"></div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Personal Care</h3>
                <p className="text-gray-600 mb-5 leading-relaxed">
                  Assistance with daily living activities performed with dignity and professional care.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-teal-50 text-teal-700 px-3 py-1.5 rounded-full text-xs font-medium border border-teal-100">Grooming</span>
                  <span className="bg-teal-50 text-teal-700 px-3 py-1.5 rounded-full text-xs font-medium border border-teal-100">Dressing</span>
                  <span className="bg-teal-50 text-teal-700 px-3 py-1.5 rounded-full text-xs font-medium border border-teal-100">Mobility support</span>
                </div>
              </div>
            </div>

            {/* Medication Management */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 group">
              <div className="h-56 bg-gradient-to-br from-green-50 via-green-100 to-green-200 group-hover:from-green-100 group-hover:to-green-300 transition-colors"></div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Medication Management</h3>
                <p className="text-gray-600 mb-5 leading-relaxed">
                  Coordinated medication support ensuring safety and adherence to health protocols.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-medium border border-green-100">Reminders</span>
                  <span className="bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-medium border border-green-100">Coordination</span>
                  <span className="bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-medium border border-green-100">Safety</span>
                </div>
              </div>
            </div>

            {/* Specialized Care */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 group">
              <div className="h-56 bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 group-hover:from-purple-100 group-hover:to-purple-300 transition-colors"></div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Specialized Care</h3>
                <p className="text-gray-600 mb-5 leading-relaxed">
                  Expert care for specific conditions including dementia, recovery, and chronic management.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full text-xs font-medium border border-purple-100">Dementia care</span>
                  <span className="bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full text-xs font-medium border border-purple-100">Post-recovery</span>
                  <span className="bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full text-xs font-medium border border-purple-100">Chronic support</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-16">
            <Link
              href="/booking"
              className="inline-block bg-teal-600 text-white px-10 py-4 rounded-lg font-semibold hover:bg-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Explore All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Our Process Section */}
      <section id="process" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Our Process</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
              A structured approach to ensuring the best care for your loved ones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                title: 'Consultation',
                description: 'We assess needs, discuss preferences, and understand your family\'s unique situation.',
              },
              {
                step: '2',
                title: 'Care Plan',
                description: 'A customized care plan is created with specific goals, schedules, and medical considerations.',
              },
              {
                step: '3',
                title: 'Caregiver Match',
                description: 'We carefully select and match a qualified caregiver aligned with your needs and values.',
              },
              {
                step: '4',
                title: 'Ongoing Support',
                description: 'Regular check-ins, adjustments, and coordination with healthcare providers ensure quality care.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-teal-600 to-teal-700 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="why-us" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Why Choose Purity Care</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
              We stand out through our commitment to clinical excellence, compassion, and transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Licensed & Credentialed',
                description: 'All caregivers are thoroughly screened, trained, and certified with continuous professional development.',
              },
              {
                icon: Heart,
                title: 'Transparent Pricing',
                description: 'No hidden fees. Clear, upfront pricing with flexible payment options and insurance coordination.',
              },
              {
                icon: Clock,
                title: '24/7 Support',
                description: 'Our team is available around the clock for consultations, emergencies, and care coordination.',
              },
              {
                icon: Check,
                title: 'Healthcare Coordination',
                description: 'We work directly with doctors and specialists to ensure care aligns with medical recommendations.',
              },
              {
                icon: Award,
                title: 'Award-Winning Care',
                description: 'Recognized by healthcare organizations and families for our exceptional service standards and commitment to quality care.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                <div className="w-14 h-14 bg-teal-50 rounded-lg flex items-center justify-center mb-5 group-hover:bg-teal-100 transition-colors">
                  <item.icon className="w-7 h-7 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center pt-12 border-t border-gray-200">
            <p className="text-gray-600 mb-6 font-medium">Certifications & Accreditations:</p>
            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600">
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-600" />
                Joint Commission Accredited
              </span>
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-600" />
                Home Care Association Member
              </span>
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-600" />
                CARF Certified
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Patient & Family Testimonials</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
              Hear from families who have experienced the Purity Care difference.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            </div>
          ) : reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {reviews.map((review) => (
                <div key={review._id} className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex mb-5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 ${
                          i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  {review.text && (
                    <p className="text-gray-700 mb-6 italic leading-relaxed text-lg">&quot;{review.text}&quot;</p>
                  )}
                  <p className="text-sm text-gray-500 font-medium">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No reviews available yet. Be the first to share your experience!</p>
            </div>
          )}

          <div className="text-center mt-16">
            <Link
              href="/review"
              className="inline-block bg-teal-600 text-white px-10 py-4 rounded-lg font-semibold hover:bg-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Submit Your Review
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Start Your Care Journey Today</h2>
          <p className="text-xl mb-10 text-teal-50 max-w-3xl mx-auto leading-relaxed">
            Schedule a free consultation with our care coordinators to discuss your needs and explore how Purity Care can support your family.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/booking"
              className="bg-white text-teal-600 hover:bg-gray-50 px-10 py-4 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Schedule Consultation
            </Link>
            <a
              href="tel:+12156178614"
              className="bg-teal-800 hover:bg-teal-900 text-white px-10 py-4 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border-2 border-white/20"
            >
              Call +1 (215) 617-8614
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

