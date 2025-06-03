import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DailyQuote from './components/DailyQuote/DailyQuote.jsx';
import Navbar from './components/Navbar/navbar.jsx';
import Archive from './components/Archive/archive.jsx';
import Favorites from './components/Favorites/favorites.jsx';


const Home = () => (
  <div>
    <DailyQuote />
  </div>
);

const App = () => (
  <Router>
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </div>
  </Router>
);

export default App;
