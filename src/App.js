import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import AppRoutes from './components/AppRoutes';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}

export default App;