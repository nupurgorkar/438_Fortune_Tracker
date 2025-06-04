import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './DailyQuote.css';
import { fortunes } from '../../../data/fortunes.js';
import { Card, Button, Form, InputGroup } from 'react-bootstrap';
import { addFortune, getFortunes, deleteFortune, updateFortuneReflection, addToFavorites, removeFromFavorites } from '../../firebase';
import { Link } from 'react-router-dom';

function DailyQuote() {
  const [quote, setQuote] = useState('');
  const [loading, setLoading] = useState(true);
  const [savedQuotes, setSavedQuotes] = useState([]);
  const [manualFortune, setManualFortune] = useState('');
  const [canSaveDaily, setCanSaveDaily] = useState(true);

  useEffect(() => {
    const initializeComponent = async () => {
      // Check if user has already saved a quote today
      const lastSaveDate = localStorage.getItem('lastSaveDate');
      const today = new Date().toLocaleDateString();
      setCanSaveDaily(lastSaveDate !== today);

      // Get a random fortune from the array
      const randomIndex = Math.floor(Math.random() * fortunes.length);
      setQuote(fortunes[randomIndex]);

      // Load saved fortunes from Firestore
      try {
        const loadedFortunes = await getFortunes();
        setSavedQuotes(loadedFortunes);
      } catch (error) {
        console.error('Error loading fortunes:', error);
      }

      setLoading(false);
    };

    initializeComponent();
  }, []);
  const handleSaveQuote = async () => {
    if (!canSaveDaily) return;

    try {
      console.log("Saving new fortune...");
      const newQuote = {
        text: quote,
        date: new Date().toISOString(),
        type: 'daily'
      };
      
      console.log("Fortune to save:", newQuote);
      const fortuneId = await addFortune(newQuote);
      console.log("Fortune saved successfully with ID:", fortuneId);
      
      // Refresh fortunes list
      const loadedFortunes = await getFortunes();
      setSavedQuotes(loadedFortunes);
      
      // Update localStorage and state to prevent more saves today for non-manual fortune from list
      localStorage.setItem('lastSaveDate', new Date().toLocaleDateString());
      setCanSaveDaily(false);
    } catch (error) {
      console.error('Error saving fortune:', error);
    }
  };

  // Handle manual fortune submission
  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (manualFortune.trim()) {
      try {
        const newQuote = {
          text: manualFortune,
          date: new Date().toISOString(),
          type: 'manual'
        };
        
        await addFortune(newQuote);
      
        setManualFortune('');
      } catch (error) {
        console.error('Error saving manual fortune:', error);
      }
    }
  };

  // Handle deleting a fortune
  const handleDeleteFortune = async (fortuneId) => {
    try {
      await deleteFortune(fortuneId);
      setSavedQuotes(savedQuotes.filter(quote => quote.id !== fortuneId));
    } catch (error) {
      console.error('Error deleting fortune:', error);
    }
  };

  return (
    <div>
      <header className="text-center py-5">
        <h1 className="display-4">Welcome to Fortune Tracker</h1>
        <p className="lead" style={{ paddingLeft: '20rem', paddingRight: '20rem' }}>
          Track your fortunes and reflections with ease! Click the button below to add a fortune. Once it is added, you can see the date you added it, add it to your favorites, and add a reflection to your fortune.
        </p>
        <h2 className="display-6" style={{ color: ' #241e6a' }}>
          {loading ? 'Loading fortune...' : `Fortune of the Day: "${quote}"`}
        </h2>
        
        <div className="d-flex align-items-center justify-content-center gap-3 mb-4">
          <Button 
            onClick={handleSaveQuote}
            style={{ backgroundColor: '#9e4244', borderColor: '#9e4244' }}
            disabled={!canSaveDaily}
          >
            {canSaveDaily ? 'Save Fortune' : 'Fortune Already Saved Today'}
          </Button>
          <span>... Or add a fortune manually</span>
        </div>

        <Form onSubmit={handleManualSubmit}>
          <InputGroup style={{ paddingLeft: '20rem', paddingRight: '20rem' }}>
            <Form.Control
              type="text"
              placeholder="Enter your fortune manually..."
              value={manualFortune}
              onChange={(e) => setManualFortune(e.target.value)}
              id="manualFortuneInput"
              name="manualFortune"
            />
            <Button variant="primary" type="submit" style={{ backgroundColor: '#9e4244', borderColor: '#9e4244' }}>
              Add Manual Fortune
            </Button>
          </InputGroup>
        </Form>
      </header>

      {/* Display saved quotes as cards */}
      <div className="container">
        <div className="row">
          {savedQuotes.slice(0, 3).map(savedQuote => (
            <div key={savedQuote.id} className="col-md-4 mb-4">
              <Card>
                <Card.Body>
                  <div className="d-flex justify-content-end mb-2">
                    {savedQuote.isFavorite ? (
                      <Button
                        variant="link"
                        size="sm"
                        className="p-0 text-warning text-decoration-none"
                        onClick={async () => {
                          try {
                            await removeFromFavorites(savedQuote.id);
                            setSavedQuotes(savedQuotes.map(q =>
                              q.id === savedQuote.id
                                ? { ...q, isFavorite: false }
                                : q
                            ));
                          } catch (error) {
                            console.error('Error removing from favorites:', error);
                          }
                        }}
                      >
                        ★ Remove from Favorites
                      </Button>
                    ) : (
                      <Button
                        variant="link"
                        size="sm"
                        className="p-0 text-decoration-none"
                        onClick={async () => {
                          try {
                            await addToFavorites(savedQuote.id);
                            setSavedQuotes(savedQuotes.map(q =>
                              q.id === savedQuote.id
                                ? { ...q, isFavorite: true }
                                : q
                            ));
                          } catch (error) {
                            console.error('Error adding to favorites:', error);
                          }
                        }}
                      >
                        ♡ Add to Favorites
                      </Button>
                    )}
                  </div>
                  <Card.Text>{savedQuote.text}</Card.Text>
                  <Card.Subtitle className="mb-2 text-muted">
                    {new Date(savedQuote.date).toLocaleDateString()}
                  </Card.Subtitle>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Add a reflection..."
                      value={savedQuote.reflection || ''}
                      onChange={(e) => {
                        const updatedQuote = { 
                          ...savedQuote, 
                          reflection: e.target.value,
                          isReflectionChanged: true
                        };
                        setSavedQuotes(savedQuotes.map(q => q.id === savedQuote.id ? updatedQuote : q));
                      }}
                    />
                    <div className="d-flex align-items-center mt-2">
                      <Button 
                        variant="primary"
                        size="sm"
                        className="me-2"
                        disabled={!savedQuote.isReflectionChanged}
                        onClick={async () => {
                          try {
                            await updateFortuneReflection(savedQuote.id, savedQuote.reflection);
                            setSavedQuotes(savedQuotes.map(q => 
                              q.id === savedQuote.id 
                                ? { ...q, isReflectionChanged: false }
                                : q
                            ));
                            console.log('Reflection saved successfully');
                          } catch (error) {
                            console.error('Error saving reflection:', error);
                          }
                        }}
                      >
                        Save Reflection
                      </Button>
                      {!savedQuote.isReflectionChanged && savedQuote.reflection && (
                        <small className="text-success">
                          <i className="bi bi-check-circle"></i> Saved
                        </small>
                      )}
                    </div>
                  
                  </Form.Group>

                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteFortune(savedQuote.id)}
                    style={{ marginRight: '0.5rem' }}
                  >
                    Delete
                  </Button>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
        {savedQuotes.length > 3 && (
          <div className="text-center mt-3 mb-5">
            <Link to="/archive" className="btn btn-link" style={{ color: '#241e6a'}}>
              View {savedQuotes.length - 3} more fortune{savedQuotes.length - 3 !== 1 ? 's' : ''} in Archive →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default DailyQuote;