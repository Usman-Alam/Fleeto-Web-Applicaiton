"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Feedback {
  _id: string;
  name: string;
  category: string;
  shopName: string | null;
  rating: number;
  feedback: string;
  createdAt: string;
}

export default function FeedbacksPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch('/api/feedbackDisplay');
        if (!response.ok) {
          throw new Error('Failed to fetch feedbacks');
        }
        const data = await response.json();
        setFeedbacks(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load feedbacks');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent)]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="w-[var(--section-width)] max-w-[var(--section-max-width)] mt-[var(--page-top-padding)] px-4 md:px-8 lg:px-0 mx-auto mb-16">
      <h1 className="text-[32px] font-bold mb-8">Customer Feedbacks</h1>

      <div className="grid grid-cols-1 gap-6">
        {feedbacks.map((feedback) => (
          <div 
            key={feedback._id}
            className="bg-white rounded-[16px] p-6 shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">{feedback.name}</h3>
                <p className="text-gray-600 text-sm">
                  {new Date(feedback.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, index) => (
                  <span
                    key={index}
                    className={`text-xl ${
                      index < feedback.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <span className="inline-block px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                {feedback.category}
                {feedback.shopName && ` • ${feedback.shopName}`}
              </span>
            </div>

            <p className="text-gray-700 whitespace-pre-line">{feedback.feedback}</p>
          </div>
        ))}

        {feedbacks.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No feedbacks submitted yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}