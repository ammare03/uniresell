import React from 'react';
import { FaStore, FaUsers, FaAward, FaShoppingBag, FaHandshake, FaCode } from 'react-icons/fa';
import '../styles/About.css';

const About = () => {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1 className="about-title">About Uni<span>Resell</span></h1>
        <p className="about-subtitle">Your Campus Marketplace</p>
      </div>
      
      <section className="about-section">
        <div className="section-header">
          <FaStore className="section-icon" />
          <h2 className="section-title">Our Story</h2>
        </div>
        <div className="section-content">
          <p>UniResell was founded with a vision to create a dedicated marketplace for university students. 
          We understand that students often need to buy and sell items within their campus community, 
          and we've made that process seamless and secure.</p>
          
          <p>Our platform connects students within the same university, creating a trusted environment 
          for buying and selling textbooks, electronics, furniture, and more. We believe in fostering 
          a sustainable and economical approach to student life through peer-to-peer commerce.</p>
        </div>
      </section>
      
      <section className="about-section">
        <div className="section-header">
          <FaShoppingBag className="section-icon" />
          <h2 className="section-title">Our Platform</h2>
        </div>
        <div className="section-content">
          <p>UniResell provides a secure and user-friendly platform for students to list and discover items. 
          Our rating system ensures transparency and trust between buyers and sellers, while our 
          verification process maintains the integrity of our university-focused marketplace.</p>
          
          <p>We've designed our platform to be intuitive and efficient, allowing students to quickly 
          find what they need or list items they want to sell. With features like in-app messaging 
          and secure payment integration, we make campus commerce safe and convenient.</p>
        </div>
      </section>
      
      <section className="about-section">
        <div className="section-header">
          <FaCode className="section-icon" />
          <h2 className="section-title">Technology Stack</h2>
        </div>
        <div className="section-content">
          <p>UniResell is built using modern technologies to provide a seamless and secure trading experience:</p>
          
          <div className="tech-grid">
            <div className="tech-item">
              <h3>Frontend</h3>
              <ul>
                <li>React.js</li>
                <li>Bootstrap</li>
                <li>React Icons</li>
                <li>Axios</li>
              </ul>
            </div>
            <div className="tech-item">
              <h3>Backend</h3>
              <ul>
                <li>Node.js</li>
                <li>Express.js</li>
                <li>MongoDB</li>
                <li>JWT Authentication</li>
              </ul>
            </div>
            <div className="tech-item">
              <h3>Features</h3>
              <ul>
                <li>Real-time Chat</li>
                <li>Secure Payments</li>
                <li>Rating System</li>
                <li>Image Upload</li>
              </ul>
            </div>
            <div className="tech-item">
              <h3>Security</h3>
              <ul>
                <li>User Verification</li>
                <li>Encrypted Data</li>
                <li>Secure API</li>
                <li>Data Protection</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      <section className="about-section">
        <div className="section-header">
          <FaUsers className="section-icon" />
          <h2 className="section-title">Our Team</h2>
        </div>
        <div className="section-content team-grid">
          <div className="team-member">
            <div className="member-avatar">AE</div>
            <h3>Ammar Engineer</h3>
            <p>Full Stack Developement</p>
          </div>
          <div className="team-member">
            <div className="member-avatar">UJ</div>
            <h3>Aryan Agarwal</h3>
            <p>Backend Developement</p>
          </div>
          <div className="team-member">
            <div className="member-avatar">MJ</div>
            <h3>Priyanka Jadhav</h3>
            <p>Frontend Developement</p>
          </div>
          <div className="team-member">
            <div className="member-avatar">ML</div>
            <h3>Dhruv Kabdwal</h3>
            <p>Database Administrator</p>
          </div>
          <div className="team-member">
            <div className="member-avatar">ML</div>
            <h3>Srihari Chari</h3>
            <p>API Integration</p>
          </div>
        </div>
      </section>
      
      <section className="about-section">
        <div className="section-header">
          <FaAward className="section-icon" />
          <h2 className="section-title">Our Values</h2>
        </div>
        <div className="section-content values-grid">
          <div className="value-item">
            <h3>Trust & Safety</h3>
            <p>We prioritize creating a secure and trustworthy marketplace for our university community.</p>
          </div>
          <div className="value-item">
            <h3>Sustainability</h3>
            <p>We promote reuse and recycling through peer-to-peer commerce within universities.</p>
          </div>
          <div className="value-item">
            <h3>Community</h3>
            <p>We foster connections and support among students through our platform.</p>
          </div>
          <div className="value-item">
            <h3>Innovation</h3>
            <p>We continuously improve our platform to better serve student needs.</p>
          </div>
        </div>
      </section>
      
      <section className="about-section">
        <div className="section-header">
          <FaHandshake className="section-icon" />
          <h2 className="section-title">Join Our Community</h2>
        </div>
        <div className="section-content">
          <p>Be part of the growing UniResell community. Whether you're looking to buy, sell, or 
          connect with fellow students, our platform is here to help. Join us in making university 
          life more affordable and sustainable.</p>
          
          <div className="social-buttons">
            <a href="#" className="social-button">Instagram</a>
            <a href="#" className="social-button">Twitter</a>
            <a href="#" className="social-button">LinkedIn</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About; 