import React from 'react';
import { 
  FaClipboardList, 
  FaUserShield, 
  FaShippingFast, 
  FaExchangeAlt, 
  FaCopyright, 
  FaCreditCard 
} from 'react-icons/fa';
import '../styles/Terms.css';

const Terms = () => {
  return (
    <div className="terms-page-wrapper">
      <div className="terms-container">
        <div className="terms-header">
          <h1 className="terms-title">Terms & Conditions</h1>
          <p className="terms-subtitle">Last Updated: April 15, 2024</p>
        </div>
        
        <div className="terms-intro">
          <p>
            Welcome to UniResell. By accessing or using our platform, you agree to be bound by these 
            Terms and Conditions and our Privacy Policy. If you do not agree with any part of these terms, 
            please do not use our platform or services.
          </p>
        </div>
        
        <section className="terms-section">
          <div className="section-header">
            <FaClipboardList className="section-icon" />
            <h2 className="section-title">General Terms of Use</h2>
          </div>
          <div className="section-content">
            <h3>Account Registration</h3>
            <p>
              To use UniResell, you must be a currently enrolled university student. You agree to provide 
              accurate information during registration, including your university email address for verification. 
              You are responsible for maintaining the confidentiality of your account.
            </p>
            
            <h3>Account Responsibilities</h3>
            <p>
              You are responsible for all activities that occur under your account. You must immediately 
              notify us of any unauthorized use of your account or any other security breach.
            </p>
            
            <h3>Prohibited Activities</h3>
            <p>
              The following activities are strictly prohibited on UniResell:
            </p>
            <ul>
              <li>Selling prohibited or illegal items</li>
              <li>Creating multiple accounts or using false information</li>
              <li>Harassing other users or engaging in abusive behavior</li>
              <li>Manipulating prices or engaging in fraudulent activities</li>
              <li>Using the platform for non-university related commercial purposes</li>
            </ul>
          </div>
        </section>
        
        <section className="terms-section">
          <div className="section-header">
            <FaUserShield className="section-icon" />
            <h2 className="section-title">Privacy & Security</h2>
          </div>
          <div className="section-content">
            <h3>Information Collection</h3>
            <p>
              We collect and store information necessary for platform operation, including your university 
              email, contact details, and transaction history. This information is used to verify your 
              student status and facilitate transactions.
            </p>
            
            <h3>Data Protection</h3>
            <p>
              We implement industry-standard security measures to protect your personal information. 
              Your data is encrypted and stored securely, and we never share sensitive information 
              with unauthorized parties.
            </p>
            
            <h3>Communication</h3>
            <p>
              By using UniResell, you agree to receive important notifications about your account, 
              transactions, and platform updates. You can manage your communication preferences 
              in your account settings.
            </p>
          </div>
        </section>
        
        <section className="terms-section">
          <div className="section-header">
            <FaShippingFast className="section-icon" />
            <h2 className="section-title">Transactions & Meetings</h2>
          </div>
          <div className="section-content">
            <h3>Safe Meeting Guidelines</h3>
            <p>
              For in-person transactions, we strongly recommend:
            </p>
            <ul>
              <li>Meeting in public places on campus during daylight hours</li>
              <li>Using designated safe trading spots if available</li>
              <li>Bringing a friend for added safety</li>
              <li>Inspecting items thoroughly before completing the transaction</li>
            </ul>
            
            <h3>Payment Safety</h3>
            <p>
              We recommend using our secure in-app payment system for all transactions. Cash 
              transactions are at your own risk and should follow our safety guidelines.
            </p>
          </div>
        </section>
        
        <section className="terms-section">
          <div className="section-header">
            <FaExchangeAlt className="section-icon" />
            <h2 className="section-title">Dispute Resolution</h2>
          </div>
          <div className="section-content">
            <h3>Buyer Protection</h3>
            <p>
              Our platform includes basic buyer protection for transactions completed through our 
              payment system. This covers items significantly different from their description 
              or not received.
            </p>
            
            <h3>Dispute Process</h3>
            <p>
              If a dispute arises, both parties should first attempt to resolve it amicably. 
              If needed, our support team can mediate the dispute based on our platform's 
              guidelines and evidence provided by both parties.
            </p>
          </div>
        </section>
        
        <section className="terms-section">
          <div className="section-header">
            <FaCreditCard className="section-icon" />
            <h2 className="section-title">Fees & Payments</h2>
          </div>
          <div className="section-content">
            <h3>Platform Fees</h3>
            <p>
              UniResell charges minimal fees to cover payment processing and platform maintenance. 
              These fees are clearly displayed before each transaction is completed.
            </p>
            
            <h3>Payment Methods</h3>
            <p>
              We accept various payment methods through our secure payment system. All payment 
              information is encrypted and processed through trusted payment partners.
            </p>
          </div>
        </section>
        
        <section className="terms-section">
          <div className="section-header">
            <FaCopyright className="section-icon" />
            <h2 className="section-title">Intellectual Property</h2>
          </div>
          <div className="section-content">
            <h3>Content Ownership</h3>
            <p>
              Users retain ownership of their content (photos, descriptions, etc.) posted on UniResell. 
              By posting content, you grant us a license to use it for platform-related purposes.
            </p>
            
            <h3>Platform Rights</h3>
            <p>
              The UniResell platform, including its design, logos, and features, is protected by 
              intellectual property laws. Users may not copy, modify, or use these elements 
              without permission.
            </p>
          </div>
        </section>
        
        <div className="terms-footer">
          <p>
            By using UniResell, you acknowledge that you have read, understood, and agree to 
            be bound by these Terms and Conditions. For questions or concerns, please contact 
            us at support@uniresell.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms; 