// frontend/src/HomePage.js

import React from 'react';
import CreatorSignUp from './CreatorSignUp'; // We moved the sign-up form here

function HomePage() {
  return (
    <header className="App-header">
      <h1>Welcome to Micro-T</h1>
      <p>The easiest way to support creators with crypto.</p>
      <CreatorSignUp />
    </header>
  );
}

export default HomePage;
