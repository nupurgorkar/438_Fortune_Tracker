import React, { useEffect, useState } from 'react';

const DailyQuote = () => {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY')
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setQuote(data.title);
        if(data.author){
          setAuthor(data.author);
        }
        
        setLoading(false);
      })
      .catch(() => {
        setQuote('Failed to load the quote. Please try again later.');
        setAuthor('');
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <p className="display-6" style={{ color: '#ae1a1a' }}>
        {loading ? 'Loading quote...' : `"${quote}"${author ? ` - ${author}` : ''}`}
      </p>
    </div>
  );
};

export default DailyQuote;