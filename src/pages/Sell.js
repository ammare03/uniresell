import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Sell.css';

function Sell() {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    title: '',
    description: '',
    price: '',
    image: ''
  });

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    // For simplicity, we simulate an image upload using a temporary URL.
    setProduct({ ...product, image: URL.createObjectURL(e.target.files[0]) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    // Submit product details (integrate with your backend as needed)
    console.log('Product submitted:', product);
    alert('Product uploaded successfully!');
  };

  if (!isLoggedIn) {
    return (
      <main className="sell">
        <h2>You must be logged in to sell products.</h2>
      </main>
    );
  }

  return (
    <main className="sell">
      <section className="sell-section">
        <h2>Sell Your Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Product Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={product.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Product Description</label>
            <textarea
              id="description"
              name="description"
              value={product.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input
              type="number"
              id="price"
              name="price"
              value={product.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="image">Product Image</label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleFileChange}
              accept="image/*"
              required
            />
          </div>
          <div className="form-group">
            <button type="submit">Upload Product</button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default Sell;