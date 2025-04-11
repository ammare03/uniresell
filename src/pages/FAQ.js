import React, { useState } from 'react';
import { Container, Accordion } from 'react-bootstrap';
import '../styles/FAQ.css';

function FAQ() {
  const faqs = [
    {
      question: "How do I create an account?",
      answer: "To create an account, click on the 'Sign Up' button and register using your university email address. You'll need to verify your email before you can start using the platform."
    },
    {
      question: "Is it free to list items?",
      answer: "Yes, listing items on UniResell is completely free. We don't charge any fees for posting ads or connecting with buyers/sellers."
    },
    {
      question: "How do I list an item for sale?",
      answer: "After logging in, click on the 'Sell' button in the navigation menu. Fill out the item details form with a title, description, price, category, and photos. Then click 'Post Ad' to list your item."
    },
    {
      question: "How does the rating system work?",
      answer: "After completing a transaction, both buyers and sellers can rate each other. Ratings are based on factors like communication, item accuracy, and overall experience. These ratings help build trust in the community."
    },
    {
      question: "Is it safe to buy/sell on UniResell?",
      answer: "Yes, UniResell is designed with safety in mind. We verify all users through their university email addresses, provide a rating system, and recommend safe meeting spots on campus for transactions."
    },
    {
      question: "What items are not allowed on UniResell?",
      answer: "Prohibited items include illegal goods, weapons, drugs, alcohol, counterfeit items, and adult content. Please review our Terms of Service for a complete list."
    },
    {
      question: "How do I contact a seller?",
      answer: "When viewing an item, you can use the contact button to send a message to the seller. All communication is kept within the platform for safety and record-keeping."
    },
    {
      question: "What payment methods are accepted?",
      answer: "UniResell supports various payment methods including credit/debit cards and digital wallets. For in-person transactions, cash payments are also accepted."
    },
    {
      question: "What should I do if there's a problem with a transaction?",
      answer: "If you experience any issues, first try to resolve them with the other party through our messaging system. If that doesn't work, contact our support team through the 'Contact Us' page."
    },
    {
      question: "Can I edit or delete my listings?",
      answer: "Yes, you can edit or delete your listings at any time through your profile dashboard. Simply find the listing and click the edit or delete button."
    }
  ];

  return (
    <div className="faq-page-wrapper">
      <div className="faq-page">
        <Container>
          <div className="faq-container">
            <section className="faq-header">
              <h1>Frequently Asked Questions</h1>
              <p className="lead">
                Find answers to common questions about using UniResell. Can't find what you're looking for?
                Visit our <a href="/contact">Contact page</a>.
              </p>
            </section>

            <section className="faq-content">
              <Accordion>
                {faqs.map((faq, index) => (
                  <Accordion.Item key={index} eventKey={index.toString()}>
                    <Accordion.Header>{faq.question}</Accordion.Header>
                    <Accordion.Body>{faq.answer}</Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </section>

            <section className="faq-footer">
              <h3>Still have questions?</h3>
              <p>
                Our support team is here to help. Contact us through our{' '}
                <a href="/contact">support page</a> and we'll get back to you as soon as possible.
              </p>
            </section>
          </div>
        </Container>
      </div>
    </div>
  );
}

export default FAQ; 