'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Star, ArrowRight } from 'lucide-react';
import { submitReview } from '@/lib/api';

export default function ReviewPage() {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [text, setText] = useState('');
  const [service, setService] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    setLoading(true);
    try {
      await submitReview(rating, text);
      setSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error) {
      console.error('Failed to submit review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center max-w-md border border-gray-200 dark:border-gray-700">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-green-600 dark:text-green-400 text-3xl">✓</span>
          </div>
          <h2 className="text-2xl font-bold mb-2 dark:text-white">Thank You!</h2>
          <p className="text-gray-600 dark:text-gray-300">Your review has been submitted successfully.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6" style={{ fontFamily: 'cursive' }}>
            Share Your Experience
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
            Your feedback helps us provide the best possible non-medical home care and laundry services to our community.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-10 border border-gray-100 dark:border-gray-700">
          {/* Rating */}
          <div className="mb-10">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-6 uppercase tracking-wider">
              Overall Quality of Care
            </label>
            <div className="flex space-x-3 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none transform hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-12 h-12 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    } transition-all duration-200`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Service Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Service Received
              </label>
              <div className="relative">
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-lg text-gray-900 dark:text-white dark:bg-gray-700 appearance-none cursor-pointer hover:border-gray-300 dark:hover:border-gray-500 transition-colors"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23374151' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    backgroundSize: '12px',
                    paddingRight: '2.5rem'
                  }}
                >
                  <option value="" disabled className="text-gray-500">Select a service</option>
                  <option value="companion-care" className="text-gray-900">Companion Care</option>
                  <option value="personal-care" className="text-gray-900">Personal Care</option>
                  <option value="medication-management" className="text-gray-900">Medication Management</option>
                  <option value="specialized-care" className="text-gray-900">Specialized Care</option>
                  <option value="laundry" className="text-gray-900">Laundry Service</option>
                </select>
                {service && (
                  <div className="mt-2 text-sm text-teal-600 font-medium">
                    Selected: {service === 'companion-care' ? 'Companion Care' : 
                               service === 'personal-care' ? 'Personal Care' :
                               service === 'medication-management' ? 'Medication Management' :
                               service === 'specialized-care' ? 'Specialized Care' :
                               service === 'laundry' ? 'Laundry Service' : service}
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Date of Service
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-lg text-gray-900 dark:text-white dark:bg-gray-700 cursor-pointer hover:border-gray-300 dark:hover:border-gray-500 transition-colors"
                  style={{ caretColor: '#14b8a6' }}
                />
                {date && (
                  <div className="mt-2 text-sm text-teal-600 font-medium">
                    Selected: {new Date(date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Text Review */}
          <div className="mb-10">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Tell us more about your experience
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What did you appreciate about the service? Was there anything we could do better?"
              rows={6}
              className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none text-lg text-gray-900 dark:text-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 cursor-text"
              style={{ caretColor: '#14b8a6' }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || rating === 0}
            className="w-full bg-teal-600 text-white py-4 rounded-xl font-semibold hover:bg-teal-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
          >
            <span>Submit Review</span>
            <ArrowRight className="w-6 h-6" />
          </button>
        </form>

        {/* Disclaimer */}
        <div className="mt-10">
          <div className="h-1.5 bg-gradient-to-r from-teal-500 via-green-500 to-orange-500 rounded-full mb-6"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            By submitting, you agree to our Terms of Service regarding customer reviews.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}

