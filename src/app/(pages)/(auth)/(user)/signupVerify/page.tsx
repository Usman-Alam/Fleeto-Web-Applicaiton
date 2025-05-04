"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function VerifyPage() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const email = localStorage.getItem('email');

    if (!email) {
      setError('Email not found. Please try signing up again.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/verifyOTP', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          otp, 
          email: email.toLowerCase().trim() // Normalize email
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Clear email from localStorage after successful verification
        localStorage.removeItem('email');
        router.push('/login');
      } else {
        setError(data.error || 'Verification failed');
      }
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Email Verification</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter OTP Code
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 4-digit code"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              maxLength={4}
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--accent)] text-white py-2 rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600 text-center">
          Did not receive the code? <button 
            onClick={async () => {
              try {
                const response = await fetch('/api/auth/resend-otp', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ userId }),
                });
                if (response.ok) {
                  alert('New OTP sent to your email');
                } else {
                  throw new Error('Failed to resend OTP');
                }
              } catch (err) {
                console.error(err)
                setError('Failed to resend OTP');
              }
            }}
            className="text-[var(--accent)] hover:underline"
          >
            Resend OTP
          </button>
        </p>
      </div>
    </div>
  );
}