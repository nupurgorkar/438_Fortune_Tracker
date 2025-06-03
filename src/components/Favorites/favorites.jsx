import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import { getFavoriteFortunes, removeFromFavorites } from '../../firebase';
import './favorites.css';

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const favoriteFortunes = await getFavoriteFortunes();
        setFavorites(favoriteFortunes);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching favorites:', error);
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <Container className="mt-4 mb-5">
      <h2 className="text-center mb-4">My Favorite Fortunes</h2>
      {favorites.length === 0 ? (
        <p className="text-center">No favorite fortunes yet. Add some from your fortune list!</p>
      ) : (
        <Row>
          {favorites.map((fortune) => (
            <Col key={fortune.id} md={4} className="mb-4">              <Card className="favorite-card">
                <Card.Body>
                  <Card.Text>{fortune.text}</Card.Text>
                  <Card.Subtitle className="text-muted mb-2">
                    {new Date(fortune.createdAt.toDate()).toLocaleDateString()}
                  </Card.Subtitle>
                  {fortune.reflection && (
                    <div className="mt-3">
                      <small className="text-muted">
                        Reflection: {fortune.reflection}
                      </small>
                    </div>
                  )}                  <div className="d-flex justify-content-end">
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 text-warning text-decoration-none"
                      onClick={async () => {
                        try {
                          await removeFromFavorites(fortune.id);
                          setFavorites(favorites.filter(f => f.id !== fortune.id));
                        } catch (error) {
                          console.error('Error removing from favorites:', error);
                        }
                      }}
                    >
                      ★ Remove from Favorites
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default Favorites;