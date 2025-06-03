import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Form, Button } from 'react-bootstrap';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { updateFortuneReflection, addToFavorites, removeFromFavorites } from '../../firebase';
import './archive.css';

function Archive() {
  const [fortunes, setFortunes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFortunes = async () => {
      try {
        const fortunesRef = collection(db, 'fortunes');
        const q = query(fortunesRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const fortunesList = querySnapshot.docs.map(doc => {
          const data = doc.data();
          console.log("Fortune data:", data);
          return {
            id: doc.id,
            ...data,
            date: data.createdAt?.toDate?.() 
              ? new Date(data.createdAt.toDate()).toLocaleDateString()
              : new Date().toLocaleDateString()
          };
        });
        
        console.log("Processed fortunes:", fortunesList);
        setFortunes(fortunesList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching fortunes:", error);
        setLoading(false);
      }
    };

    fetchFortunes();
  }, []);

  const handleReflectionChange = (fortuneId, newReflection) => {
    setFortunes(fortunes.map(fortune => 
      fortune.id === fortuneId 
        ? { ...fortune, reflection: newReflection, isReflectionChanged: true }
        : fortune
    ));
  };

  const handleSaveReflection = async (fortuneId) => {
    const fortune = fortunes.find(f => f.id === fortuneId);
    if (!fortune) return;

    try {
      await updateFortuneReflection(fortuneId, fortune.reflection);
      setFortunes(fortunes.map(f => 
        f.id === fortuneId 
          ? { ...f, isReflectionChanged: false }
          : f
      ));
    } catch (error) {
      console.error("Error saving reflection:", error);
    }
  };

  console.log("Current fortunes state:", fortunes);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <Container fluid className="mt-4">
      <h2 className="text-center mb-4">Fortune Archive</h2>
      {fortunes.length === 0 ? (
        <p className="text-center">No fortunes found. Try adding some first!</p>
      ) : (
        <Row>          <Col md={6}>
            <h3 className="mb-3 archive-section-header">Fortunes</h3>            {fortunes.map((fortune) => (<Card key={fortune.id} className="archive-fortune-card">
                <Card.Body>
                  <div className="d-flex justify-content-end mb-2">
                    {fortune.isFavorite ? (
                      <Button
                        variant="link"
                        size="sm"
                        className="p-0 text-warning text-decoration-none"
                        onClick={async () => {
                          try {
                            await removeFromFavorites(fortune.id);
                            setFortunes(fortunes.map(f =>
                              f.id === fortune.id
                                ? { ...f, isFavorite: false }
                                : f
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
                        className="p-0 text-light text-decoration-none"
                        onClick={async () => {
                          try {
                            await addToFavorites(fortune.id);
                            setFortunes(fortunes.map(f =>
                              f.id === fortune.id
                                ? { ...f, isFavorite: true }
                                : f
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
                  <Card.Text className="archive-fortune-text">{fortune.text}</Card.Text>
                  <Card.Text className="archive-date">
                    {fortune.date}
                  </Card.Text>
                </Card.Body>
              </Card>
            ))}
          </Col>          <Col md={6}>
            <h3 className="mb-3 archive-section-header">Reflections</h3>
            {fortunes.map((fortune) => (<Card key={fortune.id} className="archive-reflection-card">
                <Card.Body>
                  <Form.Group>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      placeholder="Add your reflection here..."
                      value={fortune.reflection || ''}
                      onChange={(e) => handleReflectionChange(fortune.id, e.target.value)}
                    />
                  </Form.Group>
                  <div className="d-flex align-items-center mt-2">
                    <Button
                      variant="primary"
                      size="sm"
                      className="me-2"
                      style={{ backgroundColor: '#241e6a', borderColor: '#241e6a' }}
                      disabled={!fortune.isReflectionChanged}
                      onClick={() => handleSaveReflection(fortune.id)}
                    >
                      Save Reflection
                    </Button>
                    {!fortune.isReflectionChanged && fortune.reflection && (
                      <small className="text-success">
                        <i className="bi bi-check-circle"></i> Saved
                      </small>
                    )}
                  </div>
                </Card.Body>
              </Card>
            ))}
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default Archive;