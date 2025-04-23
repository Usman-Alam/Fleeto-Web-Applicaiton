"use client";

import { useState, useEffect } from 'react';
import FAQ from './FAQ';

interface FAQItem {
  _id: string;
  question: string;
  answer: string;
}

const FAQsSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await fetch('/api/faqsDisplay');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch FAQs');
        }

        setFaqs(data.data);
      } catch (error) {
        console.error('Error fetching FAQs:', error);
        setError('Failed to load FAQs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  if (isLoading) {
    return (
      <section className="w-[var(--section-width)] max-w-[var(--section-max-width)] mt-[var(--page-top-padding)] px-4 md:px-8 lg:px-0">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[var(--heading)]">Frequently Asked Questions</h2>
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent)]"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-[var(--section-width)] max-w-[var(--section-max-width)] mt-[var(--page-top-padding)] px-4 md:px-8 lg:px-0">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[var(--heading)]">Frequently Asked Questions</h2>
          <div className="text-center text-red-500 py-12">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-[var(--section-width)] max-w-[var(--section-max-width)] mt-[var(--page-top-padding)] px-4 md:px-8 lg:px-0">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[var(--heading)]">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQ
              key={faq._id}
              question={faq.question}
              answer={faq.answer}
              isOpen={activeIndex === index}
              onClick={() => toggleFAQ(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQsSection;