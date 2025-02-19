import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Signup.css';

function Signup() {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();
  const [details, setDetails] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dummy signup process
    signup(details);
    navigate('/');
  };

  return (
    <main className="signup">
      <section className="signup-section">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={details.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={details.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={details.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <button type="submit">Sign Up</button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default Signup;