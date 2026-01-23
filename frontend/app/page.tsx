'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Check, Star, Shield, Clock, Heart, Award, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getApprovedReviews, Review } from '@/lib/api';

export default function Home() {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState<string | null>(null);

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
      <section className="relative w-full h-screen md:h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://v0-website-ui-improvement-navy.vercel.app/caregiver-with-elderly-person-smiling.jpg"
            alt="Professional caregiver providing compassionate home care"
            fill
            className="w-full h-full object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
        </div>
        <div className="relative z-10 px-6 h-full flex flex-col justify-between py-12 md:py-0 md:justify-center">
          <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col justify-center">
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center gap-2 w-fit">
                <Check className="w-5 h-5 text-red-400" />
                <span className="text-xs md:text-sm font-semibold text-red-400 uppercase tracking-wide">Licensed & Certified Care</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-balance text-white">
                Premium Home Care<span className="block text-red-400">You Can Trust</span>
              </h1>
              <p className="text-base md:text-lg text-gray-100 leading-relaxed max-w-xl font-light">
                Professional, compassionate care services for your loved ones. From companion care to specialized support, we deliver peace of mind with clinical excellence.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={() => {
                    setButtonLoading('start-consultation');
                    router.push('/booking');
                  }}
                  disabled={buttonLoading === 'start-consultation'}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 h-10 rounded-md px-6 bg-blue-500 text-white hover:bg-blue-600 shadow-lg"
                >
                  {buttonLoading === 'start-consultation' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      Start Consultation
                      <span className="ml-2">→</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setButtonLoading('learn-more');
                    router.push('/#services');
                    setTimeout(() => setButtonLoading(null), 500);
                  }}
                  disabled={buttonLoading === 'learn-more'}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 border hover:text-red-400 dark:bg-white/10 dark:border-white/30 dark:hover:bg-white/20 h-10 rounded-md px-6 border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm shadow-lg"
                >
                  {buttonLoading === 'learn-more' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Learn More'
                  )}
                </button>
              </div>
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 md:gap-6 pt-6 md:pt-8 border-t border-white/20 max-w-md">
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-white">2,000+</div>
                  <p className="text-xs md:text-sm text-gray-200 mt-1">Families Served</p>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-white">15 yrs</div>
                  <p className="text-xs md:text-sm text-gray-200 mt-1">Experience</p>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-white">98%</div>
                  <p className="text-xs md:text-sm text-gray-200 mt-1">Satisfaction</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <p className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 font-semibold">delivered with clinical excellence and genuine compassion</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">Our Care Services</h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
              Comprehensive support tailored to your loved one's needs. Each service is delivered with clinical excellence and genuine compassion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Companion Care */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 group">
              <div className="relative h-56 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 dark:from-blue-900/30 dark:via-blue-800/40 dark:to-blue-700/50 group-hover:from-blue-100 group-hover:to-blue-300 dark:group-hover:from-blue-800/50 dark:group-hover:to-blue-700/60 transition-colors overflow-hidden">
                <Image
                  src="https://v0-website-ui-improvement-navy.vercel.app/elderly-person-smiling-with-caregiver-indoors.jpg"
                  alt="Companion Care - Caregiver taking care of elderly adult"
                  fill
                  className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Companion Care</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-5 leading-relaxed">
                  Social engagement and emotional support to combat isolation and enhance quality of life.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-full text-xs font-medium border border-blue-100 dark:border-blue-800">Conversation</span>
                  <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-full text-xs font-medium border border-blue-100 dark:border-blue-800">Activities</span>
                  <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-full text-xs font-medium border border-blue-100 dark:border-blue-800">Social engagement</span>
                </div>
              </div>
            </div>

            {/* Personal Care */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 group">
              <div className="relative h-56 bg-gradient-to-br from-teal-50 via-teal-100 to-teal-200 dark:from-teal-900/30 dark:via-teal-800/40 dark:to-teal-700/50 group-hover:from-teal-100 group-hover:to-teal-300 dark:group-hover:from-teal-800/50 dark:group-hover:to-teal-700/60 transition-colors overflow-hidden">
                <Image
                  src="https://v0-website-ui-improvement-navy.vercel.app/caregiver-helping-elderly-with-morning-routine.jpg"
                  alt="Personal Care - Caregiver helping elderly adult climb stairs"
                  fill
                  className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Personal Care</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-5 leading-relaxed">
                  Assistance with daily living activities performed with dignity and professional care.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-3 py-1.5 rounded-full text-xs font-medium border border-teal-100 dark:border-teal-800">Grooming</span>
                  <span className="bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-3 py-1.5 rounded-full text-xs font-medium border border-teal-100 dark:border-teal-800">Dressing</span>
                  <span className="bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-3 py-1.5 rounded-full text-xs font-medium border border-teal-100 dark:border-teal-800">Mobility support</span>
                </div>
              </div>
            </div>

            {/* Medication Management */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 group">
              <div className="relative h-56 bg-gradient-to-br from-green-50 via-green-100 to-green-200 dark:from-green-900/30 dark:via-green-800/40 dark:to-green-700/50 group-hover:from-green-100 group-hover:to-green-300 dark:group-hover:from-green-800/50 dark:group-hover:to-green-700/60 transition-colors overflow-hidden">
                <Image
                  src="https://v0-website-ui-improvement-navy.vercel.app/healthcare-professional-reviewing-medical-records.jpg"
                  alt="Medication Management - Caregiver giving medication and water to elderly adult in bed"
                  fill
                  className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Medication Management</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-5 leading-relaxed">
                  Coordinated medication support ensuring safety and adherence to health protocols.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1.5 rounded-full text-xs font-medium border border-green-100 dark:border-green-800">Reminders</span>
                  <span className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1.5 rounded-full text-xs font-medium border border-green-100 dark:border-green-800">Coordination</span>
                  <span className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1.5 rounded-full text-xs font-medium border border-green-100 dark:border-green-800">Safety</span>
                </div>
              </div>
            </div>

            {/* Specialized Care */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 group">
              <div className="relative h-56 bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 dark:from-purple-900/30 dark:via-purple-800/40 dark:to-purple-700/50 group-hover:from-purple-100 group-hover:to-purple-300 dark:group-hover:from-purple-800/50 dark:group-hover:to-purple-700/60 transition-colors overflow-hidden">
                <Image
                  src="https://v0-website-ui-improvement-navy.vercel.app/medical-professional-attending-to-patient-care.jpg"
                  alt="Specialized Care - Professional caregiver providing specialized support to adult"
                  fill
                  className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Specialized Care</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-5 leading-relaxed">
                  Expert care for specific conditions including dementia, recovery, and chronic management.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1.5 rounded-full text-xs font-medium border border-purple-100 dark:border-purple-800">Dementia care</span>
                  <span className="bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1.5 rounded-full text-xs font-medium border border-purple-100 dark:border-purple-800">Post-recovery</span>
                  <span className="bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1.5 rounded-full text-xs font-medium border border-purple-100 dark:border-purple-800">Chronic support</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-16">
            <button
              onClick={() => {
                setButtonLoading('explore-services');
                router.push('/booking');
              }}
              disabled={buttonLoading === 'explore-services'}
              className="inline-flex items-center justify-center gap-2 bg-teal-600 text-white px-10 py-4 rounded-lg font-semibold hover:bg-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {buttonLoading === 'explore-services' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Loading...
                </>
              ) : (
                'Explore All Services'
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Our Process Section */}
      <section id="process" className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">Our Process</h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
              A structured approach to ensuring the best care for your loved ones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                title: 'Consultation',
                description: 'We assess needs, discuss preferences, and understand your family\'s unique situation.',
                gradient: 'from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800',
              },
              {
                step: '2',
                title: 'Care Plan',
                description: 'A customized care plan is created with specific goals, schedules, and medical considerations.',
                gradient: 'from-purple-600 to-purple-700 dark:from-purple-700 dark:to-purple-800',
              },
              {
                step: '3',
                title: 'Caregiver Match',
                description: 'We carefully select and match a qualified caregiver aligned with your needs and values.',
                gradient: 'from-teal-600 to-teal-700 dark:from-teal-700 dark:to-teal-800',
              },
              {
                step: '4',
                title: 'Ongoing Support',
                description: 'Regular check-ins, adjustments, and coordination with healthcare providers ensure quality care.',
                gradient: 'from-green-600 to-green-700 dark:from-green-700 dark:to-green-800',
              },
            ].map((item) => (
              <div key={item.step} className="text-center group">
                <div className={`w-20 h-20 bg-gradient-to-br ${item.gradient} text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="why-us" className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">Why Choose Purity Care</h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
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
              <div key={item.title} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group">
                <div className="w-14 h-14 bg-teal-50 dark:bg-teal-900/30 rounded-lg flex items-center justify-center mb-5 group-hover:bg-teal-100 dark:group-hover:bg-teal-900/50 transition-colors">
                  <item.icon className="w-7 h-7 text-teal-600 dark:text-teal-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center pt-12 border-t border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-300 mb-6 font-medium">Certifications & Accreditations:</p>
            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600 dark:text-gray-300">
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                Joint Commission Accredited
              </span>
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                Home Care Association Member
              </span>
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                CARF Certified
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">Patient & Family Testimonials</h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
              Hear from families who have experienced the Purity Care difference.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 dark:border-teal-400"></div>
            </div>
          ) : reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {reviews.map((review) => (
                <div key={review._id} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
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
                    <p className="text-gray-700 dark:text-gray-300 mb-6 italic leading-relaxed text-lg">&quot;{review.text}&quot;</p>
                  )}
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <p>No reviews available yet. Be the first to share your experience!</p>
            </div>
          )}

          <div className="text-center mt-16">
            <button
              onClick={() => {
                setButtonLoading('submit-review');
                router.push('/review');
              }}
              disabled={buttonLoading === 'submit-review'}
              className="inline-flex items-center justify-center gap-2 bg-teal-600 text-white px-10 py-4 rounded-lg font-semibold hover:bg-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {buttonLoading === 'submit-review' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Loading...
                </>
              ) : (
                'Submit Your Review'
              )}
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 dark:from-teal-800 dark:via-teal-900 dark:to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Start Your Care Journey Today</h2>
          <p className="text-xl mb-10 text-teal-50 dark:text-teal-100 max-w-3xl mx-auto leading-relaxed">
            Schedule a free consultation with our care coordinators to discuss your needs and explore how Purity Care can support your family.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                setButtonLoading('schedule-consultation');
                router.push('/booking');
              }}
              disabled={buttonLoading === 'schedule-consultation'}
              className="inline-flex items-center justify-center gap-2 bg-white dark:bg-gray-800 text-teal-600 dark:text-teal-400 hover:bg-gray-50 dark:hover:bg-gray-700 px-10 py-4 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {buttonLoading === 'schedule-consultation' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Loading...
                </>
              ) : (
                'Schedule Consultation'
              )}
            </button>
            <a
              href="tel:+12156178614"
              className="bg-teal-800 dark:bg-teal-900 hover:bg-teal-900 dark:hover:bg-gray-800 text-white px-10 py-4 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 border-2 border-white/20 dark:border-white/10"
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

