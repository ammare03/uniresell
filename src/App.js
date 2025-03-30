import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Sell from './pages/Sell';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotFound from './pages/NotFound';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdDetail from './pages/AdDetail';
import Cart from './pages/Cart';
import ActiveAds from './pages/ActiveAds';
import OrderConfirmed from './pages/OrderConfirmed'; 
import UnableToPlaceOrder from './pages/UnableToPlaceOrder'; 

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/sell" element={<ProtectedRoute><Sell /></ProtectedRoute>} />
        <Route path="/ad/:id" element={<AdDetail />} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
        <Route path="/order-confirmed" element={<OrderConfirmed />} />
        <Route path="/unable-to-place-order" element={<UnableToPlaceOrder />} />
        <Route path="/active-ads" element={<ActiveAds />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;