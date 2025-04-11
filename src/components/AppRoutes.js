import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Sell from '../pages/Sell';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import NotFound from '../pages/NotFound';
import ProtectedRoute from './ProtectedRoute';
import AdDetail from '../pages/AdDetail';
import Cart from '../pages/Cart';
import ActiveAds from '../pages/ActiveAds';
import OrderConfirmed from '../pages/OrderConfirmed';
import UnableToPlaceOrder from '../pages/UnableToPlaceOrder';
import UserProfile from '../pages/UserProfile';
import UserDetails from '../pages/UserDetails';
import About from '../pages/About';
import HowItWorks from '../pages/HowItWorks';
import FAQ from '../pages/FAQ';
import Contact from '../pages/Contact';
import Terms from '../pages/Terms';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/sell" element={
        <ProtectedRoute>
          <Sell />
        </ProtectedRoute>
      } />
      <Route path="/ad/:id" element={<AdDetail />} />
      <Route path="/cart" element={
        <ProtectedRoute>
          <Cart />
        </ProtectedRoute>
      } />
      <Route path="/active-ads" element={<ActiveAds />} />
      <Route path="/order-confirmed" element={
        <ProtectedRoute>
          <OrderConfirmed />
        </ProtectedRoute>
      } />
      <Route path="/unable-to-place-order" element={
        <ProtectedRoute>
          <UnableToPlaceOrder />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <UserProfile />
        </ProtectedRoute>
      } />
      <Route path="/user/:abcId" element={<UserDetails />} />
      <Route path="/about" element={<About />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes; 