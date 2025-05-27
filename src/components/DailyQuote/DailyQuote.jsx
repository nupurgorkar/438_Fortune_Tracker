import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './DailyQuote.css';
import { fortunes } from '../../../data/fortunes.js';
import { Card, Button, Form, InputGroup } from 'react-bootstrap';

function DailyQuote() {
  const [quote, setQuote] = useState('');
  const [loading, setLoading] = useState(true);
  const [savedQuotes, setSavedQuotes] = useState([]);
  const [savedDate, setSavedDate] = useState(new Date().toLocaleDateString());
  const [manualFortune, setManualFortune] = useState('');

  useEffect(() => {
    // Get a random fortune from the array
    const randomIndex = Math.floor(Math.random() * fortunes.length);
    setQuote(fortunes[randomIndex]);
    setLoading(false);
  }, []);

  const handleSaveQuote = () => {
    const newQuote = {
      text: quote,
      date: savedDate,
      id: Date.now()
    };
    setSavedQuotes([...savedQuotes, newQuote]);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualFortune.trim()) {
      const newQuote = {
        text: manualFortune,
        date: savedDate,
        id: Date.now()
      };
      setSavedQuotes([...savedQuotes, newQuote]);
      setManualFortune(''); 
    }
  };

  return (
    <div>
      <header className="text-center py-5">
        <h1 className="display-4">Welcome to Fortune Tracker</h1>
        <h2 className="display-6" style={{ color: ' #241e6a' }}>
          {loading ? 'Loading fortune...' : `Fortune of the Day: "${quote}"`}
        </h2>
        <p className="lead" style={{ paddingLeft: '20rem', paddingRight: '20rem' }}>
          Track your fortunes and reflections with ease! Click the button below to add a fortune. Once it is added, you can see the date you added it, add it to your favorites, and add a reflection to your fortune.
        </p>
        <Button variant="primary" onClick={handleSaveQuote} className="mb-4">
          Save Fortune
        </Button>


        <Form onSubmit={handleManualSubmit}>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Enter your fortune manually..."
              value={manualFortune}
              onChange={(e) => setManualFortune(e.target.value)}
            />
            <Button variant="primary" type="submit">
              Add Manual Fortune
            </Button>
          </InputGroup>
        </Form>
      </header>

     
      {/* Display saved quotes as cards */}
      <div className="container">
        <div className="row">
          {savedQuotes.map(savedQuote => (
            <div key={savedQuote.id} className="col-md-4 mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>Fortune from {savedQuote.date}</Card.Title>
                  <Card.Text>{savedQuote.text}</Card.Text>
                  <Button variant="outline-secondary" size="sm">
                    Add to Favorites
                  </Button>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DailyQuote;