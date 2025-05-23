import React from 'react';
import AddFortune from './components/addFortune.jsx';
import Navbar from './components/Navbar/navbar.jsx';
import DailyQuote from './components/DailyQuote/DailyQuote.jsx';

const App = () => (
    <div>
        <Navbar />
        <h1>react is rendering</h1>
        <DailyQuote />
        <AddFortune />
    </div>
);


export default App;
