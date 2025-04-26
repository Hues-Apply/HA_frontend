import React, { useState } from 'react';
import FAQItem from '../components/FAQItem';

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const faqItems = [
    {
      question: "How do I sign up for ViviFiy?",
      answer: "Simply click on \"Sign Up\" at the top of the page, choose your preferences as an user, and follow the registration process."
    },
    {
      question: "How do I sign up to Hues Apply",
      answer: "Visit our website, click on the 'Register' button in the top-right corner, fill in your details, and follow the on-screen instructions to complete the registration process."
    },
    {
      question: "How do I sign up to Hues Apply",
      answer: "Visit our website, click on the 'Register' button in the top-right corner, fill in your details, and follow the on-screen instructions to complete the registration process."
    },
    {
      question: "How do I sign up to Hues Apply",
      answer: "Visit our website, click on the 'Register' button in the top-right corner, fill in your details, and follow the on-screen instructions to complete the registration process."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8" aria-labelledby="faq-title">
      <div className="max-w-3xl mx-auto">
        <h2 id="faq-title" className="text-3xl font-semibold text-center text-green-500 mb-12">
          Frequently Asked Questions
        </h2>
        
        <div className="divide-y divide-gray-200" role="region" aria-label="FAQ accordion">
          {faqItems.map((item, index) => (
            <FAQItem
              key={index}
              id={`faq-${index}`}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === index}
              toggleOpen={() => toggleFAQ(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
