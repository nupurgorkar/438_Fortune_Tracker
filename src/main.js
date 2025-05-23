import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './style.css';

// Create a root and render the App component
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

    // // Mock response for local testing
    // const mockData = [
    //   { q: "The only limit to our realization of tomorrow is our doubts of today.", a: "Franklin D. Roosevelt" }
    // ];

    // // Simulate API call
    // setTimeout(() => {
    //     const quote = mockData[0].q;
    //     const author = mockData[0].a;
    //     const prefix = "Quote of the Day: ";
    //     quoteElement.textContent = `${prefix}"${quote}" - ${author}`;
    // }, 1000);

    // // Fetch the daily quote from Zen Quotes API
    // fetch('https://zenquotes.io/api/random')
    //     .then(response => response.json())
    //     .then(data => {
    //         // Extract the quote and author
    //         const quote = data[0].q;
    //         const author = data[0].a;
    //         const prefix = "Quote of the Day: ";

    //         // Update the placeholder with the quote
    //         quoteElement.textContent = `${prefix}"${quote}" - ${author}`;
    //     })
    //     .catch(error => {
    //         console.error('Error fetching the quote:', error);
    //         quoteElement.textContent = 'Failed to load the quote. Please try again later.';
    //     });


