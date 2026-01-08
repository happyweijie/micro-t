import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import our components
import HomePage from './HomePage'; // We'll create this simple component next
import TippingPage from './TippingPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Route 1: The main homepage */}
          <Route path="/" element={<HomePage />} />

          {/* Route 2: The dynamic tipping page */}
          <Route path="/:username" element={<TippingPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
