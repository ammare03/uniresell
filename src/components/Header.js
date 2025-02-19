import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header>
      <nav>
        <h1>UniResell</h1>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/sell">Sell</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;