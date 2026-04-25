import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import RainBackground from './components/RainBackground';
// import Chatbot from './components/Chatbot';
// import Home from './pages/Home';
// import Detect from './pages/Detect';
// import History from './pages/History';
import About from './pages/About';

export default function App() {
  return (
    <BrowserRouter>
      <RainBackground />
      <Navbar />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Routes>
          <Route path="/"        element={<Home />} />
          <Route path="/detect"  element={<Detect />} />
          <Route path="/history" element={<History />} />
          <Route path="/about"   element={<About />} />
        </Routes>
      </div>
      <Chatbot />
    </BrowserRouter>
  );
}
