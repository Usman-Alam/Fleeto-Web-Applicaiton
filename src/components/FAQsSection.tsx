import React, { useState } from 'react';

interface FAQ {
  question: string;
  answer: string;
}

const FAQsSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs: FAQ[] = [
    {
      question: 'What is Fleeto?',
      answer: 'Fleeto is a one-stop mobile app for LUMS students to order food, groceries, and medicines from local vendors — all in one place.',
    },
    {
      question: 'How do I sign up?',
      answer: 'You can sign up by clicking the "Sign Up" button on the homepage and filling out the registration form.',
    },
    {
      question: 'Is there a free trial available?',
      answer: 'Yes, we offer a 14-day free trial for all new users.',
    },
    {
      question: 'What services does Fleeto offer?',
      answer: `
      Fleeto allows users to:
      - Browse menus from local eateries
      - Order groceries & medicines
      - Track deliveries to the LUMS main gate
      - Get dorm delivery (optional)
      - Avail discounts & offers
    `,
    },
    {
      question: 'Where will my order be delivered?',
      answer: 'By default, all orders are delivered to the LUMS main gate. However, you can also avail optional dorm delivery within the campus for an additional fee.',
    },
    {
      question: 'How do I pay for my orders?',
      answer: `
      Fleeto supports multiple payment methods:
      - In-App Wallet
      - JazzCash
      - Credit/Debit Card
      - Cash on Delivery (if supported by vendor)
    `,
    },
    {
      question: 'Are there any extra charges for using Fleeto?',
      answer: `
      - No extra charges for basic ordering.
      - Dorm delivery service may have a small fee.
      - Premium subscription users get extra benefits like:
        - Free dorm delivery
        - Discounts
        - Priority support
    `,
    },
  ];

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="w-[var(--section-width)] mt-[var(--section-top-padding)]">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-left text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <button
                className={`w-full flex justify-between items-center text-left py-4 px-6 rounded-full bg-[var(--bg2)]`}
                onClick={() => toggleFAQ(index)}
                aria-expanded={activeIndex === index}
              >
                <h5>{faq.question}</h5>
                <span
                  className={`transform transition-transform ${activeIndex === index ? 'rotate-180' : ''
                    }`}
                >
                  ▼
                </span>
              </button>
              {activeIndex === index && (
                <div className="w-full mt-2 p-6 bg-white border-t-4" style={{ borderColor: '#FF3366' }}>
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQsSection;